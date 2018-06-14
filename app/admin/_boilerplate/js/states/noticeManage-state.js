define(['angularUiRouter', '@systemUrl@/js/modules/noticeManage/main'], function () {
    'use strict';
    return angular.module('app.states.noticeManage', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.noticeManage', {
                url: '/noticeManage',
                sticky: true,
                views: {
                    'states.noticeManage@': {
                        templateUrl: '@systemUrl@/views/noticeManage/noticeManage.html',
                        controller: 'app.noticeManage.noticeManageCtrl'
                    }
                }
            })
                .state('states.noticeManage.view', {
                    url: '/view/:noticeId',
                    templateUrl: '@systemUrl@/views/noticeManage/viewInfo.html',
                    controller: 'app.noticeManage.noticeManageViewCtrl'
                });
        });
});
