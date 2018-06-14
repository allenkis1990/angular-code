define(function () {
    'use strict';
    return ['$scope', 'solutionService', '$stateParams', '$state', 'kendo.grid', function ($scope, solutionService, $stateParams, $state, kendoGrid) {

        var solutionSend = {
            solutionId: $stateParams.solutionId,
            appType: $stateParams.appType
        };

        // define data-binding variable
        angular.extend($scope, {
            ui: {},                     // Kendo component options config
            model: {},                  // data model
            node: {},                   // node for kendo component
            event: {}                   // intercept ui event
        });

        $scope.model = {
            noSubmitSend: true,
            finalConfigResult: false,

            selectedMerchantIdList: [],
            /**
             * {
             *  merchantId: '',
             *  subProjectId: '',
             *  rootUnitId: '',
             *  businessSchoolName: ''
             * }
             */
            sendingConfigList: [],
            /** 临时的推送配置 */
            config: {}
        };

        $scope.node = {
            electedMerchantGrid: null
        };


        solutionSend.uiTemplate = {
            electedMerchantGridRow: function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: serviceUnitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: businessSchoolName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: merchantNature==1?"正式":"体验" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: hasSolutionRecord ? "有" : "没有" #');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button ng-if="!dataItem.isChoice" ng-click="events.choose($event, dataItem)" class="table-btn">选择</button>');
                result.push('<button ng-if="dataItem.isChoice" ng-click="events.removeByGrid($event, dataItem)" class="table-btn">取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                return result.join('');
            }
        };

        solutionSend.utils = {

            initDateWidget: function () {
                $scope.ui.datePicker.validBeginTime = {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd',
                    change: solutionSend.utils.startChange
                };
                $scope.ui.datePicker.validEndTime = {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd',
                    change: solutionSend.utils.endChange
                };
            },
            startChange: function () {
                var startDate = $scope.node.validBeginTime.value(),
                    endDate = $scope.node.validEndTime.value();

                // 设置当前商户的推送解决方案的配置的有效开始时间
                var currentSendingConfig = solutionSend.utils.findMerchant($scope.model.config.merchantId);
                if (currentSendingConfig != null) {
                    currentSendingConfig.validBeginTime = startDate;
                    currentSendingConfig.validBeginTimeMills = startDate.getTime();
                    solutionSend.utils.minusDay(currentSendingConfig);
                    solutionSend.utils.getFinalConfigResult();

                    $scope.$apply();
                }

                if (startDate) {
                    startDate = new Date(startDate);
                    startDate.setDate(startDate.getDate());
                    $scope.node.validEndTime.min(startDate);
                } else if (endDate) {
                    $scope.node.validBeginTime.max(new Date(endDate));
                } else {
                    endDate = new Date();
                    $scope.node.validBeginTime.max(endDate);
                    $scope.node.validEndTime.min(endDate);
                }
            },
            endChange: function () {
                var endDate = $scope.node.validEndTime.value(),
                    startDate = $scope.node.validBeginTime.value();
                // 设置当前商户的推送解决方案的配置的有效结束时间
                var currentSendingConfig = solutionSend.utils.findMerchant($scope.model.config.merchantId);
                if (currentSendingConfig != null) {
                    currentSendingConfig.validEndTime = endDate;
                    currentSendingConfig.validEndTimeMills = endDate.getTime();
                    solutionSend.utils.minusDay(currentSendingConfig);
                    solutionSend.utils.getFinalConfigResult();

                    $scope.$apply();
                }

                if (endDate) {
                    endDate = new Date(endDate);
                    endDate.setDate(endDate.getDate());
                    $scope.node.validBeginTime.max(endDate);
                } else if (startDate) {
                    $scope.node.validEndTime.min(new Date(startDate));
                } else {
                    endDate = new Date();
                    $scope.node.validBeginTime.max(endDate);
                    $scope.node.validEndTime.min(endDate);
                }
            },

            findMerchant: function (merchantId) {
                var temp = null;
                _.forEach($scope.model.sendingConfigList, function (sendingConfig) {
                    if (sendingConfig.merchantId === merchantId) {
                        temp = sendingConfig;
                        return;
                    }
                });

                return temp;
            },

            minusDay: function (sendingConfig) {
                // 时间差的毫秒数
                var config = $scope.model.config;
                if (sendingConfig.validEndTimeMills != 0 && sendingConfig.validBeginTimeMills != 0) {
                    var minusMills = sendingConfig.validEndTimeMills - sendingConfig.validBeginTimeMills;
                    config.dayMinus = Math.floor(minusMills / (24 * 3600 * 1000));
                } else {
                    config.dayMinus = 0;
                }
            },

            getFinalConfigResult: function () {
                var result = true;
                _.forEach($scope.model.sendingConfigList, function (config) {
                    if (config.validBeginTimeMills === 0 || config.validEndTimeMills === 0) {
                        result = false;
                        return;
                    }
                });
                $scope.model.finalConfigResult = result;
            },

            resetConfigModel: function (sendingConfig) {
                $scope.model.config.merchantId = sendingConfig.merchantId;
                $scope.model.config.sendAbility = sendingConfig.sendAbility;
                $scope.model.config.validBeginTime = sendingConfig.validBeginTime;
                $scope.model.config.validEndTime = sendingConfig.validEndTime;

                $scope.node.validBeginTime.max(sendingConfig.validEndTime);
                $scope.node.validEndTime.min(sendingConfig.validBeginTime);
            }
        };

        $scope.ui = {
            datePicker: {},

            electedMerchantGrid: {
                selectable: true,
                scrollable: false,
                pageable: {
                    refresh: true
                },
                // 每个行的模板定义,
                rowTemplate: kendo.template(solutionSend.uiTemplate.electedMerchantGridRow()),
                dataBinding: function (e) {
                    kendoGrid.nullDataDealLeaf(e);
                },
                dataSource: {
                    serverPaging: true,
                    page: 1,
                    pageSize: 10, // 每页显示的数据数目
                    transport: {
                        parameterMap: function (data, type) {
                            if (type === 'read') {
                                var temp = {};
                                temp.pageNo = data.page;
                                temp.pageSize = data.pageSize;
                                temp.companyName = $scope.model.companyName;
                                return temp;
                            }
                            return data;
                        },
                        read: {
                            url: '/web/admin/solution/getMerchantPage?appType=' + solutionSend.appType,
                            dataType: 'json'
                        }
                    },
                    schema: {
                        parse: function (response) {
                            // 将会把这个返回的数组绑定到数据源当中
                            if (response.status) {
                                var viewData = response.info,
                                    i = 1;
                                _.forEach(viewData, function (row) {
                                    row.index = i++;
                                    row.isChoice = false;

                                    if ($.inArray(row.merchantId, $scope.model.selectedMerchantIdList) !== -1) {
                                        row.isChoice = true;
                                    }
                                });
                                return response;
                            } else {
                                $scope.globle.alert('错误', '解决方案加载失败!');
                                return {
                                    status: response.status,
                                    totalSize: 0,
                                    totalPageSize: 0,
                                    info: []
                                };
                            }
                        },
                        total: function (response) {
                            // 绑定数据所有总共多少条;
                            return response.totalSize;
                        },
                        data: function (response) {
                            return response.info;
                        }
                    }
                },
                columns: [
                    {title: 'No.', width: 60},
                    {title: '公司名称'},
                    {title: '商学院名称', width: 180},
                    {title: '性质', width: 150},
                    {title: '是否有在用解决方案', width: 180},
                    {title: '操作', width: 160}
                ]
            }
        };

        $scope.events = {

            queryByEnter: function (e) {
                if (e.keyCode == 13) {
                    this.reloadElectedMerchantGrid(e);
                }
            },

            reloadElectedMerchantGrid: function (e) {
                e.preventDefault();
                $scope.node.electedMerchantGrid.dataSource.page(1);
            },

            choose: function (e, dataItem) {
                e.preventDefault();

                $scope.model.selectedMerchantIdList.push(dataItem.merchantId);

                var sendingConfig = {
                    merchantId: dataItem.merchantId,
                    subProjectId: dataItem.subProjectId,
                    unitId: dataItem.topBusinessUnitId,
                    merchantName: dataItem.serviceUnitName,
                    schoolName: dataItem.businessSchoolName,
                    sendAbility: false,
                    validBeginTime: null,
                    validEndTime: null,
                    validBeginTimeMills: 0,
                    validEndTimeMills: 0,
                    // 扩展属性, 配置是否完成
                    current: $scope.model.sendingConfigList.length === 0
                };
                $scope.model.sendingConfigList.push(sendingConfig);

                // 行状态设置为<已选>
                dataItem.isChoice = true;

                //if ($scope.model.sendingConfigList.length === 1) {
                //    solutionSend.utils.initDateWidget();
                //    $scope.model.config = {
                //        sendAbility: false,
                //        validBeginTime: null,
                //        validEndTime: null,
                //        dayMinus: 0,
                //        // 改变值
                //        merchantId: dataItem.merchantId
                //    };
                //}
                //$scope.model.finalConfigResult = false;
            },

            /**
             * 在表格中<取消选择>课程
             * @param e
             * @param dataItem
             */
            removeByGrid: function (e, dataItem) {
                e.preventDefault();

                // 获取当前商户ID在<sendingConfigList>的下标并移除
                var index = -1, sendingConfigList = $scope.model.sendingConfigList, i, config;
                for (i = 0; i < sendingConfigList.length; i++) {
                    config = sendingConfigList[i];
                    if (config.merchantId === dataItem.merchantId) {
                        index = i;
                        break;
                    } else {
                        index = -1;
                    }
                }
                if (index !== -1) {
                    // 如果移除了当前的配置商户, 则配置项移动到下一个商户
                    //var sendingConfigList = $scope.model.sendingConfigList;
                    //if (sendingConfigList.length > 1 && dataItem.merchantId === $scope.model.config.merchantId) {
                    //    var sendingConfig;
                    //    if ((sendingConfigList.length - 1) === index) {
                    //        sendingConfig = sendingConfigList[index - 1];
                    //    } else {
                    //        sendingConfig = sendingConfigList[index + 1];
                    //    }
                    //    sendingConfig.current = true;
                    //    solutionSend.utils.resetConfigModel(sendingConfig);
                    //} else if (sendingConfigList.length === 1) {
                    //    $scope.model.config = {};
                    //}
                    $scope.model.sendingConfigList.splice(index, 1);
                }

                // 从已选课程ID的数组中移除
                var position = _.indexOf($scope.model.selectedMerchantIdList, dataItem.merchantId);
                if (position !== -1) {
                    $scope.model.selectedMerchantIdList.splice(position, 1);
                }

                // 行状态设置为<未选>
                dataItem.isChoice = false;
            },

            /**
             * 从已选列表中 取消选择商户
             * @param e
             * @param index
             * @param merchantId
             */
            removeMerchant: function (e, index, merchantId) {
                e.preventDefault();

                // 从已选商户ID的数组中移除
                var position = _.indexOf($scope.model.selectedMerchantIdList, merchantId);
                if (position !== -1) {
                    $scope.model.selectedMerchantIdList.splice(position, 1);
                }

                //== 从已选商户的数组对象中移除
                // 如果移除了当前的配置商户, 则配置项移动到下一个商户
                //var sendingConfigList = $scope.model.sendingConfigList;
                //if (sendingConfigList.length > 1 && merchantId === $scope.model.config.merchantId) {
                //    var sendingConfig;
                //    if ((sendingConfigList.length - 1) === index) {
                //        sendingConfig = sendingConfigList[index - 1];
                //    } else {
                //        sendingConfig = sendingConfigList[index + 1];
                //    }
                //    sendingConfig.current = true;
                //    solutionSend.utils.resetConfigModel(sendingConfig);
                //} else if (sendingConfigList.length === 1) {
                //    $scope.model.config = {};
                //}
                $scope.model.sendingConfigList.splice(index, 1);

                // 从grid当前view中找到对应的行并设置<isChoice>为false;
                var viewData = $scope.node.electedMerchantGrid.dataSource.view(),
                    i, row;
                for (i = 0; i < viewData.length; i++) {
                    row = viewData[i];
                    if (row.merchantId === merchantId) {
                        row.isChoice = false;
                        break;
                    }
                }
            },

            /**
             * 清空已选的商户
             * @param e
             */
            clearMerchant: function (e) {
                e.preventDefault();

                $scope.model.selectedMerchantIdList = [];
                $scope.model.sendingConfigList = [];
                $scope.model.config = {};

                var viewData = $scope.node.electedMerchantGrid.dataSource.view(),
                    i;
                for (i = 0; i < viewData.length; i++) {
                    viewData[i].isChoice = false;
                }
            },

            /**
             * 配置能力项是否推送
             *
             * @param merchantId
             * @param result
             */
            configAbility: function (merchantId, result) {
                $scope.model.config.sendAbility = result;
                var sendingConfig = solutionSend.utils.findMerchant(merchantId);

                if (sendingConfig != null) {
                    sendingConfig.sendAbility = result;
                }
            },


            /**
             * 切换商户推送的配置
             *
             * @param e
             * @param merchantId
             */
            toggleConfig: function (e, merchantId) {
                e.preventDefault();

                _.forEach($scope.model.sendingConfigList, function (sendingConfig) {
                    if (sendingConfig.merchantId === merchantId) {
                        sendingConfig.current = true;

                        solutionSend.utils.resetConfigModel(sendingConfig);
                        solutionSend.utils.minusDay(sendingConfig);
                    } else {
                        sendingConfig.current = false;
                    }
                });
            },

            send: function (e) {
                e.preventDefault();

                if ($scope.model.noSubmitSend && $scope.model.sendingConfigList.length === 1) {
                    $scope.model.noSubmitSend = false;

                    solutionService.send(solutionSend.solutionId, $scope.model.sendingConfigList).then(function (response) {
                        $scope.model.noSubmitSend = true;

                        if (response.status) {
                            $scope.globle.showTip('解决方案推送完成', 'success');
                            $state.go('states.solution');
                        } else {
                            $scope.$apply();
                            $scope.globle.showTip(response.info, 'error');
                        }
                    });
                }

            }
        };
    }];
});
