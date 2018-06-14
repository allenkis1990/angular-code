define(function () {
    'use strict';
    return ['$rootScope','$scope', 'questionService', 'courseWareManagerService', 'KENDO_UI_GRID', 'kendo.grid', '$state', '$timeout', 'TabService', 'hbBasicData','hbUtil',
        function ($rootScope,$scope, questionService, courseWareManagerService, KENDO_UI_GRID, kendoGrid, $state, $timeout, TabService, hbBasicData,hbUtil) {
            var utils;
            $scope.tabMap={
                myself:{
                    name:"本单位",
                    code:"myself"
                },
                all:{
                    name:"项目级",
                    code:"all"
                }
            };
            $scope.currentTab = $scope.tabMap.myself.code;
            $scope.model = {
                downloadModelUrl: null,//下载模板文件的地址前缀，如果直接使用域名，下载的文件会乱码
                myselfPageIndex: {},
                allPageIndex: {},
                unitName: '',
                providers: [],
                myselfCourseWareQueryParams: {
                    type: -1,
                    isUsable: -1,
                    status: -1,
                    needHasQuestion: '-1'
                },
                allCourseWareQueryParams: {
                    type: -1,
                    isUsable: -1,
                    status: -1,
                    needHasQuestion: '-1'
                },
                myselfPage: {
                    pageSize: 10,
                    pageNo: 1
                },
                allPage: {
                    pageSize: 10,
                    pageNo: 1
                },
                courseWareId: null
            };

            $scope.securityObj = {
                view: 'courseWareManager#view',
                update: 'courseWareManager#updateCourseWare',
                remove: 'courseWareManager#deleteCourseWare',
                enable: 'courseWareManager#enabled',
                disable: 'courseWareManager#disabled',
                addPop: 'courseWareManager#addPop',
                preview: 'courseWareManager#preview'
            };
            $scope.data = {
                groupName: 'coursewareAsyn' //异步任务组名
            };

            courseWareManagerService.findProvider().then(function (data) {
                if (data.status) {
                    $scope.model.unitName = data.info.unitName;
                    $scope.model.providers = data.info.lessonProviders;
                    //$scope.model.providers.unshift({id:'1',name:data.info.unitName});
                    $scope.model.providers.unshift({id: '', name: '全部'});
                }
            });
            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //== index node
                myselfCourseWareGrid: null,
                allfCourseWareGrid: null,
                workBeginTime: null,
                workEndTime: null
            };
            $scope.events = {
                chooseTab : function (e,code){
                    $scope.currentTab = code;
                },
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                findPop: function (e, dataItem) {
                    $state.go('states.popQuestionManager', {
                        courseWareId: dataItem.id,
                        courseWareName: dataItem.name

                    });
                    //    TabService.appendNewTab('查看弹窗题',
                    //
                    //        'states.popQuestionManager',
                    //        {couseWareId: dataItem.id},
                    //        'states.popQuestionManager');
                },
                addPop: function (e, dataItem) {
                    e.preventDefault();
                    if ((dataItem.type == 2 || dataItem.type == 3) && dataItem.status == 1) {
                        $state.go('states.courseWareManager.popAdd', {
                            courseWareName: dataItem.name,
                            timeLength: dataItem.timeLength,
                            courseWareId: dataItem.id
                        });
                    } else {
                        $scope.globle.alert('提示', '只有转换成功的单视频、多媒体课件才能添加弹窗题');
                    }
                },
                closeQuestionDialog: function () {
                    $scope.model.upload = {};
                    $scope.node.windows.importQuestionShow.close();
                    $scope.model.isClick = true;
                },
                importQuestion: function () {
                    $scope.model.isClick = false;
                    if (!$scope.model.upload.questionExcelModeType || $scope.model.upload.questionExcelModeType == '') {
                        $scope.globle.alert('提示', '请选择导入试题模板类型');
                        $scope.model.isClick = true;
                        return;
                    }
                    if (!$scope.model.upload.result || !$scope.model.upload.result.newPath || $scope.model.upload.result.newPath == '') {
                        $scope.globle.alert('提示', '请选择文件');
                        $scope.model.isClick = true;
                        return;
                    }
                    questionService.importQuestion({
                        filePath: $scope.model.upload.result.newPath,
                        questionExcelModeType: $scope.model.upload.questionExcelModeType,
                        fileName: $scope.model.upload.result.fileName
                    }, $scope.data.groupName).then(function (data) {
                        if (!data.status || !data.info) {
                            $scope.globle.alert('提示', '试题导入的异步任务创建失败!');
                            $scope.model.isClick = true;
                        } else {
                            $scope.model.upload = {};
                            $scope.node.windows.importQuestionShow.close();
                            $scope.globle.showTip('试题导入的异步任务创建成功', 'success');
                            $scope.model.isClick = true;
                        }
                    });
                },
                toImportQuestion: function () {
                    $scope.model.isClick = true;
                    //$scope.node.windows.importQuestionShow_show = true;
                    $timeout(function () {
                        $scope.node.windows.importQuestionShow.open();
                        // 主要用来延迟初始化上传组件，上传组件在初始化的时候为隐藏状态导致flash不可用
                        $scope.showImportQuestionWindow = true;
                    });
                },
                toDownQuestionMode: function (e) {
                    questionService.downloadTemplate().then(function (data) {
                        if (data.status) {
                            $scope.model.downloadModelUrl = data.info.downModelIP;
                        } else {
                            $scope.globle.showTip('获取模板下载地址失败', 'error');
                        }
                    });
                    $scope.node.windows.downQuestionMode.open();
                },
                add: function (e) {
                    //e.preventDefault();
                    $state.go('states.courseWareManager.add');
                },
                update: function (dataItem) {
                    $state.go('states.courseWareManager.edit', {
                        courseWareId: dataItem.id,
                        timeLength: dataItem.timeLength,
                        courseWareName: dataItem.name
                    });
                },
                view: function (id) {
                    $state.go('states.courseWareManager.view', {courseWareId: id});
                },
                openListenWindow: function (b, c) {
                    window.open('/play/#/preview/' + b);
                    /*   window.open ( '/play/#/listen/'+$scope.model.detailInfo.schemeId+'/' + $scope.model.detailInfoTwo.id+'/'+kjId, '_blank' );
   */
                },
                deleteCourseWare: function (id) {
                    $scope.globle.confirm('提示', '是否需要删除课件', function (dialog) {
                        return courseWareManagerService.deleteCourseWare(id).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.myselfCourseWareGrid.pager.page(1);
                                $scope.node.allCourseWareGrid.pager.page(1);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    });

                },
                /**
                 * 获取课程分类ID
                 * @param dataItem
                 */
                getTypeInfo: function (dataItem, e) {
                    e.stopPropagation();
                    if (dataItem.id == 0) {
                        $scope.model[$scope.currentTab+'TypeName'] = dataItem.name;
                        $scope.model[$scope.currentTab+'CourseWareQueryParams'].categoryId='';
                        $scope[$scope.currentTab+'TypeShow'] = false;
                    } else {
                        //courseWareManagerService.hasChild(dataItem.id).then(function (data) {
                        //    if (!data.info) {
                        $scope.model[$scope.currentTab+'TypeName'] = dataItem.name;
                        $scope.model[$scope.currentTab+'CourseWareQueryParams'].categoryId= dataItem.id;
                        $scope[$scope.currentTab+'TypeShow'] = false;
                        //    }
                        //});
                    }

                },
                /**
                 * 显示课程分类
                 */
                openTypeTree: function (e) {
                    e.stopPropagation();
                    $scope[$scope.currentTab+'TypeShow'] = !$scope[$scope.currentTab+'TypeShow'];
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
                search: function (e) {
                    if (e.keyCode === 13) {
                        $scope.events.searchCourseWare(e);
                    }
                },
                setUsable: function (id, isUsable) {
                    if (isUsable == false || isUsable == 'false') {
                        $scope.globle.confirm('提示', '确定要停用该课件？停用后已选择该课件' +
                            '课程仍然可以播放，只是新的课程无法引用该课件。', function (dialog) {
                            return courseWareManagerService.setCourseWareUsable(id, isUsable).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    $scope.node.myselfCourseWareGrid.pager.page($scope.model.myselfPageindex);
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                            });
                        });
                    } else {
                        $scope.globle.confirm('提示', '确定要启用该课件？', function (dialog) {
                            return courseWareManagerService.setCourseWareUsable(id, isUsable).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    $scope.node.myselfCourseWareGrid.pager.page($scope.model.myselfPageindex);
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                            });
                        });
                    }

                },
                /**
                 * 查询
                 */
                searchCourseWare: function (e) {
                    $scope.model[$scope.currentTab+'Page'].pageNo = 1;
                    if ($scope.model.typeName == null || $scope.model.typeName == '') {
                        //$scope.model.courseWareQueryParams.categoryId = null;
                        $scope.model[$scope.currentTab+'CourseWareQueryParams'].categoryId=null;
                    }
                    if ($scope.model[$scope.currentTab+'CourseWareQueryParams'].startCreateTime) {
                        $scope.model[$scope.currentTab+'CourseWareQueryParams'].startCreateTime = $scope.model[$scope.currentTab+'CourseWareQueryParams'].startCreateTime.replace(/-/g, '/');
                    }
                    if ($scope.model[$scope.currentTab+'CourseWareQueryParams'].endCreateTime) {
                        $scope.model[$scope.currentTab+'CourseWareQueryParams'].endCreateTime = $scope.model[$scope.currentTab+'CourseWareQueryParams'].endCreateTime.replace(/-/g, '/');
                    }
                    if ($scope.model[$scope.currentTab+'CourseWareQueryParams'].startCreateTime) {
                        $scope.model[$scope.currentTab+'CourseWareQueryParams'].startCreateTime = $scope.model[$scope.currentTab+'CourseWareQueryParams'].startCreateTime.replace(/\//g, '-');
                    }
                    if ($scope.model[$scope.currentTab+'CourseWareQueryParams'].endCreateTime) {
                        $scope.model[$scope.currentTab+'CourseWareQueryParams'].endCreateTime = $scope.model[$scope.currentTab+'CourseWareQueryParams'].endCreateTime.replace(/\//g, '-');
                    }
                    // if($scope.currentTab==$scope.tabMap.all.code)
                    // {
                    //     $scope.model[$scope.currentTab+'CourseWareQueryParams'].unitId=
                    // }
                    $scope.node[$scope.currentTab+'CourseWareGrid'].pager.page(1);
                    e.preventDefault();
                }
            };
            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: cwyId #">');
                result.push('#: cwyId #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: isUsable==true?\'正常\':\'停用\' #');
                result.push('</td>');

                result.push('<td>');
                result.push('#:status==0?\'转换中\':(status==1?\'转换成功\':(status==2?\'转换失败\':\'草稿\'))#');
                result.push('</td>');

                result.push('<td>');
                result.push('<div class="t-w1" title="#: type #">');
                result.push('#: type==1?\'文档\':(type==2?\'单视频\':(type==3?\'视频包\':\'未知\'))#');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: timeLength #">');
                result.push('#:(timeLength-timeLength%3600)/3600==0?"":(timeLength-timeLength%3600)/3600 +"小时"#');
                result.push('#:((timeLength%3600)-(timeLength%3600)%60)/60 +"分"#');
                result.push('#:(timeLength%3600)%60 +"秒"#');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div class="t-w1" title="#: supplierId #">');
                result.push('#: supplierName#');
                result.push('</a>');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: createUsrId #">');
                result.push('#: createUsrId #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: createTime #">');
                result.push('#: createTime #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div class="t-w1" title="#: hasReference #">');
                result.push('#: hasReference#');
                result.push('</a>');
                result.push('</div>');
                result.push('</td>');


                result.push('<td>');
                result.push('<div class="t-w1" title="#: popCount #">');
                result.push('<a type="button" class="table-btn"  ng-click="events.findPop($event,dataItem)">');
                result.push('#: popCount#');
                result.push('</a>');
                result.push('</div>');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<a type="button" class="table-btn" has-permission="courseWareManager/view"   ng-click="events.view(\'#: id #\')">详情</a>');
                result.push('<a  type="button" class="table-btn" has-permission="courseWareManager/updateCourseWare"  ng-click="events.update(dataItem)">修改</a>');
                result.push('<a  type="button" class="table-btn" has-permission="courseWareManager/deleteCourseWare" ng-click="events.deleteCourseWare(\'#: id #\')">删除</a>');
                result.push('<a  type="button" has-permission="courseWareManager/disabled" ng-show="#: isUsable==true?true:false #"   class="table-btn" ng-click="events.setUsable(\'#: id #\',\'#: !isUsable #\')" >停用</a>');
                result.push('<a  type="button" has-permission="courseWareManager/enabled" ng-show="#: isUsable==false?true:false #"  class="table-btn" ng-click="events.setUsable(\'#: id #\',\'#: !isUsable #\')" >启用</a>');
                result.push('<a  has-permission="courseWareManager/addPop" ng-click="events.addPop($event,dataItem)" type="button" class="table-btn" >添加弹窗</a>');
                result.push('<button type="button" has-permission="courseWareManager/preview" #: status!=1?\'disabled\':\'\'#  class="table-btn"   ng-click="events.openListenWindow(\'#: id #\')">预览</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();
            var allGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: cwyId #">');
                result.push('#: cwyId #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: isUsable==true?\'正常\':\'停用\' #');
                result.push('</td>');

                result.push('<td>');
                result.push('#:status==0?\'转换中\':(status==1?\'转换成功\':(status==2?\'转换失败\':\'草稿\'))#');
                result.push('</td>');

                result.push('<td>');
                result.push('<div class="t-w1" title="#: type #">');
                result.push('#: type==1?\'文档\':(type==2?\'单视频\':(type==3?\'视频包\':\'未知\'))#');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: timeLength #">');
                result.push('#:(timeLength-timeLength%3600)/3600==0?"":(timeLength-timeLength%3600)/3600 +"小时"#');
                result.push('#:((timeLength%3600)-(timeLength%3600)%60)/60 +"分"#');
                result.push('#:(timeLength%3600)%60 +"秒"#');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div class="t-w1" title="#: supplierId #">');
                result.push('#: supplierName#');
                result.push('</a>');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: createUsrId #">');
                result.push('#: createUsrId #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: createTime #">');
                result.push('#: createTime #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div class="t-w1" title="#: hasReference #">');
                result.push('#: hasReference#');
                result.push('</a>');
                result.push('</div>');
                result.push('</td>');


                result.push('<td>');
                result.push('<div class="t-w1" title="#: popCount #">');
                result.push('<a type="button" class="table-btn"  ng-click="events.findPop($event,dataItem)">');
                result.push('#: popCount#');
                result.push('</a>');
                result.push('</div>');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<a type="button" class="table-btn" has-permission="courseWareManager/view"   ng-click="events.view(\'#: id #\')">详情</a>');
                //result.push('<a  type="button" class="table-btn" has-permission="courseWareManager/updateCourseWare"  ng-click="events.update(dataItem)">修改</a>');
                //result.push('<a  type="button" class="table-btn" has-permission="courseWareManager/deleteCourseWare" ng-click="events.deleteCourseWare(\'#: id #\')">删除</a>');
                //result.push('<a  type="button" has-permission="courseWareManager/disabled" ng-show="#: isUsable==true?true:false #"   class="table-btn" ng-click="events.setUsable(\'#: id #\',\'#: !isUsable #\')" >停用</a>');
                //result.push('<a  type="button" has-permission="courseWareManager/enabled" ng-show="#: isUsable==false?true:false #"  class="table-btn" ng-click="events.setUsable(\'#: id #\',\'#: !isUsable #\')" >启用</a>');
                //result.push('<a  has-permission="courseWareManager/addPop" ng-click="events.addPop($event,dataItem)" type="button" class="table-btn" >添加弹窗</a>');
                result.push('<button type="button" has-permission="courseWareManager/preview" #: status!=1?\'disabled\':\'\'#  class="table-btn"   ng-click="events.openListenWindow(\'#: id #\')">预览</button>');
                result.push('</td>');

                result.push('</tr>');
                allGridRowTemplate = result.join('');
            })();
            //课件分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseWareCategoryAction/findByQuery?categoryId=' + id,
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
                windowOptions: questionService.windowConfig(),
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
                myselfCourseWareGrid: {
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
                                    url: '/web/admin/courseWareManager/findCourseWarePage',
                                    data: function (e) {
                                        var temp = {courseWareQueryParams: {sort: e.sort}},
                                            params = $scope.model.myselfCourseWareQueryParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.courseWareQueryParams[key] = params[key];
                                                }
                                            }
                                        }
                                        if(hbUtil.validateIsNull($scope.model.mySelfAuthorizedQuery)===false){
                                            angular.forEach($scope.model.mySelfAuthorizedQuery,function(value,key){
                                                temp[key] = value;
                                            });
                                        }
                                        $scope.model.myselfPageindex = e.page;
                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.myselfPage.pageSize;
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
                            //    // $scope.node.courseWareGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            //{
                            //  title: "<input ng-checked='selected' id='selectAlll' class='k-checkbox'
                            // ng-click='events.selectAll($event)' type='checkbox'/><label class='k-checkbox-label'
                            // for='selectAlll'></label>", filterable: false, width: 60 },
                            {sortable: false, field: 'name', title: '课件名称'},
                            {sortable: false, field: 'typeName', title: '课件分类', width: 90},
                            {sortable: false, field: 'status', title: '状态', width: 50},
                            {sortable: false, field: 'period', title: '转换状态', width: 75},
                            {sortable: false, field: 'teacherName', title: '课件类型', width: 75},
                            {sortable: false, field: 'timeLength', title: '时长', width: 90},
                            {sortable: false, field: 'supplierId', title: '供应商', width: 90},
                            {sortable: false, field: 'studyCount', title: '创建人', width: 180},
                            {sortable: false, field: 'createTime', title: '创建时间', width: 130},
                            {sortable: false, field: 'hasReference', title: '是否被引用', width: 90},
                            {sortable: false, field: 'popCount', title: '弹窗题数量', width: 90},
                            {
                                title: '操作', width: 230
                            }
                        ]
                    }
                },
                allCourseWareGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(allGridRowTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/courseWareManager/findCourseWarePage',
                                    data: function (e) {
                                        var temp = {courseWareQueryParams: {sort: e.sort}},
                                            params = $scope.model.allCourseWareQueryParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.courseWareQueryParams[key] = params[key];
                                                }
                                            }
                                        }
                                        if(hbUtil.validateIsNull($scope.model.allAuthorizedQuery)===false){
                                            angular.forEach($scope.model.allAuthorizedQuery,function(value,key){
                                                temp[key] = value;
                                            });
                                        }

                                        $scope.model.allPageindex = e.page;
                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.allPage.pageSize;
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
                            //    // $scope.node.courseWareGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            //{
                            //  title: "<input ng-checked='selected' id='selectAlll' class='k-checkbox'
                            // ng-click='events.selectAll($event)' type='checkbox'/><label class='k-checkbox-label'
                            // for='selectAlll'></label>", filterable: false, width: 60 },
                            {sortable: false, field: 'name', title: '课件名称'},
                            {sortable: false, field: 'typeName', title: '课件分类', width: 90},
                            {sortable: false, field: 'status', title: '状态', width: 50},
                            {sortable: false, field: 'period', title: '转换状态', width: 75},
                            {sortable: false, field: 'teacherName', title: '课件类型', width: 75},
                            {sortable: false, field: 'timeLength', title: '时长', width: 90},
                            {sortable: false, field: 'supplierId', title: '供应商', width: 90},
                            {sortable: false, field: 'studyCount', title: '创建人', width: 180},
                            {sortable: false, field: 'createTime', title: '创建时间', width: 130},
                            {sortable: false, field: 'hasReference', title: '是否被引用', width: 90},
                            {sortable: false, field: 'popCount', title: '弹窗题数量', width: 90},
                            {
                                title: '操作', width: 230
                            }
                        ]
                    }
                }
            };
            $scope.ui.myselfCourseWareGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.myselfCourseWareGrid.options);
            $scope.ui.allCourseWareGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.allCourseWareGrid.options);
        }];
});
