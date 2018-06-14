define(function () {
    'use strict';
    return ['$scope', 'administratorManageService', 'KENDO_UI_GRID', 'kendo.grid', '$state', 'TabService', '$stateParams','$rootScope',
        function ($scope, administratorManageService, KENDO_UI_GRID, kendoGrid, $state, TabService, $stateParams,$rootScope) {
            var utils;
            $scope.model = {
                delay:false,
                dimension:$stateParams.dimension||1,
                createUnitId:'',
                administorPageParams: {
                    roleId:$stateParams.dimension!=2?$stateParams.roleId:'',
                    dimension:1
                },
                allAdministorPageParams:{
                    roleId:$stateParams.dimension==2?$stateParams.roleId:"",
                    dimension:1
                },
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                roleList: []
            };
            if ($stateParams.dimension) {

              //  $scope.model.dimension = $stateParams.dimension;
                $scope.model.allAdministorPageParams.roleId=$stateParams.roleId;
                $scope.model.allAdministorPageParams.dimension=$stateParams.dimension;
            }

            if ($stateParams.unitId) {
                $scope.model.allAdministorPageParams.createUnitId= $stateParams.unitId;
                $scope.model.createUnitId=$stateParams.unitId;
            }

           $scope.model.delay=true;
            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //== index node
                lessonGrid: null,
                workBeginTime: null,
                workEndTime: null
            };

            $scope.events = {
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                toggleDimension: function (e, dimension) {
                    e.preventDefault();
                    $scope.model.dimension = dimension;
                    if(dimension==1){
                        $scope.model.administorPageParams.dimension=dimension;
                        $scope.node.lessonGrid.pager.page(1);
                    }else{
                        $scope.model.allAdministorPageParams.dimension=dimension;
                        $scope.node.allAdminGrid.pager.page(1);
                    }

                    $scope.events.getAllRole();
                },
                addLesson: function (e) {
                    $scope.administorPageParams = {};
                    e.preventDefault();
                    $state.go('states.administratorManage.add');
                },

                update: function (id) {
                    $state.go('states.administratorManage.edit', {courseId: id});
                },

                deleteCourse: function (id) {
                    $scope.globle.confirm('提示', '是否需要删除课程', function (dialog) {
                        return administratorManageService.deleteCourse(id).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.lessonGrid.pager.page(1);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });
                },

                /**
                 * 获取所有角色
                 * @param dataItem
                 */
                getAllRole: function () {
                    var unitId='';
                    if($scope.model.dimension==2){
                      unitId=$scope.model.allAdministorPageParams.createUnitId;
                    }
                    administratorManageService.getAllRole($scope.model.dimension,unitId).then(function (data) {
                        $scope.model.roleList = data.info;
                    });
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
                    if($scope.model.administorPageParams.createUnitId){
                        $scope.model.delay=true;
                    }
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
                searchAllAdmin: function (e) {
                    $scope.model.page.pageNo = 1;
                    if($scope.model.administorPageParams.createUnitId){
                        $scope.model.delay=true;
                    }
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
                    $scope.node.allAdminGrid.pager.page(1);
                    e.preventDefault();
                },

                /**
                 * 启用
                 * @param e
                 * @param dataItem
                 */
                enableAdministrator: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('启用', '确定要启用该账号？', function (dialog) {
                        return administratorManageService.enable(dataItem.userId).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                dataItem.status = 1;
                                $scope.node.lessonGrid.refresh();
                                $scope.globle.showTip('操作成功', 'success');
                            } else {
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                },

                /**
                 * 重置密码
                 * @param userId
                 */
                resetPassword: function (userId) {
                    $scope.model.resertPassword = '';
                    $scope.model.administratorId = userId;
                    $scope.node.windows.resetWindow.center().open();
                },

                /**
                 * 关闭窗口
                 */
                cancelWindow: function (e) {
                    e.preventDefault();
                    $scope.model.checkResetPassword = null;
                    $scope.node.windows.resetWindow.close();
                },

                /**
                 * 重置密码-执行
                 * @param e
                 */
                resetPasswordExcute: function (e, adminAccountFormValid) {
                    if (adminAccountFormValid) {
                        administratorManageService.resetPassword($scope.model.administratorId, $scope.model.resertPassword).then(function (data) {
                            if (data.status && data.info) {
                                $scope.globle.showTip('重置密码成功！', 'success');

                                $scope.events.cancelWindow(e);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    }

                    e.preventDefault(e);
                },

                /**
                 * 禁用
                 * @param e
                 * @param dataItem
                 */
                suspendAdministrator: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('停用', '确定要停用该账号？', function (dialog) {
                        return administratorManageService.suspend(dataItem.userId)
                            .then(function (response) {
                                dialog.doRightClose();
                                if (response.status) {
                                    dataItem.status = 2;
                                    $scope.node.lessonGrid.refresh();
                                    $scope.globle.showTip('操作成功', 'success');
                                } else {
                                    $scope.globle.showTip(response.info, 'error');
                                }
                            });
                    });
                },

                /**
                 * 编辑
                 * @param e
                 * @param dataItem
                 */
                updateAdministrator: function (e, dataItem) {
                    e.preventDefault();
                    $state.go('states.administratorManage.edit', {
                        administratorId: dataItem.userId
                    });
                },

                /**
                 * 详情
                 * @param e
                 * @param dataItem
                 */
                view: function (e, dataItem) {
                    e.preventDefault();
                    $state.go('states.administratorManage.view', {
                        administratorId: dataItem.userId
                    });
                },

                /**
                 * 删除
                 * @param e
                 * @param dataItem
                 */
                remove: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('删除', '确定要删除该账号？', function (dialog) {
                        return administratorManageService.remove(dataItem.userId).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                var size = $scope.node.lessonGrid.dataSource.view().length;
                                if (size == 1 && $scope.model.page.pageNo != 1) {
                                    $scope.model.page.pageNo = $scope.model.page.pageNo - 1;
                                    $scope.node.lessonGrid.pager.page($scope.model.page.pageNo);
                                } else {
                                    $scope.node.lessonGrid.dataSource.read();
                                }
                            } else {
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                }
            };

            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td  title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td title="#: loginInput #">');
                result.push('#: loginInput #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: roleName #');
                result.push('</td>');

                /* result.push ( '<td>' );
                 result.push ( '#: unitName #' );
                 result.push ( '</td>' );*/

                result.push('<td>');
                result.push('#:status==1?\'启用\':\'禁用\'#');
                result.push('</td>');

                result.push('</td>');
                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn" has-permission="administratorManage/detail" ng-click="events.view($event,dataItem)">详情</button>');
                result.push('<button type="button" class="table-btn" has-permission="administratorManage/edit" ng-click="events.updateAdministrator($event,dataItem)">修改</button>');
                result.push('<button type="button" class="table-btn" has-permission="administratorManage/resetPassword" ng-click="events.resetPassword(\'#: userId #\')">重置密码</button>');
                result.push('<button type="button"  class="table-btn" #: status==1?\'disabled\':\'\'#  has-permission="administratorManage/enabled" ng-click="events.enableAdministrator($event,dataItem)">启用</button>');
                result.push('<button type="button"  class="table-btn" #: status==2?\'disabled\':\'\'#  has-permission="administratorManage/disabled" ng-click="events.suspendAdministrator($event,dataItem)">禁用</button>');
                //  result.push('<button type="button" class="table-btn" #: status==1?\'disabled\':\'\'#  ng-click="events.remove($event,dataItem)">删除</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            var allGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td  title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td title="#: loginInput #">');
                result.push('#: loginInput #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: roleName #');
                result.push('</td>');


                result.push ( '<td>' );
                 result.push ( '#: unitName #' );
                 result.push ( '</td>' );

                result.push('<td>');
                result.push('#:status==1?\'启用\':\'禁用\'#');
                result.push('</td>');

                result.push('</td>');
                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn" has-permission="administratorManage/detail" ng-click="events.view($event,dataItem)">详情</button>');
                result.push('<button type="button" class="table-btn" has-permission="administratorManage/edit" ng-click="events.updateAdministrator($event,dataItem)">修改</button>');
                result.push('<button type="button" class="table-btn" has-permission="administratorManage/resetPassword" ng-click="events.resetPassword(\'#: userId #\')">重置密码</button>');
                result.push('<button type="button"  class="table-btn" #: status==1?\'disabled\':\'\'#  has-permission="administratorManage/enabled" ng-click="events.enableAdministrator($event,dataItem)">启用</button>');
                result.push('<button type="button"  class="table-btn" #: status==2?\'disabled\':\'\'#  has-permission="administratorManage/disabled" ng-click="events.suspendAdministrator($event,dataItem)">禁用</button>');
                //  result.push('<button type="button" class="table-btn" #: status==1?\'disabled\':\'\'#  ng-click="events.remove($event,dataItem)">删除</button>');
                result.push('</td>');

                result.push('</tr>');
                allGridRowTemplate = result.join('');
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
                    addWindow: {//添加窗口
                        modal: true,
                        content: '@systemUrl@/views/administratorManage/resetPassword.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                },

                allAdminGrid: {
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
                                    url: '/web/admin/administratorManage/findByQuery',
                                    data: function (e) {
                                        var temp = {lessonQueryParams: {sort: e.sort}},
                                            params = $scope.model.administorPageParams;
                                        //for (var key in params) {
                                        //    if (params.hasOwnProperty(key)) {
                                        //        if (params[key]) {
                                        //            temp.lessonQueryParams[key] = params[key];
                                        //        }
                                        //    }
                                        //}
                                        temp =$scope.model.dimension==1? $scope.model.administorPageParams:$scope.model.allAdministorPageParams;

                                        if (temp.status == undefined || temp.status == '' || temp.status == null) {
                                            temp.status = 0;
                                        }

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
                            //change: function (e) {
                            //    $scope.model.page.pageNo = parseInt(e.index, 10);
                            //    //== !!important!! 这里重复了page(1)的作用
                            //    // $scope.node.lessonGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'typeName', title: '姓名', width: 320},
                            {sortable: false, field: 'name', title: '管理员账号'},
                            {sortable: false, field: 'period', title: '所属角色', width: 300},
                            { sortable: false, field: "teacherName", title: "所属单位", width: 230 },
                            {sortable: true, field: 'studyCount', title: '启用状态', width: 100},
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
                                    url: '/web/admin/administratorManage/findByQuery',
                                    data: function (e) {
                                        var temp = {lessonQueryParams: {sort: e.sort}},
                                            params = $scope.model.administorPageParams;
                                        //for (var key in params) {
                                        //    if (params.hasOwnProperty(key)) {
                                        //        if (params[key]) {
                                        //            temp.lessonQueryParams[key] = params[key];
                                        //        }
                                        //    }
                                        //}
                                        temp =$scope.model.dimension==1? $scope.model.administorPageParams:$scope.model.allAdministorPageParams;

                                        if (temp.status == undefined || temp.status == '' || temp.status == null) {
                                            temp.status = 0;
                                        }

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
                            //change: function (e) {
                            //    $scope.model.page.pageNo = parseInt(e.index, 10);
                            //    //== !!important!! 这里重复了page(1)的作用
                            //    // $scope.node.lessonGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'typeName', title: '姓名', width: 320},
                            {sortable: false, field: 'name', title: '管理员账号'},
                            {sortable: false, field: 'period', title: '所属角色', width: 300},
                            /* { sortable: false, field: "teacherName", title: "单位名称", width: 230 },*/
                            {sortable: true, field: 'studyCount', title: '启用状态', width: 100},
                            {
                                title: '操作', width: 200
                            }
                        ]
                    }
                }
            };
            $scope.ui.lessonGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.lessonGrid.options);

            //初始化时加载角色列表
            $scope.events.getAllRole();
        }];
});
