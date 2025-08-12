import path from 'node:path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackAssetsManifest } from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { webpackConfig } from 'aspnet-buildtools';

export default {
  ...webpackConfig(),
  output: {
    path: path.resolve(import.meta.dirname, 'wwwroot/dist'),
    filename: '[name]-[contenthash].js',
    publicPath: '/dist/',
    // Clean the output directory before build.
    clean: true,
  },
  // Enable source maps
  devtool: 'source-map',
  optimization: {
    // Extend minimizer with CSS minification.
    minimizer: [new CssMinimizerPlugin(), '...'],
    splitChunks: {
      cacheGroups: {
        // Extract all code from node_modules into separate Vendor bundle.
        defaultVendors: {
          // Default Webpack configuration.
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          // Custom configuration addition.
          name: 'Vendor',
          chunks: 'all',
        },
      }
    }
  },
  module: {
    rules: [
      {
        // Extract CSS to separate files: Part 1
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
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
};
