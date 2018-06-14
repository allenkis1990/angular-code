define(['angular',
        '@systemUrl@/js/modules/administratorManage/controllers/administratorManage-ctrl',
        '@systemUrl@/js/modules/administratorManage/controllers/administratorManageEdit-ctrl',
        '@systemUrl@/js/modules/administratorManage/controllers/administratorManageAdd-ctrl',
        '@systemUrl@/js/modules/administratorManage/controllers/administratorManageView-ctrl',
        '@systemUrl@/js/modules/administratorManage/services/administratorManage-service',
        '@systemUrl@/js/modules/roleManage/services/roleManage-service',
        'directives/upload-image-directive',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/administratorManage/directives/focus-me-directive',
        'directives/upload-files-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, administratorManageCtrl, administratorManageEdit, administratorManageAdd,
              administratorManageView, administratorManageService, roleManageService, uploadImage, validate, focusMe) {
        'use strict';
        return angular.module('app.administratorManage',
            ['kendo.ui.constants', 'kendo.ui.commons', 'hb.webuploader'])
            .controller('app.administratorManage.administratorManageCtrl', administratorManageCtrl)
            .controller('app.administratorManage.administratorManageEditCtrl', administratorManageEdit)
            .controller('app.administratorManage.administratorManageAddCtrl', administratorManageAdd)
            .controller('app.administratorManage.administratorManageViewCtrl', administratorManageView)
            .directive('uploadImage', uploadImage)
            .directive('ajaxValidate', validate)
            .directive('focusMe', focusMe)
            .factory('administratorManageService', administratorManageService)
            .factory('roleManageService', roleManageService);
    });
