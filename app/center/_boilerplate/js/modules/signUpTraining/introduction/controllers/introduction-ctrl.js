define(function () {
    'use strict';
    return ['$scope', '$stateParams', '$state', '$dialog', 'signUpTrainingService', '$rootScope', '$http', 'hbBasicData', function ($scope, $stateParams, $state, $dialog, signUpTrainingService, $rootScope, $http, hbBasicData) {

        $scope.model = {
            yearListTwo: [],
            detailInfo: {},
            detailInfoTwo: {},
            tabShow: 'ml',
            subjectId: '5628812b569c57e001569c5a77f6a011',//公需课Id
            isListen: false,
            firstCweId: '',
            fromWhere: $stateParams.fromWhere
        };


        $scope.events = {


            goOrderDetail: function () {
                $state.go('states.myOrder.detail', {orderNo: $stateParams.fromWhere});
            },

            tabTab: function (type) {
                $scope.model.tabShow = type;
            },

            putIntoShoppingCart: function () {
                var detail = $scope.model.detailInfo;
                var param = {
                    courseId: $stateParams.courseId,
                    yearOptionsId: detail.trainingYearId,
                    subjectOptionsId: detail.subjectId,
                    coursePoolId: $stateParams.coursePoolId,
                    commoditySkuId: $stateParams.commoditySkuId
                };
                signUpTrainingService.putIntoShoppingCart($scope, $dialog, $http, param, detail);
            },

            buyNow: function () {
                var detail = $scope.model.detailInfo;
                $scope.param = {
                    courseId: $stateParams.courseId,
                    yearOptionsId: detail.trainingYearId,
                    subjectOptionsId: detail.subjectId,
                    coursePoolId: $stateParams.coursePoolId,
                    commoditySkuId: $stateParams.commoditySkuId
                };

                hbBasicData.setCookie('urlParamsList', parseStrFromArr([$scope.param]));
                //$rootScope.urlParamsList=[$scope.param];
                signUpTrainingService.buyNow($scope, $dialog, $http, $scope.param, detail);
            },

            buyNowTwo: function () {
                $scope.param.yearOptionsId = $scope.model.detailInfo.trainingYearId;
                hbBasicData.setCookie('urlParamsList', parseStrFromArr([$scope.param]));
                //$rootScope.urlParamsList=[$scope.param];
                $state.go('states.myOrder.creatOrder');
            },

            openListenWindow: function (courseId, kjId, isLock) {
                if (isLock === 1) {
                    window.open('/play/#/listen/' + $scope.model.detailInfo.schemeId + '/' + $scope.model.detailInfoTwo.id + '/' + kjId, '_blank');
                } else {
                    return false;
                }
            },
            openFirstListenWindow: function () {
                window.open('/play/#/listen/' + $scope.model.detailInfo.schemeId + '/' + $scope.model.detailInfoTwo.id + '/' + $scope.model.firstCweId, '_blank');
            }
        };

        //JSON.stringify数组转字符串   JSON.parse字符串转数组
        function parseStrFromArr (arr) {//转数组为字符串
            var arr = arr;
            var str = JSON.stringify(arr);
            return str;
        }

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

        signUpTrainingService.getCourseRelationBaseInfo(
            {
                commoditySkuId: $stateParams.commoditySkuId,
                coursePoolId: $stateParams.coursePoolId,
                courseId: $stateParams.courseId
            }
        ).then(function (data) {


            if (!data.status && data.code === 500) {
                $dialog.confirm({
                    title: '提示',
                    visible: true,
                    modal: true,
                    width: 250,
                    ok: function () {
                        //alert(111);
                        return true;
                    },
                    content: '商品已经下架'
                });
                return false;
            }

            if (data.status && data.code === 200) {
                $scope.model.detailInfo = data.info;
                $scope.model.detailInfo.showTwo = false;

                signUpTrainingService.getProfessionYearQueryOptions().then(function (subData) {

                    $scope.model.yearListTwo = subData.info;

                    if ($scope.model.detailInfo.subjectId === '5628812b569c57e001569c5a77f6a012') {
                        $scope.model.detailInfo.trainingYearId = getCurrentYearId(subData.info);
                    }

                    console.log($scope.model.detailInfo);
                });

            }
        });

        function getCurrentYearId (yearArr) {
            var current = new Date().getFullYear() + '';
            var yearId = null;
            angular.forEach(yearArr, function (item) {
                if (item.name === current) {
                    yearId = item.optionId;
                }
            });

            return yearId;
        }

        signUpTrainingService.getCourseInfo({courseId: $stateParams.courseId}).then(function (data) {
            var count = 0;
            $scope.model.detailInfoTwo = data.info;

            angular.forEach($scope.model.detailInfoTwo.courseOutlineDtos, function (item) {
                item.timeLength = timeToStr(item.timeLength);
                angular.forEach(item.subCourseOutlines, function (subItem) {
                    subItem.timeLength = timeToStr(subItem.timeLength);
                    if (subItem.customeStatus === 1) {
                        count++;
                        if (count === 1) {
                            $scope.model.isListen = true;
                            $scope.model.firstCweId = subItem.cweId;
                        }
                    }
                });
                //console.log(count);
            });

        });

    }];
});
