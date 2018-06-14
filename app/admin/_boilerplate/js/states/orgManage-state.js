define(['angularUiRouter', '@systemUrl@/js/modules/orgManage/main'], function () {
    'use strict';
    return angular.module('app.states.orgManage', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider
                .state('states.orgManage', {
                    url: '/orgManage',
                    sticky: true,
                    views: {
                        'states.orgManage@': {
                            templateUrl: '@systemUrl@/views/orgManage/orgManage.html',
                            controller: 'app.orgManage.orgManageCtrl'
                        }
                    }
                });
        });
});
