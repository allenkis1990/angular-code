/**
 * @author wangzy
 * @description 商户管理主控制器 包含了停用，启用，注销，扩展账号并发数，调整服务期，重置密码功能的主要js代码，
 * 还有跳转到新建、修改、查看页面的js代码
 */
define(function () {
    'use strict';
    return ['$scope',
        '$sce',
        'KENDO_UI_GRID',
        'KENDO_UI_TREE',
        'KENDO_UI_EDITOR',
        'kendo.grid',
        'global',
        'merchantService',
        '$timeout',
        '$state',
        function ($scope, $sce, KENDO_UI_GRID, KENDO_UI_TREE, KENDO_UI_EDITOR, kendoGrid, global, merchantService, $timeout, $state) {

            // define data-binding variable
            angular.extend($scope, {
                regexps: global.regexps,    // validation regexp while validating form or define yourself
                ui: {},                     // Kendo component options config
                model: {},                  // data model
                node: {},                   // node for kendo component
                event: {}
            });

            $scope.hasSubmitQuery = false;//是否提交查询，如果提交了，则统计的条件是按照查询条件走，如果没有，则统计的条件不变
            $scope.model = {
                /**
                 * 统计条件
                 */
                countParam: {
                    companyName: undefined,//企业名称
                    businessSchoolName: undefined,//商学院名称
                    applyTimeBegin: undefined,//商户申请时间开始
                    applyTimeEnd: undefined,//商户申请时间结束
                    nature: 0,//商户性质 0-不限 1-正式 2-体验
                    status: 0//商户状态 0-不限 1-正常 2-停用 3-注销
                },
                /**
                 * 分页查询参数
                 */
                queryParam: {
                    companyName: undefined,//企业名称
                    businessSchoolName: undefined,//商学院名称
                    applyTimeBegin: undefined,//商户申请时间开始
                    applyTimeEnd: undefined,//商户申请时间结束
                    pageNo: 1,//当前页码
                    pageSize: 10//页大小
                },

                description: '',//操作说明（停用，启用，延期）

                /**
                 * 保存扩展商户账号的信息
                 */
                accountExpandInfo: {
                    itemId: '',//受理单号
                    projectId: '',//项目id
                    merchantId: '',//商户id
                    companyName: '',//企业名称
                    businessSchoolName: '',//商学院名称
                    hasAccountNum: '',//现有账号数
                    expandAccountNum: '',//扩展个数
                    expandAccountServeTimeBegin: '',//扩展的账号服务期限开始
                    expandAccountServeTimeEnd: '',//扩展的账号服务期限结束
                    dataCreateType: '',//商品数据产生的方式（创建，扩展）（账号类型 的商品才有值）
                    dataCreateTime: ''//商品数据产生的时间（账号类型 的商品才有值）
                },
                /**
                 * 商户的商品
                 */
                merchantGoods: []
            };
            $scope.events = {};

            $scope.ui = {};

            $scope.node = {
                applyEndTime: null,//申请结束时间
                applyBeginTime: null,//申请开始时间
                expandAccountServeTimeBegin: null,//扩展账号的服务开始时间
                expandAccountServeTimeEnd: null,//扩展账号的服务结束时间
                modifyServeTimebegin: null,//调整服务期的服务开始时间
                modifyServeTimeEnd: null,//调整服务期的服务结束时间
                gridInstance: null
            };

            $scope.showDisabled = false;//提交按钮是否可用
            $scope.showFunctionButtonDisabled = false;//列表上方的功能菜单是否可用，默认可用

            //停用、启用数据时的记录id
            $scope.dataId = {
                merchantId: '',//
                projectId: ''
            };

            //点击记录前面的radio时将相应的字段值付给对象的相应属性
            $scope.selectedRecord = {
                projectId: '',//选中一行记录时保存记录的子项目id
                merchantId: '',//选中一行记录时保存记录的商户信息id
                contactPersonId: '',//选中一行记录时保存记录的联系人id
                unitId: '',//选中一行记录时保存记录的业务单位Id
                merchantNature: '',//选中的商户的性质
                serveTimeBegin: '',//服务开始时间
                serveTimeEnd: '',//服务结束时间
                status: ''//选中一行记录时保存商户状态
            };

            //监控选择的商户的状态，如果是注销状态，则隐藏除了新建商户的所有菜单
            $scope.$watch('selectedRecord.status', function (newValue, oldValue) {
                if (newValue == '注销') {
                    $scope.showFunctionButtonDisabled = true;
                } else {
                    $scope.showFunctionButtonDisabled = false;
                }
            }, true);

            //监控扩展账号并发数的服务开始时间
            $scope.$watch('model.accountExpandInfo.expandAccountServeTimeBegin', function (newValue, oldValue) {
                if ($scope.model.accountExpandInfo.expandAccountServeTimeEnd == $scope.model.accountExpandInfo.expandAccountServeTimeBegin && $scope.model.accountExpandInfo.expandAccountServeTimeEnd != '' && $scope.model.accountExpandInfo.expandAccountServeTimeBegin != '') {
                    $scope.showDisabled = true;
                } else {
                    $scope.showDisabled = false;
                }
            }, true);
            //监控扩展账号并发数的服务结束时间
            $scope.$watch('model.accountExpandInfo.expandAccountServeTimeEnd', function (newValue, oldValue) {
                if ($scope.model.accountExpandInfo.expandAccountServeTimeEnd == $scope.model.accountExpandInfo.expandAccountServeTimeBegin && $scope.model.accountExpandInfo.expandAccountServeTimeEnd != '' && $scope.model.accountExpandInfo.expandAccountServeTimeBegin != '') {
                    $scope.showDisabled = true;
                } else {
                    $scope.showDisabled = false;
                }
            }, true);

            //监控
            $scope.$watch('model.merchantGoods', function (newValue, oldValue) {
                var flag = true;
                angular.forEach($scope.model.merchantGoods, function (item) {
                    if ((item.modifyServeTimeBegin != '' && item.modifyServeTimeBegin != null) || (item.modifyServeTimeEnd != '' && item.modifyServeTimeEnd != null)) {
                        $scope.showDisabled = false;
                        flag = false;
                    }
                });
                if (flag) {
                    $scope.showDisabled = true;
                }
            }, true);

            $scope.events = {
                /**
                 * 主页面列表数据查询
                 * @constructor
                 */
                MainPageQueryList: function () {
                    $scope.model.queryParam.pageNo = 1;
                    $scope.node.gridInstance.pager.page(1);
                    ButtonUtils.clearSelectedRecord();
                },
                /**
                 * 主页面条件查询时在条件输入框回车提交查询
                 */
                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.MainPageQueryList();
                        ButtonUtils.clearSelectedRecord();
                    }
                },
                /**
                 * 打开停用商用提示窗口
                 * @param e
                 * @param projectId
                 */
                openPauseTipWindow: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.dataId.projectId = dataItem.projectId;
                    $scope.dataId.merchantId = dataItem.merchantId;
                    $scope.model.description = '';//清空提示
                    $scope.showDisabled = false;//确定按钮是否可用
                    $scope.node.windows.pauseTipWindow.center().open();
                },
                /**
                 * 提交停用
                 * @param e
                 * @param projectId
                 */
                dealPause: function (e) {
                    e.stopPropagation();
                    $scope.showDisabled = true;//提交按钮是否可用
                    merchantService.dealPause({
                        projectId: $scope.dataId.projectId,
                        merchantId: $scope.dataId.merchantId,
                        description: $scope.model.description
                    }).then(function (data) {
                        if (data.status) {
                            $scope.node.windows.pauseTipWindow.center().close();
                            $scope.globle.showTip('操作成功！', 'success');
                            $scope.node.gridInstance.dataSource.read();
                        } else {
                            $scope.showDisabled = false;//提交按钮是否可用
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
                },

                /**
                 * 打开启用商用提示窗口
                 * @param e
                 * @param projectId
                 */
                openStartTipWindow: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.dataId.projectId = dataItem.projectId;
                    $scope.dataId.merchantId = dataItem.merchantId;
                    $scope.model.description = '';//清空提示
                    $scope.showDisabled = false;//确定按钮是否可用
                    $scope.node.windows.startTipWindow.center().open();
                },
                /**
                 * 提交启用
                 * @param e
                 * @param projectId
                 */
                dealStart: function (e) {
                    e.stopPropagation();
                    $scope.showDisabled = true;//提交按钮是否可用
                    merchantService.dealStart({
                        projectId: $scope.dataId.projectId,
                        merchantId: $scope.dataId.merchantId,
                        description: $scope.model.description
                    }).then(function (data) {
                        if (data.status) {
                            $scope.node.windows.startTipWindow.center().close();
                            $scope.globle.showTip('操作成功！', 'success');
                            $scope.node.gridInstance.dataSource.read();
                        } else {
                            $scope.showDisabled = false;//提交按钮是否可用
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
                },
                /**
                 * 打开注销商户提示窗口
                 * @param e
                 * @param projectId
                 */
                openDeleteTipWindow: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.dataId.projectId = dataItem.projectId;
                    $scope.dataId.merchantId = dataItem.merchantId;
                    $scope.model.description = '';//清空提示
                    $scope.showDisabled = false;//确定按钮是否可用
                    $scope.node.windows.deleteTipWindow.center().open();
                },
                /**
                 * 提交注销
                 * @param e
                 * @param projectId
                 */
                dealDelete: function (e) {
                    e.stopPropagation();
                    $scope.showDisabled = true;//提交按钮是否可用
                    merchantService.dealDelete({
                        projectId: $scope.dataId.projectId,
                        merchantId: $scope.dataId.merchantId,
                        description: $scope.model.description
                    }).then(function (data) {
                        if (data.status) {
                            $scope.globle.showTip('操作成功！', 'success');
                            $scope.node.windows.deleteTipWindow.center().close();
                            $scope.node.gridInstance.dataSource.read();
                        } else {
                            $scope.showDisabled = false;//提交按钮是否可用
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
                },
                /**
                 * 跳转到修改页面
                 * @param e
                 * @param id
                 */
                toEditPage: function (e, id) {
                    e.stopPropagation();
                    $state.go('states.merchant.edit', {id: id});
                },
                /**
                 * 查看商户信息
                 * @param e
                 * @param id
                 */
                viewDetail: function (e, dataItem) {
                    $state.go('states.merchant.view', {projectId: dataItem.projectId, merchantId: dataItem.merchantId});
                },
                /**
                 * 选中记录（点击行前的radio）
                 * @param e
                 * @param projectId
                 * @param merchantId
                 */
                selectOneRecord: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.selectedRecord.projectId = dataItem.projectId;
                    $scope.selectedRecord.merchantId = dataItem.merchantId;
                    $scope.selectedRecord.unitId = dataItem.businessUnitId;
                    $scope.selectedRecord.contactPersonId = dataItem.contactPersonId;
                    $scope.selectedRecord.merchantNature = dataItem.nature;
                    $scope.selectedRecord.serveTimeBegin = dataItem.platServeTimeBegin;
                    $scope.selectedRecord.serveTimeEnd = dataItem.platServeTimeEnd;
                    $scope.selectedRecord.status = dataItem.status;

                },
                /**
                 * 不选择记录（点击title栏的radio）
                 */
                selectNoRecord: function () {
                    $scope.selectedRecord.projectId = '';
                    $scope.selectedRecord.merchantId = '';
                    $scope.selectedRecord.unitId = '';
                    $scope.selectedRecord.contactPersonId = '';
                    $scope.selectedRecord.merchantNature = '';
                    $scope.selectedRecord.status = '';
                },
                /**
                 * 跳转到推送解决方案页面
                 * @param e
                 */
                toPushSolutionPage: function (e) {
                    e.stopPropagation();
                    if ($scope.selectedRecord.projectId == '') {
                        $scope.globle.showTip('请选择对象进行操作！', 'error');
                        return;
                    }
                    merchantService.validateMerchantHasSolutionInUse({merchantId: $scope.selectedRecord.merchantId}).then(function (data) {
                        if (data.status) {
                            if (data.info) {
                                $scope.globle.showTip('商户已存在正在使用的解决方案，不能再次推送！', 'error');
                            } else {
                                $state.go('states.merchant.pushSolution', {
                                    projectId: $scope.selectedRecord.projectId,
                                    merchantId: $scope.selectedRecord.merchantId,
                                    unitId: $scope.selectedRecord.unitId,
                                    serveTimeBegin: $scope.selectedRecord.serveTimeBegin,
                                    serveTimeEnd: $scope.selectedRecord.serveTimeEnd,
                                    merchantNature: $scope.selectedRecord.merchantNature
                                });
                            }

                        }
                    });
                },
                /**
                 * 打开调整服务期窗口
                 * @param e
                 */
                openModifyServeTimeWindow: function (e) {
                    e.stopPropagation();
                    $scope.showDisabled = true;//提交按钮是否可用
                    if ($scope.selectedRecord.projectId == '') {
                        $scope.globle.showTip('请选择对象进行操作！', 'error');
                        return;
                    }
                    $scope.node.windows.modifyServeTimeWindow.center().open();
                    //通过商户id查询出商户信息
                    merchantService.findForExpandAccount({projectId: $scope.selectedRecord.projectId}).then(function (data) {
                        if (data.status) {
                            $scope.model.accountExpandInfo = data.info;
                        } else {
                            $scope.globle.alert('获取商户信息出错！', 'error');
                        }
                    });

                    //通过商户projectId,merchantId获取商户的商品信息
                    merchantService.findMerchantGoods({
                        projectId: $scope.selectedRecord.projectId,
                        merchantId: $scope.selectedRecord.merchantId,
                        operateType: '1'//1-为调整服务期查询商品 2-为查看商品详情查询商品
                    }).then(function (data) {
                        if (data.status) {
                            $scope.model.merchantGoods = data.info;
                            angular.forEach($scope.model.merchantGoods, function (item) {
                                item.endDateMin = new Date(new Date(item.serveTimeBegin).getTime() + 1000 * 24 * 60 * 60);
                                if (item.serveTimeBegin.length > 0) {
                                    item.serveTimeBegin = item.serveTimeBegin.substring(0, item.serveTimeBegin.length - 9);
                                }
                                if (item.serveTimeEnd.length > 0) {
                                    item.serveTimeEnd = item.serveTimeEnd.substring(0, item.serveTimeEnd.length - 9);
                                }
                            });
                        } else {
                            $scope.globle.alert('获取商户商品信息出错！');
                        }
                    });

                },
                /**
                 * 提交调整服务期
                 * @param e
                 */
                saveModifyServeTime: function (e) {
                    e.stopPropagation();
                    $scope.showDisabled = true;//提交按钮是否可用
                    merchantService.saveModifyServeTime($scope.model.merchantGoods).then(function (data) {
                        if (data.status) {
                            $scope.globle.showTip('操作成功', 'success');
                            $scope.node.windows.modifyServeTimeWindow.center().close();
                            $scope.node.gridInstance.dataSource.read();
                            //重置选中记录信息
                            ButtonUtils.clearSelectedRecord();
                        } else {
                            $scope.globle.alert('操作失败！');
                            $scope.showDisabled = false;//提交按钮是否可用
                        }
                    });
                },
                /**
                 * 打开拓展账号并发数窗口
                 * @param e
                 */
                openExpandAccountWindow: function (e) {
                    e.stopPropagation();
                    $scope.showDisabled = false;//提交按钮是否可用
                    if ($scope.selectedRecord.projectId == '') {
                        $scope.globle.showTip('请选择对象进行操作！', 'error');
                        return;
                    }
                    $scope.node.windows.expandAccountWindow.center().open();
                    //通过商户id查询出商户信息
                    $scope.model.accountExpandInfo.merchantId = $scope.selectedRecord.merchantId;
                    $scope.model.accountExpandInfo.projectId = $scope.selectedRecord.projectId;
                    merchantService.findForExpandAccount({projectId: $scope.model.accountExpandInfo.projectId}).then(function (data) {
                        if (data.status) {
                            $scope.model.accountExpandInfo = data.info;
                            $scope.model.accountExpandInfo.expandAccountNum = '';
                            $scope.model.accountExpandInfo.expandAccountServeTimeBegin = ButtonUtils.formatDate(new Date());
                        } else {
                            $scope.globle.showTip('获取商户信息出错！', 'error');
                        }
                    });

                },
                /**
                 * 提交账号扩展并发数
                 * @param e
                 */
                saveExpandAccount: function (e) {
                    e.stopPropagation();
                    $scope.showDisabled = true;//提交按钮是否可用
                    merchantService.saveExpandAccount($scope.model.accountExpandInfo).then(function (data) {
                        if (data.status) {
                            $scope.node.windows.expandAccountWindow.center().close();
                            $scope.globle.showTip('操作成功！', 'success');
                            $scope.node.gridInstance.dataSource.read();

                            //重置选择记录的信息为空
                            ButtonUtils.clearSelectedRecord();
                        } else {
                            $scope.showDisabled = false;//提交按钮是否可用
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });

                },
                /**
                 * 打开重置密码窗口(商户信息实体就用扩展账号并发数的实体)
                 * @param e
                 */
                openResetPasswordWindow: function (e) {
                    e.stopPropagation();
                    $scope.showDisabled = false;//提交按钮是否可用
                    if ($scope.selectedRecord.projectId == '') {
                        $scope.globle.showTip('请选择对象进行操作！', 'error');
                        return;
                    }
                    $scope.node.windows.resetPasswordWindow.center().open();
                    //通过商户id查询出商户信息
                    merchantService.findForExpandAccount({projectId: $scope.selectedRecord.projectId}).then(function (data) {
                        if (data.status) {
                            $scope.model.accountExpandInfo = data.info;
                        } else {
                            $scope.globle.showTip('获取商户信息出错！', 'error');
                        }
                    });

                },
                /**
                 * 提交重置超级管理员密码
                 * @param e
                 */
                saveResetPassword: function (e) {
                    $scope.node.windows.resetPasswordWindow.center().close();
                    e.stopPropagation();
                    $scope.showDisabled = true;//提交按钮是否可用
                    merchantService.saveResetPassword({
                        contactPersonId: $scope.selectedRecord.contactPersonId,
                        projectId: $scope.selectedRecord.projectId
                    }).then(function (data) {
                        if (data.status) {
                            $scope.globle.showTip('操作成功！', 'success');
                            $scope.node.gridInstance.dataSource.read();

                            //重置选中记录信息
                            ButtonUtils.clearSelectedRecord();
                        } else {
                            $scope.showDisabled = false;//提交按钮是否可用
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
                },
                /**
                 * 调整服务期时选择服务开始时间设置服务结束时间的最小值
                 */
                startChange: function (index) {
                    var startDate = $scope.node['modifyServeTimeBegin_' + index].value(),
                        endDate = $scope.node['modifyServeTimeEnd_' + index].value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node['modifyServeTimeEnd_' + index].min(new Date(new Date(startDate).getTime() + 1000 * 60 * 60 * 24));
                    } else if (endDate) {
                        $scope.node['modifyServeTimeBegin_' + index].max(new Date(new Date(endDate.getTime() - 1000 * 60 * 60 * 24)));
                    } else {
                        endDate = new Date();
                        $scope.node['modifyServeTimeBegin_' + index].max(endDate);
                        $scope.node['modifyServeTimeEnd_' + index].min(new Date(endDate.getTime() + 1000 * 60 * 60 * 24));
                    }

                    /* angular.forEach($scope.model.merchantGoods,function(item){
                     if(item.modifyServeTimeBegin!=""||item.modifyServeTimeEnd!=""){
                     $scope.showDisabled=false;
                     }
                     });*/
                },
                /**
                 * 调整服务期时选择服务结束时间设置服务结束时间的最小值
                 */
                endChange: function (index) {
                    var endDate = $scope.node['modifyServeTimeEnd_' + index].value(),
                        startDate = $scope.node['modifyServeTimeBegin_' + index].value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node['modifyServeTimeBegin_' + index].max(new Date(endDate.getTime() - 1000 * 60 * 60 * 24));
                    } else if (startDate) {
                        $scope.node['modifyServeTimeEnd_' + index].min(new Date(new Date(startDate).getTime() + 1000 * 60 * 60 * 24));
                    } else {
                        endDate = new Date();
                        $scope.node['modifyServeTimeBegin_' + index].max(endDate);
                        $scope.node['modifyServeTimeEnd_' + index].min(new Date(endDate.getTime() + 1000 * 60 * 60 * 24));
                    }
                    /*angular.forEach($scope.model.merchantGoods,function(item){
                     if(item.modifyServeTimeBegin!=""||item.modifyServeTimeEnd!=""){
                     $scope.showDisabled=false;
                     }
                     });*/
                }
            };

            var ButtonUtils = {
                //申请开始时间变化
                startChange: function () {
                    var startDate = $scope.node.applyBeginTime.value(),
                        endDate = $scope.node.applyEndTime.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.applyEndTime.min(startDate);
                    } else if (endDate) {
                        $scope.node.applyBeginTime.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.applyBeginTime.max(endDate);
                        $scope.node.applyEndTime.min(endDate);
                    }
                },
                //申请结束时间变化
                endChange: function () {
                    var endDate = $scope.node.applyEndTime.value(),
                        startDate = $scope.node.applyBeginTime.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.applyBeginTime.max(endDate);
                    } else if (startDate) {
                        $scope.node.applyEndTime.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.applyBeginTime.max(endDate);
                        $scope.node.applyEndTime.min(endDate);
                    }
                },
                //拓展账号服务开始时间变化
                expandAccountServeTimeStartChange: function () {
                    var startDate = $scope.node.expandAccountServeTimeBegin.value(),
                        endDate = $scope.node.expandAccountServeTimeEnd.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.expandAccountServeTimeEnd.min(startDate);
                    } else if (endDate) {
                        $scope.node.expandAccountServeTimeBegin.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.expandAccountServeTimeBegin.max(endDate);
                        $scope.node.expandAccountServeTimeEnd.min(endDate);
                    }
                },
                //拓展账号服务结束时间变化
                expandAccountServeTimeEndChange: function () {
                    var endDate = $scope.node.expandAccountServeTimeEnd.value(),
                        startDate = $scope.node.expandAccountServeTimeBegin.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.expandAccountServeTimeBegin.max(endDate);
                    } else if (startDate) {
                        $scope.node.expandAccountServeTimeEnd.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.expandAccountServeTimeBegin.max(endDate);
                        $scope.node.expandAccountServeTimeEnd.min(endDate);
                    }
                },
                //转换日期格式 yyyy-MM-dd HH:mm:ss
                formatDate: function (date) {
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    var d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    var h = date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    h = h < 10 ? ('0' + h) : h;
                    minute = minute < 10 ? ('0' + minute) : minute;
                    second = second < 10 ? ('0' + second) : second;
                    //+' '+h+':'+minute+':'+second
                    return y + '-' + m + '-' + d;
                },
                //清空保存的选中记录信息
                clearSelectedRecord: function () {
                    $scope.selectedRecord = {
                        projectId: '',
                        merchantId: '',
                        contactPersonId: '',
                        unitId: '',
                        status: ''
                    };
                },
                getDateStr: function (date, AddDayCount) {
                    date.setDate(date.getDate() + AddDayCount);//获取AddDayCount天后的日期
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;//获取当前月份的日期
                    var d = date.getDate();
                    return y + '-' + m + '-' + d;
                }
            };

            //定义列表页每一行的数据模板
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input type="radio" id="selectItem_#: projectId #"  class="k-radio" name="selectItem" ng-click="events.selectOneRecord($event,dataItem)"/>');
                result.push('<label class="k-radio-label" for="selectItem_#: projectId #"></label>');
                result.push('</td>');

                result.push('<td title="#: companyName #">');
                result.push('#: companyName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: businessSchoolName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: contactPerson #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: mobileNumber #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: applyTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: nature #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: status #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.viewDetail($event,dataItem)">查看</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.toEditPage($event,\'#: projectId #\')" #: status==\'注销\'?\'disabled\':\'\'# >修改</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.openStartTipWindow($event,dataItem)" #: status==\'正常\'?\'disabled\':\'\'# #: status==\'注销\'?\'disabled\':\'\'# >启用</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.openPauseTipWindow($event,dataItem)" #: status==\'停用\'?\'disabled\':\'\'# #: status==\'注销\'?\'disabled\':\'\'#  >停用</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.openDeleteTipWindow($event,dataItem)" #: status==\'停用\'?\'\':\'disabled\'#>注销</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            $scope.ui = {
                windows: {
                    //停用提示窗口
                    pauseTipWindow: {
                        modal: true,
                        content: '@systemUrl@/views/merchant/pauseTipWindow.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    //启用提示窗口
                    startTipWindow: {
                        modal: true,
                        content: '@systemUrl@/views/merchant/startTipWindow.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    //注销提示窗口
                    deleteTipWindow: {
                        modal: true,
                        content: '@systemUrl@/views/merchant/deleteTipWindow.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    //调整服务期窗口
                    modifyServeTimeWindow: {
                        modal: true,
                        content: '@systemUrl@/views/merchant/modifyServeTimeWindow.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    //拓展账号并发数窗口
                    expandAccountWindow: {
                        modal: true,
                        content: '@systemUrl@/views/merchant/expandAccountWindow.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    //重置密码窗口
                    resetPasswordWindow: {
                        modal: true,
                        content: '@systemUrl@/views/merchant/resetPasswordWindow.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                },
                editor: KENDO_UI_EDITOR,
                grid: {
                    options: {
                        /*toolbar:[],*/
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        noRecords: {
                            template: '暂无数据！'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/merchant/findByQuery',
                                    data: function (e) {
                                        var temp = {}, params = $scope.model.queryParam;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.pageNo = e.page;
                                        $scope.model.queryParam.pageNo = temp.pageNo;
                                        temp.pageSize = $scope.model.queryParam.pageSize;
                                        return temp;
                                    },
                                    dataType: 'json',
                                    error: function (data) {
                                        $scope.globle.showTip(data.info, 'error');
                                    }
                                }
                            },
                            page: 1,
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            i = 1;
                                        _.forEach(viewData, function (row) {
                                            row.index = i++;
                                        });
                                        return response;
                                    } else {
                                        $scope.globle.alert('错误', '商户加载失败!');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: response.info
                                        };
                                    }
                                },
                                total: function (response) {
                                    // 绑定数据所有总共多少条;
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    if (response.status) {
                                        var datas = response.info;
                                        return datas;
                                    } else {
                                        $scope.globle.showTip(response.info, 'error');
                                        return [];
                                    }
                                } // 指定数据源
                            },
                            serverPaging: true
                        },
                        selectable: true,
                        scrollable: false,//第一次加载时的蒙板效果
                        dataBinding: function (e) {
                            //$scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            pageSize: 10,
                            buttonCount: 10/*,
                             change: function (e) {
                             $scope.model.queryParam.pageNo = parseInt(e.index, 10);
                             $scope.node.gridInstance.dataSource.read();
                             }*/
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: '<input class=\'k-radio\' type=\'radio\' id=\'selectItem\' name=\'selectItem\'ng-click=\'events.selectNoRecord()\'/><label class=\'k-radio-label\' for=\'selectItem\'></label>',
                                filterable: false,
                                width: 40
                            },
                            {field: 'companyName', title: '企业名称'},
                            {field: 'businessSchoolName', title: '商学院名称'},
                            {field: 'contactPerson', title: '联系人'},
                            {field: 'mobileNumber', title: '手机号'},
                            {field: 'applyTime', title: '申请时间'},
                            {field: 'nature', title: '性质'},
                            {field: 'status', title: '状态'},
                            {
                                title: '操作'
                            }
                        ]
                    }
                },
                //日期控件
                datePicker: {
                    //列表日期控件-开始
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            height: 10,
                            change: ButtonUtils.startChange

                        }
                    },
                    //列表日期控件-结束
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: ButtonUtils.endChange
                        }
                    },
                    //扩展账号并发数日期控件-开始
                    expandAccountServeTimeBegin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            height: 10,
                            change: ButtonUtils.expandAccountServeTimeStartChange,
                            value: new Date(),
                            min: new Date()

                        }
                    },
                    //扩展账号并发数日期控件-结束
                    expandAccountServeTimeEnd: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: ButtonUtils.expandAccountServeTimeEndChange,
                            min: new Date()
                        }
                    },
                    //调整服务期日期控件-开始，结束
                    modifyServeTime: {
                        options: {
                            culture: 'zh-CN',
                            change: function (event) {
                                //console.log(event);
                            },
                            format: 'yyyy-MM-dd',
                            min: new Date()
                        }
                    },
                    //调整服务期日期控件-开始，结束
                    modifyServeTimeEnd: {
                        options: {
                            culture: 'zh-CN',
                            change: function (event) {
                                //console.log(event);
                            },
                            format: 'yyyy-MM-dd',
                            min: new Date(new Date().getTime() + 1000 * 24 * 68 * 60)
                        }
                    }
                }
            };

            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);
        }];
});
