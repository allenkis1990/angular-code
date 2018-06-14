define(['@systemUrl@/js/modules/invoiceViews/controllers/invoiceViews-ctrl',
    '@systemUrl@/js/modules/invoiceViews/services/invoiceViews-service',
    '@systemUrl@/js/services/kendoui-commons'], function (controllers, invoiceViewsService) {
    'use strict';
    angular.module('app.admin.states.invoiceViews.main', ['kendo.ui.commons'])
        .controller('app.admin.states.invoiceViews.indexCtrl', controllers.indexCtrl)
        .factory('invoiceViewsService', invoiceViewsService);
});