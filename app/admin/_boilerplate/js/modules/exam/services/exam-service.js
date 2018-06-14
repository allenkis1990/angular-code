define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/');
        });
        return {
            cancelRelease: function (examId) {
                return a.one('exam/cancelRelease').get({examId: examId});
            },
            getRoundStatisticsInfo: function () {
                return a.one('exam/getRoundStatisticsInfo').get();
            },
            getRoundStatisticsInfoByRoundId: function (roundId) {
                return a.one('exam/getRoundStatisticsInfoByRoundId').get({roundId: roundId});
            },
            findExamViewById: function (examRoundId, examRoundType) {
                return a.one('exam/findExamViewById').get({examRoundId: examRoundId, examRoundType: examRoundType});
            },
            releasePaper: function (model) {
                return a.all('paper/releasePaper').post(model);
            },
            getExamViewUrl: function (answerExamPaperId) {
                return a.one('exam/examView').get({answerExamPaperId: answerExamPaperId});
            },
            getExamMarkUrl: function (answerExamPaperId) {
                return a.one('exam/mark').get({answerExamPaperId: answerExamPaperId});
            },
            getExamReMarkUrl: function (answerExamPaperId) {
                return a.one('exam/remark').get({answerExamPaperId: answerExamPaperId});
            }
        };
    }];
});
