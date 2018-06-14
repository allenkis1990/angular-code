//sku模块
define(['angular'], function (angular) {
    'use strict';

    var unitCommon = angular.module('unitCommon', []);

    unitCommon.factory('hbUnitSelectService', ['Restangular',function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commonQuery');
        });
        return {
            getCurrentUserUnit:function(param){
                return base.one('getCurrentUserUnit').get(param);
            }
        };
    }]);

    unitCommon.directive('hbUnitSelect', [ '$rootScope', '$http', '$timeout', 'hbUtil', 'easyKendoDialog','hbUnitSelectService','HB_notification',
        function ( $rootScope, $http, $timeout, hbUtil, easyKendoDialog,hbUnitSelectService,HB_notification) {
            return {

                restrict: 'EA',
                replace:true,
                require: '?^ngModel',

                templateUrl: function (element, attrs) {
                    return attrs.templateurl || '@systemUrl@/templates/common/selectUnit/hb-unit-select-tpl.html';
                },

                scope: {
                    unitId: '=?',
                    defaultChoose:"@",
                    defaultUnitId:"@",
                    unitSetCallback:"&",
                    defaultTxt: "@",
                    iptLarge: "@",
                    /* 以下权限查询将会用到的参数*/
                    targetUnitId:'=?',
                    rangeType:'=?',
                    belongsType:'=?',
                    authorizedSearch:"@"
                },

                link: function ($scope, ele, attr, ngModelController) {
                    $scope.model = {
                        unitPage: {},
                        queryParam: {
                            /* 以下权限查询将会用到的参数*/
                            rangeType:$scope.rangeType,
                            belongsType:$scope.belongsType,
                            targetUnitId:$scope.targetUnitId
                        },
                        chooseAble:true
                    };
                    console.log("$scope.targetUnitId");
                    console.log($scope.targetUnitId);
                    $scope.events = {
                        clearModel: function (e) {
                            $scope.unitId = null;
                            $scope.unitName = null;
                        },
                        openSelectUnitWin: function (e) {
                            if($scope.model.chooseAble!==true){
                                return;
                            }
                            $scope.selectUnitWindow = easyKendoDialog.content({
                                templateUrl: '@systemUrl@/templates/common/selectUnit/choose-unit-dialog.html',
                                width: 800,
                                title: false
                            }, $scope);
                        },
                        MainPageQueryList: function (e, gridName) {
                            e.stopPropagation();
                            $scope.selectUnitWindow.kendoPlus[gridName].pager.page(1);
                        },
                        closeKendoWindow: function (windowName) {
                            if ($scope[windowName]) {
                                $scope[windowName].kendoDialog.close();
                            }
                        },
                        selectItem: function (e, item) {
                            $scope.unitId = item.id;
                            $scope.unitName = item.name;
                            if(hbUtil.validateIsNull($scope.unitSetCallback)===false){
                                $scope.unitSetCallback({unitId:item.id});
                            }
                            $scope.events.closeKendoWindow('selectUnitWindow');
                        },
                        cancelSelectItem: function (e, item) {
                            $scope.events.clearModel(e);
                        }
                    };
                    if($scope.defaultChoose==='true'){
                        $scope.model.chooseAble=false;
                        hbUnitSelectService.getCurrentUserUnit({specifiedUnitId:$scope.defaultUnitId}).then(function(data){
                            if(data.status){
                                $scope.unitId = data.info.unitId;
                                $scope.unitName = data.info.name;
                                if(hbUtil.validateIsNull($scope.unitSetCallback)===false){
                                    $scope.unitSetCallback({unitId:$scope.unitId});
                                }
                            }else{
                                HB_notification.showTip( data.info,'error');
                            }
                            $scope.model.chooseAble=true;
                        });
                        //$scope.$watch('unitId',function(newVal){
                        //    if(hbUtil.validateIsNull(newVal)){
                        //        $scope.model.chooseAble=false;
                        //        $scope.events.openSelectUnitWin();
                        //    }
                        //});
                    }else if(hbUtil.validateIsNull($scope.defaultUnitId)===false){
                        $scope.model.chooseAble=false;
                        hbUnitSelectService.getCurrentUserUnit({specifiedUnitId:$scope.defaultUnitId}).then(function(data){
                            if(data.status){
                                $scope.unitId = data.info.unitId;
                                $scope.unitName = data.info.name;
                                if(hbUtil.validateIsNull($scope.unitSetCallback)===false){
                                    $scope.unitSetCallback({unitId:$scope.unitId});
                                }
                            }else{
                                HB_notification.showTip( data.info,'error');
                            }
                            $scope.model.chooseAble=true;
                        });
                    }

                    $scope.utils = {
                        hasChoose: function (e, item) {
                            if (hbUtil.validateIsNull($scope.unitId)) {
                                return false;
                            }
                            if ($scope.unitId === item.id) {
                                return true;
                            }
                            return false;
                        },
                        validateIsNull:hbUtil.validateIsNull
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
                        result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                        result.push('</td>');

                        result.push('<td>');
                        result.push('<span title="#: affiliateUnitName?affiliateUnitName:\'-\' #">#:  affiliateUnitName?affiliateUnitName:\'-\' #</span>');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<button type="button"' +
                            ' ng-if="utils.hasChoose($event,dataItem)===true&&defaultChoose!==\'true\'"' +
                            ' ng-click="events.cancelSelectItem($event,dataItem)"  class="table-btn">取消选择</button>');
                        result.push('<button type="button" ng-if="utils.hasChoose($event,dataItem)===false" ng-click="events.selectItem($event,dataItem)"  class="table-btn">选择</button>');
                        result.push('<button type="button" ng-if="utils.hasChoose($event,dataItem)===true&&defaultChoose===\'true\'" disabled  class="table-btn">选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        unitTemplate = result.join('');
                    })();
                    var url;
                    if($scope.authorizedSearch == 'true'){
                        url='/web/admin/commonQuery/findAuthorizedUnitPage'
                    }else{
                        url='/web/admin/commonQuery/findItselfAndLowerLevelUnitPage';
                    }
                    $scope.unitGird = {
                        options: hbUtil.kdGridCommonOptionDIY({
                            template: unitTemplate,
                            url: url,
                            outSidePage: true,
                            scope: $scope,
                            page: 'unitPage',
                            param: $scope.model.queryParam,
                            fn: function (response) {
                                console.log(response);
                                $scope.configedArr = response.info;
                            },
                            columns: [
                                {field: 'commodityName', title: 'No.', width: 80, sortable: false},
                                {field: 'attr', title: '单位名称(全称)', sortable: false},
                                {field: 'onSaleState', title: '上级单位名称', sortable: false},
                                {
                                    title: '操作', width: 80
                                }
                            ]
                        })
                    };
                }
            };
        }]);

});
