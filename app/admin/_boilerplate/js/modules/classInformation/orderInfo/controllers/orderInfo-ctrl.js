define(function (orderInfo) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'hbUtil', 'HB_dialog', 'TabService', '$http', '$timeout', '$rootScope', '$state', 'classInformationServices', 'HB_notification',
            function ($scope, hbUtil, HB_dialog, TabService, $http, $timeout, $rootScope, $state, classInformationServices, HB_notification) {

                $scope.model.mark = false;

                $scope.$watch('model.userId', function (newVal) {
                    if (newVal) {
                        $scope.model.mark = false;
                        classInformationServices.doview($state.current.name);
                        $scope.orderQueryParam.buyerId = newVal;
                        if ($scope.kendoPlus.gridDelay === false && $scope.model.classTab === 2) {
                            $scope.kendoPlus.gridDelay = true;
                            //$scope.model.mark=true;
                        } else {
                            if ($scope.model.classTab === 2) {
                                $scope.events.MainPageQueryList();
                            }

                        }
                    }
                    console.log(newVal);
                });

                $scope.kendoPlus = {
                    orderGridInstance: null,
                    timeModel: null,
                    timeOptions: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd'
                        //format : "yyyy-MM-dd HH:mm:00"
                        //min: new Date()
                    },

                    gridDelay: false
                };

                $scope.orderQueryParam = {
                    orderNo: '',
                    orderStatus: 'ALL',
                    tradeStartTimeMills: '',
                    tradeEndTimeMills: '',
                    userSwap: false,
                    pageNo: 1,
                    pageSize: 10,
                    buyerId: '',
                    orderStatusText: '订单创建时间'
                };
                $scope.authorizedParam = {};

                $scope.events = {

                    MainPageQueryList: function (e) {
                        //e.stopPropagation();
                        $scope.orderQueryParam.pageNo = 1;
                        $scope.kendoPlus.orderGridInstance.pager.page(1);
                    },

                    toggleOrderStatus: function (e) {
                        if (e.target.checked === true) {
                            $scope.orderQueryParam.userSwap = true;
                        } else {
                            $scope.orderQueryParam.userSwap = false;
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

                    goOrderDetail: function (e, item) {
                        TabService.appendNewTab('订单管理', 'states.orderManage.orderDetail', {
                            orderNo: item.orderNo,
                            from: 2
                        }, 'states.orderManage', true);
                        //$state.go('states.orderManage.orderDetail',{orderNo:item.orderNo});
                    },

                    openTheClass: function (e, item) {
                        $scope.temporaryOrderNo = item.orderNo;
                        HB_notification.confirm('是否确认开通，确认开通后该订单对应的培训班将直接开班！', function (dialog) {
                            return $http.get('/web/admin/orderManage/redeliver/' + $scope.temporaryOrderNo).success(function (data) {
                                dialog.doRightClose();
                                if (data.status && data.info === true) {
                                    HB_dialog.success('提示', '系统正在开通中');
                                    $scope.kendoPlus.orderGridInstance.dataSource.read();
                                } else {
                                    HB_dialog.warning('提示', data.info);
                                }
                            });
                        });

                    },

                    changeOrderTimeText: function () {
                        switch ($scope.orderQueryParam.orderStatus) {
                            case 'ALL':
                                $scope.orderQueryParam.orderStatusText = '订单创建时间';
                                break;

                            case 'WAIT_FOR_PAYMENT':
                                $scope.orderQueryParam.orderStatusText = '订单创建时间';
                                break;

                            case 'PAYING':
                                $scope.orderQueryParam.orderStatusText = '订单创建时间';
                                break;

                            case 'OPENING':
                                $scope.orderQueryParam.orderStatusText = '付款成功时间';
                                break;

                            case 'TRADE_SUCCESS':
                                $scope.orderQueryParam.orderStatusText = '交易成功时间';
                                break;

                            case 'TRADE_CLOSE':
                                $scope.orderQueryParam.orderStatusText = '交易关闭时间';
                                break;
                        }

                    }
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
                    result.push('#: hour #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#:completeTime || "-" #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span>购买人：#: buyerName #</span>');
                    result.push('<br>');
                    result.push('<span>身份证：<span ng-if="#: buyer.loginInput===null #">-</span><span ng-if="#: buyer.loginInput!==null #">#: buyer.loginInput #</span></span>');
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
                    result.push('<button type="button" has-permission="orderManage/commonOrderDetail" class="table-btn" ng-click="events.goOrderDetail($event,dataItem)">详情</button>');
                    result.push('<button has-permission="orderInfo/openClass" type="button" style="color:darkgray" ng-if="#: (status===2 || status===3 || status===4 || status===5)&&allowRedeliver===false#" class="table-btn">继续开通</button>');
                    result.push('<button has-permission="orderInfo/openClass" type="button" ng-if="#: (status===2 || status===3 || status===4 || status===5)&&allowRedeliver===true#" class="table-btn" ng-click="events.openTheClass($event,dataItem)">继续开通</button>');
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
                                    url: '/web/admin/customerService/getUserOrder?',
                                    data: function (e) {
                                        var temp = {
                                            pageNo: e.page,
                                            //page:$scope.model.page.pageNo,
                                            pageSize: $scope.orderQueryParam.pageSize,
                                            orderNo: $scope.orderQueryParam.orderNo,
                                            orderStatus: $scope.orderQueryParam.orderStatus,
                                            createStartTimeMills: validateIsNull($scope.orderQueryParam.tradeStartTimeMills) ? 0 : parseTimeStrToLong($scope.orderQueryParam.tradeStartTimeMills),
                                            createEndTimeMills: validateIsNull($scope.orderQueryParam.tradeEndTimeMills) ? 0 : parseTimeStrToLong($scope.orderQueryParam.tradeEndTimeMills) + 86399999,
                                            userSwap: $scope.orderQueryParam.userSwap,
                                            buyerId: $scope.orderQueryParam.buyerId
                                        };
                                        if(hbUtil.validateIsNull($scope.authorizedParam)==false){
                                            angular.forEach($scope.authorizedParam,function(value,key){
                                                temp[key]=value;
                                            });
                                        }
                                        $scope.orderQueryParam.pageNo = e.page;

                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;
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
                                    $timeout(function () {
                                        $scope.model.mark = true;
                                    });
                                    angular.forEach(response.info, function (item) {
                                        item.firstGoods = item.subOrderList[0].productName;
                                        item.goodsCount = item.subOrderList.length;
                                        item.buyerName = item.buyer.name;
                                        item.idCard = item.buyer.idCard;
                                        //item.subOrderList=[{productName:55},{productName:55},{productName:55}];
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
                        /*  columns    : [
                              { field: "index", title: "No", sortable: false, width: 50 },
                              { field: "orderNo", title: "订单号", sortable: false, width: 300 },
                              { field: "createTime", title: "创建时间", sortable: false, width: 160 },
                             /!* { field: "firstGoods", title: "商品信息", sortable: false, width: 280 },*!/
                              { field: "goodsCount", title: "数量", sortable: false, width: 60 },
                              { field: "totalAmount", title: "实付金额", sortable: false, width: 80 },
                              { field: "totalAmount", title: "购买人信息", sortable: false, width: 240 },
                              { field: "payType", title: "缴费方式", sortable: false, width: 80 },
                              { field: "status", title: "订单状态", sortable: false, width: 80 },
                              {
                                  title: "操作", width: 120
                              }
                          ]*/
                        columns: [
                            {field: 'index', title: 'No', sortable: false, width: 50},
                            {field: 'orderNo', title: '订单号', sortable: false, width: 200},
                            {field: 'createTime', title: '创建时间', sortable: false, width: 150},
                            {field: 'goodsCount', title: '学时数', sortable: false, width: 60},
                            {field: 'completeTime', title: '交易成功时间', sortable: false, width: 150},
                            {field: 'totalAmount', title: '购买人信息', sortable: false, width: 200},
                            {field: 'status', title: '交易状态', sortable: false, width: 80},
                            {field: 'totalAmount', title: '实付金额', sortable: false, width: 80},
                            {
                                title: '操作', width: 90
                            }
                        ]
                    }
                };

                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }

                //时间字符串转毫秒
                function parseTimeStrToLong (str) {
                    return kendo.parseDate(str).getTime();
                }

            }]
    };
});