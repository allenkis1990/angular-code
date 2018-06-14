define(function () {
    'use strict';
    return {
        indexCtrl: ['$rootScope','$scope', 'hbUtil', '$http', 'HB_dialog', 'orderManageService', '$state', '$q', 'HB_notification', '$timeout','$stateParams',
            function ($rootScope,$scope, hbUtil, $http, HB_dialog, orderManageService, $state, $q, HB_notification, $timeout,$stateParams) {
                $scope.showTotal = false;
                $scope.tempClass = {};
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

                $scope.flagModel = {
                    tabType :"OWN",
                    viewProjectFirst : true,
                };
                $scope.model = {

                    tempPath: '',


                    outOrderList: [],

                    classPage: {
                        pageNo: 1,
                        pageSize: 10
                    },

                    cityList: [],
                    areaList: [],
                    subjectList: [],
                    yearList: [],
                    orderQueryParam: {
                        orderNo: '',//订单号 两个互相排斥
                        flowNo: '',//流水号 两个互相排斥
                        orderStatus: 'TRADE_SUCCESS',
                        tradeStartTimeMills: '',
                        tradeEndTimeMills: '',
                        createStartTimeMills: '',
                        createEndTimeMills: '',
                        loginInput: '',
                        professionLevel: '',
                        pageNo: 1,
                        pageSize: 10,
                        city: '',
                        region: '',
                        year: '',
                        subject: '',
                        test: 'false'
                    },
                    authorizedQuery:{
                        rangeType:null,
                        belongsType:null,
                        authorizeToUnitId:null,
                        authorizedFromUnitId:null,
                        objectId:null,
                        targetUnitId:null
                    },


                    orderStatusText: '交易成功时间',

                    searTotalInfo: {},

                    closeOrderDesc: ''

                };
                if(!hbUtil.validateIsNull($stateParams.batchNo)){
                    $scope.lockBatchNo = true;
                    $scope.model.orderQueryParam.batchNo = $stateParams.batchNo;
                    $scope.model.orderQueryParam.orderStatus="ALL";
                    $scope.model.orderQueryParam.test="";
                }
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
                    openKendoWindow: function (windowName) {
                        $scope[windowName].center().open();
                    },

                    closeKendoWindow: function (windowName) {
                        $scope[windowName].close();
                    },

                    MainPageQueryList: function (e, gridName, pageName) {
                        e.stopPropagation();
                        if (validataIdcard($scope.model.orderQueryParam.loginInput)) {
                            //alert('身份证必须是大于4位的数字');
                            HB_dialog.warning('提示', '如果账号为数字，至少输入4位才能进行查询！');
                            return false;
                        }
                        $scope.model[pageName].pageNo = 1;
                        $scope.kendoPlus[gridName].pager.page(1);
                        //刷新搜索结果合计
                        getOrderStatistic();
                    },

                    //培训班升序降序
                    setSortOrder: function (sortOrder) {
                        $scope.model.configedQueryParam.orderByCondition = 1;
                        $scope.model.configedQueryParam.sortOrder = sortOrder;
                        $scope.kendoPlus['classGridInstance'].pager.page(1);
                        $scope.kendoPlus['classGridInstance'].dataSource.read();
                    },
                    selectClass: function () {
                        HB_dialog.contentAs($scope, {
                            height: 570,
                            title: '选择培训方案',
                            width: 1100,
                            showCancel: false,
                            templateUrl: '@systemUrl@/views/orderManage/classSelect.html',
                            sure: function (dialog) {
                                console.log($scope.tempClass);
                                return $timeout(function () {
                                    dialog.close(dialog.dialogIndex);
                                });
                            }
                        });
                    },
                    clearSchemeTextContent: function () {
                        $scope.tempClass.schemeId = null;
                        $scope.tempClass.schemeName = null;
                    },
                    clearTextContent: function () {
                        $scope.model.orderQueryParam.trainClassName = '';
                        $scope.model.orderQueryParam.skuId = '';
                    },

                    toggleOrderStatus: function (e) {
                        if (e.target.checked === true) {
                            $scope.model.orderQueryParam.userSwap = true;
                        } else {
                            $scope.model.orderQueryParam.userSwap = false;
                        }
                    },

                    changeOrderTimeText: function () {
                        switch ($scope.model.orderQueryParam.orderStatus) {
                            case 'ALL':
                                //alert('订单创建时间');
                                $scope.model.orderStatusText = '订单创建时间';
                                break;

                            case 'WAIT_FOR_PAYMENT':
                                //alert('订单创建时间');
                                $scope.model.orderStatusText = '订单创建时间';
                                break;

                            case 'PAYING':
                                //alert('订单创建时间');
                                $scope.model.orderStatusText = '订单创建时间';
                                break;

                            case 'OPENING':
                                //alert('付款成功时间');
                                $scope.model.orderStatusText = '付款成功时间';
                                break;

                            case 'TRADE_SUCCESS':
                                //alert('交易成功时间');
                                $scope.model.orderStatusText = '交易成功时间';
                                break;

                            case 'TRADE_CLOSE':
                                //alert('交易关闭时间');
                                $scope.model.orderStatusText = '交易关闭时间';
                                break;
                        }

                    },

                    queryDetailClass: function (e, item) {
                        console.log(1);
                        $scope.temporaryClassList = item.subOrderList;
                        HB_dialog.contentAs($scope, {
                            templateUrl: '@systemUrl@/views/openRecord/queryDetailClassTpl.html',
                            width: 800,
                            title: '培训班',
                            showCertain: false
                        });
                    },

                    openTheClass: function (e, item) {
                        $scope.temporaryOrderNo = item.orderNo;
                        HB_notification.confirm('是否确认开通，确认开通后该订单对应的培训班将直接开班！', function (dialog) {
                            return $http.get('/web/admin/orderManage/redeliver/' + $scope.temporaryOrderNo).success(function (data) {
                                dialog.doRightClose();
                                if (data.status && data.info === true) {
                                    HB_dialog.success('提示', '系统正在开通中');
                                    $scope.kendoPlus['orderGridInstance'].dataSource.read();
                                } else {
                                    HB_dialog.warning('提示', data.info);
                                }
                            });
                        });

                    },

                    lookDetail: function (e, item) {
                        $state.go('states.orderManage.orderDetail', {orderNo: item.orderNo, from: 1});
                    },

                    closeTheOrder: function (e, item) {
                        console.log(item.orderNo);
                        $scope.temporaryOrderNo = item.orderNo;
                        HB_dialog.contentAs($scope, {
                            title: '关闭订单理由选择',
                            width: 650,
                            height: 320,
                            templateUrl: '@systemUrl@/views/orderManage/closeOrderDesDialog.html',

                            cancel: function () {
                                $scope.model.closeOrderDesc = '';
                            },

                            sure: function (dialog) {

                                var defer = $q.defer(),
                                    promise = defer.promise;
                                if (validateIsNull($scope.model.closeOrderDesc)) {
                                    $scope.model.closeOrderDesc = '关闭订单';
                                    /*HB_dialog.warning('提示','请选择关闭理由');
                                     defer.resolve();
                                     return promise;*/
                                }

                                console.log($scope.model.closeOrderDesc);

                                orderManageService.closeTheOrder($scope.temporaryOrderNo, $scope.model.closeOrderDesc).then(function (data) {
                                    defer.resolve();
                                    if (data.status) {
                                        HB_dialog.success('提示', data.info.message || '关闭订单成功');
                                        $scope.kendoPlus['orderGridInstance'].dataSource.read();
                                        dialog.close();
                                        $scope.model.closeOrderDesc = '';
                                    } else {
                                        HB_dialog.warning('提示', data.info);
                                        $scope.model.closeOrderDesc = '';
                                        //defer.resolve();
                                    }
                                });
                                return promise;
                            }
                        });
                    },

                    changeTitleLevel: function (id) {
                        //console.log(id);
                        if (id === '5628812b569c57e001569c5ab5f60001') {
                            $scope.learningTypeDisable = true;
                            $scope.model.configedQueryParam.learningType = -1;
                        } else {
                            $scope.learningTypeDisable = false;
                        }
                    },

                    exportOrder: function () {

                        if (validateIsNull($scope.model.orderQueryParam.orderNo) &&
                            validateIsNull($scope.model.orderQueryParam.batchNo) &&
                            validateIsNull($scope.model.orderQueryParam.tradeChannel) &&
                            validateIsNull($scope.model.orderQueryParam.flowNo) &&
                            $scope.model.orderQueryParam.orderStatus === 'ALL' &&
                            validateIsNull($scope.model.orderQueryParam.tradeStartTimeMills) &&
                            validateIsNull($scope.model.orderQueryParam.tradeEndTimeMills) &&
                            validateIsNull($scope.model.orderQueryParam.createStartTimeMills) &&
                            validateIsNull($scope.model.orderQueryParam.createEndTimeMills) &&
                            validateIsNull($scope.model.orderQueryParam.loginInput) &&
                            validateIsNull($scope.model.orderQueryParam.region) &&
                            validateIsNull($scope.model.orderQueryParam.city) &&
                            validateIsNull($scope.model.orderQueryParam.eliminateFreeOrder) &&
                            validateIsNull(getSchemeId($scope.tempClass))
                        ) {

                            HB_dialog.warning('提示', '选择至少一个搜索条件才能导出');
                            return false;

                        }


                        $scope.submitExportOrder = true;
                        orderManageService.exportOrder({
                            rangeType:$scope.model.authorizedQuery.rangeType,
                            belongsType:$scope.model.authorizedQuery.belongsType,
                            authorizeToUnitId:$scope.model.authorizedQuery.authorizeToUnitId,
                            authorizedFromUnitId:$scope.model.authorizedQuery.authorizedFromUnitId,
                            objectId:$scope.model.authorizedQuery.objectId,
                            targetUnitId:$scope.model.authorizedQuery.targetUnitId,

                            orderNo: $scope.model.orderQueryParam.orderNo,
                            batchNo: $scope.model.orderQueryParam.batchNo,
                            tradeChannel:$scope.model.orderQueryParam.tradeChannel,
                            flowNo: $scope.model.orderQueryParam.flowNo,
                            orderStatus: $scope.model.orderQueryParam.orderStatus,
                            region: validateIsNull($scope.model.orderQueryParam.region) ? $scope.model.tempPath : $scope.model.orderQueryParam.region,
                            tradeStartTimeMills: validateIsNull($scope.model.orderQueryParam.tradeStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeStartTimeMills),
                            tradeEndTimeMills: validateIsNull($scope.model.orderQueryParam.tradeEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeEndTimeMills) + 86399999,
                            createStartTimeMills: validateIsNull($scope.model.orderQueryParam.createStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.createStartTimeMills),
                            createEndTimeMills: validateIsNull($scope.model.orderQueryParam.createEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.createEndTimeMills) + 86399999,
                            loginInput: $scope.model.orderQueryParam.loginInput,
                            test: $scope.model.orderQueryParam.test,
                            eliminateFreeOrder: validateIsNull($scope.model.orderQueryParam.eliminateFreeOrder) === true ? false : $scope.model.orderQueryParam.eliminateFreeOrder,
                            schemeId: getSchemeId($scope.tempClass)
                        }).then(function (data) {
                            $scope.submitExportOrder = false;
                            if (data.status) {
                                if (data.info === true) {
                                    HB_dialog.success('提示', '导出成功');
                                } else {
                                    HB_dialog.error('提示', '导出失败');
                                }
                            }
                        });
                    },

                    changeCity: function (cityId) {
                        console.log($scope.model.orderQueryParam.region);
                        $scope.model.orderQueryParam.region = null;
                        if (validateIsNull(cityId)) {
                            $scope.model.areaList = [];
                            $scope.model.tempPath = '';
                            //$scope.model.orderQueryParam.region=null;
                        } else {
                            $scope.model.tempPath = findCityPath(cityId);
                            orderManageService.getAreaByParentId({parentId: cityId}).then(function (data) {
                                $scope.model.areaList = data.info;
                            });
                        }


                    }

                };


                function findCityPath (cityId) {
                    var path = null;
                    angular.forEach($scope.model.cityList, function (item) {
                        if (item.id === cityId) {
                            path = item.regionPath;
                        }
                    });
                    return path;
                }


                //订单模板
                var orderTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: orderNo #">');
                    result.push('<a href="javascript:void(0)" ng-if="#: businessType===\'SWAP_IN\' #" class="c-lab">换入</a>');
                    result.push('<a href="javascript:void(0)" ng-if="#: businessType===\'SWAP_OUT\' #" class="c-lab">换出</a>');
                    result.push('<a href="javascript:void(0)" style="width:70px;" ng-if="#: businessType===\'SWAP_IN_AND_OUT\' #" class="c-lab">换入、换出</a>');
                    result.push('#: orderNo #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: createTime #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: completeTime?completeTime:"-" #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<span>购买人：#: buyerName #</span>');
                    result.push('<br>');
                    result.push('<span>身份证：<span ng-if="#: buyer.loginInput===null #">-</span><span ng-if="#: buyer.loginInput!==null #">#: buyer.loginInput #</span></span>');
                    result.push('</td>');

                    result.push('<td title="#: commodityUnitName #">');
                    result.push('#: commodityUnitName?commodityUnitName:"-" #');
                    result.push('</td >');

                    result.push('<td title="#: accountUnitName #">');
                    result.push('#: accountUnitName?accountUnitName:"-" #');
                    result.push('</td>');

                    result.push('<td>');
                    //result.push('#: status #');
                    result.push('<span ng-if="#: status===1 #">待付款</span>');
                    result.push('<span ng-if="#: status===2 || status===3 || status===4 || status===5#">开通中</span>');
                    result.push('<span ng-if="#: status===6 #">交易成功</span>');
                    result.push('<span ng-if="#: status===7 #">交易关闭</span>');
                    result.push('<span ng-if="#: status===8 #">支付中</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: totalAmount #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" has-permission="orderManage/commonOrderDetail" class="table-btn" ng-click="events.lookDetail($event,dataItem)">详情</button>');
                    /*
                                        result.push ( '<button has-permission="orderManage/closeOrder" type="button" ng-if="#: status===1 || status===8 #" class="table-btn" ng-click="events.closeTheOrder($event,dataItem)">关闭订单</button>' );
                    */
                    result.push('<button has-permission="orderManage/openClass" style="color:darkgray" type="button" ng-if="#: (status===2 || status===3 || status===4 || status===5)&&allowRedeliver===false#" class="table-btn">继续发货</button>');
                    result.push('<button has-permission="orderManage/openClass" type="button" ng-click="events.openTheClass($event,dataItem)" ng-if="#: (status===2 || status===3 || status===4 || status===5)&&allowRedeliver===true#" class="table-btn">继续发货</button>');

                    result.push('</td>');

                    result.push('</tr>');
                    orderTemplate = result.join('');
                })();

                $scope.orderGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(orderTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/orderManage/getOrderPage',
                                    data: function (e) {
                                        var temp = {
                                            rangeType:$scope.model.authorizedQuery.rangeType,
                                            belongsType:$scope.model.authorizedQuery.belongsType,
                                            authorizeToUnitId:$scope.model.authorizedQuery.authorizeToUnitId,
                                            authorizedFromUnitId:$scope.model.authorizedQuery.authorizedFromUnitId,
                                            objectId:$scope.model.authorizedQuery.objectId,
                                            targetUnitId:$scope.model.authorizedQuery.targetUnitId,

                                            pageNo: e.page,
                                            //page:$scope.model.page.pageNo,
                                            pageSize: e.pageSize,
                                            orderNo: $scope.model.orderQueryParam.orderNo,
                                            batchNo: $scope.model.orderQueryParam.batchNo,
                                            tradeChannel:$scope.model.orderQueryParam.tradeChannel,
                                            flowNo: $scope.model.orderQueryParam.flowNo,
                                            orderStatus: $scope.model.orderQueryParam.orderStatus,
                                            region: validateIsNull($scope.model.orderQueryParam.region) ? $scope.model.tempPath : $scope.model.orderQueryParam.region,
                                            tradeStartTimeMills: validateIsNull($scope.model.orderQueryParam.tradeStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeStartTimeMills),
                                            tradeEndTimeMills: validateIsNull($scope.model.orderQueryParam.tradeEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeEndTimeMills) + 86399999,
                                            createStartTimeMills: validateIsNull($scope.model.orderQueryParam.createStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.createStartTimeMills),
                                            createEndTimeMills: validateIsNull($scope.model.orderQueryParam.createEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.createEndTimeMills) + 86399999,
                                            loginInput: $scope.model.orderQueryParam.loginInput,
                                            test: $scope.model.orderQueryParam.test,
                                            eliminateFreeOrder: validateIsNull($scope.model.orderQueryParam.eliminateFreeOrder) === true ? false : $scope.model.orderQueryParam.eliminateFreeOrder,
                                            schemeId: getSchemeId($scope.tempClass)
                                        };
                                        $scope.model.orderQueryParam.pageNo = e.page;
                                        $scope.model.orderQueryParam.pageSize = e.pageSize;
                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 5, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {

                                    angular.forEach(response.info, function (item) {
                                        item.firstGoods = item.subOrderList[0].productName;
                                        item.goodsCount = item.subOrderList.length;
                                        item.buyerName = item.buyer.name;
                                        item.idCard = item.buyer.idCard;
                                    });
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
                            hbUtil.kendo.grid.nullDataDealLeaf(e);
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
                            {field: 'index', title: 'No', sortable: false, width: 50},
                            {field: 'orderNo', title: '订单号', sortable: false, width: 230},
                            {field: 'createTime', title: '创建时间', sortable: false, width: 150},
                            {field: 'goodsCount', title: '交易成功时间', sortable: false, width: 150},
                            {field: 'totalAmount', title: '购买人信息', sortable: false, width: 250},
                            {field: 'commodityUnitName', title: '商品创建单位', sortable: false, width: 100},
                            {field: 'accountUnitName', title: '收款单位', sortable: false, width: 100},
                            {field: 'status', title: '交易状态', sortable: false, width: 80},
                            {field: 'totalAmount', title: '实付金额', sortable: false, width: 80},
                            {
                                title: '操作', width: 160
                            }
                        ]
                    }
                };

                getOrderStatistic();

                //获取搜索结果合计
                function getOrderStatistic () {
                    orderManageService.getOrderStatistic({
                        rangeType:$scope.model.authorizedQuery.rangeType,
                        belongsType:$scope.model.authorizedQuery.belongsType,
                        authorizeToUnitId:$scope.model.authorizedQuery.authorizeToUnitId,
                        authorizedFromUnitId:$scope.model.authorizedQuery.authorizedFromUnitId,
                        objectId:$scope.model.authorizedQuery.objectId,
                        targetUnitId:$scope.model.authorizedQuery.targetUnitId,

                        orderNo: $scope.model.orderQueryParam.orderNo,
                        batchNo: $scope.model.orderQueryParam.batchNo,
                        tradeChannel:$scope.model.orderQueryParam.tradeChannel,
                        flowNo: $scope.model.orderQueryParam.flowNo,
                        orderStatus: $scope.model.orderQueryParam.orderStatus,
                        region: validateIsNull($scope.model.orderQueryParam.region) ? $scope.model.tempPath : $scope.model.orderQueryParam.region,
                        tradeStartTimeMills: validateIsNull($scope.model.orderQueryParam.tradeStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeStartTimeMills),
                        tradeEndTimeMills: validateIsNull($scope.model.orderQueryParam.tradeEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeEndTimeMills) + 86399999,
                        createStartTimeMills: validateIsNull($scope.model.orderQueryParam.createStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.createStartTimeMills),
                        createEndTimeMills: validateIsNull($scope.model.orderQueryParam.createEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.createEndTimeMills) + 86399999,
                        loginInput: $scope.model.orderQueryParam.loginInput,
                        test: $scope.model.orderQueryParam.test,
                        eliminateFreeOrder: validateIsNull($scope.model.orderQueryParam.eliminateFreeOrder) === true ? false : $scope.model.orderQueryParam.eliminateFreeOrder,
                        schemeId: getSchemeId($scope.tempClass)
                    }).then(function (data) {
                        if (data.status) {
                            $scope.model.searTotalInfo = data.info;
                            if ($scope.model.orderQueryParam.orderStatus === 'TRADE_SUCCESS') {
                                $scope.showTotal = true;
                            } else {
                                $scope.showTotal = false;
                            }
                        }
                    });
                }


                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }

                //验证是否为空
                function getSchemeId (obj) {
                    if (obj === undefined || obj === null) {
                        return null;
                    }
                    return obj.schemeId;
                }

                //时间字符串转毫秒
                function parseTimeStrToLong (str) {
                    return kendo.parseDate(str).getTime();
                }

                //身份证必须大于4位的数字
                function validataIdcard (str) {

                    if (!validateIsNull(str)) {
                        if (!isNaN(Number(str)) && str.length < 5) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }


                orderManageService.getAreaByParentId({parentId: '340000'}).then(function (data) {
                    $scope.model.cityList = data.info;
                });

            }]
    };
});