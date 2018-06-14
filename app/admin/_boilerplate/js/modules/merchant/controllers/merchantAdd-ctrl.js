/**
 * @author wangzy
 * @description 添加商学院的业务相对复杂，所以讲添加功能的controller独立出来
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
            function ($scope, KENDO_UI_GRID, KENDO_UI_EDITOR, kendoGrid, global, merchantService, $state) {
                //转换日期格式 yyyy-MM-dd HH:mm:ss
                var formatDate = function (date) {
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
                };
                // define data-binding variable
                angular.extend($scope, {
                    regexps: global.regexps,    // validation regexp while validating form or define yourself
                    ui: {},                     // Kendo component options config
                    model: {},                  // data model
                    node: {},                   // node for kendo component
                    event: {}
                });

                $scope.showDisabled = false;//提交按钮是否可用

                $scope.selectedSolution = '暂未选择！';//已选的解决方案，默认未选择

                $scope.model = {
                    image: '',
                    //解决方案查询参数
                    queryParam: {
                        solutionName: '',//解决方案名称
                        solutionType: 2,//解决方案类型 0-不限 1-体验 2-正式
                        solutionStatus: 1,//解决方案状态 0-不限 1-正常 2-废弃
                        pageNo: 1,
                        pageSize: 5
                    },

                    //新增商户的model
                    createMerchantDto: {
                        companyName: '',//企业名称(服务单位名称和顶级业务单位名称)
                        businessSchoolName: '',//商学院名称（子项目名称）
                        industryId: '',//所处行业id（来自数据字典）
                        industryName: '',//所处行业名称
                        contactPerson: '',//联系人
                        mobileNumber: '',//联系手机
                        email: '',//联系邮箱
                        domain: '',//商学院域名
                        logo: '',//企业logo
                        type: '1',//商学院性质 1-正式 2-体验
                        solution: [],//推送的解决方案集合（一般情况看下只有一个）
                        solutionName: '',//推送的解决方案名称
                        includingAbility: '0',//是否推送能力项 1-是 0-否
                        platformServeTimeBegin: formatDate(new Date()),//平台服务开始时间formatDate(new Date())
                        platformServeTimeEnd: '',//平台服务结束时间
                        accountConcurrence: '',//账号并发数
                        accountServeTimeBegin: '',//账号并发数服务开始时间
                        accountServeTimeEnd: '',//账号并发数服务结束时间
                        solutionServeTimeBegin: '',//解决方案服务开始时间
                        solutionServeTimeEnd: '',//解决方案服务结束时间
                        remark: ''//备注
                    }
                };

                $scope.node = {
                    plantServeTimeStart: null,//平台服务时间开始
                    plantServeTimeEnd: null,//平台服务时间结束
                    solutionServeTimeStart: null,//解决方案服务时间开始
                    solutionServeTimeEnd: null,//解决方案服务时间结束
                    addPageGridInstance: null//添加页面的解决方案列表
                };

                $scope.$watch('model.uploadImage', function () {
                    if ($scope.model.uploadImage) {
                        $scope.model.image = '/mfs' + $scope.model.uploadImage.newPath;
                        $scope.model.createMerchantDto.logo = $scope.model.uploadImage.newPath;
                    }
                    else {
                        $scope.model.image = 'images/company-logo.png';
                    }
                });

                //监控扩展账号并发数的服务开始时间
                $scope.$watch('model.createMerchantDto.platformServeTimeBegin', function (newValue, oldValue) {
                    if ($scope.model.createMerchantDto.platformServeTimeEnd == $scope.model.createMerchantDto.platformServeTimeBegin && $scope.model.createMerchantDto.platformServeTimeEnd != '' && $scope.model.createMerchantDto.platformServeTimeBegin != '') {
                        $scope.showDisabled = true;
                    } else {
                        $scope.showDisabled = false;
                    }
                }, true);
                //监控扩展账号并发数的服务结束时间
                $scope.$watch('model.createMerchantDto.platformServeTimeEnd', function (newValue, oldValue) {
                    if ($scope.model.createMerchantDto.platformServeTimeEnd == $scope.model.createMerchantDto.platformServeTimeBegin && $scope.model.createMerchantDto.platformServeTimeEnd != '' && $scope.model.createMerchantDto.platformServeTimeBegin != '') {
                        $scope.showDisabled = true;
                    } else {
                        $scope.showDisabled = false;
                    }
                }, true);


                $scope.events = {
                    /**
                     * 查询解决方案列表
                     * @param e
                     */
                    queryList: function (e) {
                        $scope.model.queryParam.pageNo = 1;
                        $scope.node.addPageGridInstance.pager.page(1);
                    },
                    //主页面条件查询时在条件输入框回车提交查询
                    pressEnterKey: function (e) {
                        if (e.keyCode == 13) {
                            $scope.events.queryList();
                        }
                    },
                    /**
                     * 选择一个解决方案
                     * @param e
                     * @param dateItem
                     */
                    select: function (e, dataItem) {
                        dataItem.showCancel = true;
                        angular.forEach($scope.model.createMerchantDto.solution, function (data) {
                            data.showCancel = false;
                        });
                        $scope.model.createMerchantDto.solution = [];
                        $scope.model.createMerchantDto.solution.push(dataItem);
                    },
                    /**
                     * 取消选择一个解决方案
                     * @param e
                     * @param dateItem
                     */
                    unSelect: function (e, dataItem) {
                        dataItem.showCancel = false;
                        $scope.model.createMerchantDto.solution = [];
                    },
                    /**
                     * 保存添加
                     * @param e
                     */
                    saveAdd: function (e) {
                        e.stopPropagation();
                        //防止用户多次提交表单
                        $scope.showDisabled = true;
                        $('#submitBtn').attr('class', 'btn btn-g');

                        //设置账号并发数的服务期限与平台服务期限一致
                        $scope.model.createMerchantDto.accountServeTimeBegin = $scope.model.createMerchantDto.platformServeTimeBegin;
                        $scope.model.createMerchantDto.accountServeTimeEnd = $scope.model.createMerchantDto.platformServeTimeEnd;
                        $scope.model.createMerchantDto.solutionServeTimeBegin = $scope.model.createMerchantDto.platformServeTimeBegin;
                        $scope.model.createMerchantDto.solutionServeTimeEnd = $scope.model.createMerchantDto.platformServeTimeEnd;

                        //转换解决方案服务期限的类型为long
                        var solutionServeTimeStart = new Date($scope.model.createMerchantDto.solutionServeTimeBegin);
                        var solutionServeTimeEnd = new Date($scope.model.createMerchantDto.solutionServeTimeEnd);
                        $scope.model.createMerchantDto.solutionServeTimeBegin = solutionServeTimeStart.getTime();
                        $scope.model.createMerchantDto.solutionServeTimeEnd = solutionServeTimeEnd.getTime();

                        merchantService.save($scope.model.createMerchantDto).then(function (data) {
                            if (data.status) {
                                $scope.globle.showTip('商户添加成功', 'success');
                                $state.go('states.merchant').then(function () {
                                    $state.reload();
                                });
                            } else {
                                if ('分配解决方案时出现异常,但商户已创建成功。请重新为商户分配解决方案！' == data.info) {
                                    $scope.globle.alert('提示', data.info);
                                    $state.go('states.merchant').then(function () {
                                        $state.reload();
                                    });
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                    //如果添加失败，则将提交按钮样式还原，用户可以再次提交
                                    $scope.showDisabled = false;
                                }

                            }
                        });
                    },
                    /**
                     * 关闭添加界面
                     * @param e
                     */
                    closeAdd: function (e) {
                        e.stopPropagation();
                        $state.go('states.merchant').then(function () {
                            $state.reload();
                        });
                    },
                    /**
                     * 选择商户性质时筛选解决方案
                     * @param e
                     * @param type
                     */
                    selectSolution: function (e, type) {
                        e.stopPropagation();
                        if (type != $scope.model.queryParam.solutionType) {
                            $scope.model.queryParam.solutionType = type;
                            $scope.model.queryParam.pageNo = 1;
                            $scope.model.createMerchantDto.solution = [];
                            $scope.node.addPageGridInstance.pager.page(1);
                        }

                    }
                };
                var ButtonUtils = {
                    /**
                     * 解决方案和账号并发数的服务期限都跟着平台的服务期限走
                     */
                    //平台服务开始时间变化
                    plantServeTimeStartChange: function () {
                        var startDate = $scope.node.plantServeTimeStart.value(),
                            endDate = $scope.node.plantServeTimeEnd.value();

                        if (startDate) {
                            startDate = new Date(startDate);
                            startDate.setDate(startDate.getDate());
                            $scope.node.plantServeTimeEnd.min(startDate);
                        } else if (endDate) {
                            $scope.node.plantServeTimeStart.max(new Date(endDate));
                        } else {
                            endDate = new Date();
                            $scope.node.plantServeTimeStart.max(endDate);
                            $scope.node.plantServeTimeEnd.min(endDate);
                        }
                    },
                    //平台服务结束时间变化
                    plantServeTimeEndChange: function () {
                        var endDate = $scope.node.plantServeTimeEnd.value(),
                            startDate = $scope.node.plantServeTimeStart.value();

                        if (endDate) {
                            endDate = new Date(endDate);
                            endDate.setDate(endDate.getDate());
                            $scope.node.plantServeTimeStart.max(endDate);
                        } else if (startDate) {
                            $scope.node.plantServeTimeEnd.min(new Date(startDate));
                        } else {
                            endDate = new Date();
                            $scope.node.plantServeTimeStart.max(endDate);
                            $scope.node.plantServeTimeEnd.min(endDate);
                        }
                    },
                    //解决方案服务开始时间变化
                    solutionServeTimeStartChange: function () {
                        var startDate = $scope.node.solutionServeTimeStart.value(),
                            endDate = $scope.node.solutionServeTimeEnd.value();

                        if (startDate) {
                            startDate = new Date(startDate);
                            startDate.setDate(startDate.getDate());
                            $scope.node.solutionServeTimeEnd.min(startDate);
                        } else if (endDate) {
                            $scope.node.solutionServeTimeStart.max(new Date(endDate));
                        } else {
                            endDate = new Date();
                            $scope.node.solutionServeTimeStart.max(endDate);
                            $scope.node.solutionServeTimeEnd.min(endDate);
                        }
                    },
                    //解决方案服务结束时间变化
                    solutionServeTimeEndChange: function () {
                        var endDate = $scope.node.solutionServeTimeEnd.value(),
                            startDate = $scope.node.solutionServeTimeStart.value();

                        if (endDate) {
                            endDate = new Date(endDate);
                            endDate.setDate(endDate.getDate());
                            $scope.node.solutionServeTimeStart.max(endDate);
                        } else if (startDate) {
                            $scope.node.solutionServeTimeEnd.min(new Date(startDate));
                        } else {
                            endDate = new Date();
                            $scope.node.solutionServeTimeStart.max(endDate);
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
                    }
                };

                //定义列表页每一行的数据模板
                var gridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: name #');
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

                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.select($event,dataItem)" ng-show="!dataItem.showCancel">选择</button>');
                    result.push('<button type="button" class="table-btn" ng-click="events.unSelect($event,dataItem)" ng-show="dataItem.showCancel">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplate = result.join('');
                })();

                $scope.ui = {
                    windows: {
                        addWindow: {//添加窗口
                            modal: true,
                            content: '@systemUrl@/views/noticeManage/addInfo.html',
                            visible: false,
                            title: false,
                            open: function () {
                                this.center();
                            }
                        },
                        viewWindow: {//查看窗口
                            modal: true,
                            content: '@systemUrl@/views/noticeManage/viewInfo.html',
                            visible: false,
                            title: false,
                            open: function () {
                                this.center();
                            }
                        }
                    },
                    editor: KENDO_UI_EDITOR,
                    addPageGrid: {
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
                                            angular.forEach(datas, function (data) {
                                                data.showCancel = false;
                                                angular.forEach($scope.model.createMerchantDto.solution, function (dataItem) {
                                                    if (data.solutionId == dataItem.solutionId) {
                                                        data.showCancel = true;
                                                    }
                                                });
                                            });
                                            return datas;
                                        } else {
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
                                {field: 'name', title: '解决方案名称'},
                                {field: 'jobCount', title: '岗位体系', width: 100},
                                {field: 'lessonCount', title: '课程', width: 60},
                                {field: 'abilityCount', title: '能力项', width: 80},
                                {
                                    title: '操作', width: 80
                                }
                            ]
                        }
                    },
                    //日期控件
                    datePicker: {
                        //平台服务时间开始控件
                        plantServeTimeStart: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd',
                                height: 10,
                                change: ButtonUtils.plantServeTimeStartChange,
                                //value: new Date(),
                                min: new Date()
                            }
                        },
                        //平台服务时间结束控件
                        plantServeTimeEnd: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd',
                                change: ButtonUtils.plantServeTimeEndChange,
                                min: new Date()
                            }
                        },
                        //解决方案服务时间开始控件
                        solutionServeTimeStart: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd',
                                height: 10,
                                change: ButtonUtils.solutionServeTimeStartChange,
                                value: new Date(),
                                min: new Date()
                            }
                        },
                        //解决方案服务时间结束控件
                        solutionServeTimeEnd: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd',
                                change: ButtonUtils.solutionServeTimeEndChange,
                                min: new Date()
                            }
                        }
                    }
                };

                $scope.ui.addPageGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.addPageGrid.options);

            }
        ]
            ;
    }
)
;
