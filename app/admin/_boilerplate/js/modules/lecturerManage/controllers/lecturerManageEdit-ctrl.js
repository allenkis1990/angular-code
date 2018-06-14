define(function () {
    'use strict';
    return ['$scope', 'lecturerManageService', '$stateParams', '$state', 'TabService', 'KENDO_UI_EDITOR',
        function ($scope, lecturerManageService, $stateParams, $state, TabService, KENDO_UI_EDITOR) {

            $scope.model = {
                userMessage: {
                    provinceId: null,
                    cityId: null,
                    countyId: null
                },
                roleMessage: [],
                roleSelectIds: [],
                allRoleList: [],
                selectedRoleList: [],
                save: true
            };

            //监控图片是否上传
            $scope.$watch('model.uploader',function(newVal){
                if(newVal){
                    var a=angular.fromJson(newVal);
                    $scope.model.userMessage.displayPhotoUrl= a.convertResult[0].url;
                    $scope.model.imgSrc='/mfs' + a.convertResult[0].url;
                }
            });

            $scope.events = {
                /**
                 * 删除选中的封面图片
                 * @param e
                 */
                deletePhotoUrl:function(e){
                    e.stopPropagation();
                    $scope.model.userMessage.displayPhotoUrl= "";
                    $scope.model.imgSrc="@systemUrl@/images/photo.jpg";
                },

                /**
                 * 保存
                 * @param e
                 */
                editAdministrator: function (e) {

                    /*if ($scope.model.roleSelectIds.length < 1) {
                        $scope.globle.alert('提示', '至少必须选择一个角色');
                    } else {*/
                        if ($scope.administratorValidate.$valid) {
                            $scope.model.save = false;
                            $scope.model.userMessage.administratorId = $scope.model.userMessage.userId;
                            /*$scope.model.userMessage.roleList = $scope.model.roleSelectIds;*/
                            lecturerManageService.createAdministrator($scope.model.userMessage).then(function (data) {
                                if (data.status) {
                                    //  $scope.model.createParam.administratorId = data.info.administratorId;
                                    $scope.model.save = true;
                                    $scope.globle.showTip('保存成功', 'success');
                                    $state.go('states.lecturerManage').then(function () {
                                        $state.reload($state.current);
                                    });
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.save = true;
                            });
                        }
                    /*}*/
                    e.preventDefault();
                },

                /**
                 *取消
                 * @param e
                 */
                cancel: function (e) {
                    e.preventDefault();
                    $scope.globle.confirm('提示', '是否放弃编辑账号基础信息', function () {
                        $state.go('states.lecturerManage').then(function () {
                            $state.reload($state.current);
                        });
                    });
                },

                /**
                 * 打开添加角色窗口
                 * @param e
                 */
                showRoleWindow: function (e) {
                    $scope.model.selectedRoleList = [];
                    $scope.node.windows.addWindow.center().open();
                    e.preventDefault();
                    findAllRole();
                },

                /**
                 * 取消弹出框
                 * @param e
                 */
                cancelWindow: function (e) {
                    e.preventDefault();
                    $scope.node.windows.addWindow.close();
                    $scope.model.selectedRoleList = [];

                },

                /**
                 * 返回管理员界面
                 * @param e
                 */
                goAdministratorManage: function (e) {
                    e.preventDefault();
                    $state.go('states.lecturerManage');
                },

                /**
                 *显示选择/取消选择button
                 * @param dataItem
                 * @param flag true/选择 false/取消选择
                 * @returns {boolean}
                 */
                checked: function (roleId, flag) {
                    if (flag) {//选择
                        if ($scope.model.selectedRoleList.indexOf(roleId) == -1) {//不包含
                            return true;
                        } else {
                            return false;
                        }
                    } else {//取消选择
                        if ($scope.model.selectedRoleList.indexOf(roleId) == -1) {
                            return false;
                        } else {
                            return true;
                        }
                    }

                },

                /**
                 *选择
                 */
                checkQuestlibrary: function (roleId) {
                    if ($scope.model.selectedRoleList.indexOf(roleId) == -1) {
                        $scope.model.selectedRoleList.push(roleId);
                    }
                },

                /**
                 * 取消选择
                 */
                cancleCheckQuestlibrary: function (roleId) {
                    if ($scope.model.selectedRoleList.indexOf(roleId) > -1) {

                        var indexFlag = 0;
                        for (var i = 0; i < $scope.model.selectedRoleList.length; i++) {
                            if ($scope.model.selectedRoleList[i] == roleId) {
                                indexFlag = i;
                                break;
                            }
                        }
                        $scope.model.selectedRoleList.splice(indexFlag, 1);
                    }
                },

                /**
                 * 确定选择角色
                 */
                confirmSelectRoleList: function (e) {
                    lecturerManageService.getRoleListByRoleIds($scope.model.selectedRoleList).then(function (reponse) {
                        if (reponse.status) {
                            $scope.node.windows.addWindow.close();
                            for (var i = 0; i < reponse.info.length; i++) {
                                var index = _.indexOf($scope.model.roleSelectIds, reponse.info[i].roleId);
                                if (index == -1) {
                                    $scope.model.roleSelectIds.push(reponse.info[i].roleId);
                                    $scope.model.roleMessage.push(reponse.info[i]);
                                }
                            }
                        } else {
                            $scope.globle.showTip(response.info, 'error');
                        }
                    });
                },

                /**
                 * 删除角色
                 * @param e
                 */
                remove: function (roleId) {
                    var index = _.indexOf($scope.model.roleSelectIds, roleId);
                    if (index !== -1) {
                        $scope.model.roleSelectIds.splice(index, 1);

                        angular.forEach($scope.model.roleMessage, function (data, index) {
                            if (data.roleId == roleId) {
                                $scope.model.roleMessage.splice(index, 1);
                            }
                        });
                    }
                },

                findUserRoleList: function () {
                    lecturerManageService.findUserRoleList($stateParams.administratorId).then(function (data) {
                        if (data.status) {
                            $scope.model.roleMessage = data.info;
                            for (var i = 0; i < $scope.model.roleMessage.length; i++) {
                                $scope.model.roleSelectIds.push($scope.model.roleMessage[i].roleId);
                            }
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
                },

                /**
                 * 查看角色
                 * @param e
                 */
                viewRole: function (roleId) {
                    TabService.appendNewTab('角色管理', 'states.roleManage.view', {
                        roleId: roleId,
                        type: 2
                    }, 'states.roleManage', true);
                },

                openLessonTypeTree: function () {
                    $scope.areaShow = !$scope.areaShow;
                },
                /**
                 * 获取单位
                 * @param dataItem
                 */
                getArea: function (dataItem) {
                    $scope.model.userMessage.unitName = dataItem.name;
                    $scope.model.userMessage.unitId = dataItem.unitId;

                    //地区
                    $scope.model.userMessage.provinceId = dataItem.provinceId;
                    $scope.model.userMessage.cityId = dataItem.cityId;
                    $scope.model.userMessage.countyId = dataItem.countyId;

                    $scope.areaShow = false;
                }

            };

            //地区树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.unitId ? options.data.unitId : '',
                            myModel = dataSource.get(options.data.unitId);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/lecturerManage/getUnitByParentId?parentId=' + id,
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
                        id: 'unitId',
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
                },
                windows: {
                    addWindow: {//添加窗口
                        modal: true,
                        content: '@systemUrl@/views/lecturerManage/addRoleDialog.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                },
                editor: KENDO_UI_EDITOR
            };

            function findAdministratorMessage () {
                lecturerManageService.getUserDetailInfoByUserId($stateParams.administratorId).then(function (data) {
                    if (data.status) {
                        $scope.model.userMessage = data.info;
                        $scope.model.userMessage.displayPhotoUrl = data.info.displayPhotoUrl;
                        $scope.model.imgSrc = data.info.displayPhotoUrl?'/mfs'+data.info.displayPhotoUrl:"@systemUrl@/images/photo.jpg";
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }

                });
            }

            function findAllRole () {
                lecturerManageService.findAllRole().then(function (data) {
                    if (data.status) {
                        $scope.model.allRoleList = data.info;
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }
                });
            }

            function init () {
                findAdministratorMessage();
                /*$scope.events.findUserRoleList();*/
            }

            init();

        }];
});
