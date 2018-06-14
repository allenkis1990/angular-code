define(['@systemUrl@/js/modules/siteOpening/controllers/siteOpening-ctrl',
    '@systemUrl@/js/modules/siteOpening/services/siteOpening-services'], function (controllers, siteOpeningServices) {
    'use strict';
    angular.module('app.admin.states.siteOpening.main', [])

        .controller('app.admin.states.siteOpening.indexCtrl', controllers.indexCtrl)

        .factory('siteOpeningServices', siteOpeningServices);
});