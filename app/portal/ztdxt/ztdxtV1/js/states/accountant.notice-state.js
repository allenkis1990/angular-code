define(['kccs/kccsv2/js/modules/notice/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.notice', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.notice', {
                url: '/accountant.notice/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/notice/notice.html',
                        controller: 'noticeCtrl'
                    }
                }
            });
        }]);
});
