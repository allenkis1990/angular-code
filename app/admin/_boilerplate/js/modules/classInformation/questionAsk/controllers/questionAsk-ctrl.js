define(function (questionAsk) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'hbUtil', '$timeout', '$http', 'HB_dialog', '$state', 'classInformationServices', function ($scope, hbUtil, $timeout, $http, HB_dialog, $state, classInformationServices) {
            $scope.model.mark = false;
            $scope.$watch('model.userId', function (newVal) {
                if (newVal) {
                    $scope.model.mark = false;
                    classInformationServices.doview($state.current.name);
                    $scope.questionAskQueryParam.userId = newVal;
                    //有ID后再请求表格
                    if ($scope.kendoPlus.gridDelay === false && $scope.model.classTab === 5) {
                        $scope.kendoPlus.gridDelay = true;
                    } else {
                        if ($scope.model.classTab === 5) {
                            $scope.events.MainPageQueryList();
                        }
                    }
                }
            });

            $scope.kendoPlus = {
                questionAskGridInstance: null,
                windowOptions: {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                },
                gridDelay: false
            };

            $scope.questionAskQueryParam = {
                pageNo: 1,
                pageSize: 10,
                userId: '',
                noUserInformation: true,
                problemCategoryList: [],
                categoryId: '-1'
            };

            $scope.events = {
                MainPageQueryList: function () {
                    $scope.questionAskQueryParam.pageNo = 1;
                    $scope.kendoPlus.questionAskGridInstance.pager.page(1);
                },

                openAskWindow: function () {
                    $scope.questionAskWindow.center().open();
                },

                closeAskWindow: function () {
                    $scope.questionAskWindow.close();
                    $scope.questionAskQueryParam.categoryId = '-1';
                    $scope.questionAskQueryParam.description = '';
                },

                creatQuestion: function () {

                    if ($scope.questionAskQueryParam.categoryId === '-1') {
                        HB_dialog.warning('提示', '请选择问题类别');
                        return false;
                    }

                    if (validateIsNull($scope.questionAskQueryParam.description)) {
                        HB_dialog.warning('提示', '请填写问题描述');
                        return false;
                    }

                    $http.post('/web/admin/problemAction/addProblem', {
                        categoryId: $scope.questionAskQueryParam.categoryId,
                        problemUserId: $scope.questionAskQueryParam.userId,
                        description: $scope.questionAskQueryParam.description
                    }).success(function (data) {
                        if (data.status) {
                            HB_dialog.success('提示', data.info);
                            $scope.events.closeAskWindow();
                            $timeout(function () {
                                $scope.events.MainPageQueryList();
                            }, 500);
                        } else {
                            HB_dialog.error('提示', data.info);
                        }
                    });
                }

            };

            //问题咨询
            var questionAskTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: categoryName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: description #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: creator #');
                result.push('</td>');


                result.push('</tr>');
                questionAskTemplate = result.join('');
            })();


            $scope.questionAskGrid = {
                options: {
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(questionAskTemplate),
                    scrollable: false,
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/problemAction/findProblemPage',
                                data: function (e) {
                                    var temp = {
                                        page: {
                                            pageNo: e.page,
                                            pageSize: e.pageSize
                                        },
                                        query: {
                                            userId: $scope.questionAskQueryParam.userId
                                        }
                                    };


                                    $scope.questionAskQueryParam.pageNo = e.page;
                                    $scope.questionAskQueryParam.pageSize = e.pageSize;
                                    delete e.page;
                                    delete e.pageSize;
                                    delete e.skip;
                                    delete e.take;
                                    return temp;
                                },
                                dataType: 'json'
                            }

                        },
                        pageSize: 5, // 每页显示的数据数目
                        schema: {
                            // 数据源默认绑定的字段
                            // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                            // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                            // 优先与后面的data执行，返回的数据为下面data上面的参数response
                            parse: function (response) {
                                $timeout(function () {
                                    $scope.model.mark = true;
                                });
                                if (response.info.length === 0) {
                                    $timeout(function () {
                                        $scope.questionAskQueryParam.noUserInformation = true;
                                    });
                                } else {
                                    $timeout(function () {
                                        $scope.questionAskQueryParam.noUserInformation = false;
                                    });
                                }
                                ;

                                // 将会把这个返回的数组绑定到数据源当中
                                if (response.status) {
                                    var dataview = response.info, index = 1;
                                    angular.forEach(dataview, function (item) {
                                        item.index = index++;
                                    });
                                }
                                return response;
                            },
                            total: function (response) {
                                return response.totalSize;
                            },
                            data: function (response) {
                                return response.info;
                            } // 指定数据源
                        },
                        serverPaging: true, //远程获取书籍
                        serverSorting: true //远程排序字段
                    },
                    selectable: true,
                    sortable: {
                        mode: 'single',
                        allowUnsort: false
                    },
                    dataBinding: function (e) {
                        $scope.model.gridReturnData = e.items;
                        hbUtil.kendo.grid.nullDataDealLeaf(e);
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
                        pageSize: 10,
                        buttonCount: 10
                        //change: function (e) {
                        //    $scope.model.page.pageNo = parseInt(e.index, 10);
                        //    //== !!important!! 这里重复了page(1)的作用
                        //    // $scope.node.lessonGrid.dataSource.read();
                        //}
                    },
                    // 选中切换的时候改变选中行的时候触发的事件
                    columns: [
                        {field: 'index', title: 'No', sortable: false, width: 50},
                        {field: 'categoryName', title: '问题类别', sortable: false, width: 150},
                        {field: 'description', title: '问题描述', sortable: false},
                        {field: 'createTime', title: '登记时间', sortable: false, width: 150},
                        {field: 'creator', title: '登记人', sortable: false, width: 150}
                    ]
                }
            };


            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }


            //获取问题类别
            $http.get('/web/admin/problemCategoryAction/findProblemCategoryList?parentId=-1').success(function (data) {
                if (data.status) {
                    $scope.questionAskQueryParam.problemCategoryList = data.info;
                    $scope.questionAskQueryParam.problemCategoryList.unshift({
                        id: '-1',
                        name: '请选择'
                    });
                    //console.log($scope.questionAskQueryParam.problemCategoryList);
                }
            });


        }]
    };
});