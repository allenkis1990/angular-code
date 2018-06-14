define(['kccs/subPortal/js/modules/noticeViews/controllers/noticeViews-ctrl',
    'kccs/subPortal/js/modules/noticeViews/services/noticeViews-service'], function (noticeViewsCtrl, noticeViewsService) {
    'use strict';
    angular.module('app.portal.states.noticeViews.main', [])
        .controller('noticeViewsCtrl', noticeViewsCtrl)
        .factory('noticeViewsService', noticeViewsService)
        .filter('trustHtml', function ($sce) {
            return function (input) {
                return $sce.trustAsHtml(input);
            };
        });
});