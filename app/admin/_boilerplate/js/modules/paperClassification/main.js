define(['angular',
        '@systemUrl@/js/modules/paperClassification/controllers/paper-type-ctrl',
        '@systemUrl@/js/modules/paperClassification/services/paper-type-service',
        'directives/remote-validate-directive'
    ],
    function (angular, paperTypeCtrl, paperTypeService, validateDirective) {
        'use strict';
        return angular.module('app.paperClassification', []).controller('app.paperClassification.paperTypeCtrl', paperTypeCtrl)


            .factory('paperTypeService', paperTypeService)

            .directive('ajaxValidate', validateDirective);

    });
