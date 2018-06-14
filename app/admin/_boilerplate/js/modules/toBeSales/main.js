define(['angular',
    '@systemUrl@/js/modules/toBeSales/controllers/toBeSales-ctrl',
    '@systemUrl@/js/modules/toBeSales/services/toBeSales-service'
], function (angular, toBeSalesCtrl, toBeSalesService) {
    'use strict';
    angular.module('app.toBeSales', [])
        .controller('app.toBeSales.toBeSalesCtrl', toBeSalesCtrl)
        .factory('toBeSalesService', toBeSalesService)
    ;
});