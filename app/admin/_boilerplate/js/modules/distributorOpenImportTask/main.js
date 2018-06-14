define(
    [
        '@systemUrl@/js/modules/distributorOpenImportTask/controllers/distributorOpenImportTask-ctrl',
        '@systemUrl@/js/modules/distributorOpenImportTask/services/distributorOpenImportTask-services',
        '@systemUrl@/js/modules/questionManage/services/question-service',
        'common/hbWebUploader'
    ],
    function (controllers, openImportTaskService, questionService) {
        'use strict';
        angular.module('app.admin.states.distributorOpenImportTask.main', [])
            .controller('app.admin.states.distributorOpenImportTask.indexCtrl', controllers.indexCtrl)
            .factory('openImportTaskService', openImportTaskService)
            .factory('questionService', questionService)
            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
                hbBasicData.setResource();
            }]);
    }
);