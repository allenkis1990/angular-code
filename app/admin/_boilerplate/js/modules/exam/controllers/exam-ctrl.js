define(function () {
    'use strict';
    return ['$scope', 'examService', 'KENDO_UI_GRID', 'kendo.grid', '$state', 'HB_notification', function ($scope, examService, KENDO_UI_GRID, kendoGrid, $state, HB_notification) {
        $scope.model = {
            examSearch: {
                name: null,
                examPaperName: '',
                beginTimeBegin: null,
                beginTimeEnd: null,
                examRange: '-1',
                state: '-1',
                timeSection: '-1'
            }
        };

        $scope.events = {
            refresh: function () {
                $scope.node.examGridInstance.dataSource.page(1);
                getRoundStatisticsInfo();
            },
            cancelRelease: function (examId) {
                $scope.globle.confirm('提示', '确定取消安排？', function (dialog) {
                    return examService.cancelRelease(examId).then(function (data) {
                        dialog.doRightClose();
                        if (!data.status) {
                            $scope.globle.alert('操作失败!', data.info);
                        } else {
                            $scope.events.refresh();
                        }
                    });

                });
            },
            choiceExam: function (type) {
                switch (type) {
                    case 0:
                        $scope.model.examSearch.examRange = '-1';
                        break;
                    case 1:
                        $scope.model.examSearch.examRange = '1';
                        break;
                    case 2:
                        $scope.model.examSearch.examRange = '2';
                        break;
                    case 3:
                        $scope.model.examSearch.state = '-1';
                        break;
                    case 4:
                        $scope.model.examSearch.state = '0';
                        break;
                    case 5:
                        $scope.model.examSearch.state = '1';
                        break;
                    case 6:
                        $scope.model.examSearch.state = '2';
                        break;
                    case 7:
                        $scope.model.examSearch.timeSection = '-1';
                        $scope.model.examSearch.beginTimeEnd = '';
                        $scope.model.examSearch.beginTimeBegin = '';
                        break;
                    case 8:
                        $scope.model.examSearch.timeSection = '1';
                        $scope.model.examSearch.beginTimeEnd = '';
                        $scope.model.examSearch.beginTimeBegin = '';
                        break;
                    case 9:
                        $scope.model.examSearch.timeSection = '2';
                        $scope.model.examSearch.beginTimeEnd = '';
                        $scope.model.examSearch.beginTimeBegin = '';
                        break;
                    case 10:
                        $scope.model.examSearch.timeSection = '3';
                        $scope.model.examSearch.beginTimeEnd = '';
                        $scope.model.examSearch.beginTimeBegin = '';
                        break;
                    case 11:
                        $scope.model.examSearch.timeSection = '4';
                        $scope.model.examSearch.beginTimeEnd = '';
                        $scope.model.examSearch.beginTimeBegin = '';
                        break;
                    case 12:
                        $scope.model.examSearch.timeSection = '5';
                        $scope.model.examSearch.beginTimeEnd = '';
                        $scope.model.examSearch.beginTimeBegin = '';
                        break;
                    case 13:
                        $scope.model.examSearch.timeSection = '6';
                        $scope.model.examSearch.beginTimeEnd = '';
                        $scope.model.examSearch.beginTimeBegin = '';
                        break;
                    case 14:
                        if ($scope.model.examSearch.beginTimeEnd == null || $scope.model.examSearch.beginTimeEnd === '') {
                            $scope.globle.showTip('请输入要查询的考试时间范围的末尾时间', 'error');
                            return;
                        }
                        if ($scope.model.examSearch.beginTimeBegin == null || $scope.model.examSearch.beginTimeBegin === '') {
                            $scope.globle.showTip('请输入要查询的考试时间范围的起始时间', 'error');
                            return;
                        }
                        $scope.model.examSearch.timeSection = '-1';
                        break;
                }
                $scope.events.refresh();
            },
            toAnswerPaper: function (id) {
                $state.go('states.exam.answerPaper', {id: id});
            },
            examView: function (examRoundId, examRoundType) {
                $scope.node.windows.examView.open();
                var examView = angular.element('#examView');
                HB_notification.showLoadingMask(examView);
                examService.findExamViewById(examRoundId, examRoundType).then(function (data) {
                    HB_notification.showLoadingMask(examView);
                    $scope.model.examView = data.info;
                    HB_notification.hideLoadingMask(examView);
                });
            },
            searchExam: function () {
                $scope.node.examGridInstance.dataSource.page(1);
            },
            queryByEnter: function (e) {
                if (e.keyCode == 13) {
                    this.searchExam();
                }
            }
        };

        function getRoundStatisticsInfo () {
            examService.getRoundStatisticsInfo().then(function (data) {
                $scope.roundStatisticsInfo = data.info;
            });
        }

        getRoundStatisticsInfo();
        // 构建表格的内容模板
        var gridRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            //result.push('<td>');
            //result.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: id #"  class="k-checkbox" ng-checked="selected" />');
            //result.push('<label class="k-checkbox-label" for="check_#: id #"></label>');
            //result.push('</td>');

            result.push('<td>');
            result.push('#: examName #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: passScore #/#:totalScore #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: beginTime # <br> #: endTime #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: releaseUser #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: releaseUserCount #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: completeCount #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: throughCount #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: releaseTime #');
            result.push('</td>');

            result.push('<td>');
            result.push('<button class="table-btn"  ng-click="events.cancelRelease(\'#: id #\')">取消安排</button>');
            result.push('<button class="table-btn"  ng-click="events.examView(\'#: id #\',\'#: examModeType #\')">查看</button>');
            result.push('<button class="table-btn"  ng-click="events.toAnswerPaper(\'#: id #\')">答卷管理</button>');
            result.push('</td>');

            result.push('</tr>');
            gridRowTemplate = result.join('');
        })();

        $scope.ui = {
            windowOptions: {
                modal: true,
                visible: false,
                resizable: false,
                draggable: false,
                title: false,
                open: function () {
                    this.center();
                }
            },
            datePicker: {
                begin: {
                    options: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd',
                        change: $scope.events.startChange
                    }
                },
                end: {
                    options: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd',
                        change: $scope.events.endChange
                    }
                }
            },
            grid: {
                options: {
                    scrollable: false,
                    dataBinding: function (e) {
                        $scope.model.gridReturnData = e.items;
                        kendoGrid.nullDataDealLeaf(e);
                    },
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(gridRowTemplate),
                    dataSource: {
                        transport: {
                            parameterMap: function (data, type) {
                                var sortStr = '';
                                if (type == 'read') {
                                    if (data.sort) {
                                        var str = [];
                                        angular.forEach(data.sort, function (item, index) {
                                            str.push(item.field + ' ' + item.dir);
                                        });
                                        sortStr = str.join(',');
                                    }
                                    return {
                                        'page.pageSize': data.pageSize,
                                        'page.pageNo': data.page,
                                        'searchDto.name': $scope.model.examSearch.name,
                                        'searchDto.examPaperName': $scope.model.examSearch.examPaperName,
                                        'searchDto.beginTimeBegin': $scope.model.examSearch.beginTimeBegin,
                                        'searchDto.beginTimeEnd': $scope.model.examSearch.beginTimeEnd,
                                        'searchDto.examRange': $scope.model.examSearch.examRange,
                                        'searchDto.state': $scope.model.examSearch.state,
                                        'searchDto.timeSection': $scope.model.examSearch.timeSection
                                    };
                                }
                            },
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/exam/findPagerSearch',
                                dataType: 'json'
                            }
                        }
                    },
                    // 选中切换的时候改变选中行的时候触发的事件
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        pageSize: 10,
                        buttonCount: 10
                    },
                    columns: [
                        {title: '考试名称'},
                        {title: '及格分/总分', width: 100},
                        {title: '考试起止时间', width: 140},
                        {title: '发布者', width: 80},
                        {title: '安排人数', width: 80},
                        {title: '已交卷', width: 70},
                        {title: '已通过', width: 70},
                        {title: '发布时间', width: 150},
                        {title: '操作', width: 170}
                    ]
                }
            }
        };
        $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);
    }];
});
