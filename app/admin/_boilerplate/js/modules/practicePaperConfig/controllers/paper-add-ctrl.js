/**
 * Created by admin on 2015/7/30.
 */


define(function () {
    'use strict';

    var controller = ['kendo.grid', 'TabService', 'KENDO_UI_TREE', '$scope', '$log', 'paperService', 'KENDO_UI_GRID', '$state', 'HB_notification',

        function (kendoGrid, TabService, KENDO_UI_TREE, $scope, $log, paperService, KENDO_UI_GRID, $state, HB_notification) {

            $scope.model = {
                validonly: true,
                enable: true,
                ispublish: true,
                libraryId: '',
                limitPracticeNum: false,
                name: '',
                passScore: null,
                practiceNum: null,
                publiced: true,
                questionNum: null,
                totalScore: 100,
                selectedItem: -2
            };
            $scope.showback = false;
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '-2',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/paperClassify/findExamPaperTypeByParentId?authorizedBelongsType=MYSELF&parentId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);
                            },
                            error: function (result) {
                                // notify the data source that the request failed
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
            });
            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                }
            };

            $scope.events = {
                validonly: function () {

                    paperService.checkPracticeExamName({name: $scope.model.name}).then(function (data) {
                        if (data.info === false) {
                            $scope.model.validonly = false;
                        } else {
                            $scope.model.validonly = true;
                        }
                    });

                },
                getOrgInfo: function (dataItem) {
                    paperService.findExamPaperTypeByParentId(dataItem.id).then(function (data) {

                        if (data.info.length === 0) {
                            $scope.model.parentName = dataItem.name;
                            $scope.model.libraryId = dataItem.id;
                            $scope.examTypeTreeShows = false;
                        }
                    });


                },
                save: function () {

                    if ($scope.model.name === '' || $scope.model.libraryId === '' || $scope.model.libraryId === '-1' || $scope.model.passScore === null || $scope.model.questionNum === null || $scope.model.totalScore === null) {
                        return false;
                    }
                    paperService.createPracticePaper($scope.model).then(function (data) {
                        if (!data.status) {

                            $scope.globle.showTip('试卷创建失败', 'error');
                        } else {
                            $scope.showback = true;
                            $scope.globle.showTip('试卷创建成功', 'success');
                        }
                    });

                },
                sort: function () {
                    TabService.appendNewTab('试卷分类', 'states.paperClassification', true);
                },
                treeHide: function (e) {
                    e.stopPropagation();
                    $scope.examTypeTreeShows = false;
                },
                openTree: function (e) {
                    e.stopPropagation();
                    $scope.examTypeTreeShows = !$scope.examTypeTreeShows;
                },
                check: function () {
                    console.log(($scope.model.totalScore / $scope.model.questionNum) % 0.5);
                    if (($scope.model.totalScore / $scope.model.questionNum) % 0.5 != 0) {
                        $scope.showerror = true;
                    } else {
                        $scope.showerror = false;
                    }
                },
                continue: function () {
                    $scope.showback = false;
                    $scope.model = {
                        enable: true,
                        ispublish: true,
                        libraryId: '',
                        limitPracticeNum: true,
                        name: '',
                        passScore: null,
                        practiceNum: null,
                        publiced: true,
                        questionNum: null,
                        totalScore: null
                    };
                    $state.reload($state.current);
                }

            };

        }];


    return controller;
});
