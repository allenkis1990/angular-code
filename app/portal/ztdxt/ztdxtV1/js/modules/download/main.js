define(['kccs/kccsv2/js/modules/download/controllers/download-ctrl',
    'kccs/kccsv2/js/modules/download/services/download-service'], function (downloadCtrl, downloadService) {
    'use strict';
    angular.module('app.portal.states.download.main', [])
        .controller('downloadCtrl', downloadCtrl)
        .factory('downloadService', downloadService);
});