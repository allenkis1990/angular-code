define(function (detail) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'refundManageService', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification', 'TabService',
            function ($scope, refundManageService, $stateParams, $http, $q, HB_dialog, $state, HB_notification, TabService) {
                $scope.model = {
                    datasuccess: true,
                    lineWidthStyle: null,
                    linePreStyle: null,
                    closeOrderDesc: '',
                    enforce: ''
                };

                $scope.kendoPlus = {
                    /* classGridInstance    : null,
                     canChangeGridInstance: null,
                     changeRecordInstance : null,*/
                    windowOptions: {
                        modal: true,
                        visible: false,
                        resizable: false,
                        draggable: false,
                        title: false,
                        width: 400,
                        height: 200,
                        open: function () {
                            this.center();
                        }
                    },
                    rejectwindowOptions: {
                        modal: true,
                        visible: false,
                        resizable: false,
                        draggable: false,
                        title: false,
                        width: 400,
                        height: 250,
                        open: function () {
                            this.center();
                        }
                    }

                    /*      gridDelay: false,
      
                          canchangeGridDelay: false*/
                };
                refundManageService.getrefundDetail($stateParams.orderNo).then(function (data) {
                    if (data.status) {
                        $scope.model.refundDetail = data.info;
                        console.log($scope.model.refundDetail);
                        //$scope.model.enforce= data.info.enforce;
                        console.log($scope.model.refundDetail.statusLogs.length);
                        //$scope.model.orderDetail.statusLogList.length=2
                        if ($scope.model.refundDetail.statusLogs.length === 3) {
                            $scope.model.lineWidthStyle = {width: '32%'};
                        } else {
                            $scope.model.lineWidthStyle = {width: '48%'};
                        }
                        /*  $scope.model.lineWidthStyle = { width: '32%' };*/
                        //当前第几步
                        var len = getStepNum();
                        /*  console.log ( getStepNum () );*/

                        if (len === 1) {
                            $scope.model.linePreStyle = {width: '25%'};
                        }

                        if (len === 2 && $scope.model.refundDetail.statusLogs.length !== 2) {
                            $scope.model.linePreStyle = {width: '60%'};
                        }
                        if (len === $scope.model.refundDetail.statusLogs.length) {
                            $scope.model.linePreStyle = {width: '100%'};
                        }
                        if (len === 3) {
                            $scope.model.linePreStyle = {width: '100%'};
                        }

                    }
                });


                $scope.events = {
                    openKendoWindow: function (windowName) {
                        $scope[windowName].center().open();
                    },

                    closeKendoWindow: function (windowName) {
                        $scope[windowName].close();
                    },
                    cancelrefund: function () {
                        $scope.model.refundNo = $scope.model.refundDetail.refundNo;
                        HB_dialog.contentAs($scope, {
                            title: '取消退款申请',
                            height: 300,
                            width: 600,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/refundManage/refundDetail/cancelDialog.html'
                        });
                    },
                    cancel: function () {
                        if (validateIsNull($scope.model.cancelRefundDesc) === true) {
                            HB_dialog.warning('警告', '请填写取消退款理由');
                            return false;
                        }
                        $scope.model.datasuccess = true;
                        refundManageService.cancel($scope.model.refundNo, $scope.model.cancelRefundDesc).then(function (data) {
                            /*defer.resolve ();*/
                            if (data.code === '200') {
                                HB_dialog.success('提示', data.message || '取消退款成功');

                                $state.reload($state.current.name);
                                $scope.model.cancelRefundDesc = '';
                            } else {
                                HB_dialog.warning('提示', data.message || '取消退款失败');
                                $scope.model.datasuccess = false;
                                $state.reload($state.current.name);
                                //defer.resolve();
                            }
                        });
                    },
                    rejectrefund: function () {

                        $scope.model.refundNo = $scope.model.refundDetail.refundNo;
                        /*    HB_dialog.contentAs($scope, {
                                title: '拒绝退款申请',
                                height: 300,
                                width: 600,
                                showCancel : false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/refundManage/refundDetail/rejectDialog.html'
                            })*/
                        $scope.events.openKendoWindow('rejectWindow');
                    },
                    reject: function () {
                        if (validateIsNull($scope.model.rejectRefundDesc) === true) {
                            HB_dialog.warning('警告', '请填写拒绝退款理由');
                            return false;
                        }
                        console.log(1);
                        refundManageService.reject($scope.model.refundNo, $scope.model.rejectRefundDesc).then(function (data) {
                            /* defer.resolve ();*/
                            if (data.code === '200') {
                                $scope.events.closeKendoWindow('rejectWindow');
                                HB_dialog.success('提示', data.message || '拒绝退款成功');
                                $scope.model.cancelRefundDesc = '';
                                $state.reload($state.current.name);

                            } else {

                                HB_dialog.warning('提示', data.message || '拒绝退款失败');
                                $scope.model.cancelRefundDesc = '';
                                $scope.events.closeKendoWindow('rejectWindow');
                                $state.reload($state.current.name);
                                /*  defer.resolve();*/
                            }
                        });
                    },

                    approverefund: function () {

                        $scope.model.refundNo = $scope.model.refundDetail.refundNo;
                        $scope.events.openKendoWindow('approveWindow');
                    },
                    goorderDetail: function (item) {
                        TabService.appendNewTab('订单详情', 'states.orderManage.orderDetail', {
                            orderNo: item,
                            from: 0
                        }, 'states.orderManage', true);
                    },
                    approve: function () {
                        if ($scope.model.refundDetail.enforce === true) {
                            refundManageService.enforceApprove($scope.model.refundNo).then(function (data) {
                                /*defer.resolve ();*/
                                if (data.code === '200') {
                                    /*$scope.model.datasuccess=true;*/
                                    HB_dialog.success('提示', data.message || '同意退款成功');
                                    $scope.events.closeKendoWindow('approveWindow');
                                    $state.reload($state.current.name);
                                } else {
                                    /* $scope.model.datasuccess=false;*/
                                    HB_dialog.warning('提示', data.message || '同意退款失败');
                                    $scope.model.cancelRefundDesc = '';
                                    //defer.resolve();
                                    $scope.events.closeKendoWindow('approveWindow');
                                    $state.reload($state.current.name);
                                }
                            });
                        } else {
                            refundManageService.approve($scope.model.refundNo).then(function (data) {
                                /*defer.resolve ();*/
                                if (data.code === '200') {
                                    $scope.model.datasuccess = true;
                                    HB_dialog.success('提示', data.message || '同意退款成功');
                                    $scope.events.closeKendoWindow('approveWindow');
                                    $state.reload($state.current.name);
                                } else {
                                    $scope.model.datasuccess = false;
                                    HB_dialog.warning('提示', data.message || '同意退款失败');
                                    $scope.model.cancelRefundDesc = '';
                                    //defer.resolve();
                                    $scope.events.closeKendoWindow('approveWindow');
                                    $state.reload($state.current.name);
                                }
                            });
                        }

                    },
                    resumerefund: function () {

                        $scope.model.refundNo = $scope.model.refundDetail.refundNo;

                        $scope.events.openKendoWindow('resumeWindow');


                    },
                    resume: function () {
                        refundManageService.resume($scope.model.refundNo).then(function (data) {
                            /*defer.resolve ();*/
                            if (data.code === 200) {
                                HB_dialog.success('提示', data.message || '继续退款成功');
                                $scope.model.datasuccess = true;
                                $scope.events.closeKendoWindow('resumeWindow');
                                $state.reload($state.current.name);
                            } else {
                                HB_dialog.warning('提示', data.message || '继续退款失败');
                                $scope.model.datasuccess = true;
                                $scope.events.closeKendoWindow('resumeWindow');
                                $state.reload($state.current.name);
                                //defer.resolve();
                            }
                        });
                    }

                };


                function getStepNum () {
                    var arr = [];
                    angular.forEach($scope.model.refundDetail.statusLogs, function (item) {
                        if (item.processed === true) {
                            arr.push(item);
                        }
                    });
                    return arr.length;
                }

                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }
            }]
    };
});