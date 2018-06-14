define ( ['@systemUrl@/js/modules/faceToFaceClassEducationManage/main',
    '@systemUrl@/js/modules/faceToFaceClassEducationManage/faceToFaceClassEducationDetail/main'], function () {
    'use strict';
    angular.module ( 'app.admin.states.faceToFaceClassEducationManage', [] ).config ( ['$stateProvider', 'HB_WebUploaderProvider', function ( $stateProvider, HB_WebUploaderProvider) {
        $stateProvider.state ( 'states.faceToFaceClassEducationManage', {
            url   : '/faceToFaceClassEducationManage',
            sticky: true,
            resolve: {
                setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUserInfo')
            },
            views : {
                'states.faceToFaceClassEducationManage@': {
                    templateUrl: '@systemUrl@/views/faceToFaceClassEducationManage/index.html',
                    controller : 'app.admin.states.faceToFaceClassEducationManage.indexCtrl'
                }
            }
        }).state('states.faceToFaceClassEducationManage.faceToFaceClassEducationDetail', {
                url: '/faceToFaceClassEducationDetail/:schemeId',
                views: {
                    'faceToFaceClassEducationManageItem': {
                        templateUrl: '@systemUrl@/views/faceToFaceClassEducationManage/faceToFaceClassEducationDetail/index.html',
                        controller: 'app.admin.states.faceToFaceClassEducationDetail.indexCtrl'
                    }
                }
        })
    }] )
} )