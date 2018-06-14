define(function () {
    'use strict';
    return ['$scope', 'newsService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, newsService, $dialog, $state, $timeout, $stateParams) {
        $scope.model = {
            categoryType: 'NEWS',
            currentPage: 1,//当前第几页
            total: '',//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 8//每页显示8条 默认10条
        };

        $scope.events = {
            getCourseList: function (item) {
                newsService.getSimpleInfoList({
                    categoryType: $scope.model.categoryType,
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage
                }).then(function (data) {
                    $scope.model.total = data.totalSize;
                    $scope.model.news = data.info;
                });


            },
            detail: function (item) {
                $state.go('states.accountant.news.newsDetail', {id: item.id});
            }
        };

        function getCourseList () {
            newsService.getSimpleInfoList({
                categoryType: $scope.model.categoryType,
                pageNo: $scope.model.currentPage,
                pageSize: $scope.model.itemsPerPage
            }).then(function (data) {
                $scope.model.total = data.totalSize;
                $scope.model.news = data.info;
            });
        }

        getCourseList();
    }];
});