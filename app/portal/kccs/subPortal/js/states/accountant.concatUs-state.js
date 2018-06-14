define(function () {
    'use strict';
    angular.module('app.front.states.accountant.concatUs', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.concatUs', {
                url: '/accountant.concatUs',

                views: {
                    'contentView@': {
                        templateUrl: 'kccs/subPortal/views/concatUs/concatUs.html',
                        controller: [function () {

                        }]
                    }
                }
            });
        }]);
});
