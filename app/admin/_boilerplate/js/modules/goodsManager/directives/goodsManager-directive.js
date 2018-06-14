/**
 * Created by linj 2018/4/24 20:15
 */
define([], function () {
    return {
        paymentRules: ['hbUtil', 'channelDistributionServices', 'HB_notification', 'goodsManagerService',
            function (hbUtil, channelDistributionServices, HB_notification, goodsManagerService) {
                return {
                    replace: true,
                    scope: {
                        skuId: '=',
                        schemeId: '=',
                        paymentRule: '=?',
                        justImportOpen: '=',
                        saveRuleCallback: '&',
                        editRule: '=',
                        justView: '@'//true 时代表被授权放查看授权信息
                    },
                    templateUrl: "@systemUrl@/views/goodsManager/directives/paymentRule.html",
                    link: function ($scope) {

                        $scope.ruleModel = {
                            tabMap: {
                                personal: {
                                    name: "学员缴费",
                                    code: "PERSONAL"
                                },
                                collective: {
                                    name: "单位缴费",
                                    code: "COLLECTIVE"
                                },
                                present: {
                                    name: "导入开通",
                                    code: "PRESENT"
                                }
                            },
                            tradeChannelMap: {
                                web: {
                                    name: "web端",
                                    code: "WEB"
                                },
                                android: {
                                    name: "Android客户端",
                                    code: "ANDROID"
                                },
                                ios: {
                                    name: "IOS客户端",
                                    code: "IOS"
                                },
                                weChatOfficialAccounts: {
                                    name: "微信公众号",
                                    code: "WECHAT_OFFICIAL_ACCOUNTS"
                                },
                                weChatMiniPrograms: {
                                    name: "微信小程序",
                                    code: "WECHAT_MINI_PROGRAMS"
                                },
                                collective: {
                                    name: " 单位缴费",
                                    code: "COLLECTIVE"
                                },
                                present: {
                                    name: "导入开通",
                                    code: "PRESENT"
                                }
                            },
                            paymentRule: {},
                            editable: true
                        };
                        $scope.paymentRule.schemeId = $scope.schemeId;
                        //配置个人缴费的子渠道
                        $scope.ruleModel.tabMap.personal.subTradeChannel = [
                            $scope.ruleModel.tradeChannelMap.web,
                            $scope.ruleModel.tradeChannelMap.android,
                            $scope.ruleModel.tradeChannelMap.ios,
                            $scope.ruleModel.tradeChannelMap.weChatOfficialAccounts,
                            $scope.ruleModel.tradeChannelMap.weChatMiniPrograms,
                        ];
                        //若外部不指定编辑状态默认初始化为false
                        if (hbUtil.validateIsNull($scope.editRule)) {
                            $scope.editRule = false;
                        } else if ($scope.editRule === true) {
                            $scope.tempPaymentRule = angular.copy($scope.paymentRule);
                        }
                        //当只查看不能编辑时
                        if (hbUtil.validateIsNull($scope.justView) === false && $scope.justView == 'true') {
                            $scope.ruleModel.editable = false;
                        }
                        //默认初始化全渠道的规则
                        function initData() {
                            $scope.ruleModel.tabList = [
                                $scope.ruleModel.tabMap.personal,
                                //$scope.ruleModel.tabMap.collective,
                                $scope.ruleModel.tabMap.present
                            ];
                            $scope.ruleModel.currentTab = $scope.ruleModel.tabMap.personal;
                            //定义指令内部的临时规则，只有当保存成功后会把值复制给双向绑定的外部规则
                            $scope.ruleModel.paymentRule = angular.copy($scope.paymentRule);
                        };
                        initData();
                        console.log($scope.ruleModel.paymentRule);
                        console.log($scope.paymentRule);
                        $scope.events = {
                            changeTab: function (e, item) {
                                $scope.ruleModel.currentTab = item;
                            },
                            editRule: function (e) {
                                $scope.editRule = true;
                                //保存发起编辑时的值，当取消之后复制回去
                                $scope.tempPaymentRule = angular.copy($scope.paymentRule);
                            },
                            saveRule: function (e) {

                                var number = '^[0-9]*$';
                                var reNo = new RegExp(number);

                                if ($scope.ruleModel.paymentRule.priceType == 3) {
                                    //当授权方指定售价区间时校验价格合法性
                                    if (!reNo.test($scope.ruleModel.paymentRule.priceStart)) {
                                        HB_notification.alert('请输入正整数数字（包括“0”）');
                                        return;
                                    }
                                    if (!reNo.test($scope.ruleModel.paymentRule.priceEnd)) {
                                        HB_notification.alert('请输入正整数数字（包括“0”）');
                                        return;
                                    }
                                    if (Number($scope.ruleModel.paymentRule.priceStart) > Number($scope.ruleModel.paymentRule.priceEnd)
                                    ||Number($scope.ruleModel.paymentRule.priceEnd)>2147483647) {
                                        HB_notification.alert('请输入合理的售价区间');
                                        return;
                                    }
                                } else {
                                    //否则去除定价信息
                                    delete $scope.ruleModel.paymentRule.priceStart;
                                    delete $scope.ruleModel.paymentRule.priceEnd;
                                }
                                $scope.ruleModel.saving=true;
                                goodsManagerService.changeAuthorizedRule($scope.ruleModel.paymentRule)
                                    .then(function (data) {
                                        if (data.status) {
                                            $scope.editRule = false;
                                            $scope.paymentRule = {};
                                            $scope.paymentRule = angular.copy($scope.ruleModel.paymentRule);
                                            $scope.saveRuleCallback();
                                        } else {
                                            HB_notification.showTip(data.info, 'error');
                                        }

                                        $scope.ruleModel.saving=false;
                                    });
                            },
                            cancelEditRule: function (e) {
                                //取消之后把保存发起编辑时的值复制回去
                                $scope.ruleModel.paymentRule = angular.copy($scope.tempPaymentRule);
                                $scope.editRule = false;
                            }
                        };
                        $scope.utils = {
                            validateIsNull: hbUtil.validateIsNull
                        }

                        $scope.$watch('ruleModel.currentTab', function (newVal) {
                            if (hbUtil.validateIsNull(newVal.subTradeChannel) || newVal.subTradeChannel.length === 0) {
                                console.log("$scope.paymentRule");
                                console.log($scope.paymentRule);
                                channelDistributionServices.getPaymentAccountListByQueryParam({
                                    channelTypeEnum: newVal.code,
                                    skuId: $scope.skuId
                                }).then(function (data) {
                                    newVal.paymentAccountList = data.info;
                                });
                            } else {
                                angular.forEach(newVal.subTradeChannel, function (value, index) {
                                    channelDistributionServices.getPaymentAccountListByQueryParam({
                                        channelTypeEnum: value.code,
                                        skuId: $scope.skuId
                                    }).then(function (data) {
                                        value.paymentAccountList = data.info;
                                    });
                                });
                            }
                            //获取发票配置
                            channelDistributionServices.getInvoiceConfigByPaymentChannelTabAndSkuId(newVal.code,{skuId:$scope.skuId}).then(function (data) {
                                if (data == undefined || data == null) {
                                    return;
                                }
                                if (data.status) {
                                    newVal.billConfig = {};
                                    newVal.billConfig = data.info;
                                    newVal.billConfig.titleType = data.info.paperTitleType;

                                    if (data.info.isProvide == 1) {
                                        newVal.notProvide = true;
                                    } else {
                                        newVal.notProvide = false;
                                    }
                                    var providePaper = data.info.providePaper;
                                    var provideElectron = data.info.provideElectron;

                                    if (provideElectron == 2) {
                                        if (providePaper == 2) {
                                            newVal.billConfig.billType = 3;
                                        } else {
                                            newVal.billConfig.billType = 2;
                                        }
                                    } else {
                                        if (providePaper == 2) {
                                            newVal.billConfig.billType = 1;
                                        } else {
                                            newVal.billConfig.billType = 0;
                                        }
                                    }
                                } else {
                                    HB_notification.showTip(data.info, 'error');
                                    newVal.billConfig = null;
                                }
                            });
                        });
                        $scope.$watch('justImportOpen', function (newVal) {
                            if (hbUtil.validateIsNull(newVal) === false && newVal == true) {
                                $scope.ruleModel.tabList = [
                                    $scope.ruleModel.tabMap.present
                                ];
                                $scope.ruleModel.currentTab = $scope.ruleModel.tabMap.present;

                            } else {
                                initData();
                            }
                        });
                        $scope.$watch('paymentRule', function (newVal) {
                            if (hbUtil.validateIsNull(newVal) === false) {
                                $scope.ruleModel.paymentRule = angular.copy($scope.paymentRule);
                            }
                        });
                    }
                }
            }],
        authorizedOpDialog: ['hbUtil', 'easyKendoDialog', 'goodsManagerService', 'HB_notification',
            function (hbUtil, easyKendoDialog, goodsManagerService, HB_notification) {
                return {
                    replace: true,
                    scope: {
                        skuId: '=',
                    },
                    templateUrl: "@systemUrl@/views/goodsManager/directives/authorziedOpButton.html",
                    link: function ($scope) {
                        $scope.events = {
                            openDialog: function (e) {
                                $scope.model.pageNo = 1;
                                $scope.events.page($scope.model.pageNo);
                                $scope.authorizedOpDialog = easyKendoDialog.content({
                                    templateUrl: '@systemUrl@/views/goodsManager/directives/authorizedOpDialog.html',
                                    width: 1000,
                                    title: false
                                }, $scope);
                            },
                            closeKendoWindow: function (windowName) {
                                if ($scope[windowName]) {
                                    $scope[windowName].kendoDialog.close();
                                }
                            },
                            page: function(no){
                                if (no <= 0 || no > $scope.model.pageCount) {
                                    return;
                                }
                                $scope.model.pageNo = no;
                                goodsManagerService.getAuthorizedRuleChangeLogPage({
                                    pageNo: $scope.model.pageNo,
                                    pageSize: $scope.model.pageSize,
                                    commoditySkuId: $scope.skuId
                                }).then(function (data) {
                                    if (data == undefined || data == null) {
                                        return;
                                    }
                                    if (data.status) {
                                        $scope.model.pageCount = data.totalPageSize;
                                        $scope.model.totalSize = data.totalSize;
                                        $scope.model.logList = data.info;
                                        $scope.utils.getPageList();
                                    } else {
                                        HB_notification.showTip(data.info, 'error');
                                    }
                                });
                            }
                        }
                        $scope.model = {
                            pageNo: 1,
                            pageSize: 5,
                            totalSize: 0,
                            pageCount: 1,
                            logList: []
                        };

                        $scope.utils = {
                            getPageList: function () {
                                $scope.model.pageList = [];
                                var start = 0;
                                if ($scope.model.pageNo <= 3) {
                                    start = 0;
                                } else if ($scope.model.pageNo + 3 > $scope.model.pageCount) {
                                    start = $scope.model.pageCount - 6;
                                    if (start < 0) {
                                        start = 0;
                                    }
                                } else {
                                    start = $scope.model.pageNo - 3;
                                }
                                for (var i = 1; i <= 6 && start + i <= $scope.model.pageCount; i++) {
                                    $scope.model.pageList[i - 1] = start + i;
                                }
                            }
                        };

                    }

                }

            }],
        commodityAuthroizedOption: ['hbUtil', 'easyKendoDialog', function (hbUtil, easyKendoDialog) {
            return {
                replace: false,
                scope: {
                    queryParams: "=?",
                    hasAuthorize: "=?",
                    authorizedState: "=?"

                },
                templateUrl: "@systemUrl@/views/goodsManager/directives/authorizedOption.html",
                link: function ($scope) {
                    if (hbUtil.validateIsNull($scope.queryParams)) {
                        $scope.queryParams = {
                            rangeType: "commodity",
                            authorizedState: 0
                        }
                    } else {
                        $scope.queryParams.rangeType = "commodity";
                        $scope.queryParams.authorizedState = 0;
                    }
                    $scope.$watch('queryParams.belongsType', function (newVal) {
                        $scope.queryParams.authorizeToUnitId = "";
                        $scope.queryParams.authorizedFromUnitId = "";
                        $scope.queryParams.objectId = "";
                    });
                }
            }
        }]
    };
});
