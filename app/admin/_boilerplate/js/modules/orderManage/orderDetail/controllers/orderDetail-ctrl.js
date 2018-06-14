define(function (detail) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'orderManageService', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification', 'TabService',
            function ($scope, orderManageService, $stateParams, $http, $q, HB_dialog, $state, HB_notification, TabService) {

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

                $scope.model = {
                    orderDetail: {},
                    lineWidthStyle: null,
                    linePreStyle: null,
                    guanlianOrder: [],
                    initOrder: {},
                    closeOrderDesc: ''
                };
                //初始化退款原因
                initRefundReason();

                $scope.events = {
                    openKendoWindow: function (item) {

                        $http.get('/web/admin/orderManage/getAssociatedOrder/' + item.subOrderNo).success(function (data) {
                            $scope.model.initOrder = data.info.initialOrder;
                            $scope.model.guanlianOrder = data.info.derivativeOrderList;
                        });

                        $scope.kendoWindow.center().open();
                    },

                    closeKendoWindow: function () {
                        $scope.kendoWindow.close();
                    },

                    closeTheOrder: function () {
                        $scope.temporaryOrderNo = $scope.model.orderDetail.orderNo;
                        HB_dialog.contentAs($scope, {
                            title: '关闭订单理由选择',
                            width: 550,
                            templateUrl: '@systemUrl@/views/orderManage/closeOrderDesDialog.html',

                            cancel: function () {
                                $scope.model.closeOrderDesc = '';
                            },

                            sure: function (dialog) {

                                var defer = $q.defer(),
                                    promise = defer.promise;
                                if (validateIsNull($scope.model.closeOrderDesc)) {
                                    $scope.model.closeOrderDesc = '关闭订单';
                                    /*HB_dialog.warning('提示','请选择关闭理由');
                                     defer.resolve();
                                     return promise;*/
                                }

                                orderManageService.closeTheOrder($scope.temporaryOrderNo, $scope.model.closeOrderDesc).then(function (data) {
                                    defer.resolve();
                                    if (data.status) {
                                        HB_dialog.success('提示', data.info.message || '关闭订单成功');
                                        dialog.close();
                                        $scope.model.closeOrderDesc = '';
                                    } else {
                                        HB_dialog.warning('提示', data.info);
                                        $scope.model.closeOrderDesc = '';
                                        //defer.resolve();
                                    }
                                });
                                return promise;
                            }
                        });
                    },

                    openTheClass: function () {
                        HB_notification.confirm('是否确认开通，确认开通后该订单对应的培训班将直接开班！', function (dialog) {
                            return $http.get('/web/admin/orderManage/redeliver/' + $scope.model.orderDetail.orderNo).success(function (data) {
                                dialog.doRightClose();
                                if (data.status && data.info === true) {
                                    HB_dialog.success('提示', '系统正在开通中');
                                    $state.reload($state.current.name);
                                } else {
                                    HB_dialog.warning('提示', data.info);
                                }
                            });
                        });

                    },

                    afterCopy: function (deliveryCompanyUrl) {
                        // 默认打开ems
                        window.open(deliveryCompanyUrl || 'http://www.ems.com.cn/');
                    },
                    openRefunWindow: function (item) {
                        $scope.tempRefunPrice = item.totalAmount;
                        $scope.dealPrice = item.dealPrice;
                        $scope.tempSubOrder = item.subOrderNo;
                        orderManageService.enableRefund(item.subOrderNo).then(function (data) {
                            //data.code='309021';
                            switch (data.code) {
                                case '200':
                                    $scope.refunWindow.center().open();
                                    //$scope.model.refundType='1';
                                    break;
                                case '10003':
                                    HB_dialog.warning('警告', data.message);
                                    break;
                                case '10004':
                                    HB_dialog.warning('警告', data.message);
                                    break;
                                case '309021':
                                    HB_dialog.warning('警告', data.message + '无法退款');
                                    break;

                                case '309022':
                                    HB_dialog.warning('警告', data.message + '无法退款');
                                    break;

                                case '309023':
                                    HB_dialog.warning('警告', data.message + '无法退款');
                                    break;

                                case '309024':
                                    HB_dialog.warning('警告', data.message + '无法退款');
                                    break;
                            }
                        });
                        /*$scope.tempRefunPrice=item.totalAmount;
                         $scope.refunWindow.center().open();*/
                    },
                    confirmRefun: function () {
                        if ($scope.model.refunId === '' || $scope.model.refunId === null) {
                            HB_dialog.warning('警告', '请选择退款理由');
                            return false;
                        }
                        if ($scope.model.refunDesc === '' || $scope.model.refunDesc === null || $scope.model.refunDesc === undefined) {
                            HB_dialog.warning('警告', '请填写退款说明');
                            return false;
                        }

                        $scope.refunSubmitAble = true;
                        orderManageService.applyRefund($scope.tempSubOrder, $scope.model.refunId, $scope.model.refunDesc).then(function (data) {
                            $scope.refunSubmitAble = false;
                            if (data.code === '200') {
                                HB_dialog.success('提示', '退款申请成功');
                                $state.reload($state.current.name);
                            }

                            if (data.code === '309023') {
                                HB_dialog.warning('警告', data.message);
                            }
                            if (data.code === '10003') {
                                HB_dialog.warning('警告', data.message);
                            }
                            if (data.code === '10004') {
                                HB_dialog.warning('警告', data.message);
                            }
                            $scope.events.closeRefunWindow();
                        });
                    },
                    goRefunDetail: function (item) {
                        TabService.appendNewTab('退款详情', 'states.refundManage.refundDetail', {orderNo: item.refundOrderNo}, 'states.refundManage', true);
                    },
                    closeRefunWindow: function () {
                        $scope.refunWindow.close();
                    }
                };

                $scope.utils = {
                    validateIsNull: function (obj) {
                        return validateIsNull(obj);
                    }
                };

                orderManageService.getOrderDetail($stateParams.orderNo).then(function (data) {
                    if (data.status) {
                        $scope.model.orderDetail = data.info;
                        $scope.model.total = getTotalLabelPrice($scope.model.orderDetail.subOrderList);
                        //$scope.model.orderDetail.statusLogList.length=2
                        if ($scope.model.orderDetail.statusLogList.length === 2) {
                            $scope.model.lineWidthStyle = {width: '50%'};
                        } else {
                            $scope.model.lineWidthStyle = {width: '25%'};
                        }

                        //当前第几步
                        var len = getStepNum();
                        console.log(getStepNum());

                        if (len === 1) {
                            $scope.model.linePreStyle = {width: '25%'};
                        }

                        if (len === 2 && $scope.model.orderDetail.statusLogList.length !== 2) {
                            $scope.model.linePreStyle = {width: '50%'};
                        }

                        if (len === 3) {
                            $scope.model.linePreStyle = {width: '75%'};
                        }

                        if (len === $scope.model.orderDetail.statusLogList.length) {
                            $scope.model.linePreStyle = {width: '100%'};
                        }

                    }
                });


                function getTotalLabelPrice (arr) {
                    var total = 0;
                    angular.forEach(arr, function (item) {
                        total = accAdd(total, item.labelPrice);
                    });
                    return total;
                }

                //解决JS精度丢失问题
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

                function getStepNum () {
                    var arr = [];
                    angular.forEach($scope.model.orderDetail.statusLogList, function (item) {
                        if (item.processed === true) {
                            arr.push(item);
                        }
                    });
                    return arr.length;
                }

                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                };

                function initRefundReason () {
                    orderManageService.listRefundReason().then(function (data) {
                        if (data.status) {
                            $scope.model.refunList = data.info;
                        }
                    });
                };
            }]
    };
});