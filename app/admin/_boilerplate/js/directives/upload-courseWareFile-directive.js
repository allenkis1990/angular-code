/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/19
 * 时间: 15:08
 *
 */

define(['@systemUrl@/js/const/global-constants', 'webuploader', 'angular', 'lodash'], function (constant_, WebUploader, angular, _) {
    'use strict';

    /**
     * 实例化的对象
     * @param $scope
     * @param $targetElement
     * @param targetAttributes
     * @constructor
     */
    function Course_Ware_uploader ($scope, $targetElement, targetAttributes,
                                   $log, ngModelCtrl, $timeout, $compile,
                                   $rootScope,
                                   CourseWareUploaderFactory, uploadFileCollections, services) {
        this.version = '0.0.0.1';
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.services = services;
        this.$scope = $scope;
        this.$log = $log;
        this.$ngModelCtrl = ngModelCtrl;
        this.name = 'Course_Ware_uploader';
        this.$targetElement = $targetElement;
        this.targetAttributes = targetAttributes;
        this.CourseWareUploaderFactory = CourseWareUploaderFactory;
        this.uploadFileCollections = uploadFileCollections;
        this.$rootScope = $rootScope;
        this.events = {
            beforeFileQueued: 'beforeFileQueued', fileQueued: 'fileQueued', fileDequeued: 'fileDequeued',
            uploadFinished: 'uploadFinished',
            uploadStart: 'uploadStart', uploadProgress: 'uploadProgress', uploadError: 'uploadError',
            uploadSuccess: 'uploadSuccess', uploadComplete: 'uploadComplete', error: 'error'
        };

        this.defaultConfiguration = $.extend({}, {
            pick: {
                id: $targetElement,
                innerHTML: targetAttributes.buttonText || '选择文件',
                multiple: false
            },
            formData: {
                context: $rootScope.uploadConfigOptions.context,
                requestContext: $rootScope.uploadConfigOptions.requestContext
            },
            compress: false,
            prepareNextFile: true,
            accept: {
                title: 'files',
                //extensions: 'doc,docx,xls,xlsx,ppt,pdf,txt,flv,mp4,avi,mpeg,mpg,wmv,zip'
                extensions: 'flv,mp4,avi,mpeg,mpg,wmv,rmvb,mkv,zip,pdf,ppt,pptx,txt,doc,docx,xls,xlsx'
            },
            timeout: 0,
            auto: false,
            //fileNumLimit:1,
            swf: constant_.webUploaderSwfDir,
            threads: 1
        }, targetAttributes);

        this.__init();
    }

    Course_Ware_uploader.prototype.__init = function () {
        this.md5Object = new WebUploader.Runtime.Html5.Md5({});
        this.checkIsBigFile = function (fileSize) {
            // 大于10m的统一是大文件
            return fileSize >= 10 * 2;
        };

        this.isIe = function () {
            return (function (ua) {
                var ie = ua.match(/MSIE\s([\d\.]+)/) ||
                    ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i);
                return ie && parseFloat(ie[1]);
            })(navigator.userAgent);
        };

        this.uploadUseInfo = {};
        this.uploadUseInfo.md5CheckUrl = this.$rootScope.uploadConfigOptions.md5CheckUrl;
        //.replace ( 'http://172.17.1.102:8080/bdResource', 'http://192.168.1.99:8080/resource-web' );
        this.uploadUseInfo.blockMd5CheckUrl = this.$rootScope.uploadConfigOptions.blockMd5CheckUrl;
        //.replace ( 'http://172.17.1.102:8080/bdResource', 'http://192.168.1.99:8080/resource-web' );
        this.uploadUseInfo.uploadBigFileUrl = this.$rootScope.uploadConfigOptions.uploadBigImageUrl;
        //.replace ( 'http://172.17.1.102:8080/bdResource', 'http://192.168.1.99:8080/resource-web' );
        this.uploadUseInfo.uploadSmallFileUrl = this.$rootScope.uploadConfigOptions.uploadImageUrl;
        //.replace ( 'http://172.17.1.102:8080/bdResource', 'http://192.168.1.99:8080/resource-web' );
        this.uploaderInstance = {};
        var flashMode = this.isIe();
        var that = this;
        if (!this.CourseWareUploaderFactory.registed) {
            registerEvent();
        }

        this.defaultConfiguration.server = this.uploadUseInfo.uploadSmallFileUrl;

        if (!this.isIe() && this.targetAttributes.standard === 'big') {
            this.defaultConfiguration.server = this.uploadUseInfo.uploadBigFileUrl;
        }
        if (flashMode) {
            this.defaultConfiguration.runtimeOrder = 'flash';
        } else {
            if (this.targetAttributes.standard === 'big') {
                this.defaultConfiguration.chunked = true;
                this.defaultConfiguration.chunkRetry = 0;//启用分片
                this.defaultConfiguration.chunkSize = 52428800;//分片大小50MB
            }
        }

        this.uploaderInstance = WebUploader.create(this.defaultConfiguration);
        this.$scope.uploadFileInstances = this.$scope.uploadFileInstances || [];
        if (that.targetAttributes.id) {
            this.$scope.uploadFileInstances.push({
                fileInstanceId: that.targetAttributes.id,
                instance: this.uploaderInstance
            });
        }
        __eventBinding.call(this);

        function uploadComplete (file, response) {
            that.uploaderInstance.trigger('uploadProgress', file, 1);
            that.uploaderInstance.trigger('uploadComplete', file);//触发已上传事件
            that.uploaderInstance.trigger('uploadSuccess', file, response);//触发上传成功事件
            that.uploaderInstance.trigger('uploadFinished', file);//触发上传完成事件
        }

        function _log (msg) {
            that.$log.log('%c' + msg, 'color:gray;font-weight:bold;font-size:16px;background:pink;');
        }

        this._log = _log;

        /**
         * 文件生命过程
         * file.liveStatus {
         *                  -2   --> 处理失败
         *                  -1,  --> 上传失败
         *                  0,   --> 文件添加到队列当中，并没有做任何操作
         *                  1,   --> 文件正在执行整个文件的md5File操作
         *                  2,   --> 整个文件的md5File成功准备上传
         *                  3,   --> 文件上传百分比完成，等待服务器响应
         *                  4    --> 文件上传百分比完成并且服务器响应成功
         *               }
         */
        function registerEvent () {
            that.CourseWareUploaderFactory.registed = true;
            WebUploader.Uploader.register(
                {
                    'before-send-file': 'beforeSendFile',
                    'before-send': 'beforeSend'
                }, {
                    beforeSendFile: function (file) {// 在文件开始发送前进行MD5校验异步操作。是否可以秒传钩子要在create之前注册
                        var task = $.Deferred(),
                            fileSize = file.size;
                        file.guid = WebUploader.Base.guid();
                        that.$timeout(function () {
                            file.liveStatus = 1;
                        });
                        // 如果文件大小不超过10M的直接不执行md5或者断点续传，或者分片上传
                        if (that.checkIsBigFile(fileSize) && !that.isIe()) {
                            _log('文件大于10m并且不是ie下面运行....将执行文件的md5计算...');
                            file.beginMd5Timing = new Date().getTime();
                            //that.uploaderInstance.md5File ( file )
                            //	.progress ( function ( percentage ) {
                            //		if ( percentage * 100 === 100 ) {
                            //			that.$timeout ( function () {
                            //				file.liveStatus = 2;
                            //			} )
                            //		}
                            //		that.$timeout ( function () {
                            //			file.fileMd5 = (percentage * 100).toFixed ( 2 ) + '%';
                            //		} )
                            //} ).then ( function ( md5Result ) {
                            file.endMd5Timing = new Date().getTime();
                            //_log ( 'md5File完成,准备上传......结果...' + md5Result );
                            //file.md5 = md5Result;
                            file.md5 = that.md5Object.md5String([file.lastModifiedDate.getTime(), file.name, file.size].join('-'));
                            if (file.size > 10485760) {
                                $.ajax({
                                    type: 'post',
                                    url: that.uploadUseInfo.md5CheckUrl,
                                    data: {
                                        md5: file.md5,
                                        guid: file.guid,
                                        context: that.$rootScope.uploadConfigOptions.context,
                                        requestContext: that.$rootScope.uploadConfigOptions.requestContext,
                                        originalFileName: file.name
                                    },
                                    cache: false,
                                    dataType: 'json',
                                    success: function (data) {
                                        if (data.exists) {   //若存在，这返回失败给WebUploader，表明该文件不需要上传
                                            _log('文件已经被上传过了，直接跳过上传，设置进度为百分百');
                                            uploadComplete(file, data);
                                            that.uploaderInstance.skipFile(file);
                                            task.reject();
                                            file.newPath = data.newPath;
                                        } else {
                                            task.resolve();
                                        }
                                    },
                                    error: function () {
                                        task.resolve();
                                    }
                                });
                            } else {
                                task.resolve();
                            }
                            //} );
                        } else {
                            that.$timeout(function () {
                                file.liveStatus = 2;
                            });
                            task.resolve();
                        }
                        return $.when(task);
                    },
                    beforeSend: function (block) {//分片文件发送之前计算分片文件的MD5,并且验证该分片是否需要上传
                        var task = $.Deferred();
                        if (that.checkIsBigFile(block.file.size) && !that.isIe()) {
                            //that.uploaderInstance.md5File ( block.file, block.start, block.end )
                            //	.then ( function ( md5Result ) {
                            //	_log ( '文件第' + block.chunk + '分片md5计算结果...' + md5Result );
                            block.file.chunkMd5 = that.md5Object.md5String([block.file.lastModifiedDate.getTime(), block.file.name, block.chunk, block.file.size].join('-'));
                            //block.file.chunkMd5 = md5Result;//将md5值赋值给相应文件的md5属性
                            var data = {
                                    md5: block.file.md5,
                                    guid: block.file.guid,
                                    originalFileName: block.file.name + '.' + block.file.ext,
                                    context: that.$rootScope.uploadConfigOptions.context,
                                    requestContext: that.$rootScope.uploadConfigOptions.requestContext,
                                    size: block.file.size
                                },
                                chunks = block.chunks,
                                chunk = block.chunk;
                            if (chunks > 1) {
                                data.chunks = chunks;//分片数
                                data.chunk = chunk;//当前分片号
                                data.chunkMd5 = block.file.chunkMd5;//分片文件的md5
                                data.chunkSize = block.blob.size;//分片文件大小
                                $.ajax({
                                    type: 'post',
                                    url: that.uploadUseInfo.blockMd5CheckUrl,
                                    data: data,
                                    cache: false,
                                    dataType: 'json',
                                    success: function (data) {
                                        if (data.exists) {
                                            task.reject();
                                        } else {
                                            task.resolve();
                                        }
                                    },
                                    error: function (xrh) {
                                        task.resolve();
                                    }
                                });
                            } else {
                                task.resolve();
                            }
                            //} )
                        } else {
                            task.resolve();
                        }
                        return $.when(task);
                    }
                });
        }
    };

    function __eventBinding () {
        var that = this,
            instance = that.uploaderInstance;
        that.$scope.Hb_uploadFile = function () {
            var file = instance.getFiles();
            if (file.length <= 0) {
                that.$scope.globle.showTip('请选择要上传的文件!', 'error');
            } else {
                instance.upload();
            }
        };

        that.$scope.Hb_deleteFile = function (file, flag) {
            if (flag) {
                if (file.record) {
                    _.remove(that.$ngModelCtrl.$viewValue, function (item) {
                        return item.id === file.id;
                    });
                    angular.forEach(that.$scope.model.coursewareList, function (data) {
                        if (data.id == file.id) {
                            data.select = false;
                            return false;
                        }
                    });
                    return false;
                }
                /**
                 * 移除文件， 后面的参数表示从queue中一并移除
                 */
                instance.removeFile(file, true);
            } else {
                that.$scope.globle.confirm('提示', '是否需要删除课件文件', function () {

                    if (file.record) {
                        _.remove(that.$ngModelCtrl.$viewValue, function (item) {
                            return item.id === file.id;
                        });
                        angular.forEach(that.$scope.model.coursewareList, function (data) {
                            if (data.id == file.id) {
                                data.select = false;
                                return false;
                            }
                        });
                        return false;
                    }
                    /**
                     * 移除文件， 后面的参数表示从queue中一并移除
                     */
                    instance.removeFile(file, true);
                });
            }

        };

        /**
         * 当文件加入队列后触发的事件
         */
        instance.on(that.events.fileQueued, function (file) {
            file.ufCollectionIndex = that.uploadFileCollections.addUf(file);

            that.$timeout(function () {
                var fileExt = file.ext,
                    mediaFormatSuffix = 'flv avi rmvb rm asf divx mpg mpeg mpe wmv mp4 mkv vob';
                file.progress = 0;
                file.type = getType(file.ext);
                file.fileName = file.name;
                file.formatSize = WebUploader.formatSize(file.size);
                file.uploadSuccess = false;
                file.liveStatus = 0;
                that.$ngModelCtrl.$viewValue.push(file);
                that._log('文件<<<<' + file.name + '>>>>>被加入到上传队列中');
                if (mediaFormatSuffix.indexOf(fileExt) == -1) {
                    that.$scope.Hb_uploadFile();
                }
            });

        });

        instance.on(that.events.uploadProgress, function (file, percentage) {
            that.$timeout(function () {
                file.progress = percentage === 1 ? 100 : (percentage * 100).toFixed(2);
                if (file.progress === 100) {
                    file.liveStatus = 3;
                    that._log('文件<<<<' + file.name + '>>>>>上传进度执行到100%');
                }
            });
        });

        /**
         * 为其设定
         * type:
         *        image|files
         */
        instance.on(that.events.uploadSuccess, function (file, response) {
            that.uploadFileCollections.deleteUf(file.ufCollectionIndex);
            that.$timeout(function () {
                file.endUploadTiming = new Date().getTime();
                that._log('文件<<<<' + file.name + '>>>>>上传成功');
                file.liveStatus = 4;
                file.successUploadTime = new Date().getTime();
                var obj = angular.fromJson(response);
                if (angular.isObject(obj)) {
                    that.$scope.model.courseWare.videoClarityList = file.videoClarityList;
                    that.$scope.model.courseWare.courseWareResourcePath = obj.newPath;
                    file.courseWareResourcePath = obj.newPath;
                    that.$scope.a = obj.newPath;
                    that.$scope.model.courseWare.expandData = file.name;
                    that.$scope.$apply();
                }
            });
        });

        //文件上传之前加上guid和md5,有分片的包括分片的md5
        instance.on('uploadBeforeSend', function (object, data, headers) {
            // 保持与服务器的通信

            if ((that.checkIsBigFile(object.file.size) || that.targetAttributes.standard === 'big') && !that.isIe()) {
                that._log('文件<<<<' + object.file.name + '>>>>>执行上传之前的配置设置');
                var chunks = object.chunks,
                    chunk = object.chunk;
                data.guid = object.file.guid;//整个文件guid
                data.md5 = object.file.md5;//整个文件的md5
                data.originalFileName = object.file.name + '.' + object.file.ext;//原文件名
                if (chunks > 1) {//有分片的时候要把分片数以及当前分片号,以及分片的md5和当前分片的大小传上去
                    data.chunks = chunks;//分片数
                    data.chunk = chunk;//当前分片号
                    data.chunkMd5 = object.file.chunkMd5;//分片文件的md5
                    data.chunkSize = object.blob.size;//分片文件大小
                    that._log('文件总共.....' + chunks + '片..当前上传第' + data.chunk + '分片...');
                }
            }
        });

        instance.on(that.events.uploadStart, function (file) {
            file.beginUploadTiming = new Date().getTime();
        });

        instance.on(that.events.error, function (error) {
            var msg = '';
            switch (error) {
                case 'Q_TYPE_DENIED':
                    msg = '文件格式不支持!';
                    break;
                case 'Q_EXCEED_NUM_LIMIT':
                    msg = '只支持单个文件上传';
                    break;
            }

            that.$scope.globle.showTip(msg, 'error');
        });

        instance.on(that.events.beforeFileQueued, function (file) {

            var selectExist = __checkExist(instance, file),
                fileExt = file.ext,
                mediaFormatSuffix = 'flv avi rmvb rm asf divx mpg mpeg mpe wmv mp4 mkv vob',
                repeat = false,
                name = file.name.substring(0, file.name.lastIndexOf('.')),
                exist = mediaFormatSuffix.indexOf(fileExt),
                isIe = that.isIe(), // 判断是否为ie
                isBigFile = that.checkIsBigFile(file.size); // 判断文件规格是否是大文件范围

            if (that.$ngModelCtrl.$viewValue.length != 0) {
                that.$scope.globle.showTip('请先删除原始文件', 'information');
                return false;
            }

            if (1610612736 < file.size && isIe) {
                that.$scope.globle.showTip('想体验超爽超大文件上传，请用chrome或者firefox主流浏览器....', 'information');
                return false;
            }

            if (isBigFile && that.targetAttributes.standard !== 'big' && !isIe) {
                that.$scope.globle.showTip('当前上传文件大小定义属于大文件，请配置规格standard为big模式.....', 'error');
                return false;
            }

            if (that.targetAttributes.standard === 'big' && !isBigFile && !isIe) {
                that.$scope.globle.showTip('当前上传文件大小定义属于小文件，请配置规格standard为small模式或者不配置.....!', 'error');
                return false;
            }

            if (selectExist) {
                that.$scope.globle.showTip('已经有选中的文件在队列中!', 'error');
                return false;
            }
            if (exist !== -1) {
                file.formatSize = WebUploader.formatSize(file.size);
                that.$scope.$$file = file;
                that.$scope.$$file.videoClarityList = [];
                that.$scope.__choose_media_options = {
                    title: false, resizable: false, draggable: false, modal: true, width: 402, height: 445,
                    open: function (e) {
                        var $this = this.element,
                            $parent = $this.parent();
                        $parent.css({
                            top: '50%', left: '50%',
                            marginTop: '-' + (410 / 2) + 'px',
                            marginLeft: '-' + (400 / 2) + 'px', position: 'fixed!important'
                        });
                    },
                    content: '@systemUrl@/templates/common/choose-media.html'
                };
                that.$scope.checkBoxCheck = function (e) {
                    if (e.currentTarget.checked) {
                        that.$scope.$$file.videoClarityList.push(e.currentTarget.value);
                    } else {
                        var index = that.$scope.$$file.videoClarityList.indexOf(e.currentTarget.value);
                        that.$scope.$$file.videoClarityList.splice(index, 1);
                    }
                };
                that.$scope.checkSpan = function (e) {
                    var s = $(e.target).prev();
                    if (s.is(':checked')) {
                        var index = that.$scope.$$file.videoClarityList.indexOf(s.val());
                        that.$scope.$$file.videoClarityList.splice(index, 1);
                        s.prop('checked', false);
                    } else {
                        that.$scope.$$file.videoClarityList.push(s.val());
                        s.prop('checked', true);
                    }
                };

                that.$scope.closeWindow = function () {
                    instance.removeFile(that.$scope.$$file, true);
                    that.$scope.__choose_media_window.close();
                };

                that.$scope.saveAddToQueue = function () {
                    if (that.$scope.$$file.videoClarityList == null || that.$scope.$$file.videoClarityList.length == 0) {
                        that.$scope.globle.showTip('请选择转码参数!', 'error');
                        return false;
                    }
                    that.$scope.Hb_uploadFile();
                    ;
                    that.$scope.__choose_media_window.close();

                };
                $('html').append(that.$compile('<div kendo-window="__choose_media_window" k-options="__choose_media_options"></div>')(that.$scope));
            }
        });

        /**
         * 文件从队列中被删除
         */
        instance.on(that.events.fileDequeued, function (file) {
            that.uploadFileCollections.deleteUf(file.ufCollectionIndex);
            that._log('文件<<<<' + file.name + '>>>>>从队列中删除');
            that.$timeout(function () {
                that.$scope.model.courseWare.courseWareResourcePath = '';
                that.$scope.model.courseWare.expandData = '';
                that.$scope.model.courseWare.videoClarityList = [];
                that.$scope.model.courseWare.videoClarityList.length = 0;
                var hash = file.__hash;
                _.remove(that.$ngModelCtrl.$viewValue, function (item) {
                    return item.__hash === hash;
                });
            });
        });

        instance.on(that.events.uploadError, function (file, reason, some) {

            that.$log.error(file, reason, some);

        });

        that.$scope.$on('$destroy', function () {
            // 当整个作用域被干掉的时候， 也要干掉正在上传的文件。
            instance.stop(true);
        });
    }

    function __checkExist (instance, file) {
        var files = instance.getFiles();
        // 如果选中的文件当中的数组的索引小于等于0的话，返回false --- 选中的文件没有在队列中
        if (files.length <= 0) return false;

        var result = _.find(files, function (__file__) {
            return __file__.name === file.name
                && __file__.size === file.size
                && file.ext === __file__.ext;
        });

        // 如果查询到的对象不为undefined就是存在
        return typeof result !== 'undefined';
    }

    /**
     * 获取上传课件的类型 1为文档、2为视频、3压缩类型
     * @param data
     */
    function getType (data) {
        // doc,docx,xls,xlsx,ppt,pdf,txt,flv,mp4,avi,mpeg,mpg,wmv,zip
        if (data == 'zip') {
            return 3;
        } else if (data == 'doc' || data == 'docx' || data == 'xls' || data == 'xlsx' || data == 'ppt' || data == 'pptx' || data == 'txt' || data == 'pdf') {
            return 1;
        } else {
            return 2;
        }
    }

    /**
     * 创建模块
     * @type {module}
     */
    var webUploaderDirective = ['$timeout', '$compile', '$log', '$rootScope', 'CourseWareUploaderFactory', 'uploadFileCollections', '$interval', '$http',
        function ($timeout, $compile, $log, $rootScope, CourseWareUploaderFactory, uploadFileCollections, $interval, $http) {
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
                    CourseWareUploaderFactory.keepSessionCommunication();

                    if (!ngModelCtrl) {
                        throw new Error('元素节点上面必须要有ngModel指定对象!');
                    }

                    $timeout(function () {
                        new Course_Ware_uploader(scope, element, attributes, $log,
                            ngModelCtrl, $timeout, $compile, $rootScope, CourseWareUploaderFactory,
                            uploadFileCollections, {
                                $interval: $interval,
                                $http: $http
                            });
                    }, 100);

                    scope.$on('$destroy', function () {
                        CourseWareUploaderFactory.closeSessionCommunication();
                    });
                }
            };
        }];

    var hbWebuploader = angular.module('hb.courseWareUploader', []);

    hbWebuploader.directive('uploadCourseWare', webUploaderDirective);

    hbWebuploader.factory('CourseWareUploaderFactory', ['$http', '$interval', '$log', function ($http, $interval, $log) {
        var CourseWareUploaderFactory = {};
        var dev = true;
        CourseWareUploaderFactory.registed = false;
        CourseWareUploaderFactory.keepOnLineTime = 600000; //保持10分钟一次通信
        CourseWareUploaderFactory.keepOnLineUrl = dev ? 'http://' + window.location.hostname + ':' + window.location.port + '/web/login/login/getUserInfo.action' : '../web/login/login/getUserInfo.action';
        CourseWareUploaderFactory.keepSessionInterval = null;

        function communicate () {
            $http.get(CourseWareUploaderFactory.keepOnLineUrl, function (data) {
            });
        }

        CourseWareUploaderFactory.closeSessionCommunication = function () {
            $log.info('关闭与服务器的通信!' + new Date().toLocaleString());
            $interval.cancel(this.keepSessionInterval);
            this.keepSessionInterval = null;
        };
        CourseWareUploaderFactory.keepSessionCommunication = function () {
            if (!this.keepSessionInterval) {
                communicate();

                $log.info('开始与服务器保持通信，避免在上传过程中session出现失效导致上传大文件不能及时保存!' + new Date().toLocaleString());
                this.keepSessionInterval = $interval(function () {
                    $log.info('与服务器通信中......当前通信时间为' + new Date().toLocaleString());
                    communicate();
                }, CourseWareUploaderFactory.keepOnLineTime);
            }
        };
        return CourseWareUploaderFactory;
    }]);
});

