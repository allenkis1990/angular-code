/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/index');
        });
        return {
            getCoursePage: function (params) {
                return base.one('getCoursePage').get(params);
            },
            getCourseDetail: function (params) {
                return base.one('getCourseDetail').get(params);
            }
        };
    }];
});
