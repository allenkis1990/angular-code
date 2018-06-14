define(function () {
    'use strict';
    return ['$scope',
        '$sce',
        'KENDO_UI_GRID',
        'KENDO_UI_TREE',
        'KENDO_UI_EDITOR',
        'kendo.grid',
        '$state',
        '$stateParams',
        function ($scope, $sce, KENDO_UI_GRID, KENDO_UI_TREE, KENDO_UI_EDITOR, kendoGrid, $state, $stateParams) {
            $scope.model = {
                //查询参数
                queryParam: {
                    organizationId: $stateParams.organizationId,//组织机构Id
                    studentName: '',//学员名称
                    statisticBeginTimeMills: $stateParams.statisticBeginTime == '' ? '' : $stateParams.statisticEndTime == '' ? '' : $stateParams.statisticBeginTime,//统计开始时间（所选日期+当前时分）
                    statisticEndTimeMills: $stateParams.statisticBeginTime == '' ? '' : $stateParams.statisticEndTime == '' ? '' : $stateParams.statisticEndTime,//统计结束时间（所选日期+当前时分）
                    pageNo: 1,//当前页码
                    pageSize: 10//页大小
                },
                startTime: $stateParams.startTime,//用于显示 统计时间
                endTime: $stateParams.endTime,//用于显示 统计时间
                organizationName: $stateParams.organizationName,//用于显示 单位名称
                totalCredit: $stateParams.totalCredit//用于显示 总学分
            };


            $scope.ui = {};

            $scope.node = {
                gridInstance: null
            };

            $scope.events = {
                /**
                 * 主页面列表数据查询
                 * @constructor
                 */
                MainPageQueryList: function (e) {
                    e.stopPropagation();
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

                result.push('<td title="#: studentName #">');
                result.push('#: studentName #');
                result.push('</td>');

                result.push('<td title="#: departmentName #">');
                result.push('#: departmentName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: totalCredit #');
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
                                    url: '/web/admin/creditStatistic/findByUnitId',
                                    data: function (e) {
                                        //
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
                            serverPaging: true
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
                            {field: 'studentName', title: '姓名', sortable: false},
                            {field: 'departmentName', title: '所属部门', sortable: false},
                            {field: 'totalCredit', title: '总计学分'}
                        ]
                    }
                }
            };
            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);

        }];
});
