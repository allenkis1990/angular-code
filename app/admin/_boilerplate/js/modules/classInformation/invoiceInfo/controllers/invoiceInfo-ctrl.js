define(function (invoiceInfo) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'kendo.grid', 'HB_dialog', '$timeout', '$state', 'classInformationServices', 'hbUtil',
            function ($scope, kendoGrid, HB_dialog, $timeout, $state, classInformationServices, hbUtil) {
                $scope.model.mark = false;

                $scope.$watch('model.userId', function (newVal) {
                    if (newVal) {
                        $scope.model.mark = false;
                        classInformationServices.doview($state.current.name);
                        $scope.invoiceModel.buyerIds = newVal;

                        if ($scope.kendoPlus.gridDelay === false && $scope.model.classTab === 3) {
                            $scope.kendoPlus.gridDelay = true;
                        } else {
                            if ($scope.model.classTab === 3) {
                                $scope.events.MainPageQueryList();
                            }
                        }

                    }
                });

                $scope.kendoPlus = {
                    gridDelay: false
                };


                $scope.invoiceModel = {
                    isInit: true,//是否是首次初始化
                    invoiceShowNum: 0,
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    },
                    billOrderQueryParams: {//纸质发票（普通）
                        orderNo: '',//订单号
                        deliverType: '',//配送方式
                        needInvoice: true,
                        electron: false,
                        paperInvoiceType: 1
                    }
                };


                $scope.events = {
                    //查询
                    MainPageQueryList: function (e) {
                        $scope.invoiceModel.page.pageNo = 1;
                        $scope.node.commonInvoiceGrid.pager.page(1);
                    },
                    switchTable: function (type) {

                        if (type != $scope.invoiceModel.invoiceShowNum) {
                            $scope.invoiceModel.invoiceShowNum = type;
                        }

                        if (type === -1) {//查询不需要发票的订单
                            $scope.invoiceModel.billOrderQueryParams.needInvoice = false;
                        } else {
                            $scope.invoiceModel.billOrderQueryParams.needInvoice = true;
                        }

                        if (type === 1) {//普通电子发票
                            $scope.invoiceModel.billOrderQueryParams.electron = true;
                        } else {
                            $scope.invoiceModel.billOrderQueryParams.electron = false;
                        }

                        if (type === 0) {//增值税普通发票
                            $scope.invoiceModel.billOrderQueryParams.paperInvoiceType = 1;
                        } else if (type === 2) {//增值税专用发票
                            $scope.invoiceModel.billOrderQueryParams.paperInvoiceType = 2;
                        } else if (type === 3) {//非税务发票
                            $scope.invoiceModel.billOrderQueryParams.paperInvoiceType = 3;
                        } else {//其它
                            $scope.invoiceModel.billOrderQueryParams.paperInvoiceType = -1;
                        }


                        $scope.events.tableColumnsOperate(type);

                        //清空查询条件，重新加载表格
                        $scope.invoiceModel.billOrderQueryParams.orderNo = '';
                        $scope.invoiceModel.billOrderQueryParams.deliverType = '';
                        $scope.node.commonInvoiceGrid.dataSource.page(1);//刷新表格
                    },
                    hideAllColumns: function () {
                        $scope.node.commonInvoiceGrid.hideColumn(0);
                        $scope.node.commonInvoiceGrid.hideColumn(1);
                        $scope.node.commonInvoiceGrid.hideColumn(2);
                        $scope.node.commonInvoiceGrid.hideColumn(3);
                        $scope.node.commonInvoiceGrid.hideColumn(4);
                        $scope.node.commonInvoiceGrid.hideColumn(5);
                        $scope.node.commonInvoiceGrid.hideColumn(6);
                        $scope.node.commonInvoiceGrid.hideColumn(7);
                        $scope.node.commonInvoiceGrid.hideColumn(8);
                        $scope.node.commonInvoiceGrid.hideColumn(9);
                        $scope.node.commonInvoiceGrid.hideColumn(10);
                        $scope.node.commonInvoiceGrid.hideColumn(11);
                        $scope.node.commonInvoiceGrid.hideColumn(12);
                        $scope.node.commonInvoiceGrid.hideColumn(13);
                        $scope.node.commonInvoiceGrid.hideColumn(14);
                    },
                    tableColumnsOperate: function (type) {
                        $scope.events.hideAllColumns();
                        if (type == 0) {//增值税普通发票
                            $scope.node.commonInvoiceGrid.showColumn(0);
                            $scope.node.commonInvoiceGrid.showColumn(1);
                            $scope.node.commonInvoiceGrid.showColumn(2);
                            $scope.node.commonInvoiceGrid.showColumn(3);
                            $scope.node.commonInvoiceGrid.showColumn(4);

                            $scope.node.commonInvoiceGrid.showColumn(6);
                            $scope.node.commonInvoiceGrid.showColumn(7);
                            $scope.node.commonInvoiceGrid.showColumn(8);
                            $scope.node.commonInvoiceGrid.showColumn(9);

                            $scope.node.commonInvoiceGrid.showColumn(11);
                            $scope.node.commonInvoiceGrid.showColumn(12);
                            $scope.node.commonInvoiceGrid.showColumn(13);

                        } else if (type == 1) {//普通电子发票
                            $scope.node.commonInvoiceGrid.showColumn(0);
                            $scope.node.commonInvoiceGrid.showColumn(1);
                            $scope.node.commonInvoiceGrid.showColumn(2);
                            $scope.node.commonInvoiceGrid.showColumn(3);
                            $scope.node.commonInvoiceGrid.showColumn(4);
                            $scope.node.commonInvoiceGrid.showColumn(5);

                            $scope.node.commonInvoiceGrid.showColumn(7);
                            $scope.node.commonInvoiceGrid.showColumn(8);
                            $scope.node.commonInvoiceGrid.showColumn(9);
                            $scope.node.commonInvoiceGrid.showColumn(10);

                            $scope.node.commonInvoiceGrid.showColumn(12);
                            $scope.node.commonInvoiceGrid.showColumn(13);
                            $scope.node.commonInvoiceGrid.showColumn(14);
                        } else if (type == 2) {//增值税专用发票
                            $scope.node.commonInvoiceGrid.showColumn(0);
                            $scope.node.commonInvoiceGrid.showColumn(1);
                            $scope.node.commonInvoiceGrid.showColumn(2);
                            $scope.node.commonInvoiceGrid.showColumn(3);
                            $scope.node.commonInvoiceGrid.showColumn(4);

                            $scope.node.commonInvoiceGrid.showColumn(6);
                            $scope.node.commonInvoiceGrid.showColumn(7);

                            $scope.node.commonInvoiceGrid.showColumn(12);
                            $scope.node.commonInvoiceGrid.showColumn(13);
                            $scope.node.commonInvoiceGrid.showColumn(14);
                        } else if (type == 3) {//非税务发票
                            $scope.node.commonInvoiceGrid.showColumn(0);
                            $scope.node.commonInvoiceGrid.showColumn(1);
                            $scope.node.commonInvoiceGrid.showColumn(2);
                            $scope.node.commonInvoiceGrid.showColumn(3);
                            $scope.node.commonInvoiceGrid.showColumn(4);

                            $scope.node.commonInvoiceGrid.showColumn(6);
                            $scope.node.commonInvoiceGrid.showColumn(7);
                            $scope.node.commonInvoiceGrid.showColumn(8);
                            //$scope.node.commonInvoiceGrid.showColumn(9);

                            $scope.node.commonInvoiceGrid.showColumn(11);
                            $scope.node.commonInvoiceGrid.showColumn(12);
                            $scope.node.commonInvoiceGrid.showColumn(13);
                        } else if (type == -1) {//不开发票
                            $scope.node.commonInvoiceGrid.showColumn(0);
                            $scope.node.commonInvoiceGrid.showColumn(1);
                            $scope.node.commonInvoiceGrid.showColumn(2);
                            $scope.node.commonInvoiceGrid.showColumn(3);

                            $scope.node.commonInvoiceGrid.showColumn(6);
                            $scope.node.commonInvoiceGrid.showColumn(7);
                            $scope.node.commonInvoiceGrid.showColumn(8);
                            $scope.node.commonInvoiceGrid.showColumn(9);

                            $scope.node.commonInvoiceGrid.showColumn(11);
                            $scope.node.commonInvoiceGrid.showColumn(12);
                            $scope.node.commonInvoiceGrid.showColumn(13);
                        }
                    }

                };

                $scope.node = {
                    commonInvoiceGrid: null
                };


                //=============普通纸质发票分页开始=======================
                var commonPaperGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: orderNo #">');
                    result.push('#: orderNo #');
                    //result.push('#: orderNo #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="dataItem.refundStatus===0">-</span>');
                    result.push('<span ng-if="dataItem.refundStatus===1">退款审批中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===2">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===3">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===4">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===5">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===6">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===7">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===8">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===9">已取消</span>');
                    result.push('<span ng-if="dataItem.refundStatus===10">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===11">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===12">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===13">已取消</span>');
                    result.push('</td>');

                    //付款金额
                    result.push('<td>');
                    result.push('#: orderMoney #');
                    result.push('</td>');

                    //开票金额
                    result.push('<td ng-hide="invoiceModel.invoiceShowNum === -1">');//不开发票没有开票金额
                    result.push('#: money #');
                    result.push('</td>');

                    //税额
                    result.push('<td ng-show="invoiceModel.invoiceShowNum === 1">');//只有电子票才显示 税额
                    result.push('#: tax === null ? \'-\' : tax #');
                    result.push('</td>');

                    result.push('<td ng-hide="invoiceModel.invoiceShowNum === 1">');//电子票不显示配送方式
                    result.push('#: deliverType == "1" ? "邮寄" : deliverType == "2"  ? "自取" :  \'-\'#');
                    result.push('</td>');

                    result.push('<td title="#:buyerName#-#:iD#">');
                    result.push('#: buyerName === null || buyerName === \'\' ? \'/\': buyerName  #' + '<br/>账号：' + '#: iD === null || iD === \'\' ? \'/\': iD #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push('<td title="#:billTitle#" ng-hide="invoiceModel.invoiceShowNum === 2">');//增值税专用发票不显示发票抬头
                    result.push('#: titleType == "1" ? "[个人]" : titleType == "2" ? "[单位]" : \'/\' #');
                    result.push('#: billTitle === null || billTitle === \'\' ? \'/\': billTitle  #');
                    result.push('</td>');

                    result.push('<td title="#: taxpayerNo #" ng-hide="invoiceModel.invoiceShowNum === 2 || invoiceModel.invoiceShowNum === 3">');//增值税专用发票 和 非税务发票 不显示纳税人识别码
                    result.push('#: titleType == "1" ?  \'/\' :  taxpayerNo===\'\' ||taxpayerNo===null?\'/\':taxpayerNo  #');
                    result.push('</td>');

                    result.push('<td ng-show="invoiceModel.invoiceShowNum === 1">');//只有电子票才显示 发票代码
                    result.push('#: billCode === null || billCode === \'\' ? \'/\': billCode  #');
                    result.push('</td>');

                    result.push('<td ng-show="invoiceModel.invoiceShowNum === 0 || invoiceModel.invoiceShowNum === -1 || invoiceModel.invoiceShowNum === 3">');//只有 增值税普通发票 和 不开发票 非税务发票  才显示 开票时间
                    result.push('#: billingTime === null || billingTime === \'\' ? \'/\': billingTimeOne  #' + '<br/>' + '#: billingTime === null || billingTime === \'\' ? \'\': billingTimeTwo  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billNo === null || billNo === \'\' ?\'/\': billNo  #');
                    result.push('</td>');

                    result.push('<td ng-show="invoiceModel.invoiceShowNum === 1 || invoiceModel.invoiceShowNum === 2">');//只有 普通电子票 和 增值税专用发票 才显示 发票状态
                    result.push('<span ng-if="dataItem.invoiceState==1">待开票</span>');
                    result.push('<span ng-if="dataItem.invoiceState==2">开票中</span>');
                    result.push('<span ng-if="dataItem.invoiceState==3">开票成功</span>');
                    result.push('<span ng-if="dataItem.invoiceState==4">开票失败</span>');
                    result.push('</td>');

                    result.push('</tr>');
                    commonPaperGridRowTemplate = result.join('');
                })();


                $scope.ui = {
                    commonInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(commonPaperGridRowTemplate),
                            scrollable: true,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/billAction/findBillInfoByBuyer',
                                        data: function (e) {
                                            var temp = {
                                                billInfoQueryParam: {
                                                    buyerId: $scope.invoiceModel.buyerIds,
                                                    orderNo: $scope.invoiceModel.billOrderQueryParams.orderNo,//订单号
                                                    deliverType: $scope.invoiceModel.billOrderQueryParams.deliverType,//配送方式

                                                    needInvoice: $scope.invoiceModel.billOrderQueryParams.needInvoice,
                                                    electron: $scope.invoiceModel.billOrderQueryParams.electron,
                                                    paperInvoiceType: $scope.invoiceModel.billOrderQueryParams.paperInvoiceType
                                                },
                                                pageNo: e.page,
                                                pageSize: $scope.invoiceModel.page.pageSize
                                            };

                                            //temp.billInfoQueryParam.paperInvoiceType = 1;//1普通发票,2增值税专用发票,3非税务发票

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
                                        $timeout(function () {
                                            $scope.model.mark = true;
                                        });
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if (response.status) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach(dataview, function (item) {

                                                if (!(item.billingTime === null || item.billingTime === '')) {
                                                    item.billingTimeOne = item.billingTime.substring(0, 10);
                                                    item.billingTimeTwo = item.billingTime.substring(10, 20);
                                                }
                                                item.index = index++;
                                            });
                                            $scope.events.tableColumnsOperate($scope.invoiceModel.invoiceShowNum);
                                        } else {
                                            HB_dialog.error('提示', '[查询报错]：' + response.info);
                                            response.info = [];//报错的时候清空数据，防止表格失效，切换tab的时候，其它tab显示另外tab的数据
                                            //$scope.events.hideAllColumns();//隐藏整个表格，防止在报错后切换tab的时候，其它tab显示另外tab的数据
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

                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns: [
                                {title: 'No', width: 40},
                                {sortable: false, field: 'orderNo', title: '订单号'},
                                {sortable: false, field: 'refundStatus', title: '退款状态', width: 80},
                                {sortable: false, field: 'orderMoney', title: '付款金额（元）', width: 115},
                                {sortable: false, field: 'money', title: '开票金额（元）', width: 115},
                                {sortable: false, field: 'tax', title: '税额（元）', width: 90},
                                {sortable: false, field: 'deliverType', title: '配送方式', width: 80},
                                {sortable: false, field: 'typeName', title: '购买人信息', width: 200},
                                {sortable: false, field: 'receivingUnit', title: '收款单位', width: 200},
                                {sortable: false, field: 'title', title: '发票抬头', width: 100},
                                {sortable: false, field: 'taxpayerNo', title: '纳税人识别码', width: 100},
                                {sortable: false, field: 'result', title: '发票代码', width: 100},
                                {sortable: false, field: 'result', title: '开票时间', width: 100},
                                {sortable: false, field: 'result', title: '发票号', width: 100},
                                {sortable: false, field: 'state', title: '发票状态', width: 100}
                            ]
                        }
                    }

                };

            }]
    };
});