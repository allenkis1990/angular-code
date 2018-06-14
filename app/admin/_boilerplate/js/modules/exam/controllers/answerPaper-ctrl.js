define(function () {
    'use strict';
    return ['$scope', 'examService', 'KENDO_UI_GRID', 'kendo.grid', function ($scope, examService, KENDO_UI_GRID, kendoGrid) {
        var roundId = $scope.$stateParams.id;
        $scope.model = {
            examSearch: {
                examRoundId: roundId,
                end: '-1',
                correctEnd: '-1',
                pass: '-1'
            }
        };

        $scope.events = {
            choiceAnswerPaper: function (type) {
                switch (type) {
                    case 0:
                        $scope.model.examSearch.end = '-1';
                        break;
                    case 1:
                        $scope.model.examSearch.end = '0';
                        break;
                    case 2:
                        $scope.model.examSearch.end = '1';
                        break;
                    case 3:
                        $scope.model.examSearch.end = '2';
                        break;
                    case 4:
                        $scope.model.examSearch.correctEnd = '-1';
                        break;
                    case 5:
                        $scope.model.examSearch.correctEnd = '0';
                        break;
                    case 6:
                        $scope.model.examSearch.correctEnd = '1';
                        break;
                    case 7:
                        $scope.model.examSearch.pass = '-1';
                        break;
                    case 8:
                        $scope.model.examSearch.pass = '0';
                        break;
                    case 9:
                        $scope.model.examSearch.pass = '1';
                        break;
                }
                $scope.node.gridInstance.dataSource.page(0);
            },
            searchAnswerPaper: function () {
                getRoundStatisticsInfoByRoundId(roundId);
                $scope.node.gridInstance.dataSource.page(0);
            },
            answerPaperView: function (id) {
                examService.getExamViewUrl(id).then(function (data) {
                    window.open(data.info);
                });
            },
            mark: function (id) {
                examService.getExamMarkUrl(id).then(function (data) {
                    if (!data.status) {
                        $scope.globle.showTip(data.info, 'error');
                    } else {
                        window.open(data.info);
                    }

                });
            },
            remark: function (id) {
                examService.getExamReMarkUrl(id).then(function (data) {
                    if (!data.status) {
                        $scope.globle.showTip(data.info, 'error');
                    } else {
                        window.open(data.info);
                    }
                });
            },
            queryByEnter: function (e) {
                if (e.keyCode == 13) {
                    this.searchAnswerPaper();
                }
            }
        };

        function getRoundStatisticsInfoByRoundId (roundId) {
            examService.getRoundStatisticsInfoByRoundId(roundId).then(function (data) {
                $scope.roundStatisticsInfo = data.info;
            });
        }

        getRoundStatisticsInfoByRoundId(roundId);


        //function getRoundStatisticsInfo(){
        //    examService.getRoundStatisticsInfo().then(function(data){
        //        $scope.roundStatisticsInfo=data.info;
        //    })
        //}
        //getRoundStatisticsInfo();
        // 构建表格的内容模板
        var gridRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');


            result.push('<td>');
            result.push('#: studentName #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: jobName #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: organizationName #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: inExamTime==null ?\'/\':inExamTime #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: inExamTime==null||correctEnd==false ?\'/\' : score #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: inExamTime==null||correctEnd==false ?\'/\' : (pass ==true ?\'及格\' : \'不及格\') #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: correctEnd ==true ?\'是\' : \'否\' #');
            result.push('</td>');


            result.push('<td>');
            result.push('<button class="table-btn"  ng-click="events.answerPaperView(\'#: id #\',\'#: correctEnd #\')">查看</button>');
            result.push('<button class="table-btn" ng-show="\'#: correctEnd #\'===\'false\'" ng-disabled="#: inExamTime==null #"  ng-click="events.mark(\'#: id #\')">阅卷</button>');
            result.push('<button class="table-btn" ng-show="\'#: correctEnd #\'===\'true\'"  ng-click="events.remark(\'#: id #\')">复审</button>');
            result.push('</td>');

            result.push('</tr>');
            gridRowTemplate = result.join('');
        })();

        $scope.ui = {
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
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(gridRowTemplate),
                    noRecords: {
                        template: '暂无数据'
                    },
                    scrollable: false,
                    selectable: true,
                    dataBinding: function (e) {
                        $scope.model.gridReturnData = e.items;
                        kendoGrid.nullDataDealLeaf(e);
                    },
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
                                        'searchDto.examRoundId': $scope.model.examSearch.examRoundId,
                                        'searchDto.studentName': $scope.model.examSearch.studentName,
                                        'searchDto.jobName': $scope.model.examSearch.jobName,
                                        'searchDto.organizationName': $scope.model.examSearch.organizationName,
                                        'searchDto.enterTimeBegin': $scope.model.examSearch.enterTimeBegin,
                                        'searchDto.enterTimeEnd': $scope.model.examSearch.enterTimeEnd,
                                        'searchDto.end': $scope.model.examSearch.end,
                                        'searchDto.correctEnd': $scope.model.examSearch.correctEnd,
                                        'searchDto.pass': $scope.model.examSearch.pass
                                    };
                                }
                            },
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/exam/findAnswerExamPaperPage',
                                dataType: 'json'
                            }
                        }
                    },
                    // 选中切换的时候改变选中行的时候触发的事件
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        pageSize: 5,
                        buttonCount: 10
                    },
                    columns: [
                        {title: '学员名称'},
                        {title: '岗位名称', width: 250},
                        {title: '机构', width: 100},
                        {title: '进入考试时间', width: 150},
                        {title: '考试成绩', width: 130},
                        {title: '是否及格', width: 80},
                        {title: '是否阅卷', width: 80},
                        {title: '操作', width: 160}
                    ]
                }
            }
        };
        $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);
    }];
});
