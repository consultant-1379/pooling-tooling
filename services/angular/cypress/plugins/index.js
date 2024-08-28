const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = (on, config) => {
  config.baseUrl = config.env.baseUrl || config.baseUrl;
  on('file:preprocessor', cucumber())
  require('@cypress/code-coverage/task')(on, config)

  return config
}
