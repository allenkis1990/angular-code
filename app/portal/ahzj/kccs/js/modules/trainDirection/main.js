define(['ahzj/kccs/js/modules/trainDirection/controllers/trainDirection-ctrl',
    'ahzj/kccs/js/modules/trainDirection/controllers/detail-ctrl'], function (trainDirectionCtrl,detailCtrl) {
    'use strict';
    angular.module('app.portal.states.trainDirection.main', [])
        .controller('trainDirectionCtrl', trainDirectionCtrl)
        .controller('trainDirectionDetailCtrl', detailCtrl)

});