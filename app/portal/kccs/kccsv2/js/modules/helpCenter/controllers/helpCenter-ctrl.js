define(function () {
    "use strict";
    return ["$scope", 'helpCenterService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, helpCenterService, $dialog, $state, $timeout, $stateParams) {
        $scope.model = {
            categoryId:'',
            currentPage:1,//当前第几页
            total:'',//数据总条数 这个去后端拿
            maxSize:5,//最多可见页数按钮5个
            itemsPerPage:8,//每页显示8条 默认10条
        };

        $scope.events = {
            getCourseList:function(item){
                $scope.model.categoryType=item.categoryType;
                helpCenterService.getSimpleInfoList({
                    categoryType:$scope.model.categoryType,
                    pageNo:$scope.model.currentPage,
                    pageSize:$scope.model.itemsPerPage
                }).then(function(data){
                    $scope.model.total=data.totalSize;
                    $scope.model.help=data.info;
                })
            },
            getCategory:function(item){
                helpCenterService.getCategory({
                    categoryType:item.categoryType
                }).then(function(data){
                    $scope.model.sort=data.info;
                    $scope.model.categoryType=data.info[0].categoryType;

                })

            },
            detail:function(item){

                $state.go('states.accountant.helpCenterDetail',{id:item.id,type:$scope.model.categoryType})

            }
        };
        helpCenterService.getCategory({
            categoryType:'HELP_CENTER'
        }).then(function(data){
            $scope.model.sort=data.info;
            if($stateParams.categoryType===""){
                $scope.model.categoryType=data.info[0].categoryType;
            }else{
                $scope.model.categoryType=$stateParams.categoryType;
            }


            helpCenterService.getSimpleInfoList({
                categoryType:$scope.model.categoryType,
                pageNo:$scope.model.currentPage,
                pageSize:$scope.model.itemsPerPage
            }).then(function(data){
                $scope.model.total=data.totalSize;
                $scope.model.help=data.info;
            })
        })

    }]
});
