/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/25
 * 时间: 16:33
 *

 */
define(function () {
    return ['Restangular', function (Restangular) {
        Restangular.withConfig(function (config) {
            config.setBaseUrl('datas');
        });
        var one = Restangular.one('validator.json');
        return {
            getValidatorTest: function () {
                return one.get();
            }

        };
    }];
});
