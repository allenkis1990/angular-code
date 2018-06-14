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
    skuCommon.directive('hbSkuDirective', ['hbSkuService', '$http', '$rootScope', function (hbSkuService, $http, $rootScope) {
        return {
            templateUrl: function (element, attrs) {
                return attrs.templateurl;
            },
            scope: {
                callback: '&',
                lwhLoading: '=',
                categoryType: '=',
                clearEvent: '=?'
            },
            transclude: true,
            require: '?^ngModel',
            link: function ($scope, ele, attr, ngModelController) {


                function findSkuIndex (id, arr) {
                    var index = null;
                    angular.forEach(arr, function (item, itemIndex) {
                        if (item.propertyId === id) {
                            index = itemIndex;
                        }
                    });
                    return index;
                }

                //联动请求SKU列表
                function listSkuProperty (arr) {
                    $http.post('/web/portal/index/listSkuProperty', {
                        categoryType: $scope.categoryType,
                        propertyQueries: arr
                    }).success(function (data) {
                        if (data.status) {
                            //var arr=getFenleiSkuArr(data.info);
                            console.log($scope.skuviewList);
                            console.log(data.info);


                            angular.forEach($scope.skuviewList, function (aItem) {
                                console.log(data.info);
                                console.log(aItem.skuPropertyId);
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


                        }
                    });

                }


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


                function skuDirectiveDo () {
                    $scope.ajaxCount = 0;
                    $scope.hasChoseResult = [];
                    //$scope.skuviewList = hbSkuService.skuList;
                    $scope.model = {};
                    var eleModel = {};

                    $http.get('/web/portal/index/getSkuPropertyDetailList?categoryType=' + $scope.categoryType).success(function (data) {
                        if (data.status) {
                            $scope.skuviewList = data.info;
                            $scope.skuShowAll = skuShowAll() > 0 ? true : false;
                            doSomeThing(eleModel);
                        }
                    });


                    $scope.events = {


                        clearSearch: function () {
                            //触发清空筛选条件事件 暴露给控制器，控制培训结果等非SKU筛选条件
                            $scope.clearEvent = true;


                            if ($scope.skuShowAll) {
                                $scope.hasChoseResult = [];
                                angular.forEach($scope.skuviewList, function (item) {
                                    item.lwhIf = true;
                                });
                                angular.forEach(eleModel.skuPropertyList, function (item) {
                                    item.value = '';
                                });
                                ngModelController.$setViewValue(eleModel);
                                listSkuProperty([]);
                            }
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
                            listSkuProperty(result);

                        },


                        tabSearch: function (id, item, subItem) {
                            console.log(item);
                            console.log(subItem);
                            var index = findIndex(item.skuPropertyId, eleModel);
                            console.log(eleModel.skuPropertyList);

                            $scope.callback();


                            if (!$scope.skuShowAll) {
                                //不显示全部做得处理
                                item.model = id;
                                eleModel.skuPropertyList[index].value = id;
                                eleModel.skuPropertyList[index].valueCode = subItem.code;
                                var resultIndex = findCommonIndex($scope.hasChoseResult, 'propertyIdName', item.cName);

                                if (resultIndex === null) {
                                    $scope.hasChoseResult.push({
                                        propertyId: eleModel.skuPropertyList[index].propertyId,
                                        propertyIdName: item.cName,
                                        value: eleModel.skuPropertyList[index].value,
                                        valueName: subItem.name
                                    });
                                } else {
                                    $scope.hasChoseResult[resultIndex] = {
                                        propertyId: eleModel.skuPropertyList[index].propertyId,
                                        propertyIdName: item.cName,
                                        value: eleModel.skuPropertyList[index].value,
                                        valueName: subItem.name
                                    };
                                }

                                var hasNotAllLen = skuListHasNotAll();
                                if ($rootScope.skuSpecialFn) {
                                    $rootScope.skuSpecialFn(subItem.code, hasNotAllLen, $scope, eleModel, $scope.hasChoseResult);
                                }

                                /*listSkuProperty([{
                                    propertyId:eleModel.skuPropertyList[index].propertyId,
                                    value:eleModel.skuPropertyList[index].value
                                }]);*/


                            } else {
                                //显示全部做得处理
                                eleModel.skuPropertyList[index].value = id;
                                item.lwhIf = false;
                                $scope.hasChoseResult.push({
                                    propertyId: eleModel.skuPropertyList[index].propertyId,
                                    propertyIdName: item.cName,
                                    value: eleModel.skuPropertyList[index].value,
                                    valueName: subItem.name
                                });

                                var result = getResult();
                                listSkuProperty(result);
                            }


                            ngModelController.$setViewValue(eleModel);


                        }
                    };


                    //请求都加载完再给model赋值
                    $scope.$watch('ajaxCount', function (nv) {
                        if (nv) {
                            //alert(1);
                            if (nv >= $scope.skuviewList.length) {

                                //每个项目不同的~~
                                var hasNotAllLen = skuListHasNotAll();
                                console.log(eleModel.skuPropertyList);
                                angular.forEach(eleModel.skuPropertyList, function (aaaItem) {
                                    if ($rootScope.skuSpecialFn) {
                                        $rootScope.skuSpecialFn(aaaItem.valueCode, hasNotAllLen, $scope, eleModel, $scope.hasChoseResult);
                                    }
                                });
                                //每个项目不同的~~


                                console.log(eleModel);
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
                            tempObjName.propertyIdCode = item.eName;
                            tempObjName.valueCode = '';

                            eleModel.skuPropertyList.push(tempObjName);

                            $http.get('/web/portal/index/getAllSkuPropertyOption?skuPropertyId=' + item.skuPropertyId + '&onlyHasCommodity=true&categoryType=' + $scope.categoryType).success(function (data) {//categoryType='+$scope.categoryType

                                $scope.model['skuItem' + item.skuPropertyId] = data.info;

                                if ($scope.skuShowAll) {
                                    $scope.model['skuItem' + item.skuPropertyId].unshift({name: '全部', optionId: ''});
                                }


                                /**
                                 * 如果不显示全部代表每个sku都必选一个
                                 * 默认拿数组的第一个optionId
                                 */
                                if (!$scope.skuShowAll) {
                                    if (data.info.length > 0) {
                                        eleModel.skuPropertyList[index].value = data.info[0].optionId;
                                        eleModel.skuPropertyList[index].valueCode = data.info[0].code;
                                        item.model = data.info[0].optionId;

                                        $scope.hasChoseResult.push({
                                            propertyId: eleModel.skuPropertyList[index].propertyId,
                                            propertyIdName: item.cName,
                                            value: eleModel.skuPropertyList[index].value,
                                            valueName: data.info[0].name
                                        });


                                    }
                                }


                                ngModelController.$setViewValue(eleModel);

                                $scope.ajaxCount++;


                            });


                        });
                    }


                    //把打平的sku分类到各个数组
                    function getFenleiSkuArr (arr) {
                        var a = [];
                        angular.forEach(arr, function (item) {
                            a.push(item.propertyId);
                        });
                        return _.uniq(a);
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

                    //查看一下最外层SKU请求是否有不显示全部的
                    function skuListHasNotAll () {
                        var arr = [];
                        angular.forEach($scope.skuviewList, function (item) {
                            if (!item.showAll) {
                                arr.push(item);
                            }
                        });
                        return arr.length;
                    }


                    function skuValueAllNull (eleModel) {
                        var arr = [];
                        angular.forEach(eleModel.skuPropertyList, function (item) {
                            if (validateIsNull(item.value)) {
                                arr.push(item);
                            }
                        });
                        if (eleModel.skuPropertyList.length === arr.length) {
                            return true;
                        } else {
                            return false;
                        }

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