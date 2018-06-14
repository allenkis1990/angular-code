define(function (mod) {
    return {
        login: ['$scope', '$timeout', 'adminLoginService',
            function ($scope, $timeout, adminLoginService) {
                $scope.model = {
                    validateCode: '/web/login/validateCode/getValidateCode?type=1&' + (+new Date()),
                    sureCode: '/web/login/validateCode/validation/1/'
                }

                var cookieUser = adminLoginService.getUserCookie('adminUserInfo')

                cookieUser = cookieUser && angular.fromJson(cookieUser)

                if (cookieUser) {
                    $scope.model.userName = cookieUser.userName
                    $scope.model.password = cookieUser.password
                }
                $scope.logged = false
                $scope.model.rememberUse = adminLoginService.setRemember($scope.model.userName, $scope.model.password)

                $scope.events = {
                    changeCode: function () {
                        $scope.model.validateCode = '/web/login/validateCode/getValidateCode?type=1&' + Date.now()
                    },
                    getIslogin: function () {
                        homeService.isLogin().then(function (data) {
                            $scope.model.sureUseLogin = data.info
                            if (data.info === true) {
                                homeService.getUserInfo().then(function (data) {
                                    $scope.model.useInformation = data.info
                                })
                            }
                        })
                    },
                    getErrorTwo: function () {
                        $timeout(function () {
                            $scope.model.loginError = 'two'
                            $scope.Ing = false
                        })
                    },
                    getErrorOne: function () {
                        $timeout(function () {
                            $scope.model.loginError = 'one'
                            $scope.Ing = false
                        })
                    },
                    submitUse: function ($event, form, code) {
                        if (!$scope.model.userName || !$scope.model.password) {
                            $scope.pleaseInputLoginInfo = true
                        } else {
                            $scope.pleaseInputLoginInfo = false
                        }
                        code && code.$promise
                            .then(function (data) {
                                if (data) {
                                    if (!form.$valid) {
                                        return false
                                    }

                                    var loginParam = {
                                        'accountType': 2,
                                        'username': $scope.model.userName,
                                        'password': $scope.model.password
                                    }

                                    !$scope.Ing && ssoLogin.login(loginParam, angular.toJson({
                                        portalType: 'mall',
                                        targetUrl: $scope.model.currentDomain + '/admin' + ( require.unitPath ? '/' + require.unitPath : '')
                                    }))
                                        .then(function (data) {
                                            if (data.code === 603 && !$scope.logged) {
                                                $scope.logged = true
                                                if ($scope.model.rememberUse) {
                                                    adminLoginService.rememberPassword($scope.model.userName, $scope.model.password)
                                                } else {
                                                    adminLoginService.removeFromCookie()
                                                }
                                            } else {
                                                $scope.Ing = false
                                            }
                                        }, function (data) {
                                            $scope.Ing = false
                                        })
                                    $scope.Ing = true
                                }
                            })

                    },
                    MainPageQueryList: function (e, status) {
                        if (!status) {
                            $scope.events.submitUse()
                        }
                    }
                }
            }]
    }
})