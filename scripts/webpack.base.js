const path = require('path');
const { resolve, getEntryTemplate, getModuleFederationPlugins } = require('./utils');
const config = require('./config');
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');

module.exports = function ({ production, mode, packages }) {
  const baseConf = {
    name: `${mode}-compiler`,
    stats: 'errors-warnings',
    output: {
      filename: `${config.staticPath}/js/[name].[contenthash:8].js`,
      path: path.resolve(__dirname, `../dist`),
      publicPath: `/`,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
      mainFiles: ['index', 'main'],
      extensions: ['.ts', '.tsx', '.scss', 'json', '.js'],
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        build: [resolve('scripts/')],
      },
      cacheDirectory: resolve('.cache/'),
    },
    snapshot: {
      // 如果希望修改node_modules下的文件时对应的缓存可以失效，可以将此处的配置改为 managedPaths: []
      managedPaths: [resolve('node_modules/')],
    },
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          use: 'babel-loader',
        },
        {
          test: /\.(sa|sc)ss$/,
          use: [
            production && {
              loader: MiniCssExtractPlugin.loader,
            },
            !production && 'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'resolve-url-loader',
              // DeprecationWarning: "keepQuery" option has been removed, the query and/or hash are now always retained
              // options: {
              //   keepQuery: true,
              // },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ].filter(a => !!a),
        },
        {
          test: /\.(png|jpe?g|svg|gif)$/,
          type: 'asset/resource',
          generator: {
            filename: `${config.mediaPath}/imgs/[name].[contenthash:8][ext][query]`,
          },
          exclude: [resolve('src/assets/icons')],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                symbolId: 'icon-[name]',
              },
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [{ name: 'removeAttrs', params: { attrs: 'fill' } }],
              },
            },
          ],
          include: [resolve('src/assets/icons')],
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          type: 'asset/resource',
          generator: {
            filename: `${config.mediaPath}/fonts/[name].[contenthash:8][ext][query]`,
          },
        },
      ],
    },
    plugins: [new FriendlyErrorsWebpackPlugin()],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/, // node_modules 中的依赖抽离
            name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
            minChunks: 1, // 只要使用一次就提取出来
            chunks: 'initial', // 只提取初始化就能获取到的模块，不管异步的
            minSize: 0, // 提取代码体积大于0就提取出来
            priority: 1, // 提取优先级为1
          },
          svgIcon: {
            test: resolve('src/assets/icons'),
            name: 'svg-icon',
            chunks: 'initial',
            priority: -5,
            minSize: 0, // 提取代码体积大于0就提取出来
          },
          commons: {
            // 提取页面公共代码
            name: 'commons', // 提取文件命名为commons
            minChunks: 2, // 只要使用两次就提取出来
            chunks: 'initial', // 只提取初始化就能获取到的模块，不管异步的
            minSize: 0, // 提取代码体积大于0就提取出来
          },
        },
      },
    },
  };

  if (mode === 'app') {
    // 调用getEntryTemplate 获得对应的entry和htmlPlugins
    const { entry, htmlPlugins } = getEntryTemplate(mode, packages);
    baseConf.entry = entry;
    baseConf.plugins.push(...htmlPlugins);
  }

  if (mode === 'module') {
    const { entry, modulePlugins } = getModuleFederationPlugins(mode, packages);
    baseConf.entry = entry;
    baseConf.plugins.push(...modulePlugins);
  }

  let progressPlugin = new WebpackBar({
    color: '#85d', // 默认green，进度条颜色支持HEX
    basic: false, // 默认true，启用一个简单的日志报告器
    profile: false, // 默认false，启用探查器。
  });
  baseConf.plugins.push(progressPlugin);

  return baseConf;
};
