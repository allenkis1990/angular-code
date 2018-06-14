define (
    [
        'angular',
        '@systemUrl@/js/modules/infoContent/controllers/infoContent-ctrl',
        '@systemUrl@/js/modules/infoContent/controllers/add-ctrl',
        '@systemUrl@/js/modules/infoContent/controllers/edit-ctrl',
        '@systemUrl@/js/modules/infoContent/controllers/view-ctrl',
        '@systemUrl@/js/modules/infoContent/controllers/publish-ctrl',
        '@systemUrl@/js/modules/infoContent/services/infoContent-service',
        '@systemUrl@/js/modules/infoCategory/services/infoCategory-service',
        'directives/upload-image-directive',
        'common/hbWebUploader',
        'restangular'
    ], function ( angular, infoContentCtrl, addCtrl, editCtrl, viewCtrl, publishCtrl, infoContentService, infoCategoryService ) {
        'use strict';
        return angular.module ( 'app.infoContent', [] )
            .controller ( 'app.infoContent.infoContentCtrl', infoContentCtrl )
            .controller ( 'app.infoContent.addCtrl', addCtrl )
            .controller ( 'app.infoContent.editCtrl', editCtrl )
            .controller ( 'app.infoContent.viewCtrl', viewCtrl )
            .controller ( 'app.infoContent.publishCtrl', publishCtrl )
            .factory ( 'infoContentService', infoContentService )
            .factory ( 'infoCategoryService', infoCategoryService )
            .run ( ['$rootScope', '$http', 'hbBasicData', function ( $rootScope, $http, hbBasicData ) {
                hbBasicData.setResource ();
            }] )
    } );