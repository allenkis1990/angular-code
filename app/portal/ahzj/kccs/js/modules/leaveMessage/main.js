define(['ahzj/kccs/js/modules/leaveMessage/controllers/leaveMessage-ctrl',
    'ahzj/kccs/js/modules/leaveMessage/services/leaveMessage-service'], function (leaveMessageCtrl, leaveMessageService) {
    'use strict';
    angular.module('app.portal.states.leaveMessage.main', [])
        .controller('leaveMessageCtrl', leaveMessageCtrl)
        .factory('leaveMessageService', leaveMessageService);
});