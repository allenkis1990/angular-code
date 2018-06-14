define(['angular',
        '@systemUrl@/js/modules/courseManager/controllers/courseManager-ctrl',
        '@systemUrl@/js/modules/courseManager/controllers/courseManagerEdit-ctrl',
        '@systemUrl@/js/modules/courseManager/controllers/courseManagerAdd-ctrl',
        '@systemUrl@/js/modules/courseManager/controllers/courseManagerView-ctrl',
        '@systemUrl@/js/modules/courseManager/services/courseManager-service',
        '@systemUrl@/js/modules/courseWareManager/services/courseWareManager-service',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/courseManager/directives/focus-me-directive',
        'directives/upload-files-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, courseManagerCtrl, courseManagerEdit, courseManagerAdd,
              courseManagerView, courseManagerService, courseWareManagerService, validate, focusMe) {
        'use strict';
        return angular.module('app.courseManager',
            ['kendo.ui.constants', 'kendo.ui.commons', 'hb.webuploader'])
            .controller('app.courseManager.courseManagerCtrl', courseManagerCtrl)
            .controller('app.courseManager.courseManagerEditCtrl', courseManagerEdit)
            .controller('app.courseManager.courseManagerAddCtrl', courseManagerAdd)
            .controller('app.courseManager.courseManagerViewCtrl', courseManagerView)
            .directive('ajaxValidate', validate)
            .directive('focusMe', focusMe)
            .factory('courseManagerService', courseManagerService)
            .factory('courseWareManagerService', courseWareManagerService);
    });
