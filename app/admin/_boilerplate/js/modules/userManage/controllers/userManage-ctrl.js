define(function () {
    'use strict';
    return ['$scope', 'userManageService', 'KENDO_UI_GRID', 'kendo.grid', '$state', 'TabService',
        function ($scope, userManageService, KENDO_UI_GRID, kendoGrid, $state, TabService) {
            var utils;
            $scope.model = {
                userPageParams: {
                    activated: 0,
                    loginInputType: 0
                },
                page: {
                    pageSize: 10,
                    pageNo: 1
                }
            };

            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                userGrid: null,
                createBeginDate: null,
                createEndDate: null
            };

            $scope.events = {

                queryByEnter: function (e) {
                    if (e.keyCode == 13) {
                        this.reloadUserGrid(e);
                    }
                },

                reloadUserGrid: function (e) {
                    e.preventDefault();
                    $scope.node.userGrid.dataSource.page(1);
                },

                openLessonTypeTree: function () {
                    $scope.areaShow = !$scope.areaShow;
                },

                /**
                 * 获取地区
                 * @param dataItem
                 */
                getArea: function (dataItem) {
                    $scope.model.userPageParams.areaName = dataItem.name;
                    $scope.model.userPageParams.areaId = dataItem.id;
                    $scope.areaShow = false;
                },

                /**
                 * 重置
                 * @param e
                 */
                clearUserPageParams: function (e) {
                    $scope.model.userPageParams = {};
                    $scope.model.userPageParams.createBeginDate = '';
                    $scope.model.userPageParams.createEndDate = '';
                    $scope.model.userPageParams.activated = 0;
                    $scope.model.userPageParams.loginInputType = 0;
                },

                /**
                 * 查询事件
                 * @param e
                 */
                search: function (e) {
                    if (e.keyCode === 13) {
                        $scope.events.searchLesson(e);
                    }
                },

                /**
                 * 查询
                 */
                searchLesson: function (e) {
                    if (($scope.model.userPageParams.areaId == undefined || $scope.model.userPageParams.areaId == null) &&
                        ($scope.model.userPageParams.identify == undefined && $scope.model.userPageParams.identify == null) &&
                        ($scope.model.userPageParams.name == undefined || $scope.model.userPageParams.name == null || $.trim($scope.model.userPageParams.name) == '') &&
                        /*($scope.model.userPageParams.activated == 0) &&*/
                        ($scope.model.userPageParams.phoneNumber == undefined || $scope.model.userPageParams.phoneNumber == null) &&
                        ($.trim($scope.model.userPageParams.createEndDate) == ''
                            || $scope.model.userPageParams.createEndDate == null
                            || $scope.model.userPageParams.createEndDate == undefined) &&
                        ($.trim($scope.model.userPageParams.createBeginDate) == ''
                            || $scope.model.userPageParams.createBeginDate == null
                            || $scope.model.userPageParams.createBeginDate == undefined)) {
                        if (!isNaN($scope.model.userPageParams.identify)) {
                            if ($scope.model.userPageParams.identify.length < 6) {
                                $scope.globle.showTip('身份证至少输入6个字符', 'warning');
                                return false;
                            }
                        }
                    }
                    $scope.model.page.pageNo = 1;
                    $scope.node.userGrid.pager.page(1);
                    e.preventDefault();
                },

                /**
                 * 查看详情
                 * @param e
                 * @param dataItem
                 */
                view: function (e, dataItem) {
                    e.preventDefault();
                    $state.go('states.userManage.view', {
                        userId: dataItem.userId
                    });
                },

                /**
                 * 启用
                 * @param e
                 * @param dataItem
                 */
                enable: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('启用', '确定要启用该账号？', function (dialog) {
                        return userManageService.enable(dataItem.userId).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                dataItem.enabled = 1;
                                $scope.node.userGrid.refresh();
                                $scope.globle.showTip('操作成功', 'success');
                            } else {
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                },

                /**
                 * 禁用
                 * @param e
                 * @param dataItem
                 */
                suspend: function (e, dataItem) {
                    e.preventDefault();

                    $scope.globle.confirm('停用', '确定要停用该账号？', function (dialog) {
                        return userManageService.suspend(dataItem.userId).then(function (response) {
                            dialog.doRightClose();
                            if (response.status) {
                                dataItem.enabled = 2;
                                $scope.node.userGrid.refresh();
                                $scope.globle.showTip('操作成功', 'success');
                            } else {
                                $scope.globle.showTip(response.info, 'error');
                            }
                        });
                    });
                },

                /**
                 * 导出
                 */
                exportUserInfo: function (e) {

                    if (($scope.model.userPageParams.areaId == undefined || $scope.model.userPageParams.areaId == null) &&
                        ($scope.model.userPageParams.identify == undefined || $scope.model.userPageParams.identify == null || $.trim($scope.model.userPageParams.identify) == '') &&
                        ($scope.model.userPageParams.name == undefined || $scope.model.userPageParams.name == null || $.trim($scope.model.userPageParams.name) == '') &&
                        ($scope.model.userPageParams.phoneNumber == undefined || $scope.model.userPageParams.phoneNumber == null) &&
                        ($scope.model.userPageParams.email == undefined || $scope.model.userPageParams.email == null) &&
                        ($.trim($scope.model.userPageParams.createEndDate) == ''
                            || $scope.model.userPageParams.createEndDate == null
                            || $scope.model.userPageParams.createEndDate == undefined) &&
                        ($.trim($scope.model.userPageParams.createBeginDate) == ''
                            || $scope.model.userPageParams.createBeginDate == null
                            || $scope.model.userPageParams.createBeginDate == undefined)
                    ) {
                        $scope.globle.showTip('必须输入查询条件才能导出', 'warning');
                        return false;
                    }

                    if (($scope.model.userPageParams.areaId == undefined || $scope.model.userPageParams.areaId == null) &&
                        ($scope.model.userPageParams.identify != undefined && $scope.model.userPageParams.identify != null) &&
                        ($scope.model.userPageParams.name == undefined || $scope.model.userPageParams.name == null || $.trim($scope.model.userPageParams.name) == '') &&
                        ($scope.model.userPageParams.phoneNumber == undefined || $scope.model.userPageParams.phoneNumber == null) &&
                        ($scope.model.userPageParams.email == undefined || $scope.model.userPageParams.email == null) &&
                        ($.trim($scope.model.userPageParams.createEndDate) == ''
                            || $scope.model.userPageParams.createEndDate == null
                            || $scope.model.userPageParams.createEndDate == undefined) &&
                        ($.trim($scope.model.userPageParams.createBeginDate) == ''
                            || $scope.model.userPageParams.createBeginDate == null_source
                            || $scope.model.userPageParams.createBeginDate == undefined)) {
                        if (!isNaN($scope.model.userPageParams.identify)) {
                            if ($scope.model.userPageParams.identify.length < 18) {
                                $scope.globle.showTip('身份证号码至少18位', 'warning');
                                return false;
                            }
                        }
                    }

                    var createEndTime;
                    if ($scope.model.userPageParams.createEndDate != '' && $scope.model.userPageParams.createEndDate != null && $scope.model.userPageParams.createEndDate != undefined) {
                        createEndTime = $scope.model.userPageParams.createEndDate;
                        createEndTime = $.trim(createEndTime) + ' 23:59:59';
                    }
                    userManageService.exportUserInfo({
                        'areaId': $scope.model.userPageParams.areaId,
                        'name': $scope.model.userPageParams.name,
                        'loginInput': $scope.model.userPageParams.loginInput,
                        'activated': $scope.model.userPageParams.activated,
                        'phoneNumber': $scope.model.userPageParams.phoneNumber,
                        'email': $scope.model.userPageParams.email,
                        'identify': $scope.model.userPageParams.identify,
                        'createBeginTime': $scope.model.userPageParams.createBeginDate,
                        'createEndTime': createEndTime
                    }).then(function (data) {
                        if (data.status && data.info) {
                            $scope.globle.showTip('请到异步任务管理查看相关信息', 'success');
                        } else {
                            $scope.globle.showTip('data.info', 'error');
                        }
                    });
                }
            };

            //地区树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/administratorManage/getAreaByParentId?parentId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);
                            },
                            error: function (result) {
                                // notify the data source that the request failed
                                options.error(result);
                            }
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id',
                        hasChildren: 'hasChildren'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });

            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: name #">');
                result.push('#: name #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: sex #');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: identify #">');
                result.push('#: identify #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: phoneNumber #');
                result.push('</td>');

                /*      result.push('<td>');
                      result.push('#: email #');
                      result.push('</td>');*/

                /*                result.push ( '<td>' );
                 result.push ( '#: address #' );
                 result.push ( '</td>' );*/

                /*     result.push('<td>');
                     result.push('#: areaPath #');
                     result.push('</td>');*/

                /*   result.push('<td>');
                   result.push('#: highestEducation #');
                   result.push('</td>');*/
                result.push('<td>');
                result.push('#: registerType #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: registerUnit #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: unitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                /*                result.push ( '<td>' );
                 result.push ( '<div ng-bind="studyItem" ng-repeat="studyItem in dataItem.checkStudyYearList track by $index"></div>');
                 result.push ( '</td>' );

                 result.push ( '<td>' );
                 result.push ( '<div ng-bind="trainClassNameItem" ng-repeat="trainClassNameItem in dataItem.trainClassNameList track by $index"></div>');
                 result.push ( '</td>' );*/

                /*                result.push ( '<td>' );
                 result.push ( '<div ng-bind="qualifiedItem" ng-repeat="qualifiedItem in dataItem.qualifiedList track by $index"></div>' );
                 result.push ( '</td>' );*/

                result.push('</td>');
                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn" has-permission="userManage/query" ng-click="events.view($event,dataItem)">查看选课数据</button>');
                /*                result.push ( '<button type="button" class="table-btn" has-permission="userManage/enable" ng-click="events.enable($event, dataItem)" ng-show="#: enabled # == 2">启用</button>' );
                 result.push ( '<button type="button" class="table-btn" has-permission="userManage/suspend" ng-click="events.suspend($event, dataItem)" ng-show="#: enabled # == 1" >停用</button>' );*/
                result.push('</td>');

                /*                result.push('<td>');
                 result.push('#: newAdd #');
                 result.push('</td>');*/

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            utils = {
                startChange: function () {
                    var startDate = $scope.node.createBeginDate.value(),
                        endDate = $scope.node.createEndDate.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.createEndDate.min(startDate);
                    } else if (endDate) {
                        $scope.node.createBeginDate.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.createBeginDate.max(endDate);
                        $scope.node.createEndDate.min(endDate);
                    }
                },
                endChange: function () {
                    var endDate = $scope.node.createEndDate.value(),
                        startDate = $scope.node.createBeginDate.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.createBeginDate.max(endDate);
                    } else if (startDate) {
                        $scope.node.createEndDate.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.createBeginDate.max(endDate);
                        $scope.node.createEndDate.min(endDate);
                    }
                }
            };

            $scope.ui = {
                datePicker: {
                    begin: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd',
                        change: utils.startChange
                    },
                    end: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd',
                        change: utils.endChange
                    },
                    workDate: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd'
                    }
                },

                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                },

                userGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/userManage/findByQuery',
                                    data: function (e) {
                                        var temp = {}, params = $scope.model.userPageParams;

                                        params.pageNo = e.page;
                                        params.pageSize = $scope.model.page.pageSize;

                                        //转换时间
                                        if (params.createBeginDate) {
                                            params.createBeginDate = params.createBeginDate.replace(/-/g, '/');
                                        }
                                        if (params.createEndDate) {
                                            params.createEndDate = params.createEndDate.replace(/-/g, '/');
                                        }

                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                    if (key === 'createEndDate') {
                                                        if (params[key].indexOf('23:59:59') == -1) {
                                                            temp[key] = $.trim(params[key]) + ' 23:59:59';
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        return temp;

                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var dataview = response.info, index = 1;
                                        angular.forEach(dataview, function (item) {
                                            item.index = index++;
                                        });
                                    }
                                    return response;
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    var data = $scope.model.userPageParams;
                                    // 重置跟分页相关的缓存参数
                                    if (data.createBeginDate) {
                                        data.createBeginDate = data.createBeginDate.replace(/\//g, '-');
                                    }
                                    if (data.createEndDate) {
                                        data.createEndDate = data.createEndDate.replace(/\//g, '-');
                                    }
                                    $scope.$apply();

                                    return response.info;
                                } // 指定数据源
                            },
                            serverPaging: true, //远程获取书籍
                            serverSorting: true //远程排序字段
                        },
                        selectable: true,
                        sortable: {
                            mode: 'single',
                            allowUnsort: false
                        },
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'name', title: '姓名', width: 150},
                            {sortable: false, field: 'sex', title: '性别', width: 70},
                            {sortable: false, field: 'identify', title: '身份证', width: 200},
                            {sortable: true, field: 'phoneNumber', title: '手机号码', width: 120},
                            {sortable: true, field: 'register', title: '注册渠道', width: 200},
                            {sortable: true, field: 'registerUnit', title: '注册来源单位', width: 200},
                            /*         {sortable: false, field: "email", title: "邮箱号", width: 200},
                                     {sortable: true, field: "areaPath", title: "所在地区", width: 110},
                                     {sortable: false, field: "highestEducation", title: "学历", width: 75},*/
                            {sortable: false, field: 'job', title: '工作单位', width: 275},
                            {sortable: false, field: 'createTime', title: '注册时间'},
                            {
                                title: '操作',
                                width: 120
                            }
                            /*{ sortable: false, field:"newAdd", title: "新加的", width: 75 }*/
                        ]
                    }
                }
            };
            $scope.ui.userGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.userGrid.options);
        }];
});
