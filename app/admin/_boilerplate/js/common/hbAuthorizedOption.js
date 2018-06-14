define(['angular'], function (angular) {
    "use strict";

    var authorizedOption = angular.module('authorizedOption', []);

    authorizedOption.factory('authorizedOptionService',['$http',function($http){
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commonQuery');
        });
        return {
            getCurrentUserUnit:function(){
                return base.one('getCurrentUserUnit').get();
            },
            findItselfAndLowerLevelUnitList:function(){
                return base.one('findItselfAndLowerLevelUnitList').get();
            }
        };
    }]);

    authorizedOption.directive('hbAuthorizedOption', ['$rootScope', 'hbUtil',
        function ($rootScope, hbUtil) {
            return {
                scope: {
                    queryParams: "=?",
                    lockRange:"@",//查询资源衍生数据锁定某个资源
                    lockRangeForRes:"@",//查询某个资源数据
                    useType:"@",
                    queryAll:"@",
                    changeUnitCallback:"&",
                    disableSpecialAccount:"@"
                },
                templateUrl: '@systemUrl@/templates/common/authorizedOption/authorizedOption.html',
                link: function ($scope) {
                    $scope.model = {
                        searchRange: [
                            {
                                name: "收款账号",
                                code: "merchantAccount",
                                show:true
                            },
                            {
                                name: "商品",
                                code: "commodity",
                                show:true
                            },
                            // {
                            //     name: "课程",
                            //     code: "course",
                            //     show:false
                            // },
                            // {
                            //     name: "课程包",
                            //     code: "coursePool",
                            //     show:false
                            // },
                            // {
                            //     name: "题库",
                            //     code: "examLibraries",
                            //     show:false
                            // },
                            //     name: "试卷",
                            //     code: "examPaper",
                            //     show:false
                            // },
                        ],
                        currentRangeName: "",
                        queryAll:$scope.queryAll
                    };
                    $scope.useTypeConstant = {
                        order:{
                            code:'order',
                            name:'订单'
                        },
                        bill:{
                            code:'bill',
                            name:'发票'
                        },
                        other:{
                            code:'other',
                            name:'其他'
                        }
                    };
                    $scope.utils = {
                        validateIsNull: hbUtil.validateIsNull
                    };
                    if (hbUtil.validateIsNull($scope.queryParams)) {
                        $scope.queryParams = {};
                    }
                    initRangeType();
                    if(hbUtil.validateIsNull($scope.useType)===true){
                        $scope.useType =$scope.useTypeConstant.other.code;
                    }
                    $scope.queryParams.useType= $scope.useType;
                    $scope.$watch('queryParams.rangeType', function (newVal) {
                        initBelongsType(newVal);
                        $scope.queryParams.authorizeToUnitId = "";
                        $scope.queryParams.authorizedFromUnitId = "";
                        $scope.queryParams.objectId = "";
                        if (hbUtil.validateIsNull(newVal) === false) {
                            angular.forEach($scope.model.searchRange, function (value, index) {
                                if (value.code === newVal) {
                                    $scope.model.currentRangeName = value.name;
                                }
                            });
                        }
                    });
                    $scope.$watch('queryParams.belongsType', function (newVal) {
                        $scope.queryParams.authorizeToUnitId = "";
                        $scope.queryParams.authorizedFromUnitId = "";
                        $scope.queryParams.objectId = "";
                        if($scope.lockRangeForRes==='commodity'||$scope.lockRangeForRes==='merchantAccount'
                            ||$scope.lockRangeForRes==='course'||$scope.lockRangeForRes==='coursePool'
                            ||$scope.lockRangeForRes==='examLibraries'){
                            $scope.queryParams.authorizedState=0;
                            delete $scope.queryParams.hasAuthorize;
                        }
                    });
                    $scope.events = {}
                    if(hbUtil.validateIsNull($scope.queryAll)===true){
                        $scope.model.queryAll=false;
                    }
                    if($scope.queryAll==='true'){
                        $scope.$watch('queryParams.targetUnitId', function (newVal) {
                            initRangeType();
                            initBelongsType();
                            if(hbUtil.validateIsNull($scope.changeUnitCallback)===false){
                                $scope.changeUnitCallback({unitId:newVal});
                            }
                        });
                    }

                    function initRangeType(){
                        $scope.queryParams.rangeType = null;
                        //lockRangeForRes优先于lockRange生效
                        if(hbUtil.validateIsNull($scope.lockRangeForRes)===false){
                            $scope.queryParams.rangeType= $scope.lockRangeForRes;
                        }else if(hbUtil.validateIsNull($scope.lockRange)===false){
                            $scope.queryParams.rangeType= $scope.lockRange;
                        }else{
                            $scope.queryParams.rangeType ='';
                        }
                    }

                    function initBelongsType(newVal){
                        if(hbUtil.validateIsNull(newVal)===true){
                            if($scope.queryParams.rangeType==='merchantAccount'){
                                $scope.queryParams.belongsType = "MYSELF";
                            }else{
                                $scope.queryParams.belongsType = "ALL";
                            }
                        }else{
                            if(newVal==='merchantAccount'){
                                $scope.queryParams.belongsType = "MYSELF";
                            }else{
                                $scope.queryParams.belongsType = "ALL";
                            }
                        }

                    }
                }
            }
        }
    ]);

    authorizedOption.directive('authorizedAccount', ['$rootScope', 'hbUtil', 'easyKendoDialog',
        function ($rootScope, hbUtil, easyKendoDialog) {
            return {
                replace: true,
                scope: {
                    defaultTxt: "@",
                    accountId: "=?",
                    queryParams: "=?"
                },
                templateUrl: '@systemUrl@/templates/common/authorizedOption/authorizedAccountButton.html',
                link: function ($scope) {

                    $scope.model = {
                        accountPage: {},
                        queryParam: {}
                    };

                    $scope.events = {
                        clearModel: function (e) {
                            $scope.accountId = null;
                        },
                        openSelectUnitWin: function (e) {
                            $scope.selectAccountWindow = easyKendoDialog.content({
                                templateUrl: '@systemUrl@/templates/common/authorizedOption/chooseAccountDialog.html',
                                width: 800,
                                title: false
                            }, $scope);
                        },
                        MainPageQueryList: function (e, gridName) {
                            e.stopPropagation();
                            $scope.selectAccountWindow.kendoPlus[gridName].pager.page(1);
                        },
                        closeKendoWindow: function (windowName) {
                            if ($scope[windowName]) {
                                $scope[windowName].kendoDialog.close();
                            }
                        },
                        selectItem: function (e, item) {
                            $scope.accountId = item.id;
                            $scope.accountName = item.accountAlias;
                            $scope.events.closeKendoWindow('selectAccountWindow');
                        },
                        cancelSelectItem: function (e, item) {
                            $scope.events.clearModel(e);
                        }
                    };

                    $scope.utils = {
                        hasChoose: function (e, item) {
                            if (hbUtil.validateIsNull($scope.accountId)) {
                                return false;
                            }
                            if ($scope.accountId === item.id) {
                                return true;
                            }
                            return false;
                        },
                        validateIsNull: hbUtil.validateIsNull
                    };


                    //单位列表模板
                    var unitTemplate = '';
                    (function () {
                        var result = [];
                        result.push('<tr>');


                        result.push('<td>');
                        result.push('#: index #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('<span title="#: accountAlias?accountAlias:\'-\' #">#: accountAlias?accountAlias:\'-\' #</span>');
                        result.push('</td>');

                        //result.push('<td>');
                        //result.push('<span title="#: affiliateUnitName?affiliateUnitName:\'-\' #">#:  affiliateUnitName?affiliateUnitName:\'-\' #</span>');
                        //result.push('</td>');


                        result.push('<td>');
                        result.push('<button type="button" ng-if="utils.hasChoose($event,dataItem)===true" ng-click="events.cancelSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                        result.push('<button type="button" ng-if="utils.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)"  class="table-btn">选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        unitTemplate = result.join('');
                    })();

                    $scope.unitGird = {
                        options: hbUtil.kdGridCommonOptionDIY({
                            template: unitTemplate,
                            url: '/web/admin/paymentAccount/getPaymentAccountPage',
                            //outsidePage: true,
                            scope: $scope,
                            page: 'accountPage',
                            param: $scope.model.queryParam,
                            fn: function (response) {
                                console.log(response);
                                $scope.configedArr = response.info;
                            },
                            columns: [
                                {field: 'commodityName', title: 'No.', width: 80, sortable: false},
                                {field: 'attr', title: '收款账号别名', sortable: false},
                                {
                                    title: '操作', width: 80
                                }
                            ]
                        })
                    };
                    $scope.$watch('accountId',function(newVal){
                        if(hbUtil.validateIsNull(newVal)===true){
                            $scope.accountName = null;
                        }
                    });
                    if(hbUtil.validateIsNull($scope.queryParams)===false){
                        $scope.$watch('queryParams.belongsType',function(newVal){
                            $scope.model.queryParam.belongsType = newVal;
                        });
                        $scope.$watch('queryParams.authorizeToUnitId',function(newVal){
                            $scope.model.queryParam.authorizeToUnitId = newVal;
                        });
                        $scope.$watch('queryParams.authorizedFromUnitId',function(newVal){
                            $scope.model.queryParam.authorizedFromUnitId = newVal;
                        });
                        $scope.$watch('queryParams.targetUnitId',function(newVal){
                            $scope.model.queryParam.targetUnitId = newVal;
                        });
                    }
                }
            }
        }
    ]);
    authorizedOption.directive('authorizedCommodity', ['$rootScope', 'hbUtil', 'easyKendoDialog',
        function ($rootScope, hbUtil, easyKendoDialog) {
            return {
                replace: true,
                scope: {
                    defaultTxt: "@",
                    commoditySkuId: "=?",
                    queryParams: "=?",
                },
                templateUrl: '@systemUrl@/templates/common/authorizedOption/authorizedCommodityButton.html',
                link: function ($scope) {

                    $scope.model = {
                        page: {},
                        queryParam: {
                            queryParam:{
                                categoryType: 'TRAINING_CLASS_GOODS', // 类目id
                                trainingSchemeEnabled: '-1', // 培训方案状态, -1表示不查询，0表示不启用，1表示启用
                                commoditySkuName: '', // 商品名称
                                commoditySkuState: '-1', // 上架状态 -1:全部 1已上架，2待上架，3已下架
                                saleState: '-1', // 售出否 -1全部，1已售，2未售
                                firstUpTimeMin: '', // 最小首次上架时间 yyyy-MM-dd
                                firstUpTimeMax: '' // 最大首次上架时间 yyyy-MM-dd
                            }
                        }
                    };

                    $scope.events = {
                        clearModel: function (e) {
                            $scope.commoditySkuId = null;
                        },
                        openSelectWin: function (e) {
                            $scope.selectCommodityWindow = easyKendoDialog.content({
                                templateUrl: '@systemUrl@/templates/common/authorizedOption/chooseCommodityDialog.html',
                                width: 800,
                                title: false
                            }, $scope);
                        },
                        MainPageQueryList: function (e, gridName) {
                            e.stopPropagation();
                            $scope.selectCommodityWindow.kendoPlus[gridName].pager.page(1);
                        },
                        closeKendoWindow: function (windowName) {
                            if ($scope[windowName]) {
                                $scope[windowName].kendoDialog.close();
                            }
                        },
                        selectItem: function (e, item) {
                            $scope.commoditySkuId = item.commoditySkuId;
                            $scope.commodityName = item.commodityName;
                            $scope.events.closeKendoWindow('selectCommodityWindow');
                        },
                        cancelSelectItem: function (e, item) {
                            $scope.events.clearModel(e);
                        }
                    };

                    $scope.utils = {
                        hasChoose: function (e, item) {
                            if (hbUtil.validateIsNull($scope.commoditySkuId)) {
                                return false;
                            }
                            if ($scope.commoditySkuId === item.commoditySkuId) {
                                return true;
                            }
                            return false;
                        },
                        validateIsNull: hbUtil.validateIsNull
                    };

                    //单位列表模板
                    var unitTemplate = '';
                    (function () {
                        var result = [];
                        result.push('<tr>');


                        result.push('<td>');
                        result.push('#: index #');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('<span title="#: commodityName?commodityName:\'-\' #">#: commodityName?commodityName:\'-\' #</span>');
                        result.push('</td>');
                        result.push('<td>');
                        result.push('<span title="#: trainingSchemeName?trainingSchemeName:\'-\' #">#: trainingSchemeName?trainingSchemeName:\'-\' #</span>');
                        result.push('</td>');

                        //result.push('<td>');
                        //result.push('<span title="#: affiliateUnitName?affiliateUnitName:\'-\' #">#:  affiliateUnitName?affiliateUnitName:\'-\' #</span>');
                        //result.push('</td>');

                        result.push('<td>');
                        result.push('<button type="button" ng-if="utils.hasChoose($event,dataItem)===true" ng-click="events.cancelSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                        result.push('<button type="button" ng-if="utils.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)"  class="table-btn">选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        unitTemplate = result.join('');
                    })();

                    $scope.commodityGird = {
                        options: hbUtil.kdGridCommonOptionDIY({
                            template: unitTemplate,
                            url: '/web/admin/commodityManager/getConfigDone',
                            outSidePage: true,
                            scope: $scope,
                            page: 'page',
                            param: $scope.model.queryParam,
                            fn: function (response) {
                                console.log(response);
                                $scope.configedArr = response.info;
                            },
                            columns: [
                                {field: 'no', title: 'No.', width: 80, sortable: false},
                                {field: 'trainingSchemeName', title: '商品名称', sortable: false},
                                {field: 'trainingSchemeName', title: '所属培训方案', sortable: false},
                                {
                                    title: '操作', width: 80
                                }
                            ]
                        })
                    };
                    if(hbUtil.validateIsNull($scope.queryParams)===false){
                        $scope.$watch('queryParams.belongsType',function(newVal){
                            $scope.model.queryParam.belongsType = newVal;
                        });
                        $scope.$watch('queryParams.authorizeToUnitId',function(newVal){
                            $scope.model.queryParam.authorizeToUnitId = newVal;
                        });
                        $scope.$watch('queryParams.authorizedFromUnitId',function(newVal){
                            $scope.model.queryParam.authorizedFromUnitId = newVal;
                        });
                        $scope.$watch('queryParams.targetUnitId',function(newVal){
                            $scope.model.queryParam.targetUnitId = newVal;
                        });
                    }

                    $scope.$watch('commoditySkuId',function(newVal){
                        if(hbUtil.validateIsNull(newVal)===true){
                            $scope.commodityName = null;
                        }
                    });
                }
            }
        }
    ]);
});