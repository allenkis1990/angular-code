/**
 * Created by wangzy on 2015/8/1.
 */
define(function () {

    return ['Restangular', '$state', function (Restangular, $state) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/index');
        });

        return {

            getCourseRelationBaseInfo: function (param) {
                return base.one('getCourseRelationBaseInfo').get(param);
            },

            getCourseInfo: function (param) {
                return base.one('getCourseInfo').get(param);
            },

            getSubjectOptions: function () {
                return base.one('getSubjectOptions').get();
            },

            getYearQueryOptions: function () {
                return base.one('getYearQueryOptions').get();
            },

            getCoursePoolInfos: function () {
                return base.one('getCoursePoolInfos').get();
            },
            findSalesCoursePage: function (params) {
                return base.one('findSalesCoursePage').get(params);
            },
            putIntoShoppingCart: function ($scope, $dialog, $http, params, item) {
                var $this = this;
                $scope.shoppingSubmitAble = true;
                $http.post('/web/front/commodity/enablePurchase', params).success(function (parData) {
                    $scope.shoppingSubmitAble = false;
                    //if(parData.status){
                    //parData.code='30822';
                    switch (parData.code) {
                        case '200':
                            $scope.shoppingSubmitAble = true;
                            $http.post('/web/front/studentOrder/putIntoShoppingCart', params).success(function (data) {
                                $scope.shoppingSubmitAble = false;
                                if (data.status) {
                                    $dialog.contentDialog({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        contentUrl: '@systemUrl@/views/signUpTraining/shoppingCartSuccess.html'
                                    }, $scope);
                                }


                                if (!data.status && data.code === '30801') {
                                    dialogDo({
                                        okValue: '前往购物车',
                                        cancelValue: '取消',
                                        okFn: function () {
                                            $state.go('states.shoppingCart');
                                        },
                                        content: data.info
                                    }, $dialog);
                                }

                                if (!data.status && data.code === '10003') {
                                    $dialog.confirm({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: data.info
                                    });
                                }

                                if (!data.status && data.code === '30802') {
                                    dialogDo({
                                        okValue: '前往购物车',
                                        cancelValue: '取消',
                                        okFn: function () {
                                            $state.go('states.shoppingCart');
                                        },
                                        content: data.info
                                    }, $dialog);
                                }

                            }).error(function () {
                                $scope.shoppingSubmitAble = false;
                            });
                            break;


                        case '500':
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    //alert(111);
                                    return true;
                                },
                                content: parData.message
                            });
                            break;


                        case '30824':
                            dialogDo({
                                okValue: '去看看',
                                cancelValue: '知道了',
                                okFn: function () {
                                    //window.open('/center/#/myOrder/detail/'+parData.message);
                                    //alert('11111');
                                    $state.go('states.myOrder.detail', {orderNo: parData.message});
                                },
                                content: '该课程已存在待支付的订单，是否前往查看？'
                            }, $dialog);
                            break;

                        case '30821':
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    //alert(111);
                                    return true;
                                },
                                content: '该课程资源，您已拥有，无需重复购买'
                            });
                            break;


                        case '30823':
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 350,
                                ok: function () {
                                    return true;
                                },
                                okValue: '知道了',
                                content: '本培训班处于退款审核中，暂不开放学习。'
                            });
                            break;


                    }
                    //$this.commonAjaxDo(parData,$dialog,$scope);
                    //}
                }).error(function () {
                    $scope.shoppingSubmitAble = false;
                });
            },

            buyNow: function ($scope, $dialog, $http, params, item) {
                var $this = this;
                $scope.submitBuy = true;
                $http.post('/web/front/commodity/enablePurchase', params).success(function (parData) {
                    $scope.submitBuy = false;
                    //if(parData.status){
                    switch (parData.code) {
                        case '200':
                            $scope.submitBuy = true;
                            $http.post('/web/front/commodity/findCourseCommodityList', [params]).success(function (data) {
                                $scope.submitBuy = false;
                                //console.log(data);
                                if (data.info.commodities.length > 0) {

                                    //如果是专业课
                                    if (params.subjectOptionsId === '5628812b569c57e001569c5a77f6a012') {
                                        item.showTwo = true;
                                    } else {//如果是公需课直接进入购买页面
                                        window.open('/center/#/myOrder/creatOrder/');
                                        //$state.go('states.myOrder.creatOrder',{paramsArr:''});
                                    }

                                } else {
                                    $dialog.confirm({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '该商品已失效！'
                                    });
                                }
                            }).error(function () {
                                $scope.submitBuy = false;
                            });
                            break;


                        case '500':
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    //alert(111);
                                    return true;
                                },
                                content: parData.message
                            });
                            break;


                        case '30824':
                            dialogDo({
                                okValue: '去看看',
                                cancelValue: '知道了',
                                okFn: function () {
                                    //window.open('/center/#/myOrder/detail/'+parData.message);
                                    $state.go('states.myOrder.detail', {orderNo: parData.message});
                                },
                                content: '该课程已存在待支付的订单，是否前往查看？'
                            }, $dialog);
                            break;

                        case '30821':
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    //alert(111);
                                    return true;
                                },
                                content: '该课程资源，您已拥有，无需重复购买'
                            });

                            break;


                        case '30823':
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 350,
                                ok: function () {
                                    return true;
                                },
                                okValue: '知道了',
                                content: '本培训班处于退款审核中，暂不开放学习。'
                            });
                            break;
                    }
                    //$this.commonAjaxDo(parData,$dialog,$scope);
                    //}
                }).error(function () {
                    $scope.submitBuy = false;
                });
            },

            commonAjaxDo: function (data, $dialog, $scope) {


                if (data.code === '505') {
                    $scope.unavailableSkus = data.unavailableSkus;//已失效
                    $scope.existUserPoolGoods = data.existUserPoolGoods;//已报班
                    $scope.trainingFinishGoods = data.trainingFinishGoods;//培训时间已结束
                    $scope.unfinishedOrderSkus = data.unfinishedOrderSkus;//已存在订单中
                    $scope.unfinishedSubOrderSkus = data.unfinishedSubOrderSkus;//已存在订单中
                    $dialog.contentDialog({
                        title: '部分班级无法购买，请剔除后再结算',
                        visible: true,
                        width: 550,
                        modal: true,
                        contentUrl: '@systemUrl@/views/signUpTraining/manyFailGoods.html'
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


            },

            getProfessionYearQueryOptions: function () {
                return base.one('getProfessionYearQueryOptions').get();
            },

            canBuy: function (data, $dialog) {

                switch (data.code) {
                    case '30903':
                        dialogDo({
                            okValue: '去看看',
                            cancelValue: '取消',
                            okFn: function () {
                                $state.go('states.myOrder.detail', {orderNo: data.info});
                            },
                            content: '您购买的课程部分已下单'
                        }, $dialog);
                        break;

                    case '30901':
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                //alert(111);
                                return true;
                            },
                            content: data.info
                        });
                        break;
                    case '30902':
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                //alert(111);
                                return true;
                            },
                            content: data.info
                        });
                        break;
                    case '30113':
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                //alert(111);
                                return true;
                            },
                            content: data.info
                        });
                        break;

                    case '309018':
                        dialogDo({
                            okValue: '去看看',
                            cancelValue: '取消',
                            okFn: function () {
                                $state.go('states.myOrder.detail', {orderNo: data.info});
                            },
                            content: '该订单已经支付完成'
                        }, $dialog);
                        break;

                    case '309019':
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                //alert(111);
                                return true;
                            },
                            content: data.info
                        });
                        break;


                    case '309020':
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                //alert(111);
                                return true;
                            },
                            content: data.info
                        });
                        break;
                }


            }

        };


        function dialogDo (options, $dialog) {
            return $dialog.confirm({
                title: '提示',
                visible: true,
                modal: true,
                width: 350,
                okValue: options.okValue,
                cancelValue: options.cancelValue,
                ok: function () {
                    if (options.hideOkBtn) {
                        return false;
                    } else {
                        options.okFn();
                    }
                    //options.okFn();
                },
                cancel: function () {
                    return true;
                },
                content: options.content
            });
        }


    }];
});
