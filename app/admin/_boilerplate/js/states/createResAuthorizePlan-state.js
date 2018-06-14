/**
 * Created by linj on 2018/6/4 18:58.
 */
define(['@systemUrl@/js/modules/createResAuthorizePlan/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.createResAuthorizePlan', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.createResAuthorizePlan', {
                url: '/createResAuthorizePlan',
                sticky: true,
                views: {
                    'states.createResAuthorizePlan@': {
                        templateUrl: '@systemUrl@/views/createResAuthorizePlan/index.html',
                        controller: 'app.admin.states.createResAuthorizePlan.indexCtrl'
                    }
                }
            })
        }]);
});