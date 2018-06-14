define(function (refundOrder) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'hbUtil', 'HB_dialog', 'TabService', '$http', '$timeout', '$rootScope', '$state', 'classInformationServices', 'HB_notification',
            function ($scope, hbUtil, HB_dialog, TabService, $http, $timeout, $rootScope, $state, customerServices, HB_notification) {

                $scope.model.mark = false;

                $scope.$watch('model.userId', function (newVal) {
                    if (newVal) {
                        $scope.model.mark = false;
                        customerServices.doview($state.current.name);
                        $scope.refundQueryParam.buyerId = newVal;
                        if ($scope.kendoPlus.gridDelay === false && $scope.model.classTab === 9) {
                            $scope.kendoPlus.gridDelay = true;
                            //$scope.model.mark=true;
                        } else {
                            if ($scope.model.classTab === 9) {
                                $scope.events.MainPageQueryList();
                            }

                        }
                    }
                    console.log(newVal);
                });

                $scope.kendoPlus = {
                    refundGridInstance: null,
                    timeModel: null,
                    timeOptions: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd'
                        //format : "yyyy-MM-dd HH:mm:00"
                        //min: new Date()
                    },

                    gridDelay: false
                };

                $scope.refundQueryParam = {
                    orderNo: '',
                    refundOrderStatus: 'ALL',
                    tradeStartTimeMills: '',
                    tradeEndTimeMills: '',
                    pageNo: 1,
                    pageSize: 10,
                    buyerId: ''

                };

                $scope.events = {

                    MainPageQueryList: function (e) {
                        //e.stopPropagation();
                        $scope.refundQueryParam.pageNo = 1;
                        $scope.kendoPlus.refundGridInstance.pager.page(1);
                    },

                    /*    toggleOrderStatus: function ( e ) {
                            if ( e.target.checked === true ) {
                                $scope.refundQueryParam.userSwap = true;
                            } else {
                                $scope.refundQueryParam.userSwap = false;
                            }
                        },*/

                    /*    queryDetailClass: function ( e, item ) {
                            console.log ( 1 );
                            $scope.temporaryClassList = item.subOrderList;
                            HB_dialog.contentAs ( $scope, {
                                templateUrl: '@systemUrl@/views/openRecord/queryDetailClassTpl.html',
                                width      : 800,
                                title      : '培训班',
                                showCertain: false
                            } );
                        },
    */
                    goOrderDetail: function (e, item) {
                        TabService.appendNewTab('订单管理', 'states.orderManage.orderDetail', {
                            orderNo: item.refundMasterOrderNo,
                            from: 1
                        }, 'states.orderManage', true);

                    },
                    goRefundDetail: function (e, item) {
                        TabService.appendNewTab('退款管理', 'states.refundManage.refundDetail', {
                            orderNo: item.refundNo
                        }, 'states.refundManage', true);

                    },
                    openTheClass: function (e, item) {
                        $scope.temporaryOrderNo = item.orderNo;
                        HB_notification.confirm('是否确认开通，确认开通后该订单对应的培训班将直接开班！', function (dialog) {
                            return $http.get('/web/admin/orderManage/redeliver/' + $scope.temporaryOrderNo).success(function (data) {
                                dialog.doRightClose();
                                if (data.status && data.info === true) {
                                    HB_dialog.success('提示', '系统正在开通中');
                                    $scope.kendoPlus.refundGridInstance.dataSource.read();
                                } else {
                                    HB_dialog.warning('提示', data.info);
                                }
                            });
                        });

                    }


                };

                //订单模板
                var refundTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td >');
                    result.push('<a  style=text-decoration:underline;color:deepskyblue ng-click="events.goOrderDetail($event,dataItem)">#: refundMasterOrderNo #</a>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: productName #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: labelPrice #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: purchaseQuantity #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: totalAmount #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: refundAmount #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('购买人：#: buyer.name # ');
                    result.push('<br> ');
                    result.push('帐号：#:buyer.loginInput # ');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: applyTime #  ');
                    result.push('</td>');

                    result.push('<td  >');
                    result.push(' <span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===1">退款审批中</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===2">退款处理中</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===3">拒绝退款</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===4">退款处理中</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===5">退款处理中</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===6">退款成功</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===7">拒绝退款</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===8">退款失败</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===9">已取消</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===10">退款失败</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===11">退款成功</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===12">退款成功</span>' +
                        '<span style="color:red;text-decoration:underline" ng-click="events.goRefundDetail($event,dataItem)"  ng-if="dataItem.refundStatus===13">已取消</span> ');
                    result.push('</td>');

                    result.push('<td>');
                    result.push(' <span ng-if="#: refundSuccessTime===null #">——</span> <span  ng-if="#: refundSuccessTime!==null #">#: refundSuccessTime #  </span>');
                    result.push('</td>');

                    result.push('</tr>');
                    refundTemplate = result.join('');
                })();

                $scope.refundGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(refundTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/refund/pageRefundmentOrder?',
                                    data: function (e) {
                                        var temp = {
                                            pageNo: e.page,
                                            //page:$scope.model.page.pageNo,
                                            pageSize: $scope.refundQueryParam.pageSize,
                                            orderNo: $scope.refundQueryParam.orderNo,
                                            refundOrderStatus: $scope.refundQueryParam.refundOrderStatus,
                                            /*                                            tradeStartTimeMills: validateIsNull ( $scope.refundQueryParam.tradeStartTimeMills ) ? 0 : parseTimeStrToLong ( $scope.refundQueryParam.tradeStartTimeMills ),
                                                                                        tradeEndTimeMills  : validateIsNull ( $scope.refundQueryParam.tradeEndTimeMills ) ? 0 : parseTimeStrToLong ( $scope.refundQueryParam.tradeEndTimeMills )+86399999,
                                                                                        applyStartTimeMills: validateIsNull ( $scope.refundQueryParam.applyStartTimeMills ) ? 0 : parseTimeStrToLong ( $scope.refundQueryParam.tradeStartTimeMills ),
                                                                                        applyEndTimeMills  : validateIsNull ( $scope.refundQueryParam.applyEndTimeMills ) ? 0 : parseTimeStrToLong ( $scope.refundQueryParam.tradeEndTimeMills )+86399999,*/
                                            /*   tradeStartTimeMills: validateIsNull($scope.refundQueryParam.tradeStartTimeMills ) === true ? 0 : parseTimeStrToLong ( $scope.refundQueryParam.tradeStartTimeMills),
                                               tradeEndTimeMills: validateIsNull( $scope.refundQueryParam.tradeEndTimeMills ) === true ? 0 : parseTimeStrToLong ( $scope.refundQueryParam.tradeEndTimeMills)+86399999,
                                             */
                                            applyStartTimeMills: validateIsNull($scope.refundQueryParam.applyStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.refundQueryParam.applyStartTimeMills),
                                            applyEndTimeMills: validateIsNull($scope.refundQueryParam.applyEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.refundQueryParam.applyEndTimeMills) + 86399999,

                                            buyerId: $scope.refundQueryParam.buyerId
                                        };

                                        $scope.refundQueryParam.pageNo = e.page;
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
                                    console.log(response);
                                    /*   angular.forEach ( response.info, function ( item ) {
                                           item.firstGoods = item.subOrderList[0].productName;
                                           item.goodsCount = item.subOrderList.length;
                                           item.buyerName  = item.buyer.name;
                                           item.idCard     = item.buyer.idCard;
                                           //item.subOrderList=[{productName:55},{productName:55},{productName:55}];
                                       } );*/
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
                            {field: 'orderNo', title: '订单号', sortable: false, width: 200},
                            {field: 'firstGoods', title: '退款物品', sortable: false, width: 280},
                            {field: 'firstGoods', title: '单价', sortable: false, width: 70},
                            {field: 'goodsCount', title: '数量', sortable: false, width: 60},
                            {field: 'totalAmount', title: '实付金额', sortable: false, width: 70},
                            {field: 'totalAmount', title: '退款金额', sortable: false, width: 70},
                            {field: 'buyer', title: '购买人信息', sortable: false, width: 240},
                            {field: 'payType', title: '申请时间', sortable: false, width: 200},
                            {field: 'status', title: '退款状态', sortable: false, width: 120},
                            {
                                title: '退款时间', width: 200
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