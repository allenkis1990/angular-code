/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/18
 * 时间: 11:54
 *
 */

define(['angular', 'kccs/kccsv2/js/directives/perfectOrder', 'jqueryNiceScroll'], function (angular, perfectOrder) {


    function publicShoppingRequest ($rootScope, $http) {
        $http.get('/web/front/studentOrder/getShoppingCartCommodityPage?pageNo=1&pageSize=1').success(function (data) {
            $rootScope.shoppingCount = data.totalSize;
        });
    }

    var commonModule = angular.module('hb.frontCommon', ['hb.basicData', 'hb.niceScroll', 'hb.util']);

    //继续教育右侧帮助导航
    commonModule.directive('helpNav', ['$http', 'hbLoginService', '$state', '$rootScope', function ($http, hbLoginService, $state, $rootScope) {
        return {
            templateUrl: 'kccs/kccsv2/views/home/helpNav.html',

            link: function ($scope) {
                $http.get('/web/login/login/isLogin').success(function (data) {
                    if (data.info === true) {
                        $http.get('/web/front/studentOrder/getShoppingCartCommodityPage?pageNo=1&pageSize=1').success(function (subData) {
                            $rootScope.shoppingCount = subData.totalSize;
                        });
                    } else {
                        $rootScope.shoppingCount = 0;
                    }
                });


                $scope.dirEvents = {
                    fn: function () {
                        alert(1);
                    },
                    goCenter: function () {
                        $http.get('/web/login/login/isLogin').success(function (data) {
                            if (data.info === true) {
                                window.open('/center/#/home', '_self');
                            } else {
                                $rootScope.sureUseLogin = false;
                                hbLoginService.createLoginForm();
                            }
                        });
                    },
                    goShoppingCart: function () {
                        $http.get('/web/login/login/isLogin').success(function (data) {
                            if (data.info === true) {
                                window.open('/center/#/shoppingCart', '_self');
                            } else {
                                $rootScope.sureUseLogin = false;
                                hbLoginService.createLoginForm();
                            }
                        });
                    },
                    goHelp: function () {
                        $state.go('states.accountant.helpCenter');
                    }
                };

                $('#returnTop').click(function () {
                    $('body,html').stop(true, true).animate({scrollTop: 0}, 500);
                });

            }
        };
    }])



    //获取登录票指令
        .directive('initCas', ['$rootScope', '$http', '$state', function ($rootScope, $http, $state) {
            return {
                scope: {
                    type: '@'
                },
                link: function (scope) {
                    var initCas = function () {


                        $http.get('/web/login/login/isLogin').success(function (data) {
                            $rootScope.sureUseLogin = data.info;
                            if (data.info === true) {
                                $http.get('/web/login/login/getUserInfo').success(function (subData) {
                                    $rootScope.useInformation = subData.info;
                                });

                            } else {
                                $.get('/web/login/login/getLoginParameters.action?_q=' + new Date().getTime(), function (data) {
                                    window.processLogin = function (data) {
                                        if (data.code == 603) {
                                            //登录方式，同步或者异步登录
                                            if (scope.type === '1') {
                                                $.get(data.location).success(function (data) {
                                                    if (data.state) {


                                                        $http.get('/web/login/login/isLogin').success(function (data) {
                                                            $rootScope.sureUseLogin = data.info;
                                                            if (data.info === true) {

                                                                $http.get('/web/login/login/getUserInfo').success(function (subData) {
                                                                    $rootScope.useInformation = subData.info;
                                                                });

                                                            } else {

                                                            }
                                                        });

                                                    }
                                                });
                                            } else {
                                                window.location = data.location;
                                            }
                                        } else if (data.code == 611) {
                                            //scope.getErrorOne();
                                        }
                                        else {
                                            //scope.getErrorTwo();
                                        }
                                    };
                                    var script = document.createElement('script');
                                    script.type = 'text/javascript';
                                    script.src = data.info.casDomain + '/login?TARGET=' + data.info.currentDomain + '/web/sso/auth&js&callback=processLogin';
                                    $('head').append(script);
                                    //document.documentElement.appendChild(script);
                                });


                            }
                        });

                    };
                    initCas();
                }
            };
        }])


        .directive('hbLoginForm', ['hbLoginService', '$interval', '$timeout', '$state', 'homeService', '$rootScope', 'hbBasicData', '$http', function (hbLoginService, $interval, $timeout, $state, homeService, $rootScope, hbBasicData, $http) {
            return {

                templateUrl: 'kccs/kccsv2/views/home/loginDialog.html',
                scope: {},
                link: function ($scope) {
                    $scope.fn = function () {
                        console.log($scope.loginForm.picValidateCode.$error.ajaxValidate);
                    };
                    $scope.Ing = '登 录';
                    $scope.model = {
                        loginErrorEnter: false,
                        sureCode: '/web/login/validateCode/validation/1/',
                        codeShow: false,
                        user: {},
                        loginError: '',
                        validateCode: '/web/login/validateCode/getValidateCode?type=1&' + Date.now(),
                        textType: 'password',
                        isIe8: hbBasicData.isIe8()
                    };

                    //alert($scope.model.isIe8);
                    $scope.events = {


                        showTextType: function (type) {
                            $scope.model.textType = type;
                        },

                        getIslogin: function () {
                            homeService.isLogin().then(function (data) {
                                $rootScope.sureUseLogin = data.info;
                                if (data.info === true) {
                                    $state.go('states.accountant');
                                    homeService.getUserInfo().then(function (data) {
                                        $rootScope.useInformation = data.info;
                                    });

                                    $http.get('/web/front/studentOrder/getShoppingCartCommodityPage?pageNo=1&pageSize=1').success(function (subData) {
                                        $rootScope.shoppingCount = subData.totalSize;
                                    });

                                } else {
                                    $rootScope.shoppingCount = 0;
                                }
                            });
                        },

                        goRegist: function () {
                            $scope.events.closeLoginDialog();
                            $state.go('states.accountant.registration');
                        },

                        closeLoginDialog: function () {
                            hbLoginService.closeLoginForm();
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
                        submitUse: function (e, yzmError) {
                            e.preventDefault();

                            if (yzmError === false) {
                                $scope.Ing = '正在登录...';
                                $scope.loginSubAble = true;
                                var loginParam = {
                                    'accountType': 1,
                                    'username': $scope.model.use.useName,
                                    'password': $scope.model.use.password
                                };
                                ssoLogin.login(loginParam, '{\'portalType\':\'mall\'}');
                                //$state.go('states.accountant')
                            }

                        },
                        changeCode: function () {
                            $scope.model.validateCode = '/web/login/validateCode/getValidateCode?type=1&' + Date.now();
                        },
                        registration: function () {
                            $scope.events.closeLoginDialog();
                            $state.go('states.accountant.registration');
                        },
                        forget: function () {
                            $scope.events.closeLoginDialog();
                            $state.go('states.accountant.forget');
                        },

                        MainPageQueryList: function (e, status) {
                            e.preventDefault();
                            if (!status) {
                                $scope.events.submitUse(e, $scope.loginForm.picValidateCode.$error.ajaxValidate);
                            } else {
                                //$scope.model.lwhLoading = false;
                                $scope.model.loginErrorEnter = true;
                            }
                        }

                    };


                    var initCas = function () {
                        $.get('/web/login/login/getLoginParameters.action?_q=' + new Date().getTime(), function (data) {
                            window.processLogin = function (data) {
                                if (data.code == 603) {
                                    $.get(data.location).success(function (data) {
                                        if (data.state) {
                                            $scope.loginSubAble = false;
                                            $scope.events.getIslogin();
                                            $scope.events.closeLoginDialog();
                                        }
                                    });

                                } else if (data.code == 611) {
                                    $scope.loginSubAble = false;
                                    $scope.events.getErrorOne();
                                }
                                else {
                                    $scope.loginSubAble = false;
                                    $scope.events.getErrorTwo();
                                }
                            };
                            var script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.src = data.info.casDomain + '/login?TARGET=' + data.info.currentDomain + '/web/sso/auth&js&callback=processLogin';
                            $('head').append(script);
                            //document.documentElement.appendChild(script);
                        });
                    };
                    $scope.$on('$destroy', function () {
                        $interval.cancel($scope.timeIntervar);
                        window.clearInterval(window.cauth_login_ticket_timer_id);
                    });
                    initCas();

                }
            };
        }])


        .directive('perfectUserOrderInfo', perfectOrder.perfectUserOrderInfo)


        .directive('perfectDetail', perfectOrder.perfectDetail)


        .directive('orgnizationsList',['hbBasicData',function(hbBasicData){
            return {
                restrict:'EA',
                templateUrl:'kccs/kccsv2/templates/orgnizationsList.html',
                link:function($scope){
                    //hbBasicData.removePerfectDetailDialog
                    $scope.removePerfectDetailDialog=function(){
                        hbBasicData.removePerfectDetailDialog();
                    }
                }
            }
        }]);





    angular.module('hb.util', [])

        .factory('hbUtil', [function () {
            var _hbUtil = {};
            _hbUtil.isIe = function () {
                return (function (ua) {
                    var ie = ua.match(/MSIE\s([\d\.]+)/) ||
                        ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i);
                    return ie && parseFloat(ie[1]);
                })(navigator.userAgent);
            };

            _hbUtil.validateIsNull = function (obj) {
                return (obj === '' || obj === undefined || obj === null);
            };
            return _hbUtil;
        }]);

    angular.module('hb.basicData', []).factory('hbBasicData', ['$http', 'HBInterceptor', '$rootScope', '$compile', function ($http, HBInterceptor, $rootScope, $compile) {
        var hbBasicData = {
            menuList: [],
            imageSourceConfig: {}
        };
        hbBasicData.getMenuList = function () {
            return $http.get('/web/sso/userMenuAuth', {
                params: {type: HBInterceptor.getAppString()}
            });
        };

        hbBasicData.isIe8 = function () {
            var isIEEight = false;
            if ((navigator.userAgent.indexOf('MSIE 9.0') > 0 && !window.innerWidth)
                || (navigator.userAgent.indexOf('MSIE 8.0') > 0 && !window.innerWidth)) {
                isIEEight = true;
                return isIEEight;
            } else {
                return isIEEight;
            }
        };


        hbBasicData.setResource = function () {

            if ($rootScope.uploadConfigOptions) {
                $rootScope.$broadcast('events:loadBasicDataSuccess', $rootScope.uploadConfigOptions);
            } else {
                $http.get('/web/login/login/getUploadPath').then(function (data) {
                    var info = data.data.info;
                    console.log(info);
                    $rootScope.uploadConfigOptions = {
                        context: info['context'],
                        requestContext: info['requestContext'],
                        blockMd5CheckUrl: info['blockMd5CheckPath'],
                        uploadImageUrl: info['resourceServicePath'],
                        md5CheckUrl: info['md5CheckPath']
                    };
                    if (info['uploadBigFilePath']) {
                        $rootScope.uploadConfigOptions.uploadBigImageUrl = info['uploadBigFilePath'].replace('UploadBigFile', 'uploadBigFile');
                    }

                    $rootScope.$broadcast('events:loadBasicDataSuccess', $rootScope.uploadConfigOptions);
                });
            }
        };

        hbBasicData.addHelpNav = function ($scope) {
            var $this = this, dialog = '<div help-nav></div>';
            $this.helpNavDialog = $compile(dialog)($scope);
            angular.element('body').append($this.helpNavDialog);
        };

        hbBasicData.removeHelpNav = function () {
            this.helpNavDialog.remove();
            this.helpNavDialog = null;
        };


        hbBasicData.addPerfectOrderDialog = function ($scope) {
            var $this = this, dialog = '<div perfect-user-order-info></div>';
            $this.perfectOrderDialog = $compile(dialog)($scope);
            angular.element('body').append($this.perfectOrderDialog);
        };

        hbBasicData.removePerfectOrderDialog = function () {
            this.perfectOrderDialog.remove();
            this.perfectOrderDialog = null;
        };


        hbBasicData.addPerfectDetailDialog = function ($scope, jsonStr) {
            var $this = this, dialog = '<div perfect-detail json-str=' + jsonStr + ' ></div>';
            $this.perfectDetailDialog = $compile(dialog)($scope);
            angular.element('body').append($this.perfectDetailDialog);
        };

        hbBasicData.removePerfectDetailDialog = function () {
            this.perfectDetailDialog.remove();
            this.perfectDetailDialog = null;
        };

        hbBasicData.addOrgnizationsDialog = function ($scope) {
            var $this = this, dialog = '<div orgnizations-list></div>';
            $this.orgnizationsDialog = $compile(dialog)($scope);
            angular.element('body').append($this.orgnizationsDialog);
        };

        hbBasicData.removePerfectDetailDialog = function () {
            this.orgnizationsDialog.remove();
            this.orgnizationsDialog = null;
        };

        hbBasicData.findPerfectOrderList = function () {

        };


        return hbBasicData;

    }]).run(['$http', '$rootScope', 'hbBasicData', '$log', '$state', '$timeout', 'hbBasicDataService', '$dialog',
        function ($http, $rootScope, hbBasicData, $log, $state, $timeout, hbBasicDataService, $dialog) {
            $rootScope.showApp_$$ = false;


            //$rootScope.sureUseLogin

            $rootScope.$watch('sureUseLogin', function (nv) {
                if (nv) {

                    $http.get('/web/front/studentOrder/pageInvoiceCompensationOrder', {
                        params: {
                            pageNo: 1,
                            pageSize: 1
                        }
                    }).success(function (data) {
                        if (data.status) {
                            if (data.info.length > 0) {
                                hbBasicData.addPerfectOrderDialog($rootScope);
                            }
                        } else {
                            $dialog.alert({
                                title: '提示',
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
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                $http.get('../web/login/login/getUserInfo.action')
                    .then(function (data) {
                        var info = data.data.info;
                        if (!data) {
                            return false;
                        }
                        if (info === 0) {
                            return false;
                        }
                        if (info.userType !== 1 && info.userType !== 0) {
                            $log.log('不是学员的用户不能进入学习中心');
                            window.location.href = '/admin';
                            return false;
                        }
                        if (data.data.status === true) {
                            if (info) {
                                if (info.userId === null || info.userId === '') {
                                    //window.location.href = 'portal/accountant';
                                } else {

                                    $rootScope.showApp_$$ = true;
                                    $rootScope.$$userInfo = info;

                                    $rootScope.uploadConfigOptions = {
                                        context: info['context'],
                                        requestContext: info['requestContext'],
                                        blockMd5CheckUrl: info['blockMd5CheckPath'],
                                        uploadImageUrl: info['resourceServicePath'],
                                        md5CheckUrl: info['md5CheckPath']
                                    };

                                    if (info['uploadBigFilePath']) {
                                        // hbBasicData.imageSourceConfig.uploadBigImageUrl  = info['uploadBigFilePath'].replace ( 'UploadBigFile', 'uploadBigFile' );
                                        $rootScope.uploadConfigOptions.uploadBigImageUrl = info['uploadBigFilePath'].replace('UploadBigFile', 'uploadBigFile');
                                    }
                                }
                            }
                        } else {
                            $rootScope.showApp_$$ = false;
                        }
                    });
            });


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


            function spectialDo (code, hasNotAllLen, $scope, eleModel, resultArr) {
                console.log(code);
                var skuviewYearIndex = findCommonIndex($scope.skuviewList, 'eName', hbBasicDataService.yearProperty);
                var skuPropertyYearIndex = findCommonIndex(eleModel.skuPropertyList, 'propertyIdCode', hbBasicDataService.yearProperty);
                var resultYearIndex = findCommonIndex(resultArr, 'propertyIdName', hbBasicDataService.resultYearCname);
                //angular.forEach(eleModel.skuPropertyList,function(aaaItem){
                //console.log(skuviewYearIndex);
                //console.log(skuPropertyYearIndex);

                if (hasNotAllLen === 0) {//有全部
                    if (code === 'profession' && $scope.categoryType === 'COURSE_SUPERMARKET_GOODS') {
                        $scope.skuviewList[skuviewYearIndex].model = '';
                        $scope.skuviewList[skuviewYearIndex].lwhIf = false;
                        eleModel.skuPropertyList[skuPropertyYearIndex].value = '';
                        eleModel.skuPropertyList[skuPropertyYearIndex].valueCode = '';
                    } else {
                        $scope.skuviewList[skuviewYearIndex].lwhIf = true;
                    }


                    //这个操作是固定的如果没有项目不同的时候要把这个放进去 有不同的时候固定传进去
                    //这个操作是用来动态改变sku搜索栏列表 如果不传那sku搜索栏列表就是初始化时候的样子不会变
                    /*if(fn){
                        fn();
                    }*/

                } else {//没全部
                    var yearItem = $scope.skuviewList[skuviewYearIndex];
                    var arr = $scope.model['skuItem' + yearItem.skuPropertyId];
                    console.log(arr);
                    //选中自主选课并且专业课
                    if (code === 'profession' && $scope.categoryType === 'COURSE_SUPERMARKET_GOODS') {
                        //alert('专业课');
                        $scope.skuviewList[skuviewYearIndex].model = '';
                        $scope.skuviewList[skuviewYearIndex].lwhIf = false;
                        resultArr.splice(resultYearIndex, 1);
                        console.log($scope.skuviewList[skuviewYearIndex]);
                        console.log(eleModel.skuPropertyList);
                        eleModel.skuPropertyList[skuPropertyYearIndex].value = '';
                        eleModel.skuPropertyList[skuPropertyYearIndex].valueCode = '';
                    }


                    //选中自主选课并且共需课
                    if (code === 'public' && $scope.categoryType === 'COURSE_SUPERMARKET_GOODS') {
                        //alert('公需课');
                        $scope.skuviewList[skuviewYearIndex].lwhIf = true;
                        if ($scope.skuviewList[skuviewYearIndex].model === '') {
                            $scope.skuviewList[skuviewYearIndex].model = arr[0].optionId;
                            eleModel.skuPropertyList[skuPropertyYearIndex].value = arr[0].optionId;
                            eleModel.skuPropertyList[skuPropertyYearIndex].valueCode = arr[0].code;
                            resultArr.push({
                                propertyId: eleModel.skuPropertyList[skuPropertyYearIndex].propertyId,
                                propertyIdName: hbBasicDataService.resultYearCname,
                                value: arr[0].optionId,
                                valueName: arr[0].name
                            });
                        }
                    }
                }

                //});
            }

            $rootScope.skuSpecialFn = function (code, hasNotAllLen, $scope, eleModel, fn) {
                spectialDo(code, hasNotAllLen, $scope, eleModel, fn);
            };


        }])


        .factory('hbBasicDataService', [function () {
            return {
                yearProperty: 'trainingYear',
                subjectProperty: 'trainingSubject',
                resultYearCname: '年度'

            };
        }])

        .directive('loading', [function () {
            return {
                template: '<img ng-src="images/loading1.gif" alt="">',
                link: function ($scope, $element, $attr) {
                    var parentWidth = $attr.outerWidth || $element.parent().outerWidth(),
                        parentHeight = $attr.outerHeight || $element.parent().outerHeight(),
                        imgWidth = $attr.imgWidth || 0.1;
                    $element.css({
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        lineHeight: parentHeight + 'px',
                        textAlign: 'center'
                    }).parent().css({
                        position: 'relative'
                    });
                    $element.find('img').css({
                        width: parentWidth * (imgWidth - 0)
                    });
                }
            };
        }]);
});