define(function () {
    'use strict';
    return [
        '$scope',
        'KENDO_UI_GRID',
        'KENDO_UI_TREE',
        'kendo.grid',
        'global',
        'teacherAccountManageService',
        function ($scope, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, global, teacherAccountManageService) {
            var localDB, $node, ButtonUtils, uiTemplate;
            localDB = {
                // 已选的管理员ID, 批量操作提交服务端使用
                selectedIdArray: [],
                // 已选的管理员状态, 刷新批量按钮使用
                selectedStatusArray: {}
            };
            $scope.showDisabled = false;
            $scope.model = {
                // 批量启用、停用、注销
                batchEnable: true,
                batchSuspend: true,
                batchFire: true,
                typeid: '',
                teacherInfo: {
                    /*
                     account: '',
                     name: '',
                     email: '',
                     unit: '',
                     organization: ''*/
                },
                adminUpdateData: {},
                queryParam: {
                    /*page: {
                     pageNo: 1,
                     pageSize: 10

                     }*/
                    //分页信息
                    pageNo: 1,
                    pageSize: 10,
                    //查询条件
                    account: undefined,
                    name: null,
                    email: undefined,
                    status: 0
                },
                userId: '',
                userIdList: []
            };

            $scope.regexps = global.regexps;

            $scope.node = {
                gridInstance: null
            };

            ButtonUtils = {

                //刷新按钮样式（可点或不可点）
                refreshBatchButton: function () {
                    var selectedIdArray = localDB.selectedIdArray,
                        selectedStatusArray = localDB.selectedStatusArray,
                        size = selectedIdArray.length;

                    var i = 0, j = 0, k = 0;
                    angular.forEach(selectedStatusArray, function (status, key) {
                        if (status == '1') {
                            i++;
                        }
                        if (status == '2') {
                            j++;
                        }
                        if (status == '3') {
                            k++;
                        }
                    });
                    if (i > 0 && j > 0 && k > 0) {
                        $scope.model.batchEnable = $scope.model.batchSuspend = $scope.model.batchFire = false;
                    } else if (i > 0 && j > 0) {
                        $scope.model.batchEnable = false;
                        $scope.model.batchSuspend = $scope.model.batchFire = false;
                    } else if (i > 0 && k > 0) {
                        $scope.model.batchEnable = $scope.model.batchSuspend = $scope.model.batchFire = false;
                    } else if (j > 0 && k > 0) {
                        $scope.model.batchEnable = $scope.model.batchSuspend = $scope.model.batchFire = false;
                    } else if (i > 0) {
                        $scope.model.batchSuspend = true;
                        $scope.model.batchEnable = $scope.model.batchFire = false;
                    } else if (j > 0) {
                        $scope.model.batchSuspend = false;
                        $scope.model.batchEnable = $scope.model.batchFire = true;
                    } else if (k > 0) {
                        $scope.model.batchEnable = false;
                        $scope.model.batchSuspend = $scope.model.batchFire = false;
                    }

                    // 已选的数量为0, 等价于取消全选; 数量为当前展示的页面量, 等价于全选
                    if (size === 0) {
                        $scope.selected = false;
                        $scope.model.batchEnable = $scope.model.batchSuspend = $scope.model.batchFire = true;
                    } else if (size === $scope.node.gridInstance.dataSource.view().length) {
                        $scope.selected = true;
                    }
                }
            };
            var viewModel = kendo.observable({
                userIdList: []
            });
            kendo.bind($('input'), viewModel);

            $scope.events = {
                //打开新增窗口
                openAdd: function (userId) {
                    $scope.showDisabled = false;
                    //新增时远程校验账号的参数
                    $scope.validateAccountParams = {
                        loginType: '1'
                    };
                    //新增时远程校验邮箱的参数
                    $scope.validateEmailParams = {
                        userId: ''
                    };
                    //教师信息模型初始化
                    $scope.model.teacherInfo = {
                        account: '',
                        name: '',
                        email: '',
                        unitId: ''
                    };
                    $scope.node.windows.addWindow.center().open();
                },
                //打开编辑窗口
                openEdit: function (id, userId, account, name, email, orgId, orgName, unitId, unitName, typeId) {
                    $scope.showDisabled = false;
                    //修改时远程校验邮箱的参数
                    $scope.validateEmailParams = {
                        userId: userId
                    };

                    //教师信息模型初始化和与修改界面相关控件双向绑定
                    teacherAccountManageService.queryByUserId(id).then(function (data) {
                        if (data.status) {
                            //教师信息模型初始化和与修改界面相关控件双向绑定
                            $scope.model.teacherInfo = {
                                id: id,
                                userId: userId,
                                account: account,
                                name: name,
                                email: email,
                                unitName: data.info.unitName,
                                unitId: unitId,
                                typeId: typeId
                            };
                            $scope.node.windows.editWindow.center().open();
                        } else {
                            $scope.globle.alert('提示', '获取教师数据失败！');
                        }
                    });

                },
                //关闭修改窗口
                closeEditWindow: function () {
                    $scope.model.teacherInfo;
                    $scope.libraryTreeShow = false;
                    $scope.node.windows.editWindow.close();
                },
                //关闭新增窗口
                closeAddWindow: function () {
                    $scope.model.teacherInfo;
                    $scope.libraryTreeShow = false;
                    $scope.node.windows.addWindow.close();
                },
                //批量停用
                openSuspends: function () {
                    if (localDB.selectedIdArray.length <= 0) {
                        $scope.globle.showTip('请选择要暂停的用户！', 'error');
                        return;
                    }
                    $scope.globle.confirm('提示', '确定停用所选帐号？', function (dialog) {
                        return teacherAccountManageService.suspends(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                localDB.selectedIdArray = [];
                                ButtonUtils.refreshBatchButton();
                                $scope.node.gridInstance.dataSource.read();
                                $scope.globle.showTip('操作成功！', 'success');
                            } else {
                                $scope.globle.showTip('批量停用账号失败！', 'error');
                            }
                        });

                    });
                },

                //批量启用
                openEnables: function () {
                    if (localDB.selectedIdArray.length <= 0) {
                        $scope.globle.showTip('请选择要启用的用户！', 'error');
                        return;
                    }
                    $scope.globle.confirm('提示', '确定启用所选帐号？', function (dialog) {
                        return teacherAccountManageService.enables(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                localDB.selectedIdArray = [];
                                ButtonUtils.refreshBatchButton();
                                //$scope.model.TeacherList = data.info;
                                //$scope.model.totalSize = data.totalSize;
                                $scope.node.gridInstance.dataSource.read();
                                $scope.globle.showTip('操作成功！', 'success');
                            } else {
                                $scope.globle.showTip('批量启用账号失败！', 'error');
                            }

                        });
                    });
                },

                //单个停用或启用
                openEnableOrSuspend: function (ids, value) {
                    $scope.globle.confirm('提示', '确定' + value + '该帐号？', function (dialog) {
                        if ($('#button_' + ids).html() == '停用') {
                            return teacherAccountManageService.suspend(ids).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    $('#button_' + ids).html('启用');
                                    $('#text_' + ids).html('<span id="text_' + ids + '">启用</span>');
                                    $scope.node.gridInstance.dataSource.read();
                                    $scope.globle.showTip('操作成功！', 'success');
                                } else {
                                    $scope.globle.showTip('账号停用失败！', 'error');
                                }
                            });
                        } else {
                            return teacherAccountManageService.enable(ids).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    $('#button_' + ids).html('停用');
                                    $('#text_' + ids).html('<span id="text_' + ids + '">停用</span>');
                                    $scope.node.gridInstance.dataSource.read();
                                    $scope.globle.showTip('操作成功！', 'success');
                                } else {
                                    $scope.globle.showTip('账号启用失败！', 'error');
                                }
                            });
                        }
                    });
                },
                //注销一个账号
                openFire: function (ids) {
                    $scope.globle.confirm('提示', '确定注销该帐号？', function (dialog) {
                        $scope.model.userId = ids;
                        return teacherAccountManageService.fire(ids).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.globle.showTip('操作成功！', 'success');
                                var size = $scope.node.gridInstance.dataSource.view().length;
                                if (size == 1 && $scope.model.queryParam.pageNo != 1) {
                                    $scope.model.queryParam.pageNo = $scope.model.queryParam.pageNo - 1;
                                    $scope.node.gridInstance.pager.page($scope.model.queryParam.pageNo);
                                } else {
                                    $scope.node.gridInstance.dataSource.read();
                                }
                            } else {
                                $scope.globle.showTip('账号注销失败！', 'error');
                            }
                        });
                    });
                },
                //批量注销账号
                openFires: function () {
                    if (localDB.selectedIdArray.length <= 0) {
                        $scope.globle.showTip('请选择要注销用户！', 'error');
                        return;
                    }
                    $scope.globle.confirm('提示', '确定注销所选帐号？', function (dialog) {
                        return teacherAccountManageService.fires(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                localDB.selectedIdArray = [];
                                ButtonUtils.refreshBatchButton();
                                $scope.node.gridInstance.dataSource.read();
                                $scope.globle.showTip('操作成功！', 'success');
                            } else {
                                $scope.globle.showTip('批量注销账号失败！', 'error');
                            }
                        });
                    });
                },

                //重置密码
                openReset: function (ids) {
                    $scope.globle.confirm('提示', '确定重置该账户的密码？重置后的密码为：teacher', function (dialog) {
                        return teacherAccountManageService.reset(ids).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.gridInstance.dataSource.read();
                                $scope.globle.showTip('操作成功！', 'success');
                            } else {
                                $scope.globle.showTip('重置密码失败！', 'error');
                            }
                        });
                    });
                },

                //保存新增
                saveAdd: function (e) {
                    //防止事件冒泡
                    e.preventDefault(e);
                    //防止用户多次提交表单
                    $scope.showDisabled = true;
                    $('#submitBtn').attr('class', 'btn btn-g');
                    teacherAccountManageService.save($scope.model.teacherInfo).then(function (data) {
                        if (data.status) {
                            //$scope.globle.showTip('添加教师帐号成功！','success');
                            $scope.node.windows.addWindow.close();
                            $scope.globle.showTip('添加成功！', 'success');
                            $scope.node.gridInstance.dataSource.read();
                        } else {
                            $scope.globle.alert('提示', '添加失败！');
                            //如果添加失败，则将提交按钮样式还原，用户可以再次提交
                            $scope.showDisabled = false;
                        }
                    });
                },
                //保存修改
                saveEdit: function () {
                    $scope.showDisabled = true;
                    teacherAccountManageService.update($scope.model.teacherInfo).then(function (data) {
                        if (data.status) {
                            //$scope.globle.showTip('更新教师帐号成功！', 'success');
                            $scope.node.windows.editWindow.close();
                            $scope.node.gridInstance.dataSource.read();
                            $scope.globle.showTip('操作成功！', 'success');
                        } else {
                            //如果修改失败，则将提交按钮样式还原，用户可以再次提交
                            $scope.showDisabled = false;
                            $scope.globle.alert('提示', '修改教师账号信息失败！');
                        }

                    });
                },
                //打开组织机构的树
                openTree: function (e) {
                    e.stopPropagation();
                    $scope.libraryTreeShow = true;
                },
                //选择组织机构
                selectUnitOrOrg: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.model.teacherInfo.unitName = dataItem.name;
                    $scope.libraryTreeShow = false;
                    $scope.model.teacherInfo.unitId = dataItem.id;//节点的id
                    $scope.model.teacherInfo.typeId = dataItem.type;//节点的类型 1--单位，2--部门
                },
                //关闭组织机构树
                closeTree: function (e) {
                    e.stopPropagation();
                    $scope.libraryTreeShow = false;
                },

                //全选
                selectAll: function (e) {
                    // 重置表格已选的ID, 已选的状态
                    localDB.selectedIdArray = [];
                    localDB.selectedStatusArray = {};
                    localDB.arrstatus = [];

                    // 全选
                    if (e.currentTarget.checked) {
                        var viewData = $scope.node.gridInstance.dataSource.view(),
                            size = viewData.length, row;
                        for (var i = 0; i < size; i++) {
                            row = viewData[i];
                            // 缓存本地
                            localDB.selectedIdArray.push(row.id);
                            localDB.selectedStatusArray[row.id] = row.status;
                            localDB.arrstatus.push(row.status);
                        }
                    }
                    ButtonUtils.refreshBatchButton();
                },

                //单击每行的复选框执行的事件
                checkBoxCheck: function (e, dataItem) {
                    var id = dataItem.id;
                    if (e.currentTarget.checked) {
                        localDB.selectedIdArray.push(id);
                        localDB.selectedStatusArray[id] = dataItem.status;
                    } else {
                        var index = _.indexOf(localDB.selectedIdArray, id);
                        if (index !== -1) {
                            localDB.selectedIdArray.splice(index, 1);
                        }
                        delete localDB.selectedStatusArray[id];
                    }

                    ButtonUtils.refreshBatchButton();
                },

                // 跳转到指定的页数
                toPageIndex: function () {
                    if ($scope.model.toPage) {
                        $scope.node.gridInstance.dataSource.page($scope.model.toPage);
                    }
                },

                //条件查询时在条件输入框回车提交查询
                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.selectPage();
                    }
                },
                //按条件查询
                selectPage: function () {
                    //var data = $scope.model.queryParam;
                    //e.preventDefault();
                    $scope.model.queryParam.pageNo = 1;
                    var data = $scope.model.queryParam;
                    $scope.node.gridInstance.pager.page(1);
                    //$scope.node.gridInstance.dataSource.read();
                    //$scope.node.gridInstance.dataSource.fetch();
                    localDB.selectedIdArray = [];
                    ButtonUtils.refreshBatchButton();

                }
            };

            $scope.model.selectItems = [];

            //单位树
            //=================单位和部门树开始=============================
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            ///web/admin/organization/findUnitByParentId.action?parentId=" + id + "&nodeType="+ type,
                            url: '/web/admin/organization/findUnitTree.action?parentId=' + id + '&nodeType=' + type + '&needOrg=false',
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);
                            },
                            error: function (result) {
                                // notify the data source that the request failed
                                options.error(result);
                            }
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id',
                        hasChildren: 'hasChildren'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });

            //=======================单位和部门树结束=======================

            $scope.windowOptions = {
                modal: true,
                visible: false,
                title: false,
                resizable: false,
                draggable: false,
                open: function () {
                    this.center();
                }
            };

            //定义每一行的数据模板
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                //result.push ('<td>');
                //result.push ('<input ng-checked="selected" ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox" id="check_#: id #"  class="k-checkbox"/>');
                //result.push ('<label class="k-checkbox-label" for="check_#: id #"></label>');
                //result.push ('</td>');

                result.push('<td>');
                result.push('#: account #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: email #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: unitName #');
                result.push('</td>');

                /*result.push ('<td>');
                 result.push ('#: organizationName #');
                 result.push ('</td>');*/

                result.push('<td>');
                result.push('#: status==3?\'注销\':(status==1?\'启用\':\'停用\')#');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" has-permission="teacherAccountManage/edit" class="table-btn" ng-click="events.openEdit(\'#: id #\',\'#: userId #\',\'#: account #\',\'#: name #\',\'#: email #\',\'#: organizationId #\',\'#: organizationName #\',\'#: unitId #\',\'#: unitName #\',\'#: typeId #\')" class="k-primary">编辑</button>');
                result.push('<button type="button" has-permission="teacherAccountManage/resetPassword" class="table-btn" ng-click="events.openReset(\'#: userId #\')">重置密码</button>');
                /*result.push ('<button kendo-button ng-click="events.edit($event, dataItem)" ng-show="#: status # == 2" class="k-primary">启用</button>');
                 result.push ('<button kendo-button ng-click="events.edit($event, dataItem)" ng-show="#: status # == 1" class="k-primary">停用</button>');*/
                result.push('<button type="button" has-permission="teacherAccountManage/start" has-permission="teacherAccountManage/suspend" id="button_#: id #" class="table-btn" ng-click="events.openEnableOrSuspend(\'#: id #\', \'#: status==2?\'启用\':\'停用\'#\')" #: status==3?\'disabled\':\'\'#>#: status==2?\'启用\':\'停用\'#</button>');
                result.push('<input  id="status" type="hidden" class="table-btn" value="#: status #" />');
                result.push('<button type="button" has-permission="teacherAccountManage/remove" class="table-btn" ng-click="events.openFire(\'#: id #\')"  #: status==2?\'\':\'disabled\'#>注销</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            $scope.ui = {

                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                },

                windows: {
                    addWindow: {//添加窗口
                        modal: true,
                        content: '@systemUrl@/views/teacherAccountManage/addInfo.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    editWindow: {//修改窗口
                        modal: true,
                        content: '@systemUrl@/views/teacherAccountManage/editInfo.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                },
                grid: {
                    options: {
                        /*toolbar:[],*/
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        noRecords: {
                            template: '暂无数据！'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/teacher/findByQuery',
                                    data: function (e) {
                                        var temp = {}, params = $scope.model.queryParam;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.pageNo = e.page;
                                        $scope.model.queryParam.pageNo = temp.pageNo;
                                        temp.pageSize = $scope.model.queryParam.pageSize;
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
                                    return response;
                                },
                                total: function (response) {
                                    // 绑定数据所有总共多少条;
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    return response.info;
                                } // 指定数据源
                            },
                            serverPaging: true
                        },
                        selectable: true,
                        scrollable: false,
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            //{
                            //  title: "<input ng-checked='selected' id='selectAll' class='k-checkbox' ng-click='events.selectAll($event)' type='checkbox'/><label class='k-checkbox-label' for='selectAll'></label>",
                            //  filterable: false, width: 60
                            //},
                            {field: 'account', title: '账号'},
                            {field: 'name', title: '持有人姓名'},
                            {field: 'email', title: '邮箱'},
                            {field: 'unitName', title: '所在单位'},
                            /*{field: "organizationName", title: "管理部门"},*/
                            {field: 'status', title: '状态'},
                            {
                                title: '操作'
                            }
                        ]
                    }
                }
            };

            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);

            $scope.ui.tree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.tree.options);

        }];
});
