define(function () {
    'use strict';
    return {
        indexCtrl: ['$scope', 'hbUtil', '$http', 'HB_dialog', 'orderManageService', '$state', '$q', 'HB_notification', 'TabService',
            function ($scope, hbUtil, $http, HB_dialog, orderManageService, $state, $q, HB_notification, TabService) {
                $scope.showTotal = false;
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

                $scope.model = {

                    outOrderList: [],

                    classPage: {
                        pageNo: 1,
                        pageSize: 10
                    },

                    orderQueryParam: {

                        trainClassName: '',//用于显示用的
                        orderNo: '',//订单号 两个互相排斥
                        flowNo: '',//流水号 两个互相排斥
                        orderStatus: 'ALL',
                        tradeStartTimeMills: '',
                        tradeEndTimeMills: '',
                        buyerName: '',
                        loginInput: '',
                        receiveAccountId: '',
                        skuId: '',//培训班ID
                        userSwap: false,
                        eliminateFreeOrder: false,//是否剔除0元订单
                        operatorId: '',
                        professionLevel: '',
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

                    orderStatusText: '订单创建时间',

                    searTotalInfo: {},

                    closeOrderDesc: ''

                };

                $scope.events = {

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

                    choseClass: function (e, item) {
                        $scope.model.orderQueryParam.trainClassName = item.commodityName;
                        $scope.model.orderQueryParam.skuId = item.commoditySkuId;
                        $scope.events.closeKendoWindow('classWindow');
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

                    toggleEliminateFreeOrder: function (e) {
                        if (e.target.checked === true) {
                            $scope.model.orderQueryParam.eliminateFreeOrder = true;
                        } else {
                            $scope.model.orderQueryParam.eliminateFreeOrder = false;
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

                        TabService.appendNewTab('开通订单', 'states.orderManage.orderDetail', {
                            orderNo: item.orderNo,
                            from: 2
                        }, 'states.orderManage', true);
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
                            validateIsNull($scope.model.orderQueryParam.flowNo) &&
                            validateIsNull($scope.model.orderQueryParam.skuId) &&
                            $scope.model.orderQueryParam.orderStatus === 'ALL' &&
                            validateIsNull($scope.model.orderQueryParam.tradeStartTimeMills) &&
                            validateIsNull($scope.model.orderQueryParam.tradeEndTimeMills) &&
                            validateIsNull($scope.model.orderQueryParam.buyerName) &&
                            validateIsNull($scope.model.orderQueryParam.loginInput) &&
                            validateIsNull($scope.model.orderQueryParam.receiveAccountId)) {

                            HB_dialog.warning('提示', '选择至少一个搜索条件才能导出');
                            return false;

                        }


                        $scope.submitExportOrder = true;
                        orderManageService.exportDistributorOrder({
                            orderNo: $scope.model.orderQueryParam.orderNo,
                            flowNo: $scope.model.orderQueryParam.flowNo,
                            skuId: $scope.model.orderQueryParam.skuId,
                            orderStatus: $scope.model.orderQueryParam.orderStatus,
                            tradeStartTimeMills: validateIsNull($scope.model.orderQueryParam.tradeStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeStartTimeMills),
                            tradeEndTimeMills: validateIsNull($scope.model.orderQueryParam.tradeEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeEndTimeMills) + 86399999,
                            receiveAccountId: $scope.model.orderQueryParam.receiveAccountId,
                            loginInput: $scope.model.orderQueryParam.loginInput,
                            buyerName: $scope.model.orderQueryParam.buyerName,
                            userSwap: $scope.model.orderQueryParam.userSwap,
                            operatorId: $scope.model.orderQueryParam.operatorId
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
                    }

                };

                //已配置模板
                var classGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td title="#: commodityName #">');
                    result.push('#:commodityName#');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span>年度：</span>' + '#:trainingYear#');
                    result.push('<br />');
                    result.push('<span>职称等级：</span>' + '#:titleLevel#');
                    result.push('<br />');
                    //result.push('<span>学习类别：</span>'+'#:learningType#');
                    result.push('<span>学习类别：</span>');
                    result.push('<span ng-if="#:learningType===null#">-</span>');
                    result.push('<span ng-if="#:learningType!==null#">#:learningType#</span>');
                    result.push('<br />');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="#:onSaleState==1#">已上架</span>' + '<span ng-if="#:onSaleState==2#">待上架</span>' + '<span ng-if="#:onSaleState==3#">已下架</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="#:saleState==1#">已售</span>' + '<span ng-if="#:saleState==2#">未售</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: credit #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: price #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('首次上架时间：');
                    result.push('<span ng-if="#: firstUpTime!==null #">#: firstUpTime #</span>');
                    result.push('<span ng-if="#: firstUpTime==null #">-</span>');
                    result.push('<br />');
                    //result.push('预计上架时间：');
                    result.push('<span ng-if="#: futureUpTime!==null #">预计上架时间：#: futureUpTime #</span>');
                    //result.push('预计上架时间：'+'<span ng-if="#: futureUpTime!==null #">#: futureUpTime #</span>');
                    //result.push('<span ng-if="#: futureUpTime==null #">-</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.choseClass($event,dataItem)">选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    classGridRowTemplate = result.join('');
                })();

                $scope.classGrid = {
                    options: hbUtil.kdGridCommonOption({
                        template: classGridRowTemplate,
                        url: '/web/admin/commodityManager/getConfigDone',
                        scope: $scope,
                        page: 'classPage',
                        param: $scope.model.configedQueryParam,
                        fn: function (response) {
                            console.log(response);
                            $scope.configedArr = response.info;
                        },
                        columns: [
                            {field: 'commodityName', title: '班级名称', sortable: false},
                            {field: 'attr', title: '属性', sortable: false, width: 230},
                            {field: 'onSaleState', title: '上架状态', sortable: false, width: 80},
                            {field: 'saleState', title: '是否出售', sortable: false, width: 80},
                            {field: 'credit', title: '学分', sortable: false, width: 80},
                            {field: 'price', title: '价格', sortable: false, width: 80},
                            {
                                field: 'onSaleTime', title: '上架时间', sortable: false, width: 260,
                                headerTemplate: '上架时间<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder==0" ng-click="events.setSortOrder(1)" class="ico lwh-ico-up"></a>' +
                                '<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder!==0" ng-click="events.setSortOrder(0)" class="ico lwh-ico-down"></a>'
                            },
                            {
                                title: '操作', width: 80
                            }
                        ]
                    })
                };

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

                    //result.push('<span ng-bind-html="#: html #"></span>');
                    result.push('<div ng-repeat="item in dataItem.subOrderList" title="b{{item.productName}}">b{{item.productName}}</div>');
                    //result.push('<br>');
                    //result.push('<button ng-click="events.queryDetailClass($event,dataItem)" type="button" class="table-btn">#: goodsCount #个培训班</button>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: goodsCount #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: totalAmount #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span>购买人：#: buyerName #</span>');
                    result.push('<br>');
                    result.push('<span>帐号：<span ng-if="#: buyer.loginInput===null #">-</span><span ng-if="#: buyer.loginInput!==null #">#: buyer.loginInput #</span></span>');
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
                    result.push('<button type="button" has-permission="orderManage/commonOrderDetail" class="table-btn" ng-click="events.lookDetail($event,dataItem)">详情</button>');
                    result.push('<button has-permission="orderManage/closeOrder" type="button" ng-if="#: status===1 || status===8 #" class="table-btn" ng-click="events.closeTheOrder($event,dataItem)">关闭订单</button>');
                    result.push('<button has-permission="orderManage/openClass" style="color:darkgray" type="button" ng-if="#: (status===2 || status===3 || status===4 || status===5)&&allowRedeliver===false#" class="table-btn">继续开通</button>');
                    result.push('<button has-permission="orderManage/openClass" type="button" ng-click="events.openTheClass($event,dataItem)" ng-if="#: (status===2 || status===3 || status===4 || status===5)&&allowRedeliver===true#" class="table-btn">继续开通</button>');

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
                                    url: '/web/admin/distributorOpenManage/getOrderPage',
                                    data: function (e) {
                                        var temp = {
                                            pageNo: e.page,
                                            //page:$scope.model.page.pageNo,
                                            pageSize: e.pageSize,
                                            orderNo: $scope.model.orderQueryParam.orderNo,
                                            flowNo: $scope.model.orderQueryParam.flowNo,
                                            orderStatus: $scope.model.orderQueryParam.orderStatus,
                                            tradeStartTimeMills: validateIsNull($scope.model.orderQueryParam.tradeStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeStartTimeMills),
                                            tradeEndTimeMills: validateIsNull($scope.model.orderQueryParam.tradeEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeEndTimeMills) + 86399999,
                                            buyerName: $scope.model.orderQueryParam.buyerName,
                                            loginInput: $scope.model.orderQueryParam.loginInput,
                                            receiveAccountId: $scope.model.orderQueryParam.receiveAccountId,
                                            skuId: $scope.model.orderQueryParam.skuId,
                                            userSwap: $scope.model.orderQueryParam.userSwap,
                                            eliminateFreeOrder: $scope.model.orderQueryParam.eliminateFreeOrder,
                                            operatorId: $scope.model.orderQueryParam.operatorId,
                                            professionLevel: $scope.model.orderQueryParam.professionLevel
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
                            {field: 'firstGoods', title: '商品信息', sortable: false},
                            {field: 'goodsCount', title: '数量', sortable: false, width: 60},
                            {field: 'totalAmount', title: '实付金额', sortable: false, width: 80},
                            {field: 'totalAmount', title: '购买人信息', sortable: false, width: 250},
                            {field: 'status', title: '订单状态', sortable: false, width: 80},
                            {
                                title: '操作', width: 160
                            }
                        ]
                    }
                };

                function initSomeTing () {
                    //获取年度
                    $http.get('/web/admin/commodityManager/getTrainingYearList').success(function (data) {
                        $scope.model.yearList = data.info;
                        $scope.model.yearList.unshift({name: '选择培训年度', optionId: -1});
                    });

                    //获取职称等级
                    $http.get('/web/admin/commodityManager/getTitleLevelList').success(function (data) {
                        $scope.model.titleLevelList = data.info;
                        $scope.model.titleLevelList.unshift({name: '选择职称等级', optionId: -1});
                    });

                    //获取学习类别
                    $http.get('/web/admin/commodityManager/getLearningTypeList').success(function (data) {
                        $scope.model.learningTypeList = data.info;
                        $scope.model.learningTypeList.unshift({name: '选择学习类别', optionId: -1});
                    });

                    //获取收款账号
                    $http.get('/web/admin/paymentAccount/getPaymentAccountList?tradeType=0').success(function (data) {
                        if (data.status) {
                            $scope.model.payeeAccountArr = data.info;
                        }
                    });

                    //获取搜索结果合计
                    getOrderStatistic();

                }

                initSomeTing();

                //获取搜索结果合计
                function getOrderStatistic () {
                    orderManageService.getDistributorOrderStatistic({
                        orderNo: $scope.model.orderQueryParam.orderNo,
                        flowNo: $scope.model.orderQueryParam.flowNo,
                        orderStatus: $scope.model.orderQueryParam.orderStatus,
                        tradeStartTimeMills: validateIsNull($scope.model.orderQueryParam.tradeStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeStartTimeMills),
                        tradeEndTimeMills: validateIsNull($scope.model.orderQueryParam.tradeEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.orderQueryParam.tradeEndTimeMills) + 86399999,
                        buyerName: $scope.model.orderQueryParam.buyerName,
                        loginInput: $scope.model.orderQueryParam.loginInput,
                        receiveAccountId: $scope.model.orderQueryParam.receiveAccountId,
                        skuId: $scope.model.orderQueryParam.skuId,
                        userSwap: $scope.model.orderQueryParam.userSwap,
                        eliminateFreeOrder: $scope.model.orderQueryParam.eliminateFreeOrder,
                        operatorId: $scope.model.orderQueryParam.operatorId,
                        professionLevel: $scope.model.orderQueryParam.professionLevel
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

            }]
    };
});