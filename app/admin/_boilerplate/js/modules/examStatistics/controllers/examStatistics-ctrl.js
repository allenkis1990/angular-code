define(function () {
    'use strict';
    return ['$scope',
        '$sce',
        'KENDO_UI_GRID',
        'KENDO_UI_TREE',
        'KENDO_UI_EDITOR',
        'kendo.grid',
        '$state',
        function ($scope, $sce, KENDO_UI_GRID, KENDO_UI_TREE, KENDO_UI_EDITOR, kendoGrid, $state) {
            $scope.model = {
                //查询参数
                queryParam: {
                    unitName: '',//组织机构名称
                    statisticBeginTimeMills: '',//统计开始时间（所选日期+当前时分）
                    statisticEndTimeMills: '',//统计结束时间（所选日期+当前时分）
                    pageNo: 1,//当前页码
                    pageSize: 10//页大小
                },
                statisticTimeBegin: '',//统计时间开始，用于日期控件显示
                statisticTimeEnd: '',//统计时间结束，用于日期控件显示
                startTime: '',//用于显示
                endTime: ''//用于显示
            };

            $scope.$watch('model.statisticTimeBegin', function (newValue, oldValue) {
                $scope.model.startTime = '';
                $scope.model.startTime = $scope.model.statisticTimeBegin == '' ? '' : $scope.model.statisticTimeBegin + ' 00:00';
                $scope.model.endTime = '';
                $scope.model.endTime = $scope.model.statisticTimeEnd == '' ? '' : $scope.model.statisticTimeEnd + ' 23:59';
            });
            $scope.$watch('model.statisticTimeEnd', function (newValue, oldValue) {
                $scope.model.startTime = '';
                $scope.model.startTime = $scope.model.statisticTimeBegin == '' ? '' : $scope.model.statisticTimeBegin + ' 00:00';
                $scope.model.endTime = '';
                $scope.model.endTime = $scope.model.statisticTimeEnd == '' ? '' : $scope.model.statisticTimeEnd + ' 23:59';
            });
            $scope.ui = {};

            $scope.node = {
                statisticTimeBegin: null,//统计开始时间
                statisticTimeEnd: null,//统计结束时间
                gridInstance: null
            };

            $scope.events = {
                /**
                 * 主页面列表数据查询
                 * @constructor
                 */
                MainPageQueryList: function (e) {
                    e.stopPropagation();
                    if ($scope.model.statisticTimeBegin == '' && $scope.model.statisticTimeEnd != '') {
                        $scope.globle.showTip('请选择统计开始日期！', 'warning');
                        return;
                    }
                    if ($scope.model.statisticTimeBegin != '' && $scope.model.statisticTimeEnd == '') {
                        $scope.globle.showTip('请选择统计结束日期！', 'warning');
                        return;
                    }
                    if ($scope.model.statisticTimeBegin != '') {
                        $scope.model.queryParam.statisticBeginTimeMills = $scope.node.statisticTimeBegin.value().getTime();
                    } else {
                        $scope.model.queryParam.statisticBeginTimeMills = '';
                    }
                    if ($scope.model.statisticTimeEnd != '') {
                        $scope.model.queryParam.statisticEndTimeMills = $scope.node.statisticTimeEnd.value().getTime() + 86399000;
                    } else {
                        $scope.model.queryParam.statisticEndTimeMills = '';
                    }

                    $scope.model.queryParam.pageNo = 1;
                    $scope.node.gridInstance.pager.page(1);
                },
                /**
                 * 主页面条件查询时在条件输入框回车提交查询
                 */
                pressEnterKey: function (e) {
                    e.stopPropagation();
                    if (e.keyCode == 13) {
                        $scope.events.MainPageQueryList(e);
                    }
                }
            };

            var ButtonUtils = {
                //转换日期格式 HH:mm
                formatDate: function (date) {
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    var d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    var h = date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    h = h < 10 ? ('0' + h) : h;
                    minute = minute < 10 ? ('0' + minute) : minute;
                    second = second < 10 ? ('0' + second) : second;

                    return ' ' + h + ':' + minute;
                },

                //申请开始时间变化
                startChange: function () {
                    var startDate = $scope.node.statisticTimeBegin.value(),
                        endDate = $scope.node.statisticTimeEnd.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.statisticTimeEnd.min(startDate);
                    } else if (endDate) {
                        $scope.node.statisticTimeBegin.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.statisticTimeBegin.max(endDate);
                        $scope.node.statisticTimeEnd.min(endDate);
                    }
                },
                //申请结束时间变化
                endChange: function () {
                    var endDate = $scope.node.statisticTimeEnd.value(),
                        startDate = $scope.node.statisticTimeBegin.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.statisticTimeBegin.max(endDate);
                    } else if (startDate) {
                        $scope.node.statisticTimeEnd.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.statisticTimeBegin.max(endDate);
                        $scope.node.statisticTimeEnd.min(endDate);
                    }
                },

                getDateStr: function (date, AddDayCount) {
                    date.setDate(date.getDate() + AddDayCount);//获取AddDayCount天后的日期
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;//获取当前月份的日期
                    var d = date.getDate();
                    return y + '-' + m + '-' + d;
                }
            };

            //定义列表页每一行的数据模板
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td title="#: unitName #">');
                result.push('#: unitName #');
                result.push('</td>');

                result.push('<td title="#: totalExam #">');
                result.push('#: totalExam #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: planExamUserNumber #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: actualExamUserNumber #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: joinExamRate #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: passNumber #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: failNumber #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: passRate #');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            $scope.ui = {
                editor: KENDO_UI_EDITOR,
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
                                    url: '/web/admin/examStatistic/findByQuery',
                                    data: function (e) {
                                        var temp = {queryParam: {sort: e.sort}}, params = $scope.model.queryParam;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.queryParam[key] = params[key];
                                                    //temp[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.queryParam.pageNo = e.page;
                                        temp.queryParam.pageSize = e.pageSize;
                                        return temp;
                                    },
                                    dataType: 'json',
                                    error: function (data) {
                                        $scope.globle.showTip(data.info, 'error');
                                    }
                                }
                            },
                            page: 1,
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            i = 1;
                                        _.forEach(viewData, function (row) {
                                            row.index = i++;
                                        });
                                        return response;
                                    } else {
                                        $scope.globle.alert('错误', '数据加载失败!');
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
                                    if (response.status) {
                                        var datas = response.info;
                                        return datas;
                                    } else {
                                        $scope.globle.showTip(response.info, 'error');
                                        return [];
                                    }
                                } // 指定数据源
                            },
                            serverPaging: true,
                            serverSorting: true //远程排序字段
                        },
                        selectable: true,
                        scrollable: false,//第一次加载时的蒙板效果
                        dataBinding: function (e) {
                            //$scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            pageSize: 10,
                            buttonCount: 10/*,
                             change: function (e) {
                             $scope.model.queryParam.pageNo = parseInt(e.index, 10);
                             $scope.node.gridInstance.dataSource.read();
                             }*/
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {field: 'index', title: '序号', width: 50, sortable: false},
                            {field: 'unitName', title: '机构名称', sortable: false},
                            {field: 'totalExam', title: '考试数量'},
                            {field: 'planEuNumber', title: '应考人数'},
                            {field: 'actualEuNumber', title: '参考人数'},
                            {field: 'joinRate', title: '参考率'},
                            {field: 'passNumber', title: '及格人数'},
                            {field: 'failNumber', title: '不及格人数'},
                            {field: 'passRate', title: '及格率'}
                        ]
                    }
                },
                //日期控件
                datePicker: {
                    //列表日期控件-开始
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            height: 10,
                            change: ButtonUtils.startChange

                        }
                    },
                    //列表日期控件-结束
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: ButtonUtils.endChange
                        }
                    }
                }
            };
            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);

        }];
});
