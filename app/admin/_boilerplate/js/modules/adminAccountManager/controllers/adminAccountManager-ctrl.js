define(function () {
    'use strict';
    return ['$scope', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'global', 'adminAccountManagerService',
        function ($scope, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, global, adminAccountManagerService) {

            var localDB, $node, utils, uiTemplate;

            localDB = {
                // 已选的管理员ID, 批量操作提交服务端使用
                selectedIdArray: [],
                // 已选的管理员状态, 刷新批量按钮使用
                selectedStatusArray: {}
            };

            angular.extend($scope, {
                emailValidate: {
                    type: 2,
                    userId: null
                }
            });

            $scope.model = {
                // 批量启用、停用、注销
                batchEnable: true,
                batchSuspend: true,
                batchFire: true,

                typeid: '',
                adminAccount: {
                    /*
                     loginInput: '',
                     name: '',
                     email: '',
                     unit: '',
                     organization: ''*/
                },
                adminUpdateData: {},
                selectParam: {
                    /*page: {
                     pageNo: 1,
                     pageSize: 10

                     }*/
                    pageNo: 1,
                    pageSize: 10,

                    loginInput: undefined,
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
                //selectUnitOrDept: null
            };

            utils = {

                close: function (isSave) {
                    //还原表单状态
                    if (isSave) {
                        //$scope.adminAccountForm.$setPristine();
                        $scope.node.windows.addWindow.close();
                    } else {
                        //$scope.updateAdminAccountForm.$setPristine();
                        $scope.node.windows.updateWindow.close();
                    }
                },

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
                        /*switch (status) {
                         case 1 : $scope.model.batchSuspend  = $scope.model.batchFire = false; break; // 出现<正常>状态的, <批量启用>、<批量离职>不可用
                         case 2 : $scope.model.batchSuspend = false; break;                        // 出现<停用>状态的, <批量停用>不可用
                         case 3 : $scope.model.batchEnable = $scope.model.batchSuspend = false; break; // 出现<离职>状态的, <批量启用>、<批量离职>不可用
                         }*/
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

            //监听区域点击事件
            var monitorClick = '';
            $scope.events = {
                add: function (userId) {
                    $scope.model.adminAccount = {
                        loginInput: '',
                        name: '',
                        email: '',
                        unit: '',
                        organization: ''
                    };
                    $scope.node.windows.addWindow.center().open();
                },
                query: function (userId) {
                    adminAccountManagerService.query(userId).then(function (data) {
                        //console.log(data.info);
                        $scope.model.adminAccount = data.info;
                        $scope.emailValidate.userId = data.info.userId;
                        $scope.model.adminAccount.parentName = data.info.manageType == 2 ? data.info.organization : data.info.unit;
                        $scope.model.adminAccount.managerObjectId = data.info.manageType == 2 ? data.info.organizationId : data.info.unitId;
                        $scope.model.adminAccount.typeid = $scope.model.adminAccount.manageType;

                        $scope.node.windows.updateWindow.center().open();
                    });
                },
                cancelUpdate: function (e) {
                    $scope.model.adminAccount;
                    e.preventDefault();
                    utils.close(false);
                },
                cancel: function (e) {
                    e.preventDefault();
                    utils.close(true);
                },
                openSuspends: function () {
                    if (localDB.selectedIdArray.length <= 0) {
                        $scope.globle.showTip('请选择要暂停的用户！', 'info');
                        return;
                    }

                    $scope.globle.confirm('批量停用', '确定要停用这些帐号？', function (dialog) {
                        return adminAccountManagerService.suspends(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            $scope.node.gridInstance.dataSource.read();
                        });

                    });
                },
                openEnables: function () {
                    if (localDB.selectedIdArray.length <= 0) {
                        $scope.globle.showTip('请选择要启用的用户！', 'info');
                        return;
                    }
                    $scope.globle.confirm('批量启用', '确定要启用这些帐号？', function (dialog) {
                        return adminAccountManagerService.enables(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            $scope.model.adminAccountList = data.info;
                            $scope.model.totalSize = data.totalSize;
                            $scope.node.gridInstance.dataSource.read();
                        });
                    });
                },
                openEnableOrSuspend: function (ids, value) {
                    $scope.globle.confirm(value, '确定要' + value + '该帐号？', function (dialog) {
                        if ($('#button_' + ids).html() == '停用') {
                            return adminAccountManagerService.suspend(ids).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    $scope.node.gridInstance.dataSource.read();
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }

                            });
                        } else {
                            return adminAccountManagerService.enable(ids).then(function (data) {
                                dialog.doRightClose();
                                $scope.node.gridInstance.dataSource.read();
                            });
                        }
                    });
                },
                openFire: function (ids) {
                    $scope.globle.confirm('注销', '确定要注销该帐号？', function (dialog) {
                        $scope.model.userId = ids;
                        return adminAccountManagerService.fire(ids).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.gridInstance.dataSource.read();
                            } else {
                                $scope.globle.showTip('注销失败！', 'error');
                            }
                        });
                    });
                },
                openFires: function () {
                    if (localDB.selectedIdArray.length <= 0) {
                        $scope.globle.showTip('请选择要注销用户！', 'info');
                        return;
                    }
                    $scope.globle.confirm('注销', '确定要注销该帐号？', function (dialog) {
                        return adminAccountManagerService.fires(localDB.selectedIdArray)
                            .then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    $scope.node.gridInstance.dataSource.read();
                                } else {
                                    $scope.globle.showTip('批量注销失败！', 'error');
                                }
                            });
                    });
                },
                openDelete: function (ids) {
                    $scope.globle.confirm('注销', '确定要注销该帐号？', function (dialog) {
                        $scope.model.userId = ids;
                        return adminAccountManagerService.deleteAdminAccount(ids).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                var size = $scope.node.gridInstance.dataSource.view().length;
                                if (size == 1 && $scope.model.selectParam.pageNo != 1) {
                                    $scope.model.selectParam.pageNo = $scope.model.selectParam.pageNo - 1;
                                    $scope.node.gridInstance.pager.page($scope.model.selectParam.pageNo);
                                } else {
                                    $scope.node.gridInstance.dataSource.read();
                                }
                            } else {
                                $scope.globle.showTip('注销失败！', 'error');
                            }
                        });
                    });
                },
                openReset: function (ids) {
                    $scope.globle.confirm('重置密码', '重置后的密码为：000000？', function (dialog) {
                        return adminAccountManagerService.reset(ids).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.globle.showTip('重置密码成功！', 'success');
                            } else {
                                $scope.globle.showTip('重置密码失败！', 'error');
                            }
                            $scope.node.gridInstance.dataSource.read();
                        });
                    });
                },
                saveAdminAccount: function (e) {
                    e.preventDefault(e);
                    //console.log('editNew form validation result: ' + $scope.adminAccountForm.$valid);
                    //console.log($scope.model.adminAccount);
                    //if ($scope.adminAccountForm.$valid){
                    adminAccountManagerService.save($scope.model.adminAccount).then(function (data) {
                        if (data.status) {
                            $scope.globle.showTip('添加管理员帐号成功！', 'success');

                            $scope.node.gridInstance.dataSource.read();
                            utils.close(true);
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
                    //}
                    //adminAccountManagerService.save($scope.model.adminAccount, $scope.model.typeid);
                },
                update: function (e) {
                    e.preventDefault(e);
                    if ($scope.model.adminAccount.confirmPassword != $scope.model.adminAccount.password) {
                        $scope.globle.showTip('两次密码不一样！', 'warning');
                        return;
                    }

                    adminAccountManagerService.update($scope.model.adminAccount).then(function (data) {
                        if (data.status) {
                            $scope.globle.showTip('更新管理员帐号成功！', 'success');

                            $scope.node.gridInstance.dataSource.read();
                            utils.close(false);
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                        }

                    });
                    //}
                },

                openTree: function (e) {

                    //e.preventDefault();

                    //$scope.libraryTreeShow = !$scope.libraryTreeShow;
                    e.stopPropagation();
                    $scope.libraryTreeShow = true;

                    //$scope.libraryTreeShow =
                    //monitorClick = b;
                },
                closeTree: function (e) {
                    //e.preventDefault();
                    e.stopPropagation();
                    //if (monitorClick == a) {
                    //if ($scope.libraryTreeShow) {
                    $scope.libraryTreeShow = false;
                    //}
                    //}
                    // monitorClick = a;
                },
                getOrgInfo: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.model.adminAccount.parentName = dataItem.name;
                    //$scope.model.library.parentId = dataItem.id;
                    //$scope.libraryTreeShow = false;
                    $scope.libraryTreeShow = false;
                    $scope.model.adminAccount.managerObjectId = dataItem.id;//节点的id
                    $scope.model.adminAccount.typeid = dataItem.type;//节点的类型 1--单位，2--部门
                },
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
                            localDB.selectedIdArray.push(row.userId);
                            localDB.selectedStatusArray[row.userId] = row.status;
                            localDB.arrstatus.push(row.status);
                            //console.log('状态：' + row.status);
                        }
                    }
                    //console.log('状态1：' + localDB.selectedStatusArray);
                    utils.refreshBatchButton();
                    //console.log('-----已选ID是: ', localDB.selectedIdArray);

                },
                checkBoxCheck: function (e, dataItem) {

                    var userId = dataItem.userId;
                    if (e.currentTarget.checked) {
                        localDB.selectedIdArray.push(userId);
                        localDB.selectedStatusArray[userId] = dataItem.status;
                    } else {
                        var index = _.indexOf(localDB.selectedIdArray, userId);
                        if (index !== -1) {
                            localDB.selectedIdArray.splice(index, 1);
                        }
                        delete localDB.selectedStatusArray[userId];
                    }

                    utils.refreshBatchButton();
                    //console.log('-----已选ID是: ', localDB.selectedIdArray);
                    /*console.log(dataItem);
                     kendoGrid.checkBoxCheck($scope, e, dataItem);*/
                },
                search: function () {
                    var name = $('#name').val();
                    grid.data($scope.ui.grid.options).dataSource.filter([
                        {field: 'name', value: name}
                    ]);
                },

                // 跳转到指定的页数
                toPageIndex: function () {
                    //console.log($scope.node.gridInstance);
                    if ($scope.model.toPage) {
                        $scope.node.gridInstance.dataSource.page($scope.model.toPage);
                    }
                },
                selectPage: function (e) {
                    //var data = $scope.model.selectParam;
                    e.preventDefault();
                    $scope.model.selectParam.pageNo = 1;
                    var data = $scope.model.selectParam;
                    $scope.node.gridInstance.pager.page(1);
                    $scope.node.gridInstance.dataSource.read();
                    //$scope.node.gridInstance.dataSource.fetch();

                },
                skip: function () {
                    //console.log("ssss");
                    $scope.globle.stateGo('states.newAdminAccount', '新增账号');
                }
            };

            $scope.model.selectItems = [];

            //adminAccountManagerService.getAdminAccountList($scope.model.selectParam).then(function (data) {
            //    //console.log(data.info);
            //    $scope.model.adminAccountList = data.info;
            //    $scope.model.totalSize = data.totalSize;
            //});

            //单位和部门树
            //=================单位和部门树开始=============================
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
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

            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input ng-checked="selected" ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox" id="check_#: userId #"  class="k-checkbox"/>');
                result.push('<label class="k-checkbox-label" for="check_#: userId #"></label>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: loginAccount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: email #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: unit #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: organization #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: status==3?\'注销\':(status==1?\'启用\':\'停用\')#');
                result.push('</td>');

                result.push('<td>');
                result.push('<button has-permission="adminAccountManager/edit" ng-click="events.query(\'#: userId #\')" class="table-btn" #: dataType==2?\'disabled\':\'\'#>编辑</button>');
                result.push('<button has-permission="adminAccountManager/resetPassword" ng-click="events.openReset(\'#: userId #\')" class="table-btn" #: dataType==2?\'disabled\':\'\'#>重置密码</button>');
                /*result.push ('<button kendo-button ng-click="events.edit($event, dataItem)" ng-show="#: status # == 2" class="k-primary">启用</button>');
                 result.push ('<button kendo-button ng-click="events.edit($event, dataItem)" ng-show="#: status # == 1" class="k-primary">停用</button>');*/
                result.push('<button has-permission="adminAccountManager/start" has-permission="adminAccountManager/suspend" id="button_#: userId #" class="table-btn" ng-click="events.openEnableOrSuspend(\'#: userId #\', \'#: status==2?\'启用\':\'停用\'#\')" #: dataType==2?\'disabled\':\'\'#>#: status==2?\'启用\':\'停用\'#</button>');
                result.push('<input id="status" type="hidden" value="#: status #" />');
                result.push('<button has-permission="adminAccountManager/remove" ng-click="events.openDelete(\'#: userId #\')"  class="table-btn" #: status==2?\'\':\'disabled\'#>注销</button>');
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
                        content: '@systemUrl@/views/adminAccountManager/createAdminAccount.html',
                        visible: false,
                        width: 50,
                        height: 120,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    updateWindow: {//修改窗口
                        modal: true,
                        content: '@systemUrl@/views/adminAccountManager/updateAdminAccount.html',
                        visible: false,
                        width: 50,
                        height: 100,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                },
                grid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {

                            transport: {
                                /*parameterMap: function(options, type) {
                                 console.log(options);
                                 return options;
                                 },
                                 parameterMap: function (data, type) {
                                 var sortStr = '';
                                 if (type == "read") {
                                 if (data.sort) {
                                 var str = [];
                                 angular.forEach(data.sort, function (item, index) {
                                 str.push(item.field + ' ' + item.dir);
                                 });
                                 sortStr = str.join(',');
                                 }
                                 return {
                                 "page.pageSize": data.pageSize,
                                 "page.pageNo": data.page,
                                 "selectParam.loginInput":$scope.model.selectParam.loginInput,
                                 "selectParam.name": $scope.model.selectParam.name,
                                 "selectParam.email": $scope.model.selectParam.email,
                                 "selectParam.status": $scope.model.selectParam.status
                                 }
                                 }
                                 },*/
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/adminAccountAction/findByQuery',
                                    data: function () {
                                        //console.log($scope.model.selectParam);
                                        var temp = {}, params = $scope.model.selectParam;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                }
                                            }
                                        }
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
                                    /*var status = $scope.model.selectParam.status;
                                     switch (status) {
                                     case 0: $scope.model.unlimitCount = response.totalSize; break;
                                     case 1: $scope.model.enableCount = response.totalSize; break;
                                     case 2: $scope.model.suspendCount = response.totalSize; break;
                                     case 3: $scope.model.fireCount = response.totalSize; break;
                                     default: alert('error status query param: ' + status);
                                     }*/
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    $scope.selected = false;
                                    localDB.selectedIdArray = [];

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
                            buttonCount: 10,
                            change: function (e) {
                                $scope.model.selectParam.pageNo = parseInt(e.index, 10);
                                $scope.node.gridInstance.dataSource.read();
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: '<input ng-checked=\'selected\' id=\'selectAlll\' class=\'k-checkbox\' ng-click=\'events.selectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'selectAlll\'></label>',
                                filterable: false, width: 60
                            },
                            {field: 'loginAccount', title: '账号'},
                            {field: 'name', title: '持有人姓名', width: 110},
                            {field: 'email', title: '邮箱号', width: 180},
                            {field: 'unit', title: '管理单位', width: 180},
                            {field: 'organization', title: '管理部门', width: 170},
                            {field: 'status', title: '状态', width: 60},
                            {
                                title: '操作', width: 180
                            }
                        ]
                    }
                },

                window: {
                    addEmployeeWindow: {
                        options: {
                            title: false,
                            modal: true,
                            visible: false
                        }
                    }
                }
            };

            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);

            $scope.ui.tree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.tree.options);
        }];
});
