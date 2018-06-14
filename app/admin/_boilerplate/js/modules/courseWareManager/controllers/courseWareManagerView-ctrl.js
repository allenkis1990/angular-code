define(function () {
    'use strict';
    return ['$scope', 'courseWareManagerService', '$stateParams', '$state',
        function ($scope, courseWareManagerService, $stateParams, $state) {
            $scope.model = {
                courseWare: {},
                courseList: {}
            };
            $scope.events = {
                /**
                 * 返回资源管理页面
                 * @param e
                 */
                goCourseWareManager: function (e) {
                    e.preventDefault();
                    $state.go('states.courseWareManager');
                },
                openListenWindow: function (b, c) {
                    window.open('/play/#/preview/' + b, '_blank');
                    //window.open('#/courseCategoryManager');
                    //$state.go('states.courseCategoryManager');
                    //TabService.appendNewTab('视频播放', 'states.player.courseWarePlayer', {courseWareId: b,playType:c}, 'states.player', false);
                    //hbBasicData.openStateInWindow ( 'exam/answerPaper' );
                    //TabService.stateGo ( '试卷分类管理', 'states.paperType', { id: '' } );
                },
                formatTimePoint: function (time) {
                    time = Number(time);
                    var hour = parseInt(time / 3600);
                    var minute = parseInt((time - hour * 3600) / 60);
                    var second = parseInt(time - hour * 3600 - minute * 60);
                    return hour + '时' + minute + '分' + second + '秒';
                },
                formatAnswerAndOptions: function (answer) {
                    var ans1 = answer.split('<p>').join('');
                    //console.log(ans1);
                    var ans2 = ans1.split('</p>').join('');
                    return ans2;
                }
            };

            function findCourseWare () {
                courseWareManagerService.findCourseWare($stateParams.courseWareId).then(function (data) {
                    if (data.status) {
                        $scope.model.courseWare = data.info;
                        var time = $scope.model.courseWare.timeLength;
                        var hour = Math.floor(time / 3600);
                        var min = Math.floor((time % 3600) / 60);
                        var sec = (time % 3600) % 60;
                        $scope.model.courseWare.timeLength = (hour == 0 ? '' : hour + '小时')
                            + (min == 0 ? '' : min + '分') + sec + '秒';
                    }
                });
            }

            function PopsInit () {
                courseWareManagerService.getAllPopsByCwId($scope.$stateParams.courseWareId).then(function (data) {
                    if (data.status) {
                        $scope.model.popsInit = data.info;
                    } else {
                        $scope.globle.showTip('获取弹窗题列表失败，请重试', 'error');
                    }
                });
            }

            function findCourseListByCourseWareId () {
                courseWareManagerService.findCourseListByCourseWareId($stateParams.courseWareId).then(function (data) {
                    $scope.model.courseList = data.info;
                });
            }

            function init () {
                findCourseWare();
                PopsInit();
                findCourseListByCourseWareId();
            }

            init();
        }];

});
