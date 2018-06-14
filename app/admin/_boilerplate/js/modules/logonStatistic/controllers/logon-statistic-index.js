define(['echarts'], function (echart) {
    'use strict';

    return ['$scope', 'logonStatisticService', 'kendo.grid', function ($scope, logonStatisticService, kendoGrid) {
        var logonStatisticIndex = {};
        // [unitName], 这样设计的好处是与chart需要动态调整的数据的结构更重要的是索引是一致的, 方便操作
        var localChartDB = [],
            rendered = false,
            unitLogonChart = null,
            chartDefaultOption = {
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y: 'top',
                    // 图例是否选择, 动态调整部分
                    selected: {},
                    // 图例的元素, 动态调整部分
                    data: []
                },
                // 数据区域缩放, 非动态调整部分
                dataZoom: {
                    show: true,
                    realtime: true,
                    start: 0, // 0%开始
                    end: 100    // 100%结束
                },
                xAxis: [
                    {
                        // 坐标轴的标签样式
                        axisLabel: {
                            rotate: 30,
                            textStyle: {
                                align: 'center',
                                baseline: 'middle',
                                fontSize: 12,
                                fontWeight: 'bold'
                            }
                        },
                        // 横坐标标签，动态调整部分
                        data: []
                    }
                ],
                // Y坐标轴不参与动态调整
                yAxis: [
                    {
                        axisLabel: {
                            formatter: '{value} 次'
                        },
                        data: ['0', '10', '20', '30', '40', '50']
                    }
                ],
                series: [
                    //{
                    //    name: '福建省地税局',
                    //    type: 'line',
                    //    data: [15, 50, 56, 46, 22, 2, 27, 55, 76]
                    //}
                ]
            };

        // define data-binding variable
        angular.extend($scope, {
            ui: {},                     // Kendo component options config
            model: {},                  // data model
            node: {},                   // node for kendo component
            event: {}                   // intercept ui event
        });

        $scope.model = {
            dimension: 1,

            lessonCreateUnitParentId: null,
            lessonCreateUnitName: null,
            unitId: null,
            statisticBeginTime: null,
            statisticEndTime: null,

            employeeName: null,
            employeeUnitName: null,
            employeeUnitParentId: null,
            employeeUnitId: null
        };

        $scope.node = {
            statisticBeginTime: null,
            statisticEndTime: null,
            lessonCreateUnitPopup: null,
            lessonCreateUnitTree: null,

            employeeBeginTime: null,
            employeeEndTime: null,
            employeeUnitPopup: null,
            employeeUnitTree: null,
            employeeLogonTimesGrid: null
        };

        logonStatisticIndex.uiTemplate = {
            employeeLogonTimesGridRow: function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
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

                result.push('<td>');
                result.push('#: unit # / #: organization #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: loginCount #');
                result.push('</td>');

                result.push('</tr>');
                return result.join('');
            }
        };

        logonStatisticIndex.utils = {
            proxyCalender: function (dimension) {
                var proxy = {};
                if (dimension === 1) {
                    proxy.startDateNode = $scope.node.statisticBeginTime;
                    proxy.endDateNode = $scope.node.statisticEndTime;
                    proxy.startDate = $scope.node.statisticBeginTime.value();
                    proxy.endDate = $scope.node.statisticEndTime.value();
                } else if (dimension === 2) {
                    proxy.startDateNode = $scope.node.employeeBeginTime;
                    proxy.endDateNode = $scope.node.employeeEndTime;
                    proxy.startDate = $scope.node.employeeBeginTime.value();
                    proxy.endDate = $scope.node.employeeEndTime.value();
                }
                return proxy;
            },

            startChange: function (dimension) {
                var proxy = logonStatisticIndex.utils.proxyCalender(dimension);

                var startDate = proxy.startDate,
                    endDate = proxy.endDate;

                if (startDate) {
                    startDate = new Date(startDate);
                    startDate.setDate(startDate.getDate());
                    proxy.endDateNode.min(startDate);
                } else if (endDate) {
                    proxy.startDateNode.max(new Date(endDate));
                } else {
                    endDate = new Date();
                    proxy.startDateNode.max(endDate);
                    proxy.endDateNode.min(endDate);
                }
            },
            endChange: function (dimension) {
                var proxy = logonStatisticIndex.utils.proxyCalender(dimension);

                var endDate = proxy.endDate,
                    startDate = proxy.startDate;

                if (endDate) {
                    endDate = new Date(endDate);
                    endDate.setDate(endDate.getDate());
                    proxy.startDateNode.max(endDate);
                } else if (startDate) {
                    proxy.endDateNode.min(new Date(startDate));
                } else {
                    endDate = new Date();
                    proxy.startDateNode.max(endDate);
                    proxy.endDateNode.min(endDate);
                }
            },

            renderUnitLogonChart: function (unitId, unitName) {
                unitLogonChart = echart.init(document.getElementById('unit_logon_chart'));
                unitLogonChart.setOption(chartDefaultOption);
                logonStatisticIndex.utils.loadUnitLogonData(unitId, unitName);

                rendered = true;
                // legend、 xAxis、 yAxis
                unitLogonChart.resize();
            },

            formatDate: function (date) {
                if (date) {
                    var year = date.getFullYear(),
                        month = date.getMonth() + 1,
                        day = date.getDate();
                    return year + '-' + month + '-' + day;
                }
                return null;
            },

            loadUnitLogonData: function (unitId, unitName) {
                var cacheIndex = _.indexOf(localChartDB, unitName);
                // console.log('----' + unitName + '的缓存位置是: ' + cacheIndex);
                if (cacheIndex === -1) {
                    // 初始化前后相差30天: 30 * 24 * 3600 * 1000
                    var endDate = new Date(), beginDate = new Date();
                    beginDate.setTime(endDate.getTime() - 2592000000);

                    endDate.setHours(23);
                    endDate.setMinutes(59);
                    endDate.setSeconds(59);
                    $scope.model.statisticEndTime = logonStatisticIndex.utils.formatDate(endDate);
                    // $scope.node.statisticEndTime.value(endDate);

                    beginDate.setHours(0);
                    beginDate.setMinutes(0);
                    beginDate.setSeconds(0);
                    $scope.model.statisticBeginTime = logonStatisticIndex.utils.formatDate(beginDate);
                    // $scope.node.statisticBeginTime.value(beginDate);

                    var condition = {
                        unitIdList: [unitId],
                        statisticBeginTimeMills: beginDate.getTime(),
                        statisticEndTimeMills: endDate.getTime()
                    };
                    logonStatisticService.findUnitLogonTimes(condition).then(function (response) {
                        if (response.status) {
                            var data = response.info;
                            var legendData = data.unitNameList[0];
                            var xAxisLabel = data.dateRange;
                            var seriesData = data.unitLogonTimesList[0];
                            var option = unitLogonChart.getOption();
                            localChartDB.push(unitName);

                            option.legend.data.push({name: legendData});
                            option.legend.selected[legendData] = true;
                            option.xAxis[0].data = xAxisLabel;
                            option.series.push({
                                name: seriesData.unitName,
                                type: 'line',
                                data: seriesData.loginCounts
                            });

                            unitLogonChart.clear();
                            unitLogonChart.setOption(option);
                        }
                    });
                } else {
                    // 移除缓存
                    localChartDB.splice(cacheIndex, 1);

                    var option = unitLogonChart.getOption();
                    delete option.legend.selected[unitName];
                    option.legend.data.splice(cacheIndex, 1);
                    // option.xAxis[0].data.splice(cacheIndex, 1);
                    option.series.splice(cacheIndex, 1);

                    unitLogonChart.clear();
                    unitLogonChart.setOption(option);
                }
            },

            /**
             * 获取已选择的节点, 包括已展开的节点的子节点
             * @param nodes
             * @param checkedNodes
             */
            checkedUnitNodeIds: function (nodes, checkedNodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].checked) {
                        checkedNodes.push(nodes[i].unitId);
                    }

                    if (nodes[i].hasChildren) {
                        logonStatisticIndex.utils.checkedUnitNodeIds(nodes[i].children.view(), checkedNodes);
                    }
                }
            },

            /**
             * 批量渲染节点
             * @param renderData
             */
            renderUnitLoginChartBatch: function (data) {
                localChartDB = [];

                var legendData = data.unitNameList;
                var xAxisLabel = data.dateRange;
                var seriesData = data.unitLogonTimesList;
                var option = unitLogonChart.getOption();

                // 设置缓存及图例选中
                _.forEach(legendData, function (unitName) {
                    localChartDB.push(unitName);
                    option.legend.selected[unitName] = true;
                });

                // 设置图例
                option.legend.data = legendData;

                // 设置X坐标轴的标签
                option.xAxis[0].data = xAxisLabel;

                // 设置series
                option.series = [];
                _.forEach(seriesData, function (series) {
                    var data = {
                        name: series.unitName,
                        type: 'line',
                        data: series.loginCounts
                    };
                    option.series.push(data);
                });

                unitLogonChart.clear();
                unitLogonChart.setOption(option);
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
                            $scope.model.employeeUnitId = node.unitId;
                            $scope.$apply();

                            $scope.node.employeeLogonTimesGrid.dataSource.page(1);
                            $scope.node.employeeUnitPopup.close();
                        },
                        expand: function (e) {
                            var node = $scope.node.employeeUnitTree.dataItem(e.node);
                            $scope.model.employeeUnitParentId = node.unitId;
                        }
                    };
                } else {
                    $scope.model.employeeUnitName = null;
                    $scope.model.employeeUnitId = null;
                    $scope.node.employeeUnitTree.dataSource.read();
                }
            },

            /**
             * 初始化员工登陆统计的表格
             */
            initialEmployeeLogonTimesGrid: function () {
                if (!$scope.ui.employeeLogonTimesGrid) {
                    $scope.ui.employeeLogonTimesGrid = {
                        selectable: true,
                        scrollable: false,
                        pageable: {
                            refresh: true,
                            buttonCount: 5
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(logonStatisticIndex.uiTemplate.employeeLogonTimesGridRow()),
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
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        var temp = {}, params = $scope.model;
                                        if (data.sort) {
                                            if (data.sort[0]) {
                                                temp.sortDirection = data.sort[0].dir;
                                            }
                                        }
                                        temp.pageNo = data.page;
                                        temp.pageSize = data.pageSize;
                                        temp.name = params.employeeName;
                                        temp.unitId = params.employeeUnitId;

                                        if (params.employeeBeginTime) {
                                            temp.statisticBeginTimeMills = $scope.node.employeeBeginTime.value().getTime();
                                        } else {
                                            temp.statisticBeginTimeMills = -1;
                                        }

                                        if (params.employeeEndTime) {
                                            // 结束时间 + (23:59:59) * 1000
                                            temp.statisticEndTimeMills = $scope.node.employeeEndTime.value().getTime() + 86399000;
                                        } else {
                                            temp.statisticEndTimeMills = -1;
                                        }
                                        return temp;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/logonStatistic/findEmployeeLogonTimesPage',
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
                            {title: '序号', width: 60},
                            {title: '姓名', width: 180},
                            {title: '身份证号', width: 180},
                            {title: '手机号', width: 130},
                            {title: '所属机构'},
                            {field: 'p', title: '访问次数', width: 100}
                        ]
                    };
                } else {
                    $scope.node.employeeLogonTimesGrid.dataSource.page(1);
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
                                if (!rendered) {
                                    var firstNode = response.info[0];
                                    firstNode.checked = true;
                                    // 渲染折线图
                                    logonStatisticIndex.utils.renderUnitLogonChart(firstNode.unitId, firstNode.name);
                                }

                                return response.info;
                            },
                            model: {
                                hasChildren: 'hasChildren'
                            }
                        }
                    },
                    dataTextField: 'name',
                    checkboxes: true,
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
                    change: function () {
                        logonStatisticIndex.utils.startChange(1);
                    }
                },
                end: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd',
                    change: function () {
                        logonStatisticIndex.utils.endChange(1);
                    }
                },
                employeeBegin: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd',
                    change: function () {
                        logonStatisticIndex.utils.startChange(2);
                    }
                },
                employeeEnd: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd',
                    change: function () {
                        logonStatisticIndex.utils.endChange(2);
                    }
                }
            }
        };

        $scope.events = {

            toggleDimension: function (e, dimension) {
                e.preventDefault();

                $scope.model.dimension = dimension;
                if (dimension === 2) {
                    logonStatisticIndex.utils.initialEmployeeUnit();
                    logonStatisticIndex.utils.initialEmployeeLogonTimesGrid();
                }
            },

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

            queryUnitLogonTimes: function (e) {
                e.preventDefault();
                var condition = {}, params = $scope.model;

                if (params.statisticBeginTime) {
                    condition.statisticBeginTimeMills = $scope.node.statisticBeginTime.value().getTime();
                } else {
                    $scope.globle.showTip('请选择登陆统计开始时间', 'warning');
                    return;
                }
                if (params.statisticEndTime) {
                    // 结束时间 + (23:59:59) * 1000
                    condition.statisticEndTimeMills = $scope.node.statisticEndTime.value().getTime() + 86399000;
                } else {
                    $scope.globle.showTip('请选择登陆统计结束时间', 'warning');
                    return;
                }

                var checkedUnitIds = [];
                logonStatisticIndex.utils.checkedUnitNodeIds($scope.node.lessonCreateUnitTree.dataSource.view(), checkedUnitIds);
                if (checkedUnitIds.length) {
                    condition.unitIdList = checkedUnitIds;
                } else {
                    $scope.globle.showTip('请选择一个要查看的机构单位', 'warning');
                    return;
                }

                logonStatisticService.findUnitLogonTimes(condition).then(function (response) {
                    if (response.status) {
                        logonStatisticIndex.utils.renderUnitLoginChartBatch(response.info);
                    }
                });

            },

            queryByEnter: function (e) {
                if (e.keyCode == 13) {
                    this.reloadEmployeeLogonTimesGrid(e);
                }
            },

            reloadEmployeeLogonTimesGrid: function (e) {
                e.preventDefault();
                $scope.node.employeeLogonTimesGrid.dataSource.page(1);
            },

            reloadUnitStudyStatisticGrid: function (e) {
                e.preventDefault();
                $scope.node.employeeLogonTimesGrid.dataSource.page(1);
            }
        };
    }];
});
