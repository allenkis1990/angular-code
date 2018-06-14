define(function () {
    'use strict';
    return ['$scope', 'helpCenterMobileService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, helpCenterMobileService, $dialog, $state, $timeout, $stateParams) {
        $scope.model = {
            nohelp: false,
            categoryId: $stateParams.type
        };
        helpCenterMobileService.getInfoDetail({id: $stateParams.id}).then(function (data) {
            if (data.status) {
                $scope.model.detail = data.info;
            } else {
                $scope.model.nohelp = true;
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
        helpCenterMobileService.getCategory({
            parentId: '402881bf5828f7170158290dc7fb0001'
        }).then(function (data) {
            $scope.model.sort = data.info;
        });
        $scope.events = {
            getCourseList: function (item) {
                $state.go('states.accountant.helpCenter', {id: item.id});
            }
        };
    }];
});