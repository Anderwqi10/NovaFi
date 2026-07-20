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
    // @metamask/sdk (dep de RainbowKit) importa almacenamiento de React Native
    // que no existe en web; sin esto el build emite un warning de módulo no encontrado
    '@react-native-async-storage/async-storage': false,
    // Fuerza el build ESM de openapi-fetch: el CJS rompe el interop de esbuild
    // dentro de @metamask/sdk-analytics ("import_openapi_fetch.default is not a function")
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
