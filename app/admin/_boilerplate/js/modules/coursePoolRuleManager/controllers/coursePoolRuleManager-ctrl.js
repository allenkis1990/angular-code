define(function () {
    'use strict';
    return ['$rootScope','$scope', 'coursePoolRuleManagerService', 'KENDO_UI_GRID', 'kendo.grid', '$state', '$stateParams',
        function ($rootScope,$scope, coursePoolRuleManagerService, KENDO_UI_GRID, kendoGrid, $state, $stateParams) {
            var utils;
            $scope.model = {
                queryParams: {
                    hasReference: -1
                },
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                totalSum: 0
            };

            $scope.flagModel = {
                tabType :"OWN",
                viewProjectFirst : true,
            };
            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //== index node
                coursePoolRuleGrid: null,
                workBeginTime: null,
                workEndTime: null
            };
            $scope.events = {
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                tabClick:function (e,type) {
                    $scope.flagModel.tabType = type;
                    if (type === 'OWN'){
                        $scope.model.unitId= '';
                    }
                },
                addCoursePoolRule: function (e) {
                    $scope.queryParams = {};
                    e.preventDefault();
                    $state.go('states.coursePoolRuleManager.add');
                },

                update: function (dataItem) {
                    /* if(dataItem.isApplyToScheme!=false){
                         $scope.globle.confirm ( '提示', '选课规则已被班级引用不可修改', function ( dialog ) {
 
                         } );
                     }else{
                         $state.go ( 'states.coursePoolRuleManager.edit', { ruleId: dataItem.id } );
                     }*/
                    $state.go('states.coursePoolRuleManager.edit', {ruleId: dataItem.id});
                },
                view: function (id) {
                    $state.go('states.coursePoolRuleManager.view', {ruleId: id});
                },
                deleteCoursePoolRule: function (id) {
                    $scope.globle.confirm('提示', '确认删除该选课规则模版，删除后需要重新添加！', function (dialog) {
                        return coursePoolRuleManagerService.deleteCoursePoolRule(id).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.coursePoolRuleGrid.pager.page(1);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });

                },
                /**
                 * 查询事件
                 * @param e
                 */
                search: function (e) {
                    if (e.keyCode === 13) {
                        $scope.events.searchCoursePackage(e);
                    }
                },
                /**
                 * 查询
                 */
                searchCoursePackage: function (e) {
                    $scope.model.page.pageNo = 1;
                    $scope.node.coursePoolRuleGrid.pager.page(1);
                    e.preventDefault();
                }
            };
            $scope.utils = {
                getRequiredPeriod:function(dataList){
                    var period = 0;
                    if (dataList.length>0) {
                        angular.forEach(dataList, function (data) {
                            if(data.type==1){
                                period+=Number(data.requiredPeriod);
                            }
                        });
                    }
                    return period;

                }
            }
            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr class="table table-nf mt10">');

                result.push('<td title="#: ruleName #">');
                result.push('#: ruleName #');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: ruleType==1?"仅必修包":ruleType==2?"仅选修包":ruleType==3?"必修包+选修包":"未知" #">');
                result.push('#: ruleType==1?"仅必修包":ruleType==2?"仅选修包":ruleType==3?"必修包+选修包":"未知" #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: requiredPeriod #">');
                result.push('#: requiredPeriod+"学时" #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div >');
                result.push('<div ng-if="#: ruleType==1 #" ng-repeat="data in dataItem.periodRequireds  track by $index">');
                result.push('<span ng-bind="data.packageName"></span>');
                result.push('选课要求=');
                result.push('<span ng-bind="data.requiredPeriod"></span>');
                result.push('</div>');
                result.push ( '<div ng-if="dataItem.forbidOptionalPackageRequires===false&&dataItem.ruleType==2" ng-repeat="data in dataItem.periodRequireds  track by $index">' );
                result.push ( '<span ng-bind="data.packageName"></span>' );
                result.push ( '选课要求=' );
                result.push ( '<span ng-bind="data.requiredPeriod"></span>' );
                result.push ( '</div>' );

                result.push ( '<div ng-if="dataItem.forbidOptionalPackageRequires===true&&dataItem.ruleType==2">' );
                result.push ( '选修包无选课要求' );
                result.push ( '</div>' );
                result.push ( '<div ng-if="dataItem.forbidOptionalPackageRequires===false&&dataItem.ruleType==3">' );
                result.push('<div> 必修包的选课学时=<span ng-bind=utils.getRequiredPeriod(dataItem.periodRequireds)></span></div>');
                result.push ( '<div ng-if="data.type!=1"  ng-repeat="data in dataItem.periodRequireds  track by $index">' );
                result.push ( '<span ng-bind="data.packageName"></span>' );
                result.push ( '选课要求=' );
                result.push ( '<span  ng-bind="data.requiredPeriod"></span>' );
                result.push ( '</div>' );
                result.push('</div>');
                result.push ( '<div ng-if="dataItem.forbidOptionalPackageRequires===true&&dataItem.ruleType==3">' );
                result.push ( '<div> 必修包的选课学时=<span ng-bind=utils.getRequiredPeriod(dataItem.periodRequireds)></span></div>' );
                result.push('<div> 选修包的整体选课学时=<span ng-bind="dataItem.requiredPeriod-utils.getRequiredPeriod(dataItem.periodRequireds)"></span></div>');
                result.push ( '</div>' );
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: poolCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: isApplyToScheme?"是":"否" #');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn" has-permission="coursePoolRuleManager/view" ng-click="events.view(\'#: id #\')">详情</button>');
                result.push('<button type="button" class="table-btn" ng-if="flagModel.tabType === \'OWN\'" has-permission="coursePoolRuleManager/save" ng-click="events.update(dataItem)">修改</button>');
                result.push('<button type="button" ng-if="flagModel.tabType === \'OWN\'" has-permission="coursePoolRuleManager/delete" #: isApplyToScheme?\'disabled\':\'\'# class="table-btn" ng-click="events.deleteCoursePoolRule(\'#: id #\')">删除</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            utils = {
                startChange: function () {
                    var startDate = $scope.node.workBeginTime.value(),
                        endDate = $scope.node.workEndTime.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.workEndTime.min(startDate);
                    } else if (endDate) {
                        $scope.node.workBeginTime.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.workBeginTime.max(endDate);
                        $scope.node.workEndTime.min(endDate);
                    }
                },
                endChange: function () {
                    var endDate = $scope.node.workEndTime.value(),
                        startDate = $scope.node.workBeginTime.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.workBeginTime.max(endDate);
                    } else if (startDate) {
                        $scope.node.workEndTime.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.workBeginTime.max(endDate);
                        $scope.node.workEndTime.min(endDate);
                    }
                }
            };

            $scope.ui = {
                datePicker: {
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: utils.startChange
                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: utils.endChange
                        }
                    },
                    workDate: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd'
                        }
                    }
                },
                coursePoolRuleGrid: {
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
                                    url: '/web/admin/coursePoolRuleAction/findCoursePoolRulePage',
                                    data: function (e) {
                                        var temp = {
                                            queryParam: {sort: e.sort}
                                        }, params = $scope.model.queryParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.queryParam[key] = params[key];
                                                }
                                            }
                                        }
                                        delete temp.page;
                                        temp.page = {
                                            pageNo: e.page,
                                            pageSize: $scope.model.page.pageSize
                                        };
                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;
                                        //temp.pageNo   = e.page;
                                        //temp.pageSize = $scope.model.page.pageSize;
                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    return response;
                                },
                                total: function (response) {
                                    $scope.model.totalSum = parseInt(response.totalSize);
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
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50],
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {sortable: false, field: 'name', title: '选课规则'},
                            {sortable: false, field: 'typeName', title: '规则类型', width: 100},
                            {sortable: false, field: 'typeName', title: '整体选课要求', width: 120},
                            {sortable: false, field: 'typeName', title: '包内选课要求', width: 230},
                            {sortable: false, field: 'createTime', title: '课程包数量', width: 120},
                            {sortable: false, field: 'praiseCount', title: '是否被班级引用', width: 120},
                            {
                                title: '操作', width: 120
                            }
                        ]
                    }
                }
            };
            $scope.ui.coursePoolRuleGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.coursePoolRuleGrid.options);
        }];
});
