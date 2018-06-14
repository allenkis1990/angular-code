/**
 * Created by ljl on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/lesson');
        });

        return {
            saveCourseOutline: function (courseOutline) {
                return base.all('createCourseOutline').post(courseOutline);
            }
        };
    }];
});
