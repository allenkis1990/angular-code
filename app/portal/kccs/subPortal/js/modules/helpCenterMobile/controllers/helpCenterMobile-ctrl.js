define(function () {
    'use strict';
    return ['$scope', 'helpCenterMobileService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, helpCenterMobileService, $dialog, $state, $timeout, $stateParams) {
        $scope.model = {
            categoryId: '',
            currentPage: 1,//当前第几页
            total: '',//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 8//每页显示8条 默认10条
        };

        $scope.events = {
            getCourseList: function (item) {
                $scope.model.categoryId = item.id;
                helpCenterMobileService.getSimpleInfoList({
                    categoryId: $scope.model.categoryId,
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage
                }).then(function (data) {
                    $scope.model.total = data.totalSize;
                    $scope.model.help = data.info;
                });
            },
            getCategory: function (item) {
                helpCenterMobileService.getCategory({
                    parentId: '402881bf5828f7170158290dc7fb0001'
                }).then(function (data) {
                    $scope.model.sort = data.info;
                    $scope.model.categoryId = data.info[0].id;

                });

            },
            detail: function (item) {

                $state.go('states.accountant.helpCenter.helpCenterDetail', {id: item.id, type: $scope.model.categoryId});

            }
        };
        helpCenterMobileService.getCategory({
            parentId: '402881bf5828f7170158290dc7fb0001'
        }).then(function (data) {
            $scope.model.sort = data.info;
            if ($stateParams.id === '') {
                $scope.model.categoryId = data.info[0].id;
            } else {
                $scope.model.categoryId = $stateParams.id;
            }


            helpCenterMobileService.getSimpleInfoList({
                categoryId: $scope.model.categoryId,
                pageNo: $scope.model.currentPage,
                pageSize: $scope.model.itemsPerPage
            }).then(function (data) {
                $scope.model.total = data.totalSize;
                $scope.model.help = data.info;
            });
        });

    }];
});
