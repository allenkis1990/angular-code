/**
 * Created by hb on 2017/3/20.
 */

define(function (mod) {
    return {
        selectClass: ['hbUtil', function (hbUtil) {
            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            return {
                scope: {
                    list: '='
                },
                templateUrl: '@systemUrl@/views/defenceFakeLearning/selectClass.html',
                link: function ($scope) {
                    $scope.model = {
                        query: {},
                        queryParam: {
                            categoryId: '35f84aea57d24cc299a397c1'
                            //categoryId:''
                        }
                    };


                    var selectClassGridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/fakeLearning/getSchemeInfoPage', $scope.model.query, {
                        rebuild: function (data) {
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
                                schemeName: $scope.model.query.schemeName,
                                categoryId: $scope.model.queryParam.categoryId
                            };

                            if (!$scope.skuParamsDefenceFakeLearning) {
                                required.queryParam.skuPropertyList = undefined;
                            } else {
                                if (validateIsNull($scope.model.queryParam.categoryId)) {
                                    required.queryParam.skuPropertyList = undefined;
                                } else {
                                    required.queryParam.skuPropertyList = $scope.skuParamsDefenceFakeLearning.skuPropertyList;
                                }
                            }

                            if ($scope.model.query.trainingType) {
                                required.queryParam.trainingType = $scope.model.query.trainingType.optionId;
                            }

                            required.queryParam = angular.extend(required.queryParam, $scope.skuParamsFjxAdd);


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
                        result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                        result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                        result.push('</div>');
                        result.push('</td>');

                        //result.push ( '<td>' );
                        //result.push ( '<div ng-repeat="item in dataItem.skuPropertyNameList">');
                        //result.push ( '<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>' );
                        //result.push ( '<br />' );
                        //result.push ( '</div>');
                        ////hbSkuService.kendoSkuDo(result);
                        //result.push ( '</td>' );
                        //
                        //result.push ( '<td>' );
                        //result.push ( '<span ng-if="#:onSaleState==1#">已上架</span>' + '<span ng-if="#:onSaleState==2#">待上架</span>' + '<span ng-if="#:onSaleState==3#">已下架</span>' );
                        //result.push ( '</td>' );
                        //
                        //result.push ( '<td>' );
                        //result.push ( '<span ng-if="#:saleState==1#">已售</span>' + '<span ng-if="#:saleState==2#">未售</span>' );
                        //result.push ( '</td>' );
                        //
                        //result.push ( '<td>' );
                        //result.push ( '#: credit #' );
                        //result.push ( '</td>' );
                        //
                        //result.push ( '<td>' );
                        //result.push ( '#: price #' );
                        //result.push ( '</td>' );
                        //
                        //result.push ( '<td>' );
                        //result.push ( '首次上架时间：' );
                        //result.push ( '<span ng-if="#: firstUpTime!==null #">#: firstUpTime #</span>' );
                        //result.push ( '<span ng-if="#: firstUpTime==null #">-</span>' );
                        //result.push ( '<br />' );
                        ////result.push('预计上架时间：');
                        //result.push ( '<span ng-if="#: futureUpTime!==null #">预计上架时间：#: futureUpTime #</span>' );
                        ////result.push('预计上架时间：'+'<span ng-if="#: futureUpTime!==null #">#: futureUpTime #</span>');
                        ////result.push('<span ng-if="#: futureUpTime==null #">-</span>');
                        //result.push ( '</td>' );

                        result.push('<td>');
                        result.push('<button ng-if="!utils.isSelected(dataItem)" type="button" ng-click="events.doChoose(dataItem)" class="table-btn">选择</button>'
                            + '<button ng-if="utils.isSelected(dataItem)" type="button" ng-click="events.doChoose(dataItem)" class="table-btn">取消选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        classGridRowTemplate = result.join('');
                    })();


                    $scope.selectClassGridOptions = hbUtil.kendo.grid.genGridCommonConfig(selectClassGridDataSource, classGridRowTemplate, [
                        {field: 'schemeName', title: '方案名称', sortable: false},
                        {field: 'attr', title: '属性', sortable: false, width: 230},
                        //{ field: "onSaleState", title: "上架状态", sortable: false, width: 80 },
                        //{ field: "saleState", title: "是否出售", sortable: false, width: 80 },
                        //{ field: "credit", title: "学时", sortable: false, width: 80 },
                        //{ field: "price", title: "价格", sortable: false, width: 80 },
                        //{
                        //    field         : "onSaleTime", title: "上架时间", sortable: false, width: 260,
                        //    headerTemplate: '上架时间<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder==0" ng-click="events.setSortOrder(1)" class="ico lwh-ico-up"></a>' +
                        //    '<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder!==0" ng-click="events.setSortOrder(0)" class="ico lwh-ico-down"></a>'
                        //},
                        {
                            title: '操作', width: 80
                        }
                    ], {}, {
                        sortable: false,
                        height: 400
                    });

                    $scope.utils = {
                        isSelected: function isSelected (obj) {
                            if (validateIsNull($scope.list) === false && obj.schemeId === $scope.list.schemeId) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                    $scope.events = {
                        doSearch: function () {
                            selectClassGridDataSource.refresh();
                        },
                        doChoose: function (item) {
                            if ($scope.utils.isSelected(item)) {
                                $scope.list.schemeId = null;
                                $scope.list.schemeName = null;
                            } else {
                                $scope.list.schemeId = item.schemeId;
                                $scope.list.schemeName = item.schemeName;
                            }
                        }
                    };
                }
            };
        }]
    };
});