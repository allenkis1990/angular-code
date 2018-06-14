///

define(['@systemUrl@/js/modules/summary/classEstablish/controllers/classEstablish-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classEstablish.main', ['class.common'])

        .controller('app.admin.states.classEstablish.indexCtrl', controllers.indexCtrl);
});