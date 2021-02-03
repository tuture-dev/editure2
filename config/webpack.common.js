'use strict';

const webpack = require('webpack');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleScopePlugin = require('../utils/ModuleScopePlugin');

const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

// We will provide `paths.publicUrlOrPath` to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
// Get environment variables to inject into our app.
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

module.exports = {
  entry: paths.appIndexJs,
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: 'My First React App',
      template: './public/index.html',
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV is set to production
    // during a production build.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
  ],
  resolve: {
    // This allows you to set a fallback for where webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebook/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      modules.additionalModulePaths || [],
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebook/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: paths.moduleFileExtensions
      .map((ext) => `.${ext}`)
      .filter((ext) => useTypeScript || !ext.includes('ts')),
    alias: {
      ...(modules.webpackAliases || {}),
    },
  },
};
