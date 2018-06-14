/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', '$http', 'hbBasicData', '$state', function (Restangular, $http, hbBasicData, $state) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/myClass');
        });
        var baseExam = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/myExam');
        });
        var baseChoose = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/chooseCourseAction');
        });

        var baseHistoryExam = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/onlineExamAction');
        });

        var baseCertificateApplication = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/certificateApplication');
        });

        return {

            findUserSelectedInterestCourseInPoolList: function (schemeId,coursePoolId) {
                return $http.get('/web/front/chooseCourseAction/findUserSelectedInterestCourseInPoolList?schemeId=' + schemeId+'&coursePoolId='+coursePoolId);
            },
            findInterestCourseList: function (schemeId, coursePoolId) {
                return $http.get('/web/front/chooseCourseAction/findInterestCourseList?schemeId=' + schemeId + '&coursePoolId=' + coursePoolId);
            },
            chooseInterestCourse: function (params) {
                return baseChoose.all('chooseMulInterestCourse').post(params);
            },
            viewAnswerHistory: function (answerExamPaperId, historyAnswerExamPaperId) {
                return $http.get('/web/front/myExam/getHistoryExamPaperView?answerExamPaperId=' + answerExamPaperId + '&historyAnswerExamPaperId=' + historyAnswerExamPaperId);
            },

            getHistoryExamPaper: function (schemeId) {
                return $http.get('/web/front/myExam/listHistoryExamPaper?schemeId=' + schemeId);
            },


            getCoursePoolRuleForm: function (schemeId) {
                return $http.get('/web/front/chooseCourseAction/getCoursePoolRuleForm?schemeId=' + schemeId);
            },


            isAllowExam: function (params) {
                return baseExam.one('isAllowExam').get(params);
            },

            validateUserClassAccess: function (params) {
                return base.one('validateUserClassAccess').get(params);
            },
            relearnClass: function (params) {
                return base.one('relearnClass').get(params);
            },
            relearnClassCourse: function (params) {
                return base.one('relearnClassCourse').get(params);
            },
            getExamInfo: function (params) {
                return baseExam.one('getExamInfo').get(params);
            },
            findCoursePage: function (params) {
                return baseChoose.one('findCoursePage').get(params);
            },
            getTimeLength: function (params) {
                return baseChoose.one('getTimeLength').get(params);
            },
            chooseCourse: function (params) {
                return baseChoose.all('chooseCourse').post(params);
            },
            getClassCheckProgress: function (params) {
                return base.one('getClassCheckProgress').get(params);
            },
            examination: function (params) {
                return baseExam.one('examination').get(params);
            },
            getMyClassInfoList: function (params) {
                return base.one('getMyClassInfo').get(params);
            },
            classAccess: function (params) {
                return base.one('classAccess').get(params);
            },
            getMyCourseList: function (params) {
                return base.one('getMyCourseList').get(params);
            },
            getUserCourseStudyInfo: function (params) {
                return base.one('getUserCourseStudyInfo').get(params);
            },
            getUserExamInfo: function (params) {
                return baseExam.one('getUserExamInfo').get(params);
            },
            getUserClassLearningInfo: function (params) {
                return base.one('getUserClassLearningInfo').get(params);
            },

            getPracticeInfo: function (params) {
                return $http.get('/web/front/questionPracticeLibrary/getPracticePath', {
                    params: params
                });
            },

            getPracticeCount: function (params) {
                return $http.get('/web/front/questionPracticeLibrary/getHistoryPracticeCount', {
                    params: params
                });
            },

            hasPractice: function (params) {
                return $http.get('/web/front/questionPracticeLibrary/hasPractice', {
                    params: params
                });
            },

            createCertificateApplication: function (params) {
                return baseCertificateApplication.all('create').post(params);
            },

            findList: function (params) {
                return baseCertificateApplication.one('findList').get(params);
            },

            findById: function (params) {
                return baseCertificateApplication.one('findDetail').get(params);
            },

            getPrefixUrl: function () {
                return baseCertificateApplication.one('getPrefixUrl').get();
            },

            checkIsSecretClass: function (params) {
                return baseCertificateApplication.one('checkIsSecretClass').get(params);
            },


            validateUserClassThenDo: function (entryType, classId, $dialog, callBack, $scope) {
                $http.get('/web/front/myClass/validateUserClassAccess', {params: {classId: classId}}).success(function (data) {
                    //data.status=false;
                    //data.code='100';
                    if (data.status && data.code === 200) {
                        if (data.info.code === '200') {

                            if (entryType === 'list') {
                                callBack && callBack();
                            }
                        }

                        if (data.info.code === '505') {
                            $dialog.alert({
                                title: '提示',
                                modal: true,
                                width: 250,
                                ok: function () {
                                    $scope.testListParams = {
                                        schemeId: classId,
                                        trainingSchemeType: 'TRAINING_CLASS'
                                    };
                                    hbBasicData.doPopQuestion($scope);
                                    return true;
                                },
                                content: data.info.message
                            });
                        }

                    } else {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                if (entryType === 'init') {
                                    $state.go('states.myStudy.trainClass');
                                }
                                return true;
                            },

                            cancel: function () {
                                if (entryType === 'init') {
                                    $state.go('states.myStudy.trainClass');
                                }
                                return true;
                            },

                            content: data.info
                        });
                    }
                });
            }

        };
    }];
});
