define(['cooper'], function (cooper) {
    'use strict';
    return ['$scope','channelDistributionService', 'hbUtil', 'HB_dialog', '$state',
        function ($scope,channelDistributionService, hbUtil, HB_dialog, $state) {
            $scope.model = {
                type: 'PERSONAL',
                channelType: null,//线上渠道类型
                paymentListPage: {
                    pageNo: 1,
                    pageSize: 10
                },
                paymentListQueryParam: {
                    tradeType: '',
                    accountAlias: null
                },
                choosePaymentChannel: {
                    paymentChannelId: null,
                    accountId: null
                },
                backUpData: {},
                billConfig: {
                    id: '',//发票配置ID
                    isProvide: 2,
                    provideType: 2,
                    providePaper: 2,
                    provideElectron: 1,
                    paperTitleType: 3,
                    electronTitleType: 3,
                    billType: 1, //发票类型
                    titleType: 2, //抬头类型
                    eInvoiceSearchAddress: null,

                    //发票类型
                    selectCommonVAT: false,//是否选择增值税普通发票
                    selectCommonElectron: false,//是否选择普通电子发票
                    selectVATOnly: false,//是否选择增值税专用发票
                    selectNonTax: false,//是否选择非税务发票

                    //发票抬头
                    selectPersonal: false,//是否选择了个人
                    selectUnit: false//是否选择了单位
                },
                isDisable: true,
                notProvide: false,

                channelList: [
                    {
                        type: 'PERSONAL'//个人
                    },
                    // {
                    //     type: 'COLLECTIVE'//集体
                    // },
                    {
                        type: 'PRESENT'//导入开通
                    }
                ]
            };
            $scope.kendoPlus = {
                windowOptions: {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                }
            };


            $scope.events = {
                updateBillConfig: function () {
                    var billConfigDetail = {};

                    $scope.model.billConfig.tabType = $scope.model.type;

                    billConfigDetail = $scope.model.billConfig;

                    if (billConfigDetail.isProvide == 1 || billConfigDetail.isProvide == '1') {//不提供发票
                        //不提供发票
                        billConfigDetail.provideType = 0;
                        billConfigDetail.providePaper = 1;
                        billConfigDetail.provideElectron = 1;
                        billConfigDetail.paperTitleType = 0;
                        billConfigDetail.electronTitleType = 0;
                        billConfigDetail.titleType = 0;
                        billConfigDetail.billType = 0;

                        billConfigDetail.eInvoiceSearchAddress = null;

                        billConfigDetail.selectCommonVAT = false;//是否选择增值税普通发票
                        billConfigDetail.selectCommonElectron = false;//是否选择普通电子发票
                        billConfigDetail.selectVATOnly = false;//是否选择增值税专用发票
                        billConfigDetail.selectNonTax = false;//是否选择非税务发票

                        billConfigDetail.selectPersonal = false;//是否选择了个人
                        billConfigDetail.selectUnit = false;//是否选择了单位
                    } else {
                        var provideType = parseInt(billConfigDetail.provideType);
                        if (provideType != 1 && provideType != 2) {
                            $scope.globle.alert('提示', '请选择发票提供方式');
                            return;
                        }
                        if (billConfigDetail.selectCommonVAT == false && billConfigDetail.selectCommonElectron == false
                            && billConfigDetail.selectVATOnly == false && billConfigDetail.selectNonTax == false) {

                            $scope.globle.alert('提示', '请选择发票类型');
                            return;
                        } else {
                            var onlySelectVATOnly = false;//是否只选了增值税专用发票
                            if (billConfigDetail.selectCommonVAT == false && billConfigDetail.selectCommonElectron == false
                                && billConfigDetail.selectVATOnly == true && billConfigDetail.selectNonTax == false) {//只选了增值税专用发票
                                onlySelectVATOnly = true;
                            }

                            if (billConfigDetail.selectPersonal == false && billConfigDetail.selectUnit == false && !onlySelectVATOnly) {
                                $scope.globle.alert('提示', '请选择发票抬头类型 ');
                                return;
                            } else {

                                if ($scope.model.type === 'COLLECTIVE') {
                                    billConfigDetail.selectUnit = true;
                                    billConfigDetail.selectPersonal = false;
                                }
                            }
                            ;
                            //if(billConfigDetail.billType == 2|| billConfigDetail.billType == '2' || billConfigDetail.billType == 3|| billConfigDetail.billType == '3'){
                            //    if(billConfigDetail.eInvoiceSearchAddress == null || billConfigDetail.eInvoiceSearchAddress == ''){
                            //        $scope.globle.alert("提示","请填写电子发票查询地址");
                            //        return;
                            //    }
                            //};请填写电子发票查询地址目前不要 2018-01-23

                        }

                        if ($scope.model.billConfig.selectVATOnly && !$scope.model.billConfig.selectCommonVAT && !$scope.model.billConfig.selectCommonElectron && !$scope.model.billConfig.selectNonTax) {//只选了增值税专用发票
                            billConfigDetail.selectPersonal = false;//是否选择了个人
                            billConfigDetail.selectUnit = false;//是否选择了单位
                        }
                    }

                    channelDistributionService.operaBillConfig(billConfigDetail).then(function (data) {
                        if (data.status && data.info) {
                            $scope.model.billConfig = angular.copy(billConfigDetail);
                            $scope.model.billConfig.id = data.info;
                            $scope.model.isDisable = true;
                            $scope.globle.showTip('修改成功', 'success');
                        } else {
                            $scope.globle.showTip('修改失败', 'error');
                        }
                    });
                },
                cancleModify: function () {
                    $scope.model.isDisable = true;
                    $scope.model.billConfig.isProvide = $scope.model.backUpData.isProvide;
                    $scope.model.billConfig.provideType = $scope.model.backUpData.provideType;
                    $scope.model.billConfig.billType = $scope.model.backUpData.billType;
                    $scope.model.billConfig.titleType = $scope.model.backUpData.titleType;
                },
                modify: function () {
                    $scope.model.isDisable = false;
                    $scope.model.backUpData = {};
                    $scope.model.backUpData = angular.copy($scope.model.billConfig);
                },
                selectNotProvideBill: function (type) {
                    if (type == 1) {
                        $scope.model.notProvide = false;
                    } else if (type == 2) {
                        $scope.model.notProvide = true;
                    } else {
                        $scope.globle.alert('提示', '未知动作类型');
                    }
                },
                MainPageQueryList: function (e, gridName, pageName) {
                    e.stopPropagation();
                    $scope.model[pageName].pageNo = 1;
                    $scope.kendoPlus[gridName].pager.page(1);
                },
                delete: function (item, channelType) {
                    $scope.model.choosePaymentChannel.accountId = item.id;
                    $scope.globle.confirm('提示', '移除账号后需重新添加，是否确认移除？', function (dialog) {
                        return channelDistributionService.removePaymentAccount({
                            accountId: $scope.model.choosePaymentChannel.accountId,
                            channelType: channelType
                        }).then(function (data) {
                            if (data.info === true) {
                                dialog.doRightClose();
                                HB_dialog.success('提示', '移除成功');
                                $state.reload($state.current.name);
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        });
                    });
                },
                paymentChannelManage: function (item) {
                    $scope.model.choosePaymentChannel.accountId = item.id;
                    channelDistributionService.addPaymentAccount({
                        accountId: $scope.model.choosePaymentChannel.accountId,
                        channelType: $scope.model.channelType
                    }).then(function (data) {
                        if (data.info === true) {
                            HB_dialog.success('提示', '添加成功');
                            $scope.events.closeKendoWindow('paymentAccountWindow');
                            $state.reload($state.current.name);
                            $scope.model.choosePaymentChannel.accountId = '';
                        } else {
                            HB_dialog.error('提示', data.info);
                            $scope.model.choosePaymentChannel.accountId = '';
                        }
                    });

                },
                openKendoWindow: function (windowName, channelType) {
                    $scope.model.channelType = channelType;
                    $scope[windowName].center().open();
                },
                closeKendoWindow: function (windowName) {
                    $scope[windowName].close();
                },
                tabType: function (item) {
                    if ($scope.model.type === item.type) {
                        return false;
                    }
                    $scope.model.type = item.type;
                    $scope.model.paymentListQueryParam.tradeType = '';//收款账号查询‘支付方式’默认无查询参数

                    if (item.type === 'PERSONAL') {//如果是个人缴费渠道
                        channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 web端
                            channelTypeEnum: 'WEB'
                        }).then(function (data) {
                            $scope.model.webPaymentAccountList = data.info;
                        });
                        channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 android客户端
                            channelTypeEnum: 'ANDROID'
                        }).then(function (data) {
                            $scope.model.androidPaymentAccountList = data.info;
                        });
                        channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 ios客户端
                            channelTypeEnum: 'IOS'
                        }).then(function (data) {
                            $scope.model.iosPaymentAccountList = data.info;
                        });
                        channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 微信公众号（订阅号）
                            channelTypeEnum: 'WECHAT_OFFICIAL_ACCOUNTS'
                        }).then(function (data) {
                            $scope.model.weChatOfficaAccountslPaymentAccountList = data.info;
                        });
                        channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 微信小程序
                            channelTypeEnum: 'WECHAT_MINI_PROGRAMS'
                        }).then(function (data) {
                            $scope.model.webChatMiniProgramPaymentAccountList = data.info;
                        });
                    } else if (item.type === 'COLLECTIVE') {//如果是集体缴费渠道
                        channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 集体缴费渠道
                            channelTypeEnum: 'COLLECTIVE'
                        }).then(function (data) {
                            $scope.model.collectivePaymentAccountList = data.info;
                        });
                    } else if (item.type === 'PRESENT') {//如果是导入开通渠道
                        $scope.model.paymentListQueryParam.firstType = '2';//收款账号查询默认线下
                        channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 集体缴费渠道
                            channelTypeEnum: 'PRESENT'
                        }).then(function (data) {
                            $scope.model.presentPaymentAccountList = data.info;
                        });
                    }

                    $scope.kendoPlus.paymentListGridInstance.dataSource.page(1);//刷新收款账号表格


                    channelDistributionService.getInvoiceConfigByPaymentChannelTab($scope.model.type).then(function (data) {
                        if (data.status) {
                            if (data == undefined || data == null) {
                                return;
                            }
                            $scope.model.billConfig = {};
                            $scope.model.billConfig = data.info;
                            $scope.model.billConfig.titleType = data.info.paperTitleType;

                            if (data.info.isProvide == 1) {
                                $scope.model.notProvide = true;
                            } else {
                                $scope.model.notProvide = false;
                            }
                            var providePaper = data.info.providePaper;
                            var provideElectron = data.info.provideElectron;

                            if (provideElectron == 2) {
                                if (providePaper == 2) {
                                    $scope.model.billConfig.billType = 3;
                                } else {
                                    $scope.model.billConfig.billType = 2;
                                }
                            } else {
                                if (providePaper == 2) {
                                    $scope.model.billConfig.billType = 1;
                                } else {
                                    $scope.model.billConfig.billType = 0;
                                }
                            }
                        } else {
                            $scope.globle.alert('error', data.info);
                            $scope.model.billConfig = null;
                        }
                    });
                }
            };

            function initSomeThing () {
                $scope.model.type = $scope.model.channelList[0].type;

                channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 web端
                    channelTypeEnum: 'WEB'
                }).then(function (data) {
                    $scope.model.webPaymentAccountList = data.info;
                });
                channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 android客户端
                    channelTypeEnum: 'ANDROID'
                }).then(function (data) {
                    $scope.model.androidPaymentAccountList = data.info;
                });
                channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 ios客户端
                    channelTypeEnum: 'IOS'
                }).then(function (data) {
                    $scope.model.iosPaymentAccountList = data.info;
                });
                channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 微信公众号（订阅号）
                    channelTypeEnum: 'WECHAT_OFFICIAL_ACCOUNTS'
                }).then(function (data) {
                    $scope.model.weChatOfficaAccountslPaymentAccountList = data.info;
                });
                channelDistributionService.getPaymentAccountListByQueryParam({//线上收款账号 微信小程序
                    channelTypeEnum: 'WECHAT_MINI_PROGRAMS'
                }).then(function (data) {
                    $scope.model.webChatMiniProgramPaymentAccountList = data.info;
                });
                channelDistributionService.getInvoiceConfigByPaymentChannelTab($scope.model.type).then(function (data) {
                    if (data.status) {
                        if (data == undefined || data == null) {
                            return;
                        }
                        $scope.model.billConfig = {};
                        $scope.model.billConfig = data.info;
                        $scope.model.billConfig.titleType = data.info.paperTitleType;

                        if (data.info.isProvide == 1) {
                            $scope.model.notProvide = true;
                        } else {
                            $scope.model.notProvide = false;
                        }
                        var providePaper = data.info.providePaper;
                        var provideElectron = data.info.provideElectron;

                        if (provideElectron == 2) {
                            if (providePaper == 2) {
                                $scope.model.billConfig.billType = 3;
                            } else {
                                $scope.model.billConfig.billType = 2;
                            }
                        } else {
                            if (providePaper == 2) {
                                $scope.model.billConfig.billType = 1;
                            } else {
                                $scope.model.billConfig.billType = 0;
                            }
                        }
                    } else {
                        $scope.globle.alert('error', data.info);
                        $scope.model.billConfig = null;
                    }
                });
            }

            initSomeThing();//初始化数据


            //配置中模板
            var paymentListGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td  >');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: firstType===1?"线上":"线下" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: tradeChannelName||"-" #');
                result.push('</td>');


                result.push('<td>');
                result.push('#: createUnitName||"-" #');
                result.push('</td>');
                result.push('<td>');
                result.push('#: fromAuthorize?"是":"否" #');
                result.push('</td>');
                result.push('<td>');
                result.push('#: fromAuthorize? (authorizationState === "AUTHORIZATION"?"授权中":"已取消授权"):"-" #');
                result.push('</td>');
                result.push('<td>');
                result.push('#: fromAuthorize?"-":(hasAuthorize?"已授权":"未授权") #');
                result.push('</td>');



                result.push('<td>');
                result.push('#: accountAlias||"-" #');
                result.push('</td>');

                result.push('<td>');
                result.push('<p ng-if="#:tradeChannelCode === \'OTHER\'#"> 商户号： #: accountNo #  </p> ' +
                    '<p ng-if="#:tradeChannelCode !== \'CCB\' && tradeChannelCode !== \'OTHER\'#">商户号： #: accountNo # </p> ' +
                    '<p ng-if="#:tradeChannelCode === \'CCB\'#"> 开户户名：#:merchantName #</p> ' +
                    '<p ng-if="#:tradeChannelCode === \'CCB\'#"> 开户银行：#:depositBank#</p> ' +
                    '<p ng-if="#:tradeChannelCode === \'CCB\'#"> 银行账号：#:accountNo #</p>');
                //result.push ( '#: tradeChannelCode===\'CCB\'? "开户户名："+merchantName+"开户银行："+depositBank+"银行账号："+accountNo  : \'<p>商户号：</p>\' #' );
                result.push('</td>');

                result.push('<td>');
                result.push('#: branchBankId||"-" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: counterNumber|| "-" #');
                result.push('</td>');


                result.push('<td>');
                //result.push ( '<button type="button" ng-click="events.paymentChannelManage(dataItem)" class="table-btn">选择</button>' );
                result.push('<button type="button" ng-if="model.choosePaymentChannel.accountId!==dataItem.id"  class="table-btn" ng-click="events.paymentChannelManage(dataItem)">选择</button>');
                result.push('<button type="button" ng-if="model.choosePaymentChannel.accountId===dataItem.id" class="table-btn" ng-click="model.choosePaymentChannel.accountId=\'\'" >取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                paymentListGridRowTemplate = result.join('');
            })();

            $scope.paymentListGrid = {
                options: hbUtil.kdGridCommonOption({
                    template: paymentListGridRowTemplate,
                    scrollable:true,
                    url: '/web/admin/paymentAccount/getPaymentAccountPage',
                    scope: $scope,
                    page: 'paymentListPage',
                    param: $scope.model.paymentListQueryParam,
                    
                    /* skuParam:'skuParamspaymentList',*/
                    fn: function (response) {
                        $scope.configingArr = response.info;
                    },
                    columns: [
                        {field: 'commodityName', title: 'No.', sortable: false, width: 50},
                        {field: 'attr', title: '支付方式', sortable: false, width: 100},
                        {field: 'credit', title: '支付账号类型', sortable: false, width: 150},
                        {field: 'credit', title: '创建单位', sortable: false, width: 150},
                        {field: 'credit', title: '是否为授权账号', sortable: false, width: 130},
                        {field: 'credit', title: '授权状态', sortable: false, width: 150},
                        {field: 'credit', title: '是否授权', sortable: false, width: 120},
                        {field: 'price', title: '收款账号别名', sortable: false, width: 150},
                        {field: 'price', title: '开户账户信息', sortable: false, width: 180},
                        {field: 'price', title: '分行号', sortable: false, width: 150},
                        {field: 'price', title: '柜台号', sortable: false, width: 150},
                        {
                            title: '操作', width: 120
                        }
                    ]
                })
            };

        }];
});
