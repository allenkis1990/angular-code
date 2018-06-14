define(['kccs/kccsv2/js/modules/information/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.information', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.information', {
                url: '/accountant.information/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/information/information.html',
                        controller: 'informationCtrl'
                    }
                }
            });
        }]);
});
