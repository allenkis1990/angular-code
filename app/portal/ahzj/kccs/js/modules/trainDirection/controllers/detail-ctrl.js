define(function () {
    'use strict';
    return ['$scope', '$state', '$stateParams','$http', function ($scope,  $state, $stateParams,$http) {
        $scope.model = {
            detail:{}
        };


        $http.get('/web/portal/info/getInfoDetail',{params:{id:$stateParams.id}}).success(function(data){
            if(data.status){
                $scope.model.detail=data.info;
            }
        });


        $scope.events = {

        };




    }];
});