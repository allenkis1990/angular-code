define(function () {
    'use strict';
    return ['$rootScope','$scope', 'distributionManagerService', 'HB_notification', 'hbUtil', 'HB_dialog', '$q',
        function ($rootScope,$scope, distributionManagerService, HB_notification, hbUtil, HB_dialog, $q) {

            $scope.model = {
                distribution: null,
                configState: 'configed',
                projectConfigState: 'configed',
                physicsId: '',
                physicsName: '',
                physicsAddress: '',
                physicsTime: '',
                physicsRemark: '',
                pickUpChecked: '',
                postChecked: '',
                deliveryModeParam: {
                    id: '',
                    pickUp: '',
                    post: '',
                    openApplyInvoiceWindow: ''
                },
                PhysicsStorageParam: {
                    name: '',
                    address: '',
                    pullDownTime: '',
                    remark: '',
                    state: '',
                    unitId:""

                },
                carrierId: '',
                carrierName: '',
                carrierUrl: '',
                CommonCarrierParam: {
                    name: '',
                    interfaceUrl: '',
                    unitId:""
                },
                PhysicsStoragePage: {
                    pageNo: 1,
                    pageSize: 10
                },
                CommonCarrierPage: {
                    pageNo: 1,
                    pageSize: 10
                }
            };

            $scope.kendoPlus = {
                configedGridInstance : null,
                 configingGridInstance : null,
            };
            $scope.flagModel = {
                tabType :"OWN"
            };
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            $scope.events = {

                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                tabClick:function (e,type) {
                    $scope.flagModel.tabType = type;
                    if (type == "OWN"){
                        $scope.targetUnitId = '';
                        $scope.model.CommonCarrierParam.unitId = '';
                        $scope.model.PhysicsStorageParam.unitId = '';
                        $scope.events.findDeliveryMode();
                    }
                },
                loadAgain :function (e) {
                    $scope.events.findDeliveryMode();
                    $scope.kendoPlus.configingGridInstance.dataSource.page(1);
                    $scope.kendoPlus.configedGridInstance.dataSource.page(1);
                },
                //项目级选中查看的单位
                unitSetCallback:function (unitId) {
                    $scope.targetUnitId = unitId;
                    $scope.model.CommonCarrierParam.unitId = unitId;
                    $scope.model.PhysicsStorageParam.unitId = unitId;
                },
                info: function () {
                    distributionManagerService.info().then(function (reponse) {
                        if (reponse.status) {
                            $scope.model.distribution = reponse.info;
                        } else {
                            $scope.globle.showTip(reponse.info, 'error');
                        }
                    });
                },

                tabConfig: function (state,rang) {
                    if (rang == 'OWN'){
                        $scope.model.configState = state;
                    }else {
                        $scope.model.projectConfigState = state;
                    }
                },

                isPickUp: function () {
                    if ($scope.model.pickUpChecked == true) {
                        $scope.model.pickUpChecked = false;
                        $scope.model.deliveryModeParam.pickUp = false;
                    } else {
                        $scope.model.pickUpChecked = true;
                        $scope.model.deliveryModeParam.pickUp = true;
                    }
                    if ($scope.model.postChecked == true) {
                        $scope.model.deliveryModeParam.post = true;
                    } else {
                        $scope.model.deliveryModeParam.post = false;
                    }


                    distributionManagerService.saveDeliveryMode($scope.model.deliveryModeParam).then(function (data) {
                        if(!data.status){
                            HB_dialog.error('提示',data.info);
                            $scope.model.pickUpChecked = false;
                            $scope.model.deliveryModeParam.pickUp = false;
                        }
                    });
                },
                isPost: function () {
                    if ($scope.model.pickUpChecked == true) {
                        $scope.model.deliveryModeParam.pickUp = true;

                    } else {
                        $scope.model.deliveryModeParam.pickUp = false;
                    }
                    if ($scope.model.postChecked == true) {
                        $scope.model.postChecked = false;
                        $scope.model.deliveryModeParam.post = false;
                    } else {
                        $scope.model.postChecked = true;
                        $scope.model.deliveryModeParam.post = true;
                    }
                    distributionManagerService.saveDeliveryMode($scope.model.deliveryModeParam).then(function (data) {
                        if(!data.status){
                            HB_dialog.error('提示',data.info);
                            $scope.model.postChecked = false;
                            $scope.model.deliveryModeParam.post = false;
                        }
                    });
                },
                findDeliveryMode: function () {
                    
                    distributionManagerService.findDeliveryMode($scope.targetUnitId).then(function (data) {
                        $scope.model.deliveryModeParam.id = data.info.id;
                        $scope.model.deliveryModeParam.pickUp = data.info.pickUp;
                        $scope.model.deliveryModeParam.post = data.info.post;
                        $scope.model.deliveryModeParam.openApplyInvoiceWindow = data.info.openApplyInvoiceWindow;
                        $scope.model.pickUpChecked = data.info.pickUp;
                        $scope.model.postChecked = data.info.post;


                    });
                },

                wipeData: function () {
                    $scope.model.physicsName = '';
                    $scope.model.physicsAddress = '',
                        $scope.model.physicsTime = '',
                        $scope.model.physicsRemark = '',
                        $scope.model.carrierName = '',
                        $scope.model.carrierUrl = '';
                },


                addPhysicsStorage: function () {
                    $scope.events.wipeData();
                    HB_dialog.contentAs($scope, {
                        templateUrl: '@systemUrl@/views/distributionManager/physicsStorageDialog.html',
                        title: '添加自取点',
                        width: 700,
                        height: 400,
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;


                            if (validateIsNull($scope.model.physicsName)) {
                                HB_dialog.warning('警告', '请输入自取点名称');
                                wow.requestIng = false;
                                defer.resolve();
                                return promise;
                            }
                            ;
                            if (validateIsNull($scope.model.physicsAddress)) {
                                HB_dialog.warning('警告', '请输入领取地址点');
                                wow.requestIng = false;
                                defer.resolve();
                                return promise;
                            }
                            ;
                            if (validateIsNull($scope.model.physicsTime)) {
                                HB_dialog.warning('警告', '请输入领取时间');
                                wow.requestIng = false;
                                defer.resolve();
                                return promise;
                            }
                            ;
                            if (validateIsNull($scope.model.physicsRemark)) {
                                HB_dialog.warning('警告', '请输入备注');
                                wow.requestIng = false;
                                defer.resolve();
                                return promise;
                            }
                            ;
                            var param = {
                                id: '',
                                name: $scope.model.physicsName,
                                address: $scope.model.physicsAddress,
                                pullDownTime: $scope.model.physicsTime,
                                remark: $scope.model.physicsRemark
                            };
                            distributionManagerService.savePhysicalStorage(param
                            ).then(function (data) {
                                    if (data.info != null) {
                                        HB_dialog.success('提示', '添加成功');
                                    } else {
                                        HB_dialog.error('提示', '添加失败');
                                    }
                                }
                            );
                            defer.resolve();
                            wow.close();
                            return promise;

                        },
                        cancel: function () {
                        }
                    });
                },


                addCommonCarrier: function () {
                    $scope.events.wipeData();

                    HB_dialog.contentAs($scope, {
                        templateUrl: '@systemUrl@/views/distributionManager/commonCarrierDialog.html',
                        title: '添加服务商',
                        width: 700,
                        height: 300,
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;
                            if (validateIsNull($scope.model.carrierName)) {
                                HB_dialog.warning('警告', '请输入服务商名称');
                                wow.requestIng = false;
                                defer.resolve();
                                return promise;
                            }
                            ;
                            if (validateIsNull($scope.model.carrierUrl)) {
                                HB_dialog.warning('警告', '请输入查询网址');
                                wow.requestIng = false;
                                defer.resolve();
                                return promise;
                            }
                            ;

                            var param = {
                                id: '',
                                name: $scope.model.carrierName,
                                interfaceUrl: $scope.model.carrierUrl
                            };
                            distributionManagerService.saveCommonCarrier(param
                            ).then(function (data) {
                                    if (data.info == 'suc') {
                                        HB_dialog.success('提示', '添加成功');
                                    } else {
                                        HB_dialog.warning('警告', '名称已经存在！');
                                    }
                                }
                            );
                            defer.resolve();
                            wow.close();
                            return promise;

                        },
                        cancel: function () {
                        }
                    });
                },
                updatePhysicalStorage: function ($event, dataItem) {

                    distributionManagerService.findPhysicalStorage(dataItem.id).then(function (physics) {
                        $scope.events.wipeData();
                        $scope.model.physicsId = physics.info.id;
                        $scope.model.physicsName = physics.info.name,
                            $scope.model.physicsAddress = physics.info.address,
                            $scope.model.physicsTime = physics.info.pullDownTime,
                            $scope.model.physicsRemark = physics.info.remark;
                    });
                    distributionManagerService.updatePhysicalStorage(dataItem).then(function (data) {

                        HB_dialog.contentAs($scope, {
                            templateUrl: '@systemUrl@/views/distributionManager/physicsStorageDialog.html',
                            title: '修改自取点',
                            width: 700,
                            height: 500,
                            sure: function (wow) {
                                var defer = $q.defer(),
                                    promise = defer.promise;
                                if (validateIsNull($scope.model.physicsName)) {
                                    HB_dialog.warning('警告', '请输入自取点名称');
                                    wow.requestIng = false;
                                    defer.resolve();
                                    return promise;
                                }
                                ;
                                if (validateIsNull($scope.model.physicsAddress)) {
                                    HB_dialog.warning('警告', '请输入领取地址点');
                                    wow.requestIng = false;
                                    defer.resolve();
                                    return promise;
                                }
                                ;
                                if (validateIsNull($scope.model.physicsTime)) {
                                    HB_dialog.warning('警告', '请输入领取时间');
                                    wow.requestIng = false;
                                    defer.resolve();
                                    return promise;
                                }
                                ;
                                if (validateIsNull($scope.model.physicsRemark)) {
                                    HB_dialog.warning('警告', '请输入备注');
                                    wow.requestIng = false;
                                    defer.resolve();
                                    return promise;
                                }
                                var param = {
                                    id: $scope.model.physicsId,
                                    name: $scope.model.physicsName,
                                    address: $scope.model.physicsAddress,
                                    pullDownTime: $scope.model.physicsTime,
                                    remark: $scope.model.physicsRemark
                                };
                                distributionManagerService.savePhysicalStorage(param
                                ).then(function (data) {
                                        if (data.info != null) {
                                            HB_dialog.success('提示', '修改成功');
                                        } else {
                                            HB_dialog.error('提示', '修改失败');
                                        }

                                    }
                                );


                                defer.resolve();
                                wow.close();
                                return promise;

                            },
                            cancel: function () {

                            }
                        });

                    });
                },


                //修改服务商
                updateCommonCarrier: function ($event, dataItem) {

                    distributionManagerService.findCommonCarrier(dataItem.id).then(function (data) {
                        $scope.events.wipeData();
                        $scope.model.carrierId = data.info.id,
                            $scope.model.carrierName = data.info.name,
                            $scope.model.carrierUrl = data.info.interfaceUrl;
                    });
                    // distributionManagerService.updateCommonCarrier(dataItem).then(function (result) {

                    HB_dialog.contentAs($scope, {
                        templateUrl: '@systemUrl@/views/distributionManager/commonCarrierDialog.html',
                        title: '修改服务商',
                        width: 700,
                        height: 400,
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;


                            if (validateIsNull($scope.model.carrierName)) {
                                HB_dialog.warning('警告', '请输入承运商名称');
                                wow.requestIng = false;
                                defer.resolve();
                                return promise;
                            }
                            ;
                            if (validateIsNull($scope.model.carrierUrl)) {
                                HB_dialog.warning('警告', '请输入查询网址');
                                wow.requestIng = false;
                                defer.resolve();
                                return promise;
                            }
                            var param = {
                                id: $scope.model.carrierId,
                                name: $scope.model.carrierName,
                                interfaceUrl: $scope.model.carrierUrl
                            };
                            distributionManagerService.updateCommonCarrier(param
                            ).then(function (data) {
                                    if (data.info == 'suc') {
                                        HB_dialog.success('提示', '修改成功');
                                        $scope.kendoPlus.configingGridInstance.dataSource.read();
                                    } else if (data.info == 'repeat') {
                                        HB_dialog.warning('提示', '名字重复');
                                    } else {
                                        HB_dialog.error('提示', '修改失败');
                                    }
                                    $scope.events.wipeData();

                                }
                            );


                            defer.resolve();
                            wow.close();
                            return promise;

                        },
                        cancel: function () {

                        }
                    });


                    // })


                },
                stopPhysicalStorage: function ($event, dataItem) {
                    $scope.globle.confirm('停用', '确定要停用自取点吗？', function (dialog) {
                        return distributionManagerService.stopPhysicalStorage(dataItem.id).then(function (data) {
                            dialog.doRightClose();
                            $scope.kendoPlus.configedGridInstance.dataSource.read();
                            $scope.globle.showTip('操作成功', 'success');

                        });
                    });
                },
                openPhysicalStorage: function ($event, dataItem) {
                    $scope.globle.confirm('启用', '确定要启用自取点吗？', function (dialog) {
                        return distributionManagerService.openPhysicalStorage(dataItem.id).then(function (data) {
                            dialog.doRightClose();

                            $scope.globle.showTip('操作成功', 'success');
                            $scope.kendoPlus.configedGridInstance.dataSource.read();

                        });


                    });

                },

                deletePhysicalStorage: function ($event, dataItem) {
                    if (dataItem.state == '1') {
                        HB_dialog.warning('警告', '请先停用！');
                        return;
                    }

                    HB_notification.confirm('删除后，此自取点不可恢复，是否确认删除？', function (dialog) {
                        return distributionManagerService.deletePhysicalStorage(dataItem.id).then(function (data) {
                            dialog.doRightClose();
                            $scope.kendoPlus.configedGridInstance.dataSource.read();
                            if (data.info == 'suc') {
                                $scope.globle.showTip('删除成功', 'success');
                            } else if (data.info == 'use') {
                                HB_dialog.warning('警告', '已被订单使用无法删除！');
                            }

                        });
                    });
                },


                openUrl: function ($event, dataItem) {
                    window.open(dataItem.interfaceUrl);
                },

                deleteCommonCarrier: function ($event, dataItem) {

                    HB_notification.confirm('删除后，此承运商不可恢复，是否确认删除？', function (dialog) {
                        return distributionManagerService.deleteCommonCarrier(dataItem.id).then(function (data) {
                            dialog.doRightClose();
                            $scope.kendoPlus.configedGridInstance.dataSource.read();
                            if (data.info == 'suc') {
                                $scope.globle.showTip('删除成功', 'success');
                            } else {
                                $scope.globle.showTip('删除失败', 'error');
                            }

                        });
                    });
                }


            };


            //自取点

            var configedGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('#:index #');
                result.push('</td>');


                result.push('<td>');
                result.push('<span >#:name #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: address #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: pullDownTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: remark #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-if="#:state==1#">可用</span>' + '<span ng-if="#:state==2#">停用</span>' + '<span ng-if="#:state==3#">停用</span>');

                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.updatePhysicalStorage($event,dataItem)" ng-disabled="flagModel.tabType == \'PROJECT\'">修改</button>');
                result.push('<button type="button" class="table-btn" ng-if="#:state==1#" ng-click="events.stopPhysicalStorage($event,dataItem)" ng-disabled="flagModel.tabType == \'PROJECT\'">停用</button>');
                result.push('<button type="button" class="table-btn" ng-if="#:state==2||state==3# " ng-click="events.openPhysicalStorage($event,dataItem)" ng-disabled="flagModel.tabType == \'PROJECT\'">启用</button>');
                //result.push('<button type="button" class="table-btn" ng-click="events.PhysicalStorage($event,dataItem,0)">详细</button>');
                result.push('<button type="button" class="table-btn"  ng-click="events.deletePhysicalStorage($event,dataItem)"  ng-disabled="flagModel.tabType == \'PROJECT\'">删除</button>');
                result.push('</td>');
                result.push('</tr>');

                configedGridRowTemplate = result.join('');
            })();

            $scope.configedGrid = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: configedGridRowTemplate,
                    url: '/web/admin/distributionManager/findPhysicalStoragePage',
                    scope: $scope,
                    page: 'PhysicsStoragePage',
                    param: $scope.model.PhysicsStorageParam,
                    fn: function (response) {
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {field: 'name', title: '自取点名称', sortable: false, width: 100},
                        {field: 'address', title: '领取地点', sortable: false, width: 200},
                        {field: 'pullDownTime', title: '领取时间', sortable: false, width: 200},
                        {field: 'remark', title: '备注', sortable: false, width: 300},
                        {field: 'state', title: '状态', sortable: false, width: 80},
                        {
                            title: '操作', width: 200
                        }
                    ]
                })
            };

            //承运商
            var configingGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('#:index #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span >#:name #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button class="table-btn" ng-click="events.openUrl($event,dataItem)">#: interfaceUrl #</button>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-disabled="flagModel.tabType == \'PROJECT\'" ng-click="events.updateCommonCarrier($event,dataItem)">修改</button>');
                //  result.push('<button type="button" class="table-btn" ng-click="events.PhysicalStorage($event,dataItem,0)">详细</button>');
                result.push('<button type="button" class="table-btn" ng-disabled="flagModel.tabType == \'PROJECT\'" ng-click="events.deleteCommonCarrier($event,dataItem)" >删除</button>');
                result.push('</td>');
                result.push('</tr>');

                configingGridRowTemplate = result.join('');
            })();

            $scope.configingGrid = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: configingGridRowTemplate,
                    url: '/web/admin/distributionManager/findCommonCarrierPage',
                    scope: $scope,
                    page: 'CommonCarrierPage',
                    param: $scope.model.CommonCarrierParam,
                    fn: function (response) {

                        $scope.configingArr = response.info;
                    },
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {field: 'name', title: '快递公司', sortable: false, width: 200},
                        {field: 'interfaceUrl', title: '单号查询网址', sortable: false, width: 400},

                        {
                            title: '操作', width: 200
                        }
                    ]
                })
            };
            //加载寄送方式
            $scope.events.findDeliveryMode();


        }
    ];
});
