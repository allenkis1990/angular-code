define(function () {
    'use strict';
    return ['$scope',
        '$sce',
        'KENDO_UI_GRID',
        'KENDO_UI_TREE',
        'KENDO_UI_EDITOR',
        'kendo.grid',
        'global',
        'noticeManageService',
        '$timeout',
        '$state',
        function ($scope, $sce, KENDO_UI_GRID, KENDO_UI_TREE, KENDO_UI_EDITOR, kendoGrid, global, noticeManageService, $timeout, $state) {
            var addPageTreeDataSource = [];
            var parentElement;
            //获取当前被选中的节点
            var selectedNode;
            //获取当前被选中的节点的数据
            var selectedNodeDataItem;
            //当前勾选节点的所有孩子节点
            var childrenData;
            $scope.showDisabled = false;
            $scope.model = {
                //分页查询参数
                queryParam: {
                    title: undefined,//公告标题
                    publishObjectId: undefined,//公告发布对象ID（提交后台查询）
                    publishObjectName: undefined,//公告发布对象名称（只做前台展示，不提交后台）
                    publishBeginTime: undefined,//公告发布时间开始
                    publishEndTime: undefined,//公告发布时间结束
                    pageNo: 1,//当前页码
                    pageSize: 10//页大小
                },
                //发布公告的DTO
                noticeInfo: {
                    title: '',//公告标题
                    content: '',//公告内容
                    publishObjectId: [],//公告发布对象ID(提交后台)
                    studentType: '1',//公告发布对象类型（1-全体学员 2-公告下级分管管理员）
                    publishObjectName: '',//公告发布对象名称（只做页面显示，不提交后台）
                    publishWay: '1',//公告发布方式（1--立即发布 ，2--定时发布）
                    publishTime: ''//公告发布时间
                },
                //保存查看公告的信息
                noticeViewInfo: {
                    title: '',//公告标题
                    publishPersonName: '',//发布人
                    publishTime: '',//公告发布时间
                    totalPersonCount: '',//发布总人数
                    readCount: '',//被阅次数
                    content: '',//公告内容
                    publishObjectName: ''//公告发布对象名称
                }
            };
            $scope.events = {};

            $scope.ui = {};

            $scope.node = {
                publishEndTime: null,//公告发布结束时间
                publishBeginTime: null,//公告发布开始时间
                publishTime: null,//公告发布时间
                gridInstance: null
            };

            //页面控制显示隐藏的变量
            $scope.pageVar = {
                mainPageShowTree: false,
                addPageShowTree: false,
                selectChildren: false,
                hasSelectedPublishObject: false,
                addPageSelectedPublishObjectArray: []
            };

            //监控选择的发布对象数组
            $scope.$watch('pageVar.addPageSelectedPublishObjectArray.length', function (newValue, oldValue) {
                var datas = $scope.pageVar.addPageSelectedPublishObjectArray;
                if (newValue > 0) {
                    $scope.model.noticeInfo.publishObjectName = '';
                    $scope.pageVar.hasSelectedPublishObject = true;
                    angular.forEach(datas, function (data) {
                        $scope.model.noticeInfo.publishObjectName = $scope.model.noticeInfo.publishObjectName + data.name + ',';
                    });
                    $scope.model.noticeInfo.publishObjectName = $scope.model.noticeInfo.publishObjectName.substring(0, $scope.model.noticeInfo.publishObjectName.length - 1);
                } else {
                    $scope.pageVar.hasSelectedPublishObject = false;
                    $scope.model.noticeInfo.publishObjectName = '';
                }
            });
            //监控条件查询发布对象文本，如果没有值，查询条件清空
            $scope.$watch('model.queryParam.publishObjectName', function (newValue, oldValue) {
                var datas = $scope.pageVar.addPageSelectedPublishObjectArray;
                if (newValue == '' || newValue == undefined) {
                    $scope.model.queryParam.publishObjectId = '';
                }
            });
            $scope.events = {
                //主页面打开发布对象树
                mainPageOpenTree: function (e) {
                    e.stopPropagation();
                    $scope.pageVar.mainPageShowTree = true;
                },
                //主页面选择发布对象
                mainPageGetPublishObject: function (e, dataItem) {
                    e.stopPropagation();
                    $scope.model.queryParam.publishObjectId = dataItem.id;//节点的id
                    $scope.model.queryParam.publishObjectName = dataItem.name;//节点的名称
                    $scope.pageVar.mainPageShowTree = false;//设置树隐藏
                },
                //主页面关闭发布对象树
                mainPageCloseTree: function (e) {
                    e.stopPropagation();
                    $scope.pageVar.mainPageShowTree = false;
                },
                //主页面按条件查询列表数据
                MainPageQueryList: function () {
                    $scope.model.queryParam.pageNo = 1;
                    $scope.node.gridInstance.pager.page(1);
                },
                //主页面条件查询时在条件输入框回车提交查询
                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.MainPageQueryList();
                    }
                },
                //删除一条数据
                deleteOneRecord: function (e, id) {

                    $scope.globle.confirm('确定删除本条公告？', function (dialog) {
                        return noticeManageService.del({id: id}).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.globle.showTip('操作成功！', 'success');
                                var size = $scope.node.gridInstance.dataSource.view().length;
                                if (size == 1 && $scope.model.queryParam.pageNo != 1) {
                                    $scope.model.queryParam.pageNo = $scope.model.queryParam.pageNo - 1;
                                    $scope.node.gridInstance.pager.page($scope.model.queryParam.pageNo);
                                } else {
                                    $scope.node.gridInstance.dataSource.read();
                                }
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });
                },

                //打开新增窗口
                openAdd: function (e) {
                    $scope.showDisabled = false;
                    $scope.pageVar.selectChildren = false;
                    $scope.pageVar.addPageShowTree = false;
                    $scope.ui.addPageTree.options.dataSource.read();
                    $scope.pageVar.addPageSelectedPublishObjectArray = [];
                    //清空发布公告的DTO
                    $scope.model.noticeInfo = {
                        title: '',
                        content: '',
                        publishObjectId: [],
                        publishObjectName: '',
                        studentType: '1',
                        publishWay: '1',
                        publishTime: ''
                    };
                    /*//初始化发布时间控件
                     var date = new Date();
                     $scope.node.publishTime.value(date);
                     $scope.node.publishTime.value(null);*/
                    $scope.node.windows.addWindow.center().open();

                },
                //保存新增
                saveAdd: function (e) {
                    e.stopPropagation();
                    //防止用户多次提交表单
                    $scope.showDisabled = true;
                    $('#submitBtn').attr('class', 'btn btn-g');
                    var publishObject = $scope.pageVar.addPageSelectedPublishObjectArray;
                    angular.forEach(publishObject, function (data) {
                        $scope.model.noticeInfo.publishObjectId.push(data.id);
                    });
                    noticeManageService.save($scope.model.noticeInfo).then(function (data) {
                        if (data.status) {
                            $scope.node.windows.addWindow.center().close();
                            $scope.globle.showTip('发布成功！', 'success');
                            $scope.node.gridInstance.pager.page(1);
                        } else {
                            $scope.globle.showTip('发布失败！', 'error');
                            //如果添加失败，则将提交按钮样式还原，用户可以再次提交
                            $scope.showDisabled = false;
                        }
                    });

                },
                //关闭新增
                closeAdd: function (e) {
                    $scope.node.windows.addWindow.close();
                },
                //添加页面打开发布对象树
                addPageOpenTree: function (e) {
                    e.stopPropagation();
                    $scope.pageVar.addPageShowTree = true;
                },
                selectChildren: function (e) {
                    $scope.pageVar.selectChildren = !$scope.pageVar.selectChildren;
                },
                //添加页面选择发布对象
                addPageSelectPublishObject: function (dataItem) {
                    //e.stopPropagation();
                    //获取当前被选中的节点
                    selectedNode = $('#unitTree').data('kendoTreeView').findByUid(dataItem.uid);
                    //获取当前被选中的节点的数据
                    selectedNodeDataItem = $('#unitTree').data('kendoTreeView').dataItem(selectedNode);
                    //获取当前选中节点的孩子节点
                    //childrenData = selectedNodeDataItem.children._data;

                    var index = $scope.pageVar.addPageSelectedPublishObjectArray.indexOf(dataItem);
                    if (dataItem.showChecked) {
                        //dataItem.showChecked = true;
                        if (index <= -1) {
                            $scope.pageVar.addPageSelectedPublishObjectArray.push(dataItem);
                        }
                        //选择了包含下级
                        if ($scope.pageVar.selectChildren) {
                            $('#unitTree').data('kendoTreeView').expand($('#unitTree').data('kendoTreeView').findByUid(dataItem.uid));
                            if (dataItem.childrenData.length != 0) {
                                childrenData = dataItem.childrenData;
                            } else if (undefined == dataItem._childrenOptions) {
                                childrenData = dataItem.childrenData;
                            } else {
                                childrenData = dataItem._childrenOptions.data.childrenData;
                            }
                            if (childrenData != undefined && 0 < childrenData.length) {
                                angular.forEach(childrenData, function (item) {
                                    item.showChecked = true;
                                    //childrenData[i].showChecked=true;
                                    var childrenIndex = $scope.pageVar.addPageSelectedPublishObjectArray.indexOf(item);
                                    if (item.hasChildren) {
                                        $scope.events.addPageSelectPublishObject(item);
                                    } else {
                                        if (childrenIndex <= -1) {
                                            $scope.pageVar.addPageSelectedPublishObjectArray.push(item);
                                        }
                                    }

                                });
                            }
                        }

                    } else {
                        dataItem.showChecked = true;
                        index = $scope.pageVar.addPageSelectedPublishObjectArray.indexOf(dataItem);
                        dataItem.showChecked = false;
                        if (index >= 0) {
                            $scope.pageVar.addPageSelectedPublishObjectArray.splice(index, 1);
                        }
                        //选择了包含下级
                        if ($scope.pageVar.selectChildren) {
                            if (dataItem.childrenData.length != 0) {
                                childrenData = dataItem.childrenData;
                            } else if (undefined == dataItem._childrenOptions) {
                                childrenData = dataItem.childrenData;
                            } else {
                                childrenData = dataItem._childrenOptions.data.childrenData;
                            }
                            if (childrenData != undefined && 0 < childrenData.length) {
                                angular.forEach(childrenData, function (item) {
                                    var childrenIndex = $scope.pageVar.addPageSelectedPublishObjectArray.indexOf(item);
                                    item.showChecked = false;
                                    if (item.hasChildren) {
                                        $scope.events.addPageSelectPublishObject(item);
                                    } else {
                                        if (childrenIndex >= 0) {
                                            $scope.pageVar.addPageSelectedPublishObjectArray.splice(childrenIndex, 1);
                                        }
                                    }

                                });
                            }
                        }
                    }
                },

                //添加界面取消选择一个发布对象
                deleteOnePublishObject: function (e, dataItem) {
                    var index = $scope.pageVar.addPageSelectedPublishObjectArray.indexOf(dataItem);
                    dataItem.showChecked = false;
                    if (index >= 0) {
                        $scope.pageVar.addPageSelectedPublishObjectArray.splice(index, 1);
                    }
                },

                getAllTreeData: function () {
                },
                //添加页面关闭发布对象树
                addPageCloseTree: function (e) {
                    e.stopPropagation();
                    $scope.pageVar.addPageShowTree = false;
                },

                //查看详情
                viewDetail: function (e, id) {
                    $state.go('states.noticeManage.view', {noticeId: id});
                }
            };

            var ButtonUtils = {
                //发布开始时间变化
                startChange: function () {
                    var startDate = $scope.node.publishBeginTime.value(),
                        endDate = $scope.node.publishEndTime.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.publishEndTime.min(startDate);
                    } else if (endDate) {
                        $scope.node.publishBeginTime.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.publishBeginTime.max(endDate);
                        $scope.node.publishEndTime.min(endDate);
                    }
                },
                //发布结束时间变化
                endChange: function () {
                    var endDate = $scope.node.publishEndTime.value(),
                        startDate = $scope.node.publishBeginTime.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.publishBeginTime.max(endDate);
                    } else if (startDate) {
                        $scope.node.publishEndTime.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.publishBeginTime.max(endDate);
                        $scope.node.publishEndTime.min(endDate);
                    }
                }
            };

            //主页面单位树
            //=================单位和部门树开始=============================
            var mainPageTreeDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = mainPageTreeDataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            ///web/admin/organization/findUnitByParentId.action?parentId=" + id + "&nodeType="+ type,
                            url: '/web/admin/organization/findUnitTree.action?parentId=' + id + '&nodeType=' + type + '&needOrg=false',
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

            //添加页面单位树
            //=================单位和部门树开始=============================
            addPageTreeDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = mainPageTreeDataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            ///web/admin/organization/findUnitByParentId.action?parentId=" + id + "&nodeType="+ type,
                            url: '/web/admin/organization/findUnitTreeOneTime.action?parentId=' + id + '&nodeType=' + type + '&needOrg=false',
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
                        children: 'childrenData'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });

            //定义列表页每一行的数据模板
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td title="#: title #">');
                result.push('#: title #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: publishTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: publishPersonName #');
                result.push('</td>');

                result.push('<td title="#: publishObjectName #">');
                result.push('#: publishObjectName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: totalPersonCount #');
                result.push('</td>');
                result.push('<td>');
                result.push('#: status #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.viewDetail($event,\'#: id #\')">查看</button>');
                result.push('<button type="button" has-permission="noticeManage/del" class="table-btn" ng-click="events.deleteOneRecord($event,\'#: id #\')">删除</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            $scope.ui = {
                //主页面发布对象树
                mainPageTree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: mainPageTreeDataSource
                    }
                },
                //添加页面发布对象树
                addPageTree: {
                    options: {
                        checkboxes: false,
                        //dataTextField: "name",
                        //loadOnDemand: true,
                        dataSource: addPageTreeDataSource,
                        expand: function (e) {
                            /*var dataItem= $("#unitTree").data("kendoTreeView").dataItem(e.node);
                             $("#unitTree").data("kendoTreeView").expand($("#unitTree").data("kendoTreeView").findByUid(dataItem.uid));
                             angular.forEach(dataItem.childrenData, function (item) {
                             item.showChecked = dataItem.showChecked;
                             });*/
                        }
                    }
                },
                windows: {
                    addWindow: {//添加窗口
                        modal: true,
                        content: '@systemUrl@/views/noticeManage/addInfo.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    viewWindow: {//查看窗口
                        modal: true,
                        content: '@systemUrl@/views/noticeManage/viewInfo.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                },
                editor: KENDO_UI_EDITOR,
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
                                    url: '/web/admin/notice/findByQuery',
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
                            buttonCount: 10/*,
                             change: function (e) {
                             $scope.model.queryParam.pageNo = parseInt(e.index, 10);
                             $scope.node.gridInstance.dataSource.read();
                             }*/
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {field: 'title', title: '公告标题'},
                            {field: 'publishTime', title: '发布时间'},
                            {field: 'publishPersonName', title: '发布人'},
                            {field: 'publishObjectName', title: '发布对象'},
                            {field: 'totalPersonCount', title: '总人数'},
                            {field: 'status', title: '发布状态'},
                            {
                                title: '操作'
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
                    },
                    publish: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            value: new Date(),
                            interval: 2,
                            min: new Date()
                        }
                    }
                }
            };

            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);
            $scope.ui.mainPageTree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.mainPageTree.options);
            $scope.ui.addPageTree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.addPageTree.options);
        }];
});
