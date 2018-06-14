define(function (regionStatistical) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_dialog', '$http', '$timeout', 'hbUtil', 'genQueryData',
            function ($scope, HB_dialog, $http, $timeout, hbUtil, genQueryData) {

                $scope.model = {
                    query: {},
                    node: {}
                };


                $scope.$watch('model.query.trainClass', function (newValue, oldValue) {
                    if (newValue) {
                        if (newValue !== null && newValue !== '' && newValue !== undefined) {
                            //console.log($scope.lwhSkuModel);
                            angular.forEach($scope.skuParamsPassedPerson.skuPropertyList, function (item) {
                                item.skuPropertyValue = '';
                            });
                        }
                    }
                });


                $scope.config = {
                    // timesCombo: new hbUtil.kendo.config.combobox({
                    //     placeholder: '次数',
                    //     dataSource: timesComboDataSource
                    // })
                };


                function genQuery (data) {
                    genQueryData.genQuery(data, $scope.model.query);
                    data.queryParam.userAccount = $scope.model.query.userAccount;
                    data.queryParam.userIdNum = $scope.model.query.userIdNum;
                    if (data.queryParam.tempLearningYears && data.queryParam.tempLearningYears.length > 0) {
                        data.queryParam.isAlltempLearningYears = $scope.model.query.isAlltempLearningYears;
                    }
                    if ($scope.skuParamsPassedPerson) {
                        data.queryParam = angular.extend(data.queryParam, $scope.skuParamsPassedPerson);
                    }

                    return data;
                }

                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/qualifiedStatistics/pageClassQualifiedStatistics', {}, {
                        rebuild: function (data, totalSize) {
                            $scope.model.totalSize = totalSize;
                            return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                        },
                        parameterMap: function (data, type) {
                            /* data.userAccount=$scope.model.query.userAccount;
                             data.userIdNum=$scope.model.query.userIdNum;*/
                            return genQuery(data);
                        }
                    }),
                    rowTemplate = (function () {

                        var result = [];
                        result.push('<tr>');
                        //
                        result.push('<td>');
                        result.push('#: $index#');
                        result.push('</td>');

                        result.push('<td class="tl">');
                        result.push('<div class="fei"><strong class="left">姓名：</strong><span class="right">#: userName # </span></div>');
                        result.push('<div class="fei"><strong class="left">身份证：</strong><span class="right">#: identityCardNum #</span></div>');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: certificateId || "-" #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: trainingYear #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: className #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: credit #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: examScore==null?"-":examScore #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: completedTime #');
                        result.push('</td>');

                        result.push('</tr>');

                        result = result.join('');
                        return result;
                    })();

                $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template(rowTemplate), [
                    {
                        field: '$index',
                        title: 'No.',
                        width: 50
                    },
                    {
                        field: 'name',
                        title: '学员信息',
                        width: 250
                    },
                    {
                        field: 'identified',
                        title: '涉密测绘成果专管员证书编号',
                        width: 210
                    },
                    {
                        field: 'loginInput',
                        title: '培训年度',
                        width: 100
                    },
                    {
                        field: 'phoneNumber',
                        title: '培训班名称'
                    },
                    {
                        field: 'jobGrade',
                        title: '学时',
                        width: 100
                    },
                    {
                        field: 'areaName',
                        title: '考试成绩（分）',
                        width: 160
                    },
                    {
                        field: 'noSignUpYear',
                        title: '合格时间',
                        width: 150
                    }
                ], {}, {
                    sortable: false
                });

                $scope.events = {
                    genReportQuery: function () {
                        return genQuery({});
                    }
                };

                $scope.permission = {
                    search: 'passedPerson/search',
                    exportOut: 'passedPerson/export',
                    reset: 'passedPerson/reset',
                    learnTimeYear: 'passedPerson/trainingYear',
                    learnCategory: 'passedPerson/trainingType',
                    selectClass: 'passedPerson/searchTrainClass'
                };

                $scope.timeConfig = {
                    open: function (e) {

                        this.$scope = $scope;
                        this.isNotSbMode = true;
                        genQueryData.setMaxDate.call(this, e);

                    }
                };


            }]
    };
});