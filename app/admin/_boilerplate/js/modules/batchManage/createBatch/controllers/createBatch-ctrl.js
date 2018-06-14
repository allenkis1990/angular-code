define ( function ( detail  ) {
    "use strict";
    return {
        indexCtrl: ["$scope",'hbUtil','$timeout','KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'batchManageServices', '$stateParams', '$http', '$q', 'HB_dialog', '$state', 'HB_notification','TabService','hbSkuService',
            function ( $scope,hbUtil,$timeout,  KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid,batchManageServices, $stateParams, $http, $q, HB_dialog, $state, HB_notification,TabService,hbSkuService) {

                $scope.model = {
                    queryParam: {
                        name:$stateParams.batchNo,
                        groupType: 'importGoodsToBatchList', //异步任务组名
                        startDate: null,
                        endDate: null,
                        status: "-1"
                    },
                    batchInfo:{

                    },
                    chooseQueryParam: {
                        commoditySkuState:1,
                        trainingSchemeEnabled :-1,
                        saleState       : -1,
                        categoryType :"TRAINING_CLASS_GOODS"
                    },
                    configedQueryParam: {
                        commoditySkuState:1,
                        saleState       : -1,
                        trainingSchemeEnabled :-1,
                        price           : '',
                        commodityName   : '',
                        minFirstUpTime  : '',
                        maxFirstUpTime  : '',
                        categoryType :"TRAINING_CLASS_GOODS"
                    },
                    chosePeoplePage:{
                        pageNo  : 1,
                        pageSize: 10
                    },
                    classPage: {
                        pageNo  : 1,
                        pageSize: 10
                    },
                    chooseClassPage: {
                        pageNo  : 1,
                        pageSize: 10
                    },
                    chooseClass: {
                        commoditySkuId: '',
                    },
                    choosePeopleParam: {
                        identify: '',
                        name:'',
                    },
                    batchParams: {
                        identify:'',
                        name:'',
                        skuId:'',
                        trainClassName:'',
                    },
                    createBatchInfo:{
                        no:$stateParams.batchNo,
                    },
                    page          : {
                        pageSize: 10,
                        pageNo  : 1
                    }
                };
                $scope.kendoPlus = {
                    importGridInstance  : null,
                    chosePeopleGridInstance  : null,
                    classGridInstance    : null,
                    choseClassGridInstance : null,
                    importBatchWindowOptions: {
                        modal    : true,
                        visible  : false,
                        resizable: false,
                        draggable: false,
                        title    : false,
                        open     : function () {
                            this.center ();
                        }
                    },
                    windowOptions    : {
                        modal    : true,
                        visible  : false,
                        resizable: false,
                        draggable: false,
                        title    : false,
                        open     : function () {
                            this.center ();
                        }
                    },
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
                    batchWindowOptions        : {
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
                    timeOptions          : {
                        culture: "zh-CN",
                        format : "yyyy-MM-dd HH:mm:00"
                        //min: new Date()
                    },
                    queryBeginTimeOptions     : {
                        culture: "zh-CN",
                        format : "yyyy-MM-dd HH:mm:00"
                    },
                    queryEndTimeOptions     : {
                        culture: "zh-CN",
                        format : "yyyy-MM-dd 23:59:59"
                    }

                };
                $scope.events={
                    commitOrder: function () {
                        batchManageServices.findUserBatchPage({
                            batchNo:$stateParams.batchNo,
                            batchType:$stateParams.test
                        }
                        ).then(function(data){
                            $scope.model.batchInfo = data.info[0];
                            if($scope.model.batchInfo.people===0){
                                HB_dialog.error('提示','空批次不能提交！');
                                return false;
                            }else{
                                $state.go('states.batchManage.batchOrder',{batchNo:$stateParams.batchNo},{reload:true})
                            }
                        })

                    },
                    addGoodsToBatchList:function(type){
                        if($scope.model.chooseClass.userId===''){
                            HB_dialog.error('提示','请选择学员');
                            return false;
                        }
                        if($scope.model.chooseClass.commoditySkuId===''){
                            HB_dialog.error('提示','请选择培训班');
                            return false;
                        }
                        if(type===1){
                            batchManageServices.addGoodsToBatchList({
                                batchNo:$scope.model.createBatchInfo.no,
                                userId:$scope.model.chooseClass.userId,
                                skuId:$scope.model.chooseClass.commoditySkuId
                            }).then(function(data){
                                if(data.fail===false){
                                    HB_dialog.success('提示','添加成功');
                                    $scope['handWindowOptions'].close ();
                                    $state.reload ( $state.current.name );
                                    $scope.model.chooseClass.userId='';
                                    $scope.model.chooseClass.commoditySkuId='';
                                }else{
                                    if(
                                        //data.code==='505'||
                                        //data.code==='30822'||
                                        data.code==='30824'){
                                        HB_dialog.error('提示','该学员对应培训班已处于待付款或已付款，无法添加！');
                                    }if(data.code==='309029'){
                                        if(hbUtil.validateIsNull(data.message)){
                                            HB_dialog.error('提示','添加失败');
                                        }else{
                                            HB_dialog.error('提示',data.message);
                                        }
                                    }else{
                                        HB_dialog.error('提示',data.message);
                                    }
                                }
                            })
                        }else{
                            batchManageServices.addGoodsToBatchList({
                                batchNo:$scope.model.createBatchInfo.no,
                                userId:$scope.model.chooseClass.userId,
                                skuId:$scope.model.chooseClass.commoditySkuId
                            }).then(function(data){
                                if(data.fail===false){
                                    HB_dialog.success('提示','添加成功');
                                    $scope.model.chooseClass.userId='';
                                    $scope.model.chooseClass.commoditySkuId='';
                                }else{
                                    if(
                                        //data.code==='505'||
                                        //data.code==='30822'||
                                        data.code==='30824'){
                                        HB_dialog.error('提示','该学员对应培训班已处于待付款或已付款，无法添加！');
                                    }if(data.code==='309029'){
                                        if(hbUtil.validateIsNull(data.message)){
                                            HB_dialog.error('提示','添加失败');
                                        }else{
                                            HB_dialog.error('提示',data.message);
                                        }

                                    }else{
                                        HB_dialog.error('提示',data.message);
                                    }
                                }
                            })
                        }

                    },
                    goClass:function(item){
                        TabService.appendNewTab ( '平台可报班级', 'states.goodsManager',true);
                        $scope['batchWindowOptions'].close ();
                    },
                    remove : function ( dataItem) {

                      $scope.globle.confirm ( '系统提醒', ' 移除后需重新添加，是否确认移除？', function () {
                        return batchManageServices.removeGoodsFromBatchList({id:dataItem.id}).then(function(data){
                            if(data.status){
                                HB_dialog.success('提示',data.info);
                                $scope.model.page.pageNo = 1;
                                $scope.node.createbatchGrid.pager.page ( 1 );
                                //e.preventDefault ();
                            }else{
                                HB_dialog.error('提示',data.info);
                                $scope.model.page.pageNo = 1;
                                $scope.node.createbatchGrid.pager.page ( 1 );
                            }
                        })
                      })
                    },
                    view: function (e, dataItem) {
                        if (dataItem.log.status == "executed") {
                            if (dataItem.log.result.success) {
                                if (dataItem.log.result.result.message) {
                                    $scope.globle.alert("提示", dataItem.log.result.result.message);
                                    return false;
                                } else if (dataItem.log.result.result.errorMessage) {
                                    $scope.globle.alert("提示", dataItem.log.result.result.errorMessage);
                                    return false;
                                } else {
                                    $scope.globle.alert("提示", "任务执行成功！");
                                    return false;
                                }
                            } else {
                                if(dataItem.log.result.message==null){
                                    $scope.globle.alert("提示", dataItem.log.result.result.errorMessage);
                                }else{
                                    $scope.globle.alert("提示", dataItem.log.result.message);
                                }
                                return false;
                            }

                        } else if (dataItem.log.status == "fail") {
                            $scope.globle.alert("提示", "异步任务的业务逻辑执行出错！" + dataItem.log.remark);
                            return false;
                        } else if (dataItem.log.status == "addedToScheduler") {
                            $scope.globle.alert("提示", "任务还未开始...");
                            return false;
                        } else if (dataItem.log.status == "toExecuted") {
                            $scope.globle.alert("提示", "任务正在执行...");
                            return false;
                        }
                    },
                    downloadLogExcel: function (e, dataItem,type) {
                        if(type==1){//导出正确数据文件
                            window.open($scope.urlPrefix + "/mfs"+ dataItem.log.result.result.resultUrl+'?download');
                        }else{//导出错误数据文件
                            window.open($scope.urlPrefix + "/mfs"+ dataItem.log.result.result.failUrl+'?download');
                        }
                    },
                    importOrder: function () {
                        if($scope.model.upload===undefined){
                            HB_dialog.error('提示','请选择文件');
                            return false
                        }else{
                            batchManageServices.importGoodsToBatchList({
                                filePath:$scope.model.upload.result.newPath,
                                batchNo:$stateParams.batchNo,
                            }).then(function(data){
                                if(data.status){
                                    HB_dialog.success('提示',data.info);
                                    $scope['batchWindowOptions'].close ();

                                }else{
                                    HB_dialog.error('提示',data.info);

                                }
                            });
                        }

                    },
                    openKendoWindow: function ( windowName ) {
                        $scope[windowName].center ().open ();
                    },

                    closeKendoWindow: function ( windowName ) {
                        $scope[windowName].close ();
                        $state.reload ( $state.current.name );
                    },
                    /**
                     * 查询
                     */
                    search: function ( e ) {
                        if ( validataIdcard ( $scope.model.batchParams.identify) ) {
                            //alert('身份证必须是大于4位的数字');
                            HB_dialog.warning ( '提示', '如果账号为数字，至少输入4位才能进行查询！' );
                            return false;
                        }
                        $scope.model.page.pageNo = 1;
                        $scope.node.createbatchGrid.pager.page ( 1 );
                        e.preventDefault ();
                    },
                    choseClass: function ( e, item ) {
                        $scope.model.batchParams.trainClassName = item.commodityName;
                        $scope.model.batchParams.skuId          = item.commoditySkuId;
                        $scope.events.closeKendoWindow ( 'classWindow' );
                    },
                    clearTextContent: function () {
                        $scope.model.batchParams.trainClassName = '';
                        $scope.model.batchParams.skuId          = '';
                    },
                    //培训班升序降序
                    setSortOrder: function ( sortOrder ) {
                        $scope.model.configedQueryParam.orderByCondition = 1;
                        $scope.model.configedQueryParam.sortOrder        = sortOrder;
                        $scope.kendoPlus['classGridInstance'].pager.page ( 1 );
                        $scope.kendoPlus['classGridInstance'].dataSource.read ();
                    },
                    MainPageQueryList: function ( e, gridName, pageName ) {
                        e.stopPropagation ();
                        if ( validataIdcard ( $scope.model.choosePeopleParam.IDNum) ) {
                            //alert('身份证必须是大于4位的数字');
                            HB_dialog.warning ( '提示', '如果账号为数字，至少输入4位才能进行查询！' );
                            return false;
                        }
                        $scope.model[pageName].pageNo = 1;
                        $scope.kendoPlus[gridName].pager.page ( 1 );
                    },
                }
                //已配置查看异步任务模板
                var importGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td title="#: name #">');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td  title="#: log.result.result.startDate #">');
                    result.push('#: log.status == "executed"&&log.result.result!={}&&log.result.result!=null ? log.result.result.startDate : "----" #');
                    result.push('</td>');

                    result.push('<td title="#: log.result.result.endDate #">');
                    result.push('#: log.status == "executed"&&log.result.result!={}&&log.result.result!=null  ? log.result.result.endDate : "----"#');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: ' +
                        '  log.status == "executed" ? "已执行" ' +
                        ': log.status == "fail" ? "执行失败" : log.status == "addedToScheduler" ? "未执行" : "正在执行" #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: log.result == null ? "未知" : log.result.success ==true ? "成功" : "失败" #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: log.result == null ? "未知" : log.result.result.rowSum != null ? log.result.result.rowSum : "未知" #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: log.result == null ? "未知" : log.result.result.rowSuccess != null ? log.result.result.rowSuccess : "未知" #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: log.result == null ? "未知" : log.result.result.rowFail != null ? log.result.result.rowFail : "未知" #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('<button type="button" class="table-btn"  ng-click="events.view($event,dataItem)" >查看日志</button>');
                    result.push('<button type="button"   class="table-btn"  ng-if="#: group==\'importGoodsToBatchList\' #" ng-click="events.downloadLogExcel($event,dataItem,2)" #: log.status ==\'executed\' && log.result &&log.result.success&&log.result.result.failUrl?\'\':\'disabled\'#>下载失败数据</button>');
                     result.push('</td>');

                    result.push('</tr>');
                    importGridRowTemplate = result.join ( '' );
                }) ();

                $scope.importGrid = {
                    options: hbUtil.kdGridCommonOption ( {
                        template: importGridRowTemplate,
                        scrollable : false,
                        url     : "/web/admin/asynJob/findAsyncTaskPage",
                        scope   : $scope,
                        page    : 'chooseClassPage',
                        param   : $scope.model.queryParam,
                        fn      : function ( response ) {
                            $scope.configedArr = response.info;
                        },
                        columns : [
                            {field: "name", title: "任务名称", sortable: false, width:200},
                            {field: "log.result.result.startDate", title: "任务处理时间", sortable: false, width: 120},
                            {field: "log.result.result.endDate", title: "任务结束时间", sortable: false, width: 120},
                            {field: "log.result.success", title: "任务执行状态", sortable: false, width: 100},
                            {field: "log.result.success", title: "任务处理结果", sortable: false, width: 100},
                            {field: "log.result.result.rowSum", title: "处理总条数", sortable: false, width: 100},
                            {field: "log.result.result.rowSuccess", title: "成功条数", sortable: false, width: 70},
                            {field: "log.result.result.rowFail", title: "失败条数", sortable: false, width: 70},
                            {
                                title: "操作", width: 250
                            }
                        ]
                    } )
                };




                //已配置选择班级模板
                var chooseClassGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td title="#: commodityName #">' );
                    result.push ( '#:commodityName#' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    //hbSkuService.kendoSkuDo(result);
                    result.push ( '<div ng-repeat="item in dataItem.skuPropertyNameList">');
                    result.push ( '<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>' );
                    result.push ( '<br />' );
                    result.push ( '</div>');
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: credit #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: price #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<button type="button" ng-if="model.chooseClass.commoditySkuId!==dataItem.commoditySkuId"  class="table-btn" ng-click="model.chooseClass.commoditySkuId=dataItem.commoditySkuId ">选择</button>' );
                    result.push ( '<button type="button" ng-if="model.chooseClass.commoditySkuId===dataItem.commoditySkuId" class="table-btn"  ng-click="model.chooseClass.commoditySkuId=\'\'">取消选择</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    chooseClassGridRowTemplate = result.join ( '' );
                }) ();
                $scope.choseClassGrid = {
                    options: hbUtil.kdGridCommonOption ( {
                        template: chooseClassGridRowTemplate,
                        scrollable : false,
                        outSidePage:true,
                        url     : "/web/admin/commodityManager/getConfigDone",
                        scope   : $scope,
                        page    : 'chooseClassPage',
                        param   : $scope.model.chooseQueryParam,
                        skuParam:'skuParamsChoose',
                        fn      : function ( response ) {
                            $scope.configedArr = response.info;
                        },
                        columns : [
                            { field: "commodityName", title: "培训班名称", width: 150 },
                            { field: "attr", title: "属性", sortable: false, width: 100 },
                            { field: "credit", title: "学时", sortable: false, width: 80 },
                            { field: "price", title: "价格", sortable: false, width: 80 },
                            {
                                title: "操作", width: 80
                            }
                        ]
                    } )
                };



                //已配置培训班模板
                var classGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td title="#: commodityName #">' );
                    result.push ( '#:commodityName#' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<div ng-repeat="item in dataItem.skuPropertyNameList">');
                    result.push ( '<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>' );
                    result.push ( '<br />' );
                    result.push ( '</div>');
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<span ng-if="#:commoditySkuState==1#">已上架</span>' + '<span ng-if="#:commoditySkuState==2#">待上架</span>' + '<span ng-if="#:commoditySkuState==3#">已下架</span>' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<span ng-if="#:saleState==1#">已售</span>' + '<span ng-if="#:saleState==2#">未售</span>' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: credit #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: price #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '首次上架时间：' );
                    result.push ( '<span ng-if="#: firstUpTime!==null #">#: firstUpTime #</span>' );
                    result.push ( '<span ng-if="#: firstUpTime==null #">-</span>' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<button type="button" class="table-btn" ng-click="events.choseClass($event,dataItem)">选择</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    classGridRowTemplate = result.join ( '' );
                }) ();

                $scope.classGrid = {
                    options: hbUtil.kdGridCommonOption ( {
                        template: classGridRowTemplate,
                        url     : "/web/admin/commodityManager/getConfigDone",
                        scope   : $scope,
                        page    : 'classPage',
                        param   : $scope.model.configedQueryParam,
                        skuParam:'skuParamsConfiged',
                        fn      : function ( response ) {
                            $scope.configedArr = response.info;
                        },
                        columns : [
                            { field: "commodityName", title: "班级名称", sortable: false },
                            { field: "attr", title: "属性", sortable: false, width: 230 },
                            { field: "commoditySkuState", title: "上架状态", sortable: false, width: 80 },
                            { field: "saleState", title: "是否出售", sortable: false, width: 80 },
                            { field: "credit", title: "学时", sortable: false, width: 80 },
                            { field: "price", title: "价格", sortable: false, width: 80 },
                            {
                                field         : "onSaleTime", title: "上架时间", sortable: false, width: 260,
                                headerTemplate: '上架时间<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder==0" ng-click="events.setSortOrder(1)" class="ico lwh-ico-up"></a>' +
                                '<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder!==0" ng-click="events.setSortOrder(0)" class="ico lwh-ico-down"></a>'
                            },
                            {
                                title: "操作", width: 80
                            }
                        ]
                    } )
                };

                //=============分页开始=======================
                var gridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<p>姓名：#: buyer.name #</p>' );
                    result.push ( '<p>身份证：#: buyer.uniqueData #</p>' );
                    result.push ( '</td>' );


                    result.push ( '<td>' );
                    result.push ( '<div  title="#: commodity.commodityName #">' );
                    result.push ( '#: commodity.commodityName #' );
                    result.push ( '</div>' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<div ng-if="dataItem.commodity" ng-repeat="item in dataItem.commodity.skuPropertyNameList">');
                    result.push ( '<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>' );
                    result.push ( '<br />' );
                    result.push ( '</div>');
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: commodity.credit #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#: commodity.price #' );
                    result.push ( '</td>' );


                    result.push ( '</td>' );
                    result.push ( '<td class="op">' );
                    result.push ( '<button type="button" class="table-btn" has-permission="batchManage/removeBatchList"  ng-click="events.remove(dataItem)">移除</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    gridRowTemplate = result.join ( '' );
                }) ();



                //已配置选择人员模板
                var choosePeopleGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );
                    result.push ( '<td>' );
                    result.push ( '<p>姓名：#:  name #</p>' );
                    result.push ( '<p>身份证：#: uniqueData #</p>' );
                    result.push ( '</td>' );


                    result.push ( '<td>' );
                    result.push ( '#: uniqueData #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<span ng-if="#: phoneNumber!== null && phoneNumber!==\'\' # ">#: phoneNumber #</span>' );
                    result.push ( '<span ng-if="#: phoneNumber== null||phoneNumber===\'\' # ">-</span>' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<span ng-if="#: email!==null && email!==\'\'# ">#: email #</span>' );
                    result.push ( '<span ng-if="#: email===null ||email===\'\'# ">-</span>' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<button type="button" ng-if="model.chooseClass.userId!==dataItem.userId"  class="table-btn" ng-click="model.chooseClass.userId=dataItem.userId ">选择</button>' );
                    result.push ( '<button type="button" ng-if="model.chooseClass.userId===dataItem.userId" class="table-btn"  ng-click="model.chooseClass.userId=\'\'">取消选择</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    choosePeopleGridRowTemplate = result.join ( '' );
                }) ();


                //如果创建的是测试缴费批次，查询学员时只能查询出测试人员，需要添加条件
                $scope.model.choosePeopleParam.loginInputType = $stateParams.test;

                $scope.chosePeopleGrid = {
                    options: hbUtil.kdGridCommonOption ( {
                        template: choosePeopleGridRowTemplate,
                        scrollable : false,
                        url     : "/web/admin/unitUserManage/getUserInfoPage",
                        scope   : $scope,
                        page    : 'chosePeoplePage',
                        param   : $scope.model.choosePeopleParam,
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
                            /*   { sortable: false, title: "单位名称", width: 200 },*/
                            { sortable: false, title: "手机号码", width: 200 },
                            { sortable: false, title: "电子邮箱"},
                            {
                                title: "操作",
                                width: 150
                            }
                        ]
                    } )
                };




                $scope.ui                  = {
                    createbatchGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template ( gridRowTemplate ),
                            scrollable : false,
                            noRecords  : {
                                template: '暂无数据'
                            },
                            dataSource : {
                                transport    : {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url        : "/web/admin/batchOrderAction/findBatchListPage/"+$scope.model.createBatchInfo.no,
                                        data       : function ( e ) {
                                            var temp = {}, params = $scope.model.batchParams;
                                            //temp.batchNo =$scope.model.createBatchInfo.no
                                            temp.pageNo   = e.page;
                                            temp.pageSize = $scope.model.page.pageSize;

                                            //转换时间
                                            /*   if ( params.createBeginDate ) {
                                             params.createBeginDate = params.createBeginDate.replace ( /-/g, '/' );
                                             }
                                             if ( params.createEndDate ) {
                                             params.createEndDate = params.createEndDate.replace ( /-/g, '/' );
                                             }

                                             for ( var key in params ) {
                                             if ( params.hasOwnProperty ( key ) ) {
                                             if ( params[key] ) {
                                             temp[key] = params[key];
                                             if ( key === 'createEndDate' ) {
                                             if ( params[key].indexOf ( "23:59:59" ) == -1 ) {
                                             temp[key] = $.trim ( params[key] ) + ' 23:59:59';
                                             }
                                             }
                                             }
                                             }
                                             }*/
                                            for ( var key in params ) {
                                                if ( params.hasOwnProperty ( key ) ) {
                                                    if ( params[key] ) {
                                                        temp[key] = params[key];
                                                        /*    if ( key === 'createEndDate' ) {
                                                         if ( params[key].indexOf ( "23:59:59" ) == -1 ) {
                                                         temp[key] = $.trim ( params[key] ) + ' 23:59:59';
                                                         }
                                                         }*/
                                                    }
                                                }
                                            }
                                            delete   temp.trainClassName;
                                            return temp;
                                        },
                                        dataType   : 'json'
                                    }

                                },
                                pageSize     : 10, // 每页显示的数据数目
                                schema       : {
                                    parse: function ( response ) {
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
                                        var data = $scope.model.userParams;
                                        // 重置跟分页相关的缓存参数
                                        /*if ( data.createBeginDate ) {
                                         data.createBeginDate = data.createBeginDate.replace ( /\//g, '-' );
                                         }
                                         if ( data.createEndDate ) {
                                         data.createEndDate = data.createEndDate.replace ( /\//g, '-' );
                                         }
                                         $scope.$apply ();*/

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
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns    : [
                                {
                                    title: "No",
                                    width: 50
                                },
                                { sortable: false, title: "学员信息", width: 250 },
                                { sortable: false, title: "培训班名称", width: 300 },
                                { sortable: false, title: "属性", width: 200 },
                                /*{ sortable: false, title: "下单结果", width: 200 },*/
                                { sortable: false, title: "学时", width: 150 },
                                { sortable: false, title: "价格（元）"},
                                {
                                    title: "操作",
                                    width: 200
                                }
                            ]
                        }
                    }
                };
                $scope.ui.createbatchGrid.options = _.merge ( {}, KENDO_UI_GRID, $scope.ui.createbatchGrid.options );

                //验证是否为空
                function validateIsNull( obj ) {
                    return (obj === '' || obj === undefined || obj === null);
                }

                //时间字符串转毫秒
                function parseTimeStrToLong( str ) {
                    return kendo.parseDate ( str ).getTime ();
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
                };
                batchManageServices.downloadTemplate().then(function (data) {
                    if (data.status) {
                        $scope.urlPrefix = data.info.downModelIP;
                    }
                });


            }]
    }
} );