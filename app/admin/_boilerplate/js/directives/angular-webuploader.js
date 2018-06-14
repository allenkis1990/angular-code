/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/19
 * 时间: 15:08
 *
 */

define(['@systemUrl@/js/const/global-constants', 'webuploader.flashonly', 'angular', 'lodash'], function (constant_, WebUploader, angular, _) {
    /**
     * 实例化的对象
     * @param $scope
     * @param $targetElement
     * @param targetAttributes
     * @constructor
     */
    function Hb_uploader ($scope, $targetElement, targetAttributes, $log, ngModelCtrl) {
        this.version = '0.0.0.1';
        this.$scope = $scope;
        this.$log = $log;
        this.$ngModelCtrl = ngModelCtrl;
        this.name = 'Hb_uploader';
        this.$targetElement = $targetElement;
        this.targetAttributes = targetAttributes;
        this.dependOn = 'webuploader';

        this.events = {
            /*
             * items {DataTransferItemList}DataTransferItem
             * 阻止此事件可以拒绝某些类型的文件拖入进来。目前只有 chrome
             * 提供这样的 API，且只能通过 mime-type 验证。
             */
            dndAccept: 'dndAccept',
            /*
             * param -- file {File}File对象
             *
             * 当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
             */
            beforeFileQueued: 'beforeFileQueued',
            /*
             * param --file {File}File对象
             *
             * 当文件被加入队列以后触发。
             */
            fileQueued: 'fileQueued',
            /*
             * param -- files {File}数组，内容为原始File(lib/File）对象。
             * 当一批文件添加进队列以后触发。
             */
            filesQueued: 'filesQueued',
            /*
             * param --file {File}File对象
             * 当文件被移除队列后触发。
             */
            fileDequeued: 'fileDequeued',
            /*
             * param --
             * 	当 uploader 被重置的时候触发
             */
            reset: 'reset',
            /*
             * param --
             * 当开始上传流程时触发。
             */
            startUpload: 'startUpload',
            /*
             * param --
             * 当开始上传流程暂停时触发。
             */
            stopUpload: 'stopUpload',
            /*
             * param --
             * 当所有文件上传结束时触发。
             */
            uploadFinished: 'uploadFinished',
            /*
             * param --file {File}File对象
             * 某个文件开始上传前触发，一个文件只会触发一次
             */
            uploadStart: 'uploadStart',
            /*
             * param --object {Object}
             *			data {Object}默认的上传参数，可以扩展此对象来控制上传参数。
             *			headers {Object}可以扩展此对象来控制上传头部。
             *	当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，
             *		大文件在开起分片上传的前提下此事件可能会触发多次。
             *
             */
            uploadBeforeSend: 'uploadBeforeSend',
            /*
             * param --object {Object}
             * 			ret {Object}服务端的返回数据，json格式，如果服务端不是json格式，从ret._raw中取数据，自行解析。
             * 当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。
             * 	如果此事件handler返回值为false, 则此文件将派送server类型的uploadError事件。
             */
            uploadAccept: 'uploadAccept',
            /*
             * param --file {File}File对象
             *			percentage {Number}上传进度
             * 上传过程中触发，携带上传进度。
             */
            uploadProgress: 'uploadProgress',
            /*
             * param --file {File}File对象
             *			reason {String}出错的code
             *	当文件上传出错时触发。
             */
            uploadError: 'uploadError',
            /*
             * param --file {File}File对象
             *			response {Object}服务端返回的数据
             *	当文件上传成功时触发。
             */
            uploadSuccess: 'uploadSuccess',
            /*
             * param --file {File} [可选]File对象
             * 	不管成功或者失败，文件上传完成时触发。
             */
            uploadComplete: 'uploadComplete',
            /*
             * param --type {String}错误类型。
             * 	当validate不通过时，会以派送错误事件的形式通知调用者。
             * 	通过upload.on('error', handler)可以捕获到此类错误，目前有以下错误会在特定的情况下派送错来。
             *
             *	Q_EXCEED_NUM_LIMIT 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值时派送。
             *	Q_EXCEED_SIZE_LIMIT 在设置了Q_EXCEED_SIZE_LIMIT且尝试给uploader添加的文件总大小超出这个值时派送。
             *	Q_TYPE_DENIED 当文件类型不满足时触发。。
             */
            error: 'error'
        };

        targetAttributes.auto = !targetAttributes.auto;
        this.defaultConfiguration = $.extend({}, {
            // {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
            // {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
            disableGlobalDnd: false, dnd: undefined,
            pick: {
                id: $targetElement || undefined,
                innerHTML: targetAttributes.buttonText || '选择文件',
                //{Boolean} 是否开起同时选择多个文件能力。
                multiple: false
            },
            //accept: {
            //	title: 'files',
            //	extensions: targetAttributes.accept || undefined
            //},
            auto: false,
            swf: constant_.webUploaderSwfDir, server: constant_.uploadUrl,
            // 上传最大并发数: 默认---3
            threads: 3
            ///* 可选 */
            //compress: {
            //	width: 1600, height: 1600,
            //	// 图片质量，只有type为`image/jpeg`的时候才有效。
            //	quality: 90,
            //	// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            //	allowMagnify: false,
            //	// 是否允许裁剪。
            //	crop: false,
            //	// 是否保留头部meta信息。
            //	preserveHeaders: true,
            //	// 如果发现压缩后文件大小比原来还大，则使用原来图片
            //	// 此属性可能会影响图片自动纠正功能
            //	noCompressIfLarger: false,
            //	// 单位字节，如果图片大小小于此值，不会采用压缩。
            //	compressSize: 0
            //}
        }, targetAttributes);

        this.__init();
    }

    Hb_uploader.prototype.__init = function () {
        /**
         * 适应三种类型的上传，
         *            1. 光图片上传
         *            2. 课件上传 (带进度条)
         *            3. 头像上传 (带剪切)
         * @type {this.defaultConfiguration}
         */
        this.uploaderInstance = WebUploader.create(this.defaultConfiguration);
        this.$targetElement.data('webuploader', this.uploaderInstance);
        __eventBinding.call(this);
    };

    function __eventBinding () {
        var that = this,
            instance = that.uploaderInstance;

        var uploadBtn = that.targetAttributes.uploadBtn || undefined;
        if (uploadBtn) {
            $('#' + uploadBtn).click(function (e) {
                instance.upload();
                e.preventDefault();
            });
        }
        /**
         * 当文件加入队列后触发的事件
         */
        instance.on(that.events.fileQueued, function (file) {
            var queueContainerId = that.queueContainerId = that.targetAttributes.queueContainerId,
                type = that.targetAttributes.type;
            if (!queueContainerId || type === 'image') {

            } else if (!queueContainerId || $('#' + queueContainerId).length <= 0) {
                this.$targetElement.append('');
            } else {
                var qc = $('#' + queueContainerId),
                    selectFile = {
                        fileName: file.name,
                        fileId: file.id,
                        fileType: '.' + file.ext,
                        fileSize: WebUploader.formatSize(file.size)
                    },
                    queueHtml = that.targetAttributes.itemTemplate ? that.$scope.$eval(that.targetAttributes.itemTemplate) : [
                        '<div id="${fileId}">',
                        '<span>${fileName}</span>',
                        '<span>${fileType}</span>',
                        '<span>${fileSize}</span>',
                        '<span>${fileSize}</span>',
                        '</div>'
                    ].join('');

                for (var prop in selectFile) {
                    queueHtml = queueHtml.replace(new RegExp('\\$\\{' + prop + '\\}', 'g'), selectFile[prop]);
                }
                qc.append(queueHtml);
            }
        });

        instance.on(that.events.uploadProgress, function (file, percentage) {
            that.$log.log('%c********************uploadProgress******************************', 'color:red;');
            that.$log.log(file);
            that.$log.log(percentage);
            that.$log.log('**************************************************');
        });

        instance.on(that.events.uploadError, function (code) {
            that.$log.log('%c********************uploadError******************************', 'color:red;');
            that.$log.log(file);
            that.$log.log(percentage);
            that.$log.log('**************************************************');
        });

        instance.on(that.events.uploadComplete, function (file) {
            that.$log.log('%c********************uploadComplete******************************', 'color:red;');
            that.$log.log(file);
            that.$log.log('**************************************************');
        });

        /**
         * 为其设定
         * type:
         *        image|files
         */
        instance.on(that.events.uploadSuccess, function (file, response) {
            // 标示为上传图片的时候处理方式
            if (that.targetAttributes.type === 'image' && that.targetAttributes.queueContainerId) {
                var imageContainer = $('#' + that.queueContainerId),
                    isImageTag = imageContainer[0].tagName === 'IMG' ? true : false,
                    uploadedNewPath = angular.fromJson(response)['newPath'];
                imageContainer = isImageTag ? imageContainer : imageContainer.find('img');
                imageContainer.attr('src', constant_.showImageUrl + uploadedNewPath);

                // *************************
                that.$ngModelCtrl.$setViewValue(response);
                // *************************
            } else if (that.targetAttributes.type === 'files') {
                // 当为files的时候

            }

            // 重置上传插件
            instance.reset();


        });

        instance.on(that.events.uploadStart, function (file) {
            that.$log.log('%c********************uploadStart******************************', 'color:red;');
            that.$log.log(file);
            file.name = '亡灵走秀.' + file.ext;
            that.$log.log('**************************************************');
        });

        instance.on(that.events.beforeFileQueued, function (file) {
            that.$log.log('%c********************beforeFileQueued******************************', 'color:red;');
            that.$log.log(file);
            that.$log.log('**************************************************');
            var selectExist = __checkExist(instance, file);
            if (selectExist) {
                alert('已经有选中的文件在队列中!');

            }
        });
    }

    function __checkExist (instance, file) {
        var files = instance.getFiles();
        // 如果选中的文件当中的数组的索引小于等于0的话，返回false --- 选中的文件没有在队列中
        if (files.length <= 0) return false;

        var result = _.find(files, function (__file__) {
            return __file__.name === file.name;
        });
        // 如果查询到的对象不为undefined就是存在
        return typeof result !== 'undefined';
    }

    /**
     * 创建模块
     * @type {module}
     */
    var webUploaderModule = angular.module('ngWebUploader', []),

        /**
         * 指令返回的数组
         * @type {*[]}
         */
        webUploaderDirective = ['$timeout', '$compile', '$log',
            function ($timeout, $compile, $log) {
                return {
                    require: 'ngModel',
                    restrict: 'A',

                    /**
                     * 链接函数
                     * @param scope 作用域
                     * @param element 元素
                     * @param attributes 属性
                     * @param ngModelCtrl 控制器
                     */
                    link: function (scope, element, attributes, ngModelCtrl) {
                        if (!ngModelCtrl) {
                            throw new Error('元素节点上面必须要有ngModel指定对象!');
                        }
                        $timeout(function () {
                            new Hb_uploader(scope, element, attributes, $log, ngModelCtrl);
                        });
                    }
                };
            }];

    webUploaderModule.directive('webuploader', webUploaderDirective);
});

