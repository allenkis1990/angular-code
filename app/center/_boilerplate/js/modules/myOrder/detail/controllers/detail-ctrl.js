define(function (detail) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$stateParams', '$http', '$state', '$dialog', 'myOrderService', '$timeout', '$rootScope', 'signUpTrainingService', function ($scope, $stateParams, $http, $state, $dialog, myOrderService, $timeout, $rootScope, signUpTrainingService) {


            $scope.model = {
                detailInfo: {},
                goodsSkuIdArr: [],
                curLinePre: 0,
                stepLineWidth: 0,
                cacelOrderDialog: null,
                statusName: '',
                widthStyle: {},
                message: '我不想买了',

                derivativeOrderList: [],//关联订单
                initialOrder: []//初始订单

            };

            $scope.events = {

                goPdfPath: function (path) {
                    window.open(path, '_blank');
                },

                goPay: function () {
                    $state.go('states.myOrder.goPay', {orderNo: $stateParams.orderNo});
                    //$state.go('states.myOrder.creatOrder',{ids:parseStrFromArr($scope.model.goodsSkuIdArr)});
                },


                cancelOrder: function () {
                    myOrderService.cancelOrderFn($scope, $scope.model.detailInfo.orderNo, $dialog);
                },

                confirmCancelOrder: function () {

                    myOrderService.confirmCancelOrder($scope, myOrderService, $dialog, function () {
                        initOrderDetail();
                    });
                },

                lookDetail: function (orderNo) {
                    //$scope.orderDialog.remove();
                    window.open('/center/#/myOrder/detail/' + orderNo);
                },


                lookIntroduction: function (item) {
                    if (item.status === 5) {
                        window.open('/center/#/myRealClass/' + item.trainClassId);
                    } else {
                        window.open('/center/#/signUpTraining/introduction/' + item.productId);
                    }
                },

                payRightNow: function () {
                    /*myOrderService.payRightNow($scope,$stateParams.orderNo,myOrderService,$dialog,function(){
                        initOrderDetail();
                    },signUpTrainingService);*/

                    $state.go('states.myOrder.goPay', {orderNo: $stateParams.orderNo});
                },

                goGoodsDetail: function (item) {
                    $state.go('states.signUpTraining.introduction', {
                        commoditySkuId: item.commoditySkuId,
                        coursePoolId: item.coursePoolId,
                        courseId: item.courseId,
                        fromWhere: $stateParams.orderNo
                    });
                },

                lookAssociatedDetail: function (item) {
                    if ($scope.submitAble) {
                        return false;
                    }
                    $scope.submitAble = true;
                    $http.get('/web/front/studentOrder/getAssociatedOrder/' + item.subOrderNo).success(function (data) {
                        $scope.submitAble = false;
                        if (data.status) {
                            console.log(data);
                            $scope.model.derivativeOrderList = data.info.derivativeOrderList;
                            $scope.model.initialOrder = data.info.initialOrder;

                            $dialog.contentDialog({
                                title: '换班订单',
                                visible: true,
                                modal: true,
                                width: 1000,
                                contentUrl: '@systemUrl@/views/myOrder/changeOrderDialog.html'
                            }, $scope);


                        }
                    });
                }
            };


            /*<span ng-if="item.status===1||item.status===2">等待付款</span
                ><span ng-if="item.status===3||item.status===4||item.status===5">开通中</span
                ><span ng-if="item.status===6">交易成功</span
                ><span ng-if="item.status===7">交易关闭</span
                ><span ng-if="item.status===8">支付中</span>*/
            function getOrderStatus (status) {
                var statusName = null;
                if (status === 1 || status === 2) {
                    statusName = '等待付款';
                }
                if (status === 3 || status === 4 || status === 5) {
                    statusName = '开通中';
                }
                if (status === 6) {
                    statusName = '交易成功';
                }
                if (status === 7) {
                    statusName = '交易关闭';
                }
                if (status === 8) {
                    statusName = '付款中';
                }

                return statusName;

            }

            function getOrderStepW (arr) {
                var tempArr = [];
                angular.forEach(arr, function (item) {
                    if (item.processed === true) {
                        tempArr.push(item);
                    }
                });

                if (tempArr.length === 1) {
                    return {width: 0};
                }
                if (tempArr.length === 2) {
                    return {width: '33%'};
                }
                if (tempArr.length === 3) {
                    return {width: '66%'};
                }
                if (tempArr.length === 4) {
                    return {width: '100%'};
                }

            }

            //解决JS精度丢失问题
            function accAdd (arg1, arg2) {
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2));
                return (arg1 * m + arg2 * m) / m;
            }

            function getTotalLabelPrice (arr) {
                var total = 0;
                angular.forEach(arr, function (item) {
                    total = accAdd(total, item.labelPrice);
                });
                return total;
            }

            initOrderDetail();

            function initOrderDetail () {
                $http.get('/web/front/studentOrder/get/' + $stateParams.orderNo).success(function (data) {
                    if (data.status) {
                        $scope.model.detailInfo = data.info;
                        //$scope.model.detailInfo.unitName='我我我我我我我我我我我我我我我我哦我为';

                        $scope.model.statusName = getOrderStatus($scope.model.detailInfo.status);
                        $scope.model.widthStyle = getOrderStepW($scope.model.detailInfo.statusLogList);
                        $scope.model.totalLabelPrice = getTotalLabelPrice($scope.model.detailInfo.subOrderList);
                    }
                });
            }


        }]
    };
});