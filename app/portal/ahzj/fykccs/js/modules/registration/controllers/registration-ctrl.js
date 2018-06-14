define(function () {
    'use strict';
    return ['$scope', 'registrationService', '$state', '$timeout', '$dialog', '$interval', 'hbLoginService', function ($scope, registrationService, $state, $timeout, $dialog, $interval, hbLoginService) {


        $scope.model = {
            count: 3,

            lwhLoading: false,
            name: '',
            loginInput: '',
            sex: '1',//1男 2女
            password: '',
            confirmPassword: '',
            email: '',
            phoneNumber: '',
            workUnit: '',
            areaPath: '',//区id
            cityId: '',//市id

            cityList: [],
            areaArr: [],
            highestEducationList:
                [
                    {name: '博士', optionId: '博士'},
                    {name: '硕士', optionId: '硕士'},
                    {name: '本科', optionId: '本科'},
                    {name: '大专及以下', optionId: '大专及以下'}
                ],

            registStatus: 1,//1未成功 2成功
            uploader: '',

            userId: '',
            job: '',
            jobGrade: '',
            postCode: '',
            address: '',
            displayPhotoUrl: '',
            certificateNumber: '',
            highestEducation: ''
        };


        var obj = {
            regSick1: /^[0-9a-zA-Z]{6}$/,
            regSick2: /^[0-9]*$/,
            regSick3: /^[a-z]*$/,
            regSick4: /^[A-Z]*$/,

            regMiddle: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/,

            regStrong: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/
        };
        //console.log(obj.regSick1.test('sheshe1'));
        $scope.passwordLevel = '';
        $scope.$watch('model.password', function (newVal) {
            if (newVal) {
                if (obj.regSick1.test(newVal) || obj.regSick2.test(newVal) || obj.regSick3.test(newVal) || obj.regSick4.test(newVal)) {
                    $scope.passwordLevel = 'sick';
                }

                if (obj.regMiddle.test(newVal)) {
                    $scope.passwordLevel = 'middle';
                }

                if (obj.regStrong.test(newVal)) {
                    $scope.passwordLevel = 'strong';
                }
            }
        });


        $scope.$watch('model.uploader', function (newVal) {
            if (newVal) {
                //console.log ( newVal );
                $scope.model.displayPhotoUrl = newVal.newPath;
            }
        });


        $scope.events = {


            returnPrestep: function (e) {
                e.preventDefault();
                $scope.model.registStep = 'one';
            },

            openLoginDialog: function () {
                hbLoginService.createLoginForm();
            },

            changeSex: function (type) {
                $scope.model.sex = type;
            },

            changeCity: function () {

                $scope.model.areaPath = '';
                //console.log($scope.model.cityId);
                if ($scope.model.cityId === null || $scope.model.cityId === '') {
                    $scope.model.areaArr = [];
                } else {
                    registrationService.findRegion({parentId: $scope.model.cityId}).then(function (data) {
                        $scope.model.areaArr = data.info;
                    });
                }
            },

            nextStep: function () {
                $scope.model.registStep = 'two';
            },

            perfectAndRegist: function () {
                $scope.registAble = true;
                registrationService.register({
                    name: $scope.model.name,
                    loginInput: $scope.model.loginInput,
                    //email:$scope.model.email,
                    phoneNumber: $scope.model.phoneNumber,
                    sex: $scope.model.sex,
                    password: $scope.model.password,
                    //areaPath:$scope.model.regionPath,
                    workUnit: $scope.model.workUnit
                }).then(function (data) {
                    //$scope.registAble=false;
                    if (data.status && data.code === 200) {
                        $scope.model.userId = data.info;
                        registrationService.perfectinformation({
                            userId: $scope.model.userId,
                            certificateNumber: $scope.model.certificateNumber,
                            job: $scope.model.job,
                            jobGrade: $scope.model.jobGrade,
                            highestEducation: $scope.model.highestEducation,
                            postCode: $scope.model.postCode,
                            address: $scope.model.address,
                            displayPhotoUrl: $scope.model.displayPhotoUrl
                        }).then(function (subData) {
                            $scope.registAble = false;
                            if (subData.status && subData.code === 200) {
                                loginAndGohome();
                            }
                        });

                    }
                });
            },

            regist: function () {
                $scope.registAble = true;
                registrationService.register({
                    registerType: 11,//默认平台注册
                    name: $scope.model.name,
                    loginInput: $scope.model.loginInput,
                    phoneNumber: $scope.model.phoneNumber,
                    sex: $scope.model.sex,
                    password: $scope.model.password,
                    workUnit: $scope.model.workUnit
                }).then(function (data) {
                    $scope.registAble = false;
                    if (data.status && data.code === 200) {
                        $scope.model.userId = data.info;
                        loginAndGohome();
                    }
                });
            },

            getCurrentStyle: function () {
                if ($scope.model.registStep === 'one') {
                    return {width: 25 + '%'};
                }
                if ($scope.model.registStep === 'two') {
                    return {width: 75 + '%'};
                }
                if ($scope.model.registStep === 'three') {
                    return {width: 100 + '%'};
                }
            },

            submitUserInformation: function (useName, password) {
                var loginParam = {
                    'accountType': 1,
                    'username': useName,
                    'password': password
                };
                ssoLogin.login(loginParam, '{\'portalType\':\'mall\'}');
            }
        };

        function loginAndGohome () {
            $scope.model.registStatus = 2;
            $scope.timeplay = $interval(function () {
                $scope.model.count--;
                if ($scope.model.count === 0) {
                    $interval.cancel($scope.timeplay);
                    $scope.events.submitUserInformation($scope.model.loginInput, $scope.model.password);
                    $state.go('states.accountant');
                }
            }, 1000);
        }

        registrationService.findRegion({parentId: ''}).then(function (data) {
            $scope.model.cityList = data.info;
        });


        $scope.$watch('model.uploader', function (nv) {
            if (nv) {
                console.log(nv);
                $scope.model.displayPhotoUrl = nv.newPath;

            }
        });

    }];
});