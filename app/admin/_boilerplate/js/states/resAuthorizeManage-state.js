/**
 * Created by linj on 2018/6/4 18:58.
 */
define(['@systemUrl@/js/modules/resAuthorizeManage/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.resAuthorizeManage', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.resAuthorizeManage', {
                url: '/resAuthorizeManage',
                sticky: true,
                views: {
                    'states.resAuthorizeManage@': {
                        templateUrl: '@systemUrl@/views/resAuthorizeManage/index.html',
                        controller: 'app.admin.states.resAuthorizeManage.indexCtrl'
                    }
                }
            }).state('states.resAuthorizeManage.detail',{
                url: '/resAuthorizeBagDetail/:id',
                views:{
                    'resAuthorizeManageItem':{
                        templateUrl: '@systemUrl@/views/resAuthorizeManage/detail/index.html',
                        controller: 'app.admin.states.resAuthorizeBagDetail.indexCtrl'
                    }
                }
            }).state('states.resAuthorizeManage.edit',{
                url: '/resAuthorizeBagEdit/:id',
                views:{
                    'resAuthorizeManageItem':{
                        templateUrl: '@systemUrl@/views/resAuthorizeManage/edit/index.html',
                        controller: 'app.admin.states.resAuthorizeBagEdit.indexCtrl'
                    }
                }
            }).state("states.resAuthorizeManage.authorize",{
                url:'/resAuthorizeBagAuthorize/:selectSchemeArray',
                views:{
                    'resAuthorizeManageItem':{
                        templateUrl : '@systemUrl@/views/resAuthorizeManage/authorize/index.html',
                        controller: 'app.admin.states.resAuthorizeBagAuthorize.indexCtrl'
                        }
                    }
                })
        }]);
});