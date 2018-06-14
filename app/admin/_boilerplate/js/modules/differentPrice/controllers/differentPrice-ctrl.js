define(
    function () {
        'use strict';
        return ['$scope', '$stateParams', '$state',
            function ($scope, $stateParams, $state) {
                console.log(JSON.parse($stateParams.jsonStr));
                $scope.model = {
                    courseList: JSON.parse($stateParams.jsonStr).list
                };


                $scope.events = {
                    lookCourseDetail: function (id) {
                        $state.go('states.courseManager.view', {courseId: id});
                    }
                };


            }];
    });
