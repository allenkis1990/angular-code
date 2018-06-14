/**
 * Created by linj on 2017/7/11.
 */
define(function () {
    "use strict";
    return ['$http', 'hbBasicData', 'hbUtil', '$scope', 'HB_notification', '$q', 'kendo.grid','usualBatchManageService', 'HB_dialog', '$state',
        function ($http, hbBasicData, hbUtil, $scope, HB_notification,$q,kendoGrid ,usualBatchManageService, HB_dialog, $state) {
            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push ( '<tr>' );
                result.push ( '<td>' );
                result.push ( '#: index #' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '#: no #' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '#: people #' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '#: totalMoney #' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '#: commitTime?commitTime:"无" #' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '<a  ng-if="#: state === \'beginning\'#">待下单</a>' );
                result.push ( '<a  ng-if="#: state === \'addingOrder\'#">下单中</a>' );
                result.push ( '<a  ng-if="#: state === \'commited\'#">待付款</a>' );
                result.push ( '<a  ng-if="#: state === \'paying\'#">支付中</a>' );
                result.push ( '<a  ng-if="#: state === \'payFail\'#">支付失败</a>' );
                result.push ( '<a  ng-if="#: state === \'paySuccess\'#">支付成功</a>' );
                result.push ( '<a  ng-if="#: state === \'delivering\'#">开通中</a>' );
                result.push ( '<a  ng-if="#: state === \'deliverySuccess\'#">发货成功</a>' );
                result.push ( '<a  ng-if="#: state === \'tradeSuccess\'#">交易成功</a>' );
                result.push ( '<a  ng-if="#: state === \'tradeClose\'#">交易关闭</a>' );
                result.push ( '<a  ng-if="#: state === \'tradeClosing\'#">交易关闭中</a>' );
                result.push ( '</td>' );

                result.push ( '<td class="op">' );
                result.push ( '<button type="button" has-permission="usualBatchManage/findBatch" ng-if="#: state !== \'beginning\'#" class="table-btn" ng-click="events.result($event,dataItem)">下单结果</button>' );
                result.push ( '<button type="button" has-permission="usualBatchManage/findBatch" class="table-btn"  ng-click="events.view(\'#: no #\')">详情</button>' );
                result.push ( '<button type="button"  ng-if="#: state === \'addingOrder\' ||state === \'commited\' ||state === \'paying\'#" has-permission="usualBatchManage/closeBatch" class="table-btn" ng-click="events.preCloseBatch(\'#: no #\')">关闭批次</button>' );
                result.push ( '<button type="button"  ng-if="dataItem.state==\'tradeSuccess\'" has-permission="usualBatchManage/findBillBatch" class="table-btn" ng-click="events.findBill(\'#: no #\')">发票配送查询</button>' );
                result.push ( '</td>' );

                result.push ( '</tr>' );
                gridRowTemplate = result.join ( '' );
            }) ();
            //=============分页开始=======================
            var unitRowTemplate = '';
            (function () {
                var result = [];
                result.push ( '<tr>' );
                result.push ( '<td>' );
                result.push ( '#: index #' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '#: name #' );
                result.push ( '</td>' );

                result.push ( '<td class="op">' );
                result.push ( '<button type="button" ng-if="dataItem.unitId!=model.queryParam.unitId"  class="table-btn" ng-click="events.setUnitId($index,dataItem)">选择</button>' );
                result.push ( '<button type="button" ng-if="dataItem.unitId==model.queryParam.unitId"  class="table-btn" ng-click="events.clearUnitId()">取消选择</button>' );
                result.push ( '</td>' );

                result.push ( '</tr>' );
                unitRowTemplate = result.join ( '' );
            }) ();
            var utils={
                startChange: function () {
                    var startDate = $scope.node.workBeginTime.value (),
                        endDate   = $scope.node.workEndTime.value ();

                    if ( startDate ) {
                        startDate = new Date ( startDate );
                        startDate.setDate ( startDate.getDate () );
                        $scope.node.workEndTime.min ( startDate );
                    } else if ( endDate ) {
                        $scope.node.workBeginTime.max ( new Date ( endDate ) );
                    } else {
                        endDate = new Date ();
                        $scope.node.workBeginTime.max ( endDate );
                        $scope.node.workEndTime.min ( endDate );
                    }
                },
                endChange  : function () {
                    var endDate   = $scope.node.workEndTime.value (),
                        startDate = $scope.node.workBeginTime.value ();

                    if ( endDate ) {
                        endDate = new Date ( endDate );
                        endDate.setDate ( endDate.getDate () );
                        $scope.node.workBeginTime.max ( endDate );
                    } else if ( startDate ) {
                        $scope.node.workEndTime.min ( new Date ( startDate ) );
                    } else {
                        endDate = new Date ();
                        $scope.node.workBeginTime.max ( endDate );
                        $scope.node.workEndTime.min ( endDate );
                    }
                },
                transformState: function (data){
                    if(data.state){
                        switch (data.state){
                            case "beginning":
                                data.stateName="待下单";
                                break;
                            case "addingOrder":
                                data.stateName="下单中";
                                break;
                            case "commited":
                                data.stateName="待支付";
                                break;
                            case "paying":
                                data.stateName="支付中";
                                break;
                            case "paySuccess":
                                data.stateName="支付成功";
                                break;
                            case "payFail":
                                data.stateName="支付失败";
                                break;
                            case "delivering":
                                data.stateName="开通中";
                                break;
                            case "deliverySuccess":
                                data.stateName="发货成功";
                                break;
                            case "tradeSuccess":
                                data.stateName="交易成功";
                                break;
                            case "tradeClose":
                                data.stateName="交易关闭";
                                break;
                            case "tradeClosing":
                                data.stateName="交易关闭中";
                                break;
                        }
                    }else{
                        data.stateName="无";
                    }
                }
            };
            $scope.model = {
                queryParam: {
                    batchType:0
                },
                unitQuery:{},
                page:{
                    pageNo:1,
                    pageSize:10
                },
                showTotalMoney:false,
                batchStatic:{
                    normalCount:0,
                    totalAmount:0.0
                }
            };

            $scope.events = {
               /* view: function ( e,item ) {
                    $state.go('states.batchManage.batchDetail',{batchNo:item.no,from:1})
                },*/
                doSearchUnit:function(e){
                    $scope.node.unitGrid.pager.page ( 1 );
                    e.preventDefault ();
                },
                afterCopy: function (deliveryCompanyUrl) {
                    // 默认打开ems
                    window.open(deliveryCompanyUrl || 'http://www.ems.com.cn/');
                },
                search:function(e){
                    if($scope.model.queryParam.commitEndTime){
                            $scope.model.queryParam.commitEndTime +=  " 23:59:59"
                    }
                    $scope.node.batchGrid.pager.page ( 1 );

                    e.preventDefault ();
                },
                view:function(no){
                    $state.go ( 'states.usualBatchManage.view', { batchNo: no ,type:1} );
                },
                preCloseBatch:function(no){
                    $scope.model.closeBatchNo = no;
                    HB_dialog.contentAs ( $scope, {
                        templateUrl: '@systemUrl@/views/usualBatchManage/closeBatchReason.html',
                        width      : 800,
                        title      : '关闭批次单理由填写',
                        sure:function(wow){
                            var defer   = $q.defer (),
                                promise = defer.promise;
                            if(!$scope.model.closeReason){
                                HB_dialog.warning('提示',"请填写关闭原因");
                                return;
                            }
                            usualBatchManageService.closeBatch($scope.model.closeBatchNo,$scope.model.closeReason).then(function (data) {
                                    if(data.status){
                                        HB_dialog.success ( '提示', data.info );
                                        wow.close(wow.dialogIndex);
                                        $scope.node.batchGrid.dataSource.page ( $scope.model.page.pageNo );
                                    }else{
                                        HB_dialog.error('提示',data.info);
                                    }
                                });
                            return promise;
                        }
                    } );
                },
                findBill:function(no){
                    //console.log(item)
                    $scope.model.batchDetail = null;
                    $scope.events.openKendoWindow('invoiceQueryclassWindow');
                    usualBatchManageService.findBatchDetail({batchNo:no}).then(function(data){
                        $scope.model.batchDetail=data.info;
                    });
                },
                openKendoWindow: function ( windowName ) {
                    $scope[windowName].center ().open ();
                },
                closeKendoWindow: function ( windowName ) {
                    $scope[windowName].close ();
                },
                openUnitTree:function(){
                    HB_dialog.contentAs ( $scope, {
                        templateUrl: '@systemUrl@/views/usualBatchManage/unitDialog.html',
                        width      : 750,
                        height      : 520,
                        title      : '选择单位',
                        showCertain: false,
                        showCancel:false
                    } );
                },
                setUnitId:function(index,dataItem){
                    $scope.model.queryParam.unitId = dataItem.unitId;
                    $scope.model.unitName = dataItem.name;
                    HB_dialog.closeDialogByIndex($scope,index);
                },
                clearUnitId:function(){
                    delete $scope.model.queryParam.unitId;
                    delete $scope.model.unitName;
                },
                result: function ( e,item ) {
                    $scope.events.openKendoWindow('classWindow');
                    //=============结果分页1开始=======================
                    var gridRowTemplate1 = '';
                    (function () {
                        var result = [];
                        result.push ( '<tr>' );

                        result.push ( '<td>' );
                        result.push ( ' #: index #' );
                        result.push ( '</td>' );

                        result.push ( '<td>' );
                        result.push ( '<p> 姓名：#: buyer.name #</p> ' );
                        result.push ( '<p>身份证：#: buyer.uniqueData #</p>' );

                        result.push ( '</td>' );


                        result.push ( '<td>' );
                        result.push ( '<p>#: commodity.commodityName #</p>' );
                        result.push ( '<p>学科：#: commodity.trainingSubject #</p>' );
                        result.push ( '<p>专业：#: commodity.trainingProfession #</p>' );
                        result.push ( '<p>年度：#: commodity.trainingYear #</p>' );
                        result.push ( '</td>' );

                        result.push ( '<td>' );
                        result.push ( '<span ng-if="#: status===1 #">处理中</span>' );
                        result.push ( '<span ng-if="#: status===2 #">成功</span>' );
                        result.push ( '<span ng-if="#: status===3 #">失败</span>' );
                        result.push ( '</td>' );

                        result.push ( '<td>' );
                        result.push ( '<div title="#: failReason #"> ');
                        result.push ( '#: failReason #' );
                        result.push ( '</div> ');
                        result.push ( '</td>' );

                        result.push ( '</tr>' );
                        gridRowTemplate1 = result.join ( '' );
                    }) ();
                    $scope.ui.commitResultGrid               = {
                            options: {
                                // 每个行的模板定义,
                                rowTemplate: kendo.template ( gridRowTemplate1 ),
                                scrollable : false,
                                noRecords  : {
                                    template: '暂无数据'
                                },
                                dataSource : {
                                    transport    : {
                                        read: {
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            url        : "/web/admin/batchOrderAction/findBatchListPage/"+item.no,
                                            data       : function ( e ) {
                                                var temp = {}, params = {state:3};
                                                temp.pageNo   = e.page;
                                                temp.pageSize = e.pageSize;

                                                for ( var key in params ) {
                                                    if ( params.hasOwnProperty ( key ) ) {
                                                        if ( params[key] ) {
                                                            temp[key] = params[key];
                                                        }
                                                    }
                                                }
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
                                        width: 20
                                    },
                                    { sortable: false, title: "学员信息", width: 100 },
                                    { sortable: false, title: "培训班信息", width:100 },
                                    { sortable: false, title: "处理结果", width: 50 },
                                    { sortable: false, title: "原因备注", width: 150 },
                                ]
                            }
                        };
                    $scope.ui.commitResultGrid.options = _.merge ( {}, kendoGrid, $scope.ui.commitResultGrid.options );
                    usualBatchManageService.getCommitResult({batchNo:item.no}).then(function(data){
                        $scope.model.commitResult=data.info;
                    });

                }
            }

            $scope.ui = {
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
                tree:{
                    options:{

                    }
                },
                datePicker: {
                    begin   : {
                        options: {
                            culture: "zh-CN",
                            format : "yyyy-MM-dd",
                            change : utils.startChange
                        }
                    },
                    end     : {
                        options: {
                            culture: "zh-CN",
                            format : "yyyy-MM-dd",
                            change : utils.endChange
                        }
                    },
                },
                invoiceQuerywindowOptions : {
                    modal    : true,
                    visible  : false,
                    resizable: false,
                    draggable: false,
                    title    : false,
                    open     : function () {
                        this.center ();
                    }
                },
                batchGrid: {
                    options:{
                        // 每个行的模板定义,
                        rowTemplate: kendo.template ( gridRowTemplate ),
                        scrollable : false,
                        noRecords  : {
                            template: '暂无数据'
                        },dataSource : {
                            transport    : {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url        : "/web/admin/batchOrderAction/findBatchPage",
                                    data       : function ( e ) {
                                        var temp = {}, params = $scope.model.queryParam;
                                        for ( var key in params ) {
                                            if ( params.hasOwnProperty ( key ) ) {
                                                if ( params[key] ) {
                                                    temp[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.pageNo   = e.page;
                                        $scope.model.page.pageNo = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;
                                        if(temp.batchState==='tradeSuccess'){
                                            $scope.model.showTotalMoney=true;
                                        }else{
                                            $scope.model.showTotalMoney=false;
                                        }
                                        usualBatchManageService.getBatchStatistic(temp).then(function (data) {
                                            if(data.status){
                                                $scope.model.batchStatic = data.info;
                                            }else{
                                                HB_dialog.error('提示',data.info);
                                            }
                                        });
                                        return temp;
                                    },
                                    dataType   : 'json'
                                }
                            },
                            pageSize     : 10, // 每页显示的数据数目
                            schema       : {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function ( response ) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    return response;
                                },
                                total: function ( response ) {
                                    return response.totalSize;
                                },
                                data : function ( response ) {
                                    angular.forEach(response.info, function (item, index) {
                                        item.index=index+1;
                                        item.id=item.no;
                                        utils.transformState(item);
                                    });

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
                            pageSizes: [5,10,30,50],
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
                            { sortable: false, field: "index", title: "No." ,width: 70},
                            { sortable: false, field: "no", title: "缴费批次号" },
                            { sortable: false, field: "people", title: "缴费人次", width: 120 },
                            { sortable: false, field: "totalMoney", title: "实付金额（元）", width: 120 },
                            { sortable: false, field: "commitTime", title: "批次提交时间", width: 150 },
                            { sortable: false, field: "stateName", title: "交易状态", width: 120 },
                            {
                                title: "操作", width: 270
                            }
                        ]
                    }
                },
                unitGrid: {
                    options:{
                        // 每个行的模板定义,
                        rowTemplate: kendo.template ( unitRowTemplate ),
                        scrollable : false,
                        noRecords  : {
                            template: '暂无数据'
                        },dataSource : {
                            transport    : {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url        : "/web/admin/unitAdminCustom/findUnitPage",
                                    data       : function ( e ) {
                                        var temp={page:{},queryParam:{}}, params = $scope.model.unitQuery;
                                        for ( var key in params ) {
                                            if ( params.hasOwnProperty ( key ) ) {
                                                if ( params[key] ) {
                                                    temp.queryParam[key] = params[key];
                                                }
                                            }
                                        }
                                        temp.page.pageNo   = e.page;
                                        temp.page.pageSize = e.pageSize;
                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;
                                        return temp;
                                    },
                                    dataType   : 'json'
                                }
                            },
                            pageSize     : 10, // 每页显示的数据数目
                            schema       : {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function ( response ) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {

                                        //options.fn && options.fn(response);
                                        //$scope.gridArr = response.info;
                                        /*angular.forEach(response.info,function(item){
                                         item.haveVip=false;
                                         });
                                         */
                                        var viewData = response.info,
                                            i = 1,
                                            j = 0;
                                        _.forEach(viewData, function (row) {
                                            row.index = i++;
                                            row.itemNo = j++;
                                        });
                                        return response;
                                    } else {
                                        //HB_notification.error('提示', response.info);
                                        //$scope.global.alert('错误', '考试数据加载失败！');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                    return response;
                                },
                                total: function ( response ) {
                                    return response.totalSize;
                                },
                                data : function ( response ) {
                                    //if(response.status){
                                    //    angular.forEach(response.info, function (item, index) {
                                    //        item.index=index+1;
                                    //    });
                                    //}else{
                                    //    HB_dialog.error('提示',response.info);
                                    //}


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
                            pageSizes: [5,10,30,50],
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
                            { sortable: false, field: "index", title: "No." ,width: 70},
                            { sortable: false, field: "name", title: "单位名称" },
                            {
                                title: "操作", width: 100
                            }
                        ]
                    }
                }
            };


        }]
});