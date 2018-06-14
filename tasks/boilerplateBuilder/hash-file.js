const crypto = require('crypto');
const through2 = require('through2');
const path = require('path');
const chalk = require('chalk');
const log = console.log;

/**
 * 执行hash
 * @param str
 * @returns {Blob|ArrayBuffer|Array.<T>|string}
 */
function hash (str = '') {
    return crypto.createHash('md5')
        .update(str)
        .digest('hex').slice(0, 10);
}

/**
 * 将 \\ 替换成 /
 * @param str
 * @returns {string}
 */
function normalize (str = '') {
    return str.replace(/\\/g, '/').replace(/^public\//, '').replace(/^js\//, '').replace(/\.js$/, '');
}

/**
 * 将路径替换掉
 * @param str
 * @param app
 */
function replaceBase (str, app) {
    let basePath = path.resolve(__dirname, `.${env.appPath}`);
    return str.replace(`${basePath}\\`, '')
        .replace(`${app}\\`, '')
        .replace(new RegExp(`^.\\\\${app}\\\\\\\\`), '');
}

/**
 *
 * @returns {*}
 */
function hashedFiles (app, module = '', options = {}) {
    let manifested = {};
    let changeFiles = [];
    let imageExts = ['.jpg', '.jpeg', '.png', '.bmp', '.gif'];
    let index = 'index.html';
    replaceBase = options.replaceBase || replaceBase;
    return through2.obj(function (file, enc, next) {
        let contents = file.contents.toString();
        let hashedKey = hash(contents);
        let fileInfo = path.parse(file.path);
        let _originalPath = file.path;
        let key = replaceBase(_originalPath, app);
        let _hashedPath = file.path.replace(new RegExp(`${fileInfo.ext}$`), `_hash${hashedKey}${fileInfo.ext}`);
        if (key !== index) {
            file.path = _hashedPath;
            manifested[key] = replaceBase(_hashedPath, app);
        }
        changeFiles.push(file);
        next();
    }, function (next) {
        log(chalk.green(`████████████████████                           ████████████████████`));
        log(chalk.green(`████████████████████    ${app}开始执行替换工作    ████████████████████`));
        log(chalk.green(`████████████████████                           ████████████████████`));

        changeFiles.forEach((file) => {
            this.push(file);
        });

        let rollingTime = 0;
        let fileLen = Object.keys(manifested).length;

        function rolling (fileLen) {
            log(chalk.cyan(`...O0~~  The ${rollingTime++} times rolling <<<<<<    ${app} > ${module}    >>>>>>  starting, Total number is ： ${fileLen}  ~~0O...`));
            /// manifested
            let mft = manifested;
            manifested = {};
            changeFiles.forEach((file) => {
                let fileInfo = path.parse(file.path);
                let fileContents = file.contents.toString();
                let _originalPath = file.path;
                let pathKey = replaceBase(_originalPath, app);
                let cacheContents = fileContents;
                if (imageExts.indexOf(fileInfo.ext) === -1) {
                    Object.keys(mft).forEach((key) => {
                        let _key = normalize(key);
                        let _value = normalize(mft[key]);
                        // 如果当前遍历的文件中存在当前的key
                        if (fileContents.indexOf(_key) !== -1) {
                            // 判断自己引用自己
                            if (fileContents.indexOf(normalize(pathKey)) !== -1) {

                                // 循环引用引发错误信息
                                throw new Error(`${pathKey} this file may has contents with it path, cycle reference error occur.`);
                            }
                            // 替换

                            // /(["|'])?main.config_58882afa1c(\.js)?(["|'])+/g
                            let reg = new RegExp(`(["|'])?${_key}(\\${key.substring(key.lastIndexOf('.'), key.length)})?(["|'])+`, 'g');
                            // if (pathKey === index) {
                            // 不是index.html引用文件的时候没带后缀
                            fileContents = fileContents.replace(reg, `$1${_value}$3`);
                            // } else {
                            //     index.html引用文件的时候都是带后缀的
                            // fileContents = fileContents.split(_key).join(_value);
                            // }
                        }
                    });

                    // // 如果缓存的内容不等于替换过的内容，则视为发生改变的文件，丢到changeFiles数组中去
                    if (cacheContents !== fileContents) {
                        //     // 重新hash新的内容
                        let hashedKey = hash(fileContents);
                        let _hashedPath = _originalPath.replace(new RegExp(`_hash.*?\\${fileInfo.ext}$`), `_${hashedKey}${fileInfo.ext}`);
                        file.contents = new Buffer(fileContents);
                        if (pathKey !== index) {
                            file.path = _hashedPath;
                            manifested[pathKey] = replaceBase(_hashedPath, app);
                        }
                    }
                }
            });

            fileLen = Object.keys(manifested).length;
            if (fileLen) {
                rolling.call(this, fileLen);
            } else {
                next();
            }
        }

        rolling.call(this, fileLen);

        //
        log(chalk.green(`████████████████████                           ████████████████████`));
        log(chalk.green('████████████████████    替换工作准备结束          ████████████████████'));
        log(chalk.green(`████████████████████                           ████████████████████`));
    });
}

hashedFiles.desc = '将文件hash化';

module.exports = hashedFiles;