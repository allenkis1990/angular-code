/** * Created by admin on 2015/5/11.*/
define(['angular',
    '@systemUrl@/js/modules/normal/controllers/normal-ctrl',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons',
    'lodash'
], function (angular, normalCtrl) {
    'use strict';
    return angular.module('app.normal', ['kendo.ui.constants', 'kendo.ui.commons'])
        .controller('app.normal.normalCtrl', normalCtrl);
});
