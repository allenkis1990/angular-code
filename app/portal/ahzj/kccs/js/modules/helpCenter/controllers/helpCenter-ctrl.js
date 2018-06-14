define(function () {
    'use strict';
    return ['$scope', 'helpCenterService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, helpCenterService, $dialog, $state, $timeout, $stateParams) {
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
                helpCenterService.getSimpleInfoList({
                    categoryId: $scope.model.categoryId,
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage
                }).then(function (data) {
                    $scope.model.total = data.totalSize;
                    $scope.model.help = data.info;
                });
            },
            getCategory: function (item) {
                helpCenterService.getCategory({
                    parentId: '402881bf5828f7170158290dc7fb0001'
                }).then(function (data) {
                    $scope.model.sort = data.info;
                    $scope.model.categoryId = data.info[0].id;

                });

            },
            detail: function (item) {

                $state.go('states.accountant.helpCenterDetail', {id: item.id, type: $scope.model.categoryId});

            }
        };
        helpCenterService.getCategory({
            parentId: '402881bf5828f7170158290dc7fb0001'
        }).then(function (data) {
            $scope.model.sort = data.info;
            if ($stateParams.id === '') {
                $scope.model.categoryId = data.info[0].id;
            } else {
                $scope.model.categoryId = $stateParams.id;
            }


            helpCenterService.getSimpleInfoList({
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
