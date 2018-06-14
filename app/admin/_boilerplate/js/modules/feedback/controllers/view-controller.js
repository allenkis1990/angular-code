/**
 * Created by Administrator on 2015/8/2.
 */
define(function () {
    'use strict';
    return ['$scope', 'feedbackService', '$stateParams',
        function ($scope, feedbackService, $stateParams) {
            $scope.model = {};
            $scope.pictures = [];

            feedbackService.queryById($stateParams.id).then(function (data) {
                $scope.model.feedback = data.info;
                $scope.pictures = data.info.edPictures;
            });
        }];
});
