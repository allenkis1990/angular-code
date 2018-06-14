define(function () {
    'use strict';
    return ['$scope',
        'managerIndexService',
        '$timeout',
        '$state',
        function ($scope, managerIndexService, $timeout, $state) {
            /*$scope.pageSize = 10;
            $scope.model = {
                learningStar: [],//存放学习之星的数据
                notice: [],//存放通知公告数据
                popularCourse: {
                    totalPage: 0,
                    currentPage: 1,
                    page: {
                        pageNo: 1,
                        pageSize: 10
                    },
                    pageNumbers: [],
                    datas: []
                },//存放受欢迎课程数据
                hotChooseCourse: {
                    totalPage: 0,
                    currentPage: 1,
                    page: {
                        pageNo: 1,
                        pageSize: 10
                    },
                    pageNumbers: [],
                    datas: []
                }//存放热门选修课数据
            };
            $scope.dataType = "day";
            $scope.events = {};

            $scope.pageVar = {
                hasLearningStar: true,
                hasNotice: true,
                hasPopularCourse: true,
                hasHotSelectCourse: true
            }

            //监控学习之星是否有数据
            $scope.$watch('model.learningStar.length', function (newValue, oldValue) {
                if (newValue == 0) {
                    $scope.pageVar.hasLearningStar = false;
                } else {
                    $scope.pageVar.hasLearningStar = true;
                }
            });
            //监控通知公告是否有数据
            $scope.$watch('model.notice.length', function (newValue, oldValue) {
                if (newValue == 0) {
                    $scope.pageVar.hasNotice = false;
                } else {
                    $scope.pageVar.hasNotice = true;
                }
            });
            //监控受欢迎课程是否有数据
            $scope.$watch('model.popularCourse.datas.length', function (newValue, oldValue) {
                if (newValue == 0) {
                    $scope.pageVar.hasPopularCourse = false;
                } else {
                    $scope.pageVar.hasPopularCourse = true;
                }
            });
            //监控热门选修课是否有数据
            $scope.$watch('model.hotChooseCourse.datas.length', function (newValue, oldValue) {
                if (newValue == 0) {
                    $scope.pageVar.hasHotSelectCourse = false;
                } else {
                    $scope.pageVar.hasHotSelectCourse = true;
                }
            });


            //获取学习之星的数据
            managerIndexService.getLearningStar({dataType: 'day', pageSize: $scope.pageSize}).then(function (data) {
                if (data.status) {
                    angular.forEach(data.info, function (item) {
                        item.studentShortName = item.studentName;
                        //如果讲师名称长度超过3，截取前三个字符
                        if (item.studentName.length > 3) {
                            item.studentShortName = item.studentName.substring(0, 3)+"...";
                        }
                    });
                    if (data.info.length <= $scope.pageSize) {
                        $scope.model.learningStar = data.info;
                    } else {
                        for (var i = 0; i < $scope.pageSize; i++) {
                            $scope.model.learningStar.push(data.info[i]);
                        }
                    }
                } else {
                    $scope.model.learningStar = [];
                }

            })
            //获取公告通知的数据
            managerIndexService.getNotice().then(function (data) {
                if (data.status) {
                    if (data.info.length <= 8) {
                        $scope.model.notice = data.info;
                    } else {
                        for (var i = 0; i < 8; i++) {
                            $scope.model.notice.push(data.info[i]);
                        }
                    }
                } else {
                    $scope.model.notice.push = [];
                }

            })
            //获取受欢迎课程的数据
            managerIndexService.getPopularCourse($scope.model.popularCourse.page).then(function (data) {
                if (data.status) {
                    //设置最多显示5页
                    if (data.totalPageSize > 5) {
                        $scope.model.popularCourse.totalPage = 5;
                    } else {
                        $scope.model.popularCourse.totalPage = data.totalPageSize;
                    }
                    $scope.model.popularCourse.datas = data.info;
                    for (var i = 1; i <= $scope.model.popularCourse.totalPage; i++) {
                        $scope.model.popularCourse.pageNumbers.push(i);
                    }
                } else {
                    $scope.model.popularCourse.datas = [];
                    $scope.model.popularCourse.pageNumbers = [];
                }

            })
            //获取热门选修课程数据
            managerIndexService.getHotChooseCourse($scope.model.hotChooseCourse.page).then(function (data) {
                if (data.status) {
                    //设置最多显示5页
                    if (data.totalPageSize > 5) {
                        $scope.model.hotChooseCourse.totalPage = 5;
                    } else {
                        $scope.model.hotChooseCourse.totalPage = data.totalPageSize;
                    }
                    $scope.model.hotChooseCourse.datas = data.info;
                    for (var i = 1; i <= $scope.model.hotChooseCourse.totalPage; i++) {
                        $scope.model.hotChooseCourse.pageNumbers.push(i);
                    }
                } else {
                    $scope.model.hotChooseCourse.datas = [];
                    $scope.model.hotChooseCourse.pageNumbers = [];
                }

            });

            $scope.events = {
                //获取学习之星数据
                getLearningStar: function (e, dataType) {
                    e.stopPropagation();
                    $scope.model.learningStar = [];
                    $scope.dataType = dataType;
                    //获取学习之星的数据
                    managerIndexService.getLearningStar({
                        dataType: dataType,
                        pageSize: $scope.pageSize
                    }).then(function (data) {
                        if (data.status) {
                            angular.forEach(data.info, function (item) {
                                item.studentShortName = item.studentName;
                                //如果讲师名称长度超过3，截取前三个字符
                                if (item.studentName.length > 3) {
                                    item.studentShortName = item.studentName.substring(0, 3)+"...";
                                }
                            });
                            if (data.info.length <= 10) {
                                $scope.model.learningStar = data.info;
                            } else {
                                for (var i = 0; i < 10; i++) {
                                    $scope.model.learningStar.push(data.info[i]);
                                }
                            }
                        } else {
                            $scope.model.learningStar = [];
                        }

                    })
                },

                //最受欢迎课程翻页查询
                toPage1: function (e, pageNumber) {
                    e.stopPropagation();
                    $scope.model.popularCourse.datas = [];
                    $scope.model.popularCourse.currentPage = pageNumber;
                    $scope.model.popularCourse.page.pageNo = pageNumber;
                    //获取受欢迎课程的数据
                    managerIndexService.getPopularCourse($scope.model.popularCourse.page).then(function (data) {
                        if (data.status) {
                            //设置最多显示5页
                            if (data.totalPageSize < 5) {
                                $scope.model.popularCourse.pageNumbers = [];
                                $scope.model.popularCourse.totalPage = data.totalPageSize;
                                for (var i = 1; i <= $scope.model.popularCourse.totalPage; i++) {
                                    $scope.model.popularCourse.pageNumbers.push(i);
                                }
                            }
                            $scope.model.popularCourse.datas = data.info;
                        } else {
                            $scope.model.popularCourse.datas = [];
                            $scope.model.popularCourse.pageNumbers = [];
                        }

                    })
                },

                //热门选修课翻页查询
                toPage2: function (e, pageNumber) {
                    e.stopPropagation();
                    $scope.model.hotChooseCourse.datas = [];
                    $scope.model.hotChooseCourse.currentPage = pageNumber;
                    $scope.model.hotChooseCourse.page.pageNo = pageNumber;
                    //获取热门选修课的数据
                    managerIndexService.getHotChooseCourse($scope.model.hotChooseCourse.page).then(function (data) {
                        if (data.status) {
                            //设置最多显示5页
                            if (data.totalPageSize < 5) {
                                $scope.model.hotChooseCourse.pageNumbers = [];
                                $scope.model.hotChooseCourse.totalPage = data.totalPageSize;
                                for (var i = 1; i <= $scope.model.hotChooseCourse.totalPage; i++) {
                                    $scope.model.hotChooseCourse.pageNumbers.push(i);
                                }
                            }
                            $scope.model.hotChooseCourse.datas = data.info;
                        } else {
                            $scope.model.hotChooseCourse.datas = [];
                            $scope.model.hotChooseCourse.pageNumbers = [];
                        }

                    })
                },
                //查看公告详情
                viewNotice: function (e, id) {
                    e.stopPropagation();
                    $state.go('states.home.view', {noticeId: id});
                },
                //查看课程详情
                getDetails: function (id) {
                    $state.go('states.home.courseInfoView', {courseId: id});
                }
            }*/

        }];
});
