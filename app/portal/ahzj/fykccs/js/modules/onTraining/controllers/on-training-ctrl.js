define(function (mod) {
    'use strict';

    return ['$scope', '$http', '$state', '$dialog', 'onTrainingService', 'homeService', '$stateParams', 'hbBasicData', '$rootScope', '$timeout', function ($scope, $http, $state, $dialog, onTrainingService, homeService, $stateParams, hbBasicData, $rootScope, $timeout) {
        //进入页面添加右侧帮助导航 离开页面移除帮助导航
        /*hbBasicData.addHelpNav($scope);
        $scope.$on('$destroy', function () {
            hbBasicData.removeHelpNav();
        });*/
        //进入页面添加右侧帮助导航 离开页面移除帮助导航

        $scope.model = {
            currentPage: 1,//当前第几页
            total: 10,//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 16,//每页显示8条 默认10条

            courseList: [],

            sortMark: '1',//1默认 2学时升 3学时降 4价格升 5价格降


            crditList: [
                {name: '全部', begin: null, end: null},
                {name: '0-5', begin: 0, end: 5},
                {name: '5-10', begin: 5, end: 10},
                {name: '10-15', begin: 10, end: 15},
                {name: '15-20', begin: 15, end: 20},
                {name: '20以上', begin: 20, end: 300}
            ],

            studyTypeArr: [
                {name: '培训班学习', type: 'TRAINING_CLASS_GOODS'},
                {name: '自主选课学习', type: 'COURSE_SUPERMARKET_GOODS'}
            ],

            beginHour: null,
            endHour: null,
            coursePoolId: null,
            //sort:null,
            hourSort: null,
            priceSort: null,
            categoryType: 'TRAINING_CLASS_GOODS',//COURSE_SUPERMARKET_GOODS自主选课
            showMajor: false,


            marjorList: [],
            currentMarjorId: '',
            sort: {
                type: '', // 排序说明,PERIOD:学时，PRICE：价格
                direction: '' // 排序方向，ASC：升序|DESC：降序
            },


            clearEvent: false,//清空筛选事件

            choseHourResult: null,
            showHourResult: true,

            showMajorResult: true,
            choseMajorResult: null
        };

        if (!($stateParams.categoryType === '' || $stateParams.categoryType === null || $stateParams.categoryType === undefined)) {
            $scope.model.categoryType = $stateParams.categoryType;
        }


        $scope.$watch('model.clearEvent', function (nv) {
            if (nv) {

                //清空非sku筛选条件的相关
                $scope.model['choseHourResult'] = null;
                $scope.model['beginHour'] = null;
                $scope.model['endHour'] = null;
                $scope.model['showHourResult'] = true;


                getCourseList();
                //收到清空筛选的事件后把事件还原成false
                $scope.model.clearEvent = false;
            }
        });


        //特殊处理如果选中的是专业课那么显示出专业（只在自主学习下有）
        $scope.$watch('skuParams', function (nv) {
            if (nv) {
                console.log('fuck');
                var len = getMajorIdLen(nv.skuPropertyList);
                //console.log(len);
                if (len > 0) {
                    $scope.model.showMajor = true;
                } else {
                    $scope.model.showMajor = false;
                }
                //$scope.model.currentMarjorId='';

                getCoursePoolInfos(function () {
                    $scope.model.currentPage = 1;//页码重置为1
                    getCourseList();
                });

                //console.log($scope.model.marjorList);


                //getCourseList();

            }
        }, true);


        $scope.$watch('model.categoryType', function (nv) {
            if (nv) {
                //切换学习方式的时候还原排序为默认
                $scope.model.sort.type = '';
                $scope.model.sort.direction = '';


                $scope.model['choseHourResult'] = null;
                $scope.model['beginHour'] = null;
                $scope.model['endHour'] = null;
                $scope.model['showHourResult'] = true;

            }
        });


        //获取专业
        function getCoursePoolInfos (callback) {
            $http.get('/web/portal/index/getCoursePoolInfos').success(function (data) {
                if (data.status) {
                    $scope.model.marjorList = data.info;
                    //$scope.model.marjorList.unshift({name:'全部',id:''});
                    if ($scope.model.marjorList.length > 0) {

                        if($stateParams.currentMarjorId){
                            $scope.model.currentMarjorId=$stateParams.currentMarjorId;
                        }else{
                            $scope.model.currentMarjorId = $scope.model.marjorList[0].id;
                        }

                        if($stateParams.currentMarjorId){
                            $scope.model.choseMajorResult = {
                                name: '专业',
                                value: $stateParams.currentMarjorName
                            };
                        }else{
                            $scope.model.choseMajorResult = {
                                name: '专业',
                                value: $scope.model.marjorList[0].name
                            };
                        }
                    }
                    //console.log($scope.model.currentMarjorId);
                    angular.forEach($scope.model.marjorList, function (item) {
                        if (item.name.length > 5) {
                            item.shortName = item.name.substr(0, 5) + '...';
                        } else {
                            item.shortName = item.name;
                        }
                    });


                    if (callback) {
                        callback();
                    }

                }
            });
        }

        getCoursePoolInfos();


        function getMajorIdLen (skuList) {
            var arr = [];
            angular.forEach(skuList, function (item) {
                //console.log(item.valueCode);
                if (item.valueCode === 'profession'||item.valueCode === '专业课' ) {
                    arr.push(item);
                }
            });
            return arr.length;
        }

        $scope.events = {


            fn: function () {

            },

            cacelHourSearch: function () {


                $scope.model['choseHourResult'] = null;
                $scope.model['beginHour'] = null;
                $scope.model['endHour'] = null;
                $scope.model['showHourResult'] = true;
                $scope.model.currentPage = 1;//页码重置为1
                getCourseList();
            },


            tabMajor: function (item) {
                //console.log($scope.model.currentMarjorId);
                //console.log(item.id);
                if (item.id === $scope.model.currentMarjorId) {
                    return false;
                }

                //$scope.model.showMajorResult=false;
                $scope.model.choseMajorResult = {
                    name: '专业',
                    value: item.name
                };

                $scope.model.currentMarjorId = item.id;
                $scope.model.currentPage = 1;//页码重置为1
                getCourseList();
            },

            tabStudyType: function (item) {
                if (item.type === $scope.model.categoryType) {
                    return false;
                }
                if ($scope.lwhLoading) {
                    return false;
                }
                $scope.model.categoryType = item.type;
                $scope.model.currentPage = 1;
            },


            tabSort: function (type) {
                //切到非默认的时候
                if (type !== '') {
                    $scope.model.currentPage = 1;
                    //如果点的就是这个那么进行toggle
                    if ($scope.model.sort.type === type) {

                        if ($scope.model.sort.direction === 'ASC') {
                            $scope.model.sort.direction = 'DESC';
                        } else {
                            $scope.model.sort.direction = 'ASC';
                        }

                    } else {//如果点的是其他个 一开始进去先升序
                        $scope.model.sort.direction = 'ASC';
                    }


                } else {//切到默认的时候


                    //如果重复点
                    if ($scope.model.sort.type === type) {
                        return false;
                    }

                    //$scope.model.sort.type='';
                    //$scope.model.sort.direction='';
                    //return false;
                }


                $scope.model.sort.type = type;
                if ($scope.model.sort.type === '') {
                    $scope.model.sort.direction = '';
                }
                $scope.model.currentPage = 1;


                getCourseList();

            },


            tabCrdit: function (begin, end, item) {
                /*if($scope.model.beginHour===begin&&$scope.model.endHour===end){
                    return false;
                }*/


                $scope.model.showHourResult = false;
                $scope.model.choseHourResult = {
                    name: '学时',
                    value: item.name
                };

                $scope.model.currentPage = 1;
                $scope.model.beginHour = begin;
                $scope.model.endHour = end;
                getCourseList();
            },


            getCourseList: function () {
                getCourseList();
            },

            goDetail: function (item) {


                //states.accountant.onTraining.onTrainingViews

                if ($scope.model.categoryType === 'TRAINING_CLASS_GOODS') {
                    //培训班
                    $state.go('states.accountant.onTraining.onTrainingViews', {
                        commoditySkuId: item.skuId,
                        goodsType: 'trainClass',
                        showMajor: $scope.model.showMajor
                    });
                } else {
                    //自主学习
                    $state.go('states.accountant.onTraining.onTrainingViews',
                        {
                            commoditySkuId: item.skuId,
                            coursePoolId: item.coursePoolId,
                            courseId: item.courseId,
                            goodsType: 'goods',
                            showMajor: $scope.model.showMajor
                        }
                    );
                }

            },

            putIntoShoppingCart: function (item) {


                /*var param={
                    courseId:item.courseId,
                    yearOptionsId:item.yearOptionsId,
                    subjectOptionsId:item.subjectOptionsId,
                    coursePoolId:item.coursePoolId,
                    commoditySkuId:item.commoditySkuId
                };*/

                var param = {};
                if ($scope.model.categoryType === 'TRAINING_CLASS_GOODS') {
                    //培训班
                    param = {
                        commoditySkuId: item.skuId,
                        hour: item.credit,
                        price: item.dealPrice,
                        schemeId: item.schemeId
                    };
                } else {
                    //自主选课
                    param = {
                        commoditySkuId: item.skuId,
                        courseId: item.courseId,
                        coursePoolId: item.coursePoolId,
                        hour: item.credit,
                        price: item.dealPrice,
                        schemeId: item.schemeId
                    };
                }


                homeService.putIntoShoppingCart($scope, $dialog, $http, param, item);


            },

            buyNow: function (item) {

                $scope.param = {};
                var mark = '';
                if ($scope.model.categoryType === 'TRAINING_CLASS_GOODS') {
                    //培训班
                    mark = false;
                    $scope.param = {
                        commoditySkuId: item.skuId,
                        hour: item.credit,
                        price: item.dealPrice

                    };
                } else {
                    //自主选课
                    if ($scope.model.showMajor) {
                        mark = true;
                    } else {
                        mark = false;
                    }
                    $scope.param = {
                        commoditySkuId: item.skuId,
                        courseId: item.courseId,
                        coursePoolId: item.coursePoolId,
                        hour: item.credit,
                        price: item.dealPrice
                    };
                }

                //$scope.param.yearOptionsId=item.yearOptionsId
                homeService.buyNow($scope, $dialog, $http, $scope.param, item, mark);
            },

            buyNowTwo: function (item) {

                if (!$scope.param.yearOptionsId) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请选择年度'
                    });
                    return false;
                }

                //$scope.param.yearOptionsId=$scope.tempYearId;

                //console.log($scope.param.yearOptionsId, item.yearOptionsId, $scope.model.yearListTwo);
                //$timeout(function(){
                window.open('/center/#/myOrder/creatOrder/' + parseStrFromArr([$scope.param]));
                //});
            },

            doRightYearId: function (yearId) {
                $scope.param.yearOptionsId = yearId;
            }

        };


        //JSON.stringify数组转字符串   JSON.parse字符串转数组
        function parseStrFromArr (arr) {//转数组为字符串
            var arr = arr;
            var str = JSON.stringify(arr);
            return str;
        }


        function getCourseList () {

            if ($scope.lwhLoading) {
                return false;
            }

            $scope.lwhLoading = true;
            if ($scope.model.categoryType === 'TRAINING_CLASS_GOODS') {
                //培训班
                var params = {
                    skuPropertyList: $scope.skuParams.skuPropertyList,
                    sort: $scope.model.sort.type === '' ? undefined : $scope.model.sort,
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage
                };
                goodsAjaxDo('findSalesClassPage', params);
            } else {
                //自主学习
                //$scope.lwhLoading=false;
                //$scope.model.currentMarjorId
                var params = {
                    skuPropertyList: $scope.skuParams.skuPropertyList,
                    sort: $scope.model.sort.type === '' ? undefined : $scope.model.sort,
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage,
                    coursePoolId: $scope.model.showMajor ? $scope.model.currentMarjorId : undefined,
                    beginHour: $scope.model.beginHour, // 开始学时
                    endHour: $scope.model.endHour // 结束学时
                };
                goodsAjaxDo('findSalesCoursePage', params);

            }


        }


        function goodsAjaxDo (method, params) {
            $http.post('/web/portal/index/' + method, params).success(function (data) {
                $scope.lwhLoading = false;
                if (data.status) {
                    $scope.model.total = data.totalSize;
                    $scope.model.courseList = data.info;


                    $http.get('/web/portal/index/getProfessionYearQueryOptions').success(function (subData) {
                        //console.log(subData);
                        $scope.model.yearListTwo = subData.info;

                        angular.forEach($scope.model.courseList, function (item) {
                            item.showTwo = false;
                            //如果是专业课 默认把item的年度id设置为当前年度
                            item.yearOptionsId = '';
                        });
                        //console.log($scope.model.courseList);
                    });


                }
            });
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


    }];
});