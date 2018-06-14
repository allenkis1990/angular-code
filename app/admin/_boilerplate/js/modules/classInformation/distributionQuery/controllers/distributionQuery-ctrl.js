define(function (distributionQuery) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'kendo.grid', 'hbUtil', 'HB_dialog', 'TabService', '$http', '$timeout', '$rootScope', '$state', 'classInfoService', 'distributionQueryService', 'HB_notification',
            function ($scope, kendoGrid, hbUtil, HB_dialog, TabService, $http, $timeout, $rootScope, $state, classInfoService, distributionQueryService, HB_notification) {

                $scope.model.mark = false;
                $scope.model.datasuccess = true;
                $scope.deliveryQueryParam = {
                    gridPending: false,
                    orderNo: '',
                    successTime: '',
                    class: '',
                    name: '',
                    number: '',
                    invoiceNo: '',
                    postadress: '',
                    postCode: '',
                    cellPhone: '',
                    pageNo: 0,
                    pageSize: 10,
                    state: -1,
                    waybillOrderNo: '',
                    postNo: '',
                    userId: '',
                    remark: ''
                };

                $scope.$watch('model.userId', function (newVal) {
                    if (newVal) {

                        $scope.model.mark = false;
                        classInfoService.doView($state.current.name);
                        $scope.deliveryQueryParam.userId = newVal;
                        console.log($scope.deliveryQueryParam.userId);
                        if ($scope.kendoPlus.gridDelay === false && $scope.model.classTab === 8) {
                            $scope.kendoPlus.gridDelay = true;
                            //$scope.model.mark=true;
                        } else {
                            if ($scope.model.classTab === 8) {
                                $scope.events.MainPageQueryList();
                            }

                        }
                    }
                });


                $scope.kendoPlus = {
                    deliveryQueryInstance: null,
                    deliveryQueryGrid: null,
                    gridDelay: false
                };


                $scope.events = {
                    afterCopy: function (dataItem) {
                        // 默认打开ems
                        window.open(dataItem.expressUrl || 'http://www.ems.com.cn/');
                    },
                    //查询
                    MainPageQueryList: function (e) {

                        $scope.model.page.pageNo = 1;
                        $scope.kendoPlus.deliveryQueryInstance.pager.page(1);
                    },

                    saveremark: function (item) {
                        distributionQueryService.remarkPackage({
                            invoiceId: $scope.model.invoiceId,
                            comment: $scope.model.remark
                        }).then(function (data) {
                            if (data.status) {
                                HB_dialog.success('提示', '修改成功');
                                $scope.model.datasuccess = true;
                                $scope.events.MainPageQueryList();
                            } else {
                                $scope.model.status = false;
                                HB_dialog.error('提示', data.info);
                                $scope.model.datasuccess = false;
                            }

                        });
                    },
                    openwindow: function (item) {

                        $scope.model.remark = item.remark;
                        $scope.model.invoiceId = item.invoiceShowId;
                        $scope.deliveryQueryParam.dialogContent = item.remark;
                        HB_dialog.contentAs($scope, {
                            title: '备注信息',
                            width: 660,
                            height: 280,
                            showCancel: false,
                            showCertain: false,

                            templateUrl: '@systemUrl@/views/classInformation/distributionQuery/remark.html'
                        });
                    }

                };

                //订单模板
                var deliveryQueryTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tbody>');
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');
                    //包裹物品
                    result.push('<td class="tl">');
                    result.push('<div class="goods-info tl" ng-repeat="item in  dataItem.packageContentList">' +
                        '<strong>订单号：</strong><span ng-bind="item.orderNo"></span>' +
                        '<strong class="ml5">交易成功时间：</strong><span ng-bind="item.traceSuccessTime">' +
                        '</span><br/>' +
                        '<div class="tips-box mt5 mb5" ng-if="ob.invoiceGoodType==2" ng-repeat="ob in item.invoiceGoodDtoList">' +
                        '【<span  ng-bind="ob.billName"></span>】发票抬头：<span ng-bind="ob.billTitle||\'无\'">' +
                        '</span> <span class="ml20"></span>数量：<span ng-bind="ob.billCount">' +
                        '</span> <span class="ml20"></span>发票号：<span ng-bind="ob.billNumber||\'未打印\'">' +
                        ' </span> </div> ' +
                        '<div class="tips-box mt5 mb5" ng-if="ob.invoiceGoodType==3" ng-repeat="ob in item.invoiceGoodDtoList">' +
                        '【证书】 <b>持证人姓名：</b><span ng-bind="ob.certificateHolderName"></span>' +
                        ' <span class="ml20"> <b>证书编号：</b><span ng-bind="ob.certificateSubOrderNo"></span> ' +
                        '</span> <span class="ml20 txt-r" ng-if="ob.state==2">已打印</span> <span class="ml20 txt-r" ng-if="ob.state==1">未打印</span> </div> </div>');
                    /*result.push ( '<div class="goods-info " >' +
                        '<p  ng-if="#: packageContentList.orderNo!==null#">订单号：#: packageContentList.orderNo #</p>' +
                        '<p  ng-if="#: packageContentList.traceSuccessTime!==null#">交易成功时间：#: packageContentList.traceSuccessTime #</p>' +
                        '<p  ng-if="#: packageContentList.goodNameList!==null#" ng-repeat=" goodNameList in  dataItem.packageContentList.goodNameList ">b{{goodNameList}};  </p>' +
                        ' <div   ng-if="#: packageContentList.orderBills!==null#"  class="tips-box mt5 mb5" ng-repeat=" orderBills in  dataItem.packageContentList.orderBills ">【b{{orderBills.name}}】' +
                        '<span ng-if="#: packageContentList.orderBills.billTitle!==null#">发票抬头：b{{orderBills.billTitle}}</span>' +
                        '<span class="ml20"  ng-if="#: packageContentList.orderBills.count!==null#">数量：b{{orderBills.count}} </span>' +
                        '<span  class="ml20" ng-if="#: packageContentList.orderBills[0].orderBillNo===null#">发票号：未打印 </span><span class="ml20"  ng-if="#: packageContentList.orderBills[0].orderBillNo!==null#">发票号：b{{orderBills.orderBillNo}} </span></div></div>' );

                    result.push ( '</td>' );*/
                    //收件信息
                    result.push('<td class="tl"  ng-if="#: deliveryWayType==="1" #">');

                    result.push('<p  ng-if="#: receiveContent.recipientsAddress !==null# " >收货地址：#: receiveContent.recipientsAddress # </p> ' +
                        '<p   ng-if="#: receiveContent.recipients !==null# " >收货人：#: receiveContent.recipients #</p>' +
                        '<p  ng-if="#: receiveContent.recipientsPhone!==null #">手机号码：#: receiveContent.recipientsPhone  #</span>' +
                        '<div class="tips-box-2 mt5 mb5" style="white-space: initial" ng-if="#: remark !==null #" > 备注：#:remark#</div>');

                    result.push('</td>');

                    result.push('<td class="tl"  ng-if="#: deliveryWayType==="2" #">');
                    result.push('<p   ng-if="#: receiveContent.recipients !==null# " >购买人：#: receiveContent.recipients # </p> ' +
                        '<p   ng-if="#: receiveContent.identificationNo !==null# " >身份证号：#: receiveContent.identificationNo #</p>' +
                        '<p  ng-if="#: receiveContent.recipientsPhone!==null #">手机号：#: receiveContent.recipientsPhone  #</p>' +
                        '<p  ng-if="#: receiveContent.recipientsAddress!==null #">自取地址：#: receiveContent.recipientsAddress #</p>' +
                        '<div class="tips-box-2 mt5 mb5" style="white-space: initial" ng-if="#: remark !==null #" > 备注：#:remark#</div>');

                    result.push('</td>');

                    //配送方式
                    result.push('<td>');
                    result.push('<span ng-if="#: deliveryWayType==="1" #" >快递</span>');
                    result.push('<span ng-if="#: deliveryWayType==="2" #" >自取</span>');
                    result.push('</td>');


                    //配送信息

                    //快递
                    result.push('<td class="tl" ng-if=\"#: deliveryWayType==="1" #\">');
                    result.push('<p  ng-if="#: carrierName!==null #">快递公司：#: carrierName # </p>' +
                        '<p ng-if="#: waybillNo!==null #">运单号：#: waybillNo #</p>' +
                        '<p ng-if="#: sendTime!==null #">发货时间：#: sendTime #</p>' +
                        '<a after-copy="events.afterCopy(dataItem)" copy-man-one ng-if="#: waybillNo!==null #" class="txt-b" data-clipboard-text="b{{dataItem.waybillNo}}">' +
                        '复制运单号并查询</a>');
                    result.push('</td>');

                    //自取
                    result.push('<td class="tl" ng-if="#: deliveryWayType==="2" #">');
                    result.push('<p  ng-if="#: selfClaimGoodsName!==null #">领取人：#: selfClaimGoodsName # </p>' +
                        '<p  ng-if="#: selfClaimGoodsPhone!==null #">手机号：#: selfClaimGoodsPhone #</p>' +
                        '<p ng-if="#: signTime!==null #">取货时间：#: signTime #</p>' +
                        '<center ng-if="#: waybillNo===null&&signTime===null&&selfClaimGoodsPhone===null&&selfClaimGoodsName===null #">——</center>');

                    result.push('</td>');

                    result.push('<td class="op" >');
                    result.push('<span ng-if=\"#: state==="0" #\" class="txt-r">未就绪</span>');
                    result.push('<span ng-if=\"#: state==="1" #\" class="txt-r">就绪</span>');
                    result.push('<span ng-if=\"#: state==="2" #\" class="txt-r">等待确认仓点</span>');
                    result.push('<span ng-if=\"#: state==="3" #\" class="txt-r">等待拣货</span>');
                    result.push('<span ng-if=\"#: state==="4" #\" class="txt-r">拣货中</span>');
                    /*<a href="" class="t-btn btn btn-mini">备注</a>*/
                    result.push('<span ng-if=\"#: state==="5" #\" class="txt-r">等待补货</span>');
                    result.push('<span ng-if=\"#: state==="6" #\" class="txt-r">补货中</span>');
                    result.push('<span ng-if=\"#: state==="7" #\" class="txt-r">等待配货</span>');
                    result.push('<span ng-if=\"#: state==="8" #\" class="txt-r">配货中</span>');
                    result.push('<span ng-if=\"#: state==="9" #\" class="txt-r">等待打印运单</span>');
                    result.push('<span ng-if=\"#: state==="a" #\" class="txt-r">等待打包</span>');
                    result.push('<span ng-if=\"#: state==="b" #\" class="txt-r">打包中</span>');
                    result.push('<span ng-if=\"#: state==="c" #\" class="txt-r">等待寄送</span>');
                    result.push('<span ng-if=\"#: state==="d" #\" class="txt-r">快递寄送中</span>');
                    result.push('<span ng-if=\"#: state==="e" #\" class="txt-r">发往自取点中</span>');
                    result.push('<span ng-if=\"#: state==="f" #\" class="txt-r">到达自取点</span>');
                    result.push('<span ng-if=\"#: state==="g" #\" class="txt-r">已取货</span>');
                    result.push('<span ng-if=\"#: state===null #\" class="txt-r">——</span>');
                    result.push('</td>');


                    result.push('<td class="op"  >');
                    result.push('<a href="javascript:void(0)" ng-if=\"#: state==="0"||state==="1" #\"  class="t-btn btn btn-mini" ng-click=\"events.openwindow(dataItem)\"  has-permission="customer/remarkPackage"  >备注</a>');
                    result.push('</td>');

                    result.push('</tr>');

                    result.push('</tbody>');
                    deliveryQueryTemplate = result.join('');

                })();

                $scope.deliveryQueryGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(deliveryQueryTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/packageDeliveryManager/getPackageInfos',
                                    data: function (e) {

                                        var temp = {
                                            pageNo: e.page,
                                            pageSize: $scope.deliveryQueryParam.pageSize,
                                            state: $scope.deliveryQueryParam.state,
                                            buyerId: $scope.deliveryQueryParam.userId,
                                            waybillOrderNo: $scope.deliveryQueryParam.waybillOrderNo,
                                            orderNo: $scope.deliveryQueryParam.orderNo,
                                            batchQueryTag: 0,

                                            rangeType: $scope.model.authorizedQuery.rangeType,
                                            belongsType: $scope.model.authorizedQuery.belongsType,
                                            authorizeToUnitId: $scope.model.authorizedQuery.authorizeToUnitId,
                                            authorizedFromUnitId: $scope.model.authorizedQuery.authorizedFromUnitId,
                                            objectId: $scope.model.authorizedQuery.objectId
                                        };

                                        $scope.deliveryQueryParam.pageNo = e.page;

                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;
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
                                    /* $scope.deliveryQueryParam.gridPending = false;*/
                                    $timeout(function () {
                                        $scope.model.mark = true;
                                    });


                                    angular.forEach(response.info, function (item) {


                                        /* console.log(item)
                                          $scope.model.remark =item.remark;*/
                                        $scope.model.goodNameList = item.packageContentList;
                                        console.log($scope.model.goodNameList);
                                    });
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
                                    response.totalSize = response.info.length;
                                    return response.totalSize;

                                },
                                data: function (response) {
                                    $scope.model.total = response.info.length;

                                    return response.info;
                                }
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
                            hbUtil.kendo.grid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {field: 'index', title: 'No.', sortable: false, width: 44},
                            {field: 'goodsInfo', title: '包裹物品', sortable: false, width: 350},
                            {field: 'receiveInfo', title: '收件信息', sortable: false, width: 280},
                            {field: 'delivery', title: '配送方式', sortable: false, width: 70},
                            {field: 'deliveryInfo', title: '配送信息', sortable: false, width: 160},
                            {field: 'state', title: '配送状态', sortable: false, width: 70},
                            {title: '操作', sortable: false, width: 70}
                        ]
                    }
                };


            }]
    };
});