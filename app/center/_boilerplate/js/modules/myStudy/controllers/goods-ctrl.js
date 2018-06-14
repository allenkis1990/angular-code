define(function (message) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$http', '$state', '$dialog', 'homeService', 'myStudyService', 'hbBasicData',
            function ($scope, $http, $state, $dialog, homeService, myStudyService, hbBasicData) {

                var searchModelArr = ['trainingResult'];
                var searchObjArr = ['choseTrainResult'];
                var searchViewArr = ['showTrainResult'];
                $scope.$watch('model.clearEvent', function (nv) {
                    if (nv) {


                        //$scope.model.trainingResult='';
                        //$scope.model.showTrainResult=true;
                        //$scope.model.choseTrainResult=null;


                        //清空非sku筛选条件的相关
                        angular.forEach(searchModelArr, function (item) {
                            $scope.model[item] = '';
                        });
                        angular.forEach(searchObjArr, function (item) {
                            $scope.model[item] = null;
                        });
                        angular.forEach(searchViewArr, function (item) {
                            $scope.model[item] = true;
                        });


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


                            console.log(nv);

                            var skuLIst = nv.skuPropertyList, params = {skuPropertyList: []}, temp = {};
                            angular.forEach(skuLIst, function (item) {
                                if (item.propertyIdCode === 'trainingSubject') {
                                    params.skuPropertyList = [item];
                                }
                            });
                            //console.log(params);


                            myStudyService.parseDo(angular, params, temp);
                            console.log(temp);

                            /*$http.get('/web/front/myCourse/listUserCoursePool',{params:temp}).success(function(data){
                                if(data.status){
                                    $scope.model.marjorList=data.info;
                                    $scope.model.marjorList.unshift({name:'全部',id:''});
                                    angular.forEach($scope.model.marjorList,function(item){
                                        if(item.name.length>5){
                                            item.shortName=item.name.substr(0,5)+'...';
                                        }else{
                                            item.shortName=item.name;
                                        }
                                    });
                                    //console.log($scope.model.marjorList);
                                }
                            });*/
                        } else {
                            $scope.model.showMajor = false;
                        }
                        $scope.model.currentMarjorId = '';
                        $scope.model.currentPage = 1;//页码重置为1
                        getCourseList();

                    }
                }, true);

                $scope.model = {
                    categoryType: 'COURSE_SUPERMARKET_GOODS',//TRAINING_CLASS_GOODS
                    /*sort:{
                        orderByField:'',//排序字段 0最后学习时间 1学习进度
                        isDescending:''//是否降序

                    },*/
                    orderByField: '',//排序字段 0最后学习时间 1学习进度
                    descending: '',//是否降序
                    trainingResult: '',
                    currentMarjorId: '',
                    currentPage: 1,//当前第几页
                    total: 10,//数据总条数 这个去后端拿
                    maxSize: 5,//最多可见页数按钮5个
                    itemsPerPage: 16,//每页显示8条 默认10条

                    courseList: [],
                    marjorList: [],
                    showMajor: false,

                    showTrainResult: true,
                    choseTrainResult: null,
                    clearEvent: false//清空筛选事件
                };
                $scope.events = {
                    fn: function () {

                    },


                    cacelSearch: function (objName, modelName, value, showName) {
                        $scope.model[objName] = null;
                        $scope.model[modelName] = value;
                        $scope.model[showName] = true;
                        $scope.model.currentPage = 1;//页码重置为1
                        getCourseList();
                    },

                    tabSort: function (type) {
                        //切到非默认的时候
                        if (type !== '') {
                            $scope.model.currentPage = 1;
                            //如果点的就是这个那么进行toggle
                            if ($scope.model.orderByField === type) {

                                if ($scope.model.descending === false) {
                                    $scope.model.descending = true;
                                } else {
                                    $scope.model.descending = false;
                                }

                            } else {//如果点的是其他个 一开始进去先升序
                                $scope.model.descending = false;
                            }


                        } else {//切到默认的时候


                            //如果重复点
                            if ($scope.model.orderByField === type) {
                                return false;
                            }

                            //$scope.model.sort.type='';
                            //$scope.model.sort.direction='';
                            //return false;
                        }


                        $scope.model.orderByField = type;
                        if ($scope.model.orderByField === '') {
                            $scope.model.descending = '';
                        }
                        $scope.model.currentPage = 1;

                        //console.log($scope.model.isDescending);
                        console.log($scope.model.orderByField);
                        getCourseList();

                    },

                    tabTrainingResult: function (type, name, value) {
                        /*if($scope.model.trainingResult===type){
                            return false;
                        }*/
                        $scope.model.trainingResult = type;
                        $scope.model.showTrainResult = false;
                        $scope.model.choseTrainResult = {
                            name: name,
                            value: value
                        };

                        $scope.model.currentPage = 1;//页码重置为1
                        getCourseList();
                    },
                    getCourseList: function () {
                        getCourseList();
                    },

                    tabMajor: function (item) {
                        console.log($scope.model.currentMarjorId);
                        console.log(item.id);
                        if (item.id === $scope.model.currentMarjorId) {
                            return false;
                        }
                        $scope.model.currentMarjorId = item.id;
                        $scope.model.currentPage = 1;//页码重置为1
                        getCourseList();
                    },

                    goOntrainingView: function () {
                        if (dev) {
                            window.open('/portal/#/accountant/accountant.onTraining/', '_blank');
                        } else {
                            window.open('/#/accountant/accountant.onTraining/', '_blank');
                        }
                    },

                    detail: function (item) {
                        homeService.listenCourse('detail', item, null, $http, $scope, $dialog, function () {
                            var jsonObj = angular.toJson({
                                courseId: item.courseId,
                                schemeId: item.schemeId,
                                commoditySkuId: item.commoditySkuId,
                                userChooseCourseId: item.userChooseCourseId
                            });
                            $state.go('states.home.detail', {jsonObj: jsonObj});
                        });


                    },

                    listenCourse: function (item, e) {
                        //listenCourse:function(entryType,item,e,$http,$scope,$dialog)
                        homeService.listenCourse('list', item, e, $http, $scope, $dialog);
                    },


                    doTesting: function (item, e) {
                        homeService.doTesting(item, e, $scope, $http, $dialog);
                    },

                    courseRelearn: function (item, e) {
                        e.stopPropagation();
                        homeService.courseRelearn(item, $dialog, $http, $scope);
                    }

                };


                function getCourseList () {
                    if ($scope.lwhLoading) {
                        return false;
                    }
                    $scope.lwhLoading = true;
                    //自主学习
                    var params = {
                        skuPropertyList: $scope.skuParams.skuPropertyList,
                        orderByField: $scope.model.orderByField === '' ? undefined : $scope.model.orderByField,
                        descending: $scope.model.descending === '' ? undefined : $scope.model.descending,
                        //sort:$scope.model.sort.orderByField===''?undefined:$scope.model.sort,
                        trainingResult: $scope.model.trainingResult === '' ? undefined : $scope.model.trainingResult,
                        pageNo: $scope.model.currentPage,
                        pageSize: $scope.model.itemsPerPage
                        //poolId:$scope.model.currentMarjorId
                    };

                    var temp = {};

                    myStudyService.parseDo(angular, params, temp);

                    goodsAjaxDo(temp);
                }


                function goodsAjaxDo (params) {
                    $http.get('/web/front/myCourse/pageMyCourseInfo', {params: params}).success(function (data) {
                        $scope.lwhLoading = false;
                        if (data.status) {
                            $scope.model.total = data.totalSize;
                            $scope.model.courseList = data.info;
                        }
                    });
                }


                function getMajorIdLen (skuList) {
                    var arr = [];
                    angular.forEach(skuList, function (item) {
                        if (item.valueCode === 'profession') {
                            arr.push(item);
                        }
                    });
                    return arr.length;
                }


            }]
    };
});