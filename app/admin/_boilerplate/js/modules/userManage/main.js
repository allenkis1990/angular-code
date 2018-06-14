define(['angular',
        '@systemUrl@/js/modules/userManage/controllers/userManage-ctrl',
        '@systemUrl@/js/modules/userManage/controllers/userManageView-ctrl',
        '@systemUrl@/js/modules/userManage/services/userManage-service',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, userManageCtrl, userManageView, userManageService) {
        'use strict';
        return angular.module('app.userManage', [])
            .controller('app.userManage.userManageCtrl', userManageCtrl)
            .controller('app.userManage.userManageViewCtrl', userManageView)
            .factory('userManageService', userManageService);

    });
