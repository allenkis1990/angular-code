define(function () {
    'use strict';
    return ['$scope', 'roleManageService', 'KENDO_UI_GRID', 'kendo.grid', '$state','$rootScope',
        function ($scope, roleManageService, KENDO_UI_GRID, kendoGrid, $state,$rootScope) {
            var utils;
            $scope.model = {
                dimension:1,
                dimensionQuery:{
                    dimension:1
                },
                page: {
                    pageSize: 10,
                    pageNo: 1
                }
            };

            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                lessonGrid: null,
                workBeginTime: null,
                workEndTime: null
            };

            $scope.events = {
                toggleDimension: function (e, dimension) {
                    e.preventDefault();
                    $scope.model.dimension = dimension;
                    $scope.model.dimensionQuery.dimension=dimension;
                    $scope.node.lessonGrid.pager.page(1);
                },
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                searchRole:function(e){
                    $scope.model.page.pageNo = 1;
                    $scope.node.lessonGrid.pager.page(1);
                },
                searchAllRole:function(e){
                    $scope.model.page.pageNo = 1;
                    $scope.node.allRoleGrid.pager.page(1);
                },
                /**
                 * 新增
                 * @param e
                 */
                addRole: function (e) {
                    e.preventDefault();
                    $state.go('states.roleManage.add');
                },

                /**
                 * 修改
                 * @param e
                 * @param dataItem
                 */
                updateRole: function (e, dataItem) {
                    e.preventDefault();
                    $state.go('states.roleManage.edit', {
                        roleId: dataItem.roleId
                    });
                },

                /**
                 * 删除
                 * @param e
                 * @param dataItem
                 */
                deleteRole: function (e, dataItem) {
                    $scope.globle.confirm('提示', '确定删除该角色', function (dialog) {
                        return roleManageService.deleteRole(dataItem.roleId).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                if (data.info.excuteStatus) {
                                    $scope.globle.showTip(data.info.excuteInfo, 'success');
                                } else {
                                    $scope.globle.showTip(data.info.excuteInfo, 'error');
                                }
                                $scope.node.lessonGrid.pager.page(1);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });
                },

                /**
                 * 查看
                 * @param e
                 * @param dataItem
                 */
                view: function (e, dataItem) {
                    e.preventDefault();
                    $state.go('states.roleManage.view', {
                        roleId: dataItem.roleId,
                        type: 1
                    });
                },


                /**
                 * 根据角色查询用户
                 * @param e
                 * @param dataItem
                 */
                searchUser: function (e, dataItem) {
                    e.preventDefault();
                    if($scope.model.dimension==1){
                        $state.go('states.administratorManage', {
                            roleId: dataItem.roleId,
                            type: 1
                        });
                    }else if($scope.model.dimension==2){
                        $state.go('states.administratorManage', {
                            roleId: dataItem.roleId,
                            dimension:2,
                            unitId:$scope.model.dimensionQuery.createUnitId
                        });
                    }

                },

                /**
                 * 查询事件
                 * @param e
                 */
                search: function (e) {
                    if (e.keyCode === 13) {
                        $scope.events.searchLesson(e);
                    }
                },

                /**
                 * 查询
                 */
                searchLesson: function (e) {
                    $scope.model.page.pageNo = 1;
                    if ($scope.model.typeName == null || $scope.model.typeName == '') {
                        $scope.model.administorPageParams.categoryId = null;
                    }
                    if ($scope.model.administorPageParams.courseCreateDateTo) {
                        $scope.model.administorPageParams.courseCreateDateTo = $scope.model.administorPageParams.courseCreateDateTo.replace(/-/g, '/');
                    }
                    if ($scope.model.administorPageParams.courseCreateDateFrom) {
                        $scope.model.administorPageParams.courseCreateDateFrom = $scope.model.administorPageParams.courseCreateDateFrom.replace(/-/g, '/');
                    }
                    if ($scope.model.administorPageParams.courseCreateDateTo) {
                        $scope.model.administorPageParams.courseCreateDateTo = $scope.model.administorPageParams.courseCreateDateTo.replace(/\//g, '-');
                    }
                    if ($scope.model.administorPageParams.courseCreateDateFrom) {
                        $scope.model.administorPageParams.courseCreateDateFrom = $scope.model.administorPageParams.courseCreateDateFrom.replace(/\//g, '-');
                    }
                    $scope.node.lessonGrid.pager.page(1);
                    e.preventDefault();
                },

                /**
                 * 关闭窗口
                 */
                cancelWindow: function (e) {
                    e.preventDefault();
                    $scope.model.checkResetPassword = null;
                    $scope.node.windows.addWindow.close();
                }

            };

            //=============分页开始=======================
            var allGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn"  ng-click="events.searchUser($event,dataItem)">#: userCount #</button>');
                result.push('</td>');

                result.push('<td title="#: unitName #">');
                result.push('#: unitName #');
                result.push('</td>');

                result.push('<td title="#: description==null?\'\':description#">');
                result.push('#: description==null?\'\':description#');
                result.push('</td>');

                result.push('</td>');
                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn"  has-permission="roleManage/query" ng-click="events.view($event,dataItem)">查看</button>');
/*                result.push('<button type="button" class="table-btn" ng-if="model.dimension==1" has-permission="roleManage/edit" ng-click="events.updateRole($event,dataItem)">修改</button>');
                result.push('<button type="button"  class="table-btn" ng-if="model.dimension==1" has-permission="roleManage/deleteRole"  #: status==1?\'disabled\':\'\'#  ng-click="events.deleteRole($event,dataItem)">删除</button>');*/
                result.push('</td>');

                result.push('</tr>');
                allGridRowTemplate = result.join('');
            })();
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn"  ng-click="events.searchUser($event,dataItem)">#: userCount #</button>');
                result.push('</td>');

                result.push('<td title="#: description==null?\'\':description#">');
                result.push('#: description==null?\'\':description#');
                result.push('</td>');

                result.push('</td>');
                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn"  has-permission="roleManage/query" ng-click="events.view($event,dataItem)">查看</button>');
                result.push('<button type="button" class="table-btn" ng-if="model.dimension==1" has-permission="roleManage/edit" ng-click="events.updateRole($event,dataItem)">修改</button>');
                result.push('<button type="button"  class="table-btn" ng-if="model.dimension==1" has-permission="roleManage/deleteRole"  #: status==1?\'disabled\':\'\'#  ng-click="events.deleteRole($event,dataItem)">删除</button>');
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
                allRoleGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(allGridRowTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/administratorManage/findRolesByQuery',
                                    data: function (e) {
                                        var temp = {lessonQueryParams: {sort: e.sort}},
                                            params = $scope.model.administorPageParams;
                                        temp =  $scope.model.dimensionQuery;

                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;
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
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var dataview = response.info, index = 1;
                                        angular.forEach(dataview, function (item) {
                                            item.index = index++;
                                        });
                                    }
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
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'name', title: '角色名称'},
                            {sortable: false, field: 'userCount', title: '已添加有效的账号数', width: 180},
                            {sortable: false, field: 'unitName', title: '所属单位',width: 230},
                            {sortable: false, field: 'description', title: '角色说明'},
                            {
                                title: '操作', width: 200
                            }
                        ]
                    }
                },
                lessonGrid: {
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
                                    url: '/web/admin/administratorManage/findRolesByQuery',
                                    data: function (e) {
                                        var temp = {lessonQueryParams: {sort: e.sort}},
                                            params = $scope.model.administorPageParams;
                                        temp =  $scope.model.dimensionQuery;

                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;
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
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var dataview = response.info, index = 1;
                                        angular.forEach(dataview, function (item) {
                                            item.index = index++;
                                        });
                                    }
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
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'name', title: '角色名称'},
                            {sortable: false, field: 'userCount', title: '已添加有效的账号数', width: 180},
                            {sortable: false, field: 'description', title: '角色说明'},
                            {
                                title: '操作', width: 200
                            }
                        ]
                    }
                }
            };
            $scope.ui.lessonGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.lessonGrid.options);

        }];
});
