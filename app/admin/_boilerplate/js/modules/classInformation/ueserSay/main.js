define(['@systemUrl@/js/modules/classInformation/ueserSay/controllers/ueserSay-ctrl',
    '@systemUrl@/js/modules/messageReply/services/messageReply-service',
    '@systemUrl@/js/modules/messageReply/hbBootstrap'], function (controllers, messageReplyService) {
    'use strict';
    angular.module('app.admin.states.ueserSay.main', ['ui.bootstrap'])

        .controller('app.admin.states.ueserSay.indexCtrl', controllers.indexCtrl)


        .factory('messageReplyService', messageReplyService);
});