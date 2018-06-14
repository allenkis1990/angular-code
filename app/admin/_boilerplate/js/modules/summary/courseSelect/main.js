define(['@systemUrl@/js/modules/summary/courseSelect/controllers/courseSelect-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.courseSelect.main', ['class.common'])
        .controller('app.admin.states.courseSelect.indexCtrl', controllers.indexCtrl);
});