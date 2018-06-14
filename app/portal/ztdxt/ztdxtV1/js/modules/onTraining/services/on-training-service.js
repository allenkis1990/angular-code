/**
 * Created by Administrator on 2017/3/28/028.
 */
/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/index');
        });


        return {

            getSubjectOptions: function () {
                return base.one('getSubjectOptions').get();
            },

            getYearQueryOptions: function () {
                return base.one('getYearQueryOptions').get();
            },

            getCoursePoolInfos: function () {
                return base.one('getCoursePoolInfos').get();
            },
            findSalesCoursePage: function (params) {
                return base.one('findSalesCoursePage').get(params);
            },


            getCourseRelationBaseInfo: function (param) {
                return base.one('getCourseRelationBaseInfo').get(param);
            },

            getCourseInfo: function (param) {
                return base.one('getCourseInfo').get(param);
            },

            getProfessionYearQueryOptions: function () {
                return base.one('getProfessionYearQueryOptions').get();
            }


        };

    }];
});
