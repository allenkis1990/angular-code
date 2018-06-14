define(function () {
    'use strict';
    return ['$scope', 'trainClassManageService', 'KENDO_UI_GRID', 'kendo.grid', '$state',
        function ($scope, trainClassManageService, KENDO_UI_GRID, kendoGrid, $state) {
            var utils;
            $scope.model = {
                trainPageParams: {
                    state: '-1',
                    searchType: 2
                },
                page: {
                    pageSize: 10,
                    pageNo: 1
                }
            };
            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //== index node
                trainGrid: null,
                workBeginTime: null,
                workEndTime: null
            };
            $scope.events = {
                addTrainClass: function (e) {
                    this.init();
                    e.preventDefault();
                    $state.go('states.trainClassManage.add');
                },
                init: function () {
                    $scope.model.trainPageParams.state = '-1';
                    $scope.model.trainPageParams.likeName = null;
                    $scope.model.trainPageParams.createBeginDate = '';
                    $scope.model.trainPageParams.createEndDate = '';

                },
                updateTrainClass: function (id) {
                    this.init();
                    $state.go('states.trainClassManage.edit', {trnId: id});
                },
                view: function (id) {
                    this.init();
                    $state.go('states.trainClassManage.view', {trnId: id});
                },
                addStudent: function (trnId) {
                    this.init();
                    $state.go('states.trainClassManage.selectTrainingObject', {trnId: trnId});
                },
                deleteTrainClass: function (id) {
                    $scope.globle.confirm('提示', '是否需要删除培训班？', function (dialog) {
                        return trainClassManageService.deleteTrainClass(id).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.trainGrid.pager.page(1);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });

                },

                /**
                 * 进入管理界面
                 * @param id
                 */
                toManagePage: function (e, dataItem) {
                    e.stopPropagation();
                    this.init();
                    $state.go('states.trainClassManage.manage', {id: dataItem.id, name: dataItem.name});
                },
                /**
                 * 获取课程分类ID
                 * @param dataItem
                 */
                getTypeInfo: function (dataItem, e) {
                    e.stopPropagation();
                    trainClassManageService.hashTrainClassType(dataItem.id).then(function (data) {
                        if (!data.info) {
                            $scope.model.typeName = dataItem.name;
                            $scope.model.trainPageParams.trainingType = dataItem.id;
                            $scope.model.trainTypeShow = false;
                        }
                    });
                },
                /**
                 * 显示课程分类
                 */
                openTrainTypeTree: function (e) {
                    e.stopPropagation();
                },
                /**
                 * 操作
                 * @param e
                 */
                operating: function (id, state, quantity) {
                    var todo = state == 2 ? '撤销发布' : '发布';
                    $scope.globle.confirm('提示', '是否需要' + todo + '？', function (dialog) {
                        return trainClassManageService.operatingTrainClass(id, state, quantity).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.globle.showTip('操作成功！', 'success');
                                $scope.node.trainGrid.pager.page(1);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });
                },

                /**
                 * 显示课程分类
                 */
                openTree: function (e) {
                    e.stopPropagation();
                }

                ,

                changeType: function (e, type) {
                    e.preventDefault();
                    if (type == $scope.model.trainPageParams.searchType) {
                        return false;
                    } else {
                        this.init();
                        $scope.model.trainPageParams.searchType = type;
                        $scope.node.trainGrid.pager.page(1);
                    }

                }
                ,
                /**
                 * 查询事件
                 * @param e
                 */
                search: function (e) {
                    if (e.keyCode === 13) {
                        this.searchTrainClass(e);
                    }
                }
                ,
                /**
                 * 查询
                 */
                searchTrainClass: function (e) {
                    $scope.model.page.pageNo = 1;
                    if ($scope.model.typeName == null || $scope.model.typeName == '') {
                        $scope.model.trainPageParams.trainingType = null;
                    }
                    if ($scope.model.trainPageParams.createBeginDate) {
                        $scope.model.trainPageParams.createBeginDate = $scope.model.trainPageParams.createBeginDate.replace(/\//g, '-');
                    }
                    if ($scope.model.trainPageParams.createEndDate) {
                        $scope.model.trainPageParams.createEndDate = $scope.model.trainPageParams.createEndDate.replace(/\//g, '-');
                    }
                    $scope.node.trainGrid.pager.page(1);
                    e.preventDefault();
                }
            };
//=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('<div class="t-w2" title="#: name #">');
                result.push('#: name #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: register?\'是\':\'否\' #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: registerBeginDate==\'0001-01-01 \'?\'暂无数据\':registerBeginDate+\'至\'+registerEndDate #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: beginDate+\'至\'+endDate#');
                result.push('</td>');

                result.push('<td>');
                result.push('<div title="#: trainingTypeName #">');
                result.push('#: trainingTypeName #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#:state==2?\'已发布\':(state==0?\'草稿\':\'培训结束\')#');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button type="button" has-permission="trainClassManage/operating" class="table-btn" #:courseNum==0||trainState==2||currentUnitId!=unitId?\'disabled\':\'\'# ng-click="events.operating(\'#: id #\',\'#: state #\',\'#: courseNum #\')">#:searchType==3?\'\':(state==2?\'撤销发布\':\'发布\')#</button>');
                result.push('<button type="button" has-permission="trainClassManage/update"  class="table-btn" #: registerNum>0||currentUnitId!=unitId?\'disabled\':\'\'# ng-click="events.updateTrainClass(\'#: id #\')">#:searchType==3||searchType==2?\'\':\'修改\'#</button>');
                result.push('<button type="button" has-permission="trainClassManage/addUser"  class="table-btn" ng-click="events.addStudent(\'#: id #\')">#:state==2&&trainState!=2?\'添加学员\':\'\'#</button>');
                result.push('<button type="button" has-permission="trainClassManage/view" class="table-btn"  ng-click="events.view(\'#: id #\')">详情</button>');
                result.push('<button type="button" has-permission="trainClassManage/delete"  class="table-btn"  #: state==0||state==2||currentUnitId!=unitId?(registerNum>0||trainState==2?\'disabled\':\'\'):\'\'#  ng-click="events.deleteTrainClass(\'#: id #\')">#:searchType==2?\'\':\'删除\'#</button>');
                result.push('<button type="button" has-permission="trainClassManage/manage" class="table-btn"   ng-click="events.toManagePage($event,dataItem)" #: state!=0?\'\':\'disabled\'# >管理</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();
//培訓班分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '0',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/trainingTypeAction/getTrainingTypeById?categoryId=' + id,
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
                            change: utils.startChange

                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
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
                trainGrid: {
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
                                    url: '/web/admin/trainClass/getTrainClassPage',
                                    data: function (e) {
                                        var temp = {trainQueryParams: {sort: e.sort}},
                                            params = $scope.model.trainPageParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.trainQueryParams[key] = params[key];
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
                                    // 将会把这个返回的数组绑定到数据源当中
                                    return response;
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    if (response.status) {
                                        return response.info;
                                    } else {
                                        $scope.globle.alert('错误', response.info);
                                        response.info = [];
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
                            {sortable: false, field: 'name', title: '培训班名称', width: 250},
                            {sortable: false, field: 'register', title: '是否主动报名', width: 140},
                            {sortable: false, field: 'registerBeginDate', title: '报名起止时间'},
                            {sortable: false, field: 'beginDate', title: '培训班起止时间'},
                            {sortable: false, field: 'trainingTypeName', title: '培训类别'},
                            {sortable: false, field: 'state', title: '培训班状态'},
                            {
                                title: '操作', width: 400
                            }
                        ]
                    }
                }

            };
            $scope.ui.trainGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.trainGrid.options);
        }]
        ;
})
;
