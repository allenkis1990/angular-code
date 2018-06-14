define(function (myRealClass) {
    'use strict';
    return ['$scope', '$state', '$rootScope', '$dialog', '$stateParams', 'myRealClassService', '$timeout',
        function ($scope, $state, $rootScope, $dialog, $stateParams, myRealClassService, $timeout) {
            myRealClassService.getUserClassLearningInfo({classId: $stateParams.id}).then(function (response) {
                if (response.status) {
                    if (response.info == null || response.info.examinationResult != 1) {
                        $dialog.alert({
                            content: '尚未通过班级考核，暂无法申请证书',
                            title: '提示',
                            visible: true,
                            okValue: '确定',
                            ok: function () {
                                require.extUtil.openWindow(window, '/center/#/myRealClass/' + $stateParams.id);
                            }
                        });
                    } else {
                        $scope.IsReady = true;
                    }
                } else {
                    require.extUtil.openWindow(window, '/center/#/myRealClass/' + $stateParams.id);
                }
            });
            myRealClassService.getPrefixUrl().then(function (response) {
                if (response.status) {
                    $scope.prefixUrl = response.info.prefixUrl;
                }
            });
            $scope.dialog = {
                addDialog: {},
                detailDialog: {}
            };
            $scope.accepts = 'jpg,jpeg,png';
            $scope.scaleImage = {
                width: 60,
                height: 60
            };
            /*$scope.$watch("uploadModel.ZDLuoKuan", function (newValue) {
             if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
             $scope.uploadModel.ZDLuoKuanPic = newValue.newPath;
             $scope.uploadModel.ZDLuoKuanSmallPic = newValue.convertResult[0].url;
             }
             });
             $scope.$watch("uploadModel.ZDQiFeng", function (newValue) {
             if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
             $scope.uploadModel.ZDQiFengPic = newValue.newPath;
             $scope.uploadModel.ZDQiFengSmallPic = newValue.convertResult[0].url;
             }
             });*/
            $scope.$watch('uploadModel.ZDQiTa', function (newValue) {
                if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
                    if ($scope.uploadModel.ZDQiTaList.length > 9) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 260,
                            ok: function () {
                                return true;
                            },
                            content: '请上传不超过10张的完整制度照片'
                        });
                        return;
                    }
                    var qiTa = {
                        pic: newValue.newPath,
                        smallPic: newValue.convertResult[0].url
                    };
                    $scope.uploadModel.ZDQiTaList.push(qiTa);
                    console.log('ZDQiTaListLength: ', $scope.uploadModel.ZDQiTaList.length);
                    //$scope.uploadModel.ZDQiTaPic = newValue.newPath;
                    //$scope.uploadModel.ZDQiTaSmallPic = newValue.convertResult[0].url;
                }
            });
            $scope.$watch('uploadModel.DASTieMen', function (newValue) {
                if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
                    $scope.uploadModel.DASTieMenPic = newValue.newPath;
                    $scope.uploadModel.DASTieMenSmallPic = newValue.convertResult[0].url;
                }
            });
            $scope.$watch('uploadModel.DASTieChuang', function (newValue) {
                if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
                    $scope.uploadModel.DASTieChuangPic = newValue.newPath;
                    $scope.uploadModel.DASTieChuangSmallPic = newValue.convertResult[0].url;
                }
            });
            $scope.$watch('uploadModel.DASTiePiGui', function (newValue) {
                if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
                    $scope.uploadModel.DASTiePiGuiPic = newValue.newPath;
                    $scope.uploadModel.DASTiePiGuiSmallPic = newValue.convertResult[0].url;
                }
            });
            $scope.$watch('uploadModel.IdCard', function (newValue) {
                if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
                    $scope.uploadModel.IdCardPic = newValue.newPath;
                    $scope.uploadModel.IdCardSmallPic = newValue.convertResult[0].url;
                }
            });
            $scope.$watch('uploadModel.TongYiSheHuiXYDM', function (newValue) {
                if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
                    $scope.uploadModel.TongYiSheHuiXYDMPic = newValue.newPath;
                    $scope.uploadModel.TongYiSheHuiXYDMSmallPic = newValue.convertResult[0].url;
                }
            });
            $scope.$watch('uploadModel.QiYeFaRen', function (newValue) {
                if (newValue != undefined && newValue != null && newValue.convertResult != undefined && newValue.convertResult != null) {
                    $scope.uploadModel.QiYeFaRenPic = newValue.newPath;
                    $scope.uploadModel.QiYeFaRenSmallPic = newValue.convertResult[0].url;
                }
            });
            $scope.uploadModel = {
                ZDLuoKuan: null,
                ZDLuoKuanPic: '',
                ZDLuoKuanSmallPic: '',
                ZDQiFeng: null,
                ZDQiFengPic: '',
                ZDQiFengSmallPic: '',
                ZDQiTa: null,
                ZDQiTaList: [],
                ZDQiTaPic: '',
                ZDQiTaSmallPic: '',
                DASTieMen: null,
                DASTieMenPic: '',
                DASTieMenSmallPic: '',
                DASTieChuang: null,
                DASTieChuangPic: '',
                DASTieChuangSmallPic: '',
                DASTiePiGui: null,
                DASTiePiGuiPic: '',
                DASTiePiGuiSmallPic: '',
                IdCard: null,
                IdCardPic: '',
                IdCardSmallPic: '',
                TongYiSheHuiXYDM: null,
                TongYiSheHuiXYDMPic: '',
                TongYiSheHuiXYDMSmallPic: '',
                QiYeFaRen: null,
                QiYeFaRenPic: '',
                QiYeFaRenSmallPic: ''
            };
            $scope.model = {
                trainingId: $stateParams.id,
                certificateApplicationList: [],
                existWaiting: false,
                existPass: false,
                dto: {
                    trainClassId: $stateParams.id,
                    unitType: -1,
                    photos: []
                },
                detail: {},
                imgWindowTitle: '',
                originalImgUrl: ''
            }
            ;

            $scope.events = {
                changeUnitType: function (e) {
                    $scope.uploadModel.QiYeFaRen = null;
                    $scope.uploadModel.TongYiSheHuiXYDM = null;
                },
                loadCertificateApplication: function (e) {
                    console.log('trainingId: ', $scope.model.trainingId);
                    myRealClassService.findList({trainingId: $scope.model.trainingId}).then(function (data) {
                        if (data.code == 200) {
                            $scope.certificateApplicationList = data.info;
                            angular.forEach(data.info, function (item) {
                                if (item.status == 0) {
                                    $scope.model.existWaiting = true;
                                }
                                if (item.status == 1) {
                                    $scope.model.existPass = true;
                                }
                            });
                        }
                    });

                },
                showDetailDialog: function (e, id) {
                    e.preventDefault();
                    myRealClassService.findById({id: id}).then(function (data) {
                        if (data.status) {
                            $scope.model.detail = data.info;
                            $scope.events.setPhotoUrl(data.info);
                            $dialog.contentDialog({
                                title: '查看',
                                visible: true,
                                modal: true,
                                contentUrl: '@systemUrl@/views/myRealClass/certificateApplicationDetail.html',
                                onclose: function () {
                                    $scope.model.detail = {};
                                }
                            }, $scope).then(function (data) {
                                $scope.dialog.detailDialog = data;
                            });
                        }
                    });
                },
                showAddDialog: function (e) {
                    if ($scope.model.existPass) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 260,
                            ok: function () {
                                return true;
                            },
                            content: '已有申请通过审核，无需再提交'
                        });
                        return;
                    }
                    if ($scope.model.existWaiting) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 260,
                            ok: function () {
                                return true;
                            },
                            content: '已有申请处于待审核状态，毋需重复提交'
                        });
                        return;
                    }
                    $dialog.contentDialog({
                        title: '提交申请',
                        visible: true,
                        modal: true,
                        contentUrl: '@systemUrl@/views/myRealClass/certificateApplicationAdd.html',
                        onclose: function () {
                            $scope.events.resetDtoModel();
                            $scope.events.resetUploadModel();
                        }
                    }, $scope).then(function (data) {
                        $scope.dialog.addDialog = data;
                    });
                },
                doAdd: function (e) {
                    e.preventDefault();
                    if ($scope.model.dto.unitType == -1) {
                        $dialog.alert({
                            modal: true,
                            visible: true,
                            content: '请选择单位类型',
                            width: 200,
                            okValue: '确定', ok: function () {
                            },
                            title: '提示'
                        });
                        return;
                    }
                    if (!$scope.events.photoValidate()) {
                        $dialog.alert({
                            modal: true,
                            visible: true,
                            content: '尚有部分信息未填列完整，请确认后再行提交。',
                            width: 300,
                            okValue: '确定', ok: function () {
                            },
                            title: '尚有信息未填列完整，无法提交'
                        });
                        return;
                    }

                    $scope.model.dto.photos = [];
                    $scope.events.setPhotoList();

                    myRealClassService.createCertificateApplication($scope.model.dto).then(function (data) {
                        if (data.status) {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '提交成功！'
                            });
                            $scope.events.closeAddDialog(null, 'addDialog');
                        } else {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: data.info
                            });
                        }
                    });
                },
                showEditDialog: function (e, id) {
                    if ($scope.model.existPass) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 260,
                            ok: function () {
                                return true;
                            },
                            content: '已有申请通过审核，无需再提交'
                        });
                        return;
                    }
                    if ($scope.model.existWaiting) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 260,
                            ok: function () {
                                return true;
                            },
                            content: '已有申请处于待审核状态，毋需重复提交'
                        });
                        return;
                    }
                    myRealClassService.findById({id: id}).then(function (data) {
                        if (data.status) {
                            $scope.model.dto.unitType = data.info.unitType;
                            $scope.events.setPhotoUrl(data.info);
                            $dialog.contentDialog({
                                title: '提交申请',
                                visible: true,
                                modal: true,
                                contentUrl: '@systemUrl@/views/myRealClass/certificateApplicationAdd.html',
                                onclose: function () {
                                    $scope.events.resetDtoModel();
                                    $scope.events.resetUploadModel();
                                }
                            }, $scope).then(function (data) {
                                $scope.dialog.addDialog = data;
                            });
                        }
                    });
                },
                isEmpty: function (str) {
                    if (str == undefined || str == null || str.length == 0) {
                        return true;
                    }
                    return false;
                },
                photoValidate: function () {
                    var picUrl = '';
                    var picSmallUrl = '';
                    /*var picUrl = $scope.uploadModel.ZDLuoKuanPic;
                     var picSmallUrl = $scope.uploadModel.ZDLuoKuanSmallPic;
                     if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                     return false;
                     }
                     picUrl = $scope.uploadModel.ZDQiFengPic;
                     picSmallUrl = $scope.uploadModel.ZDQiFengSmallPic;
                     if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                     return false;
                     }*/
                    /*picUrl = $scope.uploadModel.ZDQiTaPic;
                     picSmallUrl = $scope.uploadModel.ZDQiTaSmallPic;
                     if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                     return false;
                     }*/
                    var qitaList = $scope.uploadModel.ZDQiTaList;
                    if (qitaList == undefined || qitaList == null || qitaList.length == 0) {
                        return false;
                    }
                    picUrl = $scope.uploadModel.DASTieMenPic;
                    picSmallUrl = $scope.uploadModel.DASTieMenSmallPic;
                    if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                        return false;
                    }
                    picUrl = $scope.uploadModel.DASTieChuangPic;
                    picSmallUrl = $scope.uploadModel.DASTieChuangSmallPic;
                    if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                        return false;
                    }
                    picUrl = $scope.uploadModel.DASTiePiGuiPic;
                    picSmallUrl = $scope.uploadModel.DASTiePiGuiSmallPic;
                    if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                        return false;
                    }
                    picUrl = $scope.uploadModel.IdCardPic;
                    picSmallUrl = $scope.uploadModel.IdCardSmallPic;
                    if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                        return false;
                    }
                    switch ($scope.model.dto.unitType.toString()) {
                        case '1':
                        case '2':
                        case '3':
                            picUrl = $scope.uploadModel.TongYiSheHuiXYDMPic;
                            picSmallUrl = $scope.uploadModel.TongYiSheHuiXYDMSmallPic;
                            if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                                return false;
                            }
                            break;
                        case '4':
                            picUrl = $scope.uploadModel.QiYeFaRenPic;
                            picSmallUrl = $scope.uploadModel.QiYeFaRenSmallPic;
                            if ($scope.events.isEmpty(picUrl) || $scope.events.isEmpty(picSmallUrl)) {
                                return false;
                            }
                            break;
                        default:
                            return false;
                    }

                    return true;
                },
                setPhotoList: function () {
                    var photo = {};
                    /*photo = {
                     type: 0,
                     pic: $scope.uploadModel.ZDLuoKuanPic,
                     smallPic: $scope.uploadModel.ZDLuoKuanSmallPic
                     }
                     $scope.model.dto.photos.push(photo);
                     photo = {
                     type: 1,
                     pic: $scope.uploadModel.ZDQiFengPic,
                     smallPic: $scope.uploadModel.ZDQiFengSmallPic
                     }
                     $scope.model.dto.photos.push(photo);*/
                    /*photo = {
                     type: 2,
                     pic: $scope.uploadModel.ZDQiTaPic,
                     smallPic: $scope.uploadModel.ZDQiTaSmallPic
                     }
                     $scope.model.dto.photos.push(photo);*/
                    angular.forEach($scope.uploadModel.ZDQiTaList, function (item) {
                        photo = {
                            type: 2,
                            pic: item.pic,
                            smallPic: item.smallPic
                        };
                        $scope.model.dto.photos.push(photo);
                    });
                    photo = {
                        type: 3,
                        pic: $scope.uploadModel.DASTieMenPic,
                        smallPic: $scope.uploadModel.DASTieMenSmallPic
                    };
                    $scope.model.dto.photos.push(photo);
                    photo = {
                        type: 4,
                        pic: $scope.uploadModel.DASTieChuangPic,
                        smallPic: $scope.uploadModel.DASTieChuangSmallPic
                    };
                    $scope.model.dto.photos.push(photo);
                    photo = {
                        type: 5,
                        pic: $scope.uploadModel.DASTiePiGuiPic,
                        smallPic: $scope.uploadModel.DASTiePiGuiSmallPic
                    };
                    $scope.model.dto.photos.push(photo);
                    photo = {
                        type: 6,
                        pic: $scope.uploadModel.IdCardPic,
                        smallPic: $scope.uploadModel.IdCardSmallPic
                    };
                    $scope.model.dto.photos.push(photo);
                    switch ($scope.model.dto.unitType.toString()) {
                        case '1':
                        case '2':
                        case '3':
                            photo = {
                                type: 7,
                                pic: $scope.uploadModel.TongYiSheHuiXYDMPic,
                                smallPic: $scope.uploadModel.TongYiSheHuiXYDMSmallPic
                            };
                            $scope.model.dto.photos.push(photo);
                            break;
                        case '4':
                            photo = {
                                type: 7,
                                pic: $scope.uploadModel.QiYeFaRenPic,
                                smallPic: $scope.uploadModel.QiYeFaRenSmallPic
                            };
                            $scope.model.dto.photos.push(photo);
                            break;
                        default:
                            break;
                    }
                },
                setPhotoUrl: function (obj) {
                    $scope.uploadModel.ZDQiTaList = [];
                    if (obj.photos != undefined && obj.photos != null) {
                        angular.forEach(obj.photos, function (item) {
                            switch (item.type) {
                                case 0:
                                    /*$scope.uploadModel.ZDLuoKuan = {};
                                     $scope.uploadModel.ZDLuoKuanPic = item.pic;
                                     $scope.uploadModel.ZDLuoKuanSmallPic = item.smallPic;*/
                                    break;
                                case 1:
                                    /*$scope.uploadModel.ZDQiFeng = {};
                                     $scope.uploadModel.ZDQiFengPic = item.pic;
                                     $scope.uploadModel.ZDQiFengSmallPic = item.smallPic;*/
                                    break;
                                case 2:
                                    $scope.uploadModel.ZDQiTa = {};
                                    var qiTa = {
                                        pic: item.pic,
                                        smallPic: item.smallPic
                                    };
                                    $scope.uploadModel.ZDQiTaList.push(qiTa);
                                    /*$scope.uploadModel.ZDQiTaPic = item.pic;
                                     $scope.uploadModel.ZDQiTaSmallPic = item.smallPic;*/
                                    break;
                                case 3:
                                    $scope.uploadModel.DASTieMen = {};
                                    $scope.uploadModel.DASTieMenPic = item.pic;
                                    $scope.uploadModel.DASTieMenSmallPic = item.smallPic;
                                    break;
                                case 4:
                                    $scope.uploadModel.DASTieChuang = {};
                                    $scope.uploadModel.DASTieChuangPic = item.pic;
                                    $scope.uploadModel.DASTieChuangSmallPic = item.smallPic;
                                    break;
                                case 5:
                                    $scope.uploadModel.DASTiePiGui = {};
                                    $scope.uploadModel.DASTiePiGuiPic = item.pic;
                                    $scope.uploadModel.DASTiePiGuiSmallPic = item.smallPic;
                                    break;
                                case 6:
                                    $scope.uploadModel.IdCard = {};
                                    $scope.uploadModel.IdCardPic = item.pic;
                                    $scope.uploadModel.IdCardSmallPic = item.smallPic;
                                    break;
                                case 7:
                                    switch (obj.unitType) {
                                        case 1:
                                        case 2:
                                        case 3:
                                            $scope.uploadModel.TongYiSheHuiXYDM = {};
                                            $scope.uploadModel.TongYiSheHuiXYDMPic = item.pic;
                                            $scope.uploadModel.TongYiSheHuiXYDMSmallPic = item.smallPic;
                                            break;
                                        case 4:
                                            $scope.uploadModel.QiYeFaRen = {};
                                            $scope.uploadModel.QiYeFaRenPic = item.pic;
                                            $scope.uploadModel.QiYeFaRenSmallPic = item.smallPic;
                                            break;
                                    }
                                    break;
                            }
                        });
                    }
                },
                resetDtoModel: function () {
                    console.log('Reset DtoModel...');
                    $scope.model.dto = {
                        trainClassId: $stateParams.id,
                        unitType: -1,
                        photos: []
                    };
                },
                deleteUploadModel: function (e, name) {
                    $scope.uploadModel[name] = null;
                    $scope.uploadModel[name + 'Pic'] = '';
                    $scope.uploadModel[name + 'SmallPic'] = '';
                },
                deleteQiTa: function (e, obj) {
                    $scope.uploadModel.ZDQiTa = null;
                    var newList = [];
                    angular.forEach($scope.uploadModel.ZDQiTaList, function (item) {
                        if (item.pic != obj.pic) {
                            newList.push(item);
                        }
                    });
                    $scope.uploadModel.ZDQiTaList = newList;
                },
                resetUploadModel: function () {
                    console.log('Reset UploadModel...');
                    $scope.uploadModel = {
                        ZDLuoKuan: null,
                        ZDLuoKuanPic: '',
                        ZDLuoKuanSmallPic: '',
                        ZDQiFeng: null,
                        ZDQiFengPic: '',
                        ZDQiFengSmallPic: '',
                        ZDQiTa: null,
                        ZDQiTaList: [],
                        ZDQiTaPic: '',
                        ZDQiTaSmallPic: '',
                        DASTieMen: null,
                        DASTieMenPic: '',
                        DASTieMenSmallPic: '',
                        DASTieChuang: null,
                        DASTieChuangPic: '',
                        DASTieChuangSmallPic: '',
                        DASTiePiGui: null,
                        DASTiePiGuiPic: '',
                        DASTiePiGuiSmallPic: '',
                        IdCard: null,
                        IdCardPic: '',
                        IdCardSmallPic: '',
                        TongYiSheHuiXYDM: null,
                        TongYiSheHuiXYDMPic: '',
                        TongYiSheHuiXYDMSmallPic: '',
                        QiYeFaRen: null,
                        QiYeFaRenPic: '',
                        QiYeFaRenSmallPic: ''
                    };
                },
                closeAddDialog: function (e, dialogName) {
                    $scope.events.closeDialogDo(dialogName);
                    $scope.events.resetDtoModel();
                    $scope.events.resetUploadModel();
                    $scope.events.loadCertificateApplication(e);
                },
                closeDetailDialog: function (e, dialogName) {
                    $scope.events.closeDialogDo(dialogName);
                    $scope.model.detail = {};
                },
                closeDialogDo: function (dialogName, fn) {
                    $scope.dialog[dialogName].remove();
                    if (fn !== undefined) {
                        fn();
                    }
                },
                showImgWindow: function (e, title, path) {
                    $scope.model.imgWindowTitle = title;
                    if (!$scope.events.isEmpty(path)) {
                        $scope.model.originalImgUrl = path;
                    }
                    $('#ImgWindow').removeClass('hide');
                },
                hideImgWindow: function (e) {
                    $scope.model.imgWindowTitle = '';
                    $scope.model.originalImgUrl = '';
                    $('#ImgWindow').addClass('hide');
                }
            };
            $scope.events.loadCertificateApplication();

        }];
});