define([
        'angular',
        '@systemUrl@/js/modules/packageDispatch/controllers/packageDispatch-ctrl',
        '../../directives/copy-man',
        'common/hbWebUploader'
    ],
    function (angular, packageDispatchCtrl, copyMan) {
        'use strict';
        return angular.module('app.packageDispatch', ['hb.webUploader'])

            .directive('copyManTwo', copyMan)

            .controller('app.packageDispatch.index', packageDispatchCtrl.index)

            .controller('app.packageDispatch.dispatch', packageDispatchCtrl.dispatch)

            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {

                hbBasicData.setResource();

            }]);

    });
