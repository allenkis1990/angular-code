define(function () {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_dialog', 'hbUtil', 'genQueryData',
            function ($scope, HB_dialog, hbUtil, genQueryData) {
                $scope.lessonProvidersComboOptions = new hbUtil.kendo.config.combobox({
                    placeholder: '请选择课程提供商',
                    dataSource: hbUtil.kendo.dataSource.gridDataSource('/web/admin/courseChooseStatistic/findLessonProvider')
                });

                $scope.events = {};

                $scope.model = {
                    query: {}
                };
                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/courseChooseStatistic/findStatisticData', {}, {
                    rebuild: function (data) {
                        return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                    },
                    parameterMap: function (data, type) {

                        data.pageNo = data.page;

                        genQueryData.genQuery(data, $scope.model.query);
                        //data.queryParam.startTimeString = data.queryParam.startTime;
                        //data.queryParam.endTimeString = data.queryParam.endTime;
                        //delete data.queryParam.startTime;
                        //delete data.queryParam.endTime;
                        return data.queryParam;
                    }
                });

                $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, null, [
                    {
                        title: 'No.',
                        field: '$index',
                        width: 50
                    },
                    {
                        template: '<span title="#: courseName#">#: courseName#</span>',
                        title: '课程名称'
                    },
                    {
                        title: '提供商',
                        field: 'courseProviders',
                        width: 200
                    },
                    {
                        title: '选课人数',
                        field: 'humansCount',
                        width: 150
                    },
                    {
                        title: '选课次数',
                        field: 'timesCount',
                        width: 150
                    },
                    {
                        title: '已学数量',
                        field: 'learnedCount',
                        width: 150
                    }
                ], {}, {
                    sortable: false
                });

                $scope.events = {
                    genReportQuery: function () {
                        return genQueryData.genQuery({}, $scope.model.query);
                    }
                };

                $scope.permission = {
                    search: 'courseSelect/search',
                    exportOut: 'courseSelect/export',
                    learnTimeYear: 'courseSelect/learnTimeYear',
                    titleLevel: 'courseSelect/titleLevel',
                    learnCategory: 'courseSelect/learnCategory',
                    region: 'courseSelect/region',
                    reset: 'courseSelect/reset',
                    selectClass: 'courseSelect/searchTrainClass'
                };

                $scope.timeConfig = {
                    open: function (e) {

                        this.$scope = $scope;
                        genQueryData.setMaxDate.call(this, e);

                    }
                };
            }]
    };
});