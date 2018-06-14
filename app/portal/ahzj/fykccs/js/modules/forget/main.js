define(['ahzj/fykccs/js/modules/forget/controllers/forget-ctrl',
    'ahzj/fykccs/js/modules/forget/services/forget-service',
    'directives/remote-validate-directive'], function (forgetCtrl, forgetService) {
    'use strict';
    angular.module('app.portal.states.forget.main', [])
        .controller('forgetCtrl', forgetCtrl)
        .factory('forgetService', forgetService)
        .directive('validatePassword', [function () {
            return {
                scope: {
                    pass: '='
                },
                require: 'ngModel',
                link: function ($scope, ele, attr, ngModelController) {
                    ngModelController.$parsers.push(function (viewVal) {
                        if (viewVal !== $scope.pass) {
                            ngModelController.$setValidity('validatePassword', false);
                        } else {
                            ngModelController.$setValidity('validatePassword', true);
                        }

                        $scope.$watch('pass', function (newVal) {
                            if (newVal) {
                                if (viewVal !== newVal) {
                                    ngModelController.$setValidity('validatePassword', false);
                                } else {
                                    ngModelController.$setValidity('validatePassword', true);
                                }
                            }
                        });


                        return viewVal;
                    });

                }

            };
        }]);
});