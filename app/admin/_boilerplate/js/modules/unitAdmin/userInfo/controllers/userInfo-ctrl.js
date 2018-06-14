define ( function ( userInfo ) {
"use strict";
return {
    indexCtrl: ["$scope",'unitAdminServices','$state', function ( $scope,customerServices,$state ) {



        $scope.$watch('model.userId',function(newVal){
            if(newVal){
                $scope.model.mark=true;
                customerServices.doview($state.current.name);
                if($scope.model.classTab===1){
                    customerServices.getUserInfo(newVal).then(function(data){
                        $scope.model.chooseInformation = data.info;
                        $scope.model.chooseInformation.phoneNumber = parseInt($scope.model.chooseInformation.phoneNumber);
                        $scope.model.chooseInformation.postCode = parseInt($scope.model.chooseInformation.postCode);

                    });
                }

            }
        });

       }]
}} );