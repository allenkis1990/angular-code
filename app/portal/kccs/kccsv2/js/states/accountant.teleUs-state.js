define(function () {
    'use strict';
    angular.module('app.front.states.accountant.teleUs', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.teleUs', {
                url: '/accountant.teleUs',

                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/teleUs/teleUs.html',
                        controller: [function () {

                        }]
                    }
                }
            });
        }]);
});
