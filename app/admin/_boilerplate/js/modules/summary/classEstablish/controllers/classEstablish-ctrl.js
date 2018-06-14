define(function (classStatistical) {
    'use strict';
    return {
        indexCtrl: ['$scope',
            function ($scope) {
                $scope.summaryConfig = {
                    listGridUrl: '/web/admin/openStatistics/getClassOpenStatistics',
                    totalGridUrl: '/web/admin/openStatistics/getTotalClassOpenStatistics',
                    name: '培训班名称'
                };
                $scope.permission = {
                    search: 'classEstablish/search',
                    exportOut: 'classEstablish/export',
                    learnTimeYear: 'classEstablish/learnTimeYear',
                    titleLevel: 'classEstablish/titleLevel',
                    learnCategory: 'classEstablish/learnCategory',
                    reset: 'classEstablish/reset',
                    selectClass: 'classEstablish/searchTrainClass'
                };
            }]
    };
});