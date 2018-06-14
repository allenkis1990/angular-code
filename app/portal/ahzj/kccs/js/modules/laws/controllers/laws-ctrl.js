define(function () {
    'use strict';
    return ['$scope', 'lawsService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, lawsService, $dialog, $state, $timeout, $stateParams) {
        $scope.model = {
            categoryType: 'POLICIES_REGULATIONS',
            currentPage: 1,//当前第几页
            total: '',//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 8//每页显示8条 默认10条
        };

        $scope.events = {
            getCourseList: function (item) {
                lawsService.getSimpleInfoList({
                    categoryType: $scope.model.categoryType,
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage
                }).then(function (data) {
                    $scope.model.total = data.totalSize;
                    $scope.model.laws = data.info;
                });


            },
            detail: function (item) {
                $state.go('states.accountant.laws.lawDetail', {id: item.id});
            }
        };

        function getCourseList () {
            lawsService.getSimpleInfoList({
                categoryType: $scope.model.categoryType,
                pageNo: $scope.model.currentPage,
                pageSize: $scope.model.itemsPerPage
            }).then(function (data) {
                $scope.model.total = data.totalSize;
                $scope.model.laws = data.info;
            });
        }

        getCourseList();
    }];
});