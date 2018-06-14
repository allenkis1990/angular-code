define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/testQuestion/');
        });
        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/asynQueImport/');
        });
        var c = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/questionIE/');
        });
        var d = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/courseWareManager/');
        });
        var e = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/');
        });
        var menuHttp = e.one('questionLibrary/findLibraryListByParentId');
        return {

            selectOne: '2', // 单选题
            multiSelect: '3', // 多选题
            trueOrFalse: '1', //判断题
            getMenuList: function (libraryId) {
                return menuHttp.get({libraryId: libraryId, enabled: '-1', onlySelf: 0, showInsertLibrary: 1});
            },
            findQuestionInfoDtoPage: function (questionSearch) {
                return a.one('findQuestionInfoDtoPage').get(questionSearch);
            },
            createQuestion: function (model, courseId, url) {
                if (courseId !=null && courseId !== ''){
                    var examObjects = [{
                        type: 'CourseId',
                        objectId: courseId
                    }];
                    model.examObjects = examObjects;
                }
                return a.all(url).post(model);
            },
            findQuestionById: function (questionId, questionType) {
                return a.one('findQuestionById').get({questionId: questionId, questionType: questionType});
            },
            updateQuestion: function (model, courseId, url) {
                if (courseId !=null && courseId !== ''){
                    var examObjects = [{
                        name: 'CourseId',
                        objectId: courseId
                    }];
                    model.examObjects = examObjects;
                }
                return a.all(url).post(model);
            },
            remove: function (questionId) {
                return a.one('delete').get({questionId: questionId});
            },
            enable: function (questionId) {
                return a.one('enable').get({questionId: questionId});
            },
            batchDelete: function (questionIds) {
                return a.all('batchDelete').post(questionIds);
            },
            downloadTemplate: function () {
                return b.one('getDownLoadIp').get();
            },
            importQuestion: function (params, groupName) {
                return c.all('questionImport').post(params, {groupName: groupName});
            },

            /**
             *
             * @returns {*|Z}
             */
            treeConfig: function (onlySelf, showInsertLibrary) {
                return {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: new kendo.data.HierarchicalDataSource({
                            transport: {
                                read: function (options) {
                                    var id = options.data.id ? options.data.id : '-2';
                                    $.ajax({
                                        url: '/web/admin/questionLibrary/findLibraryListByParentId?libraryId=' + id + '&enabled=0' + '&onlySelf=' + onlySelf + '&showInsertLibrary=' + showInsertLibrary,
                                        dataType: 'json',
                                        success: function (result) {
                                            options.success(result);
                                        },
                                        error: function (result) {
                                            options.error(result);
                                        }
                                    });
                                }
                            },
                            schema: {
                                model: {
                                    id: 'id',
                                    hasChildren: 'hasChildren'
                                },
                                data: function (data) {
                                    return data.info;
                                }
                            }
                        })
                    }
                };
            },

            getQuestionType: function (questionType) {
                var that = this;
                switch (questionType) {
                    case '简答':
                        url = 'findAskQuestionById';
                        questionType = that.simple;
                        break;
                    case '判断':
                        questionType = that.trueOrFalse;
                        break;
                    case '单选':
                        questionType = that.selectOne;
                        break;
                    case '多选':
                        questionType = that.multiSelect;
                        break;
                    case '填空':
                        questionType = that.completion;
                        break;
                    case '综合':
                        questionType = that.composite;
                        break;
                }
                return questionType;
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
