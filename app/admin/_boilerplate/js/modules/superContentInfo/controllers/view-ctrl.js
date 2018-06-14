define(function () {
    'use strict';
    return ['$scope', 'superContentInfoService','$state','$stateParams', function ($scope, superContentInfoService,$state,$stateParams) {
        $scope.model={
            /**
             * 资讯详情信息
             */
            viewInfo:{}
        };
        superContentInfoService.findForView($stateParams.id).then(function(data){
            if(data.status){
                $scope.model.viewInfo = data.info;
            }else {
                $scope.globle.showTip("获取资讯详情失败", 'error');
            }
        });
    }];
});