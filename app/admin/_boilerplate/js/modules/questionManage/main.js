define(['angular',
        '@systemUrl@/js/modules/questionManage/controllers/question-ctrl',
        '@systemUrl@/js/modules/questionManage/controllers/question-add-ctrl',
        '@systemUrl@/js/modules/questionManage/controllers/question-edit-ctrl',
        '@systemUrl@/js/modules/questionManage/services/question-service',

        'prometheus/directives/dynamic-name',

        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/const/global-constants',
        'angularSanitize',
        '@systemUrl@/js/services/kendoui-commons',
        'common/hbWebUploader'
    ],
    function (angular, questionCtrl, questionAddCtrl, quesitonEditCtrl, questionService, dynamicNameDirective) {
        'use strict';
        return angular.module('app.questionManage', ['kendo.ui.constants', 'kendo.ui.commons', 'ngSanitize', 'hb.webUploader'])

            .controller('app.questionManage.questionCtrl', questionCtrl)

            .controller('app.questionManage.addCtrl', questionAddCtrl)

            .controller('app.questionManage.editCtrl', quesitonEditCtrl)

            .factory('questionService', questionService)

            .directive('dynamicName', dynamicNameDirective)

            .directive('subQuestion', [function () {
                return {
                    restrict: 'A',
                    replace: true,
                    templateUrl: '@systemUrl@/views/exam/sub-question-tpl.html',
                    link: function (scope, element, attrs) {

                    }
                };
            }]);

        /*   .run ( ['$rootScope', '$http', 'hbBasicData', function ( $rootScope, $http, hbBasicData ) {
               hbBasicData.setResource ();
           }] )*/

    });
