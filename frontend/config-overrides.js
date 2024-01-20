const webpack = require('webpack');

module.exports =function override(config,env) { 
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'crypto': require.resolve('crypto-browserify')
  }
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process : "process/browser"
    })
  ])
  return config
};