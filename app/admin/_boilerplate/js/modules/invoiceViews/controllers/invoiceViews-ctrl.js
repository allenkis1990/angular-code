define(function (reconciliationViews) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'kendo.grid', 'invoiceViewsService', 'HB_dialog', function ($scope, kendoGrid, invoiceViewsService, HB_dialog) {
            $scope.model = {
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                urlPrefix: '',
                groupType: 'billingResultImport'
            };
            $scope.node = {
                lessonGrid: null
            };
            invoiceViewsService.downloadTemplate().then(function (data) {
                if (data.status) {
                    $scope.urlPrefix = data.info.downModelIP;
                }
            });
            $scope.events = {
                MainPageQueryList: function (e) {
                    //e.preventDefault();
                    //e.stopPropagation();
                    $scope.model.page.pageNo = 1;
                    $scope.node.lessonGrid.pager.page(1);
                },
                // view            : function ( e, dataItem ) {
                //     if ( dataItem.log.status == "executed" ) {
                //         if ( dataItem.log.result.success ) {
                //             if ( dataItem.log.result.result.message ) {
                //                 $scope.globle.alert ( "提示", dataItem.log.result.result.message );
                //                 return false;
                //             } else if ( dataItem.log.result.result.errorMessage ) {
                //                 $scope.globle.alert ( "提示", dataItem.log.result.result.errorMessage );
                //                 return false;
                //             } else {
                //                 $scope.globle.alert ( "提示", "任务执行成功！" );
                //                 return false;
                //             }
                //         } else {
                //             if ( dataItem.log.result.message == null ) {
                //                 $scope.globle.alert ( "提示", dataItem.log.result.result.errorMessage );
                //             } else {
                //                 $scope.globle.alert ( "提示", dataItem.log.result.message );
                //             }
                //             return false;
                //         }
                //
                //     } else if ( dataItem.log.status == "fail" ) {
                //         $scope.globle.alert ( "提示", "异步任务的业务逻辑执行出错！" + dataItem.log.remark );
                //         return false;
                //     } else if ( dataItem.log.status == "addedToScheduler" ) {
                //         $scope.globle.alert ( "提示", "任务还未开始..." );
                //         return false;
                //     } else if ( dataItem.log.status == "toExecuted" ) {
                //         $scope.globle.alert ( "提示", "任务正在执行..." );
                //         return false;
                //     }
                // },
                downloadLogExcel: function (e, dataItem, type) {
                    if (type == 1) {
                        if (dataItem.log.result.result.resultUrl) {
                            window.open($scope.urlPrefix + '/mfs' + dataItem.log.result.result.resultUrl + '?download');
                        } else {
                            HB_dialog.alert('提示', '文件导出失败:' + dataItem.log.result.result.message);
                        }
                    } else if (type == 2) {
                        if (dataItem.log.result.result.failUrl) {
                            window.open($scope.urlPrefix + '/mfs' + dataItem.log.result.result.failUrl + '?download');
                        } else {
                            HB_dialog.alert('提示', '文件导出失败:' + dataItem.log.result.result.message);
                        }
                    } else if (type == 3) {
                        if (dataItem.log.result.result.fileUrl) {
                            window.open($scope.urlPrefix + '/mfs' + dataItem.log.result.result.failUrl + '?download');
                        } else {
                            HB_dialog.alert('提示', '文件导出失败:' + dataItem.log.result.result.message);
                        }
                    }
                }
            };
            var utils = {
                startChange: function () {
                    var startDate = $scope.node.workBeginTime.value(),
                        endDate = $scope.node.workEndTime.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.workEndTime.min(startDate);
                    } else if (endDate) {
                        $scope.node.workBeginTime.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.workBeginTime.max(endDate);
                        $scope.node.workEndTime.min(endDate);
                    }
                },
                endChange: function () {
                    var endDate = $scope.node.workEndTime.value(),
                        startDate = $scope.node.workBeginTime.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.workBeginTime.max(endDate);
                    } else if (startDate) {
                        $scope.node.workEndTime.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.workBeginTime.max(endDate);
                        $scope.node.workEndTime.min(endDate);
                    }
                }
            };
            //=============分页开始=======================
            var gridRowTemplate = '';
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
                result.push('#: log.status == "executed" ? log.result.result.startDate : "----" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: log.status == "executed" ? log.result.result.endDate : "----"#');
                result.push('</td>');

                result.push('<td title="#: userName #">');
                result.push('#: userName  #');
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
                result.push('#: log.status == "executed" &&log.result && log.result && log.result.result &&(log.result.result.rowSum||log.result.result.rowSum==0) ? log.result.result.rowSum : "----" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: log.status == "executed" &&log.result && log.result && log.result.result &&(log.result.result.rowSuccess||log.result.result.rowSuccess==0)? log.result.result.rowSuccess : "----" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: log.status == "executed" &&log.result && log.result && log.result.result  &&(log.result.result.rowFail ||log.result.result.rowFail==0)? log.result.result.rowFail : "----" #');
                result.push('</td>');

                result.push('<td>');
                // result.push ( '<button type="button" has-permission="questionImport/findImportQueRecord" class="table-btn" ng-click="events.view($event,dataItem)" >查看日志</button>' );
                result.push('<button type="button" class="table-btn" has-permission="invoiceViews/downloadLogExcel"  ng-click="events.downloadLogExcel($event,dataItem,1)" >导出全部数据</button>');
                result.push('<button type="button" class="table-btn" has-permission="invoiceViews/downloadDetailLogExcel" ng-click="events.downloadLogExcel($event,dataItem,2)" >导出失败数据</button>');
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
                lessonGrid: {
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
                                    url: '/web/admin/asynQueImport/findAsynQuestionImport',
                                    data: function (e) {
                                        var temp = {
                                            page: {
                                                pageNo: e.page,
                                                pageSize: e.pageSize
                                            },
                                            queryParam: {
                                                groupType: $scope.model.groupType,//导出   billingDataExport
                                                startDate: $scope.model.beginCreateTime,
                                                endDate: $scope.model.endCreateTime,
                                                status: $scope.model.status ? $scope.model.status : -1
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
                            mode: 'single',
                            allowUnsort: false
                        },
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
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
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'name', title: '任务名称'},
                            {sortable: false, field: 'typeName', title: '任务处理时间', width: 145},
                            {sortable: false, field: 'period', title: '任务结束时间', width: 145},
                            {sortable: false, field: 'teacherName', title: '操作人', width: 110},
                            {sortable: false, field: 'status', title: '执行状态', width: 100},
                            {sortable: true, field: 'studyCount', title: '处理结果', width: 100},
                            {sortable: true, field: 'result', title: '处理条数', width: 80},
                            {sortable: true, field: 'result', title: '成功条数', width: 80},
                            {sortable: true, field: 'result', title: '失败条数', width: 80},
                            {
                                title: '操作', width: 195
                            }
                        ]
                    }
                }
            };
        }]
    };
});