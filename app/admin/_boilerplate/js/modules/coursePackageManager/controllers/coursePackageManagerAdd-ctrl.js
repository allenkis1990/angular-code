define(function () {
    'use strict';
    return ['$scope', 'KENDO_UI_TREE', 'KENDO_UI_GRID', 'kendo.grid', 'courseManagerService', 'coursePackageManagerService', '$stateParams', '$state',
        function ($scope, KENDO_UI_TREE, KENDO_UI_GRID, kendoGrid, courseManagerService, coursePackageManagerService, $stateParams, $state) {
            $scope.validateParams = {
                packageId: ''
            };
            $scope.model = {
                unitName: '',
                selectIndex: 0,
                page: {
                    pageNo: 1,
                    pageSize: 50
                },
                indexCourseParams: {
                    id: '0',
                    parentId: null,
                    name: null
                },
                lessonPageParams: {},
                indexCRMParams: {
                    courseId: null,
                    parentId: null,
                    name: null
                },
                courseParams: {
                    status: 1,
                    needQuestionCount: false
                },
                selectedList: [],
                periodCount: 0,
                coursePackage: {showName: ''},
                /**
                 * 页面状态控制
                 */
                saving: false,
                showSuccess: false
            };


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
                /**
                 *  选择类别
                 */
                selectCategory: function (e, dataItem) {
                    if (dataItem.id == 0) {
                        $scope.model.courseParams.categoryId = null;
                        $scope.node.courseGrid.pager.page(1);
                    } else {
                        //courseManagerService.findHashLessonType(dataItem.id).then(function (data) {
                        //    if (!data.info) {
                        $scope.model.courseParams.categoryId = dataItem.id;
                        $scope.node.courseGrid.pager.page(1);
                        //    }
                        //});
                    }
                    e.preventDefault();
                },
                openListenWindow: function (a, b, c) {
                    //TabService.appendNewTab('视频播放', 'states.player.coursePlayer', {courseId:a,courseWareId: b,playType:c}, 'states.player', false);
                    window.open('/play/#/previewLesson/trainClassId/' + a + '/courseware/xxx', '_blank');
                },
                select: function (dataItem) {
                    dataItem.defaultPeriod = dataItem.period;
                    $scope.model.selectedList.push(dataItem);
                    $scope.model.utils.getPeriodCount();
                },
                selectAll: function (e) {
                    var viewData = $scope.node.courseGrid.dataSource.view(),
                        size = viewData.length, row;
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        if (!$scope.model.utils.isSelected(row.id)) {
                            row.defaultPeriod = row.period;
                            $scope.model.selectedList.push(row);
                        }
                    }
                    $scope.model.utils.getPeriodCount();
                },
                remove: function (dataItem) {
                    angular.forEach($scope.model.selectedList, function (data, index) {
                        if (data.id == dataItem.id) {
                            $scope.model.selectedList.splice(index, 1);
                            return;
                        }
                    });
                    $scope.model.utils.getPeriodCount();
                },
                empty: function () {
                    $scope.model.selectedList.length = 0;
                    $scope.model.utils.getPeriodCount();
                },
                moveUp: function (index, dataItem, e) {
                    if (index > 0) {
                        var temp = $scope.model.selectedList[index - 1];
                        $scope.model.selectedList[index - 1] = $scope.model.selectedList[index];
                        $scope.model.selectedList[index] = temp;
                    }
                },
                moveDown: function (index, dataItem, e) {
                    if (index < $scope.model.selectedList.length - 1) {
                        var temp = $scope.model.selectedList[index + 1];
                        $scope.model.selectedList[index + 1] = $scope.model.selectedList[index];
                        $scope.model.selectedList[index] = temp;
                    }
                },
                save: function ($event) {
                    if (!$scope.model.saving && $scope.coursePackageValidate.$valid) {
                        $scope.model.saving = true;
                        var tempCourseList = [];
                        var isReturn = false;
                        angular.forEach($scope.model.selectedList, function (data, index) {
                            var tempCourse = {
                                courseId: data.id,
                                sequence: index + 1,
                                period: data.period
                            };
                            if (tempCourse.period == 0) {
                                $scope.globle.showTip(data.name + '选课学时不能为0', 'warn');
                                isReturn = true;
                                return;
                            } else if (Number(tempCourse.period) % 0.5 != 0) {
                                $scope.globle.showTip(data.name + '选课学时需被0.5整除', 'warn');
                                isReturn = true;
                                return;
                            }
                            tempCourseList.push(tempCourse);
                        });
                        if (isReturn) {
                            $scope.model.saving = false;
                            return;
                        }
                        $scope.model.coursePackage.courseList = tempCourseList;
                        coursePackageManagerService.addCoursePool($scope.model.coursePackage).then(function (data) {
                            $scope.model.saving = false;
                            if (data.status) {
                                //$scope.globle.showTip('添加课程包成功！', 'success');
                                $scope.model.showSuccess = true;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    }
                },
                goCoursePackageManager: function (e) {
                    e.preventDefault();
                    $state.go('states.coursePackageManager').then(function () {
                        $state.reload($state.current);
                    });
                },
                carryOnAdd: function () {
                    $scope.model.selectedList.length = 0;
                    $scope.model.periodCount = 0;
                    $scope.model.coursePackage = {};
                    $scope.model.showSuccess = false;
                },
                cancel: function (e) {
                    e.preventDefault();
                    $scope.globle.confirm('提示', '是否放弃编辑', function () {
                        $state.go('states.coursePackageManager').then(function () {
                            $state.reload($state.current);
                        });
                    });
                },
                queryCourse: function (e) {
                    $scope.model.page.pageNo = 1;
                    $scope.node.courseGrid.pager.page(1);
                    e.preventDefault();
                }

            };

            $scope.model.utils = {
                getPeriodCount: function () {
                    var periodCount = 0;

                    angular.forEach($scope.model.selectedList, function (data, index) {
                        if (data.period != null)
                            periodCount = parseFloat(periodCount) + parseFloat(data.period);
                    });
                    $scope.model.periodCount = periodCount;
                },
                isSelected: function (id) {
                    var isSelected = false;
                    angular.forEach($scope.model.selectedList, function (data, index) {
                        if (data.id == id) {
                            isSelected = true;
                        }
                    });
                    return isSelected;
                }
            };

            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('<div title="#: name #">');
                result.push('#: name #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: categoryName #">');
                result.push('#: categoryName #');
                result.push('</div>');
                result.push('</td>');
                //
                result.push('<td>');
                result.push('#:status==0?\'转换中\':(status==1?\'转换成功\':(status==2?\'转换失败\':\'草稿\'))#');
                result.push('</td>');

                result.push('<td>');
                result.push('#: period #');
                result.push('</td>');
                result.push('<td class="op">');
                result.push('<button type="button"  class="table-btn" #: status!=1?\'disabled\':\'\'#  ng-click="events.openListenWindow(\'#: id #\')">试听</button>');
                result.push('<button ng-show="!model.utils.isSelected(\'#: id #\')" type="button" class="table-btn"  ng-click="events.select(dataItem)">选择</button>');
                result.push('<button ng-show="model.utils.isSelected(\'#: id #\')" type="button" class="table-btn"  ng-click="events.remove(dataItem)">取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();
            //课程分类树
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
                courseGrid: {
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
                                    url: '/web/admin/courseManager/findLessonPage',
                                    data: function (e) {
                                        var temp = {courseQuery: {sort: e.sort}}, params = $scope.model.courseParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (key === 'periodBegin' || key === 'periodEnd') {
                                                    if (params[key] != 0) {
                                                        temp.courseQuery[key] = parseFloat(params[key]) * 10;
                                                    }
                                                } else {
                                                    temp.courseQuery[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.courseQuery.isEnabled = 1;
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
                                    angular.forEach(response.info, function (data) {
                                        data.period = data.period * 1.0 / 10;
                                    });
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
                            {sortable: false, field: 'name', title: '课程名称'},
                            {sortable: false, field: 'typeName', title: '课程分类', width: 100},
                            {sortable: false, field: 'status', title: '转换状态', width: 100},
                            {sortable: false, field: 'period', title: '学时', width: 100},
                            {
                                title: '操作', width: 150
                            }
                        ]
                    }
                }
            };
            $scope.ui.courseGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseGrid.options);

            function init () {
                $scope.model.showReturn = ($stateParams.hideReturn != 'true');
            };
            init();

        }];
});
