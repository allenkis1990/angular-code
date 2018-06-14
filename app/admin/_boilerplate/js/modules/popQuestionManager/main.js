define(['angular',
        '@systemUrl@/js/modules/popQuestionManager/controllers/popQuestionManager-ctrl',
        '@systemUrl@/js/modules/popQuestionManager/controllers/popQuestionManagerEdit-ctrl',
        '@systemUrl@/js/modules/popQuestionManager/services/popQuestionManager-service',


        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons',
        '@systemUrl@/js/const/global-constants'
    ],

    function (angular, popQuestionManagerCtrl, popQuestionManagerEditCtrl, popQuestionManagerService) {
        'use strict';
        return angular.module('app.popQuestionManager', ['kendo.ui.constants', 'kendo.ui.commons'])
            .controller('app.popQuestionManager.popQuestionManagerCtrl', popQuestionManagerCtrl)
            .controller('app.popQuestionManager.popQuestionManagerEditCtrl', popQuestionManagerEditCtrl)


            .factory('popQuestionManagerService', popQuestionManagerService)

            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
                hbBasicData.setResource();
            }]);
    });