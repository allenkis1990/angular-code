define(function (siteOpening) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$timeout', 'hbUtil', 'siteOpeningServices', 'HB_dialog', '$http', function ($scope, $timeout, hbUtil, siteOpeningServices, HB_dialog, $http) {


            /*$http.get('/web/admin/userManage/findUserByQueryForOrder?name=123&pageNo=1&pageSize=10').success(function(){

             });*/

            console.log(siteOpeningServices);

            $scope.model = {

                studentInfoParams: {
                    name: '',
                    loginInput: '',
                    pageSize: 20,
                    pageNo: 1
                },

                configedQueryParam: {
                    year: -1,
                    titleLevel: -1,
                    className: '',
                    userId: ''
                },

                configedPage: {
                    pageNo: 1,
                    pageSize: 10
                },

                hasStudentList: false,
                stepTwo: false,

                userInfo: {},

                allChoseArr: [],
                hasChoseArr: []

            };

            //kendoPlus.studentInstance

            $scope.kendoPlus = {
                studentInstance: null,
                configedGridInstance: null
            };

            $scope.events = {
                MainPageQueryList: function (e) {
                    //e.stopPropagation();

                    if (validataIdcard($scope.model.studentInfoParams.loginInput)) {
                        //alert('身份证必须是大于4位的数字');
                        HB_dialog.warning('提示', '如果账号为数字，至少输入4位才能进行查询！');
                        return false;
                    }
                    $scope.model.lwhLoading = true;
                    $scope.model.studentInfoParams.pageNo = 1;
                    $scope.kendoPlus.studentInstance.pager.page(1);
                },

                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.MainPageQueryList(e);
                    }
                },

                queryEnableClass: function (e) {
                    //e.stopPropagation();
                    $scope.model.configedPage.pageNo = 1;
                    $scope.kendoPlus.configedGridInstance.pager.page(1);
                },

                openingClass: function (e, item) {
                    //console.log(item);
                    $scope.model.stepTwo = true;
                    var userId = item.userId;
                    //获取用户基本信息
                    siteOpeningServices.getUserInfo(userId).then(function (data) {
                        if (data.status) {
                            $scope.model.userInfo = data.info;
                        }
                    });

                    //获取可报班级
                    $scope.model.configedQueryParam.userId = userId;
                    $scope.model.configedPage.pageNo = 1;

                    //获取职称等级
                    $http.get('/web/admin/classOpen/getTitleLevelList?userId=' + userId).success(function (data) {
                        $scope.model.titleLevelList = [];
                        $scope.model.titleLevelList = data.info;
                        $scope.model.titleLevelList.unshift({name: '选择职称等级', optionId: -1});
                    });
                },

                cacelChose: function (e, item) {
                    var index = item.itemNo;
                    var arrItem = $scope.model.allChoseArr[index];
                    arrItem.ischecked = false;

                    var deleteIndex = findDeleteIndex(arrItem, $scope.model.hasChoseArr);
                    $scope.model.hasChoseArr.splice(deleteIndex, 1);
                },

                chose: function (e, item) {
                    var index = item.itemNo;
                    var arrItem = $scope.model.allChoseArr[index];
                    arrItem.ischecked = true;
                    $scope.model.hasChoseArr.push(arrItem);
                    console.log($scope.model.hasChoseArr);
                },

                hasChoseArrCacel: function (item, index) {
                    $scope.model.hasChoseArr.splice(index, 1);
                    var changeIscheckedIndex = findDeleteIndex(item, $scope.model.allChoseArr);
                    var arrItem = $scope.model.allChoseArr[changeIscheckedIndex];
                    console.log(changeIscheckedIndex);
                    arrItem.ischecked = false;
                },

                cleanAll: function () {
                    $scope.model.hasChoseArr = [];
                    angular.forEach($scope.model.allChoseArr, function (item) {
                        item.ischecked = false;
                    });
                },

                checkAll: function () {
                    $scope.model.hasChoseArr = [];
                    angular.forEach($scope.model.allChoseArr, function (item) {
                        item.ischecked = true;
                        $scope.model.hasChoseArr.push(item);
                    });
                },

                openTheClass: function () {
                    $scope.globle.confirm('系统提醒', '是否确认开通已选班级，确认系统将为学员开通相应班级！', function (dialog) {
                        var params = getOpenParams();

                        return siteOpeningServices.openTheClass($scope.model.configedQueryParam.userId, {skuPlaceInfoList: getOpenParams()}).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                HB_dialog.success('提示', '成功开班');
                                $scope.events.cleanAll();
                                $scope.model.configedPage.pageNo = 1;
                                $scope.kendoPlus.configedGridInstance.pager.page(1);
                            } else {
                                HB_dialog.warning('提示', data.info);
                                $scope.events.cleanAll();
                                $scope.model.configedPage.pageNo = 1;
                                $scope.kendoPlus.configedGridInstance.pager.page(1);
                            }
                        });

                    });
                },

                openZeroOrder: function () {
                    $scope.globle.confirm('系统提醒', '你要开通支付金额为0的订单？', function (dialog) {

                        return siteOpeningServices.openTheClass($scope.model.configedQueryParam.userId, {
                            zeroOrder: true,
                            skuPlaceInfoList: getOpenParams()
                        }).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                HB_dialog.success('提示', '成功开班');
                                $scope.events.cleanAll();
                                $scope.model.configedPage.pageNo = 1;
                                $scope.kendoPlus.configedGridInstance.pager.page(1);
                            } else {
                                HB_dialog.warning('提示', data.info);
                                $scope.events.cleanAll();
                                $scope.model.configedPage.pageNo = 1;
                                $scope.kendoPlus.configedGridInstance.pager.page(1);
                            }
                        });

                    });
                }

            };

            //HB_dialog.success('提示','成功开班');
            function findDeleteIndex (arrItem, mainArr) {
                var deleteIndex;
                angular.forEach(mainArr, function (dataItem, dataIndex) {
                    if (dataItem.commoditySkuId === arrItem.commoditySkuId) {
                        deleteIndex = dataIndex;
                    }
                });
                return deleteIndex;
            }

            function getOpenParams () {
                var paramsArr = [];
                for (var i = 0; i < $scope.model.hasChoseArr.length; i++) {
                    paramsArr.push({skuId: $scope.model.hasChoseArr[i].commoditySkuId, purchaseQuantity: 1});
                }
                return paramsArr;
            }

            //学员信息模板
            var studentInfoTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: identify #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-if="#: unitName===null|| unitName===\'\' || unitName===undefined#">-</span>');
                result.push('<span ng-if="#: unitName!==null&& unitName!==\'\' && unitName!==undefined#">#: unitName #</span>');
                //result.push('#: unitName #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-if="#: phoneNumber===null|| phoneNumber===\'\' || phoneNumber===undefined#">-</span>');
                result.push('<span ng-if="#: phoneNumber!==null&& phoneNumber!==\'\' && phoneNumber!==undefined#">#: phoneNumber #</span>');
                //result.push('#: phoneNumber #');
                result.push('</td>');

                result.push('<td title="#: department #">');
                result.push('<span ng-if="#: department==null|| department===\'\' || department===undefined#">-</span>');
                result.push('<span ng-if="#: department!==null&& department!==\'\' && department!==undefined#">#: department #</span>');
                //result.push('#: department #');
                result.push('</td>');
                //has-permission="siteOpening/openClass"
                result.push('<td>');
                result.push('<button type="button" has-permission="siteOpening/openClass" class="table-btn" ng-click="events.openingClass($event,dataItem)">开通班级</button>');
                result.push('</td>');

                result.push('</tr>');
                studentInfoTemplate = result.join('');
            })();

            $scope.studentInfoGrid = {
                options: {
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(studentInfoTemplate),
                    scrollable: false,
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/userManage/getUserBasicInfoForSiteOpening',
                                data: function (e) {
                                    var temp = {
                                        name: $scope.model.studentInfoParams.name,
                                        //identify: $scope.model.studentInfoParams.identify,
                                        loginInput: $scope.model.studentInfoParams.loginInput,
                                        pageNo: e.page,
                                        //page:$scope.model.page.pageNo,
                                        pageSize: $scope.model.studentInfoParams.pageSize
                                    };

                                    $scope.model.studentInfoParams.pageNo = e.page;
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
                                $scope.model.stepTwo = false;
                                $scope.model.lwhLoading = false;
                                if (response.info.length === 0) {
                                    $timeout(function () {
                                        $scope.model.hasStudentList = false;
                                    });
                                } else {
                                    $timeout(function () {
                                        $scope.model.hasStudentList = true;
                                        $scope.model.userResult = response.info;
                                        //$scope.events.chooseUse($scope.model.userResult[0]);
                                    });
                                }
                                ;
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
                        {field: 'name', title: '姓名', sortable: false, width: 100},
                        {field: 'identify', title: '身份证', sortable: false, width: 200},
                        {field: 'unitName', title: '单位名称', sortable: false},
                        {field: 'phoneNumber', title: '手机号', sortable: false, width: 120},
                        {field: 'department', title: '所属会计主管部门', sortable: false, width: 250},
                        {
                            title: '操作', width: 120
                        }
                    ]
                }
            };

            //已配置模板
            var configedGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td title="#:titleLevel#">');
                result.push('#:titleLevel#');
                result.push('</td>');

                result.push('<td title="#: commodityName #">');
                result.push('#: commodityName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: price #');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-if="model.allChoseArr[dataItem.itemNo].ischecked===false" ng-click="events.chose($event,dataItem)">选择</button>');
                result.push('<button type="button" class="table-btn" ng-if="model.allChoseArr[dataItem.itemNo].ischecked===true" ng-click="events.cacelChose($event,dataItem)">取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                configedGridRowTemplate = result.join('');
            })();

            $scope.enableClassGrid = {
                options: hbUtil.kdGridCommonOption({
                    template: configedGridRowTemplate,
                    url: '/web/admin/classOpen/getCustomersClassPage',
                    scope: $scope,
                    page: 'configedPage',
                    param: $scope.model.configedQueryParam,
                    fn: function (response) {
                        $scope.model.totalSize = response.totalSize;
                        $scope.model.allChoseArr = response.info;
                        angular.forEach($scope.model.allChoseArr, function (item) {
                            item.ischecked = false;
                        });
                        //console.log(response.info);

                        //$scope.model.allChoseArr=response.info;
                    },
                    columns: [

                        {field: 'titleLevel', title: '职称等级', sortable: false, width: 130},
                        {field: 'commodityName', title: '培训班名称', sortable: false},
                        {field: 'price', title: '价格', sortable: false, width: 80},
                        {
                            title: '操作', width: 96
                        }
                    ]
                })
            };

            //获取年度
            $http.get('/web/admin/commodityManager/getTrainingYearList').success(function (data) {
                $scope.model.yearList = [];
                $scope.model.yearList = data.info;
                $scope.model.yearList.unshift({name: '选择培训年度', optionId: -1});
            });

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

        }]

    };
});