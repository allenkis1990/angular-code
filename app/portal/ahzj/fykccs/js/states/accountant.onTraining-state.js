define(['ahzj/fykccs/js/modules/onTraining/main'], function () {
    'use strict';

    angular.module('app.front.states.onTraining', [])

        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.onTraining', {
                url: '/accountant.onTraining/:categoryType?skuParams?currentMarjorId?currentMarjorName',
                title: '报班培训',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/onTraining/index.html',
                        controller: 'onTrainingCtrl'
                    }
                }
            }).state('states.accountant.onTraining.onTrainingViews', {
                url: '/onTrainingViews/:commoditySkuId/:coursePoolId/:courseId/:goodsType/:showMajor',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/onTraining/onTrainingViews.html',
                        controller: 'onTrainingViewsCtrl'
                    }
                }
            });
        }]);

});