define(['@systemUrl@/js/modules/messageReply/controllers/messageReply-ctrl',
    '@systemUrl@/js/modules/messageReply/services/messageReply-service',
    '@systemUrl@/js/modules/messageReply/hbBootstrap'], function (controllers, messageReplyService) {
    'use strict';
    angular.module('app.admin.states.messageReply.main', ['ui.bootstrap'])

        .controller('app.admin.states.messageReply.indexCtrl', controllers.indexCtrl)

        .factory('messageReplyService', messageReplyService);
});