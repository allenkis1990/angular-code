define(function () {
    'use strict';
    return ['$rootScope','$scope', '$stateParams', 'KENDO_UI_GRID', 'KENDO_UI_EDITOR', 'kendo.grid', '$state', '$timeout', 'HB_notification','hbUtil',
        function ($rootScope,$scope, $stateParams, KENDO_UI_GRID, KENDO_UI_EDITOR, kendoGrid, $state, $timeout, HB_notification,hbUtil) {
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
                myselfQuestionSearch: {
                    questionType: '-1',
                    mode: '-1',
                    enable: '-1'
                },
                allQuestionSearch: {
                    questionType: '-1',
                    mode: '-1',
                    enable: '-1'
                },
                show: {
                    many: '1'
                },
                optionIndex: 0,
                courseWareQueryParams: {
                    type: -1,
                    // isUsable       : -1,
                    status: 1,
                    needHasQuestion: '1'
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

            $scope.node = {
                gridInstance: null,
                courseWareGrid: null,
                courseGridInstance: null
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
            if ($stateParams.courseWareId) {
                $scope.model.questionSearch.couseWareId = $stateParams.courseWareId;
            }
            if ($stateParams.courseWareName) {
                $scope.model.questionSearch.courseName = $stateParams.courseWareName;
            }
            $scope.events = {
                chooseTab : function (e,code){
                    $scope.currentTab = code;
                },
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                searchQuestion: function (e) {
                    e.preventDefault();
                    $scope.node[$scope.currentTab+'GridInstance'].dataSource.page(1);
                },
                queryByEnter: function (e) {
                    if (e.keyCode == 13) {
                        $scope.node[$scope.currentTab+'GridInstance'].dataSource.page(1);
                    }
                },
                clearTopic: function () {
                    $scope.model.questionSearch.topic = null;
                },
                clearCourse: function () {
                    $scope.model[$scope.currentTab+'QuestionSearch'].couseId = null;
                    $scope.model[$scope.currentTab+'QuestionSearch'].course = null;

                    $scope.model[$scope.currentTab+'QuestionSearch'].courseId = null;
                    $scope.data.courseTopic = null;
                    $scope.model.courseWareQueryParams.courseId=null;
                },
                clearCourseName: function () {
                    $scope.model[$scope.currentTab+'QuestionSearch'].couseWareId = null,
                        $scope.model[$scope.currentTab+'QuestionSearch'].courseName = null;
                },
                selectCourse: function () {
                    $scope.CourseCategoryTree = false;
                    $scope.node.windows.addCourseWindow.center().open();
                },
                selectCourseWare: function () {
                    //$scope.CourseCategoryTree = false;
                    $scope.node.windows.addWindow.center().open();
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
                searchQuestionLibraryList: function (e) {
                    e.preventDefault();
                    $scope.node.courseGridInstance.dataSource.page(1);
                },
                /**选中课程**/
                checkSelectedCourse: function (dataItem) {
                    if ($scope.model[$scope.currentTab+'QuestionSearch'].courseId != null) {
                        HB_notification.alert('您已经有选中课程了，不可以多选。');
                    } else {
                        $scope.node.windows.addCourseWindow.close();
                        $scope.model[$scope.currentTab+'QuestionSearch'].course = dataItem.name;
                        $scope.model[$scope.currentTab+'QuestionSearch'].courseId = dataItem.id;
                        $scope.data.courseTopic = dataItem.topic;
                        //课件查询中的课程条件
                        $scope.model.courseWareQueryParams.courseId=dataItem.id;
                        //选中课程之后将选中的课件清空
                        $scope.model[$scope.currentTab+'QuestionSearch'].couseWareId = null;
                        $scope.model[$scope.currentTab+'QuestionSearch'].courseName = null;
                    }
                },
                /**取消选中课程**/
                cancleSelectedCourse: function () {
                    $scope.model[$scope.currentTab+'QuestionSearch'].couseId = null;
                    $scope.model[$scope.currentTab+'QuestionSearch'].course = null;
                    $scope.model[$scope.currentTab+'QuestionSearch'].courseId = null;
                    $scope.data.courseTopic = null;
                    $scope.model.courseWareQueryParams.courseId=null;
                },
                /**
                 *显示选择/取消选择button
                 * @param dataItem
                 * @param flag true/选择 false/取消选择
                 * @returns {boolean}
                 */
                checked: function (dataItem, flag) {
                    if (flag) {
                        if (dataItem.id != $scope.model[$scope.currentTab+'QuestionSearch'].courseId) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (dataItem.id == $scope.model[$scope.currentTab+'QuestionSearch'].courseId) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },

                /** 取消选择弹出框 **/
                cancel: function (e) {
                    e.preventDefault();
                    $scope.node.windows.addWindow.close();
                    $scope.node.windows.addCourseWindow.close();
                },

                /**
                 * 显示课件分类
                 */
                openTypeTree: function (e) {
                    e.stopPropagation();
                    $scope.TypeShow = !$scope.TypeShow;
                },

                /**
                 * 获取课程分类ID
                 * @param dataItem
                 */
                getTypeInfo: function (dataItem, e) {
                    e.stopPropagation();
                    if (dataItem.id == 0) {
                        $scope.model.typeName = dataItem.name;
                        $scope.model.courseWareQueryParams.categoryId = '';
                        $scope.TypeShow = false;
                    } else {
                        $scope.model.typeName = dataItem.name;
                        $scope.model.courseWareQueryParams.categoryId = dataItem.id;
                        $scope.TypeShow = false;
                    }

                },

                /**
                 * 查询
                 */
                searchCourseWare: function (e) {
                    $scope.TypeShow = false;
                    if ($scope.model.typeName == null || $scope.model.typeName == '') {
                        $scope.model.courseWareQueryParams.categoryId = null;
                    }
                    $scope.node.courseWareGrid.pager.page(1);
                    e.preventDefault();
                },
                /**选中课件**/
                checkSelectedCourseWare: function (dataItem) {
                    $scope.node.windows.addWindow.close();
                    $scope.model[$scope.currentTab+'QuestionSearch'].courseName = dataItem.name;
                    $scope.model[$scope.currentTab+'QuestionSearch'].couseWareId = dataItem.id;
                },
                /**取消选中课件**/
                cancleSelectedCourseWare: function () {
                    $scope.model[$scope.currentTab+'QuestionSearch'].courseName = null;
                    $scope.model[$scope.currentTab+'QuestionSearch'].couseWareId = null;
                },

                /**查看试题**/
                questionView: function (dataItem) {
                    $scope.node.windows.questionView.center().open();
                    $scope.model.question = {};
                    $scope.model.question.courseWareName = dataItem.courseWareName;
                    $scope.model.question.topic = dataItem.topic;
                    $scope.model.question.description = dataItem.description;
                    $scope.model.question.questionType = dataItem.questionType;

                    $scope.model.question.timeLength = utils.setTime(dataItem.timeLength);
                    $scope.model.question.timePoint = utils.setTime(dataItem.timePoint);
                    $scope.model.question.configurationItems = [];

                    var popOptions = dataItem.options.split(' ');
                    _.forEach(popOptions, function (item, index) {
                        if (index !== popOptions.length - 1) {
                            var optionWord = item.substring(0, item.indexOf(':')); //选项字母
                            $scope.model.question.configurationItems.push({
                                id: $scope.model.optionIndex++,
                                content: item.substring(item.indexOf(':') + 1) //将选项内容截取出来
                            });
                        }
                    });

                    if (dataItem.questionType == '判断题') {
                        $scope.model.question.answer = dataItem.answer;
                    } else if (dataItem.questionType == '单选题') {
                        $scope.model.question.answer = dataItem.answer.substring(0, dataItem.answer.indexOf(':'));
                    } else if (dataItem.questionType == '多选题') {
                        $scope.model.question.answer = '';
                        var multiselectAnswer = dataItem.answer.split(' ');
                        _.forEach(multiselectAnswer, function (item, index) {
                            if (index !== multiselectAnswer.length - 1) {
                                var optionWord = item.substring(0, item.indexOf(':')); //选项字母
                                $scope.model.question.answer += optionWord;
                            }
                        });
                    }
                },
                modify: function (dataItem) {
                    var questionType = '';
                    if (dataItem.questionType == '判断题') {
                        questionType = 1;
                    } else if (dataItem.questionType == '单选题') {
                        questionType = 2;
                    } else if (dataItem.questionType == '多选题') {
                        questionType = 3;
                    }
                    // $state.go("states.popQuestionManager.edit",{
                    //     questionId    :  dataItem.questionId,
                    //     questionType  :  questionType,
                    //     popQuestionId :  dataItem.id,
                    // });
                    // $state.go('states.accountant.information',{
                    //     type:2
                    // });
                    $state.go('states.popQuestionManager.edit', {
                        questionId: dataItem.questionId,
                        questionType: questionType,
                        popQuestionId: dataItem.id
                    });
                },
                digitalToLetter: function (index) {
                    index = index + 1;
                    var s = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
                    var sArray = s.split(' ');
                    if (index < 1) return '';

                    if (parseInt((index / 26) + '') == 0) return sArray[index % 26 - 1];
                    else {
                        if (index % 26 == 0) return (i2s(parseInt((index / 26) + '') - 1)) + sArray[26 - 1];
                        else return sArray[parseInt((index / 26) + '') - 1] + sArray[index % 26 - 1];
                    }
                }
            };


            var utils = {
                setTime: function (time) {
                    var hour = (time - time % 3600) / 3600;
                    var min = ((time % 3600) - (time % 3600) % 60) / 60;
                    var sec = time % 3600 % 60;
                    return hour + '时' + min + '分' + sec + '秒';
                }
            };

//-----------------------------------主页面表格--弹窗题信息表------------------------------------------------------------------
            var questionListTemplate = '';

            questionListTemplate += '<tr>';

            questionListTemplate += '<td>';
            questionListTemplate += '#: index #';
            // questionListTemplate +=  '#: index #';
            questionListTemplate += '</td>';

            questionListTemplate += '<td title="#:topic#">';
            questionListTemplate += '#:topic#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td>';
            questionListTemplate += '#:questionType#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td>';
            questionListTemplate += '#:(timePoint-timePoint%3600)/3600==0?"":(timePoint-timePoint%3600)/3600 +"小时"#';
            questionListTemplate += '#:((timePoint%3600)-(timePoint%3600)%60)/60 +"分"#';
            questionListTemplate += '#:(timePoint%3600)%60 +"秒"#';
            // questionListTemplate += '#:timePoint#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td title="#:courseWareName#">';
            questionListTemplate += '#:courseWareName#';
            questionListTemplate += '</td>';

            questionListTemplate += '<td>';
            questionListTemplate += '<button class="table-btn" ng-click="events.questionView(dataItem)">查看</button>' +
                '<button class="table-btn" ng-click="events.modify(dataItem)">修改</button>';
            questionListTemplate += '</td>';

            questionListTemplate += '</tr>';

//-----------------------------------ALL主页面表格--弹窗题信息表------------------------------------------------------------------
            var allQuestionListTemplate = '';

            allQuestionListTemplate += '<tr>';

            allQuestionListTemplate += '<td>';
            allQuestionListTemplate += '#: index #';
            // allQuestionListTemplate +=  '#: index #';
            allQuestionListTemplate += '</td>';

            allQuestionListTemplate += '<td title="#:topic#">';
            allQuestionListTemplate += '#:topic#';
            allQuestionListTemplate += '</td>';

            allQuestionListTemplate += '<td>';
            allQuestionListTemplate += '#:questionType#';
            allQuestionListTemplate += '</td>';

            allQuestionListTemplate += '<td>';
            allQuestionListTemplate += '#:(timePoint-timePoint%3600)/3600==0?"":(timePoint-timePoint%3600)/3600 +"小时"#';
            allQuestionListTemplate += '#:((timePoint%3600)-(timePoint%3600)%60)/60 +"分"#';
            allQuestionListTemplate += '#:(timePoint%3600)%60 +"秒"#';
            // allQuestionListTemplate += '#:timePoint#';
            allQuestionListTemplate += '</td>';

            allQuestionListTemplate += '<td title="#:courseWareName#">';
            allQuestionListTemplate += '#:courseWareName#';
            allQuestionListTemplate += '</td>';

            allQuestionListTemplate += '<td>';
            allQuestionListTemplate += '<button class="table-btn" ng-click="events.questionView(dataItem)">查看</button>' +
                '<button class="table-btn" ng-click="events.modify(dataItem)">修改</button>';
            allQuestionListTemplate += '</td>';

            allQuestionListTemplate += '</tr>';


//-----------------------------------选择课件表格------------------------------------------------------------------
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push(' #: index #');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: cwyId #">');
                result.push('#: cwyId #');
                result.push('</div>');
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
                result.push('<a type="button" class="table-btn"  ng-show=" dataItem.id != model.questionSearch.couseWareId"  ng-click="events.checkSelectedCourseWare(dataItem)">选择</a>');
                result.push('<a  type="button" class="table-btn"  ng-show=" dataItem.id == model.questionSearch.couseWareId"   ng-click="events.cancleSelectedCourseWare(dataItem)">取消选择</a>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();

//-----------------------------------课件分类树------------------------------------------------------------------
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseWareCategoryAction/findByQuery?categoryId=' + id,
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
//-----------------------------------课课程类树------------------------------------------------------------------
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
                    addCourseWindow: {//添加窗口
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
                // windowOptions     : questionService.windowConfig (),
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                },
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
                                        var param={'page.pageSize': data.pageSize,
                                            'page.pageNo': data.page,
                                            'courseQuery.categoryId': $scope.model.selectedCourseCateId,
                                            'courseQuery.name': $scope.model.searchCourseName};
                                        if(hbUtil.validateIsNull($scope.model.mySelfAuthorizedQuery)===false){
                                            angular.forEach($scope.model.mySelfAuthorizedQuery,function(value,key){
                                                param['authorizedQuery.'+key] = value;
                                            });
                                        }
                                        return param;
                                        // return {
                                        //     'page.pageSize': data.pageSize,
                                        //     'page.pageNo': data.page,
                                        //     'courseQuery.categoryId': $scope.model.selectedCourseCateId,
                                        //     'courseQuery.name': $scope.model.searchCourseName
                                        // };

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
                            {title: 'No.', field: 'num', width: 40},
                            {title: '课程名称', field: 'name', width: 250},
                            {title: '课程分类', field: 'cateName', width: 150},
                            {title: '状态', field: 'status', width: 50},
                            {title: '学时', field: 'credit', width: 50},
                            /*  { title: "弹窗题", field: "popQuestionNum", width: 60 },*/
                            {
                                title: '操作', width: 70,
                                template: kendo.template(
                                    '<button class="table-btn" ng-show="events.checked(dataItem,true)" ng-click="events.checkSelectedCourse(dataItem)">选择</button>' +
                                    '<button class="table-btn" ng-show="events.checked(dataItem,false)" ng-click="events.cancleSelectedCourse()">取消选择</button>')
                            }
                        ]
                    }
                },
                myselfGrid: {
                    options: {
                        // 每个行的模板定义,
                        scrollable: false,
                        rowTemplate: kendo.template(allQuestionListTemplate),
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    var sortStr = '';
                                    if (type == 'read') {
                                        // if ( data.sort ) {
                                        //     var str = [];
                                        //     angular.forEach ( data.sort, function ( item, index ) {
                                        //         str.push ( item.field + ' ' + item.dir );
                                        //     } );
                                        //     sortStr = str.join ( ',' );
                                        // }]
                                        return {
                                            'pageSize': data.pageSize,
                                            'pageNo': data.page,
                                            'popQuestionQueryParams.couseWareId': $scope.model.myselfQuestionSearch.couseWareId,
                                            'popQuestionQueryParams.topic': $scope.model.myselfQuestionSearch.topic,
                                            'popQuestionQueryParams.questionType': $scope.model.myselfQuestionSearch.questionType,
                                            'popQuestionQueryParams.courseId':$scope.model.myselfQuestionSearch.courseId
                                        };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/popQustionAction/findPopQuestionPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                // data: function ( response ) {
                                //     // $scope.questionSelcted  = false;
                                //     // localDB.selectedIdArray = [];
                                //     return response.info;
                                // }
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response, e) {
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
                                title: 'No',
                                width: 50
                            },
                            {title: '试题题目'},
                            {title: '试题类型', width: 100},
                            {title: '弹窗时间', width: 100},
                            {title: '所属课件', width: 350},
                            {
                                title: '操作', width: 150
                            }
                        ]
                    }
                },
                allGrid: {
                    options: {
                        // 每个行的模板定义,
                        scrollable: false,
                        rowTemplate: kendo.template(questionListTemplate),
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    var sortStr = '';
                                    if (type == 'read') {
                                        // if ( data.sort ) {
                                        //     var str = [];
                                        //     angular.forEach ( data.sort, function ( item, index ) {
                                        //         str.push ( item.field + ' ' + item.dir );
                                        //     } );
                                        //     sortStr = str.join ( ',' );
                                        // }]
                                        return {
                                            'pageSize': data.pageSize,
                                            'pageNo': data.page,
                                            'popQuestionQueryParams.couseWareId': $scope.model.allQuestionSearch.couseWareId,
                                            'popQuestionQueryParams.topic': $scope.model.allQuestionSearch.topic,
                                            'popQuestionQueryParams.questionType': $scope.model.allQuestionSearch.questionType,
                                            'popQuestionQueryParams.courseId':$scope.model.allQuestionSearch.courseId,
                                            'popQuestionQueryParams.unitId':$scope.model.allQuestionSearch.unitId

                                        };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/popQustionAction/findPopQuestionPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                // data: function ( response ) {
                                //     // $scope.questionSelcted  = false;
                                //     // localDB.selectedIdArray = [];
                                //     return response.info;
                                // }
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response, e) {
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
                                title: 'No',
                                width: 50
                            },
                            {title: '试题题目'},
                            {title: '试题类型', width: 100},
                            {title: '弹窗时间', width: 100},
                            {title: '所属课件', width: 350},
                            {
                                title: '操作', width: 150
                            }
                        ]
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
                                        $scope.model.courseWareQueryParams.courseId=$scope.model[$scope.currentTab+'QuestionSearch'].courseId;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.courseWareQueryParams[key] = params[key];
                                                }
                                            }
                                        }
                                        $scope.model.pageindex = e.page;
                                        temp.pageNo = e.page;
                                        temp.pageSize = e.pageSize;
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
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50],
                            pageSize: 10,
                            buttonCount: 10
                            //change: function (e) {
                            //    $scope.model.page.pageNo = parseInt(e.index, 10);
                            //    //== !!important!! 这里重复了page(1)的作用
                            //    // $scope.node.courseWareGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            //{
                            //  title: "<input ng-checked='selected' id='selectAlll' class='k-checkbox'
                            // ng-click='events.selectAll($event)' type='checkbox'/><label class='k-checkbox-label'
                            // for='selectAlll'></label>", filterable: false, width: 60 },
                            {title: 'NO', width: 50},
                            {sortable: false, field: 'name', title: '课件名称'},
                            {sortable: false, field: 'typeName', title: '课件分类', width: 100},
                            {sortable: false, field: 'teacherName', title: '课件类型', width: 105},
                            {sortable: false, field: 'timeLength', title: '课件时长', width: 100},
                            {
                                title: '操作', width: 100
                            }
                        ]
                    }
                }
            };
            $scope.ui.myselfGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.myselfGrid.options);
            $scope.ui.allGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.allGrid.options);
            $scope.ui.courseWareGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseWareGrid.options);
            $scope.ui.courseGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseGrid.options);
        }];
});