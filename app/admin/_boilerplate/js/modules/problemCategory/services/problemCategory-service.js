define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/problemCategoryAction');
        });


        return {

            addProblemCategory: function (param) {
                return a.all('addProblemCategory').post(param);
            },

            existName: function (param) {
                return a.one('existName').get(param);
            },

            findProblemCategoryList: function (param) {
                return a.one('findProblemCategoryList').get(param);
            },

            deleteProblemCategory: function (param) {
                return a.one('deleteProblemCategory').get(param);
            },

            updateProblemCategory: function (param) {
                return a.all('updateProblemCategory').post(param);
            }


        };
    }];
});
