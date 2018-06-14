define(['angular',
        '@systemUrl@/js/modules/questionLibrary/controllers/question-library-ctrl',
        '@systemUrl@/js/modules/questionLibrary/services/question-library-service',
        'directives/remote-validate-directive'
    ],
    function (angular, questionLibraryCtrl, questionLibraryService, validateDirective) {
        'use strict';
        return angular.module('app.library', []).controller('app.library.questionLibraryCtrl', questionLibraryCtrl)


            .factory('questionLibraryService', questionLibraryService)

            .directive('ajaxValidate', validateDirective);

    });
