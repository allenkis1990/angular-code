define(['ahzj/kccs/js/modules/home/main'], function (controllers) {
    'use strict';

    angular.module('app.front.states.accountant', [])

        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant', {
                url: '/accountant',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/home/index.html',
                        controller: 'app.front.states.accountant.indexCtrl'
                    },
                    'topView@': {
                        templateUrl: 'ahzj/kccs/views/home/top.html',
                        controller: 'app.front.states.accountant.topCtrl'
                    },
                    'footerView@': {
                        templateUrl: 'ahzj/kccs/views/home/footer.html',
                        controller: 'app.front.states.accountant.footerCtrl'
                    }
                }
            });
        }]);

});