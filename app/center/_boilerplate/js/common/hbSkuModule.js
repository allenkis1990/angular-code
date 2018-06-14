//sku模块
define(['angular'], function (angular) {
    'use strict';

    var skuCommon = angular.module('skuCommon', []);

    skuCommon.factory('hbSkuService', ['$http', function ($http) {
        return {

            skuList: [
                {
                    cName: '年度',
                    eName: 'trainingYear',
                    listName: 'yearList',
                    showAll: true,
                    skuPropertyId: '5a3bc134658b41a2c18020351e69bac1',
                    isShow: true
                },
                {
                    cName: '类别',
                    eName: 'trainingType',
                    listName: 'typeList',
                    showAll: true,
                    skuPropertyId: '5a3bc134658b41a2c18020351e69bac2',
                    isShow: true
                },
                {
                    cName: '级别',
                    eName: 'trainingLevel',
                    listName: 'levelList',
                    showAll: true,
                    skuPropertyId: '5a3bc134658b41a2c18020351e69bac3',
                    isShow: true
                }
            ]
        };
    }]);


    skuCommon.directive('hbSkuviewDirective', ['hbSkuService', function (hbSkuService) {
        return {
            templateUrl: function (element, attrs) {
                return attrs.templateurl;
            },
            replace: true,
            link: function ($scope) {
                //$scope.skuviewList = hbSkuService.skuList;
            }
        };
    }]);

    //学习方案形式的类目ID培训班：35f84aea57d24cc299a397c1 自主选课:35f84aea57d24cc299a397c2
    //最外层年度Id 7a4847b2667e31d9e40652c4d14cdbc2
    //公需课Id 812b569c015628569c5a77f6a0316001 812b569c015628569c5a77f6a0316101
    skuCommon.directive('hbSkuDirective', ['hbSkuService', '$http', '$rootScope', '$q', function (hbSkuService, $http, $rootScope, $q) {
        return {
            templateUrl: function (element, attrs) {
                return attrs.templateurl;
            },
            scope: {
                callback: '&',
                lwhLoading: '=',
                categoryType: '=',
                hasChoseResult: '=?',//已选的SKU
                clearEvent: '=?',
                spectialFn: '&?'
            },
            transclude: true,
            require: '?^ngModel',
            link: function ($scope, ele, attr, ngModelController) {


                function skuDirectiveDo () {

                    $scope.initSkuItemObj = {};
                    $scope.hasChoseResult = [];

                    $scope.ajaxCount = 0;
                    //$scope.skuviewList = hbSkuService.skuList;
                    $scope.model = {};
                    var eleModel = {};

                    $http.get('/web/front/'+(attr.urlChunk?attr.urlChunk:'myClass')+'/listUserSkuProperty?categoryType=' + $scope.categoryType).success(function (data) {
                        if (data.status) {
                            $scope.skuviewList = data.info;
                            $scope.skuShowAll = skuShowAll() > 0 ? true : false;
                            doSomeThing(eleModel);
                        }
                    });


                    //sku是否有全部
                    function skuShowAll () {
                        var arr = [];
                        angular.forEach($scope.skuviewList, function (item) {
                            if (item.showAll) {
                                arr.push(item);
                            }
                        });
                        return arr.length;
                    }


                    //联动请求SKU列表
                    function listSkuPropertyAndValueByUser (arr) {

                        var defer = $q.defer(), promise = defer.promise;
                        $http.post('/web/front/'+(attr.urlChunk?attr.urlChunk:'myClass')+'/listSkuPropertyAndValueByUser', {
                            categoryType: $scope.categoryType,
                            propertyQueries: arr
                        }).success(function (data) {
                            if (data.status) {
                                //var arr=getFenleiSkuArr(data.info);
                                console.log($scope.skuviewList);
                                console.log(data.info);


                                angular.forEach($scope.skuviewList, function (aItem) {
                                    var skuIndex = findSkuIndex(aItem.skuPropertyId, angular.copy(data.info));
                                    console.log(skuIndex);

                                    if (skuIndex !== null) {
                                        $scope.model['skuItem' + aItem.skuPropertyId] = data.info[skuIndex].skuPropertyOptions;
                                        if ($scope.skuShowAll) {
                                            $scope.model['skuItem' + aItem.skuPropertyId].unshift({
                                                name: '全部',
                                                optionId: ''
                                            });
                                        }
                                    } else {
                                        $scope.model['skuItem' + aItem.skuPropertyId] = [];

                                    }
                                });


                                defer.resolve();

                            } else {
                                defer.reject();
                            }
                        });
                        return promise;
                    }


                    function getResult () {
                        var result = [];
                        angular.forEach($scope.hasChoseResult, function (dataItem) {
                            result.push({
                                propertyId: dataItem.propertyId,
                                value: dataItem.value
                            });
                        });
                        return result;
                    }


                    $scope.events = {


                        clearSearch: function () {
                            //触发清空筛选条件事件 暴露给控制器，控制培训结果等非SKU筛选条件
                            $scope.clearEvent = true;
                            $scope.hasChoseResult = [];
                            angular.forEach($scope.skuviewList, function (item) {
                                item.lwhIf = true;
                            });
                            angular.forEach(eleModel.skuPropertyList, function (item) {
                                item.value = '';
                            });
                            ngModelController.$setViewValue(eleModel);
                            listSkuPropertyAndValueByUser([]);
                        },

                        cacelSearch: function (item, $index) {
                            var skuPropertyIndex = findCommonIndex(eleModel.skuPropertyList, 'value', item.value);

                            var oIndex = findCommonIndex($scope.skuviewList, 'skuPropertyId', item.propertyId);
                            //关闭tab后搜索查询列表恢复显示
                            $scope.skuviewList[oIndex].lwhIf = true;


                            eleModel.skuPropertyList[skuPropertyIndex].value = '';
                            //eleModel.skuPropertyList[skuPropertyIndex].valueName='';
                            console.log(eleModel.skuPropertyList);
                            ngModelController.$setViewValue(eleModel);
                            $scope.hasChoseResult.splice($index, 1);
                            var result = getResult();
                            listSkuPropertyAndValueByUser(result).then(function () {


                                angular.forEach($scope.skuviewList, function (oItem) {
                                    if ($scope.spectialFn) {
                                        $scope.spectialFn({
                                            params: {
                                                eleModel: eleModel,
                                                item: oItem,
                                                hasChoseResult: $scope.hasChoseResult,
                                                initSkuItemObj: $scope.initSkuItemObj,
                                                $scope: $scope,
                                                type: 'search'
                                            }
                                        });
                                    }
                                });

                                ngModelController.$setViewValue(eleModel);
                            });

                        },


                        tabSearch: function (id, item, subItem, $index) {
                            //console.log(subItem);

                            var index = findIndex(item.skuPropertyId, eleModel);
                            console.log(eleModel.skuPropertyList);

                            eleModel.skuPropertyList[index].value = id;
                            if (!item.hideAll) {
                                item.lwhIf = false;
                                $scope.hasChoseResult.push({
                                    propertyId: eleModel.skuPropertyList[index].propertyId,
                                    propertyIdName: item.cName,
                                    value: eleModel.skuPropertyList[index].value,
                                    valueName: subItem.name
                                });
                            } else {
                                item.lwhIf = true;
                                item.model = id;

                                var resultIndex = findCommonIndex($scope.hasChoseResult, 'propertyId', item.skuPropertyId);
                                $scope.hasChoseResult[resultIndex] = {
                                    propertyId: eleModel.skuPropertyList[index].propertyId,
                                    propertyIdName: item.cName,
                                    value: eleModel.skuPropertyList[index].value,
                                    valueName: subItem.name,
                                    hideBtn: true
                                };
                                //console.log(subItem.optionId);
                                //console.log($scope.hasChoseResult);
                            }

                            //console.log(item);


                            var result = getResult();
                            listSkuPropertyAndValueByUser(result).then(function () {
                                if ($scope.spectialFn) {
                                    $scope.spectialFn({
                                        params: {
                                            eleModel: eleModel,
                                            item: item,
                                            hasChoseResult: $scope.hasChoseResult,
                                            initSkuItemObj: $scope.initSkuItemObj,
                                            $scope: $scope,
                                            type: 'search'
                                        }
                                    });
                                }
                                ngModelController.$setViewValue(eleModel);
                            });


                            //不显示全部做得处理
                            /*if(!$scope.skuShowAll){
                                item.model=id;
                            }*/
                            $scope.callback();

                        }
                    };


                    //请求都加载完再给model赋值
                    $scope.$watch('ajaxCount', function (nv) {
                        if (nv) {
                            if (nv >= $scope.skuviewList.length) {
                                console.log(eleModel);
                                angular.forEach($scope.skuviewList, function (item) {
                                    if ($scope.spectialFn) {
                                        $scope.spectialFn({
                                            params: {
                                                eleModel: eleModel,
                                                item: item,
                                                hasChoseResult: $scope.hasChoseResult,
                                                initSkuItemObj: $scope.initSkuItemObj,
                                                $scope: $scope,
                                                type: 'init'
                                            }
                                        });
                                    }
                                });


                                ngModelController.$setViewValue(eleModel);
                            }
                        }
                    });


                    function doSomeThing (eleModel) {
                        eleModel.skuPropertyList = [];
                        //console.log($scope.skuviewList);
                        angular.forEach($scope.skuviewList, function (item, index) {
                            //初始化optionid都为''
                            item.model = '';
                            item.lwhIf = true;
                            var tempObjName = {};
                            tempObjName.propertyId = item.skuPropertyId;
                            tempObjName.value = '';
                            //tempObjName.valueCode='';
                            //tempObjName.propertyIdCode=item.eName;

                            eleModel.skuPropertyList.push(tempObjName);


                            $http.get('/web/front/'+(attr.urlChunk?attr.urlChunk:'myClass')+'/listSkuPropertyOptionByUser?skuPropertyId=' + item.skuPropertyId + '&categoryType=' + $scope.categoryType).success(function (data) {
                                //alert(1);
                                $scope.model['skuItem' + item.skuPropertyId] = data.info;
                                if ($scope.skuShowAll) {
                                    $scope.model['skuItem' + item.skuPropertyId].unshift({name: '全部', optionId: ''});
                                }

                                $scope.initSkuItemObj[item.eName] = $scope.model['skuItem' + item.skuPropertyId];

                                $scope.ajaxCount++;


                                /**
                                 * 如果不显示全部代表每个sku都必选一个
                                 * 默认拿数组的第一个optionId
                                 */
                                /*if(!$scope.skuShowAll){

                                }*/


                            });


                        });
                    }


                    function findSkuIndex (id, arr) {
                        var index = null;
                        angular.forEach(arr, function (item, itemIndex) {
                            if (item.propertyId === id) {
                                index = itemIndex;
                            }
                        });
                        return index;
                    }


                    function findIndex (id, eleModel) {
                        var index = null;
                        angular.forEach(eleModel.skuPropertyList, function (dataItem, dataIndex) {
                            if (dataItem.propertyId === id) {
                                index = dataIndex;
                            }
                        });

                        return index;
                    }

                    function validateIsNull (obj) {
                        return (obj === '' || obj === undefined || obj === null);
                    }


                    //通用的查找INDEX的方法
                    function findCommonIndex (arr, property, id) {
                        var index = null;
                        angular.forEach(arr, function (item, itemIndex) {
                            if (item[property] === id) {
                                index = itemIndex;
                            }
                        });
                        return index;
                    }

                }


                $scope.$watch('categoryType', function (newVal) {
                    if (newVal) {
                        skuDirectiveDo();
                    }
                });


            }
        };


    }]);

});