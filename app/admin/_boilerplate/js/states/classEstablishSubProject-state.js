/**
 * Created by hk on 2018/5/29.
 * 班级开通统计子项目级
 */
define(['@systemUrl@/js/modules/summary/classEstablishSubProject/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classEstablishSubProject', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.classEstablishSubProject', {
            url: '/classEstablishSubProject',
            sticky: true,
            views: {
                'states.classEstablishSubProject@': {
                    templateUrl: '@systemUrl@/views/summary/classEstablishSubProject/index.html',
                    controller: 'app.admin.states.classEstablishSubProject.indexCtrl'
                }
            }
        });
    }]);
});
