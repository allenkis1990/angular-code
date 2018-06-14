define([
    'angular',
    '@systemUrl@/js/const/global-constants',
    'directives/clearOperator-directive',
    '@systemUrl@/js/modules/feedback/controllers/feedback-ctrl',
    '@systemUrl@/js/modules/feedback/controllers/edit-controller',
    '@systemUrl@/js/modules/feedback/controllers/view-controller',
    '@systemUrl@/js/modules/feedback/services/feedback-service',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, global, clearOperatorDirective, feedbackCtrl, editController, viewController, feedbackService) {
    'use strict';
    return angular.module('app.feedback', [])
        .constant('global', global)
        .controller('app.feedback.editController', editController)
        .controller('app.feedback.viewController', viewController)
        .controller('app.feedback.feedbackCtrl', feedbackCtrl)
        .directive('clearOperator', clearOperatorDirective)
        .factory('feedbackService', feedbackService)
        ;
});
