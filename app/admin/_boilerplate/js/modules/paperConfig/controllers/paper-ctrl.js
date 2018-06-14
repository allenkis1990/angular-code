define(function () {
    'use strict';
    return ['$rootScope', '$scope', '$filter', 'paperService', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', '$state', 'hbUtil',
        function ($rootScope, $scope, $filter, paperService, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, $state, hbUtil) {
            $scope.tabMap = {
                myself: {
                    name: "本单位",
                    code: "myself"
                },
                all: {
                    name: "项目级",
                    code: "all"
                }
            };
            $scope.currentTab = $scope.tabMap.myself.code;
            $scope.model = {
                paper: {},
                allPaperSearch: {
                    examRange: '-1',
                    configType: '-1',
                    enable: '-1'
                },
                myselfPaperSearch: {
                    examRange: '-1',
                    configType: '-1',
                    enable: '-1'
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
                    }
                    /*if (size === $scope.node.myselfGridInstance.dataSource.view().length)*/
                    else {
                        var viewData = $scope.node[$scope.currentTab + 'GridInstance'].dataSource.view(),
                            size1 = viewData.length, row;
                        var checkCount = 0;
                        for (var i = 0; i < size1; i++) {
                            row = viewData[i];
                            if(row.sourceType!==4)
                            {
                                checkCount++;
                            }
                        }
                        if(size==checkCount) {
                            $scope.paperSelected = true;
                        }


                    }
                }
            };

            $scope.events = {
                chooseTab: function (e, code) {
                    $scope.currentTab = code;
                },
                isSubProjectManager: function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList) >= 0;
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
                    $scope.events.deleteCheckAll();
                    $scope.node[$scope.currentTab + 'GridInstance'].dataSource.page(1);
                },
                paperSelectAll: function (e) {
                    // 重置表格已选的ID, 已选的状态
                    localDB.selectedIdArray = [];
                    localDB.selectedStatusArray = {};

                    // 全选
                    if (e.currentTarget.checked) {
                        var viewData = $scope.node[$scope.currentTab + 'GridInstance'].dataSource.view(),
                            size = viewData.length, row;
                        for (var i = 0; i < size; i++) {
                            row = viewData[i];
                            // 缓存本地
                            if (row.sourceType !== 2) {
                                localDB.selectedIdArray.push(row.id);
                                localDB.selectedStatusArray[row.id] = row.status;
                            }
                        }
                    }
                    utils.refreshBatchButton();
                },
                deleteCheckAll: function () {
                    var viewData = $scope.node[$scope.currentTab + 'GridInstance'].dataSource.view(),
                        size = viewData.length, row;
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        delete localDB.selectedStatusArray[row.id];
                    }
                    $scope.paperSelected = false;
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
                                $scope.events.deleteCheckAll();
                                $scope.node.myselfGridInstance.dataSource.page(1);
                                $scope.node.myselfGridInstance.dataSource.read();
                                $scope.paperSelected = false;
                                $scope.globle.showTip('删除试卷成功', 'success');
                            }
                        });
                    });
                },
                deletePaper: function (paperId) {
                    $scope.globle.confirm('删除试卷', '确定要删除吗？', function (dialog) {
                        return paperService.deletePaper(paperId).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.alert('删除失败', data.info);
                            } else {
                                $scope.events.deleteCheckAll();
                                $scope.node.myselfGridInstance.dataSource.page(1);
                                $scope.node.myselfGridInstance.dataSource.read();
                                $scope.globle.showTip('删除试卷成功', 'success');
                            }
                        });
                    });

                },
                toManualAddPaper: function () {
                    $state.go('states.paperConfig.add');
                },
                getOrgInfo: function (dataItem) {
                    $scope.model.parentName = dataItem.name;
                    $scope.model.paperSearch.examTypeId = dataItem.id;
                    $scope.examTypeTreeShows = false;
                },

                toUpdate: function (id, configType) {
                    $state.go('states.paperConfig.edit', {id: id, configType: configType});
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
                                $scope.events.deleteCheckAll();
                                $scope.node.myselfGridInstance.dataSource.read();
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
                paperView: function (e, dataItem, viewPaperCreateTime) {
                    $scope.viewPaperCreateTime = viewPaperCreateTime;
                    e.preventDefault();

                    // 不存在, 则初始化查看试卷的窗体
                    if (!$scope.ui.paperViewWindowOptions) {
                        $scope.ui.paperViewWindowOptions = {
                            modal: true,
                            visible: false,
                            title: false,
                            content: '@systemUrl@/views/exam/paper-view.html',
                            open: function () {
                                this.center();
                            }
                        };
                    }

                    paperService.viewPaper(dataItem.id, dataItem.configType).then(function (response) {
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
                /**
                 * 预览试卷
                 *
                 * @param e event object
                 * @param dataItem row data
                 * @author choaklin
                 */
                preview: function (e, dataItem) {
                    var id = dataItem.id;
                    paperService.preview(id).then(function (data) {
                        window.open(data.info);
                    });
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
                                    $scope.events.deleteCheckAll();
                                    $scope.node.myselfGridInstance.dataSource.page(1);
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
                                    $scope.events.deleteCheckAll();
                                    $scope.node.myselfGridInstance.dataSource.page(1);
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
                result.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: id #"  class="k-checkbox" ng-checked="dataItem.sourceType===4?false:paperSelected"  ng-disabled="dataItem.sourceType===4"/>');
                result.push('<label class="k-checkbox-label" for="check_#: id #"></label>');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: examTypeName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: totalScore #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createTime #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createUserName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: enabled ==true ?\'启用\' : \'停用\' #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: draft ==true ?\'是\' : \'否\' #');
                result.push('</td>');

                result.push('<td title="#: formUnitName #">');
                result.push('#: formUnitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: strIsAuthorized #">');
                result.push('#: strIsAuthorized #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: strAvailableStatus #">');
                result.push('#: strAvailableStatus #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                // result.push('<button  ng-disabled="#: draft ==true #" ng-click="events.preview($event, dataItem)" class="table-btn">预览</button>');
                result.push('<button  ng-disabled="#: draft ==true #" ng-click="events.paperView($event, dataItem,\'#: createTime #\')" class="table-btn">查看</button>');
                result.push('<button  has-permission="paperConfig/toUpdatePaper" ng-click="events.toUpdate(\'#: id #\',\'#: configType #\')" class="table-btn" ng-disabled="dataItem.operateAble === false">修改</button>');
                // result.push ( '<button  has-permission="paperConfig/deletePaper" ng-click="#:quoteCount# > 0 ? globle.alert(\'提示\', \'当前试卷被场次引用无法删除\'):events.deletePaper(\'#: id #\')" class="table-btn">删除</button>' );
                result.push('<button  has-permission="paperConfig/deletePaper" ng-click="events.deletePaper(\'#: id #\')" class="table-btn" ng-disabled="dataItem.operateAble === false||dataItem.isAuthorized">删除</button>');
                result.push('</td>');
                result.push('</tr>');
                gridRowTemplate = result.join('');

                var allResult = [];
                allResult.push('<tr>');

                // allResult.push('<td>');
                // allResult.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: id #"  class="k-checkbox" ng-checked="paperSelected" />');
                // allResult.push('<label class="k-checkbox-label" for="check_#: id #"></label>');
                // allResult.push('</td>');

                allResult.push('<td title="#: name #">');
                allResult.push('#: name #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('#: examTypeName #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('#: totalScore #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('#: createTime #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('#: createUserName #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('#: enabled ==true ?\'启用\' : \'停用\' #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('#: draft ==true ?\'是\' : \'否\' #');
                allResult.push('</td>');

                allResult.push('<td title="#: formUnitName #">');
                allResult.push('#: formUnitName #');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('<div  title="#: strIsAuthorized #">');
                allResult.push('#: strIsAuthorized #');
                allResult.push('</div>');
                allResult.push('</td>');

                allResult.push('<td>');
                allResult.push('<div  title="#: strAvailableStatus #">');
                allResult.push('#: strAvailableStatus #');
                allResult.push('</div>');
                allResult.push('</td>');


                allResult.push('<td>');
                // result.push('<button  ng-disabled="#: draft ==true #" ng-click="events.preview($event, dataItem)" class="table-btn">预览</button>');
                allResult.push('<button  ng-disabled="#: draft ==true #" ng-click="events.paperView($event, dataItem,\'#: createTime #\')" class="table-btn">查看</button>');
                //allResult.push('<button  has-permission="paperConfig/toUpdatePaper" ng-click="events.toUpdate(\'#: id #\',\'#: configType #\')" class="table-btn">修改</button>');
                // result.push ( '<button  has-permission="paperConfig/deletePaper" ng-click="#:quoteCount# > 0 ? globle.alert(\'提示\', \'当前试卷被场次引用无法删除\'):events.deletePaper(\'#: id #\')" class="table-btn">删除</button>' );
                //allResult.push('<button  has-permission="paperConfig/deletePaper" ng-click="events.deletePaper(\'#: id #\')" class="table-btn">删除</button>');
                allResult.push('</td>');
                allResult.push('</tr>');
                allGridRowTemplate = allResult.join('');
            })();

            //试卷分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '-2',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/paperClassify/findExamPaperTypeByParentId?parentId=' + id,
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
                                        var param = {
                                            'page.pageSize': data.pageSize,
                                            'page.pageNo': data.page,
                                            'queryParam.name': $scope.model.myselfPaperSearch.name,
                                            'queryParam.examRange': $scope.model.myselfPaperSearch.examRange,
                                            'queryParam.configType': $scope.model.myselfPaperSearch.configType,
                                            'queryParam.enable': $scope.model.myselfPaperSearch.enable,
                                            'queryParam.beginCreateTime': $scope.model.myselfPaperSearch.beginCreateTime,
                                            'queryParam.endCreateTime': $scope.model.myselfPaperSearch.endCreateTime,
                                            'examTypeId': $scope.model.myselfPaperSearch.examTypeId,
                                        };
                                        if (hbUtil.validateIsNull($scope.model.myselfAuthorizedQuery) === false) {
                                            angular.forEach($scope.model.myselfAuthorizedQuery, function (value, key) {
                                                param[key] = value;
                                            });
                                        }
                                        return param;
                                        // return {
                                        //     'page.pageSize': data.pageSize,
                                        //     'page.pageNo': data.page,
                                        //     'queryParam.name': $scope.model.myselfPaperSearch.name,
                                        //     'queryParam.examRange': $scope.model.myselfPaperSearch.examRange,
                                        //     'queryParam.configType': $scope.model.myselfPaperSearch.configType,
                                        //     'queryParam.enable': $scope.model.myselfPaperSearch.enable,
                                        //     'queryParam.beginCreateTime': $scope.model.myselfPaperSearch.beginCreateTime,
                                        //     'queryParam.endCreateTime': $scope.model.myselfPaperSearch.endCreateTime,
                                        //     'examTypeId': $scope.model.myselfPaperSearch.examTypeId
                                        // };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/paper/findExamPaperPage',
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
                            {title: '试卷名称'},
                            {title: '组卷方式', width: 80},
                            {title: '试卷类别', width: 110},
                            {title: '试卷总分', width: 80},
                            {title: '创建时间', width: 120},
                            {title: '创建者', width: 140},
                            {title: '试卷状态', width: 80},
                            {title: '是否草稿', width: 80},
                            {title: '创建单位', width: 150},
                            {title: '是否授权', width: 80},
                            {title: '授权状态', width: 80},
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
                                        var param = {
                                            'page.pageSize': data.pageSize,
                                            'page.pageNo': data.page,
                                            'queryParam.name': $scope.model.allPaperSearch.name,
                                            'queryParam.examRange': $scope.model.allPaperSearch.examRange,
                                            'queryParam.configType': $scope.model.allPaperSearch.configType,
                                            'queryParam.enable': $scope.model.allPaperSearch.enable,
                                            'queryParam.beginCreateTime': $scope.model.allPaperSearch.beginCreateTime,
                                            'queryParam.endCreateTime': $scope.model.allPaperSearch.endCreateTime,
                                            'examTypeId': $scope.model.allPaperSearch.examTypeId,
                                        };
                                        if (hbUtil.validateIsNull($scope.model.allAuthorizedQuery) === false) {
                                            angular.forEach($scope.model.allAuthorizedQuery, function (value, key) {
                                                param[key] = value;
                                            });
                                        }
                                        return param;
                                        // return {
                                        //     'page.pageSize': data.pageSize,
                                        //     'page.pageNo': data.page,
                                        //     'queryParam.name': $scope.model.allPaperSearch.name,
                                        //     'queryParam.examRange': $scope.model.allPaperSearch.examRange,
                                        //     'queryParam.configType': $scope.model.allPaperSearch.configType,
                                        //     'queryParam.enable': $scope.model.allPaperSearch.enable,
                                        //     'queryParam.beginCreateTime': $scope.model.allPaperSearch.beginCreateTime,
                                        //     'queryParam.endCreateTime': $scope.model.allPaperSearch.endCreateTime,
                                        //     'examTypeId': $scope.model.allPaperSearch.examTypeId,
                                        //
                                        // };

                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/paper/findExamPaperPage',
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
                            {title: '试卷名称'},
                            {title: '组卷方式', width: 80},
                            {title: '试卷类别', width: 110},
                            {title: '试卷总分', width: 80},
                            {title: '创建时间', width: 120},
                            {title: '创建者', width: 140},
                            {title: '试卷状态', width: 80},
                            {title: '是否草稿', width: 80},
                            {title: '创建单位', width: 150},
                            {title: '是否授权', width: 80},
                            {title: '授权状态', width: 80},
                            {title: '操作', width: 130}
                        ]
                    }
                }

            };
            $scope.ui.myselfGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.myselfGrid.options);
            $scope.ui.allGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.allGrid.options);
        }];
});
