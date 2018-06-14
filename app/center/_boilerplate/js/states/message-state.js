define(['@systemUrl@/js/modules/message/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.message', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.message', {
            url: '/message/:tabId',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/message/index.html',
                    controller: 'app.center.states.message.indexCtrl'
                }
            }
        }).state('states.message.messageViews', {
            url: '/messageViews/:id',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/message/messageViews.html',
                    controller: 'app.center.states.messageViews.indexCtrl'
                }
            }
        });
    }]);
});