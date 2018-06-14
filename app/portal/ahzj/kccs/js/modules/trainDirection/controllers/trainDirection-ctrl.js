define(function () {
    'use strict';
    return ['$scope', '$state', '$stateParams','$http', function ($scope,  $state, $stateParams,$http) {
        $scope.model = {
            currentPage: 1,//当前第几页
            total: '',//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 10,//每页显示8条 默认10条
            type:$stateParams.type,
            cjwtList:[],
            currentListName:'',
            noticeType:''
        };




        $scope.events = {
            getTypeName:function(){
                var typeName='';
                switch ($scope.model.type){
                    case '1':typeName='培训须知';
                        break;
                    case '2':typeName='培训流程';
                        break;
                    case '3':typeName='操作演示';
                        break;
                    case '4':typeName='常见问题';
                        $scope.model.noticeType='HELP_CENTER_COMMON_PROBLEM';
                        $scope.model.currentListName='cjwtList';
                        break;
                }
                return typeName;
            },
            getSimpleList: function () {
                getSimpleList($scope.model.noticeType,$scope.model.itemsPerPage,$scope.model.currentListName,$scope.model.currentPage);
            },

            goDetail:function(item){
                $state.go('states.accountant.trainDirection.detail',{id:item.id});
            }
        };
        getSimpleList('HELP_CENTER_COMMON_PROBLEM', $scope.model.itemsPerPage, 'cjwtList',1);

        function getSimpleList (categoryType, pageSize, listName,pageNo) {
            $http.get('/web/portal/info/getSimpleInfoPage?categoryType=' + categoryType + '&pageNo='+pageNo+'&pageSize=' + pageSize).success(function (data) {
                if (data.status) {
                    $scope.model[listName] = data.info;
                    $scope.model.total = data.totalSize;
                    //$scope.model[listName][0].title='我是哈哈哈我是哈哈哈我是哈哈哈我是哈哈哈我是哈哈哈我是哈哈哈我是哈哈哈';
                    angular.forEach($scope.model[listName], function (item) {
                        if (item.title.length > 50) {
                            item.shortTitle = item.title.substr(0, 50) + '...';
                        } else {
                            item.shortTitle = item.title;
                        }
                    });
                }
            });
        }




    }];
});