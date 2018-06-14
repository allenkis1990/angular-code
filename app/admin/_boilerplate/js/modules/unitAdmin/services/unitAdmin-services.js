define (function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig (function (config) {
            config.setBaseUrl ('/web/admin/unitAdminCustom' +
                '');
        });

        var b = Restangular.withConfig (function (config) {
            config.setBaseUrl ('/web/admin/orderManage');
        });

        var baseCus = Restangular.withConfig ( function ( config ) {
            config.setBaseUrl ( '/web/admin/customerService' );
        } );
        var base = Restangular.withConfig ( function ( config ) {
            config.setBaseUrl ( '/web/admin/regionInfo' );
        } );
        var batchBase = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/batchOrderAction');
        });
        return {

            getUserInfo:function(param){
                return a.one("getUserInfoByUserId/"+param+'/').get();
            },
            edit:function(param){
                return a.all("edit").post(param);
            },
            resetPassword:function(param){
                return a.one("resetPassword/"+param+'/').get();
            },

            swapTrainClass: function (params) {
                return baseCus.one ( 'swapTrainClass/'+params.studentId ).get (params.swapObj);
            },

            getSwapOrderPage:function(params){
                return b.one ( 'getSwapOrderPage' ).get (params);
            },

            //继续换班
            resumeSwap:function(swapOrderNo){
                return baseCus.one ( 'resumeSwap/'+swapOrderNo ).get ();
            },
            findRegionByParentId:function(id){
                return base.one ( 'findRegionByParentId/'+id+'/'+1).get ();
            },
            doView:function(){

            },
            findBatchDetail: function (pramas) {
                return batchBase.one('findBatchDetail').get(pramas);
            },
            getCommitResult: function (batchNo) {
                return batchBase.one('getCommitResult').get(batchNo);
            },
            closeBatch: function (batchNo,reason) {
                return batchBase.one('closeBatch/'+batchNo).get({reason:reason});
            },
        }
    }]
});
