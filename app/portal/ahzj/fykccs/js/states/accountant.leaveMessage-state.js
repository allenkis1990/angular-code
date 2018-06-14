define(['ahzj/fykccs/js/modules/leaveMessage/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.leaveMessage', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.leaveMessage', {
                url: '/accountant.leaveMessage',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/leaveMessage/leaveMessage.html',
                        controller: 'leaveMessageCtrl'
                    }
                }
            });
        }]);
});
