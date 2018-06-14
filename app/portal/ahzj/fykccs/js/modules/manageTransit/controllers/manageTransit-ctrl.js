define(function () {
    'use strict';
    return ['$scope', 'manageTransitService', '$state', '$timeout', '$stateParams', '$dialog', function ($scope, manageTransitService, $state, $timeout, $stateParams, $dialog) {
        $scope.model = {};
        $dialog.confirm({
            title: '提示',
            width: 250,
            content: '正在登录中，请耐心等待！'
        });
        $scope.events = {
            getIslogin: function () {
                manageTransitService.isLogin().then(function (data) {
                    $scope.model.sureUseLogin = data.info;
                    $scope.model.loginError = 0;
                    if (data.info === true) {
                        manageTransitService.getUserInfo().then(function (data) {
                            $scope.model.useInformation = data.info;
                            //signUpTraining
                            if ($stateParams.type === 'signUpTraining') {
                                window.open('/center/#/signUpTraining', '_self');
                            } else if ($stateParams.type === 'myRealClass') {
                                window.open('/center/#/myRealClass/' + $stateParams.id, '_self');
                            } else {
                                window.open('/portal/#/accountant', '_self');
                            }
                        });
                    }
                });
            },
            getErrorTwo: function () {
                $timeout(function () {
                    //console.log('222222222222');
                });
            },
            getErrorOne: function () {
                $timeout(function () {
                    //console.log('111111111111');
                });
            }
        };
    }];
});