define(function () {
    'use strict';
    return ['$scope', '$state', '$stateParams', function ($scope,  $state, $stateParams) {
        $scope.model = {
            type:$stateParams.type
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
                        break;
                }
                return typeName;
            }
        };


    }];
});