define(function () {
    'use strict';
    return [
        '$scope',
        'KENDO_UI_GRID',
        'KENDO_UI_TREE',
        'kendo.grid',
        'global',
        'selectCourseCenterService',
        '$timeout',
        '$state',
        function ($scope, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, global, selectCourseCenterService, $timeout, $state) {
            var ButtonUtils, selectedNode, selectedNodeDataItem, childrenDataLength;
            $scope.model = {
                queryParam: {
                    //分页信息
                    pageNo: 1,
                    pageSize: 10,
                    //查询条件
                    courseName: '',//课程名称
                    courseCategoryId: '',//课程分类ID
                    courseStatus: -2,//课程状态:-2查全部，-1表示没有课件，0-表示解析中, 1-表示解析成功, 2-表示解析失败,//
                    selectTimeStart: '',//课程加入包时间(开始)
                    selectTimeEnd: ''//课程加入包时间(结束)
                },
                courseId: '',
                courseIdList: []//保存主页面删除选修课的课程ID
            };

            $scope.regexps = global.regexps;

            $scope.selected = false;
            $scope.node = {
                provideBeginTime: null,//课程添加开始时间
                provideEndTime: null,//课程添加结束时间
                gridInstance: null
            };

            $scope.$watch('model.queryParam.categoryName', function (newValue, oldValue) {
                if (newValue == '') {
                    $scope.model.queryParam.courseCategoryId = '';
                }
            });

            ButtonUtils = {
                //课程添加开始时间变化
                startChange: function () {
                    var startDate = $scope.node.provideBeginTime.value(),
                        endDate = $scope.node.provideEndTime.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.provideEndTime.min(startDate);
                    } else if (endDate) {
                        $scope.node.provideBeginTime.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.provideBeginTime.max(endDate);
                        $scope.node.provideEndTime.min(endDate);
                    }
                },
                //课程添加结束时间变化
                endChange: function () {
                    var endDate = $scope.node.provideEndTime.value(),
                        startDate = $scope.node.provideBeginTime.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.provideBeginTime.max(endDate);
                    } else if (startDate) {
                        $scope.node.provideEndTime.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.provideBeginTime.max(endDate);
                        $scope.node.provideEndTime.min(endDate);
                    }
                }
            };
            var viewModel = kendo.observable({
                courseIdList: []
            });
            kendo.bind($('input'), viewModel);
            $scope.events = {
                //打开新增窗口
                openAdd: function () {
                    $state.go('states.selectCourseCenter.add');
                },

                //主页面查看详情
                getDetails: function (id) {
                    $state.go('states.selectCourseCenter.view', {courseId: id});
                },

                //主页面打开课程类别树
                openTree: function (e) {
                    e.stopPropagation();
                    $scope.courseCategoryTreeShow = true;
                },
                //主页面选择课程类别(课程只能挂在叶子类别上，所以查询时课程类别只能选择叶子类别)
                selectCategory: function (e, dataItem) {
                    e.stopPropagation();
                    /*selectedNode = $("#courseCategoryTree").data("kendoTreeView").findByUid(dataItem.uid);
                     //获取当前被选中的节点的数据
                     selectedNodeDataItem = $("#courseCategoryTree").data("kendoTreeView").dataItem(selectedNode);
                     $("#courseCategoryTree").data("kendoTreeView").expand($("#courseCategoryTree").data("kendoTreeView").findByUid(dataItem.uid));*/
                    //childrenDataLength = selectedNodeDataItem.children._data.length;
                    $scope.model.queryParam.categoryName = dataItem.name;//节点的名称
                    $scope.model.queryParam.courseCategoryId = dataItem.id;//节点的id
                    $scope.courseCategoryTreeShow = false;//设置树隐藏
                },
                //主页面关闭课程类别树
                closeTree: function (e) {
                    e.stopPropagation();
                    $scope.courseCategoryTreeShow = false;
                },
                //主页面列表全选
                selectAll: function (e) {
                    //重置存放所选记录ID的数组
                    $scope.model.courseIdList = [];
                    var viewData = $scope.node.gridInstance.dataSource.view(),
                        size = viewData.length, row;
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        if (e.currentTarget.checked && row.deleteAble) {// 选择可以删除的记录
                            $scope.selected = true;
                            row.selected = true;
                            $scope.model.courseIdList.push(row.courseId);
                        } else {
                            $scope.selected = false;
                            row.selected = false;
                        }
                    }
                },

                //列表页面单击每行的复选框执行的事件
                checkBoxCheck: function (e, dataItem) {
                    var id = dataItem.courseId;
                    if (e.currentTarget.checked) {
                        $scope.model.courseIdList.push(id);
                        dataItem.selected = true;
                    } else {
                        var index = _.indexOf($scope.model.courseIdList, id);
                        if (index !== -1) {
                            $scope.model.courseIdList.splice(index, 1);
                        }
                        dataItem.selected = true;
                        if ($scope.model.courseIdList == 0) {
                            $scope.selected = false;
                        }
                    }
                },

                //主页面条件查询时在条件输入框回车提交查询
                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.QueryMainPageList();
                    }
                },
                //主页面按条件查询列表数据
                QueryMainPageList: function () {
                    $scope.model.queryParam.pageNo = 1;
                    $scope.node.gridInstance.pager.page(1);
                    $scope.selected = false;
                },

                //删除一个选修课
                deleteOneChooseCourse: function (e, courseId, deleteAble) {
                    e.stopPropagation();
                    if (!deleteAble) {
                        $scope.globle.showTip('无权删除', 'error');
                        return;
                    }
                    $scope.globle.confirm('提示', '确定要删除选修课吗？确定，系统将发送消息通知学员取消学习。', function (dialog) {
                        $scope.model.courseIdList = [];
                        $scope.model.courseIdList.push(courseId);
                        return selectCourseCenterService.deleteChooseCourse($scope.model.courseIdList).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.globle.showTip('操作成功！', 'success');
                                $scope.model.courseIdList = [];
                                var size = $scope.node.gridInstance.dataSource.view().length;
                                if (size == 1 && $scope.model.queryParam.pageNo != 1) {
                                    $scope.model.queryParam.pageNo = $scope.model.queryParam.pageNo - 1;
                                    $scope.node.gridInstance.pager.page($scope.model.queryParam.pageNo);
                                } else {
                                    $scope.node.gridInstance.dataSource.read();
                                }
                                $scope.selected = false;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });
                },
                //移除多个选修课
                deleteManySelectCourse: function (e) {
                    e.stopPropagation();
                    if ($scope.model.courseIdList.length <= 0) {
                        $scope.globle.showTip('请选择移除课程！', 'error');
                        return;
                    }
                    $scope.globle.confirm('提示', '确定要删除选修课吗？确定，系统将发送消息通知学员取消学习。？', function (dialog) {
                        return selectCourseCenterService.deleteChooseCourse($scope.model.courseIdList).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.selected = false;
                                var size = $scope.node.gridInstance.dataSource.view().length;
                                if (size == $scope.model.courseIdList.length && $scope.model.queryParam.pageNo != 1) {
                                    $scope.model.queryParam.pageNo = $scope.model.queryParam.pageNo - 1;
                                    $scope.node.gridInstance.pager.page($scope.model.queryParam.pageNo);
                                } else {
                                    $scope.node.gridInstance.dataSource.read();
                                }
                                $scope.model.courseIdList = [];
                                $scope.globle.showTip('操作成功！', 'success');
                            } else {
                                $scope.globle.showTip('操作失败！', 'error');
                            }
                        });

                    });
                }

            };

            //定义列表页每一行的数据模板
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('<input  #: deleteAble?\'\':\'disabled\'# ng-checked="dataItem.selected" ng-model="dataItem.selected" ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox" id="check_#: courseId #"  class="k-checkbox"/>');
                result.push('<label class="k-checkbox-label" for="check_#: courseId #"></label>');
                result.push('</td>');

                result.push('<td title="#: courseName #">');
                result.push('#: courseName #');
                result.push('</td>');

                result.push('<td title="#: categoryName #">');
                result.push('#: categoryName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: period #');
                result.push('</td>');

                result.push('<td title="#: teacherName #">');
                result.push('#: teacherName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: packageCourseUnitName #');
                result.push('</td>');

                /*result.push('<td>');
                 result.push('#: courseStatus==-1?"暂无课件":(courseStatus==0?"转换中":(courseStatus==1?"转换成功":"转换失败")) #');
                 result.push('</td>');*/

                result.push('<td title="#: selectTime #">');
                result.push('#: selectTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: selectCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.tryListen(\'#: courseId #\')" #: courseStatus==1?\'\':\'disabled\'# class="k-primary" >试听</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.getDetails(\'#: courseId #\')">详情</button>');
                result.push('<button type="button" has-permission="selectCourseCenter/del" class="table-btn" ng-click="events.deleteOneChooseCourse($event,\'#: courseId #\',\'#: deleteAble #\')" #: deleteAble?\'\':\'disabled\'#>删除</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            //主页面课程资源分类树
            var mainPageTreeDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '0',
                            myModel = mainPageTreeDataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseResourcesManagerAction/findByQuery?categoryId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
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
                        hasChildren: 'hasChildren'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });
            $scope.ui = {

                //主页面课程资源分类树
                mainPageTree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: mainPageTreeDataSource
                    }
                },
                grid: {
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
                                    url: '/web/admin/chooseCourse/findByQuery',
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
                                            data.selected = false;
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
                        scrollable: false,
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
                            {
                                title: '<input ng-checked=\'selected\' id=\'selectAll\' class=\'k-checkbox\' ng-click=\'events.selectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'selectAll\'></label>',
                                filterable: false,
                                width: 40
                            },
                            {field: 'courseName', title: '课程名称'},
                            {field: 'categoryName', title: '课程资源分类'},
                            {field: 'period', title: '学分', width: 60},
                            {field: 'teacherName', title: '讲师', width: 150},
                            {field: 'packageCourseUnitName', title: '添加方'},
                            /*{field: "courseStatus", title: "转换状态", width: 80},*/
                            {field: 'selectTime', title: '添加日期', width: 150},
                            {field: 'selectCount', title: '被选次数', width: 80},
                            {
                                title: '操作', width: 120
                            }
                        ]
                    }
                },
                //日期控件
                datePicker: {
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            height: 10,
                            change: ButtonUtils.startChange

                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: ButtonUtils.endChange
                        }
                    }
                }
            };

            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);
            $scope.ui.mainPageTree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.mainPageTree.options);
        }];
});
