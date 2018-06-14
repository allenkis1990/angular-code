define(function () {
    'use strict';
    return ['$rootScope','$scope', 'courseManagerService', 'KENDO_UI_GRID', 'kendo.grid', '$state', 'TabService', 'hbUtil',
        function ($rootScope,$scope, lessonResourceManageService, KENDO_UI_GRID, kendoGrid, $state, TabService,hbUtil) {
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
                myselfLessonPageParams: {},
                allLessonPageParams: {},
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
                myselfLessonGrid: null,
                allLessonGrid:null,
                myselfWorkBeginTime: null,
                myselfWorkEndTime: null,
                allWorkBeginTime: null,
                allWorkEndTime: null
            };
            $scope.events = {
                chooseTab : function (e,code){
                    $scope.currentTab = code;
                },
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                initAllGrid:function(unitId){

                },
                addLesson: function (e) {
                    $scope.myselfLessonPageParams = {};
                    e.preventDefault();
                    $state.go('states.courseManager.add');
                },

                update: function (id) {
                    $state.go('states.courseManager.edit', {courseId: id});
                },
                view: function (id) {
                    $scope.myselfLessonPageParams = {};
                    $state.go('states.courseManager.view', {courseId: id});
                },
                openListenWindow: function (a, b, c) {
                    //TabService.appendNewTab('视频播放', 'states.player.coursePlayer', {courseId:a,courseWareId: b,playType:c}, 'states.player', false);
                    window.open('/play/#/previewLesson/trainClassId/' + a + '/courseware/xxx', '_blank');
                    //console.log('/play/#/listen/trainClassId/'+a+'/courseware', '_blank');
                },
                deleteCourse: function (id) {
                    $scope.globle.confirm('提示', '是否需要删除课程', function (dialog) {
                        return lessonResourceManageService.deleteCourse(id).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                $scope.node.myselfLessonGrid.pager.page(1);
                            } else {
                                console.log(data.info);
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
                        //$scope.model.typeName = dataItem.name;
                        //$scope.model.lessonPageParams.categoryId = '';
                        //$scope.lessonTypeShow = false;

                        $scope.model[$scope.currentTab+'TypeName']=dataItem.name;;
                        $scope.model[$scope.currentTab+'LessonPageParams'].categoryId='';
                        $scope[$scope.currentTab+'LessonTypeShow'] = false;

                    } else {
                        //    lessonResourceManageService.findHashLessonType(dataItem.id).then(function (data) {
                        //        if (!data.info) {
                        //$scope.model.typeName = dataItem.name;
                        //$scope.model.lessonPageParams.categoryId = dataItem.id;
                        //$scope.lessonTypeShow = false;

                        $scope.model[$scope.currentTab+'TypeName']=dataItem.name;;
                        $scope.model[$scope.currentTab+'LessonPageParams'].categoryId=dataItem.id;
                        $scope[$scope.currentTab+'LessonTypeShow'] = false;
                        //    }
                        //});
                    }
                },
                /**
                 * 显示课程分类
                 */
                openLessonTypeTree: function (e) {
                    e.stopPropagation();
                    //$scope.lessonTypeShow = !$scope.lessonTypeShow;
                    $scope[$scope.currentTab+'LessonTypeShow']=!$scope[$scope.currentTab+'LessonTypeShow'];
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
                        $scope.events.searchLesson(e);
                    }
                },
                enable: function (id) {
                    lessonResourceManageService.enable({courseId: id}).then(function (data) {

                    });
                    $scope.model.page.pageNo = 1;
                    $scope.node.myselfLessonGrid.pager.page(1);
                },
                /**
                 * 查询
                 */
                searchLesson: function (e) {
                    //$scope.model.lessonPageParams.isEnabled = -1;
                    $scope.model[$scope.currentTab+'LessonPageParams'].isEnabled=-1;
                    $scope.model.page.pageNo = 1;
                    if ($scope.model[$scope.currentTab+'TypeName'] == null || $scope.model[$scope.currentTab+'TypeName'] == '') {
                        $scope.model[$scope.currentTab+'LessonPageParams'].categoryId = null;
                    }
                    if ($scope.model[$scope.currentTab+'LessonPageParams'].endCrateTime) {
                        $scope.model[$scope.currentTab+'LessonPageParams'].endCrateTime = $scope.model[$scope.currentTab+'LessonPageParams'].endCrateTime.replace(/-/g, '/');
                    }
                    if ($scope.model[$scope.currentTab+'LessonPageParams'].startCreateTime) {
                        $scope.model[$scope.currentTab+'LessonPageParams'].startCreateTime = $scope.model[$scope.currentTab+'LessonPageParams'].startCreateTime.replace(/-/g, '/');
                    }
                    if ($scope.model[$scope.currentTab+'LessonPageParams'].endCrateTime) {
                        $scope.model[$scope.currentTab+'LessonPageParams'].endCrateTime = $scope.model[$scope.currentTab+'LessonPageParams'].endCrateTime.replace(/\//g, '-');
                    }

                    if ($scope.model[$scope.currentTab+'LessonPageParams'].startCreateTime) {
                        $scope.model[$scope.currentTab+'LessonPageParams'].startCreateTime = $scope.model[$scope.currentTab+'LessonPageParams'].startCreateTime.replace(/\//g, '-');
                    }
                    if ($scope.currentTab==="myself"&&($scope.model.mySelfAuthorizedQuery.belongsType==="AUTHORIZED_FROM"||$scope.model.mySelfAuthorizedQuery.belongsType==="AUTHORIZE_TO"))
                    {
                        $scope.model.myselfLessonPageParams.status="";
                    }
                    if ($scope.currentTab==="all"&&($scope.model.allAuthorizedQuery.belongsType==="AUTHORIZED_FROM"||$scope.model.allAuthorizedQuery.belongsType==="AUTHORIZE_TO"))
                    {
                        $scope.model.allLessonPageParams.status="";
                    }

                    //$scope.kendoPlus[$scope.currentTab+'LessonGrid'].pager.page(1);
                    //$scope.node+"."+$scope.currentTab+'LessonGrid.'+pager.page(1);
                    $scope.node[$scope.currentTab+'LessonGrid'].pager.page(1);
                    e.preventDefault();
                }
            };
            //=============分页开始=======================
            var gridRowTemplate = '';
            var allGridRowTemplate="";
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td title="#: formUnitName #">');
                result.push('#: formUnitName #');
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
                result.push('<div class="t-w1" title="#: popQuestionCount #">');
                result.push('#: popQuestionCount #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: createTime #">');
                result.push('#: createTime #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: strIsAuthorized #">');
                result.push('#: strIsAuthorized #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: strAvailableStatus #">');
                result.push('#: strAvailableStatus #');
                result.push('</div>');
                result.push('</td>');

                //result.push('<td>');
                //result.push('#: studyCount #');
                //result.push('</td>');
                //
                //result.push('<td>');
                //result.push('#: praiseCount #');
                //result.push('</td>');
                result.push('<td class="op">');
                result.push('<button type="button" has-permission="courseManager/listen" class="table-btn" #: status!=1?\'disabled\':\'\'#  ng-click="events.openListenWindow(\'#: id #\')">试听</button>');
                result.push('<button type="button" has-permission="courseManager/view" class="table-btn"  ng-click="events.view(\'#: id #\')">详情</button>');
                result.push('<button type="button" has-permission="courseManager/updata" class="table-btn" ng-click="events.update(\'#: id #\')" ng-disabled="dataItem.operateAble === false">修改</button>');
                result.push('<button type="button" has-permission="courseManager/delete" class="table-btn" ng-click="events.deleteCourse(\'#: id #\')" ng-disabled="dataItem.operateAble === false||dataItem.isAuthorized">删除</button>');
                result.push('<button type="button" has-permission="courseManager/enable"  class="table-btn" ng-click="events.enable(\'#: id #\')" ng-disabled="dataItem.operateAble === false">#: enabled===true?\'停用\':\'启用\' #</button>');
                /*has-permission="courseManager/enable"*/
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
                //全部单位
                var allResult = [];
                allResult.push('<tr>');
                allResult.push('<td title="#: name #">');
                allResult.push('#: name #');
                allResult.push('</td>');

                allResult.push('<td title="#: formUnitName #">');
                allResult.push('#: formUnitName #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('<div class="class-num" title="#: categoryName #">');
                allResult.push('#: categoryName #');
                allResult.push('</div>');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('#:status==0?\'转换中\':(status==1?\'转换成功\':(status==2?\'转换失败\':\'草稿\'))#');
                allResult.push('</td>');
                allResult.push('<td>');
                allResult.push('#: enabled===true?\'启用\':\'停用\' #');
                allResult.push('</td>');
                allResult.push('<td>');
                allResult.push('#: period*1.0/10 #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('<div class="t-w1" title="#: questionCount #">');
                allResult.push('#: questionCount #');
                allResult.push('</div>');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('<div class="t-w1" title="#: popQuestionCount #">');
                allResult.push('#: popQuestionCount #');
                allResult.push('</div>');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('<div  title="#: createTime #">');
                allResult.push('#: createTime #');
                allResult.push('</div>');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('<div  title="#: strIsAuthorized #">');
                allResult.push('#: strIsAuthorized #');
                allResult.push('</div>');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('<div  title="#: strAvailableStatus #">');
                allResult.push('#: strAvailableStatus #');
                allResult.push('</div>');
                allResult.push('</td>');

                //result.push('<td>');
                //result.push('#: studyCount #');
                //result.push('</td>');
                //
                //result.push('<td>');
                //result.push('#: praiseCount #');
                //result.push('</td>');
                allResult.push('<td class="op">');
                allResult.push('<button type="button" has-permission="courseManager/listen" class="table-btn" #: status!=1?\'disabled\':\'\'#  ng-click="events.openListenWindow(\'#: id #\')">试听</button>');
                allResult.push('<button type="button" has-permission="courseManager/view" class="table-btn"  ng-click="events.view(\'#: id #\')">详情</button>');
                //allResult.push('<button type="button" has-permission="courseManager/updata" class="table-btn" ng-click="events.update(\'#: id #\')">修改</button>');
                //allResult.push('<button type="button" has-permission="courseManager/delete" class="table-btn" ng-click="events.deleteCourse(\'#: id #\')">删除</button>');
                //allResult.push('<button type="button" has-permission="courseManager/enable"  class="table-btn" ng-click="events.enable(\'#: id #\')">#: enabled===true?\'停用\':\'启用\' #</button>');
                /*has-permission="courseManager/enable"*/
                allResult.push('</td>');

                allResult.push('</tr>');
                allGridRowTemplate = allResult.join('');
            })();
            //课程分类树
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
            utils = {
                startChange: function () {
                    var startDate = $scope.node[$scope.currentTab+'WorkBeginTime'].value(),
                        endDate = $scope.node[$scope.currentTab+'WorkEndTime'].value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node[$scope.currentTab+'WorkEndTime'].min(startDate);
                    } else if (endDate) {
                        $scope.node[$scope.currentTab+'WorkBeginTime'].max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node[$scope.currentTab+'WorkBeginTime'].max(endDate);
                        $scope.node[$scope.currentTab+'WorkEndTime'].min(endDate);
                    }
                },
                endChange: function () {
                    var endDate = $scope.node[$scope.currentTab+'WorkEndTime'].value(),
                        startDate = $scope.node[$scope.currentTab+'WorkBeginTime'].value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node[$scope.currentTab+'WorkBeginTime'].max(endDate);
                    } else if (startDate) {
                        $scope.node[$scope.currentTab+'WorkEndTime'].min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node[$scope.currentTab+'WorkBeginTime'].max(endDate);
                        $scope.node[$scope.currentTab+'WorkEndTime'].min(endDate);
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
                myselfLessonGrid: {
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
                                        var temp = {courseQuery: {sort: e.sort}}, 
                                            params = $scope.model.myselfLessonPageParams;
                                            
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.courseQuery[key] = params[key];
                                                }
                                            }
                                        }
                                         if(hbUtil.validateIsNull($scope.model.mySelfAuthorizedQuery)===false){
                                             angular.forEach($scope.model.mySelfAuthorizedQuery,function(value,key){
                                                 temp[key] = value;
                                            });
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
                            {field: 'formUnitName', title: '创建单位', width: '150px'},
                            {sortable: false, field: 'typeName', title: '课程分类', width: 130},
                            {sortable: false, field: 'status', title: '转换状态', width: 75},
                            {sortable: false, field: 'enable', title: '启用状态', width: 75},
                            {sortable: false, field: 'period', title: '学时', width: 50},
                            {sortable: false, field: 'questionCount', title: '试题数量', width: 80},
                            {sortable: false, field: 'popQuestionCount', title: '弹窗题题数', width: 100},
                            {sortable: false, field: 'createTime', title: '创建时间', width: 130},
                            {field: 'strIsAuthorized', title: '是否授权', width: '80px'},
                            {field: 'strAvailableStatus', title: '授权状态', width: '150px'},
                            {
                                title: '操作', width: 160
                            }
                        ]
                    }
                },
                allLessonGrid: {
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
                                    url: '/web/admin/courseManager/findLessonPage',
                                    data: function (e) {
                                        var temp = {courseQuery: {sort: e.sort}},
                                            params = $scope.model.allLessonPageParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.courseQuery[key] = params[key];
                                                }
                                            }
                                        }
                                        if(hbUtil.validateIsNull($scope.model.allAuthorizedQuery)===false){
                                            angular.forEach($scope.model.allAuthorizedQuery,function(value,key){
                                                temp[key] = value;
                                            });
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
                            {field: 'formUnitName', title: '创建单位', width: '150px'},
                            {sortable: false, field: 'typeName', title: '课程分类', width: 130},
                            {sortable: false, field: 'status', title: '转换状态', width: 75},
                            {sortable: false, field: 'enable', title: '启用状态', width: 75},
                            {sortable: false, field: 'period', title: '学时', width: 50},
                            {sortable: false, field: 'questionCount', title: '试题数量', width: 80},
                            {sortable: false, field: 'popQuestionCount', title: '弹窗题题数', width: 100},
                            {sortable: false, field: 'createTime', title: '创建时间', width: 130},
                            {field: 'strIsAuthorized', title: '是否授权', width: '80px'},
                            {field: 'strAvailableStatus', title: '授权状态', width: '150px'},
                            {
                                title: '操作', width: 160
                            }
                        ]
                    }
                }
            };
            $scope.ui.myselfLessonGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.myselfLessonGrid.options);
            $scope.ui.allLessonGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.allLessonGrid.options);
        }];
});
