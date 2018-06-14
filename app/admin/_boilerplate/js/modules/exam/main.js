define(['angular',
        '@systemUrl@/js/modules/exam/controllers/exam-ctrl',
        '@systemUrl@/js/modules/exam/controllers/answerPaper-ctrl',
        '@systemUrl@/js/modules/exam/services/exam-service',
        '@systemUrl@/js/modules/exam/controllers/paper-release-ctrl',
        '@systemUrl@/js/modules/exam/controllers/paper-continue-ctrl',
        'directives/remote-validate-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, examCtrl, answerPaperCtrl, examService, releaseCtrl, continueCtrl, validateDirective) {
        'use strict';
        return angular.module('app.library', []).controller('app.exam.examCtrl', examCtrl)
            .controller('app.exam.answerPaperCtrl', answerPaperCtrl)
            .controller('app.exam.releaseCtrl', releaseCtrl)
            .controller('app.exam.continueCtrl', continueCtrl)

            .factory('examService', examService)

            .directive('ajaxValidate', validateDirective);

    });
