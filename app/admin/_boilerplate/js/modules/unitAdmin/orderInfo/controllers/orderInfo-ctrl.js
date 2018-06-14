define ( function ( orderInfo ) {
    "use strict";
    return {
        indexCtrl: ["$scope", 'hbUtil', 'HB_dialog', 'TabService', '$http', '$timeout', '$rootScope', '$state','$q','kendo.grid', 'unitAdminServices', 'HB_notification',
            function ( $scope, hbUtil, HB_dialog, TabService, $http, $timeout, $rootScope, $state,$q,kendoGrid , customerServices, HB_notification ) {

                $scope.model.mark = false;

                $scope.$watch ( 'model.userId', function ( newVal ) {
                    if ( newVal ) {
                        $scope.model.mark = false;
                        customerServices.doview ( $state.current.name );
                        $scope.orderQueryParam.buyerId = newVal;
                        if ( $scope.kendoPlus.gridDelay === false && $scope.model.classTab === 0 ) {
                            $scope.kendoPlus.gridDelay = true;
                            //$scope.model.mark=true;
                        } else {
                            if ( $scope.model.classTab === 0 ) {
                                $scope.events.MainPageQueryList ();
                            }

                        }
                    }
                    console.log ( newVal );
                } );

                $scope.kendoPlus = {
                    orderGridInstance: null,
                    timeModel        : null,
                    timeOptions      : {
                        culture: "zh-CN",
                        format : "yyyy-MM-dd"
                        //format : "yyyy-MM-dd HH:mm:00"
                        //min: new Date()
                    },

                    gridDelay: false
                };

                $scope.orderQueryParam = {
                    orderNo            : '',
                    orderStatus        : 'ALL',
                    tradeStartTimeMills: '',
                    tradeEndTimeMills  : '',
                    pageNo             : 1,
                    pageSize           : 10,
                    buyerId            : '',
                    orderStatusText    : '订单创建时间'
                };

                $scope.events = {
                    findBill:function(no){
                        //console.log(item)
                        $scope.events.openKendoWindow('invoiceQueryclassWindow');
                        customerServices.findBatchDetail({batchNo:no}).then(function(data){
                            $scope.model.batchDetail=data.info;
                        });
                    },
                    MainPageQueryList: function ( e ) {
                        //e.stopPropagation();
                        $scope.orderQueryParam.pageNo = 1;
                        $scope.kendoPlus.orderGridInstance.pager.page ( 1 );
                    },

                    toggleOrderStatus: function ( e ) {
                        if ( e.target.checked === true ) {
                            $scope.orderQueryParam.userSwap = true;
                        } else {
                            $scope.orderQueryParam.userSwap = false;
                        }
                    },
                    openKendoWindow: function ( windowName ) {
                        $scope[windowName].center ().open ();
                    },
                    closeKendoWindow: function ( windowName ) {
                        $scope[windowName].close ();
                    },
                    queryDetailClass: function ( e, item ) {
                        console.log ( 1 );
                        $scope.temporaryClassList = item.subOrderList;
                        HB_dialog.contentAs ( $scope, {
                            templateUrl: 'views/openRecord/queryDetailClassTpl.html',
                            width      : 800,
                            title      : '培训班',
                            showCertain: false
                        } );
                    },
                    closeBatch:function(no){
                        $scope.model.closeBatchNo = no;
                        HB_dialog.contentAs ( $scope, {
                            templateUrl: 'views/usualBatchManage/closeBatchReason.html',
                            width      : 800,
                            title      : '关闭批次单理由填写',
                            sure:function(wow){
                                var defer   = $q.defer (),
                                    promise = defer.promise;
                                if(!$scope.model.closeReason){
                                    HB_dialog.warning('提示',"请填写关闭原因");
                                    return;
                                }
                                customerServices.closeBatch($scope.model.closeBatchNo,$scope.model.closeReason).then(function (data) {
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
                        customerServices.getCommitResult({batchNo:item.no}).then(function(data){
                            $scope.model.commitResult=data.info;
                        });

                    },
                    view: function ( no ) {
                        TabService.appendNewTab ( '缴费批次管理', 'states.usualBatchManage.view', {
                            batchNo: no,
                            type   : 2
                        }, 'states.usualBatchManage',true );
                        //$state.go('states.orderManage.orderDetail',{orderNo:item.orderNo});
                    },


                    changeOrderTimeText: function () {
                        switch ( $scope.orderQueryParam.orderStatus ) {
                            case 'ALL':
                                $scope.orderQueryParam.orderStatusText = '订单创建时间';
                                break;

                            case 'WAIT_FOR_PAYMENT':
                                $scope.orderQueryParam.orderStatusText = '订单创建时间';
                                break;

                            case 'PAYING':
                                $scope.orderQueryParam.orderStatusText = '订单创建时间';
                                break;

                            case 'OPENING':
                                $scope.orderQueryParam.orderStatusText = '付款成功时间';
                                break;

                            case 'TRADE_SUCCESS':
                                $scope.orderQueryParam.orderStatusText = '交易成功时间';
                                break;

                            case 'TRADE_CLOSE':
                                $scope.orderQueryParam.orderStatusText = '交易关闭时间';
                                break;
                        }

                    }
                };

                //订单模板
                var orderTemplate = '';
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
                    result.push ( '<button type="button" has-permission="unitAdmin/findBatchResult" ng-if="#: state !== \'beginning\'#" class="table-btn" ng-click="events.result($event,dataItem)">查看下单结果</button>' );
                    result.push ( '<button type="button" has-permission="unitAdmin/detail" class="table-btn"  ng-click="events.view(\'#: no #\')">详情</button>' );
                    result.push ( '<button type="button" ng-if="dataItem.state==\'paying\'" has-permission="unitAdmin/closeBatch" class="table-btn" ng-click="events.closeBatch(\'#: no #\')">关闭订单</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    orderTemplate = result.join ( '' );
                }) ();

                $scope.orderGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template ( orderTemplate ),
                        scrollable : true,
                        noRecords  : {
                            template: '暂无数据'
                        },
                        dataSource : {
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
                                        if(temp.commitEndTime){
                                            temp.commitEndTime +=  " 23:59:59"
                                        }
                                        temp.buyerId = $scope.model.userId;
                                        temp.pageNo   = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;
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
                                    return response;
                                },
                                total: function ( response ) {
                                    return response.totalSize;
                                },
                                data : function ( response ) {
                                    $timeout ( function () {
                                        $scope.model.mark = true;
                                    } );
                                    if(response.status){

                                        $scope.model.mark = true;
                                        angular.forEach(response.info, function (item, index) {
                                            item.index=index+1;
                                            item.id=item.no;
                                            transformState(item);
                                        });
                                    }


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
                            hbUtil.kendo.grid.nullDataDealLeaf ( e );
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
                            { sortable: false, field: "index", title: "No." ,width: 70},
                            { sortable: false, field: "no", title: "缴费批次号" },
                            { sortable: false, field: "people", title: "缴费人次", width: 120 },
                            { sortable: false, field: "totalMoney", title: "实付金额（元）", width: 120 },
                            { sortable: false, field: "commitTime", title: "批次提交时间", width: 150 },
                            { sortable: false, field: "stateName", title: "交易状态", width: 120 },
                            {
                                title: "操作", width: 200
                            }
                        ]
                    }
                }

                $scope.ui={
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
                };

                //验证是否为空
                function validateIsNull( obj ) {
                    return (obj === '' || obj === undefined || obj === null);
                }

                //时间字符串转毫秒
                function parseTimeStrToLong( str ) {
                    return kendo.parseDate ( str ).getTime ();
                }

                function transformState(data){
                    if(data.state){
                        switch (data.state){
                            case "beginning":
                                data.stateName="初始化";
                                break;
                            case "addingOrder":
                                data.stateName="下单中";
                                break;
                            case "commited":
                                data.stateName="已提交";
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


                        }
                    }else{
                        data.stateName="无";
                    }
                }

            }]
    }
} );