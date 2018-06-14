define(function () {
    'use strict';
    return ['$scope', '$q', 'service', 'hbUtil', 'HB_dialog', '$state', 'hbSkuService', function ($scope, $q, importStudentService, hbUtil, HB_dialog, $state, hbSkuService) {
        $scope.model = {
            upload: {},
            importUser: {
                passWordType: 1
            },

            classPage: {
                pageNo: 1,
                pageSize: 10
            },
            configedQueryParam: {
                categoryType: 'TRAINING_CLASS_GOODS',//指定类目培训班
                commoditySkuState: 1,//这里查全部
                saleState: -1,
                trainingSchemeEnabled: -1,
                commoditySkuName: '',
                firstUpTimeMin: '',
                firstUpTimeMax: ''
            }
        };

        //已配置模板
        var classGridRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');


            result.push('<td>');
            result.push('#: index #');
            result.push('</td>');

            result.push('<td>');
            //result.push ( '#: commodityName #' );
            result.push('<span style="cursor:pointer;" title="#: commodityName #" ng-click="events.goDetail($event,dataItem)">#: commodityName #</span>');
            result.push('</td>');


            result.push('<td>');
            result.push('<span ng-if="dataItem.trainingSchemeType===\'TRAINING_CLASS\'">培训班学习</span>');
            result.push('<span ng-if="dataItem.trainingSchemeType===\'COURSE\'">自主选课学习</span>');
            result.push('</td>');


            result.push('<td>');
            result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
            result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
            result.push('</div>');
            result.push('</td>');


            //销售状态
            result.push('<td>');
            result.push('<span ng-if="dataItem.commoditySkuState===1">已上架</span>');
            result.push('<span ng-if="dataItem.commoditySkuState===2">待上架</span>');
            result.push('<span ng-if="dataItem.commoditySkuState===3">已下架</span>');
            result.push('</td>');

            //定价
            result.push('<td>');
            result.push('<span ng-if="dataItem.commodityType===\'TRAINING_CLASS\'">整班定价：<span ng-bind="dataItem.price"></span>元/班</span>');
            result.push('<span ng-if="dataItem.commodityType===\'PERIOD\'">每学时：<span ng-bind="dataItem.price"></span>元/学时</span>');
            result.push('<span ng-if="dataItem.commodityType===\'COURSE\'">课程定价：<span ng-bind="dataItem.price"></span>元/每个课程</span>');
            result.push('</td>');


            //是否售出
            result.push('<td>');
            result.push('<span ng-if="dataItem.saleState===1">已售</span>');
            result.push('<span ng-if="dataItem.saleState===2">未售</span>');
            result.push('</td>');

            //首次上架时间
            result.push('<td>');
            result.push('<span ng-if="dataItem.firstUpTime===null">-</span>');
            result.push('<span ng-if="dataItem.firstUpTime!==null">#: firstUpTime #</span>');
            result.push('</td>');

            result.push('</tr>');
            classGridRowTemplate = result.join('');
        })();

        $scope.kendoPlus = {
            classGridInstance: null,
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
            classGrid: {
                options: {
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(classGridRowTemplate),
                    scrollable: false,
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/commodityManager/getConfigDone',
                                data: function (e) {

                                    var temp = {
                                        pageNo: e.page,
                                        pageSize: e.pageSize,
                                        queryParam: $scope.model.configedQueryParam
                                    };


                                    if (!$scope.skuParamsClass) {
                                        temp.queryParam.skuPropertyList = undefined;
                                    } else {
                                        if (validateIsNull($scope.model.configedQueryParam.categoryType)) {
                                            temp.queryParam.skuPropertyList = undefined;
                                        } else {
                                            temp.queryParam.skuPropertyList = $scope.skuParamsClass.skuPropertyList;
                                        }
                                    }

                                    //console.log($scope.skuParamsGoodsManager);


                                    $scope.model.pageNo = e.page;
                                    $scope.model.pageSize = e.pageSize;


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
                                $scope.goodsManagerArr = response.info;
                                angular.forEach(response.info, function (item, ItemIndex) {
                                    item.index = ItemIndex + 1;
                                });
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
                        {field: 'orderNo', title: 'NO.', sortable: false, width: 60},
                        {field: 'orderNo', title: '培训方案名称', sortable: false},
                        {field: 'firstGoods', title: '培训方案形式', sortable: false, width: 130},
                        {field: 'goodsCount', title: '属性', sortable: false, width: 160},
                        {field: 'totalAmount', title: '销售状态', sortable: false, width: 80},
                        {field: 'totalAmount', title: '定价', sortable: false, width: 150},
                        {field: 'totalAmount', title: '是否售出', sortable: false, width: 80},
                        {field: 'totalAmount', title: '首次上架时间', sortable: false, width: 160}
                    ]
                }
            }
        };


        $scope.events = {


            openKendoWindow: function (windowName) {
                $scope[windowName].center().open();
            },

            closeKendoWindow: function (windowName) {
                $scope[windowName].close();
            },

            mainPageQueryList: function (e, gridName, pageName) {
                e.stopPropagation();
                $scope.model[pageName].pageNo = 1;
                $scope.kendoPlus[gridName].pager.page(1);
            },


            //导入
            importOpenUser: function (e) {
                e.preventDefault();

                var uploadResult = $scope.model.upload.result;
                if (!uploadResult) {
                    $scope.globle.showTip('请选择文件', 'warning');
                    return false;
                }
                /*if($scope.model.importUser.passWordType==3){
                    if(!$scope.model.importUser.password){
                        $scope.globle.showTip ( '密码不能为空', "warning" );
                        return false;

                    } else {
                        if($scope.model.importUser.password.length<6||$scope.model.importUser.password.length>12){
                            $scope.globle.showTip ( '密码必须在6-12位之间', "warning" );
                            return false;
                        }
                    }
                }*/

                importStudentService.importOpenUser({
                    implementProject: 'COURSE_SUPERMARKET_V2_OPENCLASS',
                    filePath: uploadResult.newPath,
                    fileName: uploadResult.fileName
                    /*passWordType         : $scope.model.importUser.passWordType,
                    password             : $scope.model.importUser.password,*/
                }).then(function (data) {
                    if (!data.status || !data.info) {
                        $scope.globle.showTip(data.info, 'error');
                    } else {
                        $scope.model.upload = {};
                        $scope.model.importUser.password = '';

                        // 弹窗提示页面跳转
                        HB_dialog.contentAs($scope, {
                            title: '提示',
                            width: 350,
                            height: 170,
                            confirmText: '查看任务进度',
                            cancelText: '确定',
                            sure: function (wow) {
                                var defer = $q.defer(),
                                    promise = defer.promise;
                                $state.go('states.importOpenClassTask', {
                                    groupType: 'DISTRIBUTOR_OPEN'
                                });
                                defer.resolve();
                                wow.close();
                                return promise;
                            },
                            templateUrl: '@systemUrl@/views/importClassOpen/dialogFile.html'
                        });
                    }
                });
            }
        };

        //验证是否为空
        function validateIsNull (obj) {
            return (obj === '' || obj === undefined || obj === null);
        }

        importStudentService.downloadTemplate().then(function (data) {
            if (data.status) {
                $scope.urlPrefix = data.info.downModelIP;
            }
        });

    }];
});
