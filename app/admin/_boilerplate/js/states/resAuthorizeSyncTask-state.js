/**
 * Created by linj on 2018/6/4 18:58.
 */
define(['@systemUrl@/js/modules/resAuthorizeSyncTask/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.resAuthorizeSyncTask', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.resAuthorizeSyncTask', {
                url: '/resAuthorizeSyncTask',
                sticky: true,
                views: {
                    'states.resAuthorizeSyncTask@': {
                        templateUrl: '@systemUrl@/views/resAuthorizeSyncTask/index.html',
                        controller: 'app.admin.states.resAuthorizeSyncTask.indexCtrl'
                    }
                }
            })
        }]);
});