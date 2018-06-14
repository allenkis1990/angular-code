define(['@systemUrl@/js/const/global-constants'], function (contant) {
    'use strict';
    return {
        index: ['$rootScope','$scope', '$stateParams', 'hbUtil', '$state', 'hbBasicData', 'HB_dialog', '$notify', '$timeout', '$http', 'authorize',
            function ($rootScope,$scope, $stateParams, hbUtil, $state, hbBasicData, HB_dialog, $notify, $timeout, $http, authorize) {
                function Type (name, title, code, options) {
                    var urlPrefix = '/web/admin/packageDeliveryManager/';
                    this.name = name;
                    this.title = title;
                    this.code = code;
                    this.options = options;
                    if (this.options.url) {
                        this.options.url = urlPrefix + this.options.url;
                    }
                }

                //
                $scope.newModel = {};
                $scope.node = {};
                $scope.pickUser = {};


                $scope.typeMap = {
                    // 全部
                    all: new Type('all', '全部', -1, {
                        url: 'getPackageInfos'
                    }),
                    // 快递
                    express: new Type('express', '快递包裹', 1, {
                        url: 'getPackageInfosByDelivery'
                    }),
                    // 自取
                    pickUp: new Type('pickUp', '自取包裹', 2, {
                        url: 'getPackageInfosBySelfClaim'
                    }),
                    getType: function (type) {
                        var _miniMap = {
                            1: this.express,
                            2: this.pickUp
                        };
                        return _miniMap[type];
                    },
                    isTypeOf: function (name) {
                        return $stateParams.type === name;
                    }
                };

                $scope.permission = {
                    search: 'packageDispatch/search',
                    exportOut: 'packageDispatch/export',
                    importIn: 'packageDispatch/import',
                    reset: 'packageDispatch/reset',
                    merge: 'packageDispatch/merge'
                };

                $scope.typeMap.current = $scope.typeMap[$stateParams.type];

                $scope.numberPattern = contant.regexps.phoneNumber;

                $scope.query = {
                    authorizedQuery:{
                        rangeType:null,
                        belongsType:null,
                        authorizeToUnitId:null,
                        authorizedFromUnitId:null,
                        objectId:null
                    },
                    combineRule: '1',
                    state: -1,
                    //账号类型|-1，全部；0，非测试；1，测试
                    isTestUser: '0',
                    tabType : "OWN"
                };
                $scope.stateMap = {
                    0: {
                        code: 0,
                        desc: '未就绪'
                    },
                    1: {
                        code: 1,
                        desc: '就绪'
                    },
                    2: {
                        code: 2,
                        desc: '等待确认仓点'
                    },
                    3: {
                        code: 3,
                        desc: '等待拣货'
                    },
                    4: {
                        code: 4,
                        desc: '拣货中'
                    },
                    5: {
                        code: 5,
                        desc: '等待补货'
                    },
                    6: {
                        code: 6,
                        desc: '补货中'
                    },
                    7: {
                        code: 7,
                        desc: '等待配货'
                    },
                    8: {
                        code: 8,
                        desc: '配货中'
                    },
                    9: {
                        code: 9,
                        desc: '等待打印运单'
                    },
                    a: {
                        code: 'a',
                        desc: '等待打包'
                    },
                    b: {
                        code: 'b',
                        desc: '打包中'
                    },
                    c: {
                        code: 'c',
                        desc: '等待寄送'
                    },
                    d: {
                        code: 'd',
                        desc: '快递寄送中'
                    },
                    e: {
                        code: 'e',
                        desc: '发往自取点中'
                    },
                    f: {
                        code: 'f',
                        desc: '到达自取点'
                    },
                    g: {
                        code: 'g',
                        desc: '已取货'
                    }
                };

                $scope.stateDeined = {};


                $scope.config = {
                    dispatchStatus: new hbUtil.kendo.config.combobox({
                        placeholder: '发货状态',
                        dataSource: [
                            {optionId: -1, name: '全部'},
                            {optionId: 0, name: '未就绪'},
                            {optionId: 1, name: '就绪'},
                            {optionId: 'g', name: '已取货'}
                        ]
                    }),
                    dispatchWay: new hbUtil.kendo.config.combobox({
                        placeholder: '配送方式',
                        dataSource: [
                            {optionId: '-1', name: '全部'},
                            {optionId: '1', name: '快递'},
                            {optionId: '2', name: '自取'}
                        ]
                    }),
                    frozenStatus: new hbUtil.kendo.config.combobox({
                        placeholder: '是否冻结',
                        dataSource: [
                            {optionId: '-1', name: '全部'},
                            {optionId: '2', name: '是'},
                            {optionId: '1', name: '否'}
                        ]
                    })
                };

                $scope.query.dispatchWay = $scope.config.dispatchWay.dataSource[0];

                function dispatchStatus (type) {
                    if (type.code !== $scope.typeMap.all.code) {
                        $scope.query.dispatchStatus = $scope.config.dispatchStatus.dataSource[2];
                    } else {
                        $scope.query.dispatchStatus = $scope.config.dispatchStatus.dataSource[0];
                    }
                }

                dispatchStatus($scope.typeMap[$stateParams.type]);


                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource($scope.typeMap.current.options.url, {}, {

                    rebuild: function (data) {
                        toggleTabBusy(false);
                        return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                    },
                    parameterMap: function (data, type) {

                        data.pageNo = data.page;

                        genQuery(data);
                        //console.log();
                        return data;
                    }
                });

                $scope.$watch('query.dispatchWay', function (nv) {
                    if (nv) {
                        if ($scope.typeMap.isTypeOf($scope.typeMap.all.name)) {
                            if (nv.optionId == 1) {
                                $scope.query.receiver = undefined;
                            }

                            if (nv.optionId == 2) {
                                $scope.query.waybillNo = undefined;
                            }
                        }
                    }
                });

                function genQuery (data) {

                    //private String rangeType;//查询维度
                    //private String belongsType;//所属权
                    //private String authorizeToUnitId;//我授权出的单位id
                    //private String authorizedFromUnitId;//授权的单位id
                    //private String objectId;//查询对象id,根据rangeType来确定其具体含义

                    // private String receiveName;//收件人
                    // private String userUniqueData;//身份证
                    // private String orderNo;//订单号
                    // private String deliveryType;//配送方式 1.快递，2.自取
                    // private String  state;//发货状态 0：未就绪 g：已取货
                    // private String waybillOrderNo;//运单号
                    // private Date packageStatusChangeBeginTime;//状态更新开始时间
                    // private Date packageStatusChangeEndTime;//状态更新结束时间
                    // private Date deliveryBeginTime;//发货时间开始时间
                    // private Date deliveryEndTime;//发货时间结束时间
                    // private String buyerId;//购买者
                    //data.combineRule = $scope.query.combineRule;
                    angular.forEach($scope.query.authorized,function(value,key){
                        data[key]=value;
                    });

                    data.rangeType            = $scope.query.authorizedQuery.rangeType;
                    data.belongsType          = $scope.query.authorizedQuery.belongsType;
                    data.authorizeToUnitId    = $scope.query.authorizedQuery.authorizeToUnitId;
                    data.authorizedFromUnitId = $scope.query.authorizedQuery.authorizedFromUnitId;
                    data.objectId             = $scope.query.authorizedQuery.objectId;
                    data.targetUnitId         = $scope.query.authorizedQuery.targetUnitId,

                    data.receiveName = $scope.query.consignee;
                    data.userUniqueData = $scope.query.identify;
                    data.orderNo = $scope.query.orderNo;
                    data.deliveryType = $scope.query.dispatchWay && $scope.query.dispatchWay.optionId;
                    data.state = $scope.query.dispatchStatus && $scope.query.dispatchStatus.optionId;
                    data.frozen = $scope.query.frozen && $scope.query.frozen.optionId;
                    data.waybillOrderNo = $scope.query.waybillNo;

                    if ($scope.query.combineRule) {
                        data.combineRule = $scope.query.combineRule;
                    }
                    if ($scope.query.packageBeginTime) {
                        data.packageStatusChangeBeginTime = toDateStr($scope.query.packageBeginTime) + ' 00:00:00';
                    }
                    if ($scope.query.packageEndTime) {
                        data.packageStatusChangeEndTime = toDateStr($scope.query.packageEndTime) + ' 23:59:59';
                        //data.packageStatusChangeEndTime.setHours(23);
                        //data.packageStatusChangeEndTime.setMinutes(59);
                        //data.packageStatusChangeEndTime.setSeconds(59);
                    }

                    if ($scope.query.deliveryBeginTime) {
                        data.deliveryBeginTime = toDateStr($scope.query.deliveryBeginTime) + ' 00:00:00';

                    }

                    if ($scope.query.deliveryEndTime) {
                        data.deliveryEndTime = toDateStr($scope.query.deliveryEndTime) + ' 23:59:59';
                        //data.deliveryEndTime.setHours(23);
                        //data.deliveryEndTime.setMinutes(59);
                        //data.deliveryEndTime.setSeconds(59);
                    }
                    data.signMen = $scope.query.receiver;

                    //账号类型|-1，全部；0，非测试；1，测试
                    data.isTestUser = $scope.query.isTestUser;
                }

                $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template($('#template').html()), [
                    {
                        template: 'b{{dataItem.$index > 0 ? dataItem.$index:""}}',
                        title: 'No.',
                        width: 50
                    },
                    {
                        field: 'regionName',
                        title: '包裹物品',
                        width: 520
                    },
                    {
                        field: 'netEstablish',
                        title: '收件信息',
                        width: 300
                    },
                    {
                        field: 'netEstablish',
                        title: '配送状态',
                        width: 80
                    },
                    {
                        field: 'notLearnYet',
                        title: '配送方式',
                        width: 80
                    },
                    {
                        field: 'learning',
                        title: '配送信息',
                        width: 230
                    }, {
                        field: 'learning',
                        title: '是否冻结',
                        width: 80
                    },
                    {
                        field: 'learned',
                        title: '操作',
                        width: 100
                    }
                ], {}, {
                    sortable: false,
                    height: 550
                });

                $scope.form = {
                    certainPickForm: {}
                };

                $scope.$watch('typeMap.current', function (nv, ov) {
                    if (ov.name !== nv.name) {
                        gridDataSource.setUrl(nv.options.url);
                        dispatchStatus(nv);
                        gridDataSource.refresh();
                    }
                });

                $timeout(function () {
                    toggleTabBusy(true);
                });

                function toggleTabBusy (noah) {
                    $scope.isLodingGrid = noah;
                    // hbUtil.toggleBuzy($('#state_package_dispatch_toggle_tab'), noah);
                }

                $scope.events = {
                    isSubProjectManager :function () {
                        var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                        return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                    },
                    initAllGrid:function(unitId){
                        $scope.query.authorizedQuery.targetUnitId = unitId;
                    },
                    tabClick:function (e,type) {
                        $scope.query.tabType = type;

                        if (type === 'OWN'){
                            $scope.query.authorizedQuery.targetUnitId = '';
                        }

                    },
                    merge: function () {
                        HB_dialog.contentAs($scope, {
                            title: '合并包裹规则',
                            templateUrl: '@systemUrl@/views/packageDispatch/merge.html',
                            width: 500,
                            height: 300,
                            confirmText: '开始合并包裹',
                            sure: function (dialog) {
                                var query = {};
                                genQuery(query);
                                return $http.post('/web/admin/packageDeliveryManager/combinePackage', query)
                                    .success(function (data) {
                                        if (data.code === 500 && data.status === false) {
                                            HB_dialog.error('提示', data.info);
                                        } else {
                                            HB_dialog.alert('提示', '合并成功' + data.info.combineNum + '个包裹，形成' + data.info.combineResultNum + '个包裹。无法合并' + data.info.failNum + '个包裹。');
                                            dialog.close();
                                            if ($scope.node.mainGrid.dataSource.refresh()) {
                                                toggleTabBusy(true);
                                            }
                                        }

                                    }).error(function (data) {
                                        HB_dialog.error('合并失败');
                                        dialog.close();
                                    });

                            },
                            cancel: function () {
                                $scope.isLoadingImport = false;
                            }
                        });
                    },
                    tabInit: function () {
                        // hbUtil.toggleBuzy($('#state_package_dispatch_toggle_tab'), true);
                    },
                    departPackage: function (dataItem) {
                        console.log(dataItem);
                        $state.go('states.packageDispatch.departPackage', {invoiceShowId: dataItem.invoiceShowId});
                    },
                    dispatch: function ($event, dataItem) {
                        $state.go('.dispatch', {
                            invoiceId: dataItem.invoiceShowId
                        });
                    },
                    toggleTab: function ($event, stateParams) {
                        if ($scope.typeMap.current.name === stateParams || $scope.isLodingGrid) {
                            return;
                        }
                        $scope.typeMap.current = $scope.typeMap[stateParams];
                        toggleTabBusy(true);
                        $state.go('states.packageDispatch', {type: stateParams})

                            .then(function () {
                                if ($scope.typeMap.isTypeOf($scope.typeMap.express.name)) {
                                    $scope.query.receiver = undefined;
                                }
                                if ($scope.typeMap.isTypeOf($scope.typeMap.pickUp.name)) {
                                    $scope.query.waybillNo = undefined;
                                }
                            });
                    },
                    search: function () {
                        if ($scope.node.mainGrid.dataSource.refresh()) {
                            toggleTabBusy(true);
                        }
                    },
                    export_: function () {
                        $scope.isLoadingExport = true;
                        var prefix = '/web/admin/packageDeliveryManager/';
                        var exportMap = {
                            all: prefix + 'exportPackageInfo',
                            express: prefix + 'exportPackageInfoByDelivery',
                            pickUp: prefix + 'exportPackageInfoBySelfClaim'
                        };
                        var query = {};
                        genQuery(query);

                        $http.post(exportMap[$stateParams.type], query)
                            .success(function () {
                                $scope.isLoadingExport = false;
                                $notify.success('导出成功，可前往导出任务列表下载数据!');
                            })
                            .error(function () {
                                $scope.isLoadingExport = false;
                                $notify.error('导出失败!');
                            });
                    },
                    import_: function () {
                        $scope.isLoadingImport = true;
                        HB_dialog.contentAs($scope, {
                            title: '导入包裹运单',
                            templateUrl: '@systemUrl@/views/packageDispatch/import.html',
                            width: 400,
                            height: 180,
                            sure: function (dialog) {
                                if (!$scope.model.uploadFile) {
                                    return $timeout(function () {
                                        HB_dialog.alert('友情提示', '请选择文件');
                                    });
                                } else {
                                    var di = dialog.theDialog.find('.pf-dialog-container').eq(dialog.dialogIndex).find('.dialog');
                                    hbUtil.toggleBuzy(di, true);
                                    return $http.post('/web/admin/packageDeliveryManager/importUserInfo', {
                                            filePath: $scope.model.uploadFile.newPath,
                                            fileName: $scope.model.uploadFile.fileName,
                                            batchQueryTag: 0
                                        })
                                        .success(function (data) {
                                            if (data.status) {
                                                $notify.success('导入成功');
                                                dialog.close(dialog.dialogIndex);
                                                $scope.isLoadingImport = false;
                                            } else {
                                                $notify.error(data.info || '导入失败');
                                            }
                                            hbUtil.toggleBuzy(di, false);
                                        }).error(function () {
                                            hbUtil.toggleBuzy(di, false);
                                            $notify.error('导入失败');
                                        });
                                }
                            },
                            cancel: function () {
                                $scope.isLoadingImport = false;
                            }
                        });
                    },
                    doReset: function () {
                        var tab = $scope.query.tabType;
                        $scope.query = {};
                        $scope.query.dispatchStatus = $scope.config.dispatchStatus.dataSource[0];
                        $scope.query.isTestUser = '0';
                        $scope.query.tabType = tab;
                        $scope.query.authorizedQuery = {};
                        gridDataSource.refresh();
                    },
                    remark: function (item) {
                        $scope.newModel.remark = item.remark;
                        HB_dialog.contentAs($scope, {
                            title: '备注信息',
                            height: 300,
                            width: 600,
                            templateUrl: '@systemUrl@/views/packageDispatch/remark.html',
                            sure: function (dialog) {
                                return $http.post('/web/admin/packageDeliveryManager/remarkPackage', {
                                        invoiceId: item.invoiceShowId,
                                        comment: $scope.newModel.remark
                                    })
                                    .success(function (data) {
                                        if (data.status){
                                            item.remark = $scope.newModel.remark;
                                            dialog.close(dialog.dialogIndex);
                                        }else {
                                            $scope.globle.alert("提示",data.info);
                                        }
                                    })
                                    .error(function () {
                                        dialog.close(dialog.dialogIndex);
                                    });
                            }
                        });
                    },
                    afterCopy: function (dataItem) {
                        // 默认打开ems
                        window.open(dataItem.deliveryCompanyUrl || 'http://www.ems.com.cn/');
                    },
                    toPick: function ($event, item) {
                        $scope.pickUser = {};
                        HB_dialog.contentAs($scope, {
                            title: '确认自取',
                            height: 230,
                            width: 480,
                            templateUrl: '@systemUrl@/views/packageDispatch/pick.html',
                            sure: function (dialog) {
                                if (!$scope.form.certainPickForm.$valid) {
                                    return {
                                        then: function () {
                                            dialog.self.requestIng = false;
                                        }
                                    };
                                }
                                var di = dialog.theDialog.find('.pf-dialog-container').eq(dialog.dialogIndex).find('.dialog');
                                hbUtil.toggleBuzy(di, true);
                                return $http.post('/web/admin/packageDeliveryManager/selfClaimGoods', {
                                    invoiceId: item.invoiceShowId,
                                    selfClaimName: $scope.pickUser.name,
                                    selfClaimPhone: $scope.pickUser.phone
                                }).success(function (data) {
                                        hbUtil.toggleBuzy(di, false);
                                        gridDataSource.refresh();
                                        dialog.close(dialog.dialogIndex);
                                    })
                                    .error(function () {
                                        hbUtil.toggleBuzy(di, false);
                                    });
                            }
                        });
                    }
                };

                function toDateStr (dataObj) {
                    var now = dataObj;
                    var year = now.getFullYear();
                    var month = (now.getMonth() + 1).toString();
                    var day = (now.getDate()).toString();
                    if (month.length == 1) {
                        month = '0' + month;
                    }
                    if (day.length == 1) {
                        day = '0' + day;
                    }
                    var dateTime = year + '-' + month + '-' + day;
                    return dateTime;
                    //console.log(dateTime);
                }
            }],

        dispatch: ['$http', '$stateParams', 'hbBasicData', '$scope', 'hbUtil', 'HB_dialog', '$state',
            function ($http, $stateParams, hbBasicData, $scope, hbUtil, HB_dialog, $state) {
                var applyUrl = '/web/admin/packageDeliveryManager/getPackageInfoByInvoiceId/' + $stateParams.invoiceId;
                $scope.model = {};
                $http.get(applyUrl)
                    .success(function (data) {
                        $scope.model.dispatchInfo = data.info;
                    });

                // web/admin/packageDeliveryManager/getCommonCarrierList

                $scope.logisticsCombo = new hbUtil.kendo.config.combobox({
                    placeholder: '请选择物流',
                    id: 'id',
                    dataSource: hbUtil.kendo.dataSource.gridDataSource(
                        '/web/admin/packageDeliveryManager/getCommonCarrierList'
                    )
                });

                $scope.events = {
                    dispatch: function (certainForm) {
                        if (!certainForm.$valid) {
                            return;
                        }
                        $scope.dispatching = true;
                        $http.get('/web/admin/packageDeliveryManager/deliverGood/' +
                                $scope.model.dispatchInfo.invoiceShowId + '/' +
                                $scope.model.waybillway + '/' +
                                $scope.model.dispatchInfo.waybillNo)
                            .success(function (data) {
                                if (data.status) {
                                    HB_dialog.success('提示', '发货成功!');
                                    $state.go('^').then(function () {
                                        $state.reload($state.current);
                                    });
                                } else {
                                    $scope.globle.alert('提示', data.info);
                                }
                                $scope.dispatching = false;
                            }, function () {
                                HB_dialog.success('提示', '发货失败!');
                                $scope.dispatching = false;
                            });
                    }
                };


            }]


    };
});

