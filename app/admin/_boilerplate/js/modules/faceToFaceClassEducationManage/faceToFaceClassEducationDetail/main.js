define(['@systemUrl@/js/modules/faceToFaceClassEducationManage/faceToFaceClassEducationDetail/controllers/faceToFaceClassEducationDetail-ctrl',
    'common/hbWebUploader'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.faceToFaceClassEducationDetail.main', ['hb.webUploader'])

        .controller('app.admin.states.faceToFaceClassEducationDetail.indexCtrl', controllers.indexCtrl);
});