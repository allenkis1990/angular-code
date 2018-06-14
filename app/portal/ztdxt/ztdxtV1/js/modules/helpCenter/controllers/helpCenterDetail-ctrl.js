define(function () {
    "use strict";
    return ["$scope", 'helpCenterService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, helpCenterService, $dialog, $state, $timeout, $stateParams) {
        $scope.model = {
            nohelp:false,
            categoryType:$stateParams.type
        };
        helpCenterService.getInfoDetail({id:$stateParams.id}).then(function(data){
            if(data.status){
                $scope.model.detail=data.info;
            }else{
                $scope.model.nohelp = true;
                $dialog.alert ( {
                    modal  : true,
                    width  : 250,
                    ok     : function () {
                        return true;
                    },
                    content: data.info
                } );



            }
        })
        helpCenterService.getCategory({
            categoryType:'HELP_CENTER'
        }).then(function(data){
            $scope.model.sort=data.info;
        })
        $scope.events={
            getCourseList:function(item){
                $state.go('states.accountant.helpCenter',{categoryType:item.categoryType})
            }
        }
    }]
});