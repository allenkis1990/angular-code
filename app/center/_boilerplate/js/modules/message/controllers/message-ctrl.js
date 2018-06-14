define(function (message) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$state', 'messageService', '$stateParams', function ($scope, $state, messageService, $stateParams) {
            $scope.model = {
                categoryType: $stateParams.tabId ? $stateParams.tabId : 'TRAINING_NOTICE',
                currentPage: 1,//当前第几页
                total: '',//数据总条数
                maxSize: 5,//最多可见页数按钮5个
                itemsPerPage: 8//每页显示1条 默认10条
                /* messageType:$stateParams.type*/

            };
            $scope.events = {
                getCourseList: function (item) {
                    $scope.lwhLoading = true;
                    messageService.getSimpleInfoList({
                        categoryType: $scope.model.categoryType,
                        pageNo: $scope.model.currentPage,
                        pageSize: $scope.model.itemsPerPage
                    }).then(function (data) {
                        $scope.lwhLoading = false;
                        $scope.model.total = data.totalSize;
                        $scope.model.notice = data.info;
                    });


                },
                tabNotice: function (categoryType) {
                    if ($scope.model.categoryType === categoryType) {
                        return false;
                    }
                    $scope.model.categoryType = categoryType;
                    this.getCourseList();
                },
                detail: function (item) {

                    $state.go('states.message.messageViews', {id: item.id});

                }
            };
            $scope.events.getCourseList();
        }]
    };
});