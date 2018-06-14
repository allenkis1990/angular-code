define(['angular'], function (angular) {
    return function ($scope, hbUtil, disabledDo, signerDisabledDo) {


        $scope.kendoPlus = {
            timeModel: null,
            timeOptions: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd HH:mm:ss'
                // format : "yyyy-MM-dd 00:00:00"
                //min: new Date()
            }
        };

        $scope.utils = {
            getRequiredPeriod:function(dataList){
                var period = 0;
                if (dataList.length>0) {
                    angular.forEach(dataList, function (data) {
                        if(data.type==1){
                            period+=Number(data.requiredPeriod);
                        }
                    });
                }
                return period;

            }
        }

        //选课规则模板
        var modGridRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td title="#: ruleName #">');
            result.push('#: ruleName #');
            result.push('</td>');

            /*result.push('<td>');
             result.push('#: ruleId #');
             result.push('</td>');*/

            result.push('<td>');
            result.push('<span ng-if="#: ruleType===1 #">仅必修包</span>');
            result.push('<span ng-if="#: ruleType===2 #">仅选修包</span>');
            result.push('<span ng-if="#: ruleType===3 #">必修+选修</span>');
            result.push('<span ng-if="#: ruleType!==3&&ruleType!==2&&ruleType!==1 #">-</span>');
            result.push('</td>');


            result.push('<td>');
            result.push('#: requiredPeriod #');
            result.push('</td>');

            result.push('<td>');
            /*result.push('#: requireValueInPackage #');*/

            result.push('<div >');
            result.push('<div ng-if="#: ruleType==1 #" ng-repeat="data in dataItem.periodRequireds  track by $index">');
            result.push('<span ng-bind="data.packageName"></span>');
            result.push('选课要求=');
            result.push('<span ng-bind="data.requiredPeriod"></span>');
            result.push('</div>');
            result.push ( '<div ng-if="dataItem.forbidOptionalPackageRequires===false&&dataItem.ruleType==2" ng-repeat="data in dataItem.periodRequireds  track by $index">' );
            result.push ( '<span ng-bind="data.packageName"></span>' );
            result.push ( '选课要求=' );
            result.push ( '<span ng-bind="data.requiredPeriod"></span>' );
            result.push ( '</div>' );

            result.push ( '<div ng-if="dataItem.forbidOptionalPackageRequires===true&&dataItem.ruleType==2">' );
            result.push ( '选修包无选课要求' );
            result.push ( '</div>' );
            result.push ( '<div ng-if="dataItem.forbidOptionalPackageRequires===false&&dataItem.ruleType==3">' );
            result.push('<div> 必修包的选课学时=<span ng-bind=utils.getRequiredPeriod(dataItem.periodRequireds)></span></div>');
            result.push ( '<div ng-if="data.type!=1"  ng-repeat="data in dataItem.periodRequireds  track by $index">' );
            result.push ( '<span ng-bind="data.packageName"></span>' );
            result.push ( '选课要求=' );
            result.push ( '<span  ng-bind="data.requiredPeriod"></span>' );
            result.push ( '</div>' );
            result.push('</div>');
            result.push ( '<div ng-if="dataItem.forbidOptionalPackageRequires===true&&dataItem.ruleType==3">' );
            result.push ( '<div> 必修包的选课学时=<span ng-bind=utils.getRequiredPeriod(dataItem.periodRequireds)></span></div>' );
            result.push('<div> 选修包的整体选课学时=<span ng-bind="dataItem.requiredPeriod-utils.getRequiredPeriod(dataItem.periodRequireds)"></span></div>');
            result.push ( '</div>' );
            result.push('</div>');
            result.push('</td>');



            result.push('<td>');
            result.push('<button type="button" class="table-btn" ng-click="events.lookMod($event,dataItem)">查看</button>');
            result.push('<button type="button" class="table-btn" ng-click="events.choseMod($event,dataItem)">选择</button>');
            result.push('</td>');

            result.push('</tr>');
            modGridRowTemplate = result.join('');
        })();

        $scope.modGrid = {
            options: hbUtil.kdGridCommonOption({
                template: modGridRowTemplate,
                url: '/web/admin/coursePoolRuleAction/findCoursePoolRulePage',
                page: 'courseRulePage',
                scope: $scope,
                param: $scope.courseRule,
                columns: [
                    {field: 'ruleName', title: '选课规则名称', sortable: false, width: 250},
                    //{field: "ruleId", title: "模板id", sortable: false, width:200},
                    {field: 'ruleType', title: '规则类型', sortable: false, width: 100},
                    {field: 'courseRequireValue', title: '整体选课要求', sortable: false, width: 130},
                    {field: 'requireValueInPackage', title: '包内选课要求', sortable: false},
                    {
                        title: '操作', width: 100
                    }
                ]
            })
        };
        //选课规则模板


        //课程包列表模板
        var courseBagRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td title="#: poolName #">');
            result.push('#: poolName #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: courseCount #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: totalPeriod #');
            result.push('</td>');


            result.push('<td>');
            result.push('<button type="button" class="table-btn" ng-class="{\'hide\':dataItem.ischecked}" ng-click="events.choseCourseBag($event,dataItem)">选择</button>');
            result.push('<button type="button" class="table-btn" ng-class="{\'hide\':!dataItem.ischecked}" ng-click="events.cancelCourseBag(dataItem)">取消选择</button>');
            result.push('</td>');

            result.push('</tr>');
            courseBagRowTemplate = result.join('');
        })();

        $scope.courseBagGrid = {
            options: hbUtil.kdGridCommonOption({
                template: courseBagRowTemplate,
                url: '/web/admin/coursePoolAction/findCoursePoolPage',
                page: 'courseBagPage',
                scope: $scope,
                param: $scope.courseBag,
                fn: function (data) {
                    angular.forEach(data.info, function (item) {
                        item.ischecked = false;
                    });

                    angular.forEach(data.info, function (item) {
                        angular.forEach($scope.submitData.courseLearning.poolList, function (subItem) {
                            if (item.id === subItem.coursePackageId) {
                                item.ischecked = true;
                            }
                        });
                    });


                },
                columns: [
                    {field: 'ruleName', title: '课程包名称', sortable: false, width: 250},
                    //{field: "ruleId", title: "模板id", sortable: false, width:200},
                    {field: 'ruleType', title: '课程门数', sortable: false, width: 100},
                    {field: 'courseRequireValue', title: '总学时', sortable: false, width: 130},
                    {
                        title: '操作', width: 100
                    }
                ]
            })
        };
        //课程包列表模板


        //培训证明模板
        var trainProofRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td title="#: name #">');
            result.push('#: name #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: intro #');
            result.push('</td>');


            result.push('<td>');
            result.push('<span ng-if="dataItem.type!==\'class\'&&dataItem.type!==\'course\'">培训班学习，自主选课学习</span>');
            result.push('<span ng-if="dataItem.type===\'class\'">培训班学习</span>');
            result.push('<span ng-if="dataItem.type===\'course\'">自主选课学习</span>');
            result.push('</td>');


            result.push('<td>');
            result.push('<button type="button" class="table-btn" ng-click="events.preview($event,dataItem)">预览</button>');
            result.push('<button type="button" class="table-btn" ng-click="events.choseTrain($event,dataItem)">选择</button>');
            result.push('</td>');

            result.push('</tr>');
            trainProofRowTemplate = result.join('');
        })();

        $scope.trainProofGrid = {
            options: hbUtil.kdGridCommonOption({
                template: trainProofRowTemplate,
                url: '/web/admin/commodityManager/getCertifiedList',
                page: 'trainProofPage',
                scope: $scope,
                param: $scope.courseBag,
                columns: [
                    {field: 'ruleName', title: '证明模板名称', sortable: false, width: 250},
                    //{field: "ruleId", title: "模板id", sortable: false, width:200},
                    {field: 'ruleType', title: '模板说明', sortable: false},
                    {field: 'courseRequireValue', title: '使用培训方案形式', sortable: false, width: 230},
                    {
                        title: '操作', width: 100
                    }
                ]
            })
        };
        //培训证明模板


        //兴趣课程列表模板
        var interRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td title="#: poolName #">');
            result.push('#: poolName #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: courseCount #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: totalPeriod #');
            result.push('</td>');


            result.push('<td>');
            result.push('<button type="button" class="table-btn" ng-class="{\'hide\':dataItem.ischecked}" ng-click="events.choseInter($event,dataItem)">选择</button>');
            result.push('<button type="button" class="table-btn" ng-class="{\'hide\':!dataItem.ischecked}" ng-click="events.cancelInter(dataItem)">取消选择</button>');
            result.push('</td>');

            result.push('</tr>');
            interRowTemplate = result.join('');
        })();

        $scope.interGrid = {
            options: hbUtil.kdGridCommonOption({
                template: interRowTemplate,
                url: '/web/admin/coursePoolAction/findCoursePoolPage',
                page: 'interPage',
                scope: $scope,
                param: $scope.courseBag,
                fn: function (data) {
                    angular.forEach(data.info, function (item) {
                        item.ischecked = false;
                    });

                    angular.forEach(data.info, function (item) {
                        angular.forEach($scope.submitData.interestCourse.interestCourses, function (subItem) {
                            if (item.id === subItem.coursePoolId) {
                                item.ischecked = true;
                            }
                        });
                    });


                },
                columns: [
                    {field: 'ruleName', title: '课程包名称', sortable: false, width: 250},
                    //{field: "ruleId", title: "模板id", sortable: false, width:200},
                    {field: 'ruleType', title: '课程门数', sortable: false, width: 100},
                    {field: 'courseRequireValue', title: '总学时', sortable: false, width: 130},
                    {
                        title: '操作', width: 100
                    }
                ]
            })
        };
        //兴趣课程列表模板


        //课后测验列表模板
        var excriseRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td title="#: name #">');
            result.push('#: name #');
            result.push('</td>');


            result.push('<td>');
            //result.push ( '#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #' );
            result.push('<span>智能组卷</span>');
            result.push('</td>');


            result.push('<td>');
            result.push('#: libraryName #');
            result.push('</td>');


            result.push('<td>');
            //result.push('#: totalScore #'/'#: passScore #');
            result.push('<span ng-bind="dataItem.totalScore+\'/\'+dataItem.passScore"></span>');
            result.push('</td>');


            result.push('<td>');
            result.push('<button type="button" class="table-btn" ng-click="events.choseAfterTest($event,dataItem)">选择</button>');
            result.push('</td>');

            result.push('</tr>');
            excriseRowTemplate = result.join('');
        })();

        $scope.excriseGrid = {
            options: hbUtil.kdGridCommonOption({
                template: excriseRowTemplate,
                url: '/web/admin/paper/findPracticeExamPage',
                page: 'excrisePage',
                scope: $scope,
                param: $scope.excrise,
                columns: [
                    {field: 'ruleName', title: '试卷名称', sortable: false},
                    //{field: "ruleId", title: "模板id", sortable: false, width:200},
                    {field: 'ruleType', title: '组卷方式', sortable: false, width: 100},
                    {field: 'courseRequireValue', title: '试卷分类', sortable: false, width: 130},
                    {field: 'courseRequireValue', title: '总分/及格分', sortable: false, width: 130},
                    {
                        title: '操作', width: 100
                    }
                ]
            })
        };
        //课后测验列表模板


        //课后测验列表模板
        var examRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td title="#: examPaperName #">');
            result.push('#: examPaperName #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: paperMakeUpWay ==1 ?\'手动组卷\' : \'智能组卷\' #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: examTypeName #');
            result.push('</td>');


            result.push('<td>');
            //result.push('#: totalScore #'/'#: passScore #');
            result.push('<span ng-bind="dataItem.totalScore+\'/\'+dataItem.passScore"></span>');
            result.push('</td>');

            result.push('<td>');
            result.push('<span ng-bind=\'dataItem.examTime\'></span>分钟');
            result.push('</td>');


            result.push('<td>');
            result.push('<button type="button" class="table-btn" ng-click="events.choseExam($event,dataItem)">选择</button>');
            result.push('</td>');

            result.push('</tr>');
            examRowTemplate = result.join('');
        })();

        $scope.examGrid = {
            options: hbUtil.kdGridCommonOption({
                template: examRowTemplate,
                url: '/web/admin/commodityManager/getExamPapers',
                page: 'examPage',

                scope: $scope,
                 param: $scope.exam,
                authorizedParam:$scope.examAuthorizedQuery,
                columns: [
                    {field: 'ruleName', title: '试卷名称1', sortable: false},
                    //{field: "ruleId", title: "模板id", sortable: false, width:200},
                    {field: 'ruleType', title: '组卷方式', sortable: false, width: 100},
                    {field: 'courseRequireValue', title: '试卷分类', sortable: false, width: 130},
                    {field: 'courseRequireValue', title: '总分/及格分', sortable: false, width: 130},
                    {field: 'courseRequireValue', title: '考试时长', sortable: false, width: 100},
                    {
                        title: '操作', width: 100
                    }
                ]
            })
        };
        //课后测验列表模板


        //配置价格的 课程包列表模板
        var priceCourseBagRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td title="#: poolName #">');
            result.push('#: poolName #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: courseCount #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: totalPeriod #');
            result.push('</td>');


            result.push('<td>');
            result.push('<button type="button" class="table-btn"  ng-click="events.lookCourseBagDetail(priceCourseArr[dataItem.index-1].id)">查看</button>');
            result.push('<button type="button" class="table-btn" ng-disabled="priceCourseArr[dataItem.index-1].disabled"  ng-class="{\'hide\':priceCourseArr[dataItem.index-1].ischecked}" ng-click="events.chosePriceCourse($event,priceCourseArr[dataItem.index-1])">选择</button>');
            result.push('<button type="button" class="table-btn" ng-class="{\'hide\':!priceCourseArr[dataItem.index-1].ischecked}" ng-click="events.cancelPriceCourse(priceCourseArr[dataItem.index-1])">取消选择</button>');
            result.push('</td>');

            result.push('</tr>');
            priceCourseBagRowTemplate = result.join('');
        })();

        $scope.priceCourseBagGrid = {
            options: hbUtil.kdGridCommonOption({
                template: priceCourseBagRowTemplate,
                url: '/web/admin/coursePoolAction/findCoursePoolPage',
                page: 'priceCoursePage',
                scope: $scope,
                param: $scope.priceCourseBagParams,
                fn: function (data) {


                    $scope.priceCourseArr = data.info;


                    angular.forEach($scope.priceCourseArr, function (item) {
                        item.ischecked = false;
                    });

                    angular.forEach($scope.priceCourseArr, function (item) {
                        angular.forEach($scope.model.tempCoursePoolPeriodPrice.poolList, function (subItem) {
                            if (item.id === subItem.coursePackageId) {
                                item.ischecked = true;
                            }
                        });
                    });

                    disabledDo();


                },
                columns: [
                    {field: 'ruleName', title: '课程包名称', sortable: false, width: 250},
                    //{field: "ruleId", title: "模板id", sortable: false, width:200},
                    {field: 'ruleType', title: '课程门数', sortable: false, width: 100},
                    {field: 'courseRequireValue', title: '总学时', sortable: false, width: 130},
                    {
                        title: '操作', width: 100
                    }
                ]
            })
        };
        //配置价格的 课程包列表模板


        //配置价格的 课程列表模板
        var priceCourseRowTemplate = '';
        (function () {
            var result = [];
            result.push('<tr>');

            result.push('<td title="#: courseName #">');
            result.push('#: courseName #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: poolName #');
            result.push('</td>');


            result.push('<td>');
            result.push('#: period #');
            result.push('</td>');


            result.push('<td>');
            result.push('<button type="button" class="table-btn"  ng-click="events.lookCourseDetail(signerPriceCourseArr[dataItem.index-1].courseId)">查看</button>');
            result.push('<button type="button" class="table-btn" ng-disabled="signerPriceCourseArr[dataItem.index-1].disabled"  ng-class="{\'hide\':signerPriceCourseArr[dataItem.index-1].ischecked}" ng-click="events.choseSignerPriceCourse($event,signerPriceCourseArr[dataItem.index-1])">选择</button>');
            result.push('<button type="button" class="table-btn" ng-class="{\'hide\':!signerPriceCourseArr[dataItem.index-1].ischecked}" ng-click="events.cancelsignerPriceCourse(signerPriceCourseArr[dataItem.index-1])">取消选择</button>');
            result.push('</td>');

            result.push('</tr>');
            priceCourseRowTemplate = result.join('');
        })();

        $scope.priceCourseGrid = {
            options: hbUtil.kdGridCommonOption({
                template: priceCourseRowTemplate,
                url: '/web/admin/commodityManager/findCourseNoRepeatPage',
                page: 'signerPriceCoursePage',
                scope: $scope,
                param: $scope.priceCourseParams,
                parseFn: function (params) {
                    console.log(params);

                    if ($scope.priceCourseParams.poolId === undefined || $scope.priceCourseParams.poolId === null || $scope.priceCourseParams.poolId === '') {
                        params.poolId = [];
                        angular.forEach($scope.submitData.courseLearning.poolList, function (item) {
                            params.poolId.push(item.coursePackageId);
                        });
                        params.poolId = params.poolId.toString();
                        console.log(params.poolId);
                    } else {
                        params.poolId = angular.copy($scope.priceCourseParams.poolId);
                    }

                },
                fn: function (data) {
                    /*tempCourseIndividualPrice:{
                     price:null, // 价格
                     courseList:[]
                     }*/

                    $scope.signerPriceCourseArr = data.info;


                    angular.forEach($scope.signerPriceCourseArr, function (item) {
                        item.ischecked = false;
                    });

                    angular.forEach($scope.signerPriceCourseArr, function (item) {
                        angular.forEach($scope.model.tempCourseIndividualPrice.courseList, function (subItem) {
                            if (item.courseId === subItem.courseId) {
                                item.ischecked = true;
                            }
                        });
                    });

                    signerDisabledDo();


                },
                columns: [
                    {field: 'ruleName', title: '选课名称', sortable: false, width: 250},
                    {field: 'ruleId', title: '所属课程包', sortable: false, width: 200},
                    {field: 'courseRequireValue', title: '学时', sortable: false, width: 130},
                    {
                        title: '操作', width: 100
                    }
                ]
            })
        };
        //配置价格的 课程列表模板


        //智能组卷抽取题库树
        var smartPaperlibraryTreeDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    var id = options.data.id ? options.data.id : '-2';
                    //myModel = dataSource.get(options.data.id);
                    //var type = myModel ? myModel.type : '';
                    $.ajax({
                        url: '/web/admin/questionLibrary/findLibraryListByParentId?libraryId=' + id + '&enabled=0' + '&onlySelf=0&showInsertLibrary=1',
                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        success: function (result) {
                            // notify the data source that the request succeeded
                            options.success(result);
                        },
                        error: function (result) {
                            // notify the data source that the request failed
                            options.error(result);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: 'id',
                    hasChildren: 'hasChildren'
                },
                data: function (data) {
                    return data.info;
                }
            }
        });
        $scope.ui = {
            smartPaperLibraryTree: {
                options: {
                    checkboxes: {
                        checkChildren: true
                    },
                    //checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: smartPaperlibraryTreeDataSource,
                    check: function (e) {
                        onCheck(1);
                    }
                }
            }
        };


        $scope.$watch('model.paper.randomTakeObjectConfigurationItemDtos', function () {
            if ($scope.model.paper.randomTakeObjectConfigurationItemDtos == null || $scope.model.paper.randomTakeObjectConfigurationItemDtos.length == 0) {
                /*                   if($scope.model.paper.randomTakeObjectConfigurationItemDtos.entityId)*/

                $scope.model.hasSelectLiarary = false;
            } else {

                //console.log($scope.model.paper.randomTakeObjectConfigurationItemDtos);
                $scope.model.hasSelectLiarary = true;
            }
        });
        $scope.$watch('submitData.exerciseConfig.questionSource', function () {


            if ($scope.submitData.exerciseConfig) {


                if ($scope.submitData.exerciseConfig.questionSource == 'QUESTION_LIBRARY,') {
                    if ($scope.model.paper.randomTakeObjectConfigurationItemDtos == null || $scope.model.paper.randomTakeObjectConfigurationItemDtos.length == 0) {
                        $scope.model.hasSelectLiarary = false;

                    } else {
                        $scope.model.hasSelectLiarary = true;
                    }
                } else {

                    //$scope.submitData.exerciseConfig.sourceIds=[];
                    //$scope.model.paper.randomTakeObjectConfigurationItemDtos=undefined;
                    $scope.model.paperConfig.libraryItems = null;

                    $scope.model.hasSelectLiarary = true;
                }

            }

        });

        function checkedNodeIds (nodes, items) {
            //  console.log(nodes);
            /*if(items[0].id=='-1'){
             $scope.commodityAndClassInfo.exerciseConfig.sourceIds=[] ;
             }*/
            $scope.submitData.exerciseConfig.sourceIds = [];
            for (var i = 0; i < nodes.length; i++) {
                var node = _.find(items, 'id', nodes[i].id);
                if (nodes[i].checked) {
                    if (node == null) {
                        if (nodes[i].id == '-1') {
                            items.push({
                                    entityId: nodes[i].id,
                                    name: '所有题库'
                                }
                            );
                            $.ajax({
                                url: '/web/admin/questionLibrary/findLibraryListByParentId?libraryId=-1&enabled=0&onlySelf=0&showInsertLibrary=1',
                                dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                                success: function (result) {
                                    // console.log(result)
                                    for (var i = 0; i < result.info.length; i++) {
                                        $scope.submitData.exerciseConfig.sourceIds.push(result.info[i].id);
                                    }
                                },
                                error: function (result) {
                                    console.log(result);
                                }
                            });
                        } else {
                            items.push({
                                    entityId: nodes[i].id,
                                    name: nodes[i].name
                                }
                            );
                            $scope.submitData.exerciseConfig.sourceIds.push(nodes[i].id);
                        }
                    }
                } else {
                    if (node != null) {
                        _.remove(items, function (item) {
                            return item.entityId === nodes[i].id;
                        });
                        _.remove($scope.submitData.exerciseConfig.sourceIds, function (item) {
                            return item.id === nodes[i].id;
                        });

                    }
                    if (nodes[i].hasChildren) {
                        checkedNodeIds(nodes[i].children.view(), items);
                    }

                }
            }
        }

        function onCheck (type) {
            var items;
            var treeView;
            $scope.model.paper.randomTakeObjectConfigurationItemDtos = null;
            $scope.model.paper.randomTakeObjectConfigurationItemDtos = [];
            $scope.model.paperConfig.libraryItems = null;
            $scope.model.paperConfig.libraryItems = [];

            if (type === 1) {
                items = $scope.model.paper.randomTakeObjectConfigurationItemDtos;
                treeView = $scope.node.smartPaperlibraryTree;
            } else if (type === 2) {
                items = $scope.model.paperConfig.libraryItems;
                treeView = $scope.node.libraryTree;
            }

            checkedNodeIds(treeView.dataSource.view(), items);
            $scope.$apply();
        }


    };

});
