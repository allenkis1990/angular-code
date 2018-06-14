/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/15
 * 时间: 15:36
 *

 */
define(['angular'], function (angular) {
    'use strict';
    // 用angular的常量方式保存关于kendo的一些默认的配置
    angular.module('kendo.ui.constants', [])
    /** 表格*/
        .constant('KENDO_UI_GRID'
            , {
                sortable: true,
                filterable: false,
                editable: 'popup',
                dataSource: {
                    pageSize: 10, // 每页显示的数据数目
                    serverPaging: true, // 服务端分页
                    serverFiltering: true, // 是否过滤
                    // 用来格式化返回回来的远程数据
                    schema: {
                        // 数据源默认绑定的字段
                        // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                        // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                        // 优先与后面的data执行，返回的数据为下面data上面的参数response
                        parse: function (response) {
                            // 将会把这个返回的数组绑定到数据源当中
                            return response;
                        },
                        total: function (response) {
                            // 绑定数据所有总共多少条;
                            return response.totalSize;
                        },
                        data: function (response) {
                            return response.info;
                        } // 指定数据源
                    }
                },
                //scrollable: false,
                selectable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 10
                }
            })
        /** 树*/
        .constant('KENDO_UI_TREE'
            , {
                checkboxes: {
                    checkChildren: true
                },
                dataSource: {
                    schema: {
                        // 数据绑定行为，将返回的数据的results绑定到数据源
                        // ， 如果返回的对象有层级则以x.x.x来访问
                        data: 'results'
                    }
                },
                //loadOnDemand: true,
                animation: {
                    collapse: {
                        duration: 400,
                        effects: 'fadeOut collapseVertical'
                    },
                    expand: {
                        duration: 400,
                        effects: 'fadeIn collapseVertical'
                    }
                }
            })
        /** 按钮*/
        .constant('KENDO_UI_EDITOR'
            , {
                encoded: false,
                tools: [
                    {name: 'bold', tooltip: '粗体'},
                    {name: 'italic', tooltip: '斜体'},
                    {name: 'underline', tooltip: '下划线'},
                    {name: 'createTable', tooltip: '添加表格'},
                    {name: 'cleanFormatting', tooltip: '清除格式'},
                    {name: 'createLink', tooltip: '超链接'}
                ]
            })
        /** 按钮*/
        .constant('KENDO_UI_WINDOW'
            , {
                title: false,
                modal: true,
                resizable: false,
                draggable: false,
                visible: false,
                open: function () {
                    this.center();
                }

            })
        /** 按钮*/
        .constant('KENDO_UI_TIP'
            , {
                autoHideAfter: 2000,
                templates: [
                    {
                        type: 'error',
                        template: '<div class="tip"><span class="ico ico-error"></span><p>#: message#</p></div>'
                    },
                    {
                        type: 'info',
                        template: '<div class="tip"><span class="ico ico-ico-information"></span><p>#: message#</p></div>'
                    },
                    {
                        type: 'warning',
                        template: '<div class="tip"><span class="ico ico-warning"></span><p>#: message#</p></div>'
                    },
                    {
                        type: 'success',
                        template: '<div class="tip"><span class="ico ico-success"></span><p>#: message#</p></div>'
                    }
                ],
                show: function (e) {
                    var element = e.element.parent(),
                        eWidth = element.width(),
                        eHeight = element.height();
                    element.css({
                        top: '50%',
                        left: '50%',
                        marginTop: '-' + (eHeight / 2) + 'px',
                        marginLeft: '-' + (eWidth / 2) + 'px',
                        position: 'fixed!important'
                    });
                }
            });
});
