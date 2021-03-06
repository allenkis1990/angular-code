define(function () {
    'use strict';
    return ['$scope', 'paperService', '$state', function ($scope, paperService, $state) {
        var paper = $scope.$stateParams;
        if (paper) {
            paper.examRange = -1;
            paper.comeForm = '1';
        }
        $scope.events = {
            release: function () {
                $state.go('states.practicePaperConfig.release', paper);
            },
            reload: function () {
                $state.go('states.practicePaperConfig').then(function () {
                    $state.reload($state.current);
                });
            }
        };
    }];
});
