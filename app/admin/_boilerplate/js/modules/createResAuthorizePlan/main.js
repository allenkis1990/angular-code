/**
 * Created by linj on 2018/6/4 19:09.
 */
define([
        '@systemUrl@/js/modules/createResAuthorizePlan/controllers/createResAuthorizePlan-ctrl',
        '@systemUrl@/js/modules/createResAuthorizePlan/directives/directives',
        '@systemUrl@/js/modules/createResAuthorizePlan/services/createResAuthorizePlan-service',
        'directives/remote-validate-directive',
    ],
    function (controllers,directives,services,validate) {
        'use strict';
        angular.module('app.admin.states.createResAuthorizePlan.main', [])
            .controller('app.admin.states.createResAuthorizePlan.indexCtrl', controllers)
            .factory('createResAuthorizePlanService',services)
            .directive('chooseResCreate',directives.chooseResDialog)
            .directive('ajaxValidate',validate)
        ;
    });