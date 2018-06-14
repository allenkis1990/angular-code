define(function () {
    'use strict';
    return ['$scope', 'supplierResourceAllService', 'HB_dialog', 'KENDO_UI_GRID', 'kendo.grid', '$state', 'TabService','$rootScope',
        function ($scope, supplierResourceAllService, HB_dialog, KENDO_UI_GRID, kendoGrid, $state, TabService,$rootScope) {

            var utils;
            $scope.subjectId = '';
            $scope.trainingYear = '全部';
            $scope.node = {
                //== index node
                courseGrid1: null,
                courseGrid: null,
                workBeginTime: null,
                workEndTime: null
            };
            $scope.model = {
                subjectId: '',
                trainingYear: '全部',
                totalSize: 0,
                totalCourse: 0,
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                lessonPageParams: {},
                chooseParams: {
                    subjectId: '',
                    trainingYear: '',
                    /*   commoditySkuName:'',*/
                    /*    commoditySkuState:-1,*/
                    startCreateTime: '',
                    endCrateTime: ''
                }

            };
            $scope.kendoPlus = {
                courseGridInstance: null,
                courseGrid1Instance: null,
                windowOptions: {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                }
            };


            $scope.events = {
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                search1: function (e) {
                    if (e.keyCode === 13) {
                        $scope.events.searchLesson(e);
                    }
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
                /**
                 * 查询事件
                 * @param e
                 */

                openKendoWindow: function (windowName) {
                    $scope[windowName].center().open();
                },

                closeKendoWindow: function (windowName) {
                    $scope[windowName].close();
                },
                choseClass: function (e, item) {
                    console.log(item);
                    $scope.model.chooseParams.name = item.name;
                    $scope.model.chooseParams.courseId = item.id;

                    $scope.events.closeKendoWindow('courseWindow');
                },

                MainPageQueryList: function (e) {
                    e.stopPropagation();
                    $scope.model.pageNo = 1;
                    $scope.kendoPlus.courseGridInstance.pager.page(1);
                    $scope.kendoPlus.courseGrid1Instance.pager.page(1);
                },

                exportCourseStatistics: function () {

                    $scope.submitExportOrder = true;
                    supplierResourceAllService.exportCourseStatistics({
                        startTime: validateIsNull($scope.model.chooseParams.startCreateTime) === true ? null : parseTimeStrToLong($scope.model.chooseParams.startCreateTime),
                        endTime: validateIsNull($scope.model.chooseParams.endCrateTime) === true ? null : parseTimeStrToLong($scope.model.chooseParams.endCrateTime), /*+86399999*/
                        subjectId: $scope.model.chooseParams.subjectId,
                        courseProviderId: $scope.model.chooseParams.supplierId,
                        trainingYearId: $scope.model.chooseParams.trainingYear,
                        courseId: $scope.model.chooseParams.courseId,
                        rangeType:$scope.model.query.rangeType,
                        belongsType:$scope.model.query.belongsType,
                        authorizeToUnitId:$scope.model.query.authorizeToUnitId,
                        authorizedFromUnitId:$scope.model.query.authorizedFromUnitId,
                        objectId:$scope.model.query.objectId,
                        useType:$scope.model.query.useType,
                        targetUnitId:$scope.model.query.targetUnitId
                    }).then(function (data) {

                        if (data.info) {
                            HB_dialog.success('提示', '导出成功');
                            /*  if(data.info==='success'){
                                  HB_dialog.success ( '提示', '导出成功' );
                              }else{
                                  HB_dialog.error ( '提示', '导出失败' );
                              }*/
                            $scope.submitExportOrder = false;
                        } else {
                            HB_dialog.error('提示', '导出失败');
                            $scope.submitExportOrder = false;
                        }
                    });
                },
                search: function () {
                    $scope.model.totalSize = 0;
                    $scope.model.totalCourse = 0;
                    $scope.model.subjectId = $scope.subjectId;
                    $scope.model.trainingYear = $scope.trainingYear;
                    if ($scope.model.chooseParams.name === undefined) {
                        $scope.model.chooseParams.courseId = '';
                    }
                    $scope.model.page.pageNo = 1;
                    $scope.node.courseGrid.pager.page(1);
                },
                clearUserPageParams: function () {
                    $scope.model.chooseParams.startCreateTime = '';
                    $scope.model.chooseParams.endCrateTime = '';
                    $scope.model.chooseParams.activated = 0;
                    $scope.model.chooseParams.subjectId = '';
                    $scope.model.chooseParams.trainingYear = '';
                    $scope.model.chooseParams.supplierId = '';
                    $scope.model.chooseParams.courseId = '';
                    $scope.model.chooseParams.name = '';
                    $scope.subjectId = '';
                    $scope.trainingYear = '全部';
                    $scope.model.query.belongsType="ALL";
                    $scope.model.query.rangeType="course";
                    $scope.model.query.targetUnitId=$scope.targetUnitId;

                },
                changeYear: function () {
                    angular.forEach($scope.model.yearList, function (item) {
                        if ($scope.model.chooseParams.trainingYear == item.optionId) {
                            $scope.model.yearName = item.name;
                            if (item.name === '选择年度') {
                                $scope.trainingYear = '全部';
                            } else {
                                $scope.trainingYear = item.name;
                            }
                        }
                    });

                },
                changeSubject: function () {
                    $scope.subjectId = $scope.model.chooseParams.subjectId;
                },

                searchLesson: function (e) {
                    $scope.model.lessonPageParams.isEnabled = -1;
                    $scope.model.page.pageNo = 1;
                    if ($scope.model.typeName == null || $scope.model.typeName == '') {
                        $scope.model.lessonPageParams.categoryId = null;
                    }
                    if ($scope.model.lessonPageParams.endCrateTime) {
                        $scope.model.lessonPageParams.endCrateTime = $scope.model.lessonPageParams.endCrateTime.replace(/-/g, '/');
                    }
                    if ($scope.model.lessonPageParams.startCreateTime) {
                        $scope.model.lessonPageParams.startCreateTime = $scope.model.lessonPageParams.startCreateTime.replace(/-/g, '/');
                    }
                    if ($scope.model.lessonPageParams.endCrateTime) {
                        $scope.model.lessonPageParams.endCrateTime = $scope.model.lessonPageParams.endCrateTime.replace(/\//g, '-');
                    }
                    if ($scope.model.lessonPageParams.startCreateTime) {
                        $scope.model.lessonPageParams.startCreateTime = $scope.model.lessonPageParams.startCreateTime.replace(/\//g, '-');
                    }

                    $scope.node.courseGrid1.pager.page(1);
                    e.preventDefault();
                }
            };

            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseCategoryAction/findByQuery?categoryId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for
                                              // same-domain requests
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);
                            },
                            error: function (result) {
                                // notify the data source that the request failed
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


            var gridRowTemplate = '';
            (function () {
                var result = [];
                //result.push ( '<tr ng-if="#:$index <=0 #">' );
                //result.push ( '<td>' );
                //result.push ( '合计' );
                //result.push ( '</td>' );
                //result.push ( '<td>' );
                //
                //result.push ( '</td >' );
                //result.push ( '<td>' );
                //
                //result.push ( '</td>' );
                //result.push ( '<td>' );
                //
                //result.push ( '</td>' );
                //result.push ( '<td>' );
                //
                //result.push ( '</td>' );
                //result.push ( '<td>' );
                //result.push ( 'b{{model.totalCourse}}' );
                //result.push ( '</td>' );
                //result.push ( '</tr>' );

                result.push('<tr>');
                result.push('<td>');
                result.push('#: courseProviders #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createUnitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: courseCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: period*1.0/10 #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: timesCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: quitTimesCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: effectiTimesCount #');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();


            //=============分页开始=======================
            var gridRowTemplate1 = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');


                result.push('<td>');
                result.push('<div class="class-num" title="#: categoryName #">');
                result.push('#: categoryName #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#:status==0?\'转换中\':(status==1?\'转换成功\':(status==2?\'转换失败\':\'草稿\'))#');
                result.push('</td>');
                result.push('<td>');
                result.push('#: enabled===true?\'启用\':\'停用\' #');
                result.push('</td>');
                result.push('<td>');
                result.push('#: period*1.0/10 #');
                result.push('</td>');

                result.push('<td>');
                result.push('<div class="t-w1" title="#: questionCount #">');
                result.push('#: questionCount #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: createTime #">');
                result.push('#: createTime #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn" ng-click="events.choseClass($event,dataItem)">选择</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate1 = result.join('');
            })();

            utils = {
                startChange: function () {
                    var startDate = $scope.node.workBeginTime.value(),
                        endDate = $scope.node.workEndTime.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.workEndTime.min(startDate);
                    } else if (endDate) {
                        $scope.node.workBeginTime.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.workBeginTime.max(endDate);
                        $scope.node.workEndTime.min(endDate);
                    }
                },
                endChange: function () {
                    var endDate = $scope.node.workEndTime.value(),
                        startDate = $scope.node.workBeginTime.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.workBeginTime.max(endDate);
                    } else if (startDate) {
                        $scope.node.workEndTime.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.workBeginTime.max(endDate);
                        $scope.node.workEndTime.min(endDate);
                    }


                }
            };
            var minDate = new Date(2017, 5, 14);
            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                },
                datePicker: {
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            open: function () {
                                var today = new Date(),
                                    yesToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                                //this.max ( minDate );
                                this.min(minDate);
                            },
                            change: utils.startChange
                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            open: function () {
                                var today = new Date(),
                                    yesToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                                //this.max ( yesToday );
                                //this.min ( genQueryData.minDate );
                            },
                            change: utils.endChange
                        }
                    },
                    workDate: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd'
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
                                    url: '/web/admin/supplierResources/findSupplierResources',
                                    data: function (e) {

                                        var temp = {
                                            pageNo: e.page,
                                            //page:$scope.model.page.pageNo,
                                            pageSize: $scope.model.page.pageSize,
                                            //  startTime :validateIsNull ( $scope.model.chooseParams.startCreateTime ) === true ? null : parseTimeStrToLong ( $scope.model.chooseParams.startCreateTime),
                                            //  endTime :validateIsNull ( $scope.model.chooseParams.endCrateTime ) === true ? null : parseTimeStrToLong ( $scope.model.chooseParams.endCrateTime ),/*+86399999*/
                                            //  subjectId:$scope.model.chooseParams.subjectId,
                                            //  trainingYearId:$scope.model.chooseParams.trainingYear,
                                            courseProvider: $scope.model.chooseParams.supplierId,
                                            courseIds: $scope.model.chooseParams.courseId

                                        };
                                        $scope.pageNo = e.page;
                                        if (validateIsNull($scope.model.chooseParams.startCreateTime) == false) {
                                            temp.startTime = $scope.model.chooseParams.startCreateTime;
                                        }
                                        if (validateIsNull($scope.model.chooseParams.endCrateTime) == false) {
                                            temp.endTime = $scope.model.chooseParams.endCrateTime;
                                        }
                                        temp.rangeType=$scope.model.query.rangeType;
                                        temp.belongsType=$scope.model.query.belongsType;
                                        temp.authorizeToUnitId=$scope.model.query.authorizeToUnitId;
                                        temp.authorizedFromUnitId=$scope.model.query.authorizedFromUnitId;
                                        temp.objectId=$scope.model.query.objectId;
                                        temp.useType=$scope.model.query.useType;
                                        temp.targetUnitId=$scope.model.query.targetUnitId;
                                        /*   temp.pageNo   = e.page;
                                          temp.pageSize = $scope.model.page.pageSize;*/
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
                                    //$scope.model.totalSize=response.totalSize;
                                    //$scope.model.totalCourse=response.info.totalCourse;
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    //angular.forEach(response.info,function(item,index){
                                    //    item.$index=index;
                                    //})
                                    if (response.code !== 200) {
                                        $scope.aaa = 0;
                                        HB_dialog.error('提示', response.info);
                                        return [];
                                    } else {
                                        //    $scope.aaa=response.info.length;

                                        return response.info;
                                    }


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
                            //    // $scope.node.courseGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {sortable: false, field: 'courseName', title: '课程提供商', width: 130},
                            {sortable: false, field: 'createUnitName', title: '创建单位', width: 130},
                            {sortable: false, field: 'courseProviders', title: '课程门数', width: 130},
                            {sortable: false, field: 'period', title: '课程总学时', width: 90},
                            {sortable: false, field: 'chooseTimes', title: '累计选课总次数', width: 50},
                            {sortable: false, field: 'quitTimes', title: '累计退课次数', width: 80},
                            {sortable: false, field: 'effectiveUserCount', title: '净选课次数', width: 130}
                        ]
                    }
                },
                courseGrid1: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate1),
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
                                        var temp = {courseQuery: {sort: e.sort}},
                                            params = $scope.model.lessonPageParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.courseQuery[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.courseQuery.isEnabled = -1;
                                        temp.pageNo = e.page;
                                        $scope.pageNo = e.page;
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
                            //  title: "<input ng-checked='selected' id='selectAlll' class='k-checkbox'
                            // ng-click='events.selectAll($event)' type='checkbox'/><label class='k-checkbox-label'
                            // for='selectAlll'></label>", filterable: false, width: 60 },
                            {sortable: false, field: 'name', title: '课程名称'},
                            {sortable: false, field: 'typeName', title: '课程分类', width: 130},
                            {sortable: false, field: 'status', title: '转换状态', width: 75},
                            {sortable: false, field: 'enable', title: '启用状态', width: 75},
                            {sortable: false, field: 'period', title: '学分', width: 50},
                            {sortable: false, field: 'questionCount', title: '试题数量', width: 80},
                            {sortable: false, field: 'createTime', title: '创建时间', width: 130},
                            {
                                title: '操作', width: 160
                            }
                        ]
                    }
                }

            };
            $scope.ui.courseGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseGrid.options);

            $scope.ui.courseGrid1.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseGrid1.options);

            function getSubjectAndYear () {
                //获取科目
                //courseChooseStatisticService.getTitleLevelList().then(function(data){
                //    if(data.status){
                //        $scope.model.subjectList=data.info;
                //        $scope.model.subjectList.unshift({
                //            name:'选择科目',
                //            optionId:''
                //        });
                //    }
                //});
                //获取年度
                //courseChooseStatisticService.getTrainingYearList().then(function(data){
                //    if(data.status){
                //        $scope.model.yearList=data.info;
                //        $scope.model.yearList.unshift({
                //            name:'选择年度',
                //            optionId:''
                //        });
                //    }
                //});
                supplierResourceAllService.findProvider().then(function (data) {
                    if (data.status) {
                        $scope.model.unitName = data.info.unitName;
                        $scope.model.providers = data.info.lessonProviders;
                        $scope.model.providers.unshift({id: '', name: '请选择课程提供商'});

                    }
                });
            }

            getSubjectAndYear();

            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            //时间字符串转毫秒
            function parseTimeStrToLong (str) {
                return kendo.parseDate(str).getTime();
            }
        }];

});
