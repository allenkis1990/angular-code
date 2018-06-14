define([
    '@systemUrl@/js/modules/home/controllers/index-ctrl',
    '@systemUrl@/js/modules/home/directives/index-directives',
    '@systemUrl@/js/modules/home/services/index-services'
], function (controller, directive, service) {
    'use strict'
    angular.module('app.portal.states.index', [])
        .controller('app.index.loginCtrl', controller.login)
        .factory('adminLoginService', service)
        .directive('initCas', directive.initCas)
        .directive('ajaxValidate', directive.ajaxValidate)
})