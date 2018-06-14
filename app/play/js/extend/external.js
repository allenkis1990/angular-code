/**
 * lesson-platform -
 * @author wengpengfeijava <wengpengfeijava@163.com>
 * @version v2.0.0
 * @link
    * @license ISC
 */
/**
 * lesson-platform -
 * @author wengpengfeijava <wengpengfeijava@163.com>
 * @version v1.0.3
 * @link
    * @license ISC
 */
/**
 * Created by 亡灵走秀 on 2017/1/12.
 */
define(['angular', 'artDialog'], function (angular, artDialog) {
    'use strict';

    angular.module('external', [])

        .factory('externalService', ['$stateParams', function ($stateParams) {
        }])

        .directive('test', function ($stateParams, $http) {
            return {
                templateUrl: 'templates/sides/tcontent.html',
                link: function ($scope) {
                    /*if($stateParams.unitName){
                        window.open('/center/'+$stateParams.unitName+'/myStudy/goods', '_blank');
                    }else{
                        window.open('/center/myStudy/goods', '_blank');
                    }*/
                    console.log($stateParams.unitName);
                    var HB_dialog = dialog;

                    console.log($scope.directorys);

                    $scope.lwhTest = {
                        testInfo: []
                    };
                    //console.log($scope.currentPlayInfo);

                    //console.log($stateParams);

                    $http.get('/web/front/coursePaper/listHistoryCoursePaper?schemeId=' + $stateParams.trainClassId + '&courseId=' + $stateParams.lessonId).success(function (data) {
                        $scope.lwhTest.testInfo = data.info;
                        //$scope.lwhTest.testInfo.showScore=false;
                        //ng-if="lwhTest.testInfo.showScore===true"
                    });

                    // /web/front/myCourse/canEnter
                    $scope.enterTest = function (status) {
                        if ($scope.submitAble) {
                            return false;
                        }


                        if (status === 2) {
                            //未达到课程进度，无法进行课后测验
                            HB_dialog({
                                title: '提示',
                                content: '未达到课程进度，无法进行课后测验',
                                okValue: '确定',
                                cancelValue: '取消',
                                cancel: function () {
                                    return true;
                                },
                                ok: function () {
                                    return true;
                                }
                            }).showModal().show();
                            return false;
                        }


                        if (status === 6) {
                            //未达到课程进度，无法进行课后测验
                            HB_dialog({
                                title: '提示',
                                content: '课后测验次数已用完，无法进行课后测验',
                                okValue: '确定',
                                cancelValue: '取消',
                                cancel: function () {
                                    return true;
                                },
                                ok: function () {
                                    return true;
                                }
                            }).showModal().show();
                            return false;
                        }

                        if (status === 5) {
                            //未达到课程进度，无法进行课后测验
                            HB_dialog({
                                title: '提示',
                                content: '课后测验已合格，无需再测验',
                                okValue: '确定',
                                cancelValue: '取消',
                                cancel: function () {
                                    return true;
                                },
                                ok: function () {
                                    return true;
                                }
                            }).showModal().show();
                            return false;
                        }


                        $scope.submitAble = true;
                        $http.get('/web/front/coursePaper/validCoursePractice', {
                            params: {
                                schemeId: $stateParams.trainClassId,
                                courseId: $stateParams.lessonId,
                                commoditySkuId: $scope.lwhTest.testInfo.commoditySkuId
                            }
                        }).success(function (data) {
                            $scope.submitAble = false;
                            if (data.code === 200) {


                                switch (data.info.code) {
                                    case '200':
                                        HB_dialog({
                                            title: '提示',
                                            content: data.info.message,
                                            okValue: '确定',
                                            cancelValue: '取消',
                                            cancel: function () {
                                                return true;
                                            },
                                            ok: function () {
                                                return true;
                                            }
                                        }).showModal().show();
                                        break;
                                    case '201':
                                        HB_dialog({
                                            title: '提示',
                                            content: data.info.message,
                                            okValue: '确定',
                                            cancelValue: '取消',
                                            cancel: function () {
                                                return true;
                                            },
                                            ok: function () {
                                                return true;
                                            }
                                        }).showModal().show();
                                        break;
                                    case '301':
                                        HB_dialog({
                                            title: '提示',
                                            content: data.info.message,
                                            okValue: '确定',
                                            cancelValue: '取消',
                                            cancel: function () {
                                                return true;
                                            },
                                            ok: function () {
                                                return true;
                                            }
                                        }).showModal().show();
                                        break;
                                    case '302':
                                        HB_dialog({
                                            title: '提示',
                                            content: data.info.message,
                                            okValue: '确定',
                                            cancelValue: '取消',
                                            cancel: function () {
                                                return true;
                                            },
                                            ok: function () {
                                                return true;
                                            }
                                        }).showModal().show();
                                        break;
                                    case '303':
                                        window.open(data.info.data, '_blank');
                                        break;
                                    case '304':
                                        window.open(data.info.data, '_blank');
                                        break;
                                    case '305':
                                        HB_dialog({
                                            title: '提示',
                                            content: data.info.message,
                                            okValue: '确定',
                                            cancelValue: '取消',
                                            cancel: function () {
                                                return true;
                                            },
                                            ok: function () {
                                                return true;
                                            }
                                        }).showModal().show();
                                        break;
                                    case '306':
                                        HB_dialog({
                                            title: '提示',
                                            content: data.info.message,
                                            okValue: '确定',
                                            cancelValue: '取消',
                                            cancel: function () {
                                                return true;
                                            },
                                            ok: function () {
                                                return true;
                                            }
                                        }).showModal().show();
                                        break;
                                    case '307':
                                        HB_dialog({
                                            title: '提示',
                                            content: data.info.message,
                                            okValue: '确定',
                                            cancelValue: '取消',
                                            cancel: function () {
                                                return true;
                                            },
                                            ok: function () {
                                                return true;
                                            }
                                        }).showModal().show();
                                        break;
                                    case '308':
                                        HB_dialog({
                                            title: '提示',
                                            okValue: '前往课程列表页',
                                            cancelValue: '取消',
                                            cancel: function () {
                                                return true;
                                            },
                                            content: '存在课程练习试题未作答，请答完再进入课后测验！',
                                            ok: function () {
                                                if($stateParams.unitName){
                                                    window.open('/center/'+$stateParams.unitName+'/myStudy/goods', '_blank');
                                                }else{
                                                    window.open('/center/myStudy/goods', '_blank');
                                                }
                                                return true;
                                            }
                                        }).showModal().show();
                                        break;
                                }

                            }
                        });
                    };

                }
            };
        })

        .run(['components', '$http', 'commonService', function (components, $http, commonService) {
            //listen|learn|previewLesson
            var href = window.location.href,
                urlReg = /((listen\/)|(learn\/)|(previewLesson\/)|(preview\/))/,
                index = href.match(urlReg).index,
                newHref = href.substr(index),
                urlParamArr = newHref.split('/'),

                schemeId = urlParamArr[1],
                courseId = urlParamArr[2];
            //console.log(newHref);
            //console.log(schemeId);
            //如果有测验才新建一个测验tab
            //是learn模式才有测验
            if(href.indexOf('/learn')>-1){
                //console.log(111);
                $http.get('/web/front/myCourse/haveTest?schemeId=' + schemeId).success(function (data) {
                    if (data.info === true) {
                        commonService.hasTest = true;
                        components.addComponents({
                            name: 'test',
                            className: 'ico-ml',
                            title: '测验'
                        });
                    }
                });
            }


        }]);
});
