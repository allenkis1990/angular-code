define(['ahzj/fykccs/js/modules/download/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.download', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.download', {
                url: '/accountant.download',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/download/download.html',
                        controller: 'downloadCtrl'
                    }
                }
            });
        }]);
});
