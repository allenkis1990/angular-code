///

define(['@systemUrl@/js/modules/summary/classEstablishSubProject/controllers/classEstablishSubProject-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classEstablishSubProject.main', ['class.common'])

        .controller('app.admin.states.classEstablishSubProject.indexCtrl', controllers.indexCtrl);
});