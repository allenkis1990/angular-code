define(function () {

    return ['$dialog', '$timeout', '$rootScope', '$http', '$parse', 'myOrderService', function ($dialog, $timeout, $rootScope, $http, $parse, myOrderService) {

        return {

            link: function ($scope, ele, attr) {
                //获取用户信息
                /*$http.get('/web/front/userSetting/findUserDetailInfo').success(function(data){
                    $scope.model.userInfo=data.info;
                });*/
                $timeout(function () {

                    if ($rootScope.$$$$userInfo === undefined && $scope.diruserInfo === undefined) {
                        $http.get('/web/front/userSetting/findUserDetailInfo').success(function (data) {
                            $scope.diruserInfo = data.info;
                            //console.log($scope.diruserInfo);
                        });
                    } else {
                        $scope.diruserInfo = $rootScope.$$$$userInfo;
                        //console.log($scope.diruserInfo);
                    }
                    //$scope.model.userInfo.email='6666';

                }, 500);
                var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                $scope.saveInvoice = function (form) {
                    //console.log(form.telephone.$error);
                    if (form.telephone.$error.required === true || form.telephone.$error.pattern === true) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请填写11位正确的手机号！'
                        });
                        return false;
                    }

                    if (form.email.$error.required === true || emailReg.test($scope.diruserInfo.email) === false) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请输入正确格式的邮箱号！'
                        });
                        return false;
                    }
                    //console.log($scope.temporaryOrderNo);
                    $http.post('/web/front/studentOrder/applyForBill/' + $scope.temporaryOrderNo, {

                        electron: true,
                        title: true,
                        telephone: $scope.diruserInfo.phoneNumber,
                        email: $scope.diruserInfo.email

                    }).success(function (data) {
                        if (data.status && data.info === true) {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: $parse(attr.saveInvoiceCallback)($scope) === 'detail' ? '索取发票成功！请稍后刷新页面' : '索取发票成功！'
                            });

                            myOrderService.updateUserInfo({
                                phoneNumber: $scope.diruserInfo.phoneNumber,
                                email: $scope.diruserInfo.email
                            }).then(function (data) {
                            });


                            if (attr.saveInvoiceCallback !== undefined) {
                                var callback = $parse(attr.saveInvoiceCallback);
                                callback($scope);
                            }
                        }

                        if (!data.status) {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: data.info
                            });
                        }

                        $scope.model.applyForBillDialog.remove();


                    });

                };
            }

        };
    }];
});
