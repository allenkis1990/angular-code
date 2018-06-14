define(['@systemUrl@/js/modules/summary/annualEstablish/controllers/annualEstablish-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.annualEstablish.main', ['class.common'])
        .controller('app.admin.states.annualEstablish.indexCtrl', controllers.indexCtrl);
});