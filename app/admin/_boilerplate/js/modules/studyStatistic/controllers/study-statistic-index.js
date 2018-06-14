define(function () {
    'use strict';
    return ['$scope', 'studyStatisticService', 'kendo.grid', '$state', function ($scope, studyStatisticService, kendoGrid, $state) {

        var studyStatisticIndex = {};

        // define data-binding variable
        angular.extend($scope, {
            ui: {},                     // Kendo component options config
            model: {},                  // data model
            node: {},                   // node for kendo component
            event: {}                   // intercept ui event
        });

        $scope.model = {
            lessonName: null,

            lessonCreateUnitParentId: null,
            lessonCreateUnitName: null,
            unitId: null,

            buildSelf: 2,
            statisticBeginTime: null,
            statisticEndTime: null,

            detailLessonId: null,
            detailLessonName: null,
            employeeUnitName: null,
            employeeUnitParentId: null,
            detailUnitId: null
        };

        $scope.node = {
            lessonCreateUnitPopup: null,
            lessonCreateUnitTree: null,

            studyStatisticGrid: null,
            unitStudyStatisticGrid: null,
            detailUnitWindow: null,
            employeeUnitPopup: null,
            employeeUnitTree: null
        };

        studyStatisticIndex.uiTemplate = {
            studyStatisticGridRow: function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: lessonName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: lessonCreateUnitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: playCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: praiseCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: againstCount #');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button ng-click="events.view($event, dataItem)" class="table-btn">课程详情</button>');
                result.push('<button ng-click="events.detail($event, dataItem)" class="table-btn">机构数据</button>');
                result.push('</td>');

                result.push('</tr>');
                return result.join('');
            },

            unitStudyStatisticGridRow: function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: unitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: playCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: praiseCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: againstCount #');
                result.push('</td>');

                result.push('</tr>');
                return result.join('');
            }
        };

        studyStatisticIndex.utils = {
            startChange: function () {
                var startDate = $scope.node.statisticBeginTime.value(),
                    endDate = $scope.node.statisticEndTime.value();

                if (startDate) {
                    startDate = new Date(startDate);
                    startDate.setDate(startDate.getDate());
                    $scope.node.statisticEndTime.min(startDate);
                } else if (endDate) {
                    $scope.node.statisticBeginTime.max(new Date(endDate));
                } else {
                    endDate = new Date();
                    $scope.node.statisticBeginTime.max(endDate);
                    $scope.node.statisticEndTime.min(endDate);
                }
            },
            endChange: function () {
                var endDate = $scope.node.statisticEndTime.value(),
                    startDate = $scope.node.statisticBeginTime.value();

                if (endDate) {
                    endDate = new Date(endDate);
                    endDate.setDate(endDate.getDate());
                    $scope.node.statisticBeginTime.max(endDate);
                } else if (startDate) {
                    $scope.node.statisticEndTime.min(new Date(startDate));
                } else {
                    endDate = new Date();
                    $scope.node.statisticBeginTime.max(endDate);
                    $scope.node.statisticEndTime.min(endDate);
                }
            },

            initialEmployeeUnit: function () {
                if (!$scope.ui.treeView.employeeUnit) {
                    $scope.ui.treeView.employeeUnit = {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/web/admin/lessonStudyStatistic/listUnit',
                                    data: function () {
                                        return {
                                            parentId: $scope.model.employeeUnitParentId
                                        };
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
                            var node = $scope.node.employeeUnitTree.dataItem(e.node);
                            $scope.model.employeeUnitName = node.name;
                            $scope.model.detailUnitId = node.unitId;
                            $scope.$apply();

                            $scope.node.unitStudyStatisticGrid.dataSource.page(1);
                            $scope.node.employeeUnitPopup.close();
                        },
                        expand: function (e) {
                            var node = $scope.node.employeeUnitTree.dataItem(e.node);
                            $scope.model.employeeUnitParentId = node.unitId;
                        }
                    };
                } else {
                    $scope.model.employeeUnitName = null;
                    $scope.model.detailUnitId = null;
                    $scope.node.employeeUnitTree.dataSource.read();
                }
            },

            /**
             * 初始化待选的员工表格
             */
            initialUnitStudyStatisticGrid: function (lessonId) {
                if (!$scope.ui.unitStudyStatisticGrid) {
                    $scope.ui.unitStudyStatisticGrid = {
                        selectable: true,
                        scrollable: false,
                        pageable: {
                            refresh: true,
                            buttonCount: 5
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(studyStatisticIndex.uiTemplate.unitStudyStatisticGridRow()),
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataBinding: function (e) {
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataBound: function (e) {
                            $scope.node.detailUnitWindow.center();
                        },
                        dataSource: {
                            serverPaging: true,
                            serverSorting: true,
                            page: 1,
                            pageSize: 10, // 每页显示的数据数目
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        var temp = {}, params = $scope.model;
                                        if (data.sort) {
                                            if (data.sort[0]) {
                                                temp.sortKey = data.sort[0].field;
                                                temp.direction = data.sort[0].dir;
                                            }
                                        }
                                        temp.pageNo = data.page;
                                        temp.pageSize = data.pageSize;
                                        temp.lessonId = params.detailLessonId;
                                        temp.detailUnitId = params.detailUnitId;

                                        if (params.statisticBeginTime) {
                                            temp.statisticBeginTimeMills = $scope.node.statisticBeginTime.value().getTime();
                                        } else {
                                            temp.statisticBeginTimeMills = -1;
                                        }

                                        if (params.statisticEndTime) {
                                            // 结束时间 + (23:59:59) * 1000
                                            temp.statisticEndTimeMills = $scope.node.statisticEndTime.value().getTime() + 86399000;
                                        } else {
                                            temp.statisticEndTimeMills = -1;
                                        }
                                        return temp;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/lessonStudyStatistic/findLessonUnitStudyStatisticPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
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
                        sortable: true,
                        columns: [
                            {title: '机构名称'},
                            {field: 's', title: '学习次数', width: 100},
                            {field: 'p', title: '赞数', width: 80},
                            {field: 'a', title: '踩数', width: 80}
                        ]
                    };
                } else {
                    $scope.node.unitStudyStatisticGrid.dataSource.page(1);
                }
            }
        };


        $scope.ui = {
            popup: {
                lessonCreateUnit: {
                    anchor: '#lesson_create_unit_input'
                },
                employeeUnit: {
                    anchor: '#employee_unit_input'
                }
            },
            treeView: {
                lessonCreateUnit: {
                    dataSource: {
                        transport: {
                            read: {
                                url: '/web/admin/lessonStudyStatistic/listUnit',
                                data: function () {
                                    return {
                                        parentId: $scope.model.lessonCreateUnitParentId
                                    };
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
                        var node = $scope.node.lessonCreateUnitTree.dataItem(e.node);
                        $scope.model.lessonCreateUnitName = node.name;
                        $scope.model.unitId = node.unitId;
                        $scope.$apply();

                        $scope.node.studyStatisticGrid.dataSource.page(1);
                        $scope.node.lessonCreateUnitPopup.close();
                    },
                    expand: function (e) {
                        var node = $scope.node.lessonCreateUnitTree.dataItem(e.node);
                        $scope.model.lessonCreateUnitParentId = node.unitId;
                    }
                }
            },
            datePicker: {
                begin: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd',
                    change: studyStatisticIndex.utils.startChange
                },
                end: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd',
                    change: studyStatisticIndex.utils.endChange
                }
            },
            window: {
                detailUnitWindow: {
                    options: {
                        title: false,
                        modal: true,
                        visible: false
                    }
                }
            },

            studyStatisticGrid: {
                selectable: true,
                scrollable: false,
                pageable: {
                    refresh: true,
                    buttonCount: 10,
                    pageSizes: true,
                    pageSize: 10
                },
                // 每个行的模板定义,
                rowTemplate: kendo.template(studyStatisticIndex.uiTemplate.studyStatisticGridRow()),
                noRecords: {
                    template: '暂无数据'
                },
                dataBinding: function (e) {
                    kendoGrid.nullDataDealLeaf(e);
                },
                dataSource: {
                    serverPaging: true,
                    serverSorting: true,
                    page: 1,
                    pageSize: 10, // 每页显示的数据数目
                    requestStart: function (e) {
                        if ($scope.model.statisticBeginTime && !$scope.model.statisticEndTime) {
                            $scope.globle.showTip('请选择统计结束时间', 'warning');
                            e.preventDefault();
                        }
                        if (!$scope.model.statisticBeginTime && $scope.model.statisticEndTime) {
                            $scope.globle.showTip('请选择统计开始时间!', 'warning');
                            e.preventDefault();
                        }
                    },
                    transport: {
                        parameterMap: function (data, type) {
                            if (type === 'read') {
                                var temp = {}, params = $scope.model;
                                if (data.sort) {
                                    if (data.sort[0]) {
                                        temp.sortKey = data.sort[0].field;
                                        temp.direction = data.sort[0].dir;
                                    }
                                }
                                temp.pageNo = data.page;
                                temp.pageSize = data.pageSize;
                                temp.lessonName = params.lessonName;
                                temp.unitId = params.unitId;
                                temp.buildSelf = params.buildSelf;

                                if (params.statisticBeginTime) {
                                    temp.statisticBeginTimeMills = $scope.node.statisticBeginTime.value().getTime();
                                } else {
                                    temp.statisticBeginTimeMills = -1;
                                }

                                if (params.statisticEndTime) {
                                    // 结束时间 + (23:59:59) * 1000
                                    temp.statisticEndTimeMills = $scope.node.statisticEndTime.value().getTime() + 86399000;
                                } else {
                                    temp.statisticEndTimeMills = -1;
                                }
                                return temp;
                            }
                            return data;
                        },
                        read: {
                            url: '/web/admin/lessonStudyStatistic/index',
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
                                $scope.globle.alert('错误', '课程学习情况统计数据加载失败!');
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
                            return response.totalSize;
                        },
                        data: function (response) {
                            return response.info;
                        }
                    }
                },
                // 选中切换的时候改变选中行的时候触发的事件
                sortable: true,
                columns: [
                    {title: 'No.', width: 60},
                    {title: '课程名称'},
                    {title: '创建单位', width: 180},
                    {field: 's', title: '学习次数', width: 100},
                    {field: 'p', title: '赞数', width: 80},
                    {field: 'a', title: '踩数', width: 80},
                    {title: '操作', width: 160}
                ]
            }
        };

        $scope.events = {

            showUnitPopup: function (type) {
                if (type === 1) {
                    $scope.node.lessonCreateUnitPopup.open();
                } else {
                    $scope.node.employeeUnitPopup.open();
                }
            },

            unitValueChange: function (type) {
                if (type === 1) {
                    $scope.model.unitId = null;
                } else {
                    $scope.model.employeeUnitId = null;
                }
            },

            queryByEnter: function (e) {
                if (e.keyCode == 13) {
                    this.reloadStudyStatisticGrid(e);
                }
            },

            reloadStudyStatisticGrid: function (e) {
                e.preventDefault();
                $scope.node.studyStatisticGrid.dataSource.page(1);
            },

            view: function (e, dataItem) {
                // e.preventDefault();
                $state.go('states.studyStatistic.lessonView', {
                    courseId: dataItem.lessonId
                });
            },

            detail: function (e, dataItem) {
                e.preventDefault();

                $scope.model.detailLessonId = dataItem.lessonId;
                $scope.model.detailLessonName = dataItem.lessonName;

                studyStatisticIndex.utils.initialEmployeeUnit();
                studyStatisticIndex.utils.initialUnitStudyStatisticGrid();
                $scope.node.detailUnitWindow.center().open();
            },

            reloadUnitStudyStatisticGrid: function (e) {
                e.preventDefault();
                $scope.node.unitStudyStatisticGrid.dataSource.page(1);
            },

            closeDetailUnitWindow: function (e) {
                e.preventDefault();
                $scope.node.detailUnitWindow.close();
            }
        };

    }];
});
