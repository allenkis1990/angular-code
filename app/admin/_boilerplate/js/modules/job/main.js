define(
    [
        'angular',
        'directives/remote-validate-directive',
        'directives/dynamic-name-directive',
        '@systemUrl@/js/modules/job/controllers/job-index',
        '@systemUrl@/js/modules/job/controllers/job-edit-new',
        '@systemUrl@/js/modules/job/controllers/job-edit',
        '@systemUrl@/js/modules/job/services/job-service',
        '@systemUrl@/js/const/global-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ], function (angular, validate, dynamicName, jobIndex, jobEditNew, jobEdit, jobService, global) {
        'use strict';
        return angular.module('app.job', ['kendo.ui.commons'])
            .constant('global', global)
            .directive('ajaxValidate', validate)
            .directive('ajaxValidate', dynamicName)
            .controller('app.job.index', jobIndex)
            .controller('app.job.editNew', jobEditNew)
            .controller('app.job.edit', jobEdit)
            .factory('jobService', jobService);
    });
