define(
    [
        'angular',
        '@systemUrl@/js/modules/classSchedule/controllers/index-ctrl',
        '@systemUrl@/js/modules/classSchedule/controllers/add-ctrl',
        '@systemUrl@/js/modules/classSchedule/controllers/edit-ctrl',
        '@systemUrl@/js/modules/classSchedule/controllers/detail-ctrl',
        '@systemUrl@/js/modules/classSchedule/services/service',
        'restangular'
    ], function (angular, indexCtrl, addCtrl, editCtrl, detailCtrl, service) {
        'use strict';
        return angular.module('app.classSchedule', [])
            .controller('app.classSchedule.indexCtrl', indexCtrl)
            .controller('app.classSchedule.addCtrl', addCtrl)
            .controller('app.classSchedule.editCtrl', editCtrl)
            .controller('app.classSchedule.detailCtrl', detailCtrl)
            .factory('classScheduleService', service)
            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
                hbBasicData.setResource();
            }])
            .filter('trustHtml', function ($sce) {
                return function (input) {
                    return $sce.trustAsHtml(input);
                };
            });
        ;
    });
