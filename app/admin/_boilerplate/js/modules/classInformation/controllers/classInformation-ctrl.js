define(function (classInformation) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'kendo.grid', 'HB_dialog', '$timeout', 'classInformationServices', '$state', 'HB_notification', 'classInfoService',
            function ($scope, kendoGrid, HB_dialog, $timeout, classInformationServices, $state, HB_notification, classInfoService) {
                //alert($state.current.name);

                $scope.itemView = 'states.classInformation';

                $scope.itemViewArr = [];

                classInformationServices.doview = function (currentState) {
                    //$scope.copyUserId=angular.copy($scope.model.userId);
                    if ($scope.model.userId !== $scope.copyUserId) {
                        $scope.itemViewArr = $.grep($scope.itemViewArr, function (item) {
                            return item.viewName === currentState;
                        });
                        $scope.copyUserId = angular.copy($scope.model.userId);
                    }

                };

                $scope.model = {

                    highestEducationList:
                        [
                            {name: '博士', optionId: '博士'},
                            {name: '硕士', optionId: '硕士'},
                            {name: '本科', optionId: '本科'},
                            {name: '大专及以下', optionId: '大专及以下'}
                        ],
                    gridPending: false,
                    classTab: 1,
                    classInforTab: 0,
                    page: {
                        pageSize: 5,
                        pageNo: 1
                    },
                    user: {
                        cityId: 0,
                        areaId: 0
                    },
                    editUser: {
                        genderEdit: false,
                        gender: '',
                        highestEducationEdit: false,
                        highestEducation: '',
                        jobEdit: false,
                        job: '',
                        jobGradeEdit: false,
                        jobGrade: '',
                        certificateNumberEdit: false,
                        certificateNumber: '',
                        areaPathEdit: false,
                        areaPath: '',
                        nameEdit: false,
                        name: '',
                        emailEdit: false,
                        email: '',
                        phoneNumberEdit: false,
                        phone: '',
                        codeEdit: false,
                        code: '',
                        addressEdit: false,
                        address: '',
                        unitNameEdit: false,
                        unit: ''
                    },
                    userInformation: {
                        name: '',
                        identify: '',
                        loginInput: ''
                    },
                    noUserInformation: false,
                    userResult: '',
                    useIndex: 1,
                    chooseInformation: '',
                    userId: '',

                    getReconciliationPage: {
                        page: '',
                        pageSize: '',
                        orderNo: '',
                        orderFlowNo: '',
                        trainClassIdList: '',
                        completeStartTimeMills: '',
                        completeEndTimeMills: ''
                    }
                };

                $scope.events = {
                    changeCity: function () {
                        console.log($scope.model.user.cityId);
                        $scope.model.user.areaPath = '';
                        $scope.model.user.areaId = undefined;
                        if ($scope.model.user.cityId === null || $scope.model.user.cityId === '' || $scope.model.user.cityId === undefined) {
                            $scope.model.areaArr = [];
                        } else {
                            classInformationServices.findRegion({parentId: $scope.model.user.cityId}).then(function (data) {
                                $scope.model.areaArr = data.info;

                            });
                        }
                    },
                    //重置密码
                    reducePassword: function (e, $index) {
                        e.preventDefault();
                        HB_notification.confirm('确定重置该学员账号密码为xy000000吗？', function (dialog) {
                            return classInformationServices.resetPassword($scope.model.userId).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    HB_dialog.success('提示', '重置成功');
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        });
                    },
                    //查询
                    MainPageQueryList: function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($scope.model.userInformation.identify && !isNaN($scope.model.userInformation.identify) && $scope.model.userInformation.identify.length <= 4) {
                            HB_dialog.error('提示', '如果账号为数字，至少输入5位才能进行查询！');
                        } else {
                            $scope.events.searchUseInfo();
                        }
                        ;
                    },
                    //选择用户
                    searchUseInfo: function () {
                        $scope.model.gridPending = true;
                        $scope.model.page.pageNo = 1;
                        $scope.node.user.pager.page(1);

                    },
                    chooseUse: function (item) {
                        $scope.model.useIndex = item.index;
                        $scope.model.userId = item.userId;
                        console.log($scope.model.userId);
                    },
                    clickTab: function (type) {

                        if (!$scope.model.noUserInformation && $scope.model.mark === false) {
                            //alert('loading');
                            //return false;
                        } else {
                            $scope.model.classTab = type;

                            if (type === 1) {//用户信息
                                $scope.itemView = 'states.classInformation';
                                //$state.go('states.classInformation.userInfo');
                            }
                            if (type === 0) {//班级信息
                                $scope.itemView = 'states.classInformation.classInfo';
                                //$state.go('states.classInformation.classInfo');
                            }
                            if (type === 2) {//订单信息
                                $scope.itemView = 'states.classInformation.orderInfo';
                                //$state.go('states.classInformation.orderInfo');
                            }
                            if (type === 3) {//发票信息
                                $scope.itemView = 'states.classInformation.invoiceInfo';
                                //$state.go('states.classInformation.invoiceInfo');
                            }
                            if (type === 4) {//学习历程
                                $scope.itemView = 'states.classInformation.learningProcess';
                                //$state.go('states.classInformation.learningProcess');
                            }
                            if (type === 5) {//问题咨询
                                $scope.itemView = 'states.classInformation.questionAsk';
                                //$state.go('states.classInformation.questionAsk');
                            }
                            if (type === 6) {//用户留言
                                $scope.itemView = 'states.classInformation.ueserSay';
                                //$state.go('states.classInformation.ueserSay');
                            }
                            if (type === 7) {//换班记录
                                $scope.itemView = 'states.classInformation.changeRecord';
                            }

                            if (type === 8) {//配送管理
                                $scope.itemView = 'states.classInformation.distributionQuery';
                            }

                            if (type === 9) {//退款订单
                                $scope.itemView = 'states.classInformation.refundOrder';
                            }
                            if (type === 10) {//退款订单
                                $scope.itemView = 'states.classInformation.changeCourseRecord';
                            }

                            if (findIndex() === null) {
                                /*$scope.itemViewArr=[
                                 {viewName:'states.classInformation.classInfo'}
                                 ];*/
                                if (type !== 1) {
                                    $scope.itemViewArr.push({viewName: $scope.itemView});
                                }

                                $state.go($scope.itemView);
                            } else {
                                $state.go($scope.itemView);
                            }

                        }

                    },
                    //编辑用户信息
                    editUser: function (e, type) {
                        e.preventDefault();

                        $scope.model.editUser.name = $scope.model.chooseInformation.name;
                        $scope.model.editUser.address = $scope.model.chooseInformation.address;
                        $scope.model.editUser.certificateNumber = $scope.model.chooseInformation.certificateNumber;
                        $scope.model.editUser.email = $scope.model.chooseInformation.email;
                        $scope.model.editUser.highestEducation = $scope.model.chooseInformation.highestEducation;
                        $scope.model.editUser.job = $scope.model.chooseInformation.job;
                        $scope.model.editUser.jobGrade = $scope.model.chooseInformation.jobGrade;
                        $scope.model.editUser.code = $scope.model.chooseInformation.postCode;
                        $scope.model.editUser.unit = $scope.model.chooseInformation.unitName;
                        $scope.model.editUser.phone = $scope.model.chooseInformation.phoneNumber;
                        if (type === 0) {
                            $scope.model.editUser.nameEdit = true;
                        }
                        if (type === 1) {
                            $scope.model.editUser.phoneNumberEdit = true;
                        }
                        if (type === 2) {
                            $scope.model.editUser.emailEdit = true;
                        }
                        if (type === 3) {
                            $scope.model.editUser.addressEdit = true;
                        }
                        if (type === 4) {
                            $scope.model.editUser.codeEdit = true;
                        }
                        if (type === 5) {
                            $scope.model.editUser.unitNameEdit = true;
                        }
                        if (type === 6) {
                            $scope.model.editUser.areaPathEdit = true;
                        }
                        if (type === 7) {
                            $scope.model.editUser.certificateNumberEdit = true;
                        }
                        if (type === 8) {
                            $scope.model.editUser.jobGradeEdit = true;
                        }
                        if (type === 9) {
                            $scope.model.editUser.jobEdit = true;
                        }
                        if (type === 10) {
                            $scope.model.editUser.highestEducationEdit = true;
                        }
                        if (type === 11) {
                            $scope.model.editUser.genderEdit = true;
                        }
                    },
                    sureEdit: function (e, type, model) {
                        e.preventDefault();
                        if (type === 0) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.name = model;
                            $scope.model.editUser.nameEdit = false;
                            $scope.events.sureEditFn();

                        }
                        if (type === 1) {
                            if (model === undefined) {
                                return false;
                            }
                            /*  if ( model.toString ().length !== 11 || !(/^1[34578]\d{9}$/.test ( model )) ) {
                                  HB_dialog.error ( '提示', '请输入正确的手机号码' )
                              } else {*/
                            $scope.model.chooseInformation.phoneNumber = model;
                            $scope.model.editUser.phoneNumberEdit = false;
                            $scope.events.sureEditFn();
                            /*     }*/
                        }
                        if (type === 2) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.email = model;
                            $scope.model.editUser.emailEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 3) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.address = model;
                            $scope.model.editUser.addressEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 4) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.postCode = model;
                            $scope.model.editUser.codeEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 5) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.unitName = model;
                            $scope.model.editUser.unitNameEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 6) {
                            if ($scope.model.user.cityId === undefined || $scope.model.user.areaId === undefined) {
                                return false;
                            }
                            /*$scope.model.chooseInformation.areaPath = model;*/
                            $scope.model.editUser.areaPathEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 7) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.certificateNumber = model;
                            $scope.model.editUser.certificateNumberEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 8) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.jobGrade = model;
                            $scope.model.editUser.jobGradeEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 9) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.job = model;
                            $scope.model.editUser.jobEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 10) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.chooseInformation.highestEducation = model;
                            $scope.model.editUser.highestEducationEdit = false;
                            $scope.events.sureEditFn();
                        }
                        if (type === 11) {
                            if (model === undefined) {
                                return false;
                            }
                            $scope.model.editUser.genderEdit = false;
                            $scope.events.sureEditFn();
                        }

                    },
                    sureEditFn: function () {


                        classInformationServices.edit(
                            {
                                userId: $scope.model.userId,
                                phoneNumber: $scope.model.chooseInformation.phoneNumber,
                                email: $scope.model.chooseInformation.email,
                                address: $scope.model.chooseInformation.address,
                                postCode: $scope.model.chooseInformation.postCode,
                                workUnit: $scope.model.chooseInformation.unitName,
                                name: $scope.model.chooseInformation.name,
                                sex: $scope.model.chooseInformation.sex,
                                areaPath: '/340000/' + $scope.model.user.cityId + '/' + $scope.model.user.areaId,
                                certificateNumber: $scope.model.chooseInformation.certificateNumber,
                                highestEducation: $scope.model.chooseInformation.highestEducation,
                                job: $scope.model.chooseInformation.job,
                                jobGrade: $scope.model.chooseInformation.jobGrade,
                                loginInput: $scope.model.chooseInformation.loginInput
                            }
                        ).then(function (data) {
                            if (data.status) {
                                HB_dialog.success('提示', '修改成功');
                                classInformationServices.doview($state.current.name);
                                classInformationServices.getUserInfo($scope.model.userId).then(function (data) {
                                    $scope.model.chooseInformation = data.info;
                                    $scope.model.chooseInformation.phoneNumber = parseInt($scope.model.chooseInformation.phoneNumber);
                                    $scope.model.chooseInformation.postCode = parseInt($scope.model.chooseInformation.postCode);

                                    if (data.info.area === null) {
                                        /* $scope.model.user.cityId=data.info[0].id*/
                                    } else {
                                        $scope.model.user.cityId = data.info.area.split('/')[2];
                                        $scope.model.user.areaId = data.info.area.split('/')[3];
                                    }

                                    if (data.info.gender === '男') {
                                        $scope.model.chooseInformation.sex = 1;
                                    } else {
                                        $scope.model.chooseInformation.sex = 2;
                                    }
                                    classInformationServices.findRegion({parentId: ''}).then(function (data) {
                                        $scope.model.cityList = data.info;
                                        if ($scope.model.user.cityId === null || $scope.model.user.cityId === '' || $scope.model.user.cityId === undefined) {
                                            $scope.model.areaArr = [];
                                        } else {
                                            classInformationServices.findRegion({parentId: $scope.model.user.cityId}).then(function (data) {
                                                $scope.model.areaArr = data.info;

                                            });
                                        }

                                    });
                                });
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        });
                    }
                };

                function findIndex () {
                    var index = null;
                    angular.forEach($scope.itemViewArr, function (item, itemIndex) {
                        if (item.viewName === $scope.itemView) {
                            index = itemIndex;
                        }
                    });
                    return index;
                }

                //用户查询分页表格：user
                $scope.node = {
                    user: null,
                    learningClass: null,
                    learnStatus: null,
                    changeClass: null
                };
                var userTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr ng-class="{\'k-state-selected\':model.useIndex === dataItem.index}" ng-click="events.chooseUse(dataItem)">');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: identify #');
                    result.push('</td>');
                    /*
                                        result.push ( '<td>' );
                                        result.push ( '#: unitName === null?\'/\': unitName#' );
                                        result.push ( '</td>' );*/
                    result.push('<td>');
                    result.push('#: areaPathName === null?\'/\': areaPathName#');
                    result.push('</td>');
                    result.push('<td>');
                    result.push('#: phoneNumber === null?\'/\': phoneNumber#');
                    result.push('</td>');

                    /*       result.push ( '<td>' );
                           result.push ( '#: department === null?\'/\':department #' );
                           result.push ( '</td>' );
       */
                    result.push('</tr>');
                    userTemplate = result.join('');
                })();

                $scope.ui.user = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(userTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/userManage/getUserBasicInfo',
                                    data: function (e) {
                                        var temp = {
                                            name: $scope.model.userInformation.name,
                                            loginInput: $scope.model.userInformation.identify,
                                            orderId: $scope.model.userInformation.loginInput,
                                            pageNo: e.page,
                                            //page:$scope.model.page.pageNo,
                                            pageSize: $scope.model.page.pageSize
                                        };
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
                                    $scope.model.gridPending = false;
                                    if (response.info.length === 0) {
                                        $timeout(function () {
                                            $scope.model.noUserInformation = true;
                                            $scope.model.userId = '';
                                            $scope.itemViewArr = $.grep($scope.itemViewArr, function (item) {
                                                return item.viewName === $state.current.name;
                                            });
                                            $scope.copyUserId = angular.copy($scope.model.userId);
                                        });
                                    } else {
                                        $timeout(function () {
                                            $scope.model.noUserInformation = false;
                                            $scope.model.userResult = response.info;
                                            $scope.events.chooseUse($scope.model.userResult[0]);
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
                            kendoGrid.nullDataDealLeaf(e);
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
                            {title: 'No', width: 50},
                            {sortable: false, field: 'name', title: '姓名', width: 150},
                            {sortable: false, field: 'typeName', title: '身份证号'},
                            /*       { sortable: false, field: "period", title: "单位名称" },*/
                            {sortable: false, field: 'areaPath', title: '所在地区'},
                            {sortable: false, field: 'teacherName', title: '手机号码', width: 250}
                            /*{ sortable: false, field: "studyCount", title: "所属主管部门" }*/
                        ]
                    }
                };
                //地区树
                var dataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: function (options) {
                            var id = options.data.id ? options.data.id : '',
                                myModel = dataSource.get(options.data.id);
                            var type = myModel ? myModel.type : '';
                            $.ajax({
                                url: '/web/admin/administratorManage/getAreaByParentId?parentId=' + id,
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

                //$state.go ( 'states.classInformation.classInfo' );

                //用户信息


                $scope.$watch('model.userId', function (newVal) {
                    if (newVal) {
                        classInformationServices.doview($state.current.name);
                        classInformationServices.getUserInfo(newVal).then(function (data) {
                            $scope.model.chooseInformation = data.info;
                            $scope.model.chooseInformation.phoneNumber = parseInt($scope.model.chooseInformation.phoneNumber);
                            if ($scope.model.chooseInformation.postCode !== null) {
                                $scope.model.chooseInformation.postCode = parseInt($scope.model.chooseInformation.postCode);
                            }
                            if (data.info.area === null) {
                                /* $scope.model.user.cityId=data.info[0].id*/
                            } else {
                                $scope.model.user.cityId = data.info.area.split('/')[2];
                                $scope.model.user.areaId = data.info.area.split('/')[3];
                            }

                            if (data.info.gender === '男') {
                                $scope.model.chooseInformation.sex = 1;
                            } else {
                                $scope.model.chooseInformation.sex = 2;
                            }
                            classInformationServices.findRegion({parentId: ''}).then(function (data) {
                                $scope.model.cityList = data.info;
                                if ($scope.model.user.cityId === null || $scope.model.user.cityId === '' || $scope.model.user.cityId === undefined) {
                                    $scope.model.areaArr = [];
                                } else {
                                    classInformationServices.findRegion({parentId: $scope.model.user.cityId}).then(function (data) {
                                        $scope.model.areaArr = data.info;

                                    });
                                }

                            });
                        });

                    }
                });


                $scope.$watch('$state.current.name', function (newVal) {
                    console.log(newVal);
                    $scope.itemView = newVal;
                    if (newVal === 'states.classInformation') {
                        $scope.model.classTab = 1;
                    } else {
                        if (findIndex() === null) {

                            $scope.itemViewArr.push({viewName: newVal});
                        }
                        //if(newVal === 'states.classInformation.invoiceInfo'){

                        if (newVal === 'states.classInformation') {//用户信息
                            $scope.model.classTab = 1;
                            //$scope.itemView = 'states.classInformation.userInfo';
                            //$state.go('states.classInformation.userInfo');
                        }
                        if (newVal === 'states.classInformation.classInfo') {//班级信息
                            $scope.model.classTab = 0;
                            //$scope.itemView = 'states.classInformation';
                            //$state.go('states.classInformation.classInfo');
                        }
                        if (newVal === 'states.classInformation.orderInfo') {//订单信息
                            $scope.model.classTab = 2;
                            //$scope.itemView = 'states.classInformation.orderInfo';
                            //$state.go('states.classInformation.orderInfo');
                        }
                        if (newVal === 'states.classInformation.invoiceInfo') {//发票信息
                            $scope.model.classTab = 3;
                            //$scope.itemView = 'states.classInformation.invoiceInfo';
                            //$state.go('states.classInformation.invoiceInfo');
                        }
                        if (newVal === 'states.classInformation.learningProcess') {//学习历程
                            $scope.model.classTab = 4;
                            //$scope.itemView = 'states.classInformation.learningProcess';
                            //$state.go('states.classInformation.learningProcess');
                        }
                        if (newVal === 'states.classInformation.questionAsk') {//问题咨询
                            $scope.model.classTab = 5;
                            //$scope.itemView = 'states.classInformation.questionAsk';
                            //$state.go('states.classInformation.questionAsk');
                        }
                        if (newVal === 'states.classInformation.ueserSay') {//用户留言
                            $scope.model.classTab = 6;
                            //$scope.itemView = 'states.classInformation.ueserSay';
                            //$state.go('states.classInformation.ueserSay');
                        }
                        if (newVal === 'states.classInformation.changeRecord') {//换班记录
                            $scope.model.classTab = 7;
                            //$scope.itemView = 'states.classInformation.changeRecord';
                        }
                        if (newVal === 'states.classInformation.distributionQuery') {//配送查询
                            $scope.model.classTab = 8;
                            //$scope.itemView = 'states.classInformation.changeRecord';
                        }
                        if (newVal === 'states.classInformation.refundOrder') {//退款订单
                            $scope.model.classTab = 9;
                            //$scope.itemView = 'states.classInformation.changeRecord';
                        }
                        if (newVal === 'states.classInformation.changeCourseRecord') {//退款订单
                            $scope.model.classTab = 10;
                            //$scope.itemView = 'states.classInformation.changeRecord';
                        }
                        //}
                    }
                });

            }]
    };
});