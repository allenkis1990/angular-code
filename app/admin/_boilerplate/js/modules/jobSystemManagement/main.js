define([
        'angular',
        '@systemUrl@/js/modules/jobSystemManagement/controllers/jobSystemManagement-ctrl',
        '@systemUrl@/js/modules/jobSystemManagement/services/jobSystemManagement-service',
        'restangular',
        '@systemUrl@/js/services/kendoui-commons',
        '@systemUrl@/js/services/kendoui-constants'
    ],
    function (angular, jobSystemManagementCtrl, jobSystemManagementService) {
        'use strict';
        return angular.module('app.jobSystemManagement', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
            .controller('app.jobSystemManagement.jobSystemManagementCtrl', jobSystemManagementCtrl)
            .factory('jobSystemManagementService', jobSystemManagementService);
    });
