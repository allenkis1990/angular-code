define(function () {
    'use strict';
    return ['$scope', 'courseManagerService', '$stateParams', '$state', 'TabService',
        function ($scope, lessonResourceManageService, $stateParams, $state, TabService) {
            $scope.model = {
                selectIndex: 0,
                reviews: [],
                course: {},
                courseOutlines: [],
                pageNo: 1,
                pageSize: 5
            };
            $scope.events = {
                /**
                 * 打开试听
                 * @param a
                 * @param b
                 * @param c
                 */
                openListenWindow: function (a, b, c) {
                    if ($scope.model.course.status == 1) {
                        // TabService.appendNewTab('视频播放', 'states.player.coursePlayer', {courseId:a,courseWareId: b,playType:c}, 'states.player', false);
                        window.open('/play/#/previewLesson/trainClassId/' + a + '/courseware/xxx', '_blank');
                    }
                },
                /**
                 * 播放
                 */
                play: function (subCourseOutline) {
                    if ($scope.model.course.status == 1) {
                        //TabService.appendNewTab('视频播放', 'states.player.coursePlayer', {courseId:subCourseOutline.cseId,courseWareId: subCourseOutline.cweId}, 'states.player', false);
                        window.open('/play/#/previewLesson/trainClassId/' + subCourseOutline.cseId + '/' + subCourseOutline.cweId + '', '_blank');
                    } else {
                        $scope.globle.showTip('该课程不能播放', 'error');
                    }
                },
                /**
                 * 返回资源管理页面
                 * @param e
                 */
                goLessonResourceManage: function (e) {
                    e.preventDefault();
                    $state.go('states.courseManager');
                }
            };

            function findLessonInfo () {
                lessonResourceManageService.findLessonInfo($stateParams.courseId).then(function (data) {
                    if (data.status) {
                        $scope.model.course = data.info;
                        $scope.model.courseOutlines = data.info.courseOutlineDtos;
                    }
                });
            }


            function init () {
                $scope.model.selectIndex = 0;
                $scope.model.pageNo = 1;
                findLessonInfo();
            }

            init();
        }];

});
