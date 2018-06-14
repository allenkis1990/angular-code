/**
 * Created by linj on 2018/6/4 19:13.
 */
define(function (resAuthorizeSyncTask) {
    'use strict';
    return ['$scope','HB_notification','hbUtil',
        function ($scope,HB_notification,hbUtil) {

            $scope.model = {
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                queryParam: {
                    groupType: 'resAuthorizeSyncTask', //异步任务组名
                    startDate: null,
                    endDate: null,
                    status: '-1'
                },
            }

            $scope.node = {
                startDate: null,
                endDate: null
            };

            var utils = {
                //开始时间变化
                startChange: function () {
                    var startDate = $scope.node.startDate.value(),
                        endDate = $scope.node.endDate.value();
                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.endDate.min(startDate);
                    } else if (endDate) {
                        $scope.node.startDate.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.startDate.max(endDate);
                        $scope.node.endDate.min(endDate);
                    }
                },
                //结束时间变化
                endChange: function () {
                    var endDate = $scope.node.endDate.value(),
                        startDate = $scope.node.startDate.value();
                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.startDate.max(endDate);
                    } else if (startDate) {
                        $scope.node.endDate.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.startDate.max(endDate);
                        $scope.node.endDate.min(endDate);
                    }
                }
            };

            $scope.events = {
                view: function (e, dataItem) {
                    if (dataItem.state == 'AUTHORIZE_SUCCESS') {
                        $scope.globle.alert('提示', '任务执行成功！');
                        return false;
                    } else if (dataItem.state == 'AUTHORIZE_FAIL') {
                        $scope.globle.alert('提示', '异步任务的业务逻辑执行出错！' + dataItem.remark);
                        return false;
                    } else if (dataItem.state == 'NONE') {
                        $scope.globle.alert('提示', '任务还未开始...');
                        return false;
                    } else if (dataItem.state == 'AUTHORIZING') {
                        $scope.globle.alert('提示', '任务正在执行...');
                        return false;
                    }
                },
                
                query:function (e) {
                    e.stopPropagation();
                    $scope.model.page.pageNo = 1;
                    $scope.node.grid.pager.page(1);
                }
            }

            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('[#: unitName#]授权资源任务-#:createTime #');

                result.push('</td>');

                result.push('<td>');
                result.push('#:state == "NONE" ? "----" : createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#:state == "NONE" || state =="AUTHORIZING" ? "----" : authorizeFinishTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: operateAdmin #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: state == "NONE" ? "----" : state =="AUTHORIZING" ? "执行中" : state == "AUTHORIZE_SUCCESS" ? "成功":"失败" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: state == "NONE" ? "----" : resourceCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#:state == "NONE" ? "----" : state =="AUTHORIZING" ? "----" : successCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#:state == "NONE" ? "----" : state =="AUTHORIZING" ? "----" : failCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.view($event,dataItem)" >查看日志</button>');
                result.push('<button type="button" class="table-btn" ng-if="dataItem.state == AUTHORIZE_FAIL" ng-click="events.view($event,dataItem)" >继续授权</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            $scope.ui = {
                datePicker: {
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: utils.startChange
                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: utils.endChange
                        }
                    }
                },
                grid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/resAuthorizeSyncTask/pageResAuthorizeSyncInfo',
                                    data: function (e) {
                                        var temp = {
                                            page: {
                                                pageNo: e.page,
                                                pageSize: e.pageSize
                                            },
                                            queryParam: {
                                                groupType: $scope.model.queryParam.groupType,
                                                startDate: $scope.model.queryParam.startDate,
                                                endDate: $scope.model.queryParam.endDate,
                                                status: $scope.model.queryParam.status
                                            }
                                        };
                                        $scope.model.page.pageNo = e.page;
                                        $scope.model.page.pageSize = e.pageSize;
                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;
                                        return temp;
                                    },
                                    dataType: 'json',
                                    error: function (data) {
                                        HB_notification.error('提示', data.info);
                                    }
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

                        dataBinding: function (e) {//没有数据时的默认提示语
                            hbUtil.kendo.grid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50],
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
                            {sortable: false, field: 'name', title: '任务名称',width:250},
                            {sortable: false, field: 'typeName', title: '任务处理时间', width: 145},
                            {sortable: false, field: 'period', title: '任务结束时间', width: 140},
                            {sortable: false, field: 'teacherName', title: '操作人', width: 110},
                            {sortable: true, field: 'studyCount', title: '任务处理结果', width: 100},
                            {sortable: true, field: 'result', title: '处理条数', width: 80},
                            {sortable: true, field: 'result', title: '成功条数', width: 80},
                            {sortable: true, field: 'result', title: '失败条数', width: 80},
                            {
                                title: '操作', width: 110
                            }
                        ]
                    }
                }
            };

    }]
});