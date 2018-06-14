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
                courseUnAuthorizeUrl:"/web/admin/resAuthorizeUnit/pageCourseResUnAuthorize",
                coursePoolUnAuthorizeUrl:"/web/admin/resAuthorizeUnit/pageCoursePoolResUnAuthorize",
                questionLibraryUnAuthorizeUrl:"/web/admin/resAuthorizeUnit/pageQuestionLibraryResUnAuthorize",
                paperExamUnAuthorizeUrl:"/web/admin/resAuthorizeUnit/pageExamPaperResUnAuthorize",
                questionLibraryTreeUrl:"/web/admin/resAuthorizeUnit/listLibraryByParentId",
            };

            $scope.flagModel = {
                currentTabType:"COURSE",
                questionLibraryTreeShow:false,
            };
            $scope.model={

                //****************model数据**************************
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

                //预授权的课程资源
                toBeAuthorizeCourseResList:[],
                //预授权的课程包资源
                toBeAuthorizeCoursePoolResList:[],
                //预授权的试题库资源
                toBeAuthorizeQuestionLibraryResList:[],
                //预授权的考试卷资源
                toBeAuthorizeExamPaperResList:[],

                //预批量回收的课程资源
                toBeRecycleCourseResList:[],
                //预批量回收的课程包资源
                toBeRecycleCoursePoolResList:[],
                //预批量回收的试题库资源
                toBeRecycleQuestionLibraryResList:[],
                //预批量回收的考试卷资源
                toBeRecycleExamPaperResList:[],

                //****************查询参数**************************
                courseArg:{
                    name:"",
                    unitId:useUnit,
                    authorizationState:""
                },
                courseUnAuthorizeArg:{
                    name:"",
                    unitId:useUnit,
                    courseCategoryId:""
                },
                coursePoolArg:{
                    name:"",
                    unitId:useUnit,
                    authorizationState:""
                },
                coursePoolUnAuthorizeArg:{
                    name:"",
                    unitId:useUnit,
                },
                questionArg:{
                    libraryId:"",
                    unitId:useUnit,
                    questionType:"",
                    authorizationState:""
                },
                questionLibraryUnAuthorizeArg:{
                    unitId:useUnit,
                    questionLibraryName:""
                },
                paperExamArg:{
                    name:"",
                    unitId:useUnit,
                    authorizationState:""
                },
                paperExamUnAuthorizeArg:{
                    unitId:useUnit
                },
                //******************本地变量************************
                questionTypeOption:resAuthorizeUtil.getQuestionTypeOption(),
                authorizeStatusOption:resAuthorizeUtil.getAuthorizeStatusOption(), 
                resourceCECode:resAuthorizeUtil.getResourceCECode(),
            };
            $scope.node={
                courseGridInstance:null,
                coursePoolGridInstance:null,
                questionGridInstance:null,
                paperExamGridInstance:null,
                courseUnAuthorizeGridInstance:null,
                coursePoolUnAuthorizeGridInstance:null,
                questionLibraryUnAuthorizeGridInstance:null,
                paperExamUnAuthorizeGridInstance:null
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
                reLoadCourseUnAuthorizeGrid :function () {
                    $scope.node.courseUnAuthorizeGridInstance.dataSource.read();
                },
                reLoadCoursePoolUnAuthorizeGrid :function () {
                    $scope.node.coursePoolUnAuthorizeGridInstance.dataSource.read();
                },
                reLoadQuestionLibraryUnAuthorizeGrid :function () {
                    $scope.node.questionLibraryUnAuthorizeGridInstance.dataSource.read();
                },

                addToBeAuthorizeRes:function (item,type) {
                    switch (type){
                        case "COURSE":
                            $scope.model.toBeAuthorizeCourseResList.push(item);
                            break;
                        case "COURSE_POOL":
                            $scope.model.toBeAuthorizeCoursePoolResList.push(item);
                            break;
                        case "EXAM_PAPER":
                            $scope.model.toBeAuthorizeExamPaperResList.push(item);
                            break;
                        case "QUESTION_LIBRARY":
                            $scope.model.toBeAuthorizeQuestionLibraryResList.push(item);
                            break;
                    }
                },
                removeToBeAuthorizeRes:function (item,type) {
                    switch (type){
                        case "COURSE":
                            $scope.model.toBeAuthorizeCourseResList.splice($scope.model.toBeAuthorizeCourseResList.indexOf(item),1);
                            break;
                        case "COURSE_POOL":
                            $scope.model.toBeAuthorizeCoursePoolResList.splice($scope.model.toBeAuthorizeCoursePoolResList.indexOf(item),1);
                            break;
                        case "EXAM_PAPER":
                            $scope.model.toBeAuthorizeExamPaperResList.splice($scope.model.toBeAuthorizeExamPaperResList.indexOf(item),1);
                            break;
                        case "QUESTION_LIBRARY":
                            $scope.model.toBeAuthorizeQuestionLibraryResList.splice($scope.model.toBeAuthorizeQuestionLibraryResList.indexOf(item),1);
                            break;
                    }
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

                //试题资源改变题型搜索条件
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

                //准备授权课程资源
                prepAuthorizeCourseRes:function () {
                    HB_dialog.contentAs($scope, {
                        title: '选择课程',
                        width: 1200,
                        height: 600,
                        showCancel: false,
                        showCertain: false,
                        templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo/dialog/res-un-authorize-course-dialog.html'
                    });
                },
                //准备授权课程包资源
                prepAuthorizeCoursePoolRes:function () {
                    HB_dialog.contentAs($scope, {
                        title: '选择课程包',
                        width: 1200,
                        height: 600,
                        showCancel: false,
                        showCertain: false,
                        templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo/dialog/res-un-authorize-course-pool-dialog.html'
                    });
                },
                //准备授权题库资源
                prepAuthorizeQuestionLibraryRes:function () {
                    HB_dialog.contentAs($scope, {
                        title: '选择题库',
                        width: 1200,
                        height: 600,
                        showCancel: false,
                        showCertain: false,
                        templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo/dialog/res-un-authorize-question-library-dialog.html'
                    });
                },
                //准备授权试卷
                prepAuthorizePaperExamRes:function () {
                    HB_dialog.contentAs($scope, {
                        title: '选择试卷',
                        width: 1200,
                        height: 600,
                        showCancel: false,
                        showCertain: false,
                        templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo/dialog/res-un-authorize-paper-exam-dialog.html'
                    });
                },


                //某种资源批量授权
                authorizeResForSingleType:function (resourceKey,index) {
                    var temp={
                        resourceKey:resourceKey,
                        targetUnitId:useUnit,
                        entityIdList:[]
                    };
                    var listName="";
                    switch (resourceKey){
                        case "COURSE":
                            listName ='toBeAuthorizeCourseResList';
                            break;
                        case "COURSE_POOL":
                            listName = 'toBeAuthorizeCoursePoolResList';
                            break;
                        case "EXAM_PAPER":
                            listName ='toBeAuthorizeExamPaperResList';
                            break;
                        case "QUESTION_LIBRARY":
                            listName ='toBeAuthorizeQuestionLibraryResList';
                            break;
                    }
                    var entityList = $scope.model[listName];
                    if (!entityList.length){
                        HB_dialog.warning("警告","请选择授权资源");
                        return;
                    }

                    var entityIdList = [];
                    angular.forEach(entityList,function (item, $index) {
                        entityIdList.push(item.id);
                    });
                    temp.entityIdList = entityIdList;
                    resAuthorizeUnitInfoService.authorizeResForSingleType(temp).then(function (data) {
                        if (data.status){
                            $scope.model[listName] = [];
                            HB_dialog.closeDialogByIndex($scope,index);
                            HB_dialog.success("提示","授权成功");
                        }else {
                            $scope.globle.alert("提示",data.info);
                        }
                    });
                },
                //某种资源批量回收
                recycleAuthorizeResForSingleType:function (resourceKey) {
                    var temp={
                        resourceKey:resourceKey,
                        targetUnitId:useUnit,
                        entityIdList:[]
                    };
                    var listName="",msg="";
                    switch (resourceKey){
                        case "COURSE":
                            listName ='toBeRecycleCourseResList';
                            break;
                        case "COURSE_POOL":
                            listName = 'toBeRecycleCoursePoolResList';
                            break;
                        case "EXAM_PAPER":
                            listName ='toBeRecycleExamPaperResList';
                            break;
                        case "QUESTION_LIBRARY":
                            listName ='toBeRecycleQuestionLibraryResList';
                            break;
                    }

                    var entityIdList = $scope.model[listName];
                    if (!entityIdList.length){
                        HB_dialog.warning("警告","请选择需批量回收的资源");
                        return;
                    }
                    temp.entityIdList = entityIdList;


                    msg = "确定批量回收该单位的"+$scope.model.resourceCECode[resourceKey]+"资源吗？";
                    HB_notification.confirm(msg, function (dialog) {
                        dialog.doRightClose();
                        resAuthorizeUnitInfoService.recycleAuthorizeResForSingleType(temp).then(function (data) {
                            if (data.status){
                                $scope.model[listName] = [];
                                HB_dialog.success("提示","批量回收成功");
                            }else {
                                $scope.globle.alert("提示",data.info);
                            }
                        });
                    });
                },

                checkAllToBeRecycleRes:function (e,resourceKey) {
                    var listName="";
                    var nodeName="";
                    switch (resourceKey){
                        case "COURSE":
                            listName ='toBeRecycleCourseResList';
                            nodeName ='courseGridInstance';
                            break;
                        case "COURSE_POOL":
                            listName = 'toBeRecycleCoursePoolResList';
                            nodeName = 'coursePoolGridInstance';
                            break;
                        case "EXAM_PAPER":
                            listName ='toBeRecycleExamPaperResList';
                            nodeName ='paperExamGridInstance';
                            break;
                    }
                    var viewData = $scope.node[nodeName].dataSource.view(),
                        size = viewData.length, row;
                    if (e.currentTarget.checked) {
                        for (var i = 0; i < size; i++) {
                            row = viewData[i];
                            var contain = $.inArray(row.id, $scope.model[listName])>=0;
                            if (!contain){
                                $scope.model[listName].push(row.id);
                            }
                        }
                    }else {
                        $scope.model[listName] = [];
                    }
                },


                checkBoxCheck: function (e, dataItem,resourceKey) {
                    var listName="";
                    var entityId = dataItem.id;
                    switch (resourceKey){
                        case "COURSE":
                            listName ='toBeRecycleCourseResList';
                            break;
                        case "COURSE_POOL":
                            listName = 'toBeRecycleCoursePoolResList';
                            break;
                        case "EXAM_PAPER":
                            listName ='toBeRecycleExamPaperResList';
                            break;
                    }
                    var entityList = $scope.model[listName];
                    var contain = $.inArray(entityId, $scope.model[listName])>=0;
                    if (contain){
                        $scope.model[listName].splice($scope.model[listName].indexOf(entityId),1);
                    }else {
                        $scope.model[listName].push(entityId);
                    }
                },

                goCourseDetail:function (dataItem) {
                    $state.go('states.courseManager.view', {courseId: dataItem.rootId});
                },
                //单个资源回收
                recycleAuthorizeResForSingleOne:function (dataItem,type) {

                    var msg = "确定回收该"+$scope.model.resourceCECode[type]+"资源吗？确定回收后，该资源所在的所有资源授权方案都会被回收。";

                    HB_notification.confirm(msg, function (dialog) {
                        dialog.doRightClose();
                        resAuthorizeUnitInfoService.recycleAuthorizeResForSingleOne({
                            resourceKey:type,
                            entityId:dataItem.id
                        }).then(function (data) {
                            if (data.status){
                                HB_dialog.success("提示","回收成功");
                            }else {
                                $scope.globle.alert("提示",data.info);
                            }
                        });
                    });
                },
                //单个资源恢复授权
                recoverAuthorizeResForSingleOne:function (dataItem,type) {
                    var msg = "确定重新授权"+$scope.model.resourceCECode[type]+"资源吗？";

                    HB_notification.confirm(msg, function (dialog) {
                        dialog.doRightClose();
                        resAuthorizeUnitInfoService.recoverAuthorizeResForSingleOne({
                            resourceKey:type,
                            entityId:dataItem.id
                        }).then(function (data) {
                            if (data.status){
                                HB_dialog.success("提示","恢复授权成功");
                            }else {
                                $scope.globle.alert("提示",data.info);
                            }
                        });
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

                closeKendoWindow : function (windowName) {
                    if ($scope[windowName]) {
                        $scope[windowName].kendoDialog.close();
                    }
                }
            };


            var localDB = {
                selectedIdArray: [],
                selectedStatusArray: {}
            };
            //初始化部分数据
            $scope.events.init();

            //课程资源表格模板
            var courseGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('<input ng-click="events.checkBoxCheck($event, dataItem,\'COURSE\')" type="checkbox"  id="check_#: id #"  class="k-checkbox" ng-checked="utils.checkBoxIsSelect(dataItem,\'COURSE\')" />' +
                    '<label class="k-checkbox-label" for="check_#: id #"></label>');
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
                result.push('<button type="button" class="table-btn" ng-click="events.recycleAuthorizeResForSingleOne(dataItem,\'COURSE\')" ng-show="#:authorizationState  ===\'AUTHORIZATION\'#">回收资源</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.recoverAuthorizeResForSingleOne(dataItem,\'COURSE\')" ng-show="#:authorizationState  ===\'CANCEL_AUTHORIZATION\'#">重新授权</button>');
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
                result.push('<input ng-click="events.checkBoxCheck($event, dataItem,\'COURSE_POOL\')" type="checkbox"  id="check_#: id #"  class="k-checkbox" ng-checked="utils.checkBoxIsSelect(dataItem,\'COURSE_POOL\')" />' +
                    '<label class="k-checkbox-label" for="check_#: id #"></label>');
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
                result.push('<button type="button" class="table-btn" ng-click="events.recycleAuthorizeResForSingleOne(dataItem,\'COURSE_POOL\')" ng-show="#:authorizationState  ===\'AUTHORIZATION\'#">回收资源</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.recoverAuthorizeResForSingleOne(dataItem,\'COURSE_POOL\')" ng-show="#:authorizationState  ===\'CANCEL_AUTHORIZATION\'#">重新授权</button>');
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
                result.push('<input ng-click="events.checkBoxCheck($event, dataItem,\'EXAM_PAPER\')" type="checkbox"  id="check_#: id #"  class="k-checkbox" ng-checked="utils.checkBoxIsSelect(dataItem,\'EXAM_PAPER\')" />' +
                    '<label class="k-checkbox-label" for="check_#: id #"></label>');
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
                result.push('<button type="button" class="table-btn" ng-click="events.recycleAuthorizeResForSingleOne(dataItem,\'EXAM_PAPER\')" ng-show="#:authorizationState  ===\'AUTHORIZATION\'#">回收资源</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.recoverAuthorizeResForSingleOne(dataItem,\'EXAM_PAPER\')" ng-show="#:authorizationState  ===\'CANCEL_AUTHORIZATION\'#">重新授权</button>');
                result.push('</td>');
                result.push('</tr>');

                paperExamGridRowTemplate = result.join('');
            })();



            //未授权课程资源表格模板
            var courseUnAuthorizeGridRowTemplate = '';
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
                result.push('<button type="button" class="table-btn" ng-show="!utils.isSelectToBeAuthorize(dataItem,\'COURSE\')" ng-click="events.addToBeAuthorizeRes(dataItem,\'COURSE\')">选择</button>');
                result.push('<button type="button" class="table-btn" ng-show="utils.isSelectToBeAuthorize(dataItem,\'COURSE\')" ng-click="events.removeToBeAuthorizeRes(dataItem,\'COURSE\')">取消选择</button>');
                result.push('</td>');
                result.push('</tr>');

                courseUnAuthorizeGridRowTemplate = result.join('');
            })();
            //未授权课程包资源表格模板
            var coursePoolUnAuthorizeGridRowTemplate = '';
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
                result.push('<button type="button" class="table-btn" ng-show="!utils.isSelectToBeAuthorize(dataItem,\'COURSE_POOL\')" ng-click="events.addToBeAuthorizeRes(dataItem,\'COURSE_POOL\')">选择</button>');
                result.push('<button type="button" class="table-btn" ng-show="utils.isSelectToBeAuthorize(dataItem,\'COURSE_POOL\')" ng-click="events.removeToBeAuthorizeRes(dataItem,\'COURSE_POOL\')">取消选择</button>');
                result.push('</td>');
                result.push('</tr>');

                coursePoolUnAuthorizeGridRowTemplate = result.join('');
            })();
            //未授权试题资源表格模板
            var questionLibraryUnAuthorizeGridRowTemplate = '';
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
                result.push('#: questionCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: parentLibrary #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-show="!utils.isSelectToBeAuthorize(dataItem,\'QUESTION_LIBRARY\')" ng-click="events.addToBeAuthorizeRes(dataItem,\'QUESTION_LIBRARY\')">选择</button>');
                result.push('<button type="button" class="table-btn" ng-show="utils.isSelectToBeAuthorize(dataItem,\'QUESTION_LIBRARY\')" ng-click="events.removeToBeAuthorizeRes(dataItem,\'QUESTION_LIBRARY\')">取消选择</button>');
                result.push('</td>');
                result.push('</tr>');

                questionLibraryUnAuthorizeGridRowTemplate = result.join('');
            })();
            //未授权考试卷资源表格模板
            var paperExamUnAuthorizeGridRowTemplate = '';
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
                result.push('<button type="button" class="table-btn" ng-show="!utils.isSelectToBeAuthorize(dataItem,\'EXAM_PAPER\')" ng-click="events.addToBeAuthorizeRes(dataItem,\'EXAM_PAPER\')">选择</button>');
                result.push('<button type="button" class="table-btn" ng-show="utils.isSelectToBeAuthorize(dataItem,\'EXAM_PAPER\')" ng-click="events.removeToBeAuthorizeRes(dataItem,\'EXAM_PAPER\')">取消选择</button>');
                result.push('</td>');
                result.push('</tr>');

                paperExamUnAuthorizeGridRowTemplate = result.join('');
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
                            title: '<span><input class=\'k-checkbox\'  id=\'courseSelectAll\' ng-click=\'events.checkAllToBeRecycleRes($event,"COURSE")\' type=\'checkbox\' ng-checked="utils.checkBoxIsSelectAll($event,\'COURSE\')" /><label class=\'k-checkbox-label\' for=\'courseSelectAll\'></label></span>',
                            filterable: false,
                            width: 40,
                            attributes: { // 用template的时候失效。
                                'class': 'tcenter'
                            }
                        },
                        {field: 'name', title: '课程名称', sortable: false},
                        {field: 'supplier', title: '课程供应商', sortable: false, width: 100},
                        {field: 'typeName', title: '课程分类', sortable: false, width: 100},
                        {field: 'timeLength', title: '课程时长', sortable: false, width: 100},
                        {field: 'period', title: '学时', sortable: false, width: 50},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 140},
                        {field: 'authorizationState', title: '授权状态', sortable: false, width: 100},
                        {
                            title: '操作', width: 120
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
                            title: '<span><input class=\'k-checkbox\'  id=\'coursePoolSelectAll\' ng-click=\'events.checkAllToBeRecycleRes($event,"COURSE_POOL")\' type=\'checkbox\' ng-checked="utils.checkBoxIsSelectAll($event,\'COURSE_POOL\')" /><label class=\'k-checkbox-label\' for=\'coursePoolSelectAll\'></label></span>',
                            filterable: false,
                            width: 40,
                            attributes: { // 用template的时候失效。
                                'class': 'tcenter'
                            }
                        },
                        {field: 'name', title: '课程包名称', sortable: false},
                        {field: 'courseCount', title: '课程数', sortable: false, width: 100},
                        {field: 'totalPeriod', title: '课程总学时', sortable: false, width: 100},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 140},
                        {field: 'authorizationState', title: '授权状态', sortable: false, width: 100},
                        {
                            title: '操作', width: 120
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
                            title: '操作', width: 120
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
                            title: '<span><input class=\'k-checkbox\'  id=\'examPaperSelectAll\' ng-click=\'events.checkAllToBeRecycleRes($event,"EXAM_PAPER")\' type=\'checkbox\' ng-checked="utils.checkBoxIsSelectAll($event,\'EXAM_PAPER\')" /><label class=\'k-checkbox-label\' for=\'examPaperSelectAll\'></label></span>',
                            filterable: false,
                            width: 40,
                            attributes: { // 用template的时候失效。
                                'class': 'tcenter'
                            }
                        },
                        {field: 'name', title: '试卷名称', sortable: false},
                        {field: 'configType', title: '组卷方式', sortable: false, width: 100},
                        {field: 'totalScore', title: '试卷总分', sortable: false, width: 100},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 140},
                        {field: 'authorizationState', title: '授权状态', sortable: false, width: 100},
                        {
                            title: '操作', width: 120
                        }
                    ]
                }),

                courseUnAuthorizeGrid:hbUtil.kdGridCommonOptionDIY({
                    template: courseUnAuthorizeGridRowTemplate,
                    url: $scope.url.courseUnAuthorizeUrl,
                    scope: $scope,
                    param: $scope.model.courseUnAuthorizeArg,
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
                        {field: 'period', title: '学时', sortable: false, width: 100},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 140},
                        {
                            title: '操作', width: 120
                        }
                    ]
                }),
                coursePoolUnAuthorizeGrid:hbUtil.kdGridCommonOptionDIY({
                    template: coursePoolUnAuthorizeGridRowTemplate,
                    url: $scope.url.coursePoolUnAuthorizeUrl,
                    scope: $scope,
                    param: $scope.model.coursePoolUnAuthorizeArg,
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
                        {
                            title: '操作', width: 120
                        }
                    ]
                }),
                questionLibraryUnAuthorizeGrid:hbUtil.kdGridCommonOptionDIY({
                    template: questionLibraryUnAuthorizeGridRowTemplate,
                    url: $scope.url.questionLibraryUnAuthorizeUrl,
                    scope: $scope,
                    param: $scope.model.questionLibraryUnAuthorizeArg,
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
                        {field: 'name', title: '题库名称', sortable: false},
                        {field: 'questionCount', title: '试题数量', sortable: false, width: 100},
                        {field: 'parentLibrary', title: '上级题库', sortable: false, width: 200},
                        {field: 'createTime', title: '创建时间', sortable: false, width: 200},
                        {
                            title: '操作', width: 120
                        }
                    ]
                }),
                paperExamUnAuthorizeGrid:hbUtil.kdGridCommonOptionDIY({
                    template: paperExamUnAuthorizeGridRowTemplate,
                    url: $scope.url.paperExamUnAuthorizeUrl,
                    param: $scope.model.paperExamUnAuthorizeArg,
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
                        {
                            title: '操作', width: 120
                        }
                    ]
                }),
            };
            $scope.tree = {
                //题库树
                questionLibraryTree:hbUtil.kdTreeOption($scope.url.questionLibraryTreeUrl,"parentId","&unitId="+useUnit)
            };
            $scope.utils={
                //判断指定的单位id是否在选中的预授权的单位集合内
                isSelectToBeAuthorize:function (item,type) {
                    //对象赋值，不能直接使用$.inArray，列表刷新之后会是新的对象，和之前本地保存的对象不一致，导致判断不相等
                    var isSelect = false;
                    var arr = [];
                    switch (type){
                        case "COURSE":
                            arr = $scope.model.toBeAuthorizeCourseResList;
                            break;
                        case "COURSE_POOL":
                            arr =$scope.model.toBeAuthorizeCoursePoolResList;
                            break;
                        case "EXAM_PAPER":
                            arr =$scope.model.toBeAuthorizeExamPaperResList;
                            break;
                        case "QUESTION_LIBRARY":
                            arr =$scope.model.toBeAuthorizeQuestionLibraryResList;
                            break;
                    }

                    angular.forEach(arr,function (data,index) {
                        if(data.id == item.id){
                            isSelect = true;
                        }
                    });
                    return isSelect;
                },
                checkBoxIsSelect:function (dataItem,resourceKey) {
                    var listName="";
                    var entityId = dataItem.id;
                    switch (resourceKey){
                        case "COURSE":
                            listName ='toBeRecycleCourseResList';
                            break;
                        case "COURSE_POOL":
                            listName = 'toBeRecycleCoursePoolResList';
                            break;
                        case "EXAM_PAPER":
                            listName ='toBeRecycleExamPaperResList';
                            break;
                    }
                    return $.inArray(entityId, $scope.model[listName])>=0;
                },
                checkBoxIsSelectAll:function (e,resourceKey) {

                    var listName="";
                    var nodeName="";
                    switch (resourceKey){
                        case "COURSE":
                            listName ='toBeRecycleCourseResList';
                            nodeName ='courseGridInstance';
                            break;
                        case "COURSE_POOL":
                            listName = 'toBeRecycleCoursePoolResList';
                            nodeName = 'coursePoolGridInstance';
                            break;
                        case "EXAM_PAPER":
                            listName ='toBeRecycleExamPaperResList';
                            nodeName ='paperExamGridInstance';
                            break;
                    }

                    var viewData = $scope.node[nodeName].dataSource.view(),
                        size = viewData.length, row;
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        var contain = $.inArray(row.id, $scope.model[listName])>=0;
                        if (!contain){
                           return false;
                        }
                    }
                    return true;
                }

            }
    }];
});