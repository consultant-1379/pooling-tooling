const express = require('express');
const events = require('events');
const cors = require('cors');

const server = express();
const httpServer = require('http').Server(server);

const io = require('socket.io')(httpServer, {
  path: '/socket.io',
});

const passport = require('passport');
const logger = require('./logger/logger');
const exporter = require('./exporter');
require('./config/config.js');

if (process.env.NODE_ENV !== 'TEST' && process.env.NODE_ENV !== 'TEST_LOCAL_MONGO') {
  /* eslint-disable global-require */
  require('./queue/event-handlers/request-queue.event');
  require('./rptCron/event-handlers/schedule-auto-refresh-cron.event');
  require('./rptCron/event-handlers/schedule-auto-remove-old-requests-cron-event');
  require('./rptCron/event-handlers/schedule-auto-trigger-cron.event');
  /* eslint-enable global-require */
}

const requestsRoutes = require('./api/requests/routes');
const testEnvironmentRoutes = require('./api/test-environments/routes');
const pipelineFunctionsRoutes = require('./api/pipeline-functions/routes');
const uiFunctionsRoutes = require('./api/ui-functions/routes');
const poolsRoutes = require('./api/pools/routes');
const schedulesRoutes = require('./api/schedules/routes');
const authRoutes = require('./api/auth/routes');

const { closeConnectionPool } = require('./data-access');

const { PORT } = process.env;

require('./passport-config');

server.use(passport.initialize());

server.use(exporter.requestCounters);
server.use(exporter.responseCounters);
exporter.injectMetricsRoute(server);
exporter.startCollection();

server.use(express.json());
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers',
  );
  res.header(
    'Access-Control-Allow-Methods',
    'DELETE, HEAD, GET, POST, PUT, OPTIONS',
  );
  next();
});
server.use(cors());

server.use('/requests', requestsRoutes);
server.use('/test-environments', testEnvironmentRoutes);
server.use('/pipeline-functions', pipelineFunctionsRoutes);
server.use('/ui-functions', uiFunctionsRoutes);
server.use('/pools', poolsRoutes);
server.use('/schedules', schedulesRoutes);
server.use('/auth', authRoutes);

server.set('port', PORT);

const middlewares = require('./middlewares');

server.use(middlewares.notFoundHandler);
server.use(middlewares.errorHandler);
server.use(middlewares.validateRequest);

io.on('connection', () => {
  const eventEmitter = new events.EventEmitter();
  eventEmitter.on('testEnvironmentEvent', (msg) => {
    io.emit('testEnvironmentUpdate', msg);
  });
  eventEmitter.on('poolEvent', (msg) => {
    io.emit('poolUpdate', msg);
  });
  eventEmitter.on('scheduleEvent', (msg) => {
    io.emit('scheduleUpdate', msg);
  });

  exports.emitter = eventEmitter;
});

httpServer.listen(PORT, () => {
  console.log(`HTTP Server listening on port ${PORT}.`);
});

const handleShutdown = () => {
  httpServer.close(async (err) => {
    if (err) {
      const loggingTags = {
        service: 'Server',
        action: 'handleShutdown',
      };
      logger.error(loggingTags, `Error while shutting down the server: ${err}`);
      process.exit(1);
    }
    await closeConnectionPool();
    process.exit(0);
  });
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

process.on('uncaughtException', (err) => {
  const loggingTags = {
    service: 'Server',
    action: 'Uncaught Exception',
  };
  logger.error(loggingTags, `Uncaught Exception: ${err}`);
  handleShutdown();
});

process.on('unhandledRejection', (reason) => {
  const loggingTags = {
    service: 'Server',
    action: 'Unhandled Promise Rejection',
  };
  logger.error(loggingTags, `Unhandled Promise Rejection: ${reason}`);
  handleShutdown();
});

module.exports = httpServer;
module.exports.io = io;
