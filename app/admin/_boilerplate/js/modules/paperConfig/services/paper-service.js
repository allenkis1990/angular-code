define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/');
        });
        return {
            selectOne: 2, // 单选题
            multiSelect: 3, // 多选题
            trueOrFalse: 1, //判断题
            checkPaperClassification: function (parentId) {
                return a.one('paper/checkPaperClassification').get({parentId: parentId});
            },
            createFixedPaper: function (model) {
                return a.all('paper/createFixedPaper').post(model);
            },
            createSmartPaper: function (model) {
                return a.all('paper/createSmartPaper').post(
                    model, undefined, undefined, {'Content-Type': 'application/x-www-form-urlencoded'});
            },
            copyPaper: function (paperIds) {
                return a.all('paper/copyPaper').post(paperIds);
            },
            releasePaper: function (model) {
                return a.all('paper/releasePaper').post(model);
            },
            updateFixedPaper: function (model) {
                return a.all('paper/updateFixedPaper').post(model);
            },
            updateSmartPaper: function (model) {
                return a.all('paper/updateSmartPaper').post(model);
            },
            deletePaper: function (paperId) {
                return a.one('paper/deletePaper').get({paperId: paperId});
            },
            batchDelete: function (paperIds) {
                return a.all('paper/batchDelete').post(paperIds);
            },
            batchSetEnable: function (paperIds) {
                return a.all('paper/batchSetEnable').post(paperIds);
            },
            batchSetDisable: function (paperIds) {
                return a.all('paper/batchSetDisable').post(paperIds);
            },
            findFixedExamPaperById: function (paperId) {
                return a.one('paper/findFixedExamPaperById').get({paperId: paperId});
            },
            findLibraryExamPaperById: function (paperId) {
                return a.one('paper/findLibraryExamPaperById').get({paperId: paperId});
            },
            getLibraryList: function (libraryId) {
                return a.one('questionLibrary/findLibraryListByParentId').get({libraryId: libraryId, enabled: '0'});
            },
            findQuestionInfo: function (questionId) {
                return a.one('testQuestion/findQuestionInfo').get({questionId: questionId, isFilterHtml: true});
            },

            findExamPaperQuestionCount: function (questionType, libraryIds) {
                return a.one('testQuestion/findExamPaperQuestionCount').get({
                    questionType: questionType,
                    libraryIds: libraryIds
                });
            },

            viewPaper: function (paperId, type) {
                return a.one('paper/get/' + paperId).get({type: type});
            },
            findQuestionById: function (questionId, questionType) {
                return a.one('testQuestion/findQuestionById').get({questionId: questionId, questionType: questionType});
            },

            preview: function (examPaperId) {
                return a.one('paper/preview').get({examPaperId: examPaperId});
            },
            getQuestionType: function (questionType) {
                var that = this;
                switch (questionType) {
                    case that.simple:
                        return '简答';
                    case that.trueOrFalse:
                        return '判断';
                    case that.selectOne:
                        return '单选';
                    case that.multiSelect:
                        return '多选';
                    case that.completion:
                        return '填空';
                    case that.composite:
                        return '综合';
                }
            },
            utils: {
                digitalToLetter: function (i) {
                    var s = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
                    var sArray = s.split(' ');
                    if (i < 1) return '';

                    if (parseInt((i / 26) + '') == 0) return sArray[i % 26 - 1];
                    else {
                        if (i % 26 == 0) return (i2s(parseInt((i / 26) + '') - 1)) + sArray[26 - 1];
                        else return sArray[parseInt((i / 26) + '') - 1] + sArray[i % 26 - 1];
                    }
                },
                toChinese: function (i) {
                    var s = {
                        '1': '一',
                        '2': '二',
                        '3': '三',
                        '4': '四',
                        '5': '五',
                        '6': '六',
                        '7': '七',
                        '8': '八',
                        '9': '九',
                        '10': '十',
                        '11': '十一',
                        '12': '十二',
                        '13': '十三',
                        '14': '十四',
                        '15': '十五',
                        '16': '十六',
                        '17': '十七',
                        '18': '十八',
                        '19': '十九',
                        '20': '二十'
                    };
                    return _.get(s, i);
                }
            }
        };
    }];
});
