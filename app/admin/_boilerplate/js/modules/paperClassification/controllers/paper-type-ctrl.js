define(function () {
    'use strict';
    return ['$rootScope','$scope', 'paperTypeService','hbUtil', function ($rootScope,$scope, paperTypeService,hbUtil) {
        $scope.tabMap={
            myself:{
                name:"本单位",
                code:"myself"
            },
            all:{
                name:"全部",
                code:"all"
            }
        };
        $scope.currentTab = $scope.tabMap.myself.code;
        $scope.model = {
            myselfPaperType: {},
            allPaperType: {},
            unitId:""
        };

        $scope.data = {
            dataItem: null,
            updatePaperId: ''
        };

        var utils = {
            dateTime: function (x, y) {
                var z = {
                    y: x.getFullYear(),
                    M: x.getMonth() + 1,
                    d: x.getDate(),
                    h: x.getHours(),
                    m: x.getMinutes(),
                    s: x.getSeconds()
                };
                return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
                    return ((v.length > 1 ? '0' : '') + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2));
                });
            }
        };
        $scope.events = {
            chooseTab : function (e,code){
                $scope.currentTab = code;
            },
            isSubProjectManager :function () {
                var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
            },

            unitSetCallback:function(unitId) {
                $scope.model.unitId=unitId;
                if(hbUtil.validateIsNull(allDataSource)){
                    allDataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: function (options) {
                                var id = options.data.id ? options.data.id : '-2',
                                    myModel = allDataSource.get(options.data.id);
                                var type = myModel ? myModel.type : '';
                                $.ajax({
                                    url: '/web/admin/paperClassify/findExamPaperTypeByParentId?parentId=' + id+"&unitId="+$scope.model.unitId,
                                    dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                                    success: function (result) {
                                        if ($scope.data.updatePaperId !== '') {
                                            angular.forEach(result.info, function (item, index) {
                                                if (item.id === $scope.data.updatePaperId) {
                                                    result.info.splice(index, 1);
                                                }
                                            });
                                        }
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
                }else{
                    $scope.node.allPaperTypeTree.dataSource.read();
                }

                //$scope.node.allPaperTypeTree.refresh();
            },
            treeHide: function (e) {
                e.stopPropagation();
                $scope.libraryTreeShow = false;
            },
            openTree: function (e) {
                e.stopPropagation();
                $scope.libraryTreeShow = !$scope.libraryTreeShow;
            },
            toAdd: function () {
                $scope.addPaperTypeForm.$setPristine();
                $scope.data.updatePaperId = '';
                $scope.addOrUpdate = 'add';
                $scope.model.paperType = {};
                $scope.model.paperType = {name: null};
                $scope.model.parentName = '';
                $scope.node.windows.addPaperWindow.open();
            },
            cancel: function () {
                $scope.node.windows.addPaperWindow.close();
            },
            getOrgInfo: function (dataItem) {
                if ($scope.model.paperType.id === dataItem.id) {
                    return;
                }
                $scope.model.parentName = dataItem.name;
                $scope.model.paperType.parentId = dataItem.id;
                $scope.libraryTreeShow = false;
            },
            save: function () {
                if ($scope.addPaperTypeForm.$valid) {
                    if ($scope.addOrUpdate === 'add') {
                        paperTypeService.save($scope.model.paperType).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('创建失败!', data.info);
                            } else {
                                var newLibrary = {
                                    id: data.info,
                                    parentId: $scope.model.paperType.parentId === '-1' ? null : $scope.model[$scope.currentTab+'PaperType'].parentId,
                                    name: $scope.model.paperType.name,
                                    count: 0,
                                    createTime: utils.dateTime(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                                    hasChildren: true
                                };
                                //$scope.node.myselfPaperTypeTree.dataSource.insert(0, newLibrary);
                                //$scope.node.myselfPaperTypeTree.refresh();
                                $scope.node.myselfPaperTypeTree.dataSource.read();
                                $scope.node.allPaperTypeTree.dataSource.read();
                                $scope.node.tree.dataSource.read();
                                $scope.noData = false;
                            }
                            $scope.node.windows.addPaperWindow.close();
                        });
                    } else if ($scope.addOrUpdate === 'update') {
                        paperTypeService.update($scope.model.paperType).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('修改失败!', data.info);
                            } else {
                                // $scope.node.myselfPaperTypeTree.dataSource.remove($scope.data.dataItem);
                                // var newLibrary = {
                                //     id: $scope.model.paperType.id,
                                //     parentId: $scope.model.paperType.parentId === '-1' ? null : $scope.model[$scope.currentTab+'PaperType'].parentId,
                                //     name: $scope.model.paperType.name,
                                //     count: $scope.data.dataItem.count,
                                //     createTime: $scope.data.dataItem.createTime,
                                //     hasChildren: true
                                // };
                                $scope.node.myselfPaperTypeTree.dataSource.read();
                                //$scope.node.myselfPaperTypeTree.dataSource.insert(0, newLibrary);
                                $scope.node.myselfPaperTypeTree.refresh();
                                $scope.node.allPaperTypeTree.dataSource.read();
                                $scope.node.tree.dataSource.read();
                                $scope.noData = false;
                            }
                            $scope.node.windows.addPaperWindow.close();
                        });
                    }
                }
            },
            toUpdate: function (e) {
                $scope.node.tree.dataSource.read();
                $scope.addOrUpdate = 'update';
                var row = $(e.target).closest('tr');
                var dataItem = $scope.node[$scope.currentTab+'PaperTypeTree'].dataItem(row);
                $scope.data.dataItem = dataItem;
                $scope.data.updatePaperId = dataItem.id;
                paperTypeService.paperTypeService($scope.data.updatePaperId,'MYSELF').then(function (data) {
                    $scope.model.parentName = data.info.parentName;
                    $scope.model.paperType = data.info;
                    $scope.node.windows.addPaperWindow.open();
                });
            },
            remove: function (e) {
                var row = $(e.target).closest('tr');
                var dataItem = $scope.node[$scope.currentTab+'PaperTypeTree'].dataItem(row);
                $scope.globle.confirm('删除试卷分类', '确定要删除吗？', function (dialog) {
                    return paperTypeService.remove(dataItem.id).then(function (data) {
                        dialog.doRightClose();
                        if (!data.status) {
                            $scope.globle.alert('删除失败!', data.info);
                        } else {
                            $scope.node.myselfPaperTypeTree.dataSource.remove(dataItem);
                            $scope.node.tree.dataSource.read();
                            $scope.node.allPaperTypeTree.dataSource.read();
                            $scope.globle.showTip('删除分类成功', 'success');
                        }
                    });
                });
            },
            details: function (e) {
                var row = $(e.target).closest('tr');
                var dataItem = $scope.node[$scope.currentTab+'PaperTypeTree'].dataItem(row);
                $scope.node.windows.detailsPaperWindow.open();
                paperTypeService.paperTypeService(dataItem.id,'MYSELF').then(function (data) {
                    $scope.model.detailsPaperType = data.info;
                });
            }

        };

        //试卷分类树
        var myselfDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    var id = options.data.id ? options.data.id : '-2',
                        myModel = myselfDataSource.get(options.data.id);
                    var type = myModel ? myModel.type : '';
                    $.ajax({
                        url: '/web/admin/paperClassify/findExamPaperTypeByParentId?authorizedBelongsType=MYSELF&parentId=' + id,
                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        success: function (result) {
                            if ($scope.data.updatePaperId !== '') {
                                angular.forEach(result.info, function (item, index) {
                                    if (item.id === $scope.data.updatePaperId) {
                                        result.info.splice(index, 1);
                                    }
                                });
                            }
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
        //全部
        var allDataSource ;

        $scope.ui = {
            tree: {
                options: {
                    checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: myselfDataSource
                }
            }
            // ,
            // allTree: {
            //     options: {
            //         checkboxes: false,
            //         // 当要去远程获取数据的时候数据源这么配置
            //         dataSource: allDataSource
            //     }
            // },
            // allTree: {
            //     options: {
            //         checkboxes: false,
            //         // 当要去远程获取数据的时候数据源这么配置
            //         dataSource: allDataSource
            //     }
            // },
            // allTree: {
            //     options: {
            //         checkboxes: false,
            //         // 当要去远程获取数据的时候数据源这么配置
            //         dataSource: allDataSource
            //     }
            // }
        };

        //试卷分类树列表
        $scope.myselfTreelistOptions = {
            dataSource: {
                transport: {
                    read: function (e) {
                        var parentId = e.data.id == undefined ? '-1' : e.data.id;
                        paperTypeService.findExamPaperTypeByParentId(parentId,'','MYSELF').then(function (result) {
                            if (result.info.length===0 && parentId == '-1') {
                                $scope.myselfNoData = true;
                            }
                            $.each(result.info, function (i, data) {

                                // if (data.parentId == '-1')
                                //     data.parentId = null;
                                if (data.isTop)
                                    data.parentId = null;
                                if (data.enabled == true) {
                                    data.enabled = '是';
                                } else {
                                    data.enabled = '否';
                                }
                            });
                            e.success(result.info);
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id'
                    }
                }
            },
            messages: {
                loading: '正在加载试卷分类...',
                noRows: '暂无分类',
                retry: 'reload'
            },
            sortable: true,
            editable: true,
            columns: [
                {field: 'name', title: '类别名称', attributes: {style: 'text-align: left'}},
                {field: 'count', title: '试卷数量', width: '100px'},
                {field: 'createTime', title: '创建时间', width: '150px'},
                {
                    title: '操作', width: '180px',
                    template: kendo.template(
                        '<button class="table-btn" ng-click="events.details($event);" has-permission="paperClassification/findPaperType">查看</button>' +
                        '<button class="table-btn" ng-click="events.toUpdate($event);" has-permission="paperClassification/updatePaperType">修改</button>' +
                        '<button class="table-btn" ng-click="events.remove($event);" has-permission="paperClassification/deletePaperType">删除</button>')
                }
            ]
        };
        //全部单位
        $scope.allTreelistOptions = {
            dataSource: {
                transport: {
                    read: function (e) {
                        var parentId = e.data.id == undefined ? '-1' : e.data.id;
                        paperTypeService.findExamPaperTypeByParentId(parentId,$scope.model.unitId,'MYSELF').then(function (result) {
                            if (result.info.length1 && parentId == '-1') {
                                $scope.allNoData = true;
                            }
                            $.each(result.info, function (i, data) {
                                if (data.isTop)
                                    data.parentId = null;
                                if (data.enabled == true) {
                                    data.enabled = '是';
                                } else {
                                    data.enabled = '否';
                                }
                            });
                            e.success(result.info);
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id'
                    }
                }
            },
            messages: {
                loading: '正在加载试卷分类...',
                noRows: '暂无分类',
                retry: 'reload'
            },
            sortable: true,
            editable: true,
            columns: [
                {field: 'name', title: '类别名称', attributes: {style: 'text-align: left'}},
                {field: 'count', title: '试卷数量', width: '100px'},
                {field: 'createTime', title: '创建时间', width: '150px'},
                {
                    title: '操作', width: '180px',
                    template: kendo.template(
                        '<button class="table-btn" ng-click="events.details($event);" has-permission="paperClassification/findPaperType">查看</button>' )
                        //'<button class="table-btn" ng-click="events.toUpdate($event);" has-permission="paperClassification/updatePaperType">修改</button>' +
                        //'<button class="table-btn" ng-click="events.remove($event);" has-permission="paperClassification/deletePaperType">删除</button>')
                }
            ]
        };

        $scope.windowOptions = {
            modal: true,
            visible: false,
            resizable: false,
            draggable: false,
            title: false,
            open: function () {
                this.center();
            }
        };

    }];
});
