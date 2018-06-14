define ( function ( invoiceInfo ) {
    "use strict";
    return {
        indexCtrl: ["$scope", 'kendo.grid', 'HB_dialog', '$timeout', '$state', 'unitAdminServices', function ( $scope, kendoGrid, HB_dialog, $timeout, $state, customerServices ) {
            $scope.kendoPlus    = {
                gridDelay: false
            };
            $scope.model.mark   = false;
            $scope.invoiceModel = {
                page           : {
                    pageSize: 10,
                    pageNo  : 1
                },
                billOrderSearch: {}
            };
            $scope.showTimeDate = false;
            $scope.$watch ( 'invoiceModel.billOrderSearch.isNeedBill', function () {
                    if($scope.invoiceModel.billOrderSearch.isNeedBill === "true" &&  $scope.invoiceModel.billOrderSearch.billing === "true"){
                        $scope.showTimeDate = true;
                    }else {
                        $scope.showTimeDate = false;
                        $scope.invoiceModel.billOrderSearch.billing = "";
                    }
            } );
            $scope.$watch ( 'invoiceModel.billOrderSearch.billing', function () {
                    if($scope.invoiceModel.billOrderSearch.isNeedBill === "true" &&  $scope.invoiceModel.billOrderSearch.billing === "true"){
                        $scope.showTimeDate = true;
                    }else {
                        $scope.showTimeDate = false;
                    }
            } );
            $scope.events       = {
                //查询
                MainPageQueryList: function ( e ) {
                    //e.preventDefault();
                    //e.stopPropagation();
                    $scope.model.page.pageNo = 1;
                    $scope.node.invoiceGrid.pager.page ( 1 );
                },
                goodsDialog      : function ( item ) {
                    $scope.invoiceModel.dialogHeight  = 120 + item.goods.length * 30;
                    $scope.invoiceModel.dialogContent = item.goods;
                    HB_dialog.contentAs ( $scope, {
                        title      : '班级信息',
                        width      : 600,
                        height     : $scope.invoiceModel.dialogHeight,
                        showCancel : false,
                        showCertain: false,
                        templateUrl: 'views/customer/invoiceInfo/dialogGoods.html'
                    } );
                }
            };
            $scope.$watch ( 'model.userId', function ( newVal ) {
                if ( newVal ) {
                    $scope.model.mark = false;
                    customerServices.doview ( $state.current.name );
                    $scope.invoiceModel.buyerIds = newVal;

                    if ( $scope.kendoPlus.gridDelay === false && $scope.model.classTab === 3 ) {
                        $scope.kendoPlus.gridDelay = true;
                    } else {
                        if ( $scope.model.classTab === 3 ) {
                            $scope.events.MainPageQueryList ();
                        }
                    }

                    //$timeout($scope.events.MainPageQueryList,500);
                    //$scope.events.MainPageQueryList()
                }
            } );
            $scope.node         = {
                invoiceGrid: null
            };
            var utils           = {
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
                }
            };
            //=============分页开始=======================
            var invoiceTemplate = '';
            (function () {
                var result = [];
                result.push ( '<tr>' );

                result.push ( '<td>' );
                result.push ( '#: index #' );
                result.push ( '</td>' );

                result.push ( '<td title="#: batchNo #">' );
                result.push ( '#: batchNo #' );
                result.push ( '</td>' );

                // result.push ( '<td>' );
                // result.push ( '<div ng-repeat="item in dataItem.goods" title="b{{item.productName}}">b{{item.productName}}</div>' );
                // //result.push ( '<span title="#: goods[0].productName #">#: goods[0].productName #</span>' + '<br>' + '<a style=\"color:blue\" href="javascript:void(0);" ng-click=\"events.goodsDialog(dataItem)\">' + '#: goods.length #' + '个培训班</a>' );
                // result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '#: money ==null? 0 : money #' );
                result.push ( '</td>' );

                result.push ( '<td title="#: buyer === null? \'/\' : buyer.name #-#: buyer === null? \'/\' :buyer.loginInput #">' );
                result.push ( '#: buyer == null || buyer.name === null || buyer.name === \'\' ? \'/\': buyer.name  #' + '<br/>账号：' + '#: buyer == null || buyer.loginInput === null || buyer.loginInput === \'\' ? \'/\': buyer.loginInput #' );
                result.push ( '</td>' );


                result.push ( '<td title="#: createTime === null || createTime === \'\'?\'/\': createTime  #">' );
                result.push ( '#: createTime === null || createTime === \'\'?\'/\': createTime  #' );
                result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '#: title === null || title === \'\'?\'/\': title #' );
                result.push ( '</td>' );

                result.push ( '<td title="#: importTime === null || importTime === \'\'?\'/\': importTime #">' );
                result.push ( '#: importTime === null || importTime === \'\'?\'/\': importTime #' );
                result.push ( '</td>' );

                result.push ( '<td title="#: billNo === null || billNo === \'\'?\'/\': billNo  #">' );
                result.push ( '#: billNo === null || billNo === \'\'?\'/\': billNo  #' );
                result.push ( '</td>' );

                // result.push ( '<td title="#:phone#">' );
                // result.push ( '#: electron ===true?phone :\'/\'#' );
                // result.push ( '</td>' );
                //
                // result.push ( '<td>' );
                // result.push ( '#: needBill === 0 ? \'否\' : \'是\' #' );
                // result.push ( '</td>' );

                result.push ( '<td>' );
                result.push ( '#: needBill === 0 ?\'/\': electronType  #' );
                result.push ( '</td>' );

                result.push ( '</tr>' );
                invoiceTemplate = result.join ( '' );
            }) ();
            $scope.ui = {
                datePicker : {
                    begin: {
                        options: {
                            culture: "zh-CN",
                            format : "yyyy-MM-dd",
                            change : utils.startChange
                        }
                    },
                    end  : {
                        options: {
                            culture: "zh-CN",
                            format : "yyyy-MM-dd",
                            change : utils.endChange
                        }
                    }
                },
                invoiceGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template ( invoiceTemplate ),
                        scrollable : true,
                        noRecords  : {
                            template: '暂无数据'
                        },
                        dataSource : {
                            transport    : {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url        : "/web/admin/billAction/findBatchBillOrderPageIncludeProductName",
                                    data       : function ( e ) {
                                        var temp = {
                                            query: {
                                                billOwners       : $scope.invoiceModel.buyerIds+'',
                                                needBill        : $scope.invoiceModel.billOrderSearch.isNeedBill,
                                                // makeStartTimeMills: '',
                                                // makeEndTimeMills  : '',
                                            },
                                            pageNo         : e.page,
                                            pageSize       : $scope.invoiceModel.page.pageSize
                                        };
                                        var counter = 86399999;
                                        if ($scope.invoiceModel.billOrderSearch.billingTimeStart) {
                                            temp.query.makeStartTimeMills = kendo.parseDate($scope.invoiceModel.billOrderSearch.billingTimeStart).getTime();
                                        }
                                        if ($scope.invoiceModel.billOrderSearch.billingTimeEnd) {
                                            temp.query.makeEndTimeMills = kendo.parseDate($scope.invoiceModel.billOrderSearch.billingTimeEnd).getTime() + counter;
                                        }

                                        if ( $scope.invoiceModel.billOrderSearch.isNeedBill !='false' && ($scope.invoiceModel.billOrderSearch.electron !== "" && $scope.invoiceModel.billOrderSearch.electron !== undefined)){
                                            temp.query.electron = $scope.invoiceModel.billOrderSearch.electron;
                                            temp.query.needBill = 1;
                                        }
                                        if ( temp.query.needBill === '' || !temp.query.needBill || temp.query.needBill === 'false' ) {
                                            if ( temp.query.needBill === '' || temp.query.needBill === undefined ) {
                                                temp.query.needBill = -1;
                                            } else {
                                                temp.query.needBill = 0
                                            }
                                            delete temp.query.makeStartTimeMills;
                                            delete temp.query.makeEndTimeMills;
                                        } else {
                                            temp.query.needBill = 1;
                                            if ( $scope.invoiceModel.billOrderSearch.billing !== "" ) {
                                                temp.query.made = $scope.invoiceModel.billOrderSearch.billing;
                                            }

                                        }
                                        if( temp.query.needBill == -1){
                                            delete temp.query.needBill;
                                        }else if ( temp.query.needBill == 0){
                                            temp.query.needBill = false;
                                        }else if ( temp.query.needBill == 1){
                                            temp.query.needBill = true;
                                        }
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

                                    $timeout ( function () {
                                        $scope.model.mark = true;
                                    } );

                                    // 将会把这个返回的数组绑定到数据源当中
                                    if ( response.status ) {
                                        $scope.model.mark = true;
                                        var dataview      = response.info, index = 1;
                                        angular.forEach ( dataview, function ( item ) {
                                            item.index = index++;
                                            if ( !item.phone ) {
                                                if ( item.email ) {
                                                    item.phone = item.email;
                                                } else {
                                                    item.phone = '/';
                                                }
                                            } else {
                                                if ( item.email ) {
                                                    item.phone = item.phone + '/' + item.email;
                                                } else {
                                                    item.phone = item.phone;
                                                }
                                            }
                                            ;
                                            if ( item.billNo !== null && item.billNo !== '' ) {
                                                if (item.billCode !== null && item.billCode !== ''){
                                                    item.billNo = item.billNo + '/' + item.billCode + '/' + item.billVeriCode;
                                                }else {
                                                    item.billNo = item.billNo + '/---/---' ;
                                                }
                                            };
                                            if (item.electron === true){
                                                item.electronType = "电子";
                                            }else {
                                                item.electronType = "纸质";
                                            }
                                        } );
                                    }
                                    return response;
                                },
                                total: function ( response ) {
                                    console.log(response.totalSize);
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
                            { sortable: false, field: "name", title: "报名批次号", width: 200 },
                            // { sortable: false, field: "typeName", title: "班级信息", width: 200 },
                            { sortable: false, field: "studyCount", title: "发票金额", width: 95 },
                            { title: "购买人信息", width: 210 },
                            { sortable: false, field: "result", title: "索取发票时间", width: 145 },
                            { sortable: false, field: "teacherName", title: "发票抬头", width: 200 },
                            { sortable: false, field: "result", title: "开票时间", width: 145 },
                            {
                                sortable      : false, width: 200,
                                field         : "result",
                                headerTemplate: '<span title="发票号/发票代码/验证码">发票号/发票代码/验证码</span>'
                            },
                            // { sortable: false, field: "typeName", title: "是否需要发票", width: 200 },
                            // {
                            //     sortable      : false, width: 200,
                            //     field         : "result",
                            //     headerTemplate: '<span title="发票接收手机号码/邮箱">发票接收手机号码/邮箱</span>'
                            // },
                            { sortable: false, field: "result", title: "发票类型", width: 145 },
                        ]
                    }
                }
            }
        }]
    }
} );