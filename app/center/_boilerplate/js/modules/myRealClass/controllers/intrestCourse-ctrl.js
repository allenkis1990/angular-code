define(function (myRealClass) {
    'use strict';
    return ['$scope', '$dialog', '$stateParams', 'myRealClassService', '$timeout', '$state', '$http', '$q', function ($scope, $dialog, $stateParams, myRealClassService, $timeout, $state, $http, $q) {
        $scope.model = {
            strLen: 36,
            timeLen: 16,
            courseTabArr: [],
            courseSubmitIdArr: [],
            courseBigArr: [],
            tabIndex: 0,
            type: 1,//2选修 3已选
            courseId: null,
            hasChoseCourse: [],
            getTimeLenArr: [],
            dialogTimeLen: {},
            hasChoseCourseList: [],
            imgLoding: true,
            hasChoseCreit: 0,
            haveInterest: $stateParams.haveInterest,
            InterestBagList: [],
            coursePoolList:[],
            coursePoolId:''
        };


        function getInterestCourseList () {
            $scope.submitAble = true;
            myRealClassService.findInterestCourseList($stateParams.id, $scope.model.currentPackageId).success(function (data) {
                $scope.submitAble = false;
                $scope.model.courseTabArr = data.info;
                angular.forEach($scope.model.courseTabArr, function (item) {
                    item.timeLength = timeToStr(item.timeLength);
                    if (item.name.length > $scope.model.strLen) {
                        item.shortName = item.name.substr(0, $scope.model.strLen) + '...';
                    } else {
                        item.shortName = item.name;
                    }
                });
            });
        }





        $scope.events = {


            choseInterBag: function (item) {
                if ($scope.submitAble) {
                    return false;
                }
                $scope.model.courseSubmitIdArr = [];
                $scope.model.currentPackageId = item.packageId;
                getInterestCourseList();
            },


            chooseIntrest: function (e) {
                e.preventDefault();
                if ($scope.submitAble) {
                    return false;
                }
                // console.log($scope.model.courseSubmitIdArr);
                $scope.model.courseSubmitIdArr = [];
                $dialog.contentDialog({
                    title: '选择兴趣课',
                    visible: true,
                    modal: true,
                    width: 820,
                    cancel: function () {
                        $scope.model.courseSubmitIdArr = [];
                        $state.reload($state.current);
                    },
                    contentUrl: '@systemUrl@/views/myRealClass/chooseIntrest.html'
                }, $scope);


                $scope.submitAble = true;

                $http.get('/web/front/chooseCourseAction/findInterestCoursePoolList', {
                    params: {
                        schemeId: $stateParams.id
                    }
                }).success(function (data) {
                    $scope.submitAble = false;
                    if (data.status) {
                        $scope.model.InterestBagList = data.info;
                        if (angular.isArray(data.info) && data.info.length > 0) {
                            $scope.model.currentPackageId = data.info[0].packageId;
                        }


                        getInterestCourseList();

                    }
                });


            },
            tabCourse: function (type) {
                if (type === $scope.model.type) {
                    return false;
                }
                if (type === 1) {
                    myRealClassService.findInterestCourseList($scope.model.getUserClassLearningInfo.classId, $scope.model.getUserClassLearningInfo.interestCoursePoolId).success(function (data) {
                        $scope.model.courseTabArr = data.info;
                        $scope.model.hasChoseCreit = 0;
                        angular.forEach($scope.model.courseTabArr, function (item) {
                            item.timeLength = timeToStr(item.timeLength);
                            if (item.name.length > $scope.model.strLen) {
                                item.shortName = item.name.substr(0, $scope.model.strLen) + '...';
                            } else {
                                item.shortName = item.name;
                            }
                            item.ischecked = false;
                        });
                        $scope.model.courseSubmitIdArr = [];

                    });

                } else if (type === 2) {
                    myRealClassService.findUserSelectedInterestCourseInPoolList($stateParams.id,'').success(function (data) {
                        console.log(data.info);
                        if (data.status && data.code === 200) {
                            $scope.model.hasChoseIntrestList = data.info;
                            $scope.total = 0;
                            angular.forEach($scope.model.hasChoseIntrestList, function (item) {
                                item.timeLength = timeToStr(item.timeLength);
                                if (item.courseName.length > $scope.model.strLen) {
                                    item.shortName = item.courseName.substr(0, $scope.model.strLen) + '...';
                                } else {
                                    item.shortName = item.courseName;
                                }
                            });
                        }
                    });
                }
                $scope.model.type = type;
            },
            choseCourse: function (e, subItem) {

                subItem.ischecked = !subItem.ischecked;
                if (subItem.ischecked === true) {
                    $scope.model.courseSubmitIdArr.push(subItem.courseId);
                    $scope.model.hasChoseCreit = accAdd($scope.model.hasChoseCreit, subItem.period);

                } else {

                    var index = findIndex($scope.model.courseSubmitIdArr, subItem.courseId);
                    $scope.model.courseSubmitIdArr.splice(index, 1);
                    console.log($scope.model.courseSubmitIdArr);
                    $scope.model.hasChoseCreit = Subtr($scope.model.hasChoseCreit, subItem.period);
                }

            },

            intrestPlay: function (e, item) {
                e.preventDefault();
                //exts=interestCourse
                window.open('/play/#/learn/' + $stateParams.classId + '/' + item.courseId + '/courseware/interestCourse?unitName='+require.unitPath, '_blank');

            },
            tryListen: function (e, item) {
                e.preventDefault();
                window.open('/play/#/listen/' + $stateParams.classId + '/' + item.courseId + '/courseware/interestCourse?unitName='+require.unitPath, '_blank');

            },
            confirmChose: function () {


                if ($scope.model.courseSubmitIdArr.length <= 0) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请选择课程'
                    });
                    return false;
                }

                $scope.confirmAble = true;
                myRealClassService.chooseInterestCourse({
                    schemeId: $stateParams.classId,
                    poolId: $scope.model.currentPackageId,
                    courseIdList: $scope.model.courseSubmitIdArr
                }).then(function (data) {
                    if (data.status && data.code === 200) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: data.info
                        });

                        $timeout(function () {
                            resetSomething($stateParams.coursePoolId);
                        }, 2000);
                    } else {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                return true;
                            },
                            content: data.info
                        });
                    }

                });

            },

            getIntrestPackList:function(item){
                if($scope.model.imgLoding||$scope.model.coursePoolId===item.packageId){
                    return false;
                }
                $scope.model.coursePoolId=item.packageId;
                getIntrestPackList();
            }
        };

        function getIntrestPackList(){
            $scope.model.imgLoding=true;
            myRealClassService.findUserSelectedInterestCourseInPoolList($stateParams.id,$scope.model.coursePoolId).success(function (data) {
                $scope.model.imgLoding=false;
                console.log(data);
                if (data.status && data.code === 200) {
                    $scope.model.intrestPackList = data.info;
                    //$scope.total=0;
                    angular.forEach($scope.model.intrestPackList, function (item) {

                        item.timeLength = timeToStr(item.timeLength);
                        if (item.courseName.length > $scope.model.strLen) {
                            item.shortName = item.courseName.substr(0, $scope.model.strLen) + '...';
                        } else {
                            item.shortName = item.courseName;
                        }
                    });

                }
            });
        }
        getIntrestPackList();

        //获取筛选条件课程包
        $http.get('/web/front/chooseCourseAction/findSelectedInterestCoursePoolList',{params:{schemeId:$stateParams.classId}}).success(function(data){
            console.log(data);
            if(data.status){
                $scope.model.coursePoolList=data.info;
                if(angular.isArray(data.info)&&data.info.length>0){
                    $scope.model.coursePoolList.unshift({
                        packageId: "",
                        packageName: "全部"});
                    angular.forEach($scope.model.coursePoolList,function(item){
                        if(item.packageName.length>5){
                            item.shortName=item.packageName.substr(0,5)+'...';
                        }else{
                            item.shortName=item.packageName;
                        }
                    });
                }


            }
        });


        //解决精度丢失--加
        function accAdd (arg1, arg2) {
            var r1, r2, m;
            try {
                r1 = arg1.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split('.')[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            return (arg1 * m + arg2 * m) / m;
        }

        //解决精度丢失--减
        function Subtr (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split('.')[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        }

        function findIndex (arr, id) {
            var index = null;
            angular.forEach(arr, function (item, dataIndex) {
                if (item === id) {
                    index = dataIndex;
                }
            });
            return index;
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

        /*myRealClassService.getUserClassLearningInfo({classId: $stateParams.id}).then(function (data) {
            $scope.model.getUserClassLearningInfo = data.info;
        });*/

        //确认选中课程成功后做得一系列重置
        function resetSomething (packageId) {
            myRealClassService.findInterestCourseList($stateParams.id, $scope.model.currentPackageId).success(function (data) {
                $scope.model.courseTabArr = data.info;
                $scope.model.hasChoseCreit = 0;
                angular.forEach($scope.model.courseTabArr, function (item) {
                    item.timeLength = timeToStr(item.timeLength);
                    if (item.name.length > $scope.model.strLen) {
                        item.shortName = item.name.substr(0, $scope.model.strLen) + '...';
                    } else {
                        item.shortName = item.name;
                    }

                    item.ischecked = false;
                });
                $scope.model.courseSubmitIdArr = [];

            });
            $scope.model.coursePoolId='';
            $scope.model.imgLoding=true;
            myRealClassService.findUserSelectedInterestCourseInPoolList($stateParams.id,$scope.model.coursePoolId).success(function (data) {
                console.log(data);
                $scope.model.imgLoding=false;
                if (data.status && data.code === 200) {
                    $scope.model.intrestPackList = data.info;


                    $scope.total = 0;
                    angular.forEach($scope.model.intrestPackList, function (item) {
                        item.timeLength = timeToStr(item.timeLength);
                        if (item.courseName.length > $scope.model.strLen) {
                            item.shortName = item.courseName.substr(0, $scope.model.strLen) + '...';
                        } else {
                            item.shortName = item.courseName;
                        }
                    });
                }
            });


            $scope.confirmAble = false;
            //当前选修课下已选学时清成0
            $scope.model.hasChoseCreit = 0;
            //AJAX提交的数据清空
            $scope.model.courseSubmitIdArr = [];
            //console.log($scope.model.courseSubmitIdArr[$scope.model.tabIndex]);
        }
    }];
});