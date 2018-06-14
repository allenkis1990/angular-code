define(function () {
    'use strict';
    return ['$scope', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'global', '$state', 'traningOrganizationManagerService',
        function ($scope, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, global,$state, traningOrganizationManagerService) {

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
                regionName:'',
                regionShow:false,
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
                 /*   loginInput: undefined,*/
                    name: null,
                    region:null,
                    status: 0
               /*     regionName:''*/
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
                }


            };

            var viewModel = kendo.observable({
                userIdList: []
            });
            kendo.bind($('input'), viewModel);

            //监听区域点击事件
            var monitorClick = '';
            $scope.events = {
                add: function (e) {
                    $scope.selectParam = {};
                    e.preventDefault();
                    $state.go('states.traningOrganizationManager.add');
                },
                findManagerInfo:function(e,dataItem){
                    $state.go('states.administratorManage', {
                            unitId:dataItem.unitId,
                            dimension:2,
                            unitName:dataItem.name
                    });
                },


                openSuspends: function () {
                    if (localDB.selectedIdArray.length <= 0) {
                        $scope.globle.showTip('请选择要暂停的用户！', 'info');
                        return;
                    }

                    $scope.globle.confirm('批量停用', '确定要停用这些帐号？', function (dialog) {
                        return traningOrganizationManagerService.suspends(localDB.selectedIdArray).then(function (data) {
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
                        return traningOrganizationManagerService.enables(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            $scope.model.adminAccountList = data.info;
                            $scope.model.totalSize = data.totalSize;
                            $scope.node.gridInstance.dataSource.read();
                        });
                    });
                },
                openEnableOrSuspend: function (ids, value) {
                    var messeg='';
                    if(value=='停用'){
                       messeg='确认停用该培训机构吗？确认停用后该培训机构将无法开展培训，同时对应的管理员将不可登录平台';
                    }else{
                      messeg='确认启用该培训机构吗？确认启用后将恢复该培训机构开展培训能力并启用管理员帐号。'
                    }
                    $scope.globle.confirm(value, messeg, function (dialog) {
                        if ($('#button_' + ids).html() == '停用') {
                                return traningOrganizationManagerService.suspend(ids).then(function (data) {
                                    dialog.doRightClose();
                                    if (data.status) {
                                        $scope.node.lessonGrid.dataSource.read();
                                    } else {
                                        $scope.globle.showTip(data.info, 'error');
                                    }

                                });
                        } else {
                               return traningOrganizationManagerService.enable(ids).then(function (data) {
                                 dialog.doRightClose();
                                 $scope.node.lessonGrid.dataSource.read();
                                 });
                        }
                    });
                },
                openFire: function (ids) {
                    $scope.globle.confirm('注销', '确定要注销该帐号？', function (dialog) {
                        $scope.model.userId = ids;
                        return traningOrganizationManagerService.fire(ids).then(function (data) {
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
                        return traningOrganizationManagerService.fires(localDB.selectedIdArray)
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
                openReset: function (ids) {
                    $scope.globle.confirm('重置密码', '重置后的密码为：000000？', function (dialog) {
                        return traningOrganizationManagerService.reset(ids).then(function (data) {
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
                    traningOrganizationManagerService.save($scope.model.adminAccount).then(function (data) {
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

                    traningOrganizationManagerService.update($scope.model.adminAccount).then(function (data) {
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
                    e.preventDefault();
                   /* $scope.model.selectParam.pageNo = 1;*/
                    var data = $scope.model.selectParam;
                    $scope.node.lessonGrid.pager.page(1);
          /*          $scope.node.lessonGrid.dataSource.read();*/

                },
                openRegionTree: function () {
                    $scope.model.regionShow = !$scope.model.regionShow;
                },


                getRegionInfo: function (dataItem) {
                    traningOrganizationManagerService.findRegionByParentId(dataItem.id).then(function (data) {
                        if (data.info.length==0) {
                            $scope.model.selectParam.region=dataItem.id;
                            $scope.model.regionName=dataItem.name;
                            $scope.model.regionShow = false;
                        }
                    });
                }
            };
            $scope.model.selectItems = [];
             //课程分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '340000',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/trainingOrganizationManager/findRegionByParentId?id=' + id,
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


            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td title="#: name?name:\'-\' #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: region #');
                result.push('</td>');



                result.push('<td>');
                result.push('#: code #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: platformName #');
                result.push('</td>');

                result.push('<td title="#: domain?domain:\'-\' #">');
                result.push('#: domain #');
                result.push('<br/>');
                result.push( '<a copy-man-two class="txt-b mt10"  data-clipboard-text="#: domain #">复制域名</a>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: status==1?\'启用\':\'停用\'#');
                result.push('</td>');

                result.push('<td>');
                result.push('#: managerInfo #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn" has-permission="trainingOrgnization/detail" ng-click="events.findManagerInfo($event,dataItem)">机构管理员</button>');
                result.push('<button id="button_#: unitId #" class="table-btn"has-permission="trainingOrgnization/enable" has-permission="trainingOrgnization/suspend" ng-click="events.openEnableOrSuspend(\'#: unitId #\', \'#: status==2?\'启用\':\'停用\'#\')">#: status==2?\'启用\':\'停用\'#</button>');
                result.push('<input id="status" type="hidden" value="#: status #" />');
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
                                    url: '/web/admin/trainingOrganizationManager/findTraningOrganizationsByQuery',
                                    data: function (e) {
                                        var temp = {param: {sort: e.sort}}
                                         var   params = $scope.model.selectParam;
                                        console.log($scope.model.selectParam);
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.param[key] = params[key];
                                                }
                                            }
                                        }
                                        /*temp = $scope.model.administorPageParams;

                                        if (temp.status == undefined || temp.status == '' || temp.status == null) {
                                            temp.status = 0;
                                        }
*/
                                      temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.selectParam.pageSize
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
                            }
                       /*     serverPaging: true, //远程获取书籍
                            serverSorting: true //远程排序字段*/
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
                            {field: 'name', title: '培训机构名称',width: 140 },
                            {field: 'region', title: '所在地区',width: 140},
                            {field: 'code', title: '机构代码/统一社会信用代码', width: 140},
                            {field: 'platformName', title: '门户名称', width: 160},
                            {field: 'domain', title: '域名', width: 200},
                            {field: 'state', title: '机构状态', width: 80},
                            {field: 'manager', title: '超级管理员信息', width: 100},
                            {field: 'createTime', title: '创建时间', width: 90},
                            {
                                title: '操作', width: 100
                            }
                        ]
                    }
                },



                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                }
            };
            $scope.ui.lessonGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.lessonGrid.options);
        }];
});
