define(function () {
    'use strict';
    return ['$rootScope', '$scope', 'hbUtil', 'coursePackageManagerService', 'KENDO_UI_GRID', 'kendo.grid', '$state', '$stateParams',
        function ($rootScope, $scope, hbUtil, coursePackageManagerService, KENDO_UI_GRID, kendoGrid, $state, $stateParams) {
            var utils;
            $scope.model = {
                queryParams: {
                    poolState: -1
                },
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                copyCoursePool: {},
                saving: false
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
                coursePackageGrid: null,
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
                        $scope.model.authorizeQuery.targetUnitId= '';
                    }
                },
                addCoursePackage: function (e) {
                    $scope.queryParams = {};
                    e.preventDefault();
                    $state.go('states.coursePackageManager.add');
                },

                update: function (dataItem) {
                    if (dataItem.containRequired) {
                        $state.go('states.coursePackageManager.requiredEdit', {packageId: dataItem.id});
                    } else {
                        $state.go('states.coursePackageManager.edit', {packageId: dataItem.id});
                    }

                },
                copy: function (dataItem) {
                    $scope.model.copyCoursePool.originId = dataItem.id;
                    $scope.model.copyCoursePool.originName = dataItem.poolName;
                    $scope.model.copyCoursePool.copyName = dataItem.poolName + '_复制';
                    $scope.model.copyCoursePool.courseCount = dataItem.courseCount;
                    $scope.model.copyCoursePool.totalPeriod = dataItem.totalPeriod;
                    $scope.node.windows.copyDialog.open();
                },
                closeCopyWindow: function (dataItem) {
                    $scope.node.windows.copyDialog.close();
                },
                copyCoursePool: function () {
                    if (!$scope.model.saving && $scope.coursePackageValidate.$valid) {
                        $scope.model.saving = true;
                        coursePackageManagerService.copyCoursePool($scope.model.copyCoursePool.originId, $scope.model.copyCoursePool.copyName)
                            .then(function (data) {
                                $scope.model.saving = false;
                                if (data.status) {
                                    $scope.globle.confirm('提示', '复制成功', function () {
                                        $scope.node.coursePackageGrid.pager.page(1);
                                    });
                                    $scope.node.windows.copyDialog.close();
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                            });
                    }
                },
                view: function (id) {
                    $scope.queryParams = {};
                    $state.go('states.coursePackageManager.view', {packageId: id});
                },
                deleteCourse: function (id) {
                    coursePackageManagerService.hasReference(id).then(function (data) {
                        if (data.status) {
                            if (data.info) {
                                $scope.globle.alert('提示', '当前选择删除的课程包已添加选课规则，请先取消选课规则的关联后再删除！');
                            } else {
                                coursePackageManagerService.hasAuthorize(id).then(function (data) {
                                    if (data.status) {
                                        if (data.info) {
                                            $scope.globle.alert('提示', '该资源存在授权记录，不可删除！');
                                        }
                                    }
                                });
                                $scope.globle.confirm('提示', '是否需要删除课程包', function (dialog) {
                                    return coursePackageManagerService.deleteCoursePool(id).then(function (data) {
                                        dialog.doRightClose();
                                        if (data.status) {
                                            $scope.node.coursePackageGrid.pager.page(1);
                                        } else {
                                            $scope.globle.showTip(data.info, 'error');
                                        }
                                    });
                                });
                            }
                        }
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
                    if ($scope.model.typeName == null || $scope.model.typeName == '') {
                        $scope.model.queryParams.categoryId = null;
                    }
                    if ($scope.model.queryParams.createStartTime) {
                        $scope.model.queryParams.createStartTime = $scope.model.queryParams.createStartTime.replace(/-/g, '/');
                    }
                    if ($scope.model.queryParams.createEndTime) {
                        $scope.model.queryParams.createEndTime = $scope.model.queryParams.createEndTime.replace(/-/g, '/');
                    }
                    if ($scope.model.queryParams.createStartTime) {
                        $scope.model.queryParams.createStartTime = $scope.model.queryParams.createStartTime.replace(/\//g, '-');
                    }
                    if ($scope.model.queryParams.createEndTime) {
                        $scope.model.queryParams.createEndTime = $scope.model.queryParams.createEndTime.replace(/\//g, '-');
                    }
                    $scope.node.coursePackageGrid.pager.page(1);
                    e.preventDefault();
                }
            };
            $scope.utils={
                validateIsNull:validateIsNull
            }

            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }
            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td title="#: poolName #">');
                result.push('<a href="javascript:void(0)" ng-if="#: interest #" class="c-lab ng-scope">兴趣包</a>');
                result.push('#: poolName #');
                result.push('</td>');

                result.push ( '<td>' );
                result.push ( '<div title="#: createUnitName #">' );
                result.push ( '#: createUnitName #' );
                result.push ( '</div>' );
                result.push ( '</td>' );

                result.push('<td>');
                result.push('<div  title="#: creator #">');
                result.push('#: creator #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: createTime #">');
                result.push('#: createTime #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: courseCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: totalPeriod #');
                result.push('</td>');

                //是否授权
                result.push('<td>');
                result.push('<span ng-bind="utils.validateIsNull(dataItem.hasAuthorize)===true?\'-\':(dataItem.hasAuthorize?\'已授权\':\'未授权\')"> </span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span' +
                    ' ng-bind="utils.validateIsNull(dataItem.authorizedState)===true?\'-\':(dataItem.authorizedState==1?\'授权使用中\':(dataItem.authorizedState==2?\'已取消授权\':\'-\'))"> ' +
                    '</span>');
                result.push('</td>');
                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn" has-permission="coursePackageManager/view"  ng-click="events.view(\'#: id #\')">详情</button>');
                result.push('<button type="button" class="table-btn" ng-if="flagModel.tabType === \'OWN\'" has-permission="coursePackageManager/copyCoursePool" ng-click="events.copy(dataItem)">复制</button>');
                result.push('<button type="button" class="table-btn" ng-if="flagModel.tabType === \'OWN\'" has-permission="coursePackageManager/save" #: authorizedState==1 || authorizedState==2?\'disabled\':\'\'# ng-click="events.update(dataItem)">修改</button>');
                result.push('<button type="button" class="table-btn" ng-if="flagModel.tabType === \'OWN\'" has-permission="coursePackageManager/delete" #: authorizedState==1 || authorizedState==2?\'disabled\':\'\'# ng-click="events.deleteCourse(\'#: id #\')">删除</button>');
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
                windows: {
                    copyDialogOptions: {
                        modal: true,
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        },
                        close: function () {
                            this.close;
                        }
                    }
                },
                coursePackageGrid: {
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
                                    url: '/web/admin/coursePoolAction/findCoursePoolPage',
                                    data: function (e) {
                                        var temp = {queryParam: {sort: e.sort}, page: {}},
                                            params = $scope.model.queryParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.queryParam[key] = params[key];
                                                }
                                            }
                                        }
                                        if(hbUtil.validateIsNull($scope.model.authorizeQuery)===false){
                                            angular.forEach($scope.model.authorizeQuery,function(value,key){
                                                temp[key] = value;
                                            });

                                        }
                                        $scope.model.page.pageSize = e.pageSize;
                                        temp.page.pageNo = e.page;
                                        temp.page.pageSize = $scope.model.page.pageSize;
                                        delete e.page;
                                        delete e.pageSize;
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
                            {sortable: false, field: 'name', title: '课程包名称'},
                            { sortable: false, field: 'createUnitName', title: "创建单位", width: 100 },
                            {sortable: false, field: 'typeName', title: '创建人', width: 150},
                            {sortable: false, field: 'createTime', title: '创建时间', width: 150},
                            {sortable: false, field: 'studyCount', title: '课程数', width: 80},
                            {sortable: false, field: 'praiseCount', title: '课程包总学时', width: 120},
                            {sortable: false, field: 'hasAuthorize', title: '是否授权', width: 120},
                            {sortable: false, field: 'authorizedState', title: '授权状态', width: 120},
                            {
                                title: '操作', width: 150
                            }
                        ]
                    }
                }
            };
            $scope.ui.coursePackageGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.coursePackageGrid.options);
        }];
});
