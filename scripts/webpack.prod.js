const path = require("path");
const { merge } = require("webpack-merge");
const config = require("./config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { getEntryTemplate } = require("./utils");
const baseConfig = require("./webpack.base.js");

module.exports = function (options) {
  const prodConfig = {
    mode: "production",
    devtool: "source-map",
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${config.staticPath}/css/[name].[hash:8].css`,
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
              // terserOptions参考 https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              terserOptions: {
                // terser的默认行为会把某些对象方法转为箭头函数，导致ios9等不支持箭头函数的环境白屏，详情见 https://github.com/terser/terser#compress-options
                compress: {
                  arrows: false,
                },
              },
            }).apply(compiler);
          },
        },
      ],
    },
  };

  return merge(prodConfig, baseConfig(options));
};
