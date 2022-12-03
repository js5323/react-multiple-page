const { merge } = require("webpack-merge");
const config = require("./config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");
const baseConfig = require("./webpack.base.js");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = function (options) {
  const prodConfig = {
    mode: "production",
    devtool: "source-map",
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${config.staticPath}/css/[name].[contenthash:8].css`,
      }),
    ],
    optimization: {
      emitOnErrors: true,
      minimizer: [
        {
          apply: (compiler) => {
            // Lazy load the Terser plugin
            const TerserPlugin = require("terser-webpack-plugin");
            new TerserPlugin({
              parallel: true, // 多线程并行构建
              // terserOptions参考 https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              terserOptions: {
                // terser的默认行为会把某些对象方法转为箭头函数，导致ios9等不支持箭头函数的环境白屏，详情见 https://github.com/terser/terser#compress-options
                compress: {
                  arrows: false,
                  drop_debugger: true, // 删除所有的debugger
                  pure_funcs: ["console.log"], // 删除所有的console.log
                },
              },
            }).apply(compiler);
          },
        },
      ],
    },
  };

  if (config.integrity) {
    prodConfig.plugins.push(new SubresourceIntegrityPlugin());
    // the following setting is required for SRI to work:
    // webpack-subresource-integrity: SRI requires a cross-origin policy, defaulting to "anonymous".
    // Set webpack option output.crossOriginLoading to a value other than false to make this warning go away.
    // See https://w3c.github.io/webappsec-subresource-integrity/#cross-origin-data-leakage
    prodConfig.output = {
      crossOriginLoading: "anonymous",
    };
  }

  if (options.analysis) {
    prodConfig.plugins.push(new BundleAnalyzerPlugin());
  }
  return merge(prodConfig, baseConfig(options));
};
