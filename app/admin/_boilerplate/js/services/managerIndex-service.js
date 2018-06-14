/**
 * Created by wangzy on 2015/8/1.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/managerIndex');
        });
        return {
            //获取学习之星数据
            getLearningStar: function (param) {
                return base.one('getLearningStar').get(param);
            },
            //获取通知公告数据
            getNotice: function () {
                return base.one('getNotice').get();
            },
            //获取最受欢迎课程数据
            getPopularCourse: function (pageParam) {
                return base.all('getPopularCourse').post(pageParam);
            },
            //获取热门选修课程数据
            getHotChooseCourse: function (pageParam) {
                return base.all('getHotChooseCourse').post(pageParam);
            }
        };
    }];
});
