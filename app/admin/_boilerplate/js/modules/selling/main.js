define([
    'angular',
    '@systemUrl@/js/modules/selling/controllers/selling-ctrl',
    '@systemUrl@/js/modules/selling/services/selling-service'
], function (angular, sellingCtrl, sellingService) {
    'use strict';
    angular.module('app.selling', [])
        .controller('app.selling.sellingCtrl', sellingCtrl)
        .factory('sellingService', sellingService)
    ;
});