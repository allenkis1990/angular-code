/**
 * Created by linj on 2018/6/9 12:13.
 */
define(function(resAuthotizeBagDetail){
    'use strict';
    return ['$scope','$state','$stateParams','resAuthorizeManageService', 'HB_notification','hbUtil','$timeout',
        function($scope,$state,$stateParams,resAuthorizeManageService,HB_notification,hbUtil,$timeout){
            $scope.model = {
                resBagId:$stateParams.id,
                validateParams:{
                    exceptId:$stateParams.id
                },
                formData: {},
                tabs: {
                    course: {name: "请选择课程资源", code: "course",resCode:"course",countTxt:"门"},
                    coursePool: {name: "请选择课程包资源", code: "coursePool",resCode:"course_pool",countTxt:"个"},
                    examLibrary: {name: "请选择题库资源", code: "examLibrary",resCode:"question_library",countTxt:"个"},
                    examPaper: {name: "请选择试卷资源", code: "examPaper",resCode:"exam_paper",countTxt:"份"}
                },
                courseQueryParam:{
                    includeResourceBagId:$stateParams.id
                },
                coursePoolQueryParam:{
                    includeResourceBagId:$stateParams.id
                },
                examLibraryQueryParam:{
                    includeResourceBagId:$stateParams.id
                },
                examPaperQueryParam:{
                    includeResourceBagId:$stateParams.id
                }
            }
            $scope.model.currentType =$scope.model.tabs.course.code;

            $scope.events={
                selectAll: function (e) {
                    var viewData = $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.view();
                    angular.forEach(viewData, function (data) {
                        data.del = e.currentTarget.checked;
                    });
                },
                removeAll: function (e) {
                    HB_notification.confirm('确定移除这些资源吗？', function (dialog) {
                        var data;
                        var removeData={resourceIds:[]};
                        var dataList = $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.view();
                        for (var i = 0; i < dataList.length;) {
                            data = dataList[i];
                            if (data.del && data.del === true) {
                                removeData.resourceIds.push(data.id);
                            }
                            i++
                        }

                        resAuthorizeManageService.removeResourcesFromResourceBag($stateParams.id,$scope.utils.getResCode(),
                            removeData).then(function(data){
                            if(data.status){
                                $timeout(function(){
                                    $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.read();
                                },2500);
                                HB_notification.showTip(data.info,'success');
                            }else{
                                HB_notification.showTip(data.info,'error');
                            }
                        });

                        $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.read();
                        $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].pager.page(1);
                    });
                },
                removeItem: function (e, dataItem) {
                    HB_notification.confirm('确定移除该资源吗？', function (dialog) {
                        var dataList = $scope.model[$scope.model.currentType + 'List'];
                        resAuthorizeManageService.removeResourcesFromResourceBag($stateParams.id,$scope.utils.getResCode(),
                            {resourceIds:dataItem.id}).then(function(data){
                                if(data.status){
                                    $timeout(function(){
                                        $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.read();
                                    },2500);
                                    HB_notification.showTip(data.info,'success');
                                }else{
                                    HB_notification.showTip(data.info,'error');
                                }
                        });
                    });
                },
                confirmSelectCallback: function (newList,resType) {
                    var resourceIds = [];
                    angular.forEach(newList,function(data){
                        resourceIds.push(data.id)
                    });
                    resAuthorizeManageService.addResourcesToResourceBag($stateParams.id,$scope.utils.getResCode(),
                        {resourceIds:resourceIds}).then(function(data){
                        if(data.status){
                            $timeout(function(){
                                $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.read();
                            },2500);

                            HB_notification.showTip(data.info,'success');
                        }else{
                            HB_notification.showTip(data.info,'error');
                        }
                    });
                },
                save:function(){
                    $scope.model.saving = true;
                    resAuthorizeManageService.updateResourceBag($stateParams.id, $scope.model.formData).then(function(data){
                        $scope.model.saving = false;
                        if(data.status){
                            HB_notification.showTip(data.info,'success');
                            init();
                            $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.read();
                        }else{
                            HB_notification.showTip(data.info,'error');
                        }
                    });
                }
            };

            $scope.utils = {
                validateIsNull: hbUtil.validateIsNull,
                isSelectAll: function () {
                    if (hbUtil.validateIsNull($scope.kendoPlus[$scope.model.currentType + 'GridInstance']) === true) {
                        return false;
                    }
                    var viewData = $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.view();
                    if (viewData.length === 0) {
                        return false;
                    }
                    var result = true;
                    angular.forEach(viewData, function (data) {
                        if (data.del !== true) {
                            result = false;
                            return;
                        }
                    });
                    return result;
                },
                getCategoryName: function (categoryList) {
                    if (hbUtil.validateIsNull(categoryList) === false && categoryList.length && categoryList.length > 0) {
                        var categoryName;
                        angular.forEach(categoryList, function (item, index) {
                            if (hbUtil.validateIsNull(categoryName) === true) {
                                categoryName = item.name;
                            } else {
                                categoryName += "," + item.name;
                            }
                        });
                        return categoryName;
                    } else {
                        return "-";
                    }
                },
                getResCode:function(){
                    var result="";
                    angular.forEach($scope.model.tabs,function(value,key){
                        if(value.code===$scope.model.currentType){
                            result = value.resCode;
                        }
                    });
                    return result;
                }
            };

            init();

            function init() {
                resAuthorizeManageService.findResourceBagDetailById($stateParams.id).then(function (data) {
                    if (data.status) {
                        $scope.model.formData = data.info;
                    } else {
                        HB_notification.showTip(data.info, 'error');
                    }
                });
            }

            //课程列表模板
            var courseTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input type="checkbox" ng-click="utils.validateIsNull(dataItem.del)?(dataItem.del=true):(dataItem.del=!dataItem.del)" ng-checked="dataItem.del" />');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: supplier #">#: supplier #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="b{{utils.getCategoryName(dataItem.categoryList)}}">b{{utils.getCategoryName(dataItem.categoryList)}}</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: timeLengthStr #">#: timeLengthStr #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: period #">#: period #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" ng-click="events.removeItem($event,dataItem)"  class="table-btn">移除</button>');
                result.push('</td>');

                result.push('</tr>');
                courseTemplate = result.join('');
            })();
            $scope.courseGird = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: courseTemplate,
                    url:'/web/admin/resourceBag/findAvailableCourseForResourceBag',
                    scope: $scope,
                    outSidePage:true,
                    param: $scope.model.courseQueryParam,
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: '<input class=\'chk\' ng-checked=\'utils.isSelectAll()\' ng-click=\'events.selectAll($event)\' type=\'checkbox\'/>',
                            filterable: false,
                            width: 40,
                            attributes: { // 用template的时候失效。
                                'class': 'tcenter'
                            }
                        },
                        {title: '课程名称', sortable: false},
                        {title: '课程供应商', sortable: false},
                        {title: '课程分类', sortable: false},
                        {title: '课程时长', sortable: false},
                        {title: '学时', sortable: false},
                        {title: '创建时间', sortable: false},
                        {
                            title: '操作', width: 80
                        }
                    ]
                })
            };
            //课程包列表模板
            var coursePoolTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input type="checkbox" ng-click="utils.validateIsNull(dataItem.del)?(dataItem.del=true):(dataItem.del=!dataItem.del)" ng-checked="dataItem.del" />');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: poolName?poolName:\'-\' #">#: poolName?poolName:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: courseCount?courseCount:\'-\' #">#: courseCount?courseCount:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: totalPeriod #">#: totalPeriod #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" ng-click="events.removeItem($event,dataItem)"  class="table-btn">移除</button>');
                result.push('</td>');

                result.push('</tr>');
                coursePoolTemplate = result.join('');
            })();
            $scope.coursePoolGird = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: coursePoolTemplate,
                    scope: $scope,
                    outSidePage:true,
                    param: $scope.model.coursePoolQueryParam,
                    url:'/web/admin/resourceBag/findAvailableCoursePoolForResourceBag',
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: '<input class=\'chk\' ng-checked=\'utils.isSelectAll()\' ng-click=\'events.selectAll($event)\' type=\'checkbox\'/>',
                            filterable: false,
                            width: 40,
                            attributes: { // 用template的时候失效。
                                'class': 'tcenter'
                            }
                        },
                        {title: '课程包名称', sortable: false},
                        {title: '课程数', sortable: false},
                        {title: '课程总学时', sortable: false},
                        {title: '创建时间', sortable: false},
                        {
                            title: '操作', width: 80
                        }
                    ]
                })
            };
            //题库列表模板
            var examLibraryTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input type="checkbox" ng-click="utils.validateIsNull(dataItem.del)?(dataItem.del=true):(dataItem.del=!dataItem.del)" ng-checked="dataItem.del" />');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" ng-click="events.removeItem($event,dataItem)"  class="table-btn">移除</button>');
                result.push('</td>');

                result.push('</tr>');
                examLibraryTemplate = result.join('');
            })();
            $scope.examLibraryGird = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: examLibraryTemplate,
                    scope: $scope,
                    outSidePage:true,
                    param: $scope.model.examLibraryQueryParam,
                    url:'/web/admin/resourceBag/findAvailableExamLibraryForResourceBag',
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: '<input class=\'chk\' ng-checked=\'utils.isSelectAll()\' ng-click=\'events.selectAll($event)\' type=\'checkbox\'/>',
                            filterable: false,
                            width: 40,
                            attributes: { // 用template的时候失效。
                                'class': 'tcenter'
                            }
                        },
                        {title: '题库名称', sortable: false},
                        {title: '试题数量', sortable: false},
                        {title: '上级题库', sortable: false},
                        {title: '创建时间', sortable: false},
                        {
                            title: '操作', width: 80
                        }
                    ]
                })
            };
            //试卷列表模板
            var examPaperTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input type="checkbox" ng-click="utils.validateIsNull(dataItem.del)?(dataItem.del=true):(dataItem.del=!dataItem.del)" ng-checked="dataItem.del" />');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #">#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: totalScore #">#: totalScore #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" ng-click="events.removeItem($event,dataItem)"  class="table-btn">移除</button>');
                result.push('</td>');

                result.push('</tr>');
                examPaperTemplate = result.join('');
            })();
            $scope.examPaperGird = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: examPaperTemplate,
                    scope: $scope,
                    outSidePage:true,
                    param: $scope.model.examPaperQueryParam,
                    url:'/web/admin/resourceBag/findAvailableExamPaperForResourceBag',
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: '<input class=\'chk\' ng-checked=\'utils.isSelectAll()\' ng-click=\'events.selectAll($event)\' type=\'checkbox\'/>',
                            filterable: false,
                            width: 40,
                            attributes: { // 用template的时候失效。
                                'class': 'tcenter'
                            }
                        },
                        {title: '试卷名称', sortable: false},
                        {title: '组卷方式', sortable: false},
                        {title: '试卷总分', sortable: false},
                        {title: '创建时间', sortable: false},
                        {
                            title: '操作', width: 80
                        }
                    ]
                })
            };

        }
    ];
});