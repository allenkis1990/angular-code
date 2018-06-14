define(function () {
    'use strict';
    return ['$scope', '$stateParams', '$http', '$dialog', function ($scope, $stateParams, $http, $dialog) {
        $scope.model = {
            idNum: '',
            userName: '',
            userPeriodList: [],

            showResult: false

        };


        $scope.events = {

            findUserPeriod: function () {

                var idNumReg = /(^\d{6}(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\d{3}$)|(^\d{6}(19|20)(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\d{3}([0-9]|X|x)$)/;
                if (!idNumReg.test($scope.model.idNum)) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请填写15-18位身份证号'
                    });
                    $scope.model.showResult = false;
                    return false;
                }


                if (validateIsNull($scope.model.userName)) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请填写姓名'
                    });
                    $scope.model.showResult = false;
                    return false;
                }
                $scope.submitAble = true;
                $http.get('/web/portal/index/findUserPeriod', {
                    params: {
                        userName: $scope.model.userName,
                        idNum: $scope.model.idNum
                    }
                }).success(function (data) {
                    $scope.submitAble = false;
                    if (data.status) {
                        $scope.model.userPeriodList = data.info;
                        if ($scope.model.userPeriodList.length > 0) {
                            $scope.model.showResult = true;
                        }
                    } else {
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
                        $scope.model.showResult = false;
                    }
                });
            }

        };


        if ($stateParams.idNum && $stateParams.userName) {
            $scope.model.idNum = $stateParams.idNum;
            $scope.model.userName = $stateParams.userName;
            $scope.events.findUserPeriod();
        }

        //验证是否为空
        function validateIsNull (obj) {
            return (obj === '' || obj === undefined || obj === null);
        }
    }];
});