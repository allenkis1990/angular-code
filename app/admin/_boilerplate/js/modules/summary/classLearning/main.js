define(['@systemUrl@/js/modules/summary/classLearning/controllers/classLearning-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classLearning.main', ['class.common'])

        .controller('app.admin.states.classLearning.indexCtrl', controllers.indexCtrl);

});