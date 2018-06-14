define(function () {
    'use strict';
    return ['$scope', '$stateParams', function ($scope, $stateParams) {
        $scope.model = {
            currentShow: $stateParams.type
        };
    }];
});