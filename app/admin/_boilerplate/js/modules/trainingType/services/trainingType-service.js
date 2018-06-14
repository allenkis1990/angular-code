/**
 * Created by WDL on 2015/9/23.
 */
define(function () {
    'use strict';
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/trainingTypeAction');
        });
        return {
            getTrainingTypes: function (nodeId) {
                return base.one('getTrainingType').get({categoryId: nodeId});
            },
            updateTrainingType: function (trainingTypeAdd) {
                return base.all('updateTrainingType').post(trainingTypeAdd);
            },
            saveTrainingType: function (trainingTypeAdd) {
                return base.all('addTrainingType').post(trainingTypeAdd);
            },
            deleteLessonType: function (nodeId) {
                return base.one('delete').get({categoryId: nodeId});
            }
        };
    }];
});
