/**
 * Created by wangzy on 2015/8/1.
 */
define(function () {

    return ['Restangular', '$state', function (Restangular, $state) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/studentOrder');
        });
        var baseTwo = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/commodity');
        });

        var baseThree = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/userSetting');
        });

        var baseFour = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/commodity');
        });
        return {

            getOrderPage: function (params) {
                return base.one('getOrderPage').get(params);
            },


            create: function (params) {
                return base.all('create').post(params);
            },

            getOrderDetail: function (params) {
                return base.one('get/' + params).get();
            },

            pay: function (orderNo, accountId) {
                return base.one('payWithAccount/' + orderNo /*+ '?accountId=' + accountId*/).get();
            },

            deleteOrder: function (params) {
                return base.one('delete/' + params).get();
            },

            cancelOrder: function (orderNo, message) {
                return base.one('cancel/' + orderNo + '?message=' + message).get();
            },

            updateUserInfo: function (params) {
                return baseThree.all('updateUserInfo').post(params);
            },

            isOrderAllowPayed: function (orderNo) {
                return base.one('isOrderAllowPayed/' + orderNo).get();
            },


            findCommodityList: function (params) {
                return baseFour.all('findCommodityList').post(params);
            },

            payRightNow: function ($scope, orderNo, myOrderService, $dialog, hasPayFn, signUpTrainingService, accountId) {
                $scope.submitAble = true;
                myOrderService.pay(orderNo, accountId).then(function (data) {
                    $scope.submitAble = false;
                    if (data.code === '200') {
                        window.open(data.data);
                        var dia = $dialog.confirm({
                            title: '请您在新打开的页面上支付',
                            visible: true,
                            modal: true,
                            width: 350,
                            okValue: '已完成',
                            cancelValue: '未完成,回到当前页面',
                            ok: function (data) {
                                myOrderService.isOrderAllowPayed(orderNo).then(function (data) {
                                    if (data.info) {//还没支付过

                                        $dialog.confirm({
                                            title: '提示',
                                            visible: true,
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: '亲，你未支付成功，请重新支付!'
                                        });
                                        //return false;
                                    } else {//已支付
                                        hasPayFn();
                                        //return true;
                                    }
                                });
                                //return false;
                                //return true;
                            },
                            cancel: function () {
                                return true;
                            },
                            content: '请在新开支付页面完成付款后选择,付款完成前请不要关闭本页面，并且请不要刷新本页面。完成付款后请根据您的支付结果。'
                        });


                        //window.open(data.info,'_self');
                    }


                    if (data.code === '309018') {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: data.message
                        });
                    }


                    if (data.code === '309019') {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: data.message
                        });
                    }

                    myOrderService.commonAjaxDo(data, $dialog, $scope);

                });
            },


            cancelOrderFn: function ($scope, orderNo, $dialog) {
                $scope.temporaryOrderNo = orderNo;
                $dialog.contentDialog({
                    title: '取消订单',
                    visible: true,
                    width: 500,
                    height: 150,
                    modal: true,
                    contentUrl: '@systemUrl@/views/myOrder/cacelOrderDialog.html'
                }, $scope).then(function (data) {
                    $scope.model.cacelOrderDialog = data;
                });
            },

            confirmCancelOrder: function ($scope, service, $dialog, callBack) {
                $scope.cacelSubmitAble = true;
                //console.log(encodeURIComponent($scope.model.message));
                service.cancelOrder($scope.temporaryOrderNo, encodeURIComponent($scope.model.message)).then(function (data) {
                    $scope.cacelSubmitAble = false;
                    if (data.code === '200') {
                        $scope.model.currentPage = 1;
                        callBack();
                        $scope.model.cacelOrderDialog.remove();
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: data.message || '订单取消成功'
                        });
                    } else {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: data.message
                        });
                        $scope.model.cacelOrderDialog.remove();
                    }
                });
            },


            commonAjaxDo: function (data, $dialog, $scope) {

                //511到516为授权校验
                if(data.code==='30511'||data.code==='30512'||data.code==='30513'||data.code==='30514'||data.code==='30515'||data.code==='30516'||data.code==='30517'||data.code==='30518'||data.code==='30519'||data.code==='30520'){
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 450,
                        ok: function () {
                            return true;
                        },
                        content: data.message
                    });
                    return false;
                }


                if (data.code === '505') {
                    $scope.unavailableSkus = data.unavailableSkus;//已失效
                    $scope.existUserPoolGoods = data.existUserPoolGoods;//已报班
                    $scope.trainingFinishGoods = data.trainingFinishGoods;//培训时间已结束
                    $scope.unfinishedOrderSkus = data.unfinishedOrderSkus;//已存在订单中
                    $scope.unfinishedSubOrderSkus = data.unfinishedSubOrderSkus;//已存在订单中
                    $scope.customerIllegalSkus = data.customerIllegalSkus;//自定义异常
                    $dialog.contentDialog({
                        title: '部分班级无法报名，请剔除后再结算',
                        visible: true,
                        width: 550,
                        modal: true,
                        contentUrl: '@systemUrl@/views/myOrder/creatOrder/manyFailGoods.html'
                    }, $scope).then(function (data) {
                        $scope.manyFailGoods = data;
                    });
                }

                if (data.code === '10003') {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 450,
                        ok: function () {
                            return true;
                        },
                        content: data.message
                    });
                }

                if (data.code === '10004') {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 450,
                        ok: function () {
                            return true;
                        },
                        content: data.message
                    });
                }


            }


        };
    }];
});
