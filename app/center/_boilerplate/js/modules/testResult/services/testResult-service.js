/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/myExam');
        });
        return {
            getExamResultInfo: function (params) {
                return base.one('getExamResultInfo').get(params);
            }
        };
    }];
});
