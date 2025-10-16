import type webpack from 'webpack';
import 'webpack-dev-server';
import path from 'node:path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackAssetsManifest } from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
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
  optimization: {
    // Extend minimizer with CSS minification.
    minimizer: [new CssMinimizerPlugin(), '...'],
  },
  module: {
    rules: [
      {
        // Extract CSS to separate files: Part 1
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
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
