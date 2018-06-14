define(['@systemUrl@/js/modules/summary/regionLearning/controllers/regionLearning-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.regionLearning.main', ['class.common'])
        .controller('app.admin.states.regionLearning.indexCtrl', controllers.indexCtrl);
});