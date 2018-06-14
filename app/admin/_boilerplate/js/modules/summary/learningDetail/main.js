define(['@systemUrl@/js/modules/summary/learningDetail/controllers/learningDetail-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.learningDetail.main', ['class.common'])
        .controller('app.admin.states.learningDetail.indexCtrl', controllers.indexCtrl);


});