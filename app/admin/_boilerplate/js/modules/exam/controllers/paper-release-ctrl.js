/**
 * Created by admin on 2015/7/30.
 */


define(function () {
    'use strict';

    var controller = ['$scope', '$log', 'examService', 'KENDO_UI_GRID', '$state',

        function ($scope, $log, examService, KENDO_UI_GRID, $state) {

            var editNewRequiredPackage = {
                utils: {}
            };

            $scope.model = {
                queryParam: {
                    /*page: {
                     pageNo: 1,
                     pageSize: 10

                     }*/
                    //分页信息
                    pageNo: 1,
                    pageSize: 10,
                    //查询条件
                    account: undefined,
                    name: null,
                    email: undefined,
                    status: 1
                },
                examRound: {
                    examPaperId: null,
                    passScore: null,
                    examTimeLength: null,
                    examModeType: '1',
                    displayType: '1',
                    confusionQuestion: 'true',
                    publishType: '0',
                    confusionAnswer: 'true',
                    back: 'true'
                },
                //== 选择发布对象步骤
                studyObjectCursor: 1,   // 1: 学员; 2: 岗位; 3: 组织机构
                // 关于员工块
                selectedEmployeeIdList: [],
                selectedEmployeeList: [],
                teacherIds: [],
                teachers: [],
                electedEmployeeGridParams: {
                    nickname: null
                },
                electedTeacherGridParams: {
                    name: null
                },

                // 关于岗位块
                selectedJobIdList: [],
                selectedJobList: [],
                electedJobGridParams: {
                    name: null
                },

                // 关于组织机构
                selectedUnitIdList: [], // 已选的单位ID集合
                selectedOrgIdList: [],  // 已选的组织机构ID集合
                selectedUnitOrgList: [],// 已选的机构单位对象集合
                electedUnitOrgTreeParams: {
                    nodeType: null
                },
                selectedTeacherIdList: [],
                paperSearch: {
                    name: '',
                    examTypeId: null
                }
            };
            $scope.show = {
                releasePaperStep1: true
            };

            $scope.submitNow = false;

            $scope.events = {
                teacherSearch: function () {
                    $scope.node.electedTeacherGrid.dataSource.page(1);
                    $scope.node.electedTeacherGrid.dataSource.read();
                },
                toTeacherAccountManage: function () {
                    $scope.node.windows.teacherWindow.close();
                    $scope.globle.stateGo('states.teacherAccountManage', '教师账号管理');
                },
                choiceExamPaper: function () {
                    $scope.node.examPaperGrid.dataSource.read();
                    $scope.node.windows.examPaperWindow.open();
                },
                continueRelease: function () {
                    var nowDate = new Date();
                    var beginTime = kendo.parseDate($scope.model.examRound.beginTime, 'yyyy-MM-dd HH:mm:ss');
                    var endTime = kendo.parseDate($scope.model.examRound.endTime, 'yyyy-MM-dd HH:mm:ss');
                    var publishTime = kendo.parseDate($scope.model.examRound.publishTime, 'yyyy-MM-dd HH:mm:ss');
                    if ($scope.model.examRound.name == null || $scope.model.examRound.name === '') {
                        $scope.globle.showTip('请输入考试名称', 'error');
                        return;
                    }
                    if ($scope.model.examRound.passScore == null || $scope.model.examRound.passScore === '') {
                        $scope.globle.showTip('请输入及格分数', 'error');
                        return;
                    }
                    if ($scope.model.examRound.examTimeLength == null || $scope.model.examRound.examTimeLength === '') {
                        $scope.globle.showTip('请输入考试时长', 'error');
                        return;
                    }
                    if ($scope.model.examRound.examModeType === '2') {
                        /* if ($scope.model.examRound.lastEnterTimeLength == null || $scope.model.examRound.lastEnterTimeLength === '') {
                             $scope.globle.showTip('请输入开考不许进入时长', 'error');
                             return;
                         }
                         if ($scope.model.examRound.minSubmitTimeLength == null || $scope.model.examRound.minSubmitTimeLength === '') {
                             $scope.globle.showTip('请输入开考不许交卷时长', 'error');
                             return;
                         }*/
                        if ($scope.model.examRound.examTimeLength * 60 * 1000 != (endTime.getTime() - beginTime.getTime())) {
                            $scope.globle.showTip('固定时长的考试时间范围必须等于考试时长', 'error');
                            return;
                        }
                        if (parseInt($scope.model.examRound.lastEnterTimeLength) > parseInt($scope.model.examRound.examTimeLength)) {
                            $scope.globle.showTip('固定时长的开考不许进入时长不能大于考试时长', 'error');
                            return;
                        }
                        if (parseInt($scope.model.examRound.minSubmitTimeLength) > parseInt($scope.model.examRound.examTimeLength)) {
                            $scope.globle.showTip('固定时长的开考不许交卷时长不能大于考试时长', 'error');
                            return;
                        }
                    } else if ($scope.model.examRound.examModeType === '1') {
                        if ((endTime.getTime() - beginTime.getTime()) < ($scope.model.examRound.examTimeLength * 60 * 1000)) {
                            $scope.globle.showTip('随到随学的考试时间范围必须大于考试时长', 'error');
                            return;
                        }
                    }
                    if (beginTime == null || beginTime === '') {
                        $scope.globle.showTip('请设置考试起始时间', 'error');
                        return;
                    }
                    if (endTime == null || endTime === '') {
                        $scope.globle.showTip('请设置考试结束时间', 'error');
                        return;
                    }
                    if (nowDate.getTime() > beginTime.getTime()) {
                        $scope.globle.showTip('考试起始时间不能小于当前时间时间', 'error');
                        return;
                    }
                    if (endTime.getTime() < beginTime.getTime()) {
                        $scope.globle.showTip('考试起始时间不能大于考试结束时间时间', 'error');
                        return;
                    }
                    if ($scope.model.examRound.publishType === '2' && (publishTime == null || publishTime === '')) {
                        $scope.globle.showTip('请设置公布时间', 'error');
                        return;
                    }
                    if ($scope.model.examRound.publishType === '2' && publishTime.getTime() < endTime.getTime()) {
                        $scope.globle.showTip('公布时间不能小于考试结束时间', 'error');
                        return;
                    }
                    /*if ($scope.model.teacherIds == null || $scope.model.teacherIds.length < 1) {
                        $scope.globle.showTip('请至少选择一个阅卷老师', 'error');
                        return;
                    }*/
                    $scope.show = {
                        releasePaperStep2: true
                    };
                },

                removePaper: function () {
                    $scope.model.totalScore = 0;
                    $scope.model.examRound.examPaperId = null;
                    $scope.model.examRound.passScore = null;
                    $scope.model.examRound.examTimeLength = null;
                    $scope.model.examRound.examPaperId = null;
                    $scope.model.examPaperName = null;
                },

                back: function () {
                    $scope.show = {
                        releasePaperStep1: true
                    };
                },
                /**
                 * 切换选择发布对象的Tab
                 * @param e
                 * @param studyObjectCursor
                 */
                toggleStudyObject: function (e, studyObjectCursor) {
                    e.preventDefault();
                    $scope.model.studyObjectCursor = studyObjectCursor;

                    editNewRequiredPackage.utils.loadTargetElectedData(studyObjectCursor);
                },
                /**
                 * 重载待选学习对象的数据
                 * @param e
                 * @param type
                 */
                reloadElectedStudyObjectData: function (e, type) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);

                    proxy.electedKendoNode.pager.page(1);
                },
                /**
                 * 批量选择学习对象
                 * @param e
                 * @param type
                 */
                batchSelectStudyObject: function (e, type) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);

                    var viewData = proxy.electedKendoNode.dataSource.view(),
                        i, dataItem, id, index;

                    for (i = 0; i < viewData.length; i++) {
                        dataItem = viewData[i];
                        id = type === 1 ? dataItem.userId : dataItem.id;
                        // 判断是否已在选中的列表中
                        index = _.indexOf(proxy.selectedStudyObjectIdList, id);
                        if (index === -1) {
                            // 设置选中
                            dataItem.isChoice = true;

                            proxy.selectedStudyObjectIdList.push(id);
                            proxy.selectedStudyObjectList.push(dataItem);
                        }
                    }
                },
                /**
                 * 在表格中<取消选择>学习对象
                 * @param e
                 * @param type
                 * @param dataItem
                 */
                removeStudyObjectByGrid: function (e, type, dataItem) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type),
                        id = type === 1 ? dataItem.userId : dataItem.id;

                    // 获取当前课程ID在<selectedLessonList>的下标并移除
                    var index = -1,
                        selectedLessonList = proxy.selectedStudyObjectList,
                        i, studyObject, studyObjectId;
                    for (i = 0; i < selectedLessonList.length; i++) {
                        studyObject = selectedLessonList[i];
                        studyObjectId = type === 1 ? studyObject.userId : studyObject.id;
                        if (studyObjectId === id) {
                            index = i;
                            break;
                        }
                    }
                    index !== -1 && proxy.selectedStudyObjectList.splice(index, 1);

                    // 从已选课程ID的数组中移除
                    var position = _.indexOf(proxy.selectedStudyObjectIdList, id);
                    if (position !== -1) {
                        proxy.selectedStudyObjectIdList.splice(position, 1);
                    }

                    // 设置未选
                    dataItem.isChoice = false;
                },
                /**
                 * 清空已选的发布对象
                 * @param e
                 * @param type 1:员工, 2: 岗位; 3: 组织机构(重置操作对于组织机构不需要调用{@link editNewRequiredPackage.utils.getTargetProxy})
                 */
                emptyStudyObject: function (e, type) {
                    e.preventDefault();
                    // 重置
                    if (type === 1) {
                        $scope.model.selectedEmployeeIdList = [];
                        $scope.model.selectedEmployeeList = [];
                    } else if (type === 2) {
                        $scope.model.selectedJobIdList = [];
                        $scope.model.selectedJobList = [];
                    } else if (type === 3) {
                        $scope.model.selectedUnitIdList = [];
                        $scope.model.selectedOrgIdList = [];
                    }

                    //== 员工和岗位是<Grid>类型
                    // 从grid把当前view的所有数据全部设置<isChoice>为false;
                    if (type === 1 || type === 2) {
                        var proxy = editNewRequiredPackage.utils.getTargetProxy(type),
                            viewData = proxy.electedKendoNode.dataSource.view(),
                            i;
                        for (i = 0; i < viewData.length; i++) {
                            viewData[i].isChoice = false;
                        }
                    } else if (type === 3) {
                        var unitOrgList = $scope.model.selectedUnitOrgList,
                            size = unitOrgList.length,
                            i, unitOrg, node;
                        if (size > 0) {
                            for (i = 0; i < size; i++) {
                                unitOrg = unitOrgList[i];
                                node = $scope.node.electedUnitOrgTree.findByText(unitOrg.name);

                                if (node != null) {
                                    $scope.node.electedUnitOrgTree.enable(node, true);
                                }
                            }
                            // 重置已选的组织机构
                            $scope.model.selectedUnitOrgList = [];
                        }
                    }
                },
                /**
                 * 选择发布对象
                 * @param e
                 * @param type
                 * @param dataItem
                 */
                chooseStudyObject: function (e, type, dataItem) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);

                    if (type === 1) {
                        proxy.selectedStudyObjectIdList.push(dataItem.userId);
                    } else if (type === 2) {
                        proxy.selectedStudyObjectIdList.push(dataItem.id);
                    } else if (type === '3') {
                        proxy.selectedStudyObjectIdList.push(dataItem.id);
                    }
                    else {
                        $scope.globle.alert('错误', '选择了错误的学习对象类型');
                        return;
                    }
                    proxy.selectedStudyObjectList.push(dataItem);
                    dataItem.isChoice = true;
                },
                /**
                 * 移除发布对象
                 * @param e
                 * @param type 1: 员工; 2: 员工; '1': 单位; '2': 部门
                 * @param index
                 * @param key 对于type是1、2的学习对象, key是员工ID、岗位ID; 对于type是'1'、'2'的学习对象, key是组织机构名称
                 */
                removeStudyObject: function (e, type, index, key) {
                    e.preventDefault();
                    var proxy = editNewRequiredPackage.utils.getTargetProxy(type);

                    //从已选学习对象的数组中移除
                    proxy.selectedStudyObjectList.splice(index, 1);

                    // 从已选学习对象的ID数组中移除
                    var position = _.indexOf(proxy.selectedStudyObjectIdList, key);
                    if (position !== -1) {
                        proxy.selectedStudyObjectIdList.splice(position, 1);
                    }

                    // 从当前view中找到对应的行并设置<isChoice>为false;
                    if (type === 1 || type === 2) {
                        var viewData = proxy.electedKendoNode.dataSource.view(),
                            i, row, rowId;
                        for (i = 0; i < viewData.length; i++) {
                            row = viewData[i];
                            // 用户的ID key是userId
                            rowId = type === 1 ? row.userId : row.id;
                            if (rowId === key) {
                                // 单个 找到就终止判断
                                row.isChoice = false;
                                break;
                            }
                        }
                    } else if (type === '1' || type === '2') {
                        var node = $scope.node.electedUnitOrgTree.findByText(key);
                        if (node != null) {
                            $scope.node.electedUnitOrgTree.enable(node, true);
                        }
                    }
                },
                cancelTeacher: function () {
                    $scope.model.teacherIds = null;
                    $scope.model.teacherIds = [];
                    $scope.node.electedTeacherGrid.dataSource.read();
                    $scope.node.windows.teacherWindow.close();
                },
                /**
                 * 发布
                 * */
                release: function () {
                    if ($scope.submitNow) {
                        return;
                    }
                    $scope.submitNow = true;
                    $scope.model.examRound.employeeIdList = $scope.model.selectedEmployeeIdList,
                        $scope.model.examRound.jobIdList = $scope.model.selectedJobIdList,
                        $scope.model.examRound.organizationIdList = $scope.model.selectedOrgIdList,
                        $scope.model.examRound.unitIdList = $scope.model.selectedUnitIdList,
                        $scope.model.examRound.teacherIds = $scope.model.teacherIds;
                    if ($scope.model.examRound.employeeIdList.length == 0 &&
                        $scope.model.examRound.jobIdList == 0 &&
                        $scope.model.examRound.organizationIdList == 0 &&
                        $scope.model.examRound.unitIdList == 0) {
                        $scope.globle.showTip('请至少选择一个发布对象', 'error');
                        return;
                    }
                    examService.releasePaper($scope.model.examRound).then(function (data) {
                        $scope.submitNow = false;
                        if (!data.status) {
                            $scope.globle.alert('发布失败!', data.info);
                        } else {
                            $state.go('states.exam.continue', {comeForm: $scope.$stateParams.comeForm});
                        }
                    });
                },
                choicePaper: function (dataItem) {
                    $scope.model.examRound.examPaperId = dataItem.id;
                    $scope.model.examRound.passScore = dataItem.passScore;
                    $scope.model.examRound.examTimeLength = dataItem.timeLength;
                    $scope.model.examPaperName = dataItem.name;
                    $scope.model.totalScore = dataItem.totalScore;
                    $scope.node.windows.examPaperWindow.close();
                },
                getOrgInfo: function (dataItem) {
                    $scope.model.examPaperName = dataItem.name;
                    $scope.model.examTypeId = dataItem.id;
                    $scope.examTypeTreeShow = false;
                }
            };
            editNewRequiredPackage.uiTemplate = {
                electedEmployeeGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: unit #/#: organization #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: job #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button ng-if="!dataItem.isChoice" ng-click="events.chooseStudyObject($event, 1, dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice" ng-click="events.removeStudyObjectByGrid($event, 1, dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                },
                electedJobGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button ng-if="!dataItem.isChoice" ng-click="events.chooseStudyObject($event, 2, dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice" ng-click="events.removeStudyObjectByGrid($event, 2, dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                },
                teacherGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: unitName #/#: organizationName #');
                    result.push('</td>');


                    result.push('<td class="op">');
                    result.push('<button ng-if="!dataItem.isChoice" ng-click="events.chooseStudyObject($event, \'3\', dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice" ng-click="events.removeStudyObjectByGrid($event, \'3\', dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                },
                examPaperGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: examRange ==1 ? \'考试\' : ( examRange == 2 ? \'练习\' : \'模拟\') #');
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
                    result.push('#: createUserName #');
                    result.push('</td>');


                    result.push('<td>');
                    //result.push('<button   class="table-btn">预览</button>');
                    result.push('<button  ng-click="events.choicePaper(dataItem)"  class="table-btn">选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                }
            };
            editNewRequiredPackage.utils = {
                /**
                 * 加载目前待选的数据
                 * @param studyObjectCursor
                 */
                loadTargetElectedData: function (studyObjectCursor) {
                    if (studyObjectCursor) {
                        switch (studyObjectCursor) {
                            case 1:
                                this.initialElectedEmployeeGrid();
                                break;
                            case 2:
                                this.initialElectedJobGrid();
                                break;
                            case 3:
                                this.initialElectedUnitOrgTree();
                                break;
                            default :
                                $scope.globle.alert('错误', '错误的学习对象类型!');
                                break;
                        }
                    }
                },
                /**
                 * 初始化待选的学员表格
                 */
                initialElectedEmployeeGrid: function () {
                    $scope.ui.electedEmployeeGrid = {
                        selectable: true,
                        pageable: {
                            refresh: true
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(editNewRequiredPackage.uiTemplate.electedEmployeeGridRow()),
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            serverPaging: true,
                            page: 1,
                            pageSize: 5, // 每页显示的数据数目
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        angular.extend(data, $scope.model.electedEmployeeGridParams);
                                        data.pageNo = data.page;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/requiredPackage/getEmployeePage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            selectedEmployeeIdList = $scope.model.selectedEmployeeIdList,
                                            index = 1;

                                        _.forEach(viewData, function (row) {
                                            row.isChoice = false;
                                            row.index = index++;
                                            _.forEach(selectedEmployeeIdList, function (employeeId) {
                                                if (row.userId === employeeId) {
                                                    row.isChoice = true;
                                                }
                                            });
                                        });
                                        return response;
                                    } else {
                                        $scope.globle.alert('错误', '待选学员加载失败!');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {title: 'No.', width: 60},
                            {title: '姓名'},
                            {title: '单位/部门', width: 200},
                            {title: '岗位', width: 100},
                            {title: '操作', width: 80}
                        ]
                    };
                },

                /**
                 * 初始化待选的员工表格
                 */
                initialElectedJobGrid: function () {
                    if (!$scope.ui.electedJobGrid) {
                        $scope.ui.electedJobGrid = {
                            selectable: true,
                            pageable: {
                                refresh: true
                            },
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(editNewRequiredPackage.uiTemplate.electedJobGridRow()),
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                serverPaging: true,
                                page: 1,
                                pageSize: 5, // 每页显示的数据数目
                                transport: {
                                    parameterMap: function (data, type) {
                                        if (type === 'read') {
                                            angular.extend(data, {
                                                name: $scope.model.electedJobGridParams.name
                                            });
                                            data.pageNo = data.page;
                                        }
                                        return data;
                                    },
                                    read: {
                                        url: '/web/admin/requiredPackage/getJobPage',
                                        dataType: 'json'
                                    }
                                },
                                schema: {
                                    parse: function (response) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if (response.status) {
                                            var viewData = response.info,
                                                selectedJobIdList = $scope.model.selectedJobIdList,
                                                index = 1;

                                            _.forEach(viewData, function (row) {
                                                row.isChoice = false;
                                                row.index = index++;
                                                _.forEach(selectedJobIdList, function (jobId) {
                                                    if (row.id === jobId) {
                                                        row.isChoice = true;
                                                    }
                                                });
                                            });
                                            return response;
                                        } else {
                                            $scope.globle.alert('错误', '待选岗位加载失败!');
                                            return {
                                                status: response.status,
                                                totalSize: 0,
                                                totalPageSize: 0,
                                                info: []
                                            };
                                        }
                                    },
                                    total: function (response) {
                                        return response.totalSize;
                                    },
                                    data: function (response) {
                                        return response.info;
                                    }
                                }
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns: [
                                {title: 'No.', width: 60},
                                {field: 'name', title: '姓名'},
                                {title: '操作', width: 80}
                            ]
                        };
                    }
                },
                /**
                 * 加载待选区的组织机构树
                 */
                initialElectedUnitOrgTree: function () {
                    $scope.ui.electedUnitOrgTree = {
                        template: '#= item.name #',
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        angular.extend(data, $scope.model.electedUnitOrgTreeParams);
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/requiredPackage/getUnitOrgList',
                                    // 节点展开时, 默认传递的参数名是id, 参考下面expand的实现
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    if (response.status) {
                                        _.forEach(response.info, function (row) {
                                            row.expanded = false;
                                            row.image = '/admin/images/' + (row.type === '1' ? 'home' : 'dept') + '.png';
                                        });
                                    }
                                    return response;
                                },

                                data: function (response) {
                                    return response.info;
                                },
                                model: {
                                    hasChildren: 'hasChildren'
                                }
                            }
                        },
                        dataTextField: 'name',
                        // 设置节点的图标的来源属性key
                        dataImageUrlField: 'image',
                        select: function (e) {
                            var dataItem = this.dataItem(e.node);
                            if (dataItem.type === '1') {
                                $scope.model.selectedUnitIdList.push(dataItem.id);
                            } else if (dataItem.type === '2') {
                                $scope.model.selectedOrgIdList.push(dataItem.id);
                            } else {
                                $scope.globle.alert('错误', '错误的组织机构类型[ ' + dataItem.type + ']');
                            }
                            $scope.model.selectedUnitOrgList.push(dataItem);

                            // 选择则禁用-置灰
                            this.enable(e.node, false);
                        },
                        expand: function (e) {
                            $scope.model.electedUnitOrgTreeParams.nodeType = this.dataItem(e.node).type;
                        }
                    };
                },

                wrapGridRowData: function (dataItem) {
                    return {
                        id: dataItem.id,
                        name: dataItem.name,
                        credit: dataItem.credit,
                        lessonTypeName: dataItem.lessonTypeName
                    };
                },

                getTargetProxy: function (studyObjectType) {
                    var selectedStudyObjectIdList,
                        selectedStudyObjectList,
                        electedKendoNode;

                    //== 员工类型
                    if (studyObjectType === 1) {
                        selectedStudyObjectIdList = $scope.model.selectedEmployeeIdList;
                        selectedStudyObjectList = $scope.model.selectedEmployeeList;
                        electedKendoNode = $scope.node.electedEmployeeGrid;

                        //== 岗位类型
                    } else if (studyObjectType === 2) {
                        selectedStudyObjectIdList = $scope.model.selectedJobIdList;
                        selectedStudyObjectList = $scope.model.selectedJobList;
                        electedKendoNode = $scope.node.electedJobGrid;

                        //== 单位类型
                    } else if (studyObjectType === '1') {
                        selectedStudyObjectIdList = $scope.model.selectedUnitIdList;
                        selectedStudyObjectList = $scope.model.selectedUnitOrgList;
                        electedKendoNode = $scope.node.electedUnitOrgTree;

                        //== 部门类型
                    } else if (studyObjectType === '2') {
                        selectedStudyObjectIdList = $scope.model.selectedOrgIdList;
                        selectedStudyObjectList = $scope.model.selectedUnitOrgList;
                        electedKendoNode = $scope.node.electedUnitOrgTree;

                    } else if (studyObjectType === '3') {
                        selectedStudyObjectIdList = $scope.model.teacherIds;
                        selectedStudyObjectList = $scope.model.teachers;
                    }
                    else {
                        $scope.globle.alert('错误', '错误的学习对象类型');
                        return;
                    }

                    return {
                        selectedStudyObjectIdList: selectedStudyObjectIdList,
                        selectedStudyObjectList: selectedStudyObjectList,
                        electedKendoNode: electedKendoNode
                    };
                }

            };
            editNewRequiredPackage.utils.initialElectedEmployeeGrid();

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
            $scope.ui.tree = {
                options: {
                    checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: dataSource
                }
            };
            $scope.ui.datePicker = {
                begin: {
                    options: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd HH:mm:ss',
                        change: $scope.events.startChange,
                        interval: 5
                    }
                },
                end: {
                    options: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd HH:mm:ss',
                        change: $scope.events.endChange,
                        interval: 5
                    }
                }
            };
            /*$scope.ui.electedTeacherGrid = {
                selectable: true,
                pageable: {
                    refresh: true
                },
                // 每个行的模板定义,
                rowTemplate: kendo.template(editNewRequiredPackage.uiTemplate.teacherGridRow()),
                noRecords: {
                    template: '暂无数据'
                },
                dataSource: {
                    serverPaging: true,
                    page: 1,
                    pageSize: 3, // 每页显示的数据数目
                    transport: {
                        parameterMap: function (data, type) {
                            if (type === 'read') {
                                angular.extend(data, $scope.model.electedTeacherGridParams);
                                data.pageNo = data.page;
                            }
                            return data;
                        },
                        read: {
                            url: "/web/admin/teacher/findByQuery",
                            dataType: 'json',
                            data: function (e) {
                                var temp = {}, params = $scope.model.queryParam;
                                for (var key in params) {
                                    if (params.hasOwnProperty(key)) {
                                        if (params[key]) {
                                            temp[key] = params[key];
                                        }
                                    }
                                }
                                temp.pageNo = e.page;
                                $scope.model.queryParam.pageNo=temp.pageNo;
                                temp.pageSize = $scope.model.queryParam.pageSize;
                                return temp;
                            }
                        }
                    },
                    schema: {
                        parse: function (response) {
                            // 将会把这个返回的数组绑定到数据源当中
                            if (response.status) {
                                var viewData = response.info,
                                    selectedEmployeeIdList = $scope.model.teacherIds,
                                    index = 1;

                                _.forEach(viewData, function (row) {
                                    row.isChoice = false;
                                    row.index = index++;
                                    _.forEach(selectedEmployeeIdList, function (employeeId) {
                                        if (row.id === employeeId) {
                                            row.isChoice = true;
                                        }
                                    });
                                });
                                return response;
                            } else {
                                $scope.globle.alert('错误', '待选教师加载失败!');
                                return {
                                    status: response.status,
                                    totalSize: 0,
                                    totalPageSize: 0,
                                    info: []
                                };
                            }
                        },
                        total: function (response) {
                            return response.totalSize;
                        },
                        data: function (response) {
                            return response.info;
                        }
                    }
                },
                // 选中切换的时候改变选中行的时候触发的事件
                columns: [
                    {title: "No.", width: 60},
                    {title: "姓名", width: 100},
                    {title: "单位/部门", width: 300},
                    {title: "操作"}
                ]
            };*/
            $scope.ui.examPaperGrid = {
                options: {
                    //toolbar:[],
                    dataBinding: function (e) {
                        $scope.model.gridReturnData = e.items;
                    },
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(editNewRequiredPackage.uiTemplate.examPaperGridRow()),
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
                                        'paperSearch.name': $scope.model.paperSearch.name,
                                        'paperSearch.draft': 1,
                                        'paperSearch.enable': 0,
                                        'paperSearch.configType': '-1',
                                        'paperSearch.examRange': $scope.$stateParams.examRange,
                                        'examTypeId': $scope.model.examTypeId
                                    };
                                }
                            },
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/paper/findExamPaperPage',
                                dataType: 'json'
                            }
                        }
                    },
                    // 选中切换的时候改变选中行的时候触发的事件
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        pageSize: 4,
                        buttonCount: 10
                    },
                    columns: [
                        {title: '试卷名称'},
                        {title: '试卷类型', width: 80},
                        {title: '组卷方式', width: 100},
                        {title: '试卷类别', width: 120},
                        {title: '试卷总分', width: 80},
                        {title: '创建者', width: 80},
                        {title: '操作', width: 200}
                    ]
                }
            };
            $scope.ui.windowOptions = {
                modal: true,
                visible: false,
                resizable: false,
                draggable: false,
                title: false,
                open: function () {
                    this.center();
                }
            };
            $scope.ui.examPaperGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.examPaperGrid.options);
        }];

    return controller;
});
