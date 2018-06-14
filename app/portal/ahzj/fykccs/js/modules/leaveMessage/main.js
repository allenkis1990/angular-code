define(['ahzj/fykccs/js/modules/leaveMessage/controllers/leaveMessage-ctrl',
    'ahzj/fykccs/js/modules/leaveMessage/services/leaveMessage-service'], function (leaveMessageCtrl, leaveMessageService) {
    'use strict';
    angular.module('app.portal.states.leaveMessage.main', [])
        .controller('leaveMessageCtrl', leaveMessageCtrl)
        .factory('leaveMessageService', leaveMessageService);
});