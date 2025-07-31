import path from 'node:path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackAssetsManifest } from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { webpackConfig } from 'aspnet-buildtools';

export default (() => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const output = path.resolve(import.meta.dirname, 'wwwroot/dist');
  const manifest = 'manifest.json';
  const publicPath = '/dist/';
  
  const filename = (ext) => {
    return isDevelopment
      ? `[name].${ext}`
      : `[name].min.${ext}?v=[contenthash]`;
  };
  
  const config = {
    ...webpackConfig(import.meta.dirname),
    output: {
      publicPath,
      filename: filename('js'),
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin(), '...'],
      splitChunks: {
        cacheGroups: {
          // Extract all code from node_modules into separate Vendor bundle.
          defaultVendors: {
            name: 'Vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: 90,
            minSize: 0,
          },
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: filename('css'),
      }),
      new WebpackAssetsManifest({
        output: isDevelopment ? manifest : path.resolve(output, manifest),
        customize: (entry) => {
          const { key } = entry;
          if (key === 'runtime.js') {
            return entry;
          }
          const lowerKey = key.toLowerCase();
          if (!lowerKey.endsWith('.css') && !lowerKey.endsWith('.js')) {
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
    config.output.path = output;
    config.plugins.push(new CleanWebpackPlugin());
  }

  return config;
})();
