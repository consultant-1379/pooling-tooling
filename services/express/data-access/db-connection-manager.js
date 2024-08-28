const mongodb = require('mongodb');
const { createPool } = require('generic-pool');
const logger = require('../logger/logger');

const { MongoClient } = mongodb;

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE_NAME;

const poolConfig = {
  max: 20,
  min: 4,
  acquireTimeoutMillis: 30000,
};

let connectionCount = 0;

const connectionPool = createPool(
  {
    create: async () => {
      connectionCount += 1;
      if (connectionCount >= poolConfig.max) {
        const loggingTags = {
          service: 'MongoDB Connection',
          action: 'createConnection',
          actionParameters: { connectionCount },
        };
        logger.error(loggingTags, 'Maximum connection limit reached!');
      }
      const client = new MongoClient(url, { useNewUrlParser: true });
      await client.connect();
      return client.db(dbName);
    },
    destroy: async (db) => {
      connectionCount -= 1;
      await db.client.close();
    },
  },
  poolConfig,
);

async function acquireConnectionWithTimeout() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Connection acquisition timeout exceeded.'));
    }, poolConfig.acquireTimeoutMillis);

    connectionPool.acquire().then((connection) => {
      clearTimeout(timer);
      resolve(connection);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function dbConnector() {
  try {
    const db = await acquireConnectionWithTimeout();
    const dbWithRelease = {
      db,
      release: () => connectionPool.release(db),
    };
    return dbWithRelease;
  } catch (error) {
    const loggingTags = {
      service: 'MongoDB Connection',
      action: 'dbConnector',
      actionParameters: {},
    };
    logger.error(loggingTags, `Error acquiring database connection from the pool: ${error.message}`);
  }
}

const closeConnectionPool = async () => {
  await connectionPool.drain();
  await connectionPool.clear();
};

module.exports = {
  dbConnector,
  closeConnectionPool,
};
