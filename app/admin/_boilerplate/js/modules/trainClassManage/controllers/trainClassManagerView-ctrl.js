define(function () {
    'use strict';
    return ['$scope', 'trainClassManageService', '$stateParams', '$state',
        function ($scope, trainClassManageService, $stateParams, $state) {
            $scope.model = {
                showTrainClassAssess: false,
                exams: [],
                trainClassLessonOne: [],
                trainClassLessonTwo: [],
                userGroupOne: [],
                userGroupTwo: [],
                allLesson: 0,
                allUser: 0
            };
            var utils = {
                splitTrainClassLesson: function (data) {
                    if (data.length) {
                        $scope.model.trainClassLessonOne = [];
                        $scope.model.trainClassLessonTwo = [];
                        var yushu = -1;
                        for (var i = 0; i < data.length; i++) {
                            yushu = i % 2;
                            switch (yushu) {
                                case 0:
                                    $scope.model.trainClassLessonOne.push(data[i]);
                                    break;
                                case 1:
                                    $scope.model.trainClassLessonTwo.push(data[i]);
                                    break;
                                default:
                                    continue;
                            }
                        }
                        $scope.$apply();
                    }
                },
                splitTrainClassUser: function (data) {
                    if (data.length) {
                        $scope.model.userGroupOne = [];
                        $scope.model.userGroupTwo = [];
                        var yushu = -1;
                        for (var i = 0; i < data.length; i++) {
                            yushu = i % 2;
                            switch (yushu) {
                                case 0:
                                    $scope.model.userGroupOne.push(data[i]);
                                    break;
                                case 1:
                                    $scope.model.userGroupTwo.push(data[i]);
                                    break;
                                default:
                                    continue;
                            }
                        }
                        $scope.$apply();
                    }
                }
            };

            $scope.events = {
                /**
                 * 返回资源管理页面
                 * @param e
                 */
                goTrainClassManage: function (e) {
                    e.preventDefault();
                    $state.go('states.trainClassManage').then(function () {
                        $state.reload();
                    });
                },
                /**
                 * 返回资源管理页面
                 * @param e
                 */
                goLessonResourceManage: function (e) {
                    e.preventDefault();
                    $state.go('states.lessonResourceManage').then(function () {
                        $state.reload();
                    });
                },

                /**
                 * 预览试卷
                 *
                 * @param e event object
                 * @param dataItem row data
                 * @author choaklin
                 */
                preview: function (e, dataItem) {
                    e.stopPropagation();
                    trainClassManageService.getExamViewUrl(dataItem.examPaperId, 4).then(function (data) {
                        window.open(data.info);
                    });
                    /*var id = dataItem.examPaperId;
                    e.preventDefault();
                    window.open('/exam/#/preview/' + id+'/'+dataItem.name);*/
                }
            };
            $scope.ui = {
                trainClassLessonGrid: {
                    refresh: true,
                    dataSource: new kendo.data.DataSource({
                        serverPaging: true,
                        scrollable: false,
                        page: 1,
                        pageSize: 10, // 每页显示的数据数目
                        transport: {
                            parameterMap: function (data, type) {
                                if (type === 'read') {
                                    data.pageNo = data.page;
                                }
                                return data;
                            },
                            read: {
                                url: '/web/admin/trainClass/findTrainClassLessonPage/' + $stateParams.trnId,
                                dataType: 'json'
                            }
                        },
                        schema: {
                            parse: function (response) {
                                // 将会把这个返回的数组绑定到数据源当中
                                if (response.status) {
                                    var viewData = response.info,
                                        i = 1;
                                    _.forEach(viewData, function (row) {
                                        row.index = i++;
                                    });
                                    return response;
                                } else {
                                    $scope.globle.alert('错误', '加载培训班课程失败!');
                                    return {
                                        status: response.status,
                                        totalSize: 0,
                                        totalPageSize: 0,
                                        info: []
                                    };
                                }
                            },
                            total: function (response) {
                                // 绑定数据所有总共多少条;
                                $scope.model.allLesson = response.totalSize;
                                return response.totalSize;
                            },
                            data: function (response) {
                                // 重置跟分页相关的缓存参数
                                utils.splitTrainClassLesson(response.info);
                                return response.info;
                            }
                        }
                    })
                },
                trainClassUserGrid: {
                    refresh: true,
                    dataSource: new kendo.data.DataSource({
                        serverPaging: true,
                        scrollable: false,
                        page: 1,
                        pageSize: 10, // 每页显示的数据数目
                        transport: {
                            parameterMap: function (data, type) {
                                if (type === 'read') {
                                    data.pageNo = data.page;
                                }
                                return data;
                            },
                            read: {
                                url: '/web/admin/trainClass/findTrainClassUserPage/' + $stateParams.trnId,
                                dataType: 'json'
                            }
                        },
                        schema: {
                            parse: function (response) {
                                // 将会把这个返回的数组绑定到数据源当中
                                if (response.status) {
                                    var viewData = response.info,
                                        i = 1;
                                    _.forEach(viewData, function (row) {
                                        row.index = i++;
                                    });
                                    return response;
                                } else {
                                    $scope.globle.alert('错误', '加载培训班学员失败!');
                                    return {
                                        status: response.status,
                                        totalSize: 0,
                                        totalPageSize: 0,
                                        info: []
                                    };
                                }
                            },
                            total: function (response) {
                                $scope.model.allUser = response.totalSize;
                                // 绑定数据所有总共多少条;
                                return response.totalSize;
                            },
                            data: function (response) {
                                // 重置跟分页相关的缓存参数
                                utils.splitTrainClassUser(response.info);
                                return response.info;
                            }
                        }
                    })
                }
            };

            function findTrainClassInfo () {
                trainClassManageService.findTrainClassInfo($stateParams.trnId).then(function (data) {
                    if (data.status) {
                        $scope.model.trainClass = data.info;
                    }
                });
            }

            function findTrainClassExam () {
                trainClassManageService.findTrainClassExam($stateParams.trnId).then(function (data) {
                    if (data.status) {
                        $scope.model.exams = data.info;

                    }
                });
            }

            /**
             * 加载培训班考核配置
             */
            function loadTrainPersonalAssess () {
                trainClassManageService.loadTrainPersonalAssess($stateParams.trnId).then(function (data) {
                    if (data.status) {
                        $scope.model.showTrainClassAssess = true;
                        $scope.model.trainClassAssess = data.info;
                    } else {
                        $scope.model.showTrainClassAssess = false;
                    }
                });
            }

            function init () {
                findTrainClassInfo();
                findTrainClassExam();
                loadTrainPersonalAssess();
                // 加载必修包下课程分页数据
                $scope.ui.trainClassUserGrid.dataSource.read();
                $scope.ui.trainClassLessonGrid.dataSource.read();
            }

            init();
        }];

});
