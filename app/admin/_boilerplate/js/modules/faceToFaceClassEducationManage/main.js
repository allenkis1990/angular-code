define ( ['@systemUrl@/js/modules/faceToFaceClassEducationManage/controllers/faceToFaceClassEducationManage-ctrl',
    '@systemUrl@/js/modules/faceToFaceClassEducationManage/services/faceToFaceClassEducationManage-services',
    '@systemUrl@/js/services/kendoui-commons'
    ],
    function ( controllers, faceToFaceClassEducationManageServices ) {
        'use strict';
        angular.module ( 'app.admin.states.faceToFaceClassEducationManage.main', ['kendo.ui.commons'] )
        .controller ( 'app.admin.states.faceToFaceClassEducationManage.indexCtrl', controllers.indexCtrl )
        .factory ( 'faceToFaceClassEducationManageServices', faceToFaceClassEducationManageServices )

        .run ( ['$rootScope', '$http', 'hbBasicData', function ( $rootScope, $http, hbBasicData ) {
            hbBasicData.setResource ();
        }] )
} );
