define(['angular',
        '@systemUrl@/js/const/global-constants',
        '@systemUrl@/js/modules/coursePoolRuleManager/controllers/coursePoolRuleManager-ctrl',
        '@systemUrl@/js/modules/coursePoolRuleManager/controllers/coursePoolRuleManagerEdit-ctrl',
        '@systemUrl@/js/modules/coursePoolRuleManager/controllers/coursePoolRuleManagerAdd-ctrl',
        '@systemUrl@/js/modules/coursePoolRuleManager/controllers/coursePoolRuleManagerView-ctrl',
        '@systemUrl@/js/modules/courseManager/services/courseManager-service',
        '@systemUrl@/js/modules/coursePackageManager/services/course-pool-service',
        '@systemUrl@/js/modules/coursePoolRuleManager/services/course-pool-rule-service',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/coursePoolRuleManager/directives/focus-me-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, global, coursePoolRuleManagerCtrl, coursePoolRuleManagerEdit, coursePoolRuleManagerAdd,
              coursePoolRuleManagerView, courseManagerService, coursePackageManagerService, coursePoolRuleManagerService, validate, focusMe) {
        'use strict';
        return angular.module('app.coursePoolRuleManager',
            ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
            .constant('global', global)
            .controller('app.coursePoolRuleManager.coursePoolRuleManagerCtrl', coursePoolRuleManagerCtrl)
            .controller('app.coursePoolRuleManager.coursePoolRuleManagerEditCtrl', coursePoolRuleManagerEdit)
            .controller('app.coursePoolRuleManager.coursePoolRuleManagerAddCtrl', coursePoolRuleManagerAdd)
            .controller('app.coursePoolRuleManager.coursePoolRuleManagerViewCtrl', coursePoolRuleManagerView)
            .directive('focusMe', focusMe)
            .directive('ajaxValidate', validate)
            .factory('courseManagerService', courseManagerService)
            .factory('coursePackageManagerService', coursePackageManagerService)
            .factory('coursePoolRuleManagerService', coursePoolRuleManagerService);
    });
