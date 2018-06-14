define(function () {
    'use strict';
    return ['$scope', 'learningTimeStatisticService', 'KENDO_UI_GRID', 'kendo.grid',
        function ($scope, learningTimeStatisticService, KENDO_UI_GRID, kendoGrid) {

            var utils;
            $scope.model = {
                indexUnitParams: {},
                indexOrgParams: {},
                learningTimePageParams: {},
                page: {
                    pageSize: 10
                }
            };
            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //== index node
                learningTimeGrid: null,
                indexOrgTree: null,
                orgPopup: null,
                unitPopup: null,
                indexUnitTree: null
            };
            $scope.events = {
                search: function (e) {
                    e.preventDefault();
                    if ($scope.model.indexUnitParams.viewName == null || $scope.model.indexUnitParams.viewName == '') {
                        $scope.model.learningTimePageParams.unitId = null;
                    }
                    if ($scope.model.indexOrgParams.viewName == null || $scope.model.indexOrgParams.viewName == '') {
                        $scope.model.learningTimePageParams.orgId = null;
                    }
                    $scope.node.learningTimeGrid.pager.page(1);
                },
                /**
                 * 查询事件
                 * @param e
                 */
                enterSearch: function (e) {
                    e.preventDefault();
                    if (e.keyCode === 13) {
                        this.search(e);
                    }
                },
                //== 管理界面单位树的事件
                //
                //## 展示单位树
                //## 刷新单位树
                //## 监听<down>方向键
                showIndexUnit: function () {
                    $scope.node.unitPopup.open();
                }
                ,
                keyUpIndexUnit: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.indexUnitTree.focus();
                    }
                }
                ,
                refreshIndexUnit: function () {
                    $scope.model.indexUnitParams.parentId = null;
                    $scope.model.indexUnitParams.name = $scope.model.indexUnitParams.viewName;

                    if ($scope.node.indexUnitTree) {
                        $scope.node.indexUnitTree.dataSource.read();
                    }
                }
                ,
                keyUpIndexOrg: function (e) {
                    if (e.keyCode == 40) {
                        $scope.node.indexOrgTree.focus();
                    }
                }
                ,
                refreshIndexOrg: function () {
                    $scope.model.indexOrgParams.parentId = null;
                    $scope.model.indexOrgParams.name = $scope.model.indexOrgParams.viewName;

                    if ($scope.node.indexOrgTree) {
                        $scope.node.indexOrgTree.dataSource.read();
                    }
                }
                ,
                //== 管理界面部门树的事件
                //
                //## 展示部门树
                //## 刷新部门树
                //## 监听<down>方向键
                showIndexOrg: function () {
                    $scope.node.orgPopup.open();
                }

            };
            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: userName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: unitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: learningTime #');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();
            $scope.ui = {
                popup: {
                    indexUnit: {
                        anchor: '#unit_input'
                    },
                    indexOrg: {
                        anchor: '#org_input'
                    }
                },

                tree: {
                    indexUnit: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/web/admin/employee/listUnit',
                                    data: function () {
                                        var temp = {}, params = $scope.model.indexUnitParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                }
                                            }
                                        }
                                        return temp;
                                    },
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                data: function (response) {
                                    return response.info;
                                },
                                model: {
                                    hasChildren: 'hasChildren'
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = $scope.node.indexUnitTree.dataItem(e.node);
                            $scope.model.indexUnitParams.viewName = node.name;
                            $scope.model.learningTimePageParams.unitId = $scope.model.indexOrgParams.unitId = node.unitId;

                            $scope.$apply();
                            // 刷新组织机构树
                            $scope.node.indexOrgTree.dataSource.read();

                            $scope.node.unitPopup.close();
                        },
                        expand: function (e) {
                            var node = $scope.node.indexUnitTree.dataItem(e.node);
                            // 展开树的时候不带名称查询
                            $scope.model.indexUnitParams.parentId = $scope.model.indexOrgParams.unitId = node.unitId;
                            // 刷新组织机构树
                            $scope.node.indexOrgTree.dataSource.read();
                        }
                    },
                    indexOrg: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/web/admin/employee/listOrg',
                                    // url: '/admin/datas/employee/unit.json',
                                    data: function () {
                                        var temp = {}, params = $scope.model.indexOrgParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                }
                                            }
                                        }
                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            schema: {
                                data: function (response) {
                                    return response.info;
                                },
                                model: {
                                    hasChildren: 'hasChildren'
                                }
                            }
                        },
                        dataTextField: 'name',
                        select: function (e) {
                            var node = $scope.node.indexOrgTree.dataItem(e.node);
                            $scope.model.indexOrgParams.viewName = node.name;
                            $scope.model.learningTimePageParams.orgId = node.unitId;
                            $scope.$apply();

                            $scope.node.orgPopup.close();
                        },
                        expand: function (e) {
                            var node = $scope.node.indexOrgTree.dataItem(e.node);
                            $scope.model.indexOrgParams.parentId = node.unitId;
                        }
                    }
                },
                learningTimeGrid: {
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
                                    url: '/web/admin/learningTime/findLearningTimePage',
                                    data: function (e) {
                                        var temp = {}, params = $scope.model.learningTimePageParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;
                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    if (response.status) {
                                        var viewData = response.info,
                                            i = 1;
                                        _.forEach(viewData, function (row) {
                                            row.index = i++;
                                        });
                                    }
                                    return response;
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
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
                            pageSizes: true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {title: 'No.', width: 60},
                            {sortable: false, field: 'userName', title: '学员名称', width: 250},
                            {sortable: false, field: 'unitName', title: '所属单位'},
                            {sortable: false, field: 'learningTime', title: '学习时长(分钟)', width: 200}
                        ]
                    }
                }
            };
            $scope.ui.learningTimeGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.learningTimeGrid.options);

        }];
});
