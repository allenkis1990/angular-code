define(function () {
    'use strict';
    return ['$scope', 'solutionService', '$state', 'kendo.grid', function ($scope, solutionService, $state, kendoGrid) {

        var solutionIndex = {};

        // define data-binding variable
        angular.extend($scope, {
            ui: {},                     // Kendo component options config
            model: {},                  // data model
            node: {},                   // node for kendo component
            event: {}                   // intercept ui event
        });

        $scope.model = {
            indexPageParams: {
                pageNo: 1,
                pageSize: 10,
                name: null,
                createBeginDate: null,
                createEndDate: ''
            }
        };

        $scope.node = {
            solutionGrid: null
        };

        solutionIndex.uiTemplate = {
            solutionGridRow: function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: appTypeView #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: creator #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: useCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: status == 1 ? "可用" : "不可用" #');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button ng-click="events.view($event, dataItem)" class="table-btn">查看</button>');
                result.push('<button ng-if="dataItem.status == 1" ng-click="events.send($event, dataItem)" class="table-btn">推送</button>');
                result.push('<button ng-if="dataItem.status == 1" ng-click="events.remove($event, dataItem)" class="table-btn">回收</button>');
                result.push('</td>');

                result.push('</tr>');
                return result.join('');
            }
        };

        solutionIndex.utils = {
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
                    change: solutionIndex.utils.startChange
                },
                end: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd',
                    change: solutionIndex.utils.endChange
                },
                workDate: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd'
                }
            },

            solutionGrid: {
                selectable: true,
                scrollable: false,
                pageable: {
                    refresh: true,
                    buttonCount: 10,
                    pageSizes: true,
                    pageSize: 10
                },
                // 每个行的模板定义,
                rowTemplate: kendo.template(solutionIndex.uiTemplate.solutionGridRow()),
                noRecords: {
                    template: '暂无数据'
                },
                dataBinding: function (e) {
                    kendoGrid.nullDataDealLeaf(e);
                },
                dataSource: {
                    serverPaging: true,
                    page: 1,
                    pageSize: 10, // 每页显示的数据数目
                    transport: {
                        parameterMap: function (data, type) {
                            // console.log('-----当前grid的刷新方式是: ' + type);
                            if (type === 'read') {
                                var temp = {}, params = $scope.model.indexPageParams;
                                params.pageNo = data.page;
                                params.pageSize = data.pageSize;

                                if (params.createBeginDate) {
                                    params.createBeginTime = params.createBeginDate.replace(/-/g, '/');
                                } else {
                                    params.createBeginTime = null;
                                }
                                if (params.createEndDate) {
                                    params.createEndTime = params.createEndDate.replace(/-/g, '/');
                                } else {
                                    params.createEndTime = null;
                                }

                                for (var key in params) {
                                    if (params.hasOwnProperty(key)) {
                                        if (params[key]) {
                                            temp[key] = params[key];
                                            if (key === 'createEndTime') {
                                                temp[key] = $.trim(params[key]) + ' 23:59:59';
                                            }
                                        }
                                    }
                                }
                                return temp;
                            }
                            return data;
                        },
                        read: {
                            url: '/web/admin/solution/index',
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
                            // 重置跟分页相关的缓存参数
                            var data = $scope.model.indexPageParams;
                            if (data.createBeginDate) {
                                data.createBeginDate = data.createBeginDate.replace(/\//g, '-');
                            }
                            if (data.createEndDate) {
                                data.createEndDate = data.createEndDate.replace(/\//g, '-');
                            }
                            $scope.$apply();

                            return response.info;
                        }
                    }
                },
                // 选中切换的时候改变选中行的时候触发的事件
                columns: [
                    {title: 'No.', width: 60},
                    {field: 'name', title: '解决方案名称'},
                    {field: 'appTypeView', title: '类型', width: 100},
                    {field: 'createTime', title: '创建时间', width: 150},
                    {field: 'creator', title: '创建人', width: 150},
                    {field: 'useCount', title: '使用数', width: 80},
                    {field: 'status', title: '状态', width: 80},
                    {title: '操作', width: 160}
                ]
            }
        };

        $scope.events = {

            queryByEnter: function (e) {
                if (e.keyCode == 13) {
                    this.reloadSolutionGrid(e);
                }
            },

            reloadSolutionGrid: function (e) {
                e.preventDefault();
                $scope.node.solutionGrid.dataSource.page(1);
            },

            view: function (e, dataItem) {
                e.preventDefault();

                $state.go('states.solution.view', {
                    solutionId: dataItem.solutionId
                });
            },

            send: function (e, dataItem) {
                e.preventDefault();

                $state.go('states.solution.send', {
                    solutionId: dataItem.solutionId,
                    appType: dataItem.appType
                });
            },

            remove: function (e, dataItem) {
                e.preventDefault();

                $scope.globle.confirm('提示', '解决方案作废之后，则不可在用！确定要作废该解决方案吗？', function (dialog) {
                    return solutionService.remove(dataItem.solutionId).then(function (response) {
                        dialog.doRightClose();
                        if (response.status) {
                            dataItem.status = 2;
                            $scope.node.solutionGrid.refresh();

                            $scope.globle.showTip('操作成功', 'success');
                        } else {
                            $scope.globle.showTip(response.info, 'error');
                        }
                    });
                });
            }
        };
    }];
});
