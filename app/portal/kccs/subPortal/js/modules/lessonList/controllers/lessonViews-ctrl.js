define(function () {
    'use strict';
    return ['$scope', 'lessonListService', '$stateParams', function ($scope, lessonListService, $stateParams) {
        $scope.model = {};
        $scope.events = {
            getCourseDetail: function () {
                lessonListService.getCourseDetail({
                    courseId: $stateParams.id
                }).then(function (data) {
                    $scope.model.lessonViewsInfo = data.info;
                });
            }
        };
        $scope.events.getCourseDetail();
    }];
});