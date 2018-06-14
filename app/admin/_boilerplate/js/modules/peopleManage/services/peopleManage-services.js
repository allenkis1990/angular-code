/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/adminAccountAction');
        });
        var baseOne = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/unitUserManage');
        });
        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/asynQueImport/');
        });
        //var employeeOne = base.one('employee'),
        //    employeeAll = base.all('employee');

        return {
            getAdminAccountList: function (params) {
                return base.one('findByQuery').get(params);
            },
            isUserExist: function (IDNum) {
                return baseOne.one('isUserExist').get(IDNum);
            },
            addUserToUnit: function (params) {
                return baseOne.all('addUserToUnit').post(params);
            },
            downloadTemplate: function () {
                return b.one('getDownLoadIp').get();
            },
            importUnitUser: function (params) {
                return baseOne.all('importUnitUser').post(params);
            },
            getUserInfoById: function (params) {
                return baseOne.one('getUserInfoById').get(params);
            },
            deleteUnitUser: function (params) {
                return baseOne.one('deleteUnitUser').get(params);
            },

        };

    }]
});
