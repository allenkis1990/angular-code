define(['kccs/kccsv2/js/modules/lessonList/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.lessonList', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.lessonList', {
                url: '/accountant.lessonList',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/lessonList/lessonList.html',
                        controller: 'lessonListCtrl'
                    }
                }
            }).state('states.accountant.lessonList.lessonViews', {
                url: '/lessonViews/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/lessonList/lessonViews.html',
                        controller: 'lessonViewsCtrl'
                    }
                }
            });
        }]);
});
