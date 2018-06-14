define(
    [
        'angular',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/solution/services/solution-service',
        '@systemUrl@/js/modules/solution/controllers/solution-index',
        '@systemUrl@/js/modules/solution/controllers/solution-edit-new',
        '@systemUrl@/js/modules/solution/controllers/solution-view',
        '@systemUrl@/js/modules/solution/controllers/solution-send',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, validateDirective, solutionService,
              index, editNew, view, send) {
        'use strict';
        return angular.module('app.solution', [])
            .directive('ajaxValidate', validateDirective)
            .factory('solutionService', solutionService)

            .controller('app.solution.index', index)
            .controller('app.solution.editNew', editNew)
            .controller('app.solution.view', view)
            .controller('app.solution.send', send);
    }
);
