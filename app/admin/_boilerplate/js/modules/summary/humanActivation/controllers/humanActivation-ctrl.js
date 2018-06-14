define(function (regionStatistical) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_dialog', '$http', '$timeout', 'hbUtil', 'genQueryData',
            function ($scope, HB_dialog, $http, $timeout, hbUtil, genQueryData) {

                $scope.model = {
                    query: {
                        isOver55: -1,
                        isAlltempLearningYears: false,
                        tempLearningYears: []
                    },
                    node: {}
                };

                function selectAll (checked) {
                    $scope.model.tempLearningYears = [];
                    if (checked) {
                        angular.forEach($scope.model.timeYear, function (item) {
                            $scope.model.tempLearningYears.push(item.name);
                        });
                    }
                }

                $scope.$watchCollection('model.tempLearningYears', function (newValue) {
                    if ($scope.model.timeYear) {
                        $scope.model.query.isAlltempLearningYears = checkSelectAll(newValue);
                    }
                });

                function getRealySelect (array) {
                    var temp = [];
                    angular.forEach(array, function (item) {
                        if (item) temp.push(item);
                    });
                    return temp;
                }

                function checkSelectAll (array) {
                    return getRealySelect(array).length === $scope.model.timeYear.length ? 1 : -1;
                }

                var timesComboDataSource = new kendo.data.DataSource([]);

                $scope.$watch('model.query.activation', function (newValue) {
                    if (!newValue || newValue.optionId === 2) {
                        $scope.model.query.tempLearningYears = [];
                        $scope.model.query.notEstablish = undefined;
                        $scope.model.query.times = undefined;
                    }
                }, true);

                function getAvailable (obj) {
                    return obj ? obj : {enable: angular.noop};
                }

                $scope.$watch('model.query.tempLearningYears.length', function (newValue, oldValue) {

                    var sourceLength = timesComboDataSource.data().length;
                    for (var i = 0; i < sourceLength; i++) {
                        var dataItem = timesComboDataSource.at(0);
                        timesComboDataSource.remove(dataItem);
                    }

                    if ($scope.model && $scope.model.query) {
                        $scope.model.query.times = undefined;
                        $scope.model.query.notEstablishCondition = undefined;
                    }
                    if (newValue && newValue > 0) {
                        getAvailable($scope.model.node && $scope.model.node.condisionCombo).enable();
                        getAvailable($scope.model.node && $scope.model.node.resetCombo).enable();
                        if (oldValue !== newValue) {
                            for (var i = 1; i <= newValue; i++) {
                                timesComboDataSource.add({
                                    optionId: i,
                                    name: i + '次'
                                });
                            }
                        }
                    } else {
                        getAvailable($scope.model.node && $scope.model.node.condisionCombo).enable(false);
                        getAvailable($scope.model.node && $scope.model.node.resetCombo).enable(false);
                    }
                });

                $scope.config = {
                    titleLevelCombo: new hbUtil.kendo.config.combobox({
                        placeholder: '职称等级', dataSource: [
                            {
                                optionId: '4',
                                name: '无'
                            },
                            {
                                optionId: '0',
                                name: '初级'
                            },
                            {
                                optionId: '1',
                                name: '中级'
                            },
                            {
                                optionId: '2',
                                name: '高级'
                            }
                        ]
                    }),
                    activationCombo: new hbUtil.kendo.config.combobox({
                        placeholder: '是否激活',
                        dataSource: [
                            {
                                optionId: 1,
                                name: '已激活'
                            },
                            {
                                optionId: 2,
                                name: '未激活'
                            }
                        ]
                    }),
                    notEstablishConditionCombo: new hbUtil.kendo.config.combobox({
                        placeholder: '条件', dataSource: [
                            {
                                optionId: 3,
                                name: '等于'
                            },
                            {
                                optionId: 1,
                                name: '大于'
                            },
                            {
                                optionId: 4,
                                name: '大于等于'
                            }, {
                                optionId: 2,
                                name: '小于'
                            },
                            {
                                optionId: 5,
                                name: '小于等于'
                            }
                        ]
                    }),
                    timesCombo: new hbUtil.kendo.config.combobox({
                        placeholder: '次数',
                        dataSource: timesComboDataSource
                    })
                };

                function genQuery (data) {

                    genQueryData.genQuery(data, $scope.model.query);

                    data.tempLearningYears = $scope.model.query.tempLearningYears;

                    data.isOver55 = $scope.model.query.isOver55;

                    if (data.tempLearningYears && data.tempLearningYears.length > 0) {
                        data.isAlltempLearningYears = $scope.model.query.isAlltempLearningYears;
                    }

                    if ($scope.model.query.activation) {
                        data.activated = $scope.model.query.activation.optionId;
                    }

                    if ($scope.model.query.notEstablishCondition) {
                        data.noSignUpClassCountType = $scope.model.query.notEstablishCondition.optionId;
                    }

                    if ($scope.model.query.times) {
                        data.noSignUpClassCountValue = $scope.model.query.times.optionId;
                    }
                    return data;
                }

                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/userActivated/findUserActivatedInfoByQuery', {}, {
                        rebuild: function (data, totalSize) {
                            $scope.model.totalSize = totalSize;
                            angular.forEach(data, function (item) {
                                if (item.noSignUpYear) {
                                    var noSignUpYear = item.noSignUpYear;
                                    noSignUpYear = noSignUpYear.split('、');
                                    var newNoSignUpYear = '';
                                    angular.forEach(noSignUpYear, function (subItem, index) {
                                        if ((index + 1) % 5 !== 0) {
                                            newNoSignUpYear += subItem;
                                            if (index !== noSignUpYear.length - 1) {
                                                newNoSignUpYear += '、';
                                            }
                                        } else {
                                            newNoSignUpYear += subItem + '<br/>';
                                        }
                                    });
                                    item.noSignUpYear = newNoSignUpYear;
                                } else {
                                    item.noSignUpYear = '-';
                                }
                                if (item.signUpYear) {
                                    var signUpYear = item.signUpYear;
                                    signUpYear = signUpYear.split('、');
                                    var newSignUpYear = '';
                                    angular.forEach(signUpYear, function (subItem, index) {
                                        if ((index + 1) % 5 !== 0) {
                                            newSignUpYear += subItem;
                                            if (index !== signUpYear.length - 1) {
                                                newSignUpYear += '、';
                                            }
                                        } else {
                                            newSignUpYear += subItem + '<br/>';
                                        }
                                    });
                                    item.signUpYear = newSignUpYear;
                                } else {
                                    item.signUpYear = '-';
                                }
                            });
                            return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                        },
                        parameterMap: function (data, type) {
                            data.pageNo = data.page;

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

                        result.push('<td title="#: name #">');
                        result.push('#: name #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: identified #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: loginInput #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: phoneNumber #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: jobGrade #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: areaName #');
                        result.push('</td>');

                        result.push('<td ng-bind-html="dataItem.noSignUpYear">');
                        result.push('</td>');

                        result.push('<td ng-bind-html="dataItem.signUpYear">');
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
                        title: '名字',
                        width: 90
                    },
                    {
                        field: 'identified',
                        title: '身份证',
                        width: 160
                    },
                    {
                        field: 'loginInput',
                        title: '登录账号',
                        width: 200
                    },
                    {
                        field: 'phoneNumber',
                        title: '电话号码',
                        width: 100
                    },
                    {
                        field: 'jobGrade',
                        title: '职称等级'
                    },
                    {
                        field: 'areaName',
                        title: '地区'
                    },
                    {
                        field: 'noSignUpYear',
                        title: '未报班年度',
                        width: 250
                    },
                    {
                        field: 'signUpYear',
                        title: '已报班年度',
                        width: 250
                    }
                ], {}, {
                    sortable: false
                });

                $scope.$watch('model.query.notEstablishCondition', function (nv) {
                    if ($scope.model.query.tempLearningYears.length > 0) {
                        $scope.mustSelectCondition = !!nv;
                    }
                });
                $scope.$watch('model.query.tempLearningYears.length', function (nv) {
                    if (nv > 0) {
                        $scope.mustSelectCondition = !!$scope.model.query.notEstablishCondition;
                        $scope.mustSelectTimes = !!$scope.model.query.times;
                    }
                });
                $scope.$watch('model.query.times', function (nv) {
                    if ($scope.model.query.tempLearningYears.length > 0) {
                        $scope.mustSelectTimes = !!nv;
                    }
                });

                $scope.events = {
                    loadYears: function () {
                        if ($scope.model.timeYear && $scope.model.timeYear.length > 0) {
                            return;
                        }
                        return $http.get('/web/admin/commodityManager/getSkuPropertyValues', {
                            params: {
                                skuPropertyId: '5a3bc134658b41a2c18020351e69bac1'
                            }
                        })

                            .then(function (data) {
                                $scope.model.timeYear = data.data.info;
                            });
                    },
                    beforeQuery: function () {
                        if ($scope.model.query.tempLearningYears.length > 0) {
                            $scope.mustSelectCondition = !!$scope.model.query.notEstablishCondition;
                            $scope.mustSelectTimes = !!$scope.model.query.times;
                            return $scope.mustSelectCondition && $scope.mustSelectTimes;
                        } else {
                            return true;
                        }
                    },
                    selectYear: function () {

                        HB_dialog.contentAs($scope, {
                            title: '选择年度',
                            width: 400,
                            showCertain: true,
                            height: 300,
                            showCancel: true,
                            cancelText: '取消',
                            confirmText: '确定',
                            cancel: function () {
                                $scope.model.tempLearningYears = [];
                            },
                            sure: function (who) {
                                $scope.model.query.tempLearningYears = getRealySelect($scope.model.tempLearningYears);
                                return {
                                    then: function () {
                                        who.close(who.dialogIndex);
                                    }
                                };
                            },
                            templateUrl: '@systemUrl@/views/summary/humanActivation/select-year.html'
                        });
                    },
                    genReportQuery: function () {
                        return genQuery({});
                    },
                    selectAll: function ($event) {
                        selectAll($event.target.checked);
                    }
                };

                $scope.permission = {
                    search: 'humanActivation/search',
                    exportOut: 'humanActivation/export',
                    learnTimeYear: 'humanActivation/learnTimeYear',
                    titleLevel: 'humanActivation/titleLevel',
                    learnCategory: 'humanActivation/learnCategory',
                    region: 'humanActivation/region',
                    reset: 'humanActivation/reset',
                    selectClass: 'humanActivation/searchTrainClass'
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