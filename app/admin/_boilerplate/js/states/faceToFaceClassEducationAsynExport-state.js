define(['angularUiRouter', '@systemUrl@/js/modules/faceToFaceClassEducationAsynExport/main'], function () {
    'use strict';
    return angular.module('app.states.faceToFaceClassEducationAsynExport', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.faceToFaceClassEducationAsynExport', {
            url: '/faceToFaceClassEducationAsynExport',
            sticky: true,
            views: {
                'states.faceToFaceClassEducationAsynExport@': {
                    templateUrl: '@systemUrl@/views/faceToFaceClassEducationAsynExport/index.html',
                    controller: 'app.faceToFaceClassEducationAsynExport.faceToFaceClassEducationAsynExportCtrl'
                }
            }
        });
    });
});