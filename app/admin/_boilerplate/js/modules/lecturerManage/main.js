define(['angular',
        '@systemUrl@/js/modules/lecturerManage/controllers/lecturerManage-ctrl',
        '@systemUrl@/js/modules/lecturerManage/controllers/lecturerManageEdit-ctrl',
        '@systemUrl@/js/modules/lecturerManage/controllers/lecturerManageAdd-ctrl',
        '@systemUrl@/js/modules/lecturerManage/controllers/lecturerManageView-ctrl',
        '@systemUrl@/js/modules/lecturerManage/services/lecturerManage-service',
        '@systemUrl@/js/modules/roleManage/services/roleManage-service',
        'directives/upload-image-directive',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/lecturerManage/directives/focus-me-directive',
        'directives/upload-files-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, lecturerManageCtrl, lecturerManageEdit, lecturerManageAdd,
              lecturerManageView, lecturerManageService, roleManageService, uploadImage, validate, focusMe) {
        'use strict';
        return angular.module('app.lecturerManage',
            ['kendo.ui.constants', 'kendo.ui.commons', 'hb.webuploader'])
            .controller('app.lecturerManage.lecturerManageCtrl', lecturerManageCtrl)
            .controller('app.lecturerManage.lecturerManageEditCtrl', lecturerManageEdit)
            .controller('app.lecturerManage.lecturerManageAddCtrl', lecturerManageAdd)
            .controller('app.lecturerManage.lecturerManageViewCtrl', lecturerManageView)
            .directive('uploadImage', uploadImage)
            .directive('ajaxValidate', validate)
            .directive('focusMe', focusMe)
            .factory('lecturerManageService', lecturerManageService)
            .factory('roleManageService', roleManageService);
    });
