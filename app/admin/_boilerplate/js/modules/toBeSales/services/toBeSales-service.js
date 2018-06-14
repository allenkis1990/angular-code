/**
 * Created by ycy on 2017/4/10.
 */
define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('');
        });
        return {};
    }];
});