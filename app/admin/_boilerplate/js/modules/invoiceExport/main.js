define(['@systemUrl@/js/modules/invoiceExport/controllers/invoiceExport-ctrl',
    '@systemUrl@/js/modules/invoiceViews/services/invoiceViews-service',
    '@systemUrl@/js/services/kendoui-commons'], function (controllers, invoiceViewsService) {
    'use strict';
    angular.module('app.admin.states.invoiceExport.main', ['kendo.ui.commons'])
        .controller('app.admin.states.invoiceExport.indexCtrl', controllers.indexCtrl)
        .factory('invoiceViewsService', invoiceViewsService);
});