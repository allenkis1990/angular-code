define(function (message) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$http', 'myStudyService', '$dialog', '$state', 'myRealClassService', function ($scope, $http, myStudyService, $dialog, $state, myRealClassService) {


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
                    $scope.model.currentPage = 1;//页码重置为1
                    getCourseList();

                }
            }, true);

            $scope.model = {
                categoryType: 'TRAINING_CLASS_GOODS',//COURSE_SUPERMARKET_GOODS
                currentPage: 1,//当前第几页
                total: 10,//数据总条数 这个去后端拿
                maxSize: 5,//最多可见页数按钮5个
                itemsPerPage: 16,//每页显示8条 默认10条
                classList: [],
                trainingResult: '',

                showTrainResult: true,
                choseTrainResult: null,
                clearEvent: false

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

                goOntrainingView: function () {
                    if (dev) {
                        window.open('/portal/#/accountant/accountant.onTraining/', '_blank');
                    } else {
                        window.open('/#/accountant/accountant.onTraining/', '_blank');
                    }
                },

                validateUserClassAccess: function (item) {
                    myRealClassService.validateUserClassThenDo('list', item.classId, $dialog, function () {
                        $state.go('states.myRealClass', {id: item.classId});
                    }, $scope);
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
                    trainingResult: $scope.model.trainingResult === '' ? undefined : $scope.model.trainingResult,
                    pageNo: $scope.model.currentPage,
                    pageSize: $scope.model.itemsPerPage
                };


                var temp = {};


                myStudyService.parseDo(angular, params, temp);

                console.log(temp);
                goodsAjaxDo(temp);
            }


            //特殊处理--非数组
            function parseObj (parentKey) {
                return 'queryParam' + '[' + parentKey + ']';
            }


            //特殊处理--数组
            function parseArr (parentKey, index, arrItemKey) {
                return 'queryParam' + '[' + parentKey + ']' + '[' + index + ']' + '[' + arrItemKey + ']';
            }

            function goodsAjaxDo (params) {
                $http.get('/web/front/myClass/getMyClassInfo', {params: params}).success(function (data) {
                    $scope.lwhLoading = false;
                    if (data.status) {
                        $scope.model.total = data.totalSize;
                        $scope.model.classList = data.info;
                    }
                });
            }


        }]
    };
});