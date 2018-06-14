define(function (statisticTaskExport) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_notification', 'hbUtil', '$http', 'questionService', 'kendo.grid', function ($scope, HB_notification, hbUtil, $http, questionService, kendoGrid) {
            $scope.model = {
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                queryParam: {
                    groupType: 'asynchExportClassOpenInfo', //异步任务组名
                    startDate: null,
                    endDate: null,
                    status: '-1'
                },

                urlPrefix: '',

                buttonDisabled: false,//重试按钮置换灰

                personQueryParam: {
                    //分页信息
                    page: {
                        pageNo: 1,
                        pageSize: 10
                    },
                    examRoundId: null
                }

            };


            $scope.node = {
                startDate: null,
                endDate: null
            };

            $scope.events = {};
            questionService.downloadTemplate().then(function (data) {
                if (data.status) {
                    $scope.urlPrefix = data.info.downModelIP;
                }
            });
            var ButtonUtils = {
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
                query: function (e) {
                    e.stopPropagation();
                    $scope.model.page.pageNo = 1;
                    $scope.node.grid.pager.page(1);
                },
                view: function (e, dataItem) {
                    console.log(dataItem);
                    if (dataItem.log.status == 'executed') {
                        if (dataItem.log.result.success) {
                            if (dataItem.log.result.result.message) {
                                $scope.globle.alert('提示', dataItem.log.result.result.message);
                                return false;
                            } else if (dataItem.log.result.result.errorMessage) {
                                $scope.globle.alert('提示', dataItem.log.result.result.errorMessage);
                                return false;
                            } else {
                                $scope.globle.alert('提示', '任务执行成功！');
                                return false;
                            }
                        } else {
                            if (dataItem.log.result.message == null) {
                                $scope.globle.alert('提示', dataItem.log.result.result.errorMessage);
                            } else {
                                $scope.globle.alert('提示', dataItem.log.result.message);
                            }
                            return false;
                        }

                    } else if (dataItem.log.status == 'fail') {
                        $scope.globle.alert('提示', '异步任务的业务逻辑执行出错！' + dataItem.log.remark);
                        return false;
                    } else if (dataItem.log.status == 'addedToScheduler') {
                        $scope.globle.alert('提示', '任务还未开始...');
                        return false;
                    } else if (dataItem.log.status == 'toExecuted') {
                        $scope.globle.alert('提示', '任务正在执行...');
                        return false;
                    }
                },
                downloadLogExcel: function (e, dataItem) {
                    window.open($scope.urlPrefix + '/mfs' + dataItem.log.result.result.fileUrl + '?download');
                }
            };


            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: log.status == "executed"&&log.result.result!={}&&log.result.result!=null ? log.result.result.startDate : "----" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: log.status == "executed"&&log.result.result!={}&&log.result.result!=null  ? log.result.result.endDate : "----"#');
                result.push('</td>');


                result.push('<td>');
                result.push('#: ' +
                    '  log.status == "executed" ? "已执行" ' +
                    ': log.status == "fail" ? "执行失败" : log.status == "addedToScheduler" ? "未执行" : "正在执行" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: log.result == null ? "未知" : log.result.success ==true ? "成功" : "失败" #');
                result.push('</td>');


                result.push('<td>');
                result.push('<button type="button" class="table-btn" has-permission="statisticTaskExport/query" ng-click="events.view($event,dataItem)" >查看日志</button>');
                result.push('<button type="button" has-permission="statisticTaskExport/download" class="table-btn" ng-click="events.downloadLogExcel($event,dataItem)" #: log.status ==\'executed\' && log.result &&log.result.success?\'\':\'disabled\'#>下载导出数据</button>');
                /*ng-if="#: group==\'ORDER\' #"*/
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();


            /* 查看未发布人员列表 */
            var editNewRequiredPackage = {
                utils: {}
            };

            editNewRequiredPackage.uiTemplate = {
                teacherGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: id #');
                    result.push('</td>');


                    result.push('</tr>');
                    return result.join('');
                }
            };


            $scope.ui = {
                windowOptions: {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                },
                datePicker: {
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            height: 10,
                            change: ButtonUtils.startChange

                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: ButtonUtils.endChange
                        }
                    }
                },
                grid: {
                    options: {
                        rowTemplate: kendo.template(gridRowTemplate),
                        noRecords: {
                            template: '暂无数据！'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/asynJob/findAsynTaskLog',
                                    data: function (e) {
                                        var temp = {
                                            page: {
                                                pageNo: e.page,
                                                pageSize: e.pageSize
                                            }, queryParam: {
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
                            page: 1,
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            i = 1;
                                        _.forEach(viewData, function (row) {
                                            row.index = i++;
                                        });
                                        return response;
                                    } else {
                                        HB_notification.error('提示', response.info);
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },

                                total: function (response) {
                                    // 绑定数据所有总共多少条;
                                    return response.totalSize;
                                },

                                data: function (response) {
                                    if (response.status) {
                                        var datas = response.info;
                                        return datas;
                                    } else {
                                        return [];
                                    }
                                } // 指定数据源
                            },
                            serverPaging: true
                        },

                        selectable: true,
                        scrollable: false,//第一次加载时的蒙板效果
                        dataBinding: function (e) {//没有数据时的默认提示语
                            hbUtil.kendo.grid.nullDataDealLeaf(e);
                        },

                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        columns: [
                            {field: 'name', title: '任务名称', sortable: false, width: 250},
                            {field: 'log.result.result.startDate', title: '任务处理时间', sortable: false, width: 150},
                            {field: 'log.result.result.endDate', title: '任务结束时间', sortable: false, width: 150},
                            {field: 'log.result.success', title: '任务执行状态', sortable: false, width: 100},
                            {field: 'log.result.success', title: '任务处理结果', sortable: false, width: 100},
                            {
                                title: '操作', width: 250
                            }
                        ]
                    }
                }
            };


        }]
    };
});