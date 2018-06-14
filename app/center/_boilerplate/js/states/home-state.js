define(['angularUiRouter', 'jqueryKnob', 'jqueryExcanvas', '@systemUrl@/js/modules/myRealClass/services/myRealClass-service'],
    function (router, a, b, myRealClassService) {
        'use strict';

        return angular.module('app.states.home', [
            'ui.router'
        ])
            .config(['$stateProvider', '$urlRouterProvider', 'hb.domainConfig',
                function ($stateProvider,
                          $urlRouterProvider, hb_domainConfig) {

                    var stateConfig = {
                        abstract: true, url: '',
                        views: {
                            'qrcode@': {
                                templateUrl: '@systemUrl@/views/qrcode.html'
                            },
                            'topView@': {
                                templateUrl: '@systemUrl@/views/home/top.html',
                                controller: ['$scope', '$rootScope', '$http', '$state', 'homeService', 'hbBasicData', '$dialog',
                                    function ($scope, $rootScope, $http, $state, homeService, hbBasicData, $dialog) {
                                        $scope.openYearDialog = function (item, content) {
                                            hbBasicData.addModal($scope, content);
                                            $rootScope.leavename = item;
                                        };
                                        $scope.goHome = function () {

                                            if ($state.$current.name === 'states.accountSetting') {
                                                if ($rootScope.save === false) {
                                                    var content = {
                                                        content: '你编辑的账号信息尚未保存，离开会使内容丢失，确定离开此页吗？',
                                                        okValue: '离开此页',
                                                        cancel: '留在此页'
                                                    };
                                                    $scope.openYearDialog('states.accountSetting', content);
                                                } else {

                                                    if (dev) {
                                                        window.open('/portal/#/accountant', '_self');
                                                    } else {
                                                        window.open('/#/accountant', '_self');
                                                    }

                                                    //window.open('/portal/#/accountant', '_self');
                                                }
                                            } else {
                                                if (dev) {
                                                    window.open('/portal/#/accountant', '_self');
                                                } else {
                                                    window.open('/#/accountant', '_self');
                                                }
                                            }
                                        };
                                        $scope.goCenter = function () {
                                            if ($state.$current.name === 'states.accountSetting') {
                                                if ($rootScope.save === false) {
                                                    var content = {
                                                        content: '你编辑的账号信息尚未保存，离开会使内容丢失，确定离开此页吗？',
                                                        okValue: '离开此页',
                                                        cancel: '留在此页'
                                                    };
                                                    $scope.openYearDialog('states.home', content);
                                                } else {
                                                    $state.go('states.home');
                                                }
                                            } else {
                                                $state.go('states.home');
                                            }
                                        };


                                        $scope.goOntrainingView = function () {
                                            if (dev) {
                                                window.open('/portal/#/accountant/accountant.onTraining/', '_blank');
                                            } else {
                                                window.open('/#/accountant/accountant.onTraining/', '_blank');
                                            }
                                        };

                                        $scope.ieshow = hbBasicData.isIe8();
                                        $scope.outOfLogin = function (e) {
                                            e.preventDefault();
                                            /*           $dialog.alert ( {
                                                        /!*   title  : '提示',*!/
                                                           visible: true,
                                                           modal  : true,
                                                           width  : 250,
                                                           okValue    : '确认退出',
                                                           ok     : function () {
                                                               window.open ( '/web/login/login/frontDoLogout.action', '_self' );
                                                               return true;
                                                           },
                                                           cancel: function () {
                                                               return true;
                                                           },
                                                           content: '你确定退出学习？'
                                                       } )*/
                                            var content = {
                                                content: '你确定退出学习？',
                                                okValue: '确定',
                                                cancel: '取消'
                                            };
                                            $scope.openYearDialog('states.frontDoLogout', content);

                                        };

                                    }]
                            },
                            'footerView@': {
                                templateUrl: '@systemUrl@/views/home/footer.html'
                            }
                        }
                    };
                    // 如果有相应的额配置进来， 则用特殊的处理方式
                    if (hb_domainConfig.units && hb_domainConfig.units.length) {
                        $urlRouterProvider
                            .otherwise('/' + hb_domainConfig.dir + '/home');
                        hb_domainConfig.units.push({
                            name: hb_domainConfig.name,
                            path: hb_domainConfig.dir,
                            dir: hb_domainConfig.dir
                        });
                        var limits = [];
                        angular.forEach(hb_domainConfig.units, function (domain) {
                            $urlRouterProvider.when('/' + domain.path, '/' + domain.path + '/home');
                            limits.push(domain.path);
                        });
                        var urlLimit = '{unitPath: ' + limits.join('|') + '}';
                        stateConfig.url = '/' + urlLimit;
                        stateConfig.resolve = {
                            getTitle: ['$stateParams', '$timeout','$rootScope', function ($stateParams, $timeout,$rootScope) {
                                return $timeout(function () {
                                    require.unitPath = $stateParams.unitPath;
                                    document.title = require.extUtil.getItem(hb_domainConfig.units, $stateParams.unitPath, 'path').name || hb_domainConfig.name;
                                    $rootScope.porTitleName=require.extUtil.getItem(hb_domainConfig.units, $stateParams.unitPath, 'path').name || hb_domainConfig.name;
                                });
                            }]
                        };
                    } else {
                        $urlRouterProvider
                            .otherwise('home');
                    }

                    $stateProvider.state('states', stateConfig);

                    $stateProvider
                        .state('states.home', {
                            url: '/home',
                            views: {
                                'contentView@': {
                                    templateUrl: '@systemUrl@/views/home/home.html',
                                    controller: ['$rootScope', '$scope', 'homeService', '$state', '$dialog', '$http', 'myRealClassService', function ($rootScope, $scope, homeService, $state, $dialog, $http, myRealClassService) {
                                        $scope.model = {
                                            lastStudyCourse: [],
                                            userYearList: [],
                                            currentUserYearObj: {},
                                            userStudyData: {},
                                            pxtzType: 'TRAINING_NOTICE',
                                            pxtzList: [],
                                            cjwtType: 'HELP_CENTER_COMMON_PROBLEM',
                                            cjwtList: []
                                        };


                                        $scope.events = {

                                            changeUserYear: function (item) {
                                                if ($scope.submitAble) {
                                                    return false;
                                                }
                                                $scope.model.currentUserYearObj = item;
                                                getUserStudyData();
                                            },

                                            goMessage: function (tabId) {
                                                $state.go('states.message', {tabId: tabId});
                                            },
                                            goMessageDetail: function (item) {
                                                $state.go('states.message.messageViews', {id: item.id});
                                            },

                                            openListenWindow: function (item, e) {


                                                var goodsType = '';
                                                switch (item.courseType) {
                                                    case 1:
                                                        goodsType = 'TRAINING_CLASS';
                                                        break;
                                                    case 2:
                                                        goodsType = 'COURSE';
                                                        break;
                                                    case 3:
                                                        goodsType = 'interestCourse';
                                                        break;
                                                }
                                                //window.open ( '/play/#/learn/'+item.schemeId+'/' + item.courseId+'/'+'courseware/'+goodsType, '_blank' );


                                                if (goodsType === 'COURSE') {
                                                    homeService.listenCourse('list', item, e, $http, $scope, $dialog);
                                                }

                                                //班级和兴趣课程一样的校验
                                                if (goodsType === 'TRAINING_CLASS' || goodsType === 'interestCourse') {
                                                    myRealClassService.validateUserClassThenDo('list', item.schemeId, $dialog, function () {
                                                        window.open('/play/#/learn/' + item.schemeId + '/' + item.courseId + '/' + 'courseware/' + goodsType+'?unitName='+require.unitPath, '_blank');
                                                    }, $scope);
                                                }


                                            }
                                        };


                                        //获取资讯
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

                                        //培训通知
                                        getSimpleList($scope.model.pxtzType, 7, 'pxtzList');
                                        //常见问题
                                        getSimpleList($scope.model.cjwtType, 7, 'cjwtList');


                                        function getUserStudyData () {
                                            $scope.submitAble = true;
                                            $http.get('/web/front/myClass/countCreditData?skuPropertyValue=' + $scope.model.currentUserYearObj.optionId).success(function (data) {
                                                $scope.submitAble = false;
                                                if (data.status) {
                                                    $scope.model.userStudyData = data.info;
                                                }
                                            });
                                        }


                                        $http.get('/web/front/myClass/listYearSkuPropertyOptionByUser').success(function (data) {
                                            if (data.status) {
                                                $scope.model.userYearList = data.info;
                                                if ($scope.model.userYearList.length > 0) {
                                                    $scope.model.currentUserYearObj = $scope.model.userYearList[0];
                                                    getUserStudyData();
                                                }
                                            }
                                        });


                                        homeService.listLastStudyCourse().then(function (data) {
                                            $scope.model.lastStudyCourse = data.info;
                                        });
                                    }]
                                }
                            }
                        })
                        .state('states.home.detail', {
                            url: '/home/detail?jsonObj',
                            params: {'jsonObj': null},
                            views: {
                                'contentView@': {
                                    templateUrl: '@systemUrl@/views/home/detail.html',
                                    controller: ['$scope', '$rootScope', 'homeService', '$state', '$stateParams', 'HB_notification', '$dialog', '$http', '$timeout', function ($scope, $rootScope, homeService, $state, $stateParams, HB_notification, $dialog, $http, $timeout) {
                                        $scope.model = {
                                            currrnt: 1,
                                            /*  change:true,*/
                                            hide: true,
                                            testPaperList: []
                                        };
                                        $scope.test = true;
                                        $scope.events = {


                                            openTestHistory: function () {

                                                if ($scope.submitAble) {
                                                    return false;
                                                }
                                                if (!$scope.detail.coursePracticeResult.hasPracticeRecord) {
                                                    $dialog.alert({
                                                        title: '提示',
                                                        visible: true,
                                                        modal: true,
                                                        width: 250,
                                                        ok: function () {
                                                            return true;
                                                        },
                                                        content: '系统自动合格，无测验记录'
                                                    });
                                                    return false;
                                                }

                                                $scope.submitAble = true;
                                                $http.get('/web/front/coursePaper/listHistoryCoursePaper', {
                                                    params: {
                                                        courseId: $scope.queryParam.courseId,
                                                        schemeId: $scope.queryParam.schemeId,
                                                        commoditySkuId: $scope.queryParam.commoditySkuId
                                                    }
                                                }).success(function (response) {
                                                    $scope.submitAble = false;
                                                    if (response.status) {
                                                        $scope.model.canEnterTestPaperView = response.info.publicAnalysis;
                                                        $scope.model.testPaperList = response.info.historyPracticePaperList;
                                                        $scope.model.courseId = response.info.courseId;
                                                        $scope.model.remainTimes = response.info.remainTimes;
                                                    }
                                                });

                                                $dialog.contentDialog({
                                                    title: '课后测验记录',
                                                    visible: true,
                                                    modal: true,
                                                    contentUrl: '@systemUrl@/views/home/lookTestDialog.html'
                                                }, $scope).then(function (data) {
                                                    $scope.lookTestDialog = data;
                                                });
                                            },


                                            goTestHistoryDetail: function (item) {

                                                console.log(item);
                                                if ($scope.submitAble) {
                                                    return false;
                                                }

                                                $scope.submitAble = true;
                                                $http.get('/web/front/coursePaper/showExamHistory', {
                                                    params: {
                                                        id: item.practiseId,
                                                        courseId: $scope.model.courseId,
                                                        historyAnswerExamPaperId: item.historyAnswerInfoId
                                                    }
                                                }).success(function (data) {
                                                    $scope.submitAble = false;
                                                    if (data.status) {
                                                        window.open(data.info, '_blank');
                                                    }
                                                });
                                            },

                                            log: function () {

                                                homeService.getMyCoursePapers({
                                                    courseId: $scope.queryParam.courseId,
                                                    schemeId: $scope.queryParam.schemeId
                                                }).then(function (data) {
                                                    $scope.log = data.info;
                                                });
                                                $dialog.contentDialog({
                                                    title: '课后测验记录',
                                                    visible: true,
                                                    modal: true,
                                                    width: 600,
                                                    height: 400,
                                                    contentUrl: '@systemUrl@/views/home/log.html'
                                                }, $scope);
                                            },
                                            look: function (item) {
                                                if (item.canView === true) {
                                                    homeService.showExamHistory({
                                                        id: item.practiseAnswerExamPaperId,
                                                        historyAnswerExamPaperId: item.historyAnswerInfoId

                                                    }).then(function (data) {
                                                        window.open(data.info);

                                                    });
                                                } else {
                                                    $dialog.alert({
                                                        title: '提示',
                                                        visible: true,
                                                        modal: true,
                                                        width: 250,
                                                        ok: function () {
                                                            return true;
                                                        },
                                                        content: '无法查看！'
                                                    });
                                                }

                                            },

                                            openListenWindow: function (cweId) {

                                                window.open('/play/#/learn/' + $scope.detail.schemeId + '/' + $scope.detail.id + '/' + cweId + '/COURSE?unitName='+require.unitPath, '_blank');
                                            },
                                            openFirstListenWindow: function () {


                                                homeService.listenCourse('init', $scope.queryParam, null, $http, $scope, $dialog, function () {
                                                    window.open('/play/#/learn/' + $scope.detail.schemeId + '/' + $scope.detail.id + '/' + 'courseware/' + 'COURSE?unitName='+require.unitPath, '_blank');

                                                });


                                            },

                                            classTest: function () {
                                                $scope.test = false;
                                                homeService.canEnter({
                                                    courseId: $scope.queryParam.courseId,
                                                    schemeId: $scope.queryParam.schemeId
                                                }).then(function (data) {
                                                    if (data.status === true) {
                                                        if (data.info === false) {
                                                            $dialog.alert({
                                                                title: '提示',
                                                                visible: true,
                                                                modal: true,
                                                                width: 250,
                                                                ok: function () {
                                                                    return true;
                                                                },
                                                                content: '未达到课程进度，无法进行课后测验！'
                                                            });
                                                            $scope.test = true;
                                                        } else {
                                                            $scope.test = true;
                                                            window.open(data.info);

                                                        }


                                                    } else {
                                                        $dialog.alert({
                                                            title: '提示',
                                                            visible: true,
                                                            modal: true,
                                                            width: 250,
                                                            ok: function () {
                                                                return true;
                                                            },
                                                            content: data.info
                                                        });

                                                        $scope.test = true;
                                                    }
                                                });
                                            },

                                            hide: function (item) {
                                                if (item.hide === true) {
                                                    item.hide = false;
                                                } else {
                                                    item.hide = true;
                                                }

                                                /*   if( $scope.model.change===true){
                                                       angular.forEach(item.subCourseOutlines, function (item1) {
                                                           item1.timeLength=timeToStr(item1.timeLength);
                                                       });
                                                       $scope.model.change=false;

                                                   }*/
                                                $scope.model.courseOutlineId = item.courseOutlineId;

                                            },

                                            doTesting: function (item, e) {
                                                if ($scope.detail.coursePracticeResult.status === 2) {
                                                    $dialog.alert({
                                                        title: '提示',
                                                        visible: true,
                                                        modal: true,
                                                        width: 250,
                                                        ok: function () {
                                                            return true;
                                                        },
                                                        content: '未达到课程进度，无法进行课后测验'
                                                    });
                                                    return false;
                                                }
                                                if ($scope.detail.coursePracticeResult.status === 6) {
                                                    $dialog.alert({
                                                        title: '提示',
                                                        visible: true,
                                                        modal: true,
                                                        width: 250,
                                                        ok: function () {
                                                            return true;
                                                        },
                                                        content: '课后测验次数已用完，无法进行课后测验'
                                                    });
                                                    return false;
                                                }
                                                if ($scope.detail.coursePracticeResult.status === 5) {
                                                    $dialog.alert({
                                                        title: '提示',
                                                        visible: true,
                                                        modal: true,
                                                        width: 250,
                                                        ok: function () {
                                                            return true;
                                                        },
                                                        content: '课后测验已合格，无需再测验'
                                                    });
                                                    return false;
                                                }
                                                homeService.doTesting(item, e, $scope, $http, $dialog, $scope.queryParam.commoditySkuId, $scope.detail.id);
                                            }


                                        };

                                        $scope.queryParam = angular.fromJson($stateParams.jsonObj);


                                        //初始化一进来要调用下是否可以进入课程 主从同步问题延时一秒执行！
                                        $timeout(function () {
                                            homeService.listenCourse('init', $scope.queryParam, null, $http, $scope, $dialog);
                                        }, 1000);


                                        homeService.getCourseGoodInfo({
                                            courseId: $scope.queryParam.courseId,
                                            schemeId: $scope.queryParam.schemeId,
                                            commoditySkuId: $scope.queryParam.commoditySkuId,
                                            userChooseCourseId: $scope.queryParam.userChooseCourseId
                                        }).then(function (data) {
                                            $scope.detail = data.info;
                                            angular.forEach($scope.detail.courseOutlineDtos, function (item1) {
                                                angular.forEach(item1.subCourseOutlines, function (item2, index) {
                                                    item2.timeLength = timeToStr(item2.timeLength);
                                                    if (index === 0) {
                                                        item2.hide = false;
                                                    } else {
                                                        item2.hide = true;
                                                    }
                                                });

                                                /* item1.timeLength=timeToStr(item1.timeLength);*/
                                            });


                                        });

                                        function timeToStr (time) {
                                            var h = 0,
                                                m = 0,
                                                s = 0,
                                                _h = '00',
                                                _m = '00',
                                                _s = '00';
                                            h = Math.floor(time / 3600);
                                            time = Math.floor(time % 3600);
                                            m = Math.floor(time / 60);
                                            s = Math.floor(time % 60);
                                            _s = s < 10 ? '0' + s : s + '';
                                            _m = m < 10 ? '0' + m : m + '';
                                            _h = h < 10 ? '0' + h : h + '';
                                            return _h + ':' + _m + ':' + _s;
                                        }
                                    }]
                                }
                            }
                        });

                }])
            .factory('homeService', ['Restangular', '$compile', 'hbBasicData', '$state', function (Restangular, $compile, hbBasicData, $state) {
                var base = Restangular.withConfig(function (config) {
                    config.setBaseUrl('/web/login/login');
                });
                var myCourse = Restangular.withConfig(function (config) {
                    config.setBaseUrl('/web/front/myCourse');

                });


                var coursePaperAction = Restangular.withConfig(function (config) {
                    config.setBaseUrl('/web/front/coursePaperAction');

                });
                var play = Restangular.withConfig(function (config) {
                    config.setBaseUrl('/web/portal/play');
                });
                return {

                    doTesting: function (item, e, $scope, $http, $dialog, skuId, courseId) {
                        if (e) {
                            e.stopPropagation();
                        }
                        if ($scope.submitAble) {
                            return false;
                        }

                        $scope.submitAble = true;
                        $http.get('/web/front/coursePaper/validCoursePractice', {
                            params: {
                                schemeId: item.schemeId,
                                courseId: item.courseId || courseId,
                                commoditySkuId: item.commoditySkuId || skuId
                            }
                        }).success(function (data) {
                            $scope.submitAble = false;

                            if (data.code === 200) {


                                switch (data.info.code) {
                                    case '200':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '201':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '301':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '302':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '303':
                                        window.open(data.info.data, '_blank');
                                        break;
                                    case '304':
                                        window.open(data.info.data, '_blank');
                                        break;
                                    case '305':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '306':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '307':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '308':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                $scope.testListParams = {
                                                    courseId: item.courseId || courseId,
                                                    commoditySkuId: item.commoditySkuId || skuId,
                                                    schemeId: item.schemeId,
                                                    trainingSchemeType: 'COURSE'
                                                };

                                                hbBasicData.doPopQuestion($scope);
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                }

                            }
                        });
                    },


                    listenCourse: function (entryType, item, e, $http, $scope, $dialog, callBack) {
                        var $this = this;
                        if (e) {
                            e.stopPropagation();
                        }
                        if ($scope.submitAble) {
                            return false;
                        }

                        $scope.submitAble = true;
                        $http.get('/web/front/myCourse/validCourseLearning', {
                            params: {
                                schemeId: item.schemeId,
                                courseId: item.courseId,
                                commoditySkuId: item.commoditySkuId
                            }
                        }).success(function (data) {
                            $scope.submitAble = false;

                            if (data.code === 200) {

                                //data.info.code='302';
                                switch (data.info.code) {
                                    case '200':
                                        //list如果是列表调用跳去听视频  detail如果是进详情调用不进行操作
                                        if (entryType === 'list') {
                                            window.open('/play/#/learn/' + item.schemeId + '/' + item.courseId + '/' + 'courseware/' + 'COURSE?unitName='+require.unitPath, '_blank');
                                        } else {
                                            if (callBack) {
                                                callBack();
                                            }
                                        }
                                        break;
                                    case '300':
                                        if (entryType === 'init') {
                                            /*$dialog.alert ( {
                                                title  : '提示',
                                                modal  : true,
                                                width  : 250,
                                                ok     : function () {
                                                    return true;
                                                },
                                                content: data.info.message
                                            } );*/
                                            if (callBack) {
                                                callBack();
                                            }

                                        } else if (entryType === 'list') {
                                            /*$dialog.alert ( {
                                                title  : '提示',
                                                modal  : true,
                                                width  : 250,
                                                ok     : function () {
                                                    return true;
                                                },
                                                content: data.info.message
                                            } );*/
                                            window.open('/play/#/learn/' + item.schemeId + '/' + item.courseId + '/' + 'courseware/' + 'COURSE?unitName='+require.unitPath, '_blank');
                                        } else {
                                            callBack && callBack();
                                        }

                                        break;
                                    case '301':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {

                                                if (entryType === 'init') {
                                                    $state.go('states.myStudy.goods');
                                                }

                                                return true;
                                            },

                                            cancel: function () {
                                                if (entryType === 'init') {
                                                    $state.go('states.myStudy.goods');
                                                }
                                                return true;
                                            },

                                            content: data.info.message
                                        });
                                        break;
                                    case '302':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                if (entryType === 'init') {
                                                    $state.go('states.myStudy.goods');
                                                }
                                                return true;
                                            },
                                            cancel: function () {
                                                if (entryType === 'init') {
                                                    $state.go('states.myStudy.goods');
                                                }
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '303':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {

                                                $scope.testListParams = {
                                                    courseId: item.courseId,
                                                    commoditySkuId: item.commoditySkuId,
                                                    schemeId: item.schemeId,
                                                    trainingSchemeType: 'COURSE'
                                                };

                                                hbBasicData.doPopQuestion($scope);

                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '304':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                $this.sureRelearn(item, $dialog, $http, $scope);
                                                return true;
                                            },
                                            cancel: function () {
                                                if (entryType !== 'init') {
                                                    callBack && callBack();
                                                }
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '305':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                $this.sureRelearn(item, $dialog, $http, $scope);
                                                return true;
                                            },
                                            cancel: function () {
                                                if (entryType !== 'init') {
                                                    callBack && callBack();
                                                }
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                    case '306':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                $this.sureRelearn(item, $dialog, $http, $scope);
                                                return true;
                                            },
                                            cancel: function () {
                                                if (entryType !== 'init') {
                                                    callBack && callBack();
                                                }
                                                return true;
                                            },

                                            content: data.info.message
                                        });
                                        break;


                                    case '307':
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                return true;
                                            },
                                            content: data.info.message
                                        });
                                        break;
                                }

                            }
                        });
                    },


                    courseRelearn: function (item, $dialog, $http, $scope) {
                        var $this = this;
                        $dialog.confirm({
                            title: '重学提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                $this.sureRelearn(item, $dialog, $http, $scope);
                                //$scope.events.sureReLearnClass();
                                return true;
                            },
                            cancel: function () {
                                return true;
                            },
                            content: '重学课程将清空本课程已有学习记录、课后测验成绩，是否确认重学'
                        });
                    },

                    sureRelearn: function (item, $dialog, $http, $scope) {
                        if ($scope.submitAble) {
                            return false;
                        }
                        $scope.submitAble = true;
                        $http.get('/web/front/myCourse/relearnCourse', {
                            params: {
                                schemeId: item.schemeId,
                                courseId: item.courseId,
                                commoditySkuId: item.commoditySkuId
                            }
                        }).success(function (data) {
                            $scope.submitAble = false;
                            if (data.status) {

                                hbBasicData.addPendingModal($scope);
                                setTimeout(function () {
                                    hbBasicData.closePendingDialog();
                                    $dialog.alert({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            $state.reload($state.current.name);
                                            return true;
                                        },
                                        cancel: function () {
                                            $state.reload($state.current.name);
                                            return true;
                                        },
                                        content: '课程重学成功！'
                                    });
                                }, 3000);


                            } else {
                                $dialog.alert({
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


                    getpalyParms: function (params) {
                        return play.one('getpalyParms').get(params);
                    },
                    showExamHistory: function (params) {
                        return coursePaperAction.one('showExamHistory').get(params);
                    },
                    canEnter: function (params) {
                        return coursePaperAction.one('canEnter').get(params);
                    },
                    getTrainingYearList: function () {
                        return myCourse.one('getUserTrainingYearList').get();
                    },
                    findUserYearLearningData: function (trainingYear) {
                        return myCourse.one('findUserYearLearningData?trainingYear=' + trainingYear).get();
                    },
                    listLastStudyCourse: function () {
                        return myCourse.one('listLastStudyCourse').get();
                    },
                    getCourseGoodInfo: function (params) {
                        return myCourse.one('getCourseGoodInfo').get(params);
                    },
                    findMyCourseInfo: function (params) {
                        return myCourse.one('findMyCourseInfo').get(params);
                    },
                    getCourseRelationInfo: function (params) {
                        return myCourse.one('getCourseRelationInfo').get(params);
                    },
                    getTitleLevelList: function () {
                        return myCourse.one('getTitleLevelList').get();
                    },
                    getUserInfo: function () {
                        return base.one('getUserInfo').get();
                    },
                    getUserSubjectList: function (trainingYear) {
                        return myCourse.one('getUserSubjectList?trainingYear=' + trainingYear).get();
                    },
                    getMyCoursePapers: function (params) {
                        return myCourse.one('getMyCoursePapers').get(params);
                    },

                    addModal: function ($scope) {

                        var $this = this, dialog = '<div year-dialog></div>';
                        $this.yearDialog = $compile(dialog)($scope);
                        angular.element('body').append($this.yearDialog);
                    },

                    closeModal: function () {
                        this.yearDialog.remove();
                        this.yearDialog = null;
                    }
                };
            }])

            .factory('myRealClassService', myRealClassService)

            .directive('yearDialog', ['homeService', function (homeService) {
                return {
                    templateUrl: '@systemUrl@/views/home/yearDialog.html',
                    link: function ($scope) {
                        $scope.closeYearDialog = function () {
                            homeService.closeModal();
                        };
                    }
                };
            }]);
    });
