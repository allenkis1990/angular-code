define(function (add) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'paymentAccountService', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification',
            function ($scope, paymentAccountService, $stateParams, $http, $q, HB_dialog, $state, HB_notification) {

                $scope.params = {
                    id: '',
                    accountNo: '',
                    accountAlias: '',
                    createType: 2,
                    merchantName: '',//企业名称（开户户名）
                    merchantKey: '',
                    merchantPhone: '',
                    appId: '',
                    privateKeyPwd: '',
                    privateKeyPath: '',
                    privateKeyFileName: '',
                    validate: 0,
                    firstType: 1,//支付方式
                    posId: '',//
                    branchBankId: '',
                    publicKey: '',
                    operator: '',
                    password: '',

                    depositBank: '',//开户银行
                    bankNumber: '',//开户号
                    counterNumber: '',//柜台号
                    oldTaxPayerId: '',
                    taxPayerId: '',//纳税人识别号
                    taxPayerName: '',
                    realSupportIssuingElectronInvoice: '',
                    taxPayerList: [],

                    //alipayVersion:1,//支付宝版本 1/2 旧版/新版
                    alipayAppPrivateKey: '',//支付宝应用私钥
                    alipayPublicKey: '',//支付宝公钥
                    alipayAppId: ''//支付宝应用id
                };
                $scope.events = {
                    isOpenTaxPayerChoose: function () {
                        paymentAccountService.findElectronInvoiceSupport().then(function (data) {
                            $scope.params.realSupportIssuingElectronInvoice = data.info.realSupportIssuingElectronInvoice;
                        });
                    },
                    validateName: function (item) {

                        if (item.accountAlias === '') {
                            $scope.params.validate = 2;
                        } else {
                            paymentAccountService.validateName(item.id, item.accountAlias).then(function (data) {
                                if (data.status) {
                                    $scope.params.validate = 0;//别名没有重复，验证通过
                                } else {
                                    $scope.params.validate = 1;//别名重复，验证不通过
                                }
                            });
                        }

                    },
                    findTaxPayerList: function () {
                        paymentAccountService.findTaxPayerList().then(function (data) {
                            $scope.params.taxPayerList = data.info;
                        });
                    },
                    create: function () {
                        if ($scope.params.accountAlias === '') {
                            return false;
                        }
                        if ($scope.params.realSupportIssuingElectronInvoice&&!$scope.params.taxPayerId) {
                            return false;
                        }
                        if ($scope.params.firstType === 1 && ($scope.params.createType === 2 || $scope.params.createType === 4 || $scope.params.createType === 5)) {//微信支付
                            $scope.params.privateKeyPath = $scope.model.upload.result.newPath;
                            $scope.params.privateKeyFileName = $scope.model.upload.result.fileName;
                        }
                        paymentAccountService.create($scope.params).then(function (data) {
                            $scope.submitAble = false;
                            if (data.status) {
                                HB_dialog.success('提示', '收款账号创建成功');
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
                $scope.events.findTaxPayerList();
                $scope.events.isOpenTaxPayerChoose();
            }]
    };
});