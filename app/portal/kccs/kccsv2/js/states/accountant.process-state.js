define(['kccs/kccsv2/js/modules/process/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.process', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.process', {
                url: '/accountant.process/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/process/process.html',
                        controller: 'processCtrl'
                    }
                }
            });
        }]);
});
