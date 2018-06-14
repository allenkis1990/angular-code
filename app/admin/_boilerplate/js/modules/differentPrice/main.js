define([
    'angular',
    '@systemUrl@/js/modules/differentPrice/controllers/differentPrice-ctrl'
], function (angular, differentPriceCtrl) {
    'use strict';
    return angular.module('app.differentPrice', [])

        .controller('app.differentPrice.differentPriceCtrl', differentPriceCtrl);

});
