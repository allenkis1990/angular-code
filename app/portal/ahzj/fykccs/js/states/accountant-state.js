define(['ahzj/fykccs/js/modules/home/main'], function (controllers) {
    'use strict';

    angular.module('app.front.states.accountant', [])

        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant', {
                url: '/accountant',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/home/index.html',
                        controller: 'app.front.states.accountant.indexCtrl'
                    },
                    'topView@': {
                        templateUrl: 'ahzj/fykccs/views/home/top.html',
                        controller: 'app.front.states.accountant.topCtrl'
                    },
                    'footerView@': {
                        templateUrl: 'ahzj/fykccs/views/home/footer.html',
                        controller: 'app.front.states.accountant.footerCtrl'
                    }
                }
            });
        }]);

});