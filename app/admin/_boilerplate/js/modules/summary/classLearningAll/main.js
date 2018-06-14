define(['@systemUrl@/js/modules/summary/classLearningAll/controllers/classLearningAll-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classLearningAll.main', ['class.common'])

        .controller('app.admin.states.classLearningAll.indexCtrl', controllers.indexCtrl);

});