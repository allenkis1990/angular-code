/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/17
 * 时间: 17:30
 *
 */
define(['angular'], function (angular) {
    'use strict';

    angular.module('HB_notifications', ['hb.util'])
        .factory('HB_notification', __HB_notification)
        .directive('hbNotificationConfirm', HB_confirm)
        .directive('hbNotificationModuleDialog', Hb_ModuleDialog)
        .directive('hbNotificationTip', Hb_tip)
        .directive('hbNotificationErrorTip', Hb_error_tip)
        .directive('hbNotificationAlert', HB_alert)
        .directive('hbNotificationContent', Hb_ContentDialog)
        .directive('hbNotification', Hb_notificationParent);

    __HB_notification.$inject = ['$compile', '$rootScope'];

    function __HB_notification ($compile, $rootScope) {
        var notificationService = {};

        notificationService.tips = [];

        function createModuleDialog (_scope, templateUrl) {
            notificationService.templateUrl = templateUrl || 'templates/common/temp.html';
            var domHtml = '<div hb-notification class="hb-notification"><div hb-notification-module-dialog></div></div>',
                compiled = $compile(domHtml),
                linkFn = compiled(_scope);
            angular.element('body').append(linkFn);
        }

        function createContentDialog (_scope, title, contentUrl, options) {
            notificationService.contentDialogOptions = options;
            $rootScope.TIP_TITLE = title || '提示';
            notificationService.contentDialogContentUrlTemplate = contentUrl || 'templates/common/temp.html';
            var domHtml = '<div hb-notification class="hb-notification"><div class="mark"></div><div hb-notification-content></div></div>',
                compiled = $compile(domHtml),
                linkFn = compiled(_scope);
            angular.element('body').append(linkFn);
        }

        function createDom (type, msg, arg) {
            var domHtml = '<div hb-notification class="hb-notification">';
            if (!angular.equals('tip', type)) {
                $rootScope.TIP_TYPE = undefined;
            }
            switch (type) {
                case 'alert':
                    domHtml += '<div class="mark"></div><div hb-notification-alert></div>';
                    break;
                case 'confirm':
                    domHtml += '<div class="mark"></div><div hb-notification-confirm></div>';
                    break;
                case 'tip':
                    domHtml += '<div hb-notification-tip></div>';
                    break;
            }
            domHtml += '</div>';
            var compiled = $compile(domHtml),
                linkFn = compiled($rootScope);
            $rootScope.TIP_TITLE = '提示';
            $rootScope.TIP_MSG = msg;

            if (!angular.isFunction(arg) && !angular.equals('confirm', type)) {
                arg ? (function () {
                    $rootScope.TIP_TYPE = arg;
                })() : undefined;
            } else {
                notificationService.confirmCallBackFunction = arg;
            }

            angular.element('body').append(linkFn);
        }

        notificationService.alert = function (msg) {
            if (!notificationService.alertInShow) {
                createDom('alert', msg);
            }
        };

        notificationService.confirm = function (msg, confirmFn) {
            if (!notificationService.confirmInShow) {
                createDom('confirm', msg, confirmFn);
            }
        };

        notificationService.showTip = function (msg, tipType) {
            createDom('tip', msg, tipType);
        };

        notificationService.content = function (_scope, title, contentUrl, options) {
            $rootScope.TIP_TYPE = undefined;
            createContentDialog(_scope, title, contentUrl, options);
        };

        notificationService.moduleDialog = function (_scope, templateUrl) {
            createModuleDialog(_scope, templateUrl);
        };

        notificationService.add500Error = function ($scope, response) {
            response.title = response.title ? response.title : '错误信息';
            notificationService.errors.push(response);
            $scope.$emit('event:error_5oo_add_error', response);
        };

        notificationService.showLoadingMask = function ($target, content) {
            if ($target.$$maskElement) {
                $target.$$maskElement.remove();
            }
            $target.$$maskElement = angular.element('<div class="menu-loading-mark" ng-if="model.menuList.length <= 0">' +
                '<div class="menu-loading-mark-bg"></div>' +
                '<div class="menu-loading-mark-img">' +
                '<img src="images/loading.gif" width="40" height="40" alt=""/>' +
                '</div>' +
                '</div>');
            $target.append($target.$$maskElement);
        };

        notificationService.hideLoadingMask = function ($target) {
            $target.$$maskElement.remove();
        };

        notificationService.errors = [];

        notificationService.show500Error = function () {
            if (!notificationService.Tip500ErrorDom) {
                notificationService.Tip500ErrorDom = angular.element('<div hb-notification class="hb-notification"><div hb-notification-error-tip></div></div>');
                var compiled = $compile(notificationService.Tip500ErrorDom),
                    linkFn = compiled($rootScope);
                angular.element('body').append(linkFn);
            }
        };

        return notificationService;
    }

    /**
     * 顶层的窗口指令
     * @type {Array}
     */
    Hb_notificationParent.$inject = ['HB_notification', '$timeout', '$q', 'hbUtil'];

    function Hb_notificationParent (HB_notification, $timeout, $q, hbUtil) {
        return {
            controller: function ($scope, $element) {
                var _this = this;
                $scope.fadeIn = true;
                this.closeWindow = function () {
                    // 如果是ie8则没有动画效果，延迟0秒关闭
                    // 如果不是ie8 ， 延迟0.5秒关闭这个窗口

                    var timerSpeed = hbUtil.isIe() && hbUtil.isIe() <= 8 ? 0 : 500;
                    HB_notification.alertInShow = false;
                    HB_notification.confirmInShow = false;
                    // 取消关闭窗口的定时事件
                    $timeout.cancel($element.closeWindowTimer);
                    $scope.fadeIn = !$scope.fadeIn;

                    // 窗体加上动画效果
                    var queryedDialog = HB_notification.openWindow.find('.dialog');
                    queryedDialog.addClass('fadeOutUp').removeClass('fadeInDown');

                    // 设置0.5秒或者0秒后关闭这个窗口
                    $element.closeWindowTimer = $timeout(function () {
                        HB_notification.openWindow.remove();
                    }, timerSpeed).$$timeoutId;
                };

                this.doRightClose = function () {
                    HB_notification.alertInShow = false;
                    HB_notification.confirmInShow = false;
                    HB_notification.openWindow.remove();
                };

                this.confirmCertain = function () {
                    if (!HB_notification.confirmCallBackFunction) {
                        return false;
                    }

                    if (HB_notification.confirmCallBackFunction
                        && angular.isFunction(HB_notification.confirmCallBackFunction)) {
                        _this.doRightClose();
                        HB_notification.confirmCallBackFunction();
                    } else {
                        _this.closeWindow();
                    }
                };

                function clearTips () {
                    angular.forEach(HB_notification.tips, function (item) {
                        item.remove();
                    });
                    HB_notification.tips = [];
                }

                this.center = function ($dialog) {
                    var duration = hbUtil.isIe() && hbUtil.isIe() <= 8 ? 0 : 500;
                    $dialog.hide();
                    $timeout(function () {

                        var elementWidth = $dialog.width(),
                            elementHeight = $dialog.height();

                        if ($scope.TIP_TYPE) {

                            _this.addTip($element);
                            $dialog.click(function () {
                                $element.find('.tip').addClass('fadeOutUp').removeClass('fadeInDown');
                                $timeout.cancel(HB_notification.closeTimer);
                                $timeout.cancel($element.timerHide);
                                $element.timerHide = $timeout(function () {
                                    $element.remove();
                                }, duration).$$timeoutId;
                            });
                            $timeout.cancel(HB_notification.closeTimer);

                            //动画效果在2.5秒后添加动画效果在dom上面，
                            $element.timerHide = $timeout(function () {
                                $element.find('.tip').addClass('fadeOutUp').removeClass('fadeInDown');
                            }, 2500).$$timeoutId;

                            //提示信息3秒后自动隐藏掉

                            HB_notification.closeTimer = $timeout(function () {
                                $element.remove();
                                $timeout.cancel($element.timerHide);
                            }, 3000).$$timeoutId;
                        } else {
                            $dialog.css({width: '400px'});
                        }

                        $dialog.css({
                            top: '50%',
                            left: '50%',
                            marginLeft: (-1 * (elementWidth / 2)) + 'px',
                            marginTop: (-1 * (elementHeight / 2)) + 'px'
                        }).show().addClass('fadeInDown');
                    });
                };

                this.addTip = function ($element) {
                    clearTips();
                    HB_notification.tips.push($element);
                };
            },
            link: function ($scope, $element, $attributes, controller) {

                HB_notification.openWindow = $element;

                $scope.closeWindow = controller.closeWindow;
            }
        };
    }

    /**
     * 确定弹窗
     * @type {Array}
     */
    HB_alert.$inject = ['HB_notification'];

    function HB_alert (HB_notification) {
        return {
            replace: true,
            require: '?^hbNotification',
            template: ['<div class="dialog animated">', '<div class="dialog-body">',
                '<div class="dialog-tit">b{{TIP_TITLE}}<a href="javascript:void(0);" class="ico ico-close" ng-click="closeWindow();"></a></div>',
                '<div class="dialog-cont">b{{TIP_MSG}}</div>', '<div class="btn-center">',
                '<button type="button"  class="btn btn-r" ng-click="closeWindow()">确定</button>', '</div>', '</div>', '</div>'].join(''),
            link: function ($scope, $element, $attr, parentController) {
                HB_notification.alertInShow = true;
                parentController.center($element);
            }
        };
    }

    /**
     * confirm提示窗口
     * @type {Array}
     */
    HB_confirm.$inject = ['HB_notification'];

    function HB_confirm (HB_notification) {
        return {
            replace: true,
            require: '?^hbNotification',
            template: ['<div class="dialog animated">', '<div class="dialog-body">',
                '<div class="dialog-tit">b{{TIP_TITLE}}<a href="javascript:void(0);" class="ico ico-close" ng-click="closeWindow();"></a></div>',
                '<div class="dialog-cont">b{{TIP_MSG}}</div>', '<div class="btn-center">',
                '<button type="button" class="btn btn-r" ng-click="confirmCertain();">确定</button>',
                '<span style="width:30px;"/>',
                '<button type="button" class="btn btn-g" ng-click="closeWindow()">取消</button>', '</div>', '</div>', '</div>'].join(''),
            link: function ($scope, $element, $attr, parentController) {
                HB_notification.confirmInShow = true;
                parentController.center($element);
                $scope.confirmCertain = parentController.confirmCertain;
            }
        };
    }

    /**
     * 警告的窗, error\information\success\warning
     * @type {Array}
     */
    Hb_tip.$inject = [];

    function Hb_tip () {
        return {
            replace: true,
            require: '?^hbNotification',
            template: ['<div class="tip animated">',
                '<span class="ico ico-b{{TIP_TYPE}}"></span>',
                '<p>b{{TIP_MSG}}</p>',
                '</div>'].join(''),
            link: function ($scope, $element, $attr, parentController) {
                parentController.center($element);
            }
        };
    }

    /**
     * 给500错误提供的错误提示窗
     * @type {Array}
     */
    Hb_error_tip.$inject = ['HB_notification', '$rootScope', '$timeout', 'hbUtil'];

    function Hb_error_tip (HB_notification, $rootScope, $timeout, hbUtil) {
        return {
            replace: true,
            scope: {},
            require: '?^hbNotification',
            template: ['<div class="tip animated fadeInDown">',
                '<div id="close__" class="opp-close">ｘ</div>', '<span class="ico ico-error"></span>',
                '<a href="#" style="display:block" id="detail__" class="tip500_text">访问异常</a><div class="error-500-box animated">',
                '<div class="arr500Error"></div>',
                '<div class="cont500Error">', '    <div class="content" style="height: auto;">',
                '<div class="message-container" ng-repeat="msg in messages">',
                '<div class="message-title">', 'b{{msg.title}}',
                '<span class="detail" ng-click="msg.showMeItem=!msg.showMeItem">查看详情</span>', '</div>',
                '<div class="message-content" ng-if="msg.showMeItem">',
                '<div class="message-split"></div>',
                'b{{msg.message.info}}', '</div>', '</div>', '</div>', '</div>', '</div>', '</div>'].join(''),
            compile: function ($tElement) {
                var e5b = $tElement.find('.error-500-box');
                e5b.css({opacity: 0, display: 'none'});
                $tElement.css({
                    marginLeft: '-80px',
                    marginTop: '-86px',
                    top: '50%',
                    left: '50%'
                }).find('#close__').click(function (e) {
                    $tElement.addClass('fadeOutUp').removeClass('fadeInDown');
                    $timeout(function () {
                        $tElement.parent().remove();
                        HB_notification.errors = [];
                        HB_notification.watchSome(); // 清除监控
                        HB_notification.Tip500ErrorDom = null;
                    }, hbUtil.isIe() && hbUtil.isIe() <= 8 ? 0 : 500);
                });

                $tElement.find('#detail__').click(function (e) {
                    HB_notification.Tip500ErrorDomShow = !HB_notification.Tip500ErrorDomShow;
                    if (HB_notification.Tip500ErrorDomShow) {
                        $tElement.animate({top: '20px', marginTop: 0}, function () {
                            e5b.css({
                                opacity: 1,
                                display: 'block'
                            }).removeClass('fadeOutDown').addClass('fadeInUp');
                        });
                    } else {
                        e5b.removeClass('fadeInUp').addClass('fadeOutDown');
                        $timeout(function () {
                            e5b.css({display: 'none', opacity: 0});
                            $tElement.animate({top: '50%', marginTop: '-86px'});
                        }, 500);
                    }
                    e.preventDefault();
                });
                return {
                    post: function ($scope) {
                        $scope.$evalAsync(function () {
                            $scope.messages = HB_notification.errors;
                        });
                        HB_notification.watchSome = $rootScope.$on('event:error_5oo_add_error', function () {
                            $scope.$evalAsync(function () {
                                $scope.messages = HB_notification.errors;
                            });
                        });
                    }
                };
            }
        };
    }

    /**
     * 模块弹窗
     * @type {Array}
     */
    Hb_ModuleDialog.$inject = ['HB_notification'];

    function Hb_ModuleDialog (HB_notification) {
        return {
            replace: true,
            template: ['<div class="module-dialog animated">', '<div class="mark"></div>', '<div class="content">',
                '<div class="close-module-dialog" ng-click="closeWindow();"><span class="glyphicon glyphicon-remove"></span></div>',
                '<div class="main-tainer">',
                '<div ng-include="templateUrl"></div>', '</div>', '</div>', '</div>'].join(''),
            link: function ($scope) {
                $scope.templateUrl = HB_notification.templateUrl;
            }
        };
    }

    /**
     * 内容
     * @type {Array}
     */
    Hb_ContentDialog.$inject = ['HB_notification'];

    function Hb_ContentDialog (HB_notification) {
        return {
            replace: true,
            require: '?^hbNotification',
            template: ['<div class="dialog animated">',
                '<div class="dialog-body">',
                '<div class="dialog-tit">b{{TIP_TITLE}}<a href="javascript:void(0);" class="ico ico-close" ng-click="closeWindow();"></a></div>',
                '<div class="dialog-cont" ng-include="contentDialogContentUrlTemplate" onload="contentDialogLoaded.load()"></div>', '<div class="btn-center">',
                '<button type="button" class="btn btn-r" ng-click="closeWindow()" ng-if="contentDialogOptions.showBtn">确定</button>',
                '</div>', '</div>', '</div>'].join(''),
            link: function ($scope, $element, $attr, parentController) {
                $scope.contentDialogContentUrlTemplate = HB_notification.contentDialogContentUrlTemplate;
                $scope.contentDialogOptions = HB_notification.contentDialogOptions;
                $scope.contentDialogLoaded = {
                    load: function () {
                        parentController.center($element);
                    }
                };
            }
        };
    }
});
