define(['@systemUrl@/js/modules/trainingCertificate/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.trainingCertificate', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.trainingCertificate', {
            url: '/trainingCertificate',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/trainingCertificate/index.html',
                    controller: 'app.center.states.trainingCertificate.indexCtrl'
                }
            }
        })
            .state('states.trainingCertificate.dialogImg', {
                url: '/trainingCertificate/dialogImg',
                views: {
                    'contentView@': {
                        templateUrl: '@systemUrl@/views/trainingCertificate/dialogImg.html',
                        controller: 'app.center.states.trainingCertificate.indexCtrl'
                    }
                }
            });
    }]);
});