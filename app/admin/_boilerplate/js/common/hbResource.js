//sku模块
define(['angular'], function (angular) {
    'use strict';

    var hbResourceCommon = angular.module('hbResourceCommon', []);

    hbResourceCommon.factory('hbResourceDialogService', ['Restangular',function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commonQuery');
        });
        return {
            getCurrentUserUnit:function(param){
                return base.one('getCurrentUserUnit').get(param);
            }
        };
    }]);


    hbResourceCommon.directive('coursePoolDetail',['hbUtil', 'easyKendoDialog','TabService',
        function(hbUtil,easyKendoDialog,TabService){
        return {
            replace: true,
            scope:{
                defaultTxt: "@",
                poolId:'='
            },
            templateUrl: '@systemUrl@/templates/common/resourceDialog/view-detail-link.html',
            link: function($scope){
                $scope.model = {
                    defaultTxt:$scope.defaultTxt||'详情',
                    queryParam:{
                        poolId:$scope.poolId
                    }

                };
                $scope.events = {
                    view: function (e,dataItem) {
                        $scope.coursePoolWindow = easyKendoDialog.content({
                            templateUrl: '@systemUrl@/templates/common/resourceDialog/course-pool-detail-dialog.html',
                            width: 1000,
                            title: false
                        }, $scope);
                    },
                    closeKendoWindow: function (windowName) {
                        if ($scope[windowName]) {
                            $scope[windowName].kendoDialog.close();
                        }
                    },
                    goDetail:function(e,dataItem){
                        window.open('/admin/'+require.unitPath+'/courseManager/view/' + dataItem.courseId);
                    }
                };

                $scope.utils = {

                };

                var template = '';
                (function () {
                    var result = [];
                    result.push('<tr>');
                    result.push('<td>');
                    result.push('<div title="#: courseName?courseName:\'-\' #">');
                    result.push('#: courseName?courseName:\'-\' #');
                    result.push('</div>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<div  title="#: supplier?supplier:\'-\' #">');
                    result.push('#: supplier?supplier:\'-\' #');
                    result.push('</div>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<div  title="#: categoryName?categoryName:\'-\' #">');
                    result.push('#: categoryName?categoryName:\'-\' #');
                    result.push('</div>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: timeLengthStr #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: coursePeriod*1.0/10 #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: courseCreateTime #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.goDetail($event,dataItem)">详情</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    template = result.join('');
                })();
                $scope.gird = {
                    options: hbUtil.kdGridCommonOptionDIY({
                        template: template,
                        url: '/web/admin/coursePoolAction/findCourseInPoolPage',
                        outSidePage: true,
                        scope: $scope,
                        page: 'page',
                        param: $scope.model.queryParam,
                        fn: function (response) {
                            console.log(response);
                            $scope.configedArr = response.info;
                        },
                        columns: [
                            {sortable: false, title: '课程名称'},
                            {sortable: false, title: '课程供应商', width: 120},
                            {sortable: false, title: '课程分类', width: 120},
                            {sortable: false, title: '课程时长', width: 100},
                            {sortable: false, title: '学时', width: 80},
                            {sortable: false, title: '创建时间', width: 140},
                            {sortable: false, title: '操作', width: 80}
                        ]
                    })
                };

            }
        }
    }]);

    hbResourceCommon.directive('courseCategoryPopTree',['hbUtil', 'easyKendoDialog','TabService',
        function(hbUtil,easyKendoDialog,TabService){
            return {
                scope:{
                    defaultTxt: "@",
                    dataTextField:"@",
                    url:"@",
                    rootIdName:"@",
                    rootId:"@",
                    rootParamName:"@",
                    categoryId:'='
                },
                templateUrl: '@systemUrl@/templates/common/resourceDialog/pop-tree.html',
                link: function($scope){
                    $scope.model = {
                        defaultTxt:$scope.defaultTxt||'请选择分类',
                        queryParam:{
                            poolId:$scope.poolId
                        },
                        categoryId:$scope.rootId||null,
                        rootIdName:$scope.rootIdName||'index_pop_input',
                        name:null
                    };
                    $scope.events = {
                        showCategory: function (e,name) {
                            $scope.node[name].open();
                        },
                        clearModel: function(){
                            $scope.categoryId = null;
                            $scope.model.name = null;
                            $scope.model.categoryId= null;
                            $scope.node.trees.dataSource.read();
                        }
                    };

                    $scope.utils = {
                        validateIsNull:hbUtil.validateIsNull
                    };

                    $scope.node={};

                    $scope.popup = {
                        options:{
                            anchor: '#'+$scope.model.rootIdName
                        }
                    };

                    $scope.treeView = {
                        options:{
                            dataSource: {
                                transport: {
                                    read: {
                                        url: $scope.url,
                                        data: function () {
                                            // var b = {}, c = $scope.model.categoryId;
                                            // for (var d in c) c.hasOwnProperty(d) && c[d] && (b[d] = c[d]);
                                            var param = {};
                                            param[$scope.rootParamName||"categoryId"]=$scope.model.categoryId
                                            return param;
                                        },
                                        dataType: 'json'
                                    },
                                    destroy: function () {
                                    }
                                },
                                schema: {
                                    model: {
                                        id: 'id',
                                        hasChildren: 'hasChildren',
                                        uid: 'id'
                                    },
                                    data: function (data) {
                                        return data.info;
                                    }
                                }
                            },
                            messages: {
                                loading: '正在加载分类...',
                                requestFailed: '分类加载失败!.'
                            },
                            dataTextField: $scope.dataTextField||'name',
                            select: function (e) {
                                var node = $scope.node.trees.dataItem(e.node);
                                if (node.parentId == 0) {
                                    return;
                                } else {
                                    $scope.categoryId=node.id;
                                    $scope.model.name = node.name;
                                }
                                $scope.$apply();
                                $scope.node.popUp.close();
                                // 刷新组织机构树
                                // $scope.node.indexCourseTree.dataSource.read();
                            },
                            expand: function (e) {
                                //console.log('expand tree node...');
                                var node = $scope.node.trees.dataItem(e.node);
                                $scope.model.categoryId = node.id;
                                $scope.$apply();
                                // 刷新组织机构树
                                //$scope.node.indexCourseTree.dataSource.read();
                            }
                        }
                    };

                }
            }
        }]);


});
