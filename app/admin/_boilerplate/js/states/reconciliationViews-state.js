define(['@systemUrl@/js/modules/reconciliationViews/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.reconciliationViews', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.reconciliationViews', {
            url: '/reconciliationViews',
            sticky: true,
            views: {
                'states.reconciliationViews@': {
                    templateUrl: '@systemUrl@/views/reconciliationViews/index.html',
                    controller: 'app.admin.states.reconciliationViews.indexCtrl'
                }
            }
        });
    }]);
});