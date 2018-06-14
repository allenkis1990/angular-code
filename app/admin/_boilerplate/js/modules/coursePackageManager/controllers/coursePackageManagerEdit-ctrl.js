define(function () {
    'use strict';
    return ['$scope', 'global', 'KENDO_UI_TREE', 'KENDO_UI_GRID', 'kendo.grid', 'courseManagerService', 'coursePackageManagerService', '$state', '$stateParams', 'TabService',
        function ($scope, global, KENDO_UI_TREE, KENDO_UI_GRID, kendoGrid, courseManagerService, coursePackageManagerService, $state, $stateParams, TabService) {
            $scope.validateParams = {
                packageId: $stateParams.packageId
            };
            $scope.model = {
                unitName: '',
                selectIndex: 0,
                lessonPageParams: {},
                page: {
                    pageNo: 1,
                    pageSize: 50
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
                courseParams: {
                    status: 1,
                    needQuestionCount: false,
                    excludedPoolId: $stateParams.packageId
                },
                courseInPoolParams: {},
                selectedList: [],
                periodCount: 0,
                coursePackage: {},
                /**
                 * 页面状态控制
                 */
                saving: false,
                showSuccess: false,
                pageNo: 1
            };

            function init () {
                coursePackageManagerService.findCoursePool($stateParams.packageId).then(function (data) {
                    if (data.status) {
                        if (data.info.containRequired) {
                            console.log(data.info);
                            $state.go('states.coursePackageManager.requiredEdit', {packageId: $stateParams.packageId});
                        }
                        $scope.model.coursePackage = data.info;
                        //console.log( $scope.model.coursePackage );
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }
                });
            }

            init();
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
                        console.log(dataItem);
                        //    }
                        //});
                    }
                    e.preventDefault();
                },
                openListenWindow: function (a, b, c) {
                    window.open('/play/#/previewLesson/trainClassId/' + a + '/courseware/xxx', '_blank');
                },
                select: function (dataItem) {
                    dataItem.courseId = dataItem.id;
                    $scope.model.selectedList.push(dataItem);
                },
                selectAll: function (e) {
                    var viewData = $scope.node.courseGrid.dataSource.view(),
                        size = viewData.length, row;
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        if (!$scope.model.utils.isSelected(row.id)) {
                            row.courseId = row.id;
                            $scope.model.selectedList.push(row);
                        }
                    }
                },
                clearSelect: function () {
                    $scope.model.selectedList.length = 0;
                },
                remove: function (dataItem) {
                    var courseIds = [];
                    courseIds.push(dataItem.courseId);
                    $scope.globle.confirm('提示', '是否要将课程移出课程包', function (dialog) {
                        return coursePackageManagerService.removeCourseInPool($stateParams.packageId, courseIds).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.courseInsideGrid.pager.page(1);
                                $scope.node.courseGrid.pager.page(1);
                                init();
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });
                },
                empty: function () {
                    var viewData = $scope.node.courseInsideGrid.dataSource.view(),
                        size = viewData.length, row;
                    var courseIds = [];
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        courseIds.push(row.courseId);
                    }
                    if (courseIds.length == 0) {
                        $scope.globle.showTip('当前页已被清空', 'info');
                        return;
                    }
                    $scope.globle.confirm('提示', '是否需要将本页显示课程移出课程包', function (dialog) {
                        return coursePackageManagerService.removeCourseInPool($stateParams.packageId, courseIds).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.courseInsideGrid.pager.page(1);
                                $scope.node.courseGrid.pager.page(1);
                                init();
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });
                },
                /**
                 *
                 * @param dataItem
                 * @param direction 移动方向，0/1/2/3，置顶/上移/下移/置底
                 */
                move: function (dataItem, direction) {
                    coursePackageManagerService.move($stateParams.packageId, dataItem.courseId, direction).then(function (data) {
                        $scope.model.saving = false;
                        if (data.status) {
                            $scope.node.courseInsideGrid.pager.page($scope.model.pageNo);
                            $scope.node.courseGrid.pager.page(1);
                            init();
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
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
                        coursePackageManagerService.updateCoursePool($scope.model.coursePackage).then(function (data) {
                            $scope.model.saving = false;
                            if (data.status) {
                                $scope.globle.showTip('修改课程包名称成功！', 'success');
                                init();
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    }
                },
                goCoursePackageManager: function (e) {
                    e.preventDefault();
                    $state.go('states.coursePackageManager').then(function () {
                        $scope.node.coursePackageGrid.pager.page(1);
                    });
                },
                queryCourse: function (e) {
                    $scope.model.page.pageNo = 1;
                    $scope.node.courseGrid.pager.page(1);
                    e.preventDefault();
                },
                queryCourseInPool: function (e) {
                    $scope.model.page.pageNo = 1;
                    $scope.node.courseInsideGrid.pager.page(1);
                    e.preventDefault();
                },
                updatePeriod: function (dataItem) {
                    //if(dataItem.period>1000000){
                    //    $scope.globle.showTip('学分不宜过大', 'error');
                    //    return;
                    //}
                    //if(dataItem.sequence>1000000){
                    //    $scope.globle.showTip('序号不宜过大', 'error');
                    //    return;
                    //}
                    var sequnce = '^[0-9]*$';
                    var reSequnce = new RegExp(sequnce);
                    if (!reSequnce.test(dataItem.sequence)) {
                        $scope.globle.showTip('序号为正整数或0', 'error');
                        return;
                    }
                    var regu = '^[0-9]+(\\.[0-9]{1})?$';
                    var re = new RegExp(regu);
                    if (re.test(dataItem.period)) {
                        if (Number(dataItem.period) == 0) {
                            $scope.globle.showTip(dataItem.courseName + '选课学时不能为0', 'warn');
                            return;
                        } else if (Number(dataItem.period) % 0.5 != 0) {
                            $scope.globle.showTip(dataItem.courseName + '选课学时需被0.5整除', 'warn');
                            return;
                        }
                        coursePackageManagerService.updatePeriod($stateParams.packageId, dataItem).then(function (data) {
                            $scope.model.saving = false;
                            if (data.status) {
                                $scope.globle.showTip('修改包内课程成功！', 'success');
                                $scope.node.courseInsideGrid.pager.page($scope.model.pageNo);
                                $scope.node.courseGrid.pager.page(1);
                                init();
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    } else {
                        $scope.globle.showTip('请输入正实数（最多1位小数）', 'error');
                    }
                },
                unSelect: function (dataItem) {
                    angular.forEach($scope.model.selectedList, function (data, index) {
                        if (data.courseId != null && data.courseId == dataItem.id) {
                            $scope.model.selectedList.splice(index, 1);
                            return;
                        } else if (data.id == dataItem.id) {
                            $scope.model.selectedList.splice(index, 1);
                            return;
                        }
                    });
                },
                addCourse: function () {
                    if ($scope.coursePackageValidate.$valid && !$scope.model.saving && $scope.model.selectedList.length > 0) {
                        var isReturn = false;
                        angular.forEach($scope.model.selectedList, function (data, index) {
                            if (data.period == 0) {
                                $scope.globle.showTip(data.name + '选课学时不能为0', 'warn');
                                isReturn = true;
                                return;
                            } else if (Number(data.period) % 0.5 != 0) {
                                $scope.globle.showTip(data.courseName + '选课学时需被0.5整除', 'warn');
                                isReturn = true;
                                return;
                            }
                        });
                        if (isReturn) {
                            return;
                        }
                        $scope.model.saving = true;
                        coursePackageManagerService.addCourseInPool($stateParams.packageId, $scope.model.selectedList).then(function (data) {
                            $scope.model.saving = false;
                            if (data.status) {
                                $scope.globle.showTip('添加课程成功！', 'success');
                                $scope.model.selectedList.length = 0;
                                $scope.node.courseInsideGrid.pager.page(1);
                                $scope.node.courseGrid.pager.page(1);
                                init();
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    }
                },
                refresh: function (event) {
                    event.preventDefault();
                    $scope.node.courseGrid.pager.page(1);
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
                result.push('<button ng-show="model.utils.isSelected(\'#: id #\')" type="button" class="table-btn"  ng-click="events.unSelect(dataItem)">取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();
            //=============分页开始=======================
            var courseInsideGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('<div  title="#: name #">');
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
                result.push('<input style="text-align:center" name="b{{$index}}" type="text" ng-model="dataItem.period" class="ipt ipt-small"');
                var regu = '^[0-9]+(\\.[0-9]{1})?$';
                result.push('ng-pattern="/' + regu + '/"');
                result.push(' required ');
                result.push('maxlength="10" />');

                result.push('<td>');
                result.push('<input style="text-align:center" name="b{{$index}}" type="text" ng-model="dataItem.sequence" class="ipt ipt-small"');
                var regu = '^[0-9]*$';
                result.push('ng-pattern="/' + regu + '/"');
                result.push(' required ');
                result.push('maxlength="10" />');
                result.push('</td>');

                result.push('<td class="op">');
                //result.push('<button has-permission="coursePackageManager/updatePeriod" type="button" class="table-btn"  ng-click="events.move(dataItem,2)">上移</button>');
                //result.push('<button has-permission="coursePackageManager/updatePeriod" type="button" class="table-btn"  ng-click="events.move(dataItem,1)">下移</button>');
                result.push('<button  type="button" class="table-btn" has-permission="coursePackageManager/updatePeriod"  ng-click="events.updatePeriod(dataItem)">保存修改</button>');
                result.push('<button has-permission="coursePackageManager/removeCourse" type="button" class="table-btn"  ng-click="events.remove(dataItem)">移除</button>');
                result.push('</td>');
                result.push('</tr>');
                courseInsideGridRowTemplate = result.join('');
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
                courseGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        scrollable: true,
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
                            //{
                            //  title: "<input ng-checked='selected' id='selectAlll' class='k-checkbox'
                            // ng-click='events.selectAll($event)' type='checkbox'/><label class='k-checkbox-label'
                            // for='selectAlll'></label>", filterable: false, width: 60 },
                            {sortable: false, field: 'name', title: '课程名称'},
                            {sortable: false, field: 'typeName', title: '课程分类', width: 150},
                            {sortable: false, field: 'status', title: '转换状态', width: 150},
                            {sortable: false, field: 'period', title: '学时', width: 150},
                            //{sortable: false, field: "teacherName", title: "讲师"},
                            //{sortable: true, field: "createTime", title: "创建时间"},
                            //{sortable: true, field: "studyCount", title: "学习人数"},
                            //{sortable: true, field: "praiseCount", title: "赞数"},
                            {
                                title: '操作', width: 100
                            }
                        ]
                    }
                },
                courseInsideGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(courseInsideGridRowTemplate),
                        scrollable: true,
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
                                        temp.courseName = $scope.model.courseInPoolParams.name;
                                        temp.courseType = $scope.model.lessonPageParams.categoryId;
                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;
                                        $scope.model.pageNo = e.page;
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
                            {sortable: false, field: 'typeName', title: '课程分类', width: 150},
                            {sortable: false, field: 'coursePeriod', title: '参考学时', width: 150},
                            {sortable: false, field: 'period', title: '选课学时', width: 150},
                            {sortable: false, field: 'sequence', title: '序号', width: 150},
                            {title: '操作', width: 150}
                        ]
                    }
                }
            };
            $scope.ui.courseGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseGrid.options);

            $scope.ui.courseInsideGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseInsideGrid.options);
        }];
});
