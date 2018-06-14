/**
 * Created by 亡灵走秀 on 2017/3/2.
 */
define(function (mod) {
    'use strict';

    return ['$scope', '$http', '$state', '$dialog', 'onTrainingService', '$stateParams', 'homeService', function ($scope, $http, $state, $dialog, onTrainingService, $stateParams, homeService) {

        //console.log($stateParams.showMajor);

        //console.log($stateParams);
        $scope.model = {
            detailInfo: {},
            detailInfoTwo: {},
            tabShow: 'ml',
            isListen: false,
            firstCweId: '',
            courseBagList: [],
            courseList: [],
            currentPackageId: '',
            currentPage: 1,//当前第几页
            total: 10,//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 8//每页显示8条 默认10条
        };


        $scope.events = {

            tabTab: function (type) {
                $scope.model.tabShow = type;
            },

            putIntoShoppingCart: function () {

                var param = {};
                var detail = $scope.model.detailInfo;
                if ($stateParams.goodsType === 'trainClass') {
                    param = {
                        commoditySkuId: $stateParams.commoditySkuId,
                        hour: detail.credit,
                        price: detail.dealPrice
                    };
                } else {
                    param = {
                        courseId: $stateParams.courseId,
                        coursePoolId: $stateParams.coursePoolId,
                        commoditySkuId: $stateParams.commoditySkuId,
                        hour: detail.credit,
                        price: detail.dealPrice
                    };
                }

                homeService.putIntoShoppingCart($scope, $dialog, $http, param, detail);
            },

            buyNow: function () {


                var detail = $scope.model.detailInfo;

                $scope.param = {};
                var mark = '';
                if ($stateParams.goodsType === 'trainClass') {
                    //培训班
                    mark = false;
                    $scope.param = {
                        commoditySkuId: $stateParams.commoditySkuId,
                        hour: detail.credit,
                        price: detail.dealPrice

                    };
                } else {
                    //自主选课
                    if ($stateParams.showMajor === 'true') {
                        mark = true;
                    } else {
                        mark = false;
                    }
                    $scope.param = {
                        commoditySkuId: $stateParams.commoditySkuId,
                        courseId: $stateParams.courseId,
                        coursePoolId: $stateParams.coursePoolId,
                        hour: detail.credit,
                        price: detail.dealPrice
                    };
                }


                //var detail=$scope.model.detailInfo;
                //console.log($scope.model.detailInfo.trainingYearId);
                homeService.buyNow($scope, $dialog, $http, $scope.param, $scope.model.detailInfo, mark);
            },

            buyNowTwo: function () {

                if (!$scope.param.yearOptionsId) {
                    $scope.param.yearOptionsId = getCurrentYearId($scope.model.yearListTwo);
                } else {
                    $scope.param.yearOptionsId = $scope.model.detailInfo.trainingYearId;
                }
                console.log($scope.param.yearOptionsId, $scope.model.detailInfo.trainingYearId, $scope.model.yearListTwo);
                window.open('/center/#/myOrder/creatOrder/' + parseStrFromArr([$scope.param]));

            },

            doRightYearId: function () {

            },
            openListenWindow: function (courseId, kjId, isLock) {
                if (isLock === 1) {
                    window.open('/play/#/listen/' + $scope.model.detailInfo.schemeId + '/' + $scope.model.detailInfo.course.id + '/' + kjId + '/xxx?unitName='+require.unitPath, '_blank');
                } else {
                    return false;
                }
            },
            openFirstListenWindow: function () {
                window.open('/play/#/listen/' + $scope.model.detailInfo.schemeId + '/' + $scope.model.detailInfo.course.id + '/' + $scope.model.firstCweId + '/xxx?unitName='+require.unitPath, '_blank');
            },

            chosePackage: function (item) {
                if (item.packageId === $scope.model.currentPackageId || $scope.submitAble) {
                    return false;
                }
                $scope.model.currentPackageId = item.packageId;
                $scope.model.currentPage = 1;
                getCourseList();
            },

            listenCourse: function (item) {
                if (item.listen) {
                    window.open('/play/#/listen/' + $scope.model.detailInfo.schemeId + '/' + item.courseId + '/courseware/xxx?unitName='+require.unitPath, '_blank');
                } else {
                    return false;
                }
            },
            getCourseList: function () {
                if ($scope.submitAble) {
                    return false;
                }
                getCourseList();
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


        function getCourseList () {
            $scope.submitAble = true;
            $http.get('/web/portal/index/getPackageCoursePage', {
                params: {
                    poolId: $scope.model.currentPackageId,//课程包id
                    schemeId: $scope.model.detailInfo.schemeId,//学习方案id
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage
                }
            }).success(function (subData) {
                $scope.submitAble = false;
                if (subData.status) {
                    $scope.model.total = subData.totalSize;
                    $scope.model.courseList = subData.info;
                }

            });
        }


        if ($stateParams.goodsType === 'goods') {
            //自主选课

            $http.get('/web/portal/index/getCourseCommodityDetail', {
                params: {
                    skuId: $stateParams.commoditySkuId,
                    coursePoolId: $stateParams.coursePoolId,
                    courseId: $stateParams.courseId
                }
            }).success(function (data) {
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

                $scope.model.detailInfo = data.info;
                //$scope.model.detailInfo.saleTitle='我我我我我我我我我我我我我我我我我我我我我我我我';
                if ($scope.model.detailInfo.saleTitle.length > 19) {
                    $scope.model.detailInfo.shortTitle = $scope.model.detailInfo.saleTitle.substr(0, 19) + '...';
                } else {
                    $scope.model.detailInfo.shortTitle = $scope.model.detailInfo.saleTitle;
                }
                console.log($scope.model.detailInfo);


                $http.get('/web/portal/index/getProfessionYearQueryOptions').success(function (subData) {
                    console.log(subData);
                    $scope.model.detailInfo.showTwo = false;
                    $scope.model.yearListTwo = subData.info;
                    $scope.model.detailInfo.trainingYearId = getCurrentYearId(subData.info);
                });


                var count = 0;
                angular.forEach($scope.model.detailInfo.course.courseOutlineDtos, function (item) {
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
                });


            });

        } else {
            //培训班

            $http.get('/web/portal/index/getClassDetail', {
                params: {
                    skuId: $stateParams.commoditySkuId
                }
            }).success(function (data) {
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

                $scope.model.detailInfo = data.info;
                //$scope.model.detailInfo.saleTitle='我我我我我我我我我我我我我我我我我我我我我我我我';
                if ($scope.model.detailInfo.saleTitle.length > 19) {
                    $scope.model.detailInfo.shortTitle = $scope.model.detailInfo.saleTitle.substr(0, 19) + '...';
                } else {
                    $scope.model.detailInfo.shortTitle = $scope.model.detailInfo.saleTitle;
                }
                console.log($scope.model.detailInfo);
                $scope.model.detailInfo.showTwo = false;


                $http.get('/web/portal/index/getPeriodRequiredList?schemeId=' + $scope.model.detailInfo.schemeId).success(function (data) {
                    if (data.status) {
                        $scope.model.courseBagList = data.info;
                        if ($scope.model.courseBagList.length > 0) {
                            $scope.model.currentPackageId = $scope.model.courseBagList[0].packageId;


                            getCourseList();


                            angular.forEach($scope.model.courseBagList, function (item) {
                                //item.packageName='我我我我我我我我我我我'
                                if (item.packageName.length > 7) {
                                    item.shortName = item.packageName.substr(0, 7) + '...';
                                } else {
                                    item.shortName = item.packageName;
                                }
                            });
                        }

                    }
                });


            });


        }

        /*onTrainingService.getCourseRelationBaseInfo(
            {
                commoditySkuId:$stateParams.commoditySkuId,
                coursePoolId:$stateParams.coursePoolId,
                courseId:$stateParams.courseId
            }
        ).then(function(data){


            if(!data.status&&data.code===500){
                $dialog.confirm ( {
                    title  : '提示',
                    visible: true,
                    modal  : true,
                    width  : 250,
                    ok     : function () {
                        //alert(111);
                        return true;
                    },
                    content: '商品已经下架'
                } );
                return false;
            }

            if(data.status&&data.code===200){
                $scope.model.detailInfo=data.info;
                $scope.model.detailInfo.showTwo=false;


                onTrainingService.getProfessionYearQueryOptions().then(function(subData){

                    $scope.model.yearListTwo=subData.info;
                    //如果是专业课 默认把item的年度id设置为当前年度
                    if($scope.model.detailInfo.subjectId==='5628812b569c57e001569c5a77f6a012'){
                        $scope.model.detailInfo.trainingYearId=getCurrentYearId(subData.info);
                    }

                    console.log($scope.model.detailInfo);
                });
            }
        });*/


    }];
});