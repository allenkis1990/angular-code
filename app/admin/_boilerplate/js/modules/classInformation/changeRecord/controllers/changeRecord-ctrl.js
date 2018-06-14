define(function (changeRecord) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$http', 'hbUtil', 'kendo.grid', 'classInformationServices', 'HB_dialog', '$state', '$timeout',
            function ($scope, $http, hbUtil, kendoGrid, classInformationServices, HB_dialog, $state, $timeout) {
                //console.log($scope.model.classTab);
                $scope.model.queryParam = {
                    classCategoryType: 'TRAINING_CLASS_GOODS'
                };
                $scope.model.mark = false;
                $scope.markOne = false;
                $scope.markTwo = false;
                $scope.$watch('model.userId', function (newVal) {
                    if (newVal) {
                        //console.log(1);
                        $scope.model.mark = false;
                        $scope.markOne = false;
                        $scope.markTwo = false;
                        classInformationServices.doview($state.current.name);
                        $scope.changeRecord.buyedClassQueryParams.userId = newVal;
                        if ($scope.kendoPlus.gridDelay === false && $scope.model.classTab === 7) {
                            $scope.kendoPlus.gridDelay = true;
                        } else {
                            if ($scope.model.classTab === 7) {
                                $scope.events.MainPageQueryList('classGridInstance', 'buyedClassQueryParams');
                                $scope.events.MainPageQueryList('changeRecordInstance', 'changeRecordQueryParams');
                            }
                        }
                    }
                    //console.log(newVal);
                });

                $scope.kendoPlus = {
                    classGridInstance: null,
                    canChangeGridInstance: null,
                    changeRecordInstance: null,
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

                    gridDelay: false,

                    canchangeGridDelay: false
                };

                $scope.changeRecord = {
                    yearList: [],
                    titleLevelList: [],

                    buyedClassQueryParams: {
                        ueserId: '',
                        trainingYear: -1,
                        titleLevel: -1,
                        learningType: -1,
                        trainingResult: -2,
                        className: '',
                        pageNo: 1,
                        pageSize: 10
                    },

                    canChangeQueryParams: {
                        commoditySkuId: '',
                        className: '',
                        trainingYear: -1,
                        titleLevel: -1,
                        learningType: -1,
                        pageNo: 1,
                        pageSize: 10
                    },

                    changeRecordQueryParams: {
                        buyerId: '',
                        trainingYearId: -1,
                        professionalGradeId: -1,
                        oldProductName: '',
                        status: 'ALL',
                        fetchAll: false,
                        pageNo: 1,
                        pageSize: 10
                    },

                    subOrderNo: '',

                    studyTypeDisabled: false,
                    studyTypeDisabled2: false
                };

                $scope.events = {

                    MainPageQueryList: function (gridName, pageName) {
                        //e.stopPropagation();
                        $scope.changeRecord[pageName].pageNo = 1;
                        $scope.kendoPlus[gridName].pager.page(1);
                    },

                    openKendoWindow: function (windowName) {
                        $scope[windowName].center().open();
                    },

                    closeKendoWindow: function (windowName) {
                        $scope[windowName].close();
                    },

                    swapTrainClass: function (item) {
                        if (item.sourceType === 'TRANSFER') {
                            HB_dialog.warning('提示', '迁移班级不允许换班');
                            return false;
                        }

                        classInformationServices.validateSwapAuthorize(item.orderNo,item.subOrderNo).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('提示', data.info);
                                return;
                            }else {
                                $scope.changeRecord.canChangeQueryParams.commoditySkuId = item.commoditySkuId;
                                $scope.changeRecord.subOrderNo = item.subOrderNo;
                                $scope.temporaryOrderNo = item.orderNo;
                                $scope.temporaryEdCourse = item.className;
                                $scope.events.openKendoWindow('canChangeWindow');
                                if ($scope.kendoPlus.canchangeGridDelay === false) {
                                    $scope.kendoPlus.canchangeGridDelay = true;
                                } else {
                                    $scope.events.MainPageQueryList('canChangeGridInstance', 'canChangeQueryParams');
                                }
                            }
                        });
                    },

                    openSwapTrainWindow: function (item) {
                        $scope.temporarySkuId = item.commoditySkuId;
                        $scope.temporarySchemeId = item.schemeId;
                        $scope.temporaryCourseName = item.commodityName;
                        //console.log($scope.temporaryOrderNo);
                        $scope.events.openKendoWindow('confirmChangeWindow');
                    },

                    confirmSwapTrainClass: function () {
                        $scope.submitAble = true;
                        var temp = {
                            studentId: $scope.changeRecord.buyedClassQueryParams.userId,
                            swapObj: {
                                applySubOrderNo: $scope.changeRecord.subOrderNo,
                                commodityBuyDto: {},
                                applyOrderNo: $scope.temporaryOrderNo,
                                commoditySkuId: $scope.temporarySkuId,
                                schemeId: $scope.temporarySkuId
                            }
                        };
                        classInformationServices.swapTrainClass(temp).then(function (data) {
                            $scope.submitAble = false;
                            if (data.status) {
                                HB_dialog.success('提示', '操作成功,系统正在换班中请稍后刷新列表');
                                $scope.events.closeKendoWindow('canChangeWindow');
                                $scope.events.closeKendoWindow('confirmChangeWindow');

                                $scope.kendoPlus['classGridInstance'].pager.page(1);
                                $scope.changeRecord['buyedClassQueryParams'].pageNo = 1;

                                //刷新换班记录表格
                                $scope.kendoPlus['changeRecordInstance'].pager.page(1);
                                $scope.changeRecord['changeRecordQueryParams'].pageNo = 1;

                                //$scope.events.MainPageQueryList();
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        }, function (data) {
                            HB_dialog.error('提示', data.data.info);
                        });
                    },

                    toggleStatus: function (e) {
                        //$scope.changeRecord.changeRecordQueryParams.fetchAll
                        if (e.target.checked === true) {
                            $scope.changeRecord.changeRecordQueryParams.fetchAll = true;
                        } else {
                            $scope.changeRecord.changeRecordQueryParams.fetchAll = false;
                        }
                    },

                    openResumeSwapWindow: function (item) {
                        $scope.temporarySwapOrderNo = item.swapOrderNo;
                        $scope.confirmResumeSwapWindow.center().open();
                    },

                    resumeSwap: function () {
                        $scope.resumeSwapSubmitAble = true;
                        classInformationServices.resumeSwap($scope.temporarySwapOrderNo).then(function (data) {
                            $scope.resumeSwapSubmitAble = false;
                            if (data.status) {
                                HB_dialog.success('提示', '操作成功');
                                $scope.confirmResumeSwapWindow.close();
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        });
                    },

                    changeTitleLevel: function (id, disabledName, paramsName) {
                        console.log(id);
                        if (id === '5628812b569c57e001569c5ab5f60001') {
                            $scope.changeRecord[paramsName].learningType = -1;
                            $scope.changeRecord[disabledName] = true;
                        } else {
                            $scope.changeRecord[disabledName] = false;
                        }
                    }

                };

                //已报班级模板
                var changeClassTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: className #">');
                    result.push('#: className #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<div ng-repeat="subItem in dataItem.skuPropertyNameList">');
                    result.push('<span ng-bind="subItem.skuPropertyName"></span>：');
                    result.push('<span' +
                        ' ng-bind="subItem.skuPropertyValueName?subItem.skuPropertyValueName:\'-\'"></span>');
                    result.push('</div>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="#: dealPrice===null #">-</span>');
                    result.push('<span ng-if="#: dealPrice!==null #">#: dealPrice #</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="#: trainingResult===-1 #">待考核</span>');
                    result.push('<span ng-if="#: trainingResult===0 #">不合格</span>');
                    result.push('<span ng-if="#: trainingResult===1 #">合格</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="#: status===0 #">有效</span>');
                    result.push('<span ng-if="#: status===1 #">冻结</span>');
                    result.push('<span ng-if="#: status===2 #">失效</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="#: sourceType===\'TRANSFER\' #">迁移</span>');
                    result.push('<span ng-if="#: sourceType===\'SWAP\' #">换班</span>');
                    result.push('<span ng-if="#: sourceType===\'PURCHASE\' #">下单购买</span>');
                    result.push('<span ng-if="#: sourceType===\'BATCH\' #">集体缴费</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button has-permission="changeRecord/exchangeClass" type="button" ng-if="#: status===0&&trainingResult!==1&&sourceType!==\'BATCH\' #" class="table-btn" ng-click="events.swapTrainClass(dataItem)" >换班</button>');
                    result.push('<button has-permission="changeRecord/exchangeClass" type="button" ng-if="#: status!==0||trainingResult===1||sourceType===\'BATCH\'  #" style="color:darkgrey" class="table-btn">换班</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    changeClassTemplate = result.join('');
                })();

                $scope.changeClassGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(changeClassTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/customerService/getSwappableTrainClassPage',
                                    data: function (e) {
                                        var temp = {
                                            queryParam: {
                                                buyerId: $scope.changeRecord.buyedClassQueryParams.userId,
                                                productName: $scope.changeRecord.buyedClassQueryParams.className,
                                                trainingResult: $scope.changeRecord.buyedClassQueryParams.trainingResult
                                            },
                                            //needUserPayPrice:true,
                                            pageNo: e.page,
                                            pageSize: $scope.changeRecord.buyedClassQueryParams.pageSize
                                        };

                                        if (!$scope.skuParamsWaitChange) {
                                            temp.queryParam.skuPropertyList = undefined;
                                        } else {
                                            if (validateIsNull($scope.model.queryParam.classCategoryType)) {
                                                temp.queryParam.skuPropertyList = undefined;
                                            } else {
                                                temp.queryParam.skuPropertyList = $scope.skuParamsWaitChange.skuPropertyList;
                                            }
                                        }

                                        delete e.page;

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
                                    // 将会把这个返回的数组绑定到数据源当中
                                    $timeout(function () {
                                        $scope.markOne = true;
                                        if ($scope.markOne === true && $scope.markTwo === true) {
                                            $scope.model.mark = true;
                                        }
                                    });
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
                            //$scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
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
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'className', title: '班级名称'},
                            {sortable: false, field: 'className', title: '属性', width: 300},
                            {sortable: false, field: 'className', title: '单价（元）', width: 100},
                            {sortable: false, field: 'className', title: '考核情况', width: 100},
                            {sortable: false, field: 'status', title: '状态', width: 100},
                            {sortable: false, field: 'status', title: '来源类型', width: 100},
                            {
                                title: '操作',
                                width: 110
                            }
                        ]
                    }
                };

                //可换班级模板
                var canChangeTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: commodityName #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<div ng-repeat="subItem in dataItem.skuPropertyNameList">');
                    result.push('<span ng-bind="subItem.skuPropertyName"></span>：');
                    result.push('<span' +
                        ' ng-bind="subItem.skuPropertyValueName?subItem.skuPropertyValueName:\'-\'"></span>');
                    result.push('</div>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: credit #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: price === null?\'/\': price#');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.openSwapTrainWindow(dataItem)" >确认换班</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    canChangeTemplate = result.join('');
                })();
                $scope.canChangeGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(canChangeTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/customerService/getReplaceableTrainClassPage',
                                    data: function (e) {

                                        var temp = {
                                            queryParam: {
                                                sourceSkuId: $scope.changeRecord.canChangeQueryParams.commoditySkuId,
                                                trainClassName: $scope.changeRecord.canChangeQueryParams.className
                                            },
                                            //studentId:$scope.changeRecord.buyedClassQueryParams.userId,

                                            pageNo: e.page,
                                            pageSize: $scope.changeRecord.canChangeQueryParams.pageSize
                                        };

                                        if (!$scope.skuParamsCanChangeWindow) {
                                            temp.queryParam.skuPropertyList = undefined;
                                        } else {
                                            if (validateIsNull($scope.model.queryParam.classCategoryType)) {
                                                temp.queryParam.skuPropertyList = undefined;
                                            } else {
                                                temp.queryParam.skuPropertyList = $scope.skuParamsCanChangeWindow.skuPropertyList;
                                            }
                                        }

                                        $scope.changeRecord.canChangeQueryParams.pageNo = e.page;
                                        delete e.page;
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
                                    /*$timeout(function () {
                                     $scope.model.markTwo=true;
                                     if($scope.model.markOne && $scope.model.markTwo){
                                     $scope.model.mark = true;
                                     }
                                     });*/
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
                            //$scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
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
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'result', title: '可更换的目标的班级名称'},
                            {sortable: false, field: 'result', title: '属性', width: 200},
                            {sortable: false, field: 'result', title: '学时', width: 90},
                            {sortable: false, field: 'result', title: '价格（元）', width: 90},
                            {
                                title: '操作',
                                width: 100
                            }
                        ]
                    }
                };

                //换班记录模板
                var changeRecordTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: oldSubOrder.productName #">');
                    result.push('#: oldSubOrder.name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: oldSubOrder.dealPrice #');
                    result.push('</td>');

                    result.push('<td title="#: newTrainClassName?newTrainClassName:\'-\' #">');
                    result.push('#: newTrainClassName?newTrainClassName:\'-\' #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="#: status===1 #">审核中</span>');
                    result.push('<span ng-if="#: status===2 #">审核通过</span>');
                    result.push('<span ng-if="#: status===3 #">拒绝换货</span>');
                    result.push('<span ng-if="#: status===4 #">退货中</span>');
                    result.push('<span ng-if="#: status===5 #">退货成功</span>');
                    result.push('<span ng-if="#: status===6 #">新商品发货中</span>');
                    result.push('<span ng-if="#: status===7 #">换货成功</span>');
                    result.push('<span ng-if="#: status===8 #">退货失败</span>');
                    result.push('<span ng-if="#: status===9 #">发货失败</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: operateTime #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: creator.loginInput #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" has-permission="changeRecord/goOnchangeClass" ng-if="#: status===8 || status===9 #" class="table-btn"  ng-click="events.openResumeSwapWindow(dataItem)" >继续换班</button>');
                    result.push('<button type="button" has-permission="changeRecord/goOnchangeClass" ng-if="#: !(status===8 || status===9 ||status===7) #" style="color:darkgray" class="table-btn">继续换班</button>');
                    result.push('<span ng-if="#: status===7 #">-</span>');
                    result.push('</td>');

                    result.push('</tr>');
                    changeRecordTemplate = result.join('');
                })();
                $scope.changeRecordGrid = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(changeRecordTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/customerService/getSwapOrderPage',
                                    data: function (e) {
                                        var temp = {
                                            queryParam: {
                                                buyerId: $scope.changeRecord.buyedClassQueryParams.userId,
                                                oldProductName: $scope.changeRecord.changeRecordQueryParams.oldProductName,
                                                status: $scope.changeRecord.changeRecordQueryParams.status,
                                                fetchAll: $scope.changeRecord.changeRecordQueryParams.fetchAll,
                                                schemeType: 'TRAINING_CLASS'
                                            },
                                            pageNo: e.page,
                                            pageSize: $scope.changeRecord.changeRecordQueryParams.pageSize
                                        };
                                        if (!$scope.skuParamsChangeRecord) {
                                            temp.queryParam.skuPropertyList = undefined;
                                        } else {
                                            if (validateIsNull($scope.model.queryParam.classCategoryType)) {
                                                temp.queryParam.skuPropertyList = undefined;
                                            } else {
                                                temp.queryParam.skuPropertyList = $scope.skuParamsChangeRecord.skuPropertyList;
                                            }
                                        }
                                        $scope.changeRecord.changeRecordQueryParams.pageNo = e.page;
                                        delete e.page;
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
                                        $scope.markTwo = true;
                                        if ($scope.markOne === true && $scope.markTwo === true) {
                                            $scope.model.mark = true;
                                        }
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
                            //$scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
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
                            {
                                title: 'No',
                                width: 50
                            },
                            {sortable: false, field: 'name', title: '初始班级(换班前)'},
                            {sortable: false, field: 'result', title: '单价(元)', width: 90},
                            {sortable: false, field: 'result', title: '新班级(换班后)'},
                            {sortable: false, field: 'result', title: '换班状态', width: 100},
                            {sortable: false, field: 'result', title: '换班时间', width: 145},
                            {sortable: false, field: 'result', title: '操作账号', width: 200},
                            {
                                title: '操作',
                                width: 100
                            }
                        ]
                    }
                };

                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                };

            }]
    };
});