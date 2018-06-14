/**
 * Created by linf on 2016/9/23 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var roleBase = Restangular.withConfig(function (config) {//用户的信息
            config.setBaseUrl('/web/admin/roleManage');
        });

        return {

            /**
             * 根据id获取角色
             */
            getRoleById: function (roleId) {
                return roleBase.one('getRoleById/' + roleId).get();
            },

            /**
             * 根据roleId获取对应的安全对象组
             */
            getPermissionByRoleId: function (roleId) {
                return roleBase.one('getPermissionByRoleId/' + roleId).get();
            },


            /**
             * 根据roleId获取对应的安全对象组--编辑角色
             */
            getPermissionForEditRole: function (roleId) {
                return roleBase.one('getPermissionForEditRole/' + roleId).get();
            },

            /**
             * 根据administratorId获取对应的安全对象组
             */
            getPermissionByAdministratorId: function (administratorId) {
                return roleBase.one('getPermissionByAdministratorId/' + administratorId).get();
            },

            /**
             * 获取所有安全对象
             */
            getAllPermission: function () {
                return roleBase.one('getAllPermission').get();
            },


            /**
             * 保存角色
             */
            saveRole: function (roleMessage, nodeSelectedIdArray, itemSelectedIdArray, rootSelectedIdArray) {
                return roleBase.all('saveRole').post({
                    'roleMessage': roleMessage,
                    'nodeSelectedIdArray': nodeSelectedIdArray,
                    'itemSelectedIdArray': itemSelectedIdArray,
                    'rootSelectedIdArray': rootSelectedIdArray
                });
            },

            /**
             * 删除角色
             * @param administratorId
             * @param roleId
             * @returns {*|{}|{method, params, headers}}
             */
            deleteRole: function (roleId) {
                return roleBase.all('deleteRole/' + roleId).post();
            },

            /**
             * 获取角色集合
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            findAllRole: function () {
                return roleBase.one('findAllRole').get();
            }
        };
    }];
});
