define(function (regionLearning) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'hbUtil', 'genQueryData', '$timeout', '$state', function ($scope, hbUtil, genQueryData, $timeout, $state) {
            $scope.model = {
                query: {}
            };

            var stateCur = $state.current.name;
            genQueryData[stateCur] = function () {
                console.log($scope.model.query);
                $scope.model.query.trainClass = {a: 1};
                $timeout(function () {
                    $scope.model.query.trainClass = undefined;
                });

                //$scope.model.query.trainClass='111';
                //$scope.model.query.trainClass=undefined;
            };

            var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/learningStatistics/findAreaLearningInfoByQuery', {}, {
                rebuild: function (data) {
                    return hbUtil.kendo.dataSource.setIndex(gridDataSource, data);
                },
                parameterMap: function (data, type) {

                    //data.pageNo = data.page;

                    genQueryData.genQuery(data, $scope.model.query);
                    if ($scope.skuParamsRegionLearning) {
                        data.queryParam = angular.extend(data.queryParam, $scope.skuParamsRegionLearning);
                    }
                    data.queryParam.regionType = 1;
                    return data;
                }
            });

            var rowTemplate = (function () {

                var result = [];
                result.push('<tr ng-class="{summaryRow: dataItem.$index===0}">');

                result.push('<td ng-if="dataItem.$index>0">');
                result.push('#: $index#');
                result.push('</td>');

                result.push('<td  colspan="b{{dataItem.$index===0?2:1}}">');
                result.push('#: regionName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: netEstablish #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: notLearnYet #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: learning #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: learned #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: exammed #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: qualified #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: qualifiedRate #');
                result.push('</td>');

                result.push('</tr>');

                result = result.join('');
                return result;
            })();

            var isInit = true,

                initTreeWatch = $scope.$watch('model.query.region', function (newValue, oldValue) {
                    if (newValue && newValue.id && isInit) {
                        gridDataSource.read();
                        isInit = false;
                        initTreeWatch();
                    }
                });

            $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template(rowTemplate), [
                {
                    template: 'b{{dataItem.$index > 0 ? dataItem.$index:""}}',
                    title: 'No.',
                    width: 50
                },
                {
                    field: 'regionName',
                    title: '地区'
                },
                {
                    field: 'netEstablish',
                    title: '净开通',
                    width: 100
                },
                {
                    field: 'notLearnYet',
                    title: '未学习',
                    width: 100
                },
                {
                    field: 'learning',
                    title: '学习中',
                    width: 100
                },
                {
                    field: 'learned',
                    title: '已学完',
                    width: 60
                },
                {
                    field: 'exammed',
                    title: '已考试',
                    width: 100
                },
                {
                    field: 'qualified',
                    title: '已合格',
                    width: 100
                },
                {
                    field: 'qualifiedRate',
                    title: '合格率',
                    width: 100
                }
            ], {}, {
                sortable: false,
                pageAble: false,
                autoBind: false
            });

            $scope.permission = {
                search: 'regionLearning/search',
                exportOut: 'regionLearning/export',
                learnTimeYear: 'regionLearning/learnTimeYear',
                titleLevel: 'regionLearning/titleLevel',
                learnCategory: 'regionLearning/learnCategory',
                region: 'regionLearning/region',
                reset: 'regionLearning/reset',
                selectClass: 'regionLearning/searchTrainClass'
            };
        }]
    };
});