/*
define(['angular'], function (angular) {
    'use strict';
    return angular.module('app.paymentAccount', [])
        .controller('app.paymentAccount.index', ['$scope', 'Restangular', function ($scope, Restangular) {

            var requestBase = Restangular.withConfig(function (config) {//用户的信息
                config.setBaseUrl('/web/admin/paymentAccount');
            });

            $scope.paymentAccountList = [];
            requestBase.one('getPaymentAccountList?tradeType=0').get().then(function (response) {
                if (response.info.length) {
                    $scope.paymentAccountList = response.info;
                }
            });
        }]);
});
*/
/*define(['@systemUrl@/js/modules/paymentAccount/controllers/paymentAccount-ctrl',
 '@systemUrl@/js/modules/paymentAccount/services/paymentAccount-service'], function (controllers,paymentAccountService) {
 'use strict';
 angular.module('app.admin.states.paymentAccount.main', [])
 .controller('app.admin.states.paymentAccount.indexCtrl', controllers.indexCtrl)
 .factory('paymentAccountService',paymentAccountService);
 });*/
define(['@systemUrl@/js/modules/paymentAccount/controllers/paymentAccount-ctrl',
    '@systemUrl@/js/modules/paymentAccount/services/paymentAccount-service',
    'directives/remote-validate-directive','@systemUrl@/js/services/kendoui-commons',
    'common/hbWebUploader'], function (controllers, paymentAccountService, validate) {
    'use strict';
    angular.module('app.admin.states.paymentAccount.main', ['kendo.ui.commons'])


        .controller('app.admin.states.paymentAccount.indexCtrl', controllers.indexCtrl)

        .factory('paymentAccountService', paymentAccountService)
        //.run ( ['$rootScope', '$http', 'hbBasicData', function ( $rootScope, $http, hbBasicData ) {
        //    hbBasicData.setResource ();
        //}] )
        .directive('ajaxValidate', validate);
});