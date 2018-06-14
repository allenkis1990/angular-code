define(function () {
    'use strict';
    return ['$scope', 'infoContentService','$state','$stateParams', function ($scope, infoContentService,$state,$stateParams) {
        $scope.model={
            /**
             * 资讯详情信息
             */
            viewInfo:{}
        };
        infoContentService.findForView($stateParams.id).then(function(data){
            if(data.status){
                $scope.model.viewInfo = data.info;
            }else {
                $scope.globle.showTip("获取资讯详情失败", 'error');
            }
        });
    }];
});