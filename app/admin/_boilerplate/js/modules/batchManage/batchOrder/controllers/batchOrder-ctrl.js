define(function (detail) {
    "use strict";
    return {
        indexCtrl: ["$scope", 'hbUtil', '$interval', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'batchManageServices', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification', 'TabService', 'hbSkuService',
            function ($scope, hbUtil, $interval, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, batchManageServices, $stateParams, $http, $q, HB_dialog, $state, HB_notification, TabService, hbSkuService) {

                $scope.model = {
                    editInvoice: true,//默认是编辑发票状态
                    editTakeAddress: true,//默认是编辑收货地址状态
                    hasCompleteInvoice: true,
                    batchInfo: {
                        no: $stateParams.batchNo,
                        people: '',
                        totalMoney: ''
                    },
                    shiList: [],
                    quList: [],
                    selfTakeInfo: {},
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    },
                    selfStorageId: '',//自取点ID
                    needInvoice: 'false',//是否需要发票
                };
                $scope.kendoPlus = {
                    chosePeopleGridInstance: null,
                    classGridInstance: null,
                    choseClassGridInstance: null
                };
                $scope.events = {
                    choseTakeAddress: function (item) {
                        console.log(item.id);
                        $scope.model.selfStorageId = item.id;
                    },
                    saveReceive: function () {
                        if (hbUtil.validateIsNull($scope.model.receiverName)) {
                            HB_dialog.warning('提示', '请填写收货人');
                            return false;
                        }
                        //^[\d]{11}$/
                        if (hbUtil.validateIsNull($scope.model.mobileNo)) {
                            HB_dialog.warning('提示', '请填写手机号码');
                            return false;
                        }

                        if (/^[\d]{11}$/.test($scope.model.mobileNo) === false) {
                            HB_dialog.warning('提示', '请填写11位手机号');
                            return false;
                        }

                        if (hbUtil.validateIsNull($scope.model.districtId)) {
                            HB_dialog.warning('提示', '请选择所在地区');
                            return false;
                        }


                        if (hbUtil.validateIsNull($scope.model.postCode)) {
                            HB_dialog.warning('提示', '请填写邮政编码');
                            return false;
                        }

                        if (/^[\d]{6}$/.test($scope.model.postCode) === false) {
                            HB_dialog.warning('提示', '请填写6位邮政编码');
                            return false;
                        }


                        if (hbUtil.validateIsNull($scope.model.addressDetails)) {
                            HB_dialog.warning('提示', '请填写详细地址');
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
                                HB_dialog.success('提示', '保存收货信息成功');
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
                                HB_dialog.warning('提示', '请填写发票抬头');
                                return false;
                            }


                            if (hbUtil.validateIsNull($scope.model.invoiceTitle) && $scope.model.invoiceType === 'VAT_ONLY') {
                                HB_dialog.warning('提示', '请填写单位名称');
                                return false;
                            }


                            //单位并且不是增值税发票的时候才去校验识别码
                            if ($scope.model.invoiceTitleType !== 'PERSONAL' && $scope.model.invoiceType !== 'VAT_ONLY' && $scope.model.invoiceType !== 'NON_TAX') {
                                if (hbUtil.validateIsNull($scope.model.taxpayerNo)) {

                                    HB_dialog.warning('提示', '请填写纳税人识别码');
                                    return false;
                                }
                            }


                            //增值税发票的时候校验
                            if ($scope.model.invoiceType === 'VAT_ONLY') {
                                if (hbUtil.validateIsNull($scope.model.taxpayerNo)) {
                                    HB_dialog.warning('提示', '请填写纳税人识别码');
                                    return false;
                                }


                                if (hbUtil.validateIsNull($scope.model.bankName)) {
                                    HB_dialog.warning('提示', '请填写开户银行');
                                    return false;
                                }

                                if (hbUtil.validateIsNull($scope.model.account)) {
                                    HB_dialog.warning('提示', '请填写开户账号');
                                    return false;
                                }

                                if (hbUtil.validateIsNull($scope.model.unitPhone)) {
                                    HB_dialog.warning('提示', '请填写单位注册电话');
                                    return false;
                                }

                                if (hbUtil.validateIsNull($scope.model.unitAddress)) {
                                    HB_dialog.warning('提示', '请填写单位地址');
                                    return false;
                                }

                            }

                            console.log($scope.model.invoiceType);

                        } else {

                        }


                        $scope.model.editInvoice = false;
                        $scope.hasEditInvoice = true;
                    },
                    editInvoice: function () {
                        $scope.model.hasCompleteInvoice = true;
                        $scope.copyTakeGoodsInfo = angular.copy($scope.model.takeGoodsInfo);
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
                    MainPageQueryList: function (e, gridName, pageName) {
                        e.stopPropagation ();
                        $scope.model[pageName].pageNo = 1;
                        $scope.kendoPlus[gridName].pager.page (1);
                    },
                    commit: function () {

                        //不为电子发票并且不提供邮寄不提供自取的没办法提交
                        if ($scope.model.needInvoice !== 'false' && $scope.model.invoiceType !== 'COMMON_ELECTRON' && !$scope.model.post && !$scope.model.pickUp) {
                            HB_dialog.warning('提示','系统未配置配送方式！');
                            return false;
                        }


                        //非0元订单，提供发票 并且 处于编辑发票状态才提示
                        if ($scope.model.batchInfo.totalMoney !== 0 && $scope.model.isProvide === 2 && $scope.model.editInvoice) {
                            HB_dialog.warning('提示','请先完成编辑发票信息后再进行提交订单');
                            return false;
                        }

                        if ($scope.model.invoiceType !== 'COMMON_ELECTRON' && $scope.model.needInvoice !== 'false' && $scope.model.userTake !== '2') {
                            if ($scope.model.editTakeAddress) {
                                HB_dialog.warning('提示','请先完成编辑收货信息后再进行提交订单');
                                return false;
                            }
                        }


                        if ($scope.model.invoiceType !== 'COMMON_ELECTRON' && $scope.model.userTake === '2' && hbUtil.validateIsNull($scope.model.selfStorageId)) {
                            HB_dialog.warning('提示','请选择自取点');
                            return false;
                        }


                        $scope.submitAble = true;

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
                        if ($scope.model.batchInfo.totalMoney === 0) {
                            invoiceConfig.needInvoice = 'false';
                        }

                        //如果不提供发票或者选择了不需要发票做得特殊处理(收货方式变为0)
                        if ($scope.model.isProvide === 1 || invoiceConfig.needInvoice === 'false') {
                            invoiceConfig.deliverType = 0;
                        }

                        batchManageServices.commitBatch($stateParams.batchNo, {
                            invoiceConfig: invoiceConfig
                        }).then(function (data) {
                            if (data.status) {
                                $scope.startTime = 5;
                                HB_dialog.contentAs($scope, {
                                    title: '提示',
                                    width: 350,
                                    height: 170,
                                    showCancel: false,
                                    showCertain: true,
                                    templateUrl: '@systemUrl@/views/batchManage/diaLog.html'
                                });
                                var timer = $interval(function () {
                                    $scope.startTime--;
                                    if ($scope.startTime < 1) {
                                        $state.go('states.batchManage', {}).then (function () {
                                            $scope.model.page.pageNo = 1;
                                            $scope.node.unitbatchGrid.pager.page (1);
                                        });
                                        $interval.cancel(timer);
                                    }
                                    ;
                                }, 1000);
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        }, function (data) {
                            HB_dialog.error('提示', data.data.info);
                        })
                    },
                }


                //=============分页开始=======================
                var gridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ('<tr>');
                    result.push ('<td>');
                    result.push ('<div>');
                    result.push ('<img style="width:100px;height:64px;float:left;padding: 5px"  ng-src="#: commodity.commodityImg #" alt=" ">');
                    result.push ('<span style="float: left;margin-top: 10px;padding-left: 10px">#: commodity.commodityName #</span><br><br>');
                    result.push ('<div style="float: left;padding-left: 10px;font-size: 12px;color:gray;" ng-if="dataItem.commodity" ng-repeat="item in dataItem.commodity.skuPropertyNameList">');
                    result.push ('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                    result.push ('<br />');
                    result.push ('</div>');
                    result.push ('</div>');
                    result.push ('</td>');

                    result.push ('<td>');
                    result.push ('<p>姓名：#: buyer.name #</p>');
                    result.push ('<p>身份证：#: buyer.uniqueData #</p>');
                    result.push ('</td>');


                    result.push ('<td>');
                    result.push ('1');
                    result.push ('</td>');

                    result.push ('<td>');
                    result.push ('#: commodity.price #');
                    result.push ('</td>');


                    result.push ('</td>');

                    result.push ('</tr>');
                    gridRowTemplate = result.join ('');
                })();


                $scope.ui = {
                    createbatchGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template (gridRowTemplate),
                            scrollable: false,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: "/web/admin/batchOrderAction/findBatchListPage/" + $scope.model.batchInfo.no,
                                        data: function (e) {
                                            var temp = {}, params = $scope.model.batchParams;

                                            temp.pageNo = e.page;
                                            temp.pageSize = $scope.model.page.pageSize;

                                            for (var key in params) {
                                                if (params.hasOwnProperty (key)) {
                                                    if (params[key]) {
                                                        temp[key] = params[key];

                                                    }
                                                }
                                            }
                                            delete   temp.trainClassName;
                                            return temp;
                                        },
                                        dataType: 'json'
                                    }

                                },
                                pageSize: 10, // 每页显示的数据数目
                                schema: {
                                    parse: function (response) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if (response.status) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach (dataview, function (item) {
                                                item.index = index++;
                                            });
                                        }
                                        return response;
                                    },
                                    total: function (response) {
                                        return response.totalSize;
                                    },
                                    data: function (response) {
                                        var data = $scope.model.userParams;
                                        // 重置跟分页相关的缓存参数
                                        /*if ( data.createBeginDate ) {
                                         data.createBeginDate = data.createBeginDate.replace ( /\//g, '-' );
                                         }
                                         if ( data.createEndDate ) {
                                         data.createEndDate = data.createEndDate.replace ( /\//g, '-' );
                                         }
                                         $scope.$apply ();*/

                                        return response.info;
                                    } // 指定数据源
                                },
                                serverPaging: true, //远程获取书籍
                                serverSorting: true //远程排序字段
                            },
                            selectable: true,
                            sortable: {
                                mode: "single",
                                allowUnsort: false
                            },
                            dataBinding: function (e) {
                                $scope.model.gridReturnData = e.items;
                                kendoGrid.nullDataDealLeaf (e);
                            },
                            pageable: {
                                refresh: true,
                                pageSizes: [5, 10, 30, 50] || true,
                                pageSize: 10,
                                buttonCount: 10
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns: [
                                {sortable: false, title: "培训班信息"},
                                {sortable: false, title: "学员信息", width: 250},
                                {sortable: false, title: "数量", width: 150},
                                {sortable: false, title: "金额", width: 150}
                            ]
                        }
                    }
                };
                $scope.ui.createbatchGrid.options = _.merge ({}, KENDO_UI_GRID, $scope.ui.createbatchGrid.options);

                /* batchManageServices.findUserBatchPage({
                 batchNo:$stateParams.batchNo}
                 ).then(function(data){
                 $scope.model.batchInfo = data.info[0];
                 })*/
                batchManageServices.findBatchDetail({
                        batchNo: $stateParams.batchNo
                    }
                ).then(function (data) {
                    $scope.model.batchDetail = data.info;
                    $scope.model.batchInfo = data.info;
                });


                //1不提供发票 2提供发票
                $http.get('/web/front/paymentChannel/getBillConfigByPaymentChannel', {params: {placeChannelEnum: 'COLLECTIVE'}}).success(function (data) {
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
                $http.get('/web/front/userSetting/getUserReceive')

                    .success(function (data) {
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

                $http.get('/web/front/distribution/listSelfStorage', {params: {type: undefined}}).success(function (data) {
                    if (data.status) {
                        $scope.selfStorage = data.info;
                        if (data.info.length > 0) {
                            $scope.model.selfStorageId = data.info[0].id;
                        }
                    }
                });
                //用ID去查找市 区名
                function findSome(id, arr) {
                    var some = null;
                    angular.forEach(arr, function (item, index) {
                        if (item.id === id) {
                            some = item.name;
                        }
                    });
                    return some;
                }

                //获取默认选中的发票方式
                function getFirstInvoiceType() {
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
                }


                //获取默认的发票抬头
                function getDefaultTitleType() {
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

                function getAreaChinese(data) {
                    $scope.model.province = data.info.province;
                    $scope.model.city = data.info.city;
                    $scope.model.district = data.info.district;
                }

                function copyReceiveObj() {
                    $scope.copyReceiverName = angular.copy($scope.model.receiverName);
                    $scope.copyMobileNo = angular.copy($scope.model.mobileNo);
                    $scope.copyAddressDetails = angular.copy($scope.model.addressDetails);
                    $scope.copyCityId = angular.copy($scope.model.cityId);
                    $scope.copyDistrictId = angular.copy($scope.model.districtId);
                    $scope.copyPostCode = angular.copy($scope.model.postCode);
                }

            }]
    }
});