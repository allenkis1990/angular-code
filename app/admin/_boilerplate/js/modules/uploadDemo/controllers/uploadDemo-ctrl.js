define(function () {
    'use strict';
    return ['$scope', '$timeout', 'HB_notification',
        function ($scope, $timeout, HB_notification) {

            $scope.alert = function () {
                HB_notification.alert(123123);
            };

            $scope.confirm = function () {
                // HB_notification.showTip ( 1222222222222 );
                HB_notification.confirm(123123, function () {
                    return $timeout(function () {
                    });
                });
            };

        }];
});
