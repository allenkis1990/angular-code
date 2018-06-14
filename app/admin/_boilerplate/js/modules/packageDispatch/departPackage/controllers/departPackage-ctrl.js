define(function (detail) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification', 'TabService',
            function ($scope, $stateParams, $http, $q, HB_dialog, $state, HB_notification, TabService) {
                $scope.model = {
                    getPackageInfo: {},
                    packageContentList: [],
                    splitSubPackageDtoList: [],
                    takeGoodsInfo: {}
                };
                $scope.node = {};
                $scope.currentPackage = 0;
                $scope.model.splitSubPackageDtoList = [];
                $scope.model.splitSubPackageDtoList.push({
                    packageContentList: []
                });
                //$scope.model.splitSubPackageDtoList[$scope.currentPackage]=[];
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

                // 获取地市
                var city = $http.get('/web/login/login/findRegion?parentId=0')

                    .then(function (data) {
                        $scope.model.cityArr = data.data.info;
                    });

                $http.get('/web/admin/packageDeliveryManager/getPackageInfoByInvoiceId/' + $stateParams.invoiceShowId)
                    .success(function (data) {
                        $scope.model.getPackageInfo = data.info;
                        $scope.model.getPackageInfo.receiveContent = data.info.receiveContent;
                        $scope.copyReceiveContent = angular.copy($scope.model.getPackageInfo.receiveContent);
                        $scope.model.packageContentList = data.info.packageContentList;
                    }).error(function (data) {
                });
                $scope.model.utils = {
                    isSelected: function (id) {
                        var isSelected = false;
                        angular.forEach($scope.model.splitSubPackageDtoList, function (item, index) {
                            angular.forEach(item.packageContentList, function (data, index) {
                                angular.forEach(data.invoiceGoodDtoList, function (data1, index) {
                                    if (data1.invoiceGoodRelIds == id) {
                                        isSelected = true;
                                    }
                                });
                            });

                        });
                        return isSelected;
                    }
                };
                $scope.events = {
                    changeCity: function () {
                        $scope.model.takeGoodsInfo.districtId = '';
                        if ($scope.model.takeGoodsInfo.cityId === null || $scope.model.takeGoodsInfo.cityId === '') {
                            $scope.model.areaArr = [];
                        } else {
                            /* myOrderService.findRegionByParentId($scope.model.takeGoodsInfo.cityId).then(function (data) {
                                 $scope.model.areaArr = data.info;
                             });*/
                            $http.get('/web/login/login/findRegion?parentId=' + $scope.model.takeGoodsInfo.cityId)

                                .then(function (data) {
                                    $scope.model.areaArr = data.data.info;
                                });
                        }

                    },

                    departPackage: function () {
                        var addPackage = false;
                        angular.forEach($scope.model.splitSubPackageDtoList, function (item, index) {
                            if (index === $scope.currentPackage) {
                                angular.forEach(item.packageContentList, function (data) {
                                    if (data.invoiceGoodDtoList.length !== 0) {
                                        addPackage = true;
                                    } else {
                                        addPackage = false;
                                    }
                                });
                            }
                        });
                        if (addPackage) {
                            console.log($scope.model.splitSubPackageDtoList);
                            $http.post('/web/admin/packageDeliveryManager/splitPackage', {
                                deliveryWayType: $scope.model.getPackageInfo.deliveryWayType,
                                invoiceShowId: $scope.model.getPackageInfo.invoiceShowId,
                                splitSubPackageDtoList: $scope.model.splitSubPackageDtoList
                            })
                                .success(function (data) {
                                    if (data.status) {
                                        HB_dialog.success('提示', data.info);
                                        /*  $state.go('states.packageDispatch');*/
                                        $state.go('states.packageDispatch', {}).then(function () {
                                            toggleTabBusy(true);
                                        });
                                    } else {
                                        HB_dialog.error('提示', data.info);
                                    }
                                }).error(function (data) {
                            });

                            return;
                        } else {
                            $scope.globle.alert('提示', '请向新包裹添加物品，或者删除新包裹！');
                            return;
                        }
                    },
                    addPackage: function () {
                        if ($scope.model.splitSubPackageDtoList.length !== 0) {
                            var addPackage = false;
                            angular.forEach($scope.model.splitSubPackageDtoList, function (item, index) {
                                if (index === $scope.currentPackage) {
                                    angular.forEach(item.packageContentList, function (data) {
                                        if (data.invoiceGoodDtoList.length !== 0) {
                                            addPackage = true;
                                        } else {
                                            addPackage = false;
                                        }
                                    });
                                }
                            });
                            if (addPackage) {
                                $scope.model.splitSubPackageDtoList.push({
                                    packageContentList: []
                                });
                                $scope.currentPackage = $scope.currentPackage + 1;
                                return;
                            } else {
                                $scope.globle.alert('提示', '请向新包裹添加物品，或者删除新包裹！');
                                return;
                            }
                        } else {
                            $scope.model.splitSubPackageDtoList.push({
                                packageContentList: []
                            });
                        }


                        console.log($scope.model.splitSubPackageDtoList);
                    },
                    delPackage: function (index) {
                        /*if( $scope.currentPackage===0){
                            $scope.globle.alert('提示', '默认有一个包裹');
                        }else{*/
                        $scope.globle.confirm('提示', '确定删除“包裹' + index + '”吗？', function () {
                            $scope.model.splitSubPackageDtoList.splice($scope.currentPackage, 1);
                            $scope.currentPackage = $scope.currentPackage - 1;
                            if ($scope.currentPackage === -1) {
                                $scope.currentPackage = 0;
                            }
                            console.log($scope.currentPackage);
                        });
                        /* }*/


                    },
                    choosePackage: function (order, selectDate) {
                        if ($scope.model.splitSubPackageDtoList.length === 0) {
                            $scope.globle.alert('提示', '请添加一个包裹');
                            return;
                        }
                        console.log($scope.model.splitSubPackageDtoList[$scope.currentPackage]);
                        if ($scope.model.splitSubPackageDtoList.length === 1 && $scope.model.splitSubPackageDtoList[$scope.currentPackage] !== undefined && $scope.model.splitSubPackageDtoList[$scope.currentPackage].hasOwnProperty('receiveContent')) {
                            var add = true;
                            angular.forEach($scope.model.splitSubPackageDtoList[$scope.currentPackage].packageContentList, function (item) {
                                if (item.orderNo === order.orderNo) {
                                    item.invoiceGoodDtoList.push(selectDate);
                                    add = false;
                                }
                            });
                            if (add) {
                                $scope.model.splitSubPackageDtoList[$scope.currentPackage].packageContentList.push({
                                    orderNo: order.orderNo,
                                    traceSuccessTime: order.traceSuccessTime,
                                    invoiceGoodDtoList: [selectDate]
                                });
                            }
                        } else {

                            $scope.model.splitSubPackageDtoList.splice($scope.currentPackage, 1);
                            $scope.model.splitSubPackageDtoList.push({
                                packageContentList: [
                                    {
                                        orderNo: order.orderNo,
                                        traceSuccessTime: order.traceSuccessTime,
                                        invoiceGoodDtoList: [selectDate]
                                    }],
                                receiveContent: $scope.copyReceiveContent,
                                deliveryWayType: $scope.model.getPackageInfo.deliveryWayType
                            });

                        }

                    },
                    unchoosePackage: function (order, selectDate) {
                        console.log($scope.model.splitSubPackageDtoList);
                        angular.forEach($scope.model.splitSubPackageDtoList, function (item, index) {
                            angular.forEach(item.packageContentList, function (data, index0) {
                                angular.forEach(data.invoiceGoodDtoList, function (data1, index1) {
                                    if (data1.invoiceGoodRelIds == selectDate.invoiceGoodRelIds) {
                                        data.invoiceGoodDtoList.splice(index1, 1);

                                        if (data.invoiceGoodDtoList.length === 0) {
                                            item.packageContentList.splice(index0, 1);
                                            if (item.packageContentList.length === 0) {
                                                $scope.model.splitSubPackageDtoList.splice(index, 1);
                                                $scope.model.splitSubPackageDtoList.push({
                                                    packageContentList: []
                                                });
                                            }
                                        }
                                        console.log(data.invoiceGoodDtoList);
                                        return;
                                    }
                                });
                            });

                        });
                    },
                    updateCurrentAddress: function (form) {
                        if (form.receiverName.$error.required === true) {
                            /* $dialog.confirm({
                                 title: '提示',
                                 visible: true,
                                 modal: true,
                                 width: 250,
                                 ok: function () {
                                     return true;
                                 },
                                 content: '请填写收件人！'
                             });*/
                            HB_dialog.error('提示', '请填写收件人！');
                            return false;
                        }

                        if (form.mobileNo.$error.required === true || form.mobileNo.$error.pattern === true) {
                            /* $dialog.confirm({
                                 title: '提示',
                                 visible: true,
                                 modal: true,
                                 width: 250,
                                 ok: function () {
                                     return true;
                                 },
                                 content: '请填写11位正确的手机号！！'
                             });*/
                            HB_dialog.error('提示', '请填写11位正确的手机号！！');
                            return false;
                        }

                        if ($scope.model.takeGoodsInfo.cityId === '' || $scope.model.takeGoodsInfo.cityId === null || $scope.model.takeGoodsInfo.districtId === '' || $scope.model.takeGoodsInfo.districtId === null) {
                            /*$dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '请填写收件地区！！'
                            });*/
                            HB_dialog.error('提示', '请填写收件地区！！');
                            return false;
                        }

                        if (form.addressDetails.$error.required === true) {
                            /*  $dialog.confirm({
                                  title: '提示',
                                  visible: true,
                                  modal: true,
                                  width: 250,
                                  ok: function () {
                                      return true;
                                  },
                                  content: '请填写收件详址！！'
                              });*/
                            HB_dialog.error('提示', '请填写收件详址！！');
                            return false;
                        }

                        if (form.postCode.$error.required === true || form.postCode.$error.pattern === true) {
                            /* $dialog.confirm({
                                 title: '提示',
                                 visible: true,
                                 modal: true,
                                 width: 250,
                                 ok: function () {
                                     return true;
                                 },
                                 content: '请填写6位的邮政编码！！'
                             });*/
                            HB_dialog.error('提示', '请填写6位的邮政编码！！');
                            return false;
                        }
                        $scope.model.cityName = findSome($scope.model.takeGoodsInfo.cityId, $scope.model.cityArr);
                        $scope.model.areaName = findSome($scope.model.takeGoodsInfo.districtId, $scope.model.areaArr);
                        console.log($scope.updateCurrent);
                        console.log($scope.model.splitSubPackageDtoList);
                        angular.forEach($scope.model.splitSubPackageDtoList, function (item, index) {
                            if ($scope.updateCurrent === index) {
                                console.log(item);
                                item.receiveContent.recipientsPostcode = $scope.model.takeGoodsInfo.postCode;
                                item.receiveContent.recipients = $scope.model.takeGoodsInfo.receiverName;
                                item.receiveContent.recipientsPhone = $scope.model.takeGoodsInfo.mobileNo;
                                item.receiveContent.recipientsSpecificAddress = $scope.model.takeGoodsInfo.addressDetails;
                                item.receiveContent.cityCode = $scope.model.takeGoodsInfo.cityId;
                                item.receiveContent.countyCode = $scope.model.takeGoodsInfo.districtId;
                                item.receiveContent.recipientsAddress = '福建省' + $scope.model.cityName + $scope.model.areaName + $scope.model.takeGoodsInfo.addressDetails + ' ' + $scope.model.takeGoodsInfo.postCode;
                            }
                        });
                        /* $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipientsPostcode= $scope.model.takeGoodsInfo.postCode;
                         $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipients= $scope.model.takeGoodsInfo.receiverName;
                         $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipientsPhone=$scope.model.takeGoodsInfo.mobileNo;
                         $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipientsSpecificAddress= $scope.model.takeGoodsInfo.addressDetails;
                         $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.cityCode= $scope.model.takeGoodsInfo.cityId;
                         $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.countyCode= $scope.model.takeGoodsInfo.districtId;
                         $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipientsAddress='福建省'+ $scope.model.cityName+$scope.model.areaName+ $scope.model.takeGoodsInfo.addressDetails+$scope.model.takeGoodsInfo.postCode;
                         */
                        $scope['addressWindow'].close();
                    },
                    updateAddress: function (index) {
                        console.log($scope.model.splitSubPackageDtoList[index].receiveContent);
                        $scope['addressWindow'].center().open();
                        $scope.updateCurrent = index;
                        $scope.copyReceiveContent = angular.copy($scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent);
                        //console.log($scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent);
                        $scope.model.takeGoodsInfo.postCode = $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipientsPostcode;
                        $scope.model.takeGoodsInfo.receiverName = $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipients;
                        $scope.model.takeGoodsInfo.mobileNo = $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipientsPhone;
                        $scope.model.takeGoodsInfo.addressDetails = $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.recipientsSpecificAddress;
                        $scope.model.takeGoodsInfo.cityId = $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.cityCode;
                        $scope.model.takeGoodsInfo.districtId = $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent.countyCode;
                        //console.log($scope.model.takeGoodsInfo.districtId);
                        $http.get('/web/login/login/findRegion?parentId=' + $scope.model.takeGoodsInfo.cityId)
                            .then(function (data) {
                                $scope.model.areaArr = data.data.info;
                            });
                    },
                    openKendoWindow: function (windowName) {
                        $scope[windowName].center().open();
                    },
                    closeUpdate: function (windowName) {
                        $scope[windowName].close();
                        $scope.model.splitSubPackageDtoList[$scope.updateCurrent].receiveContent = $scope.copyReceiveContent;
                    },
                    closeKendoWindow: function (windowName) {
                        $scope[windowName].close();
                    }
                };

                //用ID去查找市 区名
                function findSome (id, arr) {
                    var some = null;
                    angular.forEach(arr, function (item, index) {
                        if (item.id === id) {
                            some = item.name;
                        }
                    });
                    return some;
                }

                function toggleTabBusy (noah) {
                    $scope.isLodingGrid = noah;
                    // hbUtil.toggleBuzy($('#state_package_dispatch_toggle_tab'), noah);
                }
            }]
    };
});