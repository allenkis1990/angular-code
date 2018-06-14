/**
 * Created by Administrator on 2015/7/9.
 */
define ( function () {

    return ['Restangular', function ( Restangular ) {

        var baseCommod = Restangular.withConfig ( function ( config ) {
            config.setBaseUrl ( '/web/admin/commodityManager' );
        } );
        var baseClassInfo = Restangular.withConfig ( function ( config ) {
            config.setBaseUrl ( '/web/admin/classInfo' );
        } );
        var baseCus = Restangular.withConfig ( function ( config ) {
            config.setBaseUrl ( '/web/admin/customerService' );
        } );
        return {

            getUserTrainingTypes:function(params){
                return baseClassInfo.one ( 'getUserTrainingSkuPropertyValues' ).get (params);
            },

            getUserTrainingYears: function (params) {
                return baseClassInfo.one ( 'getUserTrainingSkuPropertyValues' ).get (params);
            },
            getUserTitleLevels: function (params) {
                return baseClassInfo.one ( 'getUserTrainingSkuPropertyValues' ).get (params);
            },
            quickenedCourseLearning: function (params) {
                return baseClassInfo.all ( 'quickenedCourseLearning' ).post (params);
            },
            getCoursesLearningInfoAll: function (params) {
                return baseClassInfo.one ( 'getCoursesLearningInfoAll' ).get (params);
            },
            getClassExams: function (params) {
                return baseClassInfo.one ( 'getClassExams' ).get (params);
            },
            deleteExamTimesDetail: function (params) {
                return baseClassInfo.all ( 'deleteExamTimesDetail' ).post (params);
            },
            oneKeyCourseLearned: function (params) {
                return baseClassInfo.all ( 'oneKeyCourseLearned' ).post (params);
            },
            oneKeyPass: function (params) {
                return baseClassInfo.all ( 'oneKeyPass' ).post (params);
            },
            getTrainClassInfo: function (params) {
                return baseCus.one ( 'getTrainClassInfo' ).get (params);
            },
            swapTrainClass: function (params) {
                return baseCus.one ( 'swapTrainClass/'+params.studentId ).get (params.swapObj);
            }
        };
    }]
} );
