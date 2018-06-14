define(function () {
    'use strict';
    return ['$rootScope','$scope', 'questionLibraryService', 'TabService','hbUtil', function ($rootScope,$scope, questionLibraryService, TabService,hbUtil) {
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

            page: {
                pageNo: 1,
                pageSize: 5
            },
            myselfSearch: {
                questionName:"",
                enable: -1,
                name: null
            }
            ,
            allSearch: {
                questionName:"",
                enable: -1,
                name: null
            }
            ,
            myselfLibrary: {
                enabled: 'true',
                share: 'false'
            },
            allLibrary: {
                enabled: 'true',
                share: 'false'
            },
            parentName: '',
            parentId: ''
        };

        shareAble:false,//是否有权限共享题库

            $scope.data = {
                dataItem: null,
                updatePaperId: ''
            };

        $scope.init = function () {

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

        $scope.$watch('model.myselfLibrary.enabled', function () {
            if ($scope.model.myselfLibrary.enabled === 'false') {
                $scope.model.myselfLibrary.share = 'false';
                $('#radioShare').children('input').attr('disabled', true);
            } else if ($scope.model.myselfLibrary.enabled === 'true') {
                $('#radioShare').children('input').removeAttr('disabled');
            }
        });
        $scope.$watch('model.allLibrary.enabled', function () {
            if ($scope.model.allLibrary.enabled === 'false') {
                $scope.model.allLibrary.share = 'false';
                $('#radioShare').children('input').attr('disabled', true);
            } else if ($scope.model.allLibrary.enabled === 'true') {
                $('#radioShare').children('input').removeAttr('disabled');
            }
        });
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
            },
            openAsyn: function () {
                TabService.appendNewTab('导入任务查看', 'states.questionImport', true);
            },
            libraryTreeHide: function (e) {
                e.stopPropagation();
                $scope[$scope.currentTab+'LibraryTreeShow'] = false;
            },
            searchQuestion: function (e) {
                //$scope.node.myselfibraryTree.dataSource.read();
                $scope.node[$scope.currentTab+'LibraryTree'].dataSource.read();
                e.preventDefault();
            },
            add: function () {
                $scope.addLibraryForm.$setPristine();
                $scope.data.updatePaperId = '';
                $scope.addOrUpdate = 'add';
                $scope.model[$scope.currentTab+'Library'] = null;
                $scope.model.parentName = '';
                $scope.model[$scope.currentTab+'Library'] = {enabled: 'true', share: 'false', name: null};

                $scope.node.windows.addWindow.open();
            },
            cancel: function () {
                $scope.node.windows.addWindow.close();
            },
            getOrgInfo: function (dataItem) {
                if (dataItem.enabled == false) {
                    return;
                }
                $scope.model.parentName = dataItem.name;
                $scope.model.myselfLibrary.parentId = dataItem.id;
                $scope[$scope.currentTab+'LibraryTreeShow'] = false;
            },
            openTree: function (e) {
                e.stopPropagation();
                $scope[$scope.currentTab+'LibraryTreeShow'] = !$scope[$scope.currentTab+'LibraryTreeShow'];
            },
            save: function () {
                if ($scope.model[$scope.currentTab+'Library'].parentId == null) {
                    $scope.globle.showTip('必须选择一个题库', 'error');
                    return;
                }
                if ($scope.model[$scope.currentTab+'Library'].name == null || $scope.model[$scope.currentTab+'Library'].name === '') {
                    $scope.globle.showTip('题库名称不能为空', 'error');
                    return;
                }
                if ($scope.addLibraryForm.$valid) {
                    if ($scope.addOrUpdate === 'add') {
                        questionLibraryService.save($scope.model[$scope.currentTab+'Library']).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('提示', data.info);
                            } else {
                                var newLibrary = {
                                    id: data.info,
                                    parentId: $scope.model[$scope.currentTab+'Library'].parentId === '-1' ? null : $scope.model[$scope.currentTab+'Library'].parentId,
                                    name: $scope.model[$scope.currentTab+'Library'].name,
                                    count: 0,
                                    enabled: $scope.model[$scope.currentTab+'Library'].enabled === 'true' ? '是' : '否',
                                    share: $scope.model[$scope.currentTab+'Library'].share === 'true' ? '是' : '否',
                                    createTime: utils.dateTime(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                                    operateAble: true
                                };
                                $scope.node.myselfLibraryTree.dataSource.insert(0, newLibrary);
                                $scope.node.myselfLibraryTree.refresh();
                                $scope.node.myselfTree.dataSource.read();
                                $scope.noData = false;
                                $scope.node.windows.addWindow.close();
                            }
                        });
                    } else if ($scope.addOrUpdate === 'update') {
                        questionLibraryService.update($scope.model[$scope.currentTab+'Library']).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('提示', data.info);
                            } else {
                                $scope.node[$scope.currentTab+'LibraryTree'].dataSource.remove($scope.data.dataItem);
                                var newLibrary = {
                                    id: $scope.model[$scope.currentTab+'Library'].id,
                                    parentId: $scope.model[$scope.currentTab+'Library'].parentId === '-1' ? null : $scope.model[$scope.currentTab+'Library'].parentId,
                                    name: $scope.model[$scope.currentTab+'Library'].name,
                                    count: $scope.data.dataItem.count,
                                    enabled: $scope.model[$scope.currentTab+'Library'].enabled === 'true' ? '是' : '否',
                                    share: $scope.model[$scope.currentTab+'Library'].share === 'true' ? '是' : '否',
                                    createTime: $scope.data.dataItem.createTime,
                                    hasChildren: true,
                                    operateAble: true
                                };
                                $scope.noData = false;
                                $scope.node.myselfLibraryTree.dataSource.insert(0, newLibrary);
                                $scope.node.myselfLibraryTree.refresh();
                                //$scope.node.libraryTree.dataSource.read ();
                                $scope.node.myselfTree.dataSource.read();
                                $scope.node.windows.addWindow.close();
                            }
                        });
                    }
                }
            },
            remove: function (e) {
                var row = $(e.target).closest('tr');
                var dataItem = $scope.node[$scope.currentTab+'LibraryTree'].dataItem(row);
                if (dataItem.count > 0) {
                    $scope.globle.alert('提示', '该题库下存在试题，请移除后，方可删除');
                } else {
                    $scope.globle.confirm('删除题库', '确定要删除吗？', function (dialog) {
                        return questionLibraryService.remove(dataItem.id).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.alert('删除失败', data.info);
                            } else {
                                $scope.node.myselfLibraryTree.dataSource.remove(dataItem);
                                $scope.globle.showTip('删除题库成功', 'success');
                                $scope.node.myselfLibraryTree.refresh();
                                $scope.node.myselfTree.dataSource.read();
                            }
                        });
                    });
                }
            },
            questionManage: function (e) {
                var row = $(e.target).closest('tr');
                var dataItem = $scope.node[$scope.currentTab+'LibraryTree'].dataItem(row);
                $scope.globle.stateGo('states.questionManage', '试题管理', {id: dataItem.id, name: dataItem.name});
            },
            toUpdate: function (e) {
                $scope.node[$scope.currentTab+'Tree'].dataSource.read();
                $scope.addOrUpdate = 'update';
                var row = $(e.target).closest('tr');
                var dataItem = $scope.node[$scope.currentTab+'LibraryTree'].dataItem(row);
                $scope.data.dataItem = dataItem;
                $scope.data.updatePaperId = dataItem.id;
                questionLibraryService.findLibraryById(dataItem.id).then(function (data) {
                    $scope.model.parentName = data.info.parentName;
                    $scope.model[$scope.currentTab+'Library'] = data.info;
                    $scope.node.windows.addWindow.open();
                });
            },
            details: function (e) {
                var row = $(e.target).closest('tr');
                var dataItem = $scope.node[$scope.currentTab+'LibraryTree'].dataItem(row);
                $scope.node.windows.detailsWindow.open();
                questionLibraryService.findLibraryById(dataItem.id).then(function (data) {
                    $scope.model.detailsLibrary = data.info;
                });
            }
        };
        //题库树
        var myselfDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    console.log(123);
                    var id = options.data.id ? options.data.id : '-2',
                        myModel = myselfDataSource.get(options.data.id);
                    $.ajax({
                        url: '/web/admin/questionLibrary/findLibraryListByParentId?libraryId=' + id + '&enabled=0'
                        + '&onlySelf=0'+'&questionName='+$scope.model.myselfSearch.questionName+"&authorizedQuery="+ $scope.model.mySelfAuthorizedQuery+"&authorizedBelongsType=MYSELF",
                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain
                                          // requests
                        success: function (result) {
                            // notify the data source that the request succeeded
                            if ($scope.data.updatePaperId !== '') {
                                angular.forEach(result.info, function (item, index) {
                                    if (item.id === $scope.data.updatePaperId) {
                                        result.info.splice(index, 1);
                                    }
                                });
                            }
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

        var allDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    console.log(1);
                    var id = options.data.id ? options.data.id : '-2',
                        myModel = dataSource.get(options.data.id);
                    $.ajax({
                        url: '/web/admin/questionLibrary/findLibraryListByParentId?libraryId=' + id + '&enabled=0' + '&onlySelf=0'+'&questionName='+$scope.model.allfSearch.questionName,
                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain
                                          // requests
                        success: function (result) {
                            // notify the data source that the request succeeded
                            if ($scope.data.updatePaperId !== '') {
                                angular.forEach(result.info, function (item, index) {
                                    if (item.id === $scope.data.updatePaperId) {
                                        result.info.splice(index, 1);
                                    }
                                });
                            }
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
            myselfTree: {
                options: {
                    checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: myselfDataSource
                }
            },
            allTree: {
                options: {
                    checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: allDataSource
                }
            }
        };

        // var gridRowTemplate = '';
        // (function () {
        //     var result = [];
        //     result.push ( '<tr>' );
        //
        //     result.push ( '<td title="#: name #">' );
        //     result.push ( '#: name #' );
        //     result.push ( '</td>' );
        //
        //     result.push ( '<td>' );
        //     result.push ( '#: count #' );
        //     result.push ( '</td>' );
        //
        //     result.push ( '<td>' );
        //     result.push ( '#:enabled  #' );
        //     result.push ( '</td>' );
        //
        //     result.push ( '<td>' );
        //     result.push ( '#:  createTime  #' );
        //     result.push ( '</td>' );
        //
        //     result.push ( '<td>' );
        //     result.push ( '<button type="button" has-permission="questionLibrary/findQuestionLibrary" class="table-btn" ng-click="events.details($event);" >查看</button>' );
        //     result.push ( '<button type="button" has-permission="questionLibrary/updateQuestionLibrary" class="table-btn" ng-click="events.toUpdate($event);" #: operateAble ==\'false\' ?\'\':\'disabled\'#>修改</button>' );
        //     result.push ( '<button type="button" has-permission="questionLibrary/findLibraryQuestions" class="table-btn"  ng-click="events.questionManage($event);" #: operateAble ==\'false\' ?\'\':\'disabled\' #>试题管理</button>' );
        //     result.push ( '<button type="button" has-permission="questionLibrary/deleteQuestionLibrary" class="table-btn"  ng-click="events.remove($event);" #: operateAble ==\'false\'  ?\'\':\'disabled\' #>删除</button>' );
        //     result.push ( '</td>' );
        //
        //     result.push ( '</tr>' );
        //     gridRowTemplate = result.join ( '' );
        // }) ();

        //题库树列表
        $scope.myselfTreelistOptions = {

            dataSource: {
                transport: {

                    read: function (e) {

                        var parentId = e.data.id == undefined ? '-1' : e.data.id;
                        questionLibraryService.getMenuList(parentId,$scope.model.myselfSearch.questionName,$scope.model.mySelfAuthorizedQuery).then(function (result) {


                            if (result.info.length < 1 && parentId == '-1') {
                                $scope.myselfNoData = true;
                            }else if(result.info.length >0 && parentId == '-1'){
                                $scope.myselfNoData = false;
                            }
                            $.each(result.info, function (i, data) {
                                if (data.parentId == '-1')
                                    data.parentId = null;
                                if (data.enabled == true) {
                                    data.enabled = '是';
                                } else {
                                    data.enabled = '否';
                                }

                                if (data.share) {
                                    data.share = '是';
                                } else {
                                    data.share = '否';
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
                loading: '正在加载题库...',
                noRows: '暂无题库',
                retry: 'reload'
            },
            sortable: true,
            editable: true,
            columns: [
                {field: 'name', title: '题库名称', attributes: {style: 'text-align: left'}, width: '230px'},
                {field: 'formUnitName', title: '创建单位', width: '150px'},
                {field: 'count', title: '试题数量', width: '80px'},
                {field: 'enabled', title: '是否可用', width: '80px'},
                {field: 'createTime', title: '创建时间', width: '80px'},
                {field: 'strIsAuthorized', title: '是否授权', width: '80px'},
                {field: 'strAvailableStatus', title: '授权状态', width: '150px'},
                {
                    title: '操作', width: '220px',
                    template: kendo.template('<button class="table-btn" has-permission="questionLibrary/findQuestionLibrary" ng-click="events.details($event);">查看</button>' +
                        '<button class="table-btn" ng-click="events.toUpdate($event);" has-permission="questionLibrary/updateQuestionLibrary"  ng-disabled="dataItem.operateAble === false">修改</button>' +
                        '<button class="table-btn" has-permission="questionLibrary/findLibraryQuestions" ng-click="events.questionManage($event);" ng-disabled="dataItem.operateAble === false" >试题管理</button>' +
                        '<button class="table-btn" ng-click="events.remove($event);" has-permission="questionLibrary/deleteQuestionLibrary" ng-disabled="dataItem.operateAble === false" >删除</button>')
                }
            ]
            // }
        };
        $scope.allTreelistOptions = {

            dataSource: {
                transport: {
                    read: function (e) {
                        var parentId = e.data.id == undefined ? '-1' : e.data.id;
                        questionLibraryService.getMenuList(parentId,$scope.model.allSearch.questionName,$scope.model.allAuthorizedQuery).then(function (result) {
                            console.info(result.info);

                            if (result.info.length < 1 && parentId == '-1') {
                                $scope.allNoData = true;
                            }else if(result.info.length >0 && parentId == '-1'){
                                $scope.allNoData = false;
                            }
                            $.each(result.info, function (i, data) {
                                if (data.parentId == '-1')
                                    data.parentId = null;
                                if (data.enabled == true) {
                                    data.enabled = '是';
                                } else {
                                    data.enabled = '否';
                                }

                                if (data.share) {
                                    data.share = '是';
                                } else {
                                    data.share = '否';
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
                loading: '正在加载题库...',
                noRows: '暂无题库',
                retry: 'reload'
            },
            sortable: true,
            editable: true,
            columns: [
                {field: 'name', title: '题库名称', attributes: {style: 'text-align: left'}, width: '230px'},
                {field: 'formUnitName', title: '创建单位', width: '150px'},
                {field: 'count', title: '试题数量', width: '80px'},
                {field: 'enabled', title: '是否可用', width: '80px'},
                {field: 'createTime', title: '创建时间', width: '150px'},
                {field: 'strIsAuthorized', title: '是否授权', width: '80px'},
                {field: 'strAvailableStatus', title: '授权状态', width: '150px'},
                {
                    title: '操作', width: '220px',
                    template: kendo.template('<button class="table-btn" has-permission="questionLibrary/findQuestionLibrary" ng-click="events.details($event);">查看</button>') //+
                        //'<button class="table-btn" ng-click="events.toUpdate($event);" has-permission="questionLibrary/updateQuestionLibrary"  ng-disabled="dataItem.operateAble === false">修改</button>' +
                        //'<button class="table-btn" has-permission="questionLibrary/findLibraryQuestions" ng-click="events.questionManage($event);" ng-disabled="dataItem.operateAble === false" >试题管理</button>' +
                       // '<button class="table-btn" ng-click="events.remove($event);" has-permission="questionLibrary/deleteQuestionLibrary" ng-disabled="dataItem.operateAble === false" >删除</button>')
                }
            ]
            // }
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
        setTimeout(function () {
            if ($scope.$stateParams.newlibray) {
                $scope.addOrUpdate = 'add';
                $scope.node.windows.addWindow.open();
            }
        }, 1000);
    }];
});
