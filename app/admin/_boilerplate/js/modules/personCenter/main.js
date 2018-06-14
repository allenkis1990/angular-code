define([
    'angular',
    '@systemUrl@/js/const/global-constants',
    '@systemUrl@/js/modules/personCenter/controllers/personCenter-ctrl',
    '@systemUrl@/js/modules/personCenter/services/personCenter-service',
    'prometheus/directives/compare'
], function (angular, global, personCenterCtrl, personCenterService, compareToDirective) {
    'use strict';
    return angular.module('app.personCenter', [])
        .constant('global', global)
        .directive('hbCompare', compareToDirective)//引入匹配校验指令
        .controller('app.personCenter.personCenterCtrl', personCenterCtrl)
        .factory('personCenterService', personCenterService);
});
