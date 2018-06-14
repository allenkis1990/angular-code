define(['@systemUrl@/js/modules/trainingCertificate/controllers/trainingCertificate-ctrl',
        '@systemUrl@/js/modules/trainingCertificate/services/trainingCertificate-service'],
    function (controllers, trainingCertificateService) {
        'use strict';
        angular.module('app.center.states.trainingCertificate.main', [])
            .controller('app.center.states.trainingCertificate.indexCtrl', controllers.indexCtrl)
            .factory('trainingCertificateService', trainingCertificateService);
    });