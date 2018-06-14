define(function () {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_dialog', '$http', '$timeout', 'hbUtil', 'genQueryData',
            function ($scope, HB_dialog, $http, $timeout, hbUtil, genQueryData) {

                $scope.model = {
                    query: {},
                    node: {}
                };

                /*$scope.timeConfig = {
                    open: function (e) {
                        this.$scope = $scope;
                        // this.endTime = $scope.model.endTime;
                        genQueryData.setMaxDate.call(this, e);

                    }
                };*/
                $scope.$watch('model.query.trainClass', function (newValue, oldValue) {
                    if (newValue) {
                        if (newValue !== null && newValue !== '' && newValue !== undefined) {
                            //console.log($scope.lwhSkuModel);

                            if ($scope.skuParamsLearingDetail !== undefined) {
                                angular.forEach($scope.skuParamsLearingDetail.skuPropertyList, function (item) {
                                    item.skuPropertyValue = '';
                                });
                            }

                        }
                    }
                });

                $scope.config = {
                    examResultStatus: new hbUtil.kendo.config.combobox({
                        autoBind: true,
                        placeholder: ' 考核结果',
                        dataSource: [
                            {optionId: '-1', name: '全部'},
                            {optionId: '0', name: '未通过'},
                            {optionId: '1', name: '已通过'}
                        ]
                    }),
                    learningProgressStatus: new hbUtil.kendo.config.combobox({
                        autoBind: true,
                        placeholder: '学习进度',
                        dataSource: [
                            {optionId: '-1', name: '全部'},
                            {optionId: '1', name: '未学习'},
                            {optionId: '2', name: '学习中'},
                            {optionId: '3', name: '已完成'}

                        ]
                    })
                };

                /* $scope.config = {
                     // timesCombo: new hbUtil.kendo.config.combobox({
                     //     placeholder: '次数',
                     //     dataSource: timesComboDataSource
                     // })
                 };*/


                function genQuery (data) {
                    console.log(data);
                    $.ajax({
                        url: '/web/admin/learningDetailStatistics/findLearningDetailTotal',
                        method: 'get',
                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                        data: genQueryData.genQuery({}, $scope.model.query)
                    }).then(function (data) {
                        $timeout(function () {
                            $scope.model.totalCount = data.info;
                        });

                        console.log($scope.model.totalCount);
                    }, function (data) {
                        console.log(data.info);
                    });
                    genQueryData.genQuery(data, $scope.model.query);

                    data.queryParam.qualified = $scope.model.query.qualified && $scope.model.query.qualified.optionId;
                    data.queryParam.studyStatus = $scope.model.query.studyStatus && $scope.model.query.studyStatus.optionId;
                    data.queryParam.studentName = $scope.model.query.studentName;
                    data.queryParam.loginInput = $scope.model.query.loginInput;
                    /*    if (data.queryParam.tempLearningYears && data.queryParam.tempLearningYears.length > 0) {
                            data.queryParam.isAlltempLearningYears = $scope.model.query.isAlltempLearningYears;
                        }*/
                    if ($scope.model.query.skuParamsLearingDetail) {
                        data.queryParam = angular.extend(data.queryParam, $scope.model.query.skuParamsLearingDetail);
                    }

                    return data;
                }

                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/learningDetailStatistics/findLearingDeatilByQuery', {}, {
                        rebuild: function (data, totalSize) {
                            /*      $.ajax({
                                      url: "/web/admin/learningDetailStatistics/findLearningDetailTotal",
                                      method: 'get',
                                      contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                      data:  genQueryData.genQuery({}, $scope.model.query)
                                  }).then(function (data) {
                                      $scope.model.totalCount = data.info;
                                  }, function (data) {
                                      console.log(data.info);
                                  });*/
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
                        result.push('<td>');
                        result.push('#:$index#');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('<p> 姓名：#:nickname#</p>');
                        result.push('<p>身份证：#:uniqueData#</p>');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#:unitName ||"-"#');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: studyTypeName #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: trainClassName #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: openTime #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: schedule# %');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: examScore #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('<span ng-if="#: qualified===1 #">通过</span>');
                        result.push('<span ng-if="#: qualified===0 #">未通过</span>');
                        result.push('</td>');


                        result.push('</tr>');


                        result = result.join('');
                        return result;
                    })();

                $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template(rowTemplate), [
                    {field: 'no', title: 'No', width: 80},
                    {field: 'commodityName', title: '学员信息', width: 230},
                    {field: 'attr', title: '单位名称', sortable: false, width: 150},
                    {field: 'onSaleState', title: '类别', sortable: false, width: 150},
                    {field: 'saleState', title: '培训班', sortable: false, width: 200},
                    {field: 'credit', title: '开通时间', sortable: false, width: 200},
                    {field: 'price', title: '学习进度', sortable: false, width: 80},
                    {field: 'credit', title: '成绩（分）', sortable: false, width: 100},
                    {field: 'credit', title: '考核结果', width: 80}

                ], {}, {
                    sortable: false
                });

                $scope.events = {
                    genReportQuery: function () {
                        return genQuery({});
                    }
                };

                $scope.permission = {
                    search: 'learningDetail/search',
                    exportOut: 'learningDetail/export',
                    reset: 'learningDetail/reset'
                    /*   learnTimeYear: 'passedPerson/trainingYear',*/
                    //learnCategory: 'learningDetail/trainingType',
                    //selectClass: 'learningDetail/searchTrainClass'
                };

                $scope.timeConfig = {
                    open: function (e) {

                        this.$scope = $scope;
                        this.isNotSbMode = true;
                        genQueryData.setMaxDate.call(this, e);

                    }
                };

                $.ajax({
                    url: '/web/admin/learningDetailStatistics/findLearningDetailTotal',
                    method: 'get',
                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                    data: genQueryData.genQuery({}, $scope.model.query)
                }).then(function (data) {
                    $timeout(function () {
                        $scope.model.totalCount = data.info;
                    });
                }, function (data) {
                    console.log(data.info);
                });
            }]
    };
});