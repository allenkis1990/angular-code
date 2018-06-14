define(['angular',
        '@systemUrl@/js/const/global-constants',
        '@systemUrl@/js/modules/coursePackageManager/controllers/coursePackageManager-ctrl',
        '@systemUrl@/js/modules/coursePackageManager/controllers/coursePackageManagerEdit-ctrl',
        '@systemUrl@/js/modules/coursePackageManager/controllers/coursePackageManagerRequiredEdit-ctrl',
        '@systemUrl@/js/modules/coursePackageManager/controllers/coursePackageManagerAdd-ctrl',
        '@systemUrl@/js/modules/coursePackageManager/controllers/coursePackageManagerView-ctrl',
        '@systemUrl@/js/modules/courseManager/services/courseManager-service',
        '@systemUrl@/js/modules/coursePackageManager/services/course-pool-service',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/coursePackageManager/directives/focus-me-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, global, coursePackageManagerCtrl, coursePackageManagerEdit, coursePackageManagerRequiredEdit,
              coursePackageManagerAdd, coursePackageManagerView, courseManagerService, coursePackageManagerService,
              validate, focusMe) {
        'use strict';
        return angular.module('app.coursePackageManager',
            ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
            .constant('global', global)
            .controller('app.coursePackageManager.coursePackageManagerCtrl', coursePackageManagerCtrl)
            .controller('app.coursePackageManager.coursePackageManagerEditCtrl', coursePackageManagerEdit)
            .controller('app.coursePackageManager.coursePackageManagerRequiredEditCtrl', coursePackageManagerRequiredEdit)
            .controller('app.coursePackageManager.coursePackageManagerAddCtrl', coursePackageManagerAdd)
            .controller('app.coursePackageManager.coursePackageManagerViewCtrl', coursePackageManagerView)
            .directive('focusMe', focusMe)
            .directive('ajaxValidate', validate)
            .factory('courseManagerService', courseManagerService)
            .factory('coursePackageManagerService', coursePackageManagerService);
    });
