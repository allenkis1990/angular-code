define(['angular',
        '@systemUrl@/js/modules/practicePaperConfig/controllers/paper-ctrl',
        '@systemUrl@/js/modules/practicePaperConfig/controllers/paper-add-ctrl',
        '@systemUrl@/js/modules/practicePaperConfig/controllers/paper-edit-ctrl',
        '@systemUrl@/js/modules/practicePaperConfig/controllers/paper-release-ctrl',
        '@systemUrl@/js/modules/practicePaperConfig/controllers/paper-continue-ctrl',
        '@systemUrl@/js/modules/practicePaperConfig/controllers/paper-add-step3-ctrl',
        '@systemUrl@/js/modules/practicePaperConfig/services/paper-service',
        'directives/remote-validate-directive',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, paperCtrl, addCtrl, editCtrl, releaseCtrl, continueCtrl, addStep3Ctrl, paperService, validateDirective) {
        'use strict';
        return angular.module('app.paper', ['kendo.ui.constants', 'kendo.ui.commons']).controller('app.practicePaperConfig.paperCtrl', paperCtrl)
            .controller('app.practicePaperConfig.addCtrl', addCtrl)
            .controller('app.practicePaperConfig.editCtrl', editCtrl)
            .controller('app.practicePaperConfig.releaseCtrl', releaseCtrl)
            .controller('app.practicePaperConfig.continueCtrl', continueCtrl)
            .controller('app.practicePaperConfig.addStep3Ctrl', addStep3Ctrl)


            .factory('paperService', paperService)

            .directive('ajaxValidate', validateDirective)

            // 试卷的[组卷类型]的过滤器
            .filter('getMakePaperType', function () {
                return function (status) {
                    var result;
                    switch (status) {
                        case 1:
                            result = '手动组卷';
                            break;
                        case 4:
                            result = '智能组卷';
                            break;
                        default:
                            result = '未知方式';
                    }
                    return result;
                };
            })
            // 试卷的[试卷类型]的过滤器
            .filter('getPaperType', function () {
                return function (status) {
                    var result;
                    switch (status) {
                        case 1:
                            result = '考试';
                            break;
                        case 2:
                            result = '练习';
                            break;
                        case 4:
                            result = '模拟';
                            break;
                        default:
                            result = '未知类型';
                    }
                    return result;
                };
            })
            // 试卷的[试卷类型]的过滤器
            .filter('getPaperStatus', function () {
                return function (status) {
                    return status === 'true' ? '启用' : '停用';
                };
            })
            // 试卷的[试题类型]的过滤器
            .filter('getQuestionType', function () {
                return function (status) {
                    var result;
                    switch (status) {
                        case 1:
                            result = '判断题';
                            break;
                        case 2:
                            result = '单选题';
                            break;
                        case 3:
                            result = '多选题';
                            break;
                        case 4:
                            result = '填空题';
                            break;
                        case 5:
                            result = '简答题';
                            break;
                        case 6:
                            result = '综合题';
                            break;
                        case 7:
                            result = '客观题';
                            break;
                        default:
                            result = '未知题型';
                    }
                    return result;
                };
            })
            // 试卷的[大题题序]的过滤器
            .filter('getPaperItemSort', function () {
                return function (status) {
                    var result;
                    switch (status) {
                        case 1:
                            result = '一';
                            break;
                        case 2:
                            result = '二';
                            break;
                        case 3:
                            result = '三';
                            break;
                        case 4:
                            result = '四';
                            break;
                        case 5:
                            result = '五';
                            break;
                        case 6:
                            result = '六';
                            break;
                        case 7:
                            result = '七';
                            break;
                        case 8:
                            result = '八';
                            break;
                        case 9:
                            result = '九';
                            break;
                        case 10:
                            result = '十';
                            break;
                        case 11:
                            result = '十一';
                            break;
                        case 12:
                            result = '十二';
                            break;
                        default:
                            result = '未知题序';
                    }
                    return result;
                };
            });

    });
