define(['angular',
        '@systemUrl@/js/modules/certifiedTemplate/controllers/certifiedTemplate-ctrl',
        '@systemUrl@/js/modules/certifiedTemplate/services/certifiedTemplate-service',
        'directives/remote-validate-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons',
        '@systemUrl@/js/const/global-constants'
    ],
    function (angular, certifiedTemplateCtrl, certifiedTemplateService, validateDirective) {
        'use strict';
        return angular.module('app.certifiedTemplate', ['kendo.ui.constants', 'kendo.ui.commons'])
            .controller('app.certifiedTemplate.certifiedTemplateCtrl', certifiedTemplateCtrl)
            .factory('certifiedTemplateService', certifiedTemplateService)
            .directive('ajaxValidate', validateDirective);
    });
