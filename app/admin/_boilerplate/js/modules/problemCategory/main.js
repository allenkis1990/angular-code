define(['@systemUrl@/js/modules/problemCategory/controllers/problemCategory-ctrl',
    '@systemUrl@/js/modules/problemCategory/services/problemCategory-service'], function (controllers, problemCategoryService) {
    'use strict';
    angular.module('app.admin.states.problemCategory.main', [])


        .controller('app.admin.states.problemCategory.indexCtrl', controllers.indexCtrl)

        .factory('problemCategoryService', problemCategoryService);
});