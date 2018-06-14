/**
 * Created by hb on 2017/3/12.
 */

define(function () {
    'use strict';

    angular.module('app.singleQuestion', [])
    /**
     *
     */
        .directive('wpfSideTool', ['app.practice.practiceService', 'HB_notification', function (practiceService, HB_notification) {
            return {
                scope: {
                    bizParams: '=',
                    restCount: '=',
                    showAnswer: '=',
                    questionPaper: '='
                },
                templateUrl: '/center/@systemUrl@/views/exam/singleQuestion/sideTool.html',
                link: function ($scope) {
                    $scope.toggle = function (flag, $event) {
                        $event.preventDefault();
                        $scope.showAnswer = flag;
                    };
                    $scope.top = function ($event) {
                        $event.preventDefault();
                        $('#scroll_element').stop().animate({
                            scrollTop: 0
                        });
                    };
                    var submit = function (submitQuestions) {
                        practiceService.submitQuestions(submitQuestions)

                            .then(function (data) {
                                if (data.status) {
                                    $scope.submitted = true;
                                    if ($scope.bizParams.redirectUrl) {
                                        location.replace($scope.bizParams.redirectUrl);
                                    } else {
                                        // 倒计时
                                    }
                                } else {

                                }
                            });
                    };
                    $scope.submit = function ($event) {
                        $event.preventDefault();

                        var submitQuestions = practiceService.count($scope.questionPaper, $scope.bizParams.situations);

                        if ($scope.questionPaper.length - submitQuestions.length === 0) {
                            HB_notification.confirm('请确认是否提交？', function () {
                                submit(submitQuestions);
                            });
                        } else {
                            HB_notification.confirm('尚有' + ($scope.questionPaper.length - submitQuestions.length) + '试题未做答，确认是否提交？', function () {
                                submit(submitQuestions);
                            });
                        }

                    };
                }
            };
        }])
        .directive('wpfQuestion', [function () {
            return {
                scope: {total: '@', restCount: '=', questionPaper: '=', bizParams: '='},
                controller: ['app.practice.practiceService', 'questionType', '$scope', function (practiceService, questionType, $scope) {

                    function findIndex (array, item) {
                        for (var i = 0; i < array.length; i++) {
                            if (array[i] === item) {
                                return i;
                            }
                        }
                        return -1;
                    }

                    this.submit = function submit (question) {
                        var submitParams = {
                            questionId: question.id,
                            userAnswers: question.userAnswers
                        };
                        practiceService.submitQuestion(submitParams);
                    };

                    var me = this;

                    this.answerQuestion = function (question, id, /** */ $event, option) {
                        question.userAnswers = question.userAnswers || [];
                        switch (question.questionType) {
                            case questionType.RADIO:
                            case questionType.OPINION:
                                question.answered = true;
                                question.userAnswers = [id];
                                break;
                            case questionType.MULTIPLE:
                                var answer = $event.target.checked;
                                option.answered = answer;
                                if (!answer) {
                                    question.userAnswers.splice(findIndex(question.userAnswers, id), 1);
                                    question.userAnswers.length === 0 && (question.answered = false);
                                } else {
                                    if (findIndex(question.userAnswers, id) === -1) {
                                        question.userAnswers.push(id);
                                        question.answered = true;
                                    }
                                }
                                break;
                        }


                        $scope.restCount = $scope.questionPaper.length - practiceService.count($scope.questionPaper, $scope.bizParams.situations).length;

                        // me.submit(question);
                    };
                }]
            };
        }])


        .directive('wpfJudge', [function () {
            return {
                replace: true,
                require: '^?wpfQuestion',
                scope: {
                    index: '=',
                    question: '='
                },
                templateUrl: '/center/@systemUrl@/views/exam/singleQuestion/wpfJudge.html'
            };
        }])

        .directive('wpfSingle', [function () {
            return {
                replace: true,
                require: '^?wpfQuestion',
                scope: {
                    index: '=',
                    question: '='
                },
                templateUrl: '/center/@systemUrl@/views/exam/singleQuestion/wpfSingle.html'
            };
        }])

        .directive('wpfMulti', [function () {
            return {
                replace: true,
                require: '^?wpfQuestion',
                scope: {
                    index: '=',
                    question: '='
                },
                templateUrl: '/center/@systemUrl@/views/exam/singleQuestion/wpfMulti.html'
            };
        }]);
});
