define(['angular',
        '@systemUrl@/js/modules/courseWareManager/controllers/courseWareManager-popAdd',
        '@systemUrl@/js/modules/courseWareManager/controllers/courseWareManager-ctrl',
        '@systemUrl@/js/modules/courseWareManager/controllers/courseWareManagerEdit-ctrl',
        '@systemUrl@/js/modules/courseWareManager/controllers/courseWareManagerAdd-ctrl',
        '@systemUrl@/js/modules/courseWareManager/controllers/courseWareManagerView-ctrl',
        '@systemUrl@/js/modules/courseWareManager/services/courseWareManager-service',
        '@systemUrl@/js/modules/questionManage/services/question-service',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/courseWareManager/directives/focus-me-directive',

        '@systemUrl@/js/directives/upload-courseWareFile-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons',
        'common/hbWebUploader'
    ],
    function (angular, courseWareManagerPopAddCtrl, courseWareManagerCtrl, courseWareManagerEdit, courseWareManagerAdd,
              courseWareManagerView, courseWareManagerService, questionService, validate, focusMe) {
        'use strict';
        return angular.module('app.courseWareManager',
            ['kendo.ui.constants', 'kendo.ui.commons', 'hb.courseWareUploader', 'hb.webUploader'])
            .controller('app.courseWareManager.courseWareManagerPopAddCtrl', courseWareManagerPopAddCtrl)
            .controller('app.courseWareManager.courseWareManagerCtrl', courseWareManagerCtrl)
            .controller('app.courseWareManager.courseWareManagerEditCtrl', courseWareManagerEdit)
            .controller('app.courseWareManager.courseWareManagerAddCtrl', courseWareManagerAdd)
            .controller('app.courseWareManager.courseWareManagerViewCtrl', courseWareManagerView)
            .directive('ajaxValidate', validate)
            .directive('focusMe', focusMe)
            .factory('questionService', questionService)
            .factory('courseWareManagerService', courseWareManagerService)

            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {

                hbBasicData.setResource();

            }]);

    });
