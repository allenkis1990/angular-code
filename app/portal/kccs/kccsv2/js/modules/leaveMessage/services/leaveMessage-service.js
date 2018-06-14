/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/leaveMessagePortalAction');
        });
        return {
            findLeaveMessagePage: function (params) {
                return base.one('findLeaveMessagePage').get(params);
            },

            findProblemCategoryList: function (params) {
                return base.one('findProblemCategoryList').get(params);
            },

            createLeaveMessage: function (params) {
                return base.all('createLeaveMessage').post(params);
            },

            deleteLeaveMessage: function (params) {
                return base.one('deleteLeaveMessage').get(params);
            },

            addLeaveMessage: function (params) {
                return base.all('addLeaveMessage').post(params);
            }
        };
    }];
});
