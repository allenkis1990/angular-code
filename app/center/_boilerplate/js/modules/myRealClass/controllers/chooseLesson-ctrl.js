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
            courseType: 2,//2选修 3已选
            courseId: null,
            hasChoseCourse: [],
            getTimeLenArr: [],
            dialogTimeLen: {},
            hasChoseCourseList: [],
            imgLoding: true,


            currentPage: 1,//当前第几页
            total: 10,//数据总条数 这个去后端拿
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 10,//每页显示8条 默认10条

            requireHours: null,
            hasChoseHour: 0
        };


        function getRequireHours () {
            myRealClassService.getUserCourseStudyInfo({classId: $stateParams.id}).then(function (data) {
                $scope.model.requireHours = data.info.surplusHour;
                $scope.copyRequireHours = angular.copy(data.info.surplusHour);
            });
        }

        getRequireHours();

        $scope.events = {

            tabCourse: function (type, id, index, item) {


                if ($scope.model.courseId === id) {
                    return false;
                }


                $scope.model.courseType = type;
                $scope.model.courseId = id;
                if (type !== 3) {//点击选修课TAB
                    $scope.model.tabIndex = index;
                } else {//点击已选课TAB
                    return false;
                }

                initParams();
                $scope.model.currentPage = 1;

                //if(item.hasLoad===false){
                $scope.events.getCourseList(type, id, item);
                //}


            },
            choseCourse: function (e, item, subItem) {

                subItem.ischecked = !subItem.ischecked;
                var needTimeLength = $scope.copyTimeLenArr[$scope.model.tabIndex].needTimeLength;

                if (subItem.ischecked === true) {
                    //如果超过需选就提示
                    if (item.hasChoseCreit >= needTimeLength) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 400,
                            ok: function () {
                                return true;
                            },
                            content: '当前所选课程学时数已超出本课程包选课要求（需选 ' + needTimeLength + '学时），无须再添选课程。'
                        });
                        e.target.checked = false;
                        subItem.ischecked = false;
                        return false;
                    }
                    $scope.model.courseSubmitIdArr[$scope.model.tabIndex].push(subItem.courseId);
                    item.hasChoseCreit = accAdd(item.hasChoseCreit, subItem.period);
                    $scope.model.getTimeLenArr[$scope.model.tabIndex].needTimeLength = Subtr($scope.model.getTimeLenArr[$scope.model.tabIndex].needTimeLength, subItem.period);
                } else {
                    var index = findIndex($scope.model.courseSubmitIdArr[$scope.model.tabIndex], subItem.courseId);
                    $scope.model.courseSubmitIdArr[$scope.model.tabIndex].splice(index, 1);
                    item.hasChoseCreit = Subtr(item.hasChoseCreit, subItem.period);
                    $scope.model.getTimeLenArr[$scope.model.tabIndex].needTimeLength = accAdd($scope.model.getTimeLenArr[$scope.model.tabIndex].needTimeLength, subItem.period);
                }
                console.log($scope.model.getTimeLenArr[$scope.model.tabIndex]);


            },


            choseCourse2: function (e, item, subItem) {

                subItem.ischecked = !subItem.ischecked;
                if (subItem.ischecked === true) {
                    //如果超过需选就提示
                    if ($scope.model.hasChoseHour >= $scope.copyRequireHours) {
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 400,
                            ok: function () {
                                return true;
                            },
                            content: '当前所选课程学时数已超出本课程包选课要求（需选 ' + $scope.copyRequireHours + '学时），无须再添选课程。'
                        });
                        e.target.checked = false;
                        subItem.ischecked = false;
                        return false;
                    }
                    $scope.model.courseSubmitIdArr[$scope.model.tabIndex].push(subItem.courseId);
                    $scope.model.hasChoseHour = accAdd($scope.model.hasChoseHour, subItem.period);
                    //item.hasChoseCreit=accAdd(item.hasChoseCreit,subItem.period);
                    //$scope.model.getTimeLenArr[$scope.model.tabIndex].needTimeLength=Subtr($scope.model.getTimeLenArr[$scope.model.tabIndex].needTimeLength,subItem.period);
                    $scope.model.requireHours = Subtr($scope.model.requireHours, subItem.period);
                } else {
                    var index = findIndex($scope.model.courseSubmitIdArr[$scope.model.tabIndex], subItem.courseId);
                    $scope.model.courseSubmitIdArr[$scope.model.tabIndex].splice(index, 1);
                    $scope.model.hasChoseHour = Subtr($scope.model.hasChoseHour, subItem.period);
                    //item.hasChoseCreit=Subtr(item.hasChoseCreit,subItem.period);
                    //$scope.model.getTimeLenArr[$scope.model.tabIndex].needTimeLength=accAdd($scope.model.getTimeLenArr[$scope.model.tabIndex].needTimeLength,subItem.period);
                    $scope.model.requireHours = accAdd($scope.model.requireHours, subItem.period);
                }
                console.log($scope.model.getTimeLenArr[$scope.model.tabIndex]);


            },


            //选课要求弹窗
            dialogRequirements: function (e) {
                e.preventDefault();
                $dialog.contentDialog({
                    title: '选课要求',
                    visible: true,
                    modal: true,
                    width: 780,
                    contentUrl: '@systemUrl@/views/myRealClass/dialogRequirements.html'
                }, $scope);
            },
            //获取课程列表1必2选3已选
            getCourseList: function (type, id, parItem) {
                var def = $q.defer();
                $scope.model.imgLoding = true;
                myRealClassService.findCoursePage(
                    {
                        listType: type,
                        schemeId: $stateParams.id, poolId: id,
                        pageNo: $scope.model.currentPage,
                        pageSize: $scope.model.itemsPerPage
                    }
                ).then(function (data) {
                    $scope.model.imgLoding = false;
                    $scope.model.total = data.totalSize;
                    $scope.model.courseBigArr[$scope.model.tabIndex].courseList = data.info;
                    angular.forEach($scope.model.courseBigArr[$scope.model.tabIndex].courseList, function (item) {
                        item.ischecked = false;
                        if (item.name.length > $scope.model.strLen) {
                            item.shortName = item.name.substr(0, $scope.model.strLen) + '...';
                        } else {
                            item.shortName = item.name;
                        }
                        item.timeLength = timeToStr(item.timeLength);
                    });
                    parItem.hasLoad = true;
                    def.resolve();
                });
                return def.promise;
            },


            tryListen: function (e, item) {
                e.preventDefault();
                window.open('/play/#/listen/' + $stateParams.id + '/' + item.courseId + '/courseware/TRAINING_CLASS?unitName='+require.unitPath, '_blank');
            },
            getTimeLength: function () {
                myRealClassService.getTimeLength({schemeId: $stateParams.id}).then(function (data) {
                    $scope.model.getTimeLenArr = data.info;
                    angular.forEach($scope.model.getTimeLenArr, function (item) {
                        if (item.packageName.length > $scope.model.timeLen) {
                            item.shortName = item.packageName.substr(0, $scope.model.timeLen) + '...';
                        } else {
                            item.shortName = item.packageName;
                        }
                    });
                    //$scope.model.getTimeLenArr[0].needTimeLength=5;
                    $scope.copyTimeLenArr = angular.copy($scope.model.getTimeLenArr);
                });
            },

            confirmChose: function (packageId) {


                if ($scope.model.courseSubmitIdArr[$scope.model.tabIndex].length <= 0) {
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
                myRealClassService.chooseCourse({
                    schemeId: $stateParams.id,
                    poolId: packageId,
                    courseIdList: $scope.model.courseSubmitIdArr[$scope.model.tabIndex]
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

                        $scope.model.currentPage = 1;
                        $timeout(function () {
                            resetSomething(packageId);
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


            changePage: function () {
                //courseTabArr:[],courseSubmitIdArr:[],

                console.log($scope.model.courseBigArr, 'big');
                console.log($scope.model.courseTabArr, 'tab');
                console.log($scope.model.courseSubmitIdArr, 'submit');


                initParams();


                $scope.events.getCourseList(2, $scope.model.courseTabArr[$scope.model.tabIndex].packageId, $scope.model.courseTabArr[$scope.model.tabIndex]);
            }
        };


        $scope.events.getTimeLength();

        function initParams () {
            angular.forEach($scope.model.courseBigArr, function (item) {
                item.courseList = [];
                item.hasChoseCreit = 0;
            });
            angular.forEach($scope.model.courseSubmitIdArr, function (item, index) {
                $scope.model.courseSubmitIdArr[index] = [];
            });
            $scope.events.getTimeLength();

            $scope.model.hasChoseHour = 0;
            getRequireHours();


        }

        function changePage () {



            //$scope.model.courseTabArr=[];
            //$scope.model.courseSubmitIdArr=[];
            //$scope.model.courseBigArr=[];

            //当前选修课下已选学时清成0
            //$scope.model.courseBigArr[$scope.model.tabIndex].hasChoseCreit=0;
            //AJAX提交的数据清空
            //$scope.model.courseSubmitIdArr[$scope.model.tabIndex]=[];

            myRealClassService.getCoursePoolRuleForm($stateParams.id).success(function (data) {
                console.log(data);
                if (data.status && data.code === 200) {


                    $scope.model.forbidOptionalPackageRequires = data.info.coursePoolRuleForm.forbidOptionalPackageRequires;
                    //$scope.model.requireHours=data.info.coursePoolRuleForm.surplusHour;


                    $scope.model.courseTabArr = data.info.coursePoolRuleForm.optionalPackageRequires;
                    $scope.model.hasChoseCourseList = data.info.courseList;


                    $scope.total = 0;
                    angular.forEach($scope.model.hasChoseCourseList, function (item) {
                        $scope.total = accAdd($scope.total, item.period);
                        item.timeLength = timeToStr(item.timeLength);
                        if (item.name.length > $scope.model.strLen) {
                            item.shortName = item.name.substr(0, $scope.model.strLen) + '...';
                        } else {
                            item.shortName = item.name;
                        }
                    });
                    $scope.model.dialogTimeLen = data.info.timeLength;
                    $scope.model.courseId = data.info.coursePoolRuleForm.optionalPackageRequires[0].packageId;
                    for (var i = 0; i < $scope.model.courseTabArr.length; i++) {
                        $scope.model.courseTabArr[i].hasLoad = false;//加载过的TAB下的课程列表就不再加载
                        $scope.model.courseSubmitIdArr.push([]);
                        $scope.model.courseBigArr.push(
                            {
                                packageId: $scope.model.courseTabArr[i].packageId,
                                courseList: [],
                                hasChoseCreit: 0
                            }
                        );
                    }
                    $scope.model.courseTabArr[0].hasLoad = true;//让第一个选修TAB下的课程列表加载状态变成加载过
                    console.log($scope.model.courseSubmitIdArr);
                    $scope.events.getCourseList(2, $scope.model.courseTabArr[0].packageId, $scope.model.courseTabArr[0]);
                }
            });
        }

        changePage();


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


        //确认选中课程成功后做得一系列重置
        function resetSomething (packageId) {
            //刷新选课提示
            $scope.events.getTimeLength();

            $scope.model.currentPage = 1;

            //刷新已选课程
            myRealClassService.getCoursePoolRuleForm($stateParams.id).success(function (data) {
                if (data.status && data.code === 200) {
                    $scope.model.hasChoseCourseList = data.info.courseList;
                    //测试
                    /*$scope.model.hasChoseCourseList=[
                        {name:'66611111',period:0.1,packageName:'88',teacherName:'hha',timeLength:111},
                        {name:'6661111',period:0.1,packageName:'88',teacherName:'hha',timeLength:111},
                        {name:'666111',period:0.1,packageName:'88',teacherName:'hha',timeLength:111},
                        {name:'666',period:0.1,packageName:'88',teacherName:'hha',timeLength:111},
                        {name:'666',period:0.1,packageName:'88',teacherName:'hha',timeLength:111}

                    ];*/
                    $scope.total = 0;
                    //弹窗里的和外面的已选课程刷新
                    angular.forEach($scope.model.hasChoseCourseList, function (item) {
                        $scope.total = accAdd($scope.total, item.period);
                        item.timeLength = timeToStr(item.timeLength);
                        if (item.name.length > $scope.model.strLen) {
                            item.shortName = item.name.substr(0, $scope.model.strLen) + '...';
                        } else {
                            item.shortName = item.name;
                        }
                    });
                    $scope.model.dialogTimeLen = data.info.timeLength;//弹窗里的学时数据刷新
                    //console.log($scope.model.courseSubmitIdArr);

                }
            });

            //刷新当前选修列表
            $scope.events.getCourseList(2, packageId, $scope.model.courseTabArr[$scope.model.tabIndex]).then(function () {
                $scope.confirmAble = false;
            });
            //当前选修课下已选学时清成0
            $scope.model.courseBigArr[$scope.model.tabIndex].hasChoseCreit = 0;
            //AJAX提交的数据清空
            $scope.model.courseSubmitIdArr[$scope.model.tabIndex] = [];
            //console.log($scope.model.courseSubmitIdArr[$scope.model.tabIndex]);


            $scope.model.hasChoseHour = 0;
            getRequireHours();
        }
    }];
});