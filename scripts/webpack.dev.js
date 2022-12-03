// webpack.dev.js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");

module.exports = function (options) {
  const devConfig = {
    mode: "development",
    devtool: "eval-source-map",
  };

  return merge(devConfig, baseConfig(options));
};
