define(function () {
    'use strict';
    return ['$scope', 'shoppingCartService', '$dialog', '$state', '$rootScope', 'hbBasicData', 'signUpTrainingService', 'myOrderService', '$http','$timeout', function ($scope, shoppingCartService, $dialog, $state, $rootScope, hbBasicData, signUpTrainingService, myOrderService, $http,$timeout) {
        $scope.model = {
            yearList: [],
            shoppingList: [],//存放正常商品
            shoppingAllList: [],//存放失效商品和正常商品
            shoppingFailList: [],//存放失效商品
            shoppingChoseList: [],//存放选中的商品
            shoppingChoseAjaxList: [],//存放选中的用来提交的商品ID集合
            total: 0,
            totalPeriod: 0,
            temporaryItem: null,
            temporaryIndex: null,
            pending: false,
            pageNo: 1,
            totalpagesize: null,



            newShoppingCartList:[]


        };


        //console.log($(document).height());

        $scope.events = {

            deleteFailGoods: function () {
                shoppingCartService.putOffShoppingCart($scope.model.shoppingFailList).then(function () {
                });
            },

            choseGoods: function (e, item) {

                //console.log(item.yearOptionsId);
                if (e.target.checked == true) {
                    var bol=checkIsChoseSameUnit(item,e);
                    if(!bol){
                        return false;
                    }

                    //var hasNotFailIndex = findIndex($scope.model.shoppingList, item);
                    //$scope.model.shoppingList[hasNotFailIndex].ischecked = true;
                    item.ischecked = true;
                    $scope.model.shoppingChoseAjaxList.push({
                        courseId: item.courseId,
                        yearOptionsId: item.yearOptionsId,
                        hour: item.period,
                        price: item.discountPrice,
                        //subjectOptionsId:item.subjectOptionsId,
                        coursePoolId: item.coursePoolId,
                        commoditySkuId: item.commoditySkuId,
                        schemeId: item.schemeId,
                        needYear:item.needYear,
                        name:item.saleTitle,
                        unitId:item.unitId

                    });
                    $scope.model.shoppingChoseList.push(item);
                    $scope.model.total = fixZeroNum(accAdd($scope.model.total, item.discountPrice));
                    $scope.model.totalPeriod = fixZeroNum(accAdd($scope.model.totalPeriod, item.period));
                } else {
                    //alert(22222);
                    //var hasNotFailIndex = findIndex($scope.model.shoppingList, item);
                    //$scope.model.shoppingList[hasNotFailIndex].ischecked = false;
                    item.ischecked = false;
                    var index = findIndex($scope.model.shoppingChoseList, item);
                    //console.log(index);

                    var ajaxIndex = findAjaxIndex($scope.model.shoppingChoseAjaxList, item);
                    //console.log(ajaxIndex);

                    //findIndex($scope.model.shoppingChoseList);
                    $scope.model.shoppingChoseList.splice(index, 1);
                    $scope.model.shoppingChoseAjaxList.splice(ajaxIndex, 1);
                    $scope.model.totalPeriod = fixZeroNum(Subtr($scope.model.totalPeriod, item.period));
                    $scope.model.total = fixZeroNum(Subtr($scope.model.total, item.discountPrice));
                }
                console.log($scope.model.shoppingChoseAjaxList);
                //recountTotal();
            },

            /*selectAllOrNone: function (e) {
                $scope.model.total = 0;
                $scope.model.totalPeriod = 0;
                if (e.target.checked == true) {
                    selectAllOrNone(true, $scope.model.shoppingAllList);
                    selectAllOrNone(true, $scope.model.shoppingList);
                    cleanChoseData();
                    angular.forEach($scope.model.shoppingList, function (item) {
                        $scope.model.shoppingChoseList.push(item);
                        $scope.model.shoppingChoseAjaxList.push({
                            courseId: item.courseId,
                            yearOptionsId: item.yearOptionsId,
                            hour: item.period,
                            price: item.discountPrice,
                            //subjectOptionsId:item.subjectOptionsId,
                            coursePoolId: item.coursePoolId,
                            commoditySkuId: item.commoditySkuId,
                            schemeId: item.schemeId,
                            needYear:item.needYear,
                            unitId:item.unitId
                        });
                    });
                    //$scope.model.shoppingChoseList.push(item);
                    //$scope.model.total=accAdd($scope.model.total,item.discountPrice);
                    angular.forEach($scope.model.shoppingChoseList, function (item) {
                        $scope.model.total = fixZeroNum(accAdd($scope.model.total, item.discountPrice));
                        $scope.model.totalPeriod = fixZeroNum(accAdd($scope.model.totalPeriod, item.period));
                    });

                    console.log($scope.model.shoppingChoseList.length);


                } else {
                    selectAllOrNone(false, $scope.model.shoppingAllList);
                    selectAllOrNone(false, $scope.model.shoppingList);
                    cleanChoseData();
                    $scope.model.total = 0;
                    $scope.model.totalPeriod = 0;
                }
                //recountTotal();

            },*/

            goPay: function () {
                angular.forEach($scope.model.shoppingAllList, function (item) {

                    angular.forEach(item.shoppingCartCommodityList,function(i){

                        angular.forEach($scope.model.shoppingChoseAjaxList, function (subItem) {
                            if (i.commoditySkuId === subItem.commoditySkuId && i.courseId === subItem.courseId) {
                                subItem.yearOptionsId = i.yearOptionsId;
                            }
                        });


                    });
                });
                console.log($scope.model.shoppingChoseAjaxList);


                var mark = false;
                angular.forEach($scope.model.shoppingChoseAjaxList, function (item) {
                    if (item.yearOptionsId === null && item.needYear) {
                        mark = true;
                    }
                });
                console.log(mark);
                console.log($scope.model.shoppingChoseAjaxList);
                if (mark) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请选择年度'
                    });
                    return false;
                }


                /*var arr=[];
                angular.forEach($scope.model.shoppingChoseAjaxList,function(item){

                });*/

                var openWindow = window.open('about:blank');

                $scope.submitAble=true;
                $http.post('/web/front/studentOrder/enableShoppingCart',{
                    courseCommodities:$scope.model.shoppingChoseAjaxList
                }).success(function(res){
                    $scope.submitAble=false;
                    if(res.status){
                        if(res.info.code==='200'){
                            shoppingCartService.findCommodityList($scope.model.shoppingChoseAjaxList).then(function (data) {
                                if (data.status) {
                                    hbBasicData.delCookie('urlParamsList').then(function(){
                                        hbBasicData.setCookie('urlParamsList', parseStrFromArr($scope.model.shoppingChoseAjaxList)).then(function(){
                                            $timeout(function(){
                                                require.extUtil.openWindow(openWindow, '/center/#/myOrder/creatOrder/');
                                            },1000);
                                        });
                                    });

                                    //$state.go('states.myOrder.creatOrder');
                                    /*$timeout(function(){
                                        require.extUtil.openWindow(openWindow, '/center/#/myOrder/creatOrder/');
                                    },100);*/

                                } else {
                                    //myOrderService.commonAjaxDo(data, $dialog, $scope);
                                    //signUpTrainingService.canBuy(data,$dialog);
                                    openWindow.close();
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
                            });

                        }else{
                            openWindow.close();
                            $scope.model.shopping505goods=res.info.data;
                            $dialog.contentDialog({
                                title: '提示',
                                visible: true,
                                width: 700,
                                height: 'auto',
                                modal: true,
                                contentUrl: '@systemUrl@/views/shoppingCart/cannotGoPayDialog.html'
                            }, $scope).then(function (re) {
                                $scope.model.cannotGoPayDialog = re;
                            });
                        }
                    }
                });


            },

            deleteGoods: function (item, index,subItem,subIndex) {

                $scope.model.temporaryItem = item;//外层item
                $scope.model.temporaryIndex = index;//外层index
                $scope.model.temporarySubItem = subItem;//内层item
                $scope.model.temporarySubIndex = subIndex;//内层index
                $dialog.contentDialog({
                    title: '删除',
                    visible: true,
                    width: 500,
                    height: 120,
                    modal: true,
                    contentUrl: '@systemUrl@/views/shoppingCart/deleteGoodsDialog.html'
                }, $scope).then(function (data) {
                    $scope.deleteGoodsDialog = data;
                });
            },

            confirmDeleteGoods: function () {
                $scope.deleteSubmitAble = true;
                shoppingCartService.putOffShoppingCart([{
                    courseId: $scope.model.temporarySubItem.courseId,
                    yearOptionsId: $scope.model.temporarySubItem.yearOptionsId,
                    //subjectOptionsId:$scope.model.temporarySubItem.subjectOptionsId,
                    commoditySkuId: $scope.model.temporarySubItem.commoditySkuId,
                    coursePoolId: $scope.model.temporarySubItem.coursePoolId,
                    schemeId: $scope.model.temporarySubItem.schemeId
                }
                ]).then(function (data) {
                    //console.log($scope.model.shoppingChoseList[$scope.model.temporaryIndex].discountPrice);
                    //return false;
                    $scope.deleteSubmitAble = false;
                    if (data.status && data.info == true) {
                        var index = findIndex($scope.model.shoppingChoseList, $scope.model.temporarySubItem);
                        var ajaxIndex = findAjaxIndex($scope.model.shoppingChoseAjaxList, $scope.model.temporarySubItem);
                        if ($scope.model.shoppingChoseList.length > 0) {
                            if(index!==null){
                                $scope.model.total = fixZeroNum(Subtr($scope.model.total, $scope.model.shoppingChoseList[index].discountPrice));
                                $scope.model.totalPeriod = fixZeroNum(Subtr($scope.model.totalPeriod, $scope.model.shoppingChoseList[index].period));
                            }
                        } else {
                            $scope.model.total = 0;
                            $scope.model.totalPeriod = 0;
                        }
                        if (index !== null) {
                            $scope.model.shoppingChoseList.splice(index, 1);

                        }
                        if (ajaxIndex !== null) {
                            $scope.model.shoppingChoseAjaxList.splice(ajaxIndex, 1);
                        }
                        console.log($scope.model.temporaryIndex,$scope.model.temporarySubIndex);

                        $scope.model.shoppingAllList[$scope.model.temporaryIndex].shoppingCartCommodityList.splice($scope.model.temporarySubIndex, 1);

                        //如果儿子删除光了 父亲也要删掉
                        if($scope.model.shoppingAllList[$scope.model.temporaryIndex].shoppingCartCommodityList.length<=0){
                            $scope.model.shoppingAllList.splice($scope.model.temporaryIndex,1);
                        }


                        //$scope.model.shoppingAllList.splice($scope.model.temporaryIndex, 1);
                        //$scope.model.shoppingList = [];
                        /*angular.forEach($scope.model.shoppingAllList, function (item) {
                            if (item.disabled === false) {
                                $scope.model.shoppingList.push(item);
                            } else {

                            }
                        });*/
                        //$scope.model.shoppingList.splice($scope.model.temporaryIndex,1);
                        //$scope.copyShoppingList = angular.copy($scope.model.shoppingList);
                        $scope.deleteGoodsDialog.remove();
                        //recountTotal();
                    }
                });

            },





            batchDelete: function () {

                if ($scope.model.shoppingChoseAjaxList.length <= 0) {
                    //alert('请选择要删除的商品');
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请选择要删除的商品！'
                    });
                    return false;
                }

                $dialog.contentDialog({
                    title: '删除',
                    visible: true,
                    width: 500,
                    modal: true,
                    contentUrl: '@systemUrl@/views/shoppingCart/batchDeleteDialog.html'
                }, $scope).then(function (data) {
                    $scope.batchDeleteDialog = data;
                });
            },

            confirmBatchDelete: function () {
                $scope.batchDeleteSubmitAble = true;
                var num=0;
                shoppingCartService.putOffShoppingCart($scope.model.shoppingChoseAjaxList).then(function (data) {
                    $scope.batchDeleteSubmitAble = false;
                    if (data.status && data.info == true) {
                        //$scope.copyShoppingList = angular.copy($scope.model.shoppingList);
                        //删除勾选的
                        angular.forEach($scope.model.shoppingAllList,function(item,index){
                            item.shoppingCartCommodityList=$.grep(item.shoppingCartCommodityList,function(subItem){
                                return subItem.ischecked===false;
                            });
                        });
                        console.log($scope.model.shoppingAllList);
                        $scope.model.total = 0;
                        $scope.model.totalPeriod = 0;
                        $scope.model.shoppingChoseList = [];
                        $scope.model.shoppingChoseAjaxList = [];


                        //如果儿子全部是空的了那么也要把父亲删除掉
                        var len=emptyOutterArrLen();
                        if(len===$scope.model.shoppingAllList.length){
                            $scope.model.shoppingAllList.length=[];
                        }

                        console.log($scope.model.shoppingAllList);

                        //$rootScope.$$$$userInfo.shopCount=$scope.model.shoppingList.length;
                        $scope.batchDeleteDialog.remove();

                    }
                });
            },

            cleanDisable: function () {
                $dialog.contentDialog({
                    title: '删除',
                    visible: true,
                    width: 500,
                    modal: true,
                    contentUrl: '@systemUrl@/views/shoppingCart/cleanDisableDialog.html'
                }, $scope).then(function (data) {
                    $scope.cleanDisDialog = data;
                });
            },

            confirmCleanDisable: function () {
                var arr = [];
                angular.forEach($scope.model.shoppingAllList, function (item) {

                    angular.forEach(item.shoppingCartCommodityList,function(subItem){
                        if (subItem.disabled === true) {
                            arr.push({
                                courseId: subItem.courseId,
                                yearOptionsId: subItem.yearOptionsId,
                                //subjectOptionsId:item.subjectOptionsId,
                                schemeId: subItem.schemeId,
                                coursePoolId: subItem.coursePoolId,
                                commoditySkuId: subItem.commoditySkuId
                            });
                        }
                    });
                });

                console.log(arr.length);
                if (arr.length <= 0) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '没有失效商品！'
                    });
                    $scope.cleanDisDialog.remove();
                } else {
                    $scope.cleanSubmitAble = true;
                    shoppingCartService.putOffShoppingCart(arr).then(function (data) {

                        $scope.cleanSubmitAble = false;
                        if (data.status && data.info == true) {

                            //请求成功后删除模型里的失效商品


                            angular.forEach($scope.model.shoppingAllList,function(item){
                                item.shoppingCartCommodityList=$.grep(item.shoppingCartCommodityList, function (subItem) {
                                    return subItem.disabled === false;
                                });
                            });

                            //如果儿子全部是空的了那么也要把父亲删除掉
                            var len=emptyOutterArrLen();
                            if(len===$scope.model.shoppingAllList.length){
                                $scope.model.shoppingAllList.length=[];
                            }

                            $scope.cleanDisDialog.remove();
                            //recountTotal();
                        }
                    });
                }


            },

            getShoppingCartPage: function (pageNo) {
                //$scope.pending=true;
                shoppingCartService.getShoppingCartCommodityPage({
                    pageNo: pageNo,
                    pageSize: 8
                }).then(function (data) {
                    //$scope.model.shoppingAllList=data.info;
                    $scope.model.totalpagesize = data.totalPageSize;
                    shoppingCartService.getProfessionYearQueryOptions().then(function (subData) {
                        $scope.model.pending = false;
                        //console.log($scope.model.pending);
                        $scope.model.yearList = subData.info;

                        angular.forEach(data.info, function (item) {
                            selectAllOrNone(false, data.info);
                            //如果是专业课 如果有年度id就显示年度id没有的话就显示请选择年度
                            if (item.needYear) {
                                item.yearOptionsId === null ? '' : item.yearOptionsId;
                            }

                            if (item.disabled === false) {
                                //item.ischecked=false;
                                $scope.model.shoppingList.push(item);
                                //console.log($scope.model.shoppingList);
                            } else {
                                //$scope.model.shoppingFailList.push(item.commoditySkuId);
                            }


                        });

                        $scope.model.shoppingAllList = $scope.model.shoppingAllList.concat(data.info);

                        //selectAllOrNone(false,$scope.model.shoppingList);
                        $scope.copyShoppingList = angular.copy($scope.model.shoppingList);
                        //console.log($scope.copyShoppingList);
                        //console.log($scope.model.shoppingAllList);

                        if ($scope.model.pageNo === 1) {
                            $scope.model.pageNo++;
                        }
                    });

                    //console.log($scope.copyShoppingList);
                });
            },


            acheCurrentChoseYear: function (yearId, item) {
                if ($scope.submitAble) {
                    return false;
                }
                $scope.submitAble = true;
                console.log(yearId);
                $http.post('/web/front/studentOrder/updateShoppingCart', {
                    courseId: item.courseId,
                    yearOptionsId: yearId,
                    coursePoolId: item.coursePoolId,
                    commoditySkuId: item.commoditySkuId,
                    schemeId: item.schemeId,
                    hour: item.period,
                    price: item.discountPrice
                }).success(function () {
                    $scope.submitAble = false;
                });

            },

            goOntrainingView: function () {
                if (dev) {
                    window.open('/portal/#/accountant/accountant.onTraining/', '_blank');
                } else {
                    window.open('/#/accountant/accountant.onTraining/', '_blank');
                }
            },


            //判断单个机构是否全选
            getCheckedListLengthbyUnitId:function(unitId){
                var list=[];
                angular.forEach($scope.model.shoppingChoseList,function(item){
                    if(item.unitId===unitId){
                        list.push(item);
                    }
                });
                return list.length;

            },

            //单个机构全选
            choseTheUnitShoppingGoods:function(e,item){
                if(e.target.checked){
                    console.log('xuan');



                    var bol=checkIsChoseSameUnit(item,e);
                    if(!bol){
                        return false;
                    }


                    $scope.model.shoppingChoseList=[];
                    $scope.model.shoppingChoseAjaxList=[];
                    angular.forEach(item.shoppingCartCommodityList,function(eachItem){
                        $scope.model.shoppingChoseList.push(eachItem);
                    });
                    angular.forEach(item.shoppingCartCommodityList,function(eachItem){
                        $scope.model.shoppingChoseAjaxList.push({
                            courseId: eachItem.courseId,
                            yearOptionsId: eachItem.yearOptionsId,
                            hour: eachItem.period,
                            price: eachItem.discountPrice,
                            //subjectOptionsId:item.subjectOptionsId,
                            coursePoolId: eachItem.coursePoolId,
                            commoditySkuId: eachItem.commoditySkuId,
                            schemeId: eachItem.schemeId,
                            needYear:eachItem.needYear,
                            name:eachItem.saleTitle,
                            unitId:eachItem.unitId
                        });
                    });
                    angular.forEach(item.shoppingCartCommodityList,function(eachItem){
                        eachItem.ischecked=true;
                    });


                    //重新算先清一下
                    $scope.model.total=0;
                    $scope.model.totalPeriod=0;
                    angular.forEach($scope.model.shoppingChoseList,function(eachItem){
                        $scope.model.total = fixZeroNum(accAdd($scope.model.total, eachItem.discountPrice));
                        $scope.model.totalPeriod = fixZeroNum(accAdd($scope.model.totalPeriod, eachItem.period));
                    });



                }else{
                    console.log('buxuan');




                    $scope.model.shoppingChoseList=$.grep($scope.model.shoppingChoseList,function(eachItem){
                        return eachItem.unitId!==item.unitId
                    });


                    $scope.model.shoppingChoseAjaxList=$.grep($scope.model.shoppingChoseAjaxList,function(eachItem){
                        return eachItem.unitId!==item.unitId
                    });

                    angular.forEach(item.shoppingCartCommodityList,function(eachItem){
                        if(eachItem.unitId===item.unitId){
                            eachItem.ischecked=false;
                        }
                    });
                    $scope.model.total=0;
                    $scope.model.totalPeriod=0;
                    //console.log($scope.model.total);
                    if($scope.model.shoppingChoseList.length>0){
                        angular.forEach($scope.model.shoppingChoseList,function(eachItem){
                            //console.log(1);
                            $scope.model.total = fixZeroNum(accAdd($scope.model.total, eachItem.discountPrice));
                            $scope.model.totalPeriod = fixZeroNum(accAdd($scope.model.totalPeriod, eachItem.period));
                        });
                    }else{
                        $scope.model.total=0;
                        $scope.model.totalPeriod=0;
                    }




                }
                //console.log(this.getCheckedListLengthbyUnitId(item.unitId));;
                console.log($scope.model.shoppingChoseList);
            }


        };


        //校验选择了不同施教机构的商品 如果是则校验不通过
        function checkIsChoseSameUnit(item,e){
            var index=findUnitIndex($scope.model.shoppingChoseList,item);
            console.log(index);
            //如果选了两个施教机构提示 并且把打勾去掉
            if(index===null&&$scope.model.shoppingChoseList.length>0){
                $dialog.confirm({
                    title: '提示',
                    visible: true,
                    modal: true,
                    width: 250,
                    ok: function () {
                        return true;
                    },
                    content: '请选择同一个培训机构的培训内容进行结算。'
                });
                e.target.checked =false;
                return false;
            }else{
                return true;
            }
        }

        //$scope.events.getShoppingCartPage(1);


        /*getProfessionYearQueryOptions*/

        getNewShoppingCart(1);

        function getNewShoppingCart(pageNo){
            shoppingCartService.getShoppingCartCommodityPage({
                pageNo: pageNo,
                pageSize: 8
            }).then(function (data) {
                //$scope.model.shoppingAllList=data.info;
                $scope.model.totalpagesize = data.totalPageSize;
                shoppingCartService.getProfessionYearQueryOptions().then(function (subData) {
                    $scope.model.pending = false;
                    //console.log($scope.model.pending);
                    $scope.model.yearList = subData.info;
                    selectAllOrNone(false, data.info);
                    angular.forEach(data.info, function (item) {
                        selectAllOrNone(false,item.shoppingCartCommodityList);
                        //item.shoppingCartCommodityList[0].disabled=true;
                        angular.forEach(item.shoppingCartCommodityList,function(subItem){
                            //如果是专业课 如果有年度id就显示年度id没有的话就显示请选择年度
                            if (subItem.needYear) {
                                subItem.yearOptionsId === null ? '' : subItem.yearOptionsId;
                            }

                            if (subItem.disabled === false) {
                                //item.ischecked=false;
                                $scope.model.shoppingList.push(subItem);
                                //console.log($scope.model.shoppingList);
                            } else {
                                //$scope.model.shoppingFailList.push(item.commoditySkuId);
                            }

                        });
                    });

                    $scope.model.shoppingAllList = $scope.model.shoppingAllList.concat(data.info);

                    //selectAllOrNone(false,$scope.model.shoppingList);
                    $scope.copyShoppingList = angular.copy($scope.model.shoppingList);
                    //console.log($scope.copyShoppingList);
                    console.log($scope.model.shoppingAllList);

                    if ($scope.model.pageNo === 1) {
                        $scope.model.pageNo++;
                    }
                });

            });
        }


        //获取有几个外层数组是没有儿子的
        function emptyOutterArrLen(){
            var arr=[];
            angular.forEach($scope.model.shoppingAllList,function(item,index){
                if(item.shoppingCartCommodityList.length<=0){
                    arr.push(item);
                }
            });
            return arr.length;
        }



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


        function getCurrentYearId (yearArr) {
            var current = new Date().getFullYear() + '';
            var yearId = null;
            angular.forEach(yearArr, function (item) {
                if (item.name === current) {
                    yearId = item.optionId;
                }
            });

            return yearId;
        }


        //JSON.stringify数组转字符串   JSON.parse字符串转数组
        function parseStrFromArr (arr) {//转数组为字符串
            var arr = arr;
            var str = JSON.stringify(arr);
            return str;
        }


        function cleanChoseData () {
            $scope.model.shoppingChoseList = [];
            $scope.model.shoppingChoseAjaxList = [];
        }

        function selectAllOrNone (bol, arrName) {
            angular.forEach(arrName, function (item) {
                if (!item.disabled) {
                    item.ischecked = bol;
                }
            });
        }


        function findIndex (arr, item) {
            var index = null;
            angular.forEach(arr, function (dataItem, dataIndex) {
                if (dataItem.commoditySkuId === item.commoditySkuId && dataItem.courseId === item.courseId) {
                    index = dataIndex;
                }
            });
            return index;
        }

        function findAjaxIndex (arr, item) {
            var index = null;
            angular.forEach(arr, function (dataItem, dataIndex) {
                if (dataItem.commoditySkuId === item.commoditySkuId && dataItem.courseId === item.courseId) {
                    index = dataIndex;
                }
            });
            return index;
        }


        function findUnitIndex(arr,item){
            var index=null;
            angular.forEach(arr,function(eachItem,exchIndex){
                if(eachItem.unitId===item.unitId){
                    index=exchIndex;
                }
            });
            return index;
        }


        function fixZeroNum (num) {
            var str = num + '',
                arr = null,
                floatNum = null,
                floatArr = null;
            arr = str.split('.');
            floatNum = arr[1];
            var oNum = Number(num);
            if (floatNum) {
                //console.log(floatNum.substr(1, 1));
                floatArr = floatNum.split('');
                if (floatArr.length === 1 && floatArr[0] === '0') {
                    return Number(oNum.toFixed(0));
                }

                if (floatArr.length === 1 && floatArr[0] !== '0') {
                    return Number(oNum.toFixed(1));
                }

                if (floatArr.length === 2 && floatArr[1] === '0' && floatArr[0] !== '0') {
                    return Number(oNum.toFixed(1));
                }

                if (floatArr.length === 2 && floatArr[1] !== '0') {
                    return Number(oNum.toFixed(2));
                }

                if (floatArr.length === 2 && floatArr[1] === '0' && floatArr[0] === '0') {
                    return Number(oNum.toFixed(0));
                }
                //console.log(floatArr);
            } else {
                return Number(oNum.toFixed(0));
            }

        }

        //console.log(fixZeroNum('5.77'));


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
            return ((arg1 * m + arg2 * m) / m).toFixed(2);
        }

        function Subtr (arg1, arg2) {
            var r1, r2, m, n;
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
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        }


    }];
});
