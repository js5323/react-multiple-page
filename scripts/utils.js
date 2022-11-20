const path = require("path");
const fs = require("fs");
const { dirMapping, MAIN_FILE, pagePath, staticPath } = require("./config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolveSrc(file, subDir = "") {
  return path.join(__dirname, "../src", subDir, file || "");
}

function resolveDist(platform, subDir = "") {
  return path.join(__dirname, "../dist", platform, subDir);
}

function resolve(file) {
  return path.join(__dirname, "..", file || "");
}

function normalizeArr(arrCfg) {
  if (Array.isArray(arrCfg) && arrCfg.length) {
    return arrCfg;
  } else if (arrCfg) {
    return [arrCfg];
  }
  return [];
}

function getRootPath(...args) {
  return args.filter((item) => item).join("_");
}

function getConf(conf, options) {
  return typeof conf === "function" ? conf(options) : conf;
}

// 获取多页面入口文件夹中的路径
const getDirPath = (mode) => {
  return path.resolve(__dirname, "../src/" + dirMapping[mode]);
};

const getEntry = (mode) => {
  const dirPath = getDirPath(mode);
  // 用于保存入口文件的Map对象
  const entry = Object.create(null);

  // 读取dirPath中的文件夹个数
  // 同时保存到entry中  key为文件夹名称 value为文件夹路径
  fs.readdirSync(dirPath).filter((file) => {
    const entryPath = path.join(dirPath, file);
    if (fs.statSync(entryPath)) {
      entry[file] = path.join(entryPath, MAIN_FILE);
    }
  });

  return entry;
};

// 根据入口文件list生成对应的htmlWebpackPlugin
// 同时返回对应wepback需要的入口和htmlWebpackPlugin
const getEntryTemplate = (mode, packages) => {
  const dirPath = getDirPath(mode);
  const entry = Object.create(null);
  const htmlPlugins = [];
  packages.forEach((packageName) => {
    entry[packageName] = path.join(dirPath, packageName, MAIN_FILE);
    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../public/index.html"),
        filename: `${pagePath}/${packageName}.html`,
        // publicPath: ``,
        chunks: ["manifest", "vendors", packageName],
      })
    );
  });
  return { entry, htmlPlugins };
};

module.exports = {
  resolve,
  resolveSrc,
  resolveDist,
  normalizeArr,
  getRootPath,
  getConf,
  getDirPath,
  getEntry,
  getEntryTemplate,
};
