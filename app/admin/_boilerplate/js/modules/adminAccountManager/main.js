define([
        'angular',
        '@systemUrl@/js/const/global-constants',
        'directives/remote-validate-directive',
        'directives/compare-to-directive',
        '@systemUrl@/js/modules/adminAccountManager/controllers/adminAccountManager-ctrl',
        '@systemUrl@/js/modules/adminAccountManager/services/adminAccountManager-service', 'restangular',
        '@systemUrl@/js/services/kendoui-commons',
        '@systemUrl@/js/services/kendoui-constants'
    ],
    function (angular, global, validateDirective, compareToDirective, adminAccountManagerCtrl, adminAccountManagerService) {
        'use strict';
        return angular.module('app.adminAccountManager', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
            .constant('global', global)
            .directive('ajaxValidate', validateDirective)
            .directive('compare', compareToDirective)//引入匹配校验指令
            .controller('app.adminAccountManager.adminAccountManagerCtrl', adminAccountManagerCtrl)
            .factory('adminAccountManagerService', adminAccountManagerService);
        /*.config(['$routeProvider', function($routeProvider){
          $routeProvider.when('/',{
            templateUrl: '@systemUrl@/views/newAdminAccount.html',
            controller: 'app.adminAccountManager.adminAccountManagerCtrl'
          })
            .ohterwise({
              redirectTo: '/'
            });
        }]);*/
    });
