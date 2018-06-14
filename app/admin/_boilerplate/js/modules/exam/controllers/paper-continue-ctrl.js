define(function () {
    'use strict';
    return ['$scope', 'examService', '$interval', '$state', function ($scope, examService, $interval, $state) {
        $scope.paperTime = 10;
        var comeForm = $scope.$stateParams.comeForm;
        $scope.events = {
            continueRelease: function () {
                $interval.cancel($scope.timeTask);
                $state.go('states.exam.release', {examRange: -1, comeForm: comeForm});
            },
            goBack: function () {
                $state.go('states.exam').then(function () {
                    $state.reload($state.current);
                });
            }
        };

        /*var utils={
            startTimeTask:function(){
                $scope.timeTask=$interval(function() {
                    $scope.paperTime--;
                    if($scope.paperTime==0){
                        $interval.cancel($scope.timeTask);
                        $scope.globle.stateGo('states.exam', '考试管理')
                    }
                }, 1000);
            }
        }
        utils.startTimeTask();*/
    }];
});
