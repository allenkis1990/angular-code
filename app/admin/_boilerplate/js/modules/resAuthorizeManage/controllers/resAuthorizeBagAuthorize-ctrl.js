/**
 * Created by hk on 2018/6/11.
 */
define(function (resAuthotizeBagAuthorize) {
    'use strict';
    return ['$scope','$stateParams','resAuthorizeManageService','hbUtil','HB_notification','$state','HB_dialog',
        function ($scope,$stateParams,resAuthorizeManageService,hbUtil,HB_notification,$state,HB_dialog) {
            $scope.model = {
                selectSchemeArray : JSON.parse($stateParams.selectSchemeArray),
                selectedAuthorizeUnitId: [],
                selectedAuthorizeUnit :[],
                selectedAuthorizeUnitIdTemp: [],
                schemeAuthorizeParam:{
                    schemeIds:[],
                    unitIds:[],
                },
                authorizedUnitPage: {
                    pageNo: 1,
                    pageSize: 5
                },
            }
            $scope.events = {

                //取消返回资源管理页面
                goAuthorizeManage : function (e) {
                    $scope.globle.confirm('提示', '是否放弃授权方案', function (dialog) {
                        $state.go("states.resAuthorizeManage");
                    })
                },

                //移除选中授权方案
                 removeScheme:function (item) {
                     $scope.globle.confirm('提示', '是否取消授权该方案:'+item.name+'', function (dialog) {
                         var arr = $scope.model.selectSchemeArray;
                         angular.forEach(arr,function (dataItem,index) {
                             if(item.id == dataItem.id){
                                 $scope.model.selectSchemeArray.splice(index,1);
                                 return false;
                             }
                         })
                     })
                 },
                selectItem: function (e, dataItem) {
                    var arr = $scope.model.selectSchemeArray;
                    $scope.model.schemeAuthorizeParam.schemeIds = [];
                    angular.forEach(arr,function (item) {
                        if(arr.length != $scope.model.schemeAuthorizeParam.schemeIds.length){
                            $scope.model.schemeAuthorizeParam.schemeIds.push(item.id);
                        }
                    });
                    $scope.model.schemeAuthorizeParam.unitIds = [];
                    $scope.model.schemeAuthorizeParam.unitIds.push(dataItem.unitId);
                    return resAuthorizeManageService.checkUnitAuthorizeScheme($scope.model.schemeAuthorizeParam).then(function (data) {
                        if(data.info){
                            HB_dialog.warning('警告', '该施教机构已存在该资源授权方案，若需调整，请进入“机构资源授权情况”对该单位授权资源调整！');
                        }else{
                            if (hbUtil.validateIsNull(dataItem.unitId)) {
                                HB_notification.alert('数据异常，获取不到当前行的单位id');
                            }
                            var index = hbUtil.indexOf($scope.model.selectedAuthorizeUnitId, dataItem.unitId);
                            if (index !== -1) {
                                HB_notification.alert('当前单位已选');
                            }
                            var index = hbUtil.indexOf($scope.model.selectedAuthorizeUnitId, dataItem.unitId);
                            if (index !== -1) {
                                $scope.model.selectedAuthorizeUnitId.splice(index, 1);
                            }
                            $scope.model.selectedAuthorizeUnit.push(dataItem)
                            $scope.model.selectedAuthorizeUnitId.push(dataItem.unitId);
                        }
                    })
                },
                cancelSelectItem: function (e, dataItem) {
                    var index = hbUtil.indexOf($scope.model.selectedAuthorizeUnitId, dataItem.unitId);
                    if (index !== -1) {
                        $scope.model.selectedAuthorizeUnitId.splice(index, 1);
                        $scope.model.selectedAuthorizeUnit.splice(index,1)
                    }
                },
                //提交授权
                submitAuthorize:function (e) {
                    if($scope.model.selectedAuthorizeUnitId.length <= 0){
                        HB_dialog.warning('警告', '请选择需授权的单位');
                        return;
                    }
                    if($scope.model.selectSchemeArray.length <= 0){
                        HB_dialog.warning('警告', '请选择需授权的资源方案');
                        return;
                    }
                    var arr = $scope.model.selectSchemeArray;
                    $scope.model.schemeAuthorizeParam.schemeIds = [];
                    angular.forEach(arr,function (dataItem) {
                        if(arr.length != $scope.model.schemeAuthorizeParam.schemeIds.length){
                            $scope.model.schemeAuthorizeParam.schemeIds.push(dataItem.id);
                        }
                    });
                    $scope.model.schemeAuthorizeParam.unitIds = $scope.model.selectedAuthorizeUnitId;
                    return resAuthorizeManageService.schemeAuthorize($scope.model.schemeAuthorizeParam).then(function (data) {
                        if (!data.status) {
                            $scope.globle.alert('资源授权失败!', data.info);
                        } else {
                            $scope.globle.showTip('授权任务执行中，请前往授权异步任务查看', 'success');
                        }
                    })
                }
            }
            init();
            //初始化获取方案下资源信息，及可授权单位信息
            function init() {
                var arr = $scope.model.selectSchemeArray;

                angular.forEach(arr,function (dataItem) {
                    dataItem.courseCount = $scope.util.getCountFromResourceGroupCount(dataItem.resourceGroupCount,'course');
                    dataItem.coursePoolCount = $scope.util.getCountFromResourceGroupCount(dataItem.resourceGroupCount,'course_pool');
                    dataItem.questionLibraryCount = $scope.util.getCountFromResourceGroupCount(dataItem.resourceGroupCount,'question_library');
                    dataItem.examPaperCount = $scope.util.getCountFromResourceGroupCount(dataItem.resourceGroupCount,'exam_paper');
                    if(dataItem.courseCount == null){
                        dataItem.courseCount = 0;
                    }
                    if(dataItem.coursePoolCount == null){
                        dataItem.coursePoolCount = 0;
                    }
                    if(dataItem.questionLibraryCount == null){
                        dataItem.questionLibraryCount = 0;
                    }
                    if(dataItem.examPaperCount == null){
                        dataItem.examPaperCount = 0;
                    }

                })
            }

            $scope.util={
                getCountFromResourceGroupCount:resAuthorizeManageService.getCountFromResourceGroupCount,

                validateIsNull: hbUtil.validateIsNull,
                hasChoose: function (e, dataItem) {
                    if (hbUtil.validateIsNull(dataItem)) {
                        return false;
                    }
                    if (hbUtil.validateIsNull($scope.model.selectedAuthorizeUnitId)) {
                        return false;
                    }
                    var index = hbUtil.indexOf($scope.model.selectedAuthorizeUnitId, dataItem.unitId);
                    if (index !== -1) {
                        return true;
                    }
                    return false;
                }
            }

            var resAuthorizeUnitTemplate = '';

            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: unitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: organizationCode?organizationCode:\'-\' #">#: organizationCode?organizationCode:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span>b{{dataItem.unitManagerDto.loginAccount?dataItem.unitManagerDto.loginAccount:\'-\'}}</span>');
                result.push('<div ng-if="utils.validateIsNull(dataItem.unitDtoManager)===true">');
                result.push('-');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" ng-if="util.hasChoose($event,dataItem)===true" ng-click="events.cancelSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                result.push('<button type="button" ng-if="util.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)"  class="table-btn">选择</button>');
                result.push('</td>');

                result.push('</tr>');
                resAuthorizeUnitTemplate = result.join('');
            })();
            $scope.authorizedUnitGrid = {
                    options : hbUtil.kdGridCommonOptionDIY({
                    template : resAuthorizeUnitTemplate,
                    outSidePage: true,
                    scope: $scope,
                    url : '/web/admin/resourceBag/pageAuthorizeUnitInfo',
                    page : $scope.model.authorizedUnitPage,
                    fn:function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {field: 'unitName', title: '单位名称', sortable: false},
                        {field: 'organizationCode', title: '组织机构代码', width: 200, sortable: false},
                        {field: 'createTime', title: '入驻时间', width: 200, sortable: false},
                        {field: 'adminAccount', title: '管理员账号', width: 200, sortable: false},
                        {
                            title: '操作', width: 80
                        }
                    ]

                })
            }

    }]
})
