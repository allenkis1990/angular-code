define(['@systemUrl@/js/modules/classInformation/controllers/classInformation-ctrl',
        '@systemUrl@/js/modules/classInformation/services/classInformation-services',
        '@systemUrl@/js/modules/classInformation/classInfo/services/classInfo-service',
        '@systemUrl@/js/services/kendoui-commons'],
    function (controllers, classInformationServices, classInfoService) {
        'use strict';
        angular.module('app.admin.states.classInformation.main', ['kendo.ui.commons'])
            .controller('app.admin.states.classInformation.indexCtrl', controllers.indexCtrl)
            .factory('classInformationServices', classInformationServices)
            .factory('classInfoService', classInfoService);
    });