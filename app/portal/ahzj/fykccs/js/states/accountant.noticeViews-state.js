define(['ahzj/fykccs/js/modules/noticeViews/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.noticeViews', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.noticeViews', {
                url: '/accountant.noticeViews/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/noticeViews/noticeViews.html',
                        controller: 'noticeViewsCtrl'
                    }
                }
            });
        }]);
});
