define ( function ( invoiceManage ) {
    "use strict";
    return {
        indexCtrl: ["$scope", 'kendo.grid', 'TabService', 'HB_dialog', 'batchInvoiceManageServices', '$q', '$http', 'hbUtil', '$state', 'HB_notification',
            function ( $scope, kendoGrid, TabService, HB_dialog, invoiceManageServices, $q, $http, hbUtil, $state, HB_notification) {
                $scope.node         = {
                    paperBillGrid:null,
                    paperCreatorUnitGrid: null,
                    electronBillGrid: null,
                    electronCreatorUnitGrid: null
                };

                $scope.tabMap={
                    myself:{
                        name:"本单位",
                        code:"myself"
                    },
                };

                $scope.currentTab = $scope.tabMap.myself.code;

                $scope.model = {
                    commonPaperPageParams: {
                        batchNo         : '',//批次号
                        billNo          : '',//发票号
                        made            : '',//是否开票
                        frozen          : '',//是否冻结
                        deliverType     : '',//配送方式
                        buyerName       : '',//购买人
                        loginInput      : '',//身份证
                        creatorUnitId   : '',//创建人所属单位ID
                        creatorUnitName : '',//所选单位名字
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd  : '',//索取发票结束时间
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd  : '',//开票结束时间
                        batchBillType   : 0
                    },
                    authorizedBasicQuery:{
                        rangeType:"",//查询维度
                        belongsType:"",//所属权
                        authorizeToUnitId:"",//我授权出的单位
                        authorizedFromUnitId:"",//授权给我的单位
                        objectId:""//查询对象id,根据rangeType来确定其具体含义

                    },
                    vatPaperPageParams: {
                        batchNo         : '',//批次号
                        billNo          : '',//发票号
                        made            : '',//是否开票
                        frozen          : '',//是否冻结
                        deliverType     : '',//配送方式
                        buyerName       : '',//购买人
                        loginInput      : '',//身份证
                        creatorUnitId   : '',//创建人所属单位ID
                        creatorUnitName : '',//所选单位名字
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd  : '',//索取发票结束时间
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd  : '',//开票结束时间
                        batchBillType   : 0
                    },
                    nonTaxPaperPageParams: {
                        batchNo         : '',//批次号
                        billNo          : '',//发票号
                        made            : '',//是否开票
                        frozen          : '',//是否冻结
                        deliverType     : '',//配送方式
                        buyerName       : '',//购买人
                        loginInput      : '',//身份证
                        creatorUnitId   : '',//创建人所属单位ID
                        creatorUnitName : '',//所选单位名字
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd  : '',//索取发票结束时间
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd  : '',//开票结束时间
                        batchBillType   : 0
                    },
                    electronPageParams: {
                        batchNo         : '',//批次号
                        billNo          : '',//发票号
                        billCode        : '',//发票代码
                        made            : '',//是否开票
                        frozen          : '',//是否冻结
                        verifyCode      : '',//验证码
                        buyerName       : '',//购买人
                        loginInput      : '',//身份证
                        creatorUnitId   : '',//创建人所属单位ID
                        creatorUnitName : '',//所选单位名字
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd  : '',//索取发票结束时间
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd  : '',//开票结束时间
                        billSelectThree : '1',
                        batchBillType   : 0
                    },
                    commonPaperCreatorUnitPage: {
                        pageNo  : 1,
                        pageSize: 10
                    },
                    commonPaperCreatorUnitQueryParam: {
                        name: ''
                    },
                    vatPaperCreatorUnitPage: {
                        pageNo  : 1,
                        pageSize: 10
                    },
                    vatPaperCreatorUnitQueryParam: {
                        name: ''
                    },
                    nonTaxPaperCreatorUnitPage: {
                        pageNo  : 1,
                        pageSize: 10
                    },
                    nonTaxPaperCreatorUnitQueryParam: {
                        name: ''
                    },
                    electronCreatorUnitPage: {
                        pageNo  : 1,
                        pageSize: 10
                    },
                    electronCreatorUnitQueryParam: {
                        name: ''
                    },
                    page                : {
                        pageSize: 10,
                        pageNo  : 1
                    },

                    electron            :false,
                    paperInvoiceShowNum    :0,
                    invoiceType:0,
                    dialogDetail        : false,
                    itemOrderNo         : '',
                    itemBatchNo         : '',
                    itemBillNo          : '',
                    itemBillId          : '',
                    remark              : '',
                    upload              : {
                        result: ''
                    },
                    classPage           : {
                        pageNo  : 1,
                        pageSize: 10
                    },

                    chooseClassItem   : '',
                    paperChooseClassItem:'',
                    classChooseType   : false
                };

                var localDB = {//批量开票的已选对象信息
                    selectedIdArray: [],
                    selectedStatusArray:{}
                };
                //验证是否为空
                function validateIsNull( obj ) {
                    return (obj === '' || obj === undefined || obj === null);
                }
                init();
                function init(){
                    invoiceManageServices.realSupportIssuingElectronInvoice().then(function (data) {//初始化电子发票是否真正支持可开票的系统配置
                        if (data.status) {
                            $scope.realSupportIssuingElectronInvoice = data.info;

                        }
                    });
                }

                $scope.events       = {
                    openKendoWindow: function ( windowName ) {
                        $scope[windowName].center ().open ();
                    },
                    closeKendoWindow: function ( windowName ) {
                        $scope[windowName].close ();
                    },

                    //查询
                    MainPageQueryList   : function ( e, gridName ) {
                         //e.stopPropagation();
                        $scope.node[gridName].pager.page ( 1 );
                    },

                    switchTable   : function ( type ) {
                        if(type != $scope.model.invoiceType){
                            $scope.model.paperInvoiceShowNum = type;
                            $scope.model.paperInvoiceShow = !$scope.model.paperInvoiceShow;
                            if (type === 1 || type === 4) {
                                $scope.model.electron = true;
                            } else {
                                $scope.model.electron = false;
                            }
                            $scope.model.invoiceType = type;
                        }
                    },

                    choosePaperUnit: function ( e, item ) {
                        if($scope.model.paperInvoiceShowNum==0){
                            $scope.model.commonPaperPageParams.creatorUnitId   = item.unitId;
                            $scope.model.commonPaperPageParams.creatorUnitName = item.name;
                            $scope.events.closeKendoWindow ( 'commonPaperCreatorUnitWindow' );
                        }else if($scope.model.paperInvoiceShowNum==2){
                            $scope.model.vatPaperPageParams.creatorUnitId   = item.unitId;
                            $scope.model.vatPaperPageParams.creatorUnitName = item.name;
                            $scope.events.closeKendoWindow ( 'vatPaperCreatorUnitWindow' );
                        }else if($scope.model.paperInvoiceShowNum==3){
                            $scope.model.nonTaxPaperPageParams.creatorUnitId   = item.unitId;
                            $scope.model.nonTaxPaperPageParams.creatorUnitName = item.name;
                            $scope.events.closeKendoWindow ( 'nonTaxPaperCreatorUnitWindow' );
                        }
                    },
                    clearPaperUnitTextContent: function () {
                        if($scope.model.paperInvoiceShowNum==0){
                            $scope.model.commonPaperPageParams.creatorUnitId  = '';
                            $scope.model.commonPaperPageParams.creatorUnitName= '';
                        }else if($scope.model.paperInvoiceShowNum==2){
                            $scope.model.vatPaperPageParams.creatorUnitId  = '';
                            $scope.model.vatPaperPageParams.creatorUnitName= '';
                        }else if($scope.model.paperInvoiceShowNum==3){
                            $scope.model.nonTaxPaperPageParams.creatorUnitId  = '';
                            $scope.model.nonTaxPaperPageParams.creatorUnitName= '';
                        }
                    },

                    chooseElectronUnit: function ( e, item ) {
                        $scope.model.electronPageParams.creatorUnitId   = item.unitId;
                        $scope.model.electronPageParams.creatorUnitName = item.name;
                        $scope.events.closeKendoWindow ( 'electronCreatorUnitWindow' );
                    },
                    clearElectronUnitTextContent: function () {
                        $scope.model.electronPageParams.creatorUnitId  = '';
                        $scope.model.electronPageParams.creatorUnitName= '';
                    },

                    //处理发票
                    enableAdministrator: function (e, item) {
                        e.preventDefault();
                        if (item.frozen === true) {
                            HB_dialog.alert('提示', '发票被冻结，不能处理！');
                        } else {
                            //纸质发票
                            if ($scope.model.paperInvoiceShowNum != 1 && $scope.model.paperInvoiceShowNum != 4) {
                                $scope.model.dialogHeight = 200;
                                $scope.model.itemBillId = item.id;
                                $scope.model.itemOrderNo = item.orderNo;
                                $scope.model.itemBatchNo = item.batchNo;
                                if (item.billNo === '' || item.billNo === null) {
                                    $scope.model.invoiceNum = '';
                                    // $scope.model.invoiceCode     = '';
                                    // $scope.model.invoiceVeriCode = '';
                                    $scope.model.dialogDetail = true;
                                } else {
                                    $scope.model.dialogDetail = false;
                                    $scope.model.invoiceItemDetail = item;
                                }
                            } else {
                                //电子发票
                                $scope.model.dialogHeight = 260;
                                $scope.model.itemBillId = item.id;
                                $scope.model.itemOrderNo = item.orderNo;
                                $scope.model.itemBatchNo = item.batchNo;
                                if (item.billNo === '' || item.billNo === null) {
                                    $scope.model.invoiceNum = '';
                                    $scope.model.invoiceCode = '';
                                    $scope.model.invoiceVeriCode = '';
                                    $scope.model.dialogDetail = true;
                                } else {
                                    $scope.model.dialogDetail = false;
                                    $scope.model.invoiceItemDetail = item;
                                }
                            }
                            HB_dialog.contentAs($scope, {
                                title: '处理发票',
                                width: 500,
                                height: $scope.model.dialogHeight,
                                showCancel: false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/invoiceManage/dialogDetail.html'
                            });
                        }
                    },
                    //处理发票号
                    sureDetail          : function ( e, type, index ) {
                        e.preventDefault ();
                        if (type === 1) {
                            if (($scope.model.paperInvoiceShowNum == 4||$scope.model.paperInvoiceShowNum == 1) && (!$scope.model.invoiceNum || !$scope.model.invoiceCode || !$scope.model.invoiceVeriCode)) {
                                HB_dialog.error('提示', '请填写完整在确认！');
                                return;
                            }
                            if ($scope.model.paperInvoiceShowNum != 1&& $scope.model.paperInvoiceShowNum != 4&& !$scope.model.invoiceNum) {
                                HB_dialog.error('提示', '请填写完整在确认！');
                                return;
                            }
                            invoiceManageServices.dealWithBill({
                                orderNo: $scope.model.itemOrderNo,
                                billId: $scope.model.itemBillId,
                                billNo: $scope.model.invoiceNum,
                                billCode: $scope.model.invoiceCode,
                                billVeriCode: $scope.model.invoiceVeriCode
                            }).then(function (data) {
                                if (data.status) {
                                    $scope.events.MainPageQueryList(e,$scope.utils.getGridName($scope.model.paperInvoiceShowNum));
                                    HB_dialog.success('提示', '填写成功');
                                    //$state.reload($state.current.name);
                                    $scope.events.MainPageQueryList(e,$scope.utils.getGridName($scope.model.paperInvoiceShowNum));
                                    HB_dialog.closeDialogByIndex($scope, index);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        } else {
                            // $scope.model.cancleRemark = true;
                            HB_dialog.closeDialogByIndex($scope, index);
                            HB_dialog.contentAs($scope, {
                                title: '作废发票',
                                width: 450,
                                height: 270,
                                showCancel: false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/invoiceManage/cancleRemark.html'
                            });
                        }
                    },
                    detailWithRemark:function (e,index) {
                        invoiceManageServices.dealCancelBill (
                                {
                                    billId: $scope.model.itemBillId,
                                    orderNo:$scope.model.itemOrderNo,
                                    batchNo:$scope.model.itemBatchNo,
                                    remark :$scope.model.remark
                                }
                            ).then ( function ( data ) {
                                // dialog.doRightClose ();
                               HB_dialog.closeDialogByIndex ( $scope, index );
                              $scope.model.remark  = '';
                                if ( data.status ) {
                                    var grid = $scope.model.paperInvoiceShow ? 'paperBillGrid' : 'electronBillGrid';
                                    $scope.events.MainPageQueryList (e, $scope.utils.getGridName($scope.model.paperInvoiceShowNum));
                                    HB_dialog.success ( '提示', '作废成功' );
                                } else {
                                    HB_dialog.error ( '提示', data.info )
                                }
                            } );
                    },
                    //    关闭弹窗
                    closeDialog         : function ( e ) {
                        e.preventDefault ();
                        HB_dialog.closeAlert ();
                    },
                    //记录
                    suspendAdministrator: function ( e, item ) {
                        e.preventDefault ();
                        invoiceManageServices.getDealBillLog ( { billId : item.id } ).then ( function ( data ) {
                            $scope.model.orderRemenber = data.info;
                            angular.forEach ( $scope.model.orderRemenber, function ( item, index ) {
                                if ( item.operationType === '1' ) {
                                    item.operationType = '导入';
                                }
                                if ( item.operationType === '2' ) {
                                    item.operationType = '导出';
                                }
                                if ( item.operationType === '3' ) {
                                    item.operationType = '作废';
                                }
                                if ( item.operationType === '4' ) {
                                    item.operationType = '拆散';
                                }
                                if ( item.operationType === '5' ) {
                                    item.operationType = '合并';
                                }
                                if (item.operationType === '6') {
                                    item.operationType = '打印';
                                }
                                if (item.remark === null || item.remark === ''){
                                    item.remark = "无";
                                }

                            } );
                            var length = $scope.model.orderRemenber.length - 1;
                            if (length >= 10){
                                length = 10;
                            }
                            HB_dialog.contentAs ( $scope, {
                                title      : '操作记录',
                                width      : 1000,
                                height     : 140 + length * 38,
                                showCancel : false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/invoiceManage/dialogRem.html'
                            } );
                        } );
                    },
                    //导入开票结果
                    chooseFile          : function ( e ) {
                        e.preventDefault ();
                        HB_dialog.contentAs ( $scope, {
                            title      : '导入开票结果',
                            width      : 500,
                            height     : 270,
                            sure       : function ( wow ) {
                                var defer   = $q.defer (),
                                    promise = defer.promise;
                                if ( $scope.model.upload.result ) {
                                    invoiceManageServices.importBatchBill ( {
                                        filePath   : $scope.model.upload.result.newPath,
                                        invoiceType: $scope.model.invoiceType
                                    } ).then ( function ( data ) {
                                        if ( data.status ) {
                                            HB_dialog.success ( '提示', "导入集体缴费发票异步任务创建成功" );
                                        } else {
                                            HB_dialog.error ( '提示', "导入集体缴费发票异步任务创建失败");
                                        }
                                    } );
                                }
                                ;
                                defer.resolve ();
                                wow.close ();
                                return promise;
                            },
                            templateUrl: '@systemUrl@/views/invoiceManage/dialogFile.html'
                        } );
                    },
                    ListOpen            : function ( e ) {
                        e.preventDefault ();
                        var temp={};
                        if($scope.model.invoiceType == 0){
                            var paperPageParams = $scope.model.commonPaperPageParams;
                            var temp = {
                                electron        : false,
                                paperInvoiceType:1,
                                batchNo         : paperPageParams.batchNo,
                                billNo          : paperPageParams.billNo,
                                frozen          : paperPageParams.frozen,
                                made            : paperPageParams.made,
                                deliverType     : paperPageParams.deliverType,
                                buyerName       : paperPageParams.buyerName,
                                loginInput      : paperPageParams.loginInput,
                                creatorUnitId   : paperPageParams.creatorUnitId,
                                createStartTimeMills: '',
                                createEndTimeMills: '',
                                makeStartTimeMills: '',
                                makeEndTimeMills: '',
                                batchBillType   : paperPageParams.batchBillType
                            };

                            var counter = 86399999;
                            if (paperPageParams.askBillTimeStart) {
                                temp.createStartTimeMills = kendo.parseDate(paperPageParams.askBillTimeStart).getTime();
                            }
                            if (paperPageParams.askBillTimeEnd) {
                                temp.createEndTimeMills = kendo.parseDate(paperPageParams.askBillTimeEnd).getTime() + counter;
                            }
                            if (paperPageParams.billingTimeStart) {
                                temp.makeStartTimeMills = kendo.parseDate(paperPageParams.billingTimeStart).getTime();
                            }
                            if (paperPageParams.billingTimeEnd) {
                                temp.makeEndTimeMills = kendo.parseDate(paperPageParams.billingTimeEnd).getTime() + counter;
                            }
                            invoiceManageServices.exportBatchBill (temp).then ( function ( data ) {
                                if ( data.status ) {
                                    HB_dialog.success ( '提示', "导出集体缴费纸质发票数据异步任务创建成功" );
                                } else {
                                    HB_dialog.error ( '提示', "导出任务创建成功" );
                                }
                            } )
                        }else if($scope.model.invoiceType == 2){
                            var paperPageParams = $scope.model.vatPaperPageParams;
                            var temp = {
                                electron        : false,
                                paperInvoiceType:2,
                                batchNo         : paperPageParams.batchNo,
                                billNo          : paperPageParams.billNo,
                                frozen          : paperPageParams.frozen,
                                made            : paperPageParams.made,
                                deliverType     : paperPageParams.deliverType,
                                buyerName       : paperPageParams.buyerName,
                                loginInput      : paperPageParams.loginInput,
                                creatorUnitId   : paperPageParams.creatorUnitId,
                                createStartTimeMills: '',
                                createEndTimeMills: '',
                                makeStartTimeMills: '',
                                makeEndTimeMills: '',
                                batchBillType   : paperPageParams.batchBillType,
                            };

                            var counter = 86399999;
                            if (paperPageParams.askBillTimeStart) {
                                temp.createStartTimeMills = kendo.parseDate(paperPageParams.askBillTimeStart).getTime();
                            }
                            if (paperPageParams.askBillTimeEnd) {
                                temp.createEndTimeMills = kendo.parseDate(paperPageParams.askBillTimeEnd).getTime() + counter;
                            }
                            if (paperPageParams.billingTimeStart) {
                                temp.makeStartTimeMills = kendo.parseDate(paperPageParams.billingTimeStart).getTime();
                            }
                            if (paperPageParams.billingTimeEnd) {
                                temp.makeEndTimeMills = kendo.parseDate(paperPageParams.billingTimeEnd).getTime() + counter;
                            }
                            invoiceManageServices.exportBatchBill (temp).then ( function ( data ) {
                                if ( data.status ) {
                                    HB_dialog.success ( '提示', "导出集体缴费纸质发票数据异步任务创建成功" );
                                } else {
                                    HB_dialog.error ( '提示', "导出任务创建成功" );
                                }
                            } )
                        }else if($scope.model.invoiceType == 3){
                            var paperPageParams = $scope.model.nonTaxPaperPageParams;
                            var temp = {
                                electron        : false,
                                paperInvoiceType:3,
                                batchNo         : paperPageParams.batchNo,
                                billNo          : paperPageParams.billNo,
                                frozen          : paperPageParams.frozen,
                                made            : paperPageParams.made,
                                deliverType     : paperPageParams.deliverType,
                                buyerName       : paperPageParams.buyerName,
                                loginInput      : paperPageParams.loginInput,
                                creatorUnitId   : paperPageParams.creatorUnitId,
                                createStartTimeMills: '',
                                createEndTimeMills: '',
                                makeStartTimeMills: '',
                                makeEndTimeMills: '',
                                batchBillType   : paperPageParams.batchBillType,
                            };

                            var counter = 86399999;
                            if (paperPageParams.askBillTimeStart) {
                                temp.createStartTimeMills = kendo.parseDate(paperPageParams.askBillTimeStart).getTime();
                            }
                            if (paperPageParams.askBillTimeEnd) {
                                temp.createEndTimeMills = kendo.parseDate(paperPageParams.askBillTimeEnd).getTime() + counter;
                            }
                            if (paperPageParams.billingTimeStart) {
                                temp.makeStartTimeMills = kendo.parseDate(paperPageParams.billingTimeStart).getTime();
                            }
                            if (paperPageParams.billingTimeEnd) {
                                temp.makeEndTimeMills = kendo.parseDate(paperPageParams.billingTimeEnd).getTime() + counter;
                            }

                            invoiceManageServices.exportBatchBill (temp).then ( function ( data ) {
                                if ( data.status ) {
                                    HB_dialog.success ( '提示', "导出集体缴费纸质发票数据异步任务创建成功" );
                                } else {
                                    HB_dialog.error ( '提示', "导出任务创建成功" );
                                }
                            } )
                        }else {
                            var electronPageParams = $scope.model.electronPageParams;
                            var temp = {
                                electron        : true,//是否电子票
                                batchNo         : electronPageParams.batchNo,
                                billNo          : electronPageParams.billNo,
                                billCode        : electronPageParams.billCode,
                                verifyCode      : electronPageParams.verifyCode,
                                frozen          : electronPageParams.frozen,
                                made            : electronPageParams.made,
                                buyerName       : electronPageParams.buyerName,
                                loginInput      : electronPageParams.loginInput,
                                creatorUnitId   : electronPageParams.creatorUnitId,
                                createStartTimeMills: '',
                                createEndTimeMills: '',
                                makeStartTimeMills: '',
                                makeEndTimeMills: '',
                                batchBillType    : electronPageParams.batchBillType
                            };

                            var counter = 86399999;
                            if (electronPageParams.askBillTimeStart) {
                                temp.createStartTimeMills = kendo.parseDate(electronPageParams.askBillTimeStart).getTime();
                            }
                            if (electronPageParams.askBillTimeEnd) {
                                temp.createEndTimeMills = kendo.parseDate(electronPageParams.askBillTimeEnd).getTime() + counter;
                            }
                            if (electronPageParams.billingTimeStart) {
                                temp.makeStartTimeMills = kendo.parseDate(electronPageParams.billingTimeStart).getTime();
                            }
                            if (electronPageParams.billingTimeEnd) {
                                temp.makeEndTimeMills = kendo.parseDate(electronPageParams.billingTimeEnd).getTime() + counter;
                            }

                            if ( electronPageParams.billSelectThree === '1' ) {
                                temp.billCode   = '';
                                temp.verifyCode = '';
                            } else if ( electronPageParams.billSelectThree === '2' ) {
                                temp.billNo = '';
                                temp.verifyCode = '';
                            } else {
                                temp.billNo   = '';
                                temp.billCode = '';
                            }
                            invoiceManageServices.exportBatchBill (temp).then ( function ( data ) {
                                if ( data.status ) {
                                    HB_dialog.success ( '提示', "导出集体缴费电子发票数据异步任务创建成功" );
                                } else {
                                    HB_dialog.error ( '提示', data.info );
                                }
                            } )
                        }
                        ;
                    },
                    batchIssuingInvoice: function () {//批量开票（电子票）
                        if (localDB.selectedIdArray.length < 1) {
                            $scope.globle.alert('提示!', '请选择开票对象');
                            return;
                        }
                        $scope.globle.confirm('批量开票', '确定要批量开票所选发票吗？', function (dialog) {
                            return invoiceManageServices.batchIssuingInvoice(localDB.selectedIdArray).then(function (data) {
                                dialog.doRightClose();
                                if (!data.status) {
                                    $scope.globle.alert('批量开票失败!', data.info);
                                } else {
                                    $scope.node.ableIssuingCommonElectronInvoiceGrid.dataSource.page(1);
                                    //$scope.node.gridInstance.dataSource.read ();
                                    $scope.selected = false;
                                    $scope.globle.showTip('批量开票成功', 'success');
                                }
                            });
                        });
                    },
                    getStorageByTaxPayer: function (e) {
                        e.preventDefault();
                        $scope.model.storageByTaxPayerInfoList = {};//先清空前面的数据
                        invoiceManageServices.ableIssuingElectronInvoiceCount().then(function (data) {
                            $scope.model.storageByTaxPayerInfoList = data.info;
                        });
                        HB_dialog.contentAs($scope, {
                            title: '电子发票库存量信息',
                            width: 500,
                            height: 300,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/batchInvoiceManage/ableIssuingElectronInvoiceCount.html'
                        });
                    },
                    checkBoxCheck: function (e, dataItem) {
                        var billId = dataItem.id;
                        if (e.currentTarget.checked) {
                            localDB.selectedIdArray.push(billId);
                        } else {
                            var index = _.indexOf(localDB.selectedIdArray, billId);
                            if (index !== -1) {
                                localDB.selectedIdArray.splice(index, 1);
                            }
                            delete localDB.selectedStatusArray[billId];
                        }

                        utils.refreshBatchButton();
                    },
                    questionSelectAll: function (e) {
                        // 重置表格已选的ID, 已选的状态
                        localDB.selectedIdArray = [];

                        // 全选
                        if (e.currentTarget.checked) {
                            var viewData = $scope.node.enableIssuingCommonElectronInvoiceGrid.dataSource.view(),
                                size = viewData.length, row;
                            for (var i = 0; i < size; i++) {
                                row = viewData[i];
                                // 缓存本地
                                localDB.selectedIdArray.push(row.billId);
                            }
                        }
                        utils.refreshBatchButton();
                    },
                    //获取开票信息
                    getIssuingInvoiceInfo: function (e, item) {
                        e.preventDefault();
                        $scope.model.issuingInvoiceInfo = {};//先清空前面的数据
                        invoiceManageServices.getIssuingInvoiceInfoByBatchNo({batchNo: item.batchNo}).then(function (data) {
                            $scope.model.issuingInvoiceInfo = data.info;
                        });
                        HB_dialog.contentAs($scope, {
                            title: '开票信息',
                            width: 500,
                            height: 300,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/batchInvoiceManage/issuingInvoiceDetail.html'
                        });
                    },
                    downLoadElectronBlueBill: function (e, dataItem) {//下载电子发票
                        var billId = dataItem.id;
                        invoiceManageServices.downLoadElectronBlueBill({invoiceId: billId}).then(function (data) {
                            if (data.status) {
                                var dataInfo = data.info;

                                //window.open($scope.urlPrefix + "/mfs" + dataInfo.pdfPath +'?download' );
                                window.open(dataInfo.pdfPath);
                            } else {
                                $scope.globle.alert('提示', data.info);
                            }
                        });
                    },
                };

                var utils           = {
                    startChange: function () {
                        var startDate = $scope.node.workBeginTime.value (),
                            endDate   = $scope.node.workEndTime.value ();

                        if ( startDate ) {
                            startDate = new Date ( startDate );
                            startDate.setDate ( startDate.getDate () );
                            $scope.node.workEndTime.min ( startDate );
                        } else if ( endDate ) {
                            $scope.node.workBeginTime.max ( new Date ( endDate ) );
                        } else {
                            endDate = new Date ();
                            $scope.node.workBeginTime.max ( endDate );
                            $scope.node.workEndTime.min ( endDate );
                        }
                    },
                    endChange  : function () {
                        var endDate   = $scope.node.workEndTime.value (),
                            startDate = $scope.node.workBeginTime.value ();

                        if ( endDate ) {
                            endDate = new Date ( endDate );
                            endDate.setDate ( endDate.getDate () );
                            $scope.node.workBeginTime.max ( endDate );
                        } else if ( startDate ) {
                            $scope.node.workEndTime.min ( new Date ( startDate ) );
                        } else {
                            endDate = new Date ();
                            $scope.node.workBeginTime.max ( endDate );
                            $scope.node.workEndTime.min ( endDate );
                        }
                    },
                    getGridName: function(type){
                        if(type===0){
                            return "commonPaperInvoiceGrid";
                        }else if(type===1){
                            return "disableIssuingCommonElectronInvoiceGrid";
                        }else if(type===2){
                            return "vatPaperInvoiceGrid";
                        }else if(type===3){
                            return "nonTaxPaperInvoiceGrid";
                        }else if(type===4){
                            return "enableIssuingCommonElectronInvoiceGrid";
                        }
                    },
                    refreshBatchButton: function () {
                        var selectedIdArray = localDB.selectedIdArray,
                            size = selectedIdArray.length;


                        // 已选的数量为0, 等价于取消全选; 数量为当前展示的页面量, 等价于全选
                        if (size === 0) {
                            $scope.selected = false;
                            $scope.questionSelectAll=false;
                        }else if($scope.node.enableIssuingCommonElectronInvoiceGrid.dataSource.view().length===0){
                            $scope.selected = false;
                        } else if (size === $scope.node.enableIssuingCommonElectronInvoiceGrid.dataSource.view().length) {
                            $scope.selected = true;
                        }
                    }
                };
                $scope.utils = utils;
                //=============普通电子发票（不可在平台开票）分页开始=======================
                var disableIssuingCommonElectronGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: batchNo #">' );
                    result.push ( '#: batchNo #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: money #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: buyer.name #-#: buyer.loginInput #">' );
                    result.push ( '#: buyer.name === null || buyer.name === \'\' ? \'/\': buyer.name  #' + '<br/>账号：' + '#: buyer.loginInput === null || buyer.loginInput === \'\' ? \'/\': buyer.loginInput #' );
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push ( '<td>' );
                    result.push('#: createTime === null || createTime === "" ? "" : createTime.substr(0, createTime.indexOf(" ")) #'+ '<br/>'+ '#: createTime === null || createTime === "" ? "" : createTime.substr(createTime.indexOf(" "), createTime.length) #');
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push('#: taxpayerNo? taxpayerNo : "-" #');
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: billVeriCode === null || billVeriCode === \'\' ? \'/\': billVeriCode  #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: billCode === null || billCode === \'\' ? \'/\': billCode  #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: billNo === null || billNo === \'\' ?\'/\': billNo  #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#:email#">' );
                    result.push ( '#: email === null || email === \'\' ? \'/\': email  #' );
                    result.push ( '</td>' );

                    result.push ( '</td>' );
                    result.push ( '<td class="op">' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/process" ng-if="dataItem.dialogDetailShow && dataItem.hasAuthority"  ng-click="events.enableAdministrator($event,dataItem)">处理发票</button>' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/expire" ng-if="!dataItem.dialogDetailShow && dataItem.hasAuthority" ng-click="events.enableAdministrator($event,dataItem)">作废发票</button>' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/operateLog"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    disableIssuingCommonElectronGridRowTemplate = result.join ( '' );
                }) ();
                //=============普通电子发票（可在平台开票）分页开始=======================
                var enableIssuingCommonElectronInvoiceGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: billId #"  class="k-checkbox" ng-checked="selected" ng-if="dataItem.hasAuthority"/>' +
                        '<label class="k-checkbox-label" for="check_#: billId #" ng-if="dataItem.hasAuthority"></label>');
                    result.push('<span ng-if="!dataItem.hasAuthority">-</span>');
                    result.push('</td>');

                    result.push ( '<td title="#: batchNo #">' );
                    result.push ( '#: batchNo #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: money #' );
                    result.push ( '</td>' );
                    result.push ( '<td>' );
                    result.push ( '#: tax?tax:"-" #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: buyer.name #-#: buyer.loginInput #">' );
                    result.push ( '#: buyer.name === null || buyer.name === \'\' ? \'/\': buyer.name  #' + '<br/>账号：' + '#: buyer.loginInput === null || buyer.loginInput === \'\' ? \'/\': buyer.loginInput #' );
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push ( '<td>' );
                    result.push('#: createTime === null || createTime === "" ? "" : createTime.substr(0, createTime.indexOf(" ")) #'+ '<br/>'+ '#: createTime === null || createTime === "" ? "" : createTime.substr(createTime.indexOf(" "), createTime.length) #');
                    result.push ( '</td>' );
                    result.push ( '<td>' );
                    result.push('#: taxpayerNo? taxpayerNo : "-" #');
                    result.push ( '</td>' );

                    //result.push ( '<td>' );
                    //result.push ( '#: billVeriCode === null || billVeriCode === \'\' ? \'/\': billVeriCode  #' );
                    //result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: billCode === null || billCode === \'\' ? \'/\': billCode  #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: billNo === null || billNo === \'\' ?\'/\': billNo  #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#:email#">' );
                    result.push ( '#: email === null || email === \'\' ? \'/\': email  #' );
                    result.push ( '</td>' );

                    result.push ( '</td>' );
                    result.push ( '<td class="op">' );
                    result.push('<button ng-if="dataItem.billState==1" type="button"  class="table-btn" ng-click="events.downLoadElectronBlueBill($event,dataItem)">下载发票</button>');
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/operateLog"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    enableIssuingCommonElectronInvoiceGridRowTemplate = result.join ( '' );
                }) ();


                //=============普通纸质发票分页开始=======================
                var commonPaperGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: batchNo #">' );
                    result.push ( '#: batchNo #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: money #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: deliverType == "1" ? "邮寄" : "自取" #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: buyer.name #-#: buyer.loginInput #">' );
                    result.push ( '#: buyer.name === null || buyer.name === \'\' ? \'/\': buyer.name  #' + '<br/>账号：' + '#: buyer.loginInput === null || buyer.loginInput === \'\' ? \'/\': buyer.loginInput #' );
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push ( '<td>' );
                    result.push('#: createTime === null || createTime === "" ? "" : createTime.substr(0, createTime.indexOf(" ")) #'+ '<br/>'+ '#: createTime === null || createTime === "" ? "" : createTime.substr(createTime.indexOf(" "), createTime.length) #');
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: titleType == 1 ? "个人：" : "单位："# #: title #');
                    result.push ( '#if(titleType == 2){# <br/>纳税人识别号：#:taxpayerNo == null || taxpayerNo == "" ? "-": taxpayerNo# #}#');
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('#: importTime === null || importTime === "" ? "" : importTime.substr(0, importTime.indexOf(" ")) #'+ '<br/>'+ '#: importTime === null || importTime === "" ? "" : importTime.substr(importTime.indexOf(" "), importTime.length) #');
                    result.push('</td>');


                    result.push ( '<td>' );
                    result.push ( '#: billNo === null || billNo === \'\' ?\'/\': billNo  #' );
                    result.push ( '</td>' );

                    result.push ( '</td>' );
                    result.push ( '<td class="op">' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/process" ng-if="dataItem.dialogDetailShow && dataItem.hasAuthority"  ng-click="events.enableAdministrator($event,dataItem)">处理发票</button>' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/expire" ng-if="!dataItem.dialogDetailShow && dataItem.hasAuthority" ng-click="events.enableAdministrator($event,dataItem)">作废发票</button>' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/operateLog"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    commonPaperGridRowTemplate = result.join ( '' );
                }) ();
                //=============增值税专用发票分页开始=======================
                var vatPaperInvoiceGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: batchNo #">' );
                    result.push ( '#: batchNo #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: money #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: deliverType == "1" ? "邮寄" : "自取" #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: buyer.name #-#: buyer.loginInput #">' );
                    result.push ( '#: buyer.name === null || buyer.name === \'\' ? \'/\': buyer.name  #' + '<br/>账号：' + '#: buyer.loginInput === null || buyer.loginInput === \'\' ? \'/\': buyer.loginInput #' );
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push ( '<td>' );
                    result.push('#: createTime === null || createTime === "" ? "" : createTime.substr(0, createTime.indexOf(" ")) #'+ '<br/>'+ '#: createTime === null || createTime === "" ? "" : createTime.substr(createTime.indexOf(" "), createTime.length) #');
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: titleType == 1 ? "个人：" : "单位："# #: title #');
                    result.push ( '#if(titleType == 2){# <br/>纳税人识别号：#:taxpayerNo == null || taxpayerNo == "" ? "-": taxpayerNo# #}#');
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('#: importTime === null || importTime === "" ? "" : importTime.substr(0, importTime.indexOf(" ")) #'+ '<br/>'+ '#: importTime === null || importTime === "" ? "" : importTime.substr(importTime.indexOf(" "), importTime.length) #');
                    result.push('</td>');


                    result.push ( '<td>' );
                    result.push ( '#: billNo === null || billNo === \'\' ?\'/\': billNo  #' );
                    result.push ( '</td>' );

                    result.push ( '</td>' );
                    result.push ( '<td class="op">' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/process" ng-if="dataItem.dialogDetailShow && dataItem.hasAuthority"  ng-click="events.enableAdministrator($event,dataItem)">处理发票</button>' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/expire" ng-if="!dataItem.dialogDetailShow && dataItem.hasAuthority" ng-click="events.enableAdministrator($event,dataItem)">作废发票</button>' );
                    result.push('<button type="button"  class="table-btn"   ng-click="events.getIssuingInvoiceInfo($event,dataItem)">开票信息</button>');
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/operateLog"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    vatPaperInvoiceGridRowTemplate = result.join ( '' );
                }) ();
                //=============非税务发票分页开始=======================
                var nonTaxPaperInvoiceGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: batchNo #">' );
                    result.push ( '#: batchNo #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: money #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: deliverType == "1" ? "邮寄" : "自取" #' );
                    result.push ( '</td>' );

                    result.push ( '<td title="#: buyer.name #-#: buyer.loginInput #">' );
                    result.push ( '#: buyer.name === null || buyer.name === \'\' ? \'/\': buyer.name  #' + '<br/>账号：' + '#: buyer.loginInput === null || buyer.loginInput === \'\' ? \'/\': buyer.loginInput #' );
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push ( '<td>' );
                    result.push('#: createTime === null || createTime === "" ? "" : createTime.substr(0, createTime.indexOf(" ")) #'+ '<br/>'+ '#: createTime === null || createTime === "" ? "" : createTime.substr(createTime.indexOf(" "), createTime.length) #');
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: titleType == 1 ? "个人：" : "单位："# #: title #');
                    result.push ( '</td>' );

                    result.push('<td>');
                    result.push('#: importTime === null || importTime === "" ? "" : importTime.substr(0, importTime.indexOf(" ")) #'+ '<br/>'+ '#: importTime === null || importTime === "" ? "" : importTime.substr(importTime.indexOf(" "), importTime.length) #');
                    result.push('</td>');


                    result.push ( '<td>' );
                    result.push ( '#: billNo === null || billNo === \'\' ?\'/\': billNo  #' );
                    result.push ( '</td>' );

                    result.push ( '</td>' );
                    result.push ( '<td class="op">' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/process" ng-if="dataItem.dialogDetailShow && dataItem.hasAuthority"  ng-click="events.enableAdministrator($event,dataItem)">处理发票</button>' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/expire" ng-if="!dataItem.dialogDetailShow && dataItem.hasAuthority" ng-click="events.enableAdministrator($event,dataItem)">作废发票</button>' );
                    result.push ( '<button type="button"  class="table-btn" has-permission="batchBill/operateLog"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    nonTaxPaperInvoiceGridRowTemplate = result.join ( '' );
                }) ();

                //已配置模板
                var creatorUnitRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#:name#' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<button type="button" class="table-btn" ng-click="events.choosePaperUnit($event,dataItem)">选择</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    creatorUnitRowTemplate = result.join ( '' );
                }) ();

                var electronCreatorUnitRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#:name#' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<button type="button" class="table-btn" ng-click="events.chooseElectronUnit($event,dataItem)">选择</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    electronCreatorUnitRowTemplate = result.join ( '' );
                }) ();

                $scope.ui = {
                    datePicker: {
                        begin: {
                            options: {
                                culture: "zh-CN",
                                format : "yyyy-MM-dd",
                                //change: utils.startChange
                            }
                        },
                        end  : {
                            options: {
                                culture: "zh-CN",
                                format : "yyyy-MM-dd",
                                //change: utils.endChange
                            }
                        }
                    },
                    disableIssuingCommonElectronInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template ( disableIssuingCommonElectronGridRowTemplate ),
                            scrollable : true,
                            noRecords  : {
                                template: '暂无数据'
                            },
                            dataSource : {
                                transport    : {
                                    read: {
                                        dataType   : 'json',
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url        : "/web/admin/billAction/pageBatchBill",
                                        data       : function ( e ) {

                                            var electronPageParams = $scope.model.electronPageParams;
                                            var temp = {
                                                electron        : true,//是否电子票
                                                batchNo         : electronPageParams.batchNo,
                                                billNo          : electronPageParams.billNo,
                                                billCode        : electronPageParams.billCode,
                                                verifyCode      : electronPageParams.verifyCode,
                                                frozen          : electronPageParams.frozen,
                                                made            : electronPageParams.made,
                                                buyerName       : electronPageParams.buyerName,
                                                loginInput      : electronPageParams.loginInput,
                                                creatorUnitId   : electronPageParams.creatorUnitId,
                                                createStartTimeMills: '',
                                                createEndTimeMills: '',
                                                makeStartTimeMills: '',
                                                makeEndTimeMills: '',
                                                batchBillType    : electronPageParams.batchBillType,
                                                rangeType:electronPageParams.rangeType,//查询维度
                                                belongsType:electronPageParams.belongsType,//所属权
                                                authorizeToUnitId:electronPageParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:electronPageParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:electronPageParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                pageNo           : e.page,
                                                pageSize         : $scope.model.page.pageSize
                                            };
                                            temp.pageNo = e.page;


                                            var counter = 86399999;
                                            if (electronPageParams.askBillTimeStart) {
                                                temp.createStartTimeMills = kendo.parseDate(electronPageParams.askBillTimeStart).getTime();
                                            }
                                            if (electronPageParams.askBillTimeEnd) {
                                                temp.createEndTimeMills = kendo.parseDate(electronPageParams.askBillTimeEnd).getTime() + counter;
                                            }
                                            if (electronPageParams.billingTimeStart) {
                                                temp.makeStartTimeMills = kendo.parseDate(electronPageParams.billingTimeStart).getTime();
                                            }
                                            if (electronPageParams.billingTimeEnd) {
                                                temp.makeEndTimeMills = kendo.parseDate(electronPageParams.billingTimeEnd).getTime() + counter;
                                            }

                                            if ( electronPageParams.billSelectThree === '1' ) {
                                                temp.billCode   = '';
                                                temp.verifyCode = '';
                                            } else if ( electronPageParams.billSelectThree === '2' ) {
                                                temp.billNo = '';
                                                temp.verifyCode = '';
                                            } else {
                                                temp.billNo   = '';
                                                temp.billCode = '';
                                            }
                                            return temp;
                                        }
                                    }
                                },
                                pageSize     : 10, // 每页显示的数据数目
                                schema       : {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function ( response ) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if ( response.status ) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach ( dataview, function ( item ) {
                                                if ( item.billNo === '' || item.billNo === null ) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }
                                                item.index          = index++;
                                            } );
                                        }
                                        return response;
                                    },
                                    total: function ( response ) {
                                        return response.totalSize;
                                    },
                                    data : function ( response ) {
                                        return response.info;
                                    } // 指定数据源
                                },
                                serverPaging : true, //远程获取书籍
                                serverSorting: true //远程排序字段
                            },
                            selectable : true,
                            sortable   : {
                                mode       : "single",
                                allowUnsort: false
                            },
                            dataBinding: function ( e ) {
                                $scope.model.gridReturnData = e.items;
                                kendoGrid.nullDataDealLeaf ( e );
                            },
                            pageable   : {
                                refresh    : true,
                                pageSizes  : [5, 10, 30, 50] || true,
                                pageSize   : 10,
                                buttonCount: 10
                                //change: function (e) {
                                //    $scope.model.page.pageNo = parseInt(e.index, 10);
                                //    //== !!important!! 这里重复了page(1)的作用
                                //    // $scope.node.electronBillGrid.dataSource.read();
                                //}
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns    : [
                                { title: "No", width: 50 },
                                { title: "报名批次号", width: 250 },
                                { title: "发票金额", width: 80 },
                                { title: "购买人信息", width: 210 },
                                { title: "收款单位",width:100},
                                { title: "索取发票时间", width: 110 },
                                { title: "纳税人识别码", width: 110 },
                                { title: "查询验证码", width: 100 },
                                { title: "发票代码", width: 100 },
                                { title: "发票号", width: 100 },
                                { title: "电子邮箱", width: 180 },
                                { title: "操作", width: 120}
                            ]
                        }
                    },
                    enableIssuingCommonElectronInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template ( enableIssuingCommonElectronInvoiceGridRowTemplate ),
                            scrollable : true,
                            noRecords  : {
                                template: '暂无数据'
                            },
                            dataSource : {
                                transport    : {
                                    read: {
                                        dataType   : 'json',
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url        : "/web/admin/billAction/pageBatchBill",
                                        data       : function ( e ) {

                                            var electronPageParams = $scope.model.electronPageParams;
                                            var temp = {
                                                electron        : true,//是否电子票
                                                batchNo         : electronPageParams.batchNo,
                                                billNo          : electronPageParams.billNo,
                                                billCode        : electronPageParams.billCode,
                                                verifyCode      : electronPageParams.verifyCode,
                                                frozen          : electronPageParams.frozen,
                                                made            : electronPageParams.made,
                                                buyerName       : electronPageParams.buyerName,
                                                loginInput      : electronPageParams.loginInput,
                                                creatorUnitId   : electronPageParams.creatorUnitId,
                                                createStartTimeMills: '',
                                                createEndTimeMills: '',
                                                makeStartTimeMills: '',
                                                makeEndTimeMills: '',
                                                batchBillType    : electronPageParams.batchBillType,
                                                rangeType:electronPageParams.rangeType,//查询维度
                                                belongsType:electronPageParams.belongsType,//所属权
                                                authorizeToUnitId:electronPageParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:electronPageParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:electronPageParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                pageNo           : e.page,
                                                pageSize         : $scope.model.page.pageSize
                                            };
                                            temp.pageNo = e.page;


                                            var counter = 86399999;
                                            if (electronPageParams.askBillTimeStart) {
                                                temp.createStartTimeMills = kendo.parseDate(electronPageParams.askBillTimeStart).getTime();
                                            }
                                            if (electronPageParams.askBillTimeEnd) {
                                                temp.createEndTimeMills = kendo.parseDate(electronPageParams.askBillTimeEnd).getTime() + counter;
                                            }
                                            if (electronPageParams.billingTimeStart) {
                                                temp.makeStartTimeMills = kendo.parseDate(electronPageParams.billingTimeStart).getTime();
                                            }
                                            if (electronPageParams.billingTimeEnd) {
                                                temp.makeEndTimeMills = kendo.parseDate(electronPageParams.billingTimeEnd).getTime() + counter;
                                            }

                                            if ( electronPageParams.billSelectThree === '1' ) {
                                                temp.billCode   = '';
                                                temp.verifyCode = '';
                                            } else if ( electronPageParams.billSelectThree === '2' ) {
                                                temp.billNo = '';
                                                temp.verifyCode = '';
                                            } else {
                                                temp.billNo   = '';
                                                temp.billCode = '';
                                            }
                                            return temp;
                                        }
                                    }
                                },
                                pageSize     : 10, // 每页显示的数据数目
                                schema       : {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function ( response ) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if ( response.status ) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach ( dataview, function ( item ) {
                                                if ( item.billNo === '' || item.billNo === null ) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }
                                                item.index          = index++;
                                            } );
                                        }
                                        return response;
                                    },
                                    total: function ( response ) {
                                        return response.totalSize;
                                    },
                                    data : function ( response ) {
                                        return response.info;
                                    } // 指定数据源
                                },
                                serverPaging : true, //远程获取书籍
                                serverSorting: true //远程排序字段
                            },
                            selectable : true,
                            sortable   : {
                                mode       : "single",
                                allowUnsort: false
                            },
                            dataBinding: function ( e ) {
                                $scope.model.gridReturnData = e.items;
                                kendoGrid.nullDataDealLeaf ( e );
                            },
                            pageable   : {
                                refresh    : true,
                                pageSizes  : [5, 10, 30, 50] || true,
                                pageSize   : 10,
                                buttonCount: 10
                                //change: function (e) {
                                //    $scope.model.page.pageNo = parseInt(e.index, 10);
                                //    //== !!important!! 这里重复了page(1)的作用
                                //    // $scope.node.electronBillGrid.dataSource.read();
                                //}
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns    : [
                                { title: "No", width: 50 },
                                {
                                    title: '<span><input class=\'k-checkbox\' ng-model=\'selected\' id=\'questionSelectAll\' ng-click=\'events.questionSelectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'questionSelectAll\'></label></span>',
                                    filterable: false,
                                    width: 40,
                                    attributes: { // 用template的时候失效。
                                        'class': 'tcenter'
                                    }
                                },
                                { title: "报名批次号", width: 250 },
                                { title: "发票金额", width: 80 },
                                { title: "税额", width: 80 },
                                { title: "购买人信息", width: 210 },
                                { title: "收款单位",width:100},
                                { title: "索取发票时间", width: 110 },
                                { title: "纳税人识别码", width: 110 },
                                { title: "发票代码", width: 100 },
                                { title: "发票号", width: 100 },
                                { title: "电子邮箱", width: 180 },
                                { title: "操作", width: 120}
                            ]
                        }
                    },
                    commonPaperInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template ( commonPaperGridRowTemplate ),
                            scrollable : true,
                            noRecords  : {
                                template: '暂无数据'
                            },
                            dataSource : {
                                transport    : {
                                    read: {
                                        dataType   : 'json',
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url        : "/web/admin/billAction/pageBatchBill",
                                        data       : function ( e ) {
                                            var paperPageParams = $scope.model.commonPaperPageParams;
                                            var temp = {
                                                electron        : false,
                                                paperInvoiceType:1,
                                                batchNo         : paperPageParams.batchNo,
                                                billNo          : paperPageParams.billNo,
                                                frozen          : paperPageParams.frozen,
                                                made            : paperPageParams.made,
                                                deliverType     : paperPageParams.deliverType,
                                                buyerName       : paperPageParams.buyerName,
                                                loginInput      : paperPageParams.loginInput,
                                                creatorUnitId   : paperPageParams.creatorUnitId,
                                                createStartTimeMills: '',
                                                createEndTimeMills: '',
                                                makeStartTimeMills: '',
                                                makeEndTimeMills: '',
                                                batchBillType   : paperPageParams.batchBillType,
                                                rangeType:paperPageParams.rangeType,//查询维度
                                                belongsType:paperPageParams.belongsType,//所属权
                                                authorizeToUnitId:paperPageParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:paperPageParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:paperPageParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                pageNo          : e.page,
                                                pageSize        : $scope.model.page.pageSize
                                            };

                                            var counter = 86399999;
                                            if (paperPageParams.askBillTimeStart) {
                                                temp.createStartTimeMills = kendo.parseDate(paperPageParams.askBillTimeStart).getTime();
                                            }
                                            if (paperPageParams.askBillTimeEnd) {
                                                temp.createEndTimeMills = kendo.parseDate(paperPageParams.askBillTimeEnd).getTime() + counter;
                                            }
                                            if (paperPageParams.billingTimeStart) {
                                                temp.makeStartTimeMills = kendo.parseDate(paperPageParams.billingTimeStart).getTime();
                                            }
                                            if (paperPageParams.billingTimeEnd) {
                                                temp.makeEndTimeMills = kendo.parseDate(paperPageParams.billingTimeEnd).getTime() + counter;
                                            }
                                            temp.pageNo = e.page;
                                            return temp;
                                        }
                                    }

                                },
                                pageSize     : 10, // 每页显示的数据数目
                                schema       : {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function ( response ) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if ( response.status ) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach ( dataview, function ( item ) {
                                                if ( item.billNo === '' || item.billNo === null ) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }
                                                item.index          = index++;
                                            } );
                                        }
                                        return response;
                                    },
                                    total: function ( response ) {
                                        return response.totalSize;
                                    },
                                    data : function ( response ) {
                                        return response.info;
                                    } // 指定数据源
                                },
                                serverPaging : true, //远程获取书籍
                                serverSorting: true //远程排序字段
                            },
                            selectable : true,
                            sortable   : {
                                mode       : "single",
                                allowUnsort: false
                            },
                            dataBinding: function ( e ) {
                                $scope.model.gridReturnData = e.items;
                                kendoGrid.nullDataDealLeaf ( e );
                            },
                            pageable   : {
                                refresh    : true,
                                pageSizes  : [5, 10, 30, 50] || true,
                                pageSize   : 10,
                                buttonCount: 10
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns    : [
                                { title: "No", width: 50 },
                                { sortable: false, title: "报名批次号", width: 250 },
                                { sortable: false, title: "发票金额", width: 90 },
                                { sortable: false, title: "配送方式", width: 90 },
                                { sortable: false, title: "购买人信息", width: 210 },
                                { sortable: false, title: "收款单位",width:100},
                                { sortable: false, title: "索取发票时间", width: 120 },
                                { sortable: false, title: "发票抬头"},
                                { sortable: false, title: "开票时间", width: 120 },
                                { sortable: false, title: "发票号", width: 100 },
                                {title: "操作", width: 120}
                            ]
                        }
                    },
                    vatPaperInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template ( vatPaperInvoiceGridRowTemplate ),
                            scrollable : true,
                            noRecords  : {
                                template: '暂无数据'
                            },
                            dataSource : {
                                transport    : {
                                    read: {
                                        dataType   : 'json',
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url        : "/web/admin/billAction/pageBatchBill",
                                        data       : function ( e ) {
                                            var paperPageParams = $scope.model.vatPaperPageParams;
                                            var temp = {
                                                electron        : false,
                                                paperInvoiceType:2,
                                                batchNo         : paperPageParams.batchNo,
                                                billNo          : paperPageParams.billNo,
                                                frozen          : paperPageParams.frozen,
                                                made            : paperPageParams.made,
                                                deliverType     : paperPageParams.deliverType,
                                                buyerName       : paperPageParams.buyerName,
                                                loginInput      : paperPageParams.loginInput,
                                                creatorUnitId   : paperPageParams.creatorUnitId,
                                                createStartTimeMills: '',
                                                createEndTimeMills: '',
                                                makeStartTimeMills: '',
                                                makeEndTimeMills: '',
                                                batchBillType   : paperPageParams.batchBillType,
                                                rangeType:paperPageParams.rangeType,//查询维度
                                                belongsType:paperPageParams.belongsType,//所属权
                                                authorizeToUnitId:paperPageParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:paperPageParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:paperPageParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                pageNo          : e.page,
                                                pageSize        : $scope.model.page.pageSize
                                            };

                                            var counter = 86399999;
                                            if (paperPageParams.askBillTimeStart) {
                                                temp.createStartTimeMills = kendo.parseDate(paperPageParams.askBillTimeStart).getTime();
                                            }
                                            if (paperPageParams.askBillTimeEnd) {
                                                temp.createEndTimeMills = kendo.parseDate(paperPageParams.askBillTimeEnd).getTime() + counter;
                                            }
                                            if (paperPageParams.billingTimeStart) {
                                                temp.makeStartTimeMills = kendo.parseDate(paperPageParams.billingTimeStart).getTime();
                                            }
                                            if (paperPageParams.billingTimeEnd) {
                                                temp.makeEndTimeMills = kendo.parseDate(paperPageParams.billingTimeEnd).getTime() + counter;
                                            }
                                            temp.pageNo = e.page;
                                            return temp;
                                        }
                                    }

                                },
                                pageSize     : 10, // 每页显示的数据数目
                                schema       : {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function ( response ) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if ( response.status ) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach ( dataview, function ( item ) {
                                                if ( item.billNo === '' || item.billNo === null ) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }
                                                item.index          = index++;
                                            } );
                                        }
                                        return response;
                                    },
                                    total: function ( response ) {
                                        return response.totalSize;
                                    },
                                    data : function ( response ) {
                                        return response.info;
                                    } // 指定数据源
                                },
                                serverPaging : true, //远程获取书籍
                                serverSorting: true //远程排序字段
                            },
                            selectable : true,
                            sortable   : {
                                mode       : "single",
                                allowUnsort: false
                            },
                            dataBinding: function ( e ) {
                                $scope.model.gridReturnData = e.items;
                                kendoGrid.nullDataDealLeaf ( e );
                            },
                            pageable   : {
                                refresh    : true,
                                pageSizes  : [5, 10, 30, 50] || true,
                                pageSize   : 10,
                                buttonCount: 10
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns    : [
                                { title: "No", width: 50 },
                                { sortable: false, title: "报名批次号", width: 250 },
                                { sortable: false, title: "发票金额", width: 90 },
                                { sortable: false, title: "配送方式", width: 90 },
                                { sortable: false, title: "购买人信息", width: 210 },
                                { sortable: false, title: "收款单位",width:100},
                                { sortable: false, title: "索取发票时间", width: 120 },
                                { sortable: false, title: "发票抬头"},
                                { sortable: false, title: "开票时间", width: 120 },
                                { sortable: false, title: "发票号", width: 100 },
                                {title: "操作", width: 200}
                            ]
                        }
                    },
                    nonTaxPaperInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template ( nonTaxPaperInvoiceGridRowTemplate ),
                            scrollable : true,
                            noRecords  : {
                                template: '暂无数据'
                            },
                            dataSource : {
                                transport    : {
                                    read: {
                                        dataType   : 'json',
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url        : "/web/admin/billAction/pageBatchBill",
                                        data       : function ( e ) {
                                            var paperPageParams = $scope.model.nonTaxPaperPageParams;
                                            var temp = {
                                                electron        : false,
                                                paperInvoiceType:3,
                                                batchNo         : paperPageParams.batchNo,
                                                billNo          : paperPageParams.billNo,
                                                frozen          : paperPageParams.frozen,
                                                made            : paperPageParams.made,
                                                deliverType     : paperPageParams.deliverType,
                                                buyerName       : paperPageParams.buyerName,
                                                loginInput      : paperPageParams.loginInput,
                                                creatorUnitId   : paperPageParams.creatorUnitId,
                                                createStartTimeMills: '',
                                                createEndTimeMills: '',
                                                makeStartTimeMills: '',
                                                makeEndTimeMills: '',
                                                batchBillType   : paperPageParams.batchBillType,
                                                rangeType:paperPageParams.rangeType,//查询维度
                                                belongsType:paperPageParams.belongsType,//所属权
                                                authorizeToUnitId:paperPageParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:paperPageParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:paperPageParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                pageNo          : e.page,
                                                pageSize        : $scope.model.page.pageSize
                                            };

                                            var counter = 86399999;
                                            if (paperPageParams.askBillTimeStart) {
                                                temp.createStartTimeMills = kendo.parseDate(paperPageParams.askBillTimeStart).getTime();
                                            }
                                            if (paperPageParams.askBillTimeEnd) {
                                                temp.createEndTimeMills = kendo.parseDate(paperPageParams.askBillTimeEnd).getTime() + counter;
                                            }
                                            if (paperPageParams.billingTimeStart) {
                                                temp.makeStartTimeMills = kendo.parseDate(paperPageParams.billingTimeStart).getTime();
                                            }
                                            if (paperPageParams.billingTimeEnd) {
                                                temp.makeEndTimeMills = kendo.parseDate(paperPageParams.billingTimeEnd).getTime() + counter;
                                            }
                                            temp.pageNo = e.page;
                                            return temp;
                                        }
                                    }

                                },
                                pageSize     : 10, // 每页显示的数据数目
                                schema       : {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function ( response ) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if ( response.status ) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach ( dataview, function ( item ) {
                                                if ( item.billNo === '' || item.billNo === null ) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }
                                                item.index          = index++;
                                            } );
                                        }
                                        return response;
                                    },
                                    total: function ( response ) {
                                        return response.totalSize;
                                    },
                                    data : function ( response ) {
                                        return response.info;
                                    } // 指定数据源
                                },
                                serverPaging : true, //远程获取书籍
                                serverSorting: true //远程排序字段
                            },
                            selectable : true,
                            sortable   : {
                                mode       : "single",
                                allowUnsort: false
                            },
                            dataBinding: function ( e ) {
                                $scope.model.gridReturnData = e.items;
                                kendoGrid.nullDataDealLeaf ( e );
                            },
                            pageable   : {
                                refresh    : true,
                                pageSizes  : [5, 10, 30, 50] || true,
                                pageSize   : 10,
                                buttonCount: 10
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns    : [
                                { title: "No", width: 50 },
                                { sortable: false, title: "报名批次号", width: 250 },
                                { sortable: false, title: "发票金额", width: 90 },
                                { sortable: false, title: "配送方式", width: 90 },
                                { sortable: false, title: "购买人信息", width: 210 },
                                { sortable: false, title: "收款单位",width:100},
                                { sortable: false, title: "索取发票时间", width: 120 },
                                { sortable: false, title: "发票抬头"},
                                { sortable: false, title: "开票时间", width: 120 },
                                { sortable: false, title: "发票号", width: 100 },
                                {title: "操作", width: 120}
                            ]
                        }
                    },

                    creatorUnitGridOptions: {
                        commonPaper: hbUtil.kdGridCommonOption ( {
                            template: creatorUnitRowTemplate,
                            url     : "/web/admin/unitAdminCustom/findUnitPage",
                            scope   : $scope,
                            page    : 'commonPaperCreatorUnitPage',
                            param   : $scope.model.commonPaperCreatorUnitQueryParam,
                            fn      : function ( response ) {
                                console.log ( response );
                                $scope.configedArr = response.info;
                            },
                            columns : [
                                {title: "No", sortable: false, width: 50 },
                                {title: "单位名称", sortable: false},
                                {title: "操作", width: 80}
                            ]
                        }),
                        vatPaper: hbUtil.kdGridCommonOption ( {
                            template: creatorUnitRowTemplate,
                            url     : "/web/admin/unitAdminCustom/findUnitPage",
                            scope   : $scope,
                            page    : 'vatPaperCreatorUnitPage',
                            param   : $scope.model.vatPaperCreatorUnitQueryParam,
                            fn      : function ( response ) {
                                console.log ( response );
                                $scope.configedArr = response.info;
                            },
                            columns : [
                                {title: "No", sortable: false, width: 50 },
                                {title: "单位名称", sortable: false},
                                {title: "操作", width: 80}
                            ]
                        }),
                        nonTaxPaper: hbUtil.kdGridCommonOption ( {
                            template: creatorUnitRowTemplate,
                            url     : "/web/admin/unitAdminCustom/findUnitPage",
                            scope   : $scope,
                            page    : 'nonTaxPaperCreatorUnitPage',
                            param   : $scope.model.nonTaxPaperCreatorUnitQueryParam,
                            fn      : function ( response ) {
                                console.log ( response );
                                $scope.configedArr = response.info;
                            },
                            columns : [
                                {title: "No", sortable: false, width: 50 },
                                {title: "单位名称", sortable: false},
                                {title: "操作", width: 80}
                            ]
                        }),
                        electron: hbUtil.kdGridCommonOption ( {
                            template: electronCreatorUnitRowTemplate,
                            url     : "/web/admin/unitAdminCustom/findUnitPage",
                            scope   : $scope,
                            page    : 'electronCreatorUnitPage',
                            param   : $scope.model.electronCreatorUnitQueryParam,
                            fn      : function ( response ) {
                                console.log ( response );
                                $scope.configedArr = response.info;
                            },
                            columns : [
                                {title: "No", sortable: false, width: 50 },
                                {title: "单位名称", sortable: false},
                                {title: "操作", width: 80}
                            ]
                        })
                    }
                }

                $scope.kendoPlus = {
                    windowOptions    : {
                        modal    : true,
                        visible  : false,
                        resizable: false,
                        draggable: false,
                        title    : false,
                        open     : function () {
                            this.center ();
                        }
                    }
                };
            }]
    }
} );