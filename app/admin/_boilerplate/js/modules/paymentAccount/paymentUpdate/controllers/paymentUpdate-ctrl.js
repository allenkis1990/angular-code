define(function (paymentUpdate) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'paymentAccountService', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification',
            function ($scope, paymentAccountService, $stateParams, $http, $q, HB_dialog, $state, HB_notification) {

                $scope.events = {
                    validateName: function (item) {
                        if (item.accountAlias === '') {
                            $scope.params.validate = 2;
                        } else {
                            paymentAccountService.validateName(item.id, item.accountAlias).then(function (data) {
                                if (data.status) {
                                    $scope.params.validate = 0;
                                } else {
                                    $scope.params.validate = 1;
                                }
                            });
                        }

                    },
                    update: function () {
                        if ($scope.params.accountAlias === '') {
                            return false;
                        }
                        if ($scope.params.realSupportIssuingElectronInvoice&&!$scope.params.taxPayerId) {
                            return false;
                        }
                        if ($scope.params.firstType === 1 && $scope.params.createType === 2) {//微信支付
                            if ($scope.model.upload.result.newPath !== undefined) {//修改了
                                $scope.params.privateKeyPath = $scope.model.upload.result.newPath;
                                $scope.params.privateKeyFileName = $scope.model.upload.result.fileName;
                            }
                        }
                        //$scope.params.privateKeyPath= $scope.model.upload.result.newPath;
                        //$scope.params.privateKeyFileName= $scope.model.upload.result.fileName;

                        paymentAccountService.update($scope.params).then(function (data) {
                            $scope.submitAble = false;
                            if (data.status) {
                                HB_dialog.success('提示', '收款账号更改成功');
                                //$state.go('states.paymentAccount');
                                $state.go('states.paymentAccount').then(function () {
                                    $state.reload($state.current);
                                });
                            } else {
                                HB_dialog.error('提示', data.info || '收款账号创建失败');
                            }
                        });
                    }
                };
            }]
    };
});