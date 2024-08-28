const { makeDb } = require('./db-operator');
const { Id } = require('../Id');
const logger = require('../logger/logger');
const { dbConnector, closeConnectionPool } = require('./db-connection-manager');

const dbOperator = makeDb({ dbConnector, Id, logger });

module.exports = {
  dbOperator,
  closeConnectionPool,
};
