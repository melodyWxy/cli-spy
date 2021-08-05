#!/usr/bin/env node

const { Command } = require("commander");
const portscanner = require("portscanner");
const chalk = require("chalk");

const program = new Command();

const checkPortReg = (port) => {
  const reg = /\d{1,6}/;
  return reg.test(port);
};

class Main {
  constructor() {
    this.defaultIp = "127.0.0.1";
  }
  start() {
    // 版本
    program
      .version(require("./package.json").version)
      .option("-i, --ip <ip>", "指定服务器地址，不用此参数时默认为本地");

    // 注册命令test1
    program
      .command("port <port>")
      .description("检测端口状态")
      .action((port) => {
        if (!checkPortReg(port)) {
          console.log(chalk.yellow(`${port} 为不规范的端口号参数！`));
        }
        Promise.resolve().then(() => {
          console.log(chalk.blue(`目标服务器IP: ${this.defaultIp}`));
          console.log(chalk.blue(`目标端口号: ${port}`));
          console.log();
          console.log(chalk.green(`🕵️‍♀️ 检测中……`));
          portscanner.checkPortStatus(+port, this.defaultIp, (err, status) => {
            if (err) {
              console.error(err);
              console.log(chalk.red("🕵️‍♀️ 检测出错！"));
            } else {
              console.log(chalk.green(`🕵️‍♀️ 检测结果如下:`));
              console.log(chalk.green(`${this.defaultIp}:${port}  ${status}`));
            }
          });
        });
      });
    // 解析环境参数，不要删除
    program.parse(process.argv);

    const options = program.opts();
    if (options.ip) {
      this.defaultIp = options.ip;
    }
  }
}

new Main().start();
