define(function (classStatistical) {
    'use strict';
    return {
        indexCtrl: ['$scope','$rootScope',
            function ($scope,$rootScope) {
                $scope.summaryConfig = {
                    listGridUrl: '/web/admin/openStatistics/getClassOpenStatistics',
                    totalGridUrl: '/web/admin/openStatistics/getTotalClassOpenStatistics',
                    name: '培训班名称'
                };
                $scope.permission = {
                    search: 'classEstablishSubProject/search',
                    exportOut: 'classEstablishSubProject/export',
                    learnTimeYear: 'classEstablishSubProject/learnTimeYear',
                    titleLevel: 'classEstablishSubProject/titleLevel',
                    learnCategory: 'classEstablishSubProject/learnCategory',
                    reset: 'classEstablishSubProject/reset',
                    selectClass: 'classEstablishSubProject/searchTrainClass'
                };
            }]
    };
});