define(function (accountSetting) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'accountSettingService', '$rootScope', 'hbBasicData', '$dialog', '$timeout', '$interval', '$state', '$http', 'hbUtil', function ($scope, accountSettingService, $rootScope, hbBasicData, $dialog, $timeout, $interval, $state, $http, hbUtil) {
            $scope.model = {
                accountSetting: 0,
                remenUser: {},
                safeProModelOne: -1,
                safeProModelTwo: -1,
                submitSafe: true,
                dialogSafeShow: 1,
                changeType: 1,

                disable: true,
                shiList: [],
                quList: [],
                validateCode: '/web/login/validateCode/getValidateCode?type=7&' + Date.now(),
                sureCode: "/web/login/validateCode/validation/7/",
                isExistsPhoneNumber: "/web/login/login/isExistsPhoneNumber",
                phoneCodeText: "获取验证码",
                timer: null,
            };

            if ($rootScope.$$userInfo.photo === null) {
                $scope.model.hasUploadImg = false;
            } else {
                $scope.model.hasUploadImg = true;
            }


            $scope.receiveObj = {};

            $scope.receiveOp = {
                editReceive: false
            };

            $rootScope.show = 1;
            $rootScope.save = true;
            accountSettingService.getUserInfo().then(function (data) {
                $scope.model.user = data.info;
                if ($scope.model.user.gender === '男') {
                    $scope.model.user.gender = 1;
                } else {
                    $scope.model.user.gender = 2;
                }
                if ($scope.model.user.displayPhotoUrl === null&&$scope.model.user.gender=== '男' ) {
                    $scope.model.user.displayPhotoUrl = '/@systemUrl@/images/user-man.jpg';
                }else if ($scope.model.user.displayPhotoUrl === null&&$scope.model.user.gender=== '女' ){
                    $scope.model.user.displayPhotoUrl = '/@systemUrl@/images/user-woman.jpg';
                }else{
                    $scope.model.user.displayPhotoUrl = '/@systemUrl@/images/user-img.jpg';
                }
                if ($scope.model.user.unitName === null) {
                    $scope.model.user.unitName = '';
                }
                if ($scope.model.user.certificateNumber === null) {
                    $scope.model.user.certificateNumber = '';
                }
                /* if($scope.model.user.job===null){
                     $scope.model.user.job='';
                 }
                 if($scope.model.user.jobGrade===null){
                     $scope.model.user.jobGrade='';
                 }
                 if($scope.model.user.highestEducation===null){
                     $scope.model.user.highestEducation='';
                 }*/
                if ($scope.model.user.postCode === null) {
                    $scope.model.user.postCode = '';
                }
                /*if($scope.model.user.address===null){
                    $scope.model.user.address='';
                }
    
                $scope.model.user.cityId=data.info.region.parentId;
                $scope.model.user.areaId=data.info.region.id;
                accountSettingService.findRegion({parentId:''}).then(function(data){
                    $scope.model.cityList=data.info;
                    accountSettingService.findRegion({parentId:$scope.model.user.cityId}).then(function(data){
                        $scope.model.areaArr=data.info;
                    });
                });
                delete $scope.model.user.region;
                console.log(JSON.stringify($scope.model.user));*/

                $scope.model.usercopy = angular.copy(JSON.stringify($scope.model.user));

            });

            $scope.$watch('model.user', function (newVal) {
                if (JSON.stringify(newVal) === $scope.model.usercopy) {
                    $rootScope.save = true;
                } else {
                    $rootScope.save = false;

                }
            }, true);

            $scope.$watch('model.uploader', function (newVal) {
                if (newVal) {
                    $scope.events.img(newVal);
                }
            });


            //获取市
            $http.get('/web/front/userSetting/findRegion', {params: {parentId: ''}}).success(function (data) {
                if (data.status) {
                    $scope.model.shiList = data.info;
                }
            });

            $http.get('/web/front/userSetting/getUserReceive').success(function (data) {
                if (data.status) {


                    $scope.receiveObj = data.info;
                    $scope.copyReceiveObj = angular.copy($scope.receiveObj);


                    if (data.info.id) {
                        $scope.hasReceiveAddress = true;
                    } else {
                        $scope.hasReceiveAddress = false;
                    }


                    if (data.info.cityId) {
                        $http.get('/web/front/userSetting/findRegion', {params: {parentId: data.info.cityId}}).success(function (data) {
                            if (data.status) {
                                $scope.model.quList = data.info;
                            }
                        });
                    }

                    console.log($scope.receiveObj);

                }
            });

            $http.get('/web/login/login/isSupportMobileVerifycode',{}).success(function(data){
                $scope.model.isSupportMobileVerifycode = data.status ? data.info : false;
            });


            $scope.events = {
                changeSex:function(type){
                    $scope.model.user.gender=type;
                   $rootScope.$$userInfo.sex=(type);
                },
                cancelEditReceive: function () {
                    $scope.receiveObj = $scope.copyReceiveObj;
                    $scope.receiveOp.editReceive = false;
                    $scope.hasReceiveAddress = false;
                },

                editReceive: function () {
                    $scope.copyReceiveObj = angular.copy($scope.receiveObj);
                    $scope.receiveOp.editReceive = true;
                },

                addReceive: function () {
                    $scope.copyReceiveObj = angular.copy($scope.receiveObj);
                    $scope.receiveOp.editReceive = true;
                    $scope.hasReceiveAddress = true;
                },

                saveReceive: function () {


                    if (hbUtil.validateIsNull($scope.receiveObj.districtId)) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请选择所在地区'
                        });
                        return false;
                    }


                    if (hbUtil.validateIsNull($scope.receiveObj.addressDetails)) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请填写详细地址'
                        });
                        return false;
                    }

                    if (hbUtil.validateIsNull($scope.receiveObj.postCode)) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请填写邮政编码'
                        });
                        return false;
                    }

                    if (/^[\d]{6}$/.test($scope.receiveObj.postCode) === false) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请填写6位邮政编码'
                        });
                        return false;
                    }


                    if (hbUtil.validateIsNull($scope.receiveObj.receiverName)) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请填写收货人'
                        });
                        return false;
                    }
                    //^[\d]{11}$/
                    if (hbUtil.validateIsNull($scope.receiveObj.mobileNo)) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请填写手机号码'
                        });
                        return false;
                    }

                    if (/^[\d]{11}$/.test($scope.receiveObj.mobileNo) === false) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请填写11位手机号'
                        });
                        return false;
                    }


                    $scope.submitAble = true;
                    $http.post('/web/front/userSetting/updateUserReceive', {
                        id: $scope.receiveObj.id,
                        receiverName: $scope.receiveObj.receiverName,
                        mobileNo: $scope.receiveObj.mobileNo,
                        postCode: $scope.receiveObj.postCode,
                        provinceId: $scope.receiveObj.provinceId,
                        cityId: $scope.receiveObj.cityId,
                        districtId: $scope.receiveObj.districtId,
                        addressDetails: $scope.receiveObj.addressDetails
                    }).success(function (data) {
                        $scope.submitAble = false;
                        if (data.status) {
                            $dialog.alert({
                                title: '提示',
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '保存收货信息成功！'
                            });
                            //保存成功后把服务端给的收货ID赋值
                            $scope.receiveObj.id = data.info.id;


                            //更改收货地址成功后再复制一下
                            $scope.receiveObj = data.info;
                            $scope.copyReceiveObj = angular.copy($scope.receiveObj);
                            $scope.receiveOp.editReceive = false;
                            $scope.hasReceiveAddress = true;

                        }
                    });


                },


                changeReceiveCity: function (cityId) {
                    $scope.receiveObj.districtId = '';
                    $scope.model.quList = [];

                    if (hbUtil.validateIsNull(cityId)) {
                        return false;
                    }

                    $http.get('/web/front/userSetting/findRegion', {params: {parentId: cityId}}).success(function (data) {
                        if (data.status) {
                            $scope.model.quList = data.info;
                        }
                    });
                },


                openYearDialog: function (item, content) {
                    hbBasicData.addModal($scope, content);
                    $rootScope.leavename = item;
                },
                changeType: function (Type) {
                    if ($rootScope.save === false) {
                        var content = {
                            content: '你编辑的账号信息尚未保存，离开会使内容丢失，确定离开此页吗？',
                            okValue: '离开此页',
                            cancel: '留在此页'
                        };
                        $scope.events.openYearDialog(Type, content);
                    } else {
                        $rootScope.show = Type;
                    }

                },
                changeCity: function () {
                    $scope.model.user.areaPath = '';
                    $scope.model.user.areaId = undefined;
                    if ($scope.model.user.cityId === null || $scope.model.user.cityId === '') {
                        $scope.model.user.areaArr = [];
                    } else {

                        accountSettingService.findRegion({parentId: $scope.model.user.cityId}).then(function (data) {

                            $scope.model.user.areaArr = data.info;
                        });
                    }
                },

                changeCode: function () {
                    var type=2;
                    if($rootScope.show === 101){
                        type = 7;
                    }else if($rootScope.show === 102){
                        type = 8;
                    }
                    $scope.model.validateCode = '/web/login/validateCode/getValidateCode?type='+type+'&' + Date.now();
                },

                sendMobile: function(e, type){
                    e.preventDefault();
                    if($rootScope.show == 101) {
                        $scope.model.phoneNumber = $scope.model.user.phoneNumber;
                    }

                    $scope.startTime=60;
                    $scope.sendAble=true;
                    if($scope.model.phoneNumber===''){
                        $dialog.confirm ( {
                            title  : '提示',
                            visible: true,
                            modal  : true,
                            width  : 350,
                            ok     : function () {
                                $scope.sendAble=false;
                                return true;
                            },
                            content: "请输入手机号码！"
                        } );
                        return false;
                    }
                    if($scope.model.code===undefined){
                         $dialog.confirm ( {
                             title  : '提示',
                             visible: true,
                             modal  : true,
                             width  : 350,
                             ok     : function () {
                                 $scope.sendAble=false;
                                 return true;
                             },
                             content: "请输入验证码！"
                         } );
                         return false;
                     }
                    $http.get('/web/login/login/sendMobileVerificationCode',{
                        params:{
                            phoneNum:$scope.model.phoneNumber,
                            pictureCode:$scope.model.code,
                            type:type,
                            isNeedCode: true
                        }
                    }).success(function(data){
                        if(data.status){
                            $dialog.alert ( {
                                title  : '提示',
                                visible: true,
                                modal  : true,
                                width  : 350,
                                ok     : function () {
                                    return true;
                                },
                                content: "手机验证码发送成功！"
                            } );
                            $scope.model.timer = $interval(function() {
                                $scope.startTime --;
                                $scope.model.phoneCodeText=$scope.startTime+'S后重新获取';
                                if($scope.startTime < 1) {
                                    $scope.model.phoneCodeText='重新获取';
                                    $scope.sendAble=false;
                                    $interval.cancel($scope.model.timer);
                                };
                            }, 1000);
                        }else{
                            $dialog.alert ( {
                                title  : '提示',
                                visible: true,
                                modal  : true,
                                width  : 350,
                                ok     : function () {
                                    $scope.model.validateCode = '/web/login/validateCode/getValidateCode?type=2&' + Date.now();
                                    return true;
                                },
                                content: data.info
                            } );
                            $scope.sendAble=false;
                        }
                    })

                },

                checkPhoneCode:function(e){
                    e.preventDefault();
                    $http.get('/web/login/login/checkPhoneCode',{
                        params:{
                            phoneNumber:$scope.model.user.phoneNumber,
                            phoneCode:$scope.model.mobileCode,
                            type:7
                        }
                    }).success(function(data){
                        if(data.status && data.info){
                            $scope.sendAble=false;
                            $scope.model.code = "";
                            $scope.model.mobileCode = "";
                            $scope.model.phoneNumber = "";
                            $scope.model.validateCode = '/web/login/validateCode/getValidateCode?type=8&' + Date.now();
                            $scope.model.sureCode = "/web/login/validateCode/validation/8/";
                            $interval.cancel($scope.model.timer);
                            $scope.model.phoneCodeText = "获取验证码",
                            $scope.events.changeType(102);
                        }else{
                            $dialog.alert ( {
                                title  : '提示',
                                visible: true,
                                modal  : true,
                                width  : 350,
                                ok     : function () {
                                    return true;
                                },
                                content: "手机验证码验证失败"
                            } );
                        }
                    })
                },
                comfirmUpdatePhone: function(e){
                    //accountRegister: {
                    e.preventDefault();
                    $http.post('/web/login/login/updatePhoneNumberByCode',{
                            phoneNumber: $scope.model.phoneNumber,
                            smsValidateCode: $scope.model.mobileCode,
                            codeType: 8

                    }).success(function(data){
                        if(data.status && data.info){
                            $dialog.alert ( {
                                time   : 3,
                                visible: true,
                                modal  : true,
                                width  : 350,
                                ok     : function () {
                                    $state.reload($state.current);
                                    return true;
                                },
                                onclose: function(){
                                    $state.reload($state.current);
                                    return true;
                                },
                                content: "换绑手机号成功！<br>3s后自动关闭"
                            } );
                        }else{
                            $dialog.alert ( {
                                title  : '提示',
                                visible: true,
                                modal  : true,
                                width  : 350,
                                ok     : function () {
                                    return true;
                                },
                                content: "手机验证码验证失败"
                            } );
                        }
                    })
                },

                save: function (user) {
                    $scope.model.disable = false;

                    //if($scope.model.user.name===undefined||$scope.model.user.email===undefined||$scope.model.user.phoneNumber===undefined||$scope.model.user.cityId===undefined||$scope.model.user.areaId===undefined){
                    //    return false;
                    //}
                    $scope.model.save = $scope.model.user;
                    $scope.model.save.workUnit = $scope.model.user.unitName;
                    $scope.model.save.sex = $scope.model.user.gender;
                    //$scope.model.save.areaPath='/340000/'+$scope.model.user.cityId+'/'+$scope.model.user.areaId;
                    accountSettingService.updateUserInfo($scope.model.save).then(function (data) {
                        if (data.status) {
                            /* $dialog.contentDialog ( {
                                 visible   : true,
                                 modal:true,
                                 width  :400,
                                 height:153,
                                 contentUrl: '@systemUrl@/views/accountSetting/success.html'
                             }, $scope);*/
                            $dialog.alert({
                                title: '提示',
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '修改成功'
                            });
                            $scope.model.disable = true;
                            $rootScope.save = true;
                        } else {
                            $dialog.confirm({
                                title: '保存失败',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: data.info
                            });
                            $scope.model.disable = true;
                            $rootScope.save = true;
                        }
                        ;
                    });


                },
                upload: function () {
                    /*  console.log($scope.model.uploader)*/
                },
                //上传文件格式错误提示
                fileTypeDenied: function (accepts) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: 'Hi，这里只能选择JPG、PNG格式图片文件，且文件需<2MB'
                    });
                },


                //修改密码
                submitPassword: function (e, now, future) {

                    e.preventDefault();
                    accountSettingService.modifyLoginPassword({
                        oldPassword: now,
                        newPassword: future
                    }).then(function (data) {
                        if (data.status) {
                            /*  $dialog.alert ( {
                                  visible   : true,
                                  modal:true,
                                  time:1,
                                  content:'修改成功！'
                              }, $scope );*/
                            $dialog.confirm({
                                title: '修改成功',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '修改成功！'
                            });

                            //$timeout(function(){
                            //    window.open('/center/#/home','_self');
                            //},1500)
                        } else {
                            $dialog.confirm({
                                title: '保存失败',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: data.info
                            });

                        }
                        ;
                    });
                },
                //设置头像
                img: function (upload) {

                    if (upload === null) {
                        $dialog.confirm({
                            title: '上传失败',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请选择图片后再上传！'
                        });
                    } else {
                        accountSettingService.modifyDisplayPhoto({displayPhotoUrl: upload.newPath}).then(function (data) {
                            if (data.status) {
                                $rootScope.$$userInfo.photo = ($scope.model.uploader.newPath);
                                $scope.model.hasUploadImg = true;
                                $dialog.confirm({
                                    title: '上传成功',
                                    visible: true,
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;

                                    },
                                    content: '上传成功'
                                });

                            } else {
                                $dialog.confirm({
                                    title: '上传失败',
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
                    }
                },


                closeStartSafe: function () {
                    $scope.model.dialogStartSafeOne.remove();
                }
            };
        }]
    };
});