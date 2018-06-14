define(['cooper'], function (cooper) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$http', '$dialog', 'myStudyService', function ($scope, $http, $dialog, myStudyService) {

            var cp = new cooper();
            var downloadUrlPrefix = null;

            $http.get('/web/front/trainingCertify/getDownLoadIp').success(function (data) {
                if (data.status) {
                    downloadUrlPrefix = data.info.downModelIP;
                } else {
                    $dialog.alert({
                        title: '提示',
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '获取下载地址失败，请重新进入界面'
                    });
                }
            });
            $scope.model = {
                categoryType: 'COURSE_SUPERMARKET_GOODS',//TRAINING_CLASS_GOODS
                offerMerge: true,
                canSelect: false,
                totalArchives: [],

                currentPage: 1,//当前第几页
                total: 10,//数据总条数 这个去后端拿
                maxSize: 5,//最多可见页数按钮5个
                itemsPerPage: 9,//每页显示8条 默认10条

                archivesAjaxData: [],

                currentSearchYear: '',
                currentSearchGrade: 0,
                currentSearchSubject: '',
                hasChoseGrade: 0,
                unitId:''

            };


            $scope.events = {


                skuSpecialDo: function (params) {
                    console.log(params);
                    var yearSkuInitList = params.initSkuItemObj.trainingYear;


                    if (params.$scope.yearSkuPropertyId) {
                        console.log(params.$scope.yearSkuPropertyId);
                        params.$scope.model['skuItem' + params.$scope.yearSkuPropertyId] = $.grep(yearSkuInitList, function (item) {
                            return item.name !== '全部';
                        });
                    }

                    if (params.item.eName === 'trainingYear') {


                        var eleModelIndex = findCommonIndex(params.eleModel.skuPropertyList, 'propertyId', params.item.skuPropertyId);
                        params.$scope.model['skuItem' + params.item.skuPropertyId] = $.grep(yearSkuInitList, function (item) {
                            return item.name !== '全部';
                        });

                        params.$scope.yearSkuPropertyId = params.item.skuPropertyId;
                        if (params.type === 'init') {

                            params.$scope.hideClearBtn = true;
                            params.item.hideAll = true;
                            params.hasChoseResult.push({
                                propertyId: params.eleModel.skuPropertyList[eleModelIndex].propertyId,
                                propertyIdName: params.item.cName,
                                value: params.$scope.model['skuItem' + params.item.skuPropertyId][0].optionId,
                                valueName: params.$scope.model['skuItem' + params.item.skuPropertyId][0].name,
                                hideBtn: true
                            });
                            params.item.model = params.$scope.model['skuItem' + params.item.skuPropertyId][0].optionId;
                            params.eleModel.skuPropertyList[eleModelIndex].value = params.$scope.model['skuItem' + params.item.skuPropertyId][0].optionId;
                            //console.log(params.$scope.model['skuItem' + params.item.skuPropertyId]);
                        }

                    }
                    console.log(yearSkuInitList);
                },


                printArchives: function () {
                    if ($scope.model.archivesAjaxData.length <= 0) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请选择培训证明'
                        });
                        return false;
                    }
                    if ($scope.submitAble) {
                        return false;
                    }
                    console.log($scope.model.archivesAjaxData);
                    printAndPreview();
                },


                mergePrintArchives: function () {

                    if ($scope.model.canSelect) {
                        if ($scope.model.archivesAjaxData.length <= 0) {
                            $dialog.alert({
                                title: '提示',
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '请选择培训证明'
                            });
                            return false;
                        }


                        if ($scope.model.archivesAjaxData.length > 10) {
                            $dialog.alert({
                                title: '提示',
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '一次预览/打印，一张A4格式证明最多只支持10本课程，无法打印或预览'
                            });
                            return false;
                        }


                        console.log($scope.model.archivesAjaxData);

                        if ($scope.submitAble) {
                            return false;
                        }
                        printAndPreview();


                    }

                    $scope.model.canSelect = true;
                },

                returnPre: function () {
                    $scope.model.canSelect = false;
                },


                selectArchive: function (item) {
                    if (!$scope.model.offerMerge) {
                        this.selectArchiveForOne(item);
                    } else {
                        this.selectArchiveForMany(item);
                    }
                },

                selectArchiveForOne: function (item) {
                    /*if($scope.model.offerMerge){
                     return false;
                     }*/
                    if(!item.supportPrint){
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '无培训证明模板无法打印，请联系客服'
                        });
                        return false;
                    }
                    $scope.model.archivesAjaxData = [item];


                    angular.forEach($scope.model.totalArchives, function (oItem) {
                        oItem.ischecked = false;
                    });

                    checkTheArchive();


                },

                selectArchiveForMany: function (item) {

                    if (!$scope.model.canSelect) {
                        return false;
                    }

                    if(!item.supportPrint){
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '无培训证明模板无法打印，请联系客服'
                        });
                        return false;
                    }

                    var index = findCommonIndex($scope.model.archivesAjaxData, 'onlyId', item.onlyId);
                    var parindex = findCommonIndex($scope.model.totalArchives, 'onlyId', item.onlyId);
                    if (index !== null) {
                        $scope.model.archivesAjaxData.splice(index, 1);
                        $scope.model.totalArchives[parindex].ischecked = false;
                        $scope.model.hasChoseGrade = fixZeroNum(Subtr($scope.model.hasChoseGrade, item.grade));
                    } else {
                        $scope.model.archivesAjaxData.push(item);
                        $scope.model.hasChoseGrade = fixZeroNum(accAdd($scope.model.hasChoseGrade, item.grade));
                        checkTheArchive();
                    }

                },
                selectArchiveAllOrNone: function (e) {
                    if (e.target.checked) {
                        $scope.model.selectAll = true;
                        $scope.model.archivesAjaxData = [];
                        angular.forEach($scope.model.totalArchives, function (item) {
                            if(item.supportPrint){
                                item.ischecked = true;
                                $scope.model.archivesAjaxData.push(item);
                            }else{
                                item.ischecked = false;
                            }
                        });
                        $scope.model.hasChoseGrade = 0;
                        angular.forEach($scope.model.archivesAjaxData, function (item) {
                            $scope.model.hasChoseGrade = fixZeroNum(accAdd($scope.model.hasChoseGrade, item.grade));
                        });
                    } else {
                        $scope.model.selectAll = false;
                        $scope.model.archivesAjaxData = [];
                        $scope.model.hasChoseGrade = 0;
                        angular.forEach($scope.model.totalArchives, function (item) {
                            item.ischecked = false;
                        });
                    }
                },

                getUserCoursePassedMessage: function () {
                    getUserCoursePassedMessage();
                }
            };


            $scope.$watch('skuParams', function (nv) {
                if (nv) {
                    console.log('fuck');
                    getUserCoursePassedMessage();

                }
            }, true);

            $scope.$watch('model.unitId',function(nv){
                if(nv){
                    getUserCoursePassedMessage();
                }
            });


            function checkTheArchive () {
                angular.forEach($scope.model.totalArchives, function (parItem) {
                    angular.forEach($scope.model.archivesAjaxData, function (childItem) {
                        if (parItem.onlyId === childItem.onlyId) {
                            parItem.ischecked = true;
                        }
                    });
                });
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


            //判断是否支持合并打印
            $http.get('/web/front/learningfiles/findPrintTogetherConfigure', {params: {type: 'course'}}).success(function (data) {
                if (data.status) {
                    $scope.model.offerMerge = data.info;
                    //初始化的时候如果不提供合并打印直接可以选证明了，如果提供则需要进入下一步才能选证明
                    if (!$scope.model.offerMerge) {
                        $scope.model.canSelect = true;
                    } else {
                        $scope.model.canSelect = false;
                    }
                }
            });

            /*$http.get('./js/@systemUrl@/js/modules/studyArchives/controllers/data.json').success(function(data){
                $scope.model.totalArchives=data.info;
                $scope.model.total=data.totalSize;
            });*/


            function getUserCoursePassedMessage () {
                if ($scope.skuParams) {
                    //每次切换SKU的时候清空已选的证明和学分,还有当前的学分
                    $scope.model.archivesAjaxData = [];
                    $scope.model.currentSearchGrade = 0;
                    $scope.model.hasChoseGrade = 0;
                    var params = {
                        skuPropertyList: $scope.skuParams.skuPropertyList,
                        unitId:$scope.model.unitId
                    };
                    var temp = {};
                    myStudyService.parseDo(angular, params, temp);

                }

                //console.log(temp);

                $scope.lwhLoading = true;
                $http.get('/web/front/learningfiles/userCoursePassedMessage',
                    {
                        params: temp ? temp : undefined
                    }
                ).success(function (data) {
                    $scope.lwhLoading = false;
                    if (data.status) {
                        $scope.model.totalArchives = data.info;
                        if ($scope.model.totalArchives.length > 0) {
                            $scope.model.currentSearchYear = $scope.model.totalArchives[0].year;
                            $scope.model.currentSearchSubject = $scope.model.totalArchives[0].subject;

                            angular.forEach($scope.model.totalArchives, function (item) {
                                item.onlyId=item.schemeId+'|'+item.courseId;
                                $scope.model.currentSearchGrade = fixZeroNum(accAdd($scope.model.currentSearchGrade, item.grade));
                            });
                            //console.log($scope.model.totalArchives);

                        } else {
                            $scope.model.currentSearchYear = '-';
                            $scope.model.currentSearchGrade = 0;
                            $scope.model.currentSearchSubject = '-';
                        }

                    }
                });


            }


            //打印
            function printAndPreview () {
                $scope.submitAble = true;
                $http.post('/web/front/learningfiles/getPrintFile', {
                    key: 100,
                    userCoursePassedMessage: $scope.model.archivesAjaxData,
                    printTogether: $scope.model.offerMerge
                }).success(function (data) {
                    $scope.submitAble = false;

                    if (data.status) {

                        var dataInfo = data.info;
                        var previewData = dataInfo.certifiedTemplatePreview,
                            url = dataInfo.defaultPdfPrintAddress;
                        cp.request({
                            sendData: previewData,
                            url: url,
                            containerId: 'preview'
                        }).then(function (back) {
                            if (back.status) {
                                var downloadUrl = downloadUrlPrefix + back.info.resourceUrl + back.info.path;
                                window.open(downloadUrl);
                            } else {
                                $dialog.alert({
                                    title: '提示',
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: data.messages
                                });
                            }
                        }, function () {
                        });
                    } else {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: data.messages
                        });
                    }


                });
            }


            function fixZeroNum (num) {
                var str = num + '',
                    arr = null,
                    floatNum = null,
                    floatArr = null;
                arr = str.split('.');
                floatNum = arr[1];
                var oNum = Number(num);
                if (floatNum) {
                    //console.log(floatNum.substr(1, 1));
                    floatArr = floatNum.split('');
                    if (floatArr.length === 1 && floatArr[0] === '0') {
                        return Number(oNum.toFixed(0));
                    }

                    if (floatArr.length === 1 && floatArr[0] !== '0') {
                        return Number(oNum.toFixed(1));
                    }

                    if (floatArr.length === 2 && floatArr[1] === '0' && floatArr[0] !== '0') {
                        return Number(oNum.toFixed(1));
                    }

                    if (floatArr.length === 2 && floatArr[1] !== '0') {
                        return Number(oNum.toFixed(2));
                    }

                    if (floatArr.length === 2 && floatArr[1] === '0' && floatArr[0] === '0') {
                        return Number(oNum.toFixed(0));
                    }
                    //console.log(floatArr);
                } else {
                    return Number(oNum.toFixed(0));
                }

            }

            //console.log(fixZeroNum('5.77'));


            //解决JS精度丢失问题
            function accAdd (arg1, arg2) {
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2));
                return ((arg1 * m + arg2 * m) / m).toFixed(2);
            }

            function Subtr (arg1, arg2) {
                var r1, r2, m, n;
                try {
                    r1 = arg1.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2));
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m).toFixed(n);
            }


        }]
    };
});