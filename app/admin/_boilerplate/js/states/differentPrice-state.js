define(['angularUiRouter', '@systemUrl@/js/modules/differentPrice/main'], function () {
    'use strict';
    return angular.module('app.states.differentPrice', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.differentPrice', {
                url: '/differentPrice/:jsonStr',
                sticky: true,
                unListed: true,
                title: '课程清单',
                views: {
                    'states.differentPrice@': {
                        templateUrl: '@systemUrl@/views/differentPrice/index.html',
                        controller: 'app.differentPrice.differentPriceCtrl'
                    }
                }
            });
        });
});
