define(['@systemUrl@/js/modules/myCourse/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.myCourse', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.myCourse', {
            url: '/myCourse',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myCourse/index.html',
                    controller: 'app.center.states.myCourse.indexCtrl'
                }
            }
        });
    }]);
});