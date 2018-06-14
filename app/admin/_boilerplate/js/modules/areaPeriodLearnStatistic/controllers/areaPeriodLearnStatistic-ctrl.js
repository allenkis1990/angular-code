define(function () {
    'use strict';
    return ['$scope', 'areaPeriodLearnStatisticService', 'HB_dialog', 'genQueryData', 'KENDO_UI_GRID', 'kendo.grid', '$state', 'TabService',
        function ($scope, areaPeriodLearnStatisticService, HB_dialog, genQueryData, KENDO_UI_GRID, kendoGrid, $state, TabService) {

            var utils;
            $scope.node = {
                //== index node
                areaPeriodGrid: null,
                workBeginTime: null,
                workEndTime: null
            };
            $scope.timeConfig = {
                open: function (e) {

                    this.$scope = $scope;
                    genQueryData.setMaxDate.call(this, e);

                },
                min: new Date(2017, 5, 14)
            };
            $scope.model = {

                totalTime: 0,//开通总学时
                totalPrice: 0,//开通总学时
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                chooseParams: {
                    activated: 0,
                    subjectId: '',
                    trainingYear: '',
                    commoditySkuName: '',
                    commoditySkuState: -1,
                    startCreateTime: '',
                    endCrateTime: ''
                }

            };


            $scope.events = {
                exportRegionPeriodStatistic: function () {
                    $scope.submitExportarea = false;
                    areaPeriodLearnStatisticService.exportRegionPeriodStatistic({
                        endTime: validateIsNull($scope.model.chooseParams.startCreateTime) === true ? 0 : parseTimeStrToLong($scope.model.chooseParams.startCreateTime),
                        startTime: validateIsNull($scope.model.chooseParams.endCrateTime) === true ? 0 : parseTimeStrToLong($scope.model.chooseParams.endCrateTime), /*+86399999*/
                        subjectId: $scope.model.chooseParams.subjectId,
                        trainingYearId: $scope.model.chooseParams.trainingYear,
                        regionType: $scope.model.chooseParams.regionType,
                        regionId: $scope.model.chooseParams.regionId

                    }).then(function (data) {

                        if (data.info) {
                            HB_dialog.success('提示', '导出成功');
                            /*  if(data.info==='success'){
                             HB_dialog.success ( '提示', '导出成功' );
                             }else{
                             HB_dialog.error ( '提示', '导出失败' );
                             }*/
                            $scope.submitExportarea = true;
                        } else {
                            HB_dialog.error('提示', '导出失败');
                            $scope.submitExportarea = true;
                        }
                    });
                },
                openLessonTypeTree: function () {
                    $scope.areaShow = !$scope.areaShow;
                },
                /**
                 * 获取地区
                 * @param dataItem
                 */
                getArea: function (dataItem) {

                    $scope.model.chooseParams.regionType = dataItem.regionPath.split('/').length - 1;
                    $scope.model.chooseParams.areaName = dataItem.name;
                    $scope.model.chooseParams.regionId = dataItem.id;
                    $scope.areaShow = false;
                },
                search: function () {
                    if ($scope.model.chooseParams.startCreateTime) {
                        if (!$scope.model.chooseParams.endCrateTime) {
                            HB_dialog.warning('警告', '请输入查询截止日期');
                            return false;
                        }
                    }
                    $scope.model.page.pageNo = 1;
                    $scope.node.areaPeriodGrid.pager.page(1);
                },
                clearUserPageParams: function () {
                    $scope.model.chooseParams.areaName = '';
                    $scope.model.chooseParams.areaId = '';
                    $scope.model.chooseParams.regionType = 0;
                    $scope.model.chooseParams.startCreateTime = '';
                    $scope.model.chooseParams.endCrateTime = '';
                    $scope.model.chooseParams.activated = 0;
                    $scope.model.chooseParams.subjectId = '';
                    $scope.model.chooseParams.trainingYear = '';
                    $scope.model.chooseParams.goodName = '';
                    $scope.model.chooseParams.lowprice = '';
                    $scope.model.chooseParams.hightprice = '';
                    $scope.model.chooseParams.regionId = '';
                },
                changeSubject: function () {

                },
                changeYear: function () {
                    angular.forEach($scope.model.yearList, function (item) {
                        if ($scope.model.chooseParams.trainingYear == item.optionId) {
                            $scope.model.yearName = item.name;
                        }
                    });
                }
            };

            //地区树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/administratorManage/getAreaByParentId?parentId=' + id,
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

            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                /*   result.push ( '<td title="#: name #">' );
                 result.push ( '合计 ' );
                 result.push ( '</td>' );*/
                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: purchaseUserCount #');

                result.push('</td>');

                result.push('<td>');
                result.push('#:allPeriod #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: publicAllPeriod #');
                result.push('</td>');

                result.push('<td>');

                result.push('#: professionAllPeriod #');

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
            var minDate = new Date(2017, 5, 14);
            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                },
                datePicker: {
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            open: function () {
                                var today = new Date(),
                                    yesToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                                //this.max ( minDate );
                                this.min(minDate);
                            },
                            change: utils.startChange
                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            open: function () {
                                var today = new Date(),
                                    yesToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                                // this.max ( yesToday );
                                //this.min ( endDate );
                            },
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
                areaPeriodGrid: {
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
                                    url: '/web/admin/regionPeriod/findRegionPeriodStatistic',
                                    data: function (e) {

                                        var temp = {
                                            /*pageNo             : e.page,*/
                                            //page:$scope.model.page.pageNo,
                                            /*pageSize           :  $scope.model.page.pageSize,*/
                                            startTime: validateIsNull($scope.model.chooseParams.startCreateTime) === true ? 0 : parseTimeStrToLong($scope.model.chooseParams.startCreateTime),
                                            endTime: validateIsNull($scope.model.chooseParams.endCrateTime) === true ? 0 : parseTimeStrToLong($scope.model.chooseParams.endCrateTime), /*+86399999*/
                                            subjectId: $scope.model.chooseParams.subjectId,
                                            trainingYearId: $scope.model.chooseParams.trainingYear,
                                            regionType: $scope.model.chooseParams.regionType,
                                            regionId: $scope.model.chooseParams.regionId
                                        };
                                        /*        $scope.pageNo = e.page;*/
                                        delete e.skip;
                                        delete e.page;
                                        delete e.take;
                                        delete e.pageSize;
                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            /* pageSize     : 10, // 每页显示的数据数目*/
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {

                                    angular.forEach(response.info, function (item) {
                                        $scope.model.totalPrice += item.period;
                                    });
                                    // 将会把这个返回的数组绑定到数据源当中
                                    return response;
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    if (response.code !== 200) {
                                        HB_dialog.error('提示', response.info);
                                        return [];
                                    } else {
                                        return response.info;
                                    }

                                } // 指定数据源
                            },
                            serverPaging: true, //远程获取书籍
                            serverSorting: true //远程排序字段
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
                        /* pageable   : {
                             refresh    : true,
                             pageSizes: [5,10,30,50],
                             pageSize   : 10,
                             buttonCount: 10
                             //change: function (e) {
                             //    $scope.model.page.pageNo = parseInt(e.index, 10);
                             //    //== !!important!! 这里重复了page(1)的作用
                             //    // $scope.node.areaPeriodGrid.dataSource.read();
                             //}
                         },*/
                        pageable: {
                            refresh: true,
                            numeric: false,
                            pageSizes: false,
                            previousNext: false,
                            info: false
                        },

                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {sortable: false, field: 'name', title: '地区', width: 130},
                            {sortable: false, field: 'typeName', title: '购课人数', width: 130},
                            {sortable: false, field: 'status', title: '购课总学时数', width: 90},
                            {sortable: false, field: 'period', title: '公需课总学时', width: 50},
                            {sortable: false, field: 'questionCount', title: '专业课总学时', width: 80}
                        ]
                    }
                }
            };
            $scope.ui.areaPeriodGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.areaPeriodGrid.options);

            function getSubjectAndYear () {
                //获取科目
                areaPeriodLearnStatisticService.getTitleLevelList().then(function (data) {
                    if (data.status) {
                        $scope.model.subjectList = data.info;
                        $scope.model.subjectList.unshift({
                            name: '选择科目',
                            optionId: ''
                        });
                    }
                });
                //获取年度
                areaPeriodLearnStatisticService.getTrainingYearList().then(function (data) {
                    if (data.status) {
                        $scope.model.yearList = data.info;
                        $scope.model.yearList.unshift({
                            name: '选择年度',
                            optionId: ''
                        });
                    }
                });
            }

            getSubjectAndYear();

            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            //时间字符串转毫秒
            function parseTimeStrToLong (str) {
                return kendo.parseDate(str).getTime();
            }
        }];

});
