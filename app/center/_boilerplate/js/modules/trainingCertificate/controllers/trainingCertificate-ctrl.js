define(['cooper'], function (cooper) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$state', '$dialog', 'trainingCertificateService', '$timeout', function ($scope, $state, $dialog, trainingCertificateService, $timeout) {
            var cp = new cooper();
            var downloadUrlPrefix = null;
            trainingCertificateService.getDownLoadIp().then(function (data) {
                if (data.status) {
                    downloadUrlPrefix = data.info.downModelIP;
                } else {
                    $scope.globle.alert('提示', '获取下载地址失败，请重新进入界面');
                }
            });
            $scope.model = {
                //分页配置参数
                currentPage: 1,//当前第几页
                total: 0,//数据总条数
                maxSize: 5,//最多可见页数按钮5个
                itemsPerPage: 9,//每页显示1条 默认10条
                yearList: [],
                choseList: [],
                subjectList: [],
                ///web/front/trainCertify/getCertifiedList培训班列表假数据
                certifiedList: [],
                imgLoding: true,
                subjectOptionsId: -1,
                totalgrade: 0
            };
            $scope.events = {
                choose: function (e, item) {

                    if (e.target.checked === true) {
                        var Index = findIndex($scope.userPassedInfo, item);
                        $scope.userPassedInfo[Index].ischecked = true;

                        item.ischecked = true;
                        $scope.model.choseList.push(item);
                        $scope.model.total = $scope.model.choseList.length;
                        $scope.model.totalgrade += item.grade;
                    } else {
                        var Index = findIndex($scope.userPassedInfo, item);
                        $scope.userPassedInfo[Index].ischecked = false;
                        var index = findIndex($scope.model.choseList, item);
                        $scope.model.choseList[index].ischecked = false;
                        $scope.model.choseList.splice(index, 1);

                        $scope.model.total = $scope.model.choseList.length;
                        $scope.model.totalgrade -= item.grade;
                    }
                },

                selectAllOrNone: function (e) {
                    $scope.model.total = 0;
                    $scope.model.totalgrade = 0;
                    if (e.target.checked == true) {
                        selectAllOrNone(true, $scope.userPassedInfo);
                        cleanChoseData();
                        angular.forEach($scope.userPassedInfo, function (item) {

                            $scope.model.choseList.push(item);
                        });
                        $scope.model.total = $scope.model.choseList.length;
                        angular.forEach($scope.model.choseList, function (item) {

                            $scope.model.totalgrade = accAdd($scope.model.totalgrade, item.grade);


                        });


                    } else {
                        selectAllOrNone(false, $scope.userPassedInfo);
                        cleanChoseData();
                    }
                    //recountTotal();

                },

                preview: function () {
                    $state.go('states.trainingCertificate.dialogImg');
                },
                previewPdf: function (type) {
                    if ($scope.model.total > 10) {
                        $dialog.alert({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '最多只能选中十条记录'
                        });

                    } else if ($scope.model.total == 0) {
                        $dialog.alert({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请选择至少一条记录'
                        });

                    } else {
                        trainingCertificateService.getPrintFile($scope.model.choseList).then(function (data) {
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
                                        $scope.globle.alert('提示', data.messages);
                                    }
                                }, function () {
                                });
                            } else {
                                $scope.globle.alert('提示', data.messages);
                            }
                        });
                    }
                },
                print: function () {
                    if ($scope.model.total > 10) {
                        $dialog.alert({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '最多只能选中十条记录'
                        });

                    } else if ($scope.model.total == 0) {
                        $dialog.alert({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请选择至少一条记录'
                        });

                    } else {

                        trainingCertificateService.getPrintFile($scope.model.choseList).then(function (data) {

                            var dataInfo = data.info;
                            var previewData = dataInfo.certifiedTemplatePreview,
                                url = dataInfo.defaultPdfPrintAddress;
                            previewData.isDownload = true;
                            cp.request({
                                sendData: previewData,
                                url: url,
                                containerId: 'preview'
                            }).then(function () {
                            }, function () {
                            });
                        });
                    }
                },
                tabYear: function (item) {
                    selectAllOrNone(false, $scope.userPassedInfo);
                    cleanChoseData();
                    $scope.nowyear = item.name;
                    if ($scope.model.yearOptionsId === item.optionId) {
                        return false;
                    }

                    $scope.model.currentPage = 1;
                    $scope.model.yearOptionsId = item.optionId;

                    trainingCertificateService.getUserSubjectList($scope.model.yearOptionsId).then(function (data) {
                        $scope.model.subjectList = data.info;

                        $scope.model.subjectOptionsId = $scope.model.subjectList[0].optionId;
                        $scope.model.name = $scope.model.subjectList[0].name;
                        if ($scope.model.name === '公需课') {
                            $scope.model.type = 1;
                        } else if ($scope.model.name === '专业课') {
                            $scope.model.type = 2;
                        } else {
                            $scope.model.type = 0;
                        }
                        trainingCertificateService.getMyLearningCount({
                            trainingYear: $scope.model.yearOptionsId,
                            type: $scope.model.type
                        }).then(function (data) {
                            $scope.passInfo = data.info;
                        });
                        trainingCertificateService.userCoursePassedMessage({
                            trainingYear: $scope.model.yearOptionsId,
                            subjectId: $scope.model.subjectOptionsId
                        }).then(function (data) {
                            $scope.userPassedInfo = data.info;

                        });
                    });


                },
                tabSubject: function (item, name) {


                    selectAllOrNone(false, $scope.userPassedInfo);
                    cleanChoseData();
                    if ($scope.model.subjectOptionsId === item) {
                        return false;
                    }
                    $scope.model.currentPage = 1;
                    $scope.model.name = name;
                    $scope.model.subjectOptionsId = item;
                    trainingCertificateService.userCoursePassedMessage({
                        trainingYear: $scope.model.yearOptionsId,
                        subjectId: $scope.model.subjectOptionsId
                    }).then(function (data) {
                        $scope.userPassedInfo = data.info;

                    });
                    if ($scope.model.name === '公需课') {
                        $scope.model.type = 1;
                    } else if ($scope.model.name === '专业课') {
                        $scope.model.type = 2;
                    } else {
                        $scope.model.type = 0;
                    }
                    trainingCertificateService.getMyLearningCount({
                        trainingYear: $scope.model.yearOptionsId,
                        type: $scope.model.type
                    }).then(function (data) {
                        $scope.passInfo = data.info;
                    });


                },
                tabSubject1: function (item, name) {

                    $scope.model.subjectOptionsId = item.optionId;
                    selectAllOrNone(false, $scope.userPassedInfo);
                    cleanChoseData();

                    $scope.model.currentPage = 1;
                    $scope.model.name = item.name;

                    trainingCertificateService.userCoursePassedMessage({
                        trainingYear: $scope.model.yearOptionsId,
                        subjectId: $scope.model.subjectOptionsId
                    }).then(function (data) {
                        $scope.userPassedInfo = data.info;
                    });

                    /*     //选中专业课 没有年度
                         if($scope.model.name==='公需课'){
                             $scope.model.type=1;
                         }else if($scope.model.name==='专业课'){
                             $scope.model.type=2;
                         }else{
                             $scope.model.type=0;
                         }
                         trainingCertificateService.getMyLearningCount({
                             trainingYear:$scope.model.yearOptionsId,
                             type: $scope.model.type}).then(function(data){
                             $scope.passInfo=data.info;
                         })*/


                }
            };

            function findIndex (arr, item) {
                var index = null;
                angular.forEach(arr, function (dataItem, dataIndex) {
                    if (dataItem.$$hashKey === item.$$hashKey) {
                        index = dataIndex;
                    }
                });
                return index;
            }

            function selectAllOrNone (bol, arrName) {
                angular.forEach(arrName, function (item) {
                    if (item.disabled == false) {
                        item.ischecked = bol;
                    } else {
                        item.ischecked = bol;
                    }

                });
            }

            function cleanChoseData () {
                $scope.model.choseList = [];

            }

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
                return (arg1 * m + arg2 * m) / m;
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

            trainingCertificateService.getUserTrainingYearList().then(function (data) {
                if (data.info.length > 0) {
                    $scope.model.yearList = data.info;
                    $scope.model.yearOptionsId = $scope.model.yearList[0].optionId;
                    trainingCertificateService.getMyLearningCount({
                        trainingYear: $scope.model.yearOptionsId,
                        type: 0
                    }).then(function (data) {
                        $scope.passInfo = data.info;
                    });
                    trainingCertificateService.getUserSubjectList($scope.model.yearOptionsId).then(function (data) {
                        $scope.model.subjectList = data.info;
                        if ($state.is('states.trainingCertificate.dialogImg')) {
                            $scope.model.subjectOptionsId = $scope.model.subjectList[0].optionId;
                        }

                        trainingCertificateService.userCoursePassedMessage({
                            trainingYear: $scope.model.yearOptionsId,
                            subjectId: -1
                        }).then(function (data) {
                            $scope.userPassedInfo = data.info;

                        });
                    });
                    $scope.nowyear = $scope.model.yearList[0].name;
                }

            });


        }]
    };
});