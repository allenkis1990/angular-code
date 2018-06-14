define(function (message) {
    'use strict';
    return ['$scope', 'messageService', '$stateParams', '$sce', '$dialog', function ($scope, messageService, $stateParams, $sce, $dialog) {
        $scope.model = {};
        messageService.getInfoDetail({id: $stateParams.id}).then(function (data) {
            if (data.status) {
                $scope.model.detail = data.info;
            }
        });
        $scope.events = {};

    }];
});