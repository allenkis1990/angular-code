/**
 * Created by eleven on 2018/6/4 19:13.
 */
define(function (resAuthorizedUnitInfo) {
    'use strict';
    return ['$scope', 'resAuthorizeUnitInfoService', 'kendo.grid','KENDO_UI_GRID','$stateParams','hbUtil',  'HB_dialog', '$state', 'HB_notification','easyKendoDialog',
        function($scope, resAuthorizeUnitInfoService,kendoGrid, KENDO_UI_GRID,$stateParams, hbUtil, HB_dialog, $state, HB_notification,easyKendoDialog){

            //涉及后端请求的url
            $scope.url={
                unitUrl:"/web/admin/resAuthorizeUnit/pageUnitResAuthorize"
            };

            //数据请求
            $scope.model={

                logPage:{
                    pageNo: 1,
                    pageSize:5,
                    pageCount:1,
                    totalSize:0
                },
                pageList:[],
                authorizeRecordList : [],
                unitId:""
            };
            $scope.node={
                unitInstance:null,
                courseGridInstance:null,
                coursePoolGridInstance:null,
                questionGridInstance:null,
                paperExamGridInstance:null
            };
            $scope.events={

                //跳转到资源明细页面
                goResourceDetail:function (unitId) {
                    $state.go("states.resAuthorizedUnitInfo.view",{unitId:unitId});
                },
                //跳转到资源调整授权页面
                goResourceUpdate:function (unitId) {
                    $state.go("states.resAuthorizedUnitInfo.update",{unitId:unitId});
                },
                //跳转到资源授权日志
                goResourceLog:function () {
                    $scope.events.closeKendoWindow("authorizedOpDialog");
                    $state.go("states.resAuthorizedUnitInfo.log");
                },

                //查看授权日志弹窗
                openDialog: function (unitId) {
                    $scope.model.logPage.pageNo = 1;
                    $scope.events.pageLog($scope.model.logPage.pageNo,unitId);
                    $scope.authorizedOpDialog = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/resAuthorizedUnitInfo//resAuthorizeDialog.html',
                        width: 1000,
                        title: false
                    }, $scope);
                },
                closeKendoWindow : function (windowName) {
                    if ($scope[windowName]) {
                        $scope[windowName].kendoDialog.close();
                    }
                },
                pageLog: function(no,unitId){
                    if (no <= 0 || no > $scope.model.logPage.pageCount) {
                        return;
                    }
                    $scope.model.logPage.pageNo = no;
                    if(unitId == "" || unitId == null){
                        unitId = $scope.model.unitId;
                    }
                    resAuthorizeUnitInfoService.pageResAuthorizeLogs({
                        pageNo: $scope.model.logPage.pageNo,
                        pageSize: $scope.model.logPage.pageSize,
                        unitId : unitId
                    }).then(function (data) {
                        if (data == undefined || data == null) {
                            return;
                        }
                        if (data.status) {
                            $scope.model.logPage.pageCount = data.totalPageSize;
                            $scope.model.logPage.totalSize = data.totalSize;
                            $scope.model.authorizeRecordList = data.info;
                            $scope.model.unitId = unitId;
                            $scope.model.pageList = [];
                            var start = 0;
                            if ($scope.model.logPage.pageNo <= 3) {
                                start = 0;
                            } else if ($scope.model.logPage.pageNo + 3 > $scope.model.logPage.pageCount) {
                                start = $scope.model.logPage.pageCount - 6;
                                if (start < 0) {
                                    start = 0;
                                }
                            } else {
                                start = $scope.model.logPage.pageNo - 3;
                            }
                            for (var i = 1; i <= 6 && start + i <= $scope.model.logPage.pageCount; i++) {
                                $scope.model.pageList[i - 1] = start + i;
                            }
                        } else {
                            HB_notification.showTip(data.info, 'error');
                        }
                    });
                },
            };



           

            //单位使用方案名单表格模板
            var unitGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('#:index #');
                result.push('</td>');


                result.push('<td>');
                result.push('<span >#:unitName #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: platformName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: resourceList #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: resourceCount #');
                result.push('</td>');

                // result.push('<td>');
                // result.push('<span ng-if="#:state==1#">可用</span>' + '<span ng-if="#:state==2#">停用</span>' + '<span ng-if="#:state==3#">停用</span>');
                //
                // result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.goResourceDetail(\'#: unitId #\')">查看资源明细</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.goResourceUpdate(\'#: unitId #\')">调整授权资源</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.openDialog(unitId)">授权日志</button>');
                // result.push('<button type="button" class="table-btn" ng-if="#:state==1#" ng-click="events.stopPhysicalStorage($event,dataItem)" ng-disabled="flagModel.tabType == \'PROJECT\'">停用</button>');
                // result.push('<button type="button" class="table-btn" ng-if="#:state==2||state==3# " ng-click="events.openPhysicalStorage($event,dataItem)" ng-disabled="flagModel.tabType == \'PROJECT\'">启用</button>');
                //result.push('<button type="button" class="table-btn" ng-click="events.PhysicalStorage($event,dataItem,0)">详细</button>');
                // result.push('<button type="button" class="table-btn"  ng-click="events.deletePhysicalStorage($event,dataItem)"  ng-disabled="flagModel.tabType == \'PROJECT\'">删除</button>');
                result.push('</td>');
                result.push('</tr>');

                unitGridRowTemplate = result.join('');
            })();



            $scope.grid={
                unitGrid:hbUtil.kdGridCommonOptionDIY({
                    template: unitGridRowTemplate,
                    url: $scope.url.unitUrl,
                    scope: $scope,
                    param: null,
                    fn: function (response) {
                        angular.forEach(response.info,function (item,index) {
                            // item.resourceList = "11111"
                            if(hbUtil.validateIsNull(item.resourceList)){
                                item.resourceList = "-";
                            }else {
                                var temp = item.resourceList;
                                item.resourceList = null;
                                item.resourceList = temp.join(",");
                            }
                            if(hbUtil.validateIsNull(item.resourceCountDtoList)){
                                item.resourceCount = "-";
                            }else {
                                var temp = item.resourceCountDtoList;

                                var result = "";
                                angular.forEach(temp,function (resourceCount, index) {

                                    var resource = "";
                                    switch (resourceCount.resourceKey){
                                        case "exam_paper":
                                            resource="考试卷"+resourceCount.count+"份; ";
                                            break;
                                        case "question_library":
                                            resource="题库"+resourceCount.count+"个; ";
                                            break;
                                        case "course":
                                            resource="课程"+resourceCount.count+"门; ";
                                            break;
                                        case "course_pool":
                                            resource="课程包"+resourceCount.count+"个; ";
                                            break
                                    }
                                    result+=resource;
                                });
                                item.resourceCount = result;
                            }
                        });
                    },
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {field: 'unitName', title: '培训机构名称', sortable: false, width: 100},
                        {field: 'platformName', title: '培训平台名称', sortable: false, width: 200},
                        {field: 'resourceList', title: '拥有的授权方案', sortable: false, width: 200},
                        {field: 'resourceCountDtoList', title: '当前在用授权资源数量', sortable: false, width: 300},
                        {
                            title: '操作', width: 200
                        }
                    ]
                }),
                courseGrid:{},
                coursePoolGrid:{},
                questionGrid:{},
                paperExamGrid:{},


            };
    }];
});