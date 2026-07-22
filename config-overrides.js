const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url'),
    buffer: require.resolve('buffer'),
    process: false,
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': require.resolve('process/browser.js'),
    // @metamask/sdk (a RainbowKit dependency) imports React Native storage
    // that doesn't exist on web; without this the build emits a module-not-found warning
    '@react-native-async-storage/async-storage': false,
    // Forces the ESM build of openapi-fetch: the CJS one breaks esbuild's interop
    // inside @metamask/sdk-analytics ("import_openapi_fetch.default is not a function")
    'openapi-fetch$': require.resolve('openapi-fetch/dist/index.js'),
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};
