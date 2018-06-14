/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/teacher');
        });
        return {
            //查询
            getTeacherList: function (queryParams) {
                return base.one('findByQuery').get(queryParams);
            },
            //根据ID查询
            queryByUserId: function (userId) {
                return base.one('queryByUserId').get({userId: userId});
            },
            //更新
            update: function (adminAccount) {
                return base.all('update').post(adminAccount);
            },
            //新增
            save: function (adminAccount) {
                return base.all('create').post(adminAccount);
            },
            //单个启用
            enable: function (userId) {
                return base.one('enable').get({userId: userId});
            },
            //批量启用
            enables: function (userIdList) {
                return base.all('enables').post(userIdList);
            },
            //单个停用
            suspend: function (userId) {
                return base.one('suspend').get({userId: userId});
            },
            //批量停用
            suspends: function (userIdList) {
                return base.all('suspends').post(userIdList);
            },
            //单个注销
            fire: function (userId) {
                return base.one('fire').get({userId: userId});
            },
            //批量注销
            fires: function (userIdList) {
                return base.all('fires').post(userIdList);
            },
            //单个重置密码
            reset: function (userId) {
                return base.one('reset').get({userId: userId});
            },
            //批量注销密码
            resets: function (userIdList) {
                return base.all('resets').post(userIdList);
            }
        };
    }];
});
