define(function () {
    'use strict';
    return ['$scope', 'roleManageService', 'lecturerManageService', '$stateParams', '$state', 'KENDO_UI_GRID', 'kendo.grid'
        , function ($scope, roleManageService, lecturerManageService, $stateParams, $state, KENDO_UI_GRID, kendoGrid) {
        $scope.model = {
            userMessage: {},
            roleMessage: {},
            permissionMessage: {},
            showAdministrator: true,
            showRole: false,
            administratorSelected: true,
            roleSelected: false,
        };

        $scope.events = {
            /**
             *  切换账号基础信息
             * @param a
             * @param b
             * @param c
             */
            viewAdministrator: function (e) {
                findAdministratorMessage();
                $scope.model.showAdministrator = true;
                $scope.model.showRole = false;

                $scope.model.administratorSelected = true;
                $scope.model.roleSelected = false;
            },
            /**
             *  切换所属角色权限
             */
            viewshowRole: function (e) {
                findRoleMessage();
                findPermissionMessage();

                $scope.model.showRole = true;
                $scope.model.showAdministrator = false;

                $scope.model.roleSelected = true;
                $scope.model.administratorSelected = false;
            },

            /**
             * 返回管理员界面
             * @param e
             */
            goAdministratorManage: function (e) {
                e.preventDefault();
                $state.go('states.lecturerManage');
            }

        };


        //=============分页开始=======================
        var gridRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td>');
            result.push('#: index #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: trainingSchemeName #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: continueEducationYear #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: subject #');
            result.push('</td>');

            result.push('<td>');
            result.push('#: planName #');
            result.push('</td>');

            result.push('<td>');
            result.push('#:startTime #'+'至'+ '#:endTime #');
            result.push('</td>');

            result.push('</tr>');
            gridRowTemplate = result.join('');
        })();

        $scope.node = {
            lessonGrid: null,
        }

        $scope.ui = {
            lessonGrid: {
                options: {
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(gridRowTemplate),
                    scrollable: false,
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/lecturerManage/findPlanItemsByUserId/'+$stateParams.administratorId,
                                data: function (e) {
                                    var temp = {
                                        pageNo: e.page,
                                        pageSize: e.pageSize
                                    };
                                    return temp;
                                },
                                dataType: 'json'
                            }

                        },
                        pageSize: 10, // 每页显示的数据数目
                        schema: {
                            // 数据源默认绑定的字段
                            // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                            // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                            // 优先与后面的data执行，返回的数据为下面data上面的参数response
                            parse: function (response) {
                                // 将会把这个返回的数组绑定到数据源当中
                                if (response.status) {
                                    var dataview = response.info, index = 1;
                                    angular.forEach(dataview, function (item) {
                                        item.index = index++;
                                    });
                                }
                                return response;
                            },
                            total: function (response) {
                                return response.totalSize;
                            },
                            data: function (response) {
                                return response.info;
                            } // 指定数据源
                        },
                        serverPaging: true, //远程获取书籍
                        serverSorting: true //远程排序字段
                    },
                    selectable: true,
                    sortable: {
                        mode: 'single',
                        allowUnsort: false
                    },
                    dataBinding: function (e) {
                        $scope.model.gridReturnData = e.items;
                        kendoGrid.nullDataDealLeaf(e);
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
                        pageSize: 10,
                        buttonCount: 10
                        //change: function (e) {
                        //    $scope.model.page.pageNo = parseInt(e.index, 10);
                        //    //== !!important!! 这里重复了page(1)的作用
                        //    // $scope.node.lessonGrid.dataSource.read();
                        //}
                    },
                    // 选中切换的时候改变选中行的时候触发的事件
                    columns: [
                        {title: 'No', width: 50 },
                        {sortable: false, field: 'typeName', title: '培训班名称', width: 200},
                        {sortable: false, field: 'name', title: '继续教育年度', width: 100},
                        {sortable: false, field: 'period', title: '科目', width: 100},
                        {sortable: false, field: "teacherName", title: "授课课程名称", width: 200 },
                        {sortable: true, field: 'studyCount', title: '授课时间', width: 250}
                    ]
                }
            }
        };
        $scope.ui.lessonGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.lessonGrid.options);

        //获取角色
        function findRoleMessage () {
            lecturerManageService.getUserRoleListString($stateParams.administratorId).then(function (data) {
                if (data.status) {
                    $scope.model.roleMessage = data.info;
                } else {
                    $scope.globle.showTip(data.info, 'error');
                }
            });
        }

        //获取安全对象
        function findPermissionMessage () {
            roleManageService.getPermissionByAdministratorId($stateParams.administratorId).then(function (data) {
                if (data.status) {
                    $scope.model.permissionMessage = data.info;
                } else {
                    $scope.globle.showTip(data.info, 'error');
                }

            });
        }

        function findAdministratorMessage () {
            lecturerManageService.getUserInfoByUserId($stateParams.administratorId).then(function (data) {
                if (data.status) {
                    $scope.model.userMessage = data.info;
                } else {
                    $scope.globle.showTip(data.info, 'error');
                }

            });
        }

        function init () {
            findAdministratorMessage();
        }

        init();
    }];

});
