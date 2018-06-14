define(['kccs/subPortal/js/modules/lessonList/controllers/lessonList-ctrl',
    'kccs/subPortal/js/modules/lessonList/services/lessonList-service',
    'kccs/subPortal/js/modules/lessonList/controllers/lessonViews-ctrl'], function (lessonListCtrl, lessonListService, lessonViewsCtrl) {
    'use strict';
    angular.module('app.portal.states.lessonList.main', [])
        .controller('lessonListCtrl', lessonListCtrl)
        .controller('lessonViewsCtrl', lessonViewsCtrl)
        .factory('lessonListService', lessonListService);
});