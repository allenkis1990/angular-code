define(function (distributorOpenManage) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_dialog', 'HB_notification', 'hbUtil', '$http', 'openManageService', function ($scope, HB_dialog, HB_notification, hbUtil, $http, openManageService) {
            $scope.model = {
                urlPrefix: '',
                upload: {},
                categoryId: '35f84aea57d24cc299a397c1',
                classPage: {
                    pageNo: 1,
                    pageSize: 10
                },
                configedQueryParam: {
                    trainingYear: -1,
                    titleLevel: -1,
                    learningType: -1,
                    onSaleState: 0,//这里查全部
                    saleState: 0,
                    price: '',
                    commodityName: '',
                    minFirstUpTime: '',
                    maxFirstUpTime: '',
                    orderByCondition: 0,//0默认 1首次上架时间 排序
                    sortOrder: 0//0降序 1升序
                },

                query: {
                    pageNo: 1,
                    pageSize: 10,
                    loginInput: '',
                    trainClassId: '',
                    trainClassName: '',

                    startDate: null,
                    endDate: null,
                    processStatus: '-1',
                    placeOrderFail: false
                }
            };


            $scope.node = {
                startDate: null,
                endDate: null
            };

            $scope.kendoPlus = {
                classGridInstance: null,
                orderGridInstance: null,
                timeModel: null,
                timeOptions: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd'
                    //format : "yyyy-MM-dd HH:mm:00"
                },
                windowOptions: {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                }
            };

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
                openKendoWindow: function (windowName) {
                    $scope[windowName].center().open();
                },

                closeKendoWindow: function (windowName) {
                    $scope[windowName].close();
                },

                mainPageQueryList: function (e, gridName, pageName) {
                    e.stopPropagation();
                    $scope.model[pageName].pageNo = 1;
                    $scope.kendoPlus[gridName].pager.page(1);
                },

                //培训班升序降序
                setSortOrder: function (sortOrder) {
                    $scope.model.configedQueryParam.orderByCondition = 1;
                    $scope.model.configedQueryParam.sortOrder = sortOrder;
                    $scope.kendoPlus['classGridInstance'].pager.page(1);
                    $scope.kendoPlus['classGridInstance'].dataSource.read();
                },

                choseClass: function (e, item) {
                    $scope.model.query.trainClassName = item.commodityName;
                    $scope.model.query.trainClassId = item.schemeId;
                    $scope.events.closeKendoWindow('classWindow');
                },

                clearTextContent: function () {
                    $scope.model.query.trainClassName = '';
                    $scope.model.query.trainClassId = '';
                },

                togglePlaceOrderFail: function (e) {
                    if (e.target.checked === true) {
                        $scope.model.query.placeOrderFail = true;
                    } else {
                        $scope.model.query.placeOrderFail = false;
                    }
                },

                query: function (e) {
                    e.stopPropagation();
                    $scope.model.query.pageNo = 1;
                    $scope.node.grid.pager.page(1);
                },

                remove: function (e, item) {
                    e.stopPropagation();
                    $scope.globle.confirm('删除记录', '确定要删除吗？', function (dialog) {
                        return openManageService.deleteById(item.id).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.alert('删除失败!', data.info);
                            } else {
                                $scope.node.grid.dataSource.page(1);
                                $scope.node.grid.dataSource.read();
                                $scope.globle.showTip('记录删除成功', 'success');
                            }
                        });
                    });
                }
            };


            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: loginInput #');
                result.push('</td>');

                result.push('<td title="#: trainClassName #">');
                result.push('#: trainClassName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: orderNo?orderNo:"-" #');
                result.push('</td>');

                result.push('<td title="#: errorMessage #">');
                result.push('#: errorMessage ? errorMessage : "" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: processStatus === 1 ? "处理中" : "已完成" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime?createTime.substr(0, lastUpdateTime.indexOf(" ")):"-"#');
                result.push('<br/>');
                result.push('#: createTime?createTime.substr(createTime.indexOf(" "), createTime.length):"-" #');
                result.push('</td>');

                result.push('<td >');
                result.push('#: lastUpdateTime?lastUpdateTime.substr(0, lastUpdateTime.indexOf(" ")):"-" #');
                result.push('<br/>');
                result.push('#: lastUpdateTime?lastUpdateTime.substr(lastUpdateTime.indexOf(" "), lastUpdateTime.length):"-" #');
                result.push('</td>');


                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.remove($event, dataItem)" >删除</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

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
                                    url: '/web/admin/distributorOpenManage/getUserDistributorOpenPage',
                                    data: function (e) {
                                        var query = $scope.model.query;
                                        query.pageNo = e.page;
                                        query.pageSize = e.pageSize;

                                        var temp = {
                                            pageNo: query.pageNo,
                                            pageSize: query.pageSize,
                                            name: query.name,
                                            loginInput: query.loginInput,
                                            trainClassId: query.trainClassId,
                                            processStatus: query.processStatus,
                                            placeOrderFail: query.placeOrderFail,
                                            importBeginTimeMills: query.startDate != null ? kendo.parseDate(query.startDate).getTime() : 0,
                                            importEndTimeMills: query.endDate != null ? kendo.parseDate(query.endDate).getTime() + 86399999 : 0
                                        };

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
                            {title: '学员姓名', sortable: false, width: 180},
                            {title: '学员账号', sortable: false, width: 180},
                            {title: '班级名称', sortable: false, width: 300},
                            {title: '订单号', sortable: false, width: 200},
                            {title: '错误日志', sortable: false},
                            {title: '处理状态', sortable: false, width: 90},
                            {title: '创建时间', sortable: false, width: 90},
                            {title: '最后更新时间', sortable: false, width: 120},
                            {title: '操作', sortable: false, width: 120}
                        ]
                    }
                }

            };


            // (function () {
            //     //获取收款账号
            //     $http.get('/web/admin/paymentAccount/getPaymentAccountList?tradeType=0').success(function (data) {
            //         if (data.status) {
            //             $scope.model.payeeAccountArr = data.info;
            //         }
            //     });
            // })();
        }]
    };
});