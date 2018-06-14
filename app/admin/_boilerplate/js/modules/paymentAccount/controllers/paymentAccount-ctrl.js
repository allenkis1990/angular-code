define(
    function () {
        'use strict';
        return {
            indexCtrl: ['$rootScope','$scope','kendo.grid', 'KENDO_UI_GRID', 'paymentAccountService', 'HB_notification', 'HB_dialog', '$state', 'TabService',
                function ($rootScope,$scope,kendoGrid, KENDO_UI_GRID, paymentAccountService, HB_notification, HB_dialog, $state, TabService) {
                    
                    $scope.flagModel = {
                        tabType :"OWN",
                        invoiceConfigState:"VIEW",
                        authorizeManagerTab:"ASSIGN",
                        showAuthorizeManagerDialog:false,
                        clickType  : -1,    //发票配置窗口触发类型  1.编辑发票配置  2.查看开票规则
                        viewProjectFirst : true,
                    };
                    $scope.params    = {
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
                    $scope.model     = {
                        currentAccountId  :"",//当前点击的账户id
                        paymentAccountList: [],
                        unitQuery         :{
                            unitName:""
                        },
                        authorizeQuery:{
                            rangeType:null,
                            belongsType:null,
                            authorizeToUnitId:null,
                            authorizedFromUnitId:null,
                            objectId:null,
                            targetUnitId:null
                        },
                        billConfig        : {
                            id: '',//发票配置ID
                            isProvide: 1,//是否提供发票
                            provideType: -1,//发票提供方式 1开放自选 2 强制提供
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
                        notProvide        : false,
                        toBeAuthorizeUnitList         :[],//准备取消授权的单位集合
                        toBeCancelAuthorizeUnitIdList :[],//准备授权的单位id集合
                        hasAuthorizeUnitList          :[],//已授权单位
                    };

                    $scope.node      = {
                        unitGridInstance:null,
                        unAuthorizeUnitGrid:null,
                    };

                    $scope.events    = {
                        isSubProjectManager :function () {
                            var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                            return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                        },
                        tabClick:function (e,type) {
                            $scope.flagModel.tabType = type;
                            if (type === 'OWN'){
                                $scope.model.authorizeQuery.targetUnitId= '';
                            }
                        },
                        search  :function () {
                            this.accountList();
                        },
                        isOpenTaxPayerChoose: function () {
                            paymentAccountService.findElectronInvoiceSupport().then(function (data) {
                                $scope.params.realSupportIssuingElectronInvoice = data.info.realSupportIssuingElectronInvoice;
                            });
                        },
                        findTaxPayerList : function () {
                            paymentAccountService.findTaxPayerList().then(function (data) {
                                $scope.params.taxPayerList = data.info;
                            });
                        },
                        accountList      : function () {
                            var query         = {};
                            query.unitId      = $scope.model.authorizeQuery.targetUnitId;
                            query.searchRange = $scope.flagModel.tabType;
                            query.authorizeQuery = $scope.model.authorizeQuery;
                            console.log(query);
                            paymentAccountService.accountList(query).then(function (data) {
                                $scope.model.paymentAccountList = data.info;
                            });

                        },
                        enabled          : function (item) {
                            HB_notification.confirm('是否启用该账号', function (dialog) {
                                return paymentAccountService.enabled(item.id).then(function (data) {
                                    dialog.doRightClose();
                                    if (data.status) {
                                        HB_dialog.success('提示', '启用成功');
                                        $state.reload($state.current.name);
                                    } else {
                                        HB_dialog.error('提示', data.info);
                                    }
                                });
                            });

                        },
                        delete           : function (item) {
                            if (item.status === 0) {
                                HB_notification.confirm('是否删除该账号', function (dialog) {
                                    return paymentAccountService.delete(item.id).then(function (data) {
                                        dialog.doRightClose();
                                        if (data.status) {
                                            HB_dialog.success('提示', '删除成功');
                                            $state.reload($state.current.name);
                                        } else {
                                            HB_dialog.error('提示', data.info);
                                        }
                                    });
                                });
                            } else {
                                HB_notification.alert('删除收款帐号，需将帐号暂停开放使用，才可删除！', function (dialog) {
                                });
                            }

                        },
                        disabled         : function (item) {
                            $scope.currentAccountId = item.id;
                            HB_dialog.contentAs($scope, {
                                title: '停用收款账号提示',
                                width: 650,
                                height: 300,
                                showCancel: false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/paymentAccount/disableTip.html'
                            });
                        },
                        update           : function (item) {
                            $scope.model.upload = {
                                    result: {
                                        filename: ''
                                    }
                            };
                            if (item.status === 0) {
                                paymentAccountService.allowUpdatePaymentAccount(item.id).then(function (data) {
                                    if (data.code !== 200) {
                                        //HB_dialog.error('提示', data.info);
                                        HB_notification.alert(data.info, function (dialog) {
                                            dialog.doRightClose();
                                        });
                                    } else {
                                             paymentAccountService.findMerchantAccount(item.id).then(function (data) {
                                                $scope.params = data.info;
                                                $scope.model.upload.result.fileName = data.info.privateKeyFileName;
                                                $scope.events.findTaxPayerList();
                                                $scope.events.isOpenTaxPayerChoose();
                                                $scope.params.oldTaxPayerId = $scope.params.taxPayerId;
                                                $state.go('states.paymentAccount.paymentUpdate');
                                            });
                                    }
                                });


                            } else {
                                HB_notification.alert('修改收款帐号，需将帐号暂停开放使用，才可修改！', function (dialog) {

                                });
                            }
                            $scope.events.accountList();

                        },
                        detail           : function (item) {

                            paymentAccountService.findMerchantAccount(item.id).then(function (data) {
                                $scope.params = data.info;
                                $scope.events.isOpenTaxPayerChoose();
                                $state.go('states.paymentAccount.paymentDetail');
                            });
                        },
                        //确定停用收款账号
                        sureDisabled     : function (index) {
                            paymentAccountService.disabled( $scope.currentAccountId ).then(function (data) {
                                HB_dialog.closeDialogByIndex ( $scope, index );
                                if (data.status) {
                                    HB_dialog.success('提示', '停用成功');
                                    $state.reload($state.current.name);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            })
                        },
                        //选择查询单位
                        popUnitDialog    : function () {
                            $scope.node.windows.addWindow.center().open();
                        },
                        //关闭单位弹出框
                        cancel           : function (e) {
                            e.preventDefault();
                            $scope.node.windows.addWindow.close();
                        },
                        //选中查询单位
                        selectViewUnit               : function (item) {
                            $scope.model.accountQuery.unitId = item.unitId;
                            $scope.model.accountQuery.unitName = item.unitName;
                            $scope.node.windows.addWindow.close();
                        },
                        //取消选中查询单位
                        cancelViewUnit               : function () {
                            $scope.model.accountQuery.unitId = '';
                            $scope.model.accountQuery.unitName ='';
                        },
                        //查询项目单位
                        searchViewUnit               : function (e) {
                            $scope.node.unitGridInstance.dataSource.page(1);
                        },
                        //弹出授权管理窗口
                        popAuthorizeUnitDialog       : function (item) {
                            $scope.model.currentAccountId = item.id;
                            $scope.node.unAuthorizeUnitGrid.dataSource.page(1);
                            $scope.node.windows.authorizeManagerWindow.center().open();
                        },
                        //弹出发票配置窗口
                        popInvoiceConfigDialog       : function (item) {
                            $scope.model.currentAccountId = item.id;
                            $scope.flagModel.clickType = 1;
                            paymentAccountService.getBillConfigByAccountId(item.id).then(function (data) {
                                if (data.status){
                                    $scope.model.billConfig = data.info;
                                }else {
                                    $scope.globle.alert("提示",data.info);
                                }
                            });
                            HB_dialog.contentAs($scope, {
                                title: '发票配置',
                                width: 750,
                                height: 350,
                                showCancel: false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/paymentAccount/invoiceConfigDialog.html'
                            });
                        },
                        //弹出账号开票规则详情窗口
                        popInvoiceDetailDialog       : function (item) {
                            paymentAccountService.getBillConfigByAccountId(item.id).then(function (data) {
                                if (data.status){
                                    $scope.model.billConfig = data.info;
                                }else {
                                    $scope.globle.alert("提示",data.info);
                                }
                            });
                            $scope.flagModel.clickType = 2;
                            HB_dialog.contentAs($scope, {
                                title: '开票规则',
                                width: 750,
                                height: 350,
                                showCancel: false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/paymentAccount/invoiceConfigDialog.html'
                            });
                        },

                        //弹出授权日志窗口
                        popAuthorizeRecordDialog     : function (item) {
                            paymentAccountService.listAuthorizeRecord(item.id).then(function (data) {
                                if (data.status){
                                    $scope.model.authorizeRecordList = data.info;
                                }else {
                                    $scope.globle.alert("提示",data.info);
                                }
                            });

                            HB_dialog.contentAs($scope, {
                                title      : '授权日志',
                                width      : 655,
                                height     : 530,
                                showCancel : false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/paymentAccount/AuthorizeRecordDialog.html'
                            });
                        },
                        //弹出发票配置日志窗口
                        popInvoiceConfigRecordDialog     : function () {
                            // console.log($scope.currentAccountId);
                            $scope.ui.invoiceConfigLogPager.dataSource.read ();
                            $scope.node.windows.invoiceConfigLogWindow.center().open();
                        },
                        //关闭授权管理弹出框
                        closeInvoiceConfigLogDialog  : function (e) {
                            e.preventDefault();
                            $scope.node.windows.invoiceConfigLogWindow.close();
                        },
                        //编辑发票配置
                        editInvoiceConfig            : function () {
                            $scope.flagModel.invoiceConfigState = 'EDIT'
                        },
                        //保存修改的发票配置
                        saveInvoiceConfig            : function () {
                            var billConfigDetail = {};

                            billConfigDetail = $scope.model.billConfig;

                            if (billConfigDetail.isProvide == 1 || billConfigDetail.isProvide == '1') {//不提供发票
                                //不提供发票
                                billConfigDetail.provideType = 0;

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
                                    };
                                }

                                if ($scope.model.billConfig.selectVATOnly && !$scope.model.billConfig.selectCommonVAT && !$scope.model.billConfig.selectCommonElectron && !$scope.model.billConfig.selectNonTax) {//只选了增值税专用发票
                                    billConfigDetail.selectPersonal = false;//是否选择了个人
                                    billConfigDetail.selectUnit = false;//是否选择了单位
                                }
                            }

                            billConfigDetail.accountId =  $scope.model.currentAccountId;
                            paymentAccountService.operaBillConfig(billConfigDetail).then(function (data) {
                                if (data.status && data.info) {
                                    $scope.flagModel.invoiceConfigState = 'VIEW';
                                    $scope.model.billConfig = angular.copy(billConfigDetail);
                                    // $scope.model.billConfig.id = data.info;
                                    $scope.globle.showTip('修改成功', 'success');
                                } else {
                                    $scope.globle.showTip('修改失败', 'error');
                                }
                            });
                        },
                        //取消编辑发票配置
                        cancelInvoiceConfig          : function () {
                            $scope.flagModel.invoiceConfigState = 'VIEW'
                        },
                        selectNotProvideBill         : function (type) {
                            if (type == 1) {
                                $scope.model.notProvide = false;
                            } else if (type == 2) {
                                $scope.model.notProvide = true;
                                $scope.model.billConfig.provideType = -1;
                            } else {
                                $scope.globle.alert('提示', '未知动作类型');
                            }
                        },
                        //取消授权
                        cancelAuthorizeToUnit        : function () {
                            var unitIdList = $scope.model.toBeCancelAuthorizeUnitIdList;

                            if(unitIdList.length == 0){
                                $scope.globle.alert("提示","请选择预取消授权的单位");
                                return;
                            }

                            $scope.globle.confirm ( "", "确定提交本次授权调整吗？", function ( dialog ) {
                                paymentAccountService.cancelAuthorizeToUnit({
                                        "accountId" :$scope.model.currentAccountId,
                                        "unitIdList":unitIdList
                                }).then(function (data) {
                                    if(data.status){
                                        $scope.globle.alert("提示","授权调整完成");
                                        $scope.events.switchAuthorizeManagerTab("ADJUST");
                                    }else {
                                        $scope.globle.alert("提示",data.info);
                                    }
                                })
                            } );
                        },
                        //分配授权
                        authorizeToUnit              : function () {

                            var temp = $scope.model.toBeAuthorizeUnitList;

                            if(temp.length == 0 ){
                                $scope.globle.alert("提示","请选择授权单位");
                                return;
                            }

                            var unitIdList = [];
                            angular.forEach(temp,function (data,index) {
                                unitIdList.push(data.unitId);
                            });
                            paymentAccountService.authorizeToUnit({
                                "accountId" : $scope.model.currentAccountId,
                                "unitIdList": unitIdList
                            }).then(function (data) {
                                if(data.status){
                                    $scope.globle.alert("提示","授权成功");
                                    $scope.model.toBeAuthorizeUnitList = [];
                                    $scope.node.unAuthorizeUnitGrid.dataSource.page(1);
                                }else {
                                    $scope.globle.alert("提示",data.info);
                                }

                            })

                        },
                        //关闭授权管理弹出框
                        closeAuthorizeManagerDialog  : function (e) {
                            e.preventDefault();
                            $scope.node.windows.authorizeManagerWindow.close();
                            $scope.flagModel.authorizeManagerTab = 'ASSIGN';
                            $scope.model.toBeAuthorizeUnitList = [];
                            $scope.model.toBeCancelAuthorizeUnitIdList = [];
                        },
                        //选中预授权的单位
                        selectToBeAuthorizeUnit      : function (item) {
                            $scope.model.toBeAuthorizeUnitList.push(item);
                        },
                        //移除预授权的单位
                        removeToBeAuthorizeUnit      : function (item) {
                            $scope.model.toBeAuthorizeUnitList.splice($scope.model.toBeAuthorizeUnitList.indexOf(item),1);
                        },
                        //选中预取消授权的单位
                        toggleCancelAuthorize: function (item) {
                            if ($scope.utils.isSelectToBeCancelAuthorize(item.unitId)){
                                $scope.model.toBeCancelAuthorizeUnitIdList.splice($scope.model.toBeCancelAuthorizeUnitIdList.indexOf(item.unitId),1);
                            }else {
                                $scope.model.toBeCancelAuthorizeUnitIdList.push(item.unitId);
                            }
                        },
                        //切换授权管理tab
                        switchAuthorizeManagerTab    :function (type) {
                            $scope.flagModel.authorizeManagerTab = type;
                            if(type =='ASSIGN'){
                                $scope.node.unAuthorizeUnitGrid.dataSource.page(1);
                            }else if(type=='ADJUST') {
                                paymentAccountService.listHasAuthorizeUnit($scope.model.currentAccountId).then(function (data) {
                                    if(data.status){
                                        $scope.model.hasAuthorizeUnitList = data.info;
                                    }else {
                                        $scope.globle.alert("提示",data.info);
                                    }
                                });
                            }else return;
                        },

                        initAllGrid:function(unitId){
                            $scope.model.authorizeQuery.targetUnitId  =  unitId;
                            if (unitId && $scope.flagModel.viewProjectFirst){
                                this.accountList();
                                $scope.flagModel.viewProjectFirst = false;
                            }
                        },

                    };
                    $scope.events.accountList();

                    $scope.utils     ={
                        //判断指定的单位id是否在选中的预授权的单位集合内
                        isSelectToBeAuthorize:function (item) {
                            //对象赋值，不能直接使用$.inArray，列表刷新之后会是新的对象，和之前本地保存的对象不一致，导致判断不相等
                            var isSelect = false;
                            angular.forEach($scope.model.toBeAuthorizeUnitList,function (data,index) {
                                if(data.unitId == item.unitId){
                                    isSelect = true;
                                }
                            });
                            return isSelect;
                        },
                        //判断指定的单位id是否在选中的预取消授权的单位集合内
                        isSelectToBeCancelAuthorize:function (unitId) {
                            return $.inArray(unitId,$scope.model.toBeCancelAuthorizeUnitIdList)>=0;
                        }
                    }

                    // 子项目管理员查看所有施教机构的表格配置
                    var unitGridTemplate = '';
                    (function () {
                        var result = [];
                        result.push('<tr>');

                        result.push('<td>');
                        result.push('#: index #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('#: unitName #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: region #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: contactMan #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<button class="table-btn" ng-show="model.accountQuery.unitId !== dataItem.unitId" ng-click="events.selectViewUnit(dataItem)">选择</button>');
                        result.push('<button class="table-btn" ng-show="model.accountQuery.unitId === dataItem.unitId"  ng-click="events.cancelViewUnit(dataItem)">取消选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        unitGridTemplate = result.join('');
                    })();

                    // 授权管理表格
                    var unAuthorizeUnitTemplate = '';
                    (function () {
                        var result = [];
                        result.push('<tr>');

                        result.push('<td>');
                        result.push('#: index #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('#: unitName #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: region #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: contactMan #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<button class="table-btn" ng-show="!utils.isSelectToBeAuthorize(dataItem)"  ng-click="events.selectToBeAuthorizeUnit(dataItem)">选择</button>');
                        result.push('<button class="table-btn" ng-show="utils.isSelectToBeAuthorize(dataItem)"  ng-click="events.removeToBeAuthorizeUnit(dataItem)">取消选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        unAuthorizeUnitTemplate = result.join('');
                    })();

                    $scope.ui={
                        windows: {
                            addWindow: {//添加窗口
                                modal: true,
                                visible: false,
                                resizable: false,
                                draggable: false,
                                title: false,
                                open: function () {
                                    this.center();
                                }
                            }
                        },
                        unitGrid: {
                            options: {
                                // 每个行的模板定义,
                                scrollable: false,
                                rowTemplate: kendo.template(unitGridTemplate),
                                dataBinding: function (e) {
                                    $scope.model.gridReturnData = e.items;
                                    kendoGrid.nullDataDealLeaf(e);
                                },
                                dataSource: {
                                    transport: {
                                        parameterMap: function (data, type) {
                                            var sortStr = '';
                                            if (type == 'read') {
                                                return {
                                                    'page.pageSize': data.pageSize,
                                                    'page.pageNo': data.page,
                                                    'query.unitName':$scope.model.unitQuery.unitName
                                                };
                                            }
                                        },
                                        read: {
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            url: '/web/admin/paymentAccount/pageViewUnit',
                                            dataType: 'json'
                                        }
                                    },
                                    schema: {
                                        parse: function (response, e) {
                                            if (response.status) {
                                                var dataview = response.info, index = 1;
                                                angular.forEach(dataview, function (item) {
                                                    item.index = index++;
                                                });
                                            }
                                            return response;
                                        },
                                        total: function (response) {
                                            return response.totalSize;
                                        },
                                        data: function (response) {
                                            return response.info;
                                        } // 指定数据源
                                    }
                                },
                                // 选中切换的时候改变选中行的时候触发的事件
                                pageable: {
                                    refresh: true,
                                    pageSizes: [5, 10, 30, 50],
                                    pageSize: 10,
                                    buttonCount: 10
                                },
                                columns: [
                                    {title: 'No.', field: 'index', width: 40},
                                    {title: '单位/机构名称', field: 'unitName', width: 250},
                                    {title: '所属地区', field: 'region', width: 150},
                                    {title: '联系人', field: 'contactMan', width: 50},
                                    {
                                        title: '操作', width: 70,
                                    }
                                ]
                            }
                        },
                        unAuthorizeUnitGrid: {
                            options: {
                                // 每个行的模板定义,
                                scrollable: false,
                                rowTemplate: kendo.template(unAuthorizeUnitTemplate),
                                dataBinding: function (e) {
                                    $scope.model.gridReturnData = e.items;
                                    kendoGrid.nullDataDealLeaf(e);
                                },
                                dataSource: {
                                    transport: {
                                        parameterMap: function (data, type) {
                                            var sortStr = '';
                                            if (type == 'read') {
                                                return {
                                                    'page.pageSize': data.pageSize,
                                                    'page.pageNo': data.page,
                                                    'accountId':$scope.model.currentAccountId
                                                };
                                            }
                                        },
                                        read: {
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            url: '/web/admin/paymentAccount/pageUnAuthorizeUnit',
                                            dataType: 'json'
                                        }
                                    },
                                    schema: {
                                        parse: function (response, e) {
                                            if (response.status) {
                                                var dataview = response.info, index = 1;
                                                angular.forEach(dataview, function (item) {
                                                    item.index = index++;
                                                });
                                            }
                                            return response;
                                        },
                                        total: function (response) {
                                            return response.totalSize;
                                        },
                                        data: function (response) {
                                            return response.info;
                                        } // 指定数据源
                                    }
                                },
                                // 选中切换的时候改变选中行的时候触发的事件
                                pageable: {
                                    refresh: true,
                                    pageSizes: [5, 10, 30, 50],
                                    pageSize: 10,
                                    buttonCount: 10
                                },
                                columns: [
                                    {title: 'No.', field: 'index', width: 40},
                                    {title: '单位/机构名称', field: 'unitName', width: 250},
                                    {title: '所属地区', field: 'region', width: 150},
                                    {title: '联系人', field: 'contactMan', width: 50},
                                    {
                                        title: '操作', width: 70,
                                    }
                                ]
                            }
                        },
                        invoiceConfigLogPager :{
                            refresh   : true,
                            dataSource: new kendo.data.DataSource ( {
                                serverPaging: true,
                                page        : 1,
                                pageSize    : 10, // 每页显示的数据数目
                                transport   : {
                                    parameterMap: function ( data, type ) {
                                        var temp  = {
                                            accountId: $scope.model.currentAccountId ||"1",
                                            page      : { pageNo: data.page, pageSize: data.pageSize }
                                        };
                                        // $scope.model.page.pageNo   = data.page;
                                        // $scope.model.page.pageSize = data.pageSize;
                                        return temp;
                                    },
                                    read        : {
                                        url     : "/web/admin/paymentAccount/pageInvoiceConfig",
                                        dataType: 'json'
                                    }
                                },
                                schema      : {
                                    parse: function ( response ) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if ( response.status ) {
                                            return response;
                                        } else {
                                            $scope.globle.showTip ( '加载发票日志的分页数据失败', 'error' );
                                            return {
                                                status       : response.status,
                                                totalSize    : 0,
                                                totalPageSize: 0,
                                                info         : []
                                            };
                                        }
                                    },
                                    total: function ( response ) {
                                        return response.totalSize;
                                    },
                                    data : function ( response ) {
                                        $scope.model.invoiceConfigLogList = response.info;
                                        $scope.$apply ();
                                        return response.info;
                                    }
                                }
                            } )
                        }
                    };
                    $scope.ui.invoiceConfigLogPager.dataSource.read ();
                    $scope.ui.unitGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.unitGrid.options);
                    $scope.ui.unAuthorizeUnitGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.unAuthorizeUnitGrid.options);
                }]
        };
    });
