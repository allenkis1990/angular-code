/**
 * Created by eleven on 2018/6/4 19:13.
 */
define(function (resAuthorizedUnitInfo) {
    'use strict';
    return ['$scope', 'resAuthorizeUnitInfoService', 'resAuthorizeUtil','kendo.grid','KENDO_UI_GRID','$stateParams','hbUtil',  'HB_dialog', '$state', 'HB_notification','easyKendoDialog',
        function($scope, resAuthorizeUnitInfoService,resAuthorizeUtil,kendoGrid, KENDO_UI_GRID,$stateParams, hbUtil, HB_dialog, $state, HB_notification,easyKendoDialog){
            var useUnit = $scope.$stateParams.unitId;

            $scope.url={
                courseUrl:"/web/admin/resAuthorizeUnit/pageCourseResAuthorize",
                coursePoolUrl:"/web/admin/resAuthorizeUnit/pageCoursePoolResAuthorize",
                questionUrl:"/web/admin/resAuthorizeUnit/pageQuestionResAuthorize",
                paperExamUrl:"/web/admin/resAuthorizeUnit/pageExamPaperResAuthorize",
                questionLibraryTreeUrl:"/web/admin/resAuthorizeUnit/listLibraryByParentId",
            };

            $scope.flagModel = {
                currentTabType:"COURSE",
                questionLibraryTreeShow:false,
            };
            $scope.model={

                //****************model数据**************************
                //当前单位已授权的资源方案统计
                resourceCount:{
                    course:0,
                    coursePool:0,
                    questionLibrary:0,
                    examPaper:0
                },
                //当前单位已授权的资源方案
                listResourceBag:[],
                //选择查看的资源方案id
                resourceBagId:"",
                //****************查询参数**************************
                courseArg:{
                    name:"",
                    unitId:useUnit,
                    resourceBagId:"",
                    authorizationState:""
                },
                coursePoolArg:{
                    name:"",
                    unitId:useUnit,
                    resourceBagId:"",
                    authorizationState:""
                },
                questionArg:{
                    libraryId:"",
                    unitId:useUnit,
                    questionType:"",
                    resourceBagId:"",
                    authorizationState:""
                },
                paperExamArg:{
                    name:"",
                    unitId:useUnit,
                    resourceBagId:"",
                    authorizationState:""
                },
                //******************本地变量************************
                questionTypeOption:resAuthorizeUtil.getQuestionTypeOption(),
                authorizeStatusOption:resAuthorizeUtil.getAuthorizeStatusOption(),
            };
            $scope.node={
                courseGridInstance:null,
                coursePoolGridInstance:null,
                questionGridInstance:null,
                paperExamGridInstance:null,
            };

            $scope.$watch('model.resourceBagId', function (nv) {
                $scope.model.courseArg.resourceBagId = nv;
                $scope.model.coursePoolArg.resourceBagId = nv;
                $scope.model.paperExamArg.resourceBagId = nv;
                $scope.model.questionArg.resourceBagId = nv;
            });

            $scope.events={

                init:function () {
                    this.countResource("1","");
                    this.listResourceBag();
                },
                toggleTab:function (tabType) {
                    $scope.flagModel.currentTabType = tabType;
                },

                reLoadCourseGrid :function () {
                    $scope.node.courseGridInstance.dataSource.read();
                },
                reLoadCoursePoolGrid :function () {
                    $scope.node.coursePoolGridInstance.dataSource.read();
                },
                reLoadQuestionGrid :function () {
                    $scope.node.questionGridInstance.dataSource.read();
                },
                reLoadPaperExamGrid :function () {
                    $scope.node.paperExamGridInstance.dataSource.read();
                },
                //获取资源统计
                countResource:function (unitId,authorizationState) {
                    resAuthorizeUnitInfoService.countResource(unitId,authorizationState).then(function (data) {
                        if(data.status){
                            var temp = data.info;
                            angular.forEach(temp,function (item,index) {
                                switch (item.resourceKey){
                                    case "course":
                                        $scope.model.resourceCount.course         = item.count;
                                        break;
                                    case "course_pool":
                                        $scope.model.resourceCount.coursePool      = item.count;
                                        break;
                                    case "question_library":
                                        $scope.model.resourceCount.questionLibrary = item.count;
                                        break;
                                    case "exam_paper":
                                        $scope.model.resourceCount.examPaper       = item.count;
                                        break;
                                }
                            });
                        }
                    });
                },

                changeSelectQuestionType:function (item) {
                  $scope.model.questionArg.questionType = item.type;
                },

                listResourceBag:function () {
                    resAuthorizeUnitInfoService.listResourceBag(useUnit).then(function (data) {
                        if (data.status){
                            $scope.model.listResourceBag = data.info;
                            $scope.model.listResourceBag.unshift({id:"",name:"请选择查看方案"})
                        }
                    });
                },
                openQuestionLibraryTree:function () {
                    $scope.flagModel.questionLibraryTreeShow = !$scope.flagModel.questionLibraryTreeShow;
                },
                bindQuestionLibraryTree:function (dataItem, e) {

                    $scope.model.libraryName = dataItem.name;
                    $scope.flagModel.questionLibraryTreeShow = false;
                    $scope.model.questionArg.libraryId = dataItem.rootId;
                },


                goCourseDetail:function (dataItem) {
                    $state.go('states.courseManager.view', {courseId: dataItem.rootId});
                },

                closeKendoWindow : function (windowName) {
                    if ($scope[windowName]) {
                        $scope[windowName].kendoDialog.close();
                    }
                }
            };

            //初始化部分数据
            $scope.events.init();

            //课程资源表格模板
            var courseGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('#:index #');
                result.push('</td>');


                result.push('<td>');
                result.push('<span >#:name #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: supplier #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: typeName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: timeLength #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: period #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: authorizationState  ==="AUTHORIZATION" ? "授权中" : "取消授权" #');
                result.push('</td>');

                // result.push('<td>');
                // result.push('<span ng-if="#:state==1#">可用</span>' + '<span ng-if="#:state==2#">停用</span>' + '<span ng-if="#:state==3#">停用</span>');
                //
                // result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.goCourseDetail(dataItem)">详情</button>');
                result.push('</td>');
                result.push('</tr>');

                courseGridRowTemplate = result.join('');
            })();
            //课程包资源表格模板
            var coursePoolGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('#:index #');
                result.push('</td>');


                result.push('<td>');
                result.push('<span >#:name #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: courseCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: totalPeriod #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: authorizationState  ==="AUTHORIZATION" ? "授权中" : "取消授权" #');
                result.push('</td>');

                // result.push('<td>');
                // result.push('<span ng-if="#:state==1#">可用</span>' + '<span ng-if="#:state==2#">停用</span>' + '<span ng-if="#:state==3#">停用</span>');
                //
                // result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.goResourceDetail()">详情</button>');
                result.push('</td>');
                result.push('</tr>');

                coursePoolGridRowTemplate = result.join('');
            })();
            //试题资源表格模板
            var questionGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('#:index #');
                result.push('</td>');


                result.push('<td>');
                result.push('<span >#:topic #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: questionType #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: difficultyType #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: libraryName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: authorizationState  ==="AUTHORIZATION" ? "授权中" : "取消授权" #');
                result.push('</td>');

                // result.push('<td>');
                // result.push('<span ng-if="#:state==1#">可用</span>' + '<span ng-if="#:state==2#">停用</span>' + '<span ng-if="#:state==3#">停用</span>');
                //
                // result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.goResourceDetail()">详情</button>');
                result.push('</td>');
                result.push('</tr>');

                questionGridRowTemplate = result.join('');
            })();
            //考试卷资源表格模板
            var paperExamGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('#:index #');
                result.push('</td>');


                result.push('<td>');
                result.push('<span >#:name #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: configType #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: totalScore #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: authorizationState  ==="AUTHORIZATION" ? "授权中" : "取消授权" #');
                result.push('</td>');

                // result.push('<td>');
                // result.push('<span ng-if="#:state==1#">可用</span>' + '<span ng-if="#:state==2#">停用</span>' + '<span ng-if="#:state==3#">停用</span>');
                //
                // result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.goResourceDetail()">详情</button>');
                result.push('</td>');
                result.push('</tr>');

                paperExamGridRowTemplate = result.join('');
            })();



            $scope.grid={
                courseGrid:hbUtil.kdGridCommonOptionDIY({
                    template: courseGridRowTemplate,
                    url: $scope.url.courseUrl,
                    scope: $scope,
                    param: $scope.model.courseArg,
                    fn: function (response) {
                    },
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {field: 'name', title: '课程名称', sortable: false},
                        {field: 'supplier', title: '课程供应商', sortable: false, width: 100},
                        {field: 'typeName', title: '课程分类', sortable: false, width: 100},
                        {field: 'timeLength', title: '课程时长', sortable: false, width: 100},
                        {field: 'period', title: '学时', sortable: false, width: 50},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 140},
                        {field: 'authorizationState', title: '授权状态', sortable: false, width: 100},
                        {
                            title: '操作', width: 70
                        }
                    ]
                }),
                coursePoolGrid:hbUtil.kdGridCommonOptionDIY({
                    template: coursePoolGridRowTemplate,
                    url: $scope.url.coursePoolUrl,
                    scope: $scope,
                    param: $scope.model.coursePoolArg,
                    fn: function (response) {
                    },
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {field: 'name', title: '课程名称', sortable: false},
                        {field: 'courseCount', title: '课程数', sortable: false, width: 100},
                        {field: 'totalPeriod', title: '课程总学时', sortable: false, width: 100},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 140},
                        {field: 'authorizationState', title: '授权状态', sortable: false, width: 100},
                        {
                            title: '操作', width: 70
                        }
                    ]
                }),
                questionGrid:hbUtil.kdGridCommonOptionDIY({
                    template: questionGridRowTemplate,
                    url: $scope.url.questionUrl,
                    scope: $scope,
                    param: $scope.model.questionArg,
                    fn: function (response) {
                        var temp  = response.info;
                        angular.forEach(temp,function (item,index) {
                            item.questionType = resAuthorizeUtil.deCodeQuestionType(item.questionType);
                            item.difficultyType = resAuthorizeUtil.deCodeQuestionDifficultyType(item.difficultyType);
                        })
                    },
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {field: 'topic', title: '试题题目', sortable: false},
                        {field: 'questionType', title: '试题类型', sortable: false, width: 100},
                        {field: 'difficultyType', title: '难易度', sortable: false, width: 100},
                        {field: 'difficultyType', title: '所属题库', sortable: false, width: 100},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 140},
                        {field: 'authorizationState', title: '授权状态', sortable: false, width: 100},
                        {
                            title: '操作', width: 70
                        }
                    ]
                }),
                paperExamGrid:hbUtil.kdGridCommonOptionDIY({
                    template: paperExamGridRowTemplate,
                    url: $scope.url.paperExamUrl,
                    param: $scope.model.paperExamArg,
                    scope: $scope,
                    fn: function (response) {
                        angular.forEach(response.info,function (item,index) {
                            item.configType = resAuthorizeUtil.deCodePaperExamConfigType(item.configType);
                        })
                    },
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {field: 'name', title: '试卷名称', sortable: false},
                        {field: 'configType', title: '组卷方式', sortable: false, width: 100},
                        {field: 'totalScore', title: '试卷总分', sortable: false, width: 100},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 140},
                        {field: 'authorizationState', title: '授权状态', sortable: false, width: 100},
                        {
                            title: '操作', width: 70
                        }
                    ]
                })
            };
            $scope.utils={

            };

            $scope.tree = {
                //题库树
                questionLibraryTree:hbUtil.kdTreeOption($scope.url.questionLibraryTreeUrl,"parentId","&unitId="+useUnit)
            };

    }];
});