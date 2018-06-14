/**
 * Created by choaklin on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/employee');
        });

        return {
            findEmployeePage: function (params) {
                return base.one('index').get(params);
            },

            getUserQuantity: function (status) {
                var params = {status: status};
                return base.one('getUserQuantity').get(params);
            },

            save: function (employee) {
                return base.all('create').post(employee);
            },

            findById: function (userId) {
                return base.one('get/' + userId).get();
            },

            update: function (employee) {
                return base.all('update/' + employee.userId).post(employee);
            },

            enable: function (userId) {
                return base.one('enable/' + userId).get();
            },

            suspend: function (userId) {
                return base.one('suspend/' + userId).get();
            },

            fire: function (userId) {
                return base.one('fire/' + userId).get();
            },

            remove: function (userId) {
                return base.one('delete/' + userId).get();
            },

            resetPassword: function (userId) {
                return base.one('resetPassword/' + userId).get();
            },

            batchEnable: function (userIdList) {
                return base.all('batchEnable').post(userIdList);
            },

            batchSuspend: function (userIdList) {
                return base.all('batchSuspend').post(userIdList);
            },

            batchFire: function (userIdList) {
                return base.all('batchFire').post(userIdList);
            },

            batchResetPassword: function (userIdList) {
                return base.all('batchResetPassword').post(userIdList);
            }
        };
    }];
});
