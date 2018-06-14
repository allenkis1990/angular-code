/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/18
 * 时间: 11:54
 *
 */

define(['angular', 'jqueryNiceScroll'], function (angular) {
    var commonModule = angular.module('hb.frontCommon', ['hb.basicData', 'hb.niceScroll', 'hb.util']);

    //我的订单 我的班级 培训证明侧边栏指令
    commonModule.directive('centerSider', [function () {
        return {
            templateUrl: '@systemUrl@/templates/common/centerSider.html',
            replace: true,
            controller: ['$scope', '$state', '$dialog', '$rootScope', 'hbBasicData', function ($scope, $state, $dialog, $rootScope, hbBasicData) {
                //console.log($rootScope.frontSiderList);
                $scope.frontSiderList = [
                    {name: '首页', styleClass: 'ico-desktop', stateName: 'states.home', different: false},
                    {
                        name: '我的学习', styleClass: 'ico-course', stateName: 'states.myStudy', different: false,
                        subList: [
                            {name: '培训班', stateName: 'states.myStudy.trainClass'},
                            {name: '自主选课', stateName: 'states.myStudy.goods'}
                        ]
                    },
                    {name: '学习档案', styleClass: 'ico-files', stateName: 'states.studyArchives', different: false},
                    //{ name: '学习档案', styleClass: 'ico-files', stateName: 'states.trainingCertificate',different:false },
                    //{ name: '选课中心', styleClass: 'ico-class', stateName: 'states.signUpTraining',different:false },
                    {name: '我的购物车', styleClass: 'ico-car', stateName: 'states.shoppingCart', different: false},
                    {name: '我的订单', styleClass: 'ico-order', stateName: 'states.myOrder', different: false},
                    {name: '通知/常见问题', styleClass: 'ico-news', stateName: 'states.message', different: true},
                    {name: '帐号设置', styleClass: 'ico-set', stateName: 'states.accountSetting', different: false}
                ];
                /* $scope.events={

                 }*/
                $scope.openYearDialog = function (item, content) {
                    hbBasicData.addModal($scope, content);
                    $rootScope.leavename = item;
                };
                $scope.goState = function (name) {
                    if (name === $state.$current.name) {
                        return false;
                    }
                    if ($rootScope.save === false) {

                        if ($state.$current.name === 'states.accountSetting') {
                            var content = {
                                content: '你编辑的账号信息尚未保存，离开会使内容丢失，确定离开此页吗？',
                                okValue: '离开此页',
                                cancel: '留在此页'
                            };
                            $scope.openYearDialog(name, content);
                        } else {
                            $state.go(name);
                        }
                    } else {


                        $state.go(name);
                    }


                };


                $scope.goSubState = function (name) {
                    $state.go(name);
                };
            }]
        };
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

    angular.module('hb.basicData', []).factory('hbBasicData', ['$http', '$q', '$compile', '$rootScope', '$state', 'appConfig', 'appStatus', 'appData','$q', function ($http, $q, $compile, $rootScope, $state, appConfig, appStatus, appData,$q) {
        var hbBasicData = {
            menuList: [],
            imageSourceConfig: {}
        };
        //hbBasicData.getMenuList = function () {
        //    return $http.get ( '/web/sso/userMenuAuth', {
        //        params: { type: HBInterceptor.getAppString () }
        //    } );
        //};


        hbBasicData.setCookie = function (name, value) {
            var defer=$q.defer();
            var Days = 14;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
            defer.resolve();
            return defer.promise;
        };
        hbBasicData.getCookie = function (name) {
            var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        };
        hbBasicData.delCookie = function (name) {
            var defer=$q.defer();
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.getCookie(name);
            if (cval != null)
                document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();

            defer.resolve();
            return defer.promise;
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


        hbBasicData.getUserInfo = function () {
            var defer = $q.defer();

            var info = appConfig;
            if (info) {
                var temp = {
                    context: info['context'],
                    requestContext: info['requestContext'],
                    blockMd5CheckUrl: info['blockMd5CheckPath'],
                    uploadImageUrl: info['resourceServicePath'],
                    md5CheckUrl: info['md5CheckPath']
                };
                if (info['uploadBigFilePath']) {
                    temp.uploadBigImageUrl = info['uploadBigFilePath'].replace('UploadBigFile', 'uploadBigFile');
                }
                defer.resolve(temp);
            } else {
                defer.reject(undefined);
            }


            return defer.promise;
        };
        hbBasicData.addModal = function ($scope, content) {
            var $this = this, dialog = '<div leave-dialog></div>';
            $rootScope.content = content;
            $this.leaveDialog = $compile(dialog)($scope);
            angular.element('body').append($this.leaveDialog);
        };
        hbBasicData.closeModal = function () {
            this.leaveDialog.remove();
            this.leaveDialog = null;
        };
        hbBasicData.leave = function () {
            if ($rootScope.leavename === 'states.accountSetting') {
                window.open('/portal/#/accountant', '_self');
            } else if ($rootScope.leavename === 'states.frontDoLogout') {
                window.open('/web/login/login/frontDoLogout.action', '_self');
            } else if ($rootScope.leavename === 2 || $rootScope.leavename === 3 || $rootScope.leavename === 101) {
                $rootScope.show = $rootScope.leavename;
            } else {
                $state.go($rootScope.leavename);
            }
            $rootScope.save = true;
            this.leaveDialog.remove();
            this.leaveDialog = null;

        };


        hbBasicData.doPopQuestion = function ($scope) {
            var $this = this, dialog = '<div pop-question></div>';
            $this.popQuestionDialog = $compile(dialog)($scope);
            angular.element('body').append($this.popQuestionDialog);
        };

        hbBasicData.removePopDialog = function () {
            this.popQuestionDialog.remove();
            this.popQuestionDialog = null;
        };

        hbBasicData.digitalToLetter = function (i) {
            var s = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
            var sArray = s.split(' ');
            if (i < 1) return '';

            if (parseInt((i / 26) + '') == 0) return sArray[i % 26 - 1];
            else {
                if (i % 26 == 0) return (i2s(parseInt((i / 26) + '') - 1)) + sArray[26 - 1];
                else return sArray[parseInt((i / 26) + '') - 1] + sArray[i % 26 - 1];
            }
        };

        hbBasicData.addPendingModal = function ($scope) {
            var dialog = '', $this = this;
            dialog += '<div>';
            dialog += '<div loading></div>';
            dialog += '<div style="width:100%;height:100%;background:#000;position:fixed;opacity:.5;let:0;top:0;z-index:9998"></div>';
            dialog += '<div style="color:#fff;font-size:100px;text-align:center;position:fixed;top:40%;left:40%;z-index:9998">处理中...</div>';
            dialog += '</div>';
            $this.pendingDialog = $compile(dialog)($scope);
            angular.element('body').append($this.pendingDialog);
        };
        hbBasicData.closePendingDialog = function () {
            this.pendingDialog.remove();
            this.pendingDialog = null;
        };
        return hbBasicData;

    }]).run(['$http', '$rootScope', 'hbBasicData', '$log', 'appConfig', 'appStatus', 'appData', 'hbBasicDataService', '$dialog',
        function ($http, $rootScope, hbBasicData, $log, appConfig, appStatus, appData, hbBasicDataService, $dialog) {
            $rootScope.showApp_$$ = false;

            var info = appConfig,
                status = appStatus,
                appData = appData;

            if (!appData) {
                return false;
            }
            if (info.userType !== 1 && info.userType !== 0) {
                $log.log('不是学员的用户不能进入学员习中心');
                require.extUtil.openWindow(window, '/admin');
                return false;
            }
            if (status === true) {
                if (info) {
                    if (info.userId === null || info.userId === '') {
                        require.extUtil.openWindow(window, '/center/#/accountant');
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
                            $rootScope.uploadConfigOptions.uploadBigImageUrl = info['uploadBigFilePath'].replace('UploadBigFile', 'uploadBigFile');
                        }
                    }
                }
            } else {
                $rootScope.showApp_$$ = false;
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

            function spectialDo (code, hasNotAllLen, $scope, eleModel, fn) {
                var skuviewYearIndex = findCommonIndex($scope.skuviewList, 'eName', hbBasicDataService.yearProperty);
                //console.log(skuviewYearIndex);
                var skuPropertyYearIndex = findCommonIndex(eleModel.skuPropertyList, 'propertyIdCode', hbBasicDataService.yearProperty);


                //angular.forEach(eleModel.skuPropertyList,function(aaaItem){
                /* if(hasNotAllLen===0){//有全部
                     //是自主选课并且专业课
                     /!*if(code==='profession'&&$scope.categoryType==='COURSE_SUPERMARKET_GOODS'){
                         $scope.skuviewList[skuviewYearIndex].model='';
                         //$scope.skuviewList[skuviewYearIndex].lwhIf=false;
                         eleModel.skuPropertyList[skuPropertyYearIndex].value='';
                         eleModel.skuPropertyList[skuPropertyYearIndex].valueCode='';
                     }else{
                         //$scope.skuviewList[skuviewYearIndex].lwhIf=true;
                     }*!/



                     //这个操作是固定的如果没有项目不同的时候要把这个放进去 有不同的时候固定传进去
                     if(fn){
                         fn();
                     }

                 }else{//没全部
                     var yearItem=$scope.skuviewList[skuviewYearIndex];
                     var arr=$scope.model['skuItem' + yearItem.skuPropertyId];
                     console.log(arr);
                     //自主选课并且专业课
                     /!*if(code==='profession'&&$scope.categoryType==='COURSE_SUPERMARKET_GOODS'){
                         $scope.skuviewList[skuviewYearIndex].model='';
                         //$scope.skuviewList[skuviewYearIndex].lwhIf=false;
                         eleModel.skuPropertyList[skuPropertyYearIndex].value='';
                         eleModel.skuPropertyList[skuPropertyYearIndex].valueCode='';
                     }*!/
                     //自主选课并且公需课
                     /!*if(code==='public'&&$scope.categoryType==='COURSE_SUPERMARKET_GOODS'){
                         //$scope.skuviewList[skuviewYearIndex].lwhIf=true;

                         if($scope.skuviewList[skuviewYearIndex].model===''){
                             $scope.skuviewList[skuviewYearIndex].model=arr[0].optionId;
                             eleModel.skuPropertyList[skuPropertyYearIndex].value=arr[0].optionId;
                             eleModel.skuPropertyList[skuPropertyYearIndex].valueCode=arr[0].code;
                         }
                     }*!/
                 }*/

                //});
            }

            $rootScope.skuSpecialFn = function (code, hasNotAllLen, $scope, eleModel, fn) {
                spectialDo(code, hasNotAllLen, $scope, eleModel, fn);
            };


            $http.get('/web/front/studentOrder/pageInvoiceCompensationOrder', {
                params: {
                    pageNo: 1,
                    pageSize: 1
                }
            }).success(function (data) {
                if (data.status) {
                    if (data.info.length > 0) {
                        $dialog.alert({
                            title: '提示',
                            modal: true,
                            width: 250,
                            ok: function () {
                                if (dev) {
                                    window.open('/portal', '_self');
                                } else {
                                    window.open('/accountant', '_self');
                                }
                                return true;
                            },
                            cancel: function () {
                                if (dev) {
                                    window.open('/portal', '_self');
                                } else {
                                    window.open('/accountant', '_self');
                                }
                                return true;
                            },
                            content: '您目前共有' + data.info.length + '笔订单需要完善收取发票和证明的信息,请您去门户完善！'

                        });
                    }
                }
            });


        }])


        .factory('hbBasicDataService', [function () {
            return {
                yearProperty: 'trainingYear',
                subjectProperty: 'trainingSubject'
            };
        }])


        .directive('loading', [function () {
            return {
                template: '<img ng-src="@systemUrl@/images/loading.gif"  alt="">',
                link: function ($scope, $element, $attr) {
                    var parentWidth = $attr.outerWidth || $element.parent().outerWidth(),
                        parentHeight = $attr.outerHeight || $element.parent().outerHeight(),
                        imgWidth = $attr.imgWidth || 0.1;
                    $element.css({
                        width: '100%',
                        height: '100%',
                        zIndex: 9999,
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
        }])
        .directive('leaveDialog', ['hbBasicData', function (hbBasicData) {
            return {
                templateUrl: '@systemUrl@/views/accountSetting/leaveDialog.html',
                link: function ($scope) {
                    $scope.closeleaveDialog = function () {
                        hbBasicData.closeModal();
                    };
                    $scope.leaveDialog = function () {
                        hbBasicData.leave();
                    };
                }
            };
        }])


        .directive('popQuestion', ['$http', '$state', '$rootScope', 'hbBasicData', '$dialog', '$timeout', function ($http, $state, $rootScope, hbBasicData, $dialog, $timeout) {
            return {
                templateUrl: '@systemUrl@/views/myRealClass/doPopQuestionDialog.html',

                link: function ($scope, ele, attrs) {


                    console.log($scope.testListParams);

                    function getCurrentQuestion () {
                        //一进来就是第一道
                        $scope.popModel.currentQuestion = $scope.popModel.questionList[$scope.popModel.count];
                        //判断
                        if ($scope.popModel.currentQuestion.questionType === 1) {
                            $scope.popModel.currentQuestion.configurationItems = [
                                {content: '正确', id: true},
                                {content: '错误', id: false}
                            ];
                        }

                        angular.forEach($scope.popModel.currentQuestion.configurationItems, function (item, index) {
                            item.enIndex = hbBasicData.digitalToLetter(index + 1);
                        });
                        console.log($scope.popModel.currentQuestion.configurationItems);

                    }

                    $http.get('/web/front/myExam/listNotAnswerPopQuestion', {params: $scope.testListParams}).success(function (data) {

                        if (data.status) {
                            $scope.popModel.questionList = data.info;
                            getCurrentQuestion();
                        }


                    });


                    $scope.popModel = {
                        questionList: [],
                        currentQuestion: {},
                        count: 0,
                        lookAnswer: false,
                        answer: [],
                        useTime: 0,
                        showResult: false
                    };


                    $scope.popEvents = {
                        submit: function () {
                            //hbBasicData.removePopDialog();


                            if ($scope.submitAble) {
                                return false;
                            }

                            var answers = [];
                            angular.forEach($scope.popModel.currentQuestion.configurationItems, function (item) {
                                if (item.ischecked === true) {
                                    answers.push(item.id);
                                }
                            });

                            if (answers.length <= 0) {
                                $dialog.confirm({
                                    title: '提示',
                                    visible: true,
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: '请选择答案'
                                });
                                return false;
                            }


                            $scope.popModel.answer = answers;
                            console.log(answers);
                            $scope.submitAble = true;
                            $http.post('/web/front/myExam/submitPopAnswer', {
                                schemeId: $scope.testListParams.schemeId,
                                courseId: $scope.popModel.currentQuestion.courseId,
                                courseWareId: $scope.popModel.currentQuestion.courseWareId,
                                questionId: $scope.popModel.currentQuestion.questionId,
                                answer: answers
                            }).success(function (data) {
                                $scope.submitAble = false;
                                if (data.status) {
                                    $scope.popModel.currentQuestion.right = data.info;

                                    $scope.popModel.currentQuestion.hasAnswerCount++;
                                    if ($scope.popModel.currentQuestion.right) {
                                        //提交看答案为true
                                        //下一题
                                        $scope.popModel.lookAnswer = true;

                                        //答对并且没题目了关掉窗口
                                        if ($scope.popModel.questionList.length - $scope.popModel.count === 1) {
                                            $dialog.confirm({
                                                title: '提示',
                                                visible: true,
                                                modal: true,
                                                width: 250,
                                                ok: function () {
                                                    //hbBasicData.removePopDialog();
                                                    return true;
                                                },
                                                content: '您已全部答对漏答的题目!'
                                            });
                                            $scope.popModel.showCloseBtn = true;
                                        }
                                    } else {
                                        //答错了并且次数已用完并且没有题目了 显示关闭按钮
                                        if (($scope.popModel.currentQuestion.hasAnswerCount === $scope.popModel.currentQuestion.allowAnswerCount) && ($scope.popModel.questionList.length - $scope.popModel.count === 1)) {
                                            $dialog.confirm({
                                                title: '提示',
                                                visible: true,
                                                modal: true,
                                                width: 250,
                                                ok: function () {
                                                    return true;
                                                },
                                                content: '可达次数已用完'
                                            });
                                            $scope.popModel.showCloseBtn = true;
                                        }

                                        //本题答错并且本题次数用完 显示下一题
                                        if (($scope.popModel.currentQuestion.hasAnswerCount === $scope.popModel.currentQuestion.allowAnswerCount) && !($scope.popModel.questionList.length - $scope.popModel.count === 1)) {
                                            $scope.popModel.currentQuestionOver = true;
                                        }

                                    }

                                    $scope.popModel.showResult = true;

                                }
                            });


                        },

                        next: function () {
                            //下一题看答案为false
                            $scope.popModel.lookAnswer = false;
                            $scope.popModel.count++;
                            //点下一题先隐藏答对答错
                            $scope.popModel.showResult = false;
                            $scope.popModel.currentQuestionOver = false;
                            getCurrentQuestion();
                        },

                        close: function () {
                            hbBasicData.removePopDialog();
                        },

                        chosePanduan: function (item) {
                            angular.forEach($scope.popModel.currentQuestion.configurationItems, function (oItem) {
                                oItem.ischecked = false;
                            });
                            item.ischecked = true;
                        },


                        parseMyAnswer: function () {
                            //return hbBasicData.digitalToLetter( Number(i)+1);
                            var arr = [];
                            angular.forEach($scope.popModel.currentQuestion.configurationItems, function (item) {
                                if (item.ischecked) {
                                    arr.push(item.enIndex);
                                }
                            });
                            return arr.join(',');
                        },


                        parseRightAnswer: function (type) {

                            var arr = [];
                            if (type === 'dan') {
                                angular.forEach($scope.popModel.currentQuestion.configurationItems, function (item) {
                                    if (item.id === $scope.popModel.currentQuestion.correctAnswer) {
                                        arr.push(item.enIndex);
                                    }
                                });
                            } else {
                                angular.forEach($scope.popModel.currentQuestion.configurationItems, function (item) {
                                    angular.forEach($scope.popModel.currentQuestion.correctAnswers, function (subItem) {
                                        if (item.id === subItem) {
                                            arr.push(item.enIndex);
                                        }
                                    });
                                });
                            }

                            return arr.join(',');


                        },

                        digitalToLetterDuo: function (arr) {
                            //return hbBasicData.digitalToLetter( Number(i)+1);
                            var num = '';
                            angular.forEach(arr, function (item) {
                                num += hbBasicData.digitalToLetter(Number(item) + 1);
                            });
                            return num;
                        },

                        choseDuoxuan: function (item) {
                            item.ischecked = !item.ischecked;
                        }
                    };
                }
            };
        }])


        .directive('loadingMore', ['$timeout', function ($timeout) {
            return {
                scope: {
                    loadFn: '&',
                    lwhPending: '=',
                    pageno: '=',
                    totalpagesize: '='
                },
                link: function ($scope) {
                    function isFixTheBar () {
                        var tH = $(window).height() + $(window).scrollTop(), dH = $(document).height();
                        if (tH >= dH - 100) {
                            //console.log(1);
                            $('.m-sum-bar').removeClass('lwh-shoppingBar');
                        } else {
                            //console.log(2);
                            $('.m-sum-bar').addClass('lwh-shoppingBar');
                        }
                    }

                    isFixTheBar();
                    //console.log($(document).height());


                    $timeout(function () {
                        $(window).scroll(function () {

                            var total = $(this).height() + $(this).scrollTop();
                            var docH = $(document).height();
                            if (total >= docH - 100) {
                                $('.m-sum-bar').removeClass('lwh-shoppingBar');
                                console.log($scope.lwhPending);
                                //count=1;
                                if (!$scope.lwhPending) {

                                    if ($scope.pageno <= $scope.totalpagesize) {
                                        $scope.pageno++;
                                        $timeout(function () {
                                            $scope.loadFn();
                                        }, 1000);
                                        console.log(1);
                                    } else {
                                        //$(window).unbind('scroll');
                                        return false;
                                    }

                                }


                                $scope.lwhPending = true;

                                //console.log(total);
                                //console.log(docH);
                            } else {
                                $('.m-sum-bar').addClass('lwh-shoppingBar');
                            }

                        }).resize(function () {
                            isFixTheBar();
                        });
                    });

                    $scope.$on('$destroy', function () {
                        $(window).unbind('scroll');
                    });

                }
            };
        }])


        .directive('studyArchivesNavFixed', ['$timeout', function ($timeout) {
            return {

                scope: {},

                link: function ($scope) {
                    function isFixTheBar () {
                        var tH = $(window).height() + $(window).scrollTop(), dH = $(document).height();
                        if (tH >= dH - 100) {
                            //console.log(1);
                            $('.m-sum-bar').removeClass('lwh-shoppingBar');
                        } else {
                            //console.log(2);
                            $('.m-sum-bar').addClass('lwh-shoppingBar');
                        }
                    }

                    isFixTheBar();


                    //加timeout是因为作用域销毁后调用了解绑滚动事件影响到了别的页面的滚动事件，加上timeout后延迟绑定上scroll事件
                    $timeout(function () {
                        $(window).scroll(function () {
                            console.log(1);
                            var total = $(this).height() + $(this).scrollTop();
                            var docH = $(document).height();
                            if (total >= docH - 100) {
                                $('.m-sum-bar').removeClass('lwh-shoppingBar');
                            } else {
                                $('.m-sum-bar').addClass('lwh-shoppingBar');
                            }

                        }).resize(function () {
                            isFixTheBar();
                        });
                    });
                    $scope.$on('$destroy', function () {
                        $(window).unbind('scroll');
                    });


                }
            };
        }]);

    var hbNiceScrollModule = angular.module('hb.niceScroll', []);

    hbNiceScrollModule.directive('hbNiceScroll', hbNiceScroll);
    hbNiceScroll.$inject = ['$parse', '$q'];

    function hbNiceScroll ($parse, $q) {
        return {
            restrict: 'A',
            scope: {
                niceScrollEnd: '&'
            },
            link: function ($scope, $element, $attr) {
                console.log(1);
                $element.css({overflow: 'hidden'});
                $element.toTopDom = null;
                $element.loadingElement = null;

                function doFunction () {
                    var defer = $q.defer(),
                        promise = defer.promise;

                    $scope.$apply(function () {
                        $element.loadingElement.show();
                        $scope.niceScrollEnd().then(function () {
                            defer.resolve();
                        });
                    });
                    return promise;
                }

                function setToTopPosition (toTopElement, isLoading) {
                    if (!toTopElement) return;
                    if (isLoading) {
                        var ofs = $element.offset(),
                            width = $element.width(),
                            height = $element.height();
                        toTopElement.css({
                            width: '16px',
                            height: '17px',
                            position: 'fixed',
                            top: (ofs.top) + 'px',
                            left: (width + ofs.left ) + 'px'
                        });
                    } else {
                        var ofs = $element.offset(),
                            width = $element.width(),
                            height = $element.height();

                        toTopElement.css({
                            position: 'fixed',
                            top: (height + ofs.top - 50) + 'px',
                            left: (width + ofs.left - 50) + 'px'
                        });
                    }
                }

                $scope.$evalAsync(function () {
                    $element.loadingElement = $('<div class="loading-ico"><img src="@systemUrl@/images/loading.gif"/></div>').hide();
                    $element.after($element.loadingElement);
                    var niceOption = $scope.$eval($attr['niceOption']),
                        niceScroll = $('body,html').niceScroll(niceOption),
                        nice = $('body,html').getNiceScroll();
                    niceScroll.onscrollend = function (data) {
                        if (data.end.y > 250) {
                            if (!$element.toTopDom) {
                                $element.toTopDom = $('<div class="to-top"></div>');
                                $element.after($element.toTopDom);
                                setToTopPosition($element.toTopDom, false);
                                $element.toTopDom.bind('click', function ($e) {
                                    $element.stop().animate({
                                        scrollTop: 0
                                    }, function () {
                                        $element.toTopDom.hide();
                                    });
                                });
                            } else {
                                $element.toTopDom.show();
                            }
                        } else {
                            if ($element.toTopDom) {
                                $element.toTopDom.hide();
                            }
                        }

                        if ($attr['niceScrollEnd']) {
                            setToTopPosition($element.loadingElement, true);
                            if (data.end.y + 5 > this.page.maxh) {
                                $scope.$evalAsync($attr['niceScrollEnd']);
                                doFunction().then(function () {
                                    $element.loadingElement.hide();
                                });
                            }
                        }

                        if ($attr['niceScrollTopEnd']) {
                            if (data.end.y <= 0) {
                                $scope.$evalAsync($attr['niceScrollTopEnd']);
                            }
                        }
                    };

                    if ($attr['niceScrollObject']) {
                        $parse($attr['niceScrollObject']).assign($scope, nice);
                    }

                    $scope.$on('$destroy', function () {
                        if ($element.toTopDom) {
                            $element.toTopDom.unbind('click');
                            $element.toTopDom.remove();
                        }
                        if (angular.isDefined(nice)) {
                            nice.remove();
                        }
                    });
                    $(window).resize(function () {
                        setToTopPosition($element.toTopDom, false);
                        setToTopPosition($element.loadingElement, true);
                    });
                });
            }
        };
    }

});