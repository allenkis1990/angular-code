/**
 * Created by admin on 2015/5/11.
 */
define(['angular',
    '@systemUrl@/js/modules/menu1/controllers/menu1-ctrl',
    'kendo/kendo.grid',
    'kendo/kendo.treeview',
    'angularSanitize',
    'angularResource'
], function (angular, menuCtrl) {
    'use strict';
    return angular.module('app.menu1', ['ngSanitize', 'ngResource'])

        .controller('app.menu1.menu1Ctrl', menuCtrl);

});
