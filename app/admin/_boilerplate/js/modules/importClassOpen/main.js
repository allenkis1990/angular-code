define(['angular',
        '@systemUrl@/js/modules/importClassOpen/controllers/index-ctrl',
        '@systemUrl@/js/modules/importClassOpen/services/importClassOpen-service',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons',
        'common/hbWebUploader'
    ],
    function (angular, indexController, importClassOpen) {
        'use strict';
        return angular.module('app.importClassOpen', ['hb.webUploader'])
            .controller('app.importClassOpen.index', indexController)
            .factory('service', importClassOpen);
    });
