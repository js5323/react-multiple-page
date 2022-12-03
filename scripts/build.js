// const { run } = require("./helper");
const program = require("commander");
const webpack = require("webpack");
const chalk = require("chalk");

const WebpackDevServer = require("webpack-dev-server");
const { resolveDist, getEntry } = require("./utils");
const rm = require("rimraf");
const { dirMapping, log, devServer } = require("./config");
const inquirer = require("inquirer");
const webpackProd = require("./webpack.prod");
const webpackDev = require("./webpack.dev");

program
  .option("-m, --mode <mode>", "build mode")
  .option("-a, --all", "build all")
  .option("-w, --watch", "watch mode")
  .option("-p, --production", "production release")
  .option("-an, --analysis", "analysis production release")
  .parse(process.argv);

const isProduct = program.production;
const isWatch = program.watch;
const isAppMode = program.mode == "app";
// const isModuleMode = program.mode == "module";
const env = process.env;
const report = env.npm_config_report;

try {
  rm.sync(resolveDist("", "*"));
} catch (e) {
  console.error(e);
  console.log(
    "\n\n删除dist文件夹遇到了一些问题，如果遇到问题请手工删除dist重来\n\n"
  );
}

choosePackageConfig(
  {
    all: program.all,
    mode: program.mode,
    analysis: program.analysis,
    production: isProduct,
    watch: isWatch,
    report,
  },
  function (webpackConf) {
    if (program.watch) {
      if (isAppMode) {
        runServer(webpackConf);
        return;
      }
      webpack(webpackConf).watch(undefined, callback);
    } else {
      webpack(webpackConf, callback);
    }
  }
);

function callback(err, stats) {
  if (err) {
    process.exitCode = 1;
    return console.error(err);
  }
  if (Array.isArray(stats.stats)) {
    stats.stats.forEach((item) => {
      console.log(item.compilation.name + "打包结果：");
      process.stdout.write(
        item.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false,
          entrypoints: false,
        }) + "\n\n"
      );
    });
  } else {
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        entrypoints: false,
      }) + "\n\n"
    );
  }

  if (stats.hasErrors()) {
    console.log(chalk.red("  Build failed with errors.\n"));
  } else if (program.watch) {
    console.log(
      chalk.cyan(`  Build complete at ${new Date()}.\n  Still watching...\n`)
    );
  } else {
    console.log(chalk.cyan("  Build complete.\n"));
  }
}

function runServer(conf) {
  const compiler = webpack(conf);
  const server = new WebpackDevServer(
    {
      ...devServer,
      open: true,
    },
    compiler
  );
  server.start();
}

function choosePackageConfig(options, callback) {
  const { mode, production } = options;
  const entry = getEntry(mode);
  // 获取packages下的所有文件
  const packagesList = [...Object.keys(entry)];
  if (options.all) {
    const opt = { ...options, packages: packagesList };

    if (production) {
      callback(webpackProd(opt));
    } else {
      callback(webpackDev(opt));
    }

    return;
  }

  // 至少保证一个
  if (!packagesList.length) {
    log(
      "不合法目录，请检查src/" + dirMapping[mode] + "/*/index.tsx",
      "warning"
    );
    return;
  }

  // 同时添加一个全选
  const allPackagesList = ["all", ...packagesList];

  // 调用inquirer和用户交互
  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "please select a project:",
        name: "devLists",
        choices: allPackagesList, // 选项
        default: "all",
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

      const opt = { ...options, packages: res.devLists };

      if (production) {
        callback(webpackProd(opt));
      } else {
        callback(webpackDev(opt));
      }
    });
}
