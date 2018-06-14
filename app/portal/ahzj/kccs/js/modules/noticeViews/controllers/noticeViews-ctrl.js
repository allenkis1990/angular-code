define(function () {
    'use strict';
    return ['$scope', '$stateParams', 'noticeViewsService', '$sce', '$dialog', function ($scope, $stateParams, noticeViewsService, $sce, $dialog) {
        $scope.model = {
            noNotice: false
        };
        noticeViewsService.getInfoDetail({id: $stateParams.id}).then(function (data) {
            if (data.status) {
                $scope.model.noticeContent = data.info;
                if ($scope.model.noticeContent.author === '') {
                    $scope.model.noticeContent.author = '福建华博';
                }
            } else {
                $scope.model.noNotice = true;
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

    }];
});