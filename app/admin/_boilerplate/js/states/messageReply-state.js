define(['@systemUrl@/js/modules/messageReply/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.messageReply', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.messageReply', {
            url: '/messageReply',
            sticky: true,
            views: {
                'states.messageReply@': {
                    templateUrl: '@systemUrl@/views/messageReply/index.html',
                    controller: 'app.admin.states.messageReply.indexCtrl'
                }
            }
        });
    }]);
});