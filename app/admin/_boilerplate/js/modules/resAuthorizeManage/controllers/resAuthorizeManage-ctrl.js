/**
 * Created by linj on 2018/6/4 19:13.
 */
define(function (resAuthorizeManage) {
    'use strict';
    return ['$scope','$state','hbUtil','resAuthorizeManageService','easyKendoDialog','HB_notification','$timeout',
        function($scope,$state,hbUtil,resAuthorizeManageService,easyKendoDialog,HB_notification,$timeout){
        $scope.model={
            resourcePage:{
                pageNo:1,
                pageSize:10
            },
            resourceParam:{},
            resourceBagOpParam:{},
            resourceBagOpList:[],
            tabs:{
                course: {name: "课程", code: "course", resCode: "course", countTxt: "门"},
                coursePool: {name: "课程包", code: "coursePool", resCode: "course_pool", countTxt: "个"},
                examLibrary: {name: "题库", code: "examLibrary", resCode: "question_library", countTxt: "个"},
                examPaper: {name: "试卷", code: "examPaper", resCode: "exam_paper", countTxt: "份"}
            }
        };

        var localDB = {//授权方案的已选对象信息
            selectedSchemeArray: [],
        };

        $scope.timeConfig = {
            open: function (e) {
                this.$scope = $scope;
                // this.endTime = $scope.model.endTime;

            }
        };
        $scope.node={};
        $scope.$watch('model.createDateStart',function(newVal){
            if(hbUtil.validateIsNull(newVal)){
                delete $scope.model.resourceParam.createDateStart;
            }else{
                $scope.model.resourceParam.createDateStart = newVal +" 00:00:00"
            }
        });
        $scope.$watch('model.createDateEnd',function(newVal){
            if(hbUtil.validateIsNull(newVal)){
                delete $scope.model.resourceParam.createDateEnd;
            }else{
                $scope.model.resourceParam.createDateEnd = newVal +" 23:59:59"
            }
        });
        $scope.events={
            goDetail:function(e,id){
                $state.go('states.resAuthorizeManage.detail',{id:id})
            },
            goEdit: function(e,id){
                resAuthorizeManageService.validateResBagUpdatable(id).then(function(data){
                    if(data.status){
                        if(data.info===false){
                            HB_notification.showTip('该资源授权方案存在异步授权资源的任务，无法编辑，请异步任务执行完成后再修改！','warning');
                        }else{
                            $state.go('states.resAuthorizeManage.edit',{id:id});
                        }
                    }
                });

            },
            deleteRes: function(e,id){
                resAuthorizeManageService.deleteResourceBag(id).then(function(data){
                    if(data.status){
                        HB_notification.showTip(data.info,'success');
                        $timeout(function(){
                            $scope.kendoPlus.resourceGridInstance.dataSource.read();
                        },2000);

                    }else{
                        HB_notification.showTip(data.info,'error');
                    }
                });
            },
            showAuthotizedLog: function (e,id){

            },
            goAuthorize : function (e) {
                if(localDB.selectedSchemeArray.length == 0){
                    $scope.globle.alert('提示!', '请选择至少选择一个要授权的资源方案！');
                    return;
                }
                $state.go('states.resAuthorizeManage.authorize',{selectSchemeArray : JSON.stringify(localDB.selectedSchemeArray)});
            },
            search: function(e){
                $scope.kendoPlus.resourceGridInstance.pager.page(1);
            },

            checkBoxCheck: function (e, dataItem) {
                if (e.currentTarget.checked) {
                    localDB.selectedSchemeArray.push(dataItem);
                } else {
                    var index = _.indexOf(localDB.selectedSchemeArray, dataItem);
                    if (index !== -1) {
                        localDB.selectedSchemeArray.splice(index, 1);
                    }
                }
                utils.refreshBatchButton();
            },

            questionSelectAll: function (e) {
                // 重置表格已选的ID, 已选的状态
                localDB.selectedSchemeArray = [];
                // 全选
                if (e.currentTarget.checked) {
                    var viewData = $scope.configingArr,
                        size = viewData.length, row;
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        // 缓存本地
                        localDB.selectedSchemeArray.push(row);
                    }
                }
                utils.refreshBatchButton();
            },
            showResourceOpLog: function(e,id){
                $scope.model.resourceBagOpList.length = 0;
                $scope.model.resourceBagOpSize = 0;
                $scope.model.resourceBagOpParam.id = id;
                $scope.resourceBagOpWindow = easyKendoDialog.content({
                    templateUrl: '@systemUrl@/views/resAuthorizeManage/resourceBagOpDialog.html',
                    width: 750,
                    title: false,
                    afterOpen:function(){
                        $scope.node.resourceBagOpPager.dataSource.page(1);
                        // $scope.node.resourceBagOpPager.dataSource.page(1);
                    }
                }, $scope);
            },
            closeKendoWindow: function (windowName) {
                if ($scope[windowName]) {
                    $scope[windowName].kendoDialog.close();
                }
            },
        };
        var utils = {
            refreshBatchButton: function () {
                var selectedSchemeArray = localDB.selectedSchemeArray,
                    size = selectedSchemeArray.length;
                // 已选的数量为0, 等价于取消全选; 数量为当前展示的页面量, 等价于全选
                if (size === 0) {
                    $scope.selected = false;
                } else if (size === $scope.configingArr.length) {
                    $scope.selected = true;
                }
            }
        }
        $scope.util={
            getCountFromResourceGroupCount:resAuthorizeManageService.getCountFromResourceGroupCount,
            getResType:function(key){
                var result;
                angular.forEach($scope.model.tabs,function(value){
                    if(value.resCode === key){
                        result = value;
                        return ;
                    }
                });
                return result;
            }
        }

        var resManageTemplate = '';
        (function(){
            var result = [];
            result.push('<tr>');

            result.push('<td>');
            result.push('#: index #');
            result.push('</td>');

            result.push('<td>');
            result.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: id #"  class="k-checkbox" ng-checked="selected"/>' +
                '<label class="k-checkbox-label" for="check_#: id #"></label>');
            result.push('</td>');

            result.push('<td>');
            result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
            result.push('</td>');

            result.push('<td>');
            result.push('<span>' +
                '课程：b{{util.getCountFromResourceGroupCount(dataItem.resourceGroupCount,\'course\')}} 门；' +
                '课程包：b{{util.getCountFromResourceGroupCount(dataItem.resourceGroupCount,\'course_pool\')}} 个；' +
                '题库：b{{util.getCountFromResourceGroupCount(dataItem.resourceGroupCount,\'question_library\')}} 个；' +
                '考试卷 ：b{{util.getCountFromResourceGroupCount(dataItem.resourceGroupCount,\'exam_paper\')}} 份</span>');
            // result.push('<span ng-if="dataItem.resourceGroupCount" ng-repeat="(key,value) in dataItem.resourceGroupCount">');
            // result.push('<span ng-if="key===\'course_resource\'">课程：b{{value}} 门；</span>');
            // result.push('<span ng-if="key===\'course_resource\'">课程包：b{{value}}个；</span>');
            // result.push('<span ng-if="key===\'course_resource\'">题库：b{{value}}个；</span>');
            // result.push('<span ng-if="key===\'course_resource\'">考试卷 ：b{{value}}份；</span>');
            // result.push('</span>');
            result.push('</td>');

            result.push('<td>');
            result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
            result.push('</td>');

            result.push('<td>');
            result.push('<span class="table-btn" title="#: useCount #">#: useCount #</span>');
            result.push('</td>');

            result.push('<td>');
            result.push('<button type="button" class="table-btn" ng-click="events.showResourceOpLog($event,dataItem.id)">操作日志</button>');
            result.push('<button type="button" class="table-btn" ng-click="events.goDetail($event,dataItem.id)">详情</button>');
            result.push('<button type="button" class="table-btn" ng-click="events.goEdit($event,dataItem.id)">编辑</button>');
            result.push('<button type="button" class="table-btn" ng-if="dataItem.hasAuthorized===false" ng-click="events.deleteRes($event,dataItem.id)">删除</button>');
            result.push('<button type="button" class="table-btn" ng-click="events.showAuthorizedLog($event,dataItem.id)">授权日志</button>');
            result.push('</td>');

            result.push('</tr>');
            resManageTemplate = result.join('');
        })();

        $scope.resourceGrid = {
            options : hbUtil.kdGridCommonOptionDIY({
                template: resManageTemplate,
                url: '/web/admin/resourceBag/findResourceBagPage',
                scope: $scope,
                page:'resourcePage',
                outSidePage:true,
                param:$scope.model.resourceParam,
                fn: function(response){
                    $scope.configingArr = response.info;
                },
                columns:[
                    {
                        title:'No',
                        width:50
                    },
                    {
                        title: '<span><input class=\'k-checkbox\' ng-model=\'selected\' id=\'questionSelectAll\' ng-click=\'events.questionSelectAll($event)\' type=\'checkbox\'/>' +
                        '<label class=\'k-checkbox-label\' for=\'questionSelectAll\'></label></span>',
                        filterable: false,
                        width: 40,
                        attributes: { // 用template的时候失效。
                            'class': 'tcenter'
                        }
                    },
                    {title:'授权方案名称'},
                    {title:'资源类型及数量',width:380},
                    {title:'创建日期',width:200},
                    {title:'授权使用单位数',width:120},
                    {title:'操作',width:230}
                ]
            })
        };

        $scope.resourceBagOpPager = {
            options : hbUtil.kdPagerOptionDIY({
                url: '/web/admin/resourceBag/findResourceBagOpLog',
                outSidePage:true,
                pageSize:5,
                scope: $scope,
                param: $scope.model.resourceBagOpParam,
                fn: function(response){
                    $scope.model.resourceBagOpList = response.info;
                    $scope.model.resourceBagOpSize = response.totalSize;
                    $scope.$apply();
                }
            })
        }


    }];
});