define(['@systemUrl@/js/modules/statisticTaskExport/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.statisticTaskExport', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.statisticTaskExport', {
            url: '/statisticTaskExport',
            views: {
                'states.statisticTaskExport@': {
                    templateUrl: '@systemUrl@/views/statisticTaskExport/statisticTaskExport.html',
                    controller: 'app.admin.states.statisticTaskExport.indexCtrl'
                }
            }
        });
    }]);
});