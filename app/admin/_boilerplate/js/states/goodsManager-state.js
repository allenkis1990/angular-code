define(['@systemUrl@/js/modules/goodsManager/main',
    '@systemUrl@/js/modules/goodsManager/goodsEdit/main',
    '@systemUrl@/js/modules/goodsManager/goodsDetail/main',
    '@systemUrl@/js/modules/goodsManager/goodsAuthorized/main',
    '@systemUrl@/js/modules/goodsManager/authorizedView/main'
], function (controllers) {
    'use strict';
    angular.module('app.states.goodsManager', []).config(['$stateProvider', 'HB_WebUploaderProvider',
        function ($stateProvider, HB_WebUploaderProvider) {
            $stateProvider.state('states.goodsManager', {
                url: '/goodsManager',
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUserInfo')
                },
                sticky: true,
                views: {
                    'states.goodsManager@': {
                        templateUrl: '@systemUrl@/views/goodsManager/index.html',
                        controller: 'app.admin.states.goodsManager.indexCtrl'
                    }
                }
            }).state('states.goodsManager.goodsEdit', {
                url: '/goodsEdit/:id/:schemeId',//schemeId:item.schemeId
                //sticky: true,
                views: {
                    'goodsManagerItem': {
                        templateUrl: '@systemUrl@/views/goodsManager/goodsEdit/index.html',
                        controller: 'app.admin.states.goodsEdit.indexCtrl'
                    }
                }
            }).state('states.goodsManager.goodsDetail', {
                url: '/goodsDetail/:id/:schemeId',
                //sticky: true,
                views: {
                    'goodsManagerItem': {
                        templateUrl: '@systemUrl@/views/goodsManager/goodsDetail/index.html',
                        controller: 'app.admin.states.goodsDetail.indexCtrl'
                    }
                }
            }).state('states.goodsManager.goodsAuthorized', {
                url: '/goodsAuthorized/:id/:schemeId',
                //sticky: true,
                views: {
                    'goodsManagerItem': {
                        templateUrl: '@systemUrl@/views/goodsManager/goodsAuthorized/index.html',
                        controller: 'app.admin.states.goodsAuthorized.indexCtrl'
                    }
                }
            }).state('states.goodsManager.authorizedView', {
                url: '/authorizedView/:id/:schemeId',
                //sticky: true,
                views: {
                    'goodsManagerItem': {
                        templateUrl: '@systemUrl@/views/goodsManager/authorizedView/index.html',
                        controller: 'app.admin.states.authorizedView.indexCtrl'
                    }
                }
            });
        }]);
});