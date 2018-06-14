/**
 * Created by choaklin on 2015/10/12 18:40
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function (require, exports, module) {
    'use strict';
    return ['$scope', 'solutionService', '$state', 'kendo.grid',
        function ($scope, solutionService, $state, kendoGrid) {

            var editNewSolution = {
                utils: {},
                uiTemplate: {}
            };
            // define data-binding variable
            angular.extend($scope, {
                ui: {},                     // Kendo component options config
                model: {},                  // data model
                node: {},                   // node for kendo component
                event: {}                   // ui event handler

                //selectedJobName: null,
                //selectedLessonName: null
            });

            $scope.model = {
                noSubmitIncrease: true,

                // 提交的Model
                solutionName: null,
                appType: 2, // 默认正式
                relatedId: '-1',
                description: null,
                //== 已选岗位的查询
                selectedJobIdList: [],
                selectedJobList: [],

                // 已选区域的Model
                selectedLessonIdList: [],
                selectedLessonList: [],

                // 分页查询相关条件
                electedJobName: null,
                lessonGridParams: {         // 课程分页参数
                    catalogType: 1,
                    abilityId: null,
                    catalogId: null,
                    name: null
                }
            };

            $scope.node = {
                electedJobGrid: null,
                electedLessonGrid: null
            };

            editNewSolution.uiTemplate = {
                electedJobGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    //result.push ('<td>');
                    //result.push ('#: index #');
                    //result.push ('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: jobGradeNames #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button ng-if="!dataItem.isChoice" ng-click="events.chooseObject($event, 1, dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice" ng-click="events.removeObjectByGrid($event, 1, dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                },

                lessonGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    //result.push ('<td>');
                    //result.push ('#: index #');
                    //result.push ('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: lessonTypeName #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: credit #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button ng-click="events.audit($event, dataItem)" class="table-btn">试听</button>');
                    result.push('<button ng-if="!dataItem.isChoice" ng-click="events.chooseObject($event, 2, dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice" ng-click="events.removeObjectByGrid($event, 2, dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                }
            };


            editNewSolution.utils = {
                /**
                 * 初始化课程分类的树
                 */
                initialLessonTypeTree: function () {
                    var $lessonTypeTree = editNewSolution.$node.lessonTypeTree;

                    // 已加载则不加载
                    if (!$lessonTypeTree.children('ul').length) {
                        $scope.ui.lessonType = {
                            dataSource: {
                                transport: {
                                    read: {
                                        url: '/web/admin/solution/listLessonType',
                                        // 节点展开时, 默认传递的参数名是id, 参考下面expand的实现
                                        dataType: 'json'
                                    }
                                },
                                schema: {
                                    data: function (response) {
                                        return response.info;
                                    },
                                    model: {
                                        hasChildren: true
                                    }
                                }
                            },
                            dataTextField: 'name',
                            select: function (e) {
                                // refresh lesson grid
                                $scope.model.lessonGridParams.catalogId = this.dataItem(e.node).id;
                                // 加载课程数量、课程分页
                                editNewSolution.utils.loadLessonCounts();
                                $scope.node.lessonGrid.pager.page(1);
                            },
                            expand: function (e) {
                                $scope.model.lessonGridParams.catalogId = this.dataItem(e.node).id;
                            }
                        };
                    }
                },

                /**
                 * 初始化待选的员工表格
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
                            rowTemplate: kendo.template(editNewSolution.uiTemplate.electedJobGridRow()),
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
                                                name: $scope.model.electedJobName
                                            });
                                            data.pageNo = data.page;
                                        }
                                        return data;
                                    },
                                    read: {
                                        url: '/web/admin/solution/getElectedJobPage',
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
                                {title: '岗位', width: 150},
                                {title: '岗位等级'},
                                {title: '操作', width: 80}
                            ]
                        };
                    }
                },

                initialLessonGrid: function () {
                    $scope.ui.electedLessonGrid = {
                        selectable: true,
                        scrollable: false,
                        pageable: {
                            refresh: true,
                            buttonCount: 5
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(editNewSolution.uiTemplate.lessonGridRow()),
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
                                        angular.extend(data, $scope.model.lessonGridParams);
                                        data.pageNo = data.page;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/solution/getLessonPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            selectedLessonIdList = $scope.model.selectedLessonIdList,
                                            index = 1;

                                        _.forEach(viewData, function (row) {
                                            row.isChoice = false;
                                            row.index = index++;
                                            _.forEach(selectedLessonIdList, function (lessonId) {
                                                if (row.id === lessonId) {
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
                            //{title: "No.", width: 60},
                            {title: '课程名称'},
                            {title: '课程分类', width: 100},
                            {title: '学分', width: 60},
                            {title: '操作', width: 120}
                        ]
                    };
                },

                getTargetProxy: function (resourceType) {
                    var selectedObjectIdList,
                        selectedObjectList,
                        electedKendoNode;

                    //== 岗位类型
                    if (resourceType === 1) {
                        selectedObjectIdList = $scope.model.selectedJobIdList;
                        selectedObjectList = $scope.model.selectedJobList;
                        electedKendoNode = $scope.node.electedJobGrid;

                        //== 课程类型
                    } else if (resourceType === 2) {
                        selectedObjectIdList = $scope.model.selectedLessonIdList;
                        selectedObjectList = $scope.model.selectedLessonList;
                        electedKendoNode = $scope.node.electedLessonGrid;

                    } else {
                        $scope.globle.alert('错误', '错误的学习对象类型');
                        return;
                    }

                    return {
                        selectedObjectIdList: selectedObjectIdList,
                        selectedObjectList: selectedObjectList,
                        electedKendoNode: electedKendoNode
                    };
                }
            };

            $scope.events = {

                queryByEnter: function (e, type) {
                    if (e.keyCode == 13) {
                        this.reloadElectedGrid(e, type);
                    }
                },

                /**
                 * 重载待选分页的数据
                 * @param e
                 * @param type 1: 岗位; 2: 课程;
                 */
                reloadElectedGrid: function (e, type) {
                    e.preventDefault();

                    if (type === 1) {
                        $scope.node.electedJobGrid.pager.page(1);
                    } else if (type === 2) {
                        $scope.node.electedLessonGrid.pager.page(1);
                    } else {
                        $scope.globle.alert('错误', '错误的分页类型');
                    }
                },

                /**
                 * 选择学习对象
                 * @param e
                 * @param type
                 * @param dataItem
                 */
                chooseObject: function (e, type, dataItem) {
                    e.preventDefault();
                    var proxy = editNewSolution.utils.getTargetProxy(type);

                    if (type === 1 || type === 2) {
                        proxy.selectedObjectIdList.push(dataItem.id);
                    } else {
                        $scope.globle.alert('错误', '错误的解决方案资源配置');
                        return;
                    }
                    proxy.selectedObjectList.push(dataItem);
                    dataItem.isChoice = true;
                },

                /**
                 * 批量选择学习对象
                 * @param e
                 * @param type
                 */
                batchSelectObject: function (e, type) {
                    e.preventDefault();
                    var proxy = editNewSolution.utils.getTargetProxy(type);

                    var viewData = proxy.electedKendoNode.dataSource.view(),
                        i, dataItem, id, index;

                    for (i = 0; i < viewData.length; i++) {
                        dataItem = viewData[i];
                        id = dataItem.id;
                        // 判断是否已在选中的列表中
                        index = _.indexOf(proxy.selectedObjectIdList, dataItem.id);
                        if (index === -1) {
                            // 设置选中
                            dataItem.isChoice = true;

                            proxy.selectedObjectIdList.push(id);
                            proxy.selectedObjectList.push(dataItem);
                        }
                    }
                },


                /**
                 * 在表格中<取消选择>学习对象
                 * @param e
                 * @param type
                 * @param dataItem
                 */
                removeObjectByGrid: function (e, type, dataItem) {
                    e.preventDefault();
                    var proxy = editNewSolution.utils.getTargetProxy(type),
                        id = dataItem.id;

                    // 获取当前课程ID在<selectedLessonList>的下标并移除
                    var index = -1,
                        selectedLessonList = proxy.selectedObjectList,
                        i, object, objectId;
                    for (i = 0; i < selectedLessonList.length; i++) {
                        object = selectedLessonList[i];
                        objectId = object.id;
                        if (objectId === id) {
                            index = i;
                            break;
                        }
                    }
                    index !== -1 && proxy.selectedObjectList.splice(index, 1);

                    // 从已选课程ID的数组中移除
                    var position = _.indexOf(proxy.selectedObjectIdList, id);
                    if (position !== -1) {
                        proxy.selectedObjectIdList.splice(position, 1);
                    }

                    // 设置未选
                    dataItem.isChoice = false;
                },

                /**
                 * 移除学习对象
                 * @param e
                 * @param type 1: 岗位; 2: 课程;
                 * @param index
                 * @param key 对于type是1、2的学习对象, key是员工ID、岗位ID; 对于type是'1'、'2'的学习对象, key是组织机构名称
                 */
                removeObject: function (e, type, index, key) {
                    e.preventDefault();
                    var proxy = editNewSolution.utils.getTargetProxy(type);

                    //从已选对象、对象ID的数组中移除
                    proxy.selectedObjectList.splice(index, 1);
                    proxy.selectedObjectIdList.splice(index, 1);

                    // 从当前view中找到对应的行并设置<isChoice>为false;
                    if (type === 1 || type === 2) {
                        var viewData = proxy.electedKendoNode.dataSource.view(),
                            i, row, rowId;
                        for (i = 0; i < viewData.length; i++) {
                            row = viewData[i];
                            // 用户的ID key是userId
                            rowId = row.id;
                            if (rowId === key) {
                                // 单个 找到就终止判断
                                row.isChoice = false;
                                break;
                            }
                        }
                    }
                },

                /**
                 * 清空已选的学习对象
                 * @param e
                 * @param type 1:员工, 2: 岗位; 3: 组织机构(重置操作对于组织机构不需要调用{@link editNewSolution.utils.getTargetProxy})
                 */
                emptyObject: function (e, type) {
                    e.preventDefault();
                    // 重置
                    if (type === 1) {
                        $scope.model.selectedJobIdList = [];
                        $scope.model.selectedJobList = [];
                    } else if (type === 2) {
                        $scope.model.selectedLessonIdList = [];
                        $scope.model.selectedLessonList = [];
                    }

                    // 从grid把当前view的所有数据全部设置<isChoice>为false;
                    if (type === 1 || type === 2) {
                        var proxy = editNewSolution.utils.getTargetProxy(type),
                            viewData = proxy.electedKendoNode.dataSource.view(),
                            i;
                        for (i = 0; i < viewData.length; i++) {
                            viewData[i].isChoice = false;
                        }
                    }
                },

                /**
                 * 保存岗位的添加
                 */
                create: function (e) {
                    e.preventDefault();

                    if ($scope.model.noSubmitIncrease && $scope.addSolutionForm.$valid) {
                        if ($scope.model.selectedLessonIdList.length
                            || $scope.model.selectedJobIdList.length) {

                            var model = $scope.model;
                            model.noSubmitIncrease = false;

                            var data = {
                                name: model.name,
                                relatedId: model.relatedId,
                                description: model.description,

                                jobIdList: model.selectedJobIdList,
                                lessonIdList: model.selectedLessonIdList
                            };

                            solutionService.save(model.appType, data).then(function (response) {
                                $scope.model.noSubmitIncrease = true;
                                if (response.status) {
                                    $scope.globle.showTip('操作成功', 'success');
                                    $state.go('states.solution');
                                } else {
                                    $scope.globle.showTip('操作失败', 'error');
                                }
                            });
                        } else {
                            $scope.globle.showTip('请至少配置岗位或者课程的资源', 'warning');
                        }
                    }
                }
            };

            // 加载课程分类、课程数量、课程分页
            editNewSolution.utils.initialElectedJobGrid();
            editNewSolution.utils.initialLessonGrid();

            // editNewSolution.utils.initialLessonTypeTree();

        }];

});
