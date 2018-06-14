define(['kccs/kccsv2/js/modules/lessonList/controllers/lessonList-ctrl',
    'kccs/kccsv2/js/modules/lessonList/services/lessonList-service',
    'kccs/kccsv2/js/modules/lessonList/controllers/lessonViews-ctrl'], function (lessonListCtrl, lessonListService, lessonViewsCtrl) {
    'use strict';
    angular.module('app.portal.states.lessonList.main', [])
        .controller('lessonListCtrl', lessonListCtrl)
        .controller('lessonViewsCtrl', lessonViewsCtrl)
        .factory('lessonListService', lessonListService);
});