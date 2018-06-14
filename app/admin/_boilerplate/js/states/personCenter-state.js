define(['angularUiRouter', '@systemUrl@/js/modules/personCenter/main'], function () {
    'use strict';
    return angular.module('app.states.personCenter', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.personCenter', {
                url: '/personCenter',
                sticky: true,
                unListed: true,
                title: '学习中心',
                views: {
                    'states.personCenter@': {
                        templateUrl: '@systemUrl@/views/personCenter/personCenter-index.html',
                        controller: 'app.personCenter.personCenterCtrl'
                    }
                }
            });
        });
});
