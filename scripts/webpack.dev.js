// webpack.dev.js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");

module.exports = function (options) {
  const devConfig = {
    mode: "development",
    devtool: "eval-source-map",
  };

  return merge(devConfig, baseConfig(options));
};
