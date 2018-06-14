/**
 * Created by linj on 2018/6/7 10:40.
 */
define([], function () {
    return {
        chooseResDialog: ['hbUtil', 'easyKendoDialog', '$http','$timeout', function (hbUtil, easyKendoDialog, $http,$timeout) {
            return {
                replace: true,
                scope: {
                    resType:"@",
                    resList: "=?",
                    excludeResBag:"@",
                    defaultTxt: "@",
                    confirmSelectCallback:"&"
                },
                templateUrl: '@systemUrl@/views/createResAuthorizePlan/directive/choose-res-button.html',
                link: function ($scope) {
                    $scope.model = {
                        page: {},
                        defaultTxt: $scope.defaultTxt || "选择资源",
                        queryParam: {
                            excludeResIdListStr:"",
                            excludeResourceBagId:$scope.excludeResBag
                        },
                        tempList: []
                    }
                    if(hbUtil.validateIsNull($scope.resList)===true){
                        $scope.resList=[];
                    }
                    $scope.$watch('resList.length',function(newVal){
                        $scope.model.queryParam.excludeResIdListStr = "";
                        var index = 0;
                        angular.forEach($scope.resList,function(data,index){
                            if(index++>0){
                                $scope.model.queryParam.excludeResIdListStr+=","+data.id
                            }else{
                                $scope.model.queryParam.excludeResIdListStr+=data.id
                            }
                        });
                        console.log($scope.resList);
                    });
                    $scope.events = {
                        openDialog: function () {
                            $scope.selectResWindow = easyKendoDialog.content({
                                templateUrl: '@systemUrl@/views/createResAuthorizePlan/directive/choose-resource-dialog.html',
                                width: 1000,
                                title: false
                            }, $scope);
                        },
                        MainPageQueryList: function (e) {
                            e.stopPropagation();
                            $scope.selectResWindow.kendoPlus.gridInstance.pager.page(1);
                        },
                        confirmSelect: function(){
                            angular.forEach($scope.model.tempList, function (item, index) {
                                $scope.resList.push(item);
                            });
                            if(hbUtil.validateIsNull($scope.confirmSelectCallback)===false){
                                var result = $scope.confirmSelectCallback({"newList":$scope.model.tempList,"resType":$scope.resType});
                                $timeout(function(){
                                    $scope.model.tempList.length=0;
                                })
                                if(result !== true){
                                    $scope.resList.length=0;
                                }
                            }
                            $scope.events.closeKendoWindow("selectResWindow");
                        },
                        cancelSelect: function(){
                            $scope.model.tempList.length=0;
                            $scope.events.closeKendoWindow("selectResWindow");
                        },
                        closeKendoWindow: function (windowName) {
                            if ($scope[windowName]) {
                                $scope[windowName].kendoDialog.close();
                            }
                        },
                        selectItem: function (e, dataItem) {
                            $scope.model.tempList.push(dataItem);
                        },
                        unSelectItem: function (e, dataItem) {
                            var location = null;
                            angular.forEach($scope.model.tempList, function (item, index) {
                                if (item.id === dataItem.id) {
                                    location = index;
                                    return;
                                }
                            });
                            if(hbUtil.validateIsNull(location)===false){
                                $scope.model.tempList.splice(location,1);
                            }

                        },
                        openListenWindow: function (a, b, c) {
                            //TabService.appendNewTab('视频播放', 'states.player.coursePlayer', {courseId:a,courseWareId: b,playType:c}, 'states.player', false);
                            window.open('/play/#/previewLesson/trainClassId/' + a + '/courseware/xxx', '_blank');
                            //console.log('/play/#/listen/trainClassId/'+a+'/courseware', '_blank');
                        },
                    };

                    $scope.utils = {
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
                        hasChoose: function (e, dataItem) {
                            if (hbUtil.validateIsNull(dataItem) === true || hbUtil.validateIsNull(dataItem.id) === true) {
                                return false;
                            }
                            var hasChoose = false;
                            if (hbUtil.validateIsNull($scope.model.tempList) === false) {
                                angular.forEach($scope.model.tempList, function (item, index) {
                                    if (item.id === dataItem.id) {
                                        hasChoose = true;
                                        return;
                                    }
                                });
                            }
                            return hasChoose;
                        }
                    }

                    //课程包列表模板
                    var template = '';
                    var columns;
                    var url;
                    if($scope.resType==='coursePool'){
                        (function () {
                            var result = [];
                            result.push('<tr>');

                            result.push('<td>');
                            result.push('#: index #');
                            result.push('</td>');

                            result.push('<td>');
                            result.push('<span title="#: poolName?poolName:\'-\' #">#: poolName?poolName:\'-\' #</span>');
                            result.push('</td>');

                            result.push('<td>');
                            result.push('<span title="#: courseCount #">#: courseCount #</span>');
                            result.push('</td>');

                            result.push('<td>');
                            result.push('<span title="#: totalPeriod #">#: totalPeriod #</span>');
                            result.push('</td>');

                            result.push('<td>');
                            result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                            result.push('</td>');

                            result.push('<td>');
                            result.push('<button  course-pool-detail pool-id="dataItem.id" type="button"  class="table-btn">详情</button>');
                            result.push('<button type="button" ng-show="utils.hasChoose($event,dataItem)===true" ng-click="events.unSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                            result.push('<button type="button" ng-show="utils.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)" class="table-btn">选择</button>');
                            result.push('</td>');

                            result.push('</tr>');
                            template = result.join('');
                        })();
                        columns = [
                            {title: 'No.', width: 80, sortable: false},
                            {title: '课程包名称', sortable: false},
                            {title: '课程数', sortable: false},
                            {title: '课程总学时', sortable: false},
                            {title: '创建时间', sortable: false},
                            {
                                title: '操作', width: 160
                            }
                        ];
                        url = '/web/admin/resourceBag/findAvailableCoursePoolForResourceBag';
                    }else if($scope.resType==='examLibrary'){
                        (function () {
                            var result = [];
                            result.push('<tr>');

                            result.push('<td>');
                            result.push('#: index #');
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
                            result.push('<button type="button" ng-show="utils.hasChoose($event,dataItem)===true" ng-click="events.unSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                            result.push('<button type="button" ng-show="utils.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)" class="table-btn">选择</button>');
                            result.push('</td>');

                            result.push('</tr>');
                            template = result.join('');
                        })();
                        columns = [
                            {title: 'No.', width: 80, sortable: false},
                            {title: '题库名称', sortable: false},
                            {title: '试题数量', sortable: false},
                            {title: '上级题库', sortable: false},
                            {title: '创建时间', sortable: false},
                            {
                                title: '操作', width: 180
                            }
                        ];
                        url = '/web/admin/resourceBag/findAvailableExamLibraryForResourceBag';
                    }else if($scope.resType==='examPaper'){
                        (function () {
                            var result = [];
                            result.push('<tr>');

                            result.push('<td>');
                            result.push('#: index #');
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
                            result.push('<button type="button" ng-show="utils.hasChoose($event,dataItem)===true" ng-click="events.unSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                            result.push('<button type="button" ng-show="utils.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)" class="table-btn">选择</button>');
                            result.push('</td>');

                            result.push('</tr>');
                            template = result.join('');
                        })();
                        columns = [
                            {title: 'No.', width: 80, sortable: false},
                            {title: '试卷名称', sortable: false},
                            {title: '组卷方式', sortable: false},
                            {title: '试卷总分', sortable: false},
                            {title: '创建时间', sortable: false},
                            {
                                title: '操作', width: 180
                            }
                        ];
                        url = '/web/admin/resourceBag/findAvailableExamPaperForResourceBag';
                    }else{
                        //默认查询课程
                        (function () {
                            var result = [];
                            result.push('<tr>');

                            result.push('<td>');
                            result.push('#: index #');
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
                            result.push('<button type="button" ng-click="events.openListenWindow(\'#: id #\')"  class="table-btn">试听</button>');
                            result.push('<button type="button" ng-show="utils.hasChoose($event,dataItem)===true" ng-click="events.unSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                            result.push('<button type="button" ng-show="utils.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)" class="table-btn">选择</button>');
                            result.push('</td>');

                            result.push('</tr>');
                            template = result.join('');
                        })();
                        columns = [
                            {title: 'No.', width: 80, sortable: false},
                            {title: '课程名称', sortable: false},
                            {title: '课程供应商', sortable: false},
                            {title: '课程分类', sortable: false},
                            {title: '课程时长', sortable: false},
                            {title: '学时', sortable: false},
                            {title: '创建时间', sortable: false},
                            {
                                title: '操作', width: 160
                            }
                        ];
                        url = '/web/admin/resourceBag/findAvailableCourseForResourceBag';
                    }


                    $scope.gird = {
                        options: hbUtil.kdGridCommonOptionDIY({
                            template: template,
                            url: url,
                            outSidePage: true,
                            scope: $scope,
                            page: 'page',
                            param: $scope.model.queryParam,
                            fn: function (response) {
                                console.log(response);
                                $scope.configedArr = response.info;
                            },
                            columns: columns
                        })
                    };
                }
            }
        }],
    }
});