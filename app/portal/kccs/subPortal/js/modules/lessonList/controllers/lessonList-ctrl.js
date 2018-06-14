define(function () {
    'use strict';
    return ['$scope', 'lessonListService', '$state', function ($scope, lessonListService, $state) {
        $scope.model = {
            currentPage: 1,//当前第几页
            total: '',//数据总条数
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 9//每页显示1条 默认10条
        };

        function formatSeconds (value) {
            var theTime = parseInt(value);// 秒
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            if (theTime > 60) {
                theTime1 = parseInt(theTime / 60);
                theTime = parseInt(theTime % 60);
                if (theTime1 > 60) {
                    theTime2 = parseInt(theTime1 / 60);
                    theTime1 = parseInt(theTime1 % 60);
                }
            }
            var result = '' + parseInt(theTime) + '秒';
            if (theTime1 > 0) {
                result = '' + parseInt(theTime1) + '分' + result;
            }
            if (theTime2 > 0) {
                result = '' + parseInt(theTime2) + '小时' + result;
            }
            return result;
        }

        $scope.events = {
            pageChange: function () {
                $scope.events.getShowInfoPage();
            },
            getShowInfoPage: function () {
                $scope.loadingLessonList = true;
                lessonListService.getCoursePage({
                    pageNo: $scope.model.currentPage,
                    pageSize: 9
                }).then(function (data) {
                    $scope.loadingLessonList = false;
                    $scope.model.lessonListInfo = data.info;
                    angular.forEach($scope.model.lessonListInfo, function (item) {
                        item.hour = formatSeconds(item.hour);
                    });
                    $scope.model.total = data.totalSize;
                });
            },
            goListInfo: function (item) {
                $state.go('states.accountant.lessonList.lessonViews', {id: item.id});
            }
        };
        $scope.events.getShowInfoPage();
    }];
});