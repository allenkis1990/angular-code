define ( function ( customer ) {
    "use strict";
    return {
        indexCtrl: ["$scope", 'kendo.grid','KENDO_UI_TREE', 'HB_dialog', '$timeout', 'unitAdminServices', '$state', 'HB_notification', 'classInfoService','hbUtil',
            function ( $scope, kendoGrid, KENDO_UI_TREE, HB_dialog, $timeout, unitAdminServices, $state, HB_notification, classInfoService, hbUtil ) {
                //alert($state.current.name);

                $scope.itemView = 'states.unitAdmin';
                $scope.model.areaShow = false;
                $scope.itemViewArr = [];
                $scope.treeOptions = {
                    url: '/web/admin/regionInfo/findRegionByParentId'
                };
                unitAdminServices.doview = function ( currentState ) {
                    //$scope.copyUserId=angular.copy($scope.model.userId);
                    if ( $scope.model.userId !== $scope.copyUserId ) {
                        $scope.itemViewArr = $.grep ( $scope.itemViewArr, function ( item ) {
                            return item.viewName === currentState;
                        } );
                        console.log($scope.itemViewArr);
                        $scope.copyUserId  = angular.copy ( $scope.model.userId );
                    }

                }

                $scope.node.tree="";
                $scope.model = {
                    gridPending      : false,
                    classTab         : 1,
                    classInforTab    : 0,
                    page             : {
                        pageSize: 5,
                        pageNo  : 1
                    },
                    unitPage : {
                        pageSize: 10,
                        pageNo  : 1
                    },

                    region           : {
                        id: ""
                    },
                    editUser         : {
                        nameEdit       : false,
                        name           : '',
                        emailEdit      : false,
                        email          : '',
                        phoneNumberEdit: false,
                        phone          : '',
                        codeEdit       : false,
                        code           : '',
                        receiveAddressEdit    : false,
                        receiveAddress        : '',
                        unitNameEdit   : false,
                        unit           : '',
                        identifyEdit   : false,
                        identify       : '',
                        areaEdit       : false,
                        area           : '',
                        jobGradeEdit    : false,
                        jobGrade        : '',
                        hasSurveyCertificateEdit  : false,
                        hasSurveyCertificate      : '',
                        certificateNoEdit     : false,
                        certificateNo         : ''

                    },
                    userInformation  : {
                        unitId:'',
                        name      : '',
                        account  : '',
                        unitName: '',
                        unitArea:'',
                        phoneNum:''
                    },
                    unit:{
                        unitName:''
                    },

                    noUserInformation: false,
                    userResult       : '',
                    useIndex         : 1,
                    chooseInformation: '',
                    userId           : '',

                    getReconciliationPage: {
                        page                  : '',
                        pageSize              : '',
                        orderNo               : '',
                        orderFlowNo           : '',
                        trainClassIdList      : '',
                        completeStartTimeMills: '',
                        completeEndTimeMills  : ''
                    }


                };

                var localDB = {
                    selectedIdArray: []
                };
                $scope.node = {grid:null};

                $scope.kendoPlus = {
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
                    modGridInstance: null
                };

                $scope.events = {
                    unitPageQueryList: function (e, gridName) {
                        e.stopPropagation();
                       $scope.model.userInformation.unitName= $scope.model.unit.unitName;
                        //unitName：$scope.model.userInformation.unitName=
                        $scope.model.page.pageNo = 1;
                        $scope.kendoPlus[gridName].pager.page(1);
                    },

                    choseTrain: function (e, item) {
                        console.log(item);
                        $scope.model.userInformation.unitName = item.name;
                        $scope.model.userInformation.unitId=item.unitId;
                        //   $scope.trainingConfigRequire.trainingProofId = item.id;
                        $scope.modWindow.close();

                    },

                    openKendoWindow: function ( windowName ) {
                        $scope[windowName].center ().open ();
                    },
                    closeKendoWindow: function (windowName) {
                        $scope[windowName].close();
                    },
                    getArea: function (dataItem) {

                        unitAdminServices.findRegionByParentId ( dataItem.id ).then ( function ( data ) {
                            /*    console.log(data.info.length);*/
                            if ( data.info.length===0 ) {
                                $scope.model.chooseInformation.area = dataItem.name;
                               /* console.log("&&&&"+dataItem.id);*/
                                $scope.model.chooseInformation.id = dataItem.id;
                                /*  $scope.model.createParam.name=dataItem.name;
                                 $scope.model.createParam.id=dataItem.id;*/
                                $scope.model.areaShow = false;
                            }
                        } );
                    },
                    openLessonTypeTree: function () {
                        $scope.model.areaShow = !$scope.model.areaShow;
                    },
                    /* checkBoxCheck: function (e, dataItem) {
                     console.log(1111);
                     if (e.currentTarget.checked) {//选中
                     $scope.model.roleSelectedIdArray.push(dataItem.name);
                     } else {//取消勾选
                     var index = _.indexOf($scope.model.roleSelectedIdArray, dataItem.name);
                     if (index !== -1) {
                     $scope.model.roleSelectedIdArray.splice(index, 1);
                     }
                     }
                     },*/

                    //重置密码
                    reducePassword   : function ( e, $index ) {
                        e.preventDefault ();
                        HB_notification.confirm ( '密码将重置为000000，请确认是否重置', function ( dialog ) {
                            return unitAdminServices.resetPassword ( $scope.model.userId ).then ( function ( data ) {
                                dialog.doRightClose ();
                                if ( data.status ) {
                                    HB_dialog.success ( '提示', '重置成功' )
                                } else {
                                    HB_dialog.error ( '提示', data.info );
                                }
                            } )
                        } )
                    },
                    //查询
                    MainPageQueryList: function ( e ) {
                        e.preventDefault ();
                        e.stopPropagation ();
                        if ( $scope.model.userInformation.identify && !isNaN ( $scope.model.userInformation.identify ) && $scope.model.userInformation.identify.length <= 4 ) {
                            HB_dialog.error ( '提示', '如果账号为数字，至少输入5位才能进行查询！' )
                        } else {
                            $scope.events.searchUseInfo();
                        }
                        ;
                    },
                    //选择用户
                    searchUseInfo    : function () {
                        $scope.model.gridPending = true;
                        $scope.model.page.pageNo = 1;
                        $scope.node.user.pager.page ( 1 );
                    },
                    chooseUse        : function ( item ) {
                        $scope.model.useIndex = item.index;
                        $scope.model.userId   = item.userId;
                        /*  console.log ($scope.model.userId);*/

                    },
                    /* getTypeInfo           : function ( dataItem ) {
                     courseManagerService.findHashLessonType ( dataItem.id ).then ( function ( data ) {
                     if ( !data.info ) {
                     $scope.model.course.typeName       = dataItem.name;
                     $scope.model.course.categoryIdList = [dataItem.id];
                     $scope.courseTypeShow              = false;
                     }
                     } );
                     },*/
                    clickTab         : function ( type ) {

                        if ( !$scope.model.noUserInformation && $scope.model.mark === false ) {
                            //alert('loading');
                            //return false;
                        } else {
                            $scope.model.classTab = type;

                            if ( type === 1 ) {//用户信息
                                $scope.itemView = 'states.unitAdmin';
                                //$state.go('states.customer.userInfo');
                            }
                            if ( type === 0 ) {//批次信息
                                $scope.itemView = 'states.unitAdmin.batchInfo';
                                //$state.go('states.customer.orderInfo');
                            }
                            if ( type === 2 ) {//退款订单
                                $scope.itemView = 'states.unitAdmin.refundOrder';
                            }
                            if ( type === 3 ) {//发票信息
                                $scope.itemView = 'states.unitAdmin.invoiceInfo';
                                //$state.go('states.customer.invoiceInfo');
                            }
                            if ( type === 4 ) {//学习历程
                                $scope.itemView = 'states.unitAdmin.learningProcess';
                                //$state.go('states.customer.learningProcess');
                            }
                            if ( type === 5 ) {//问题咨询
                                $scope.itemView = 'states.unitAdmin.questionAsk';
                                //$state.go('states.customer.questionAsk');
                            }
                            if ( type === 6 ) {//用户留言
                                $scope.itemView = 'states.unitAdmin.ueserSay';
                                //$state.go('states.customer.ueserSay');
                            }
                            if ( type === 7 ) {//换班记录
                                $scope.itemView = 'states.unitAdmin.changeRecord';
                            }
                            if ( type === 8 ) {//配送查询
                                $scope.itemView = 'states.unitAdmin.distributionQuery';
                            }

                            if ( findIndex () === null ) {
                                /*$scope.itemViewArr=[
                                 {viewName:'states.customer.classInfo'}
                                 ];*/
                                if ( type !== 1 ) {
                                    $scope.itemViewArr.push ( { viewName: $scope.itemView } );
                                }

                                $state.go ( $scope.itemView );
                            } else {
                                $state.go ( $scope.itemView );
                            }

                        }

                    },
                    //编辑用户信息
                    editUser         : function ( e, type ) {
                        e.preventDefault ();

                        $scope.model.editUser.name                 = $scope.model.chooseInformation.name;
                        $scope.model.editUser.email                = $scope.model.chooseInformation.email;
                        $scope.model.editUser.phone                = $scope.model.chooseInformation.phoneNumber;
                        $scope.model.editUser.code                 = $scope.model.chooseInformation.postCode;
                        $scope.model.editUser.receiveAddress       = $scope.model.chooseInformation.receiveAddress;
                        $scope.model.editUser.unitName             = $scope.model.chooseInformation.unitName;
                        $scope.model.editUser.identify             = $scope.model.chooseInformation.identify;
                        $scope.model.editUser.area                 = $scope.model.chooseInformation.area;
                        $scope.model.editUser.certificateNo        = $scope.model.chooseInformation.certificateNo;



                        if($scope.model.chooseInformation.hasSurveyCertificate == true){
                            $scope.model.editUser.hasSurveyCertificate ="是"

                        }else{
                            $scope.model.editUser.hasSurveyCertificate ="否"

                        }

                        if($scope.model.chooseInformation.jobGrade == 1){
                            $scope.model.editUser.jobGrade   ="技术员"
                        }else if($scope.model.chooseInformation.jobGrade == 2){
                            $scope.model.editUser.jobGrade ="助理工程师"
                        }else if($scope.model.chooseInformation.jobGrade == 3){
                            $scope.model.editUser.jobGrade   ="工程师"
                        }else if($scope.model.chooseInformation.jobGrade == 4){
                            $scope.model.editUser.jobGrade   ="高级工程师"
                        }else if($scope.model.chooseInformation.jobGrade == 5){
                            $scope.model.editUser.jobGrade   ="教授高级工程师"
                        }else if($scope.model.chooseInformation.jobGrade == 6){
                            $scope.model.editUser.jobGrade   ="其他"
                        }

                        if ( type === 0 ) {

                            $scope.model.editUser.nameEdit = true;
                        }
                        if ( type === 1 ) {
                            $scope.model.editUser.phoneNumberEdit = true;
                        }
                        if ( type === 2 ) {
                            $scope.model.editUser.emailEdit = true;

                        }
                        if ( type === 3 ) {
                            $scope.model.editUser.receiveAddressEdit = true;
                        }
                        if ( type === 4 ) {
                            $scope.model.editUser.codeEdit = true;
                        }
                        if ( type === 5 ) {
                            $scope.model.editUser.unitNameEdit = true;
                        }
                        if ( type === 6 ) {
                            /*  $scope.model.check={
                             "userId":$scope.model.userId
                             };*/
                            $scope.model.editUser.identifyEdit = true;
                        }
                        if ( type === 7 ) {

                            $scope.model.editUser.areaEdit = true;

                        }
                        if ( type === 8 ) {
                            $scope.model.editUser.jobGradeEdit = true;
                        }
                        if ( type === 9 ) {
                            $scope.model.editUser.hasSurveyCertificateEdit = true;
                            $scope.model.check={
                                "userId":$scope.model.userId
                            };
                            $scope.model.editUser.certificateNoEdit = true;
                        }
                        if ( type === 10 ) {
                            $scope.model.check={
                                "userId":$scope.model.userId
                            };
                            $scope.model.editUser.certificateNoEdit = true;

                        }
                    },
                    sureEdit         : function ( e, type, model ) {
                        e.preventDefault ();

                        if ( type === 0 ) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.name = model;
                            $scope.model.editUser.nameEdit      = false;
                            $scope.events.sureEditFn ();
                        }
                        if ( type === 1 ) {
                            /* if ( model.toString ().length !== 11 || !(/^1[34578]\d{9}$/.test ( model )) ) {
                             HB_dialog.error ( '提示', '请输入正确的手机号码' )
                             } else {
                             $scope.model.chooseInformation.phoneNumber = model;
                             $scope.model.editUser.phoneNumberEdit      = false;
                             $scope.events.sureEditFn ();
                             }*/
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.phoneNumber = model;
                            $scope.model.editUser.phoneNumberEdit      = false;
                            $scope.events.sureEditFn ();
                        }
                        if ( type === 2 ) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.email = model;
                            $scope.model.editUser.emailEdit      = false;
                            $scope.events.sureEditFn ();
                        }
                        if ( type === 3 ) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.receiveAddress = model;
                            $scope.model.editUser.receiveAddressEdit      = false;
                            $scope.events.sureEditFn ();
                        }
                        if ( type === 4 ) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.postCode = model;
                            $scope.model.editUser.codeEdit          = false;
                            $scope.events.sureEditFn ();
                        }
                        if ( type === 5 ) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.unitName = model;
                            $scope.model.editUser.unitNameEdit      = false;
                            $scope.events.sureEditFn ();
                        }
                        if ( type === 6 ) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.identify = model;
                            $scope.model.editUser.identifyEdit      = false;
                            $scope.events.sureEditFn ();
                        }
                        if ( type === 7 ) {
                            /* $scope.model.region.id = model;*/
                            $scope.model.chooseInformation.regionId=$scope.model.region.id
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.editUser.areaEdit      = false;
                            $scope.events.sureEditFn ();
                            $scope.model.areaShow = false;
                        }
                        if ( type === 8 ) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.jobGrade = model;

                            if($scope.model.chooseInformation.jobGrade == 1){
                                $scope.model.editUser.jobGrade = "技术员"
                            }else if($scope.model.chooseInformation.jobGrade == 2){
                                $scope.model.editUser.jobGrade = "助理工程师"
                            }else if($scope.model.chooseInformation.jobGrade == 3){
                                $scope.model.editUser.jobGrade = "工程师"
                            }else if($scope.model.chooseInformation.jobGrade == 4){
                                $scope.model.editUser.jobGrade = "高级工程师"
                            }else if($scope.model.chooseInformation.jobGrade == 5){
                                $scope.model.editUser.jobGrade = "教授高级工程师"
                            }else if($scope.model.chooseInformation.jobGrade == 6){
                                $scope.model.editUser.jobGrade = "其他"
                            }
                            $scope.model.editUser.jobGradeEdit = false;

                            $scope.events.sureEditFn();
                        }
                        if ( type === 9) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.hasSurveyCertificate = model;
                            if($scope.model.chooseInformation.hasSurveyCertificate=== true){
                                $scope.model.editUser.hasSurveyCertificate ="是"
                                if ($scope.model.editUser.certificateNoEdit=== true){
                                    return false;
                                }
                            }else{
                                $scope.model.editUser.hasSurveyCertificate ="否"
                            }
                            /* console.log($scope.model.chooseInformation.certificateNo);*/

                            $scope.model.editUser.hasSurveyCertificateEdit = false;
                            $scope.events.sureEditFn ();
                        }
                        if ( type === 10) {
                            if (model===undefined){
                                return false;
                            }
                            $scope.model.chooseInformation.certificateNo = model;

                            $scope.model.editUser.certificateNoEdit      = false;
                            $scope.events.sureEditFn ();
                        }
                    },



                    sureEditFn       : function () {
                 /*       console.log($scope.model.chooseInformation)*/
                        //var regionPath=$scope.model.chooseInformation.region.regionPath.split('/');
                       unitAdminServices.edit (
                            {
                                name                   : $scope.model.chooseInformation.name,
                                userId                 : $scope.model.userId,
                                phoneNum          :$scope. model.chooseInformation.phoneNumber,
                                //email                  : $scope.model.chooseInformation.email,
                                //hasSurveyCertificate   : $scope.model.chooseInformation.hasSurveyCertificate,
                                //certificateNo          : $scope.model.chooseInformation.certificateNo,
                                //receiveAddress         : $scope.model.chooseInformation.receiveAddress,
                                //postCode               : $scope.model.chooseInformation.postCode,
                                unitName               : $scope.model.chooseInformation.unitName,

                                //identify               : $scope.model.chooseInformation.identify,
                                /* area                   : $scope.model.chooseInformation.area,*/
                                //jobGrade               : $scope.model.chooseInformation.jobGrade,

                                unitRegion               :$scope.model.chooseInformation.region?($scope.model.chooseInformation.region.id?$scope.model.chooseInformation.region.id:$scope.model.chooseInformation.regionId):$scope.model.chooseInformation.regionId
                            }
                        ).then ( function ( data ) {
                            if ( data.status ) {
                                HB_dialog.success ( '提示', '修改成功' );
                                var userID = $scope.model.userId;
                                //设置延时
                                var rearea=  function(){
                                    unitAdminServices.getUserInfo(userID).then(function(data){
                                  /*      console.log("***");
                                      console.log(data.info)*/
                                        $scope.model.chooseInformation.area = data.info.area;
                                        $scope.model.chooseInformation.regionId=data.info.regionId;
                                        $scope.model.region.id=$scope.model.chooseInformation.regionId;
                                    })
                                }
                                window.setTimeout(rearea,3000);
                                //不设置延时
                                /*  unitAdminServices.getUserInfo(userID).then(function(data){
                                 console.log(data.info.area);

                                 $scope.model.chooseInformation.area = data.info.area;
                                 })*/

                            } else {
                                HB_dialog.error ( '提示', data.info );
                            }
                        } );
                    }
                };

                function findIndex() {
                    var index = null;
                    angular.forEach ( $scope.itemViewArr, function ( item, itemIndex ) {
                        if ( item.viewName === $scope.itemView ) {
                            index = itemIndex;
                        }
                    } );
                    return index;
                }

                //用户查询分页表格：user
                $scope.node      = {
                    user         : null,
                    learningClass: null,
                    learnStatus  : null,
                    changeClass  : null
                };
                var userTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr ng-class="{\'k-state-selected\':model.useIndex === dataItem.index}" ng-click="events.chooseUse(dataItem)">' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#:account=== null?\'/\': account #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#:name #' );
                    result.push ( '</td>' );


                    result.push ( '<td>' );
                    result.push ( '#: unitName === null?\'/\': unitName#' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: unitArea === null?\'/\': unitArea#' );
                    result.push ( '</td>' );
                    result.push ( '<td>' );
                    result.push ( '#: phoneNum === null?\'/\': phoneNum#' );
                    result.push ( '</td>' );

                    /*  result.push ( '<td>' );
                     result.push ( '#: department === null?\'/\':department #' );
                     result.push ( '</td>' );*/

                    result.push ( '</tr>' );
                    userTemplate = result.join ( '' );
                }) ();


                $scope.ui.user = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template ( userTemplate ),
                        scrollable : false,
                        noRecords  : {
                            template: '暂无数据'
                        },
                        dataSource : {
                            transport    : {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url        : "/web/admin/unitAdminCustom/findUnitAdmin",
                                    data       : function ( e ) {
                                        var temp = {
                                            name      : $scope.model.userInformation.name,
                                            account: $scope.model.userInformation.account,
                                            unitName  : $scope.model.userInformation.unitName,
                                            phoneNum  : $scope.model.userInformation.phoneNum ,
                                            unitId:$scope.model.userInformation.unitName==null?"":$scope.model.userInformation.unitId,
                                            pageNo    : e.page,

                                            //page:$scope.model.page.pageNo,
                                            pageSize  : $scope.model.page.pageSize
                                        };
                                        return temp;

                                    },
                                    dataType   : 'json'
                                }

                            },
                            pageSize     : 5, // 每页显示的数据数目
                            schema       : {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function ( response ) {
                                    $scope.model.gridPending = false;
                                    if ( response.info.length === 0 ) {
                                        $timeout ( function () {
                                            $scope.model.noUserInformation = true;
                                            $scope.model.userId            = '';
                                            $scope.itemViewArr             = $.grep ( $scope.itemViewArr, function ( item ) {
                                                return item.viewName === $state.current.name;
                                            } );
                                            $scope.copyUserId              = angular.copy ( $scope.model.userId );
                                        } );
                                    } else {
                                        $timeout ( function () {
                                            $scope.model.noUserInformation = false;
                                            $scope.model.userResult        = response.info;
                                            $scope.events.chooseUse ( $scope.model.userResult[0] );
                                        } );
                                    }
                                    ;
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if ( response.status ) {
                                        var dataview = response.info, index = 1;
                                        angular.forEach ( dataview, function ( item ) {
                                            item.index = index++;
                                        } );
                                    }
                                    return response;
                                },
                                total: function ( response ) {
                                    return response.totalSize;
                                },
                                data : function ( response ) {
                                    return response.info;
                                } // 指定数据源
                            },
                            serverPaging : true, //远程获取书籍
                            serverSorting: true //远程排序字段
                        },
                        selectable : true,
                        sortable   : {
                            mode       : "single",
                            allowUnsort: false
                        },
                        dataBinding: function ( e ) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf ( e );
                        },
                        pageable   : {
                            refresh    : true,
                            pageSizes  : [5, 10, 30, 50] || true,
                            pageSize   : 10,
                            buttonCount: 10
                            //change: function (e) {
                            //    $scope.model.page.pageNo = parseInt(e.index, 10);
                            //    //== !!important!! 这里重复了page(1)的作用
                            //    // $scope.node.lessonGrid.dataSource.read();
                            //}
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns    : [
                            { title: "No", width: 50 },
                            { sortable: false, field: "name", title: "管理员账号", width: 200 },
                            { sortable: false, field: "typeName", title: "管理员姓名" },
                            { sortable: false, field: "period", title: "单位名称" },
                            { sortable: false, field: "unitArea", title: "单位地区" },
                            { sortable: false, field: "teacherName", title: "手机号码", width: 250 },
                            /*     { sortable: false, field: "studyCount", title: "所属主管部门" }*/
                        ]
                    }
                };

                //$state.go ( 'states.customer.classInfo' );

                var modGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td >');
                    result.push('#:index #');
                    result.push('</td>');

                    result.push('<td title="#: name #">');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" has-permission="searchUnit/choseTrain" ng-click="events.choseTrain($event,dataItem)">选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    modGridRowTemplate = result.join('');
                })();

                $scope.modGrid = {
                    options: hbUtil.kdGridCommonOption({
                        template: modGridRowTemplate,
                        url: "/web/admin/unitAdminCustom/findUnitPage",
                        scope: $scope,
                        page:'unitPage',
                        param: $scope.model.unit,
                        fn      : function ( response ) {
                            $scope.configedArr = response.info;
                        },
                        columns: [
                            {
                                title: "No",
                                width: 50
                            },
                            {field: "name", title: "单位名称", sortable: false,width:200},
                            {
                                title: "操作", width: 100
                            }
                        ]
                    })
                };

                //用户信息


                $scope.$watch('model.userId',function(newVal){
                    if(newVal){
                        unitAdminServices.doview($state.current.name);
                        unitAdminServices.getUserInfo(newVal).then(function(data) {
                            $scope.model.chooseInformation = data.info;
                            if($scope.model.chooseInformation.hasSurveyCertificate == true){
                                $scope.model.editUser.hasSurveyCertificate="是"
                            }else{
                                $scope.model.editUser.hasSurveyCertificate="否"
                            }

                            if($scope.model.chooseInformation.jobGrade == 1){
                                $scope.model.editUser.jobGrade ="技术员"
                            }else if($scope.model.chooseInformation.jobGrade == 2){
                                $scope.model.editUser.jobGrade ="助理工程师"
                            }else if($scope.model.chooseInformation.jobGrade == 3){
                                $scope.model.editUser.jobGrade ="工程师"
                            }else if($scope.model.chooseInformation.jobGrade == 4){
                                $scope.model.editUser.jobGrade ="高级工程师"
                            }else if($scope.model.chooseInformation.jobGrade == 5){
                                $scope.model.editUser.jobGrade ="教授高级工程师"
                            }else if($scope.model.chooseInformation.jobGrade == 6){
                                $scope.model.editUser.jobGrade ="其他"
                            }
                            $scope.model.chooseInformation.phoneNumber = parseInt($scope.model.chooseInformation.phoneNumber);
                            $scope.model.chooseInformation.postCode = parseInt($scope.model.chooseInformation.postCode);
                            if(!hbUtil.validateIsNull($scope.model.chooseInformation.certificateNo )){
                                $scope.model.chooseInformation.certificateNo = $scope.model.chooseInformation.certificateNo.substr(5);
                            }else{
                                $scope.model.chooseInformation.certificateNo = $scope.model.chooseInformation.certificateNo;
                            }


                        });

                    }
                });


                //地区树
                var dataSource = new kendo.data.HierarchicalDataSource({
                    dropDownWidth : '177px',
                    transport: {
                        read: function (options) {
                            var parentId = options.data.id ? options.data.id: '-1',
                                myModel = dataSource.get(options.data.id);
                            var type = myModel ? myModel.type : '';
                            $.ajax({
                                /*url: "/web/admin/administratorManage/getUnitByParentId?parentId=" + id,*/
                                url: "/web/admin/regionInfo/findRegionByParentId/"+parentId+"/1",
                                dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
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
                            id: "id",
                            hasChildren: "hasChildren"
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



                $scope.$watch ( '$state.current.name', function ( newVal ) {

                    $scope.itemView=newVal;
                    if ( newVal === 'states.customer' ) {
                        $scope.model.classTab = 1;
                    } else {

                        if ( findIndex () === null ) {

                            if($state.includes("states.unitAdmin")){
                                $scope.itemViewArr.push ( { viewName: newVal } );
                            }
                        }
                        //if(newVal === 'states.customer.invoiceInfo'){
                        console.log($scope.itemViewArr);
                        if ( newVal === 'states.unitAdmin' ) {//用户信息
                            $scope.model.classTab = 1;
                            //$scope.itemView = 'states.customer.userInfo';
                            //$state.go('states.customer.userInfo');
                        }
                        if ( newVal === 'states.unitAdmin.batchInfo' ) {//订单信息
                            $scope.model.classTab = 0;
                            //$scope.itemView = 'states.customer.orderInfo';
                            //$state.go('states.customer.orderInfo');
                        }
                        if ( newVal === 'states.unitAdmin.refundOrder' ) {//配送查询
                            $scope.model.classTab = 2;
                            //$scope.itemView = 'states.customer.changeRecord';
                        }
                        if ( newVal === 'states.customer.invoiceInfo' ) {//发票信息
                            $scope.model.classTab = 3;
                            //$scope.itemView = 'states.customer.invoiceInfo';
                            //$state.go('states.customer.invoiceInfo');
                        }
                        if ( newVal === 'states.customer.learningProcess' ) {//学习历程
                            $scope.model.classTab = 4;
                            //$scope.itemView = 'states.customer.learningProcess';
                            //$state.go('states.customer.learningProcess');
                        }
                        if ( newVal === 'states.customer.questionAsk' ) {//问题咨询
                            $scope.model.classTab = 5;
                            //$scope.itemView = 'states.customer.questionAsk';
                            //$state.go('states.customer.questionAsk');
                        }
                        if ( newVal === 'states.customer.ueserSay' ) {//用户留言
                            $scope.model.classTab = 6;
                            //$scope.itemView = 'states.customer.ueserSay';
                            //$state.go('states.customer.ueserSay');
                        }
                        if ( newVal === 'states.customer.changeRecord' ) {//换班记录
                            $scope.model.classTab = 7;
                            //$scope.itemView = 'states.customer.changeRecord';
                        }
                        if ( newVal === 'states.customer.distributionQuery' ) {//配送查询
                            $scope.model.classTab = 8;
                            //$scope.itemView = 'states.customer.changeRecord';
                        }
                        if ( newVal === 'states.customer.refundOrder' ) {//配送查询
                            $scope.model.classTab = 9;
                            //$scope.itemView = 'states.customer.changeRecord';
                        }

                        //}
                    }
                } );

            }]
    }
} );