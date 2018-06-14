/**
 * Created by wengpengfei on 2016/8/17.
 */
define(function (mod) {
    'use strict';
    return ['$scope', 'homeService', '$state', '$dialog', function ($scope, homeService, $state, $dialog) {
        $scope.events = {
            goLeaveMessage: function (e) {
                e.preventDefault();
                homeService.isLogin().then(function (data) {
                    if (data.info) {
                        $state.go('states.accountant.leaveMessage');
                    } else {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请先登录再进行此操作！'
                        });
                    }
                });
            },
            connectUs: function (e) {
                e.preventDefault();
                $dialog.contentDialog({
                    title: '联系我们',
                    visible: true,
                    modal: true,
                    contentUrl: 'ahzj/fykccs/views/home/contentAs.html'
                }, $scope);
            }
        };
    }];
});
