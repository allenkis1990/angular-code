define(['kccs/subPortal/js/modules/courseShow/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.courseShow', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.courseShow', {
                url: '/accountant.courseShow',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/subPortal/views/courseShow/index.html',
                        controller: 'courseShowCtrl'
                    }
                }
            });
        }]);
});
