define(function (myCourse) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$http', function ($scope, $http) {

            $scope.model = {
                currentPage: 1,//当前第几页
                total: 10,//数据总条数 这个去后端拿
                maxSize: 5,//最多可见页数按钮5个
                itemsPerPage: 8,//每页显示1条 默认10条
                noData: true,
                firstEnter: true,
                courseList: []
            };


            $scope.events = {
                classMouseEnter: function (e, item) {
                    e.preventDefault();
                    item.shortName = item.name;
                },

                classMouseLeave: function (e, item) {
                    e.preventDefault();
                    if (item.name.length > 24) {
                        item.shortName = item.name.substr(0, 22) + '...';
                    } else {
                        item.shortName = item.name;
                    }
                },

                findPageCourse: function () {
                    findCoursePage();
                },

                goPlay: function (item) {
                    window.open('/play/#/learn/trainclassId/' + item.courseId + '/courseware');
                }
            };


            function findCoursePage () {
                $scope.lwhLoading = true;
                $http.get('/web/front/myClass/getInterestPackage?pageNo=' + $scope.model.currentPage + '&pageSize=' + $scope.model.itemsPerPage + '&orderByType=1')
                    .success(function (data) {
                        $scope.lwhLoading = false;

                        //data.status=false;
                        if (!data.status) {
                            $scope.model.hasNotBuy = true;
                            $scope.model.noData = false;
                            return false;
                        }

                        if (data.status) {
                            $scope.model.courseList = data.info;

                            //console.log(data.status);

                            //data.info=[];
                            if (data.info.length <= 0) {
                                $scope.model.noData = true;
                                return false;
                            } else {
                                $scope.model.noData = false;
                            }

                            angular.forEach($scope.model.courseList, function (item) {
                                if (item.name.length > 24) {
                                    item.shortName = item.name.substr(0, 22) + '...';
                                } else {
                                    item.shortName = item.name;
                                }
                                item.timeLengthFormat = arrive_timer_format(item.timeLength);
                            });
                            $scope.model.total = data.totalSize;
                        }

                    });
            }

            findCoursePage();

            function arrive_timer_format (s) {
                var t;
                if (s > -1) {
                    var hour = Math.floor(s / 3600);
                    var min = Math.floor(s / 60) % 60;
                    var sec = s % 60;
                    var day = parseInt(hour / 24);
                    if (hour < 10) {
                        t = '0' + hour + ':';
                    } else {
                        t = hour + ':';
                    }
                    if (min < 10) {
                        t += '0';
                    }
                    t += min + ':';
                    if (sec < 10) {
                        t += '0';
                    }
                    t += sec;


                }
                return t;
            }


        }]
    };
});