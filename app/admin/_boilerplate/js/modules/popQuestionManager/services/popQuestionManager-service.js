define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/popQustionAction/');
        });
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/courseWareManager');
        });
        return {
            trueOrFalse: '1',   //判断题
            selectOne: '2',    // 单选题
            multiSelect: '3', //  多选题

            findPopQuestionId: function (questionId, popQuestionId, questionType) {
                return a.one('findPopQuestionById').get({
                    questionId: questionId,
                    popQuestionId: popQuestionId,
                    questionType: questionType
                });
            },

            // updateQuestion: function (model, courseId, url) {
            //     // var examObjects = [{
            //     //     name:'courseWareId',
            //     //     objectId:courseId
            //     // }];
            //     // model.examObjects = examObjects;
            //     return a.all(url).post(model);
            // },

            /**
             * 创建弹窗题
             * @param model 试题基类
             * @param courseWareId 课件id
             * @param timePoint 时间点：秒
             * @param url
             * @param questionType
             * @returns {*|{}|{method, params, headers}}
             */
            createPopQuestion: function (model, courseWareId, timePoint, url, questionType) {
                var examObjects = [{
                    type: 'courseWareId',
                    objectId: courseWareId
                }];
                model.examObjects = examObjects;
                return base.all(url).post(model, {
                    questionType: questionType,
                    timePoint: timePoint,
                    courseWareId: courseWareId
                });
            },
            /**
             * 修改弹窗题
             * @param model 弹窗题
             * @param questionType 弹窗题类型
             * @param timePoint 时间点：秒
             * @param popQuestionId 弹窗题id
             * @returns {*|{}|{method, params, headers}}
             */
            updatePopQuestion: function (model, questionType, timePoint, popQuestionId, url) {
                return base.all(url).post(model, {
                    questionType: questionType,
                    timePoint: timePoint,
                    popQuestionId: popQuestionId
                });
            },

            windowConfig: function () {
                return {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                };
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
