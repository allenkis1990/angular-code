define(function () {
    'use strict';
    return ['$rootScope', '$scope', 'questionService', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'KENDO_UI_EDITOR', '$state', '$timeout', 'HB_notification', 'hbUtil',
        function ($rootScope, $scope, questionService, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, KENDO_UI_EDITOR, $state, $timeout, HB_notification, hbUtil) {

            $scope.model = {
                downloadModelUrl: null,//下载模板文件的地址前缀，如果直接使用域名，下载的文件会乱码
                questionSearch: {
                    questionType: '-1',
                    mode: '-1',
                    enable: '-1'
                },
                show: {
                    many: '1'
                },
                upload: {},
                question: {},
                subQuestion: {},
                searchCourseName: null, //模糊搜索课程名
                selectedCourseId: null,//选中课程的id
                selectedCourseName: null, //选中课程名称
                selectedCourseCateId: null, //选中课程分类id
                selectedCourseCateName: null //选中课程分类名称
            };

            $scope.flagModel = {
                tabType :"OWN",
                viewProjectFirst : true,
            };

            $scope.data = {
                dataItem: null,
                courseTopic: null,
                groupName: 'questionImport' //异步任务组名
            };

            angular.extend($scope, {
                iscourseCategoryName: {
                    parentId: null,
                    name: null,
                    queryName: ''
                }
            });

            var localDB = {
                selectedIdArray: [],
                selectedStatusArray: {}
            };

            $scope.node = {
                gridInstance: null,
                courseGridInstance: null,
                libraryTree: null
            };

            if ($scope.$stateParams.id != null && $scope.$stateParams.id !== '') {
                $scope.model.questionSearch.libraryId = $scope.$stateParams.id;
                $scope.model.parentName = $scope.$stateParams.name;
            }
            var filePath;

            $scope.events = {
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                tabClick:function (e,type) {
                    $scope.flagModel.tabType = type;
                    if (type === 'OWN'){
                        $scope.model.unitId= '';
                    }
                },
                getCourseCategoryInfo: function (dataItem, e) {
                    e.stopPropagation();
                    $scope.model.selectedCourseCateName = dataItem.name;
                    $scope.model.selectedCourseCateId = dataItem.id;
                    $scope.CourseCategoryTree = false;
                },
                openCourseCategoryTree: function (e) {
                    e.stopPropagation();
                    $scope.CourseCategoryTree = !$scope.CourseCategoryTree;
                },
                /**选中课程**/
                checkSelectedCourse: function (dataItem) {
                    if ($scope.model.selectedCourseId != null) {
                        HB_notification.alert('您已经有选中课程了，不可以多选。');
                    } else {
                        $scope.model.questionSearch.courseName = dataItem.name;
                        $scope.model.selectedCourseId = dataItem.id;
                        $scope.data.courseTopic = dataItem.topic;
                    }
                },
                /**取消选中课程**/
                cancelSelectedCourse: function () {
                    $scope.model.questionSearch.courseName = null;
                    $scope.model.selectedCourseId = null;
                    $scope.data.courseTopic = null;
                },
                /**选中题库**/
                selectedQuestionLibrary: function (dataItem) {
                    if ($scope.model.questionSearch.libraryId != null) {
                        HB_notification.alert('您已经有选中题库了，不可以多选。');
                    } else {
                        $scope.model.questionSearch.libraryId = dataItem.id;
                        $scope.model.searchQuestionLibraryName = dataItem.name;
                    }
                },
                /**取消选中题库**/
                cancelSelectedQuestionLibrary: function () {
                    $scope.model.questionSearch.libraryId = null;
                    $scope.model.searchQuestionLibraryName = null;
                },
                /**
                 *显示课程的选择/取消选择button
                 * @param dataItem
                 * @param flag true/选择 false/取消选择
                 * @returns {boolean}
                 */
                checked: function (dataItem, flag) {
                    if (flag) {
                        if (dataItem.id != $scope.model.selectedCourseId) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (dataItem.id == $scope.model.selectedCourseId) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                /**
                 *显示题库的选择/取消选择button
                 * @param dataItem
                 * @param flag true/选择 false/取消选择
                 * @returns {boolean}
                 */
                checkedQuestionLibrary: function (dataItem, flag) {
                    if (flag) {
                        if (dataItem.id != $scope.model.questionSearch.libraryId) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (dataItem.id == $scope.model.questionSearch.libraryId) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                /** 取消选择课程弹出框 **/
                cancel: function (e) {
                    e.preventDefault();
                    $scope.node.windows.addWindow.close();
                },
                /** 取消选择题库弹出框 **/
                cancelQuestionLibrary: function (e) {
                    e.preventDefault();
                    $scope.node.windows.questionLibrary.close();
                },
                treeHide: function (e) {
                    e.stopPropagation();
                    $scope.libraryTreeShow = false;
                },
                openTree: function (e) {
                    e.stopPropagation();
                    $scope.libraryTreeShow = !$scope.libraryTreeShow;
                },
                searchQuestion: function (e) {
                    e.preventDefault();
                    $scope.node.gridInstance.dataSource.page(1);
                },
                searchQuestionLibraryList: function (e) {
                    e.preventDefault();
                    $scope.node.courseGridInstance.dataSource.page(1);
                },
                searchQuestionLibraryForDialog: function (e) {
                    e.preventDefault();
                    $scope.node.treelistOptions.dataSource.page(1);
                },
                getOrgInfo: function (dataItem) {
                    $scope.model.parentName = dataItem.name;
                    $scope.model.questionSearch.libraryId = dataItem.id;
                    $scope.libraryTreeShow = false;
                },
                toDownQuestionMode: function () {
                    questionService.downloadTemplate().then(function (data) {
                        if (data.status) {
                            $scope.model.downloadModelUrl = data.info.downModelIP;
                        } else {
                            $scope.globle.showTip('获取模板下载地址失败', 'error');
                        }
                    });
                    $scope.node.windows.downQuestionMode.open();
                },
                questionSelectAll: function (e) {
                    // 重置表格已选的ID, 已选的状态
                    localDB.selectedIdArray = [];
                    localDB.selectedStatusArray = {};

                    // 全选
                    if (e.currentTarget.checked) {
                        var viewData = $scope.node.gridInstance.dataSource.view(),
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
                batchDelete: function () {
                    if (localDB.selectedIdArray.length < 1) {
                        $scope.globle.alert('提示!', '请选择需删除的试题');
                        return;
                    }
                    $scope.globle.confirm('批量删除试题', '确定要批量删除这些试题吗？', function (dialog) {
                        return questionService.batchDelete(localDB.selectedIdArray).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.alert('删除失败!', data.info);
                            } else {
                                $scope.node.gridInstance.dataSource.page(1);
                                $scope.node.gridInstance.dataSource.read();
                                $scope.selected = false;
                                $scope.globle.showTip('删除试题成功', 'success');
                            }
                        });
                    });
                },
                deleteQuestion: function (questionId) {
                    $scope.globle.confirm('删除试题', '确定要删除吗？', function (dialog) {
                        return questionService.remove(questionId).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.alert('删除失败!', data.info);
                            } else {
                                $scope.node.gridInstance.dataSource.page(1);
                                $scope.node.gridInstance.dataSource.read();
                                $scope.globle.showTip('删除试题成功', 'success');
                            }
                        });
                    });
                },
                enable: function (questionId, text) {
                    $scope.globle.confirm(text + '试题', '确定要' + text + '试题吗？', function (dialog) {
                        return questionService.enable(questionId).then(function (data) {
                            dialog.doRightClose();
                            if (!data.status) {
                                $scope.globle.alert(text + '试题失败!', data.info);
                            } else {
                                $scope.node.gridInstance.dataSource.read();
                                $scope.globle.showTip(text + '试题成功', 'success');
                            }
                        });
                    });
                },

                toCreateQuestionLib: function () {
                    $scope.globle.stateGo('states.library', '题库管理', {newlibray: true});
                },
                toUpdate: function (questionType, questionId, courseId, courseName) {
                    $state.go('states.questionManage.edit', {
                        questionId: questionId,
                        questionType: questionType,
                        courseId: courseId,
                        courseName: courseName
                    });
                },
                questionView: function (id, questionType, questionTypeName) {
                    $scope.node.windows.questionView.open();
                    questionService.findQuestionById(id, questionType).then(function (data) {
                        $scope.model.questionView = data.info;
                        //如果是综合题
                        $scope.model.subQuestionsView = [];
                        _.forEach($scope.model.questionView.subQuestion, function (subQuestion) {
                            $scope.model.subQuestionsView.push(angular.fromJson(subQuestion.questionJson));
                        });
                        $scope.model.questionView.questionTypeName = questionTypeName;
                    });
                },
                getLetter: function (num) {
                    return questionService.utils.digitalToLetter(num);
                },
                //试题查看时获取单选题正确答案
                getRadioRightAnswer: function () {
                    var sum;
                    var correctAnswer = $scope.model.questionView.correctAnswer;
                    _.forEach($scope.model.questionView.configurationItems, function (item, index) {
                        if (item.id == correctAnswer) {
                            sum = index + 1;
                            return;
                        }
                    });
                    return questionService.utils.digitalToLetter(sum);
                },
                //获取多选题正确答案
                getMultiselectAnswer: function () {
                    var nums = [];
                    var correctAnswers = $scope.model.questionView.correctAnswers;
                    _.forEach($scope.model.questionView.configurationItems, function (item, index) {
                        _.forEach(correctAnswers, function (item2) {
                            if (item.id == item2) {
                                nums.push(questionService.utils.digitalToLetter(index + 1));
                            }
                        });
                    });
                    return nums;
                },
                digitalToLetter: function (index) {
                    return questionService.utils.digitalToLetter(index + 1);
                },
                toChinese: function (number) {
                    return questionService.utils.toChinese(number);
                },
                toImportQuestion: function () {
                    $scope.model.isClick = true;
                    // 主要用来延迟初始化上传组件，上传组件在初始化的时候为隐藏状态导致flash不可用
                    $scope.showImportQuestionWindow = true;
                    $timeout(function () {
                        $scope.node.windows.importQuestionShow.open();
                    });
                },
                closeQuestionDialog: function () {
                    $scope.model.upload = {};
                    $scope.node.windows.importQuestionShow.close();
                    $scope.model.isClick = true;
                },
                importQuestion: function () {
                    $scope.model.isClick = false;
                    if (!$scope.model.upload.questionExcelModeType || $scope.model.upload.questionExcelModeType == '') {
                        $scope.globle.alert('提示', '请选择导入试题模板类型');
                        $scope.model.isClick = true;
                        return;
                    }
                    if (!$scope.model.upload.result || !$scope.model.upload.result.newPath || $scope.model.upload.result.newPath == '') {
                        $scope.globle.alert('提示', '请选择文件');
                        $scope.model.isClick = true;
                        return;
                    }
                    questionService.importQuestion({
                        filePath: $scope.model.upload.result.newPath,
                        questionExcelModeType: $scope.model.upload.questionExcelModeType,
                        fileName: $scope.model.upload.result.fileName
                    }, $scope.data.groupName).then(function (data) {
                        if (!data.status || !data.info) {
                            $scope.globle.alert('提示', '试题导入的异步任务创建失败!');
                            $scope.model.isClick = true;
                        } else {
                            $scope.model.upload = {};
                            $scope.node.windows.importQuestionShow.close();
                            $scope.globle.showTip('试题导入的异步任务创建成功', 'success');
                            $scope.model.isClick = true;
                        }
                    });
                },
                downloadTemplate: function (fileName) {
                    questionService.downloadTemplate(fileName).then(function (data) {

                    });
                },
                uploading: function (uploading) {
                    $scope.$apply(function () {
                        if (uploading != 1) {
                            $scope.uoloading = true;
                        } else {
                            $scope.uoloading = false;
                        }
                    });
                },
                queryByEnter: function (e) {
                    if (e.keyCode == 13) {
                        this.searchQuestion();
                    }
                },
                selectQuestionLibrary: function () {
                    $scope.node.windows.questionLibrary.center().open();
                },
                selectCourse: function () {
                    $scope.CourseCategoryTree = false;
                    $scope.node.windows.addWindow.center().open();
                }
            };

            //题库树列表
            $scope.treelistOptions = {
                // options: {
                //         rowTemplate: kendo.template(gridRowTemplate),
                //         noRecords  : {
                //          template: '暂无数据！'
                //         },
                dataSource: {
                    transport: {
                        read: function (e) {
                            var parentId = e.data.id == undefined ? '-1' : e.data.id;
                            questionService.getMenuList(parentId).then(function (result) {
                                console.info(result.info);

                                if (result.info.length < 1 && parentId == '-1') {
                                    $scope.noData = true;
                                }
                                $.each(result.info, function (i, data) {
                                    if (data.parentId == '-1')
                                        data.parentId = null;
                                    if (data.enabled == true) {
                                        data.enabled = '是';
                                    } else {
                                        data.enabled = '否';
                                    }

                                    if (data.share) {
                                        data.share = '是';
                                    } else {
                                        data.share = '否';
                                    }
                                });
                                e.success(result.info);
                            });
                        }
                    },
                    schema: {
                        model: {
                            id: 'id'
                        }
                    }
                },
                messages: {
                    loading: '正在加载题库...',
                    noRows: '暂无题库',
                    retry: 'reload'
                },
                sortable: true,
                editable: true,
                columns: [
                    {field: 'name', title: '题库名称', attributes: {style: 'text-align: left'}, width: '230px'},
                    {field: 'createUnitName', title: '创建单位', width: '80px'},
                    {field: 'hasAuthorize', title: '是否授权', width: '80px'},
                    {field: 'authorizedState', title: '授权状态', width: '150px'},
                    {
                        title: '操作', width: '220px',
                        template: kendo.template('<button class="table-btn" ng-show="events.checkedQuestionLibrary(dataItem,true)" ng-click="events.selectedQuestionLibrary(dataItem)">选择</button>' +
                            '<button class="table-btn" ng-show="events.checkedQuestionLibrary(dataItem,false)" ng-click="events.cancelSelectedQuestionLibrary()">取消选择</button>')
                    }
                ]
                // }
            };

            var courseCatagoryDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '0',
                            myModel = courseCatagoryDataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';

                        $.ajax({
                            //url: "/web/admin/organization/findUnitByParentId.action?parentId=" + id + "&nodeType=" + type,
                            url: '/web/admin/courseCategoryAction/findByQuery?categoryId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                //var keepGoing = true;
                                angular.forEach(result.info, function (item, index) {
                                    if (index == 0) {
                                        $scope.iscourseCategoryName.queryName = item.name;
                                        $scope.model.orgNames = '资源分类列表';
                                        //keepGoing = false;
                                    }
                                });
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
                        length: '',
                        hasChildren: 'hasChildren',
                        uid: 'id'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });

            var questionListTemplate = '';

            questionListTemplate += '<tr>';

            questionListTemplate += '<td>';
            questionListTemplate += '<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: id #"  class="k-checkbox" ng-checked="selected" />' +
                '<label class="k-checkbox-label" for="check_#: id #"></label>';
            questionListTemplate += '</td>';

            questionListTemplate += '<td title="#:topic#">';
            questionListTemplate += '#:topic#';
            questionListTemplate += '</td>';

            // 创建单位名称
            questionListTemplate += '<td>';
            questionListTemplate += '#:createUnitName#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td>';
            questionListTemplate += '#:questionType#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td>';
            questionListTemplate += '#:mode#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td title="#:libraryName#">';
            questionListTemplate += '#:libraryName#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td title="#:courseName#">';
            questionListTemplate += '#:courseName === null ?"-":courseName#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td>';
            questionListTemplate += '#:enabled#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td>';
            questionListTemplate += '#:createTime#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td>';
            questionListTemplate += '<button class="table-btn" has-permission="questionManage/findQuestion" ng-click="events.questionView(\'#: id #\',\'#: type #\',\'#: questionType #\')">查看</button>' +
                '<button class="table-btn" ng-if="flagModel.tabType === \'OWN\'" has-permission="questionManage/toUpdateQuestion" ng-click="events.toUpdate(\'#: questionType #\',\'#: id #\',\'#: courseId #\',\'#: courseName #\')" #: operateAble==true?\'\':\'disabled\'#>修改</button>' +
                '<button class="table-btn" ng-if="flagModel.tabType === \'OWN\'" has-permission="questionManage/deleteQuestion" ng-click="events.deleteQuestion(\'#: id #\')" #: operateAble==true?\'\':\'disabled\'#>删除</button>' +
                '<button class="table-btn" ng-if="flagModel.tabType === \'OWN\'" has-permission="questionManage/enableQuestion" ng-click="events.enable(\'#: id #\',\'启用\')" ng-show="\'#: enabled #\' === \'停用\'" #: operateAble==true?\'\':\'disabled\'#>启用</button>' +
                '<button class="table-btn" ng-if="flagModel.tabType === \'OWN\'" has-permission="questionManage/disableQuestion" ng-click="events.enable(\'#: id #\',\'停用\')" ng-show="\'#: enabled #\' === \'启用\'" #: operateAble==true?\'\':\'disabled\'#>停用</button>';
            questionListTemplate += '</td>';

            questionListTemplate += '</tr>';

            var utils = {
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
                        $scope.selected = false;
                        $scope.model.batchEnable = $scope.model.batchSuspend = $scope.model.batchFire = true;
                    } else if (size === $scope.node.gridInstance.dataSource.view().length) {
                        $scope.selected = true;
                    }
                },
                //验证是否为空
                validateIsNull: function (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }

            };

            $scope.ui = {
                windows: {
                    addWindow: {//添加窗口
                        modal: true,
                        visible: false,
                        resizable: false,
                        draggable: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    questionLibrary: {//添加窗口
                        modal: true,
                        visible: false,
                        resizable: false,
                        draggable: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                },
                tree: questionService.treeConfig(0, 1),
                courseCatagoryTree: {
                    options: {
                        checkboxes: false,
                        messages: {
                            loading: '正在加载课程分类...',
                            requestFailed: '课程分类加载失败!.'
                        },
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: courseCatagoryDataSource
                    }
                },
                windowOptions: questionService.windowConfig(),
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
                courseGrid: {
                    options: {
                        // 每个行的模板定义,
                        scrollable: false,
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
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
                                            'courseQuery.categoryId': $scope.model.selectedCourseCateId,
                                            'courseQuery.name': $scope.model.searchCourseName,
                                            'authorizedQuery.rangeType': $scope.model.authorizedQuery.rangeType,
                                            'authorizedQuery.useType': $scope.model.authorizedQuery.useType,
                                            'authorizedQuery.belongsType': $scope.model.authorizedQuery.belongsType,
                                            'authorizedQuery.authorizeToUnitId':$scope.model.authorizedQuery.authorizeToUnitId,
                                            'authorizedQuery.authorizedFromUnitId':$scope.model.authorizedQuery.authorizedFromUnitId,
                                            'authorizedQuery.objectId':$scope.model.authorizedQuery.objectId,
                                            'authorizedQuery.authorizedState': $scope.model.authorizedQuery.authorizedState
                                            };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/testQuestion/getCoursesByNameOrCate',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                data: function (response) {
                                    //$scope.questionSelcted=false;
                                    //localDB.selectedIdArray=[];
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
                        columns: [
                            {title: '课程名称', field: 'name', width: 200},
                            {title: '创建单位', field: 'name', width: 150},
                            {title: '课程分类', field: 'cateName', width: 100},
                            {title: '状态', field: 'status', width: 50},
                            {title: '学时', field: 'credit', width: 50},
                            {title: '是否授权', field: 'hasAuthorize', width: 75},
                            {title: '授权状态', field: 'authorizedState', width: 75},
                            {
                                title: '操作', width: 70,
                                template: kendo.template(
                                    '<button class="table-btn" ng-show="events.checked(dataItem,true)" ng-click="events.checkSelectedCourse(dataItem)">选择</button>' +
                                    '<button class="table-btn" ng-show="events.checked(dataItem,false)" ng-click="events.cancelSelectedCourse()">取消选择</button>')
                            }
                        ]
                    }
                },
                grid: {
                    options: {
                        // 每个行的模板定义,
                        scrollable: false,
                        rowTemplate: kendo.template(questionListTemplate),
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        //rowTemplate: kendo.template(gridRowTemplate),
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
                                            'searchDto.topic': $scope.model.questionSearch.topic,
                                            'courseId': $scope.model.selectedCourseId,
                                            'searchDto.questionType': $scope.model.questionSearch.questionType,
                                            'searchDto.mode': $scope.model.questionSearch.mode,
                                            'searchDto.enable': $scope.model.questionSearch.enable,
                                            'searchDto.beginCreateTime': $scope.model.questionSearch.beginCreateTime,
                                            'searchDto.endCreateTime': $scope.model.questionSearch.endCreateTime,
                                            'searchDto.libraryId': $scope.model.questionSearch.libraryId,
                                            'searchDto.unitId': $scope.model.questionSearch.unitId
                                        };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/testQuestion/findQuestionInfoDtoPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                data: function (response) {
                                    $scope.questionSelcted = false;
                                    localDB.selectedIdArray = [];
                                    return response.info;
                                },
                                parse: function (response) {
                                    console.log(response.info);
                                    angular.forEach(response.info, function (item) {
                                        item.topic = hbUtil.filterHTMLTag(item.topic);
                                    });
                                    return response;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50],
                            pageSize: 10,
                            buttonCount: 10
                        },
                        columns: [
                            {
                                title: '<span><input class=\'k-checkbox\' ng-model=\'selected\' id=\'questionSelectAll\' ng-click=\'events.questionSelectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'questionSelectAll\'></label></span>',
                                filterable: false,
                                width: 40,
                                attributes: { // 用template的时候失效。
                                    'class': 'tcenter'
                                }
                            },
                            {title: '试题题目', field: 'topic'},
                            {title: '创建单位', field: 'createUnitName'},
                            {title: '试题类型', field: 'questionType', width: 80},
                            {title: '难易度', field: 'mode', width: 80},
                            {title: '所属题库', field: 'libraryName', width: 110},
                            {title: '所属课程', field: 'courseName', width: 180},
                            {title: '试题状态', field: 'enabled', width: 80},
                            {title: '创建时间', field: 'createTime', width: 145},
                            {
                                title: '操作', width: 150
                            }
                        ]
                    }
                }
            };

            $scope.$watch('model.uploadImage', function () {
                if ($scope.model.uploadImage) {
                    filePath = $scope.model.uploadImage.newPath;
                }
                else {
                    $scope.model.image = 'images/afei.jpg';
                }
            });
            $scope.$watch('model.selectedCourseCateName', function () {
                if ($scope.model.selectedCourseCateName == '') {
                    $scope.model.selectedCourseCateId = null;
                }
            });
            $scope.$watch('model.parentName', function () {
                if ($scope.model.parentName === '') {
                    $scope.model.questionSearch.libraryId = '';
                }
            });
            $scope.ui.grid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.grid.options);
            $scope.ui.courseGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseGrid.options);
        }];
});
