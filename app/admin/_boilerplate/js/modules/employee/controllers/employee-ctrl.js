define(function () {
    'use strict';
    return ['$scope', 'global', 'employeeService', 'kendo.grid',
        function ($scope, global, employeeService, kendoGrid) {

            // define local variable and util function
            var localDB, $node, utils, uiTemplate;

            // define data-binding variable
            angular.extend($scope, {
                regexps: global.regexps,    // validation regexp while validating form or define yourself
                ui: {},                     // Kendo component options config
                model: {},                  // data model
                node: {},                   // node for kendo component
                event: {},                  // intercept ui event
                // 异步校验需要的额外参数
                editIdentifyCode: {
                    type: 1,
                    userId: null
                },
                editEmail: {
                    type: 2,
                    userId: null
                },
                editPhone: {
                    type: 3,
                    userId: null
                }
            });

            localDB = {
                isEditNewFormDirty: false,
                isEditFormDitry: false,

                // 已选的员工ID, 批量操作提交服务端使用
                selectedIdArray: [],
                // 已选的员工状态, 刷新批量按钮使用
                selectedStatusArray: {}
            };
            $scope.model = {
                // 批量启用、停用、离职、重置密码
                batchEnable: false,
                batchSuspend: false,
                batchFire: false,
                batchReset: false,

                unlimitCount: 0,
                enableCount: 0,
                suspendCount: 0,
                fireCount: 0,

                noSubmitIncrease: true,
                noSubmitModification: true,

                // 员工分页参数
                employeePageParams: {
                    pageNo: 1,
                    pageSize: 10,

                    nickname: undefined,
                    phoneNumber: undefined,
                    identifyCode: undefined,
                    email: undefined,
                    unitId: undefined,
                    unitName: null,
                    organizationId: null,
                    jobId: null,
                    workBeginDate: undefined,
                    workEndDate: undefined,
                    status: 0
                },
                indexJobParams: {
                    viewName: null
                },
                indexUnitParams: {
                    parentId: null,
                    viewName: null,
                    name: null
                },
                indexOrgParams: {
                    unitId: null,
                    parentId: null,
                    viewName: null,
                    name: null
                },
                newUnitParams: {
                    parentId: null,
                    viewName: null,
                    name: null
                },
                newOrgParams: {
                    unitId: null,
                    parentId: null,
                    viewName: null,
                    name: null
                },
                newJobParams: {
                    name: null,
                    viewName: null
                },
                newJobGradeParams: {
                    jobId: null,
                    viewName: null,
                    name: null
                },
                editUnitParams: {
                    parentId: null,
                    viewName: null,
                    name: null
                },
                editOrgParams: {
                    unitId: null,
                    parentId: null,
                    viewName: null,
                    name: null
                },
                editJobParams: {
                    name: null,
                    viewName: null
                },
                editJobViewName: null,
                editJobGradeParams: {
                    jobId: null,
                    viewName: null,
                    name: null
                },

                // 员工新增
                editNew: {
                    userId: null,
                    unitId: null,
                    organizationId: null,
                    unit: null,
                    organization: null,
                    jobId: null,
                    jobGradeId: null,
                    job: null,
                    jobGrade: null,
                    name: null,
                    identifyCode: null,
                    phoneNumber: null,
                    email: null,
                    workDate: null,
                    sex: 1,
                    education: 1,
                    status: 1
                },
                // 员工编辑
                edit: {},
                // 查看
                view: {}
            };

            //== Nodes -----------------------------
            /**
             * $node: 辅助的节点对象, 通常为jquery对象. 如<code>popup</code>的<code>anchor</code>属性值
             *
             * @type {{indexUnitInput: *, indexOrganizationInput: *}}
             */
            $node = {
                indexJobInput: angular.element('#index_job_input'),
                indexUnitInput: angular.element('#index_unit_input'),
                indexOrgInput: angular.element('#index_org_input'),

                newJobInput: angular.element('#new_job_input'),
                newJobGradeInput: angular.element('#new_job_grade_input'),
                newUnitInput: angular.element('#new_unit_input'),
                newOrgInput: angular.element('#new_org_input'),

                editJobInput: angular.element('#edit_job_input'),
                editJobGradeInput: angular.element('#edit_job_grade_input'),
                editUnitInput: angular.element('#edit_unit_input'),
                editOrgInput: angular.element('#edit_org_input')
            };
            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //== index node
                employeeGrid: null,
                workBeginTime: null,
                workEndTime: null,
                indexJobPopup: null,
                indexUnitPopup: null,
                indexOrgPopup: null,
                indexJobTree: null,
                indexUnitTree: null,
                indexOrgTree: null,

                //== create form node
                newWorkDate: null,
                newJobPopup: null,
                newJobGradePopup: null,
                newUnitPopup: null,
                newOrgPopup: null,
                newJobTree: null,
                newJobGradeTree: null,
                newUnitTree: null,
                newOrgTree: null,

                //== edit form node
                editWorkDate: null,
                editJobPopup: null,
                editJobGradePopup: null,
                editUnitPopup: null,
                editOrgPopup: null,
                editJobTree: null,
                editJobGradeTree: null,
                editUnitTree: null,
                editOrgTree: null,

                viewEmployeeWindow: null
            };

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
                },

                refreshBatchButton: function () {
                    var selectedIdArray = localDB.selectedIdArray,
                        selectedStatusArray = localDB.selectedStatusArray,
                        size = selectedIdArray.length;

                    //angular.forEach(selectedStatusArray, function(status, key) {
                    //    switch (status) {
                    //        // 出现<正常>/<离职>状态的, <批量启用>、<批量离职>不可用
                    //        case 1 :
                    //        case 3 : {
                    //            $scope.model.batchEnable = $scope.model.batchFire = false;
                    //            $scope.model.batchSuspend = true;
                    //        }; break;
                    //
                    //        // 出现<停用>状态的, <批量停用>不可用
                    //        case 2 : {
                    //            $scope.model.batchSuspend  = false;
                    //            $scope.model.batchEnable = $scope.model.batchFire = true;
                    //        }; break;
                    //    }
                    //});

                    // 已选的数量为0, 等价于取消全选; 数量为当前展示的页面量, 等价于全选
                    if (size === 0) {
                        $scope.selected = $scope.model.batchReset = false;
                    } else if (size === $scope.node.employeeGrid.dataSource.view().length) {
                        $scope.selected = true;
                    } else if (size > 0) {
                        $scope.model.batchReset = true;
                    }
                },

                refreshLocalDataStatus: function (status) {
                    var viewData = $scope.node.employeeGrid.dataSource.view(),
                        selectedIdArray = localDB.selectedIdArray,
                        pageSize = viewData.length,
                        selectedCount = selectedIdArray.length,
                        i, selectedId, k, rowId;

                    if (pageSize && selectedCount) {
                        for (i = 0; i < selectedCount; i++) {
                            selectedId = selectedIdArray[i];

                            for (k = 0; k < pageSize; k++) {
                                rowId = viewData[k].userId;
                                if (selectedId === rowId) {
                                    viewData[k].status = status;
                                }
                            }
                        }
                        // 刷新表格, 重置本地已选的数据、刷新按钮样式
                        $scope.node.employeeGrid.refresh();
                        localDB.selectedIdArray = [];
                        localDB.selectedStatusArray = {};

                        this.refreshBatchButton();
                    }
                },

                // 当前时间格式化为yyyy-MM-dd
                formatNow: function () {
                    var current = new Date(),
                        month = current.getMonth() + 1,
                        date = current.getDate();
                    if (month < 10) {
                        month = '0' + month;
                    }
                    if (date < 10) {
                        date = '0' + date;
                    }
                    return current.getFullYear() + '-' + month + '-' + date;
                },

                // yyyy-MM-dd hh:mm:ss 格式成 yyyy-MM-dd
                timeCloseDay: function (datetime) {
                    var date = datetime.split(' ');
                    return date.length ? date[0] : null;
                },

                /**
                 * 初始化添加的组件
                 */
                initialEditNewFormWidget: function () {
                    localDB.isEditNewFormDirty = true;

                    // popups
                    $scope.ui.popup.newUnit = {
                        anchor: '#new_unit_input'
                    };
                    $scope.ui.popup.newOrg = {
                        anchor: '#new_org_input'
                    };
                    $scope.ui.popup.newJob = {
                        anchor: '#new_job_input'
                    };
                    $scope.ui.popup.newJobGrade = {
                        anchor: '#new_job_grade_input'
                    };

                    //== 清除组件操作的历史记录
                    if ($scope.ui.treeView.newUnit) {
                        // 重置查询条件
                        $scope.model.newUnitParams.parentId = $scope.model.newUnitParams.name = null;
                        $scope.node.newUnitTree.dataSource.read();
                    }
                    if ($scope.ui.treeView.newOrg) {
                        // 重置查询条件
                        $scope.model.newOrgParams.unitId = $scope.model.newOrgParams.parentId = $scope.model.newOrgParams.name = null;
                        $scope.node.newOrgTree.dataSource.read();
                    }
                    if ($scope.ui.treeView.newJob) {
                        // 重置查询条件
                        $scope.model.newJobParams.name = null;
                        $scope.node.newJobTree.dataSource.read();
                    }
                    if ($scope.ui.treeView.newJobGrade) {
                        // 重置查询条件
                        $scope.model.newJobGradeParams.jobId = $scope.model.newJobGradeParams.name = null;
                        $scope.node.newJobGradeTree.dataSource.read();
                    }

                    //== trees
                    // 单位树
                    $scope.ui.treeView.newUnit = {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/web/admin/employee/listUnit',
                                    // url: '/admin/datas/employee/unit.json',
                                    data: function () {
                                        var temp = {}, params = $scope.model.newUnitParams;
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
                            schema: {
                                data: function (response) {
                                    return response.info;
                                },
                                model: {
                                    hasChildren: 'hasChildren'
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = $scope.node.newUnitTree.dataItem(e.node);

                            //if (node.name !== $scope.model.newUnitParams.viewName) {
                            // 组织机构的显示名称为空
                            $scope.model.newOrgParams.viewName = null;
                            // 新增学员model的所属单位名称、当前单位树表单的显示名称
                            $scope.model.editNew.unit = $scope.model.newUnitParams.viewName = node.name;
                            // 新增学员model的所属单位ID、当前组织机构的查询条件单位ID
                            $scope.model.editNew.unitId = $scope.model.newOrgParams.unitId = node.unitId;
                            // 当前组织机构的父ID
                            $scope.model.newOrgParams.parentId = null;

                            $scope.addEmployeeForm.unitId.$setValidity('required', true);

                            $scope.$apply();
                            // 刷新组织机构树
                            $scope.node.newOrgTree.dataSource.read();
                            //}

                            $scope.node.newUnitPopup.close();
                        },
                        expand: function (e) {
                            var node = $scope.node.newUnitTree.dataItem(e.node);
                            $scope.model.newUnitParams.name = null;
                            $scope.model.newUnitParams.parentId = node.unitId;
                        }
                    };

                    // 组织机构树
                    $scope.ui.treeView.newOrg = {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/web/admin/employee/listOrg',
                                    data: function () {
                                        var temp = {}, params = $scope.model.newOrgParams;
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
                            schema: {
                                data: function (response) {
                                    return response.info;
                                },
                                model: {
                                    hasChildren: 'hasChildren'
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = $scope.node.newOrgTree.dataItem(e.node);
                            // if (node.name !== $scope.model.newOrgParams.viewName) {
                            // 设置单位树的显示名称
                            $scope.model.newOrgParams.viewName = $scope.model.editNew.organization = node.name;
                            $scope.model.editNew.organizationId = node.unitId;
                            $scope.$apply();

                            $scope.addEmployeeForm.organizationId.$setValidity('required', true);
                            // }

                            $scope.node.newOrgPopup.close();
                        },
                        expand: function (e) {
                            var node = $scope.node.newOrgTree.dataItem(e.node);
                            $scope.model.newOrgParams.name = null;
                            $scope.model.newOrgParams.parentId = node.unitId;
                        }
                    };

                    $scope.ui.treeView.newJob = {
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        data.name = $scope.model.newJobParams.name;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/employee/listJob',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                data: function (response) {
                                    return response.info;
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = this.dataItem(e.node);
                            if (node.id !== $scope.model.newJobGradeParams.jobId) {
                                $scope.model.editNew.jobGradeId = null;
                                $scope.model.editNew.jobGrade = $scope.model.newJobGradeParams.viewName = null;

                                $scope.model.editNew.jobId = $scope.model.newJobGradeParams.jobId = node.id;
                                $scope.model.editNew.job = $scope.model.newJobParams.viewName = node.name;
                                $scope.$apply();

                                $scope.node.newJobGradeTree.dataSource.read();
                            }
                            $scope.node.newJobPopup.close();
                        }
                    };

                    $scope.ui.treeView.newJobGrade = {
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        data.jobId = $scope.model.newJobGradeParams.jobId,
                                            data.name = $scope.model.newJobGradeParams.name;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/employee/listJobGrade',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                data: function (response) {
                                    return response.info;
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = this.dataItem(e.node);
                            if (node.name !== $scope.model.newJobGradeParams.viewName) {

                                $scope.model.editNew.jobGrade = $scope.model.newJobGradeParams.viewName = node.name;
                                $scope.model.editNew.jobGradeId = node.id;
                                $scope.$apply();
                            }
                            $scope.node.newJobGradePopup.close();
                        }
                    };
                },

                initialEditFormWidget: function () {
                    if (!localDB.isEditFormDitry) {
                        localDB.isEditFormDitry = true;

                        // popups
                        $scope.ui.popup.editUnit = {
                            anchor: '#edit_unit_input'
                        };
                        $scope.ui.popup.editOrg = {
                            anchor: '#edit_org_input'
                        };
                        $scope.ui.popup.editJob = {
                            anchor: '#edit_job_input'
                        };
                        $scope.ui.popup.editJobGrade = {
                            anchor: '#edit_job_grade_input'
                        };

                        $scope.ui.treeView.editUnit = {
                            dataSource: {
                                transport: {
                                    read: {
                                        url: '/web/admin/employee/listUnit',
                                        data: function () {
                                            var temp = {}, params = $scope.model.editUnitParams;
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
                                schema: {
                                    data: function (response) {
                                        return response.info;
                                    },
                                    model: {
                                        hasChildren: 'hasChildren'
                                    }
                                }
                            },
                            dataTextField: 'name',
                            select: function (e) {
                                var node = $scope.node.editUnitTree.dataItem(e.node);
                                //if (node.name !== $scope.model.editUnitParams.viewName) {
                                // 组织机构的显示名称为空
                                $scope.model.editOrgParams.viewName = null;
                                // 学员修改model的所属单位名称、当前单位树表单的显示名称
                                $scope.model.edit.unit = $scope.model.editUnitParams.viewName = node.name;
                                // 学员修改model的所属单位ID、当前组织机构的查询条件单位ID
                                $scope.model.edit.unitId = $scope.model.editOrgParams.unitId = node.unitId;
                                // 当前组织机构的父ID
                                $scope.model.editOrgParams.parentId = null;

                                $scope.$apply();
                                $scope.editEmployeeForm.unitId.$setValidity('required', true);
                                // 刷新组织机构树
                                $scope.node.editOrgTree.dataSource.read();
                                // }

                                $scope.node.editUnitPopup.close();
                            },
                            expand: function (e) {
                                var node = $scope.node.editUnitTree.dataItem(e.node);
                                $scope.model.editUnitParams.name = null;
                                $scope.model.editUnitParams.parentId = node.unitId;
                            }
                        };
                        $scope.ui.treeView.editOrg = {
                            dataSource: {
                                transport: {
                                    read: {
                                        url: '/web/admin/employee/listOrg',
                                        // url: '/admin/datas/employee/unit.json',
                                        data: function () {
                                            var temp = {}, params = $scope.model.editOrgParams;
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
                                schema: {
                                    data: function (response) {
                                        return response.info;
                                    },
                                    model: {
                                        hasChildren: 'hasChildren'
                                    }
                                }
                            },
                            dataTextField: 'name',
                            select: function (e) {
                                var node = $scope.node.editOrgTree.dataItem(e.node);
                                $scope.model.edit.organization = $scope.model.editOrgParams.viewName = node.name;
                                $scope.model.edit.organizationId = node.unitId;
                                $scope.$apply();
                                $scope.editEmployeeForm.organizationId.$setValidity('required', true);

                                $scope.node.editOrgPopup.close();
                            },
                            expand: function (e) {
                                var node = $scope.node.editOrgTree.dataItem(e.node);
                                // 树展开不带名称条件
                                $scope.model.editOrgParams.name = null;
                                $scope.model.editOrgParams.parentId = node.unitId;
                            }
                        };

                        $scope.ui.treeView.editJob = {
                            dataSource: {
                                transport: {
                                    parameterMap: function (data, type) {
                                        if (type === 'read') {
                                            data.name = $scope.model.editJobParams.name;
                                        }
                                        return data;
                                    },
                                    read: {
                                        url: '/web/admin/employee/listJob',
                                        dataType: 'json'
                                    }
                                },
                                schema: {
                                    data: function (response) {
                                        return response.info;
                                    }
                                }
                            },
                            dataTextField: 'name',
                            select: function (e) {
                                var node = this.dataItem(e.node);
                                if (node.id !== $scope.model.editJobGradeParams.jobId) {
                                    $scope.model.edit.jobGradeId = null;
                                    $scope.model.edit.jobGrade = $scope.model.editJobGradeParams.viewName = null;

                                    $scope.model.edit.jobId = $scope.model.editJobGradeParams.jobId = node.id;
                                    $scope.model.edit.job = $scope.model.editJobParams.viewName = node.name;
                                    $scope.$apply();

                                    $scope.node.editJobGradeTree.dataSource.read();
                                }

                                $scope.node.editJobPopup.close();
                            }
                        };

                        $scope.ui.treeView.editJobGrade = {
                            dataSource: {
                                transport: {
                                    parameterMap: function (data, type) {
                                        if (type === 'read') {
                                            data.jobId = $scope.model.editJobGradeParams.jobId,
                                                data.name = $scope.model.editJobGradeParams.name;
                                        }
                                        return data;
                                    },
                                    read: {
                                        url: '/web/admin/employee/listJobGrade',
                                        dataType: 'json'
                                    }
                                },
                                schema: {
                                    data: function (response) {
                                        return response.info;
                                    }
                                }
                            },
                            dataTextField: 'name',
                            select: function (e) {
                                var node = this.dataItem(e.node);
                                if (node.name !== $scope.model.editJobGradeParams.viewName) {

                                    $scope.model.edit.jobGrade = $scope.model.editJobGradeParams.viewName = node.name;
                                    $scope.model.edit.jobGradeId = node.id;
                                    $scope.$apply();
                                }
                                $scope.node.editJobGradePopup.close();
                            }
                        };
                    } else {
                        $scope.node.editUnitTree.dataSource.read();
                        $scope.node.editOrgTree.dataSource.read();
                        $scope.node.editJobTree.dataSource.read();
                        $scope.node.editJobGradeTree.dataSource.read();
                    }
                },

                closeNewFormWindow: function () {
                    // 重置未填写的样式
                    $scope.addEmployeeForm.$setPristine();
                    $scope.model.newUnitParams.viewName = null;
                    $scope.model.newOrgParams.viewName = null;
                    $scope.model.newJobParams.viewName = null;
                    $scope.model.newJobGradeParams.viewName = null;

                    $scope.model.editNew = {
                        userId: null,
                        unitId: null,
                        organizationId: null,
                        unit: null,
                        organization: null,
                        jobId: null,
                        jobGradeId: null,
                        job: null,
                        jobGrade: null,
                        name: null,
                        identifyCode: null,
                        phoneNumber: null,
                        email: null,
                        workDate: null,
                        sex: 1,
                        education: 1,
                        status: 1
                    };
                    $scope.node.windows.addEmployeeWindow.close();
                },

                closeEditFormWindow: function () {
                    $scope.node.windows.editEmployeeWindow.close();
                }
            };

            // 构建表格的内容模板
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input ng-checked="selected" ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox" id="check_#: userId #"  class="k-checkbox"/>');
                result.push('<label class="k-checkbox-label" for="check_#: userId #"></label>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: identifyCode #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: phoneNumber #');
                result.push('</td>');

                result.push('<td title="#: email #">');
                result.push('#: email #');
                result.push('</td>');

                result.push('<td title="#: unit #">');
                result.push('#: unit #');
                result.push('</td>');

                //result.push ('<td>');
                //result.push ('#: organization #');
                //result.push ('</td>');
                //
                //result.push ('<td>');
                //result.push ('#: job #');
                //result.push ('</td>');

                result.push('<td>');
                result.push('#: status == 3 ? \'注销\' : ( status == 1 ? \'启用\' : \'停用\') #');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button ng-click="events.view($event, dataItem)" class="table-btn">查看</button>');
                result.push('<button has-permission="employee.edit" ng-click="events.edit($event, dataItem)" class="table-btn">修改</button>');
                result.push('<button has-permission="employee.enable" ng-click="events.enable($event, dataItem)" ng-show="#: status # == 2" class="table-btn">启用</button>');
                result.push('<button has-permission="employee.suspend" ng-click="events.suspend($event, dataItem)" ng-show="#: status # == 1" class="table-btn">停用</button>');
                result.push('<button has-permission="employee.fire" ng-click="events.remove($event, dataItem)" ng-disabled="#: status # != 2" class="table-btn">注销</button>');
                result.push('<button has-permission="employee.resetPassword" ng-click="events.resetPassword($event, dataItem)" class="table-btn">重置密码</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            /**
             * 在UI上以angular方式使用组件的组件配置项
             * @type
             */
            $scope.ui = {
                popup: {
                    indexJob: {
                        anchor: '#index_job_input'
                    },
                    indexUnit: {
                        anchor: '#index_unit_input'
                    },
                    indexOrg: {
                        anchor: '#index_org_input'
                    }
                },

                treeView: {
                    indexJob: {
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        data.name = $scope.model.indexJobParams.viewName;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/employee/listJob',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                data: function (response) {
                                    return response.info;
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = this.dataItem(e.node);
                            $scope.model.indexJobParams.viewName = node.name;
                            $scope.model.employeePageParams.jobId = node.id;
                            $scope.$apply();

                            $scope.node.indexJobPopup.close();
                        }
                    },
                    indexUnit: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/web/admin/employee/listUnit',
                                    data: function () {
                                        var temp = {}, params = $scope.model.indexUnitParams;
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
                            schema: {
                                data: function (response) {
                                    return response.info;
                                },
                                model: {
                                    hasChildren: 'hasChildren'
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = $scope.node.indexUnitTree.dataItem(e.node);
                            $scope.model.indexUnitParams.viewName = node.name;
                            $scope.model.employeePageParams.unitId = $scope.model.indexOrgParams.unitId = node.unitId;

                            $scope.$apply();
                            // 刷新组织机构树
                            $scope.node.indexOrgTree.dataSource.read();

                            $scope.node.indexUnitPopup.close();
                        },
                        expand: function (e) {
                            var node = $scope.node.indexUnitTree.dataItem(e.node);
                            // 展开树的时候不带名称查询
                            $scope.model.indexUnitParams.parentId = $scope.model.indexOrgParams.unitId = node.unitId;
                            // 刷新组织机构树
                            $scope.node.indexOrgTree.dataSource.read();
                        }
                    },
                    indexOrg: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/web/admin/employee/listOrg',
                                    // url: '/admin/datas/employee/unit.json',
                                    data: function () {
                                        var temp = {}, params = $scope.model.indexOrgParams;
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
                            schema: {
                                data: function (response) {
                                    return response.info;
                                },
                                model: {
                                    hasChildren: 'hasChildren'
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = $scope.node.indexOrgTree.dataItem(e.node);
                            $scope.model.indexOrgParams.viewName = node.name;
                            $scope.model.employeePageParams.organizationId = node.unitId;
                            $scope.$apply();

                            $scope.node.indexOrgPopup.close();
                        },
                        expand: function (e) {
                            var node = $scope.node.indexOrgTree.dataItem(e.node);
                            $scope.model.indexOrgParams.parentId = node.unitId;
                        }
                    }
                },
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

                employeeGrid: {
                    options: {
                        selectable: true,
                        scrollable: false,
                        pageable: {
                            refresh: true,
                            buttonCount: 10,
                            pageSizes: true,
                            pageSize: 10
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataBinding: function (e) {
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataSource: {
                            serverPaging: true,
                            page: $scope.model.employeePageParams.pageNo,
                            pageSize: $scope.model.employeePageParams.pageSize, // 每页显示的数据数目
                            transport: {
                                read: {
                                    url: '/web/admin/employee/index',
                                    // url: "/admin/datas/employee/employee.json",
                                    data: function () {
                                        var temp = {}, params = $scope.model.employeePageParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                    // 结束时间追加当日最后时间
                                                    if (key === 'workEndDate') {
                                                        temp[key] = $.trim(params[key]) + ' 23:59:59';
                                                    }
                                                }
                                            }
                                        }
                                        return temp;
                                    },
                                    dataType: 'json'
                                }
                            },
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
                                    var status = $scope.model.employeePageParams.status;
                                    switch (status) {
                                        case 0:
                                            $scope.model.unlimitCount = response.totalSize;
                                            break;
                                        case 1:
                                            $scope.model.enableCount = response.totalSize;
                                            break;
                                        case 2:
                                            $scope.model.suspendCount = response.totalSize;
                                            break;
                                        case 3:
                                            $scope.model.fireCount = response.totalSize;
                                            break;
                                        default:
                                            alert('error status query param: ' + status);
                                    }

                                    return response.totalSize;
                                },
                                data: function (response) {
                                    // 重置已选的数据
                                    $scope.selected = false;
                                    localDB.selectedIdArray = [];

                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: '<input ng-checked=\'selected\' class=\'k-checkbox\' id=\'selectAll\' ng-click=\'events.selectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'selectAll\'></label>',
                                filterable: false,
                                width: 60
                            },
                            {field: 'name', title: '学员姓名', width: 100},
                            {field: 'identifyCode', title: '身份证号', width: 150},
                            {field: 'phoneNumber', title: '手机号', width: 100},
                            {field: 'email', title: '邮箱号', width: 150},
                            {field: 'unit', title: '所属单位'},
                            //{field: "organization", title: "所属部门", width: 100},
                            //{field: "job", title: "岗位", width: 100},
                            {field: 'status', title: '状态', width: 80},
                            {title: '操作', width: 190}
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
                    },
                    editEmployeeWindow: {
                        options: {
                            title: false,
                            modal: true,
                            visible: false
                        }
                    }
                }
            };

            $scope.events = {

                //== 管理界面单位树的事件
                //
                //## 展示单位树
                //## 刷新单位树
                //## 监听<down>方向键
                showIndexJob: function () {
                    $scope.node.indexJobPopup.open();
                },
                refreshIndexJob: function () {
                    if (!$scope.model.indexJobParams.viewName) {
                        $scope.model.employeePageParams.jobId = null;
                    }
                    $scope.model.indexJobParams.name = $scope.model.indexUnitParams.viewName;

                    if ($scope.node.indexJobTree) {
                        $scope.node.indexJobTree.dataSource.read();
                    }
                },
                keyUpIndexJob: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.indexJobTree.focus();
                    }
                },

                //== 管理界面单位树的事件
                //
                //## 展示单位树
                //## 刷新单位树
                //## 监听<down>方向键
                showIndexUnit: function () {
                    $scope.node.indexUnitPopup.open();
                },
                refreshIndexUnit: function () {
                    $scope.model.indexUnitParams.parentId = null;
                    $scope.model.indexUnitParams.name = $scope.model.indexUnitParams.viewName;

                    if ($scope.node.indexUnitTree) {
                        $scope.node.indexUnitTree.dataSource.read();
                    }
                },
                keyUpIndexUnit: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.indexUnitTree.focus();
                    }
                },

                //== 管理界面部门树的事件
                //
                //## 展示部门树
                //## 刷新部门树
                //## 监听<down>方向键
                showIndexOrg: function () {
                    $scope.node.indexOrgPopup.open();
                },

                refreshIndexOrg: function () {
                    $scope.model.indexOrgParams.parentId = null;
                    $scope.model.indexOrgParams.name = $scope.model.indexOrgParams.viewName;

                    if ($scope.node.indexOrgTree) {
                        $scope.node.indexOrgTree.dataSource.read();
                    }
                },

                keyUpIndexOrg: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.indexOrgTree.focus();
                    }
                },

                queryByEnter: function (e) {
                    if (e.keyCode == 13) {
                        this.getEmployeePage(e, $scope.model.employeePageParams.status);
                    }
                },

                // 获取员工的分页
                getEmployeePage: function (e, status) {
                    e.preventDefault();

                    var data = $scope.model.employeePageParams;
                    // 页码重置为1、状态赋值
                    data.pageNo = 1;
                    data.status = status;

                    if (data.workBeginDate) {
                        data.workBeginDate = data.workBeginDate.replace(/-/g, '/');
                    }
                    if (data.workEndDate) {
                        data.workEndDate = data.workEndDate.replace(/-/g, '/');
                    }
                    if (!$scope.model.indexUnitParams.viewName) {
                        data.unitId = null;
                    }
                    if (!$scope.model.indexOrgParams.viewName) {
                        data.organizationId = null;
                    }

                    // 设置grid pager的页码时, 会默认向远端请求一次数据, 如果你设置了servePaging为true
                    $scope.node.employeeGrid.pager.page(1);
                    // $scope.node.employeeGrid.dataSource.read();

                    if (data.workBeginDate) {
                        data.workBeginDate = data.workBeginDate.replace(/\//g, '-');
                    }
                    if (data.workEndDate) {
                        data.workEndDate = data.workEndDate.replace(/\//g, '-');
                    }
                },

                selectAll: function (e) {
                    // 重置表格已选的ID, 已选的状态
                    localDB.selectedIdArray = [];
                    localDB.selectedStatusArray = {};

                    // 全选
                    if (e.currentTarget.checked) {
                        var viewData = $scope.node.employeeGrid.dataSource.view(),
                            size = viewData.length, row;
                        for (var i = 0; i < size; i++) {
                            row = viewData[i];
                            // 缓存本地
                            localDB.selectedIdArray.push(row.userId);
                            localDB.selectedStatusArray[row.userId] = row.status;
                        }
                    }
                    utils.refreshBatchButton();
                    // console.log('-----已选ID是: ', localDB.selectedIdArray);
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
                    // console.log('-----已选ID是: ', localDB.selectedIdArray);
                },

                editNew: function (e) {
                    e.preventDefault();
                    $scope.model.editNew.workDate = utils.formatNow();
                    $scope.node.windows.addEmployeeWindow.center().open();

                    utils.initialEditNewFormWidget();
                },

                //== 新增界面单位树的事件
                //
                //## 展示单位树
                //## 刷新单位树
                //## 监听<down>方向键
                showNewUnit: function () {
                    $scope.node.newUnitPopup.open();
                },
                refreshNewUnit: function () {
                    $scope.addEmployeeForm.unitId.$setValidity('required', false);

                    $scope.model.editNew.unitId = $scope.model.editNew.unit = null;

                    $scope.model.newUnitParams.parentId = null;
                    $scope.model.newUnitParams.name = $scope.model.newUnitParams.viewName;

                    if ($scope.node.newUnitTree) {
                        $scope.node.newUnitTree.dataSource.read();
                    }
                },
                keyUpNewUnit: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.newUnitTree.focus();
                    }
                },

                //== 新增界面部门树的事件
                //
                //## 展示部门树
                //## 刷新部门树
                //## 监听<down>方向键
                showNewOrg: function () {
                    $scope.node.newOrgPopup.open();
                },

                refreshNewOrg: function () {
                    $scope.addEmployeeForm.organizationId.$setValidity('required', false);

                    $scope.model.editNew.organizationId = $scope.model.editNew.organization = null;

                    $scope.model.newOrgParams.parentId = null;
                    $scope.model.newOrgParams.name = $scope.model.newOrgParams.viewName;

                    if ($scope.node.newOrgTree) {
                        $scope.node.newOrgTree.dataSource.read();
                    }
                },

                keyUpNewOrg: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.newOrgTree.focus();
                    }
                },

                //== 新增界面岗位树的事件
                //
                //## 展示部门树
                //## 刷新部门树
                //## 监听<down>方向键
                showNewJob: function () {
                    $scope.node.newJobPopup.open();
                },

                refreshNewJob: function () {
                    $scope.model.editNew.jobId = $scope.model.editNew.job = null;
                    $scope.model.newJobParams.name = $scope.model.newJobParams.viewName;

                    $scope.model.editNew.jobGradeId
                        = $scope.model.editNew.jobGrade
                        = $scope.model.newJobGradeParams.viewName
                        = null;

                    if ($scope.node.newJobTree) {
                        $scope.node.newJobTree.dataSource.read();
                    }
                },

                keyUpNewJob: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.newJobTree.focus();
                    }
                },

                //== 新增界面岗位树的事件
                //
                //## 展示部门树
                //## 刷新部门树
                //## 监听<down>方向键
                showNewJobGrade: function () {
                    $scope.node.newJobGradePopup.open();
                },

                refreshNewJobGrade: function () {
                    $scope.model.editNew.jobGradeId = $scope.model.editNew.jobGrade = null;

                    $scope.model.newJobGradeParams.name = $scope.model.newJobGradeParams.viewName;
                    if ($scope.node.newJobGradeTree) {
                        $scope.node.newJobGradeTree.dataSource.read();
                    }
                },

                keyUpNewJobGrade: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.newJobGradeTree.focus();
                    }
                },

                create: function (e) {
                    e.preventDefault(e);
                    var editNew = $scope.model.editNew;
                    if ($scope.model.noSubmitIncrease && $scope.addEmployeeForm.$valid) {
                        $scope.model.noSubmitIncrease = false;

                        employeeService.save(editNew)
                            .then(function (response) {
                                if (response.status) {
                                    //var temp = angular.copy(editNew);
                                    //if (!temp.job) {
                                    //    temp.job = '未设岗位';
                                    //}
                                    //if (!temp.jobGrade) {
                                    //    temp.jobGrade = '未设岗位等级';
                                    //}
                                    //temp.userId = response.info;
                                    //
                                    //$scope.node.employeeGrid.dataSource.insert(0, temp);
                                    //$scope.node.employeeGrid.refresh();

                                    //== 保持当前条件向服务端请求数据
                                    $scope.node.employeeGrid.dataSource.read();

                                    utils.closeNewFormWindow();
                                    $scope.globle.showTip('添加成功', 'success');
                                } else {
                                    $scope.globle.showTip(response.info, 'error');
                                }
                                $scope.model.noSubmitIncrease = true;
                            });
                    }
                },

                closeAddEmployeeWindow: function (e) {
                    e.preventDefault();
                    utils.closeNewFormWindow();
                },

                edit: function (e, dataItem) {
                    e.preventDefault();

                    employeeService.findById(dataItem.userId).then(function (response) {
                        if (response.status) {
                            var edit = $scope.model.edit = response.info;
                            edit.uuid = dataItem.uid;
                            edit.workDate = utils.timeCloseDay(edit.workDate);

                            // 设置异步校验的配置项里的用户ID
                            $scope.editIdentifyCode.userId = $scope.editPhone.userId = $scope.editEmail.userId = edit.userId;

                            $scope.model.editUnitParams.viewName = edit.unit;

                            $scope.model.editOrgParams.unitId = edit.unitId;
                            $scope.model.editOrgParams.viewName = edit.organization;

                            $scope.model.editJobParams.viewName = edit.job;

                            $scope.model.editJobGradeParams.jobId = edit.jobId;
                            $scope.model.editJobGradeParams.viewName = edit.jobGrade;

                            utils.initialEditFormWidget();
                            $scope.node.windows.editEmployeeWindow.center().open();

                        } else {
                            $scope.globle.alert('错误', '加载员工的资料失败!' + response.info);
                        }
                    });
                },

                showEditUnit: function () {
                    $scope.model.edit.unitId = $scope.model.edit.unit = null;

                    $scope.node.editUnitPopup.open();
                },
                refreshEditUnit: function () {
                    $scope.editEmployeeForm.unitId.$setValidity('required', false);

                    $scope.model.editUnitParams.parentId = null;
                    $scope.model.editUnitParams.name = $scope.model.editUnitParams.viewName;

                    if ($scope.node.editUnitTree) {
                        $scope.node.editUnitTree.dataSource.read();
                    }
                },
                keyUpEditUnit: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.editUnitTree.focus();
                    }
                },

                //== 编辑界面部门树的事件
                //
                //## 展示部门树
                //## 刷新部门树
                //## 监听<down>方向键
                showEditOrg: function () {
                    $scope.node.editOrgPopup.open();
                },

                refreshEditOrg: function () {
                    $scope.editEmployeeForm.organizationId.$setValidity('required', false);
                    $scope.model.edit.organizationId = $scope.model.edit.organization = null;

                    $scope.model.editOrgParams.parentId = null;
                    $scope.model.editOrgParams.name = $scope.model.editOrgParams.viewName;

                    if ($scope.node.editOrgTree) {
                        $scope.node.editOrgTree.dataSource.read();
                    }
                },

                keyUpEditOrg: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.editOrgTree.focus();
                    }
                },

                //== 新增界面岗位树的事件
                //
                //## 展示部门树
                //## 刷新部门树
                //## 监听<down>方向键
                showEditJob: function () {
                    $scope.node.editJobPopup.open();
                },

                refreshEditJob: function () {
                    $scope.model.edit.jobId = $scope.model.edit.job = null;
                    $scope.model.editJobGradeParams.name = $scope.model.editJobGradeParams.viewName;

                    $scope.model.edit.jobGradeId
                        = $scope.model.edit.jobGrade
                        = $scope.model.editJobGradeParams.viewName
                        = null;

                    if ($scope.node.editJobTree) {
                        $scope.node.editJobTree.dataSource.read();
                    }
                },

                keyUpEditJob: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.editJobTree.focus();
                    }
                },

                //== 新增界面岗位树的事件
                //
                //## 展示部门树
                //## 刷新部门树
                //## 监听<down>方向键
                showEditJobGrade: function () {
                    $scope.node.editJobGradePopup.open();
                },

                refreshEditJobGrade: function () {
                    $scope.model.edit.jobGradeId = $scope.model.edit.jobGrade = null;

                    $scope.model.editJobGradeParams.name = $scope.model.editJobGradeParams.viewName;

                    if ($scope.node.editJobGradeTree) {
                        $scope.node.editJobGradeTree.dataSource.read();
                    }
                },

                keyUpEditJobGrade: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.editJobGradeTree.focus();
                    }
                },

                update: function (e) {
                    e.preventDefault();
                    var edit = $scope.model.edit;

                    if (!edit.jobId) {
                        edit.job = '未设岗位';
                    }
                    if (!edit.jobGradeId) {
                        edit.jobGrade = '未设岗位等级';
                    }

                    if ($scope.model.noSubmitModification && $scope.editEmployeeForm.$valid) {
                        $scope.model.noSubmitModification = false;

                        employeeService.update(edit)
                            .then(function (response) {
                                if (response.status) {
                                    /** edit.uuid的设值 参考{@link $scope.events.edit()} */
                                        // 获取dataSource当前编辑的数据并以edit更新,
                                    var dataItem = $scope.node.employeeGrid.dataSource.getByUid(edit.uuid);
                                    angular.forEach(edit, function (value, key) {
                                        if (edit.hasOwnProperty(key)) {
                                            dataItem.set(key, edit[key]);
                                        }
                                    });

                                    $scope.node.employeeGrid.refresh();

                                    utils.closeEditFormWindow(true);
                                    $scope.globle.showTip('修改成功', 'success');
                                } else {
                                    $scope.globle.showTip(response.info, 'error');
                                }

                                $scope.model.noSubmitModification = true;
                            });
                    }
                },

                closeEditEmployeeWindow: function (e) {
                    e.preventDefault();
                    utils.closeEditFormWindow();
                },

                view: function (e, dataItem) {
                    e.preventDefault();
                    employeeService.findById(dataItem.userId).then(function (response) {
                        if (response.status) {
                            $scope.model.view = response.info;

                            $scope.node.viewEmployeeWindow.center().open();
                        } else {
                            $scope.globle.alert('错误', '加载员工的资料失败!' + response.info);
                        }
                    });
                    //$scope.model.view = {
                    //    userId: dataItem.userId,
                    //    unitId: dataItem.unitId,
                    //    organizationId: dataItem.organizationId,
                    //    unit: dataItem.unit,
                    //    organization: dataItem.organization,
                    //    jobId: dataItem.jobId,
                    //    jobGradeId: dataItem.jobGradeId,
                    //    job: dataItem.job,
                    //    jobGrade: dataItem.jobGrade,
                    //    name: dataItem.name,
                    //    identifyCode: dataItem.identifyCode,
                    //    phoneNumber: dataItem.phoneNumber,
                    //    email: dataItem.email,
                    //    // 截取年月日
                    //    workDate: dataItem.workDate.split(' ')[0],
                    //    sex: dataItem.sex,
                    //    education: dataItem.education,
                    //    status: dataItem.status
                    //};
                },

                closeViewEmployeeWindow: function (e) {
                    e.preventDefault();
                    $scope.node.viewEmployeeWindow.close();
                    ;
                },

                enable: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('启用', '确定要启用该账号？', function (dialog) {
                        return employeeService.enable(dataItem.userId).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                dataItem.status = 1;
                                $scope.node.employeeGrid.refresh();
                                $scope.globle.showTip('操作成功', 'success');
                            } else {
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                },

                suspend: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('停用', '确定要停用该账号？', function (dialog) {
                        return employeeService.suspend(dataItem.userId).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                dataItem.status = 2;
                                $scope.node.employeeGrid.refresh();
                                $scope.globle.showTip('操作成功', 'success');
                            } else {
                                // alert(response.info);
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                },

                fire: function (e, dataItem) {
                    e.preventDefault();

                    employeeService.fire(dataItem.userId).then(function (response) {
                        if (response.status) {
                            dataItem.status = 3;
                            $scope.node.employeeGrid.refresh();
                        } else {
                            alert(response.info);
                        }
                    });
                },

                remove: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('注销', '确定要注销该账号？', function (dialog) {
                        return employeeService.remove(dataItem.userId).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                var currentPageSize = $scope.node.employeeGrid.dataSource.view().length;
                                // 当前页面数量为1, 则往前翻一页
                                if (currentPageSize === 1) {
                                    var currentPageNo = $scope.node.employeeGrid.dataSource.page();
                                    $scope.node.employeeGrid.dataSource.page(--currentPageNo);
                                } else {
                                    $scope.node.employeeGrid.dataSource.read();
                                }
                                $scope.globle.showTip('操作成功', 'success');
                            } else {
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                },

                resetPassword: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('重置密码', '确定重置密码？重置之后密码为"000000"', function (dialog) {
                        return employeeService.resetPassword(dataItem.userId).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                $scope.globle.showTip('操作成功', 'success');
                            } else {
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                },

                batchEnable: function (e, status) {
                    e.preventDefault();

                    employeeService.batchEnable(localDB.selectedIdArray).then(function (response) {
                        if (response.status) {
                            utils.refreshLocalDataStatus(status);
                            //
                            // dataItem.status = 1;
                            // $scope.node.employeeGrid.refresh();
                        } else {
                            alert(response.info);
                        }
                    });
                },

                batchSuspend: function (e, status) {
                    e.preventDefault();

                    employeeService.batchSuspend(localDB.selectedIdArray).then(function (response) {
                        if (response.status) {
                            utils.refreshLocalDataStatus(status);
                            //
                            // dataItem.status = 1;
                            // $scope.node.employeeGrid.refresh();
                        } else {
                            alert(response.info);
                        }
                    });
                },

                batchFire: function (e, status) {
                    e.preventDefault();

                    employeeService.batchFire(localDB.selectedIdArray).then(function (response) {
                        if (response.status) {
                            utils.refreshLocalDataStatus(status);
                        } else {
                            alert(response.info);
                        }
                    });
                },

                batchResetPassword: function (e) {
                    e.preventDefault();

                    if (!localDB.selectedIdArray.length) {
                        $scope.globle.showTip('请选择用户！', 'warning');
                        return;
                    }

                    $scope.globle.confirm('批量重置密码', '确定批量重置密码？重置之后密码为"000000"', function (dialog) {
                        return employeeService.batchResetPassword(localDB.selectedIdArray).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                $scope.globle.showTip('操作成功', 'success');
                            } else {
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                }
            };

            // 获取正常、停用的数量
            employeeService.getUserQuantity(1).then(function (response) {
                if (response.status) {
                    $scope.model.enableCount = response.info;
                } else {
                    $scope.globle.showTip(response.info, 'error');
                }
            });
            employeeService.getUserQuantity(2).then(function (response) {
                if (response.status) {
                    $scope.model.suspendCount = response.info;
                } else {
                    $scope.globle.showTip(response.info, 'error');
                }
            });
        }
    ];
});

