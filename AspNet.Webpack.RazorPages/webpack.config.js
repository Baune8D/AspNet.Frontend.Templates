import path from 'node:path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackAssetsManifest } from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { webpackConfig } from 'aspnet-buildtools';

export default (() => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const publicPath = '/dist/';

  // Use normal name in development for easy debugging.
  // Use hash as a filename in production for cache busting.
  const filename = (ext) => (isDevelopment
      ? `[name].${ext}`
      : `[contenthash].min.${ext}`);

  const config = {
    ...webpackConfig(),
    output: {
      path: path.resolve(import.meta.dirname, 'wwwroot/dist'),
      filename: filename('js'),
      publicPath,
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
        filename: filename('css'),
      }),
      // Generate manifest for use with AssetManager.
      new WebpackAssetsManifest({
        customize: (entry) => {
          const key = entry.key.toLowerCase();
          // Only include CSS and JS files in the manifest.
          if (!key.endsWith('.css') && !key.endsWith('.js')) {
            return false;
          }
          return entry;
        },
      }),
    ],
  };

  if (isDevelopment) {
    config.devServer = {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      devMiddleware: {
        publicPath,
      },
      static: false,
      allowedHosts: 'all',
      port: process.env.PORT,
      hot: true,
    };
  } else {
    // Cleanup output folder on every build.
    config.plugins.push(new CleanWebpackPlugin());
  }

  return config;
})();
