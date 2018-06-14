define(function () {
    'use strict';
    return ['$scope', 'paperService', '$interval', '$state', function ($scope, paperService, $interval, $state) {
        $scope.paperTime = 10;
        var comeForm = $scope.$stateParams.comeForm;
        $scope.events = {
            continueRelease: function () {
                $interval.cancel($scope.timeTask);
                $state.go('states.practicePaperConfig.release', {examRange: -1, comeForm: comeForm});
            }
        };

        var utils = {
            startTimeTask: function () {
                $scope.timeTask = $interval(function () {
                    $scope.paperTime--;
                    if ($scope.paperTime == 0) {
                        $interval.cancel($scope.timeTask);
                        $scope.globle.stateGo('states.practicePaperConfig', '试卷管理');
                    }
                }, 1000);
            }
        };
        utils.startTimeTask();
    }];
});
