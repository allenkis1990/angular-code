define(['@systemUrl@/js/modules/reconciliationViews/controllers/reconciliationViews-ctrl',
    '@systemUrl@/js/modules/reconciliationViews/services/reconciliationViews-services',
    '@systemUrl@/js/services/kendoui-commons'], function (controllers, reconciliationViewsServices) {
    'use strict';
    angular.module('app.admin.states.reconciliationViews.main', ['kendo.ui.commons'])
        .controller('app.admin.states.reconciliationViews.indexCtrl', controllers.indexCtrl)
        .factory('reconciliationViewsServices', reconciliationViewsServices);
});