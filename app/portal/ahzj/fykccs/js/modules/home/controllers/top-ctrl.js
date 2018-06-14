/**
 * Created by wengpengfei on 2016/8/17.
 */
define(function (mod) {
    'use strict';
    return ['$scope', 'homeService', '$state', '$dialog', '$stateParams', '$rootScope', 'hbLoginService', function ($scope, homeService, $state, $dialog, $stateParams, $rootScope, hbLoginService) {
        $scope.model = {
            erweimaShow: false
        };
        $scope.$watch('noticeStateId', function (newVal) {
            $scope.model.noticeId = newVal;
        });
        $scope.events = {


            returnHome:function(){
                console.log(location.href);
                var origin=location.origin;
                var homeOrigin=origin.replace('fy','');

                window.open(homeOrigin);
            },


            outOfLogin: function (e) {
                e.preventDefault();
                $dialog.alert({
                    /*   title  : '提示',*/
                    visible: true,
                    modal: true,
                    width: 250,
                    okValue: '确认退出',
                    ok: function () {
                        window.open('/web/login/login/frontDoLogout.action', '_self');
                        return true;
                    },
                    cancel: function () {
                        return true;
                    },
                    content: '你确定退出学习？'
                });
            },

            openLoginDialog: function () {
                hbLoginService.createLoginForm();
            },
            goCenter: function (e) {
                e.preventDefault();
                window.open('/center/#/home', '_self');
            },
            hoverWeixin: function (bol) {
                $scope.model.erweimaShow = bol;
            }
        };

    }];
});
