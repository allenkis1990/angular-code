/**
 * Created by wengpengfei on 2016/8/10.
 */
const fs = require('fs')
const _ = require('lodash')
const gulp = require('gulp')
const path = require('path')
const through2 = require('through2')
const noop = () => 0

function Config () {

}

Config.prototype = {
    dot: '.',
    relative: './',
    textFiles: [
        '.js', '.html', '.txt'
    ],
    temp: '.temp',
    script: 'js',
    html: 'html',
    styles: 'styles',
    dist: 'public',
    views: 'views',
    app: 'app',
    scriptBase: './app/js/',
    images: 'images',
    build: 'build',
    things: 'things',

    utfEncoding: {encoding: 'utf-8'},
    // rewrites 重写规则是否打开日志
    rewriteRule: {
        log: false
    },
    /// apps
    portal: 'portal',
    admin: 'admin',
    login: 'login',
    center: 'center',

    apps: ['admin', 'portal', 'center', 'login', 'play'],

    dev: {
        port: 9000
    },

    static: {
        port: 9002
    },

    test: {
        port: 9009
    },

    proxies: [
        // {
        //     target : "http://192.168.26.253",
        //     context: '/web',
        //     port   : "8080"
        // }
        // // ,
        {
            //target:'http://127.0.0.1',
            //target: 'http://192.168.25.252',// 林局
            target: 'http://172.17.2.144',//测试2


            //target : "http://192.168.25.242",//连福
            //target : "http://192.168.25.241",//cr
            //target : "http://192.168.24.254",//bg
            //target : "http://192.168.26.249",//wq
            //target : "http://192.168.25.249",//jy
            //target : "http://192.168.28.252",//吴烁
            context: '/web',
            port: '8080'
        }
        // {
        //     target : "http://117.27.135.77",
        //     context: '/web',
        //     port   : "80"
        // }
    ],
    /**
     *
     */
    getBase: function (dir) {
        return [this.dot, this.app, dir, ''].join('/')
    },
    /**
     *
     */
    getScriptBase: function (dir) {
        return [this.dot, this.app, dir, ''].join('/')
    },
    /**
     *
     */
    getTemplateBase: function (appName, dir) {
        return [this.dot, this.app, appName, dir, ''].join('/')
    },
    /**
     *
     * @param dir
     * @returns {string}
     */
    getHtmlBase: function (dir) {
        return [this.dot, this.html, dir, ''].join('/')
    },
    /**
     *
     * @param dir
     * @returns {string}
     */
    getViewsTemplateBase: function (appName, dir) {
        return [this.dot, this.app, appName, dir, this.views, ''].join('/')
    },
    /**
     *
     * @param dir
     * @returns {string}
     */
    getStylesCompiledBase: function (appName, dir) {
        return [this.dot, this.temp, appName, dir, ''].join('/')
    },
    /**
     *
     * @param dir
     * @returns {string}
     */
    getLessBase: function (appName, dir) {
        return [this.dot, this.app, appName, dir, this.styles, ''].join('/')
    },
    /**
     *
     * @param dir
     * @returns {string}
     */
    getImagesBase: function (appName, dir) {
        return [this.dot, this.app, this.images, appName, dir, ''].join('/')
    },

    /**
     *
     * @returns {string}
     */
    getPublicBase: function () {
        return [this.dot, this.dist, ''].join('/')
    },
    /**
     *
     * @returns {string}
     */
    getBuildBase: function () {
        return [this.dot, this.build, ''].join('/')
    },

    getThingsBase: function (dir) {
        return [this.dot, this.things, dir, ''].join('/')
    },

    compileJs: function () {
        var compileReg = /{{(.*)}}/

    },
    /**
     *
     * @param dirs
     * @returns {Array}
     */
    getSubDirectories: function (dirs, base) {
        var realDirs = []
        var that = this
        // 获取文件夹
        dirs.map(function (item) {
            var fileStats = fs.statSync((base || '') + item)
            fileStats.isDirectory() && realDirs.push(item)
        })
        return realDirs
    },
    findSubDirectory (filePath) {
        var directories = []
        fs.readdirSync(filePath).forEach(function (item, index) {
            var subPath = filePath + '/' + item
            fs.lstatSync(subPath).isDirectory() && directories.push(item)
        })
        return directories
    },

    getSubDir (_path) {
        let dirs = []
        if (!fs.existsSync(_path)) {
            return dirs
        }
        return _.remove(dirs = fs.readdirSync(_path), (dir) => {
            return !fs.statSync(`${_path }/${dir}`).isDirectory()
        }), dirs
    },

    getSubs (_path) {
        return fs.readdirSync(_path)
    },
    walkThrough (_path, father) {
        let dirMapper = {}
        this.getSubDir(_path)
            .forEach((dir) => {
                if (['center', 'portal', 'admin', 'login'].indexOf(dir) !== -1) {
                    father[dir] = {}
                    this.getSubDir(`${_path}/${dir}`)
                        .forEach((subDir) => {

                            if (subDir !== env.boilerplatePath) {
                                father[dir][subDir] = {}
                                if (this.getSubs(`${_path}/${dir}/${subDir}`).indexOf(env.sign) !== -1) {
                                    this.getSubDir(`${_path}/${dir}/${subDir}`)
                                        .forEach((grandDir) => {
                                            father[dir][subDir][grandDir] = {}
                                        })
                                    father[dir][subDir][env.sign] = '# 标识'
                                }
                            }
                        })
                }
            })
        return dirMapper
    },

    getContent: file => file.contents.toString(),

    getFilesByType (glob, mapper, fileType, where) {
        let _this = this
        let some = path.resolve(__dirname, `../.${glob}`)
        // console.log(glob, `${glob}/**/${fileType}`, some)
        return new Promise((res, rej) => {

            gulp.src(`${glob}/**/${fileType}`)

                .on('error', (error) => {
                    console.log(error)
                })

                .pipe(through2.obj(function (file, enc, next) {
                    let thePath = file.path.replace(some + '\\', '')
                    if (where) {
                        mapper[where][thePath] = _this.getContent(file)
                    } else {
                        Object.keys(mapper)
                            .forEach((app) => {
                                let keys = Object.keys(mapper[app])
                                if (mapper[app][env.sign]) {
                                    keys.forEach((key) => {
                                        mapper[app][key][thePath] = _this.getContent(file)
                                    })
                                } else {
                                    mapper[app][thePath] = _this.getContent(file)
                                }
                            })
                    }
                    this.push(file)
                    next()
                }), function (next) {
                    next()
                })
                .on('error', (error) => {
                    console.log(error)
                })
                .on('data', noop)
                .on('end', res)
        })
    },

    concatAndCoverFiles (dirMapper, fileType) {
        let promises = []

        Object.keys(dirMapper)

            .forEach((app) => {
                promises.push(new Promise((res_1, rej) => {
                    this.getFilesByType(`${env.appPath}/${app}/${env.boilerplatePath}`, dirMapper[app], fileType)

                        .then(() => {
                            let promises = []
                            Object.keys(dirMapper[app])
                                .forEach((subProject) => {
                                    if (dirMapper[app][subProject][env.sign]) {
                                        Object.keys(dirMapper[app][subProject])

                                            .forEach((grandProject) => {
                                                promises.push(this.getFilesByType(`${env.appPath}/${app}/${subProject}/${grandProject}`, dirMapper[app][subProject], fileType, grandProject))
                                            })
                                    } else {
                                        promises.push(this.getFilesByType(`${env.appPath}/${app}/${subProject}`, dirMapper[app], fileType, subProject))
                                    }
                                })

                            Promise.all(promises)

                                .then(function () {
                                    res_1()
                                })
                        })
                }))
            })

        return Promise.all(promises)
    }
}

module.exports = new Config()