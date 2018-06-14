define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/questionPracticeLibrary');
        });
        return {

            getPracticePath: function (params) {
                return base.one('getPracticePath').get(params);
            }

        };
    }];
});
