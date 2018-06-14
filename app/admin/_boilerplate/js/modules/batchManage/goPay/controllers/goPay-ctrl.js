define ( function ( detail  ) {
    "use strict";
    return {
        indexCtrl: ["$scope",'hbUtil','KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'batchManageServices', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification','TabService','hbSkuService',
            function ( $scope,hbUtil,  KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid,batchManageServices, $stateParams, $http, $q, HB_dialog, $state, HB_notification,TabService,hbSkuService) {

                $scope.model = {
                    batchInfo:{
                        no:$stateParams.batchNo,
                        people:'',
                        totalMoney:''
                    },
                    payWay:{
                      id:'cd9b76a9e7514229ad605927a7aa13e7'
                    },
                    payWayList:[

                    ]
                };

                $scope.events={
                    goOrderManage: function () {
                        TabService.appendNewTab ( '订单管理', 'states.orderManage',{batchNo:$stateParams.batchNo},'states.orderManage',{closeAble:true});
                    },
                    toPayBatch:function(){
                        if($scope.model.batchInfo.totalMoney!==0){
                            var popup = window.open('about:blank', '_blank');  //先发起弹窗（因为是用户触发，所以不会被拦截）
                            popup.document.write('<h2>加载中...</h2>')
                        }
                        batchManageServices.toPayBatch(
                          $stateParams.batchNo,{
                                accountId:$scope.model.payWay.id ,//$scope.model.payWay.id,//收款账号id
                                callback:"" //回调页面
                          }
                        ).then(function(data){
                            if (data.code === '200') {
                                if(data.data==='success'){
                                    HB_dialog.success('提示','支付成功！');
                                    $state.go('states.batchManage',{reload:true});
                                }else{
                                    popup.location = data.data;  //在重定向页面链接
                                   //window.open(data.data);
                                    // var newWindow = window.open("_blank");
                                    //newWindow .location = data.data;
                                    HB_dialog.contentAs ( $scope, {
                                        title      : '请您在新打开的页面上支付',
                                        width      : 450,
                                        templateUrl: '@systemUrl@/views/batchManage/goPay/goPayDialog.html',
                                        confirmText: '已完成',
                                        cancelText: '未完成,回到当前页面',
                                        cancel: function () {

                                        },
                                        sure: function ( dialog ) {
                                            return batchManageServices.paySuccess($stateParams.batchNo).then(function(data){
                                                if(data.info===false){
                                                    HB_dialog.warning('提示','您还未支付！');
                                                    //dialog.close(dialog.dialogIndex);
                                                }else{
                                                    $state.go('states.batchManage',{reload:true});
                                                    dialog.close(dialog.dialogIndex);
                                                }
                                            })
                                        }
                                    } );
                                }


                            }else{

                            }

                        })
                    }
                }

                batchManageServices.findBatchDetail({
                    batchNo:$stateParams.batchNo}
                 ).then(function(data){
                    console.log(data.info);
                    $scope.model.batchInfo = data.info;
                });
                batchManageServices.getMerchantAccountList({
                    placeChannelEnum:'COLLECTIVE',
                    payType:1
                }
                ).then(function(data){
                    $scope.model.payWayList=data.info;
                    $scope.model.payWay.id=data.info[0].id;

                })
            }]
    }
} );