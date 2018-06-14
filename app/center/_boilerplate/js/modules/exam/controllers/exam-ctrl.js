define(function () {
    'use strict';
    return {
        indexCtrl: ['$scope', '$http', '$stateParams', 'examConstant', '$rootScope',
            function ($scope, $http, $stateParams, examConstant, $rootScope) {
                $scope.questionTypeList = [
                    {type: -1, name: '全部'},
                    {type: 2, name: '单选题'},
                    {type: 3, name: '多选题'},
                    {type: 1, name: '判断题'}
                    // ,
                    // {type: 25, name: '测试'}
                ];
                $rootScope.examModel = {};
                $scope.model = {
                    pageNo: 1,
                    total: 10,//数据总条数 这个去后端拿
                    maxSize: 5,//最多可见页数按钮5个
                    pageSize: 20,//每页显示1条 默认10条
                    courseList: [],
                    totalPageSize: 0
                };

                $scope.questionType = {
                    OPINION: 1,
                    RADIO: 2,
                    MULTIPLE: 3,
                    getDesc: function (type) {
                        if (type === 1) {
                            return '判断题';
                        } else if (type === 2) {
                            return '单选题';
                        } else if (type === 3) {
                            return '多选题';
                        }
                    }
                };

                $scope.query = {
                    questionType: $scope.questionTypeList[0]
                };

                $scope.errors = {
                    queryResultMessage: ''
                };

                var errorMap = [
                    '您暂时还没有做过任何练习题',
                    '未查到任何$replace$的记录'
                ];
                $scope.events = {
                    loadingHistory: function () {
                        if (!$scope.loading) {
                            $scope.loading = true;
                            $http.get('/web/front/questionPracticeLibrary/getHistoryPracticeQuestion', {
                                params: {
                                    schemeId: $stateParams.trainClassId,
                                    questionType: $scope.query.questionType.type,
                                    pageNo: $scope.model.pageNo,
                                    pageSize: $scope.model.pageSize
                                }
                            }).success(function (data) {
                                $scope.practicePaper = data.info;
                                $scope.model.total = data.totalSize;
                                if ($scope.query.questionType.type == -1) {
                                    console.log($rootScope.examModel);
                                    $rootScope.examModel.totalPractice = data.totalSize;
                                }

                                $scope.loading = false;
                                if ($scope.practicePaper.length <= 0) {
                                    if ($scope.query.questionType.type == -1) {
                                        $scope.errors.queryResultMessage = errorMap[0];
                                    } else {
                                        $scope.errors.queryResultMessage = errorMap[1].replace('$replace$', $scope.questionType.getDesc($scope.query.questionType.type));
                                    }
                                }
                                $scope.model.totalPageSize = data.totalPageSize;

                                angular.forEach($scope.practicePaper, function (question, $index) {
                                    question.$index = $index;
                                    getCorrectAnswers(question);

                                    getMyAnswer(question);
                                });
                            })
                                .error(function () {
                                    $scope.loading = false;
                                });
                        }
                    },
                    goPractice: function () {
                        $http.get('/web/front/questionPracticeLibrary/getPracticePath', {
                            params: {
                                schemeId: $stateParams.trainClassId,
                                maxQuestionNum: 30
                            }
                        })
                            .success(function (data) {
                                if (data.status) {
                                    window.location.replace(data.info.info);
                                }
                            });
                    },
                    jump: function () {
                        if ($scope.model.toNumber) {
                            this.loadingHistory();
                        }
                    }
                };

                function getCorrectAnswers (question) {
                    var map = {};
                    map[$scope.questionType.RADIO] = function () {
                        //correctAnswer
                        var result = [];
                        angular.forEach(question.configurationItems, function (item, $index) {
                            if (item.id === question.correctAnswer) {
                                result.push(examConstant.numberMapLetter[$index]);
                            }
                        });
                        return result;
                    };
                    map[$scope.questionType.OPINION] = function () {
                        return [question.correct ? '正确' : '错误'];
                    };
                    map[$scope.questionType.MULTIPLE] = function () {
                        //correctAnswers
                        var result = [];
                        angular.forEach(question.configurationItems, function (item, $index) {
                            angular.forEach(question.correctAnswers, function (subItem, $subIndex) {
                                if (item.id === subItem) {
                                    result.push(examConstant.numberMapLetter[$index]);
                                }
                            });
                        });
                        return result;
                    };

                    question.answerResultAn = map[question.questionType]();
                }

                function getMyAnswer (question) {
                    var map = {};
                    question.userAnswerResult = question.userAnswer;

                    map[$scope.questionType.RADIO] = function () {
                        //correctAnswer
                        var result = [];
                        if (question.userAnswer && question.userAnswer.length) {
                            angular.forEach(question.configurationItems, function (item, $index) {
                                if (item.id === question.userAnswer[0]) {
                                    result.push(examConstant.numberMapLetter[$index]);
                                }
                            });
                        }
                        if (result.length <= 0) {
                            result = ['未答'];
                        }
                        return result;
                    };
                    map[$scope.questionType.OPINION] = function () {
                        var result = [];
                        if (question.userAnswer && question.userAnswer.length > 0) {
                            result = [question.userAnswer[0] == 'true' ? '正确' : '错误'];
                        } else {
                            result = ['未答'];
                        }
                        return result;
                    };
                    map[$scope.questionType.MULTIPLE] = function () {
                        //correctAnswers
                        var result = [];
                        angular.forEach(question.configurationItems, function (item, $index) {
                            angular.forEach(question.userAnswer, function (subItem, $subIndex) {
                                if (item.id === subItem) {
                                    result.push(examConstant.numberMapLetter[$index]);
                                }
                            });
                        });
                        if (result.length <= 0) {
                            result = ['未答'];
                        }
                        return result;
                    };

                    question.userAnswerResult = map[question.questionType]();
                }

                $scope.events.loadingHistory();
            }]
    };
});