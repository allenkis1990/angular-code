define(['cooper'], function (cooper) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$http', '$dialog', function ($scope, $http, $dialog) {

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

                offerMerge: true,
                canSelect: false,
                totalArchives: [],

                currentPage: 1,//当前第几页
                total: 10,//数据总条数 这个去后端拿
                maxSize: 5,//最多可见页数按钮5个
                itemsPerPage: 9,//每页显示9条 默认10条

                archivesAjaxData: [],

                notSupportPrintItem:false,
                unitId:''

            };


            $scope.$watch('model.unitId',function(nv){
                if(nv){
                    $scope.model.pageNo=1;
                    getCertifiedList();
                }
            });

            $scope.events = {
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
                                content: '每次合并打印学习证明，最多支持10份'
                            });
                            return false;
                        }

                        console.log($scope.model.archivesAjaxData);
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

                    $scope.model.archivesAjaxData = [{
                        name: item.name,
                        userLearningResultId: item.userLearningResultId
                    }];


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
                    var index = findCommonIndex($scope.model.archivesAjaxData, 'userLearningResultId', item.userLearningResultId);
                    var parindex = findCommonIndex($scope.model.totalArchives, 'userLearningResultId', item.userLearningResultId);
                    if (index !== null) {
                        $scope.model.archivesAjaxData.splice(index, 1);
                        $scope.model.totalArchives[parindex].ischecked = false;
                    } else {
                        $scope.model.archivesAjaxData.push({name: item.name, userLearningResultId: item.userLearningResultId});
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
                                $scope.model.archivesAjaxData.push({name: item.name, userLearningResultId: item.userLearningResultId});
                            }else{
                                item.ischecked = false;
                            }

                        });
                    } else {
                        $scope.model.selectAll = false;
                        $scope.model.archivesAjaxData = [];
                        angular.forEach($scope.model.totalArchives, function (item) {
                            item.ischecked = false;
                        });
                    }
                },
                getCertifiedList: function () {
                    getCertifiedList();
                }
            };


            //打印
            function printAndPreview () {
                $scope.submitAble = true;
                $http.post('/web/front/trainingCertify/getCertifiedDetail', {
                    key: 10,
                    userLearningResultIds: $scope.model.archivesAjaxData,
                    isDownload: false,
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


            function checkTheArchive () {
                angular.forEach($scope.model.totalArchives, function (parItem) {
                    angular.forEach($scope.model.archivesAjaxData, function (childItem) {
                        if (parItem.userLearningResultId === childItem.userLearningResultId) {
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
            $http.get('/web/front/learningfiles/findPrintTogetherConfigure', {params: {type: 'class'}}).success(function (data) {
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


            function getCertifiedList () {
                //切换分页的时候先把提交的数组清空
                $scope.model.archivesAjaxData = [];
                $scope.lwhLoading = true;
                $http.get('/web/front/trainingCertify/getCertifiedList',
                    {
                        params: {
                            pageNo: $scope.model.currentPage,
                            pageSize: $scope.model.itemsPerPage,
                            unitId:$scope.model.unitId
                        }
                    }
                ).success(function (data) {
                    $scope.lwhLoading = false;
                    if (data.status) {
                        $scope.model.totalArchives = data.info;
                        $scope.model.total = data.totalSize;

                        //判断是否有不支持打印的模板
                        /*var arr=[];
                        angular.forEach($scope.model.totalArchives,function(item){
                            if(!item.supportPrint){
                                arr.push(item);
                            }
                        });//notSupportPrintItem
                        if(arr.length>0){
                            $scope.model.notSupportPrintItem=true;
                        }else{
                            $scope.model.notSupportPrintItem=false;
                        }*/
                    }
                });
            }

            getCertifiedList();





        }]
    };
});