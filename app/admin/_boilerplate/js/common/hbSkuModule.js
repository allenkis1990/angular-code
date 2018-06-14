//sku模块
define(['angular'], function (angular) {
    'use strict';

    var skuCommon = angular.module('skuCommon', []);

    skuCommon.factory('hbSkuService', [function () {
        return {
            kendoSkuDo: function (result) {
                angular.forEach(this.skuList, function (item) {
                    result.push('<div>');
                    result.push('<span>' + item.cName + '：</span>' + '<span ng-if="#:' + item.eName + '===null#">-</span>' + '<span ng-if="#:' + item.eName + '!==null#">#:' + item.eName + '#</span>');
                    result.push('<br />');
                    result.push('</div>');
                });
            }
        };
    }]);

    skuCommon.directive('hbSkuDirective', ['hbSkuService', '$rootScope', '$http', '$timeout', function (hbSkuService, $rootScope, $http, $timeout) {
        return {

            restrict: 'EA',

            require: '?^ngModel',

            templateUrl: function (element, attrs) {
                return attrs.templateurl || '@systemUrl@/templates/common/hb-sku-tpl.html';
            },

            scope: {
                ajaxInfo: '=?',
                selectDis: '=?',
                lwhif: '=?',
                categoryType: '=?',
                hideRequireSign: '@',
                hidePlaceHolder: '@',
                clearAll: '=?'
            },

            link: function ($scope, ele, attr, ngModelController) {


                var watcher1, watcher2, watcher3;
                $scope.$watch('categoryType', function (nv) {
                    if (nv) {
                        if (watcher1) {
                            watcher1();
                            watcher1 = null;
                        }
                        if (watcher2) {
                            watcher2();
                            watcher2 = null;
                        }
                        if (watcher3) {
                            watcher3();
                            watcher3 = null;
                        }
                        skuDirectiveDo();
                    } else {
                        if (nv === '') {
                            if (watcher1) {
                                watcher1();
                                watcher1 = null;
                            }
                            if (watcher2) {
                                watcher2();
                                watcher2 = null;
                            }
                            if (watcher3) {
                                watcher3();
                                watcher3 = null;
                            }
                            skuDirectiveDo();
                        }
                    }
                });

                function skuDirectiveDo () {

                    $scope.model = {};
                    $scope.lwhModel = attr.lwhmodel;
                    var eleModel = {};


                    watcher3 = $scope.$watch('clearAll', function (nv) {
                        //console.log(nv);
                        if (nv) {
                            //console.log(1);
                            if ($scope.skuList) {
                                console.log($scope.skuList);
                                angular.forEach($scope.skuList, function (item) {
                                    item[attr.lwhmodel] = '';
                                });

                                angular.forEach(eleModel.skuPropertyList, function (item) {
                                    item.value = '';
                                    item.valueCode = '';
                                });
                            }
                        }
                    });


                    $scope.ajaxCount = 0;

                    function findValueCode (arr, property, id) {
                        var valueCode = null;
                        angular.forEach(arr, function (item) {
                            if (item[property] === id) {
                                valueCode = item;
                            }
                        });
                        return valueCode;
                    }

                    $scope.events = {
                        changeSelect: function (item, a) {
                            console.log(a);
                            // console.log(item);
                            //$scope[item.model]=optionId;
                            item[attr.lwhmodel] = item[attr.lwhmodel] === null ? '' : item[attr.lwhmodel];

                            var valueCode = findValueCode($scope.model[item.listName], 'optionId', item[attr.lwhmodel]);
                            angular.forEach(eleModel.skuPropertyList, function (eachItem) {

                                if (eachItem.propertyId === item.skuPropertyId) {
                                    eachItem.value = item[attr.lwhmodel] === null ? '' : item[attr.lwhmodel];
                                    eachItem.valueCode = valueCode ? valueCode.code : '';
                                }

                            });


                            //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑
                            if ($rootScope.skuSpecialFn) {
                                $rootScope.skuSpecialFn(item, eleModel, $scope, attr);
                            }
                            //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑


                            console.log(eleModel);

                            ngModelController.$setViewValue(eleModel);
                        }


                    };


                    $http.get('/web/admin/commodityManager/getSkuPropertyDetailList?categoryType=' + $scope.categoryType).success(function (skuData) {
                        if (skuData.status) {
                            $scope.skuList = skuData.info;
                            doSomeThing();
                        }
                    });


                    if (attr.lwhif) {
                        $scope.$watch('lwhif', function (nv) {
                            if (!nv) {
                                angular.forEach($scope.skuList, function (item) {
                                    item[attr.lwhmodel] = '';
                                });
                            }
                        });
                    }


                    function doSomeThing () {
                        eleModel.skuPropertyList = [];
                        angular.forEach($scope.skuList, function (item) {
                            var tempObjName = {};
                            console.log(item);
                            tempObjName.propertyId = item.skuPropertyId;
                            tempObjName.value = '';
                            tempObjName.propertyIdCode = item.eName;
                            tempObjName.valueCode = '';
                            eleModel.skuPropertyList.push(tempObjName);

                            //初始化optionid都为''
                            item[attr.lwhmodel] = '';
                            //初始化都显示
                            item.lwhIf = true;


                            $http.get('/web/admin/commodityManager/getAllSkuPropertyOption', {
                                params: {
                                    skuPropertyId: item.skuPropertyId
                                }
                            }).success(function (data) {
                                //item.arr = data.info;
                                //item.arr.unshift ( { name: item.placeholder, optionId: -1 } );
                                $scope.model[item.listName] = data.info;
                                $scope.ajaxCount++;
                            });
                        });
                    }

                    //请求都加载完再给model赋值
                    watcher1 = $scope.$watch('ajaxCount', function (nv) {
                        if (nv) {
                            if (nv >= $scope.skuList.length) {


                                //////////~~~~~~SKU有回填的时候做得操作
                                watcher2 = $scope.$watch('ajaxInfo', function (nv) {
                                    if (nv) {
                                        eleModel.skuPropertyList = [];
                                        console.log(nv);
                                        console.log($scope.skuList);
                                        angular.forEach($scope.skuList, function (item) {
                                            angular.forEach(nv, function (nvItem) {
                                                var tempObjName = {};
                                                if (item.skuPropertyId === nvItem.propertyId) {
                                                    console.log(nvItem);
                                                    item[attr.lwhmodel] = nvItem.value;
                                                    tempObjName.propertyId = nvItem.propertyId;
                                                    tempObjName.value = nvItem.value === null ? '' : nvItem.value;
                                                    tempObjName.propertyIdCode = nvItem.propertyIdCode;
                                                    tempObjName.valueCode = nvItem.valueCode === null ? '' : nvItem.valueCode;
                                                    eleModel.skuPropertyList.push(tempObjName);
                                                }
                                            });
                                        });

                                        console.log(eleModel);

                                        //解决有回填的情况下切换类目ID后发现得到的指令SKU数组长度少于skulist的长度
                                        if (eleModel.skuPropertyList.length !== $scope.skuList.length) {
                                            /*var tempObjName={};
                                            console.log(item);
                                            tempObjName.skuPropertyKey=item.skuPropertyId;
                                            tempObjName.skuPropertyValue='';
                                            eleModel.skuPropertyList.push(tempObjName);*/
                                            eleModel.skuPropertyList = [];
                                            angular.forEach($scope.skuList, function (item) {
                                                eleModel.skuPropertyList.push({
                                                    propertyId: item.skuPropertyId,
                                                    value: '',
                                                    propertyIdCode: item.eName,
                                                    valueCode: ''
                                                });
                                            });
                                        }


                                        angular.forEach($scope.skuList, function (item) {


                                            //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑
                                            if ($rootScope.skuSpecialFn) {
                                                $rootScope.skuSpecialFn(item, eleModel, $scope, attr);
                                            }
                                            //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑

                                        });


                                        console.log(eleModel);

                                        //console.log($scope.skuList);

                                    }
                                });
                                //////////~~~~~~SKU有回填的时候做得操作


                                console.log(watcher2);

                                ngModelController.$setViewValue(eleModel);
                                console.log(eleModel);
                            }
                        }
                    });


                    function findIndex (arr, property, id) {
                        var index = null;
                        angular.forEach(arr, function (item, itemIndex) {
                            if (item[property] === id) {
                                index = itemIndex;
                            }
                        });
                        return index;
                    }
                }
            }
        };
    }]);

});


/*
function doProjectSpecial(item,eleModel,$scope,attr){
    //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑
    if(item.skuPropertyId===hbCommonService.subjectSkuPropertyId2){

        //SKULIST年度SKU所在的数组位置(最外层数组)
        var yearSkuIndex=findIndex($scope.skuList,'skuPropertyId',hbCommonService.yearSkuPropertyId);

        //科目所在的数组位置
        var subjectIndex=findIndex(eleModel.skuPropertyList,'propertyId',hbCommonService.subjectSkuPropertyId)|| findIndex(eleModel.skuPropertyList,'propertyId',hbCommonService.subjectSkuPropertyId2);
        console.log(subjectIndex);
        //年度所在的数组位置
        var yearIndex=findIndex(eleModel.skuPropertyList,'propertyId',hbCommonService.yearSkuPropertyId);


        //如果选中的科目是公需课或者请选择显示年度 否则隐藏年度
        if(eleModel.skuPropertyList[subjectIndex].value===hbCommonService.gxkId||eleModel.skuPropertyList[subjectIndex].value===hbCommonService.gxkId2||eleModel.skuPropertyList[subjectIndex].value===''){
            $scope.skuList[yearSkuIndex].lwhIf=true;
            if(attr.hidePlaceHolder&&eleModel.skuPropertyList[yearIndex].value===''&&eleModel.skuPropertyList[subjectIndex].value!==''&&
                (eleModel.skuPropertyList[subjectIndex].value!==hbCommonService.gxkId||eleModel.skuPropertyList[subjectIndex].value!==hbCommonService.gxkId2)){
                eleModel.skuPropertyList[yearIndex].value=$scope.model[$scope.skuList[yearSkuIndex].listName][0]?
                    $scope.model[$scope.skuList[yearSkuIndex].listName][0].optionId:'';
                $scope.skuList[yearSkuIndex][attr.lwhmodel]=$scope.model[$scope.skuList[yearSkuIndex].listName][0]?
                    $scope.model[$scope.skuList[yearSkuIndex].listName][0].optionId:'';
            }
            //alert(1);
        }else{
            //alert(2);
            $scope.skuList[yearSkuIndex].lwhIf=false;

            $scope.skuList[yearSkuIndex][attr.lwhmodel]='';
            eleModel.skuPropertyList[yearIndex].value='';
        }


    }
    //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑
}*/
