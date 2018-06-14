define(['angular',
        '@systemUrl@/js/modules/importDistributorOpen/controllers/index-ctrl',
        '@systemUrl@/js/modules/importDistributorOpen/services/importDistributorOpen-service',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons',
        'common/hbWebUploader'
    ],
    function (angular, indexController, importDistributorOpen) {
        'use strict';
        return angular.module('app.importDistributorOpen', ['hb.webUploader'])
            .controller('app.importDistributorOpen.index', indexController)
            .factory('service', importDistributorOpen);
    });
