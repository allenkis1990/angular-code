define(function () {
    'use strict';
    return ['$scope', 'studyStatisticService', '$stateParams', '$state', function ($scope, studyStatisticService, $stateParams, $state) {
        $scope.model = {
            selectIndex: 0,
            reviews: [],
            course: {},
            courseOutlines: [],
            pageNo: 1,
            pageSize: 5
        };
        $scope.events = {
            viewMore: function (e) {
                $scope.model.pageNo++;
                findCourseReviewPage(true);
                e.preventDefault();
            }
        };

        function findLessonInfo () {
            studyStatisticService.findLessonInfo($stateParams.courseId).then(function (data) {
                if (data.status) {
                    $scope.model.course = data.info.courseUpdate;
                    $scope.model.courseOutlines = data.info.courseUpdate.courseOutlineDtos;
                    $scope.model.likeNumber = data.info.likeNumber;
                    $scope.model.treadNumber = data.info.treadNumber;
                }
            });
        }

        function findCourseReviewPage (add) {
            studyStatisticService.findCourseReviewPage($scope.model.pageNo, $scope.model.pageSize, $stateParams.courseId).then(function (data) {
                if (data.status) {
                    if (add) {
                        $scope.reviews = $scope.reviews.concat(data.info);
                    } else {
                        $scope.reviews = data.info;
                    }
                    $scope.model.totalPageSize = data.totalPageSize;
                }
            });
        }

        function init () {
            $scope.model.selectIndex = 0;
            $scope.model.pageNo = 1;
            findCourseReviewPage();
            findLessonInfo();
        }

        init();
    }];

});
