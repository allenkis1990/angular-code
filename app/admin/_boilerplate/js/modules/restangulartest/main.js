/** * Created by admin on 2015/5/11.*/
define([
        'angular',
        '@systemUrl@/js/modules/restangulartest/controllers/restangulartest-ctrl',
        '@systemUrl@/js/services/kendoui-window',
        'restangular'
    ],

    function (angular, ctrl, UIWindow) {
        'use strict';
        return angular.module('app.restangulartest', ['restangular'])

            .controller('app.restangulartest.restangulartestCtrl', ctrl)


            .factory('UIWindow', UIWindow);
    });
