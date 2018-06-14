/**
 * Created by wangzy on 2015/8/1.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/notice');
        });
        return {
            //保存新增公告
            save: function (param) {
                return base.all('create').post(param);
            },
            //删除一条公告记录
            del: function (param) {
                return base.one('deleteById').get(param);
            },
            //获取通知公告数据
            findById: function (param) {
                return base.one('get').get(param);
            }
        };
    }];
});
