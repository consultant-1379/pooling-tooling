const Bunyan = require('bunyan');
const ElasticSearch = require('bunyan-elasticsearch');
const Mask = require('./mask');

let logger;

if (process.env.NODE_ENV === 'PROD' || process.env.NODE_ENV === 'STAG') {
  const indexPatternToUse = (process.env.NODE_ENV === 'PROD') ? '[express-logs-]YYYY.MM.DD' : '[express-logs-staging-]YYYY.MM.DD';

  const user = process.env.SECURE_RIGEL_ELASTICSEARCH_HOST_USER;
  const password = process.env.SECURE_RIGEL_ELASTICSEARCH_HOST_USER_PASSWORD;
  const host = process.env.SECURE_RIGEL_ELASTICSEARCH_HOST.replace('https://', '');

  const elasticsearchHost = `https://${user}:${password}@${host}`;

  const secureRigelKibanaEsStream = new ElasticSearch({
    indexPattern: indexPatternToUse,
    host: elasticsearchHost,
    type: '_doc',
    keepAlive: true,
  });

  secureRigelKibanaEsStream.on('error', (err) => {
    console.log('Elasticsearch Stream Error (Secure Rigel):', err.stack);
  });

  logger = Bunyan.createLogger({
    name: 'Express Logs',
    streams: [
      { stream: process.stdout },
      { stream: secureRigelKibanaEsStream },
    ],
    serializers: Bunyan.stdSerializers,
    source: `RPT ${process.env.NODE_ENV}`,
  });
} else {
  logger = Bunyan.createLogger({
    name: 'Express Logs',
    streams: [
      { stream: process.stdout },
    ],
  });
}

module.exports = new Mask(logger);
