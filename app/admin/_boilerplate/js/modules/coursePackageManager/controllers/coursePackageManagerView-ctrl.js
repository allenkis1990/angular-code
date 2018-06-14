define(function () {
    'use strict';
    return ['$scope', 'global', 'KENDO_UI_TREE', 'KENDO_UI_GRID', 'kendo.grid', 'courseManagerService', 'coursePackageManagerService', '$state', '$stateParams', 'TabService',
        function ($scope, global, KENDO_UI_TREE, KENDO_UI_GRID, kendoGrid, courseManagerService, coursePackageManagerService, $state, $stateParams, TabService) {

            $scope.model = {
                lessonPageParams: {},
                page: {
                    pageNo: 1,
                    pageSize: 10
                },
                indexCourseParams: {
                    id: '0',
                    parentId: null,
                    name: null
                },
                indexCRMParams: {
                    courseId: null,
                    parentId: null,
                    name: null
                },
                periodCount: 0,
                coursePackage: {},
                courseParams: {},
                selectedList: [],
                /**
                 * 页面状态控制
                 */
                saving: false,
                showSuccess: false
            };
            coursePackageManagerService.findCoursePool($stateParams.packageId).then(function (data) {
                if (data.status) {
                    $scope.model.coursePackage = data.info;
                    $scope.model.selectedList = data.info.courseList;
                } else {
                    $scope.globle.showTip(data.info, 'error');
                }
            });

            $scope.events = {
                /**
                 * 显示课程分类
                 */
                openLessonTypeTree: function (e) {
                    e.stopPropagation();
                    $scope.lessonTypeShow = !$scope.lessonTypeShow;
                },
                /**
                 * 显示课程分类
                 */
                openTree: function (e) {
                    e.stopPropagation();
                },
                getTypeInfo: function (dataItem, e) {
                    e.stopPropagation();
                    if (dataItem.id == 0) {
                        $scope.model.typeName = dataItem.name;
                        $scope.model.lessonPageParams.categoryId = '';
                        $scope.lessonTypeShow = false;
                    } else {
                        //    lessonResourceManageService.findHashLessonType(dataItem.id).then(function (data) {
                        //        if (!data.info) {
                        $scope.model.typeName = dataItem.name;
                        $scope.model.lessonPageParams.categoryId = dataItem.id;
                        $scope.lessonTypeShow = false;
                        //    }
                        //});
                    }
                },
                goCoursePackageManager: function (e) {
                    e.preventDefault();
                    $state.go('states.coursePackageManager');
                },
                queryCourseInPool: function (e) {
                    $scope.model.page.pageNo = 1;
                    $scope.node.courseInsideGrid.pager.page(1);
                    e.preventDefault();
                }

            };

            $scope.model.utils = {
                isSelected: function (id) {
                    var isSelected = false;
                    angular.forEach($scope.model.selectedList, function (data, index) {
                        if (data.courseId != null && data.courseId == id) {
                            isSelected = true;
                        } else if (data.id == id) {
                            isSelected = true;
                        }
                    });
                    return isSelected;
                },
                isChoosed: function (id) {
                    var isChoosed = false;
                    angular.forEach($scope.model.selectedList, function (data, index) {
                        if (data.courseId != null && data.courseId == id && data.choose == true) {
                            isChoosed = true;
                        } else if (data.id == id && data.choose == true) {
                            isChoosed = true;
                        }
                    });
                    return isChoosed;
                }

            };
            //=============分页开始=======================
            var courseInsideGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('<div title="#: courseName #">');
                result.push('#: courseName #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: categoryName #">');
                result.push('#: categoryName #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: coursePeriod*1.0/10 #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: period #');
                result.push('</td>');

                result.push('</tr>');
                courseInsideGridRowTemplate = result.join('');
            })();
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseCategoryAction/findByQuery?categoryId=' + id,
                            dataType: 'json',
                            success: function (result) {
                                options.success(result);
                            },
                            error: function (result) {
                                options.error(result);
                            }
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id',
                        length: '',
                        hasChildren: 'hasChildren',
                        uid: 'id'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });

            //当前被选中的节点的数据
            var crmSelectedNodeDataItem = '';
            var tempCourseCategoryPid = '0'; //缓存节点
            var tempCourseCategoryId = '0';
            var field = 'period';
            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        messages: {
                            loading: '正在加载课程分类...',
                            requestFailed: '课程分类加载失败!.'
                        },
                        dataSource: dataSource,
                        expand: function (e) {
                            //console.log('expand tree node...');
                            var node = $scope.node.tree.dataItem(e.node);
                            $scope.model.indexCourseParams.id = node.id;
                            $scope.model.categoryId = node.id;
                            $scope.model.indexCourseParams.parentId = $scope.model.indexCRMParams.unitId = node.unitId;
                            $scope.$apply();
                            // 刷新组织机构树
                            //$scope.node.indexCourseTree.dataSource.read();
                        }
                    }
                },
                courseInsideGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(courseInsideGridRowTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/coursePoolAction/findCourseInPoolPage',
                                    data: function (e) {
                                        var temp = {};
                                        temp.poolId = $stateParams.packageId;
                                        temp.courseName = $scope.model.courseParams.name;
                                        temp.courseType = $scope.model.lessonPageParams.categoryId;
                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;
                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 50, // 每页显示的数据数目
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
                            pageSizes: [5, 10, 30, 50],
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
                            //{
                            {sortable: false, field: 'name', title: '课程名称'},
                            {sortable: false, field: 'typeName', title: '课程分类', width: 350},
                            {sortable: false, field: 'coursePeriod', title: '参考学时', width: 150},
                            {sortable: false, field: 'period', title: '选课学时', width: 150}
                        ]
                    }
                }
            };
            $scope.ui.courseInsideGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseInsideGrid.options);
        }];
});
