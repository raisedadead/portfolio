const rewireStyledComponents = require('react-app-rewire-styled-components')

module.exports = (config, env) => {
  config = rewireStyledComponents(config, env)
  return config
}
