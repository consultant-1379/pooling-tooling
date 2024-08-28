const app = require('express')();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./pooling-tooling.yaml');
const SWAGGER_DOC_PORT = 3000;

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(SWAGGER_DOC_PORT);
