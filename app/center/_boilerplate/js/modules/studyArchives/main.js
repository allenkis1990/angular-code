define(['@systemUrl@/js/modules/studyArchives/controllers/studyArchives-ctrl',
    '@systemUrl@/js/modules/studyArchives/controllers/goods-ctrl',
    '@systemUrl@/js/modules/studyArchives/controllers/trainClass-ctrl',
    '@systemUrl@/js/modules/myStudy/services/myStudy-service'], function (controllers, goodsCtrl, trainClassCtrl, myStudyService) {
    'use strict';
    angular.module('app.center.states.studyArchives.main', [])
        .controller('app.center.states.studyArchives.indexCtrl', controllers.indexCtrl)
        .controller('app.center.states.goodsArchives.indexCtrl', goodsCtrl.indexCtrl)
        .controller('app.center.states.trainClassArchives.indexCtrl', trainClassCtrl.indexCtrl)


        .directive('selectOrgnizations',['$http',function($http){
            return {
                scope:{
                    unitId:'=',
                    showNum:'=?'
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateurl;
                },
                //templateUrl:'@systemUrl@/views/studyArchives/orgnizations.html',
                link:function($scope,ele,attrs){
                    if(!attrs.requestUrl){
                        return;
                    }

                    $scope.orgnizationsList=[];
                    $scope.events={
                        choseItem:function(item){
                            if($scope.unitId===item.unitId){
                                return false;
                            }
                            $scope.unitId=item.unitId;
                        }
                    };
                    $http.get(attrs.requestUrl).success(function(data){
                        console.log(data.info);
                        if(data.status){
                            $scope.orgnizationsList=data.info;
                        }
                        /*$scope.orgnizationsList = [
                            {unitId: 1, unitName: '施教机构1'},
                            {unitId: 2, unitName: '施教机构2'},
                            {unitId: 3, unitName: '施教机构3'},
                            {unitId: 4, unitName: '施教机构4'},
                            {unitId: 5, unitName: '施教机构5'},
                            {unitId: 6, unitName: '施教机构6'},
                            {unitId: 7, unitName: '施教机构7'}
                            ];*/
                    });
                }
            }
        }])

        .factory('myStudyService', myStudyService);


});