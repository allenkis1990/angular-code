define (
    [
        'angular',
        '@systemUrl@/js/modules/superContentInfo/controllers/superContentInfo-ctrl',
        '@systemUrl@/js/modules/superContentInfo/controllers/add-ctrl',
        '@systemUrl@/js/modules/superContentInfo/controllers/edit-ctrl',
        '@systemUrl@/js/modules/superContentInfo/controllers/view-ctrl',
        '@systemUrl@/js/modules/superContentInfo/controllers/publish-ctrl',
        '@systemUrl@/js/modules/superContentInfo/services/superContentInfo-service',
        '@systemUrl@/js/modules/superCategoryInfo/services/superCategoryInfo-service',
        'directives/upload-image-directive',
        'common/hbWebUploader',
        'restangular'
    ], function ( angular, superContentInfoCtrl, addCtrl, editCtrl, viewCtrl, publishCtrl, superContentInfoService, superCategoryInfoService ) {
        'use strict';
        return angular.module ( 'app.superContentInfo', [] )
            .controller ( 'app.superContentInfo.superContentInfoCtrl', superContentInfoCtrl )
            .controller ( 'app.superContentInfo.addCtrl', addCtrl )
            .controller ( 'app.superContentInfo.editCtrl', editCtrl )
            .controller ( 'app.superContentInfo.viewCtrl', viewCtrl )
            .controller ( 'app.superContentInfo.publishCtrl', publishCtrl )
            .factory ( 'superContentInfoService', superContentInfoService )
            .factory ( 'superCategoryInfoService', superCategoryInfoService )
            .run ( ['$rootScope', '$http', 'hbBasicData', function ( $rootScope, $http, hbBasicData ) {
                hbBasicData.setResource ();
            }] )
    } );