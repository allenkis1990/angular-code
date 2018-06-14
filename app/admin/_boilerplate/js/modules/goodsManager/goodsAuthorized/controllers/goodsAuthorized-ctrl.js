/**
 * Created by linj on 2018/4/24.
 */
define(function () {
    "use strict";
    return {
        indexCtrl: ['$scope', 'HB_notification', 'easyKendoDialog', '$stateParams', '$http', 'hbUtil', 'goodsManagerService','$timeout',
            function ($scope, HB_notification, easyKendoDialog, $stateParams, $http, hbUtil, goodsManagerService,$timeout) {
                $scope.model = {
                    schemeId: $stateParams.schemeId,
                    paymentRule: {
                        type: 1,//自主收款
                        priceType: 1
                    },
                    skuId:$stateParams.id,
                    editRule: true,
                    tempPaymentRule: {},
                    saving: false,
                    selectedAuthorizeUnitId: [],
                    selectedAuthorizeUnitIdTemp: [],
                    authorizedUnitQueryParam: {
                        skuId: $stateParams.id
                    },
                    unAuthorizedUnitQueryParam: {
                        skuId: $stateParams.id
                    },
                    authorizedUnitPage: {
                        pageNo: 1,
                        pageSize: 10
                    },
                    unAuthorizedUnitPage: {
                        pageNo: 1,
                        pageSize: 10
                    }
                };
                $scope.events = {
                    openAuthorizedDialog: function (e) {
                        $scope.authorizedDialog = easyKendoDialog.content({
                            templateUrl: '@systemUrl@/views/goodsManager/goodsAuthorized/authorizedDialog.html',
                            width: 1000,
                            title: false
                        }, $scope);
                    },
                    openUnAuthorizeUnitDialog: function (e) {
                        if($scope.model.editRule===true){
                            HB_notification.alert('请先保存授权规则');
                            return;
                        }
                        $scope.model.selectedAuthorizeUnitIdTemp = angular.copy($scope.model.selectedAuthorizeUnitId);
                        $scope.authorizeUnitDialog = easyKendoDialog.content({
                            templateUrl: '@systemUrl@/views/goodsManager/goodsAuthorized/unAuthorizedUnitDialog.html',
                            width: 1000,
                            title: false
                        }, $scope);
                    },
                    searchUnit: function(e){
                        $scope.authorizeUnitDialog.unAuthorizedUnitGridInstance.pager.page(1);
                    },
                    cancelSelectAuthorizeUnit: function (e, windowName) {
                        $scope.model.selectedAuthorizeUnitId = angular.copy($scope.model.selectedAuthorizeUnitIdTemp);
                        $scope.events.closeKendoWindow(windowName);
                    },
                    closeKendoWindow: function (windowName) {
                        $scope[windowName].kendoDialog.close();
                    },
                    authorizeCommodity: function (e) {
                        goodsManagerService.authorizeCommodity({
                                skuId: $stateParams.id,
                                targetUnitIds: $scope.model.selectedAuthorizeUnitId
                            })
                            .then(function (data) {
                                $timeout ( function () {
                                    $scope.authorizedUnitGridInstance.pager.page(1);
                                } ,2500);
                                if (data.fail===false) {
                                    $scope.model.selectedAuthorizeUnitId.length=0;
                                    $scope.authorizeUnitDialog.kendoDialog.close();
                                    HB_notification.showTip('授权成功','success');
                                } else {
                                    HB_notification.showTip( data.message,'error');
                                }
                            });
                    },
                    removeAuthorized: function (e, dataItem) {
                        goodsManagerService.cancelAuthorized({
                                skuId: $stateParams.id,
                                targetUnitId: dataItem.unitId
                            })
                            .then(function (data) {
                                $timeout ( function () {
                                    $scope.authorizedUnitGridInstance.pager.page(1);
                                } ,2500);
                                if (data.fail===false) {
                                    HB_notification.showTip('取消授权成功','success');
                                } else {
                                    HB_notification.showTip( data.message,'error');
                                }


                            });
                    },
                    selectItem: function (e, dataItem) {
                        if (hbUtil.validateIsNull(dataItem.unitId)) {
                            HB_notification.alert('数据异常，获取不到当前行的单位id');
                        }
                        var index = hbUtil.indexOf($scope.model.selectedAuthorizeUnitId, dataItem.unitId);
                        if (index !== -1) {
                            HB_notification.alert('当前单位已选');
                        }
                        $scope.model.selectedAuthorizeUnitId.push(dataItem.unitId);
                    },
                    cancelSelectItem: function (e, dataItem) {
                        var index = hbUtil.indexOf($scope.model.selectedAuthorizeUnitId, dataItem.unitId);
                        if (index !== -1) {
                            $scope.model.selectedAuthorizeUnitId.splice(index, 1);
                        }
                    },
                    init: init
                };

                $scope.utils = {
                    validateIsNull: hbUtil.validateIsNull,
                    hasChoose: function (e, dataItem) {
                        if (hbUtil.validateIsNull(dataItem)) {
                            return false;
                        }
                        if (hbUtil.validateIsNull($scope.model.selectedAuthorizeUnitId)) {
                            return false;
                        }
                        var index = hbUtil.indexOf($scope.model.selectedAuthorizeUnitId, dataItem.unitId);
                        if (index !== -1) {
                            return true;
                        }
                        return false;
                    }
                }

                $scope.authorizedUnitGridInstance={};

                function init() {
                    if ($stateParams.id) {
                        $http.get('/web/admin/commodityManager/getCommodityDetail', {
                            params: {
                                commoditySkuId: $stateParams.id,
                                schemeId: $stateParams.schemeId
                            }
                        }).success(function (data) {

                            if (data.status) {
                                $scope.schemeDetail = data.info;
                                if (hbUtil.validateIsNull($scope.schemeDetail.authorizedRule) === false) {
                                    $scope.model.editRule = false;
                                    $scope.model.paymentRule = angular.copy($scope.schemeDetail.authorizedRule);
                                }
                            } else {
                                HB_notification.confirm(data.info, function (dialog) {
                                    dialog.doRightClose();
                                });
                                $scope.model.editRule = false;
                            }
                        });
                    }
                };
                init();

                //已授权单位列表模板
                var authorizedUnitTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span title="#: unitName?unitName:\'-\' #">#: unitName?unitName:\'-\' #</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" ng-click="events.removeAuthorized($event,dataItem)"  class="table-btn">移除</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    authorizedUnitTemplate = result.join('');
                })();
                //未授权单位列表模板
                var unAuthorizedUnitTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');


                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span title="#: unitName?unitName:\'-\' #">#: unitName?unitName:\'-\' #</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<div ng-if="utils.validateIsNull(dataItem.region)===false">')
                    result.push('<span>b{{dataItem.region.provinceName?dataItem.region.provinceName:\'-\'}}</span>/');
                    result.push('<span>b{{dataItem.region.cityName?dataItem.region.cityName:\'-\'}}</span>/');
                    result.push('<span>b{{dataItem.region.countyName?dataItem.region.countyName:\'-\'}}</span>');
                    result.push('</div>')
                    result.push('<div ng-if="utils.validateIsNull(dataItem.region)===true">');
                    result.push('-');
                    result.push('</div>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<div ng-if="utils.validateIsNull(dataItem.unitManager)===false">');
                    result.push('姓名:');
                    result.push('<span>b{{dataItem.unitManager.name?dataItem.unitManager.name:\'-\'}}</span>');
                    result.push('<br>');
                    result.push('登录账号:');
                    result.push('<span>b{{dataItem.unitManager.loginAccount?dataItem.unitManager.loginAccount:\'-\'}}</span>');
                    result.push('</div>');
                    result.push('<div ng-if="utils.validateIsNull(dataItem.unitManager)===true">');
                    result.push('-');
                    result.push('</div>');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<button type="button" ng-if="utils.hasChoose($event,dataItem)===true" ng-click="events.cancelSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                    result.push('<button type="button" ng-if="utils.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)"  class="table-btn">选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    unAuthorizedUnitTemplate = result.join('');
                })();
                $scope.grid = {
                    authorizedUnitGrid: hbUtil.kdGridCommonOptionDIY({
                        template: authorizedUnitTemplate,
                        url: '/web/admin/commodityManager/findAuthorizedUnitPage',
                        outSidePage: true,
                        scope: $scope,
                        page: 'authorizedUnitPage',
                        param: $scope.model.authorizedUnitQueryParam,
                        fn: function (response) {
                            console.log(response);
                            $scope.configedArr = response.info;
                        },
                        columns: [
                            {field: 'no', title: 'No.', width: 80, sortable: false},
                            {field: 'unitName', title: '单位名称', sortable: false},
                            {
                                title: '操作', width: 80
                            }
                        ]
                    }),
                    unAuthorizedUnitGrid: hbUtil.kdGridCommonOptionDIY({
                        template: unAuthorizedUnitTemplate,
                        url: '/web/admin/commodityManager/findUnAuthorizedUnitPage',
                        outSidePage: true,
                        scope: $scope,
                        page: 'unAuthorizedUnitPage',
                        pageSize:5,
                        param: $scope.model.unAuthorizedUnitQueryParam,
                        fn: function (response) {
                            console.log(response);
                            $scope.configedArr = response.info;
                        },
                        columns: [
                            {field: 'commodityName', title: 'No.', width: 60, sortable: false},
                            {field: 'unitName', title: '单位名称', sortable: false},
                            {field: 'region', title: '所属地区', width: 200, sortable: false},
                            {field: 'unitManager', title: '联系人', width: 200, sortable: false},
                            {
                                title: '操作', width: 80
                            }
                        ]
                    })
                };
            }
        ]
    };
});