define(function (regionStatistical) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'hbUtil', 'genQueryData', function ($scope, hbUtil, genQueryData) {

            $scope.model = {
                query: {}
            };
            var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/openStatistics/getYearOpenStatistics', {}, {
                rebuild: function (data) {
                    return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, undefined, true);
                },
                parameterMap: function (data, type) {

                    data.pageNo = data.page;

                    genQueryData.genQuery(data, $scope.model.query);

                    return data;
                }
            });

            $scope.datePickerConfig = {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                open: function () {
                    var today = new Date(),
                        yesToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                    this.max(yesToday);

                    this.min(genQueryData.minDate);
                }
            };

            var rowTemplate = (function () {

                var result = [];
                result.push('<tr ng-class="{summaryRow: dataItem.$index===0 || dataItem.isSummary}">');

                result.push('<td ng-if="dataItem.$index>0&& !dataItem.isSummary">');
                result.push('#: $index#');
                result.push('</td>');

                result.push('<td colspan="b{{dataItem.$index===0 || dataItem.isSummary?2:1}}">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: netOpenNum #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: qualified #');
                result.push('</td>');

                result.push('</tr>');

                result = result.join('');
                return result;
            })();

            $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template(rowTemplate), [
                {
                    template: 'b{{dataItem.$index > 0 ? dataItem.$index:""}}',
                    title: 'No.',
                    width: 50
                },
                {
                    field: 'name',
                    title: '地区'
                },
                {
                    field: 'netOpenNum',
                    title: '开通人次',
                    width: 100
                },
                {
                    field: 'qualified',
                    title: '合格人次',
                    width: 100
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
                search: 'annualEstablish/search',
                exportOut: 'annualEstablish/export',
                learnTimeYear: 'annualEstablish/learnTimeYear',
                titleLevel: 'annualEstablish/titleLevel',
                learnCategory: 'annualEstablish/learnCategory',
                reset: 'annualEstablish/reset',
                selectClass: 'annualEstablish/searchTrainClass'
            };
        }]
    };
});