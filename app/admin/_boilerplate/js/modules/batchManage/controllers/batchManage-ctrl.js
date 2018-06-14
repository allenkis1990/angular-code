define ( function () {
    'use strict';
    return {  indexCtrl:  ['$state','$scope','HB_dialog', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'batchManageServices','TabService',
        function ( $state,$scope,HB_dialog, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, batchManageServices,TabService ) {

            $scope.model = {
                userParams: {
                    batchNo:null,
                    batchState:'',
                    commitStartTime:'',
                    commitEndTime:'',
                    batchType:0
                },
                page          : {
                    pageSize: 10,
                    pageNo  : 1
                },
                resultPage    : {
                    pageSize: 10,
                    pageNo  : 1
                },
                invoiceQuery:{

                },
                batchNo:''
            };
            $scope.node = {
                //== index node
                unitbatchGrid: null,
                commitResultGrid    : null,

            };
            $scope.kendoPlus = {
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
                afterCopy: function (deliveryCompanyUrl) {
                    // 默认打开ems
                    window.open(deliveryCompanyUrl || 'http://www.ems.com.cn/');
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
                    open     : function () {
                        this.center ();
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
            $scope.create=false;
            $scope.events={
                backManage:function(){
                    $state.go('states.batchManage' ).then ( function () {
                        $scope.model.page.pageNo = 1;
                        $scope.node.unitbatchGrid.pager.page ( 1 );
                    });

                    //$state.reload('states.batchManage')
                },
                clearTextContent: function () {
                    $scope.model.orderQueryParam.trainClassName = '';
                    $scope.model.orderQueryParam.skuId          = '';
                },
                deleteBatch: function ( e,item ) {
                    $scope.globle.confirm ( '系统提醒', '是否确认删除，删除后该批次将需重新创建！？', function () {
                        return batchManageServices.deleteBatch({
                            batchNo:item.no
                        }).then(function(data){
                            if(data.status){
                                HB_dialog.success('提示',data.info);
                                $state.reload($state.current.name);
                                $scope.model.page.pageNo = 1;
                                $scope.node.unitbatchGrid.pager.page ( 1 );
                            }else{
                                HB_dialog.error('提示',data.info);
                            }
                        });

                    } )
                },
                view: function ( e,item ) {
                   $state.go('states.batchManage.batchDetail',{batchNo:item.no,from:1})
                },
                createBatch: function () {
                    $scope.create=true;
                    batchManageServices.createBatch().then(function(data){
                        if(data.status){
                            $state.go('states.batchManage.createBatch',{batchNo:data.info.no,from:1,test:0})
                            $scope.create=false;
                        }

                    });
                },
                createTestBatch : function( batchType ){
                    batchType = 1;
                    $scope.create=true;
                    batchManageServices.createTestBatch(batchType).then(function(data){
                        if(data.status){
                            $state.go('states.batchManage.createBatch',{batchNo:data.info.no,from:1,test:1})
                            $scope.create=false;
                        }
                    });
                },
                openKendoWindow: function ( windowName ) {
                    $scope[windowName].center ().open ();
                },

                closeKendoWindow: function ( windowName ) {
                    $scope[windowName].close ();
                },
                /**
                 * 查询
                 */
                search: function ( e ) {
                    $scope.model.page.pageNo = 1;
                    $scope.node.unitbatchGrid.pager.page ( 1 );
                    e.preventDefault ();
                },
                commitOrder: function ( item ) {
                    $state.go('states.batchManage.batchOrder',{batchNo:item.no})
                },
                closeOrder: function ( item ) {
                    HB_dialog.contentAs ( $scope, {
                        title : '关闭批次理由',
                        width : 550,
                        height:350,
                        templateUrl: '@systemUrl@/views/batchManage/reason.html',
                        cancel: function () {
                        },
                        sure: function ( dialog ) {
                            if($scope.model.reason===''||$scope.model.reason===undefined){
                                HB_dialog.error('提示','关闭批次理由不能为空');
                                return false;
                            }
                            return batchManageServices.closeBatch(item.no,{reason:$scope.model.reason}).then(function(data){
                                if(data.status){
                                    HB_dialog.success('提示',data.info);
                                    dialog.close(dialog.dialogIndex);
                                    $scope.model.page.pageNo = 1;
                                    $scope.node.unitbatchGrid.pager.page ( 1 );
                                }else{
                                    HB_dialog.error('提示',data.info);
                                    dialog.close(dialog.dialogIndex);
                                    $scope.model.page.pageNo = 1;
                                    $scope.node.unitbatchGrid.pager.page ( 1 );
                                }
                            });
                        }
                    } );

                },
                invoiceQuery: function ( item ) {
                    //console.log(item)
                    $scope.events.openKendoWindow('invoiceQueryclassWindow');
                    batchManageServices.findBatchDetail({batchNo:item.no}).then(function(data){
                        $scope.model.batchDetail=data.info;
                    });

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
                        result.push ( '<div style="width: 351px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" title="#: failReason #"> ');
                        result.push ( ' #: failReason # ' );
                        result.push ( '</div> ');
                        result.push ( '</td>' );

                        result.push ( '</tr>' );
                        gridRowTemplate1 = result.join ( '' );
                    }) ();
                    $scope.ui                  = {
                        commitResultGrid: {
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
                                                temp.pageSize = $scope.model.resultPage.pageSize;

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
                                            //var data = $scope.model.userParams;
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
                                        width: 20
                                    },
                                    { sortable: false, title: "学员信息", width: 100 },
                                    { sortable: false, title: "培训班信息", width:100 },
                                    { sortable: false, title: "处理结果", width: 50 },
                                    { sortable: false, title: "原因备注", width: 150 }
                                ]
                            }
                        }
                    };
                    $scope.ui.commitResultGrid.options = _.merge ( {}, KENDO_UI_GRID, $scope.ui.commitResultGrid.options );
                    batchManageServices.getCommitResult({batchNo:item.no}).then(function(data){
                        $scope.model.commitResult=data.info;
                    });

                },
                goPay: function ( item ) {
                    //console.log(item)
                    if(item.state==='addingOrder'){
                        return false;
                    }
                    $state.go('states.batchManage.goPay',{batchNo:item.no})
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
                result.push ( '#: no #' );
                result.push ( '</td>' );


                result.push ( '<td>' );
                result.push ( '<div  title="#: people #">' );
                result.push ( '#: people #' );
                result.push ( '</div>' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '<div  title="#: totalMoney #">' );
                result.push ( '#: totalMoney #' );
                result.push ( '</div>' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '<span ng-if="#: commitTime!==null #">#: commitTime #</span><span ng-if="#: commitTime===null #">-</span>' );
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


                result.push ( '</td>' );
                result.push ( '<td class="op">' );
                result.push ( '<button type="button" has-permission="batchManage/result" ng-if="#: state !== \'beginning\'#" class="table-btn" ng-click="events.result($event,dataItem)">下单结果</button>' );
                result.push ( '<button type="button" has-permission="batchManage/view" class="table-btn" ng-click="events.view($event,dataItem)">详情</button>' );
                result.push ( '<button type="button" has-permission="batchManage/delete" class="table-btn" ng-if="#: state === \'beginning\'#"  ng-click="events.deleteBatch($event,dataItem)">删除</button>' );
                result.push ( '<button type="button" has-permission="batchManage/commitOrder" class="table-btn" ng-if="#: state === \'beginning\'#"  ng-click="events.commitOrder(dataItem)"> 提交批次</button>' );
                result.push ( '<button type="button" has-permission="batchManage/goPay" style="color:grey;" ng-if="#: state === \'addingOrder\'#">去付款</button>' );
                result.push ( '<button type="button" has-permission="batchManage/goPay" class="table-btn" ng-if="#: state === \'commited\' ||state === \'paying\'#"  ng-click="events.goPay(dataItem)">去付款</button>' );
                result.push ( '<button type="button" has-permission="batchManage/closeOrder" class="table-btn" ng-if="#: state === \'addingOrder\' ||state === \'commited\' ||state === \'paying\'#"  ng-click="events.closeOrder(dataItem)">关闭批次</button>' );
                result.push ( '<button type="button" has-permission="batchManage/invoiceQuery" class="table-btn" ng-if="#: state === \'tradeSuccess\'#"  ng-click="events.invoiceQuery(dataItem)">发票配送查询</button>' );

                result.push ( '</td>' );

                result.push ( '</tr>' );
                gridRowTemplate = result.join ( '' );
            }) ();

            $scope.ui                  = {
                unitbatchGrid: {
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
                                    url        : "/web/admin/batchOrderAction/findUserBatchPage",
                                    data       : function ( e ) {
                                        var temp = {}, params = $scope.model.userParams;
                                        temp.pageNo   = e.page;
                                        temp.pageSize = $scope.model.page.pageSize;


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
                                width: 50
                            },
                            { sortable: false, title: "缴费批次号", width: 250 },
                            { sortable: false, title: "缴费人次", width: 200 },
                            { sortable: false, title: "实付金额（元）", width: 200 },
                            { sortable: false, title: "批次创建时间", width: 150 },
                            { sortable: false, title: "交易状态"},
                            {
                                title: "操作",
                                width: 300
                            }
                        ]
                    }
                },

            };
            $scope.ui.unitbatchGrid.options = _.merge ( {}, KENDO_UI_GRID, $scope.ui.unitbatchGrid.options );

            //验证是否为空
            function validateIsNull( obj ) {
                return (obj === '' || obj === undefined || obj === null);
            }

            //时间字符串转毫秒
            function parseTimeStrToLong( str ) {
                return kendo.parseDate ( str ).getTime ();
            }
        }]
    }
} );