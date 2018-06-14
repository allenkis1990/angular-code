/**
 * Created by wengpengfei on 2016/8/8.
 */

let minimist = require('minimist')
let //////////////////////////////////////////////////////////////////
    options = minimist(process.argv.slice(2))
//////////////////////////////////////////////////////////////////
let dev = !!(options._[0] !== 'default' && options._.length)

global.env = {
    dev: dev,
    cssDest: dev ? './.temp' : './public',
    cssTemp: './.temp',
    buildPath: './public',
    deployPath: './public',
    appPath: './app',
    boilerplatePath: '_boilerplate',
    sign: '.hbrc',
    placeholder: '@systemUrl@'
}

let gulp = require('gulp'),              // 基
    browserSync = require('browser-sync').create(),      // 浏览器同步服务神器
    serveStatic = require('serve-static'),      // 文件映射
    less = require('gulp-less'),         // less编译器
    clean = require('gulp-clean'),        // 文件、文件夹 清除
    config = require('./things/config/config.js'),       // 配置文件
    uglify = require('gulp-uglify'),       // js压缩混淆
    fs = require('fs'),                // 文件流
    cssmin = require('gulp-clean-css'),   // css压缩
    htmlmin = require('gulp-htmlmin'),      // html压缩
    removeLogs = require('gulp-removelogs'),   // 删除console.log
    runSeque = require('gulp-run-sequence'), // 顺序执行
    through2 = require('through2'),
    httpProxy = require('proxy-middleware'),
    url = require('url'),
    __if = require('gulp-if'),
    ngAnnotate = require('gulp-ng-annotate'),
    Q = require('q'),
    watch = require('gulp-watch'),
    taskLoader = require('./tasks/task-loader'),
    send = require('send')

function uglify_ () {
    return uglify({
        compress: {screw_ie8: false},
        mangle: {screw_ie8: false},
        output: {screw_ie8: false}
    })
}

/**
 * 默认任务
 *  执行gulp 将所有的目录结构拿去做构建,
 *  执行 gulp -p mod1 -a portal 执行指定目录结构做构建
 */
gulp.task('default', function () {

    if (options.p && !options.a) {
        throw  new Error('please offer -a of arguments')
    }

    let begin = Date.now()
    console.log('┏┳━━━━━━━━━━━━┓')
    console.log('┃┃████████████┃')
    console.log('┃┃███████┏━━┓█┃')
    console.log('┣┫███████┃ 卐 ┃█┃')
    console.log('┃┃███████┃ 葵 ┃█┃')
    console.log('┃┃███████┃ 　 ┃█┃')
    console.log('┃┃███████┃ 花 ┃█┃')
    console.log('┣┫███████┃ 　 ┃█┃')
    console.log('┃┃███████┃ 宝 ┃█┃')
    console.log('┃┃███████┃ 　 ┃█┃')
    console.log('┃┃███████┃ 典 ┃█┃')
    console.log('┣┫███████┃ 卐 ┃█┃')
    console.log('┃┃███████┗━━┛█┃')
    console.log('┃┃████████████┃')
    console.log('┗┻━━━━━━━━━━━━┛')
    console.log(`系统开始任务时间: ${ new Date()}`)

    let deferred = Q.defer(),
        tasks = [
            '"clean"',
            '"stateMapper"',
            '\'collectInfo\'',
            // '"copyProjectConfig"',
            // 任务并行_boilerplate
            // '[' + '"less","uglify","html:min","images:min"' + ']',
            '"copyLessonPlatform"',
            '"less","uglify","html:min","images:min"',
            // '"analyzeStateMapper"',
            '"doRevReplace"',
            '"concat"',
            // '"copy:json"',
            '"bowerSolution"',
            '"portalIndexSEOSolution"',
            function () {

                // console.log('Starting clean public directory');
                // doClean([config.getBuildBase(), './.temp']);
                //
                console.log(`运行花费成本${(Date.now() - begin) / 1000}s`)

                deferred.resolve()
            }]

    // gulp --ext images:min,doRevReplace
    // 如果有设置排除项
    if (options.ext) {
        let exts = options.ext.split(',')
        if (/doRevReplace/.test(options.ext)) {
            tasks.splice(tasks.indexOf('"doRevReplace"'), 1, '"copyJs"')
        }
        exts.forEach(function (item) {
            let foundIndex = tasks.indexOf('"' + item + '"')
            if (foundIndex !== -1) {
                tasks.splice(foundIndex, 1)
            }
        })
    }
    eval('runSeque(' + tasks.join(',') + ')')
    // runSeque.apply ( this, tasks );
    return deferred.promise
})


gulp.task('tata', function () {
    runSeque('uglify', 'analyzeStateMapper')
})

/**
 * 执行less编译任务
 */
gulp.task('less', function () {
    return gulp.src([`${config.app}/!(admin|center|portal|login)/**/*{webstyle,loginstyle}.less`])

        .pipe(less())

        .pipe(__if(!env.dev, cssmin({
            //避免在清除的时候将文件路径重新定位
            rebase: false,
            compatibility: 'ie8'
        })))

        // .pipe(__if(!env.dev, taskLoader.Chuizi()))

        .pipe(gulp.dest(env.cssDest + '/'))
})

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////  uglify 压缩混淆任务  //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

gulp.task('copy:json', function () {
    return gulp.src([`${env.appPath}/**/*project.main.json`])
        .pipe(gulp.dest(env.buildPath))
})

/**
 * 在文件拷贝完成之后将文件目录下面的js压缩
 */
gulp.task('uglify', function () {
    return gulp.src([`${env.appPath}/!(admin|center|portal|login)/**/*.js`])
        .pipe(through2.obj(function (file, sex, next) {
            if (file.path.indexOf('main.config') !== -1) {
                file.contents = new Buffer(file.contents.toString().replace(/\$\$dev\$\$/g, 'false'))
            }
            this.push(file)
            next()
        }))
        .pipe(removeLogs())
        .pipe(ngAnnotate())
        .pipe(uglify_())
        // .pipe(taskLoader.Chuizi())
        .pipe(gulp.dest(env.buildPath))
})

/**
 *将requirejs 压缩
 */
gulp.task('requirejs:min', function () {
    return gulp.src('./public/bower_components/requirejs/require.js')

        .pipe(uglify_())

        .pipe(gulp.dest('./public/bower_components/requirejs'))
})

/**
 * html压缩
 */
gulp.task('html:min', function () {
    return gulp.src([`${env.appPath}/!(admin|center|portal|login)/**/*.html`])
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        // .pipe(taskLoader.Chuizi())
        .pipe(gulp.dest(env.buildPath))
})

/**
 * 压缩images
 */
gulp.task('images:min', function () {

    return gulp.src([`${env.appPath}/!(admin|center|portal|login)/**/*.{jpg,png,jpeg,ico,gif}`])
    // .pipe(taskLoader.Chuizi())
        .pipe(gulp.dest(env.buildPath))
})

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////  clean               //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function () {
    let deployDirectory = config.getPublicBase(),
        templateDirectory = '.temp'

    return doClean([deployDirectory, templateDirectory])
})

/**
 * 重命名portal/index.html  -- > index.htm
 */
///////////////////////
// /(([ \t]*)<!--\s*seo:build\s*-->)(\n|\r|.)*?(<!--\s*seo:endbuild\s*-->)/gi
gulp.task('portalIndexSEOSolution', function () {
    let reg = /(seo).*?(seo)/gi,
        changeTo = '$1$2'
    return gulp.src(`${env.buildPath}/portal/index.html`)

        .pipe((function () {
            return through2.obj(function (file, some, callback) {
                let content = file.contents.toString()
                content = content.replace(reg, changeTo)
                file.contents = new Buffer(content)
                fs.unlinkSync(file.path)
                file.path = file.path.replace(/\.html$/, '.htm')
                this.push(file)
                callback()
            })
        })())

        .pipe(gulp.dest(`${env.buildPath}/portal`))
})

/**
 * 删除文件夹
 * @param where
 * @returns {*}
 */
function doClean (where) {
    return gulp.src(where)

        .pipe(clean())
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

gulp.task('doRevReplace', function () {
    let deferred = Q.defer()
    taskLoader.fileVersion.doRevReplace({
        workPlace: `${env.buildPath}`
    })
    deferred.resolve()
    return deferred.promise
})

const dirMapper = {}

config.walkThrough(env.appPath, dirMapper)

////////////////////////////////////////////////////////////////////////////////////
//////////////汉皇重色思倾国，御宇多年求不得。          //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

let map = {
    normal: {},
    css: {}
}

Object.keys(dirMapper)
    .forEach((app) => {
        Object.keys(dirMapper[app])
            .forEach((subProject) => {
                if (Object.keys(dirMapper[app][subProject]).length) {
                    Object.keys(dirMapper[app][subProject])
                        .forEach((unit) => {
                            map.normal[`${app}/${subProject}/${unit}`] = `${app}/${env.boilerplatePath}`
                            // {route: '/admin/kccs/kccsv2', handle: serveStatic('./.temp/admin/_boilerplate')},
                            map.css[`/${app}/${subProject}/${unit}`] = `${env.cssTemp}/${app}/${env.boilerplatePath}`
                        })
                } else {
                    map.normal[`${app}/${subProject}`] = `${app}/${env.boilerplatePath}`
                    map.css[`/${app}/${subProject}`] = `${env.cssTemp}/${app}/${env.boilerplatePath}`
                }
            })
    })

/**
 * 业务逻辑开发服务器
 */
gulp.task('serve', ['less', 'less:admin:center:portal:login',
    // 'copyProjectConfig',
    'asignIndexAppName', 'collectInfo', 'stateMapper'], function () {

    let rewrites = []

    let rules = [
        serveStatic('./.temp'),

        // {route: '/play/styles', handle: serveStatic('G:\\Workplace\\Svn\\Prometheus\\开发库\\04集成与测试\\代码与实现\\lessonPlatform\\trunk\\.tmp\\styles')},
        // {route: '/play', handle: serveStatic('G:\\Workplace\\Svn\\Prometheus\\开发库\\04集成与测试\\代码与实现\\lessonPlatform\\trunk\\src')},

        taskLoader.playerApp,
        {route: '/portal/bower_components', handle: serveStatic('./bower_components')},
        function (req, res, next) {
            if (/webpage\/.?\.htm/.test(req.url)) {
                res.setHeader('Content-Type', 'text/html; charset=gb2312')
            }
            next()
        },
        function (req, res, next) {
            if (/\.*\?download$/.test(req.url)) {
                res.setHeader('Content-Disposition', 'attachment; filename="123456.pdf"')
                res.setHeader('Content-Type', 'application/octet-stream')
            }
            next()
        },
        //门户资料附件下载txt pdf格式
        function (req, res, next) {
            let hbTxtReg = /mfs\/resource\/file\/.+\.txt/,
                hbPdfReg = /mfs\/resource\/file\/.+\.pdf/
            if (hbTxtReg.test(req.url)) {
                res.setHeader('Content-Disposition', 'attachment; filename="' + encodeURIComponent('附件.txt') + '"')
                res.setHeader('Content-Type', 'application/octet-stream')
            }
            if (hbPdfReg.test(req.url)) {
                res.setHeader('Content-Disposition', 'attachment; filename="' + encodeURIComponent('附件.pdf') + '"')
                res.setHeader('Content-Type', 'application/octet-stream')
            }
            next()
        },

        {route: '/bower_components/player/dist', handle: serveStatic('http://192.168.1.186:1314/js/common')},
        {route: '/bower_components', handle: serveStatic('./bower_components')},


        {route: '/mfs', handle: serveStatic('z:\\')},
        {route: '/portal', handle: serveStatic('./.temp/portal')}
    ]


    let rewriteRules = []

    let ruleFrom = '^(?!(.*?^\/admin)|(.*?^\/login)|(.*?^\/center)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'
    let portalRule = '^(?!(.*?^\/admin)|(.*?^\/login)|(.*?^\/center)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'
    let adminRule = '^(?!(.*?^\/portal)|(.*?^\/login)|(.*?^\/center)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'
    let centerRule = '^(?!(.*?^\/admin)|(.*?^\/login)|(.*?^\/portal)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'
    let loginRule = '^(?!(.*?^\/admin)|(.*?^\/center)|(.*?^\/portal)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'

    config.proxies.forEach(function (proxy) {
        let proxyOptions = url.parse(proxy.target + ':' + proxy.port + proxy.context)
        proxyOptions.route = proxy.context
        proxyOptions.preserveHost = true
        rules.unshift(httpProxy(proxyOptions))
        rewriteRules.push(proxy.context)
    })

    rewriteRules.forEach(function (context) {
        let inLast = '|(.*?\/' + context.replace('/', '') + ')'
        ruleFrom += inLast
        //
        portalRule += inLast
        adminRule += inLast
        centerRule += inLast
        loginRule += inLast
    })

    let last = '|.*?(\.html|\.js|\.jpg|\.jpeg|\.json|\.png|\.php|\.css|\.woff|\.woff2|\.ttf|\.svg|\.eot|\.gif)).*?$'
    ruleFrom += last
    portalRule += last
    adminRule += last
    centerRule += last
    loginRule += last

    let context = ''
    rules.unshift(function (req, res, next) {
        // res.write('12313213')
        if (/main\.app\.js$/.test(req.url)) {
            let info = req.url.split('/')
            context = `${info[2]}/${info[3]}`
        }
        if (context) {
            req.url = req.url.replace(env.placeholder, context)
        }
        next()
    })

    Object.keys(map.css)

        .forEach((css) => {
            // rules.push({route: '/admin/kccs/kccsv2', handle: serveStatic('./.temp/admin/_boilerplate')})
            rules.push({route: css, handle: serveStatic(map.css[css])})
        })

    rules.push(function (req, res, next) {
        let url = req.url
        if (/^\/bower_components/.test(url)) {
            next()
            return
        }
        let temp = url.split('/')
        let _last = temp[temp.length - 1]
        if (_last === '' || !/\./.test(_last)) {
            url = url + '/index.html'
        }
        Object.keys(map.normal)
            .forEach((tm) => {
                if (!fs.existsSync(`${env.appPath}/${url.split('?')[0]}`)) {
                    url = url.replace(tm, map.normal[tm])
                }
            })
        if (fs.existsSync(`${env.appPath}/${url.split('?')[0]}`)) {
            send(req, `${env.appPath}/${url.split('?')[0]}`).pipe(res)
        } else {
            next()
        }
    })

    rewrites.push({
        // 不等于.js .html .png 不以/admin开头
        from: new RegExp(portalRule),
        to: '/portal/index.html'
    })

    rewrites.push({
        // 不等于.js .html .png 不以/admin开头
        from: new RegExp(adminRule),
        to: '/admin/index.html'
    })
    rewrites.push({
        // 不等于.js .html .png 不以/admin开头
        from: new RegExp(centerRule),
        to: '/center/index.html'
    })

    rewrites.push({
        // 不等于.js .html .png 不以/admin开头
        from: new RegExp(loginRule),
        to: '/login/index.html'
    })

    rules.unshift(taskLoader.historyApiFallback({
        verbose: config.rewriteRule.log,
        // disableDotRule: true,
        rewrites: rewrites
    }))

    serve('./app/', rules, {
        port: config.dev.port
    })

    // gulp.watch('app/**/*-state.js', ['stateMapper'])
    gulp.watch('app/!(admin|center|portal|login)/**/*.less', ['less'])

    gulp.watch('app/@(admin|center|portal|login)/**/*.less', ['less:admin:center:portal:login'])
    // 监听main.app.js的变化，将重新收集相关的信息.
    gulp.watch('app/**/main.app.js', ['collectInfo'])
    // 监听project.main.json的变化，将重新收集有用信息.
    // gulp.watch('app/portal/project.main.json', ['copyProjectConfig'])
})

/**
 * 静态文件开发服务器
 */
gulp.task('serve:static', ['directoryTree', 'less', 'less:admin:center:portal:login'], function () {
    let rules = [
        serveStatic('./html'),
        serveStatic('./app'),
        serveStatic('./.temp'),
        {route: '/portal', handle: serveStatic('./.temp/portal')},
        {route: '/bower_components', handle: serveStatic('./bower_components')}
    ]
    Object.keys(map.css)

        .forEach((css) => {
            // rules.push({route: '/admin/kccs/kccsv2', handle: serveStatic('./.temp/admin/_boilerplate')})
            rules.push({route: css, handle: serveStatic(map.css[css])})
        })

    let context = ''
    rules.unshift(function (req, res, next) {
        if (req.url.indexOf(env.placeholder) === -1) {
            let urlSplitter = req.url.split('/')
            context = urlSplitter.slice(2, urlSplitter.length - 2).join('/')
        }
        req.url = req.url.replace(env.placeholder, context)
        next()
    })

    rules.push(function (req, res, next) {
        let url = req.url
        if (/^\/bower_components/.test(url)) {
            next()
            return
        }
        let temp = url.split('/')
        let _last = temp[temp.length - 1]
        if (_last === '' || !/\./.test(_last)) {
            url = url + '/index.html'
        }
        Object.keys(map.normal)
            .forEach((tm) => {
                if (!fs.existsSync(`${env.appPath}/${url.split('?')[0]}`)) {
                    url = url.replace(tm, map.normal[tm])
                }
            })
        if (fs.existsSync(`${env.appPath}/${url.split('?')[0]}`)) {
            send(req, `${env.appPath}/${url.split('?')[0]}`).pipe(res)
        } else {
            next()
        }
    })

    serve('./html/', rules, {
        port: config.static.port
    })

    gulp.watch('app/**/*.less', ['less', 'less:admin:center:portal:login'])

    watch([config.html + '/**/*.html', '!' + config.html + '/**/index.html', '!' + config.html + '/**/index_another.html'], {
        events: ['add', 'unlink']
    }, function () {
        runSeque('directoryTree')
    })
    // gulp.watch([config.html + '/**/*.html', '!' + config.html + '/**/index.html', '!' + config.html + '/**/index_another.html'], ['directoryTree']);
})

/**
 * 静态文件开发服务器
 */
gulp.task('serve:example', function () {

    let proxyOptions = url.parse('http://192.168.1.208:18080/rest')
    proxyOptions.route = '/rest'
    proxyOptions.host = '192.168.1.208:18080'
    proxyOptions.via = '尼玛'
    proxyOptions.preserveHost = true

    serve('./examples', [
        httpProxy(proxyOptions),
        {route: '/bower_components', handle: serveStatic('./bower_components')}
    ], {
        port: 1212
    })
})

/**
 * 生产环境
 */
gulp.task('serve:dist', function () {
    let rules = [
        serveStatic(`${env.buildPath}/portal`),
        // { route: '/bower_components', handle: serveStatic ( './public/bower_components' ) },
        {route: '/mfs', handle: serveStatic('z:\\')}
        // { route: '/portal', handle: serveStatic ( './.temp/portal' ) }
    ]

    let rewriteRules = []
    config.proxies.forEach(function (proxy) {
        let proxyOptions = url.parse(proxy.target + ':' + proxy.port + proxy.context)
        proxyOptions.route = proxy.context
        proxyOptions.preserveHost = true
        rules.unshift(httpProxy(proxyOptions))
        rewriteRules.push(proxy.context)
    })
    let ruleFrom = '^(?!(.*?^\/admin)|(.*?^\/login)|(.*?^\/center)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'
    let portalRule = '^(?!(.*?^\/admin)|(.*?^\/login)|(.*?^\/center)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'
    let adminRule = '^(?!(.*?^\/portal)|(.*?^\/login)|(.*?^\/center)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'
    let centerRule = '^(?!(.*?^\/admin)|(.*?^\/login)|(.*?^\/portal)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'
    let loginRule = '^(?!(.*?^\/admin)|(.*?^\/center)|(.*?^\/portal)|(.*?^\/bower_components)|(.*?^\/play)|(.*?^\/mfs)'

    rewriteRules.forEach(function (context) {
        let inLast = '|(.*?\/' + context.replace('/', '') + ')'
        ruleFrom += inLast
        //
        portalRule += inLast
        adminRule += inLast
        centerRule += inLast
        loginRule += inLast
    })
    let last = '|.*?(\.html|\.js|\.jpg|\.jpeg|\.json|\.png|\.php|\.css|\.woff|\.woff2|\.ttf|\.svg|\.eot|\.gif)).*?$'
    ruleFrom += last
    portalRule += last
    adminRule += last
    centerRule += last
    loginRule += last
    let rewrites = []
    rewrites.push({
        // 不等于.js .html .png 不以/admin开头
        from: new RegExp(portalRule),
        to: '/portal/index.htm'
    })

    rewrites.push({
        // 不等于.js .html .png 不以/admin开头
        from: new RegExp(adminRule),
        to: '/admin/index.html'
    })

    rewrites.push({
        // 不等于.js .html .png 不以/admin开头
        from: new RegExp(centerRule),
        to: '/center/index.html'
    })

    rewrites.push({
        // 不等于.js .html .png 不以/admin开头
        from: new RegExp(loginRule),
        to: '/login/index.html'
    })
    
    rules.unshift(taskLoader.historyApiFallback({
        verbose: config.rewriteRule.log,
        // disableDotRule: true,
        rewrites: rewrites
    }))
    serve(`${env.buildPath}/`, rules, {
        port: config.test.port
    })
})


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

/***
 *
 * @param baseDir
 * @param middleware
 */
function serve (baseDir, middleware, options) {
    browserSync.init({
        open: false,
        port: options.port || 3000,
        // reloadOnRestart: true,
        server: {
            baseDir: baseDir,
            middleware: middleware || []
        }
    })
}
