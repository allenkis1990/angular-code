define(function () {
    'use strict';
    return ['$scope', 'lawsService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, lawsService, $dialog, $state, $timeout, $stateParams) {
        $scope.model = {
            nolaw: false
        };
        lawsService.getInfoDetail({id: $stateParams.id}).then(function (data) {
            if (data.status) {
                $scope.model.detail = data.info;
            } else {
                $scope.model.nolaw = true;
                $dialog.alert({
                    modal: true,
                    width: 250,
                    ok: function () {
                        return true;
                    },
                    content: data.info
                });
            }
        });
        $scope.events = {};

    }];
});