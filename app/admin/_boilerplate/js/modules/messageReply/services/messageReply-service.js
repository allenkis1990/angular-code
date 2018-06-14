define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/leaveMessageAdminAction');
        });

        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/problemCategoryAction');
        });


        return {

            findLeaveMessagePage: function (param) {
                return a.one('findLeaveMessagePage').get(param);
            },

            saveReply: function (param) {
                return a.all('saveReply').post(param);
            },

            updateReply: function (param) {
                return a.all('updateReply').post(param);
            },

            findProblemCategoryList: function (param) {
                return b.one('findProblemCategoryList').get(param);
            },

            findLeaveMessageList: function (param) {
                return a.one('findLeaveMessageList').get(param);
            },

            setFinish: function (param) {
                return a.one('setFinish').get(param);
            }


        };
    }];
});
