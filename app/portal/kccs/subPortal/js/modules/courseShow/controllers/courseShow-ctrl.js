define(function () {
    'use strict';
    return ['$scope', '$http', function ($scope, $http) {


        $scope.model = {
            courseCategory: [],
            currentCourseCategoryId: null,


            currentPage: 1,//当前第几页
            total: 0,//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 15//每页显示8条 默认10条
        };

        $scope.events = {
            tabCourseCategory: function (item) {
                if ($scope.lwhLoading) {
                    return false;
                }
                if ($scope.model.currentCourseCategoryId === item.id) {
                    return false;
                }
                $scope.model.currentPage = 1;
                $scope.model.currentCourseCategoryId = item.id;
                findCourseList();
            },

            findCourseList: function () {
                findCourseList();
            },
            openListen: function (item) {
                window.open('/play/#/previewLesson/trainClassId/' + item.id + '/' + 'courseware' + '/xxx?unitName='+require.unitPath, '_blank');
            }

        };

        $http.get('/web/portal/index/findCourseCategory').success(function (data) {
            if (data.status) {
                $scope.model.courseCategory = data.info;
                if (angular.isArray(data.info) && data.info.length > 0) {
                    $scope.model.currentCourseCategoryId = data.info[0].id;
                    findCourseList();
                }
            }
        });

        function findCourseList () {
            $scope.lwhLoading = true;
            $http.get('/web/portal/index/findCourseByCategoryId', {
                params: {
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage,
                    categoryId: $scope.model.currentCourseCategoryId
                }
            }).success(function (data) {
                $scope.lwhLoading = false;
                if (data.status) {
                    $scope.model.courseList = data.info;
                    $scope.model.total = data.totalSize;
                }

            });
        }

    }];
});