/**
 * Created by WDL on 2015/10/13.
 */
define(function () {
    'use strict';
    return ['$scope', 'systemProcessTaskService', '$stateParams',
        function ($scope, systemProcessTaskService, $stateParams) {
            $scope.data = {
                isErrorFile: null,
                error: null,
                total: 0
            };

            var method = {
                execute: function () {
                    $scope.data.isErrorFile = $stateParams.isErrorFile;
                    $scope.data.error = $stateParams.error;
                    angular.forEach($stateParams.error, function (item, index) {

                        $scope.data.total += (index++);

                    });
                }
            };

            method.execute();
        }];
});
