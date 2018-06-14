define(function () {
    'use strict';
    return ['$scope', 'courseWareManagerService', '$state',
        function ($scope, courseWareManagerService, $state) {
            $scope.validateParams = {
                courseWareId: ''
            };
            $scope.aaa = true;
            $scope.model = {
                unitName: '',
                coursewareName: '',
                showAddCourseWare: true,
                showAddSuccess: false,
                courseWare: {isUsable: 'true'},
                coursewareList: [],
                providers: [],
                save: true,
                /*acceptType:'xls'*/
                hour: 0,
                minute: 0,
                second: 0
            };
            courseWareManagerService.findProvider().then(function (data) {
                if (data.status) {
                    $scope.model.unitName = data.info.unitName;
                    $scope.model.providers = data.info.lessonProviders;
                }
            });

            $scope.events = {
                /**
                 * 保存课件
                 * @param e
                 * @param menu
                 */
                saveCourseWare: function (e) {
                    if ($scope.courseWareValidate.$valid) {
                        var timeLength = Number(3600 * $scope.model.hour) + Number(60 * $scope.model.minute) + Number($scope.model.second);
                        $scope.model.courseWare.courseWareResourcePath = $scope.model.coursewareList[0].courseWareResourcePath;
                        $scope.model.courseWare.expandData = $scope.model.coursewareList[0].name;
                        $scope.model.courseWare.videoClarityList = $scope.model.coursewareList[0].videoClarityList;
                        $scope.model.save = false;
                        $scope.model.courseWare.timeLength = timeLength;
                        courseWareManagerService.createCourseWare($scope.model.courseWare).then(function (data) {
                            if (data.status) {
                                $scope.model.courseWare.name = '';
                                $scope.model.courseWare.isUsable = 'true';
                                $scope.model.showAddCourseWare = false;
                                $scope.model.showAddSuccess = true;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.save = true;
                        });
                    }

                },
                /**
                 * 返回管理界面
                 * @param e
                 */
                back: function (e) {
                    $state.go('states.courseWareManager', 'index').then(function () {
                        //$scope.node.courseWareGrid.pager.page(1);
                        $scope.node.myselfCourseWareGrid.pager.page(1);
                        $scope.node.allCourseWareGrid.pager.page(1);
                    });

                    e.preventDefault();
                },
                /**
                 * 继续添加课程
                 * @param e
                 */
                carryOnAddCourseWare: function (e) {

                    angular.forEach($scope.model.coursewareList, function (data, index) {
                        $scope.Hb_deleteFile(data, true);
                    });
                    $scope.model.showAddCourseWare = true;
                    $scope.model.showAddSuccess = false;
                    $scope.courseWareValidate.$setPristine();
                    $scope.model.courseWare = {isUsable: 'true', supplierId: '1'};
                    $scope.model.coursewareList.length = 0;
                    e.preventDefault();
                },
                /**
                 * 返回资源管理页面
                 * @param e
                 */
                goCourseWareManager: function (e) {
                    e.preventDefault();
                    $state.go('states.courseWareManager').then(function () {
                        $scope.node.courseWareGrid.pager.page(1);
                    });
                },
                openTypeTree: function () {
                    $scope.TypeShow = !$scope.TypeShow;
                },
                /**
                 *
                 * @param e
                 */
                cancel: function (e) {
                    e.preventDefault();
                    $scope.globle.confirm('提示', '是否放弃编辑', function () {
                        $state.go('states.courseWareManager').then(function () {
                            $scope.node.courseWareGrid.pager.page(1);
                        });
                    });
                },
                /**
                 * 获取课程分类ID
                 * @param dataItem
                 */
                getTypeInfo: function (dataItem) {
                    courseWareManagerService.hasChild(dataItem.id).then(function (data) {
                        if (!data.info) {
                            $scope.model.courseWare.typeName = dataItem.name;
                            $scope.model.courseWare.cwyId = dataItem.id;
                            $scope.TypeShow = false;
                        }
                    });
                },
                /**
                 * 播放
                 */
                play: function (subCourseOutline) {
                    if ($scope.model.course.status == 1) {
                        //window.open('www.baidu.com');
                        //hbBasicData.openStateInWindow ( 'lesson/play', item.id + '/1/-1' );
                    } else {

                        $scope.globle.showTip('该课程不能播放', 'error');
                    }
                }


            };
            //课程分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '0',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseWareCategoryAction/findByQuery?categoryId=' + id,
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

        }];
});
