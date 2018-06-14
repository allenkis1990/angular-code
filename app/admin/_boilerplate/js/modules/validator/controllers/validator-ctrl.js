define(function () {
    'use strict';
    return ['$scope', 'validatorService', '$timeout', '$rootScope', function ($scope, validatorService, $timeout, $rootScope) {
        $scope.timer = new Date().getTime();
        $rootScope.model = {};
        $scope.model = {
            user: {
                name: '',
                password: '1324564',
                confirmPassword: ''
            }
        };
        $rootScope.model = {};
    }];
});