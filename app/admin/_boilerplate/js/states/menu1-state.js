/**
 * Created by admin on 2015/5/11.
 */
define(['angularUiRouter', '@systemUrl@/js/modules/menu1/controllers/menu1-ctrl'], function () {
    'use strict';
    return angular.module('app.states.menu1', [
        'ui.router'
    ]).config(function ($stateProvider,
                        $urlRouterProvider,
                        $urlMatcherFactoryProvider) {
            $stateProvider
                .state('states.menu1', {
                    url: '/menu1',
                    abstract: true,
                    template: '<div ui-view/>'
                })
                .state('states.menu1.list', {
                    url: '/list',
                    views: {
                        'contentView@': {
                            templateUrl: '@systemUrl@/views/menu1/menu1-index.html',
                            controller: 'app.menu1.menu1Ctrl'
                        }
                    }
                });
        }
    );
});
