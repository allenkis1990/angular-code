define(['@systemUrl@/js/modules/batchManage/controllers/batchManage-ctrl',
        '@systemUrl@/js/modules/batchManage/services/batchManage-services',
        '../../directives/copy-man',
        '@systemUrl@/js/services/kendoui-commons',
            'common/hbWebUploader'],
    function (controllers,batchManageServices,copyMan) {
        'use strict';
        angular.module('app.admin.states.batchManage.main', ['kendo.ui.commons'])
            .directive('copyManFour', copyMan)
            .controller('app.admin.states.batchManage.indexCtrl', controllers.indexCtrl)
            .factory('batchManageServices',batchManageServices)
    });
