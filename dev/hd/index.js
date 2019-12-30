#!/usr/bin/env node
const path = require('path');
const shell = require('shelljs');
const commander = require('commander');
const watcher = require('watch');
const projMap = require('./project-map');
var exec = require('child_process').exec;

// 复制文件
const copy = debounce((from, to, watch) => {
    if (!watch) {
        if (!shell.test('-e', path.join(from, '..'))) {
            console.error('base目录不存在');
            return;
        }
        if (!shell.test('-e', to)) {
            shell.mkdir('-p', to);
        }
        console.log(`copy ${from} -> ${to}`);
    }
    shell.cp('-ru', from, to);
}, 1000);

/**
 * 执行命令的的函数
 * @param {string} mate 预留
 * @param {object} options 参数
 * @param {edit|view} root 项目类型
 */
function action(mate, options, root) {
    // const pwd = shell.pwd().toString();
    const { watch, project, all } = options;

    // 刷新全部项目
    if (all) {
        for (let key in projMap) {
            const cmd = `hd ${root} -p ${key}`;
            console.log(cmd);
            exec(cmd, function (err, stdout, stderr) {
                if (err) {
                    console.error(stderr);
                } else {
                    console.log('success.');
                }
            });
        }
        return;
    }

    if (!project || !projMap[project]) {
        console.error('项目代号错误');
        return;
    }
    // 执行单个项目
    const setting = projMap[project];
    let base, proj;
    if (root === 'edit') {
        base = setting.edit_base;
        proj = setting.edit_project;
    }
    if (root === 'view') {
        base = setting.view_base;
        proj = setting.view_project;
    }

    let from;
    if (isNaN(Number(base))) {
        from = path.resolve(__dirname, `${root}/@base/${base}/*`);
    } else {
        from = path.resolve(__dirname, `${root}/@base/v${base}/*`);
    }
    const to = path.resolve(__dirname, `${root}/${proj}/src/base`);

    // 复制
    copy(from, to);

    // 是否监听
    if (!watch) return;
    const fromdir = path.join(from, '..');
    watcher.watchTree(fromdir, {
        filter: (name, prop) => {
            console.log('watching', name);
            return true;
        }
    }, function (f, curr, prev) {
        if (typeof f == "object" && prev === null && curr === null) {
            console.log('--watch');
        } else if (prev === null) {
            console.log('created:', f);
            const t = path.join(to, path.relative(fromdir, f));
            shell.cp('-ru', f, t);
        } else if (curr.nlink === 0) {
            console.log('removed:', f);
            const t = path.join(to, path.relative(fromdir, f));
            shell.rm('-rf', t);
        } else {
            console.log('changed:', f);
            const t = path.join(to, path.relative(fromdir, f));
            copy(f, t, true);
        }
    });
}

commander
    .command('edit [mate]') // mate为action函数第一个参数
    .alias('e') // 别名
    .description('同步 edit/@base/*')
    .option('-w, --watch [watch]', '监听模式')
    .option('-p, --project [project]', '项目代号')
    .option('-a, --all [all]', '刷新所有项目')
    .action(function (mate, options) {
        action(mate, options, 'edit');
    })
    .on('--help', () => {
        console.log('help.');
    });


commander
    .command('view [mate]') // mate为action函数第一个参数
    .alias('v') // 别名
    .description('同步 view/@base/*')
    .option('-w, --watch [watch]', '监听模式')
    .option('-p, --project [project]', '项目代号')
    .option('-a, --all [all]', '刷新所有项目')
    .action(function (mate, options) {
        action(mate, options, 'view');
    })
    .on('--help', () => {
        console.log('help.');
    });

commander.parse(process.argv);


function debounce(action, idle) {
    let last;
    return function (...args) {
        clearTimeout(last);
        last = setTimeout(() => {
            action.apply(this, args)
        }, idle);
    }
}

function formatStr(str) {
    let len = 20;
    return str + ' ' + (new Array(len - str.length).join('--'));
}

Object.keys(projMap).forEach(key => {
    console.log(`${formatStr(projMap[key].name)} ${key}`);
})
