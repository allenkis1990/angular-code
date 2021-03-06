define(['kccs/kccsv2/js/modules/helpCenterMobile/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.helpCenterMobile', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.helpCenterMobile', {
                url: '/accountant.helpCenterMobile', /*/:id*/
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/helpCenterMobile/helpCenterMobile.html',
                        controller: 'helpCenterMobileCtrl'
                    },
                    'topView@': {
                        template: '<div></div> '

                    },
                    'footerView@': {
                        template: '<div></div>'

                    }
                }

            }).state('states.accountant.helpCenterMobile.helpCenterMobileDetail', {
                url: '/accountant.helpCenterMobile.helpCenterMobileDetail/:id/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/helpCenterMobile/helpCenterMobileDetail.html',
                        controller: 'helpCenterMobileDetailCtrl'
                    }
                }
            });
        }]);
});
