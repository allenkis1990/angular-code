/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', '$rootScope', function (Restangular, $rootScope) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/login/login');
        });
        var basePorTalUser = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/userNorthMessage');
        });
        var basePortalInfo = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/info');
        });
        var basePortalIndex = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/index');
        });
        return {


            getYearQueryOptions: function () {
                return basePortalIndex.one('getYearQueryOptions').get();
            },

            getCoursePoolInfos: function () {
                return basePortalIndex.one('getCoursePoolInfos').get();
            },

            getSubjectOptions: function () {
                return basePortalIndex.one('getSubjectOptions').get();
            },

            findSalesCoursePage: function (params) {
                return basePortalIndex.one('findSalesCoursePage').get(params);
            },


            isLogin: function () {
                return base.one('isLogin').get();
            },
            getAdminSystemDomain: function () {
                return base.one('getAdminSystemDomain').get();
            },
            setPassword: function (params) {
                return base.one('setPassword/' + params.password + '?loginInput=' + params.username).get();
            },
            getUserInfo: function () {
                return base.one('getUserInfo').get();
            },
            validateCompletion: function () {
                return basePorTalUser.one('validateCompletion').get();
            },
            findUserDetailInfo: function () {
                return basePorTalUser.one('findUserDetailInfo').get();
            },
            completionUserInfo: function (params) {
                return basePorTalUser.all('completionUserInfo').post(params);
            },
            isUserExist: function (params) {
                return base.one('isUserExist/' + params.identify + '?name=' + params.name).get();
            },
            canLogin: function (params) {
                return base.one('canLogin' + '?loginInput=' + params.loginInput).get();
            },
            ajaxJsonp: function (params) {
                return $.ajax({
                    type: 'get',
                    url: params.url + '/home/DoCheckAccount?account=' + params.username + '&pwd=' + params.password,
                    dataType: 'jsonp'
                });
            },
            getSimpleInfoList: function (params) {
                return basePortalInfo.one('getSimpleInfoList').get(params);
            },
            getLatestCourses: function () {
                return basePortalIndex.one('getLatestCourses').get();
            },
            getLatestPassUsers: function () {
                return basePortalIndex.one('getLatestPassUsers').get();
            },
            getPopInfoNow: function () {
                return basePortalInfo.one('getPopInfoNow').get();
            },

            putIntoShoppingCart: function ($scope, $dialog, $http, params, item) {
                var $this = this;
                $scope.shoppingSubmitAble = true;
                $http.post('/web/portal/commodity/enablePurchase', params).success(function (parData) {
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
                                        contentUrl: 'kccs/subPortal/views/onTraining/shoppingCartSuccess.html'
                                    }, $scope);
                                    $rootScope.shoppingCount++;
                                }

                                if (!data.status && data.code === '30801') {
                                    dialogDo({
                                        okValue: '前往购物车',
                                        cancelValue: '取消',
                                        okFn: function () {
                                            window.open('/center/#/shoppingCart');
                                            //$state.go('states.shoppingCart');
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
                                            window.open('/center/#/shoppingCart');
                                        },
                                        content: data.info
                                    }, $dialog);
                                }
                                if (!data.status && data.code === 500) {
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
                                    window.open('/center/#/myOrder/detail/' + parData.message);
                                    //alert('11111');
                                    //$state.go('states.myOrder.detail',{orderNo:parData.info.message});
                                },
                                content: '本培训班您已下单'
                            }, $dialog);
                            break;

                        case '30821':
                            var message = params.courseId ? '该课程已购买过，无需重复购买！' : '该培训班已报名，无需重复报名！';
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    //alert(111);
                                    return true;
                                },
                                content: message
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
                    $this.commonAjaxDo(parData, $dialog, $scope);
                    //}
                }).error(function () {
                    $scope.shoppingSubmitAble = false;
                });
            },

            buyNow: function ($scope, $dialog, $http, params, item, mark) {
                var $this = this;
                $scope.submitBuy = true;
                var popup = window.open('about:blank', '_blank');  //先发起弹窗（因为是用户触发，所以不会被拦截）
                popup.document.write('<h2>加载中...</h2>');
                $http.post('/web/portal/commodity/enablePurchase', params).success(function (parData) {
                    $scope.submitBuy = false;
                    //if(parData.status){
                    //parData.code='505'
                    switch (parData.code) {

                        case '200':
                            //$scope.submitBuy = true;
                            //console.log(params);
                            //如果mark为true选中的是是自主选课里的专业课打开选年度的div
                            console.log(mark);
                            if (mark) {
                                item.showTwo = true;
                                popup.close();
                            } else {//如果是公需课直接进入购买页面
                                //window.open('/center/#/myOrder/creatOrder/' + parseStrFromArr([params]));
                                console.log(require.unitPath);
                                if(require.unitPath){
                                    popup.location = '/center/'+require.unitPath+'/myOrder/creatOrder/' + parseStrFromArr([params]);
                                }else{
                                    popup.location = '/center/myOrder/creatOrder/' + parseStrFromArr([params]);
                                }
                            }
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
                            popup.close();
                            break;


                        case '30824':
                            dialogDo({
                                okValue: '去看看',
                                cancelValue: '知道了',
                                okFn: function () {
                                    window.open('/center/#/myOrder/detail/' + parData.message);
                                    //$state.go('states.myOrder.detail',{orderNo:parData.message});
                                },
                                content: '本培训班您已下单'
                            }, $dialog);
                            popup.close();
                            break;

                        case '30821':
                            var message = params.courseId ? '该课程已购买过，无需重复购买！' : '该培训班已报名，无需重复报名！';
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    //alert(111);
                                    return true;
                                },
                                content: message
                            });
                            popup.close();
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
                            popup.close();
                            break;
                    }
                    $this.commonAjaxDo(parData, $dialog, $scope,popup);
                    //}
                }).error(function () {
                    $scope.submitBuy = false;
                    popup.close();
                });
            },

            commonAjaxDo: function (data, $dialog, $scope,popup) {
                //data.code='30511';
                //511到520为授权校验
                if(data.code==='30511'||data.code==='30512'||data.code==='30513'||data.code==='30514'||data.code==='30515'||data.code==='30516'||data.code==='30517'||data.code==='30518'||data.code==='30519'||data.code==='30520'){
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 350,
                        ok: function () {
                            return true;
                        },
                        okValue: '知道了',
                        content: data.message
                    });
                    if(popup){
                        popup.close();
                    }

                    return false;
                }
                if (data.code === '505') {
                    $scope.unavailableSkus = data.unavailableSkus;//已失效
                    $scope.existUserPoolGoods = data.existUserPoolGoods;//已报班
                    $scope.trainingFinishGoods = data.trainingFinishGoods;//培训时间已结束
                    $scope.unfinishedOrderSkus = data.unfinishedOrderSkus;//已存在订单中
                    $scope.unfinishedSubOrderSkus = data.unfinishedSubOrderSkus;//已存在订单中
                    $dialog.contentDialog({
                        title: '部分商品无法购买，请剔除后再结算',
                        visible: true,
                        width: 550,
                        modal: true,
                        contentUrl: 'kccs/subPortal/views/onTraining/manyFailGoods.html'
                    }, $scope).then(function (data) {
                        $scope.manyFailGoods = data;
                    });
                    if(popup){
                        popup.close();
                    }

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
                    if(popup){
                        popup.close();
                    }

                    return false;
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
                    if(popup){
                        popup.close();
                    }

                    return false;
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

        //JSON.stringify数组转字符串   JSON.parse字符串转数组
        function parseStrFromArr (arr) {//转数组为字符串
            var arr = arr;
            var str = JSON.stringify(arr);
            return str;
        }
    }];
});
