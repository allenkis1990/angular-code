define(function () {
    'use strict';
    return ['$scope', '$state', '$stateParams', 'solutionService', 'kendo.grid', function ($scope, $state, $stateParams, solutionService, kendoGrid) {

        var solutionView = {
            solutionId: $stateParams.solutionId,
            utils: {}
        };

        // define data-binding variable
        angular.extend($scope, {
            ui: {},                     // Kendo component options config
            model: {},                  // data model
            node: {},                   // node for kendo component
            event: {}                   // intercept ui event
        });

        $scope.model = {
            solution: {},
            actionRecordList: [],
            currentDimension: 1, // 1: 岗位; 2: 课程; 3: 能力项;

            currentJobGradeId: null,
            currentCatalogId: null,

            jobGradeLessonName: '',
            electedLessonName: '',
            jobGradeLessonList: []
        };

        solutionView.uiTemplate = {
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
                result.push('</td>');

                result.push('</tr>');
                return result.join('');
            }
        };

        solutionView.utils = {

            getSolutionActionRecord: function () {
                solutionService.listRecord(solutionView.solutionId).then(function (response) {
                    if (response.status) {
                        $scope.model.actionRecordList = response.info;
                    } else {
                        $scope.globle.alert('错误', '加载解决方案的岗位体系失败!');
                    }
                });
            },

            initSolutionJobGridTree: function () {
                solutionService.getJobGrade(solutionView.solutionId).then(function (response) {
                    if (response.status) {
                        $scope.ui.selectedJobGradeTree = {
                            dataSource: solutionView.utils.wrapJobGradeDataSource(response.info),
                            select: function (e) {
                                var dataItem = this.dataItem(e.node);
                                if (dataItem.type === 2) {
                                    $scope.model.currentJobGradeId = dataItem.id;
                                    solutionView.utils.reloadJobGradeLesson();
                                }
                            }
                        };

                        // 有一个岗位且岗位下有一个岗位等级
                        if (response.info.length) {
                            var firstJob = response.info[0];
                            if (firstJob.listjobInfo.length) {
                                $scope.model.currentJobGradeId = firstJob.listjobInfo[0].id;
                                solutionView.utils.reloadJobGradeLesson();
                            }
                        }
                    } else {
                        $scope.globle.alert('错误', '加载解决方案的岗位体系失败!');
                    }
                });
            },

            wrapJobGradeDataSource: function (jobGradeList) {
                var dataSource = [];
                angular.forEach(jobGradeList, function (jobData, jobIndex) {
                    var jobNode = {
                        id: jobData.id,
                        text: jobData.name,
                        type: 1,
                        expanded: jobIndex === 0,
                        hasChildren: jobData.listjobInfo.length > 0,
                        items: []
                    };

                    angular.forEach(jobData.listjobInfo, function (jobGradeData, jobGradeIndex) {
                        var jobGrade = {
                            id: jobGradeData.id,
                            text: jobGradeData.name,
                            type: 2,
                            selected: jobIndex === 0 && jobGradeIndex === 0,
                            hasChildren: false
                        };
                        jobNode.items.push(jobGrade);
                    });
                    dataSource.push(jobNode);
                });
                return dataSource;
            },

            reloadJobGradeLesson: function () {
                solutionService.getJobGradeLessonList($scope.model.currentJobGradeId, $scope.model.jobGradeLessonName).then(function (response) {
                    if (response.status) {
                        $scope.model.jobGradeLessonList = response.info;
                    } else {
                        $scope.globle.alert('错误', '加载岗位等级的课程失败');
                    }
                });
            },

            initLessonTypeTree: function () {
                $scope.ui.lessonTypeTree = {
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
                        $scope.model.currentCatalogId = this.dataItem(e.node).id;
                        // 加载课程数量、课程分页
                        $scope.node.solutionLessonGrid.pager.page(1);
                    },
                    expand: function (e) {
                        $scope.model.currentCatalogId = this.dataItem(e.node).id;
                    }
                };
            },

            initSolutionLessonGrid: function () {
                $scope.ui.solutionLessonGrid = {
                    selectable: true,
                    scrollable: false,
                    pageable: {
                        refresh: true
                    },
                    rowTemplate: kendo.template(solutionView.uiTemplate.lessonGridRow()),
                    dataBinding: function (e) {
                        kendoGrid.nullDataDealLeaf(e);
                    },
                    dataSource: {
                        serverPaging: true,
                        page: 1,
                        pageSize: 10, // 每页显示的数据数目
                        transport: {
                            parameterMap: function (data, type) {
                                if (type === 'read') {
                                    data.pageNo = data.page;
                                    data.lessonTypeId = $scope.model.currentCatalogId;
                                    data.lessonName = $scope.model.electedLessonName;
                                }
                                return data;
                            },
                            read: {
                                url: '/web/admin/solution/getSolutionLessonPage/' + solutionView.solutionId,
                                dataType: 'json'
                            }
                        },
                        schema: {
                            parse: function (response) {
                                // 将会把这个返回的数组绑定到数据源当中
                                if (response.status) {
                                    var viewData = response.info,
                                        i = 1;
                                    _.forEach(viewData, function (row) {
                                        row.index = i++;
                                    });
                                    return response;
                                } else {
                                    $scope.globle.alert('错误', '加载必修包下课程失败!');
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
                                $scope.model.totalLessonCount = response.totalSize;
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
                        {title: '课程名称'},
                        {title: '课程分类', width: 100},
                        {title: '学分', width: 60},
                        {title: '操作', width: 120}
                    ]
                };
            }
        };

        $scope.events = {
            queryByEnter: function (e, type) {
                if (e.keyCode == 13) {
                    if (type === 1) {
                        solutionView.utils.reloadJobGradeLesson();
                    } else if (type == 2) {
                        $scope.node.solutionLessonGrid.dataSource.page(1);
                    }
                }
            },

            loadJobGradeLesson: function (e) {
                e.preventDefault();
                solutionView.utils.reloadJobGradeLesson();
            },

            loadElectiveLesson: function (e) {
                e.preventDefault();
                $scope.node.solutionLessonGrid.dataSource.page(1);
            },

            toggleDimension: function (e, dimension) {
                e.preventDefault();
                $scope.model.currentDimension = dimension;
                if (dimension === 2 && !$scope.ui.solutionLessonGrid) {

                    solutionView.utils.initLessonTypeTree();
                    solutionView.utils.initSolutionLessonGrid();
                }
            },
            goBack: function (e) {
                e.stopPropagation();
                $state.go('states.merchant.view', {
                    projectId: $stateParams.projectId,
                    merchantId: $stateParams.merchantId
                });
            },
            goBackMain: function (e) {
                e.stopPropagation();
                $state.go('states.merchant').then(function () {
                    $state.reload();
                });
            }
        };

        // 包ID不为空
        if (solutionView.solutionId) {
            solutionService.getById(solutionView.solutionId).then(function (response) {
                if (response.status) {
                    $scope.solution = response.info;
                } else {
                    $scope.globle.showTip('加载必修包信息失败', 'error');
                }
            });

            solutionView.utils.getSolutionActionRecord();
            solutionView.utils.initSolutionJobGridTree();
            // 加载必修包下课程分页数据
            // $scope.ui.solutionLessonGrid.dataSource.read();
        }
    }];
});
