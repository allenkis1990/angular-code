/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/25
 * 时间: 8:39
 *
 */
define(['angular', '@systemUrl@/js/const/global-constants', 'webuploader.flashonly'], function (angular) {
    'use strict';

    var kendoCommon = angular.module('kendoCommon', []);

    kendoCommon.factory('kendoCommonService', kendoCommonService);

    kendoCommonService.$inject = [];

    function kendoCommonService () {
        var kendoCommonService = {};

        kendoCommonService.windowCommonConfig = {
            modal: true,
            title: false,
            content: '',
            resizable: false,
            draggable: false
        };

        kendoCommonService.editorCommonConfig = {
            encoded: false,
            tools: [
                {name: 'bold', tooltip: '粗体'},
                {name: 'italic', tooltip: '斜体'},
                {name: 'underline', tooltip: '下划线'},
                {name: 'formatting', tooltip: '格式化'},
                {name: 'fontName', tooltip: '字体名称'},
                {name: 'fontSize', tooltip: '字体大小'},
                {name: 'foreColor', tooltip: '字体颜色'},
                {name: 'backColor', tooltip: '背景颜色'},
                {name: 'justifyLeft', tooltip: '居左'},
                {name: 'justifyCenter', tooltip: '居中'},
                {name: 'justifyRight', tooltip: '居右'},
                {name: 'justifyFull', tooltip: ''},
                {name: 'insertUnorderedList', tooltip: '无序列表'},
                {name: 'insertOrderedList', tooltip: '有序列表'},
                {name: 'indent', tooltip: ''},
                {name: 'outdent', tooltip: ''},
                {name: 'createTable', tooltip: ''},
                {name: 'addColumnLeft', tooltip: ''},
                {name: 'addColumnRight', tooltip: ''},
                {name: 'addRowAbove', tooltip: ''},
                {name: 'deleteRow', tooltip: ''},
                {name: 'deleteColumn', tooltip: ''},
                {name: 'cleanFormatting', tooltip: ''}
            ]
        };

        return {
            getCommonWindowConfig: function (options) {
                if (options.open || angular.isFunction(options.open)) {
                    throw new Error('不允许有open函数');
                }
                if (!options.width || !options.height) {
                    throw new Error('想居中必须传入长宽');
                }

                kendoCommonService.windowCommonConfig.open = function () {
                    var $this = this.element,
                        $parent = $this.parent();
                    $parent.css({
                        top: '50%', left: '50%',
                        marginTop: '-' + (options.height / 2) + 'px',
                        marginLeft: '-' + (options.width / 2) + 'px',
                        position: 'fixed!important'
                    });
                };
                return angular.extend({}, kendoCommonService.windowCommonConfig, options);
            },
            getEditorCommonConfig: function (options, type) {
                if (type && !angular.isFunction(type) && typeof type === 'string') {
                    if (angular.equals(type, 'simple')) {

                    }
                }

                ////////////////////////////////////////////////////////
                //////// 设置富文本的上传图片的按钮样式以及触发后弹窗////////
                ///////////////////////////////////////////////////////
                kendoCommonService.editorCommonConfig.tools[kendoCommonService.editorCommonConfig.tools.length] = {
                    name: 'insertImage',
                    tooltip: '插入图片',
                    exec: function exec (e) {
                        kendoCommonService.currentActiveEditor = $(this).data('kendoEditor');
                        // 清空数据

                        angular.element('body').append($compile('<div kendo-window="globle.editor.uploadImageWindow" k-options="globle.editor.windowConfig"></div>')($rootScope));
                        return false;
                    }
                };

                return angular.extend({}, kendoCommonService.editorCommonConfig, options);
            }
        };
    }

    kendoCommon.directive('editorUploadImage', editorUploadImage);

    editorUploadImage.$inject = [];

    function editorUploadImage () {
        return {
            link: function () {

            }
        };
    }

});