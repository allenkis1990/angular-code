define(['ahzj/kccs/js/modules/news/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.news', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.news', {
                url: '/accountant.news',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/news/index.html',
                        controller: 'newsCtrl'
                    }
                }
            }).state('states.accountant.news.newsDetail', {
                url: '/accountant.news.newsDetail/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/news/newsDetail.html',
                        controller: 'newsDetailCtrl'
                    }
                }
            });
        }]);
});
