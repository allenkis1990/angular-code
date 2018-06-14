define(['@systemUrl@/js/modules/unitAdmin/controllers/unitAdmin-ctrl',
        '@systemUrl@/js/modules/unitAdmin/services/unitAdmin-services',
        '@systemUrl@/js/modules/unitAdmin/services/classInfo-service',
        'directives/remote-validate-directive',
        '@systemUrl@/js/services/kendoui-commons'],
    function (controllers,unitAdminServices,classInfoService, validate) {
        'use strict';
        angular.module('app.admin.states.unitAdmin.main', ['kendo.ui.commons'])
            .controller('app.admin.states.unitAdmin.indexCtrl', controllers.indexCtrl)
            .factory('unitAdminServices',unitAdminServices)
            .factory('classInfoService',classInfoService)
            .directive('ajaxValidate', validate)
    });