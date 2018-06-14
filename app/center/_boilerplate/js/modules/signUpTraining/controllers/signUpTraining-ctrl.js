define(function () {
    'use strict';
    return ['$scope', 'signUpTrainingService', '$dialog', '$state', '$rootScope', '$http', 'hbBasicData', function ($scope, signUpTrainingService, $dialog, $state, $rootScope, $http, hbBasicData) {

        $scope.model = {
            currentPage: 1,//当前第几页
            total: 10,//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 16,//每页显示8条 默认10条

            courseList: [],
            yearListTwo: [],

            sortMark: '1',//1默认 2学时升 3学时降 4价格升 5价格降
            subjectList: [],
            marjorList: [],
            yearList: [],
            crditList: [
                {name: '全部', begin: null, end: null},
                {name: '0-5', begin: 0, end: 5},
                {name: '5-10', begin: 5, end: 10},
                {name: '10-15', begin: 10, end: 15},
                {name: '15-20', begin: 15, end: 20},
                {name: '20以上', begin: 20, end: 300}
            ],

            subjectOptionsId: $rootScope.subjectId === undefined || $rootScope.subjectId === '-1' ? '5628812b569c57e001569c5a77f6a011' : $rootScope.subjectId,//默认公需课
            yearOptionsId: null,
            beginHour: null,
            endHour: null,
            coursePoolId: null,
            sort: null,
            hourSort: null,
            priceSort: null
        };


        $scope.events = {

            tabSortDefault: function () {
                if ($scope.model.sortMark === '1') {
                    return false;
                }

                $scope.model.currentPage = 1;
                $scope.model.sortMark = '1';
                $scope.model.sort = null;
                $scope.model.hourSort = null;
                $scope.model.priceSort = null;
                getCourseList();
            },

            tabSort: function (mark, sortName) {
                $scope.model.sortMark = mark;
                //$scope.model.sort=1;
                $scope.model.currentPage = 1;


                switch ($scope.model[sortName]) {
                    case null:
                        $scope.model[sortName] = 1;
                        $scope.model.sort = 1;
                        getCourseList();
                        break;

                    case 1:
                        $scope.model[sortName] = 2;
                        $scope.model.sort = 2;
                        getCourseList();
                        break;

                    case 2:
                        $scope.model[sortName] = 1;
                        $scope.model.sort = 1;
                        getCourseList();
                        break;
                }

            },


            tabSubject: function (item) {
                if ($scope.model.subjectOptionsId === item.optionId) {
                    return false;
                }
                $scope.model.currentPage = 1;
                $scope.model.subjectOptionsId = item.optionId;
                //选中专业课 没有年度
                if ($scope.model.subjectOptionsId !== '5628812b569c57e001569c5a77f6a011') {
                    $scope.model.yearOptionsId = null;
                    getFirstMarjorId();
                } else {//选中公需课 没有专业
                    $scope.model.coursePoolId = null;
                    getFirstYearId();
                }

                getCourseList();
            },
            tabYear: function (item) {
                if ($scope.model.yearOptionsId === item.optionId) {
                    return false;
                }
                $scope.model.currentPage = 1;
                $scope.model.yearOptionsId = item.optionId;
                getCourseList();
            },

            tabCrdit: function (begin, end) {
                if ($scope.model.beginHour === begin && $scope.model.endHour === end) {
                    return false;
                }
                $scope.model.currentPage = 1;
                $scope.model.beginHour = begin;
                $scope.model.endHour = end;
                getCourseList();
            },
            tabMarjor: function (item) {
                if ($scope.model.coursePoolId === item.id) {
                    return false;
                }
                $scope.model.currentPage = 1;
                $scope.model.coursePoolId = item.id;
                getCourseList();
            },

            getCourseList: function () {
                getCourseList();
            },

            putIntoShoppingCart: function (item) {


                var param = {
                    courseId: item.courseId,
                    yearOptionsId: item.yearOptionsId,
                    subjectOptionsId: item.subjectOptionsId,
                    coursePoolId: item.coursePoolId,
                    commoditySkuId: item.commoditySkuId
                };
                signUpTrainingService.putIntoShoppingCart($scope, $dialog, $http, param, item);


            },

            buyNow: function (item) {
                $scope.param = {
                    courseId: item.courseId,
                    yearOptionsId: item.yearOptionsId,
                    subjectOptionsId: item.subjectOptionsId,
                    coursePoolId: item.coursePoolId,
                    commoditySkuId: item.commoditySkuId
                };
                $scope.tempYearId = item.yearOptionsId;


                hbBasicData.setCookie('urlParamsList', parseStrFromArr([$scope.param]));
                //$rootScope.urlParamsList=[$scope.param];
                signUpTrainingService.buyNow($scope, $dialog, $http, $scope.param, item);
            },

            buyNowTwo: function () {
                $scope.param.yearOptionsId = $scope.tempYearId;
                hbBasicData.setCookie('urlParamsList', parseStrFromArr([$scope.param]));
                //$rootScope.urlParamsList=[$scope.param];
                $state.go('states.myOrder.creatOrder');
            },

            doRightYearId: function (yearId) {
                $scope.tempYearId = yearId;
            }
        };

        //JSON.stringify数组转字符串   JSON.parse字符串转数组
        function parseStrFromArr (arr) {//转数组为字符串
            var arr = arr;
            var str = JSON.stringify(arr);
            return str;
        }


        function getFirstYearId () {
            if ($scope.model.yearList.length > 0) {
                $scope.model.yearOptionsId = $scope.model.yearList[0].optionId;
            }
        }

        function getFirstMarjorId () {
            if ($scope.model.marjorList.length > 0) {
                $scope.model.coursePoolId = $scope.model.marjorList[0].id;
            }
        }

        function getCourseList () {
            $scope.lwhLoading = true;
            signUpTrainingService.findSalesCoursePage({
                pageSize: $scope.model.itemsPerPage,
                pageNo: $scope.model.currentPage,
                yearOptionsId: $scope.model.yearOptionsId,
                subjectOptionsId: $scope.model.subjectOptionsId,
                coursePoolId: $scope.model.coursePoolId,
                sort: $scope.model.sort,
                beginHour: $scope.model.beginHour,
                endHour: $scope.model.endHour
            }).then(function (data) {
                $scope.lwhLoading = false;
                if (data.status) {
                    $scope.model.total = data.totalSize;
                    $scope.model.courseList = data.info;

                    signUpTrainingService.getProfessionYearQueryOptions().then(function (subData) {

                        $scope.model.yearListTwo = subData.info;

                        angular.forEach($scope.model.courseList, function (item) {
                            item.showTwo = false;
                            //如果是专业课 默认把item的年度id设置为当前年度
                            if (item.subjectOptionsId === '5628812b569c57e001569c5a77f6a012') {
                                item.yearOptionsId = getCurrentYearId(subData.info);
                            }
                        });


                        console.log($scope.model.yearOptionsId);
                        console.log($scope.model.courseList);
                    });


                }
            });
        }

        function getCurrentYearId (yearArr) {
            var current = new Date().getFullYear() + '';
            var yearId = null;
            angular.forEach(yearArr, function (item) {
                if (item.name === current) {
                    yearId = item.optionId;
                }
            });

            return yearId;
        }

        signUpTrainingService.getSubjectOptions().then(function (data) {
            if (data.status) {
                $scope.model.subjectList = data.info;
            }

        });
        signUpTrainingService.getYearQueryOptions().then(function (data) {
            if (data.status) {
                $scope.model.yearList = data.info;
                getFirstYearId();
                getCourseList();
            }

        });

        signUpTrainingService.getCoursePoolInfos().then(function (data) {
            if (data.status) {
                $scope.model.marjorList = data.info;
                angular.forEach($scope.model.marjorList, function (item) {
                    if (item.name.length > 5) {
                        item.shortName = item.name.substr(0, 5) + '...';
                    } else {
                        item.shortName = item.name;
                    }
                });
                if ($scope.model.subjectOptionsId !== '5628812b569c57e001569c5a77f6a011') {
                    $scope.model.yearOptionsId = null;
                    getFirstMarjorId();
                } else {//选中公需课 没有专业
                    $scope.model.coursePoolId = null;
                    getFirstYearId();
                }
            }

        });

    }];
});
