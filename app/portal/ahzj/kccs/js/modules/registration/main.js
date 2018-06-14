define(['ahzj/kccs/js/modules/registration/controllers/registration-ctrl',
    'ahzj/kccs/js/modules/registration/services/registration-service',
    'directives/remote-validate-directive',
    'common/hbWebUploader'], function (registrationCtrl, registrationService, remoteValidate) {
    'use strict';
    angular.module('app.portal.states.registration.main', ['hb.webUploader'])
        .controller('registrationCtrl', registrationCtrl)
        .factory('registrationService', registrationService)

        .directive('ajaxValidate', remoteValidate)

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
        }])

        .directive('validateArea', [function () {
            return {
                scope: {
                    areaModel: '='
                },
                require: 'ngModel',
                link: function ($scope, ele, attr, ngModelController) {
                    //ngModelController.$setValidity('validateArea',false);
                    $scope.$watch('areaModel', function (newVal) {


                        if (newVal === '' || newVal === null || newVal === undefined) {
                            //console.log('变');
                            ngModelController.$setValidity('validateArea', false);
                        } else {
                            ngModelController.$setValidity('validateArea', true);
                        }

                    });

                }

            };
        }])

        .directive('validateEducation', [function () {
            return {
                scope: {
                    educationModel: '='
                },
                require: 'ngModel',
                link: function ($scope, ele, attr, ngModelController) {
                    //ngModelController.$setValidity('validateArea',false);
                    $scope.$watch('educationModel', function (newVal) {


                        if (newVal === '' || newVal === null || newVal === undefined) {
                            //console.log('变');
                            ngModelController.$setValidity('validateEducation', false);
                        } else {
                            ngModelController.$setValidity('validateEducation', true);
                        }

                    });

                }

            };
        }]);


});