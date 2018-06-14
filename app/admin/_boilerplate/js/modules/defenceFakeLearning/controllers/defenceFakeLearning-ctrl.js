define(function () {
    'use strict';
    var constant = {
        arrange: {
            0: '适用全系统',
            1: '适用培训方案'
        },
        //0/1/2，知识点弹题/系统随机弹题/人脸识别验证
        mode: {
            0: '知识点弹题',
            1: '系统随机弹题',
            2: '人脸识别验证'
        },
        popQuestionRule: {
            2: '课件间隔时间弹题',
            1: '课件间隔百分比弹题'
        },
        popForm: {
            0: '每次都弹',
            1: '首次弹题'
        },
        answerForm: {
            0: '答对为止',
            1: '可答'
        },
        totalSize: 0
    };
    return {
        index: ['$rootScope','$http', 'hbBasicData', 'hbUtil', '$scope', 'HB_notification', 'app.defenceFakeLearning.service', 'HB_dialog', '$state',
            function ($rootScope, $http, hbBasicData, hbUtil, $scope, HB_notification, defenceFakeLearningService, HB_dialog, $state) {
                $scope.constant = constant;
                $scope.model = {
                    unitId: null,
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    }
                };
                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/fakeLearning/findInterceptConfigPage', {}, {

                    rebuild: function (data) {
                        constant.totalSize = gridDataSource._total;
                        angular.forEach(data, function (item, index) {
                            item.randomTriggerForm = item.triggerForm;
                            item.randomTriggerValue = item.triggerFormValue;
                        });
                        return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                    },
                    parameterMap: function (data, type) {
                        data.unitId = $scope.model.unitId
                        data.pageNo = data.page;
                        return data;
                    }
                });

                $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template($('#dfl_template').html()), [
                    {
                        template: 'b{{dataItem.$index > 0 ? dataItem.$index:""}}',
                        title: 'No.',
                        width: 50
                    },
                    {
                        field: 'range',
                        title: '范围'
                    },
                    {
                        field: 'mode',
                        title: '模式'
                    },
                    {
                        title: '无知识点启用随机弹题'
                    },
                    {
                        field: 'pop.rule',
                        title: '弹窗形式',
                        width: 120
                    },
                    {
                        field: 'pop.ruleValue',
                        title: '答题形式',
                        width: 120
                    },
                    {
                        title: '操作',
                        width: 200
                    }
                ], {}, {
                    sortable: false
                });

                function selectGrid (uid) {
                    $scope.node.mainGrid.select('tr[data-uid=\'' + uid + '\']');
                }

                $scope.flagModel = {
                    tabType :"OWN",
                    viewProjectFirst : true,
                };

                $scope.events = {
                    isSubProjectManager :function () {
                        var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                        return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                    },
                    tabClick:function (e,type) {
                        $scope.flagModel.tabType = type;
                        if (type === 'OWN'){
                            $scope.model.unitId= '';
                        }
                    },
                    unitSetCallback :function(unitId) {
                        $scope.model.unitId = unitId;
                        $scope.model.page.pageNo = 1;
                        $scope.node.mainGrid.pager.page(1);
                    },
                    searchAllFakeLearning:function(e){
                        $scope.model.page.pageNo = 1;
                        $scope.node.mainGrid.pager.page(1);
                    },
                    remove: function (item) {
                        selectGrid(item.uid);
                        if (item.enable) {
                            return;
                        }
                        hbUtil.toggleBuzy($scope.node.mainGrid.element, true);
                        var tip = '是否确认删除?删除后对应配置将失效并要重新创建规则！';
                        if (item.arrange === 1) {
                            defenceFakeLearningService.getTrainClassListLength(item.configId).then(function (data) {
                                if (data.totalSize > 0) {
                                    tip = ' 当前防假学规则已添加 <span class="txt-r">' + data.totalSize + '个</span> 培训方案，是否确认删除，<span class="txt-r di">删除后对应配置将失效并要重新创建规则！</span>';
                                }
                                warn();
                            });
                        } else {
                            warn();
                        }

                        function warn () {
                            hbUtil.toggleBuzy($scope.node.mainGrid.element, false);
                            HB_notification.confirm(tip, function (dialog) {
                                return defenceFakeLearningService.remove(item)
                                    .then(function () {
                                        dialog.doRightClose();
                                        HB_dialog.success('提示', '删除成功');
                                        gridDataSource.refresh();
                                    });
                            });
                        }
                    },
                    enable: function (item) {
                        selectGrid(item.uid);
                        hbUtil.toggleBuzy($scope.node.mainGrid.element, true);
                        var tip = '是否确认' + (item.enable ? '关闭' : '开启') + '系统级的防假学配置?';
                        // 如果开启并且是培训方案查看培训方案的数量
                        if (item.enable && item.arrange === 1) {
                            defenceFakeLearningService.getTrainClassListLength(item.configId).then(function (data) {
                                if (data.totalSize > 0) {
                                    tip = '当前防假学规则已添加 <span class="txt-r">' + data.totalSize + '个</span>' +
                                        ' 培训方案，是否确认关闭，<span class="txt-r di">关闭后对应的培训方案学习过程将不再弹题！</span>';
                                }
                                warn();
                            });
                        } else {
                            if (item.arrange === 1) {
                                tip = '是否确认开启防假学规则配置？开启后对应的培训方案防假学规则将生效！';
                            }
                            warn();
                        }

                        function warn () {
                            hbUtil.toggleBuzy($scope.node.mainGrid.element, false);
                            HB_notification.confirm(tip, function (dialog) {
                                return defenceFakeLearningService.enable({
                                    configId: item.configId,
                                    state: item.enable ? '0' : '1'
                                })
                                    .then(function () {
                                        dialog.doRightClose();
                                        item.enable = !item.enable;
                                        HB_dialog.success('提示', '操作成功');
                                        // $state.reload($state.current);
                                    });
                            });
                        }
                    },
                    detail: function (item) {
                        selectGrid(item.uid);
                        $state.go('.detail', {id: item.configId});
                    },
                    edit: function (item) {
                        selectGrid(item.uid);
                        $state.go('.edit', {id: item.configId});
                    }
                };
            }],

        add: ['$scope', 'HB_dialog', 'app.defenceFakeLearning.service', '$state', '$timeout',
            function ($scope, HB_dialog, defenceFakeLearningService, $state, $timeout) {
                $scope.defenceFake = {
                    classList: [],
                    arrange: 0,
                    mode: 0,
                    randomTriggerForm: 2,
                    popForm: 0,
                    verificationForm: '0'
                };

                $scope.tempClassList = [];

                $scope.$watch('defenceFake.verificationForm', function (nV, oV) {
                    if (oV == 1 && nV == 0) {
                        $scope.defenceFake.verificationFormValue = undefined;
                    }
                });

                $scope.$watch('defenceFake.mode', function (nv) {
                    if (nv == 1) {
                        $scope.defenceFake.enableRandomWithoutQuestion = false;
                        $scope.defenceFake.popForm = 0;
                    }
                });

                $scope.$watch('defenceFake.enableRandomWithoutQuestion', function (nv) {
                    if (!nv) {
                        $scope.defenceFake.randomTriggerForm = 2;
                        $scope.defenceFake.randomTriggerValue = undefined;
                    }
                });

                // $scope.$watch('defenceFake.mode', function (nv) {
                //     if (nv == 0) {
                //         $scope.defenceFake.enableRandomWithoutQuestion = false;
                //         $scope.defenceFake.popForm = 0;
                //     }
                // });

                $scope.events = {
                    save: function () {
                        $scope.saving = true;
                        $scope.defenceFake.triggerForm = $scope.defenceFake.randomTriggerForm;
                        $scope.defenceFake.triggerFormValue = $scope.defenceFake.randomTriggerValue;
                        angular.forEach($scope.tempClassList, function (item) {
                            $scope.defenceFake.classList.push(item.schemeId);
                        });

                        var str = $scope.defenceFake.triggerFormValue + '';
                        if (str.indexOf('.') == -1) {
                            //alert("整数")
                        } else {
                            if ($scope.defenceFake.randomTriggerForm == 1) {
                                HB_dialog.alert('提示', '进度百分比请输入整数');
                            } else if ($scope.defenceFake.randomTriggerForm == 2) {
                                HB_dialog.alert('提示', '课件间隔时间请输入整数');
                            }
                            $scope.saving = false;
                            return;
                        }


                        defenceFakeLearningService.save($scope.defenceFake)

                            .then(function (data) {
                                $scope.saving = false;
                                HB_dialog.success('提示', '新增成功!');
                                $state.go('^')

                                    .then(function () {
                                        $state.reload($state.current);
                                    });
                            }, function (data) {
                                $scope.saving = false;
                                HB_dialog.alert('提示', data.data.info);
                            });
                    },
                    selectClass: function () {
                        HB_dialog.contentAs($scope, {
                            height: 570,
                            title: '选择培训方案',
                            width: 1100,
                            templateUrl: '@systemUrl@/views/defenceFakeLearning/classSelect.html',
                            sure: function (dialog) {
                                return $timeout(function () {
                                    dialog.close(dialog.dialogIndex);
                                });
                            },
                            cancel: function () {
                                $scope.tempClassList = [];
                            }
                        });
                    },
                    removeClass: function ($index) {
                        $scope.tempClassList.splice($index, 1);
                    }
                };
            }],

        detail: ['$scope', 'app.defenceFakeLearning.service', '$stateParams', 'hbUtil', function ($scope, defenceFakeLearningService, $stateParams, hbUtil) {
            defenceFakeLearningService.detail({
                configId: $stateParams.id
            })

                .then(function (data) {
                    $scope.model.defenceFake = data.info;
                    $scope.model.defenceFake.randomTriggerForm = $scope.model.defenceFake.triggerForm;
                    $scope.model.defenceFake.randomTriggerValue = $scope.model.defenceFake.triggerFormValue;
                });


            var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/fakeLearning/getInterceptConfigTrainClassPage?configId=' + $stateParams.id, {}, {

                rebuild: function (data) {
                    return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                },
                parameterMap: function (data, type) {

                    data.pageNo = data.page;

                    // genQuery(data);

                    return data;
                }
            });
            //已配置模板
            var classGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td title="#: $index #">');
                result.push('#:$index#');
                result.push('</td>');


                result.push('<td title="#: schemeName #">');
                result.push('#:schemeName#');
                result.push('</td>');

                result.push('<td>');
                result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                result.push('<br />');
                result.push('</div>');
                //hbSkuService.kendoSkuDo(result);
                result.push('</td>');


                result.push('</tr>');
                classGridRowTemplate = result.join('');
            })();
            $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, classGridRowTemplate, [
                {
                    field: '$index',
                    title: 'No.',
                    width: 50
                },
                {
                    field: 'schemeName',
                    title: '方案名称'
                },
                {
                    field: 'attr',
                    title: '方案属性'
                }
            ], {}, {
                sortable: false
            });


        }],

        edit: ['$scope', 'app.defenceFakeLearning.service', '$stateParams', 'hbUtil', 'HB_notification', 'HB_dialog', '$timeout', '$state',
            function ($scope, defenceFakeLearningService, $stateParams, hbUtil, HB_notification, HB_dialog, $timeout, $state) {
                $scope.constant = constant;
                $scope.tempClassList = [];
                var preValue = {};

                defenceFakeLearningService.detail({
                    configId: $stateParams.id
                })

                    .then(function (data) {
                        $scope.model.defenceFake = data.info;
                        $scope.model.defenceFake.randomTriggerForm = $scope.model.defenceFake.triggerForm;
                        $scope.model.defenceFake.randomTriggerValue = $scope.model.defenceFake.triggerFormValue;
                        if ($scope.model.defenceFake.verificationForm == 0) {
                            $scope.model.defenceFake.verificationFormValue = undefined;
                        }
                        preValue.verificationFormValue = $scope.model.defenceFake.verificationFormValue;

                        $scope.$watch('model.defenceFake.mode', function (nv) {
                            if (nv == 1) {
                                $scope.model.defenceFake.enableRandomWithoutQuestion = false;
                                $scope.model.defenceFake.popForm = 0;
                            }
                        });

                        $scope.$watch('model.defenceFake.enableRandomWithoutQuestion', function (nv) {
                            if (!nv && $scope.model.defenceFake.mode == 0) {
                                $scope.model.defenceFake.randomTriggerForm = 2;
                                $scope.model.defenceFake.randomTriggerValue = undefined;
                            }
                        });


                        $scope.$watch('model.defenceFake.verificationForm', function (nV, oV) {
                            if (oV == 1 && nV == 0) {
                                $scope.model.defenceFake.verificationFormValue = undefined;
                            } else {
                                $scope.model.defenceFake.verificationFormValue = preValue.verificationFormValue;
                            }
                        });
                    });


                // $scope.tempClassList = data;
                function setPersis (items) {
                    angular.forEach(items, function (item) {
                        item.persis = true;
                    });
                }

                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/fakeLearning/getInterceptConfigTrainClassPage?configId=' + $stateParams.id, {}, {

                    rebuild: function (data) {
                        return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                    },
                    parameterMap: function (data, type) {

                        data.pageNo = data.page;

                        return data;
                    }
                });


                //已配置模板
                var classGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td title="#: $index #">');
                    result.push('#:$index#');
                    result.push('</td>');


                    result.push('<td title="#: schemeName #">');
                    result.push('#:schemeName#');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                    result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                    result.push('<br />');
                    result.push('</div>');
                    //hbSkuService.kendoSkuDo(result);
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<button type="button" has-permission="defenceFakeLearning/unSign" class="table-btn" ng-click="events.unSign(dataItem)">删除</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    classGridRowTemplate = result.join('');
                })();


                $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, classGridRowTemplate, [
                    {
                        field: '$index',
                        title: 'No.',
                        width: 50
                    },
                    {
                        field: 'schemeName',
                        title: '方案名称'
                    },
                    {
                        field: 'attr',
                        title: '方案属性'
                    },
                    {
                        title: '操作',
                        field: 'op',
                        //template: '<div class="op" has-permission="defenceFakeLearning/unSign"><a ng-click="events.unSign(dataItem)">删除</a></div>',
                        width: 60
                    }
                ], {}, {
                    sortable: false
                });

                $scope.events = {
                    unSign: function (item) {

                        hbUtil.toggleBuzy($scope.node.editGrid.element, true);

                        HB_notification.confirm('是否删除配置项培训方案？', function (dialog) {
                            return defenceFakeLearningService.unSign({
                                configId: $stateParams.id,
                                shemeId: item.schemeId
                            })
                                .then(function (data) {
                                    hbUtil.toggleBuzy($scope.node.editGrid.element, false);
                                    dialog.doRightClose();
                                    HB_dialog.success('提示', '删除成功');
                                    gridDataSource.refresh();
                                });
                        }, function () {
                            hbUtil.toggleBuzy($scope.node.editGrid.element, false);
                        });
                    },
                    selectClass: function () {
                        setPersis(gridDataSource.view());
                        $scope.tempClassList = gridDataSource.view();
                        HB_dialog.contentAs($scope, {
                            height: 570,
                            title: '选择培训方案',
                            width: 1100,
                            templateUrl: '@systemUrl@/views/defenceFakeLearning/classSelect.html',
                            sure: function (dialog) {
                                var classList = [];
                                angular.forEach($scope.tempClassList, function (item) {
                                    if (!item.persis) {
                                        classList.push(item.schemeId);
                                    }
                                });
                                return defenceFakeLearningService.assign({
                                    configId: $stateParams.id,
                                    classList: classList
                                })
                                    .then(function () {
                                        setPersis(gridDataSource.view());
                                        gridDataSource.refresh();
                                        dialog.close(dialog.dialogIndex);
                                    }, function (data) {
                                        HB_dialog.alert('提示', data.data.info);
                                    });

                            }
                        });
                    },
                    update: function (item) {
                        $scope.saving = true;
                        $scope.model.defenceFake.triggerForm = $scope.model.defenceFake.randomTriggerForm;
                        $scope.model.defenceFake.triggerFormValue = $scope.model.defenceFake.randomTriggerValue;

                        var str = $scope.model.defenceFake.triggerFormValue + '';
                        if (str.indexOf('.') == -1) {
                            //alert("整数")
                        } else {
                            if ($scope.model.defenceFake.randomTriggerForm == 1) {
                                HB_dialog.alert('提示', '进度百分比请输入整数');
                            } else if ($scope.model.defenceFake.randomTriggerForm == 2) {
                                HB_dialog.alert('提示', '课件间隔时间请输入整数');
                            }
                            $scope.saving = false;
                            return;
                        }
                        defenceFakeLearningService.update($scope.model.defenceFake)
                            .then(function (data) {
                                $scope.saving = false;
                                HB_dialog.success('提示', '修改成功!');
                                $state.go('^')

                                    .then(function () {
                                        $state.reload($state.current);
                                    });
                            }, function (data) {
                                $scope.saving = false;
                                HB_dialog.alert('提示', data.data.info);
                            });


                    }
                };
            }]

    };
});