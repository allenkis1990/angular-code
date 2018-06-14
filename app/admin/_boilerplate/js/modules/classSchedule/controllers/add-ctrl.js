define(['common/hbWebUploader'], function () {
    'use strict';
    return ['$scope', 'classScheduleService', '$state', '$stateParams', '$timeout', '$q', 'HB_dialog', 'HB_notification', 'hbUtil',
        function ($scope, classScheduleService, $state, $stateParams, $timeout, $q, HB_dialog, HB_notification, hbUtil) {
            classScheduleService.getUrlPrefix().then(function (response) {
                if (response.status) {
                    $scope.urlPrefix = response.info;
                }
            });
            $scope.uploader = {
                resource: null
            };
            $scope.$watch('model.resourceUploader', function (newValue) {
                console.log('resourceUploader: ', newValue);
                if (!isBlank(newValue)) {
                    var extArr = newValue.fileName.split('.');
                    console.log('extArr: ', extArr);
                    var fileName = extArr[0];
                    console.log('fileName: ', fileName);
                    var extension = extArr[extArr.length - 1];
                    console.log('extension: ', extension);
                    console.log('size: ', $scope.uploader.resource.selectFile.size);
                    console.log('formatSize: ', $scope.uploader.resource.selectFile.formatSize);
                    var resourceData = {
                        extension: extension,
                        path: newValue.newPath,
                        size: $scope.uploader.resource.selectFile.size,
                        formatSize: $scope.uploader.resource.selectFile.formatSize
                    };
                    var resource = {
                        name: fileName,
                        resourceType: 1,
                        resourceData: resourceData,
                        modifyMode: false
                    };
                    $scope.model.attachmentList.push(resource);
                    console.log("attachmentList: ", $scope.model.attachmentList);
                }
            });
            $scope.model = {
                resourceUploader: null,
                itemTemplateList: [],
                currentIndex: 0,
                planTemplate: {
                    name: ''
                },
                itemTemplateDto: {
                    name: '',
                    abouts: '',
                    teacherId: '',
                    teacherName: '',
                    teacherAbouts: '',
                    timeLength: '',
                    itemResourceList: []
                },
                //以下为教师相关Model
                selectTeacherType: 0, //0：统一老师授课，1：每个课程独立老师授课
                selectTeacherInfo: {},
                teacherList: [],
                //以下为附件相关
                resType: 0,
                //以下为课程附件相关Model
                indexCourseParams: {
                    id: '0',
                    parentId: null,
                    name: null
                },
                indexCRMParams: {
                    courseId: null,
                    parentId: null,
                    name: null
                },
                courseParams: {
                    name: '',
                    status: 1,
                    needQuestionCount: false
                },
                courseList: [],
                courseSelectedList: [],
                //以下为上传附件相关Model
                attachmentList: [],
            };
            //测了个试
            /*$scope.model.planTemplate.name = "2333";
            $scope.model.selectTeacherType = 1;
            for (var i = 1; i <= 3; i++) {
                var text = "测试" + i;
                var testDto = {
                    name: text,
                    abouts: text,
                    teacherId: "teacherId" + i,
                    teacherName: text,
                    teacherAbouts: text,
                    timeLength: i * 26,
                    itemResourceList: []
                }
                $scope.model.itemTemplateList.push(testDto);
            }*/
            //测了个试
            $scope.node = {
                itemTemplateGrid: null,
                teacherGrid: null,
                courseGrid: null,
                tree: null,
            };
            $scope.events = {
                resetItemTemplateDto: function () {
                    $scope.model.itemTemplateDto = {
                        name: '',
                        abouts: '',
                        teacherId: '',
                        teacherName: '',
                        teacherAbouts: '',
                        timeLength: '',
                        itemResourceList: []
                    }
                },
                loadGrid: function (e) {
                    $scope.node.itemTemplateGrid.pager.page(1);
                },
                refreshGrid: function (e) {
                    $timeout(function () {
                        $scope.node.itemTemplateGrid.dataSource.read();
                        console.log('itemTemplateList: ', $scope.model.itemTemplateList);
                    }, 500)
                },
                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.loadGrid(e);
                    }
                },
                addItemTemplateWindow: function (e) {
                    if (isBlank($scope.model.planTemplate.name)) {
                        HB_dialog.error('提示', "请输入课程名称");
                        return false;
                    }
                    if ($scope.model.planTemplate.name.length > 50) {
                        HB_dialog.error('提示', "课程名称最多不超过50字");
                        return false;
                    }
                    if ($scope.model.selectTeacherType == 0) {
                        if (isBlank($scope.model.selectTeacherInfo.userId)) {
                            HB_dialog.error('提示', "请选择教师");
                            return false;
                        }
                    }
                    $scope.addItemTemplateWindow = HB_dialog.contentAs($scope, {
                        title: '新增课程',
                        width: 1000,
                        height: 550,
                        showCancel: false,
                        showCertain: false,
                        cancelText: '取消',
                        confirmText: '确定',
                        closed: function () {
                            $scope.events.resetItemTemplateDto();
                            $scope.events.refreshGrid();
                        },
                        cancel: function () {
                        },
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;
                            defer.resolve();
                            wow.close();
                            return promise;
                        },
                        templateUrl: '@systemUrl@/views/classSchedule/itemTemplate-add.html'
                    });

                },
                submitItemTemplate: function (e) {
                    /*提交*/
                    if (!itemTemplateValidate($scope.model.itemTemplateDto)) {
                        return;
                    }
                    $scope.model.itemTemplateList.push($scope.model.itemTemplateDto);
                    $scope.events.closeWindow('addItemTemplateWindow');
                },
                deleteItemTemplate: function (e, index) {
                    $scope.model.currentIndex = index;
                    console.log('currentIndex: ', index);
                    $scope.globle.confirm("提示", '您正在删除课程，删除后无法恢复，是否确定删除？', function (dialog) {
                        $scope.model.itemTemplateList.splice(index, 1);
                        HB_dialog.success('提示', '操作成功');
                        $scope.events.refreshGrid();
                        dialog.doRightClose();
                    });
                },
                modifyItemTemplateWindow: function (e, index) {
                    $scope.model.currentIndex = index;
                    console.log('currentIndex: ', index);
                    $scope.model.itemTemplateDto = $.extend({}, $scope.model.itemTemplateList[$scope.model.currentIndex]);
                    //教师信息
                    $scope.model.selectTeacherInfo = {};
                    $scope.model.selectTeacherInfo.userId = $scope.model.itemTemplateDto.teacherId;
                    $scope.model.selectTeacherInfo.name = $scope.model.itemTemplateDto.teacherName;
                    $scope.model.selectTeacherInfo.description = $scope.model.itemTemplateDto.teacherAbouts;

                    $scope.modifyItemTemplateWindow = HB_dialog.contentAs($scope, {
                        title: '编辑课程',
                        width: 1000,
                        height: 550,
                        showCancel: false,
                        showCertain: false,
                        cancelText: '取消',
                        confirmText: '确定',
                        closed: function () {
                            $scope.events.resetItemTemplateDto();
                            $scope.events.refreshGrid();
                        },
                        cancel: function () {
                        },
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;
                            defer.resolve();
                            wow.close();
                            return promise;
                        },
                        templateUrl: '@systemUrl@/views/classSchedule/itemTemplate-update.html'
                    });

                },
                updateItemTemplate: function (e) {
                    /*提交*/
                    if (!itemTemplateValidate($scope.model.itemTemplateDto)) {
                        return;
                    }
                    $scope.model.itemTemplateList[$scope.model.currentIndex].name = $scope.model.itemTemplateDto.name;
                    $scope.model.itemTemplateList[$scope.model.currentIndex].abouts = $scope.model.itemTemplateDto.abouts;
                    $scope.model.itemTemplateList[$scope.model.currentIndex].timeLength = $scope.model.itemTemplateDto.timeLength;
                    $scope.model.itemTemplateList[$scope.model.currentIndex].teacherId = $scope.model.itemTemplateDto.teacherId;
                    $scope.model.itemTemplateList[$scope.model.currentIndex].teacherName = $scope.model.itemTemplateDto.teacherName;
                    $scope.model.itemTemplateList[$scope.model.currentIndex].teacherAbouts = $scope.model.itemTemplateDto.teacherAbouts;
                    $scope.events.closeWindow('modifyItemTemplateWindow');
                },
                detailItemTemplateWindow: function (e, index) {
                    $scope.model.currentIndex = index;
                    console.log('currentIndex: ', index);
                    //设置附件
                    setResource(index);
                    $scope.detailItemTemplateWindow = HB_dialog.contentAs($scope, {
                        title: '课程详情',
                        width: 1000,
                        height: 550,
                        showCancel: false,
                        showCertain: false,
                        cancelText: '取消',
                        confirmText: '确定',
                        closed: function () {
                            $scope.events.refreshGrid();
                        },
                        cancel: function () {
                        },
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;
                            defer.resolve();
                            wow.close();
                            return promise;
                        },
                        templateUrl: '@systemUrl@/views/classSchedule/itemTemplate-detail.html'
                    });

                },
                beforeSubmit: function (e) {
                    if (isBlank($scope.model.planTemplate.name)) {
                        HB_dialog.error('提示', "请输入培训课表名称");
                        return;
                    }
                    if ($scope.model.planTemplate.name.length > 50) {
                        HB_dialog.error('提示', "课表名称最多不超过50字");
                        return;
                    }
                    if ($scope.model.selectTeacherType == 0) {
                        if (isBlank($scope.model.selectTeacherInfo.userId)) {
                            HB_dialog.error('提示', "请选择教师");
                            return false;
                        }
                    }
                    if ($scope.model.itemTemplateList < 1) {
                        HB_dialog.error('提示', "课程表至少需要有1门课程");
                        return;
                    }
                    classScheduleService.canSavePlanTemplateName({
                        planTemplateId: null,
                        planTemplateName: $scope.model.planTemplate.name,
                    }).then(function (response) {
                        if (response.status) {
                            if (response.info) {
                                $scope.events.submitTemplate(e);
                            } else {
                                HB_dialog.error('提示', "课表名称不能重复");
                            }
                        } else {
                            HB_dialog.error('提示', response.info);
                        }
                    })
                },
                submitTemplate: function (e) {
                    //授课教师为统一老师授课时，更新所有课程的授课老师
                    if ($scope.model.selectTeacherType == 0) {
                        angular.forEach($scope.model.itemTemplateList, function (item) {
                            item.teacherId = $scope.model.selectTeacherInfo.userId;
                            item.teacherName = $scope.model.selectTeacherInfo.name;
                            item.teacherAbouts = $scope.model.selectTeacherInfo.description;
                        });
                    }
                    classScheduleService.addPlanTemplate({
                        name: $scope.model.planTemplate.name,
                        itemTemplateList: $scope.model.itemTemplateList
                    }).then(function (response) {
                        if (response.status) {
                            HB_dialog.success('提示', "操作成功");
                            $state.go("states.classSchedule", {reload: true});
                        } else {
                            HB_dialog.error('提示', response.info);
                        }
                    })
                },
                closeWindow: function (windowName) {
                    $scope[windowName].close($scope[windowName].dialogIndex);
                },
                //以下为附件相关
                addResourceWindow: function (e, index) {
                    $scope.model.currentIndex = index;
                    console.log('currentIndex: ', index);
                    //设置附件
                    setResource(index);
                    $scope.addResourceWindow = HB_dialog.contentAs($scope, {
                        title: '学习资料管理',
                        width: 1000,
                        height: 550,
                        showCancel: false,
                        showCertain: false,
                        cancelText: '取消',
                        confirmText: '确定',
                        closed: function () {
                            $scope.events.refreshGrid();
                        },
                        cancel: function () {
                        },
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;
                            defer.resolve();
                            wow.close();
                            return promise;
                        },
                        templateUrl: '@systemUrl@/views/classSchedule/resourceTemplate.html'
                    });

                },
                selectResType: function (e, resType) {
                    $scope.model.resType = resType;
                },
                saveResource: function (e) {
                    $scope.model.itemTemplateList[$scope.model.currentIndex].itemResourceList = [];
                    angular.forEach($scope.model.courseSelectedList, function (course) {
                        $scope.model.itemTemplateList[$scope.model.currentIndex].itemResourceList.push(course);
                    });
                    angular.forEach($scope.model.attachmentList, function (attachment) {
                        $scope.model.itemTemplateList[$scope.model.currentIndex].itemResourceList.push(attachment);
                    });

                    HB_dialog.success('提示', '保存成功');
                    $scope.events.closeWindow('addResourceWindow');
                    console.log("currentItemTemplateList: ", $scope.model.itemTemplateList[$scope.model.currentIndex]);
                },
                //以下课程附件相关
                selectTeacherType: function (e, selectTeacherType) {
                    if ($scope.model.selectTeacherType == selectTeacherType) {
                        return;
                    }
                    if (selectTeacherType == 1 && $scope.model.itemTemplateList.length > 0) {
                        HB_dialog.error('提示', "请先将培训课程清空后再切换授课教师模式");
                        $timeout(function () {
                            $scope.model.selectTeacherType = 0;
                        })
                        return;
                    }
                    $scope.model.selectTeacherType = selectTeacherType;
                    $scope.model.selectTeacherInfo = {};
                },
                addTeacherWindow: function (e) {
                    $scope.addTeacherWindow = HB_dialog.contentAs($scope, {
                        title: '选择教师',
                        width: 800,
                        //height: 400,
                        showCancel: false,
                        showCertain: false,
                        cancelText: '取消',
                        confirmText: '确定',
                        closed: function () {
                        },
                        cancel: function () {
                        },
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;
                            defer.resolve();
                            wow.close();
                            return promise;
                        },
                        templateUrl: '@systemUrl@/views/classSchedule/teacher.html'
                    });
                },
                chooseTeacher: function (e, dataItem) {
                    $scope.model.selectTeacherInfo = dataItem;
                    $scope.events.closeWindow('addTeacherWindow');
                },
                addCourseWindow: function (e) {
                    console.log('currentIndex: ', $scope.model.currentIndex);
                    $scope.addCourseWindow = HB_dialog.contentAs($scope, {
                        title: '待选参考材料',
                        width: 1000,
                        height: 550,
                        showCancel: false,
                        showCertain: false,
                        cancelText: '取消',
                        confirmText: '确定',
                        closed: function () {
                        },
                        cancel: function () {
                        },
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;
                            defer.resolve();
                            wow.close();
                            return promise;
                        },
                        templateUrl: '@systemUrl@/views/classSchedule/course.html'
                    });

                },
                selectCategory: function (e, dataItem) {
                    if (dataItem.id == 0) {
                        $scope.model.courseParams.categoryId = null;
                        $scope.node.courseGrid.pager.page(1);
                    } else {
                        $scope.model.courseParams.categoryId = dataItem.id;
                        $scope.node.courseGrid.pager.page(1);
                    }
                    e.preventDefault();
                },
                queryCourse: function (e) {
                    $scope.node.courseGrid.pager.page(1);
                },
                chooseCourse: function (e, dataItem) {
                    var courseId = dataItem.id;
                    var courseName = dataItem.name;
                    var categoryName = dataItem.categoryName;
                    console.log('courseId: ', courseId);
                    console.log('courseName: ', courseName);
                    console.log('categoryName: ', categoryName);
                    var hasSameClass = false;
                    angular.forEach($scope.model.courseSelectedList, function (course) {
                        if (courseId == course.resourceData.courseId) {
                            hasSameClass = true;
                        }
                    });
                    if (hasSameClass) {
                        HB_dialog.error('提示', "[" + courseName + "]已经添加");
                        return;
                    }
                    var resourceData = {
                        courseId: courseId,
                        courseName: courseName,
                        categoryName: categoryName
                    };
                    var resource = {
                        name: courseName,
                        resourceType: 2,
                        resourceData: resourceData
                    };
                    $scope.model.courseSelectedList.push(resource);
                    console.log("courseSelectedList: ", $scope.model.courseSelectedList);
                },
                previewCourse: function (e, id) {
                    window.open('/play/#/previewLesson/trainClassId/' + id + '/courseware/xxx', '_blank');
                },
                deleteSelectedCourse: function (e, index) {
                    $scope.globle.confirm("提示", '确定删除？', function (dialog) {
                        $scope.model.courseSelectedList.splice(index, 1);
                        HB_dialog.success('提示', '操作成功');
                        dialog.doRightClose();
                        console.log("courseSelectedList: ", $scope.model.courseSelectedList);
                    });
                },
                //以下上传附件相关
                reNameAttachment: function (e, index) {
                    $scope.tempName = $scope.model.attachmentList[index].name;
                    $scope.model.attachmentList[index].modifyMode = true;
                },
                reNameConfirm: function (e, index) {
                    $scope.model.attachmentList[index].modifyMode = false;
                },
                reNameCancel: function (e, index) {
                    $scope.model.attachmentList[index].name = $scope.tempName;
                    $scope.model.attachmentList[index].modifyMode = false;
                },
                deleteAttachment: function (e, index) {
                    $scope.globle.confirm("提示", '确定删除？', function (dialog) {
                        $scope.model.attachmentList.splice(index, 1);
                        HB_dialog.success('提示', '操作成功');
                        dialog.doRightClose();
                        console.log("attachmentList: ", $scope.model.attachmentList);
                    });
                },
            };

            function isBlank(obj) {
                if (obj == undefined || obj == null || obj.length == 0) {
                    return true;
                } else {
                    return false;
                }
            };

            function itemTemplateValidate(obj) {
                if (isBlank(obj.name)) {
                    HB_dialog.error('提示', "请输入课程名称");
                    return false;
                }
                if (obj.name.length > 50) {
                    HB_dialog.error('提示', "课程名称最多不超过50字");
                    return false;
                }
                /*if (isBlank(obj.abouts)) {
                 HB_dialog.error('提示', "请输入课程简介");
                 return false;
                 }
                 if (obj.abouts.length > 300) {
                 HB_dialog.error('提示', "课程简介最多不超过300字");
                 return false;
                 }*/
                if (isBlank(obj.timeLength)) {
                    HB_dialog.error('提示', "请输入课程时长");
                    return false;
                }
                if (obj.timeLength <= 0) {
                    HB_dialog.error('提示', "课程时长需大于0");
                    return false;
                }
                if (obj.timeLength > 999999) {
                    HB_dialog.error('提示', "课程时长过大");
                    return false;
                }
                //设置教师信息
                obj.teacherId = $scope.model.selectTeacherInfo.userId;
                obj.teacherName = $scope.model.selectTeacherInfo.name;
                obj.teacherAbouts = $scope.model.selectTeacherInfo.description;
                if (isBlank(obj.teacherId)) {
                    HB_dialog.error('提示', "请选择教师");
                    return false;
                }
                /*if (isBlank(obj.teacherName)) {
                 HB_dialog.error('提示', "请输入讲师名称");
                 return false;
                 }
                 if (obj.teacherName.length > 50) {
                 HB_dialog.error('提示', "讲师名称最多不超过50字");
                 return false;
                 }
                 if (isBlank(obj.teacherAbouts)) {
                 HB_dialog.error('提示', "请输入讲师简介");
                 return false;
                 }
                 if (obj.teacherAbouts.length > 300) {
                 HB_dialog.error('提示', "讲师简介最多不超过300字");
                 return false;
                 }*/
                return true;
            };

            function setResource(currentIndex) {
                //设置附件
                $scope.model.courseSelectedList = [];
                $scope.model.attachmentList = [];
                angular.forEach($scope.model.itemTemplateList[currentIndex].itemResourceList, function (resource) {
                    if (resource.resourceType == 1) {
                        resource.modifyMode = false;
                        $scope.model.attachmentList.push(resource);
                    } else if (resource.resourceType == 2) {
                        $scope.model.courseSelectedList.push(resource);
                    }
                });
                console.log("courseSelectedList: ", $scope.model.courseSelectedList);
                console.log("attachmentList: ", $scope.model.attachmentList);
            };

            //列表模板
            var template = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-bind="dataItem.timeLength"></span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div ng-bind-html="dataItem.abouts|trustHtml"></div>');
                result.push('</td>');

                result.push('<td title="#: teacherName #">');
                result.push('#: teacherName #');
                result.push('</td>');

                result.push('<td title="#: teacherAbouts #">');
                result.push('#: teacherAbouts #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-bind="dataItem.itemResourceList.length>0?dataItem.itemResourceList.length:\'无\'"></span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.detailItemTemplateWindow($event,dataItem.index-1)">详情</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.addResourceWindow($event,dataItem.index-1)" has-permission="/classSchedule/UrlModifyPlanResourceTemplate">学习资料管理</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.modifyItemTemplateWindow($event,dataItem.index-1)" has-permission="/classSchedule/UrlUpdatePlanItemTemplate">编辑</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.deleteItemTemplate($event,dataItem.index-1)" has-permission="/classSchedule/UrlDeletePlanItemTemplate">删除</button>');
                result.push('</td>');

                result.push('</tr>');
                template = result.join('');
            })();
            $scope.itemTemplateGrid = {
                options: {
                    dataBinding: function (e) {
                        hbUtil.kendo.grid.nullDataDealLeaf(e);
                    },
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(template),
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        data: $scope.model.itemTemplateList,
                        schema: {
                            parse: function (response) {
                                // 将会把这个返回的数组绑定到数据源当中
                                if (!isBlank(response)) {
                                    var dataview = response, index = 1;
                                    angular.forEach(dataview, function (item) {
                                        item.index = index++;
                                    });
                                }
                                return response;
                            }
                        },
                    },
                    selectable: true,
                    scrollable: false,
                    sortable: false,
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
                        pageSize: 10,
                        buttonCount: 10
                    },
                    columns: [
                        {field: "index", title: "No.", sortable: false, width: 50},
                        {title: "课程名称", sortable: false},
                        {title: "课程时长（分钟）", sortable: false, width: 150},
                        {title: "课程简介", sortable: false, width: 300},
                        {title: "讲师姓名", sortable: false, width: 120},
                        {title: "讲师简介", sortable: false, width: 300},
                        {title: "参考资料数量", sortable: false, width: 120},
                        {
                            title: "操作", width: 200
                        }
                    ]
                }
            };

            //列表模板
            var teacherTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td title="#: description #">');
                result.push('#: description #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.chooseTeacher($event,dataItem)">选择</button>');
                result.push('</td>');

                result.push('</tr>');
                teacherTemplate = result.join('');
            })();
            $scope.teacherGrid = {
                options: {
                    dataBinding: function (e) {
                        hbUtil.kendo.grid.nullDataDealLeaf(e);
                    },
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(teacherTemplate),
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: "/web/admin/classSchedule/getTeacherPage",
                                data: function (e) {
                                    var params = {
                                        pageNo: e.page,
                                        pageSize: e.pageSize
                                    }
                                    return params;
                                },
                                dataType: 'json'
                            }
                        },
                        pageSize: 10, // 每页显示的数据数目
                        schema: {
                            // 数据源默认绑定的字段
                            // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                            // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                            // 优先与后面的data执行，返回的数据为下面data上面的参数response
                            parse: function (response) {
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
                                return response.info.length;
                            },
                            data: function (response) {
                                $scope.model.teacherList = response.info;
                                return response.info;
                            } // 指定数据源
                        },
                        serverPaging: true, //远程获取书籍
                        serverSorting: true //远程排序字段
                    },
                    selectable: true,
                    scrollable: false,
                    sortable: false,
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
                        pageSize: 10,
                        buttonCount: 10
                    },
                    columns: [
                        {field: "index", title: "No.", sortable: false, width: 50},
                        {title: "教师名称", sortable: false, width: 150},
                        {title: "教师简述", sortable: false, width: 200},
                        {
                            title: "操作", width: 100
                        }
                    ]
                }
            };

            //列表模板
            var courseTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td title="#: categoryName #">');
                result.push('#: categoryName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: period #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.previewCourse($event,dataItem.id)">试听</button>');
                result.push('<button type="button" class="table-btn" ng-click="events.chooseCourse($event,dataItem)">选择</button>');
                result.push('</td>');

                result.push('</tr>');
                courseTemplate = result.join('');
            })();
            $scope.courseGrid = {
                options: {
                    dataBinding: function (e) {
                        hbUtil.kendo.grid.nullDataDealLeaf(e);
                    },
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(courseTemplate),
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: "/web/admin/courseManager/findLessonPage",
                                data: function (e) {
                                    var temp = {courseQuery: {sort: e.sort}}, params = $scope.model.courseParams;
                                    for (var key in params) {
                                        if (params.hasOwnProperty(key)) {
                                            temp.courseQuery[key] = params[key];
                                        }
                                    }
                                    temp.courseQuery.isEnabled = 1;
                                    temp.pageNo = e.page;
                                    temp.pageSize = e.pageSize;
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
                                return response.info.length;
                            },
                            data: function (response) {
                                angular.forEach(response.info, function (data) {
                                    data.period = data.period * 1.0 / 10;
                                });
                                $scope.model.courseList = response.info;
                                return response.info;
                            } // 指定数据源
                        },
                        serverPaging: true, //远程获取书籍
                        serverSorting: true //远程排序字段
                    },
                    selectable: true,
                    scrollable: false,
                    sortable: false,
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
                        pageSize: 5,
                        buttonCount: 10
                    },
                    columns: [
                        {sortable: false, field: 'name', title: '课程名称', width: 150},
                        {sortable: false, field: 'categoryName', title: '课程分类', width: 100},
                        {sortable: false, field: 'period', title: '学时', width: 80},
                        {
                            title: "操作", width: 80
                        }
                    ]
                }
            };

            //课程分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseCategoryAction/findByQuery?categoryId=' + id,
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
                        length: '',
                        hasChildren: 'hasChildren',
                        uid: 'id'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });
            $scope.tree = {
                options: {
                    checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    messages: {
                        loading: '正在加载课程分类...',
                        requestFailed: '课程分类加载失败!.'
                    },
                    dataSource: dataSource,
                    expand: function (e) {
                        //console.log('expand tree node...');
                        var node = $scope.node.tree.dataItem(e.node);
                        $scope.model.indexCourseParams.id = node.id;
                        $scope.model.categoryId = node.id;
                        $scope.model.indexCourseParams.parentId = $scope.model.indexCRMParams.unitId = node.unitId;
                        $scope.$apply();
                        // 刷新组织机构树
                        //$scope.node.indexCourseTree.dataSource.read();
                    }
                }
            };
        }];
});