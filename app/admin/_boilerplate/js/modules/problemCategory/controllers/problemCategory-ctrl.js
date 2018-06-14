define(function (problemCategory) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'problemCategoryService', 'HB_dialog', '$timeout', 'HB_notification',
            function ($scope, problemCategoryService, HB_dialog, $timeout, HB_notification) {

                $scope.node = {};

                $scope.model = {
                    categoryName: '',
                    parentId: '-1',
                    noData: true,
                    updateCategoryName: ''
                };

                $scope.events = {
                    //新增分类
                    creatCategory: function () {

                        if (validateIsNull($scope.model.categoryName)) {
                            HB_dialog.warning('提示', '请填写类别名称');
                            return false;
                        }

                        $scope.submitAble = true;
                        problemCategoryService.existName({
                            name: $scope.model.categoryName
                        }).then(function (data) {
                            $scope.submitAble = false;
                            if (data.status) {
                                if (data.info) {
                                    HB_dialog.warning('提示', '类别名称已存在');
                                    return false;
                                } else {
                                    $scope.submitAble = true;
                                    problemCategoryService.addProblemCategory(
                                        {
                                            parentId: $scope.model.parentId,
                                            name: $scope.model.categoryName
                                        }
                                    ).then(function (subData) {
                                        $scope.submitAble = false;
                                        if (subData.status) {
                                            HB_dialog.success('提示', subData.info);
                                            $timeout(function () {
                                                $scope.node.libraryTree.dataSource.read();
                                            }, 500);
                                            $scope.model.categoryName = '';
                                        }
                                    });

                                }
                            }
                        });

                    },

                    deleteProblemCategory: function (item) {
                        HB_notification.confirm('确认删除该分类吗', function (dialog) {
                            return problemCategoryService.deleteProblemCategory({
                                id: item.id,
                                name: item.name,
                                parentId: item.parentId
                            }).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    HB_dialog.success('提示', data.info);
                                    $timeout(function () {
                                        $scope.node.libraryTree.dataSource.read();
                                    }, 500);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        });
                    },

                    openUpdateDialog: function (item) {
                        $scope.model.updateCategoryName = item.name;
                        $scope.model.updateCategoryId = item.id;
                        $scope.model.updateCategoryParentId = item.parentId;
                        HB_dialog.contentAs($scope, {
                            templateUrl: '@systemUrl@/views/problemCategory/updateDialog.html',
                            title: '修改问题分类',
                            width: 500,
                            showCertain: false,
                            showCancel: false
                        });
                    },

                    updateProblemCategory: function (index) {
                        if (validateIsNull($scope.model.updateCategoryName)) {
                            HB_dialog.warning('提示', '请填写类别名称');
                            return false;
                        }

                        $scope.updateSubmitAble = true;
                        problemCategoryService.updateProblemCategory(
                            {
                                id: $scope.model.updateCategoryId,
                                parentId: $scope.model.updateCategoryParentId === null ? '-1' : $scope.model.updateCategoryParentId,
                                name: $scope.model.updateCategoryName
                            }
                        ).then(function (data) {
                            $scope.updateSubmitAble = false;
                            if (data.status) {
                                HB_dialog.success('提示', data.info);
                                HB_dialog.closeDialogByIndex($scope, index);
                                $timeout(function () {
                                    $scope.node.libraryTree.dataSource.read();
                                }, 500);
                            } else {
                                HB_dialog.warning('提示', data.info);
                            }
                        });

                    },

                    closeUpdateDialog: function (index) {
                        HB_dialog.closeDialogByIndex($scope, index);
                    }
                };

                $scope.treelistOptions = {
                    dataSource: {
                        transport: {
                            read: function (e) {
                                var parentId = e.data.id == undefined ? '-1' : e.data.id;
                                problemCategoryService.findProblemCategoryList({parentId: parentId}).then(function (data) {
                                    if (data.info.length < 1) {
                                        $scope.model.noData = true;
                                    } else {
                                        $scope.model.noData = false;
                                    }
                                    $.each(data.info, function (i, data) {
                                        if (data.parentId == '-1')
                                            data.parentId = null;
                                    });
                                    e.success(data.info);
                                });
                            }
                        },
                        schema: {
                            model: {
                                id: 'id'
                            }
                        }
                    },
                    sortable: true,
                    editable: true,
                    columns: [
                        //'ng-click':'fn(dataItem)'
                        {field: 'name', title: '问题类别', attributes: {style: 'text-align: left;cursor:pointer'}},
                        {
                            title: '操作', width: '250px',
                            template: kendo.template('<button class="table-btn" has-permission="problemCategory/edit" ng-click="events.openUpdateDialog(dataItem)">修改</button>' +
                                '<button class="table-btn" has-permission="problemCategory/delete" ng-click="events.deleteProblemCategory(dataItem)">删除</button>')
                        }
                    ]
                };

                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }

            }]
    };
});