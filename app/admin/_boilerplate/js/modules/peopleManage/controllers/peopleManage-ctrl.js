define ( function () {
    'use strict';
    return ['$scope','hbUtil','HB_dialog','$timeout', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'peopleManageServices','TabService','$state',
        function ( $scope,hbUtil,HB_dialog,$timeout, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, peopleManageServices,TabService,$state ) {
            $scope.inputDisabled=false;
            $scope.regSubmitAble=false;
            $scope.model = {
                userParams: {
                    IDNum:'',
                    name:'',
                    loginInputType:0
                },
                add: {
                    uniqueData:'',
                    email: "",
                    unitName: "",
                    existUser: true,
                    gender: 1,
                    name: "",
                    password: null,
                    phoneNumber: "",
                    passwordType: 1,
                    test:false
                },
                importUser:{
                    passWordType: 1,
                    test:false
                },
                page          : {
                    pageSize: 10,
                    pageNo  : 1
                },
                upload: {}
            };
            $scope.kendoPlus = {
                handWindowOptions        : {
                    modal    : true,
                    visible  : false,
                    resizable: false,
                    draggable: false,
                    title    : false,
                    open     : function () {
                        this.center ();
                    }
                },
                detailWindowOptions        : {
                    modal    : true,
                    visible  : false,
                    resizable: false,
                    draggable: false,
                    title    : false,
                    open     : function () {
                        this.center ();
                    }
                },
                deleteWindowOptions        : {
                    modal    : true,
                    visible  : false,
                    resizable: false,
                    draggable: false,
                    title    : false,
                    open     : function () {
                        this.center ();
                    }
                },
                peopleWindowOptions        : {
                    modal    : true,
                    visible  : false,
                    resizable: false,
                    draggable: false,
                    title    : false,
                    open: function () {
                        $timeout(function () {
                            $scope.windowLoaded = true
                        })
                        this.center();
                    },
                    close: function () {
                        $timeout(function () {
                            $scope.windowLoaded = false
                        })
                    }
                },

            };

            $scope.events={
                importMan : function () {
                    if($scope.model.importUser.passWordType==3&&$scope.model.importUser.password===undefined){
                        HB_dialog.error('提示','请输入密码');
                        return false
                    }
                    if($scope.model.upload===undefined){
                        HB_dialog.error('提示','请选择文件');
                        return false
                    }else{
                        peopleManageServices.importUnitUser({
                            implementProject:'COURSE_SUPERMARKET_V2',
                            filePath:$scope.model.upload.result.newPath,
                            passwordType:$scope.model.importUser.passWordType,
                            password:$scope.model.importUser.password,
                            test:$scope.model.importUser.test,
                        }).then(function(data){
                            if(data.info){
                                HB_dialog.success('提示','操作成功，导入结果请前往导入任务查看！');
                                $scope['peopleWindowOptions'].close ();
                            }else{
                                HB_dialog.error('提示','导入失败');

                            }
                        });
                    }
                },
                isUserExist: function () {
                    if($scope.model.add.uniqueData===''||$scope.model.add.uniqueData===undefined){
                        return false;
                    }else{
                        peopleManageServices.isUserExist({IDNum :$scope.model.add.uniqueData}).then(function(data){
                            console.log(data.info);
                            if(data.info.existUser===false){
                                $scope.inputDisabled=false;
                            }else{
                                $scope.model.add=data.info;
                                $scope.model.add.passwordType=-1;
                                $scope.inputDisabled=true;
                            }
                        })
                    }

                },
                addUserToUnit: function (addForm) {
                    peopleManageServices.addUserToUnit({
                        //email:$scope.model.add.email,
                        unitName:$scope.model.add.unitName,
                        phoneNumber:$scope.model.add.phoneNumber,
                        name:$scope.model.add.name,
                        uniqueData:$scope.model.add.uniqueData,
                        gender:$scope.model.add.gender,
                        passwordType:$scope.model.add.passwordType,
                        password:$scope.model.add.password,
                        test:$scope.model.add.test
                    }).then(function(data){
                        if(data.status){
                            HB_dialog.success('提示',data.info);
                            $scope.model.add={
                                uniqueData:undefined,
                                email: "",
                                unitName:"",
                                existUser: true,
                                gender: 1,
                                name: "",
                                password: null,
                                phoneNumber: "",
                                passwordType: 1
                            };
                            addForm.$setPristine();
                            $scope.inputDisabled=false;
                            $state.reload($state.current);
                            //$scope['peopleWindowOptions'].close ();
                        }else{
                            HB_dialog.error('提示',data.info);
                            $scope.model.add={
                                uniqueData:undefined,
                                email: "",
                                unitName:"",
                                existUser: true,
                                gender: 1,
                                name: "",
                                password: null,
                                phoneNumber: "",
                                passwordType: 1
                            };
                            addForm.$setPristine();
                            $scope.inputDisabled=false;
                        }
                    })

                },
                view: function (e,item) {
                    $scope.events.openKendoWindow('detailWindowOptions');
                    peopleManageServices.getUserInfoById({userId:item.userId}).then(function(data){
                        if(data.status){
                            $scope.model.detail=data.info;
                        }

                    })
                },
                openKendoWindow: function ( windowName ) {
                    $scope[windowName].center ().open ();
                },
                closeaddFormWindow: function (addForm, windowName ) {
                    $scope[windowName].close ();
                    $scope.model.add={
                        uniqueData:'',
                        email: "",
                        existUser: true,
                        gender: 1,
                        name: "",
                        password: null,
                        phoneNumber: "",
                        passwordType: 1
                    };
                    addForm.$setPristine();
                    $scope.inputDisabled=false;
                },
                closeKendoWindow: function (windowName ) {
                    $scope[windowName].close ();
                },
                deletePpeople: function ( e,item ) {
                    $scope.globle.confirm ( '系统提醒', '删除后人员需重新添加，是否确认删除？', function () {
                        return peopleManageServices.deleteUnitUser({userId:item.userId}).then(function(data){
                            if(data.status){
                                HB_dialog.success('提示',data.info);
                                $scope.model.page.pageNo = 1;
                                $scope.kendoPlus.unitUserGrid.pager.page ( 1 );
                            }else{
                                HB_dialog.error('提示',data.info);
                            }
                        });

                    } )
                },
                /**
                 * 查询
                 */
                search: function (  ) {
                    if ( validataIdcard ( $scope.model.userParams.IDNum) ) {
                        HB_dialog.warning ( '提示', '如果账号为数字，至少输入4位才能进行查询！' );
                        return false;
                    }
                    $scope.model.page.pageNo = 1;
                    $scope.kendoPlus.unitUserGrid.pager.page ( 1 );

                },
            }

            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push ( '<tr>' );

                result.push ( '<td>' );
                result.push ( '#: index #' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '<p>姓名：#: name #</p>' );
                result.push ( '<p>身份证：#: uniqueData #</p>' );
                result.push ( '</td>' );


                /*   result.push ( '<td>' );
                 result.push ( '<div  title="#: uniqueData #">' );
                 result.push ( '#: uniqueData #' );
                 result.push ( '</div>' );
                 result.push ( '</td>' );*/
                /*
                 result.push ( '<td>' );
                 result.push ( '<div  title="#: uniqueData #">' );
                 result.push ( '#: uniqueData #' );
                 result.push ( '</div>' );
                 result.push ( '</td>' );*/

                result.push ( '<td>' );
                result.push ( '<div  title="#: uniqueData #">' );
                result.push ( '#: uniqueData #' );
                result.push ( '</div>' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '<span ng-if="#: phoneNumber!==null #">#: phoneNumber #</span>' );
                result.push ( '<span ng-if="#: phoneNumber===null #">  - </span>' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '<span ng-if="#: unitName!==null #">#: unitName #</span>' );
                result.push ( '<span ng-if="#: unitName===null #"> - </span>' );
                result.push ( '</td>' );
                //result.push ( '<td>' );
                //result.push ( '<span ng-if="#: email!==null #">#: email #</span>' );
                //result.push ( '<span ng-if="#: email===null #"> - </span>' );
                //result.push ( '</td>' );

                result.push ( '</td>' );
                result.push ( '<td class="op">' );
                result.push ( '<button type="button" class="table-btn" has-permission="peopleManage/view"  ng-click="events.view($event,dataItem)">详细</button>' );
                result.push ( '<button type="button" class="table-btn" has-permission="peopleManage/delete"  ng-click="events.deletePpeople($event,dataItem)">删除</button>' );
                result.push ( '</td>' );

                result.push ( '</tr>' );
                gridRowTemplate = result.join ( '' );
            }) ();

            $scope.unitUserGrid = {
                options: hbUtil.kdGridCommonOption ( {
                    template: gridRowTemplate,
                    scrollable : false,
                    url     : "/web/admin/unitUserManage/getUserInfoPage",
                    scope   : $scope,
                    page    : 'page',
                    param   : $scope.model.userParams,
                    fn      : function ( response ) {
                        $scope.configedArr = response.info;
                    },
                    columns : [
                        {
                            title: "No",
                            width: 50
                        },
                        { sortable: false, title: "学员信息", width: 200 },
                        { sortable: false, title: "登录帐号", width: 200 },
                        /*  { sortable: false, title: "地区", width: 200 },*/
                        { sortable: false, title: "手机号码", width: 200 },
                        { sortable: false, title: "工作单位", width: 200 },
                        //{ sortable: false, title: "电子邮箱"},
                        {
                            title: "操作",
                            width: 150
                        }
                    ]
                } )
            };
            //验证是否为空
            function validateIsNull( obj ) {
                return (obj === '' || obj === undefined || obj === null);
            }
            //身份证必须大于4位的数字
            function validataIdcard( str ) {

                if ( !validateIsNull ( str ) ) {
                    if ( !isNaN ( Number ( str ) ) && str.length < 5 ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            peopleManageServices.downloadTemplate().then(function (data) {
                if (data.status) {
                    $scope.urlPrefix = data.info.downModelIP;
                }
            });
        }];
} );