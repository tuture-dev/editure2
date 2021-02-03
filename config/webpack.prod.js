'use strict';

const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const postcssNormalize = require('postcss-normalize');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');

const appPackageJson = require(paths.appPackageJson);

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = merge(common, {
  mode: 'production',
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            laoder: MiniCssExtractPlugin.loader,
            options: paths.publicUrlOrPath.startsWith('.')
              ? { publicPath: '../../' }
              : {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: false,
            },
          },
          {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                  // Adds PostCSS Normalize as the reset css with default options,
                  // so that it honors browserslist config in package.json
                  // which in turn let's users customize the target behavior as per their needs.
                  postcssNormalize(),
                ],
                ident: 'postcss',
                sourceMap: shouldUseSourceMap,
              },
            },
          },
        ],
      },
    ],
  },
  output: {
    path: paths.appBuild,
    pathinfo: false,
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    publicPath: paths.publicUrlOrPath,
    devtoolModuleFilenameTemplate: (info) =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
    jsonpFunction: `webpackJsonp${appPackageJson.name}`,
    globalObject: 'this',
  },
  optimization: {
    minimize: true,
  },
  resolve: {
    alias: {
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
  ],
});
