define(function () {
    'use strict';
    return ['$scope', '$state', '$stateParams', '$rootScope', '$timeout', 'classScheduleService', 'hbUtil', function ($scope, $state, $stateParams, $rootScope, $timeout, classScheduleService, hbUtil) {

        $scope.model = {
            queryParams: {
                name: '',
                isReference: -1
            },
            page: {
                pageNo: 1,
                pageSize: 10
            },
            templateList: []
        };
        /*for (var i = 1; i <= 3; i++) {
         var text = "测试" + i;
         var testDto = {
         index: i,
         id: '2333_' + i,
         name: text,
         planItemTemplateNum: text,
         createUserName: '2333',
         planItemResourceNum: i,
         quote: false
         }
         $scope.model.templateList.push(testDto);
         }*/
        $scope.node = {
            indexGrid: null
        };
        $scope.events = {
            loadGrid: function (e) {
                $scope.node.indexGrid.pager.page(1);
            },
            refreshGrid: function (e) {
                $timeout(function () {
                    $scope.node.indexGrid.dataSource.read();
                }, 500)
            },
            /**
             * 输入框点击回车按钮
             * @param e
             */
            pressEnterKey: function (e) {
                if (e.keyCode == 13) {
                    $scope.events.query(e);
                }
            },
            /**
             * 跳转到新建页面
             * @param e
             */
            add: function (e) {
                $state.go("states.classSchedule.add");
            },
            /**
             * 删除
             * @param e
             * @param dataItem
             */
            delete: function (e, dataItem) {
                e.stopPropagation();
                if (dataItem.isReference == 1) {
                    $scope.globle.showTip('本课表已被班级引用，无法删除', 'error');
                    return;
                }
                classScheduleService.getReferenceCount({
                    planTemplateId: dataItem.id
                }).then(function (data) {
                    if (data.status) {
                        if (data.Info > 0) {
                            $scope.globle.showTip('本课表已被班级引用，无法删除', 'error');
                            return;
                        } else {
                            $scope.events.deletePlanTemplate(dataItem.id);
                        }
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }
                })
            },
            deletePlanTemplate: function (id) {
                $scope.globle.confirm("提示", "您正在删除课程，删除后无法恢复，是否确定删除？", function (dialog) {
                    classScheduleService.deletePlanTemplate({
                        id: id
                    }).then(function (data) {
                        dialog.doRightClose();
                        if (data.status) {
                            $scope.globle.showTip("操作成功", 'success');
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                        }
                        $scope.events.refreshGrid();
                    })
                })
            },
            /**
             * 跳转到修改页面
             * @param e
             * @param dataItem
             */
            edit: function (e, dataItem) {
                $state.go("states.classSchedule.edit", {id: dataItem.id});
            },
            /**
             * 跳转到详情页面
             * @param e
             * @param dataItem
             */
            detail: function (e, dataItem) {
                $state.go("states.classSchedule.detail", {id: dataItem.id});
            }
        };

        function isBlank(obj) {
            if (obj == undefined || obj == null || obj.length == 0) {
                return true;
            } else {
                return false;
            }
        }

        //列表模板
        var template = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td>');
            result.push('#: index #');
            result.push('</td>');

            result.push('<td title="#: name #">');
            result.push('#: name #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: planItemTemplateNum #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: planItemResourceNum #');
            result.push('</td>');

            result.push('<td>');
            result.push('<span ng-bind="dataItem.isReference==0?\'否\':dataItem.isReference==1?\'是\':\'---\'"></span>');
            result.push('</td>');

            result.push('<td>');
            result.push('<button type="button" class="table-btn" ng-click="events.detail($event,dataItem)" has-permission="/classSchedule/UrlGetPlanTemplate">详情</button>');
            result.push('<button type="button" class="table-btn" ng-click="events.edit($event,dataItem)" has-permission="/classSchedule/UrlUpdatePlanTemplate">编辑</button>');
            result.push('<button type="button" class="table-btn" ng-click="events.delete($event,dataItem)" has-permission="/classSchedule/UrlDeletePlanTemplate">删除</button>');
            result.push('</td>');

            result.push('</tr>');
            template = result.join('');
        })();

        $scope.indexGrid = {
            options: {
                dataBinding: function (e) {
                    hbUtil.kendo.grid.nullDataDealLeaf(e);
                },
                // 每个行的模板定义,
                rowTemplate: kendo.template(template),
                scrollable: false,
                noRecords: {
                    template: '暂无数据'
                },
                dataSource: {
                    transport: {
                        read: {
                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                            url: "/web/admin/classSchedule/getPlanTemplatePage",
                            data: function (e) {
                                $scope.model.page.pageNo = e.page;
                                $scope.model.page.pageSize = e.pageSize;

                                var params = $.extend({}, {
                                    pageNo: e.page,
                                    pageSize: e.pageSize
                                }, $scope.model.queryParams);
                                return params;
                            },
                            dataType: 'json'
                        }
                    },
                    pageSize: 10, // 每页显示的数据数目
                    schema: {
                        // 数据源默认绑定的字段
                        // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                        // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                        // 优先与后面的data执行，返回的数据为下面data上面的参数response
                        parse: function (response) {
                            // 将会把这个返回的数组绑定到数据源当中
                            if (response.status) {
                                var dataview = response.info, index = 1;
                                angular.forEach(dataview, function (item) {
                                    item.index = index++;
                                    if (item.planItemTemplateNum <= 0) {
                                        item.planItemTemplateNum = "无";
                                    }
                                    if (item.planItemResourceNum <= 0) {
                                        item.planItemResourceNum = "无";
                                    }
                                });
                            }
                            return response;
                        },
                        total: function (response) {
                            return response.totalSize;
                        },
                        data: function (response) {
                            return response.info;
                        } // 指定数据源
                    },
                    serverPaging: true, //远程获取书籍
                    serverSorting: true //远程排序字段
                },
                selectable: true,
                sortable: {
                    mode: "single",
                    allowUnsort: false
                },
                pageable: {
                    refresh: true,
                    pageSizes: [5, 10, 30, 50] || true,
                    pageSize: 10,
                    buttonCount: 10
                    //change: function (e) {
                    //    $scope.model.page.pageNo = parseInt(e.index, 10);
                    //    //== !!important!! 这里重复了page(1)的作用
                    //    // $scope.node.lessonGrid.dataSource.read();
                    //}
                },
                // 选中切换的时候改变选中行的时候触发的事件
                columns: [
                    {field: "index", title: "No.", sortable: false, width: 50},
                    {title: "课表名称", sortable: false},
                    {title: "课程数", sortable: false, width: 150},
                    {title: "参考资料数量", sortable: false, width: 150},
                    {title: "是否被班级引用", sortable: false, width: 150},
                    {
                        title: "操作", width: 200
                    }
                ]
            }
        }

    }];
});