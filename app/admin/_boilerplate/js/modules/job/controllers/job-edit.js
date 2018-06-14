define(function () {
    'use strict';
    return ['$scope', 'jobService', '$stateParams', '$state', 'kendo.grid',
        function ($scope, jobService, $stateParams, $state, kendoGrid) {

            // define local variable and util function
            var editJob = {
                jobId: $stateParams.jobId,
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
                event: {},                  // intercept ui event
                editParams: {
                    jobId: editJob.jobId
                }
            });

            editJob.localDB = {
                selectedLessonTypeId: null
            };

            $scope.model = {
                noSubmitModification: true,

                // 岗位等级总的校验结果
                isJobGradePass: false,
                gradeCursor: -1,
                abilityCursor: 0,

                selectedLessonTypeId: null,

                gradeLessonCount: 0,
                gradeCreditCount: 0,

                // 选课维度; 1: 课程分类; 2: 能力项
                lessonDimension: 1,
                abilityList: [],

                userLevel: 431000,  // 默认的用户级别, 控制是否显示<集团>类型
                unlimitCount: 0,
                blocCount: 0,
                selfCount: 0,
                selectedIdArray: [],
                selectedLesson: [],

                // 课程分页参数
                lessonGridParams: {
                    /**
                     * {@link #lessonDimension}一致
                     */
                    catalogType: 1,
                    abilityId: null,
                    catalogId: null,
                    name: null,
                    resourceType: 0,
                    selectedLessonIdList: [],
                    excludeLessonIdList: []
                },

                // 岗位编辑
                edit: {
                    id: editJob.jobId,
                    name: null,
                    intro: null,
                    gradeList: []
                }
            };

            editJob.$node = {
                lessonTypeTree: $('#lesson_type')
            };

            $scope.node = {
                lessonChoiceWindow: null,
                lessonTypeTree: null,
                lessonGrid: null
            };

            editJob.uiTemplate = {
                lessonGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: credit #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    //result.push ('<button ng-click="events.view($event, dataItem)" class="table-btn">查看</button>');
                    result.push('<button ng-click="events.audit($event, dataItem)" class="table-btn">试听</button>');
                    result.push('<button ng-if="!dataItem.isChoice" ng-click="events.choose($event, dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice" ng-click="events.removeByGrid($event, dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                }
            };

            editJob.utils = {
                /**
                 * 重新计算岗位等级的课程统计信息
                 *
                 * @param cursor 岗位等级的数组索引
                 */
                reCalculateGradeLesson: function (cursor) {
                    var lessonList = $scope.model.edit.gradeList[cursor].lessonList;

                    // 重算岗位等级下的课程数、学分总数
                    $scope.model.gradeLessonCount = lessonList.length;
                    $scope.model.gradeCreditCount = 0;

                    _.forEach(lessonList, function (lesson) {
                        $scope.model.gradeCreditCount += lesson.credit;
                    });
                },

                getJobGradeValidResult: function () {
                    var gradeList = $scope.model.edit.gradeList,
                        size = gradeList.length,
                        i, grade;

                    if (size > 0) {
                        // 如果当前岗位等级可用，则重新遍历判断所有的岗位等级是否可用
                        for (i = 0; i < size; i++) {
                            grade = gradeList[i];
                            if (grade.invalid) {
                                $scope.model.isJobGradePass = false;
                                break;
                            } else {
                                $scope.model.isJobGradePass = true;
                            }
                        }
                    } else {
                        $scope.model.isJobGradePass = false;
                    }
                    // console.log('岗位等级是否通过: ' + $scope.model.isJobGradePass);
                },

                refreshJobGradeLevel: function () {
                    angular.forEach($scope.model.edit.gradeList, function (grade, index) {
                        grade.levelValue = index + 1;
                    });
                },

                /**
                 * 加载能力项
                 * @param callback
                 */
                loadAbility: function (callback) {
                    jobService.listAbility().then(function (response) {
                        if (response.status) {
                            $scope.model.abilityCursor = 0;
                            $scope.model.abilityList = response.info;
                            callback && callback();
                        }
                    });
                },

                /**
                 * 初始化课程分类的树
                 */
                initialLessonTypeTree: function (enforce) {
                    // 已加载则不加载
                    if (enforce) {
                        if (!$scope.ui.lessonType) {
                            $scope.ui.lessonType = {
                                dataSource: {
                                    transport: {
                                        read: {
                                            url: '/web/admin/job/listLessonType',
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

                                    editJob.utils.loadLessonCounts();
                                    $scope.node.lessonGrid.pager.page(1);
                                },
                                expand: function (e) {
                                    $scope.model.lessonGridParams.catalogId = this.dataItem(e.node).id;
                                }
                            };
                        } else {
                            $scope.node.lessonTypeTree.dataSource.read();
                        }
                    }
                },

                loadLessonCounts: function () {
                    var gridParams = $scope.model.lessonGridParams;
                    var params = {
                        catalogType: gridParams.catalogType,
                        catalogId: gridParams.catalogId,
                        abilityId: gridParams.abilityId,
                        name: gridParams.name,
                        excludeLessonIdArrayStr: gridParams.excludeLessonIdList.join('_')
                    };
                    jobService.getPackageLessonCounts(params).then(function (response) {
                        if (response.status) {
                            var packageLessonCount = response.info;

                            $scope.model.userLevel = packageLessonCount.userLevel;
                            $scope.model.unlimitCount = packageLessonCount.unrestrictedCount;
                            $scope.model.operatorSendCount = packageLessonCount.operatorSendCount;
                            $scope.model.blocCount = packageLessonCount.groupsCount;
                            $scope.model.selfCount = packageLessonCount.selfCount;
                            $scope.model.subordinateCount = packageLessonCount.subordinateCount;
                        } else {
                            $scope.globle.alert('错误', '课程数量加载失败!');
                        }
                    });
                },

                initialLessonGrid: function () {
                    $scope.ui.lessonGrid = {
                        selectable: true,
                        pageable: {
                            refresh: true,
                            buttonCount: 10
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(editJob.uiTemplate.lessonGridRow()),
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataBinding: function (e) {
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataSource: {
                            serverPaging: true,
                            page: 1,
                            pageSize: 8, // 每页显示的数据数目
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        //angular.extend(data, $scope.model.lessonGridParams);
                                        //// 使用get方式, 将array参数转成string, 并把array删除节省传递的字节长度
                                        //if (data.excludeLessonIdList.length) {
                                        //    data.excludeLessonIdArrayStr = data.excludeLessonIdList.join('_');
                                        //}
                                        //delete data.excludeLessonIdList;
                                        //
                                        //data.pageNo = data.page;
                                        var params = $scope.model.lessonGridParams;
                                        var temp = {
                                            'lessonPageParams.pageNo': data.page,
                                            'lessonPageParams.pageSize': data.pageSize,
                                            'lessonPageParams.resourceType': params.resourceType,
                                            'lessonPageParams.catalogType': params.catalogType,
                                            'lessonPageParams.catalogId': params.catalogId,
                                            'lessonPageParams.abilityId': params.abilityId,
                                            'lessonPageParams.name': params.name,
                                            'lessonPageParams.excludeLessonIdArrayStr': params.excludeLessonIdList.join('_')
                                        };
                                        return temp;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/job/getLessonPage',
                                    dataType: 'json',
                                    type: 'POST'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            selectedLessonIdList = $scope.model.lessonGridParams.selectedLessonIdList;

                                        _.forEach(viewData, function (row) {
                                            row.isChoice = false;
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
                                    // 绑定数据所有总共多少条;
                                    var resourceType = $scope.model.lessonGridParams.resourceType;
                                    switch (resourceType) {
                                        case 0:
                                            $scope.model.unlimitCount = response.totalSize;
                                            break;
                                        case 4:
                                            $scope.model.operatorSendCount = response.totalSize;
                                            break;
                                        case 1:
                                            $scope.model.blocCount = response.totalSize;
                                            break;
                                        case 2:
                                            $scope.model.selfCount = response.totalSize;
                                            break;
                                        case 3:
                                            $scope.model.subordinateCount = response.totalSize;
                                            break;
                                        default:
                                            alert('error resourceType query param: ' + resourceType);
                                    }
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
                            {field: 'name', title: '课程名称'},
                            {field: 'credit', title: '学分', width: 80},
                            {title: '操作', width: 120}
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
                },

                /**
                 * 重置选课操作的缓存数据
                 */
                resetLessonChoiceCache: function () {
                    // 重置缓存的数据
                    $scope.model.unlimitCount = 0;
                    $scope.model.blocCount = 0;
                    $scope.model.selfCount = 0;
                    $scope.model.selectedLesson = [];

                    // 重置表格的查询参数
                    $scope.model.lessonGridParams.abilityId = null;
                    $scope.model.lessonGridParams.catalogId = null;
                    $scope.model.lessonGridParams.name = null;
                    $scope.model.lessonGridParams.resourceType = 0;
                    $scope.model.lessonGridParams.selectedLessonIdList = [];
                    $scope.model.lessonGridParams.excludeLessonIdList = [];
                }
            };


            $scope.ui = {
                lessonChoiceWindow: {
                    title: false,
                    modal: true,
                    resizable: false,
                    visible: false,
                    minWidth: 1280
                }
            };

            $scope.events = {

                /**
                 * 添加岗位等级
                 * @param e
                 */
                addGrade: function (e) {
                    e.preventDefault();
                    var gradeList = $scope.model.edit.gradeList,
                        size = gradeList.length;
                    // 最后一个若为空字符串，则不添加
                    if (gradeList[size - 1] === '') {
                        return;
                    } else {
                        // 添加, 则设置当前岗位等级为目标岗位等级
                        $scope.model.gradeCursor = $scope.model.edit.gradeList.length;
                        var node = {
                            name: '',
                            levelValue: $scope.model.gradeCursor + 1,
                            lessonIdList: [],
                            lessonList: [],
                            // 拓展的关于岗位等级自定义的校验
                            dirty: false,
                            isBlank: false,
                            isOutOfSize: false,
                            isRepeat: false,
                            invalid: true
                        };
                        $scope.model.edit.gradeList.push(node);

                        editJob.utils.getJobGradeValidResult();
                    }
                },

                validateJobGrade: function (e, index) {
                    var gradeList = $scope.model.edit.gradeList,
                        validName,
                        size = gradeList.length,
                        grade;
                    if (size > 0) {
                        grade = gradeList[index];
                        grade.dirty = true;

                        validName = grade.name;
                        // 是否为空
                        if (validName.length) {
                            grade.isBlank = grade.invalid = false;

                            // 长度限制
                            if (validName.length >= 32) {
                                grade.isOutOfSize = grade.invalid = true;
                            } else {
                                grade.isOutOfSize = grade.invalid = false;

                                // 判断当前岗位等级的名称是否已重复
                                for (var i = 0; i < size; i++) {
                                    if (index === i) {
                                        continue;
                                    } else {
                                        if (validName === gradeList[i].name) {
                                            grade.isRepeat = grade.invalid = true;
                                        } else {
                                            grade.isRepeat = grade.invalid = false;
                                        }
                                    }
                                }
                            }
                        } else {
                            grade.isBlank = grade.invalid = true;
                        }
                    }

                    editJob.utils.getJobGradeValidResult();
                },

                /**
                 * 删除岗位等级
                 * @param e
                 * @param index
                 */
                removeGrade: function (e, index) {
                    e.preventDefault();
                    $scope.model.edit.gradeList.splice(index, 1);

                    // 如果删除了当前正在编辑的岗位等级, 则默认显示第一个岗位
                    if ($scope.model.gradeCursor === index) {
                        if ($scope.model.edit.gradeList.length) {
                            this.toggleGrade(e, 0);
                        } else {
                            $scope.model.gradeCursor = -1;
                        }
                    }

                    editJob.utils.getJobGradeValidResult();
                    editJob.utils.refreshJobGradeLevel();
                },

                /**
                 * 切换岗位等级
                 *
                 * @param e
                 * @param index
                 */
                toggleGrade: function (e, index) {
                    e.preventDefault();
                    $scope.model.gradeCursor = index;
                    editJob.utils.reCalculateGradeLesson(index);
                },


                /**
                 * 移除岗位下已有的课程
                 */
                removeGradeLesson: function (e, index, lessonId) {
                    e.preventDefault();

                    var currentGrade = $scope.model.edit.gradeList[$scope.model.gradeCursor];
                    // 从当前岗位等级下的<课程集合>移除
                    currentGrade.lessonList.splice(index, 1);

                    // 从当前岗位等级下的<课程ID集合>移除
                    index = _.indexOf(currentGrade.lessonIdList, lessonId);
                    if (index !== -1) {
                        currentGrade.lessonIdList.splice(index, 1);
                    }

                    // 重新计算当前岗位等级的课程数、学分总数
                    editJob.utils.reCalculateGradeLesson($scope.model.gradeCursor);
                },

                /**
                 * 打开选择课程的窗体
                 * @param e
                 */
                openLessonChoiceWindow: function (e) {
                    e.preventDefault();

                    if ($scope.model.gradeCursor !== -1) {
                        $scope.node.lessonChoiceWindow.center().open();

                        var currentGrade = $scope.model.edit.gradeList[$scope.model.gradeCursor];
                        // 把当前岗位等级已选的课程ID 加入分页查询的排除ID集合中
                        $scope.model.lessonGridParams.excludeLessonIdList = currentGrade.lessonIdList;

                        // 加载能力项
                        //editJob.utils.loadAbility(
                        //    editJob.utils.initialLessonGrid
                        //);
                        editJob.utils.initialLessonTypeTree(true);

                        editJob.utils.loadLessonCounts();
                        editJob.utils.initialLessonGrid();

                        if ($scope.node.lessonGrid) {
                            $scope.node.lessonGrid.dataSource.page(1);
                        }
                    }

                },

                /**
                 * 切换课程的查询维度
                 *
                 * @param e
                 * @param dimension
                 */
                toggleLessonDimension: function (e, dimension) {
                    e.preventDefault();
                    $scope.model.lessonDimension = $scope.model.lessonPageParams.catalogType = dimension;

                    // 课程查询维度是<课程分类>
                    dimension === 2 && editJob.utils.initialLessonTypeTree();

                },

                /**
                 * 重载能力项列表
                 * @param e
                 */
                reloadAbility: function (e) {
                    // 组织事件向上级传播
                    e.stopPropagation();

                    editJob.utils.loadAbility();
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

                queryByEnter: function (e) {
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
                 * 表格中选择课程
                 * @param e
                 */
                choose: function (e, dataItem) {
                    e.preventDefault();
                    $scope.selected = false;

                    $scope.model.selectedLesson.push(editJob.utils.wrapGridRowData(dataItem));
                    $scope.model.lessonGridParams.selectedLessonIdList.push(dataItem.id);

                    dataItem.isChoice = true;
                },

                /**
                 * 在表格中<取消选择>课程
                 * @param e
                 * @param dataItem
                 */
                removeByGrid: function (e, dataItem) {
                    e.preventDefault();

                    // 获取当前课程ID在<selectedLesson>的下标并移除
                    var index = -1, selectedLesson = $scope.model.selectedLesson, i, lesson;
                    for (i = 0; i < selectedLesson.length; i++) {
                        lesson = selectedLesson[i];
                        if (lesson.id === dataItem.id) {
                            index = i;
                            break;
                        } else {
                            index = -1;
                        }
                    }
                    // console.log('result: ', index);
                    index !== -1 && $scope.model.selectedLesson.splice(index, 1);

                    // 从查询参数-排除的课程ID数组中移除
                    var position = _.indexOf($scope.model.lessonGridParams.selectedLessonIdList, dataItem.id);
                    if (position !== -1) {
                        $scope.model.lessonGridParams.selectedLessonIdList.splice(position, 1);
                    }

                    dataItem.isChoice = false;
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

                    $scope.model.selectedLesson.splice(index, 1);
                    // 从查询参数-排除的课程ID数组中移除
                    var position = _.indexOf($scope.model.lessonGridParams.selectedLessonIdList, lessonId);
                    if (index !== -1) {
                        $scope.model.lessonGridParams.selectedLessonIdList.splice(position, 1);
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
                 * 批量选择课程
                 *
                 * @param e
                 */
                batchSelect: function (e) {
                    e.preventDefault();
                    $scope.selected = false;

                    var viewData = $scope.node.lessonGrid.dataSource.view(),
                        selectedLesson = $scope.model.selectedLesson,
                        selectedLessonIdList = $scope.model.lessonGridParams.selectedLessonIdList,
                        i, dataItem,
                        index;

                    for (i = 0; i < viewData.length; i++) {
                        dataItem = viewData[i];

                        // 判断是否已在选中的列表中
                        index = _.indexOf(selectedLessonIdList, dataItem.id);
                        if (index === -1) {
                            dataItem.isChoice = true;
                            selectedLessonIdList.push(dataItem.id);
                            selectedLesson.push(editJob.utils.wrapGridRowData(dataItem));
                        }
                    }
                },

                /**
                 * 清空已选的课程
                 * @param e
                 */
                empty: function (e) {
                    e.preventDefault();
                    $scope.selected = false;

                    // 重置
                    $scope.model.selectedLesson = [];
                    $scope.model.lessonGridParams.selectedLessonIdList = [];

                    // 从grid把当前view的所有数据全部设置<isChoice>为false;
                    var viewData = $scope.node.lessonGrid.dataSource.view(),
                        i;
                    for (i = 0; i < viewData.length; i++) {
                        viewData[i].isChoice = false;
                    }
                },

                /**
                 * 保存选择的课程
                 *
                 * @param e
                 */
                saveChoiceLesson: function (e) {
                    e.preventDefault();

                    var gradeCursor = $scope.model.gradeCursor;
                    $scope.model.edit.gradeList[gradeCursor].lessonList = $scope.model.edit.gradeList[gradeCursor].lessonList.concat($scope.model.selectedLesson);
                    $scope.model.edit.gradeList[gradeCursor].lessonIdList = $scope.model.edit.gradeList[gradeCursor].lessonIdList.concat($scope.model.lessonGridParams.selectedLessonIdList);

                    // 重新计算当前岗位等级的课程数、学分总数
                    editJob.utils.reCalculateGradeLesson(gradeCursor);

                    editJob.utils.resetLessonChoiceCache();
                    $scope.node.lessonChoiceWindow.close();
                },

                /**
                 * 关闭选择课程的窗口
                 * @param e
                 */
                closeLessonChoiceWindow: function (e) {
                    e.preventDefault();
                    editJob.utils.resetLessonChoiceCache();

                    $scope.node.lessonChoiceWindow.close();
                },

                /**
                 * 保存岗位的添加
                 */
                update: function (e) {
                    e.preventDefault();

                    if ($scope.model.noSubmitModification && $scope.editJobForm.$valid && $scope.model.isJobGradePass) {
                        $scope.model.noSubmitModification = false;

                        jobService.update($scope.model.edit).then(function (response) {
                            $scope.model.noSubmitModification = true;
                            if (response.status) {
                                $scope.globle.showTip('操作成功', 'success');
                                $state.go('states.job').then(function () {
                                    $state.reload();
                                });
                            } else {
                                $scope.globle.showTip('操作失败', 'error');
                            }
                        });
                    }
                },

                /**
                 * 取消岗位的添加
                 */
                cancel: function (e) {
                    e.preventDefault();
                    $state.go('states.job').then(function () {
                        $state.reload();
                    });
                }
            };


            // 加载岗位数据
            jobService.getById(editJob.jobId).then(function (response) {
                if (response.status) {
                    var editModel = $scope.model.edit,
                        data = response.info;
                    editModel.name = data.name;
                    editModel.intro = data.intro;
                } else {
                    $scope.globle.showTip('加载岗位信息数据失败, 请稍后再试', 'error');
                }
            });

            jobService.getJobGrade(editJob.jobId).then(function (response) {
                if (response.status) {
                    if (response.info.length) {
                        // 指向第一个岗位等级
                        $scope.model.gradeCursor = 0;

                        $scope.model.edit.gradeList = response.info;
                        editJob.utils.reCalculateGradeLesson($scope.model.gradeCursor);

                        _.forEach($scope.model.edit.gradeList, function (grade) {
                            grade.dirty = false;
                            grade.isBlank = false;
                            grade.isOutOfSize = false;
                            grade.isRepeat = false;
                            grade.invalid = false;
                        });
                        $scope.model.isJobGradePass = true;
                    }
                } else {
                    $scope.globle.showTip('加载岗位等级数据失败, 请稍后再试', 'error');
                }
            });
        }];
});
