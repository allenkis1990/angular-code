define(function () {
    'use strict';
    return ['$rootScope','$scope', '$filter', 'paperService', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', '$state',
        function ($rootScope,$scope, $filter, paperService, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, $state) {
            $scope.tabMap={
                myself:{
                    name:"本单位",
                    code:"myself"
                },
                all:{
                    name:"项目级",
                    code:"all"
                }
            };
            $scope.currentTab = $scope.tabMap.myself.code;
            $scope.model = {
                paper: {},
                myselfPaperSearch: {
                    examRange: '-1',
                    configType: '-1',
                    enable: 'true'
                },
                allPaperSearch: {
                    examRange: '-1',
                    configType: '-1',
                    enable: 'true',
                    unitId:'',
                },
                //== 试卷查看对象
                viewPaper: null,
                questionTypeDesc: '',
                questionCount: 0
            };
            $scope.node = {
                paperViewWindow: null
            };

            var localDB = {
                questionTypeMap: {},
                selectedIdArray: [],
                selectedStatusArray: {}
            };

            $scope.scopeInputClass = 'ipt ipt-c-xm';

            $scope.init = function () {

            };
            var utils = {
                swapItems: function (arr, index1, index2) {
                    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                    return arr;
                },
                refreshBatchButton: function () {
                    var selectedIdArray = localDB.selectedIdArray,
                        selectedStatusArray = localDB.selectedStatusArray,
                        size = selectedIdArray.length;

                    angular.forEach(selectedStatusArray, function (status, key) {
                        switch (status) {
                            case 1 :
                                $scope.model.batchEnable = $scope.model.batchFire = false;
                                break; // 出现<正常>状态的, <批量启用>、<批量离职>不可用
                            case 2 :
                                $scope.model.batchSuspend = false;
                                break;                        // 出现<停用>状态的, <批量停用>不可用
                            case 3 :
                                $scope.model.batchEnable = $scope.model.batchFire = false;
                                break; // 出现<离职>状态的, <批量启用>、<批量离职>不可用
                        }
                    });

                    // 已选的数量为0, 等价于取消全选; 数量为当前展示的页面量, 等价于全选
                    if (size === 0) {
                        $scope.paperSelected = false;
                        $scope.model.batchEnable = $scope.model.batchSuspend = $scope.model.batchFire = true;
                    } else if (size === $scope.node[$scope.currentTab+'GridInstance'].dataSource.view().length) {
                        $scope.paperSelected = true;
                    }
                }
            };

            $scope.events = {
                chooseTab : function (e,code){
                    $scope.currentTab = code;
                },
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                treeHide: function (e) {
                    e.stopPropagation();
                    $scope.examTypeTreeShows = false;
                },
                openTree: function (e) {
                    e.stopPropagation();
                    $scope.examTypeTreeShows = !$scope.examTypeTreeShows;
                },
                checkBoxCheck: function (e, dataItem) {
                    var id = dataItem.id;
                    if (e.currentTarget.checked) {
                        localDB.selectedIdArray.push(id);
                        localDB.selectedStatusArray[id] = dataItem.status;
                    } else {
                        var index = _.indexOf(localDB.selectedIdArray, id);
                        if (index !== -1) {
                            localDB.selectedIdArray.splice(index, 1);
                        }
                        delete localDB.selectedStatusArray[id];
                    }

                    utils.refreshBatchButton();
                },
                search: function () {
                    $scope.node[$scope.currentTab+'GridInstance'].dataSource.page(1);
                },
                paperSelectAll: function (e) {
                    // 重置表格已选的ID, 已选的状态
                    localDB.selectedIdArray = [];
                    localDB.selectedStatusArray = {};

                    // 全选
                    if (e.currentTarget.checked) {
                        var viewData = $scope.node[$scope.currentTab+'GridInstance'].dataSource.view(),
                            size = viewData.length, row;
                        for (var i = 0; i < size; i++) {
                            row = viewData[i];
                            // 缓存本地
                            localDB.selectedIdArray.push(row.id);
                            localDB.selectedStatusArray[row.id] = row.status;
                        }
                    }
                    utils.refreshBatchButton();
                },
                batchDelete: function () {
                    if (localDB.selectedIdArray.length < 1) {
                        $scope.globle.alert('错误', '请至少选择一个试卷来删除');
                        return;
                    }
                    $scope.globle.confirm('批量删除试题', '确定要批量删除这些试卷吗？', function (dialog) {
                        return paperService.batchDelete(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.alert('删除失败', data.info);
                            } else {
                                $scope.node.myselfGridInstance.dataSource.page(1);
                                $scope.node.myselfGridInstance.dataSource.read();
                                $scope.node.allGridInstance.dataSource.read();
                                $scope.paperSelected = false;
                                $scope.globle.showTip('删除试卷成功', 'success');
                            }
                        });
                    });
                },
                deletePaper: function (paperId) {
                    $scope.globle.confirm('删除试卷', '确定要删除吗？', function (dialog) {
                        return paperService.delPracticeExam(paperId).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.alert('删除失败', data.info);
                            } else {
                                $scope.node.myselfGridInstance.dataSource.page(1);
                                $scope.node.myselfGridInstance.dataSource.read();
                                $scope.node.allGridInstance.dataSource.read();
                                $scope.globle.showTip('删除试卷成功', 'success');
                            }
                        });
                    });

                },
                toManualAddPaper: function () {
                    $state.go('states.practicePaperConfig.add');
                },
                getOrgInfo: function (dataItem) {
                    $scope.model[$scope.currentTab+'ParentName'] = dataItem.name;
                    $scope.model[$scope.currentTab+'PaperSearch'].examTypeId = dataItem.id;
                    $scope.examTypeTreeShows = false;
                },

                toUpdate: function (id, configType) {
                    $state.go('states.practicePaperConfig.edit', {id: id, configType: configType});
                },
                copyPaper: function () {
                    if (localDB.selectedIdArray.length < 1) {
                        $scope.globle.alert('错误!', '请至少选择一个试卷来复制');
                        return;
                    }
                    $scope.globle.confirm('复制试卷', '确定要复制这些试卷吗？', function (dialog) {
                        return paperService.copyPaper(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.showTip('复制失败', 'error');
                            } else {
                                $scope.node.myselfGridInstance.dataSource.read();
                                $scope.node.allGridInstance.dataSource.read();
                                $scope.globle.showTip('复制成功', 'success');
                            }
                        });
                    });
                },

                /**
                 * 查看试卷
                 *
                 * @param e event object
                 * @param dataItem row data
                 * @author choaklin
                 */
                paperView: function (practiceId) {
                    /*    $scope.viewPaperCreateTime = viewPaperCreateTime;*/
                    /* e.preventDefault ();*/
                    /*   paperService.paperView(practiceId).then(

                       );*/
                    // 不存在, 则初始化查看试卷的窗体
                    if (!$scope.ui.paperViewWindowOptions) {
                        $scope.ui.paperViewWindowOptions = {
                            modal: true,
                            visible: false,
                            title: false,
                            content: '@systemUrl@/views/exam/practice-paper-view.html',
                            open: function () {
                                this.center();
                            }
                        };
                    }

                    paperService.paperView(practiceId).then(function (response) {
                        if (response.status) {
                            $scope.model.viewPaper = response.info;

                            // 每次查看重置为初始状态
                            $scope.model.questionCount = 0;
                            $scope.model.questionTypeDesc = '';
                            localDB.questionTypeMap = {};
                            var items = [];
                            if (response.info.configType == 1) {
                                items = response.info.items;
                            } else if (response.info.configType == 3) {
                                items = response.info.items2;
                            }
                            if (items.length) {
                                var type;
                                angular.forEach(items, function (item, index) {
                                    // 试题数
                                    $scope.model.questionCount += item.count;

                                    // 涉及题型在已知的题型中, 则不追加
                                    if (!localDB.questionTypeMap[item.type]) {
                                        type = $filter('getQuestionType')(item.type);

                                        localDB.questionTypeMap[item.type] = type;
                                        // 题型描述的第一个题型前面不加,(逗号)
                                        $scope.model.questionTypeDesc += (($scope.model.questionTypeDesc === '' ? '' : ',') + type);
                                    }
                                });
                            } else {
                                $scope.model.questionTypeDesc = '未分配题目';
                            }

                            $scope.node.paperViewWindow.open();
                        } else {
                            $scope.globle.alert('错误', '加载试卷的基本信息失败!' + response.info);
                        }
                    });
                },

                /**
                 * 关闭查看试卷的modal dialog
                 *
                 * @param e event object
                 * @author choaklin
                 */
                closePaperViewWindow: function (e) {
                    e.preventDefault();

                    $scope.node.paperViewWindow.close();
                },
                setEnable: function (type) {
                    if (type == 1) {
                        if (localDB.selectedIdArray.length < 1) {
                            $scope.globle.alert('错误', '请至少选择一张试卷来启用');
                            return;
                        }
                        $scope.globle.confirm('批量启用试卷', '确定要批量启用这些试卷吗？', function (dialog) {
                            return paperService.batchSetEnable(localDB.selectedIdArray, type).then(function (data) {
                                dialog.doRightClose();
                                if (!data.status) {
                                    $scope.globle.alert('启用失败', data.info);
                                } else {
                                    $scope.node.gridInstance.dataSource.page(1);
                                    $scope.node.allGridInstance.dataSource.read();
                                    $scope.paperSelected = false;
                                    $scope.globle.showTip('启用成功', 'success');
                                }
                            });
                        });
                    } else {
                        if (localDB.selectedIdArray.length < 1) {
                            $scope.globle.alert('错误!', '请至少选择一张试卷来停用');
                            return;
                        }
                        $scope.globle.confirm('批量停用试卷', '确定要批量停用这些试卷吗？', function (dialog) {
                            return paperService.batchSetDisable(localDB.selectedIdArray, type).then(function (data) {
                                dialog.doRightClose();
                                if (!data.status) {
                                    $scope.globle.alert('停用失败', data.info);
                                } else {
                                    $scope.node.gridInstance.dataSource.page(1);
                                    $scope.node.allGridInstance.dataSource.read();
                                    $scope.paperSelected = false;
                                    $scope.globle.showTip('停用成功', 'success');
                                }
                            });
                        });
                    }

                },
                queryByEnter: function (e) {
                    if (e.keyCode == 13) {
                        this.search();
                    }
                }
            };

            // 构建表格的内容模板
            var gridRowTemplate = '';
            var allGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: practiceId #"  class="k-checkbox" ng-checked="paperSelected" />');
                result.push('<label class="k-checkbox-label" for="check_#: practiceId #"></label>');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                /*  result.push ( '#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #' );*/
                result.push('#:  \'智能组卷\'#');
                result.push('</td>');

                result.push('<td>');
                result.push('#: \'课后测验卷\' #');
                result.push('</td>');
                result.push('<td>');
                result.push('#: libraryName #');
                result.push('</td>');


                result.push('<td>');
                result.push('#: passScore #' + '/' + '#: totalScore #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createUserId #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: enable==true ?\'启用\' : \'停用\' #');
                result.push('</td>');


                result.push('<td>');
                result.push('<button   ng-click="events.paperView(\'#: practiceId #\')" class="table-btn" has-permission="practicePaperConfig/detail">查看</button>');
                /* result.push ( '<button  ng-disabled="#: draft ==true #" ng-click="events.paperView($event, dataItem,\'#: createTime #\')" class="table-btn">查看</button>' );*/
                result.push('<button  has-permission="practicePaperConfig/toUpdatePaper"  ng-click="events.toUpdate(\'#: practiceId #\',\'#: \'1\'  #\')" class="table-btn">修改</button>');
                // result.push ( '<button  has-permission="practicePaperConfig/deletePaper" ng-click="#:quoteCount# > 0 ? globle.alert(\'提示\', \'当前试卷被场次引用无法删除\'):events.deletePaper(\'#: id #\')" class="table-btn">删除</button>' );
                result.push('<button  has-permission="practicePaperConfig/deletePaper" ng-click="events.deletePaper(\'#: practiceId #\')" class="table-btn">删除</button>');
                result.push('</td>');
                result.push('</tr>');
                gridRowTemplate = result.join('');

                var resultAll = [];
                resultAll.push('<tr>');

                // resultAll.push('<td>');
                // resultAll.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: practiceId #"  class="k-checkbox" ng-checked="paperSelected" />');
                // resultAll.push('<label class="k-checkbox-label" for="check_#: practiceId #"></label>');
                // resultAll.push('</td>');

                resultAll.push('<td title="#: name #">');
                resultAll.push('#: name #');
                resultAll.push('</td>');

                resultAll.push('<td>');
                /*  result.push ( '#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #' );*/
                resultAll.push('#:  \'智能组卷\'#');
                resultAll.push('</td>');

                resultAll.push('<td>');
                resultAll.push('#: \'课后测验卷\' #');
                resultAll.push('</td>');
                resultAll.push('<td>');
                resultAll.push('#: libraryName #');
                resultAll.push('</td>');


                resultAll.push('<td>');
                resultAll.push('#: passScore #' + '/' + '#: totalScore #');
                resultAll.push('</td>');

                resultAll.push('<td>');
                resultAll.push('#: createTime #');
                resultAll.push('</td>');

                resultAll.push('<td>');
                resultAll.push('#: createUserId #');
                resultAll.push('</td>');

                resultAll.push('<td>');
                resultAll.push('#: enable==true ?\'启用\' : \'停用\' #');
                resultAll.push('</td>');


                resultAll.push('<td>');
                resultAll.push('<button   ng-click="events.paperView(\'#: practiceId #\')" class="table-btn" has-permission="practicePaperConfig/detail">查看</button>');
                /* result.push ( '<button  ng-disabled="#: draft ==true #" ng-click="events.paperView($event, dataItem,\'#: createTime #\')" class="table-btn">查看</button>' );*/
                //resultAll.push('<button  has-permission="practicePaperConfig/toUpdatePaper"  ng-click="events.toUpdate(\'#: practiceId #\',\'#: \'1\'  #\')" class="table-btn">修改</button>');
                // result.push ( '<button  has-permission="practicePaperConfig/deletePaper" ng-click="#:quoteCount# > 0 ? globle.alert(\'提示\', \'当前试卷被场次引用无法删除\'):events.deletePaper(\'#: id #\')" class="table-btn">删除</button>' );
                //resultAll.push('<button  has-permission="practicePaperConfig/deletePaper" ng-click="events.deletePaper(\'#: practiceId #\')" class="table-btn">删除</button>');
                resultAll.push('</td>');
                resultAll.push('</tr>');
                allGridRowTemplate = resultAll.join('');
            })();

            //试卷分类树
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
                },
                datePicker: {
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: $scope.events.startChange
                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: $scope.events.endChange
                        }
                    }
                },
                myselfGrid: {
                    options: {
                        //toolbar:[],
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    var sortStr = '';
                                    if (type == 'read') {
                                        if (data.sort) {
                                            var str = [];
                                            angular.forEach(data.sort, function (item, index) {
                                                str.push(item.field + ' ' + item.dir);
                                            });
                                            sortStr = str.join(',');
                                        }
                                        return {
                                            'page.pageSize': data.pageSize,
                                            'page.pageNo': data.page,
                                            'practiceExamQuery.name': $scope.model.myselfPaperSearch.name,
                                            'practiceExamQuery.enable': $scope.model.myselfPaperSearch.enable,
                                            'practiceExamQuery.createStartTime': validateIsNull($scope.model.myselfPaperSearch.createStartTime) == true ? undefined : $scope.model.myselfPaperSearch.createStartTime,
                                            'practiceExamQuery.createEndTime': validateIsNull($scope.model.myselfPaperSearch.createEndTime) == true ? undefined : $scope.model.myselfPaperSearch.createEndTime,
                                            'practiceExamQuery.createUserName': $scope.model.myselfPaperSearch.createUserName,
                                            'practiceExamQuery.libraryId': $scope.model.myselfPaperSearch.examTypeId
                                        };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    /*  url        : '/web/admin/paper/findExamPaperPage',*/
                                    url: '/web/admin/paper/findPracticeExamPage',
                                    /*   url        : '/web/front/userPractices/fetchQuestionInRandom',*/
                                    /* url        : '/web/front/userPractices/submitQuestionAnswer',*/
                                    dataType: 'json'
                                }
                            },


                            schema: {
                                data: function (response) {
                                    $scope.questionSelcted = false;
                                    localDB.selectedIdArray = [];
                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        scrollable: false,
                        columns: [
                            {
                                title: '<span><input class=\'k-checkbox\' ng-model=\'paperSelected\' id=\'paperSelectAll\' ng-click=\'events.paperSelectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'paperSelectAll\'></label></span>',
                                filterable: false, width: 40,
                                attributes: { // 用template的时候失效。
                                    'class': 'tcenter'
                                }
                            },
                            {title: '试卷名称', width: 130},
                            {title: '组卷方式', width: 80},
                            {title: '试卷类别', width: 110},
                            {title: '试卷分类', width: 80},
                            {title: '及格分/总分', width: 80},
                            {title: '创建时间', width: 110},
                            {title: '创建者', width: 140},
                            {title: '试卷状态', width: 70},
                            {title: '操作', width: 130}
                        ]
                    }
                },
                allGrid: {
                    options: {
                        //toolbar:[],
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(allGridRowTemplate),
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    var sortStr = '';
                                    if (type == 'read') {
                                        if (data.sort) {
                                            var str = [];
                                            angular.forEach(data.sort, function (item, index) {
                                                str.push(item.field + ' ' + item.dir);
                                            });
                                            sortStr = str.join(',');
                                        }
                                        return {
                                            'page.pageSize': data.pageSize,
                                            'page.pageNo': data.page,
                                            'practiceExamQuery.name': $scope.model.allPaperSearch.name,
                                            'practiceExamQuery.enable': $scope.model.allPaperSearch.enable,
                                            'practiceExamQuery.createStartTime': validateIsNull($scope.model.allPaperSearch.createStartTime) == true ? undefined : $scope.model.allPaperSearch.createStartTime,
                                            'practiceExamQuery.createEndTime': validateIsNull($scope.model.allPaperSearch.createEndTime) == true ? undefined : $scope.model.allPaperSearch.createEndTime,
                                            'practiceExamQuery.createUserName': $scope.model.allPaperSearch.createUserName,
                                            'practiceExamQuery.libraryId': $scope.model.allPaperSearch.examTypeId,
                                            'practiceExamQuery.unitId': $scope.model.allPaperSearch.unitId
                                        };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    /*  url        : '/web/admin/paper/findExamPaperPage',*/
                                    url: '/web/admin/paper/findPracticeExamPage',
                                    /*   url        : '/web/front/userPractices/fetchQuestionInRandom',*/
                                    /* url        : '/web/front/userPractices/submitQuestionAnswer',*/
                                    dataType: 'json'
                                }
                            },


                            schema: {
                                data: function (response) {
                                    $scope.questionSelcted = false;
                                    localDB.selectedIdArray = [];
                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        scrollable: false,
                        columns: [
                            // {
                            //     title: '<span><input class=\'k-checkbox\' ng-model=\'paperSelected\' id=\'paperSelectAll\' ng-click=\'events.paperSelectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'paperSelectAll\'></label></span>',
                            //     filterable: false, width: 40,
                            //     attributes: { // 用template的时候失效。
                            //         'class': 'tcenter'
                            //     }
                            // },
                            {title: '试卷名称', width: 130},
                            {title: '组卷方式', width: 80},
                            {title: '试卷类别', width: 110},
                            {title: '试卷分类', width: 80},
                            {title: '及格分/总分', width: 80},
                            {title: '创建时间', width: 110},
                            {title: '创建者', width: 140},
                            {title: '试卷状态', width: 70},
                            {title: '操作', width: 130}
                        ]
                    }
                }

            };
            $scope.ui.myselfGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.myselfGrid.options);
            $scope.ui.allGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.allGrid.options);
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }
        }];
});
