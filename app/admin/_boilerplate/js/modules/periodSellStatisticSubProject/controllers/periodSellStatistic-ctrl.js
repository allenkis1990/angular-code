define(function () {
    'use strict';
    return ['$scope', 'hbUtil', 'periodSellStatisticSubProject', 'genQueryData', 'HB_dialog', 'KENDO_UI_GRID', 'kendo.grid', '$state', 'TabService',
        function ($scope, hbUtil, periodSellStatisticSubProject, genQueryData, HB_dialog, KENDO_UI_GRID, kendoGrid, $state, TabService) {


            $scope.node = {
                periodGrid: null
            };
            $scope.timeConfig = {
                open: function (e) {
                    this.$scope = $scope;
                    genQueryData.setMaxDate.call(this, e);

                },
                min: new Date(2017, 5, 14)
            };

            $scope.model = {
                totalSellCount: '',
                totalRefundCount: '',
                totalNetSellCount: '',
                totalTradingMoney: '',
                totalRefundMoney: '',

                classTotalNetSellCount: '',
                courseTotalNetSellCount: '',
                periodTotalNetSellCount: '',
                totalSize: 0,

                authorizedQuery:{
                    rangeType:'',
                    belongsType:'',
                    authorizeToUnitId:'',
                    authorizedFromUnitId:'',
                    objectId:'',
                    targetUnitId:''
                },
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                periodPage: {
                    pageNo: 1,
                    pageSize: 10
                },
                chooseParams: {
                    goodName: '',
                    startCreateTime: '',
                    endCrateTime: '',

                    trainingSchemeType: '',
                    commodityType: ''
                },

                queryShow: {},
                queryParam: {
                    categoryType: 'TRAINING_CLASS_GOODS' // 类目id
                    //categoryId:'35f84aea57d24cc299a397c1'
                },
                commodityTypeDisabled: true,

                categoryTypeDisabled: false

            };
            $scope.kendoPlus = {
                periodsellGridInstance: null,

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
            $scope.$watch('model.chooseParams.trainingSchemeType', function (nV, oV) {
                if (nV != oV) {
                    $scope.model.chooseParams.commodityType = '';
                    $scope.model.queryParam.categoryType = 'TRAINING_CLASS_GOODS';
                    $scope.model.categoryTypeDisabled = true;

                    $scope.model.chooseParams.skuId = '';
                    $scope.model.chooseParams.goodName = '';

                    if ($scope.model.chooseParams.trainingSchemeType == '') {
                        $scope.model.commodityTypeDisabled = true;

                        $scope.model.categoryTypeDisabled = false;
                    } else if ($scope.model.chooseParams.trainingSchemeType == 'TRAINING_CLASS') {
                        $scope.model.commodityTypeDisabled = false;
                        $scope.model.chooseParams.commodityType = 'TRAINING_CLASS';


                    } else if ($scope.model.chooseParams.trainingSchemeType == 'COURSE') {
                        $scope.model.commodityTypeDisabled = false;

                        $scope.model.queryParam.categoryType = 'COURSE_SUPERMARKET_GOODS';
                    }
                }
            });


            var selectClassGridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/fakeLearning/getSchemeInfoPage', $scope.model.queryShow, {
                rebuild: function (data) {
                    angular.forEach(data, function (item, $index) {
                        if (!item.selected) {
                            angular.forEach($scope.list, function (listItem, listIndex) {
                                if (item.schemeId === listItem.schemeId) {
                                    item.selected = true;
                                    item.selectedIndex = listIndex;
                                }
                            });
                        }
                    });
                    return hbUtil.kendo.dataSource.setIndex(selectClassGridDataSource, data, 1);
                },
                parameterMap: function (data, type) {
                    var page = data.page,
                        required = {
                            queryParam: data.queryParam
                        };

                    required.pageNo = page;
                    required.pageSize = data.pageSize;

                    required.queryParam = {
                        schemeName: $scope.model.queryShow.schemeName,
                        categoryType: $scope.model.queryParam.categoryType
                    };

                    if (!$scope.skuParamsCommoditySellStatic) {
                        required.queryParam.skuPropertyList = undefined;
                    } else {
                        if (validateIsNull($scope.model.queryParam.categoryType)) {
                            required.queryParam.skuPropertyList = undefined;
                        } else {
                            required.queryParam.skuPropertyList = $scope.skuParamsCommoditySellStatic.skuPropertyList;
                        }
                    }

                    if ($scope.model.queryShow.trainingType) {
                        required.queryParam.trainingType = $scope.model.queryShow.trainingType.optionId;
                    }

                    required.queryParam = angular.extend(required.queryParam, $scope.skuParamsSpxsStatic);


                    return required;
                },
                pageSize: 10
            });


            //已配置模板
            var classGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td title="#: schemeName #">');
                result.push('#:schemeName#');
                result.push('</td>');

                result.push('<td>');
                result.push(
                    '<span ng-if="#:trainingSchemeType==\'TRAINING_CLASS\'#">培训班学习</span>'
                    + '<span ng-if="#:trainingSchemeType==\'COURSE\'#">自主选课学习</span>'
                );
                result.push('</td>');

                result.push('<td>');
                result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button ng-if="!dataItem.selected" type="button" ng-click="events.doChoose(dataItem)" class="table-btn">选择</button>'
                    + '<button ng-if="dataItem.selected" type="button" ng-click="events.doChoose(dataItem)" class="table-btn">取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                classGridRowTemplate = result.join('');
            })();


            $scope.selectClassGridOptions = hbUtil.kendo.grid.genGridCommonConfig(selectClassGridDataSource, classGridRowTemplate, [
                {field: 'schemeName', title: '培训方案名称', sortable: false},
                {field: 'trainingSchemeType', title: '培训方案形式', sortable: false, width: 180},
                {field: 'attr', title: '属性', sortable: false, width: 180},
                {
                    title: '操作', width: 80
                }
            ], {}, {
                sortable: false,
                height: 400
            });


            $scope.events = {
                exportCourseStatistics: function () {
                    $scope.submitExportOrder = false;
                    periodSellStatisticSubProject.exportCommoditySaleStatistic({
                        ltUnitPrice: $scope.model.chooseParams.hightprice,
                        gtUnitPrice: $scope.model.chooseParams.lowprice,
                        beginTime: validateIsNull($scope.model.chooseParams.startCreateTime) === true ? 0 : parseTimeStrToLong($scope.model.chooseParams.startCreateTime),
                        endTime: validateIsNull($scope.model.chooseParams.endCrateTime) === true ? 0 : parseTimeStrToLong($scope.model.chooseParams.endCrateTime),
                        commodityId: $scope.model.chooseParams.skuId,
                        trainingSchemeType: $scope.model.chooseParams.trainingSchemeType,
                        commodityType: $scope.model.chooseParams.commodityType,

                        rangeType:$scope.model.authorizedQuery.rangeType,
                        belongsType:$scope.model.authorizedQuery.belongsType,
                        authorizeToUnitId:$scope.model.authorizedQuery.authorizeToUnitId,
                        authorizedFromUnitId:$scope.model.authorizedQuery.authorizedFromUnitId,
                        objectId:$scope.model.authorizedQuery.objectId,
                        targetUnitId:$scope.model.authorizedQuery.targetUnitId
                    }).then(function (data) {

                        if (data.info) {
                            HB_dialog.success('提示', '导出成功');
                            $scope.submitExportOrder = true;
                            /*  if(data.info==='success'){
                             HB_dialog.success ( '提示', '导出成功' );
                             }else{
                             HB_dialog.error ( '提示', '导出失败' );
                             }*/
                        } else {
                            HB_dialog.error('提示', '导出失败');
                            $scope.submitExportOrder = true;
                        }

                    });
                },
                openKendoWindow: function (windowName) {
                    selectClassGridDataSource.page(1);
                    $scope[windowName].center().open();
                },

                closeKendoWindow: function (windowName) {
                    $scope[windowName].close();
                },
                choseClass: function (e, item) {
                    $scope.model.chooseParams.goodName = item.commodityName;
                    $scope.model.chooseParams.skuId = item.commoditySkuId;
                    $scope.events.closeKendoWindow('schemeWindow');
                },
                MainPageQueryList: function (e) {
                    e.stopPropagation();
                    $scope.model.pageNo = 1;
                    $scope.kendoPlus.periodsellGridInstance.pager.page(1);
                },


                search: function () {

                    if (!validateIsNull($scope.model.chooseParams.lowprice) && validateIsNaN($scope.model.chooseParams.lowprice)) {
                        HB_dialog.warning('警告', '输入的价格必须为数字');
                        return false;
                    }
                    if (!validateIsNull($scope.model.chooseParams.hightprice) && validateIsNaN($scope.model.chooseParams.hightprice)) {
                        HB_dialog.warning('警告', '输入的价格必须为数字');
                        return false;
                    }

                    if (validateLessThanZero($scope.model.chooseParams.lowprice)) {
                        HB_dialog.warning('警告', '输入的价格不能为负数');
                        return false;
                    }
                    if (validateLessThanZero($scope.model.chooseParams.hightprice)) {
                        HB_dialog.warning('警告', '输入的价格不能为负数');
                        return false;
                    }
                    if ($scope.model.chooseParams.goodName === undefined) {
                        $scope.model.chooseParams.skuId = '';
                    }
                    if ($scope.model.chooseParams.startCreateTime) {
                        if (!$scope.model.chooseParams.endCrateTime) {
                            HB_dialog.warning('警告', '请输入查询截止日期');
                            return false;
                        }
                    }

                    $scope.model.page.pageNo = 1;
                    $scope.node.periodGrid.pager.page(1);
                },
                clearUserPageParams: function () {
                    $scope.model.chooseParams.startCreateTime = '';
                    $scope.model.chooseParams.endCrateTime = '';
                    $scope.model.chooseParams.activated = 0;
                    $scope.model.chooseParams.goodName = undefined;
                    $scope.model.chooseParams.lowprice = '';
                    $scope.model.chooseParams.hightprice = '';
                    $scope.model.chooseParams.skuId = '';
                    $scope.model.chooseParams.trainingSchemeType = '';
                    $scope.model.chooseParams.commodityType = '';
                    $scope.model.authorizedQuery.authorizedFromUnitId = '';
                    $scope.model.authorizedQuery.authorizeToUnitId = '';
                    $scope.model.authorizedQuery.objectId = '';
                    $scope.model.authorizedQuery.belongsType = 'MYSELF';
                    $scope.model.authorizedQuery.rangeType = 'merchantAccount';
                },

                doSearch: function () {
                    //selectClassGridDataSource.refresh();
                    selectClassGridDataSource.page(1);
                },
                doChoose: function (item) {
                    $scope.model.chooseParams.goodName = item.schemeName;
                    $scope.model.chooseParams.skuId = item.schemeId;
                    $scope.events.closeKendoWindow('schemeWindow');
                }
            };
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr ng-if="#:$index <=0 #">');
                result.push('<td colspan="7">');
                result.push('合计');
                result.push('</td>');

                result.push('<td>');
                result.push('b{{model.totalSellCount}}');
                result.push('</td>');

                result.push('<td>');
                result.push('b{{model.totalRefundCount}}');
                result.push('</td>');

                result.push('<td>');
                result.push('b{{model.totalNetSellCount}}');
                result.push('</td>');

                result.push('</tr>');


                result.push('<tr>');

                result.push('<td title="#: commodityName #">');
                result.push('#: commodityName #');
                result.push('</td>');

                result.push('<td title="#: rootCommoditySkuUnitName #">');
                result.push('#: rootCommoditySkuUnitName #');
                result.push('</td>');

                result.push('<td title="#: commodityAuthorizedStatue #">');
                result.push('#: commodityAuthorizedStatue #');
                result.push('</td>');
                //result.push('<td>');
                //result.push(
                //    '<span ng-if="#:authorized==true#">是</span>'
                //    + '<span ng-if="#:authorized==false#">否</span>'
                //);
                //result.push('</td>');

                result.push('<td>');
                result.push(
                    '<span ng-if="#:commodityType==\'TRAINING_CLASS\'#">培训班</span>'
                    + '<span ng-if="#:commodityType==\'COURSE\'#">课程</span>'
                    + '<span ng-if="#:commodityType==\'PERIOD\'#">学时商品</span>'
                );
                result.push('</td>');

                result.push('<td>');
                result.push(
                    '<span ng-if="#:trainingSchemeType==\'TRAINING_CLASS\'#">培训班学习</span>'
                    + '<span ng-if="#:trainingSchemeType==\'COURSE\'#">自主选课学习</span>'
                );
                result.push('</td>');

                result.push('<td title="#: schemeName #">');
                result.push('#: schemeName #');
                result.push('</td>');

                result.push('<td>');
                result.push(
                    '#: sellPrice #'
                    + '<span ng-if="#:commodityType==\'TRAINING_CLASS\'#">元/班</span>'
                    + '<span ng-if="#:commodityType==\'COURSE\'#">元/门</span>'
                    + '<span ng-if="#:commodityType==\'PERIOD\'#">元/学时</span>'
                );
                result.push('</td>');

                result.push('<td>');
                result.push('#: sellCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: refundCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: netSellCount #');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();
            //已配置模板
            var minDate = new Date(2017, 5, 14);
            $scope.ui = {
                periodGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/commoditySellStatistics/getSellStatistics',
                                    data: function (e) {
                                        var temp = {
                                            pageNo: e.page,
                                            //page:$scope.model.page.pageNo,
                                            pageSize: $scope.model.page.pageSize,
                                            ltUnitPrice: $scope.model.chooseParams.hightprice,
                                            gtUnitPrice: $scope.model.chooseParams.lowprice,
                                            beginTime: validateIsNull($scope.model.chooseParams.startCreateTime) === true ? 0 : parseTimeStrToLong($scope.model.chooseParams.startCreateTime),
                                            endTime: validateIsNull($scope.model.chooseParams.endCrateTime) === true ? 0 : parseTimeStrToLong($scope.model.chooseParams.endCrateTime),
                                            commodityId: $scope.model.chooseParams.skuId,
                                            trainingSchemeType: $scope.model.chooseParams.trainingSchemeType,
                                            commodityType: $scope.model.chooseParams.commodityType,

                                            rangeType:$scope.model.authorizedQuery.rangeType,
                                            belongsType:$scope.model.authorizedQuery.belongsType,
                                            authorizeToUnitId:$scope.model.authorizedQuery.authorizeToUnitId,
                                            authorizedFromUnitId:$scope.model.authorizedQuery.authorizedFromUnitId,
                                            objectId:$scope.model.authorizedQuery.objectId,
                                            targetUnitId:$scope.model.authorizedQuery.targetUnitId
                                        };
                                        $scope.pageNo = e.page;
                                        delete e.skip;
                                        delete e.page;
                                        delete e.take;
                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    return response;
                                },
                                total: function (response) {
                                    $scope.model.totalSize = response.totalSize;

                                    $scope.model.totalSellCount = response.info.totalSellCount;
                                    $scope.model.totalRefundCount = response.info.totalRefundCount;
                                    $scope.model.totalNetSellCount = response.info.totalNetSellCount;
                                    $scope.model.totalTradingMoney = response.info.totalTradingMoney;
                                    $scope.model.totalRefundMoney = response.info.totalRefundMoney;

                                    $scope.model.classTotalNetSellCount = response.info.classTotalNetSellCount;
                                    $scope.model.courseTotalNetSellCount = response.info.courseTotalNetSellCount;
                                    $scope.model.periodTotalNetSellCount = response.info.periodTotalNetSellCount;

                                    return response.totalSize;
                                },
                                data: function (response) {
                                    angular.forEach(response.info.list, function (item, index) {
                                        item.$index = index;
                                    });
                                    if (response.code !== 200) {
                                        HB_dialog.error('提示', response.info);
                                        return [];
                                    } else {
                                        return response.info.list;
                                    }

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
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50],
                            pageSize: 10,
                            buttonCount: 10
                            //change: function (e) {
                            //    $scope.model.page.pageNo = parseInt(e.index, 10);
                            //    //== !!important!! 这里重复了page(1)的作用
                            //    // $scope.node.periodGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {sortable: false, field: 'commodityName', title: '商品', width: 150},
                            {sortable: false, field: 'unitName', title: '商品创建单位', width: 90},
                            {sortable: false, field: 'commodityAuthorizedStatue', title: '商品来源', width: 90},
                            {sortable: false, field: 'commodityType', title: '商品类型', width: 50},
                            {sortable: false, field: 'trainingSchemeType', title: '培训方案形式', width: 70},
                            {sortable: false, field: 'schemeName', title: '培训方案名称', width: 130},
                            {sortable: false, field: 'sellPrice', title: '单价', width: 80},
                            {sortable: false, field: 'sellCount', title: '累计销售数/学时数', width: 100},
                            {sortable: false, field: 'refundCount', title: '退款退货数/学时数', width: 100},
                            {sortable: false, field: 'netSellCount', title: '净销售数/学时数', width: 100}
                        ]
                    }
                }
            };


            $scope.ui.periodGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.periodGrid.options);

            //时间字符串转毫秒
            function parseTimeStrToLong (str) {
                return kendo.parseDate(str).getTime();
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

        }];

});
