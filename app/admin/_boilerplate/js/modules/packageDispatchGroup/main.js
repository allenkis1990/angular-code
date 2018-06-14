define([
        'angular',
        '@systemUrl@/js/modules/packageDispatchGroup/controllers/packageDispatchGroup-ctrl',
        '../../directives/copy-man',
        'common/hbWebUploader'
    ],
    function (angular, packageDispatchGroupCtrl, copyMan) {
        'use strict';
        return angular.module('app.packageDispatchGroup', ['hb.webUploader'])

            .directive('copyMann', copyMan)

            .controller('app.packageDispatchGroup.index', packageDispatchGroupCtrl.index)

            .controller('app.packageDispatchGroup.dispatch', packageDispatchGroupCtrl.dispatch)

            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {

                hbBasicData.setResource();

            }])

    });
