define(['angular',
    '@systemUrl@/js/modules/validator/controllers/validator-ctrl',
    '@systemUrl@/js/modules/validator/services/validator-service',
    'directives/compare-to-directive',
    'directives/remote-validate-directive',
    'directives/clearOperator-directive',
    'restangular'
], function (angular, validatorCtrl, validatorService, compareDirective, remoteValidateDirective, clearOperator) {
    'use strict';
    return angular.module('app.validator', ['restangular']).controller('app.validator.validatorCtrl', validatorCtrl)

        .directive('compare', compareDirective)

        .directive('ajaxValidate', remoteValidateDirective)

        .factory('validatorService', validatorService)

        .directive('clearOperator', clearOperator);


});
