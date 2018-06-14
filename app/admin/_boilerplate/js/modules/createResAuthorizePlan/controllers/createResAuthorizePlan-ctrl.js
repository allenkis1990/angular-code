/**
 * Created by linj on 2018/6/4 19:13.
 */
define(function (createResAuthorizePlan) {
    'use strict';
    return ['$scope', 'hbUtil', '$timeout', 'HB_notification','createResAuthorizePlanService','TabService','$state',
        function ($scope, hbUtil, $timeout, HB_notification,createResAuthorizePlanService,TabService,$state) {
        $scope.validateParams = {};
        $scope.model = {
            tabs: {
                course: {name: "请选择课程资源", code: "course"},
                coursePool: {name: "请选择课程包资源", code: "coursePool"},
                examLibrary: {name: "请选择题库资源", code: "examLibrary"},
                examPaper: {name: "请选择试卷资源", code: "examPaper"}
            },
            resourceBag:{
                name:""
            },
            savedData:{
                id:""
            },
            courseList: [],
            coursePoolList: [],
            examLibraryList: [],
            examPaperList: []

        };
        $scope.model.currentType = $scope.model.tabs.course.code;

        $scope.kendoPlus = {};
        $scope.events = {
            goAuthorize : function (e) {
                createResAuthorizePlanService.findResourceBagDetailById($scope.model.savedData.id).then(function (data) {
                    if (data.status) {
                        var array = [];
                        array.push(data.info);
                        $state.go('states.resAuthorizeManage.authorize',{selectSchemeArray : JSON.stringify(array)});
                    } else {
                        HB_notification.showTip(data.info, 'error');
                    }
                });

            },
            selectAll: function (e) {
                var viewData = $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.view();
                angular.forEach(viewData, function (data) {
                    data.del = e.currentTarget.checked;
                });
            },
            removeAll: function (e) {
                HB_notification.confirm('确定移除这些资源吗？', function (dialog) {
                    var data;
                    var dataList = $scope.model[$scope.model.currentType + 'List'];
                    for (var i = 0; i < dataList.length;) {
                        data = dataList[i];
                        if (data.del && data.del === true) {
                            dataList.splice(i, 1);
                        } else {
                            i++
                        }
                    }
                    $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.read();
                    $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].pager.page(1);
                });
            },
            removeItem: function (e, dataItem) {
                HB_notification.confirm('确定移除该资源吗？', function (dialog) {
                    var data;
                    var dataList = $scope.model[$scope.model.currentType + 'List'];
                    for (var i = 0; i < dataList.length;) {
                        data = dataList[i];
                        if (dataItem.id === data.id) {
                            dataList.splice(i, 1);
                        } else {
                            i++
                        }
                    }
                    $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.read();
                });
            },
            view:function(e,dataItem){
                if($scope.model.currentType===$scope.model.tabs.course.code){
                    TabService.appendNewTab('课程管理','states.courseManager.view', {courseId: dataItem.id },'states.courseManager',true);
                }else if($scope.model.currentType===$scope.model.tabs.coursePool.code){
                    TabService.appendNewTab('课程包管理','states.coursePackageManager.view', {packageId: dataItem.id },'states.coursePackageManager',true);
                }else if($scope.model.currentType===$scope.model.tabs.examLibrary.code){

                }else if($scope.model.currentType===$scope.model.tabs.examPaper.code){

                }

            },
            confirmSelectCallback: function (newList) {
                $scope.kendoPlus[$scope.model.currentType + 'GridInstance'].dataSource.read();
                return true;
            },
            save: function (){

                if($scope.model.courseList.length===0&&$scope.model.coursePoolList.length===0&&
                    $scope.model.examLibraryList.length===0&&$scope.model.examPaperList.length===0){
                    HB_notification.showTip("方案必须至少一个资源", 'warning');
                    return;
                }
                var postData ={
                    name:$scope.model.resourceBag.name,
                    courseResourceIds:[],
                    coursePoolResourceIds:[],
                    examLibraryResourceIds:[],
                    examPaperResourceIds:[]

                };
                angular.forEach($scope.model.courseList,function(data){
                    postData.courseResourceIds.push(data.id)
                });
                angular.forEach($scope.model.coursePoolList,function(data){
                    postData.coursePoolResourceIds.push(data.id)
                });
                angular.forEach($scope.model.examLibraryList,function(data){
                    postData.examLibraryResourceIds.push(data.id)
                });
                angular.forEach($scope.model.examPaperList,function(data){
                    postData.examPaperResourceIds.push(data.id)
                });
                $scope.model.saving = true;
                createResAuthorizePlanService.createResourceBag(postData).then(function(data){
                    $scope.model.saving = false;
                    if (data.status) {
                        $scope.model.resourceBag={
                            name:""
                        };
                        $scope.model.savedData.id = data.info;
                        $scope.model.courseList.length=0;
                        $scope.model.coursePoolList.length=0;
                        $scope.model.examLibraryList.length=0;
                        $scope.model.examPaperList.length=0;
                        $scope.model.saved = true;
                    } else {
                        HB_notification.showTip(data.info, 'error');
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
        };
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
            result.push('<button type="button" ng-click="events.view($event,dataItem)"  class="table-btn">详情</button>');
            result.push('<button type="button" ng-click="events.removeItem($event,dataItem)"  class="table-btn">移除</button>');
            result.push('</td>');

            result.push('</tr>');
            courseTemplate = result.join('');
        })();
        $scope.courseGird = {
            options: hbUtil.kdGridCommonOptionDIY({
                template: courseTemplate,
                scope: $scope,
                data: $scope.model.courseList,
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
            result.push('<span title="#: totalPeriod?totalPeriod:\'-\' #">#: totalPeriod?totalPeriod:\'-\' #</span>');
            result.push('</td>');

            result.push('<td>');
            result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
            result.push('</td>');

            result.push('<td>');
            result.push('<button type="button" course-pool-detail pool-id="dataItem.id" class="table-btn"></button>');
            result.push('<button type="button" ng-click="events.removeItem($event,dataItem)"  class="table-btn">移除</button>');
            result.push('</td>');

            result.push('</tr>');
            coursePoolTemplate = result.join('');
        })();
        $scope.coursePoolGird = {
            options: hbUtil.kdGridCommonOptionDIY({
                template: coursePoolTemplate,
                scope: $scope,
                data: $scope.model.coursePoolList,
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
                data: $scope.model.examLibraryList,
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
            result.push('<span title="#: totalScore?totalScore:\'-\' #">#: totalScore?totalScore:\'-\' #</span>');
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
                data: $scope.model.examPaperList,
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
    }];
});