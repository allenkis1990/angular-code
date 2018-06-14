define(function () {
    'use strict';
    return {
        indexCtrl: ['$scope', '$stateParams', 'myOrderService', '$dialog', '$state', function ($scope, $stateParams, myOrderService, $dialog, $state) {

            $scope.model = {
                orderNo: $stateParams.orderNo,
                courseList: [],
                total: 0,
                orderPayType: null,
                orderDetail:{}
            };


            myOrderService.getOrderDetail($scope.model.orderNo).then(function (data) {
                $scope.model.orderDetail=data.info;
                $scope.model.orderPayType = data.info.tradeChannel;
                $scope.model.courseList = data.info.subOrderList;
                $scope.model.total = getTotal();
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