define(['ahzj/kccs/js/modules/news/controllers/news-ctrl',
    'ahzj/kccs/js/modules/news/controllers/newsDetail-ctrl',
    'ahzj/kccs/js/modules/news/services/news-service'], function (newsCtrl, newsDetailCtrl, newsService) {
    'use strict';
    angular.module('app.portal.states.news.main', [])
        .controller('newsCtrl', newsCtrl)
        .controller('newsDetailCtrl', newsDetailCtrl)
        .factory('newsService', newsService);
});