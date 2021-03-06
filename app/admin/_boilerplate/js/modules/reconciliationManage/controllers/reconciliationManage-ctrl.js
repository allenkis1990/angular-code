define(function (reconciliationManage) {
    'use strict';
    return {
        indexCtrl: ['$rootScope','$scope', 'kendo.grid', 'HB_dialog', 'TabService', '$q', '$http', 'hbUtil', 'reconciliationManageServices',
            function ($rootScope,$scope, kendoGrid, HB_dialog, TabService, $q, $http, hbUtil, reconciliationManageServices) {
                $scope.flagModel = {
                    tabType :"OWN",
                    viewProjectFirst : true,
                };
                $scope.model = {
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    },
                    upload: {},
                    reconResult: 0,
                    getReconciliationPage: {
                        test: 'false'
                    },
                    chooseClassItem: {},
                    paperSearch: {},

                    //培训班弹窗
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
                    authorizedQuery:{
                        rangeType:null,
                        belongsType:null,
                        authorizeToUnitId:null,
                        authorizedFromUnitId:null,
                        objectId:null,
                        targetUnitId:null
                    },
                    classChooseType: false,
                    gridPending: false
                };

                $scope.$watch('model.configedQueryParam.titleLevel', function (newval) {
                    if (newval === '5628812b569c57e001569c5ab5f60001') {
                        console.log($scope.model.configedQueryParam.learningType);
                        $scope.model.configedQueryParam.learningType = -1;
                        $scope.model.classChooseType = true;
                    } else {
                        $scope.model.classChooseType = false;
                    }
                });


                $scope.events = {
                    isSubProjectManager :function () {
                        var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                        return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                    },
                    initAllGrid:function(unitId){
                        $scope.model.authorizedQuery.targetUnitId = unitId;
                    },
                    tabClick:function (e,type) {
                        $scope.flagModel.tabType = type;
                        if (type === 'OWN'){
                            $scope.model.authorizedQuery.targetUnitId = '';
                        }
                    },
                    //订单号点击
                    goDetails: function (id) {
                        console.log(id);
                        HB_dialog.success('提示', '看下是不是');
                    },


                    //查询
                    MainPageQueryList: function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $scope.model.page.pageNo = 1;
                        $scope.node.lessonGrid.pager.page(1);
                        $scope.events.totalManage();
                    },
                    searchClassList: function (e) {
                        //e.preventDefault();
                        //e.stopPropagation();
                        $scope.model.page.pageNo = 1;
                        $scope.kendoPlus.classGridInstance.pager.page(1);
                    },
                    //导入银行流水
                    chooseFile: function (e) {
                        e.preventDefault();
                        HB_dialog.contentAs($scope, {
                            title: '导入银行流水',
                            width: 500,
                            height: 270,
                            sure: function (wow) {
                                var defer = $q.defer(),
                                    promise = defer.promise;
                                if (!$scope.model.paperSearch.startCreateTime || !$scope.model.paperSearch.endCreateTime) {
                                    HB_dialog.error('提示', '交易成功时间不能为空');
                                } else if (!$scope.model.upload.result.fileName) {
                                    HB_dialog.error('提示', '导入的文件不能为空');
                                } else {
                                    reconciliationManageServices.importBankFlow({
                                        completeStartTimeMills: $scope.model.paperSearch.startCreateTime,
                                        completeEndTimeMills: $scope.model.paperSearch.endCreateTime,
                                        fileName: $scope.model.upload.result.fileName,
                                        filePath: $scope.model.upload.result.newPath
                                    }).then(function (data) {

                                    });
                                }
                                defer.resolve();
                                wow.close();
                                return promise;
                            },
                            templateUrl: '@systemUrl@/views/reconciliationManage/dialogFile.html'
                        });
                    },
                    //操作记录
                    suspendAdministrator: function (e, item) {
                        e.preventDefault();
                        HB_dialog.contentAs($scope, {
                            title: '操作记录',
                            width: 800,
                            height: 400,
                            showCancel: false,
                            showCertain: false,
                            sure: function (wow) {
                                var defer = $q.defer(),
                                    promise = defer.promise;
                                alert(111);
                                defer.resolve();
                                wow.close();
                                return promise;
                            },
                            templateUrl: '@systemUrl@/views/reconciliationManage/dialogRember.html'
                        });
                    },
                    //对账
                    enableAdministrator: function (e, item) {
                        e.preventDefault();
                        HB_dialog.contentAs($scope, {
                            title: '对账处理',
                            width: 500,
                            height: 300,
                            sure: function (wow) {
                                var defer = $q.defer(),
                                    promise = defer.promise;
                                alert(111);
                                defer.resolve();
                                wow.close();
                                return promise;
                            },
                            templateUrl: '@systemUrl@/views/reconciliationManage/dialogRecon.html'
                        });
                    },


                    //选择培训班
                    getGoodsInfo: function () {
                        $scope.classWindow.center().open();
                    },
                    closeKendoWindow: function () {
                        $scope.classWindow.center().close();
                    },
                    choseClass: function (e, item) {
                        e.preventDefault();
                        console.log(item);
                        $scope.model.chooseClassItem = item;
                        $scope.model.className = item.commodityName;
                        $scope.classWindow.center().close();
                    },
                    totalManage: function () {

                        var completeStartTimeMills = (new Date($scope.model.getReconciliationPage.completeStartTimeMills)).getTime();
                        var completeEndTimeMills = (new Date($scope.model.getReconciliationPage.completeEndTimeMills)).getTime();
                        reconciliationManageServices.getReconciliationStatistic({
                            pageNo: $scope.model.page.pageNo,
                            pageSize: $scope.model.page.pageSize,
                            orderNo: $scope.model.getReconciliationPage.orderNo,
                            orderFlowNo: $scope.model.getReconciliationPage.orderFlowNo,
                            test: $scope.model.getReconciliationPage.test,
                            trainClassId: $scope.model.chooseClassItem.commoditySkuId,
                            completeStartTimeMills: !isNaN(completeStartTimeMills) ? completeStartTimeMills : 0,
                            completeEndTimeMills: !isNaN(completeEndTimeMills) ? completeEndTimeMills : 0,

                            rangeType: $scope.model.authorizedQuery.rangeType,
                            belongsType: $scope.model.authorizedQuery.belongsType,
                            authorizeToUnitId: $scope.model.authorizedQuery.authorizeToUnitId,
                            authorizedFromUnitId: $scope.model.authorizedQuery.authorizedFromUnitId,
                            objectId: $scope.model.authorizedQuery.objectId,
                            targetUnitId: $scope.model.authorizedQuery.targetUnitId
                        }).then(function (data) {
                            $scope.model.totalManageInfo = data.info;
                        });
                    },
                    ListOpen: function () {
                        $scope.model.gridPending = true;
                        var completeStartTimeMills = (new Date($scope.model.getReconciliationPage.completeStartTimeMills)).getTime();
                        var completeEndTimeMills = (new Date($scope.model.getReconciliationPage.completeEndTimeMills)).getTime();
                        reconciliationManageServices.exportReconciliation({
                            orderNo: $scope.model.getReconciliationPage.orderNo,
                            orderFlowNo: $scope.model.getReconciliationPage.orderFlowNo,
                            trainClassIdList: $scope.model.chooseClassItem.commoditySkuId,
                            test: $scope.model.getReconciliationPage.test,
                            completeStartTimeMills: !isNaN(completeStartTimeMills) ? completeStartTimeMills : 0,
                            completeEndTimeMills: !isNaN(completeEndTimeMills) ? completeEndTimeMills : 0,

                            rangeType: $scope.model.authorizedQuery.rangeType,
                            belongsType: $scope.model.authorizedQuery.belongsType,
                            authorizeToUnitId: $scope.model.authorizedQuery.authorizeToUnitId,
                            authorizedFromUnitId: $scope.model.authorizedQuery.authorizedFromUnitId,
                            objectId: $scope.model.authorizedQuery.objectId,
                            targetUnitId: $scope.model.authorizedQuery.targetUnitId
                        }).then(function (data) {
                            $scope.model.gridPending = false;
                            if (data.status) {
                                HB_dialog.success('提示', '列表数据导出成功');
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        }, function (data) {
                            $scope.model.gridPending = false;
                            HB_dialog.error('提示', data.info);
                        });
                    }
                };
                $scope.events.totalManage();


                $scope.kendoPlus = {
                    classGridInstance: null,
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


                $scope.windowOptions = {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                };
                $scope.node = {
                    lessonGrid: null
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


                    result.push('<td>');
                    result.push('#: orderNo #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: orderFlowNo === null?\'/\': orderFlowNo #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: completeTime === null?\'/\': completeTime#');
                    result.push('</td>');

                    result.push('<td title="#: commodityUnitName #">');
                    result.push('#: commodityUnitName?commodityUnitName:"-" #');
                    result.push('</td >');

                    result.push('<td title="#: accountUnitName #">');
                    result.push('#: accountUnitName?accountUnitName:"-" #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('购买人：' + '#: buyer.name #' + '</br>' + '身份证号' + '#: buyer.loginInput #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: totalAmount #');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplate = result.join('');
                })();
                $scope.ui = {
                    datePicker: {
                        begin: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd'
                                //change: utils.startChange
                            }
                        },
                        end: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd'
                                //change: utils.endChange
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
                                        url: '/web/admin/reconciliation/getReconciliationPage',
                                        data: function (e) {
                                            var completeStartTimeMills = (new Date($scope.model.getReconciliationPage.completeStartTimeMills)).getTime();
                                            var completeEndTimeMills = (new Date($scope.model.getReconciliationPage.completeEndTimeMills)).getTime();


                                            var temp = {
                                                pageNo: e.page,
                                                pageSize: $scope.model.page.pageSize,
                                                orderNo: $scope.model.getReconciliationPage.orderNo,
                                                orderFlowNo: $scope.model.getReconciliationPage.orderFlowNo,
                                                test: $scope.model.getReconciliationPage.test,
                                                trainClassId: $scope.model.chooseClassItem.commoditySkuId,
                                                completeStartTimeMills: !isNaN(completeStartTimeMills) ? completeStartTimeMills : 0,
                                                completeEndTimeMills: !isNaN(completeEndTimeMills) ? completeEndTimeMills : 0,

                                                rangeType: $scope.model.authorizedQuery.rangeType,
                                                belongsType: $scope.model.authorizedQuery.belongsType,
                                                authorizeToUnitId: $scope.model.authorizedQuery.authorizeToUnitId,
                                                authorizedFromUnitId: $scope.model.authorizedQuery.authorizedFromUnitId,
                                                objectId: $scope.model.authorizedQuery.objectId,
                                                targetUnitId: $scope.model.authorizedQuery.targetUnitId
                                            };
                                            $scope.model.page.pageNo = e.page;
                                            $scope.model.page.pageSize = e.pageSize;
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
                                {sortable: false, field: 'name', title: '订单号', width: 230},
                                {sortable: false, field: 'typeName', title: '交易流水号', width: 230},
                                {sortable: false, field: 'period', title: '交易成功时间', width: 150},
                                {sortable: false, field: 'commodityUnitName', title: '商品创建单位', width: 130},
                                {sortable: false, field: 'accountUnitName', title: '收款单位',  width: 130},
                                {sortable: false, field: 'teacherName', title: '购买人信息', width: 250},
                                {sortable: false, field: 'studyCount', title: '实付金额', width: 80}
                            ]
                        }
                    }
                };


            }]
    };
});