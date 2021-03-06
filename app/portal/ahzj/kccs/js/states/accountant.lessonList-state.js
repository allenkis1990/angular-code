define(['ahzj/kccs/js/modules/lessonList/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.lessonList', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.lessonList', {
                url: '/accountant.lessonList',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/lessonList/lessonList.html',
                        controller: 'lessonListCtrl'
                    }
                }
            }).state('states.accountant.lessonList.lessonViews', {
                url: '/lessonViews/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/lessonList/lessonViews.html',
                        controller: 'lessonViewsCtrl'
                    }
                }
            });
        }]);
});
