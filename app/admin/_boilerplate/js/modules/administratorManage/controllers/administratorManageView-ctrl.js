define(function () {
    'use strict';
    return ['$scope', 'roleManageService', 'administratorManageService', '$stateParams', '$state', function ($scope, roleManageService, administratorManageService, $stateParams, $state) {
        $scope.model = {
            userMessage: {},
            roleMessage: {},
            permissionMessage: {},
            showAdministrator: true,
            showRole: false,
            administratorSelected: true,
            roleSelected: false

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
                $state.go('states.administratorManage');
            }

        };

        //获取角色
        function findRoleMessage () {
            administratorManageService.getUserRoleListString($stateParams.administratorId).then(function (data) {
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
            administratorManageService.getUserInfoByUserId($stateParams.administratorId).then(function (data) {
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
