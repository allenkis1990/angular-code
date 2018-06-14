define(['angular',
    'restangular'
], function (angular, siderBarCtrl) {
    'use strict';
    return angular.module('app.home', ['restangular'])

        .controller('topController', ['$scope', '$rootScope', '$timeout',
            function ($scope, $rootScope, $timeout) {
                $rootScope.toolBarSettings = {
                    showOperators: false,
                    theStyle: {display: 'none'}
                };

                $scope.timer = $timeout(function () {
                    $scope.animateCompanyName = true;
                }, 1000).$$timeoutId;
                $timeout.cancel($scope.timer);

            }]);

});
