define(['angular',
        '@systemUrl@/js/modules/roleManage/controllers/roleManage-ctrl',
        '@systemUrl@/js/modules/roleManage/controllers/roleManageEdit-ctrl',
        '@systemUrl@/js/modules/roleManage/controllers/roleManageAdd-ctrl',
        '@systemUrl@/js/modules/roleManage/controllers/roleManageView-ctrl',
        '@systemUrl@/js/modules/roleManage/services/roleManage-service',
        'directives/upload-image-directive',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/roleManage/directives/focus-me-directive',
        '@systemUrl@/js/modules/roleManage/directives/slide-directive',
        'directives/upload-files-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, roleManageCtrl, roleManageEdit, roleManageAdd,
              roleManageView, roleManageService, uploadImage, validate, focusMe, slideDirective) {
        'use strict';
        return angular.module('app.roleManage',
            ['kendo.ui.constants', 'kendo.ui.commons', 'hb.webuploader'])
            .controller('app.roleManage.roleManageCtrl', roleManageCtrl)
            .controller('app.roleManage.roleManageEditCtrl', roleManageEdit)
            .controller('app.roleManage.roleManageAddCtrl', roleManageAdd)
            .controller('app.roleManage.roleManageViewCtrl', roleManageView)
            .directive('uploadImage', uploadImage)
            .directive('ajaxValidate', validate)
            .directive('focusMe', focusMe)

            .directive('lwhslide', slideDirective)
            .factory('roleManageService', roleManageService);
    });
