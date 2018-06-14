/*jshint unused: vars */
define([
        '@systemUrl@/js/common/stateMapper',
        'prometheus/directives/remote-validate',
        'uiRouterExtras',
        'oclazyload',
        '@systemUrl@/js/center.home',
        '@systemUrl@/js/states/home-state',
        '@systemUrl@/js/common/hbFrontCommon',
        'css!' + require.local_config_data_for_cms.theme,
        'angularAnimate',
        'prometheus/modules/hb-artdialog',
        'prometheus/modules/placeholder',
        'prometheus/modules/interceptor',
        '@systemUrl@/js/common/hbSkuModule',
        '@systemUrl@/js/common/hb-notification',
        'angularSanitize',
        '@systemUrl@/js/common/hbBootstrap'
    ],
    function (stateMapper, validateDirective) {
        'use strict';
        var frontModule = angular.module('app',
            [
                'oc.lazyLoad',
                'ct.ui.router.extras',
                'app.home',
                'app.states.home',
                'hb.util',
                'ngArtDialog',
                'ui.router',
                'HB_interceptor',
                'ui.bootstrap',
                'ngSanitize',
                'hb.frontCommon',
                'Placeholder',
                'HB_notifications',
                'hb.basicData',
                'ngAnimate',
                'skuCommon'
            ]
        );
        frontModule.directive('ajaxValidate', validateDirective);
        frontModule.directive('hbLoginForm', ['loginDialogService', '$interval', '$timeout', '$state', '$rootScope', 'hbBasicData', function (loginDialogService, $interval, $timeout, $state, $rootScope, hbBasicData) {
            return {

                templateUrl: '@systemUrl@/templates/common/dialogLogin.html',
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


                        goRegist: function () {
                            $scope.events.closeLoginDialog();
                            window.open('/portal/#/accountant/accountant.registration', '_self');
                        },

                        closeLoginDialog: function () {
                            loginDialogService.closeLoginForm();
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
                            }

                        },
                        changeCode: function () {
                            $scope.model.validateCode = '/web/login/validateCode/getValidateCode?type=1&' + Date.now();
                        },

                        forget: function () {
                            $scope.events.closeLoginDialog();
                            window.open('/portal/#/accountant/accountant.forget', '_self');
                            //$state.go('states.accountant.forget');
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
                                            $state.reload($state.current.name);
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
        }]);
        //frontModule.constant ( 'futureStates', si.futureStates );
        //frontModule.constant ( 'modules', si.modules );


        frontModule.factory('loginDialogService', ['$injector', '$rootScope', function ($injector, $rootScope) {

            var hbLoginServiceInstance = {};
            hbLoginServiceInstance.createLoginForm = function () {
                if (!hbLoginServiceInstance.loginForm) {
                    var loginHtml = '<div hb-login-form></div>',
                        $compile = $injector.get('$compile'),
                        linkFunc = $compile(loginHtml)($rootScope);
                    hbLoginServiceInstance.loginForm = linkFunc;
                    angular.element('body').append(linkFunc);
                }
            };

            hbLoginServiceInstance.closeLoginForm = function () {
                if (this.loginForm) {
                    this.loginForm.remove();
                    this.loginForm = undefined;
                }
            };

            return hbLoginServiceInstance;
        }]);


        frontModule.config(
            function ($interpolateProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider,
                      $futureStateProvider, $httpProvider,
                      /**restAngular配置项目的一个服务*/
                      RestangularProvider, $provide) {

                $provide.decorator('hbLoginService', ['$rootScope', '$delegate', 'loginDialogService', function ($rootScope, $delegate, loginDialogService) {
                    var count = 0;
                    $delegate.createLoginForm = function () {
                        count++;
                        //if(count<=1){
                        loginDialogService.createLoginForm();
                        //}

                    };
                    return $delegate;
                }]);

                // 为了修复IE系列编译后dom的换行
                // 以'${{'替换默认的'{{'解析开始符 --choaklin.2015.9.10
                $interpolateProvider.startSymbol('b{{');

                //HBInterceptorProvider.app = 'front';

                /////////////////////////////
                //配置RestAngular			//
                /////////////////////////////

                RestangularProvider.addFullRequestInterceptor(function
                    (element, operation, route, url, headers, params, httpConfig) {
                    if (operation === 'post') {
                        if (headers['Content-Type'] && angular.isObject(element)) {
                            if (headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1) {
                                element = $.param(element);
                            }
                        }
                    }
                    return {
                        element: element,
                        params: params,
                        headers: headers,
                        httpConfig: httpConfig
                    };
                });

                $httpProvider.interceptors.push(['$q',
                    function ($q) {
                        var responseInterceptor = {
                            request: function (request) {
                                var now = +new Date();
                                if (request.url.indexOf('/web/') !== -1) {
                                    if (request.url.indexOf('?') !== -1) {
                                        request.url += ('&_q_=' + now);
                                    } else {
                                        request.url += ('?_q_=' + now);
                                    }
                                }
                                return request;
                            },
                            responseError: function (rejection) {
                                return $q.reject(rejection);
                            }
                        };
                        return responseInterceptor;
                    }]);

                RestangularProvider.setDefaultHttpFields({cache: false});
                $ocLazyLoadProvider.config({
                    //debug: true,
                    jsLoader: requirejs,
                    //events: true,
                    loadedModules: ['states'],
                    modules: stateMapper.modules
                });

                var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
                    var deferred = $q.defer();
                    $ocLazyLoad.load(futureState.module).then(function (name) {
                        deferred.resolve();
                    }, function () {
                        deferred.reject();
                    });
                    return deferred.promise;
                }];

                $futureStateProvider.stateFactory('ocLazyLoad', ocLazyLoadStateFactory);

                $futureStateProvider.addResolve(['$q', '$injector', '$http', function ($q, $injector, $http) {
                    var deferd = $q.defer(),
                        promise = deferd.promise;
                    angular.forEach(stateMapper.futureStates, function (item) {
                        $futureStateProvider.futureState(item);
                    });
                    deferd.resolve(stateMapper.futureStates);
                    return promise;
                }]);
            })
            .run(['$rootScope', '$state', '$stateParams',
                function ($rootScope, $state, $stateParams) {
                    $rootScope.$state = $state;
                    $rootScope.$stateParams = $stateParams;
                }
            ]);

        return frontModule;
    });