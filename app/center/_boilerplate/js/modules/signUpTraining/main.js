define([
    'angular',
    '@systemUrl@/js/modules/signUpTraining/controllers/signUpTraining-ctrl',
    '@systemUrl@/js/modules/signUpTraining/services/signUpTraining-service',
    'restangular'
], function (angular, signUpTrainingCtrl, signUpTrainingService) {
    'use strict';
    return angular.module('app.signUpTraining', [])


        .controller('app.signUpTraining.signUpTrainingCtrl', signUpTrainingCtrl)

        .factory('signUpTrainingService', signUpTrainingService);
});
