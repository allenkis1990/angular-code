define(function () {
    'use strict';
    return ['$scope', 'KENDO_UI_GRID', 'kendo.grid', '$state',
        function ($scope, KENDO_UI_GRID, kendoGrid, $state) {
            var utils;
            $scope.model = {
                administorPageParams: {},
                page: {
                    pageSize: 10,
                    pageNo: 1
                },

                roleList: []

            };

            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //== index node
                lessonGrid: null,
                workBeginTime: null,
                workEndTime: null
            };

            $scope.ui = {

                lessonGrid: {
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
                                    url: '/web/admin/paymentAccount/getPaymentAccountList?tradeType=0',
                                    data: function (e) {
                                        var temp = {lessonQueryParams: {sort: e.sort}},
                                            params = $scope.model.administorPageParams;
                                        //for (var key in params) {
                                        //    if (params.hasOwnProperty(key)) {
                                        //        if (params[key]) {
                                        //            temp.lessonQueryParams[key] = params[key];
                                        //        }
                                        //    }
                                        //}
                                        temp = $scope.model.administorPageParams;

                                        if (temp.status == undefined || temp.status == '' || temp.status == null) {
                                            temp.status = 0;
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
                            //change: function (e) {
                            //    $scope.model.page.pageNo = parseInt(e.index, 10);
                            //    //== !!important!! 这里重复了page(1)的作用
                            //    // $scope.node.lessonGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'name', title: '管理员账号', width: 150},
                            {sortable: false, field: 'typeName', title: '姓名'},
                            {sortable: false, field: 'period', title: '所属角色'},
                            {sortable: false, field: 'teacherName', title: '单位名称', width: 250},
                            {sortable: true, field: 'studyCount', title: '启用状态'},
                            {
                                title: '操作', width: 250
                            }
                        ]
                    }
                }
            };
        }];
});
