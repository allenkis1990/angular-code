/**
 * Created by linj on 2018/6/4 19:09.
 */
define([
    '@systemUrl@/js/modules/resAuthorizeManage/controllers/resAuthorizeManage-ctrl',
    '@systemUrl@/js/modules/resAuthorizeManage/controllers/resAuthorizeBagDetail-ctrl',
    '@systemUrl@/js/modules/resAuthorizeManage/controllers/resAuthorizeBagEdit-ctrl',
    '@systemUrl@/js/modules/resAuthorizeManage/controllers/resAuthorizeBagAuthorize-ctrl',
    '@systemUrl@/js/modules/resAuthorizeManage/services/resAuthorizeManage-service',
        '@systemUrl@/js/modules/createResAuthorizePlan/directives/directives',
        'directives/remote-validate-directive',
    ],
    function(resAuthorizeManage,resAuthorizeBagDetail,resAuthorizeBagEdit,resAuthorizeBagAuthorize,service,directives,validate){
    'use strict';
    angular.module('app.admin.states.resAuthorizeManage.main',[])
        .controller('app.admin.states.resAuthorizeManage.indexCtrl',resAuthorizeManage)
        .controller('app.admin.states.resAuthorizeBagDetail.indexCtrl',resAuthorizeBagDetail)
        .controller('app.admin.states.resAuthorizeBagEdit.indexCtrl',resAuthorizeBagEdit)
        .controller('app.admin.states.resAuthorizeBagAuthorize.indexCtrl',resAuthorizeBagAuthorize)
        .directive('chooseResManage',directives.chooseResDialog)
        .directive('ajaxValidate',validate)
        .factory('resAuthorizeManageService',service)
    ;
});