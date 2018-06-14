define(function () {
    'use strict';
    return ['$scope', 'courseManagerService', 'KENDO_UI_GRID', 'kendo.grid', '$state', 'TabService',
        function ($scope, courseManagerService, KENDO_UI_GRID, kendoGrid, $state, TabService) {
            $scope.validateParams = {
                courseId: ''
            };
            $scope.model = {
                delay: false,
                unitName: '',
                providers: [],
                selectIndex: 0,
                courseWareName: '',
                showAddCourse: true,
                showAddSection: false,
                showCourseSuccess: false,
                image: '/mfs/resource/file/2c9180e6582e03a50158438f6d900a09.jpg',
                course: {
                    iconPath: '/resource/file/2c9180e6582e03a50158438f6d900a09.jpg'
                },
                courseOutlines: [],
                coursewareList: [],
                sort: 0,
                subSort: 0,
                page: {
                    pageNo: 1,
                    pageSize: 5
                },
                courseWareQueryParams: {
                    name: '',
                    isUsable: '1',
                    status: 3,
                    type: '-1',
                    needHasQuestion: '-1',
                    supplierId: '1'
                },
                save: true,
                saveCourseOutlines: true,
                saveCourseOutline: true
            };
            courseManagerService.findLessonProvider().then(function (data) {
                $scope.model.delay = true;
                if (data.status) {
                    $scope.model.unitName = data.info.unitName;
                    $scope.model.providers = data.info.lessonProviders;
                    //$scope.model.providers.unshift({id:'1',name:data.info.unitName});
                }
            });

            $scope.events = {
                check: function (e) {
                    if (e.customeStatus === undefined || e.customeStatus === 0) {
                        e.customeStatus = 1;
                    } else {
                        e.customeStatus = 0;
                    }
                    console.log(e.customeStatus);
                },
                /**
                 * 选择课件
                 */
                toChoosePage: function (e) {
                    //findHistorCourseware(e, true);
                    $scope.node.courseWareGrid.pager.page($scope.model.page.pageNo);
                    $scope.node.courseWareGrid.pager.refresh();
                    $scope.node.windows.CourseWareChoose.open();
                },
                toAddPage: function (e) {
                    TabService.appendNewTab('课件管理', 'states.courseWareManager.add', '', 'states.courseWareManager', true);
                },
                toClosePage: function (e) {
                    $scope.node.windows.CourseWareChoose.close();
                },
                /**
                 * 查询
                 */
                searchCourseWare: function (e) {
                    $scope.model.page.pageNo = 1;
                    if ($scope.model.typeName == null || $scope.model.typeName == '') {
                        $scope.model.courseWareQueryParams.categoryId = null;
                    }
                    if ($scope.model.courseWareQueryParams.startCreateTime) {
                        $scope.model.courseWareQueryParams.startCreateTime = $scope.model.courseWareQueryParams.startCreateTime.replace(/-/g, '/');
                    }
                    if ($scope.model.courseWareQueryParams.endCreateTime) {
                        $scope.model.courseWareQueryParams.endCreateTime = $scope.model.courseWareQueryParams.endCreateTime.replace(/-/g, '/');
                    }
                    if ($scope.model.courseWareQueryParams.startCreateTime) {
                        $scope.model.courseWareQueryParams.startCreateTime = $scope.model.courseWareQueryParams.startCreateTime.replace(/\//g, '-');
                    }
                    if ($scope.model.courseWareQueryParams.endCreateTime) {
                        $scope.model.courseWareQueryParams.endCreateTime = $scope.model.courseWareQueryParams.endCreateTime.replace(/\//g, '-');
                    }
                    $scope.node.courseWareGrid.pager.page(1);
                    if (e) {
                        e.preventDefault();
                    }
                },
                /**
                 * 选中课件
                 */
                select: function (e, courseWare) {
                    courseWare.cweId = courseWare.id;
                    //courseWare.name='挂载课件叶子目录';
                    var length = $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines.length;
                    if (length == 0) {
                        courseWare.sort = 1;
                    } else {
                        var sort = $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines[length - 1].sort + 1;
                        courseWare.sort = sort;
                    }
                    $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines.push(courseWare);
                },
                /**
                 * 选中课件
                 */
                unSelect: function (e, courseWare) {
                    angular.forEach($scope.model.courseOutlines, function (data) {
                        angular.forEach(data.subCourseOutlines, function (subCourseOutline, index) {
                            if (courseWare.id == subCourseOutline.cweId) {
                                data.subCourseOutlines.splice(index, 1);
                                courseWare.select = false;
                            }
                        });
                    });

                },
                /**
                 * 选中全部课件
                 */
                selectAll: function (e) {

                    var viewData = $scope.node.courseWareGrid.dataSource.view(),
                        size = viewData.length, row;
                    if (e.currentTarget.checked) {
                        for (var i = 0; i < size; i++) {
                            row = viewData[i];
                            if (!$scope.model.utils.isSelected(row) && (row.status == 1 || row.status == 0)) {
                                row.cweId = row.id;
                                $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines.push(row);
                            }
                        }
                    } else {
                        for (var i = 0; i < size; i++) {
                            row = viewData[i];
                            angular.forEach($scope.model.courseOutlines, function (data) {
                                angular.forEach(data.subCourseOutlines, function (subCourseOutline, index) {
                                    if (row.id == subCourseOutline.cweId) {
                                        data.subCourseOutlines.splice(index, 1);
                                        row.select = false;
                                    }
                                });
                            });
                        }
                    }
                    $scope.node.courseWareGrid.pager.refresh();
                },
                /**
                 * 保存并进入下一步
                 * @param e
                 */
                saveAndEnter: function (e) {
                    if ($scope.model.course.id != null) {
                        if ($scope.courseValidate.$valid && $scope.model.save) {
                            $scope.model.save = false;
                            courseManagerService.updateCourseInfo($scope.model.course).then(function (data) {
                                if (data.status) {
                                    $scope.model.showAddCourse = false;
                                    $scope.model.showAddSection = true;
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.save = true;
                            });
                        }
                    } else {
                        if ($scope.courseValidate.$valid && $scope.model.save) {
                            $scope.model.save = false;
                            courseManagerService.createCourse($scope.model.course).then(function (data) {
                                if (data.status) {
                                    $scope.model.course.id = data.info;
                                    $scope.model.showAddCourse = false;
                                    $scope.model.showAddSection = true;
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.save = true;
                            });
                        }
                    }
                    e.preventDefault();
                },
                saveCourse: function (e) {
                    if ($scope.courseValidate.$valid && $scope.model.save) {
                        $scope.model.save = false;
                        if ($scope.model.course.id != null) {
                            courseManagerService.updateCourseInfo($scope.model.course).then(function (data) {
                                if (data.status) {
                                    $state.go('states.courseManager').then(function () {
                                        $state.reload($state.current);
                                    });
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.save = true;
                            });
                        } else {
                            courseManagerService.createCourse($scope.model.course).then(function (data) {
                                if (data.status) {
                                    $scope.model.course.id = data.info;
                                    $state.go('states.courseManager').then(function () {
                                        $state.reload($state.current);
                                    });
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.save = true;
                            });
                        }

                    }
                    e.preventDefault();
                },
                /**
                 * 继续添加课程
                 * @param e
                 */
                carryOnAddLesson: function (e) {
                    $scope.model.showLessonList = false;
                    $scope.model.showAddCourse = true;
                    $scope.model.showAddSection = false;
                    $scope.model.showCourseSuccess = false;
                    $scope.model.showTap = true;
                    $scope.courseValidate.$setPristine();
                    $scope.model.course = {};
                    $scope.model.courseOutlines = [];
                    $scope.model.sort = 0;
                    $scope.model.image = '/mfs/resource/file/2c9180e6582e03a50158438f6d900a09.jpg';
                    $scope.model.selectIndex = 0;
                    e.preventDefault();
                },
                /**
                 * 跳转到课程添加
                 */
                toLessonAdd: function () {
                    $scope.validateParams.courseId = $scope.model.course.id;
                    $scope.model.showLessonList = false;
                    $scope.model.showAddCourse = true;
                    $scope.model.showAddSection = false;
                    $scope.model.showTap = true;
                },
                /**
                 * 获取课件分类ID
                 * @param dataItem
                 */
                getCourseWareTypeInfo: function (dataItem) {
                    if (dataItem.id == 0) {
                        $scope.model.typeName = dataItem.name;
                        $scope.model.courseWareQueryParams.categoryId = '';
                        $scope.TypeShow = false;
                    } else {
                        $.ajax({
                            url: '/web/admin/courseWareManager/courseWareHasReference?id=' + dataItem.id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                if (!result.info) {
                                    $scope.model.typeName = dataItem.name;
                                    $scope.model.courseWareQueryParams.categoryId = dataItem.id;
                                    $scope.TypeShow = false;
                                }
                            },
                            error: function (result) {
                                // notify the data source that the request failed
                                options.error(result);
                            }
                        });
                    }
                },
                /**
                 * 返回资源管理页面
                 * @param e
                 */
                goCourseManager: function (e) {
                    e.preventDefault();
                    $state.go('states.courseManager').then(function () {
                        $state.reload($state.current);
                    });
                },
                /**
                 * 更新课程章节信息
                 */
                updateCourse: function (e) {
                    var temp = true,
                        uploadSuccess = true,
                        temps = [];
                    if ($scope.model.courseOutlines.length == 0) {
                        $scope.globle.showTip('提示“每个课程至少需要有一个章节，请添加章节”', 'error');
                        return false;
                    }
                    angular.forEach($scope.model.courseOutlines, function (data) {
                        var courseOutline = data;
                        if (courseOutline.update) {
                            $scope.globle.showTip('请保存课程章节', 'error');
                            temp = false;
                            return false;
                        }
                        if (courseOutline.subCourseOutlines.length == 0) {
                            $scope.globle.showTip('提示“每个章节至少需要有一个课件，请选择课件”', 'error');
                            temp = false;
                            return false;
                        } else {
                            var currentSort = 0;
                            angular.forEach(courseOutline.subCourseOutlines, function (subCourseOutline) {
                                var tempCourseOutline = {
                                    name: subCourseOutline.name,
                                    parentId: courseOutline.courseOutlineId,
                                    cseId: courseOutline.cseId,
                                    sort: ++currentSort,
                                    cweId: subCourseOutline.cweId,
                                    supplierId: subCourseOutline.supplierId,
                                    customeStatus: subCourseOutline.customeStatus
                                };

                                if (subCourseOutline.type != 1) {
                                    tempCourseOutline.timeLength = subCourseOutline.timeLength;
                                }
                                if (subCourseOutline.customeStatus === undefined) {
                                    tempCourseOutline.customeStatus = 0;
                                }

                                temps.push(tempCourseOutline);
                            });
                        }
                    });
                    if (temp && $scope.model.saveCourseOutlines) {
                        $scope.model.saveCourseOutlines = false;
                        courseManagerService.saveCourseOutlines(temps).then(function (data) {
                            if (data.status) {
                                $scope.model.showAddSection = false;
                                $scope.model.showCourseSuccess = true;
                                $scope.model.selectIndex = null;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.saveCourseOutlines = true;
                        });

                    }
                    e.preventDefault();
                },
                openCourseTypeTree: function () {
                    $scope.courseTypeShow = !$scope.courseTypeShow;
                },
                openCourseWareTypeTree: function () {
                    $scope.TypeShow = !$scope.TypeShow;
                },
                /**
                 * 添加章节
                 */
                addCourseOutline: function () {
                    if ($scope.model.courseOutlines.length > 0 && $scope.model.selectIndex == $scope.model.courseOutlines.length) {
                        $scope.model.selectIndex = $scope.model.selectIndex - 1;
                    }
                    var currentCourseOutline = $scope.model.courseOutlines[$scope.model.selectIndex];
                    if ($scope.model.selectIndex == null || $scope.model.courseOutlines.length == 0 || currentCourseOutline.nameNull && currentCourseOutline.nameToo && currentCourseOutline.nameRepeat) {
                        pushCourseOutline();
                    }
                },
                /**
                 *
                 * @param e
                 */
                cancel: function (e) {
                    e.preventDefault();
                    $scope.globle.confirm('提示', '是否放弃编辑', function () {
                        $state.go('states.courseManager').then(function () {
                            $state.reload($state.current);
                        });
                    });
                },
                /**
                 * 保存课程目录到数据库
                 * @param index
                 */
                saveCourseOutline: function (index, courseOutline, e) {
                    if (courseOutline.update && courseOutline.nameRepeat && courseOutline.nameNull && courseOutline.nameToo && $scope.model.saveCourseOutline) {
                        $scope.model.saveCourseOutline = false;
                        var temp = {
                            cseId: courseOutline.cseId,
                            name: courseOutline.name,
                            sort: courseOutline.sort,
                            courseOutlineId: courseOutline.courseOutlineId
                        };
                        courseManagerService.saveCourseOutline(temp).then(function (data) {
                            if (data.status) {
                                courseOutline.courseOutlineId = data.info;
                                courseOutline.update = false;
                                courseOutline.select = true;
                                $scope.model.selectIndex = index;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.saveCourseOutline = true;
                        });
                    } else {
                        courseOutline.update = true;
                    }

                    e.preventDefault();
                },
                /**
                 * 验证名称
                 * @param index
                 */
                checkName: function ($index, courseOutline, e) {
                    courseOutline.nameRepeat = true;
                    if (courseOutline.name.length == 0) {
                        courseOutline.nameNull = false;
                        return false;
                    } else {
                        courseOutline.nameNull = true;
                    }
                    if (courseOutline.name.length > 32) {
                        courseOutline.nameToo = false;
                        return false;
                    }
                    else {
                        courseOutline.nameToo = true;
                    }
                    angular.forEach($scope.model.courseOutlines, function (data, index) {
                        if ($index != index) {
                            if (data.name == courseOutline.name) {
                                courseOutline.nameRepeat = false;
                                return false;
                            }
                        }
                    });
                    e.preventDefault();
                },
                /**
                 * 删除课程章节
                 * @param index
                 * @param e
                 */
                deleteCourseOutline: function (index, courseOutline, e) {
                    $scope.globle.confirm('提示', '是否需要删除课件', function (dialog) {
                        if (courseOutline.subCourseOutlines.length > 0) {
                            dialog.doRightClose();
                            $scope.globle.showTip('章节下有课件 不能删除', 'error');
                            return false;
                        }
                        if (courseOutline.courseOutlineId) {
                            return courseManagerService.deleteCourseOutline(courseOutline.courseOutlineId).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    $scope.model.courseOutlines.splice(index, 1);
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                            });
                        } else {
                            $scope.model.courseOutlines.splice(index, 1);
                        }

                    });

                    e.preventDefault();
                },
                /**
                 * 选中章节
                 * @param i
                 * @param e
                 */
                selectCourseOutline: function (i, e) {
                    angular.forEach($scope.model.courseOutlines, function (data) {
                        data.select = false;
                    });
                    $scope.model.courseOutlines[i].select = true;
                    $scope.model.selectIndex = i;
                },
                /**
                 * 获取课程分类ID
                 * @param dataItem
                 */
                getTypeInfo: function (dataItem) {
                    courseManagerService.findHashLessonType(dataItem.id).then(function (data) {
                        if (!data.info) {
                            $scope.model.course.typeName = dataItem.name;
                            $scope.model.course.categoryIdList = [dataItem.id];
                            $scope.courseTypeShow = false;
                        }
                    });
                },
                /**
                 * 添加课件
                 * @param e
                 */
                addCourseware: function (e) {
                    $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines.push(
                        {
                            cseId: $scope.model.course.id,
                            name: $scope.model.courseWareName
                        }
                    );
                },

                /**
                 * 子章节上移
                 * @param index
                 * @param e
                 */
                subCourseOutlineUp: function (index, currentCourseOutline, e) {
                    var subCourseOutlines = $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines;
                    if (index > 0) {
                        var upCourseOutline = subCourseOutlines[index - 1];
                        subCourseOutlines[index - 1] = currentCourseOutline;
                        subCourseOutlines[index] = upCourseOutline;
                        $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines = subCourseOutlines;
                    }
                    e.preventDefault();
                },
                /**
                 * 子章节下移
                 * @param index
                 * @param e
                 */
                subCourseOutlineDown: function (index, currentCourseOutline, e) {
                    var subCourseOutlines = $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines;
                    if (index < subCourseOutlines.length - 1) {
                        var downCourseOutline = subCourseOutlines[index + 1];
                        subCourseOutlines[index + 1] = currentCourseOutline;
                        subCourseOutlines[index] = downCourseOutline;
                        $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines = subCourseOutlines;
                    }
                    e.preventDefault();
                },
                /**
                 * 删除子章节
                 * @param index
                 * @param e
                 */
                deleteSubCourseOutline: function (index, e) {
                    $scope.globle.confirm('提示', '确定要删除课件么', function (dialog) {
                        dialog.doRightClose();
                        $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines.splice(index, 1);
                    });

                    e.preventDefault();
                },

                /**
                 * 章节上移
                 * @param index
                 * @param e
                 */
                courseOutlineUp: function (e) {
                    var index = $scope.model.selectIndex;
                    if (index > 0) {
                        var currentCourseOutline = $scope.model.courseOutlines[index],
                            currentSort = currentCourseOutline.sort,
                            upCourseOutline = $scope.model.courseOutlines[index - 1];
                        currentCourseOutline.sort = upCourseOutline.sort;
                        upCourseOutline.sort = currentSort;
                        if (currentCourseOutline.courseOutlineId && upCourseOutline.courseOutlineId) {
                            courseManagerService.exchangeCourseOutlineSort(currentCourseOutline.courseOutlineId, upCourseOutline.courseOutlineId).then(function (data) {
                                if (data.status) {
                                    $scope.model.courseOutlines[index - 1] = currentCourseOutline;
                                    $scope.model.courseOutlines[index] = upCourseOutline;
                                    $scope.model.selectIndex = index - 1;
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                            });
                        } else {
                            $scope.model.courseOutlines[index - 1] = currentCourseOutline;
                            $scope.model.courseOutlines[index] = upCourseOutline;
                            $scope.model.selectIndex = index - 1;
                        }

                    }
                    e.preventDefault();
                },
                /**
                 * 章节下移
                 * @param index
                 * @param e
                 */
                courseOutlineDown: function (e) {
                    var index = $scope.model.selectIndex;
                    if (index < $scope.model.courseOutlines.length - 1) {
                        var currentCourseOutline = $scope.model.courseOutlines[index],
                            currentSort = currentCourseOutline.sort,
                            upCourseOutline = $scope.model.courseOutlines[index + 1];
                        currentCourseOutline.sort = upCourseOutline.sort;
                        upCourseOutline.sort = currentSort;
                        if (currentCourseOutline.courseOutlineId && upCourseOutline.courseOutlineId) {
                            courseManagerService.exchangeCourseOutlineSort(currentCourseOutline.courseOutlineId, upCourseOutline.courseOutlineId).then(function (data) {
                                if (data.status) {
                                    $scope.model.courseOutlines[index + 1] = currentCourseOutline;
                                    $scope.model.courseOutlines[index] = upCourseOutline;
                                    $scope.model.selectIndex = index + 1;
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                            });
                        } else {
                            $scope.model.courseOutlines[index + 1] = currentCourseOutline;
                            $scope.model.courseOutlines[index] = upCourseOutline;
                            $scope.model.selectIndex = index + 1;
                        }

                        e.preventDefault();
                    }
                },
                /**
                 * 取消选择课件
                 * @param courseware
                 */
                deselect: function (courseware) {
                    angular.forEach($scope.model.courseOutlines, function (data) {
                        angular.forEach(data.subCourseOutlines, function (subCourseOutline, index) {
                            if (courseware.id == subCourseOutline.cweId) {
                                data.subCourseOutlines.splice(index, 1);
                                courseware.select = false;
                            }
                        });
                    });
                },
                /**
                 * 选中课件
                 */
                selectCourseware: function (courseware, e) {
                    var isReturn = false;
                    angular.forEach($scope.model.courseOutlines, function (data) {
                        if (!isReturn) {
                            angular.forEach(data.subCourseOutlines, function (subCourseOutline) {
                                if (courseware.id == subCourseOutline.cweId) {
                                    $scope.globle.showTip('课程下已存在该课件', 'error');
                                    isReturn = true;
                                    return false;
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                    if (!isReturn) {
                        var subCourseOutlines = $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines;
                        if (subCourseOutlines) {
                            angular.forEach(subCourseOutlines, function (data) {
                                if (data.renameName == courseware.name) {
                                    $scope.globle.showTip('同一个章节下名称不能相同', 'error');
                                    isReturn = true;
                                    return false;
                                }
                            });
                        }
                    }
                    if (!isReturn) {
                        var courseOutline = $scope.model.courseOutlines[$scope.model.selectIndex],
                            currentSort = 0;
                        courseware.select = true;
                        if (courseOutline.subCourseOutlines.length > 0) {
                            currentSort = courseOutline.subCourseOutlines[courseOutline.subCourseOutlines.length - 1].sort;
                        }
                        $scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines.push(
                            {
                                id: courseware.id,
                                uploadSuccess: true,
                                progress: 100,
                                renameName: courseware.name,
                                nameNull: true,
                                record: true,
                                formatSize: courseware.expandData,
                                cweId: courseware.id,
                                sort: ++currentSort,
                                nameRepeat: true,
                                nameToo: true,
                                type: courseware.type
                            }
                        )
                        ;
                    }
                    e.preventDefault();
                },
                /**
                 * enter触发事件
                 * @param e
                 */
                search: function (e) {
                    if (e.keyCode === 13) {
                        $scope.events.searchCourseware(e);
                    }
                },
                /**
                 * 验证子目录名称
                 * @param index
                 * @param e
                 */
                checkSubCourseOutlineName: function (e, subCourseOutline, index) {
                    this.checkSubCourseName(subCourseOutline, index);
                    e.preventDefault();
                }

            };

            $scope.model.utils = {
                indexOf: function (array, id) {
                    var index = -1;
                    angular.forEach(array, function (data, key) {
                        if (id == data.id) {
                            index = key;
                            return;
                        }
                    });
                    return index;
                },
                lockProvider: function () {
                    var lock = false;
                    angular.forEach($scope.model.courseOutlines, function (data, key) {
                        if (data.subCourseOutlines.length > 0) {
                            lock = true;
                            return;
                        }
                    });
                    return lock;
                },
                /**
                 * 是否选中课件
                 */
                isSelected: function (courseware) {
                    var isSelected = 0;
                    angular.forEach($scope.model.courseOutlines, function (data) {
                        angular.forEach(data.subCourseOutlines, function (subCourseOutline, index) {
                            if (courseware.id == subCourseOutline.cweId) {
                                isSelected = 1;
                            }
                        });
                    });
                    if (isSelected == 1) {
                        angular.forEach($scope.model.courseOutlines[$scope.model.selectIndex].subCourseOutlines, function (subCourseOutline, index) {
                            if (courseware.id == subCourseOutline.cweId) {
                                isSelected = 2;
                            }
                        });
                    }
                    return isSelected;
                },
                /**
                 * 是否选中全部课件
                 */
                isSelectAll: function () {
                    if (!$scope.node.courseWareGrid) {
                        return false;
                    }
                    var viewData = $scope.node.courseWareGrid.dataSource.view(),
                        size = viewData.length, row, isSelected = true;
                    if ($scope.model.courseOutlines.length == 0 || !$scope.model.courseOutlines[$scope.model.selectIndex]) {
                        return false;
                    }
                    for (var i = 0; i < size; i++) {
                        row = viewData[i];
                        if (!$scope.model.utils.isSelected(row)) {
                            isSelected = false;
                        }
                    }
                    return isSelected;
                }
            };
            //课程分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        console.log(1);
                        var id = options.data.id ? options.data.id : '0',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({

                            url: '/web/admin/courseCategoryAction/findByQuery?authorizedBelongsType=MYSELF&categoryId=' + id,
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
            //课件分类树
            var dataSource2 = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseWareCategoryAction/findByQuery?authorizedBelongsType=MYSELF&categoryId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for
                                              // same-domain requests
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

            /**
             * 添加章节
             */
            function pushCourseOutline () {
                var index = ++$scope.model.sort,
                    courseOutline = {
                        name: '章节' + index,
                        cseId: $scope.model.course.id,
                        sort: $scope.model.sort,
                        update: true,
                        select: false,
                        nameNull: true,
                        nameToo: true,
                        nameRepeat: true,
                        subCourseOutlines: []
                    };
                $scope.model.courseOutlines.push(courseOutline);
            };

            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr >');


                result.push('<td>');
                result.push('<div  title="#: name #">');
                result.push('#: name #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: cwyId #">');
                result.push('#: cwyId #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: teacherName|| \"-\" #');
                result.push('</td>');

                result.push('<td>');
                result.push('#:status==0?\'转换中\':(status==1?\'转换成功\':(status==2?\'转换失败\':\'草稿\'))#');
                result.push('</td>');

                result.push('<td>');
                result.push('<div class="t-w1" title="#: type #">');
                result.push('#: type==1?\'文档\':(type==2?\'单视频\':(type==3?\'视频包\':\'未知\'))#');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: timeLength #">');
                result.push('#:(timeLength-timeLength%3600)/3600==0?"":(timeLength-timeLength%3600)/3600 +"小时"#');
                result.push('#:((timeLength%3600)-(timeLength%3600)%60)/60 +"分"#');
                result.push('#:(timeLength%3600)%60 +"秒"#');
                result.push('</div>');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button type="button" class="table-btn" ng-show="model.utils.isSelected(dataItem)==0"  ng-click="events.select($event, dataItem)">选择</button>');
                result.push('<button type="button" class="table-btn" ng-show="model.utils.isSelected(dataItem)==1" >被其他章节选择</button>');
                result.push('<button type="button" class="table-btn" ng-show="model.utils.isSelected(dataItem)==2"  ng-click="events.unSelect($event, dataItem)">取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    },
                    courseWareCategoryOptions: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource2
                    }
                },
                windows: {
                    courseWareChooseOptions: {//历史上传课件
                        modal: true,
                        content: '@systemUrl@/views/courseManager/historyCourseware.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        },
                        close: function () {
                            this.close;
                        }
                    }
                },
                courseWareGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/courseWareManager/findCourseWarePage',
                                    data: function (e) {
                                        var temp = {courseWareQueryParams: {sort: e.sort}},
                                            params = $scope.model.courseWareQueryParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.courseWareQueryParams[key] = params[key];
                                                }
                                            }
                                        }
                                        $scope.model.page.pageNo = e.page;
                                        temp.pageNo = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;
                                        return temp;
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
                        //selectable: true,
                        //sortable: {
                        //    mode: "single",
                        //    allowUnsort: false
                        //},
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50],
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {sortable: false, field: 'name', title: '课件名称'},
                            {sortable: false, field: 'typeName', title: '课件分类', width: 100},
                            {sortable: false, field: 'teacherName', title: '课件老师', width: 100},
                            {sortable: false, field: 'status', title: '转换状态', width: 80},
                            {sortable: false, field: 'type', title: '课件类型', width: 80},
                            {sortable: false, field: 'timeLength', title: '时长', width: 100},
                            {sortable: false, field: 'option', title: '操作', width: 80}

                        ]
                    }
                }
            };
            $scope.$watch('model.uploadImage', function () {
                if ($scope.model.uploadImage) {
                    $scope.model.image = '/mfs' + $scope.model.uploadImage.convertResult[0].url;
                    $scope.model.course.iconPath = $scope.model.uploadImage.convertResult[0].url;
                }
                else {
                    $scope.model.image = '/mfs/resource/file/2c9180e6582e03a50158438f6d900a09.jpg';
                }
            });

        }];
});
