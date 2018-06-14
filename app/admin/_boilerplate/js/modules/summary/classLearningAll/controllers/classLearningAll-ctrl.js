define(function (classLearning) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_dialog', 'hbUtil', 'genQueryData', '$q', '$timeout', '$state',
            function ($scope, HB_dialog, hbUtil, genQueryData, $q, $timeout, $state) {
                $scope.trainClassCategoryId = 'TRAINING_CLASS_GOODS';
                $scope.model = {
                    query: {}
                };


                $scope.clearAll = false;

                var stateCur = $state.current.name;

                genQueryData[stateCur] = function () {
                    //alert(1);
                    $scope.clearAll = true;
                    $scope.skuName = '';
                    $scope.model.query.trainClass = {a: 1};
                    $timeout(function () {
                        $scope.model.query.trainClass = undefined;
                    });

                    //$scope.model.query.trainClass='111';
                    //$scope.model.query.trainClass=undefined;
                    //延迟修改，不然识别不到
                    $timeout(function () {
                        $scope.clearAll = false;
                    });

                };
                //var gridDataSource = hbUtil.kendo.dataSource.gridDataSource ( '/web/admin/learningStatistics/findClassLearningInfoByQuery', {}, {
                //    rebuild     : function ( data ) {
                //        return hbUtil.kendo.dataSource.setIndex ( gridDataSource, data, 1 );
                //    },
                //    parameterMap: function ( data, type ) {
                //
                //        data.pageNo = data.page;
                //
                //        genQueryData.genQuery ( data, $scope.model.query );
                //
                //        return data;
                //    }
                //} );


                function setInfo (obj) {
                    obj.trainClassName = obj.trainClassName || '合计';
                    obj.$index = 0;
                    obj.extend = obj;
                };
                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource('/web/admin/learningStatistics/findClassLearningInfoByQuery', $scope.model.query, {
                    rebuild: function (data) {
                        var temp = data.shift();
                        if (data.length > 0 || temp) {
                            var temp1 = hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);
                            temp1.unshift(temp);
                            delete temp1[0].extend;
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
                            oldData.queryParam = angular.extend(oldData.queryParam, $scope.skuParamsClassLearning);
                            //console.log(oldData);
                            $.ajax({
                                url: '/web/admin/learningStatistics/getClassLearningTotalInfo',
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

                        //data.pageNo = data.page;

                        genQueryData.genQuery(data, $scope.model.query);
                        if ($scope.skuParamsClassLearning) {
                            data.queryParam = angular.extend(data.queryParam, $scope.skuParamsClassLearning);
                        }
                        return data;
                    }
                });


                /**
                 var a = {
                    exammed       : 0,
                    learned       : 0,
                    learning      : 0,
                    netEstablish  : 0,
                    notExamYet    : 1,
                    notLearnYet   : 1,
                    qualified     : null,
                    qualifiedRate : null,
                    trainClassId  : "02adc464224543a5b0055bd29c54b035",
                    trainClassName: null
                }
                 */


                var rowTemplate = (function () {

                    var result = [];
                    result.push('<tr ng-class="{summaryRow: dataItem.$index===0}">');

                    result.push('<td>');
                    result.push('b{{dataItem.$index===0 ? \'\': dataItem.$index}}');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: trainClassName#');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: createUnit==null?"":createUnit#');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: trainYear==null?"":trainYear  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: subject ==null?"":subject #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: netEstablish #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: notLearnYet #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: learning #');
                    result.push('</td>');


                    result.push('<td>');
                    result.push('#: learned #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: exammed #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: qualified #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: qualifiedRate==null?0:qualifiedRate #');
                    result.push('</td>');

                    result.push('</tr>');

                    result = result.join('');
                    return result;
                })();


                $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template(rowTemplate), [
                    {
                        field: '$index',
                        title: 'No.',
                        width: 50
                    },

                    {
                        field: 'trainClassName',
                        title: '培训班名称'
                    },
                    {
                        field: 'createUnit',
                        title: '创建单位',
                        width: 160
                    },
                    {
                        field: 'trainYear',
                        title: '继续教育年度',
                        width: 100
                    },
                    {
                        field: 'subject',
                        title: '科目',
                        width: 100
                    },
                    {
                        field: 'netEstablish',
                        title: '净开通',
                        width: 100
                    },
                    {
                        field: 'notLearnYet',
                        title: '未学习',
                        width: 100
                    },
                    {
                        field: 'learning',
                        title: '学习中',
                        width: 100
                    },
                    {
                        field: 'learned',
                        title: '已学完',
                        width: 60
                    },
                    {
                        field: 'exammed',
                        title: '已考试',
                        width: 100
                    },
                    {
                        field: 'qualified',
                        title: '已合格',
                        width: 100
                    },
                    {
                        title: '合格率',
                        field: 'qualifiedRate',
                        width: 100
                    }
                ], {}, {
                    sortable: false
                });

                $scope.permission = {
                    search: 'classLearningAll/search',
                    exportOut: 'classLearningAll/export',
                    learnTimeYear: 'classLearningAll/learnTimeYear',
                    titleLevel: 'classLearningAll/titleLevel',
                    learnCategory: 'classLearningAll/learnCategory',
                    reset: 'classLearningAll/reset',
                    selectClass: 'classLearningAll/searchTrainClass'
                };

            }]
    };
});