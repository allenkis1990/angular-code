define(function (goodsManager) {
    'use strict';
    return {
        indexCtrl: ['$rootScope','$scope', '$http', 'hbUtil', '$state', 'goodsManagerService', 'HB_dialog', '$q', 'TabService', 'HB_notification', 'easyKendoDialog',
            function ($rootScope,$scope, $http, hbUtil, $state, goodsManagerService, HB_dialog, $q, TabService, HB_notification, easyKendoDialog) {


                $scope.tabMap={
                    myself:{
                        name:"本单位",
                        code:"myself"
                    },
                    all:{
                        name:"项目级",
                        code:"all"
                    }
                };
                $scope.currentTab = $scope.tabMap.myself.code;

                $scope.kendoPlus = {
                    goodsManagerGridInstance: null,
                    timeModel: null,
                    timeOptions: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd HH:mm:00'
                        //min: new Date()
                    },
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
                    pageNo: 1,
                    pageSize: 10,

                    myselfQuery: {
                        categoryType: '', // 类目id
                        trainingSchemeEnabled: '-1', // 培训方案状态, -1表示不查询，0表示不启用，1表示启用
                        commoditySkuName: '', // 商品名称
                        commoditySkuState: '-1', // 上架状态 -1:全部 1已上架，2待上架，3已下架
                        saleState: '-1', // 售出否 -1全部，1已售，2未售
                        firstUpTimeMin: '', // 最小首次上架时间 yyyy-MM-dd
                        firstUpTimeMax: '' // 最大首次上架时间 yyyy-MM-dd
                    },
                    allQuery:{
                        categoryType: '', // 类目id
                        trainingSchemeEnabled: '-1', // 培训方案状态, -1表示不查询，0表示不启用，1表示启用
                        commoditySkuName: '', // 商品名称
                        commoditySkuState: '-1', // 上架状态 -1:全部 1已上架，2待上架，3已下架
                        saleState: '-1', // 售出否 -1全部，1已售，2未售
                        firstUpTimeMin: '', // 最小首次上架时间 yyyy-MM-dd
                        firstUpTimeMax: '' // 最大首次上架时间 yyyy-MM-dd
                    },

                    priceManageList: [],

                    currentCommodityType: ''


                };

                $scope.events = {
                    chooseTab : function (e,code){
                        $scope.currentTab = code;
                    },
                    pressEnterKey: function (e) {
                        if (e.keyCode == 13) {
                            $scope.events.MainPageQueryList(e);
                        }
                    },

                    MainPageQueryList: function (e) {
                        e.stopPropagation();
                        $scope.model.pageNo = 1;
                        $scope.kendoPlus[$scope.currentTab+'GoodsManagerGridInstance'].pager.page(1);
                    },

                    goodsEdit: function (e, item) {
                        $state.go('states.goodsManager.goodsEdit', {
                            id: item.commoditySkuId,
                            schemeId: item.schemeId
                        });
                    },
                    goodsAuthorized: function(e,item){
                        $state.go('states.goodsManager.goodsAuthorized', {
                            id: item.commoditySkuId,
                            schemeId: item.schemeId
                        });
                    },
                    authorizedView: function(e,item){
                        $state.go('states.goodsManager.authorizedView', {
                            id: item.commoditySkuId,
                            schemeId: item.schemeId
                        });
                    },
                    deleteGoods: function (e, item) {
                        HB_notification.confirm('删除后，此培训商品不可恢复，是否确认删除？', function (dialog) {
                            return goodsManagerService.deleteCommodity(item.commoditySkuId).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    HB_notification.showTip(data.info, 'success');
                                    if ($scope['goodsManagerArr'].length === 1 && $scope.model.pageNo !== 1) {
                                        $scope.kendoPlus.goodsManagerGridInstance.pager.page($scope.model.pageNo - 1);
                                    } else {
                                        $scope.kendoPlus.goodsManagerGridInstance.pager.page($scope.model.pageNo);
                                    }
                                } else {
                                    HB_notification.showTip(data.info, 'error');
                                }
                            });

                        });

                    },

                    commoditySkuUp: function (e, item) {
                        HB_notification.confirm('确定要上架该商品？上架后学员可购买该商品', function (dialog) {
                            return goodsManagerService.onSale({
                                commoditySkuId: item.commoditySkuId
                            }).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    HB_dialog.success('提示', data.info);
                                    $scope.kendoPlus.goodsManagerGridInstance.dataSource.read();
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            }, function (data) {
                                HB_dialog.error('提示', data.info);
                            });
                        });

                    },

                    commoditySkuDown: function (e, item) {

                        HB_notification.confirm('确定要下架该商品？下架后学员不可购买该商品', function (dialog) {
                            return goodsManagerService.offShelves({
                                commoditySkuId: item.commoditySkuId
                            }).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    HB_notification.showTip(data.info, 'success');
                                    $scope.kendoPlus.goodsManagerGridInstance.dataSource.read();
                                } else {
                                    HB_notification.showTip(data.info, 'error');
                                }
                            }, function (data) {
                                HB_notification.showTip(data.info, 'error');
                            });
                        });

                    },


                    commodityCopy: function (e, item, type) {
                        //TabService.appendNewTab ( '发布商品', 'states.releaseGoods', { goodsId: item.commoditySkuId, mode:'copy' },true );
                        //$state.go('states.releaseGoods',{copyId:item.commoditySkuId});
                        $state.go('states.releaseGoods', {
                            goodsId: item.commoditySkuId,
                            mode: 'copy',
                            schemeId: item.schemeId
                        });
                    },
                    goDetail: function (e, item) {
                        $state.go('states.goodsManager.goodsDetail', {
                            id: item.commoditySkuId,
                            schemeId: item.schemeId
                        });
                    },

                    priceManage: function (item) {

                        $scope.model.currentCommodityType = item.commodityType;
                        $http.get('/web/admin/commodityManager/findCommoditySkuPriceRecord', {params: {commoditySkuId: item.commoditySkuId}}).success(function (data) {
                            if (data.status) {
                                $scope.model.priceManageList = data.info;
                            }
                        });


                        $scope.priceManageWindow = easyKendoDialog.content({
                            templateUrl: '@systemUrl@/views/goodsManager/edit-priceManage-dialog.html',
                            width: 800,
                            title: false
                        }, $scope);
                    },
                    closeKendoWindow: function (windowName) {
                        if ($scope[windowName]) {
                            $scope[windowName].kendoDialog.close();
                        }
                    },
                    initAllGrid:function(unitId){

                    },
                    isSubProjectManager :function () {
                        var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                        return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                    },
                };
                $scope.utils={
                    validateIsNull:validateIsNull
                }
                //验证是否小于0
                function validateLessThanZero (obj) {
                    return obj < 0;
                }

                //验证是否为非数字
                function validateIsNaN (obj) {
                    return isNaN(Number(obj));
                }


                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }

                function formatDateStr (str) {
                    var newStr = str.replace(/-/g, '/');
                    var newDate = new Date(newStr).getTime();
                    return newDate;
                }


                //商品列表模板
                var myselfGoodManagerTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');


                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    //result.push ( '#: commodityName #' );
                    result.push('<span style="cursor:pointer;" title="#: trainingSchemeName #" ng-click="events.goDetail($event,dataItem)">#: trainingSchemeName #</span>');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<span ng-if="dataItem.trainingSchemeType===\'TRAINING_CLASS\'">培训班学习</span>');
                    result.push('<span ng-if="dataItem.trainingSchemeType===\'COURSE\'">自主选课学习</span>');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                    result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                    result.push('</div>');
                    result.push('<span ng-if="dataItem.commodityType===\'TRAINING_CLASS\'">整班定价：<span ng-bind="dataItem.price"></span>元/班</span>');
                    result.push('<span ng-if="dataItem.commodityType===\'PERIOD\'">每学时：<span ng-bind="dataItem.price"></span>元/学时</span>');
                    result.push('<span ng-if="dataItem.commodityType===\'COURSE\'">课程定价：<span ng-bind="dataItem.price"></span>元/每个课程</span>');
                    result.push('</td>');


                    //销售状态/是否售出
                    result.push('<td>');
                    result.push('<span ng-if="dataItem.commoditySkuState===1">已上架</span>');
                    result.push('<span ng-if="dataItem.commoditySkuState===2">待上架</span>');
                    result.push('<span ng-if="dataItem.commoditySkuState===3">已下架</span>');
                    result.push('/<br>');
                    result.push('<span ng-if="dataItem.saleState===1">已售</span>');
                    result.push('<span ng-if="dataItem.saleState===2">未售</span>');
                    result.push('</td>');

                    //创建单位
                    result.push('<td title="#: createUnitName?createUnitName:\'-\' #">');
                    result.push('<span ng-bind="utils.validateIsNull(dataItem.createUnitName)===true?\'-\':dataItem.createUnitName"> </span>');
                    result.push('</td>');

                    //是否为代销培训方案/代销状态
                    result.push('<td>');
                    result.push('<span ng-bind="utils.validateIsNull(dataItem.authorized)===true?\'-\':(dataItem.authorized?\'是\':\'否\')"> </span>');
                    result.push('/<br>');
                    result.push('<span' +
                        ' ng-bind="utils.validateIsNull(dataItem.authorizedState)===true?\'-\':(dataItem.authorizedState==1?\'代销中\':(dataItem.authorizedState==2?\'已取消代销\':\'-\'))"> ' +
                        '</span>');
                    result.push('</td>');
                    //是否授权
                    result.push('<td>');
                    result.push('<span ng-bind="utils.validateIsNull(dataItem.hasAuthorize)===true?\'-\':(dataItem.hasAuthorize?\'是\':\'否\')"> </span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" ng-click="events.goodsEdit($event,dataItem)" has-permission="goodsManager/edit" class="table-btn" ng-click="">编辑</button>');
                    result.push('<button type="button" ng-click="events.priceManage(dataItem)" has-permission="goodsManager/priceManage" ng-disabled="priceAble"  class="table-btn">价格管理</button>');
                    result.push('<button type="button" ng-if="dataItem.commoditySkuState!==1&&dataItem.authorizedState!=2" has-permission="goodsManager/skuUp" ng-click="events.commoditySkuUp($event,dataItem)"  class="table-btn">上架</button>');
                    result.push('<button type="button" ng-if="dataItem.commoditySkuState===1&&dataItem.authorizedState!=2"" has-permission="goodsManager/skuDown" ng-click="events.commoditySkuDown($event,dataItem)"  class="table-btn">下架</button>');
                    result.push('<button type="button" ng-click="events.commodityCopy($event,dataItem)" has-permission="releaseGoods/add" ng-if="dataItem.authorized===false" class="table-btn">复制</button>');
                    result.push('<button type="button" ng-click="events.deleteGoods($event,dataItem)" has-permission="goodsManager/deleteGoods" ng-if="dataItem.commoditySkuState!==1&&dataItem.authorized===false"  class="table-btn">删除</button>');
                    result.push('<button type="button" ng-click="events.goodsAuthorized($event,dataItem)"' +
                        ' has-permission="goodsManager/edit"' +
                        ' ng-if="dataItem.createType===\'NORMAL\'&&dataItem.allowAuthorized===true"' +
                        ' class="table-btn">授权</button>');
                    result.push('<button type="button" ng-click="events.authorizedView($event,dataItem)" ' +
                        '  ng-if="dataItem.createType===\'AUTHORIZE\'&&dataItem.commodityType===\'TRAINING_CLASS\'" ' +
                        'class="table-btn">授权</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    myselfGoodManagerTemplate = result.join('');
                })();

                $scope.myselfGoodsManagerGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(myselfGoodManagerTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/commodityManager/getConfigDone',
                                    data: function (e) {

                                        var temp = {
                                            pageNo: e.page,
                                            pageSize: e.pageSize,
                                            queryParam: $scope.model.myselfQuery
                                        };


                                        if (!$scope.skuParamsMyselfGoodsManager) {
                                            temp.queryParam.skuPropertyList = undefined;
                                        } else {
                                            if (validateIsNull($scope.model.myselfQuery.categoryType)) {
                                                temp.queryParam.skuPropertyList = undefined;
                                            } else {
                                                temp.queryParam.skuPropertyList = $scope.skuParamsMyselfGoodsManager.skuPropertyList;
                                            }
                                        }
                                        if(hbUtil.validateIsNull($scope.model.mySelfAuthorizedQuery)===false){
                                            angular.forEach($scope.model.mySelfAuthorizedQuery,function(value,key){
                                                temp[key] = value;
                                            });

                                        }

                                        $scope.model.pageNo = e.page;
                                        $scope.model.pageSize = e.pageSize;


                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;

                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 5, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    $scope.goodsManagerArr = response.info;
                                    angular.forEach(response.info, function (item, ItemIndex) {
                                        item.index = ItemIndex + 1;
                                    });
                                    return response;
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    return response.info;
                                } // 指定数据源
                            },
                            serverPaging: true, //远程获取书籍
                            serverSorting: true //远程排序字段
                        },
                        selectable: true,
                        sortable: {
                            mode: 'single',
                            allowUnsort: false
                        },
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            hbUtil.kendo.grid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                            //change: function (e) {
                            //    $scope.model.page.pageNo = parseInt(e.index, 10);
                            //    //== !!important!! 这里重复了page(1)的作用
                            //    // $scope.node.lessonGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {field: 'orderNo', title: 'NO.', sortable: false, width: 60},
                            {field: 'orderNo', title: '培训方案名称', sortable: false},
                            {field: 'firstGoods', title: '培训方案形式', sortable: false, width: 110},
                            {field: 'goodsCount', title: '销售属性', sortable: false, width: 150},
                            {field: 'totalAmount', title: '销售状态/<br>是否售出', sortable: false, width: 90},
                            {field: 'totalAmount', title: '创建单位', sortable: false, width: 120},
                            {field: 'totalAmount', title: '是否为代销培训方案/<br>代销状态', sortable: false, width: 160},
                            {field: 'totalAmount', title: '是否授权', sortable: false, width: 90},
                            {
                                title: '操作', width: 250
                            }
                        ]
                    }
                };
                //商品列表模板
                var allGoodManagerTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');


                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    //result.push ( '#: commodityName #' );
                    result.push('<span style="cursor:pointer;" title="#: trainingSchemeName #" ng-click="events.goDetail($event,dataItem)">#: trainingSchemeName #</span>');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<span ng-if="dataItem.trainingSchemeType===\'TRAINING_CLASS\'">培训班学习</span>');
                    result.push('<span ng-if="dataItem.trainingSchemeType===\'COURSE\'">自主选课学习</span>');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                    result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                    result.push('</div>');
                    result.push('<span ng-if="dataItem.commodityType===\'TRAINING_CLASS\'">整班定价：<span ng-bind="dataItem.price"></span>元/班</span>');
                    result.push('<span ng-if="dataItem.commodityType===\'PERIOD\'">每学时：<span ng-bind="dataItem.price"></span>元/学时</span>');
                    result.push('<span ng-if="dataItem.commodityType===\'COURSE\'">课程定价：<span ng-bind="dataItem.price"></span>元/每个课程</span>');
                    result.push('</td>');


                    //销售状态/是否售出
                    result.push('<td>');
                    result.push('<span ng-if="dataItem.commoditySkuState===1">已上架</span>');
                    result.push('<span ng-if="dataItem.commoditySkuState===2">待上架</span>');
                    result.push('<span ng-if="dataItem.commoditySkuState===3">已下架</span>');
                    result.push('/<br>');
                    result.push('<span ng-if="dataItem.saleState===1">已售</span>');
                    result.push('<span ng-if="dataItem.saleState===2">未售</span>');
                    result.push('</td>');

                    //创建单位
                    result.push('<td title="#: createUnitName?createUnitName:\'-\' #">');
                    result.push('<span ng-bind="utils.validateIsNull(dataItem.createUnitName)===true?\'-\':dataItem.createUnitName"> </span>');
                    result.push('</td>');

                    //是否为代销培训方案/代销状态
                    result.push('<td>');
                    result.push('<span ng-bind="utils.validateIsNull(dataItem.authorized)===true?\'-\':(dataItem.authorized?\'是\':\'否\')"> </span>');
                    result.push('/<br>');
                    result.push('<span' +
                        ' ng-bind="utils.validateIsNull(dataItem.authorizedState)===true?\'-\':(dataItem.authorizedState==1?\'代销中\':(dataItem.authorizedState==2?\'已取消代销\':\'-\'))"> ' +
                        '</span>');
                    result.push('</td>');
                    //是否授权
                    result.push('<td>');
                    result.push('<span ng-bind="utils.validateIsNull(dataItem.hasAuthorize)===true?\'-\':(dataItem.hasAuthorize?\'是\':\'否\')"> </span>');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.goDetail($event,dataItem)">详情</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    allGoodManagerTemplate = result.join('');
                })();

                $scope.allGoodsManagerGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(allGoodManagerTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/commodityManager/getConfigDone',
                                    data: function (e) {

                                        var temp = {
                                            pageNo: e.page,
                                            pageSize: e.pageSize,
                                            queryParam: $scope.model.allQuery
                                        };


                                        if (!$scope.skuParamsAllGoodsManager) {
                                            temp.queryParam.skuPropertyList = undefined;
                                        } else {
                                            if (validateIsNull($scope.model.allQuery.categoryType)) {
                                                temp.queryParam.skuPropertyList = undefined;
                                            } else {
                                                temp.queryParam.skuPropertyList = $scope.skuParamsAllGoodsManager.skuPropertyList;
                                            }
                                        }
                                        if(hbUtil.validateIsNull($scope.model.allAuthorizedQuery)===false){
                                            angular.forEach($scope.model.allAuthorizedQuery,function(value,key){
                                                temp[key] = value;
                                            });

                                        }
                                        $scope.model.pageNo = e.page;
                                        $scope.model.pageSize = e.pageSize;


                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;

                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 5, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    $scope.goodsManagerArr = response.info;
                                    angular.forEach(response.info, function (item, ItemIndex) {
                                        item.index = ItemIndex + 1;
                                    });
                                    return response;
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    return response.info;
                                } // 指定数据源
                            },
                            serverPaging: true, //远程获取书籍
                            serverSorting: true //远程排序字段
                        },
                        selectable: true,
                        sortable: {
                            mode: 'single',
                            allowUnsort: false
                        },
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            hbUtil.kendo.grid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                            //change: function (e) {
                            //    $scope.model.page.pageNo = parseInt(e.index, 10);
                            //    //== !!important!! 这里重复了page(1)的作用
                            //    // $scope.node.lessonGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {field: 'orderNo', title: 'NO.', sortable: false, width: 60},
                            {field: 'orderNo', title: '培训方案名称', sortable: false},
                            {field: 'firstGoods', title: '培训方案形式', sortable: false, width: 110},
                            {field: 'goodsCount', title: '销售属性', sortable: false, width: 150},
                            {field: 'totalAmount', title: '销售状态/<br>是否售出', sortable: false, width: 90},
                            {field: 'totalAmount', title: '创建单位', sortable: false, width: 120},
                            {field: 'totalAmount', title: '是否为代销培训方案/<br>代销状态', sortable: false, width: 160},
                            {field: 'totalAmount', title: '是否授权', sortable: false, width: 90},
                            {
                                title: '操作', width: 120
                            }
                        ]
                    }
                };


            }]
    };
});

