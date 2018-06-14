define(['kccs/kccsv2/js/modules/onTraining/main'], function () {
    'use strict';

    angular.module('app.front.states.onTraining', [])

        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.onTraining', {
                url: '/accountant.onTraining/:categoryType',
                title: '报班培训',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/onTraining/index.html',
                        controller: 'onTrainingCtrl'
                    }
                }
            }).state('states.accountant.onTraining.onTrainingViews', {
                url: '/onTrainingViews/:commoditySkuId/:coursePoolId/:courseId/:goodsType/:showMajor',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/onTraining/onTrainingViews.html',
                        controller: 'onTrainingViewsCtrl'
                    }
                }
            });
        }]);

});