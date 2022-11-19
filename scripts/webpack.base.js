const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口文件，这里之后会着重强调
  entry: {
    index1: path.resolve(__dirname, "../src/containers/index1/index.tsx"),
    index2: path.resolve(__dirname, "../src/containers/index2/index.tsx"),
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: "babel-loader",
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset/inline",
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
          {
            loader: "resolve-url-loader",
            options: {
              keepQuery: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    extensions: [".tsx", ".ts", ".js", ".scss", ".css"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/[name].css",
    }),
    new htmlWebpackPlugin({
      filename: "index1.html",
      template: path.resolve(__dirname, "../public/index.html"),
      chunks: ["index1"],
    }),
    new htmlWebpackPlugin({
      filename: "index2.html",
      template: path.resolve(__dirname, "../public/index.html"),
      chunks: ["index2"],
    }),
  ],
};
