define(['@systemUrl@/js/modules/invoiceManage/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.invoiceManage', ['ui.router'])
        .config(['$stateProvider', 'HB_WebUploaderProvider', function ($stateProvider, HB_WebUploaderProvider) {
            $stateProvider.state('states.invoiceManage', {
                url: '/invoiceManage',
                sticky: true,
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                },
                views: {
                    'states.invoiceManage@': {
                        templateUrl: '@systemUrl@/views/invoiceManage/index.html',
                        controller: 'app.admin.states.invoiceManage.indexCtrl'
                    }
                }
            });
        }]);
});