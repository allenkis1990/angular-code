define(['ahzj/kccs/js/modules/information/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.information', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.information', {
                url: '/accountant.information/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/information/information.html',
                        controller: 'informationCtrl'
                    }
                }
            });
        }]);
});
