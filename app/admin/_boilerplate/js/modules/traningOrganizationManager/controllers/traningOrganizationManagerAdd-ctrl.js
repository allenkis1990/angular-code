define(function () {
    'use strict';
    return ['$scope', 'TabService', 'traningOrganizationManagerService', '$state', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'KENDO_UI_EDITOR', 'hbUtil',
        function ($scope, TabService,  traningOrganizationManagerService, $state, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, KENDO_UI_EDITOR, hbUtil) {
            $scope.model = {
                regionShow:false,
                domain:'',
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                createParam: {
                    name: '',
                    code: '',
                    region:null,
                    loginInput:'',
                    password:'',
                    domain:'',
                    platformName:''
                },
                showRegionName:'',
                showAddLesson: true,
                showAddSection: false,
                showLessonSuccess: false,
                currentDomain:'',
                save: true,
                rolesString: ''
            };
            var localDB = {
                selectedIdArray: []
            };

            $scope.node = {grid: null};

            $scope.events = {
                findCurrentDomain:function(){
                    traningOrganizationManagerService.findCurrentDomain().then(function(data){
                        $scope.model.currentDomain=data.info;

                    })
                },

                /**
                 * 返回管理员界面
                 * @param e
                 */
                goTraningOrganizationManager: function (e) {
                    e.preventDefault();
                    $state.go('states.traningOrganizationManager');
                },

                /**
                 * 添加用户并返回
                 * @param e
                 * @param menu
                 */
                saveTraningOrganization: function (e) {
                    if ($scope.traningOrganizationValidate.$valid) {
                        $scope.model.createParam.domain=$scope.model.currentDomain+"/"+$scope.model.domain;
                        traningOrganizationManagerService.createTraningOrganization($scope.model.createParam).then(function (data) {
                            if (data.info) {
                               /* $scope.model.createParam.administratorId = data.info.administratorId;*/

                                $state.go('states.traningOrganizationManager').then(function () {
                                    /*$state.reload($state.current);*/
                                });
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                        });
                    }
                    e.preventDefault();

                },
                cancel:function(e){
                    e.preventDefault();
                    $scope.globle.confirm('提示', '是否放弃编辑', function () {
                        $state.go('states.traningOrganizationManager').then(function () {
                          /*  $scope.node.courseWareGrid.pager.page(1);*/
                        });
                    });
                },
                openRegionTree: function () {
                    $scope.model.regionShow = !$scope.model.regionShow;
                },


                getRegionInfo: function (dataItem) {
                    traningOrganizationManagerService.findRegionByParentId(dataItem.id).then(function (data) {
                        if (data.info.length==0) {
                            $scope.model.createParam.region=dataItem.id;
                            $scope.model.showRegionName=dataItem.name;
                            $scope.model.regionShow = false;
                        }
                    });
                }

            };
            //课程分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '340000',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/trainingOrganizationManager/findRegionByParentId?id=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
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
            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                }
            };

            $scope.events.findCurrentDomain();
        }];
});
