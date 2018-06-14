/**
 * Created by wengpengfei on 2016/8/17.
 */
define(function (mod) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$rootScope', 'homeService', '$timeout', '$state', '$dialog', '$sce', '$interval', 'hbLoginService', '$http',
            function ($scope, $rootScope, homeService, $timeout, $state, $dialog, $sce, $interval, hbLoginService, $http) {
                $scope.model = {
                    user: {},
                    loginError: '',
                    validateCode: '/web/login/validateCode/getValidateCode?type=1&' + Date.now(),
                    sureCode: '/web/login/validateCode/validation/1/',
                    sureUseLogin: false,
                    useInformation: '',
                    noticeShowOne: 1,
                    noticeShowTwo: 1,
                    getMessageStatusOne: false,
                    getMessageStatusTwo: false,
                    newLesson: [],
                    passUseNameStatus: false,
                    codeShow: false,
                    loginErrorEnter: false,
                    getLastStatus: false,
                    lwhLoading: '登 录',
                    gzwxBoxShow: true,


                    marjorList: [],
                    yearList: [],
                    subjectList: [],
                    courseList: [],

                    subjectOptionsId: '5628812b569c57e001569c5a77f6a011',//默认公需课
                    yearOptionsId: null,
                    coursePoolId: null,

                    pxtzType: 'TRAINING_NOTICE',
                    zcfgType: 'POLICIES_REGULATIONS',
                    xwdtType:'NEWS',
                    pxtzList: [],
                    zcfgList: [],
                    xwdtList: [],

                    periodObj: {
                        idNum: '',
                        userName: ''
                    },


                    newestTrainClass: [],
                    newestCourse: [],


                    hotClassIds:[],
                    //hotClassIds:[],
                    //selfChoseIds:[],
                    selfChoseIds:[],
                    hotAndSelf:'hot',
                    hotClassList:[],
                    selfChoseList:[],

                    trainClassSkuArr:[],
                    goodsSkuArr:[]
                };
                $scope.Ing = '登 录';
                //热门班级
                angular.forEach($scope.model.hotClassIds,function(item){
                    $http.get('/web/portal/index/getClassDetail',{params:{
                        skuId:item.skuId
                    }}).success(function(data){
                        if(data.status){
                            console.log(data.info);
                            $scope.model.hotClassList.push(data.info);
                        }
                    });
                });
                //自主选课
                angular.forEach($scope.model.selfChoseIds,function(item){
                    $http.get('/web/portal/index/getCourseCommodityDetail',{params:{
                        skuId:item.skuId,
                        coursePoolId:item.coursePoolId,
                        courseId:item.courseId
                    }}).success(function(data){
                        if(data.status){
                            console.log(data.info);
                            $scope.model.selfChoseList.push(data.info);
                        }
                    });
                });





                $scope.model.validateCode = '/web/login/validateCode/getValidateCode?type=1&' + Date.now();
                $scope.events = {
                    outOfLogin: function (e) {
                        e.preventDefault();
                        $dialog.alert({
                            /*   title  : '提示',*/
                            visible: true,
                            modal: true,
                            width: 250,
                            okValue: '确认退出',
                            ok: function () {
                                window.open('/web/login/login/frontDoLogout.action', '_self');
                                return true;
                            },
                            cancel: function () {
                                return true;
                            },
                            content: '你确定退出学习？'
                        });
                    },
                    goClassDetail:function(item){
                        $state.go('states.accountant.onTraining.onTrainingViews',{
                            commoditySkuId:item.skuId,
                            goodsType:'trainClass',
                            showMajor:false
                        });
                    },

                    goSelfDetail:function(item){
                        $state.go('states.accountant.onTraining.onTrainingViews',{
                            commoditySkuId:item.skuId,
                            goodsType:'goods',
                            coursePoolId:item.coursePoolId,
                            courseId:item.courseId,
                            showMajor:false
                        });
                    },

                    tabHotAndSelf:function(type){
                        $scope.model.hotAndSelf=type;
                    },



                    //首页登录配置
                    getIslogin: function () {
                        homeService.isLogin().then(function (data) {
                            $rootScope.sureUseLogin = data.info;
                            if (data.info === true) {
                                homeService.getUserInfo().then(function (data) {
                                    $rootScope.useInformation = data.info;
                                });
                            }
                        });
                    },
                    getErrorTwo: function () {
                        $scope.Ing = '登 录';
                        $timeout(function () {
                            $scope.model.loginError = 'two';
                        });
                    },
                    getErrorOne: function () {
                        $scope.Ing = '登 录';
                        $timeout(function () {
                            $scope.model.loginError = 'one';
                        });
                    },
                    submitUse: function (e) {
                        $scope.Ing = '正在登录...';
                        homeService.canLogin(
                            {loginInput: $scope.model.use.useName}
                        ).then(function (data) {
                            if (data.status) {
                                if (data.info.isExist) {
                                    if (data.info.isActivated) {
                                        if (data.info.hasPassword) {
                                            e.preventDefault();
                                            var loginParam = {
                                                'accountType': 1,
                                                'username': $scope.model.use.useName,
                                                'password': $scope.model.use.password
                                            };
                                            ssoLogin.login(loginParam, '{\'portalType\':\'mall\'}');
                                        } else {
                                            homeService.getAdminSystemDomain().then(function (urlDate) {
                                                if (urlDate.status) {
                                                    homeService.ajaxJsonp({
                                                        url: urlDate.info,
                                                        username: $scope.model.use.useName,
                                                        password: $scope.model.use.password
                                                    }).success(function (dataInfo) {
                                                            if (dataInfo.Status) {
                                                                homeService.setPassword({
                                                                    username: $scope.model.use.useName,
                                                                    password: $scope.model.use.password
                                                                }).then(function (setDate) {
                                                                    if (setDate.status) {
                                                                        var loginParam = {
                                                                            'accountType': 1,
                                                                            'username': $scope.model.use.useName,
                                                                            'password': $scope.model.use.password
                                                                        };
                                                                        ssoLogin.login(loginParam, '{\'portalType\':\'mall\'}');
                                                                    }
                                                                });
                                                            } else {
                                                                $timeout(function () {
                                                                    $scope.Ing = '登 录';
                                                                });
                                                                $dialog.confirm({
                                                                    title: '提示',
                                                                    visible: true,
                                                                    modal: true,
                                                                    width: 250,
                                                                    ok: function () {
                                                                        return true;
                                                                    },
                                                                    content: dataInfo.Info
                                                                });
                                                            }
                                                        }
                                                    );
                                                }
                                            });
                                        }
                                        ;
                                    } else {
                                        $scope.Ing = '登 录';
                                        $scope.model.loginError = '';
                                        $dialog.confirm({
                                            title: '请先注册',
                                            visible: true,
                                            modal: true,
                                            width: 350,
                                            cancel: function () {
                                                return true;
                                            },
                                            okValue: '前往注册',
                                            cancelValue: '再看看',
                                            ok: function () {
                                                $state.go('states.accountant.registration');
                                                return true;
                                            },
                                            content: '此账号尚未注册，请先通过【新用户注册】完成注册流程。'
                                        });
                                    }
                                } else {
                                    $scope.Ing = '登 录';
                                    $scope.model.loginError = 'three';
                                }
                            }
                        });
                    },
                    changeCode: function () {
                        $scope.model.validateCode = '/web/login/validateCode/getValidateCode?type=1&' + Date.now();
                    },
                    closeDialogNotice: function () {

                        if ($scope.model.dialogNextShow) {
                            console.log(1);
                            var Days = 30,
                                exp = new Date();
                            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                            var expires = exp.toGMTString();
                            document.cookie = 'portalDialogShow=' + angular.toJson({
                                id: $scope.model.dialogContent.id
                            }) + ';expires=' + expires + ';path=/';
                        }
                    },
                    //完善信息弹窗（消息弹窗）
                    dialogNotice: function () {
                        $dialog.contentDialog({
                            /*      title     : '欢迎您参加安徽专业技术继续教育基地',*/
                            visible: true,
                            modal: true,
                            width: 700,
                            height: 'auto',
                            contentUrl: 'ahzj/fykccs/views/home/diaNotice.html'
                        }, $scope);
                    },


                    goAccount: function (e) {
                        e.preventDefault();
                        window.open('/center/#/accountSetting', '_self');
                        //$state.go('states.accountSetting');
                    },
                    goAccountSetting: function (e) {
                        window.open('/center/#/accountSetting', '_self');
                    },
                    goCenter: function (e) {
                        e.preventDefault();
                        window.open('/center/#/home', '_self');
                    },

                    loginDialog: function () {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: '请先登录再进行此操作！'
                        });
                    },
                    MainPageQueryList: function (e, status) {
                        e.preventDefault();
                        if (!status) {
                            $scope.events.submitUse(e);
                        } else {
                            $scope.model.lwhLoading = false;
                            $scope.model.loginErrorEnter = true;
                        }
                    },


                    openLoginDialog: function () {
                        hbLoginService.createLoginForm();
                    },

                    goTrainingCertificate: function () {
                        window.open('/center/#/studyArchives', '_self');
                    },
                    goMyCourse: function () {
                        window.open('/center/#/myStudy', '_self');
                    },
                    goShoppingCart: function () {
                        window.open('/center/#/shoppingCart', '_self');
                    },

                    goMyOrder: function () {
                        window.open('/center/#/myOrder', '_self');
                    },
                    goNotice: function () {
                        window.open('/center/#/message/', '_self');
                    },


                    hoverMore: function (bol, type) {
                        $scope.model[type] = bol;
                    },

                    goTrainView: function (item, type) {
                        if (type === 'year') {
                            $state.go('states.accountant.onTraining', {yearId: item.optionId});
                        }
                        if (type === 'marjor') {
                            $state.go('states.accountant.onTraining', {marjor: item.id});
                        }
                        if (type === 'subject') {
                            $state.go('states.accountant.onTraining', {subject: item});
                        }
                    },

                    tabSubject: function (item) {
                        if ($scope.model.subjectOptionsId == item.optionId) {
                            return false;
                        }
                        $scope.model.subjectOptionsId = item.optionId;
                        //选中专业课 没有年度
                        if ($scope.model.subjectOptionsId !== '5628812b569c57e001569c5a77f6a011') {
                            $scope.model.yearOptionsId = null;
                            getFirstMarjorId();
                        } else {//选中公需课 没有专业
                            $scope.model.coursePoolId = null;
                            getFirstYearId();
                        }

                        getCourseList();

                    },

                    tabYear: function (item) {
                        if ($scope.model.yearOptionsId === item.optionId) {
                            return false;
                        }
                        $scope.model.yearOptionsId = item.optionId;

                        getCourseList();
                    },

                    tabMarjor: function (item) {
                        if ($scope.model.coursePoolId === item.id) {
                            return false;
                        }
                        $scope.model.coursePoolId = item.id;

                        getCourseList();
                    },

                    goCourseDetail: function (item) {
                        $state.go('states.accountant.onTraining.onTrainingViews',
                            {
                                commoditySkuId: item.skuId,
                                coursePoolId: item.coursePoolId,
                                courseId: item.courseId,
                                goodsType: 'goods',
                                showMajor: item.courseType === '专业课' ? true : false
                            }
                        );
                    },


                    goTrainclassDetail: function (item) {
                        $state.go('states.accountant.onTraining.onTrainingViews', {
                            commoditySkuId: item.skuId,
                            goodsType: 'trainClass',
                            showMajor: item.classType === '专业课' ? true : false
                        });
                    },


                    goSignUpTraining: function (categoryType) {
                        $state.go('states.accountant.onTraining', {categoryType: categoryType});
                    },

                    goCourseShow: function () {
                        $state.go('states.accountant.courseShow');
                    },


                    findUserPeriod: function () {
                        /*
                                                ng-pattern="/(^\d{6}(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\d{3}$)|(^\d{6}(19|20)(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\d{3}([0-9]|X|x)$)/"
                        */

                        var idNumReg = /(^\d{6}(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\d{3}$)|(^\d{6}(19|20)(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\d{3}([0-9]|X|x)$)/;
                        if (!idNumReg.test($scope.model.periodObj.idNum)) {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '请填写15-18位身份证号'
                            });
                            return false;
                        }


                        if (validateIsNull($scope.model.periodObj.userName)) {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '请填写姓名'
                            });
                            return false;
                        }

                        $state.go('states.accountant.creditVerification',
                            {idNum: $scope.model.periodObj.idNum, userName: $scope.model.periodObj.userName}
                        );


                    },

                    openListen: function (item) {
                        window.open('/play/#/previewLesson/trainClassId/' + item.id + '/' + 'courseware' + '/xxx', '_blank');
                    },

                    goDetailTraining:function(item,subItem,subArr,categoryType){

                        console.log(item);
                        console.log(subItem);
                        console.log(subArr);
                        var arr=[];

                        arr.push({
                            propertyId: item.skuProperty.skuPropertyId,
                            propertyIdCode: item.skuProperty.eName,
                            value: item.optionId,
                            valueCode: item.name,
                            cName:item.skuProperty.cName
                        });
                        arr.push({
                            propertyId: subArr.propertyId,
                            propertyIdCode: subArr.eName,
                            value: subItem.optionId,
                            valueCode: subItem.name,
                            cName:subArr.cName
                        });

                        console.log(arr);
                        $state.go('states.accountant.onTraining',{skuParams:JSON.stringify(arr),categoryType:categoryType})
                    },

                    goDetailTrainingMajor:function(item,subItem,subArr,categoryType){

                        console.log(item);
                        console.log(subItem);
                        //console.log(subArr);
                        var arr=[];
                        arr.push({
                            propertyId: item.skuProperty.skuPropertyId,
                            propertyIdCode: item.skuProperty.eName,
                            value: item.optionId,
                            valueCode: item.name,
                            cName:item.skuProperty.cName
                        });

                        console.log(arr);
                        $state.go('states.accountant.onTraining',{
                            skuParams:JSON.stringify(arr),
                            categoryType:categoryType,
                            currentMarjorId:subItem.id,
                            currentMarjorName:subItem.name
                        })
                    }


                };

                getSimpleList($scope.model.pxtzType, 6, 'pxtzList');
                getSimpleList($scope.model.zcfgType, 6, 'zcfgList');
                getSimpleList($scope.model.xwdtType, 6, 'xwdtList');

                function getSimpleList (categoryType, pageSize, listName) {
                    $http.get('/web/portal/info/getSimpleInfoList?categoryType=' + categoryType + '&pageNo=1&pageSize=' + pageSize).success(function (data) {
                        if (data.status) {
                            $scope.model[listName] = data.info;
                            //$scope.model[listName][0].title='我是哈哈哈我是哈哈哈我是哈哈哈我是哈哈哈我是哈哈哈我是哈哈哈我是哈哈哈';
                            angular.forEach($scope.model[listName], function (item) {
                                if (item.title.length > 16) {
                                    item.shortTitle = item.title.substr(0, 16) + '...';
                                } else {
                                    item.shortTitle = item.title;
                                }
                            });
                        }
                    });
                }

                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }


                function getCourseList () {
                    homeService.findSalesCoursePage({
                        pageSize: 6,
                        pageNo: 1,
                        yearOptionsId: $scope.model.yearOptionsId,
                        subjectOptionsId: $scope.model.subjectOptionsId,
                        coursePoolId: $scope.model.coursePoolId
                    }).then(function (data) {
                        if (data.status) {
                            $scope.model.courseList = data.info;
                        }
                    });
                }


                function getFirstMarjorId () {
                    if ($scope.model.marjorList.length > 0) {
                        $scope.model.coursePoolId = $scope.model.marjorList[0].id;
                    }
                }


                function getFirstYearId () {
                    if ($scope.model.yearList.length > 0) {
                        $scope.model.yearOptionsId = $scope.model.yearList[0].optionId;
                        getCourseList();
                    }
                }

                /*homeService.getSubjectOptions().then(function(data){
                    if(data.status){
                        $scope.model.subjectList=data.info;
                    }

                });


                homeService.getYearQueryOptions().then(function(data){
                    if(data.status){
                        $scope.model.yearList=data.info;
                        getFirstYearId();
                    }

                });*/
                homeService.getPopInfoNow().then(function (data) {
                    console.log(data.info);
                    if (data.info.id !== null) {
                        $scope.model.dialogContent = data.info;
                        var getPortalCookies = function (name) {
                            var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
                            if (arr = document.cookie.match(reg))
                                return unescape(arr[2]);
                            else
                                return null;
                        };
                        $scope.model.noticeCookiesId = getPortalCookies('portalDialogShow');
                        $scope.model.noticeCookiesId = angular.fromJson($scope.model.noticeCookiesId);
                        if ($scope.model.noticeCookiesId) {
                            if ($scope.model.noticeCookiesId.id !== $scope.model.dialogContent.id) {
                                $scope.events.dialogNotice();
                            }
                        } else {
                            $scope.events.dialogNotice();
                        }
                    }
                });
                homeService.getCoursePoolInfos().then(function (data) {
                    if (data.status) {
                        $scope.model.marjorList = data.info;
                        angular.forEach($scope.model.marjorList, function (item) {
                            if (item.name.length > 4) {
                                item.shortName = item.name.substr(0, 4) + '..';
                            } else {
                                item.shortName = item.name;
                            }
                        });
                    }

                });

                //获取最新培训班
                $http.get('/web/portal/index/findLastSalesClassPage').success(function (data) {
                    if (data.status) {
                        $scope.model.newestTrainClass = data.info;
                    }
                });

                //获取课程展示newestCourse
                $http.get('/web/portal/index/getLatestCourses').success(function (data) {
                    if (data.status) {
                        $scope.model.newestCourse = data.info;
                    }
                });


                //获取培训班的科目
                getAllSkuPropertyOptionByCode('TRAINING_CLASS_GOODS','trainClassSkuArr');
                //获取自主选课的科目
                getAllSkuPropertyOptionByCode('COURSE_SUPERMARKET_GOODS','goodsSkuArr');
                function getAllSkuPropertyOptionByCode(categoryType,arrName){
                    $http.get('/web/portal/index/getAllSkuPropertyOptionByCode',{params:{
                        code:'trainingSubject',
                        onlyHasCommodity:true,
                        categoryType:categoryType
                    }}).success(function(data){
                        if(data.status){
                            $scope.model[arrName]=data.info;
                            angular.forEach($scope.model[arrName],function(item){
                                //获取培训班科目对应的年度

                                if(item.code==='profession'&&categoryType==='COURSE_SUPERMARKET_GOODS'){
                                    //自主选课的专业课的儿子是具体的专业
                                    $http.get('/web/portal/index/getCoursePoolInfos').success(function(subData){
                                        item.majorList=subData.info;
                                    });
                                }else{
                                    //培训班的共需，专业课 自主选课的公需课的儿子都是年度
                                    $http.post('/web/portal/index/listSkuProperty', {
                                        categoryType: categoryType,
                                        propertyQueries: [{
                                            propertyId: item.skuProperty.skuPropertyId,
                                            value: item.optionId
                                        }]
                                    }).success(function(subData){
                                        if(subData.status){
                                            item.yearList=subData.info;
                                        }
                                    });
                                }


                            });

                        }
                    });
                }




            }]
    };
});
