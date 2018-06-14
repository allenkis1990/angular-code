/*
define(['@systemUrl@/js/modules/paymentAccount/paymentAdd/controllers/paymentAdd-ctrl'],function (controllers) {
    'use strict';
    angular.module('app.admin.states.paymentAdd.main', [])
        .controller('app.admin.states.paymentAdd.indexCtrl', controllers.indexCtrl);
});
*/

define(['@systemUrl@/js/modules/paymentAccount/paymentDetail/controllers/paymentDetail-ctrl'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.paymentDetail.main', [])


        .controller('app.admin.states.paymentDetail.indexCtrl', controllers.indexCtrl);
});