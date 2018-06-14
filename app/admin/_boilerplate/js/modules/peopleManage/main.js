define(['@systemUrl@/js/modules/peopleManage/controllers/peopleManage-ctrl',
        '@systemUrl@/js/modules/peopleManage/services/peopleManage-services',
        '@systemUrl@/js/services/kendoui-commons',
        'common/hbWebUploader'],
    function (peopleManageCtrl, peopleManageServices) {
        'use strict';
        angular.module('app.admin.states.peopleManage.main', ['kendo.ui.commons', 'hb.webUploader'])
            .controller('peopleManageCtrl', peopleManageCtrl)
            .factory('peopleManageServices', peopleManageServices)
            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {

                hbBasicData.setResource();

            }]);
    });
