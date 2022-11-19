const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { MAIN_FILE } = require("./config.js");
const { fileURLToPath } = require("url");

// 获取多页面入口文件夹中的路径
const dirPath = path.resolve(__dirname, "../../src/packages");

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

// 根据入口文件list生成对应的htmlWebpackPlugin
// 同时返回对应wepback需要的入口和htmlWebpackPlugin
const getEntryTemplate = (packages) => {
  const entry = Object.create(null);
  const htmlPlugins = [];
  packages.forEach((packageName) => {
    entry[packageName] = path.join(dirPath, packageName, MAIN_FILE);
    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../../public/index.html"),
        filename: `${packageName}.html`,
        chunks: ["manifest", "vendors", packageName],
      })
    );
  });
  return { entry, htmlPlugins };
};

// 调用打包命令
async function runParallel(packages) {
  // 当前所有入口文件
  const message = `Start: ${packages.join("-")}`;
  log(message, "success");
  log("\nplease waiting some times...", "success");
  await build(packages);
}

// 真正打包函数
async function build(buildLists, mode) {
  // 将选中的包通过separator分割
  const stringLists = buildLists.join(separator);
  // 调用通过execa调用webapck命令
  // 同时注意路径是相对 执行node命令的cwd的路径
  // 这里我们最终会在package.json中用node来执行这个脚本
  let args = [];

  if (mode == "dev") {
    args = ["server", "--config", "./scripts/webpack.dev.js"];
  }

  if (mode == "prod") {
    args = ["--config", "./scripts/webpack.prod.js"];
  }

  await execa("webpack", args, {
    stdio: "inherit",
    env: {
      packages: stringLists,
    },
  });
}

const run = (mode) => {
  // 获取packages下的所有文件
  const packagesList = [...Object.keys(entry)];
  // 至少保证一个
  if (!packagesList.length) {
    log("不合法目录，请检查src/packages/*/index.tsx", "warning");
    return;
  }

  // 同时添加一个全选
  const allPackagesList = [...packagesList, "all"];

  // 调用inquirer和用户交互
  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "please select a project:",
        name: "devLists",
        choices: allPackagesList, // 选项
        // 校验最少选中一个
        validate(value) {
          return !value.length ? new Error("at lest select one project") : true;
        },
        // 当选中all选项时候 返回所有packagesList这个数组
        filter(value) {
          if (value.includes("all")) {
            return packagesList;
          }
          return value;
        },
      },
    ])
    .then((res) => {
      const message = `Selected packages: ${res.devLists.join(" , ")}`;
      // 控制台输入提示用户当前选中的包
      log(message, "success");
      runParallel(res.devLists, mode);
    });
};

exports.modules = {
  run,
  getEntryTemplate,
};
