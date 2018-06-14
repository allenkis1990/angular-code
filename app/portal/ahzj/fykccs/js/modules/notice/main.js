define(['ahzj/fykccs/js/modules/notice/controllers/notice-ctrl',
    'ahzj/fykccs/js/modules/notice/services/notice-service'], function (noticeCtrl, noticeService) {
    'use strict';
    angular.module('app.portal.states.notice.main', [])
        .controller('noticeCtrl', noticeCtrl)
        .factory('noticeService', noticeService)
        .filter('trustHtml', function ($sce) {
            return function (input) {
                return $sce.trustAsHtml(input);
            };
        });
});