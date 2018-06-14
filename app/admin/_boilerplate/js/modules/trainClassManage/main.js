define(['angular',
        '@systemUrl@/js/modules/trainClassManage/controllers/trainClassManage-ctrl',
        '@systemUrl@/js/modules/trainClassManage/controllers/trainClassManagerEdit-ctrl',
        '@systemUrl@/js/modules/trainClassManage/controllers/trainClassManagerAdd-ctrl',
        '@systemUrl@/js/modules/trainClassManage/controllers/trainClassManagerView-ctrl',
        '@systemUrl@/js/modules/trainClassManage/controllers/trainClassManageSelectObject-ctrl',
        '@systemUrl@/js/modules/trainClassManage/controllers/trainClassManageManage-ctrl',
        '@systemUrl@/js/modules/trainClassManage/services/train-service',
        'directives/upload-image-directive',
        'directives/remote-validate-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, trainClassManageCtrl, trainClassManageEditCtrl, trainClassManageAddCtrl,
              trainClassManageViewCtrl, trainClassManageSelectObjectCtrl, trainClassManagerManageCtrl, trainClassManageService, uploadImage, validate) {
        'use strict';
        return angular.module('app.trainClassManage', ['kendo.ui.constants', 'kendo.ui.commons'])
            .controller('app.trainClassManage.trainClassManagerCtrl', trainClassManageCtrl)
            .controller('app.trainClassManage.trainClassManagerAddCtrl', trainClassManageAddCtrl)
            .controller('app.trainClassManage.trainClassManagerEditCtrl', trainClassManageEditCtrl)
            .controller('app.trainClassManage.trainClassManagerViewCtrl', trainClassManageViewCtrl)
            .controller('app.trainClassManage.trainClassManageManageCtrl', trainClassManagerManageCtrl)
            .controller('app.trainClassManage.trainClassManageSelectObjectCtrl', trainClassManageSelectObjectCtrl)
            .directive('uploadImage', uploadImage)
            .directive('ajaxValidate', validate)
            .factory('trainClassManageService', trainClassManageService);
    });
