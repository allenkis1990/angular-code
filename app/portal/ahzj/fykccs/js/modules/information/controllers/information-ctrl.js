define(function () {
    'use strict';
    return ['$scope', 'informationService', '$dialog', '$state', '$timeout', '$stateParams', function ($scope, informationService, $dialog, $state, $timeout, $stateParams) {
        $scope.model = {
            useInformation: '',
            use: {
                phoneNum: '',
                email: '',
                job: '',
                address: '',
                code: ''
            },
            sourceType: $stateParams.type
        };
        informationService.validateCompletion().then(function (data) {
            if (data.info) {
                $state.go('states.accountant', {type: 1});
            }
        });
        informationService.isLogin().then(function (data) {
            if (!data.info) {
                $state.go('states.accountant');
            } else {
                informationService.findUserDetailInfo().then(function (data) {
                    $scope.model.useInformation = data.info;
                    //$scope.model.useInformation.identify = $scope.model.useInformation.identify.split('');
                    //$scope.model.useInformation.identify.splice(4, 10, '**********');
                    //$scope.model.useInformation.identify = $scope.model.useInformation.identify.join('');
                    if ($scope.model.useInformation.phoneNumber !== '' || $scope.model.useInformation.phoneNumber !== null || $scope.model.useInformation.phoneNumber.length === 11) {
                        $scope.model.use.phoneNum = parseInt($scope.model.useInformation.phoneNumber);
                    }
                    if ($scope.model.useInformation.address !== '' || $scope.model.useInformation.address !== null) {
                        $scope.model.use.address = $scope.model.useInformation.address;
                    }
                    if ($scope.model.useInformation.email !== '' || $scope.model.useInformation.email !== null) {
                        $scope.model.use.email = $scope.model.useInformation.email;
                    }
                    if ($scope.model.useInformation.unitName !== '' || $scope.model.useInformation.unitName !== null) {
                        $scope.model.use.job = $scope.model.useInformation.unitName;
                    }
                    if ($scope.model.useInformation.postCode !== '' || $scope.model.useInformation.postCode !== null) {
                        $scope.model.use.code = parseInt($scope.model.useInformation.postCode);
                    }
                });
            }
        });
        $scope.events = {
            submitUse: function (e) {
                e.preventDefault();
                if ($scope.model.use.code > 0) {
                    if ($scope.model.use.code < 99999 || $scope.model.use.code > 999999) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请输入正确的邮政编码！'
                        });
                        return false;
                    }
                }
                ;
                informationService.completionUserInfo({
                    unitName: $scope.model.use.job,
                    phoneNumber: $scope.model.use.phoneNum,
                    email: $scope.model.use.email,
                    address: $scope.model.use.address,
                    postCode: $scope.model.use.code + ''
                }).then(function (data) {
                    if (data.status) {
                        $dialog.contentDialog({
                            visible: true,
                            time: 1,
                            modal: true,
                            contentUrl: 'ahzj/fykccs/views/home/success.html'
                        }, $scope);
                        $timeout(function () {
                            $state.go('states.accountant');
                        }, 1000);
                    } else {
                        $dialog.contentDialog({
                            visible: true,
                            time: 1,
                            modal: true,
                            contentUrl: 'ahzj/fykccs/views/home/error.html'
                        }, $scope);
                    }
                });
            }
        };
    }];
});