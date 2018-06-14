define(['kccs/kccsv2/js/modules/download/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.download', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.download', {
                url: '/accountant.download',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/download/download.html',
                        controller: 'downloadCtrl'
                    }
                }
            });
        }]);
});
