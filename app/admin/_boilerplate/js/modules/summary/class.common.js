/**
 * Created by wengpengfei on 2016/11/16.
 */
define(['angular'], function (angular) {
    'use strict';

    var _undefined = arguments[5];

    angular.module('class.common', [])

        .directive('classReportSearchCommon', [function () {
            return {
                controller: ['$scope', function ($scope) {

                }]
            };
        }])

        .factory('genQueryData', [function () {
            var minDate = new Date(2017, 0, 8);
            return {
                // 月份减1 下面表示 2016-12-1
                minDate: minDate,
                genQuery: function (data, model) {
                    data.queryParam = {};

                    console.log("MMMM");
                    console.log(model);
                    data.queryParam.pageNo = data.page;
                    data.queryParam.pageSize = data.pageSize;

                    if (model.skuParamsLearingDetail) {
                        data.queryParam.skuPropertyList = model.skuParamsLearingDetail.skuPropertyList;
                    }
                    if (model.studentName) {
                        data.queryParam.studentName = model.studentName;
                    }
                    if (model.uniqueData) {
                        data.queryParam.uniqueData = model.uniqueData;
                    }
                    if (model.qualified) {
                        data.queryParam.qualified = model.qualified.optionId;
                    }
                    if (model.studyStatus) {
                        data.queryParam.studyStatus = model.studyStatus.optionId;
                    }

                    if (model.learnTimeYear) {
                        data.queryParam.learnTimeYear = model.learnTimeYear.optionId;
                    }
                    if (model.titleLevel) {
                        data.queryParam.professionalLevel = model.titleLevel.optionId;
                    }
                    if (model.learnCategory) {
                        data.queryParam.trainingType = model.learnCategory.optionId;
                    }
                    if (model.region) {
                        data.queryParam.regionId = model.region.id;
                        data.queryParam.regionPath = model.region.regionPath;
                    }
                    if (model.courseName) {
                        data.queryParam.courseName = model.courseName;
                    }

                    if (model.trainClass) {
                        data.queryParam.trainClassId = model.trainClass.trainClassId;
                    }

                    if (model.lessonProvider) {
                        data.queryParam.courseProvider = model.lessonProvider.id;
                    }
                    if (model.startTime) {
                        data.queryParam.startTime = toDateStr(model.startTime) + ' 00:00:00';
                    }
                    if (model.learningBeginTime) {
                        data.queryParam.learningBeginTime = model.learningBeginTime;
                    }
                    if (model.learningEndTime) {
                        data.queryParam.learningEndTime = model.learningEndTime;
                    }
                    if (model.endTime) {
                        /*model.endTime.setHours(23);
                         model.endTime.setMinutes(59);
                         model.endTime.setSeconds(59);*/
                        //model.endTime
                        data.queryParam.endTime = toDateStr(model.endTime) + ' 23:59:59';

                        //data.queryParam.endTime=data.queryParam.endTime.getTime();
                    }
                    if (model.belongsType) {
                        data.queryParam.belongsType = model.belongsType;
                    }
                    if (model.authorizeToUnitId) {
                        data.queryParam.authorizeToUnitId = model.authorizeToUnitId;
                    }
                    if (model.authorizedFromUnitId) {
                        data.queryParam.authorizedFromUnitId = model.authorizedFromUnitId;
                    }
                    if (model.objectId) {
                        data.queryParam.objectId = model.objectId;
                    }
                    if(model.targetUnitId){
                        data.queryParam.targetUnitId = model.targetUnitId;
                    }
                    delete data.page;
                    delete data.pageSize;
                    delete data.skip;
                    delete data.take;

                    return data;
                },
                setMaxDate: function (e) {
                    if (!this.$scope.model.query) {
                        this.$scope.model.query = this.$scope.model;
                    }
                    var who = e.sender.element;
                    var today = new Date(),
                        ngModel = $(who).attr('ng-model'),
                        yesToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                    if (ngModel === 'startDate' && !this.$scope.model.query.endTime) {
                        this.max(yesToday);
                    }

                    if (!this.isNotSbMode) {
                        if (ngModel === 'endDate' && this.$scope.model.query.startTime) {
                            this.min(this.$scope.model.query.startTime);
                        } else {
                            this.min(minDate);
                        }
                    }

                    if (ngModel === 'endDate') {
                        this.max(yesToday);
                    }
                },


                resetSku: function () {


                }
            };

            function toDateStr (dataObj) {
                var now = dataObj;
                var year = now.getFullYear();
                var month = (now.getMonth() + 1).toString();
                var day = (now.getDate()).toString();
                if (month.length == 1) {
                    month = '0' + month;
                }
                if (day.length == 1) {
                    day = '0' + day;
                }
                var dateTime = year + '-' + month + '-' + day;
                return dateTime;
                //console.log(dateTime);
            }
        }])

        .directive('classReportSearch', ['hbUtil', 'HB_dialog', '$parse', 'genQueryData', '$rootScope', 'hbSkuService',
            function (hbUtil, HB_dialog, $parse, genQueryData, $rootScope, hbSkuService) {

                return {
                    replace: true,
                    scope: {
                        items: '=',
                        model: '=',
                        grid: '=',
                        search: '&',
                        report: '&',
                        permission: '=',
                        lwhSkuModel: '=',
                        skuName: '=?'
                    },
                    templateUrl: '@systemUrl@/templates/summary/classReportSearchBar.html',
                    compile: function () {
                        return function ($scope, $element, $attr, $ctrl) {


                            $scope.time = $attr.time;
                            $scope.error = {};
                            $scope.startInited = false;
                            $scope.timeConfig = {
                                open: function (e) {
                                    this.$scope = $scope;
                                    // this.endTime = $scope.model.endTime;
                                    genQueryData.setMaxDate.call(this, e);

                                }
                            };

                            $scope.$watch('model.trainClass.trainClassId', function (newValue, oldValue) {
                                console.log(newValue);
                                if (newValue) {
                                    if (newValue !== null && newValue !== '' && newValue !== undefined) {
                                        if ($scope.lwhSkuMode !== null && $scope.lwhSkuMode !== '' && $scope.lwhSkuMode !== undefined) {
                                            angular.forEach($scope.lwhSkuModel.skuPropertyList, function (item) {
                                                item.value = '';
                                            });
                                        }

                                    } else {
                                        $scope.skuName = '';
                                    }
                                } else {
                                    $scope.skuName = '';
                                }
                            });

                            $scope.fn = function (model) {
                                console.log(model);
                            };
                            $scope.events = {
                                genReportQuery: function () {
                                    return genQueryData.genQuery({}, $scope.model);
                                }
                            };
                        };
                    }
                };
            }])

        .directive('regionReportSearch', ['hbUtil', 'genQueryData', function (hbUtil, genQueryData) {

            return {
                replace: true,
                scope: {
                    items: '=',
                    model: '=',
                    search: '&',
                    grid: '=',
                    report: '&',
                    viewName: '=',
                    permission: '=',
                    lwhSkuModel: '='
                },
                templateUrl: '@systemUrl@/templates/summary/regionReportSearchBar.html',
                compile: function () {
                    return function ($scope, $element, $attr, $ctrl) {
                        $scope.time = $attr.time;
                        $scope.startInited = false;
                        $scope.timeConfig = {
                            open: function (e) {

                                this.$scope = $scope;
                                genQueryData.setMaxDate.call(this, e);

                            }
                        };
                        $scope.$watch('model.endTime', function (nv) {
                            if (!nv) {
                                $scope.startInited = false;
                            }
                        });
                        $scope.events = {
                            genReportQuery: function () {
                                return genQueryData.genQuery({}, $scope.model);
                            }
                        };
                    };
                }
            };
        }])

        .directive('commandTool', ['$http', 'HB_dialog', '$timeout', 'genQueryData', '$state', '$notify', '$rootScope',
            function ($http, HB_dialog, $timeout, genQueryData, $state, $notify, $rootScope) {
                var methodMap = {
                    baseUrl: '/web/admin/learningStatistics/',
                    showTip: function (message) {
                        $notify.success(message);
                    },
                    error: function (message) {
                        $notify.error(message);
                    },
                    systemError: '系统异常',
                    tipContent: '成功，可前往导出任务列表下载数据!',
                    chooseWay: function ($scope, params) {
                        HB_dialog.contentAs($scope, {
                            title: '选择导出方式',
                            height: 150,
                            sure: function (who) {
                                $scope.isLoading = true;
                                return $http.post(params.baseUrl + '/' + $scope.model.reportWay, params.submit)
                                    .then(function (data) {
                                        $scope.isLoading = false;
                                        if (data.data.status) {
                                            methodMap.showTip(params.successMessage);
                                        } else {
                                            methodMap.error(data.data.info);
                                        }
                                        who.close(who.dialogIndex);
                                    }, function () {
                                        methodMap.error(methodMap.systemError);
                                        $scope.isLoading = false;
                                        who.close(who.dialogIndex);
                                    });
                            },
                            cancel: function () {
                                $scope.isLoading = false;
                            },
                            templateUrl: '@systemUrl@/views/summary/classLearning/chooseReportWay.html'
                        });
                    },
                    apply_: function ($scope, url) {
                        var me = this;
                        var query = $scope.reportQuery && $scope.reportQuery();

                        query.queryParam = angular.extend(query.queryParam, $scope.lwhSkuModel);
                        //console.log(query);
                        $scope.isLoading = true;
                        $http.post(url, query.queryParam)

                            .then(function (data) {
                                $scope.isLoading = false;
                                if (data.data.status) {
                                    methodMap.showTip(me.tipContent);
                                } else {
                                    methodMap.error(data.data.info);
                                }
                            }, function () {
                                methodMap.error(methodMap.systemError);
                                $scope.isLoading = false;
                            });
                    },
                    console: function (name) {
                        // console.log ( name );
                    },
                    annualEstablish: function ($scope) {
                        this.console('annualEstablish');
                        this.apply_($scope, '/web/admin/openStatistics/exportYearOpenStatistics');
                    },

                    classEstablish: function ($scope) {

                        this.console('classEstablish');
                        var queryParam = $scope.reportQuery && $scope.reportQuery();
                        var queryParam = queryParam.queryParam;
                        var learningEndTime = queryParam.learningEndTime;
                        var learningBeginTime = queryParam.learningBeginTime;
                        if (learningEndTime && isNaN(Number(learningEndTime))) {
                            HB_dialog.alert('error', '导出条件的学时不能为非数字');
                            return;
                        }
                        if (learningBeginTime && isNaN(Number(learningBeginTime))) {
                            HB_dialog.alert('error', '导出条件的学时不能为非数字');
                            return;
                        }

                        if (queryParam.startTime && !queryParam.endTime) {
                            HB_dialog.alert('error', '请选择结束时间');
                            return;
                        }
                        this.apply_($scope, '/web/admin/openStatistics/exportClassOpenStatistics');
                    },

                    classEstablishSubProject: function ($scope) {

                        this.console('classEstablishSubProject');
                        var queryParam = $scope.reportQuery && $scope.reportQuery();
                        var queryParam = queryParam.queryParam;
                        var learningEndTime = queryParam.learningEndTime;
                        var learningBeginTime = queryParam.learningBeginTime;
                        if (learningEndTime && isNaN(Number(learningEndTime))) {
                            HB_dialog.alert('error', '导出条件的学时不能为非数字');
                            return;
                        }
                        if (learningBeginTime && isNaN(Number(learningBeginTime))) {
                            HB_dialog.alert('error', '导出条件的学时不能为非数字');
                            return;
                        }

                        if (queryParam.startTime && !queryParam.endTime) {
                            HB_dialog.alert('error', '请选择结束时间');
                            return;
                        }
                        this.apply_($scope, '/web/admin/openStatistics/exportClassOpenStatistics');
                    },

                    classLearning: function ($scope) {
                        this.console('classLearning');
                        console.log($scope);
                        var submit = genQueryData.genQuery({}, $scope.model);

                        submit.queryParam = angular.extend(submit.queryParam, $scope.lwhSkuModel);
                        this.chooseWay($scope, {
                            successMessage: this.tipContent,
                            submit: submit.queryParam,
                            baseUrl: this.baseUrl + 'exportClassLearningInfo'
                        });
                    },
                    classLearningAll: function ($scope) {
                        this.console('classLearningAll');
                        console.log($scope);
                        var submit = genQueryData.genQuery({}, $scope.model);

                        submit.queryParam = angular.extend(submit.queryParam, $scope.lwhSkuModel);
                        this.chooseWay($scope, {
                            successMessage: this.tipContent,
                            submit: submit.queryParam,
                            baseUrl: this.baseUrl + 'exportClassLearningInfo'
                        });
                    },
                    learningDetail: function ($scope) {
                        this.console('learningDetail');
                        this.apply_($scope, '/web/admin/learningDetailStatistics/exportLearningDetail');
                    },
                    courseSelect: function ($scope) {
                        this.console('courseSelect');

                        this.apply_($scope, '/web/admin/courseChooseStatistic/exportStatisticData');
                    },

                    humanActivation: function ($scope) {
                        this.console('humanActivation');

                        this.apply_($scope, '/web/admin/userActivated/exportUserActivatedInfo');
                    },

                    regionEstablish: function ($scope) {
                        this.console('regionEstablish');

                        this.apply_($scope, '/web/admin/openStatistics/exportRegionOpenStatisticsFewFieldV2');
                    },

                    regionLearning: function ($scope) {
                        this.console('regionLearning');

                        var submit = genQueryData.genQuery({}, $scope.model);
                        if (submit.queryParam) {
                            submit.queryParam.regionType = 1;
                        }
                        submit.queryParam = angular.extend(submit.queryParam, $scope.lwhSkuModel);

                        this.chooseWay($scope, {
                            successMessage: this.tipContent,
                            submit: submit.queryParam,
                            baseUrl: this.baseUrl + 'exportAreaLearningInfo'
                        });
                    },
                    passedPerson: function ($scope) {
                        this.console('regionEstablish');

                        this.apply_($scope, '/web/admin/qualifiedStatistics/exportClassQualifiedStatistics');
                    }
                };

                function exportByStateName ($scope) {

                    for (var method in methodMap) {
                        console.log(method);
                        if ($state.includes('states.' + method)) {


                            methodMap[method]($scope);
                        }
                    }
                }

                return {
                    scope: {
                        grid: '=',
                        model: '=',
                        reportQuery: '&',
                        permission: '=',
                        isNotSbMode: '=',
                        beforeQuery: '&',
                        lwhSkuModel: '='
                    },
                    // replace : true,
                    template: ['<button exp="true" has-permission="permission.search" ng-click="doSearch()" class="btn btn-b">查询</button>',
                        '<div exp="true"   has-permission="permission.exportOut" loading-biu is-loading="isLoading" text="批量导出" loading="doReport()"></div>',
                        '<button exp="true" has-permission="permission.reset" ng-click="doRest(searchForm)" class="btn btn-g ml10">重置</button>']
                        .join(' '),
                    compile: function () {
                        return function ($scope) {

                            $scope.model = $scope.model || {};
                            var stateCur = $state.current.name;
                            $scope.doSearch = function () {
                                //alert(1);
                                var gridDataSource = $scope.grid.dataSource;
                                if ($scope.beforeQuery) {
                                    var result = $scope.beforeQuery();
                                    if (result === false) {
                                        return;
                                    }
                                }
                                if (!$scope.isNotSbMode) {
                                    if ($scope.model.startTime && !$scope.model.endTime) {
                                        $rootScope.$broadcast('events:mustOfferEndTime', true);
                                    } else if ($scope.model.learningEndTime || $scope.model.learningBeginTime) {
                                        $rootScope.$broadcast('events:mustOfferEndTime', false);
                                        if ($scope.model.learningBeginTime && isNaN(Number($scope.model.learningBeginTime))) {
                                            $scope.model.mustDoubleLearningBeginTime = 1;
                                        } else {
                                            $scope.model.mustDoubleLearningBeginTime = 0;
                                            if ($scope.model.learningEndTime && isNaN(Number($scope.model.learningEndTime))) {
                                                $scope.model.mustDoubleLearningEndTime = 1;
                                            } else {
                                                $scope.model.mustDoubleLearningEndTime = 0;
                                                gridDataSource.page(0);
                                            }
                                        }
                                    }
                                    else {
                                        $rootScope.$broadcast('events:mustOfferEndTime', false);
                                        $scope.model.mustDoubleLearningBeginTime = 0;
                                        $scope.model.mustDoubleLearningEndTime = 0;
                                        gridDataSource.page(0);
                                    }
                                } else {
                                    gridDataSource.page(0);
                                }
                                /*       if($state.current.name==='states.learningDetail'){
                                 genQueryData[stateCur]=function(){
                                 $.ajax({
                                 url: "/web/admin/learningDetailStatistics/findLearningDetailTotal",
                                 method: 'get',
                                 contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                 data:  genQueryData.genQuery({}, $scope.model.query)
                                 }).then(function (data) {
                                 console.log(data);
                                 }, function (data) {
                                 console.log(data.info);
                                 });
                                 }
                                 }
                                 genQueryData[stateCur]();*/
                            };

                            $scope.doReport = function () {
                                exportByStateName($scope);
                            };

                            $scope.doRest = function () {
                                var defaultRegion = $scope.model.defaultRegion;
                                var temp = {};
                                if (defaultRegion) {
                                    temp.defaultRegion = defaultRegion;
                                    temp.region = defaultRegion;
                                    temp.regionName = defaultRegion.name;
                                }
                                $scope.targetUnitId=$scope.model.targetUnitId;
                                $scope.model = temp;

                                //console.log(genQueryData.resetSku);
                                //$scope.model.query.trainClass={a:1};
                                console.log($state.current.name);
                                if ($state.current.name === 'states.classLearning'
                                    || $state.current.name === 'states.classEstablish') {
                                    $scope.model.belongsType="ALL";
                                    $scope.model.rangeType="commodity";
                                }
                                if ($state.current.name === 'states.classLearningAll'
                                    || $state.current.name === 'states.classEstablishSubProject') {
                                    $scope.model.belongsType="ALL";
                                    $scope.model.rangeType="commodity";
                                    $scope.model.targetUnitId=$scope.targetUnitId;
                                }
                                console.log($scope.model);
                                //合格人数统计写在控制器里的比较奇葩要在这边注册方法其他的注册在各自模块
                                if ($state.current.name === 'states.passedPerson') {
                                    genQueryData[stateCur] = function () {
                                        //$scope.model.query.trainClass={a:1};
                                        $scope.model.trainClass = {a: 1};
                                        $timeout(function () {
                                            $scope.model.trainClass = undefined;
                                        });

                                    };
                                }

                                if ($state.current.name === 'states.learningDetail') {
                                    genQueryData[stateCur] = function () {
                                        //$scope.model.query.trainClass={a:1};
                                        $scope.model.trainClass = {a: 1};
                                        $timeout(function () {
                                            $scope.model.trainClass = undefined;
                                        });
                                    };
                                }


                                genQueryData[stateCur]();

                                //if($scope.lwhSkuModel!==undefined){
                                //    angular.forEach($scope.lwhSkuModel.skuPropertyList,function(item){
                                //        item.value='';
                                //    });
                                //}
                            };
                        };
                    }
                };
            }])

        .directive('summaryDesc', ['HB_dialog', '$timeout', function (HB_dialog, $timeout) {

            function openSummaryWindow ($scope, title, templateUrl) {
                //这边SKU类目ID写死成培训班ID

                HB_dialog.contentAs($scope, {

                    title: title,
                    showTitle: true,
                    showCertain: false,
                    width: 900,
                    cancelText: '确定',
                    showCancel: true,
                    height: 580,
                    templateUrl: templateUrl
                });
            }

            var summaryTemplateFactory = {};

            summaryTemplateFactory['annualEstablish'] = '@systemUrl@/views/summary/annualEstablish/summaryTip.html';
            summaryTemplateFactory['classEstablish'] = '@systemUrl@/views/summary/classEstablish/summaryTip.html';
            summaryTemplateFactory['classEstablishSubProject'] = '@systemUrl@/views/summary/classEstablishSubProject/summaryTip.html';
            summaryTemplateFactory['classLearning'] = '@systemUrl@/views/summary/classLearning/summaryTip.html';
            summaryTemplateFactory['courseSelect'] = '@systemUrl@/views/summary/courseSelect/summaryTip.html';
            summaryTemplateFactory['humanActivation'] = '@systemUrl@/views/summary/humanActivation/summaryTip.html';
            summaryTemplateFactory['regionEstablish'] = '@systemUrl@/views/summary/regionEstablish/summaryTip.html';
            summaryTemplateFactory['regionLearning'] = '@systemUrl@/views/summary/regionLearning/summaryTip.html';
            summaryTemplateFactory['courseChooseStatistic'] = '@systemUrl@/views/courseChooseStatistic/summaryTip.html';
            summaryTemplateFactory['courseChooseStatisticAll'] = '@systemUrl@/views/courseChooseStatisticAll/summaryTip.html';
            summaryTemplateFactory['supplierResource'] = '@systemUrl@/views/supplierResource/summaryTip.html';
            summaryTemplateFactory['supplierResourceAll'] = '@systemUrl@/views/supplierResourceAll/summaryTip.html';
            summaryTemplateFactory['periodSellStatistic'] = '@systemUrl@/views/periodSellStatistic/summaryTip.html';
            summaryTemplateFactory['periodSellStatisticSubProject'] = '@systemUrl@/views/periodSellStatisticSubProject/summaryTip.html';
            summaryTemplateFactory['areaPeriodLearnStatistic'] = '@systemUrl@/views/areaPeriodLearnStatistic/summaryTip.html';
            summaryTemplateFactory['passedPerson'] = '@systemUrl@/views/summary/passedPerson/summaryTip.html';
            summaryTemplateFactory['learningDetail'] = '@systemUrl@/views/summary/learningDetail/summaryTip.html';
            summaryTemplateFactory['classLearningAll'] = '@systemUrl@/views/summary/classLearningAll/summaryTip.html';
            return {
                replace: true,
                scope: {
                    viewName: '='
                },
                template: '<a href="" class="fr a-info mr20"><span' +
                ' class="instructions"></span>统计口径说明</a>',
                compile: function () {
                    return function ($scope, $element, $attr) {
                        $element.bind('click', function () {
                            $timeout(function () {
                                var templateDirectory = $scope.viewName.replace(/^states\./, '');

                                templateDirectory && openSummaryWindow($scope, '统计口径说明',
                                    summaryTemplateFactory[templateDirectory]
                                );
                            });

                        });
                    };
                }
            };
        }])

        .directive('establishSummary', ['hbUtil','$rootScope', 'HB_dialog', 'genQueryData', '$http', '$q', '$timeout', '$state',
            function (hbUtil,$rootScope, HB_dialog, genQueryData, $http, $q, $timeout, $state) {
                return {
                    scope: {summaryConfig: '=', viewName: '=', autoBind: '=', permission: '='},
                    templateUrl: '@systemUrl@/views/summary/establishSummary.html',
                    replace: true,
                    link: function ($scope) {
                        $scope.clearAll = false;
                        //这边SKU类目ID写死成培训班ID
                        $scope.trainClassCategoryId = 'TRAINING_CLASS_GOODS';
                        var stateCur = $state.current.name;
                        genQueryData[stateCur] = function () {
                            $scope.clearAll = true;
                            $scope.skuName = '';
                            $scope.model.query.trainClass = {a: 1};
                            $scope.model.query.trainClass.trainClassId = {a: 1};
                            console.log($scope.model.query.trainClass.trainClassId);
                            $timeout(function () {
                                if ($scope.model.query.trainClass) {
                                    $scope.model.query.trainClass.trainClassId = undefined;
                                }

                            });
                            //延迟修改，不然识别不到
                            $timeout(function () {
                                $scope.clearAll = false;
                            });
                            //$scope.model.query.trainClass='111';
                            //$scope.model.query.trainClass=undefined;
                        };

                        $scope.model = {
                            query: {}
                        };
                        // var isChanged = false;
                        //
                        // $scope.$watch ( 'model.query.endTime', function ( newValue ) {
                        //     if ( newValue ) {
                        //         isChanged = true;
                        //     }
                        // } );

                        function setInfo (obj) {
                            obj.openStatistics = obj.gridStatistic;
                            obj.openStatistics.name = obj.name || '合计';
                            obj.openStatistics.learningTime = '-';
                            obj.openStatistics.$index = 0;
                            obj.extend = obj.gridStatistic;
                        }

                        $scope.kendoPlus = {
                            gridDelay: false
                        };
                        $http.get('/web/admin/paymentChannelManage/getPaymentChannelConfiguration2').then(function (data) {

                            $scope.paymentChannellist = data.data.info;
                            var rowTemplate = (function () {
                                var result = [];

                                result.push('<tr ng-class="{summaryRow: dataItem.$index===0}">');
                                result.push('<td colspan="b{{dataItem.$index===0?4:1}}">');
                                result.push('b{{dataItem.$index ===0 ? dataItem.name: dataItem.$index}}');
                                result.push('</td>');

                                result.push('<td ng-if="dataItem.$index > 0" title="#: trainYear #">');
                                result.push('#: trainYear #');
                                result.push('</td>');

                                result.push('<td ng-if="dataItem.$index > 0" title="#: name #">');
                                result.push('#: name #');
                                result.push('</td>');

                                result.push('<td ng-if="dataItem.$index > 0" title="#: createUnit #">');
                                result.push('#: createUnit #');
                                result.push('</td>');

                                angular.forEach($scope.paymentChannellist, function (item) {
                                    if(item.channelType === 'COLLECTIVE') {
                                        //============== 集体缴费 =================//
                                        angular.forEach(item.firstTypes,function(ditem) {
                                            if(ditem===1){
                                                result.push('<td>');
                                                result.push('#: collectiveOnlineNormalCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: collectiveOnlineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: collectiveOnlineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: collectiveOnlineChangeOutNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: collectiveOnlineNetCount #');
                                                result.push('</td>');
                                            }else{
                                                result.push('<td>');
                                                result.push('#: collectiveOfflineNormalCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: collectiveOfflineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: collectiveOfflineChangeOutNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: collectiveOfflineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: collectiveOfflineNetCount #');
                                                result.push('</td>');
                                            }
                                        })
                                    }
                                    if (item.channelType === 'MYSELF_PRESENT') {
                                        //============== 导入开通渠道 =================//
                                        angular.forEach(item.firstTypes, function (ditem) {
                                            if (ditem === 1) {
                                                result.push('<td>');
                                                result.push('#: myselfPresentOnlineNormalCount #');
                                                result.push('</td>');


                                                result.push('<td>');
                                                result.push('#: myselfPresentOnlineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPresentOnlineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPresentOnlineChangeOutNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPresentOnlineNetCount #');
                                                result.push('</td>');
                                            } else {
                                                result.push('<td>');
                                                result.push('#: myselfPresentOfflineNormalCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPresentOfflineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPresentOfflineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPresentOfflineChangeOutNum #');
                                                result.push('</td>');


                                                result.push('<td>');
                                                result.push('#: myselfPresentOfflineNetCount #');
                                                result.push('</td>');
                                            }
                                        });
                                    }
                                    if (item.channelType === 'OTHER_PRESENT') {
                                        //============== 导入开通渠道 =================//
                                        angular.forEach(item.firstTypes, function (ditem) {
                                            if (ditem === 1) {
                                                result.push('<td>');
                                                result.push('#: otherPresentOnlineNormalCount #');
                                                result.push('</td>');


                                                result.push('<td>');
                                                result.push('#: otherPresentOnlineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPresentOnlineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPresentOnlineChangeOutNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPresentOnlineNetCount #');
                                                result.push('</td>');
                                            } else {
                                                result.push('<td>');
                                                result.push('#: otherPresentOfflineNormalCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPresentOfflineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPresentOfflineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPresentOfflineChangeOutNum #');
                                                result.push('</td>');


                                                result.push('<td>');
                                                result.push('#: otherPresentOfflineNetCount #');
                                                result.push('</td>');
                                            }
                                        });
                                    }
                                    if (item.channelType === 'MYSELF_PERSONAL') {
                                        //============== 个人缴费 =================//
                                        angular.forEach(item.firstTypes, function (ditem) {
                                            if (ditem === 1) {
                                                result.push('<td>');
                                                result.push('#: myselfPersonalOnlineNormalCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOnlineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOnlineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOnlineChangeOutNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOnlineNetCount #');
                                                result.push('</td>');
                                            } else {

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOfflineNormalCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOfflineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOfflineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOfflineChangeOutNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: myselfPersonalOfflineNetCount #');
                                                result.push('</td>');
                                            }
                                        });
                                    }
                                    if (item.channelType === 'OTHER_PERSONAL') {
                                        //============== 个人缴费 =================//
                                        angular.forEach(item.firstTypes, function (ditem) {
                                            if (ditem === 1) {
                                                result.push('<td>');
                                                result.push('#: otherPersonalOnlineNormalCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPersonalOnlineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPersonalOnlineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPersonalOnlineChangeOutNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPersonalOnlineNetCount #');
                                                result.push('</td>');
                                            } else {

                                                result.push('<td>');
                                                result.push('#: otherPersonalOfflineNormalCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPersonalOfflineRefundCount #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPersonalOfflineChangeInNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPersonalOfflineChangeOutNum #');
                                                result.push('</td>');

                                                result.push('<td>');
                                                result.push('#: otherPersonalOfflineNetCount #');
                                                result.push('</td>');
                                            }
                                        });

                                    }
                                });

                                //============== 合计维度 =================//
                                result.push('<td>');
                                result.push('#: totalNormalCount #');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('#: totalRefundCount #');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('#: total_changeInNum #');
                                result.push('</td>');
                                result.push('<td>');
                                result.push('#: total_changeOutNum #');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('#: totalNetCount #');
                                result.push('</td>');


                                result.push('</tr>');

                                result = result.join('');
                                return result;
                            })();


                            var columns = [];
                            var mytitle;

                            columns.push({
                                field: '$index',
                                title: 'No.',
                                width: 50
                            });
                            columns.push({
                                field: '$index',
                                title: '年度',
                                width: 100
                            });
                            columns.push({
                                field: 'name',
                                title: $scope.summaryConfig.name,
                                width: 200
                            });
                            columns.push({
                                field: 'createUnit',
                                title: '创建单位',
                                width: 100
                            });
                            var isEstablish = false;
                            angular.forEach($scope.paymentChannellist, function (item) {
                                var a = [];
                                if (item.channelType === 'COLLECTIVE') {
                                    //============== 集体缴费 =================//
                                    mytitle = '集体缴费';
                                    isEstablish = true;

                                }
                                if (item.channelType === 'MYSELF_PRESENT') {
                                    mytitle = '导入开通(自己收款)',
                                        isEstablish = true;
                                    //============== 导入开通渠道（自己收款） =================//
                                }
                                if (item.channelType === 'OTHER_PRESENT') {
                                    mytitle = '导入开通(他人收款)',
                                        isEstablish = true;
                                    //============== 导入开通渠道（他人收款） =================//
                                }
                                if (item.channelType === 'MYSELF_PERSONAL') {
                                    mytitle = '个人缴费(自己收款)';
                                    isEstablish = true;
                                    //============== 个人缴费（自己收款） =================//
                                }
                                if (item.channelType === 'OTHER_PERSONAL') {
                                    mytitle = '个人缴费(他人收款)';
                                    isEstablish = true;
                                    //============== 个人缴费（他人收款） =================//
                                }
                                angular.forEach(item.firstTypes, function (ditem) {
                                    if (ditem === 1) {
                                        a.push({
                                            title: '线上支付',
                                            columns: [
                                                {
                                                    title: '开通',
                                                    width: 60
                                                },
                                                {
                                                    title: '退班',
                                                    width: 60
                                                },
                                                {
                                                    title: '换入</br>(换班)',
                                                    width: 60
                                                },
                                                {
                                                    title: '换出</br>(换班)',
                                                    width: 60
                                                },
                                                {
                                                    title: '净开通',
                                                    width: 60
                                                }
                                            ]
                                        });
                                    } else {
                                        a.push({
                                            title: '线下支付',
                                            columns: [
                                                {
                                                    title: '开通',
                                                    width: 60
                                                },
                                                {
                                                    title: '退班',
                                                    width: 60
                                                },
                                                {
                                                    title: '换入</br>(换班)',
                                                    width: 60
                                                },
                                                {
                                                    title: '换出</br>(换班)',
                                                    width: 60
                                                },
                                                {
                                                    title: '净开通',
                                                    width: 60
                                                }
                                            ]
                                        });
                                    }
                                });
                                columns.push({
                                    title: mytitle,
                                    width: 200,
                                    columns: a
                                });
                            });
                            columns.push({
                                title: '合计',
                                width: 200,
                                columns: [
                                    {
                                        title: '开通',
                                        width: 60
                                    },
                                    {
                                        title: '退班',
                                        width: 60
                                    },
                                    {
                                        title: '换入</br>(换班)',
                                        width: 60
                                    },
                                    {
                                        title: '换出</br>(换班)',
                                        width: 60
                                    },
                                    {
                                        title: '净开通',
                                        width: 60
                                    }
                                ]
                            });


                            var gridDataSource = hbUtil.kendo.dataSource.gridDataSource($scope.summaryConfig.listGridUrl, $scope.model.query, {
                                rebuild: function (data) {
                                    var temp = data.shift();
                                    if (data.length > 0 || temp) {
                                        var temp1 = hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                                        temp1.unshift(temp);
                                        return temp1;
                                    } else {
                                        return [];
                                    }

                                },
                                er: function () {
                                    return (function () {
                                        var defer = $q.defer();
                                        // if ( isChanged ) {
                                        //     isChanged = false;
                                        var oldData = genQueryData.genQuery({}, $scope.model.query);
                                        oldData.queryParam = angular.extend(oldData.queryParam, $scope.skuParamsClassEstablish);

                                        $.ajax({
                                            url: $scope.summaryConfig.totalGridUrl,
                                            method: 'get',
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            data: oldData
                                        }).then(function (data) {
                                            if (angular.isObject(data.info)) {
                                                $scope.totalInfo = data;
                                                setInfo($scope.totalInfo.info);
                                                defer.resolve(data);
                                            } else {
                                                defer.reject(data);
                                            }
                                        }, function (data) {
                                            defer.reject(data);
                                        });
                                        // } else {
                                        //     if ( $scope.totalInfo ) {
                                        //         defer.resolve ( $scope.totalInfo );
                                        //     } else {
                                        //         defer.resolve ();
                                        //     }
                                        // }

                                        return defer.promise;
                                    })();
                                },
                                parameterMap: function (data, type) {
                                    console.log($scope.skuParamsClassEstablish);

                                    genQueryData.genQuery(data, $scope.model.query);
                                    if ($scope.skuParamsClassEstablish) {
                                        data.queryParam = angular.extend(data.queryParam, $scope.skuParamsClassEstablish);
                                    }
                                    return data;
                                }
                            });
                            var isInit = true,
                                initTreeWatch = $scope.$watch('model.query.region', function (newValue, oldValue) {
                                    if (newValue && newValue.id && isInit) {
                                        gridDataSource.read();
                                        isInit = false;
                                        initTreeWatch();
                                    }
                                });
                            $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template(rowTemplate), columns, {}, {
                                sortable: false,
                                autoBind: $scope.autoBind === true ? _undefined : false,
                                height: 485
                            });
                            $scope.kendoPlus.gridDelay = true;

                        });
                    }
                };
            }]);

});