const path = require("path");
const {
  resolve,
  getEntryTemplate,
  getModuleFederationPlugins,
} = require("./utils");
const config = require("./config");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function ({ production, mode, packages }) {
  const baseConf = {
    name: `${mode}-compiler`,
    output: {
      filename: `${config.staticPath}/js/[name].[contenthash:8].js`,
      path: path.resolve(__dirname, `../dist`),
      publicPath: `/`,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../src"),
      },
      mainFiles: ["index", "main"],
      extensions: [".ts", ".tsx", ".scss", "json", ".js"],
    },
    cache: {
      type: "filesystem",
      buildDependencies: {
        build: [resolve("scripts/")],
      },
      cacheDirectory: resolve(".cache/"),
    },
    snapshot: {
      // 如果希望修改node_modules下的文件时对应的缓存可以失效，可以将此处的配置改为 managedPaths: []
      managedPaths: [resolve("node_modules/")],
    },
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          use: "babel-loader",
        },
        {
          test: /\.(sa|sc)ss$/,
          use: [
            production && {
              loader: MiniCssExtractPlugin.loader,
            },
            !production && "style-loader",
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
          ].filter((a) => !!a),
        },
        {
          test: /\.(png|jpe?g|svg|gif)$/,
          type: "asset/resource",
          generator: {
            filename: `${config.mediaPath}/imgs/[name].[contenthash:8][ext][query]`,
          },
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          type: "asset/resource",
          generator: {
            filename: `${config.mediaPath}/fonts/[name].[contenthash:8][ext][query]`,
          },
        },
      ],
    },
    plugins: [new FriendlyErrorsWebpackPlugin()],
  };

  if (mode === "app") {
    // 调用getEntryTemplate 获得对应的entry和htmlPlugins
    const { entry, htmlPlugins } = getEntryTemplate(mode, packages);
    baseConf.entry = entry;
    baseConf.plugins.push(...htmlPlugins);
  }

  if (mode === "module") {
    const { entry, modulePlugins } = getModuleFederationPlugins(mode, packages);
    baseConf.entry = entry;
    baseConf.plugins.push(...modulePlugins);
  }

  return baseConf;
};
