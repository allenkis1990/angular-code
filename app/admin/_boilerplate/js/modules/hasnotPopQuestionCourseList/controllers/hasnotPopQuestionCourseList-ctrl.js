define([], function () {
    'use strict';
    return {
        indexCtrl: ['$scope', '$stateParams', '$http', 'hbUtil', '$state', function ($scope, $stateParams, $http, hbUtil, $state) {


            $scope.model = {
                pageNo: 1,
                pageSize: 10
            };
            if ($stateParams.ruleId) {
                $scope.model.ruleId = $stateParams.ruleId;
            }
            if ($stateParams.poolId) {
                $scope.model.poolId = $stateParams.poolId;
            }

            $scope.events = {
                lookCourseDetail: function (id) {
                    $state.go('states.courseManager.view', {courseId: id});
                }
            };

            //课程列表模板
            var courseRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td title="#: courseName #">');
                result.push('#: courseName #');
                result.push('</td>');


                result.push('<td>');
                result.push('#: period #');
                result.push('</td>');


                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.lookCourseDetail(dataItem.courseId)">查看</button>');
                result.push('</td>');

                result.push('</tr>');
                courseRowTemplate = result.join('');
            })();


            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            $scope.courseGrid = {
                options: {
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(courseRowTemplate),
                    scrollable: false,
                    noRecords: {
                        template: '未找到无弹窗题课程'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/commodityManager/findCourseWithoutPopPage',
                                data: function (e) {
                                    var temp = {
                                        pageNo: e.page,
                                        pageSize: e.pageSize,
                                        ruleId: validateIsNull($scope.model.ruleId) ? undefined : $scope.model.ruleId,
                                        poolId: validateIsNull($scope.model.poolId) ? undefined : $scope.model.poolId
                                    };

                                    $scope.model.pageNo = e.page;
                                    $scope.model.pageSize = e.pageSize;
                                    return temp;
                                },
                                dataType: 'json'
                            }

                        },
                        pageSize: 5, // 每页显示的数据数目
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
                        hbUtil.kendo.grid.nullDataDealLeaf(e);
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
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
                        {field: 'ruleName', title: '课程名称', sortable: false, width: 250},
                        //{field: "ruleId", title: "模板id", sortable: false, width:200},
                        {field: 'courseRequireValue', title: '学时', sortable: false, width: 130},
                        {
                            title: '操作', width: 100
                        }
                    ]
                }
            };


        }]
    };
});