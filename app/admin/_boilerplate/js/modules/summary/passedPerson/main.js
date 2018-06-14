define(['@systemUrl@/js/modules/summary/passedPerson/controllers/passedPerson-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.passedPerson.main', ['class.common'])

        .controller('app.admin.states.passedPerson.indexCtrl', controllers.indexCtrl);
});