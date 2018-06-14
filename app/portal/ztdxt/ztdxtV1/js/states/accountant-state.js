define(['kccs/kccsv2/js/modules/home/main'], function (controllers) {
    'use strict';

    angular.module('app.front.states.accountant', [])

        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant', {
                url: '/accountant',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/home/index.html',
                        controller: 'app.front.states.accountant.indexCtrl'
                    },
                    'topView@': {
                        templateUrl: 'kccs/kccsv2/views/home/top.html',
                        controller: 'app.front.states.accountant.topCtrl'
                    },
                    'footerView@': {
                        templateUrl: 'kccs/kccsv2/views/home/footer.html',
                        controller: 'app.front.states.accountant.footerCtrl'
                    }
                }
            });
        }]);

});