define(function () {
    'use strict';
    return ['$scope', 'myOrderService', '$rootScope', '$dialog', '$timeout', '$state', '$http', 'signUpTrainingService', function ($scope, myOrderService, $rootScope, $dialog, $timeout, $state, $http, signUpTrainingService) {


        var oneDay = 86399999;
        $scope.model = {
            currentPage: 1,//当前第几页
            total: 0,//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 10,//每页显示1条 默认10条
            orderList: [],
            yearList: [],
            orderStatus: 'ALL',//默认查询全部
            beginTime: null,
            endTime: null,
            orderNo: '',

            applyForBillDialog: null,//索取发票弹窗
            deleteOrderDialog: null,//订单删除弹窗
            cancelOrderDialog: null,//取消订单弹窗

            initialOrder: {},//关联订单的初始订单
            derivativeOrderList: [],//关联订单
            firstEnter: true,
            initNodata: true,

            message: '我不想买了'
        };


        $scope.events = {
            getOrderPage: function () {
                getOrderPage($scope.model.currentPage);
                //console.log($scope.model.beginTime);
            },

            searchOrderPage: function () {
                $scope.model.currentPage = 1;
                getOrderPage(1);
            },


            payRightNow: function (item) {
                /*myOrderService.payRightNow($scope,item.orderNo,myOrderService,$dialog,function(){
                    getOrderPage($scope.model.currentPage);
                },signUpTrainingService);*/
                $state.go('states.myOrder.goPay', {orderNo: item.orderNo});
            },


            deleteOrder: function (item) {
                $scope.temporaryOrderNo = item.orderNo;
                $dialog.contentDialog({
                    title: '删除订单',
                    visible: true,
                    width: 500,
                    height: 150,
                    modal: true,
                    contentUrl: '@systemUrl@/views/myOrder/deleteOrderDialog.html'
                }, $scope).then(function (data) {
                    $scope.model.deleteOrderDialog = data;
                });
            },

            confirmDeleteOrder: function () {
                $scope.deleteSubmitAble = true;
                myOrderService.deleteOrder($scope.temporaryOrderNo).then(function (dataItem) {
                    $scope.deleteSubmitAble = false;
                    if (dataItem.status && dataItem.info === true) {
                        $scope.model.currentPage = 1;
                        getOrderPage(1);
                        $scope.model.deleteOrderDialog.remove();
                    }
                });
            },

            cancelOrder: function (item) {
                myOrderService.cancelOrderFn($scope, item.orderNo, $dialog);
            },

            confirmCancelOrder: function () {
                myOrderService.confirmCancelOrder($scope, myOrderService, $dialog, getOrderPage);
            },


            lookDetail: function (orderNo) {
                if ($scope.orderDialog) {
                    $scope.orderDialog.remove();
                }

                window.open('/center/#/myOrder/detail/' + orderNo);
            },

            lookIntroduction: function (item) {
                //console.log(parItem);
                if (item.status === 5) {
                    window.open('/center/#/myRealClass/' + item.trainClassId);
                } else {
                    window.open('/center/#/signUpTraining/introduction/' + item.productId);
                }

            },

            goChoseCourse: function () {
                if ($scope.lwhLoading === true) {
                    return false;
                } else {
                    if (dev) {
                        window.open('/portal/#/accountant/accountant.onTraining/', '_self');
                    } else {
                        window.open('/#/accountant/accountant.onTraining/', '_self');
                    }
                }
            }
        };


        //转时间对象为毫秒
        function parseDateToLong (data) {
            var long = null;
            long = data.getTime();
            return long;
        }


        //获取订单列表
        function getOrderPage (pageNo) {
            $scope.submitAble = true;
            $scope.lwhLoading = true;
            myOrderService.getOrderPage({
                pageNo: pageNo,
                pageSize: $scope.model.itemsPerPage,
                orderNo: $scope.model.orderNo,
                orderStatus: $scope.model.orderStatus,
                beginTime: !$scope.model.beginTime ? 0 : parseDateToLong($scope.model.beginTime),
                endTime: !$scope.model.endTime ? 0 : (parseDateToLong($scope.model.endTime) + oneDay)
            }).then(function (data) {
                $scope.submitAble = false;
                $scope.lwhLoading = false;
                $scope.model.orderList = data.info;
                //$scope.model.orderList[0].unitName='我我我哦我嚄嚄嚄嚄嚄嚄嚄嚄嚄嚄嚄喔喔哦';
                $scope.model.total = data.totalSize;

            });
        }

        getOrderPage(1);


    }];
});
