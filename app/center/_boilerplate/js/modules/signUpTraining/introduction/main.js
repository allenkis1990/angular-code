define([
    'angular',
    '@systemUrl@/js/modules/signUpTraining/introduction/controllers/introduction-ctrl',
    '@systemUrl@/js/modules/signUpTraining/introduction/services/introduction-service',
    'restangular'
], function (angular, introductionCtrl, introductionService) {
    'use strict';
    return angular.module('app.introduction', [])


        .controller('app.introduction.introductionCtrl', introductionCtrl)

        .factory('introductionService', introductionService);
});
