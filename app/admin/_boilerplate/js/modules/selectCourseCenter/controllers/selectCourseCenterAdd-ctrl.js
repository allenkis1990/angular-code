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
            var ButtonUtils;
            $scope.model = {
                courseDtoList: [],
                //添加页面列表的查询参数
                courseResourceQueryParam: {
                    //分页信息
                    pageNo: 1,
                    pageSize: 5,

                    //查询条件
                    courseCategoryId: undefined,
                    courseName: undefined,
                    courseTeacherName: undefined,
                    isSelfCreated: '0'//是否自建 空-全部，1-是，2-否
                },
                //提交按钮是否可点击
                submitAble: false,
                //添加页面已选择的课程的id，用于与列表的每一条数据ID比对，如果存在本数组中，则自定义的属性值设为false，否则设为true
                selectedCourses: [],//保存添加页面所选择的课程记录，每个元素是一条记录对象

                //添加页面单击每一条记录前的复选框时，如果是选中，
                // 就把当前记录保存在这里，如果用户点击了提交，就把数组的元素添加到selectedCourses中，并清空自己
                selectedCoursesTemp: [],
                totalSelected: 0
            };

            $scope.showDisabled = false;
            $scope.regexps = global.regexps;

            $scope.addPageSelectedAll = false;

            $scope.hasNoSelectedCourse = true;//默认设置用户没有选择要添加的课程为true，显示默认的图片
            $scope.node = {
                addPageGridInstance: null//添加页面的数据列表
            };

            $scope.$watch('model.selectedCourses.length', function (newValue, oldValue) {
                if (newValue == 0) {
                    $scope.hasNoSelectedCourse = true;
                    //设置提交按钮不可用
                    $scope.model.submitAble = false;
                } else {
                    $scope.model.submitAble = true;
                    //设置提交按钮可用
                    $scope.hasNoSelectedCourse = false;
                }

            });

            var viewModel = kendo.observable({
                courseIdList: []
            });
            kendo.bind($('input'), viewModel);
            $scope.events = {

                //添加页面批量选择课程
                selectManyCourse: function (e) {
                    //e.stopPropagation();
                    if ($scope.model.selectedCoursesTemp.length <= 0) {
                        $scope.globle.alert('提示', '请选择要添加的课程！');
                        return;
                    }
                    for (var i = 0; i < $scope.model.selectedCoursesTemp.length; i++) {
                        if (!$scope.model.selectedCoursesTemp[i].showCancel) {
                            $scope.model.selectedCourses.push($scope.model.selectedCoursesTemp[i]);
                            $scope.model.selectedCoursesTemp[i].showCancel = true;
                        }
                        $scope.model.selectedCoursesTemp[i].addPageSelected = false;
                    }

                    $scope.model.selectedCoursesTemp = [];

                    //设置添加页面选择的要添加课程的数量
                    $scope.model.totalSelected = $scope.model.selectedCourses.length;

                    $scope.addPageSelectedAll = false;
                },

                //添加页面选择添加一个课程
                selectOneCourse: function (e, dataItem) {
                    e.stopPropagation();
                    dataItem.showCancel = true;
                    $scope.model.selectedCourses.push(dataItem);

                    //设置添加页面选择的要添加课程的数量
                    $scope.model.totalSelected = $scope.model.selectedCourses.length;
                },

                //添加页面取消选择添加一个课程
                CancelSelectOneCourse: function (e, dataItem) {
                    e.stopPropagation();
                    var index = $scope.model.selectedCourses.indexOf(dataItem);
                    $scope.model.selectedCourses.splice(index, 1);
                    dataItem.showCancel = false;

                    //设置添加页面选择的要添加课程的数量
                    $scope.model.totalSelected = $scope.model.selectedCourses.length;
                    $scope.node.addPageGridInstance.dataSource.read();
                },

                //添加页面点击清空按钮
                clearAllSelected: function (e) {
                    e.stopPropagation();
                    var viewData = $scope.node.addPageGridInstance.dataSource.view(),
                        size = viewData.length;
                    //设置已选择的课程所在数据行的“选择”按钮为显示，“取消选择”按钮为隐藏
                    for (var i = 0; i < $scope.model.selectedCourses.length; i++) {
                        $scope.model.selectedCourses[i].showCancel = false;
                    }


                    //设置当前页的所有数据的复选框为不选中
                    for (var i = 0; i < size; i++) {
                        viewData[i].addPageSelected = false;
                    }

                    $scope.node.addPageGridInstance.dataSource.read();
                    //设置已选数量为0
                    $scope.model.totalSelected = 0;
                    //清空已选择的课程对象数组
                    $scope.model.selectedCourses = [];
                    $scope.addPageSelectedAll = false;
                },
                //添加页面查看详情
                addPageGetDetails: function (id) {
                    $state.go('states.selectCourseCenter.addPageView', {courseId: id});
                },

                //保存新增
                saveAdd: function (e) {
                    //防止事件冒泡
                    e.stopPropagation();
                    //防止用户多次提交表单
                    $scope.showDisabled = true;
                    $('#submitBtn').attr('class', 'btn btn-g');
                    for (var i = 0; i < $scope.model.selectedCourses.length; i++) {
                        var courseDto = {
                            courseId: '',
                            packageId: '',
                            quantitative: '',
                            sequenceNo: 0,
                            objectId: '-1'
                        };
                        courseDto.courseId = $scope.model.selectedCourses[i].courseId;
                        courseDto.packageId = '';
                        courseDto.quantitative = $scope.model.selectedCourses[i].period;
                        courseDto.sequenceNo = 0;
                        courseDto.objectId = '-1';
                        $scope.model.courseDtoList.push(courseDto);
                    }
                    selectCourseCenterService.save($scope.model.courseDtoList).then(function (data) {
                        if (data.status) {
                            $scope.globle.showTip('操作成功！', 'success');
                            //$scope.globle.showTip('添加教师帐号成功！','success');
                            $state.go('states.selectCourseCenter').then(function () {
                                $state.reload();
                            });
                        } else {
                            $scope.globle.alert('提示', data.info);
                            //如果添加失败，则将提交按钮样式还原，用户可以再次提交
                            $scope.showDisabled = false;
                        }
                    });
                },
                //添加界面选择课程类别
                addPageSelectCategory: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.model.courseResourceQueryParam.courseCategoryId = dataItem.id;//选择的课程列别查询条件
                    //清空其他的条件
                    $scope.model.courseResourceQueryParam.courseName = '';//节点的id
                    $scope.model.courseResourceQueryParam.courseTeacherName = '';//节点的id
                    $scope.model.courseResourceQueryParam.isSelfCreated = '0';//节点的id
                    //清空全选
                    $scope.addPageSelectedAll = false;
                    //重新查询
                    //$scope.model.courseResourceQueryParam.pageNo = 1;
                    //$scope.node.addPageGridInstance.pager.page(1);
                },
                //点击全部课程时查询全部
                queryAll: function (e) {
                    e.stopPropagation();
                    $scope.model.courseResourceQueryParam.courseCategoryId = '';//选择的课程列别查询条件
                    //清空其他的条件
                    $scope.model.courseResourceQueryParam.courseName = '';//节点的id
                    $scope.model.courseResourceQueryParam.courseTeacherName = '';//节点的id
                    $scope.model.courseResourceQueryParam.isSelfCreated = '0';//节点的id
                    //清空全选
                    $scope.addPageSelectedAll = false;
                },
                //添加页面列表全选
                addPageSelectAll: function (e) {
                    $scope.model.selectedCoursesTemp = [];
                    var viewData = $scope.node.addPageGridInstance.dataSource.view(),
                        size = viewData.length, row;
                    // 全选
                    $scope.addPageSelectedAll = !$scope.addPageSelectedAll;
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        if (e.currentTarget.checked) {
                            row.addPageSelected = true;
                            $scope.model.selectedCoursesTemp.push(row);
                        } else {
                            row.addPageSelected = false;
                        }
                    }
                },

                //添加页面单击每行的复选框执行的事件
                //如果是选中，就把当前记录放在selectedCoursesTemp中，用户点击选择按钮时，
                //再添加到selectedCourses中
                AddPageCheckBoxCheck: function (e, dataItem) {
                    e.stopPropagation();
                    if (e.currentTarget.checked) {
                        dataItem.addPageSelected = true;
                        //没有被选中，才添加给中间数组selectedCoursesTemp
                        $scope.model.selectedCoursesTemp.push(dataItem);
                    } else {
                        var index = $scope.model.selectedCoursesTemp.indexOf(dataItem);
                        $scope.model.selectedCoursesTemp.splice(index, 1);
                        dataItem.addPageSelected = false;
                    }
                },

                //添加页面条件查询时在条件输入框回车提交查询
                addPagePressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.QueryAddSelectCourse();
                    }
                },
                //按条件查询添加页面列表数据
                QueryAddSelectCourse: function () {
                    $scope.model.courseResourceQueryParam.pageNo = 1;
                    $scope.node.addPageGridInstance.pager.page(1);
                    $scope.addPageSelectedAll = false;
                }
            };

            //定义添加页面列表每一行的数据模板
            var selectPageGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('<input ng-model="dataItem.addPageSelected" ng-checked="dataItem.addPageSelected" ng-click="events.AddPageCheckBoxCheck($event, dataItem)" type="checkbox" id="checkAdd_#: courseId #"  class="k-checkbox"/>');
                result.push('<label class="k-checkbox-label" for="checkAdd_#: courseId #"></label>');
                result.push('</td>');

                result.push('<td title="#: courseName #">');
                result.push('#: courseName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: period #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: teacherName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: isSelfCreated #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.tryListen(\'#: courseId #\')" class="k-primary">试听</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.addPageGetDetails(\'#: courseId #\')">详情</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.selectOneCourse($event, dataItem)" ng-show="!dataItem.showCancel" class="k-primary">选择</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.CancelSelectOneCourse($event, dataItem)" ng-show="dataItem.showCancel" class="k-primary">取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                selectPageGridRowTemplate = result.join('');
            })();

            //添加页面课程资源分类树
            var addPageTreeDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '0',
                            myModel = addPageTreeDataSource.get(options.data.id);
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
                //添加页面课程资源分类树
                addPageTree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: addPageTreeDataSource
                    }
                },
                //添加选修课界面列表的数据列表
                addPageGrid: {
                    options: {
                        /*toolbar:[],*/
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(selectPageGridRowTemplate),
                        noRecords: {
                            template: '暂无数据！'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/chooseCourse/findCourseResourceByQuery',
                                    data: function (e) {
                                        var temp = {}, params = $scope.model.courseResourceQueryParam;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.courseResourceQueryParam.pageSize;
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
                                            data.showCancel = false;
                                            data.addPageSelected = false;
                                            angular.forEach($scope.model.selectedCourses, function (dataItem) {
                                                if (data.courseId == dataItem.courseId) {
                                                    data.showCancel = true;
                                                }
                                            });
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
                            pageSize: 5,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: '<input ng-checked=\'addPageSelectedAll\' id=\'addPageSelectAll\' class=\'k-checkbox\' ng-click=\'events.addPageSelectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'addPageSelectAll\'></label>',
                                filterable: false, width: 40
                            },
                            {field: 'courseName', title: '课程名称'},
                            {field: 'period', title: '学分', width: 60},
                            {field: 'teacherName', title: '讲师'},
                            {field: 'isSelfCreated', title: '自建', width: 60},
                            {
                                title: '操作'
                            }
                        ]
                    }
                }
            };
            $scope.ui.addPageGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.addPageGrid.options);
            $scope.ui.addPageTree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.addPageTree.options);
        }];
});
