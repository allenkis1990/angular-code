define(function () {
    'use strict';
    return ['$scope', 'TabService', 'lecturerManageService', '$state', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'KENDO_UI_EDITOR', 'hbUtil','$timeout',
        function ($scope, TabService, lecturerManageService, $state, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, KENDO_UI_EDITOR, hbUtil, $timeout) {
            $scope.model = {

                roleSelectedIdArray: [],

                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                createParam: {
                    sex: '1',
                    status: '1',

                    provinceId: null,
                    cityId: null,
                    countyId: null
                },
                showAddLesson: true,
                showAddSection: false,
                showLessonSuccess: false,

                save: true,
                rolesString: '',
                imgSrc: "@systemUrl@/images/photo.jpg",
            };
            var localDB = {
                selectedIdArray: []
            };

            $scope.node = {grid: null};

            //监控图片是否上传
            $scope.$watch('model.uploader',function(newVal){
                if(newVal){
                    var a=angular.fromJson(newVal);
                    $scope.model.createParam.displayPhotoUrl= a.convertResult[0].url;
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
                    $scope.model.createParam.displayPhotoUrl= "";
                    $scope.model.imgSrc="@systemUrl@/images/photo.jpg";
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
                 * 添加用户并返回
                 * @param e
                 * @param menu
                 */
                saveAdministrator: function (e) {
                    if ($scope.administratorValidate.$valid && $scope.model.save) {
                        $scope.model.save = false;
                        lecturerManageService.createAdministrator($scope.model.createParam).then(function (data) {
                            if (data.status) {
                                $scope.model.createParam.administratorId = data.info.administratorId;

                                $state.go('states.lecturerManage').then(function () {
                                    $state.reload($state.current);
                                });
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.save = true;
                        });
                    }
                    e.preventDefault();

                },

                /**
                 * 查看角色
                 * @param e
                 */
                viewRole: function (dataItem) {
                    TabService.appendNewTab('角色管理', 'states.roleManage.view', {
                        roleId: dataItem.roleId,
                        type: 2
                    }, 'states.roleManage', true);
                },


                /**
                 * 保存并进入下一步
                 * @param e
                 */
                saveAndEnter: function (e) {
                    if ($scope.administratorValidate.$valid && $scope.model.save) {
                        $scope.model.save = false;
                        lecturerManageService.createAdministrator($scope.model.createParam).then(function (data) {
                            if (data.status) {
                                $scope.model.createParam.administratorId = data.info.administratorId;
                                $scope.model.showAddLesson = false;
                                $scope.model.showAddSection = true;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.save = true;
                        });
                    }
                    e.preventDefault();
                },

                /**
                 *
                 */

                /**
                 * 继续添加管理员
                 * @param e
                 */
                carryOnAddUser: function (e) {

                    $scope.model.showLessonList = false;
                    $scope.model.showAddLesson = true;
                    $scope.model.showAddSection = false;
                    $scope.model.showLessonSuccess = false;

                    $scope.model.createParam.provinceId = null;
                    $scope.model.createParam.cityId = null;
                    $scope.model.createParam.countyId = null;
                    $scope.model.roleSelectedIdArray = [];

                    $scope.model.createParam = {
                        sex: '1',
                        status: '1'
                    },
                        $scope.selected = false;

                    localDB = {
                        selectedIdArray: []
                    };
                    $scope.administratorValidate.$setPristine();

                    $scope.node.grid.pager.page(1);
                    e.preventDefault();
                },


                /**
                 * 跳转到添加管理员页面
                 */
                toUserAdd: function () {
                    $scope.model.showLessonList = false;
                    $scope.model.showAddLesson = true;
                    $scope.model.showAddSection = false;
                },


                openLessonTypeTree: function () {
                    $scope.areaShow = !$scope.areaShow;
                },


                /**
                 * 获取单位
                 * @param dataItem
                 */
                getArea: function (dataItem) {
                    $scope.model.createParam.unitName = dataItem.name;
                    $scope.model.createParam.unitId = dataItem.unitId;

                    //地区
                    $scope.model.createParam.provinceId = dataItem.provinceId;
                    $scope.model.createParam.cityId = dataItem.cityId;
                    $scope.model.createParam.countyId = dataItem.countyId;

                    $scope.areaShow = false;
                },


                checkBoxCheck: function (e, dataItem) {
                    if (e.currentTarget.checked) {//选中
                        $scope.model.roleSelectedIdArray.push(dataItem.roleId);
                    } else {//取消勾选
                        var index = _.indexOf($scope.model.roleSelectedIdArray, dataItem.roleId);
                        if (index !== -1) {
                            $scope.model.roleSelectedIdArray.splice(index, 1);
                        }
                    }
                },


                /**
                 * 最后一步
                 * @param e
                 */
                saveAndFinalStep: function (e) {
                    var administratorId = $scope.model.createParam.administratorId;
                    lecturerManageService.authorityBatchRole(administratorId, $scope.model.roleSelectedIdArray).then(function (data) {
                        if (data.status && data.info) {
                            $scope.model.showAddLesson = false;
                            $scope.model.showAddSection = false;
                            $scope.model.showLessonSuccess = true;
                            findRoleMessage();
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
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


            //获取角色字符串
            function findRoleMessage () {
                lecturerManageService.getUserRoleListString($scope.model.createParam.administratorId).then(function (data) {
                    if (data.status) {
                        $scope.model.rolesString = data.info;
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }
                });
            }


            //分配角色表格
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: roleId #"  class="k-checkbox" ng-checked="selected" />');
                result.push('<label class="k-checkbox-label" for="check_#: roleId #"></label>');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');


                result.push('<td>');
                result.push('#: description==null?\'\':description#');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.viewRole(dataItem)" has-permission="lecturerManage/queryRole">查看</button>');
                result.push('</td>');


                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();


            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                },
                windows: {
                    coursewareInfoOptions: {//添加窗口
                        modal: true,
                        content: '@systemUrl@/views/lessonResourceManage/coursewareInfo.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                },

                grid: {
                    options: {
                        rowTemplate: kendo.template(gridRowTemplate),
                        noRecords: {
                            template: '暂无数据！'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/lecturerManage/findRolesByQuery',
                                    data: function (e) {
                                        var temp = {
                                            pageNo: e.page,
                                            pageSize: e.pageSize
                                        };

                                        $scope.model.page.pageNo = e.page;
                                        $scope.model.page.pageSize = e.pageSize;
                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;
                                        return temp;
                                    },
                                    dataType: 'json',
                                    error: function (data) {
                                        HB_notification.error('提示', data.info);
                                    }
                                }
                            },
                            page: 1,
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                parse: function (response) {
                                    if (response.status) {
                                        var viewData = response.info,
                                            i = 1;
                                        _.forEach(viewData, function (row) {
                                            row.index = i++;
                                        });
                                        return response;
                                    } else {
                                        HB_notification.error('提示', response.info);
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },

                                total: function (response) {
                                    // 绑定数据所有总共多少条;
                                    return response.totalSize;
                                },

                                data: function (response) {
                                    if (response.status) {
                                        var datas = response.info;
                                        return datas;
                                    } else {
                                        return [];
                                    }
                                } // 指定数据源
                            },
                            serverPaging: true
                        },

                        selectable: true,
                        scrollable: false,//第一次加载时的蒙板效果
                        dataBinding: function (e) {//没有数据时的默认提示语
                            kendoGrid.nullDataDealLeaf(e);
                        },

                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        columns: [
                            {field: '', title: '', sortable: false, width: 50},
                            {field: 'name', title: '角色名称', sortable: false, width: 200},
                            {field: 'description', title: '角色说明', sortable: false, width: 300},
                            {
                                title: '查看权限', width: 300
                            }
                        ]
                    }
                },
                editor: KENDO_UI_EDITOR
            };
        }];
});
