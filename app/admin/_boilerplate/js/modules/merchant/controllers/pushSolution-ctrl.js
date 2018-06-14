/**
 * @author wangzy
 * @description 给商户推送解决方案控制器，功能独立。
 *
 * 添加商户controller
 */

define(function () {
    'use strict';
    return ['$scope',
        'KENDO_UI_GRID',
        'KENDO_UI_EDITOR',
        'kendo.grid',
        'global',
        'merchantService',
        '$state',
        '$stateParams',
        function ($scope, KENDO_UI_GRID, KENDO_UI_EDITOR, kendoGrid, global, merchantService, $state, $stateParams) {

            // define data-binding variable
            angular.extend($scope, {
                regexps: global.regexps,    // validation regexp while validating form or define yourself
                ui: {},                     // Kendo component options config
                model: {},                  // data model
                node: {},                   // node for kendo component
                event: {}
            });

            $scope.showDisabled = false;//提交按钮是否可用

            $scope.model = {

                //解决方案查询参数
                queryParam: {
                    solutionName: '',//解决方案名称
                    solutionType: $stateParams.merchantNature == '正式' ? 2 : 1,//解决方案类型 0-不闲 1-体验 2-正式
                    solutionStatus: 1,//解决方案状态 0-不闲 1-正常 2-废弃
                    pageNo: 1,
                    pageSize: 5
                },
                //提交时的传输参数对象
                pushSolutionInfo: {
                    projectId: '',//子项目id
                    merchantId: '',//商户id
                    rootUnitId: '',//业务单位Id（顶级单位Id）
                    solution: [],//解决方案集合
                    includingAbility: 'false',//是否推送能力项
                    accountConcurrence: '',//账号并发数(跟扩展账号并发数一样)
                    accountServeTimeBegin: $stateParams.serveTimeBegin,//账号并发数服务时间开始
                    accountServeTimeEnd: $stateParams.serveTimeEnd,//账号并发数服务时间结束
                    solutionServeTimeBegin: $stateParams.serveTimeBegin,//解决方案服务时间开始
                    solutionServeTimeEnd: $stateParams.serveTimeEnd//解决方案服务时间结束
                },
                merchantInfo: null
            };

            $scope.node = {
                accountServeTimeBegin: null,//扩展账号的服务开始时间
                accountServeTimeEnd: null,//扩展账号的服务结束时间
                solutionServeTimeBegin: null,//解决方案服务时间开始
                solutionServeTimeEnd: null,//解决方案服务时间结束
                gridInstance: null//待选解决方案列表
            };

            $scope.hasNoSelectedCourse = true;//没有选择解决方案，选择界面显示默认图片


            //监控是否有选择解决方案
            $scope.$watch('model.pushSolutionInfo.solution.length', function (newValue, oldValue) {
                if (newValue == 0) {
                    $scope.hasNoSelectedCourse = true;
                } else {
                    $scope.hasNoSelectedCourse = false;
                }

            });

            merchantService.findMerchantByMerchantId({merchantId: $stateParams.merchantId}).then(function (data) {
                if (data.status) {
                    $scope.model.merchantInfo = data.info;
                    if ($scope.model.merchantInfo.serveTimeBegin) {
                        $scope.model.merchantInfo.serveTimeBegin = $scope.model.merchantInfo.serveTimeBegin.substring(0, $scope.model.merchantInfo.serveTimeBegin.length - 9);
                        $scope.model.pushSolutionInfo.accountServeTimeBegin = $scope.model.merchantInfo.serveTimeBegin;
                        $scope.model.pushSolutionInfo.solutionServeTimeBegin = $scope.model.merchantInfo.serveTimeBegin;
                    }
                    if ($scope.model.merchantInfo.serveTimeEnd) {
                        $scope.model.merchantInfo.serveTimeEnd = $scope.model.merchantInfo.serveTimeEnd.substring(0, $scope.model.merchantInfo.serveTimeEnd.length - 9);
                        $scope.model.pushSolutionInfo.accountServeTimeEnd = $scope.model.merchantInfo.serveTimeEnd;
                        $scope.model.pushSolutionInfo.solutionServeTimeEnd = $scope.model.merchantInfo.serveTimeEnd;
                    }
                }
            });
            var ButtonUtils = {
                //账号并发数服务开始时间变化
                accountServeTimeBeginChange: function () {
                    var startDate = $scope.node.accountServeTimeBegin.value(),
                        endDate = $scope.node.accountServeTimeEnd.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.accountServeTimeEnd.min(startDate);
                    } else if (endDate) {
                        $scope.node.accountServeTimeBegin.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.accountServeTimeBegin.max(endDate);
                        $scope.node.accountServeTimeEnd.min(endDate);
                    }
                },
                //账号并发数服务结束时间变化
                accountServeTimeEndChange: function () {
                    var endDate = $scope.node.accountServeTimeEnd.value(),
                        startDate = $scope.node.accountServeTimeBegin.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.accountServeTimeBegin.max(endDate);
                    } else if (startDate) {
                        $scope.node.accountServeTimeEnd.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.accountServeTimeBegin.max(endDate);
                        $scope.node.accountServeTimeEnd.min(endDate);
                    }
                },
                //解决方案服务开始时间变化
                solutionServeTimeBeginChange: function () {
                    var startDate = $scope.node.solutionServeTimeBegin.value(),
                        endDate = $scope.node.solutionServeTimeEnd.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.solutionServeTimeEnd.min(startDate);
                    } else if (endDate) {
                        $scope.node.solutionServeTimeBegin.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.solutionServeTimeBegin.max(endDate);
                        $scope.node.solutionServeTimeEnd.min(endDate);
                    }
                },
                //解决方案服务结束时间变化
                solutionServeTimeEndChange: function () {
                    var endDate = $scope.node.solutionServeTimeEnd.value(),
                        startDate = $scope.node.solutionServeTimeBegin.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.solutionServeTimeBegin.max(endDate);
                    } else if (startDate) {
                        $scope.node.solutionServeTimeEnd.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.solutionServeTimeBegin.max(endDate);
                        $scope.node.solutionServeTimeEnd.min(endDate);
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
                clearSelectedRecord: function () {
                    $scope.selectedRecord = {
                        projectId: '',//选中一行记录时保存记录的子项目id
                        merchantId: '',//选中一行记录时保存记录的商户信息id
                        contactPersonId: '',//选中一行记录时保存记录的联系人id
                        status: ''//选中一行记录时保存商户状态
                    };
                }
            };

            $scope.events = {
                //主页面按条件查询列表数据
                queryList: function () {
                    $scope.model.queryParam.pageNo = 1;
                    $scope.node.gridInstance.pager.page(1);
                    ButtonUtils.clearSelectedRecord();
                },
                //主页面条件查询时在条件输入框回车提交查询
                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.queryList();
                        ButtonUtils.clearSelectedRecord();
                    }
                },
                /**
                 * 选中记录（点击行前的radio）
                 * @param e
                 * @param projectId
                 * @param merchantId
                 */
                selectOneRecord: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.model.pushSolutionInfo.solution = [];
                    $scope.model.pushSolutionInfo.solution.push(dataItem);
                    /*$scope.model.selectedRecord = [];
                     $scope.model.selectedRecord.push(dataItem);*/
                },
                /**
                 * 取消选择
                 * @param e
                 */
                cancelSelect: function (e) {
                    $scope.model.pushSolutionInfo.solution = [];
                    e.stopPropagation();
                },
                /**
                 * 保存解决方案推送
                 * @param e
                 */
                savePushSolution: function (e) {
                    e.stopPropagation();
                    //防止用户多次提交表单
                    $scope.showDisabled = true;
                    $('#submitBtn').attr('class', 'btn btn-g');
                    $scope.model.pushSolutionInfo.projectId = $stateParams.projectId;
                    $scope.model.pushSolutionInfo.merchantId = $stateParams.merchantId;
                    $scope.model.pushSolutionInfo.rootUnitId = $stateParams.unitId;

                    //转换解决方案服务期限的类型为long
                    var solutionServeTimeStart = new Date($scope.model.pushSolutionInfo.solutionServeTimeBegin);
                    var solutionServeTimeEnd = new Date($scope.model.pushSolutionInfo.solutionServeTimeEnd);
                    $scope.model.pushSolutionInfo.solutionServeTimeBegin = solutionServeTimeStart.getTime();
                    $scope.model.pushSolutionInfo.solutionServeTimeEnd = solutionServeTimeEnd.getTime();
                    merchantService.savePushSolution($scope.model.pushSolutionInfo).then(function (data) {
                        if (data.status) {
                            $scope.globle.showTip('推送完成！', 'success');
                            $state.go('states.merchant').then(function () {
                                $state.reload();
                            });
                        } else {
                            $scope.showDisabled = false;
                            console.log($scope.showDisabled);
                            //如果添加失败，则将提交按钮样式还原，用户可以再次提交
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
                },
                /**
                 * 关闭解决方案推送界面
                 * @param e
                 */
                goBack: function (e) {
                    e.stopPropagation();
                    $state.go('states.merchant').then(function () {
                        $state.reload();
                    });
                }
            };

            //定义列表页每一行的数据模板
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input type="radio" id="selectItem_#: solutionId #"  class="k-radio" name="selectItem" ng-click="events.selectOneRecord($event,dataItem)"/>');
                result.push('<label class="k-radio-label" for="selectItem_#: solutionId #"></label>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: appType ==1?"体验":"正式"#');
                result.push('</td>');

                result.push('<td>');
                result.push('#: jobCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: lessonCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: abilityCount #');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            $scope.ui = {
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
                                    url: '/web/admin/merchant/findSolutionPage',
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

                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    return response;
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
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
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
                                title: '',
                                filterable: false,
                                width: 40
                            },
                            {field: 'name', title: '解决方案名称'},
                            {field: 'appType', title: '类型'},
                            {field: 'jobCount', title: '岗位体系数'},
                            {field: 'abilityCount', title: '课程数'},
                            {field: 'abilityCount', title: '能力项数'}
                        ]
                    }
                },
                //日期控件
                datePicker: {
                    //解决方案服务开始时间
                    solutionServeTimeBegin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            height: 10,
                            change: ButtonUtils.solutionServeTimeBeginChange,
                            value: new Date(),
                            min: new Date()

                        }
                    },
                    //解决方案服务结束时间
                    solutionServeTimeEnd: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: ButtonUtils.solutionServeTimeEndChange,
                            min: new Date()
                        }
                    },
                    //扩展账号并发数日期控件-开始
                    accountServeTimeBegin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            height: 10,
                            change: ButtonUtils.accountServeTimeBeginChange,
                            value: new Date(),
                            min: new Date()

                        }
                    },
                    //扩展账号并发数日期控件-结束
                    accountServeTimeEnd: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: ButtonUtils.accountServeTimeEndChange,
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
                    }
                }
            };

            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);
        }];
});
