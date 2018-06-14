define(function (paymentDetail) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'paymentAccountService', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification',
            function ($scope, paymentAccountService, $stateParams, $http, $q, HB_dialog, $state, HB_notification) {
                //$scope.$watch ( 'params.password', function (nv) {
                //    if(nv === "" || nv === undefined){
                //        $scope.params.password = "******";
                //    }
                //} );

                /*    $scope.params= {
                         id:"",
                         accountNo:"",
                         accountAlias:"",
                         createType:2,
                         merchantName:"",
                         merchantKey:"",
                         merchantPhone:"",
                         appId:"",
                         privateKeyPwd:"",
                         privateKeyPath:"",
                         privateKeyFileName:""
                     }*/
                /*$scope.events={
                    create:function(){
                      /!*  console.log($scope.params);*!/
                        paymentAccountService.create($scope.params).then(function(data){
                            $scope.submitAble=false;
                            if(data.status){
                                HB_dialog.success ( '提示', data.info || '收款账号创建成功' );
                            }else{
                                HB_dialog.error ( '提示', data.info || '收款账号创建失败' );
                            }
                        });
                    }
                }*/
            }]
    };
});