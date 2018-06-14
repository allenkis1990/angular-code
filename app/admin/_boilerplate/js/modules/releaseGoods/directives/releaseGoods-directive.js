define(function () {

    return {
        coursebagConfig: ['hbUtil', 'TabService', function (hbUtil, TabService) {

            return {

                replace: true,
                scope: {
                    hasChoseCourse: '=',
                    ready: '='
                },
                templateUrl: '@systemUrl@/views/releaseGoods/coursebagConfig.html',
                link: function ($scope) {


                    $scope.$watch('ready', function (val) {
                        if (val && val === true) {
                            getTotal('courseNum', 'totalCourseCount');
                            getTotal('coursePeriod', 'totalCourseCredit');
                        }
                    });

                    $scope.kendoPlus = {
                        timeModel: null,
                        timeOptions: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd HH:mm:ss'
                            // format : "yyyy-MM-dd 00:00:00"
                            //min: new Date()
                        },
                        windowOptions: {
                            modal: true,
                            visible: false,
                            resizable: false,
                            draggable: false,
                            title: false,
                            open: function () {
                                this.center();
                            }
                        },
                        coursebagGridInstance: null
                    };


                    $scope.model = {
                        coursebagQueryparams: {
                            pageNo: 1,
                            pageSize: 10,
                            poolName: '',
                            createStartTime: '',
                            createEndTime: ''
                        },
                        totalCourseCount: 0,
                        totalCourseCredit: 0
                    };


                    $scope.events = {
                        openCourseBagWindow: function () {
                            $scope.courseBagWindow.center().open();
                            $scope.model.coursebagQueryparams.pageNo = 1;
                            $scope.kendoPlus['coursebagGridInstance'].pager.page(1);
                        },
                        MainPageQueryList: function (e, gridName) {
                            e.stopPropagation();
                            $scope.model.coursebagQueryparams.pageNo = 1;
                            $scope.kendoPlus[gridName].pager.page(1);
                        },
                        pressEnterKey: function (e, gridName) {
                            if (e.keyCode == 13) {
                                $scope.events.MainPageQueryList(e, gridName);
                            }
                        },
                        choseCourse: function (item) {
                            item.ischecked = true;
                            $scope.hasChoseCourse.push({
                                coursePackageId: item.id,
                                coursePackageName: item.poolName,
                                courseNum: item.courseCount,
                                coursePeriod: item.totalPeriod,
                                createTime: item.createTime
                            });
                            getTotal('courseNum', 'totalCourseCount');
                            getTotal('coursePeriod', 'totalCourseCredit');
                        },
                        cacelCourse: function (item, id) {
                            item.ischecked = false;
                            var index = findIndex($scope.hasChoseCourse, id);
                            console.log(index);
                            if (index !== null) {
                                $scope.hasChoseCourse.splice(index, 1);
                            }
                            getTotal('courseNum', 'totalCourseCount');
                            getTotal('coursePeriod', 'totalCourseCredit');
                        },

                        lookCoursePackage: function (e, id) {
                            $scope.courseBagWindow.close();
                            TabService.appendNewTab('课程包详情', 'states.coursePackageManager.view', {packageId: id}, 'states.coursePackageManager', true);
                        }
                    };

                    function findIndex (arr, id) {
                        var oindex = null;
                        angular.forEach(arr, function (item, index) {
                            if (item.coursePackageId === id) {
                                oindex = index;
                            }
                        });
                        return oindex;
                    }

                    //解决JS精度丢失问题
                    function accAdd (arg1, arg2) {
                        var r1, r2, m;
                        try {
                            r1 = arg1.toString().split('.')[1].length;
                        } catch (e) {
                            r1 = 0;
                        }
                        try {
                            r2 = arg2.toString().split('.')[1].length;
                        } catch (e) {
                            r2 = 0;
                        }
                        m = Math.pow(10, Math.max(r1, r2));
                        return (arg1 * m + arg2 * m) / m;
                    }

                    //获取共XX门 共XX学时
                    function getTotal (itemName, mainName) {
                        var total = 0;
                        angular.forEach($scope.hasChoseCourse, function (item) {
                            total = accAdd(total, item[itemName]);
                        });
                        $scope.model[mainName] = total;
                    }


                    //课程包模板
                    var coursebagTemplate = '';
                    (function () {
                        var result = [];
                        result.push('<tr>');


                        result.push('<td>');
                        result.push('#: poolName #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('#: createTime #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: courseCount #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('#: totalPeriod #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<button type="button"  class="table-btn" ng-click="events.lookCoursePackage($event,dataItem.id)">详情</button>');
                        result.push('<button type="button" ng-click="events.choseCourse(dataItem)" ng-if="!dataItem.ischecked"  class="table-btn">选择</button>');
                        result.push('<button type="button" ng-click="events.cacelCourse(dataItem,dataItem.id)" ng-if="dataItem.ischecked"  class="table-btn">取消选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        coursebagTemplate = result.join('');
                    })();

                    $scope.coursebagGrid = {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(coursebagTemplate),
                            scrollable: false,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/coursePoolAction/findCoursePoolPage',
                                        data: function (e) {
                                            var temp = {
                                                pageNo: e.page,
                                                pageSize: e.pageSize,
                                                coursePoolQuery: {
                                                    poolName: $scope.model.coursebagQueryparams.poolName,
                                                    createStartTime: $scope.model.coursebagQueryparams.createStartTime,
                                                    createEndTime: $scope.model.coursebagQueryparams.createEndTime
                                                }
                                            };

                                            $scope.model.coursebagQueryparams.pageNo = e.page;
                                            $scope.model.coursebagQueryparams.pageSize = e.pageSize;
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
                                        angular.forEach(response.info, function (item) {
                                            item.ischecked = false;
                                        });
                                        angular.forEach(response.info, function (item) {
                                            angular.forEach($scope.hasChoseCourse, function (itemTwo) {
                                                if (itemTwo.coursePackageId === item.id) {
                                                    item.ischecked = true;
                                                }
                                            });
                                        });
                                        console.log(response.info);
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
                                {field: 'orderNo', title: '课程包名称', sortable: false},
                                {field: 'firstGoods', title: '创建时间', sortable: false, width: 160},
                                {field: 'goodsCount', title: '课程门数', sortable: false, width: 60},
                                {field: 'totalAmount', title: '总学时', sortable: false, width: 60},
                                {
                                    title: '操作', width: 160
                                }
                            ]
                        }
                    };

                }

            };
        }],

        practiceConfig: ['hbUtil', '$http', function (hbUtil, $http) {

            return {

                replace: true,
                scope: {
                    hasChosePractice: '=',
                    practiceConditionSet: '='
                },
                templateUrl: '@systemUrl@/views/releaseGoods/practiceConfig.html',
                link: function ($scope) {

                    $scope.kendoPlus = {
                        windowOptions: {
                            modal: true,
                            visible: false,
                            resizable: false,
                            draggable: false,
                            title: false,
                            open: function () {
                                this.center();
                            }
                        },
                        practiceGridInstance: null
                    };


                    $scope.model = {
                        practiceQueryparams: {
                            page: {
                                pageNo: 1,
                                pageSize: 10
                            },
                            name: '',
                            libraryId: '',
                            libraryName: ''
                        },
                        treeShow: false
                    };

                    $scope.node = {
                        tree: null
                    };


                    $scope.events = {
                        openPracticeWindow: function () {
                            $scope.practiceWindow.center().open();
                        },
                        MainPageQueryList: function (e, gridName) {
                            e.stopPropagation();
                            $scope.model.practiceQueryparams.pageNo = 1;
                            $scope.kendoPlus[gridName].pager.page(1);
                        },
                        pressEnterKey: function (e, gridName) {
                            if (e.keyCode == 13) {
                                $scope.events.MainPageQueryList(e, gridName);
                            }
                        },
                        chosePractice: function (item) {
                            $scope.hasChosePractice = {
                                practicePaperId: item.practiceId,
                                practicePaperName: item.name,
                                totalScore: item.totalScore,
                                passScore: item.passScore,
                                practiceCount: item.practiceNum,
                                practiceQuestionCount: item.questionNum,
                                publiced: item.publiced,
                                limitPracticeCount: item.limitPracticeNum
                            };
                            $scope.practiceConditionSet = true;
                            $scope.practiceWindow.close();
                        },
                        cacelPractice: function () {
                            $scope.hasChosePractice = null;
                            $scope.practiceConditionSet = false;
                        },

                        openTree: function () {
                            $scope.model.treeShow = !$scope.model.treeShow;
                        },

                        getLibraryName: function (item) {
                            if ($scope.treePadding === true) {
                                return false;
                            }
                            $scope.treePadding = true;
                            $http.get('/web/admin/paperClassify/findExamPaperTypeByParentId?parentId=' + item.id).success(function (data) {
                                $scope.treePadding = false;
                                if (data.info.length <= 0) {
                                    //alert('kong');
                                    $scope.model.practiceQueryparams.libraryId = item.id;
                                    $scope.model.practiceQueryparams.libraryName = item.name;
                                    $scope.model.treeShow = false;
                                }
                            });
                        },
                        togglePracticeConditionSet: function (e) {
                            if (e.target.checked === true) {
                                $scope.practiceConditionSet = true;
                            } else {
                                $scope.practiceConditionSet = false;
                            }
                        }

                    };


                    //树
                    var dataSource = new kendo.data.HierarchicalDataSource({
                        dropDownWidth: '177px',
                        transport: {
                            read: function (options) {
                                var parentId = options.data.id ? options.data.id : '-2',
                                    myModel = dataSource.get(options.data.id);
                                var type = myModel ? myModel.type : '';
                                $.ajax({
                                    /*url: "/web/admin/administratorManage/getUnitByParentId?parentId=" + id,*/
                                    url: '/web/admin/paperClassify/findExamPaperTypeByParentId?parentId=' + parentId,
                                    dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
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


                    $scope.ui = {
                        tree: {
                            options: {
                                checkboxes: false,
                                // 当要去远程获取数据的时候数据源这么配置
                                dataSource: dataSource
                            }
                        }

                    };


                    //测验模板
                    var practiceTemplate = '';
                    (function () {
                        var result = [];
                        result.push('<tr>');


                        result.push('<td>');
                        result.push('#: name #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('#: libraryName #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('#: totalScore #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('#: passScore #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('#: questionNum #');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<button type="button" ng-click="events.chosePractice(dataItem)"  class="table-btn">选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        practiceTemplate = result.join('');
                    })();

                    $scope.practiceGrid = {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(practiceTemplate),
                            scrollable: false,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/paper/findPracticeExamPage',
                                        data: function (e) {
                                            var temp = {
                                                page: {
                                                    pageNo: e.page,
                                                    pageSize: e.pageSize
                                                },
                                                practiceExamQuery: {
                                                    name: $scope.model.practiceQueryparams.name,
                                                    libraryId: $scope.model.practiceQueryparams.libraryId
                                                }
                                            };

                                            $scope.model.practiceQueryparams.page.pageNo = e.page;
                                            $scope.model.practiceQueryparams.page.pageSize = e.pageSize;

                                            delete e.page;
                                            delete e.pageSize;
                                            delete e.skip;
                                            delete e.take;

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
                                {field: 'orderNo', title: '测验名称', sortable: false},
                                {field: 'firstGoods', title: '分类', sortable: false, width: 100},
                                {field: 'goodsCount', title: '测验总分', sortable: false, width: 70},
                                {field: 'totalAmount', title: '及格分', sortable: false, width: 70},
                                {field: 'totalAmount', title: '试题总数', sortable: false, width: 70},
                                {
                                    title: '操作', width: 160
                                }
                            ]
                        }
                    };

                }

            };
        }]
    };
});
