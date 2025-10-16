import type webpack from 'webpack';
import 'webpack-dev-server';
import path from 'node:path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackAssetsManifest } from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { webpackConfig } from 'aspnet-buildtools';

export default {
  ...webpackConfig,
  output: {
    path: path.resolve(import.meta.dirname, 'wwwroot/dist'),
    filename: '[name]-[contenthash].js',
    publicPath: '/dist/',
    // Clean the output directory before build.
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.ts'],
    // Support @ alias in TypeScript files.
    plugins: [new TsconfigPathsPlugin()],
  },
  devtool: 'source-map',
  optimization: {
    // Extend minimizer with CSS minification.
    minimizer: [new CssMinimizerPlugin(), '...'],
    splitChunks: {
      cacheGroups: {
        // Extract all code from node_modules into separate Vendor bundle.
        defaultVendors: {
          // Default configuration.
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          // Custom configuration.
          name: 'Vendor',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        // Extract CSS to separate files: Part 1
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                // These deprecations happen inside Bootstrap 5 files. Nothing we can do until we update Bootstrap.
                silenceDeprecations: [
                  'color-functions',
                  'global-builtin',
                  'import',
                ],
              },
            }
          }
        ],
      },
      {
        // Support for TypeScript files.
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // Extract CSS to separate files: Part 2
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    // Generate manifest for use with AssetManager.
    new WebpackAssetsManifest(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    static: false,
    port: 9000,
    hot: true,
  }
} satisfies webpack.Configuration;
