define(['@systemUrl@/js/modules/releaseGoods/main'], function (controllers) {
    'use strict';
    angular.module('app.states.releaseGoods', [])
        .config(['$stateProvider', 'HB_WebUploaderProvider', function ($stateProvider, HB_WebUploaderProvider) {
            $stateProvider.state('states.releaseGoods', {
                url: '/releaseGoods/:mode/:goodsId/:schemeId',
                sticky: true,
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUserInfo')
                },
                views: {
                    'states.releaseGoods@': {
                        templateUrl: '@systemUrl@/views/releaseGoods/index.html',
                        controller: 'app.admin.states.releaseGoods.indexCtrl'
                    }
                }
            });
        }]);
});