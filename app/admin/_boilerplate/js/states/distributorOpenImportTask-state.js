define(['@systemUrl@/js/modules/distributorOpenImportTask/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.distributorOpenImportTask', 'HB_WebUploaderProvider', []).config(['$stateProvider', function ($stateProvider, HB_WebUploaderProvider) {
        $stateProvider.state('states.distributorOpenImportTask', {
            url: '/distributorOpenImportTask',
            resolve: {
                setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
            },
            sticky: true,
            views: {
                'states.distributorOpenImportTask@': {
                    templateUrl: '@systemUrl@/views/distributorOpenImportTask/index.html',
                    controller: 'app.admin.states.distributorOpenImportTask.indexCtrl'
                }
            }
        });
    }]);
});