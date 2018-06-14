define(function () {
    'use strict';
    return ['$scope', 'roleManageService', '$state', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'KENDO_UI_EDITOR', 'hbUtil',
        function ($scope, roleManageService, $state, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, KENDO_UI_EDITOR, hbUtil) {
            $scope.model = {
                permissionMessage: {},
                save: true,

                nodeSelectedIdArray: [],
                itemSelectedIdArray: [],
                rootSelectedIdArray: []

            };

            $scope.model.check = {'check': 0};

            $scope.events = {
                /**
                 * 返回角色列表界面
                 * @param e
                 */
                goRoleManage: function (e) {
                    e.preventDefault();
                    $state.go('states.roleManage').then(function () {
                        $state.reload($state.current);
                    });
                },

                stopDefaultCheck: function (e) {
                    e.stopPropagation();
                },


                /**
                 * 判断第二级节点的孩子节点是否被选中并且不是全选
                 * @param item
                 * @returns {boolean}
                 */
                showCheckSomething: function (item) {

                    var flag = false;
                    angular.forEach(item.children, function (childData, index) {
                        if (childData.selected) {
                            flag = true;
                        }
                    });

                    if (flag) {
                        angular.forEach(item.children, function (childData, index) {
                            if (!childData.selected) {
                                flag = false;
                            }
                        });

                        return !flag;
                    } else {
                        return false;
                    }
                },


                /**
                 * 判断第一级节点的孩子节点是否被选中并且不是全选
                 * @param item
                 * @returns {boolean}
                 */
                showCheckSomethingForAll: function (root) {

                    var flag = false;
                    angular.forEach(root.children, function (itemData, index) {
                        angular.forEach(itemData.children, function (nodeData, index) {
                            if (nodeData.selected) {
                                flag = true;
                            }
                        });
                    });

                    if (flag) {
                        angular.forEach(root.children, function (itemData, index) {
                            angular.forEach(itemData.children, function (nodeData, index) {
                                if (!nodeData.selected) {
                                    flag = false;
                                }
                            });
                        });
                        return !flag;
                    } else {
                        return false;
                    }
                },


                /**
                 * 全选
                 * @param e
                 */
                clickAllCheckbox: function (e) {

                    if (e.currentTarget.checked) {//全选
                        angular.forEach($scope.model.permissionMessage, function (rootData, index) {

                            rootData.selected = true;//一级(root)
                            var index = _.indexOf($scope.model.rootSelectedIdArray, rootData.id);
                            if (index == -1) {
                                $scope.model.rootSelectedIdArray.push(rootData.id);
                            }

                            angular.forEach(rootData.children, function (itemData, index) {//二级(item)
                                itemData.selected = true;
                                var index = _.indexOf($scope.model.itemSelectedIdArray, itemData.id);
                                if (index == -1) {
                                    $scope.model.itemSelectedIdArray.push(itemData.id);
                                }

                                angular.forEach(itemData.children, function (nodeData, index) {//三级(node)
                                    nodeData.selected = true;
                                    var index = _.indexOf($scope.model.nodeSelectedIdArray, nodeData.id);
                                    if (index == -1) {
                                        $scope.model.nodeSelectedIdArray.push(nodeData.id);
                                    }
                                });

                            });
                        });
                    } else {//取消全选
                        angular.forEach($scope.model.permissionMessage, function (rootData, index) {

                            rootData.selected = false;//一级(root)
                            var index = _.indexOf($scope.model.rootSelectedIdArray, rootData.id);
                            if (index != -1) {
                                $scope.model.rootSelectedIdArray.splice(index, 1);
                            }

                            angular.forEach(rootData.children, function (itemData, index) {//二级(item)
                                itemData.selected = false;
                                var index = _.indexOf($scope.model.itemSelectedIdArray, itemData.id);
                                if (index != -1) {
                                    $scope.model.itemSelectedIdArray.splice(index, 1);
                                }

                                angular.forEach(itemData.children, function (nodeData, index) {//三级(node)
                                    nodeData.selected = false;
                                    var index = _.indexOf($scope.model.nodeSelectedIdArray, nodeData.id);
                                    if (index != -1) {
                                        $scope.model.nodeSelectedIdArray.splice(index, 1);
                                    }
                                });

                            });
                        });
                    }
                },

                /**
                 * 选择/取消选择root
                 */
                onRootClick: function (e, root) {
                    e.stopPropagation();
                    var id = root.id;
                    if (e.currentTarget.checked) {//选中
                        $scope.model.rootSelectedIdArray.push(id);

                        // 全选底下的所有的儿子item和node
                        angular.forEach($scope.model.permissionMessage, function (data, index) {
                            if (data.id == root.id) {

                                angular.forEach(root.children, function (data, index) {//选中二级(item)
                                    data.selected = true;
                                    var index = _.indexOf($scope.model.itemSelectedIdArray, data.id);
                                    if (index == -1) {
                                        $scope.model.itemSelectedIdArray.push(data.id);
                                    }

                                    angular.forEach(data.children, function (nodeData, index) {//选中三级(node)
                                        nodeData.selected = true;
                                        var index = _.indexOf($scope.model.nodeSelectedIdArray, nodeData.id);
                                        if (index == -1) {
                                            $scope.model.nodeSelectedIdArray.push(nodeData.id);
                                        }
                                    });

                                });
                            }
                        });
                    } else {//取消选中
                        var index = _.indexOf($scope.model.rootSelectedIdArray, id);
                        if (index !== -1) {
                            $scope.model.rootSelectedIdArray.splice(index, 1);

                            // 取消选择底下的所有的儿子item和node
                            angular.forEach($scope.model.permissionMessage, function (data, index) {
                                if (data.id == root.id) {

                                    angular.forEach(root.children, function (data, index) {//取消选中二级
                                        data.selected = false;
                                        var index = _.indexOf($scope.model.itemSelectedIdArray, data.id);
                                        if (index !== -1) {
                                            $scope.model.itemSelectedIdArray.splice(index, 1);
                                        }
                                        angular.forEach(data.children, function (nodeData, index) {//取消选中三级(node)
                                            nodeData.selected = false;
                                            var index = _.indexOf($scope.model.nodeSelectedIdArray, nodeData.id);
                                            if (index !== -1) {
                                                $scope.model.nodeSelectedIdArray.splice(index, 1);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    }
                },

                /**
                 * 选择/取消选择item
                 */
                onItemClick: function (e, item) {

                    var id = item.id;
                    if (e.currentTarget.checked) {//选中
                        var index = _.indexOf($scope.model.itemSelectedIdArray, id);
                        if (index == -1) {
                            $scope.model.itemSelectedIdArray.push(id);
                        }
                        angular.forEach($scope.model.permissionMessage, function (rootData, index) {
                            angular.forEach(rootData.children, function (itemData, index) {
                                if (itemData.id == id) {
                                    itemData.selected = true;
                                }
                            });
                        });

                        angular.forEach($scope.model.permissionMessage, function (data, index) {//选中父级(root)
                            if (data.id == item.parentId) {
                                data.selected = true;

                                var index = _.indexOf($scope.model.rootSelectedIdArray, data.id);
                                if (index == -1) {
                                    $scope.model.rootSelectedIdArray.push(data.id);
                                }
                            }
                        });

                        angular.forEach(item.children, function (nodeData, index) {//选中三级(node)
                            nodeData.selected = true;
                            var index = _.indexOf($scope.model.nodeSelectedIdArray, nodeData.id);
                            if (index == -1) {
                                $scope.model.nodeSelectedIdArray.push(nodeData.id);
                            }
                        });

                    } else {//取消选中
                        var index = _.indexOf($scope.model.itemSelectedIdArray, id);
                        if (index !== -1) {

                            $scope.model.itemSelectedIdArray.splice(index, 1);
                            angular.forEach($scope.model.permissionMessage, function (rootData, index) {
                                angular.forEach(rootData.children, function (itemData, index) {
                                    if (itemData.id == id) {
                                        itemData.selected = false;
                                    }
                                });
                            });

                            angular.forEach($scope.model.permissionMessage, function (data, index) {//判断是否要取消父级
                                if (data.id == item.parentId) {

                                    var flag = false;
                                    angular.forEach(data.children, function (temp, index) {
                                        if (temp.selected) {//还有选中的
                                            flag = true;
                                        }
                                    });

                                    if (!flag) {//全是取消的，这时要取消父节点
                                        var index = _.indexOf($scope.model.rootSelectedIdArray, data.id);
                                        if (index !== -1) {
                                            data.selected = false;
                                            $scope.model.rootSelectedIdArray.splice(index, 1);
                                        }
                                    }
                                }
                            });

                            angular.forEach(item.children, function (nodeData, index) {//取消选中三级(node)
                                nodeData.selected = false;
                                var index = _.indexOf($scope.model.nodeSelectedIdArray, nodeData.id);
                                if (index !== -1) {
                                    $scope.model.nodeSelectedIdArray.splice(index, 1);
                                }
                            });
                        }
                    }
                },

                /**
                 * 选择/取消选择node
                 */
                onNodeClick: function (e, node) {
                    var id = node.id;
                    if (e.currentTarget.checked) {

                        angular.forEach($scope.model.permissionMessage, function (rootData, index) {//选中
                            angular.forEach(rootData.children, function (itemData, index) {
                                angular.forEach(itemData.children, function (nodeData, index) {
                                    if (nodeData.id == id) {
                                        nodeData.selected = true;
                                    }
                                });
                            });
                        });
                        var index = _.indexOf($scope.model.nodeSelectedIdArray, id);
                        if (index == -1) {
                            $scope.model.nodeSelectedIdArray.push(id);
                        }

                        angular.forEach($scope.model.permissionMessage, function (rootData, index) {//选中二级(item）
                            angular.forEach(rootData.children, function (itemData, index) {
                                if (itemData.id == node.parentId) {

                                    itemData.selected = true;
                                    var index = _.indexOf($scope.model.itemSelectedIdArray, itemData.id);
                                    if (index == -1) {
                                        $scope.model.itemSelectedIdArray.push(itemData.id);
                                    }

                                    angular.forEach($scope.model.permissionMessage, function (rootData, index) {//选中一级(root）
                                        if (rootData.id == itemData.parentId) {

                                            rootData.selected = true;
                                            var index = _.indexOf($scope.model.rootSelectedIdArray, rootData.id);
                                            if (index == -1) {
                                                $scope.model.rootSelectedIdArray.push(rootData.id);
                                            }
                                        }
                                    });
                                }
                            });
                        });


                    } else {//取消选中
                        var index = _.indexOf($scope.model.nodeSelectedIdArray, id);
                        if (index !== -1) {
                            $scope.model.nodeSelectedIdArray.splice(index, 1);
                            angular.forEach($scope.model.permissionMessage, function (rootData, index) {//取消选中三级（node)
                                angular.forEach(rootData.children, function (itemData, index) {
                                    angular.forEach(itemData.children, function (nodeData, index) {
                                        if (nodeData.id == id) {
                                            nodeData.selected = false;
                                        }
                                    });
                                });
                            });

                            angular.forEach($scope.model.permissionMessage, function (rootData, index) {//判断是否要取消二级（item)
                                angular.forEach(rootData.children, function (itemData, index) {
                                    if (itemData.id == node.parentId) {

                                        var flag = false;
                                        angular.forEach(itemData.children, function (temp, index) {
                                            if (temp.selected) {//还有选中的
                                                flag = true;
                                            }
                                        });

                                        if (!flag) {//全是取消的，这时要取消二级（item)
                                            itemData.selected = false;
                                            var index = _.indexOf($scope.model.itemSelectedIdArray, itemData.id);
                                            if (index !== -1) {
                                                $scope.model.itemSelectedIdArray.splice(index, 1);
                                            }

                                            angular.forEach($scope.model.permissionMessage, function (rootData, index) {//判断是否要取消一级（root)
                                                if (rootData.id == itemData.parentId) {

                                                    var flag = false;
                                                    angular.forEach(rootData.children, function (temp, index) {
                                                        if (temp.selected) {//还有选中的
                                                            flag = true;
                                                        }
                                                    });

                                                    if (!flag) {//全是取消的，这时要取消一级（node)
                                                        rootData.selected = false;
                                                        var index = _.indexOf($scope.model.rootSelectedIdArray, rootData.id);
                                                        if (index !== -1) {
                                                            $scope.model.rootSelectedIdArray.splice(index, 1);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        }
                    }
                },

                /**
                 * 保存角色并返回
                 * @param e
                 * @param menu
                 */
                saveRole: function (e) {
                    if ($scope.roleValidate.$valid && $scope.model.save) {
                        $scope.model.save = false;
                        roleManageService.saveRole($scope.model.roleMessage, $scope.model.nodeSelectedIdArray,
                            $scope.model.itemSelectedIdArray, $scope.model.rootSelectedIdArray).then(function (data) {
                            if (data.status && data.info) {
                                $scope.globle.showTip('保存成功', 'success');
                                $state.go('states.roleManage').then(function () {
                                    $state.reload($state.current);
                                });
                                $scope.model.save = true;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                                $scope.model.save = true;
                            }
                        });
                    }
                    e.preventDefault();

                }
            };

            function getAllPermission () {
                roleManageService.getAllPermission().then(function (data) {
                    if (data.status) {
                        $scope.model.permissionMessage = data.info;
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }

                });
            }

            function init () {
                getAllPermission();
            }

            init();

        }];
});
