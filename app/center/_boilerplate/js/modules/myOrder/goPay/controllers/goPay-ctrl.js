define(function () {
    'use strict';
    return {
        indexCtrl: ['$scope', '$stateParams', 'myOrderService', '$dialog', '$state', 'signUpTrainingService', '$http', function ($scope, $stateParams, myOrderService, $dialog, $state, signUpTrainingService, $http) {

            $scope.model = {
                orderNo: $stateParams.orderNo,
                courseList: [],
                total: 0,
                detailInfo: null,
                payTypeList: [],
                payId: '',
                orderDetail:{}
            };


            /*$http.get('/web/front/paymentChannel/findPaymentAccount', {
                params: {
                    placeChannelEnum: 'WEB',
                    payType: 1
                }
            }).success(function (data) {
                if (data.status) {
                    console.log(data.info);
                    $scope.model.payTypeList = data.info;


                    //测试
                    /!*$scope.model.payTypeList.push(

                        {
                            accountAlias: "666",
                            accountNo: "1212",
                            code: "haha",
                            id: "2c91804b5b614e10015c100a69fd0249",
                            logoPath: "http://192.168.1.228:8080/mfs/bank_logo/bank_wxpay.gif"
                        }

                    );*!/


                    if (data.info.length > 0) {
                        $scope.model.payId = data.info[0].id;
                    }
                }
            });*/

            $scope.events = {
                payRightNow: function () {
                    myOrderService.payRightNow($scope, $scope.model.orderNo, myOrderService, $dialog, function () {
                        $state.go('states.myOrder.paySuccess', {orderNo: $scope.model.orderNo});
                    }, signUpTrainingService, $scope.model.payId);
                },

                chosePayId: function (item) {
                    if (item.id === $scope.model.payId) {
                        return false;
                    }
                    $scope.model.payId = item.id;
                }
            };

            myOrderService.getOrderDetail($scope.model.orderNo).then(function (data) {
                $scope.model.orderDetail=data.info;
                $scope.model.courseList = data.info.subOrderList;
                $scope.model.total = getTotal();
                $scope.model.payType = data.info.payType;
            });


            function getTotal () {
                var total = 0;
                angular.forEach($scope.model.courseList, function (item) {
                    total = accAdd(total, item.dealPrice);
                });
                return total;
            }

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

        }]
    };
});