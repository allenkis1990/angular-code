define(['@systemUrl@/js/modules/summary/humanActivation/controllers/humanActivation-ctrl', '@systemUrl@/js/modules/summary/class.common'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.humanActivation.main', ['class.common'])
        .controller('app.admin.states.humanActivation.indexCtrl', controllers.indexCtrl)

        .directive('listInput', [function () {
            return {
                link: function ($scope, element, attr, ctrl) {
                    $scope.$watchCollection(attr.listInput, function (value) {
                        if (value && angular.isArray(value)) {
                            var finallyValue = value.join(',');
                            $(element).val(finallyValue)

                                .attr('title', finallyValue);
                        }
                    });
                }
            };
        }]);
});