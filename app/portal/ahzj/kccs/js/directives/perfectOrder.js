/**
 * Created by Allen on 2018/3/1.
 */
define(function () {
    'use strict';


    return {


        //完善订单列表
        perfectUserOrderInfo: ['hbBasicData', '$rootScope', '$http', function (hbBasicData, $rootScope, $http) {
            return {
                restrict: 'A',
                templateUrl: 'ahzj/kccs/templates/perfectUserOrderInfo.html',
                scope: {},
                link: function ($scope) {

                    //hbBasicData.removePerfectOrderDialog


                    $scope.model = {
                        currentPage: 1,//当前第几页
                        total: 10,//数据总条数 这个去后端拿
                        maxSize: 5,//最多可见页数按钮5个
                        itemsPerPage: 5,//每页显示5条 默认10条

                        PerfectOrderList: []
                    };

                    $scope.events = {
                        removePerfectOrderDialog: function () {
                            hbBasicData.removePerfectOrderDialog();
                        },

                        findPerfectOrderList: function () {
                            findPerfectOrderList();
                        },


                        openPerfectDetail: function (item) {
                            //把对象转成json字符串通过attr传到perfectDetail指令
                            var params = {
                                orderLen: $scope.model.PerfectOrderList.length,
                                payTime: item.payTime,
                                orderNo: item.orderNo
                            };

                            var jsonStr = JSON.stringify(params);
                            hbBasicData.addPerfectDetailDialog($scope, jsonStr);
                        }

                    };


                    //获取未完善的订单列表
                    function findPerfectOrderList (beforeDo) {
                        //当补全订单信息后需要把页面设置成1并且刷新列表
                        if (beforeDo) {
                            $scope.model.currentPage = 1;
                        }
                        $scope.lwhLoading = true;
                        $http.get('/web/front/studentOrder/pageInvoiceCompensationOrder', {
                            params: {
                                pageNo: $scope.model.currentPage,
                                pageSize: $scope.model.itemsPerPage
                            }
                        }).success(function (data) {
                            $scope.lwhLoading = false;
                            if (data.status) {
                                $scope.model.PerfectOrderList = data.info;
                                $scope.model.total = data.totalSize;
                                if ($scope.model.PerfectOrderList.length <= 0) {
                                    window.open('/center/#/home', '_self');
                                }
                            }
                        });
                    }

                    findPerfectOrderList();

                    hbBasicData.findPerfectOrderList = findPerfectOrderList;


                }
            };
        }],


        //完善订单详情弹窗
        perfectDetail: ['hbBasicData', '$rootScope', '$http', 'hbUtil', '$dialog', function (hbBasicData, $rootScope, $http, hbUtil, $dialog) {
            return {
                restrict: 'A',
                templateUrl: 'ahzj/kccs/templates/perfectDetail.html',
                scope: {},
                link: function ($scope, ele, attrs) {

                    //hbBasicData.removePerfectOrderDialog

                    var jsonStr = JSON.parse(attrs.jsonStr);
                    console.log(jsonStr);

                    $scope.model = {
                        PerfectOrderLen: jsonStr.orderLen,
                        payTime: jsonStr.payTime,
                        orderNo: jsonStr.orderNo,

                        total: 0,
                        shiList: [],
                        quList: [],
                        userTake: '1',//1邮寄2自取
                        editInvoice: true,//默认是编辑发票状态
                        editTakeAddress: true,//默认是编辑收货地址状态
                        selfStorageId: '',//自取点ID
                        needInvoice: 'false',//是否需要发票
                        provinceId: '340000',

                        firstInvoiceType: ''
                    };


                    $scope.fn = function () {
                        hbBasicData.findPerfectOrderList(true);
                    };

                    $scope.events = {


                        lookAssociatedDetail: function (item) {
                            if ($scope.submitAble) {
                                return false;
                            }
                            $scope.submitAble = true;
                            $http.get('/web/front/studentOrder/getAssociatedOrder/' + item.subOrderNo).success(function (data) {
                                $scope.submitAble = false;
                                if (data.status) {
                                    console.log(data);
                                    $scope.model.derivativeOrderList = data.info.derivativeOrderList;
                                    $scope.model.initialOrder = data.info.initialOrder;

                                    $dialog.contentDialog({
                                        title: '换班订单',
                                        visible: true,
                                        modal: true,
                                        width: 1000,
                                        contentUrl: 'ahzj/kccs/templates/changeOrderDialog.html'
                                    }, $scope);


                                }
                            });
                        },


                        removePerfectDetailDialog: function () {
                            hbBasicData.removePerfectDetailDialog();
                        },

                        cancelEditReceive: function () {

                            $scope.model.receiverName = $scope.copyReceiverName;
                            $scope.model.mobileNo = $scope.copyMobileNo;
                            $scope.model.addressDetails = $scope.copyAddressDetails;
                            $scope.model.cityId = $scope.copyCityId;
                            $scope.model.districtId = $scope.copyDistrictId;
                            $scope.model.postCode = $scope.copyPostCode;

                            $scope.model.editTakeAddress = false;
                        },

                        saveReceive: function () {
                            if (hbUtil.validateIsNull($scope.model.receiverName)) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请填写收货人'
                                });
                                return false;
                            }
                            //^[\d]{11}$/
                            if (hbUtil.validateIsNull($scope.model.mobileNo)) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请填写手机号码'
                                });
                                return false;
                            }

                            if (/^[\d]{11}$/.test($scope.model.mobileNo) === false) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请填写11位手机号'
                                });
                                return false;
                            }

                            if (hbUtil.validateIsNull($scope.model.districtId)) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请选择所在地区'
                                });
                                return false;
                            }


                            if (hbUtil.validateIsNull($scope.model.postCode)) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请填写邮政编码'
                                });
                                return false;
                            }

                            if (/^[\d]{6}$/.test($scope.model.postCode) === false) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请填写6位邮政编码'
                                });
                                return false;
                            }


                            if (hbUtil.validateIsNull($scope.model.addressDetails)) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请填写详细地址'
                                });
                                return false;
                            }


                            if ($scope.submitAble) {
                                return false;
                            }
                            $scope.submitAble = true;
                            $http.post('/web/front/userSetting/updateUserReceive', {
                                id: $scope.model.id,
                                receiverName: $scope.model.receiverName,
                                postCode: $scope.model.postCode,
                                mobileNo: $scope.model.mobileNo,
                                provinceId: $scope.model.provinceId,
                                cityId: $scope.model.cityId,
                                districtId: $scope.model.districtId,
                                addressDetails: $scope.model.addressDetails
                            }).success(function (data) {
                                $scope.submitAble = false;
                                if (data.status) {
                                    $dialog.alert({
                                        title: '提示',
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '保存收货信息成功！'
                                    });
                                    //保存成功后把服务端给的收货ID赋值
                                    $scope.model.id = data.info.id;

                                    //用于显示的省市区中文
                                    getAreaChinese(data);

                                    //更改收货地址成功后再复制一下
                                    copyReceiveObj();
                                    $scope.model.editTakeAddress = false;
                                }
                            });


                        },

                        changeCity: function (cityId) {
                            $scope.model.districtId = '';
                            $scope.model.quList = [];

                            if (hbUtil.validateIsNull(cityId)) {
                                return false;
                            }

                            $http.get('/web/login/login/findRegion', {params: {parentId: cityId}}).success(function (data) {
                                if (data.status) {
                                    $scope.model.quList = data.info;
                                }
                            });
                        },

                        editIncoice: function () {

                            //复制发票相关的
                            $scope.copyNeedInvoice = angular.copy($scope.model.needInvoice);
                            $scope.copyInvoiceType = angular.copy($scope.model.invoiceType);
                            $scope.copyInvoiceTitleType = angular.copy($scope.model.invoiceTitleType);
                            $scope.copyInvoiceTitle = angular.copy($scope.model.invoiceTitle);//发票抬头
                            $scope.copyTaxpayerNo = angular.copy($scope.model.taxpayerNo);//纳税人识别码
                            //增值税发票的独有选项
                            $scope.copyBankName = angular.copy($scope.model.bankName);//银行
                            $scope.copyAccount = angular.copy($scope.model.account);//账号
                            $scope.copyUnitPhone = angular.copy($scope.model.unitPhone);//手机
                            $scope.copyUnitAddress = angular.copy($scope.model.unitAddress);//地址
                            //增值税发票的独有选项

                            $scope.model.editInvoice = true;
                        },


                        cacelSaveIncoice: function () {
                            //还原
                            $scope.model.needInvoice = $scope.copyNeedInvoice;
                            $scope.model.invoiceType = $scope.copyInvoiceType;
                            $scope.model.invoiceTitleType = $scope.copyInvoiceTitleType;
                            $scope.model.invoiceTitle = $scope.copyInvoiceTitle;
                            $scope.model.taxpayerNo = $scope.copyTaxpayerNo;


                            $scope.model.bankName = $scope.copyBankName;
                            $scope.model.account = $scope.copyAccount;
                            $scope.model.unitPhone = $scope.copyUnitPhone;
                            $scope.model.unitAddress = $scope.copyUnitAddress;

                            $scope.model.editInvoice = false;
                        },

                        saveIncoice: function () {

                            //需要发票才去校验
                            if ($scope.model.needInvoice === 'true') {


                                if (hbUtil.validateIsNull($scope.model.invoiceTitle) && $scope.model.invoiceType !== 'VAT_ONLY') {
                                    $dialog.alert({
                                        title: '提示',
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '请填写发票抬头'
                                    });
                                    return false;
                                }


                                if (hbUtil.validateIsNull($scope.model.invoiceTitle) && $scope.model.invoiceType === 'VAT_ONLY') {
                                    $dialog.alert({
                                        title: '提示',
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '请填写单位名称'
                                    });
                                    return false;
                                }


                                //单位并且不是增值税发票的时候才去校验识别码
                                if ($scope.model.invoiceTitleType !== 'PERSONAL' && $scope.model.invoiceType !== 'VAT_ONLY' && $scope.model.invoiceType !== 'NON_TAX') {
                                    if (hbUtil.validateIsNull($scope.model.taxpayerNo)) {
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: '请填写纳税人识别码'
                                        });
                                        return false;
                                    }
                                }


                                //增值税发票的时候校验
                                if ($scope.model.invoiceType === 'VAT_ONLY') {
                                    if (hbUtil.validateIsNull($scope.model.taxpayerNo)) {
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: '请填写纳税人识别码'
                                        });
                                        return false;
                                    }


                                    if (hbUtil.validateIsNull($scope.model.bankName)) {
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: '请填写开户银行'
                                        });
                                        return false;
                                    }

                                    if (hbUtil.validateIsNull($scope.model.account)) {
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: '请填写开户账号'
                                        });
                                        return false;
                                    }

                                    if (hbUtil.validateIsNull($scope.model.unitPhone)) {
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: '请填写单位注册电话'
                                        });
                                        return false;
                                    }

                                    if (hbUtil.validateIsNull($scope.model.unitAddress)) {
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: '请填写单位地址'
                                        });
                                        return false;
                                    }

                                }


                            } else {

                            }


                            $scope.model.editInvoice = false;
                            $scope.hasEditInvoice = true;
                        },


                        changeTitleType: function (type) {
                            if ($scope.model.invoiceTitleType === type) {
                                return false;
                            }

                            $scope.model.invoiceTitleType = type;

                            if ($scope.model.invoiceTitleType === 'PERSONAL') {
                                $scope.model.taxpayerNo = '';
                            }

                            //切换的时候会把抬头内容设置为空
                            $scope.model.invoiceTitle = '';
                        },

                        choseTakeAddress: function (item) {
                            console.log(item.id);
                            $scope.model.selfStorageId = item.id;
                        },

                        submit: function () {


                            //不为电子发票并且不提供邮寄不提供自取的没办法提交
                            if ($scope.model.needInvoice !== 'false' && $scope.model.invoiceType !== 'COMMON_ELECTRON' && !$scope.model.post && !$scope.model.pickUp) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '系统未配置配送方式！'
                                });
                                return false;
                            }


                            //非0元订单，提供发票 并且 处于编辑发票状态才提示
                            if ($scope.model.total !== 0 && $scope.model.isProvide === 2 && $scope.model.editInvoice) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请先完成编辑发票信息后再进行提交订单'
                                });
                                return false;
                            }

                            if ($scope.model.invoiceType !== 'COMMON_ELECTRON' && $scope.model.needInvoice !== 'false' && $scope.model.userTake !== '2') {
                                if ($scope.model.editTakeAddress) {
                                    $dialog.alert({
                                        title: '提示',
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '请先完成编辑收货信息后再进行提交订单'
                                    });
                                    return false;
                                }
                            }


                            if ($scope.model.invoiceType !== 'COMMON_ELECTRON' && $scope.model.userTake === '2' && hbUtil.validateIsNull($scope.model.selfStorageId)) {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请选择自取点'
                                });
                                return false;
                            }


                            //invoiceTitleType为‘electron’时electron为true否则false


                            var invoiceConfig = {
                                needInvoice: $scope.model.needInvoice,
                                invoiceType: $scope.model.invoiceType,
                                invoiceTitleType: $scope.model.invoiceTitleType,
                                taxpayerNo: $scope.model.taxpayerNo,
                                invoiceTitle: $scope.model.invoiceTitle,
                                deliverType: $scope.model.userTake,
                                selfStorageId: $scope.model.selfStorageId,
                                receiveAddressId: $scope.model.id,
                                phone: $scope.model.mobileNo
                            };


                            //如果是增值费发票要多传这些
                            if ($scope.model.invoiceType === 'VAT_ONLY') {
                                invoiceConfig.bankName = $scope.model.bankName;
                                invoiceConfig.account = $scope.model.account;
                                invoiceConfig.unitPhone = $scope.model.unitPhone;
                                invoiceConfig.unitAddress = $scope.model.unitAddress;
                            }


                            //如果是电子发票 需要把收货方式改成0
                            if ($scope.model.invoiceType === 'COMMON_ELECTRON') {
                                invoiceConfig.deliverType = 0;
                            }

                            //0元订单设置成不需要发票
                            if ($scope.model.total === 0) {
                                invoiceConfig.needInvoice = 'false';
                            }

                            //如果不提供发票或者选择了不需要发票做得特殊处理(收货方式变为0)
                            if ($scope.model.isProvide === 1 || invoiceConfig.needInvoice === 'false') {
                                invoiceConfig.deliverType = 0;
                            }

                            console.log(invoiceConfig);
                            $scope.submitAble = true;
                            $http.post('/web/front/studentOrder/applyOrderInvoice/' + $scope.model.orderNo, invoiceConfig).success(function (data) {
                                $scope.submitAble = false;
                                if (data.code === '200') {
                                    $dialog.alert({
                                        title: '提示',
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '完善订单信息成功！'
                                    });


                                    //关闭完善详情窗口
                                    $scope.events.removePerfectDetailDialog();
                                    //刷新需要完善的列表
                                    hbBasicData.findPerfectOrderList(true);
                                } else {
                                    $dialog.alert({
                                        title: '提示',
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: data.message
                                    });
                                }
                            });
                        }

                    };


                    $http.post('/web/front/distribution/findDeliveryMode').success(function (data) {
                        console.log(data);
                        if (data.status) {
                            $scope.model.post = data.info.post;
                            $scope.model.pickUp = data.info.pickUp;


                            /**
                             * 邮寄和自取都支持的情况下默认选中邮寄
                             * 支持邮寄 不支持自取情况下默认选中邮寄
                             * 支持自取 不支持邮寄情况下默认选中自取
                             */
                            if ($scope.model.post && $scope.model.pickUp) {
                                $scope.model.userTake = '1';
                            } else if ($scope.model.post && !$scope.model.pickUp) {
                                $scope.model.userTake = '1';
                            } else if (!$scope.model.post && $scope.model.pickUp) {
                                $scope.model.userTake = '2';
                            }


                        }


                    });


                    $http.get('/web/front/studentOrder/getAssociatedOrder/' + $scope.model.orderNo).success(function (data) {
                        $scope.submitAble = false;
                        if (data.status) {
                            console.log(data);
                            $scope.model.derivativeOrderList = data.info.derivativeOrderList;
                            $scope.model.initialOrder = data.info.initialOrder;
                        }
                    });


                    function getOrderDetail () {
                        $scope.lwhLoading = true;
                        $http.get('/web/front/studentOrder/get/' + $scope.model.orderNo).success(function (data) {
                            $scope.lwhLoading = false;
                            if (data.status) {
                                $scope.model.detailInfo = data.info;
                                $scope.model.total = getTotal();
                                console.log($scope.model.total);
                            }
                        });
                    }

                    getOrderDetail();


                    //获取默认选中的发票方式
                    function getFirstInvoiceType () {
                        var filterObj = {
                            COMMON_VAT: $scope.model.selectCommonVAT,
                            COMMON_ELECTRON: $scope.model.selectCommonElectron,
                            VAT_ONLY: $scope.model.selectVATOnly,
                            NON_TAX: $scope.model.selectNonTax
                        }, firstInvoiceType = '';
                        console.log(filterObj);

                        for (var key in filterObj) {
                            if (filterObj[key]) {
                                firstInvoiceType = key;
                                return firstInvoiceType;
                            }
                        }
                        //console.log($scope.model.adminHasChoseInvoiceConfig);
                    }

                    //获取默认的发票抬头
                    function getDefaultTitleType () {
                        var titleType = '';
                        if ($scope.model.selectPersonal && $scope.model.selectUnit) {
                            titleType = 'PERSONAL';
                            return titleType;
                        }
                        if ($scope.model.selectPersonal && !$scope.model.selectUnit) {
                            titleType = 'PERSONAL';
                            return titleType;
                        }
                        if (!$scope.model.selectPersonal && $scope.model.selectUnit) {
                            titleType = 'UNIT';
                            return titleType;
                        }
                    }

                    //1不提供发票 2提供发票(获取后台发票配置)
                    $http.get('/web/front/paymentChannel/getBillConfigByPaymentChannel', {params: {placeChannelEnum: 'PRESENT'}}).success(function (data) {
                        if (data.status) {
                            $scope.model.isProvide = data.info.isProvide;
                            //是否选择了纸制发票
                            $scope.model.selectCommonVAT = data.info.selectCommonVAT;
                            //是否选择普通电子发票
                            $scope.model.selectCommonElectron = data.info.selectCommonElectron;
                            //是否选择增值税发票
                            $scope.model.selectVATOnly = data.info.selectVATOnly;
                            //是否选择非税务票（目前没用到）
                            $scope.model.selectNonTax = data.info.selectNonTax;

                            //是否选择了个人
                            $scope.model.selectPersonal = data.info.selectPersonal;
                            //是否选择了单位
                            $scope.model.selectUnit = data.info.selectUnit;


                            //获取默认选中的发票类型
                            $scope.model.invoiceType = getFirstInvoiceType();
                            console.log($scope.model.invoiceType);
                            //获取默认选中的发票抬头
                            $scope.model.invoiceTitleType = getDefaultTitleType();
                            //console.log($scope.model.invoiceTitleType);


                            //console.log($scope.model);
                            //是否强制提供发票 1不强制 2强制 如果强制前端选择不需要发票不能提交
                            $scope.model.provideType = data.info.provideType;
                            if ($scope.model.provideType === 2) {
                                $scope.model.needInvoice = 'true';
                            }


                        }
                    });


                    //获取市
                    $http.get('/web/login/login/findRegion', {params: {parentId: ''}}).success(function (data) {
                        if (data.status) {
                            $scope.model.shiList = data.info;
                        }
                    });

                    //获取自取点
                    $http.get('/web/front/distribution/listSelfStorage', {params: {type: undefined}}).success(function (data) {
                        if (data.status) {
                            $scope.model.selfTakeAddress = data.info;
                            if (data.info.length > 0) {
                                $scope.model.selfStorageId = data.info[0].id;
                            }
                        }
                    });

                    //获取收货信息
                    $http.get('/web/front/userSetting/getUserReceive').success(function (data) {
                        if (data.status) {
                            console.log(data.info);
                            $scope.model.id = data.info.id;
                            $scope.model.receiverName = data.info.receiverName;
                            $scope.model.mobileNo = data.info.mobileNo;
                            $scope.model.addressDetails = data.info.addressDetails;
                            $scope.model.cityId = data.info.cityId;
                            $scope.model.districtId = data.info.districtId;
                            $scope.model.postCode = data.info.postCode;

                            //用于显示的省市区中文
                            getAreaChinese(data);

                            //用市ID去查地区列表
                            if ($scope.model.cityId !== null) {

                                $scope.model.editTakeAddress = false;

                                $http.get('/web/login/login/findRegion', {params: {parentId: $scope.model.cityId}}).success(function (data) {
                                    if (data.status) {
                                        $scope.model.quList = data.info;
                                    }
                                });
                            } else {
                                //如果一次都没编辑过收货地址默认是编辑状态
                                $scope.model.editTakeAddress = true;
                            }

                            copyReceiveObj();
                        }
                    });

                    function getAreaChinese (data) {
                        $scope.model.province = data.info.province;
                        $scope.model.city = data.info.city;
                        $scope.model.district = data.info.district;
                    }

                    function copyReceiveObj () {
                        $scope.copyReceiverName = angular.copy($scope.model.receiverName);
                        $scope.copyMobileNo = angular.copy($scope.model.mobileNo);
                        $scope.copyAddressDetails = angular.copy($scope.model.addressDetails);
                        $scope.copyCityId = angular.copy($scope.model.cityId);
                        $scope.copyDistrictId = angular.copy($scope.model.districtId);
                        $scope.copyPostCode = angular.copy($scope.model.postCode);
                    }


                    function getTotal () {
                        var total = 0;
                        angular.forEach($scope.model.detailInfo.subOrderList, function (item) {
                            total = accAdd(total, item.dealPrice);
                        });
                        return total;
                    }

                    function accAdd (arg1, arg2) {
                        var r1, r2, m;
                        try {
                            r1 = arg1.toString().split('.')[1].length;
                        } catch (e) {
                            r1 = 0;
                        }
                        try {
                            r2 = arg2.toString().split('.')[1].length;
                        } catch (e) {
                            r2 = 0;
                        }
                        m = Math.pow(10, Math.max(r1, r2));
                        return (arg1 * m + arg2 * m) / m;
                    }


                }
            };
        }]


    };


});