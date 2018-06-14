define(function (openRecord) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'hbUtil', 'HB_dialog', '$http', '$state', 'TabService', function ($scope, hbUtil, HB_dialog, $http, $state, TabService) {

            $scope.kendoPlus = {
                classGridInstance: null,
                openRecordInstance: null,
                timeModel: null,
                timeOptions: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd'
                    //format : "yyyy-MM-dd HH:mm:00"
                    //min    : new Date ()
                },
                windowOptions: {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                }
            };

            $scope.model = {
                classPage: {
                    pageNo: 1,
                    pageSize: 10
                },
                openRecordPage: {
                    buyerName: '',
                    loginInput: '',
                    professionLevel: -1,
                    skuId: '',
                    orderNo: '',
                    creatorLoginInput: '',
                    tradeStartTimeMills: '',
                    tradeEndTimeMills: '',
                    pageNo: 1,
                    pageSize: 10
                },

                configedQueryParam: {
                    trainClassName: '',
                    trainingYear: -1,
                    titleLevel: -1,
                    learningType: -1,
                    onSaleState: 0,//这里查全部
                    saleState: 0,
                    price: '',
                    commodityName: '',
                    minFirstUpTime: '',
                    maxFirstUpTime: '',
                    orderByCondition: 0,//0默认 1首次上架时间 排序
                    sortOrder: 0//0降序 1升序
                }
            };

            $scope.events = {
                resetQueryParams: function () {
                    resetQueryParams();
                },

                queryDetailClass: function (e, item) {
                    console.log(1);
                    $scope.temporaryClassList = item.subOrderList;
                    HB_dialog.contentAs($scope, {
                        templateUrl: '@systemUrl@/views/openRecord/queryDetailClassTpl.html',
                        width: 800,
                        title: '培训班',
                        showCertain: false
                    });
                },

                openKendoWindow: function (windowName) {
                    $scope[windowName].center().open();
                },

                closeKendoWindow: function (windowName) {
                    $scope[windowName].close();
                },

                MainPageQueryList: function (e, gridName, pageName) {
                    e.stopPropagation();
                    if (validataIdcard($scope.model.openRecordPage.loginInput)) {
                        //alert('身份证必须是大于4位的数字');
                        HB_dialog.warning('提示', '如果账号为数字，至少输入4位才能进行查询！');
                        return false;
                    }
                    $scope.model[pageName].pageNo = 1;
                    $scope.kendoPlus[gridName].pager.page(1);
                },

                //培训班升序降序
                setSortOrder: function (sortOrder) {
                    $scope.model.configedQueryParam.orderByCondition = 1;
                    $scope.model.configedQueryParam.sortOrder = sortOrder;
                    $scope.kendoPlus['classGridInstance'].pager.page(1);
                    $scope.kendoPlus['classGridInstance'].dataSource.read();
                },

                choseClass: function (e, item) {
                    $scope.model.openRecordPage.trainClassName = item.commodityName;
                    $scope.model.openRecordPage.skuId = item.commoditySkuId;
                    $scope.events.closeKendoWindow('classWindow');
                },

                clearTextContent: function () {
                    $scope.model.openRecordPage.trainClassName = '';
                    $scope.model.openRecordPage.skuId = '';
                },

                goOrderDetail: function (e, item) {
                    TabService.appendNewTab('订单管理', 'states.orderManage.orderDetail', {
                        orderNo: item.orderNo,
                        from: 2
                    }, 'states.orderManage', true);
                    //$state.go('states.orderManage.orderDetail',{orderNo:item.orderNo});
                },

                changeTitleLevel: function (id) {
                    console.log(id);
                    if (id === '5628812b569c57e001569c5ab5f60001') {
                        $scope.learningTypeDisabled = true;
                        $scope.model.configedQueryParam.learningType = -1;
                    } else {
                        $scope.learningTypeDisabled = false;
                    }
                }
            };

            //开通记录列表模板
            var openRecordTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: orderNo #');
                result.push('</td>');

                result.push('<td>');
                //result.push('#: successPayTime #');
                result.push('<span ng-if="#: completeTime===null #">-</span>');
                result.push('<span ng-if="#: completeTime!==null #">#: completeTime #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div ng-repeat="item in dataItem.subOrderList" title="b{{item.productName}}">b{{item.productName}}</div>');
                //result.push('#: firstGoods #');
                //result.push('<br>');
                //result.push('<button ng-click="events.queryDetailClass($event,dataItem)" type="button" class="table-btn">#: goodsCount #个培训班</button>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: goodsCount #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: totalAmount #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span>购买人：#: buyer.name #</span>');
                result.push('<br>');
                result.push('<span>身份证：<span ng-if="#: buyer.loginInput===null #">-</span><span ng-if="#: buyer.loginInput!==null #">#: buyer.loginInput #</span></span>');
                result.push('</td>');

                /*item.buyerName=item.buyer.name;
                 item.idCard=item.buyer.idCard;*/

                result.push('<td>');
                result.push('<span ng-if="#: creator.loginInput===null #">-</span>');
                result.push('<span ng-if="#: creator.loginInput!==null #">#: creator.loginInput #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" has-permission="orderManage/commonOrderDetail" class="table-btn" ng-click="events.goOrderDetail($event,dataItem)">详情</button>');
                result.push('</td>');

                result.push('</tr>');
                openRecordTemplate = result.join('');
            })();

            $scope.openRecordGrid = {
                options: {
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(openRecordTemplate),
                    scrollable: false,
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/trainClassOpen/getOrderPage',
                                data: function (e) {
                                    var temp = {
                                        buyerName: $scope.model.openRecordPage.buyerName,
                                        loginInput: $scope.model.openRecordPage.loginInput,
                                        professionLevel: $scope.model.openRecordPage.professionLevel,
                                        skuId: $scope.model.openRecordPage.skuId,
                                        orderNo: $scope.model.openRecordPage.orderNo,
                                        creatorLoginInput: $scope.model.openRecordPage.creatorLoginInput,
                                        tradeStartTimeMills: validateIsNull($scope.model.openRecordPage.tradeStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.openRecordPage.tradeStartTimeMills),
                                        tradeEndTimeMills: validateIsNull($scope.model.openRecordPage.tradeEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.model.openRecordPage.tradeEndTimeMills) + 86399999,
                                        pageNo: e.page,
                                        pageSize: $scope.model.openRecordPage.pageSize
                                    };

                                    $scope.model.openRecordPage.pageNo = e.page;
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

                                angular.forEach(response.info, function (item) {
                                    item.firstGoods = item.subOrderList[0].productName;
                                    item.goodsCount = item.subOrderList.length;
                                    item.buyerName = item.buyer.name;
                                    item.idCard = item.buyer.idCard;
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
                        hbUtil.kendo.grid.nullDataDealLeaf(e);
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
                        {field: 'index', title: 'No', sortable: false, width: 50},
                        {field: 'orderNo', title: '订单号', sortable: false, width: 200},
                        {field: 'successPayTime', title: '交易成功时间', sortable: false, width: 145},
                        {field: 'firstGoods', title: '商品信息', sortable: false},
                        {field: 'goodsCount', title: '数量', sortable: false, width: 60},
                        {field: 'totalAmount', title: '实付金额', sortable: false, width: 80},
                        {field: 'totalAmount', title: '购买人信息', sortable: false, width: 220},
                        {field: 'operator', title: '操作账号', sortable: false, width: 100},
                        {
                            title: '操作', width: 80
                        }
                    ]
                }
            };

            //已配置模板
            var classGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td title="#: commodityName #">');
                result.push('#:commodityName#');
                result.push('</td>');

                result.push('<td>');
                result.push('<span>年度：</span>' + '#:trainingYear#');
                result.push('<br />');
                result.push('<span>职称等级：</span>' + '#:titleLevel#');
                result.push('<br />');
                result.push('<span>学习类别：</span>');
                result.push('<span ng-if="#:learningType===null#">-</span>');
                result.push('<span ng-if="#:learningType!==null#">#:learningType#</span>');
                result.push('<br />');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-if="#:onSaleState==1#">已上架</span>' + '<span ng-if="#:onSaleState==2#">待上架</span>' + '<span ng-if="#:onSaleState==3#">已下架</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-if="#:saleState==1#">已售</span>' + '<span ng-if="#:saleState==2#">未售</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: credit #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: price #');
                result.push('</td>');

                result.push('<td>');
                result.push('首次上架时间：');
                result.push('<span ng-if="#: firstUpTime!==null #">#: firstUpTime #</span>');
                result.push('<span ng-if="#: firstUpTime==null #">-</span>');
                result.push('<br />');
                //result.push('预计上架时间：');
                result.push('<span ng-if="#: futureUpTime!==null #">预计上架时间：#: futureUpTime #</span>');
                //result.push('预计上架时间：'+'<span ng-if="#: futureUpTime!==null #">#: futureUpTime #</span>');
                //result.push('<span ng-if="#: futureUpTime==null #">-</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.choseClass($event,dataItem)">选择</button>');
                result.push('</td>');

                result.push('</tr>');
                classGridRowTemplate = result.join('');
            })();

            $scope.classGrid = {
                options: hbUtil.kdGridCommonOption({
                    template: classGridRowTemplate,
                    url: '/web/admin/commodityManager/getConfigDone',
                    scope: $scope,
                    page: 'classPage',
                    param: $scope.model.configedQueryParam,
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {field: 'commodityName', title: '班级名称', sortable: false},
                        {field: 'attr', title: '属性', sortable: false, width: 230},
                        {field: 'onSaleState', title: '上架状态', sortable: false, width: 80},
                        {field: 'saleState', title: '是否出售', sortable: false, width: 80},
                        {field: 'credit', title: '学分', sortable: false, width: 80},
                        {field: 'price', title: '价格', sortable: false, width: 80},
                        {
                            field: 'onSaleTime', title: '上架时间', sortable: false, width: 260,
                            headerTemplate: '上架时间<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder==0" ng-click="events.setSortOrder(1)" class="ico lwh-ico-up"></a>' +
                            '<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder!==0" ng-click="events.setSortOrder(0)" class="ico lwh-ico-down"></a>'
                        },
                        {
                            title: '操作', width: 80
                        }
                    ]
                })
            };

            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            //身份证必须大于4位的数字
            function validataIdcard (str) {

                if (!validateIsNull(str)) {
                    if (!isNaN(Number(str)) && str.length < 5) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

            function resetQueryParams () {
                $scope.model.openRecordPage.buyerName = '';
                $scope.model.openRecordPage.loginInput = '';
                $scope.model.openRecordPage.professionLevel = -1;
                $scope.model.openRecordPage.skuId = '';
                $scope.model.openRecordPage.orderNo = '';
                $scope.model.openRecordPage.operatorId = '';
                $scope.model.openRecordPage.tradeStartTimeMills = '';
                $scope.model.openRecordPage.tradeEndTimeMills = '';
            }

            function initSomeTing () {
                //获取年度
                $http.get('/web/admin/commodityManager/getTrainingYearList').success(function (data) {
                    $scope.model.yearList = data.info;
                    $scope.model.yearList.unshift({name: '选择培训年度', optionId: -1});
                });

                //获取职称等级
                $http.get('/web/admin/commodityManager/getTitleLevelList').success(function (data) {
                    $scope.model.titleLevelList = data.info;
                    $scope.model.titleLevelList.unshift({name: '选择职称等级', optionId: -1});
                });

                //获取学习类别
                $http.get('/web/admin/commodityManager/getLearningTypeList').success(function (data) {
                    $scope.model.learningTypeList = data.info;
                    $scope.model.learningTypeList.unshift({name: '选择学习类别', optionId: -1});
                });

            }

            initSomeTing();

            function parseTimeStrToLong (str) {
                return kendo.parseDate(str).getTime();
            }

        }]
    };
});