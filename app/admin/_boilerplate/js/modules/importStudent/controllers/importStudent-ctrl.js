define(function () {
    'use strict';
    return ['$scope', '$q', 'importStudentService', 'KENDO_UI_GRID', 'HB_dialog', 'kendo.grid', '$state', 'TabService', '$stateParams',
        function ($scope, $q, importStudentService, KENDO_UI_GRID, HB_dialog, kendoGrid, $state, TabService, $stateParams) {
            var utils;
            $scope.model = {
                importUser: {
                    passWordType: 1,
                    test: false
                },
                upload: {}
            };

            $scope.node = {
                tree: null
            };
            $scope.events = { //导入
                showRegion: function () {
                    HB_dialog.contentAs($scope, {
                        title: '地区数据',
                        height: 500,
                        showCancel: false,
                        showCertain: false,
                        templateUrl: '@systemUrl@/views/importStudent/regionTreeDialog.html'
                    });

                },
                getArea: function (dataItem) {

                    $scope.model.chooseParams.regionType = dataItem.regionPath.split('/').length - 1;
                    $scope.model.chooseParams.areaName = dataItem.name;
                    $scope.model.chooseParams.regionId = dataItem.id;

                },

                importUser: function (e) {

                    if ($scope.model.upload == undefined || $scope.model.upload.result == undefined) {
                        $scope.globle.showTip('请先选择文件', 'warning');
                        return false;
                    }

                    if ($scope.model.importUser.passWordType == 3) {
                        if ($scope.model.importUser.password == undefined) {
                            $scope.globle.showTip('密码不能为空', 'warning');
                            return false;

                        } else {
                            if ($scope.model.importUser.password.length < 6 || $scope.model.importUser.password.length > 12) {
                                $scope.globle.showTip('密码必须在6-12位之间', 'warning');
                                return false;
                            }
                        }
                    }

                    importStudentService.importUser({
                        filePath: $scope.model.upload.result.newPath,
                        fileName: $scope.model.upload.result.fileName,
                        passWordType: $scope.model.importUser.passWordType,
                        password: $scope.model.importUser.password,
                        test: $scope.model.importUser.test
                    }).then(function (data) {
                        if (!data.status || !data.info) {
                            $scope.globle.showTip(data.info, 'error');
                        } else {
                            $scope.model.upload = {};
                            $scope.model.importUser.test = false;
                            HB_dialog.contentAs($scope, {
                                title: '提示',
                                width: 350,
                                height: 170,
                                confirmText: '查看任务进度',
                                cancelText: '确定',
                                sure: function (wow) {
                                    var defer = $q.defer(),
                                        promise = defer.promise;
                                    $state.go('states.importStudentTask', {
                                        groupType: 'asynchImportStudent'
                                    });
                                    defer.resolve();
                                    wow.close();
                                    return promise;
                                },
                                templateUrl: '@systemUrl@/views/importStudent/dialogFile.html'
                            });
                        }
                    });
                },
                toDownQuestionMode: function () {
                    importStudentService.downloadTemplate().then(function (data) {
                        if (data.status) {
                            $scope.model.downloadModelUrl = data.info.downModelIP;
                        } else {
                            $scope.globle.showTip('获取模板下载地址失败', 'error');
                        }
                    });
                    $scope.node.windows.downQuestionMode.open();
                }

            };

            var dataSource = new kendo.data.HierarchicalDataSource({

                transport: {
                    read: function (options) {

                        var id = options.data.id ? options.data.id : '340000',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/administratorManage/getAreaByParentId?parentId=' + id,
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
