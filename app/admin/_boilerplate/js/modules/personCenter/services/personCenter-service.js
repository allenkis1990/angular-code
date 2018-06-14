/**
 * Created by Administrator on 2015/8/5.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/personCenter');
        });

        return {
            update: function (personCenter) {
                return base.all('update/' + personCenter.id).post(personCenter);
            },
            personInfo: function () {
                return base.one('personInfo').get();
            }
        };
    }];
});
