define(function () {
    'use strict';
    return ['$scope', 'trainClassManageService', '$state', 'kendo.grid', '$stateParams',
        function ($scope, trainClassManageService, $state, kendoGrid, $stateParams) {

            // define local variable and util function
            var editNewRequiredPackage = {
                localDB: {},
                $node: {},
                utils: {},
                uiTemplate: {}
            };

            // define data-binding variable
            angular.extend($scope, {
                ui: {},                     // Kendo component options config
                model: {},                  // data model
                node: {},                   // node for kendo component
                event: {}                   // intercept ui event
            });

            $scope.model = {
                noSubmitIncrease: true,
                save: true,//用于控制人员数据的后台提交
                packageName: null,
                numberCount: 0,     // 所选岗位的总人数
                oldnumberCount: 0,
                blocCount: 0,       // <集团>的课程总数
                selfCount: 0,       // <自建>的课程总数
                subordinateCount: 0,// <子单位>的课程总数
                unitGridParams: {         // 课程分页参数
                    id: 1,
                    name: null,
                    type: 0
                },

                //== 选择学习对象步骤
                studyObjectCursor: 1,   // 1: 学员; 2: 岗位; 3: 组织机构

                // 关于员工块
                oldEmployeeIdList: [],//旧有已经选中的
                oldEmployeeList: [],//旧有已经选中的
                selectedEmployeeIdList: [],   // 已选用户的ID集合
                selectedEmployeeList: [],     // 已选用户集合
                electedEmployeeGridParams: {
                    nickname: null,
                    unitId: null,
                    organizationId: null
                },
                // 关于岗位块
                oldJobIdList: [],//旧有已经选中的
                oldJobList: [],//旧有已经选中的
                selectedJobIdList: [],
                selectedJobList: [],
                electedJobGridParams: {
                    name: null
                },

                // 关于组织机构
                oldUnitIdList: [], // 旧有已经选中的单位ID集合
                oldUnitList: [], // 旧有已经选中的单位ID集合
                selectedUnitIdList: [], // 已选的单位ID集合
                selectedUnitList: [],// 已选的机构单位对象集合
                electedUnitOrgTreeParams: {
                    name: null
                }
            };

            editNewRequiredPackage.$node = {
                lessonTypeTree: $('#lesson_type')
            };

            $scope.node = {
                lessonTypeTree: null,
                lessonGrid: null,
                electedEmployeeGrid: null,
                electedJobGrid: null
            };

            editNewRequiredPackage.uiTemplate = {
                unitGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: higherName #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button ng-if="!dataItem.isChoice"  #: oldData?\'disabled\':\'\'# ng-click="events.chooseUnit($event, dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice"  #: oldData?\'disabled\':\'\'# ng-click="events.removeStudyObjectByGrid($event, 3,dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                },

                electedEmployeeGridRow: function () {
                    var result = [];
                    result.push('<tr>');
                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: job #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button ng-if="!dataItem.isChoice"  #: oldData?\'disabled\':\'\'# ng-click="events.chooseUser($event,dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice"  #: oldData?\'disabled\':\'\'# ng-click="events.removeStudyObjectByGrid($event, 1, dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                },
                electedJobGridRow: function () {
                    var result = [];
                    result.push('<tr>');
                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: number #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button ng-if="!dataItem.isChoice" #: oldData?\'disabled\':\'\'# ng-click="events.chooseJob($event, dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice" #: oldData?\'disabled\':\'\'# ng-click="events.removeStudyObjectByGrid($event, 2, dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                }
            };

            editNewRequiredPackage.utils = {
                /**
                 * 重新计算岗位等级的课程统计信息
                 *
                 * @param cursor 岗位等级的数组索引
                 */
                reCalculateGradeLesson: function () {
                    var lessonList = $scope.model.selectedLessonList;

                    _.forEach(lessonList, function (lesson) {
                        $scope.model.creditCount += lesson.credit;
                    });
                },

                /**
                 * 加载能力项
                 * @param callback
                 */
                loadAbility: function () {
                    requiredPackageService.listAbility().then(function (response) {
                        if (response.status) {
                            if (response.info.length) {
                                $scope.model.abilityCursor = 0;
                                $scope.model.abilityList = response.info;

                                editNewRequiredPackage.utils.initialLessonGrid();
                            }
                        }
                    });
                },

                /**
                 * 初始化课程分类的树
                 */
                initialUnitTree: function () {
                    $scope.ui.electedUnitOrgTree = {
                        dataSource: {
                            transport: {
                                /**
                                 * 对传送到后台的数据进行分装
                                 * @param data
                                 * @param type
                                 * @returns {*}
                                 */
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        angular.extend(data, $scope.model.electedUnitOrgTreeParams);
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/requiredPackage/getUnitOrgList',
                                    // 节点展开时, 默认传递的参数名是id, 参考下面expand的实现
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                /**
                                 * 对返回的数据进行解析
                                 * @param response
                                 * @returns {*}
                                 */
                                parse: function (response) {
                                    if (response.status) {
                                        _.forEach(response.info, function (row) {
                                            row.expanded = false;
                                            row.image = '/admin/images/' + (row.type === '1' ? 'home' : 'dept') + '.png';
                                        });
                                    }
                                    return response;
                                },
                                data: function (response) {
                                    return response.info;
                                },
                                model: {
                                    hasChildren: true
                                }
                            }
                        },
                        dataTextField: 'name',
                        /**
                         * 选中节点的时候触发
                         * @param e
                         */
                        select: function (e) {
                            // refresh lesson grid
                            var dataItem = this.dataItem(e.node);
                            if (dataItem.type == 1) {
                                $scope.model.electedEmployeeGridParams.unitId = dataItem.id;
                                $scope.model.electedEmployeeGridParams.organizationId = null;
                            } else {
                                $scope.model.electedEmployeeGridParams.organizationId = dataItem.id;
                                $scope.model.electedEmployeeGridParams.unitId = null;
                            }

                            $scope.node.electedEmployeeGrid.pager.page(1);
                        },
                        /**
                         * 展开节点的时候触发
                         * @param e
                         */
                        expand: function (e) {
                            $scope.model.electedUnitOrgTreeParams.nodeType = this.dataItem(e.node).type;
                            $scope.model.electedUnitOrgTreeParams.id = this.dataItem(e.node).id;
                        }
                    };
                },
                /**
                 * 1员工类型;2岗位类型;3单位类型
                 * @param studyObjectType
                 * @returns {{selectedStudyObjectIdList: *, selectedStudyObjectList: *, electedKendoNode: *}}
                 */
                getTargetProxy: function (studyObjectType) {
                    var selectedStudyObjectIdList,
                        selectedStudyObjectList,
                        electedKendoNode;

                    //== 员工类型
                    if (studyObjectType === 1) {
                        selectedStudyObjectIdList = $scope.model.selectedEmployeeIdList;
                        selectedStudyObjectList = $scope.model.selectedEmployeeList;
                        electedKendoNode = $scope.node.electedEmployeeGrid;

                        //== 岗位类型
                    } else if (studyObjectType === 2) {
                        selectedStudyObjectIdList = $scope.model.selectedJobIdList;
                        selectedStudyObjectList = $scope.model.selectedJobList;
                        electedKendoNode = $scope.node.electedJobGrid;

                        //== 单位类型
                    } else if (studyObjectType === 3) {
                        selectedStudyObjectIdList = $scope.model.selectedUnitIdList;
                        selectedStudyObjectList = $scope.model.selectedUnitList;
                        electedKendoNode = $scope.node.unitGrid;

                        //== 部门类型
                    } else {
                        $scope.globle.alert('错误', '错误的学习对象类型');
                        return;
                    }

                    return {
                        selectedStudyObjectIdList: selectedStudyObjectIdList,
                        selectedStudyObjectList: selectedStudyObjectList,
                        electedKendoNode: electedKendoNode
                    };
                },
                initialUnitGrid: function () {
                    $scope.ui.unitGrid = {
                        selectable: true,
                        scrollable: false,
                        pageable: {
                            refresh: true,
                            buttonCount: 5
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(editNewRequiredPackage.uiTemplate.unitGridRow()),
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataBinding: function (e) {
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataSource: {
                            serverPaging: true,
                            page: 1,
                            pageSize: 6, // 每页显示的数据数目
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        angular.extend(data, $scope.model.electedUnitOrgTreeParams);
                                        data.pageNo = data.page;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/trainClass/getUnitPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            selectedLessonIdList = $scope.model.selectedUnitIdList,
                                            index = 1;

                                        _.forEach(viewData, function (row) {
                                            row.isChoice = false;
                                            row.index = index++;
                                            if (_.indexOf($scope.model.oldUnitIdList, row.id) != -1) {
                                                row.oldData = true;
                                            }
                                            _.forEach(selectedLessonIdList, function (id) {
                                                if (row.id === id) {
                                                    row.isChoice = true;
                                                }
                                            });
                                        });
                                        // console.log(response.info);
                                        return response;
                                    } else {
                                        $scope.globle.alert('错误', '课程加载失败!');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    // 重置跟分页相关的缓存参数
                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {title: 'No.', width: 60},
                            {field: 'name', title: '单位名称'},
                            {field: 'higherName', title: '上级单位名称'},
                            {title: '操作', width: 120}
                        ]
                    };
                },

                /**
                 * 初始化岗位部门表格
                 */
                initialElectedJobGrid: function () {
                    if (!$scope.ui.electedJobGrid) {
                        $scope.ui.electedJobGrid = {
                            selectable: true,
                            scrollable: false,
                            pageable: {
                                refresh: true,
                                buttonCount: 5
                            },
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(editNewRequiredPackage.uiTemplate.electedJobGridRow()),
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataBinding: function (e) {
                                kendoGrid.nullDataDealLeaf(e);
                            },
                            dataSource: {
                                serverPaging: true,
                                page: 1,
                                pageSize: 7, // 每页显示的数据数目
                                transport: {
                                    parameterMap: function (data, type) {
                                        if (type === 'read') {
                                            angular.extend(data, {
                                                name: $scope.model.electedJobGridParams.name
                                            });
                                            data.pageNo = data.page;
                                        }
                                        return data;
                                    },
                                    read: {
                                        url: '/web/admin/trainClass/findJobPages',
                                        dataType: 'json'
                                    }
                                },
                                schema: {
                                    parse: function (response) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if (response.status) {
                                            var viewData = response.info,
                                                selectedJobIdList = $scope.model.selectedJobIdList,
                                                index = 1;

                                            _.forEach(viewData, function (row) {
                                                row.isChoice = false;
                                                row.index = index++;

                                                if (_.indexOf($scope.model.oldJobIdList, row.id) != -1) {
                                                    row.oldData = true;
                                                }
                                                _.forEach(selectedJobIdList, function (jobId) {
                                                    if (row.id === jobId) {
                                                        row.isChoice = true;
                                                    }
                                                });
                                            });
                                            // console.log(response.info);
                                            return response;
                                        } else {
                                            $scope.globle.alert('错误', '待选岗位加载失败!');
                                            return {
                                                status: response.status,
                                                totalSize: 0,
                                                totalPageSize: 0,
                                                info: []
                                            };
                                        }
                                    },
                                    total: function (response) {
                                        return response.totalSize;
                                    },
                                    data: function (response) {
                                        return response.info;
                                    }
                                }
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns: [
                                //{title: "No.", width: 60},
                                {field: 'name', title: '岗位'},
                                {field: 'number', title: '人数'},
                                {title: '操作', width: 80}
                            ]
                        };
                    }
                },

                /**
                 * 初始化待选的学员表格
                 */
                initialElectedEmployeeGrid: function () {
                    $scope.ui.electedEmployeeGrid = {
                        selectable: true,
                        scrollable: false,
                        pageable: {
                            refresh: true,
                            buttonCount: 5
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(editNewRequiredPackage.uiTemplate.electedEmployeeGridRow()),
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataBinding: function (e) {
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataSource: {
                            serverPaging: true,
                            page: 1,
                            pageSize: 7, // 每页显示的数据数目
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        angular.extend(data, $scope.model.electedEmployeeGridParams);
                                        data.pageNo = data.page;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/trainClass/getEmployeeInfoPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            selectedEmployeeIdList = $scope.model.selectedEmployeeIdList,
                                            index = 1;

                                        _.forEach(viewData, function (row) {
                                            row.isChoice = false;
                                            row.index = index++;
                                            if (_.indexOf($scope.model.oldEmployeeIdList, row.userId) != -1) {
                                                row.oldData = true;
                                            }
                                            _.forEach(selectedEmployeeIdList, function (employeeId) {
                                                if (row.userId === employeeId) {
                                                    row.isChoice = true;
                                                }
                                            });
                                        });
                                        // console.log(response.info);
                                        return response;
                                    } else {
                                        $scope.globle.alert('错误', '待选学员加载失败!');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {title: 'No.', width: 60},
                            {title: '姓名'},
                            {title: '岗位', width: 100},
                            {title: '操作', width: 80}
                        ]
                    };
                },
                wrapGridRowData: function (dataItem) {
                    return {
                        id: dataItem.id,
                        name: dataItem.name,
                        credit: dataItem.credit,
                        lessonTypeName: dataItem.lessonTypeName
                    };
                }
            };

            $scope.events = {

                /**
                 * 切换课程的查询维度
                 *
                 * @param e
                 * @param dimension
                 */
                toggleLessonDimension: function (e, dimension) {
                    e.preventDefault();
                    $scope.model.lessonDimension = $scope.model.lessonGridParams.catalogType = dimension;

                    // 课程查询维度是<课程分类>
                    dimension === 2 && editNewRequiredPackage.utils.initialLessonTypeTree();

                },

                /**
                 * 重载能力项列表
                 * @param e
                 */
                reloadAbility: function (e) {
                    // 组织事件向上级传播
                    e.stopPropagation();

                    editNewRequiredPackage.utils.loadAbility();
                },

                /**
                 * 重载课程分类树
                 * @param e
                 */
                reloadLessonType: function (e) {
                    // 组织事件向上级传播
                    e.stopPropagation();

                    $scope.node.lessonTypeTree.dataSource.read();
                },

                queryLessonByEnter: function (e) {
                    if (e.keyCode == 13) {
                        this.queryLessonGrid(e, $scope.model.lessonGridParams.resourceType);
                    }
                },

                /**
                 * 点击<查询> 重载课程grid
                 * @param e
                 * @param resourceType
                 */
                queryLessonGrid: function (e, resourceType) {
                    e.preventDefault();

                    // 设置能力项ID、刷新表格
                    $scope.model.lessonGridParams.resourceType = resourceType;
                    $scope.node.lessonGrid.pager.page(1);
                },

                /**
                 * 通过能力项刷新课程表格
                 *
                 * @param e
                 * @param abilityId
                 */
                refreshLessonGridByAbility: function (e, index, abilityId) {
                    e.preventDefault();

                    $scope.model.abilityCursor = index;
                    // 设置能力项ID
                    $scope.model.lessonGridParams.abilityId = abilityId;
                    // 刷新表格
                    $scope.node.lessonGrid.pager.page(1);
                },

                /**
                 * 保存人员
                 * @param e
                 */
                createUser: function (e) {
                    e.preventDefault();
                    if ($scope.model.selectedJobList.length > 0 || $scope.model.selectedUnitList.length > 0 || $scope.model.selectedEmployeeList.length > 0 && $scope.model.save) {
                        $scope.model.save = false;
                        var data = {
                            trnId: $stateParams.trnId,
                            employeeIdList: $scope.model.selectedEmployeeIdList,
                            jobIdList: $scope.model.selectedJobIdList,
                            unitIdList: $scope.model.selectedUnitIdList
                        };

                        trainClassManageService.createUser(data).then(function (data) {
                            $scope.model.save = true;
                            if (data.status) {
                                $state.go('states.trainClassManage');
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }

                        });
                    }
                },
                /**
                 * 选中单位
                 * @param e
                 */
                chooseUnit: function (e, dataItem) {
                    e.preventDefault();
                    $scope.model.selectedUnitIdList.push(dataItem.id);
                    $scope.model.selectedUnitList.push(dataItem);
                    dataItem.isChoice = true;
                },

                /**
                 * 选中岗位
                 * @param e
                 */
                chooseJob: function (e, dataItem) {
                    e.preventDefault();
                    $scope.model.selectedJobIdList.push(dataItem.id);
                    $scope.model.selectedJobList.push(dataItem);
                    $scope.model.numberCount += dataItem.number;
                    dataItem.isChoice = true;
                },

                /**
                 * 批量选择课程
                 *
                 * @param e
                 */
                batchSelect: function (e) {
                    e.preventDefault();

                    var viewData = $scope.node.lessonGrid.dataSource.view(),
                        selectedLessonIdList = $scope.model.selectedLessonIdList,
                        selectedLessonList = $scope.model.selectedLessonList,
                        i, dataItem,
                        index;

                    for (i = 0; i < viewData.length; i++) {
                        dataItem = viewData[i];
                        // 判断是否已在选中的列表中
                        index = _.indexOf(selectedLessonIdList, dataItem.id);
                        if (index === -1) {
                            // 追加学分
                            $scope.model.creditCount += dataItem.credit;
                            dataItem.isChoice = true;

                            selectedLessonIdList.push(dataItem.id);
                            selectedLessonList.push(editNewRequiredPackage.utils.wrapGridRowData(dataItem));
                        }
                    }
                },

                /**
                 * 在表格中<取消选择>课程
                 * @param e
                 * @param dataItem
                 */
                removeByUnitGrid: function (e, dataItem) {
                    e.preventDefault();

                    // 获取当前课程ID在<selectedLessonList>的下标并移除
                    var index = -1, selectedLessonList = $scope.model.selectedUnitList, i, unit;
                    for (i = 0; i < selectedLessonList.length; i++) {
                        unit = selectedLessonList[i];
                        if (unit.unitId === dataItem.unitId) {
                            index = i;
                            break;
                        } else {
                            index = -1;
                        }
                    }
                    index !== -1 && $scope.model.selectedUnitList.splice(index, 1);

                    // 从已选课程ID的数组中移除
                    var position = _.indexOf($scope.model.selectedUnitList, dataItem.id);
                    if (position !== -1) {
                        $scope.model.selectedUnitIdList.splice(position, 1);
                    }
                    dataItem.isChoice = false;
                },
                /**
                 * 从已选中的单位中删除单位
                 *
                 * @param e
                 * @param index 当前操作元素处于$scope.model.selectedLesson的索引下标
                 * @param lessonId 单位ID
                 */
                removeUnit: function (e, index, unitId) {
                    e.preventDefault();
                    //
                    //从已选课程的数组中移除
                    $scope.model.selectedUnitList.splice(index, 1);
                    // 从已选课程ID的数组中移除
                    var position = _.indexOf($scope.model.selectedUnitIdList, unitId);
                    if (position !== -1) {
                        $scope.model.selectedUnitIdList.splice(position, 1);
                    }

                    // 从grid当前view中找到对应的行并设置<isChoice>为false;
                    var viewData = $scope.node.unitGrid.dataSource.view(),
                        i, row;
                    for (i = 0; i < viewData.length; i++) {
                        row = viewData[i];
                        if (row.unitId === unitId) {
                            row.isChoice = false;
                        }
                    }
                },
                /**
                 * 从已选中移除课程
                 *
                 * @param e
                 * @param index 当前操作元素处于$scope.model.selectedLesson的索引下标
                 * @param lessonId 课程ID
                 */
                remove: function (e, index, lessonId) {
                    e.preventDefault();

                    // 减学分
                    $scope.model.creditCount -= $scope.model.selectedLessonList[index].credit;
                    //从已选课程的数组中移除
                    $scope.model.selectedLessonList.splice(index, 1);
                    // 从已选课程ID的数组中移除
                    var position = _.indexOf($scope.model.selectedLessonIdList, lessonId);
                    if (position !== -1) {
                        $scope.model.selectedLessonIdList.splice(position, 1);
                    }

                    // 从grid当前view中找到对应的行并设置<isChoice>为false;
                    var viewData = $scope.node.lessonGrid.dataSource.view(),
                        i, row;
                    for (i = 0; i < viewData.length; i++) {
                        row = viewData[i];
                        if (row.id === lessonId) {
                            row.isChoice = false;
                        }
                    }
                },

                /**
                 * 清空已选的课程
                 * @param e
                 */
                empty: function (e) {
                    e.preventDefault();

                    // 重置
                    $scope.model.creditCount = 0;
                    $scope.model.selectedLessonIdList = [];
                    $scope.model.selectedLessonList = [];

                    // 从grid把当前view的所有数据全部设置<isChoice>为false;
                    var viewData = $scope.node.lessonGrid.dataSource.view(),
                        i;
                    for (i = 0; i < viewData.length; i++) {
                        viewData[i].isChoice = false;
                    }
                },

                /**
                 * 返回资源管理页面
                 * @param e
                 */
                goTrainClassManage: function (e) {
                    e.preventDefault();
                    window.clearInterval($scope.timerIntervalId);
                    $state.go('states.trainClassManage').then(function () {
                        $state.reload();
                    });

                },


                /**
                 * 切换选择学习对象的Tab
                 * @param e
                 * @param studyObjectCursor
                 */
                toggleStudyObject: function (e, studyObjectCursor) {
                    e.preventDefault();
                    $scope.model.studyObjectCursor = studyObjectCursor;

                    editNewRequiredPackage.utils.loadTargetElectedData(studyObjectCursor);
                },

                queryElectedStudyObjectByEnter: function (e, type) {
                    if (e.keyCode == 13) {
                        this.reloadElectedStudyObjectData(e, type);
                    }
                },

                /**
                 * 重载待选学习对象的数据
                 * @param e
                 * @param type
                 */
                reloadElectedStudyObjectData: function (e, type) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);

                    proxy.electedKendoNode.pager.page(1);
                },

                /**
                 * 选择学习对象
                 * @param e
                 * @param type
                 * @param dataItem
                 */
                chooseStudyObject: function (e, type, dataItem) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);

                    if (type === 1) {
                        proxy.selectedStudyObjectIdList.push(dataItem.userId);
                    } else if (type === 2) {
                        proxy.selectedStudyObjectIdList.push(dataItem.id);
                    } else {
                        $scope.globle.alert('错误', '选择了错误的学习对象类型');
                        return;
                    }
                    proxy.selectedStudyObjectList.push(dataItem);
                    dataItem.isChoice = true;
                },
                /**
                 *
                 * @param e
                 * @param data
                 */
                chooseUser: function (e, data) {
                    e.preventDefault();
                    $scope.model.selectedEmployeeIdList.push(data.userId);
                    $scope.model.selectedEmployeeList.push(data);
                    data.isChoice = true;
                },
                /**
                 * 批量选择学习对象
                 * @param e
                 * @param type
                 */
                batchSelectStudyObject: function (e, type) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);

                    var viewData = proxy.electedKendoNode.dataSource.view(),
                        i, dataItem, id, index;

                    for (i = 0; i < viewData.length; i++) {
                        dataItem = viewData[i];
                        id = type === 1 ? dataItem.userId : dataItem.id;
                        // 判断是否已在选中的列表中
                        index = _.indexOf(proxy.selectedStudyObjectIdList, id);
                        if (index === -1) {
                            // 设置选中
                            dataItem.isChoice = true;

                            proxy.selectedStudyObjectIdList.push(id);
                            proxy.selectedStudyObjectList.push(dataItem);
                        }
                    }
                },


                /**
                 * 在表格中<取消选择>学习对象
                 * @param e
                 * @param type
                 * @param dataItem
                 */
                removeStudyObjectByGrid: function (e, type, dataItem) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type),
                        id = type === 1 ? dataItem.userId : dataItem.id;
                    // 获取当前课程ID在<selectedLessonList>的下标并移除
                    var index = -1,
                        selectedLessonList = proxy.selectedStudyObjectList,
                        i, studyObject, studyObjectId;
                    for (i = 0; i < selectedLessonList.length; i++) {
                        studyObject = selectedLessonList[i];
                        studyObjectId = type === 1 ? studyObject.userId : studyObject.id;
                        if (studyObjectId === id) {
                            index = i;
                            break;
                        }
                    }
                    index !== -1 && proxy.selectedStudyObjectList.splice(index, 1);
                    // 从已选课程ID的数组中移除
                    var position = _.indexOf(proxy.selectedStudyObjectIdList, id);
                    if (position !== -1) {
                        proxy.selectedStudyObjectIdList.splice(position, 1);
                    }

                    // 设置未选
                    dataItem.isChoice = false;
                },

                /**
                 * 移除学习对象
                 * @param e
                 * @param type 1: 员工; 2: 员工; '1': 单位; '2': 部门
                 * @param index
                 * @param key 对于type是1、2的学习对象, key是员工ID、岗位ID; 对于type是'1'、'2'的学习对象, key是组织机构名称
                 */
                removeStudyObject: function (e, type, index, key, oldData) {
                    e.preventDefault();
                    if (oldData) {
                        return false;
                    }
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);

                    //从已选学习对象的数组中移除
                    proxy.selectedStudyObjectList.splice(index, 1);

                    // 从已选学习对象的ID数组中移除
                    var position = _.indexOf(proxy.selectedStudyObjectIdList, key);
                    if (position !== -1) {
                        proxy.selectedStudyObjectIdList.splice(position, 1);
                    }

                    // 从当前view中找到对应的行并设置<isChoice>为false;
                    if (type === 1 || type === 2 || type == 3) {
                        var viewData = proxy.electedKendoNode.dataSource.view(),
                            i, row, rowId;
                        for (i = 0; i < viewData.length; i++) {
                            row = viewData[i];
                            // 用户的ID key是userId
                            rowId = type === 1 ? row.userId : row.id;
                            if (rowId === key) {
                                if (type == 2) {
                                    $scope.model.numberCount -= row.number;
                                }
                                // 单个 找到就终止判断
                                row.isChoice = false;
                                break;
                            }
                        }
                    } else if (type === '1' || type === '2') {
                        var node = $scope.node.electedUnitOrgTree.findByText(key);
                        if (node != null) {
                            $scope.node.electedUnitOrgTree.enable(node, true);
                        }
                    }
                },

                /**
                 * 清空已选的学习对象
                 * @param e
                 * @param type 1:员工, 2: 岗位; 3: 单位
                 */
                emptyStudyObject: function (e, type) {
                    e.preventDefault();
                    // 重置
                    if (type === 1) {
                        $scope.model.selectedEmployeeIdList = $scope.model.oldEmployeeIdList.concat();
                        $scope.model.selectedEmployeeList = $scope.model.oldEmployeeList.concat();
                    } else if (type === 2) {
                        $scope.model.numberCount = $scope.model.oldnumberCount;
                        $scope.model.selectedJobIdList = $scope.model.oldJobIdList.concat();
                        $scope.model.selectedJobList = $scope.model.oldJobList.concat();
                    } else if (type === 3) {
                        $scope.model.selectedUnitIdList = $scope.model.oldUnitIdList.concat();
                        $scope.model.selectedUnitList = $scope.model.oldUnitList.concat();
                    }

                    //== 员工和岗位是<Grid>类型
                    // 从grid把当前view的所有数据全部设置<isChoice>为false;
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);
                    proxy.electedKendoNode.pager.page(1);
                    //viewData = proxy.electedKendoNode.dataSource.view(),
                    //i;

                    //for (i = 0; i < viewData.length; i++) {
                    //    viewData[i].isChoice = false;
                    //}

                },


                reloadResource: function (e) {
                    e.preventDefault();
                }
            };
            trainClassManageService.getCreateTrainUserData($stateParams.trnId).then(function (response) {
                if (response.status) {
                    $scope.model.oldEmployeeIdList = response.info.employeeIdList.concat();
                    $scope.model.selectedEmployeeIdList = response.info.employeeIdList.concat();
                    $scope.model.oldJobIdList = response.info.jobIdList.concat();
                    $scope.model.oldUnitIdList = response.info.unitIdList.concat();
                    $scope.model.selectedJobIdList = response.info.jobIdList.concat();
                    $scope.model.selectedUnitIdList = response.info.unitIdList.concat();
                    initData();
                } else {
                    $scope.globle.alert('错误', '加载数据失败!');
                }
            });

            function initData () {
                trainClassManageService.findTrainEmployees($stateParams.trnId).then(function (response) {
                    if (response.status) {
                        $scope.model.selectedEmployeeList = response.info.concat();
                        $scope.model.oldEmployeeList = response.info.concat();
                        // 加载课程分类、课程数量、课程分页
                    } else {
                        $scope.globle.alert('错误', '必修包的员工学习对象加载失败!');
                    }
                });
                trainClassManageService.findTrainJobs($stateParams.trnId).then(function (response) {
                    if (response.status) {
                        $scope.model.selectedJobList = response.info.concat();
                        $scope.model.oldJobList = response.info.concat();
                        _.forEach(response.info, function (job) {
                            $scope.model.numberCount += job.number;
                            $scope.model.oldnumberCount += job.number;
                        });
                    } else {
                        $scope.globle.alert('错误', '必修包的岗位学习对象加载失败!');
                    }
                });
                trainClassManageService.getUnitList($stateParams.trnId).then(function (response) {
                    if (response.status) {
                        $scope.model.selectedUnitList = response.info.concat();
                        $scope.model.oldUnitList = response.info.concat();
                    } else {
                        $scope.globle.alert('错误', '必修包的组织机构学习对象加载失败!');
                    }
                });
            }

            //加载单位的列表+-
            editNewRequiredPackage.utils.initialUnitGrid();
            // 加载课程分类、课程数量、课程分页
            editNewRequiredPackage.utils.initialUnitTree();//加载单位数
            editNewRequiredPackage.utils.initialElectedJobGrid();
            editNewRequiredPackage.utils.initialElectedEmployeeGrid();

        }];
});
