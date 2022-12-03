const chalk = require("chalk");
const path = require("path");

// 打印时颜色
const error = chalk.bold.red;
const warning = chalk.hex("#FFA500");
const success = chalk.green;

const maps = {
  success,
  warning,
  error,
};

const log = (message, types) => {
  console.log(maps[types](message));
};

module.exports = {
  // 规定固定的入口文件名 {packages|modules}/**/index.tsx
  MAIN_FILE: "index.tsx",
  MODULE_FILE: "bootstrap.tsx",
  log,
  // 因为环境变量的注入是通过字符串方式进行注入的
  // 所以当 打包多个文件时 我们通过*进行连接 比如 home和editor 注入的环境变量为home*editor
  // 注入多个包环境变量时的分隔符
  separator: "*",
  supportedModes: ["app", "module"],
  dirMapping: {
    app: "packages",
    module: "modules",
  },
  devServer: {
    // static允许我们在DevServer下访问该目录的静态资源
    // 简单理解来说 当我们启动DevServer时相当于启动了一个本地服务器
    // 这个服务器会同时以static-directory目录作为跟路径启动
    // 这样的话就可以访问到static/directory下的资源了
    static: {
      directory: path.join(__dirname, "../public"),
    },
    // 默认为true
    hot: true,
    // 是否开启代码压缩
    compress: true,
    // 启动的端口
    port: 5000,
  },
  // 是否开启 SRI 策略
  integrity: true,
  crossOrigin: false,
  // 页面路径
  pagePath: "content/hk/test",
  // 媒体文件（img/svg/font/json）路径
  mediaPath: "content/dam/test",
  // js/css 路径
  staticPath: "etc/designs/test",
};
