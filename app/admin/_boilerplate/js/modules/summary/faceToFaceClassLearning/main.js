define(['@systemUrl@/js/modules/summary/faceToFaceClassLearning/controllers/faceToFaceClassLearning-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.faceToFaceClassLearning.main', ['class.common'])

        .controller('app.admin.states.faceToFaceClassLearning.indexCtrl', controllers.indexCtrl);

});