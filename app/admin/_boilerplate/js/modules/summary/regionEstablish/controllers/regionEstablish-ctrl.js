define(function (regionStatistical) {
    'use strict';
    return {
        indexCtrl: ['$scope',
            function ($scope) {
                $scope.summaryConfig = {
                    listGridUrl: '/web/admin/openStatistics/getPageRegionOpenStatistics',
                    totalGridUrl: '/web/admin/openStatistics/getSummariseRegionOpenStatistics',
                    name: '地区'
                };

                $scope.permission = {
                    search: 'regionEstablish/search',
                    exportOut: 'regionEstablish/export',
                    learnTimeYear: 'regionEstablish/learnTimeYear',
                    titleLevel: 'regionEstablish/titleLevel',
                    learnCategory: 'regionEstablish/learnCategory',
                    region: 'regionEstablish/region',
                    reset: 'regionEstablish/reset',
                    selectClass: 'regionEstablish/searchTrainClass'
                };
            }]
    };
});