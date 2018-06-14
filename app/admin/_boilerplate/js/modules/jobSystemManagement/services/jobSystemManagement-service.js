/**
 * Created by Administrator on 2015/7/29.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/job');
        });

        return {

            queryJob: function (keyword) {
                return base.one('queryJob').get({keyword: keyword});
            },
            listJobGradeLesson: function (jobGradeId, lessonName) {
                return base.one('listJobGradeLesson/' + jobGradeId).get({lessonName: lessonName});
            },
            /*save: function(adminAccount, typeid) {
             //return Restangular.all("create").post(adminAccount);
             return Restangular.one("/web/admin/adminAccountAction/create").customPOST({adminAccount: adminAccount, typeid: typeid}, undefined, undefined, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
             }*/
            save: function (adminAccount) {
                return base.all('create').post(adminAccount);
            },
            enable: function (userId) {
                return base.one('enable').get({userId: userId});
            },
            enables: function (userIdList) {
                return base.all('enables').post(userIdList);
            },
            suspend: function (userId) {
                return base.one('suspend').get({userId: userId});
            },
            suspends: function (userIdList) {
                return base.all('suspends').post(userIdList);
            },
            fire: function (userId) {
                return base.one('fire').get({userId: userId});
            },
            fires: function (userIdList) {
                return base.all('fires').post(userIdList);
            },
            reset: function (userId) {
                return base.one('reset').get({userId: userId});
            },
            resets: function (userIdList) {
                return base.all('resets').post(userIdList);
            },
            remove: function (userId) {
                return base.one('delete').get({userId: userId});
            }

        };
    }];
});
