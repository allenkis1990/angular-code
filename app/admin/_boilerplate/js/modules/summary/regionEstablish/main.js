define(['@systemUrl@/js/modules/summary/regionEstablish/controllers/regionEstablish-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.regionEstablish.main', ['class.common'])
        .controller('app.admin.states.regionEstablish.indexCtrl', controllers.indexCtrl);
});