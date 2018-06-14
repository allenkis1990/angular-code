define(['@systemUrl@/js/modules/message/controllers/message-ctrl',
    '@systemUrl@/js/modules/message/controllers/messageViews-ctrl',
    '@systemUrl@/js/modules/message/services/message-service'], function (controllers, messageViewsCtrl, messageService) {
    'use strict';
    angular.module('app.center.states.message.main', [])
        .controller('app.center.states.message.indexCtrl', controllers.indexCtrl)
        .controller('app.center.states.messageViews.indexCtrl', messageViewsCtrl)
        .factory('messageService', messageService)
        .filter('trustHtml', function ($sce) {
            return function (input) {
                return $sce.trustAsHtml(input);
            };
        });
});