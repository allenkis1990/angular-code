/**
 * Created by linj on 2018/6/4 18:58.
 */
define(['@systemUrl@/js/modules/resAuthorizedUnitInfo/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.resAuthorizedUnitInfo', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.resAuthorizedUnitInfo', {
                url: '/resAuthorizedUnitInfo',
                sticky: true,
                views: {
                    'states.resAuthorizedUnitInfo@': {
                        templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo/index.html',
                        controller: 'app.admin.states.resAuthorizedUnitInfo.indexCtrl'
                    }
                }
            }).state('states.resAuthorizedUnitInfo.view', {
                url: '/view/:unitId',
                templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo/res-authorize-view.html',
                controller: 'app.admin.states.resAuthorizedUnitInfo.viewCtrl'
            }).state('states.resAuthorizedUnitInfo.update', {
                url: '/update/:unitId',
                templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo/res-authorize-update.html',
                controller: 'app.admin.states.resAuthorizedUnitInfo.updateCtrl'
            }).state('states.resAuthorizedUnitInfo.log', {
                url: '/log',
                templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo/res-authorize-log.html',
                controller: 'app.admin.states.resAuthorizedUnitInfo.indexCtrl'
            })
        }]);
});