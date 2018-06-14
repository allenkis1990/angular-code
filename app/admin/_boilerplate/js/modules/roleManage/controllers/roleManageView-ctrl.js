define(function () {
    'use strict';
    return ['$scope', 'roleManageService', '$stateParams', '$state', 'hbUtil',
        function ($scope, roleManageService, $stateParams, $state, hbUtil) {
            $scope.model = {
                permissionMessage: {},
                roleMessage: {},
                page: {
                    pageNo: 1,
                    pageSize: 10
                }

            };

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
                }

            };


            function findRoleMessage () {
                $scope.model.showReturn = $stateParams.type == 1 ? true : false;

                roleManageService.getRoleById($stateParams.roleId).then(function (data) {
                    if (data.status) {
                        $scope.model.roleMessage = data.info;
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }
                });
            }

            function findPermissionMessage () {
                roleManageService.getPermissionByRoleId($stateParams.roleId).then(function (data) {
                    if (data.status) {
                        $scope.model.permissionMessage = data.info;
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }

                });
            }

            function init () {
                findRoleMessage();
                findPermissionMessage();
            }

            init();


            //关联的管理员

            var configedGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td >');
                result.push('#:index #');
                result.push('</td>');


                result.push('<td>');
                result.push('#:name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: loginAccount #');
                result.push('</td>');


                result.push('<td>');
                result.push('<span ng-if="#:status==1#">可用</span>' + '<span ng-if="#:status==2#">停用</span>' + '<span ng-if="#:status==3#">停用</span>');

                result.push('</td>');
                result.push('</tr>');
                configedGridRowTemplate = result.join('');
            })();

            $scope.configedGrid = {
                options: hbUtil.kdGridCommonOption({
                    template: configedGridRowTemplate,
                    url: '/web/admin/roleManage/findUsersByRoleId/' + $stateParams.roleId,
                    scope: $scope,
                    page: 'page',
                    fn: function (response) {
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {field: 'name', title: '管理员姓名', sortable: false, width: 100},
                        {field: 'loginAccount', title: '账号', sortable: false, width: 200},
                        {field: 'status', title: '状态', sortable: false, width: 80}
                    ]
                })
            };
        }];

});
