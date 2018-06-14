/**
 * Created by Administrator on 2015/8/2.
 */
define(function () {
    'use strict';
    return ['$scope', 'feedbackService', '$stateParams', '$state',
        function ($scope, feedbackService, $stateParams, $state) {

            $scope.model = {
                feedbackDto: {}
            };
            $scope.pictures = '';

            feedbackService.queryById($stateParams.id).then(function (data) {
                $scope.model.feedback = data.info;
                $scope.pictures = data.info.edPictures;
            });

            $scope.events = {
                update: function (e) {
                    e.preventDefault();

                    if ($scope.feedbackForm.reply.$error.required) {
                        $scope.feedbackForm.reply.$dirty = true;
                        return;
                    }

                    var edit = $scope.model.feedback;
                    $scope.model.feedbackDto.id = $scope.model.feedback.id;
                    $scope.model.feedbackDto.answerReply = $scope.model.feedback.answerReply;
                    $scope.model.feedbackDto.sendEmail = $scope.isSendEmail;
                    $scope.model.feedbackDto.email = $scope.model.feedback.email;
                    $scope.model.feedbackDto.userId = $scope.model.feedback.userId;
                    $scope.model.feedbackDto.userName = $scope.model.feedback.userName;
                    if ($scope.feedbackForm.$valid) {
                        feedbackService.update($scope.model.feedbackDto).then(function (response) {
                            if (response.status) {
                                $scope.globle.alert('提示', '回复成功');
                                $state.go('states.feedback').then(function () {
                                    $state.reload();
                                });
                            } else {
                                $scope.globle.alert('提示', response.info);
                            }
                        });
                    }
                }
            };
        }];
});
