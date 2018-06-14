/*** Created by admin on 2015/5/11.*/
define(function () {
    'use strict';
    return ['$scope', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', '$window',
        function ($scope, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, $window) {

            $scope.model = {};
            $scope.ui = {};
            $scope.events = {};
            $scope.node = {};
            $scope.model.selectItems = [];

            // 构建表格的内容模板
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox" id="check_#: OrderID #"  class="k-checkbox" ng-checked="selected" />');
                result.push('<label class="k-checkbox-label" for="check_#: OrderID #"></label>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: OrderID #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: Freight #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: OrderDate #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: ShipCity #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: ShipPostalCode #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button kendo-button class="k-primary">修改</button>');
                result.push('<button kendo-button>删除</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            $scope.events = {
                selectAll: function () {
                    kendoGrid.selectAll($scope);
                },
                checkBoxCheck: function (e, dataItem) {
                    kendoGrid.checkBoxCheck($scope, e, dataItem);
                },

                // 跳转到指定的页数
                toPageIndex: function () {
                    console.log($scope.node.gridInstance);
                    if ($scope.model.toPage) {
                        $scope.node.gridInstance
                            .dataSource.page($scope.model.toPage);
                    }
                }
            };

            $scope.ui = {
                tree: {
                    options: {
                        // 触发当你选中的项目改变后的函数
                        change: function () {
                        },
                        // 当用户点击复选框的时候触发// checkChildren必须为true
                        check: function () {
                        },
                        // 当收缩的时候触发
                        collapse: function () {
                        },
                        // 数据绑定完成后触发
                        dataBound: function () {
                        },
                        // 拖拽的时候
                        drag: function () {
                        },
                        // 拖拽结束
                        dragend: function () {
                        },
                        // 拖拽开始
                        dragstart: function () {
                        },
                        // 拖拽放下
                        drop: function () {
                        },
                        // 展开
                        expand: function () {
                        },
                        // 不知道干嘛用的
                        navigate: function () {
                        },
                        // 用户选中节点的时候
                        select: function () {
                        },

                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: {
                            transport: {
                                read: {
                                    url: 'datas/departments.json',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                model: {
                                    id: 'id',
                                    hasChildren: 'HasDepartments'
                                }
                            }
                        }
                    }
                },
                grid: {
                    options: {
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        dataSource: {
                            transport: {
                                read: {
                                    url: 'datas/remotes.json',
                                    dataType: 'json'
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件

                        columns: [
                            {
                                title: '<span><input class=\'k-checkbox\' id=\'selectAll\' ng-click=\'events.selectAll()\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'selectAll\'>全选</label></span>',
                                filterable: false, width: 100,
                                attributes: { // 用template的时候失效。
                                    'class': 'tcenter'
                                }
                            },
                            {field: 'OrderID', title: 'Customer ID', width: 130},
                            {field: 'Freight', title: 'Ship Name', width: 220},
                            {field: 'OrderDate', title: 'Ship Address', format: '{0: yyyy-MM-dd HH:mm:ss}'},
                            {field: 'ShipCity', title: 'Ship City', width: 130},
                            {field: 'ShipPostalCode', title: 'Ship Country', width: 130},
                            {
                                command: [{
                                    text: '修改', click: function (e) {

                                        e.preventDefault();
                                    }
                                },
                                    {
                                        text: '删除', click: function (e) {

                                        e.preventDefault();
                                    }
                                    }],
                                title: '操作'
                            }
                        ]
                    }
                }
            };


            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);

            $scope.ui.tree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.tree.options);
        }];
});
