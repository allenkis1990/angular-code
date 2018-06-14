/**
 * Created by linj on 2018/6/4 19:09.
 */
define([
        '@systemUrl@/js/modules/resAuthorizedUnitInfo/controllers/resAuthorizeUnitInfo-ctrl',
        '@systemUrl@/js/modules/resAuthorizedUnitInfo/controllers/resAuthorizeUnitInfo-view-ctrl',
        '@systemUrl@/js/modules/resAuthorizedUnitInfo/controllers/resAuthorizeUnitInfo-update-ctrl',
        '@systemUrl@/js/modules/resAuthorizedUnitInfo/services/resAuthorizeUnitInfo-service',
        '@systemUrl@/js/modules/resAuthorizedUnitInfo/utils/resAuthorizeUtil',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'],
    function(controller,viewController,updateController,resAuthorizeUnitInfoService,resAuthorizeUtil){
    'use strict';
    angular.module('app.admin.states.resAuthorizedUnitInfo.main',['kendo.ui.constants', 'kendo.ui.commons'])
        .controller('app.admin.states.resAuthorizedUnitInfo.indexCtrl',controller)
        .controller('app.admin.states.resAuthorizedUnitInfo.viewCtrl',viewController)
        .controller('app.admin.states.resAuthorizedUnitInfo.updateCtrl',updateController)
        .factory('resAuthorizeUnitInfoService',resAuthorizeUnitInfoService)
        .factory('resAuthorizeUtil',resAuthorizeUtil);
});