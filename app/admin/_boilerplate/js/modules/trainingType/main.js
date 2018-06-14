/**
 * Created by WDL on 2015/9/23.
 */
define(['angular',
    '@systemUrl@/js/const/global-constants',
    'directives/remote-validate-directive',
    '@systemUrl@/js/modules/trainingType/controllers/trainingType-ctrl',
    '@systemUrl@/js/modules/trainingType/services/trainingType-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, global, validateDirective, trainingTypeCtrl, trainingTypeService) {
    'use strict';
    return angular.module('app.trainingType', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
        .constant('global', global)
        .directive('ajaxValidate', validateDirective)
        .controller('app.trainingType.trainingTypeCtrl', trainingTypeCtrl)
        .factory('trainingTypeService', trainingTypeService);
});
