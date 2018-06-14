define(['kccs/subPortal/js/common/zh-cn'], function (zhCn) {
    'use strict';
    return ['$scope', 'leaveMessageService', '$dialog', '$http', '$state', '$q', function ($scope, leaveMessageService, $dialog, $http, $state, $q) {

        $http.get('/web/login/login/isLogin').success(function (data) {
            if (data.status && data.info === false) {
                $dialog.confirm({
                    title: '提示',
                    visible: true,
                    modal: true,
                    width: 250,
                    ok: function () {
                        return true;
                    },
                    content: '登录后才能留言！'
                });
                $state.go('states.accountant');
            }
        });


        $scope.model = {

            firstEnter: true,

            currentPage: 1,//当前第几页
            total: 0,//数据总条数
            maxSize: 5,//最多可见页数按钮5个
            itemsPerPage: 10,//每页显示1条 默认10条
            //minDate:new Date(),
            //maxDate:new Date(new Date().getTime()+86400000),
            problemCategoryList: [],
            problemCategoryModel: '',
            descri: '',
            hasMessageData: false,

            messageType: -1,
            categoryId: '',
            messageTimeStart: '',
            messageTimeEnd: '',

            wantToLeaveMessageDialog: null,
            deleteLeaveMessageDialog: null,
            leaveMessageList: [],

            showAllMessage: false
        };


        $scope.events = {
            pageChange: function () {
                getLeaveMessageList();
            },

            createLeaveMessage: function () {
                if ($scope.model.problemCategoryModel === '') {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请选择问题类型！'
                    });
                    return false;
                }

                if (validateIsNull($scope.model.descri)) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请输入留言内容！'
                    });
                    return false;
                }

                $scope.creatSubmitAble = true;
                resetSearchParams();
                leaveMessageService.createLeaveMessage({
                    categoryId: $scope.model.problemCategoryModel,
                    content: $scope.model.descri
                }).then(function (data) {
                    $scope.creatSubmitAble = false;
                    if (data.status) {
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
                        getLeaveMessageList().then(function () {
                            $scope.copyMessageLen = angular.copy($scope.model.leaveMessageList.length);
                        });
                        creatSuccessDo();
                        //这个和弹窗公用方法 如果弹窗创建完成后关闭弹窗
                        if ($scope.model.wantToLeaveMessageDialog !== null) {
                            $scope.model.wantToLeaveMessageDialog.remove();
                        }
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

            searchLeaveMessage: function () {
                $scope.model.currentPage = 1;
                getLeaveMessageList();
            },

            wantToLeaveMessage: function () {
                $scope.showCreatOrAddBtn = 'creat';
                $dialog.contentDialog({
                    width: 700,
                    title: '我要留言',
                    visible: true,
                    modal: true,
                    contentUrl: 'kccs/subPortal/views/leaveMessage/wangLeaveMessageDialog.html'
                }, $scope).then(function (data) {
                    $scope.model.wantToLeaveMessageDialog = data;
                });
            },

            closeDialogDo: function (dialogName, fn) {
                $scope.model[dialogName].remove();
                if (fn !== undefined) {
                    fn();
                }
            },

            closeDialog: function (dialogName) {
                $scope.events.closeDialogDo(dialogName, creatSuccessDo);
            },

            deleteLeaveMessage: function (item) {

                $scope.temporaryMessageId = item.id;
                $dialog.contentDialog({
                    title: '删除留言',
                    visible: true,
                    width: 500,
                    height: 150,
                    modal: true,
                    contentUrl: 'kccs/subPortal/views/leaveMessage/deleteLeaveMessageDialog.html'
                }, $scope).then(function (data) {
                    $scope.model.deleteLeaveMessageDialog = data;
                });

            },

            confirmDeleteMessage: function () {
                $scope.deleteSubmitAble = true;
                leaveMessageService.deleteLeaveMessage({
                    leaveMessageId: $scope.temporaryMessageId
                }).then(function (data) {
                    $scope.deleteSubmitAble = false;
                    if (data.status) {
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
                        $scope.model.deleteLeaveMessageDialog.remove();
                        $scope.model.currentPage = 1;
                        resetSearchParams();
                        getLeaveMessageList().then(function () {
                            //console.log($scope.model.leaveMessageList);
                            $scope.copyMessageLen = angular.copy($scope.model.leaveMessageList.length);
                        });
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

            openAddLeaveDialog: function (item, bigItem) {

                $scope.showCreatOrAddBtn = 'add';

                $scope.temporaryCategoryId = bigItem.categoryId;
                $scope.temporaryTopicId = item.topicId;
                $scope.temporaryLeaveMessageId = item.id;
                $dialog.contentDialog({
                    width: 700,
                    title: '我要留言',
                    visible: true,
                    modal: true,
                    contentUrl: 'kccs/subPortal/views/leaveMessage/wangLeaveMessageDialog.html'
                }, $scope).then(function (data) {
                    $scope.model.wantToLeaveMessageDialog = data;
                });
            },

            addLeaveMessage: function () {

                if (validateIsNull($scope.model.descri)) {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            return true;
                        },
                        content: '请输入留言内容！'
                    });
                    return false;
                }

                $scope.addSubmitAble = true;
                leaveMessageService.addLeaveMessage({
                    categoryId: $scope.temporaryCategoryId,
                    content: $scope.model.descri,
                    topicId: $scope.temporaryTopicId,
                    leaveMessageId: $scope.temporaryLeaveMessageId
                }).then(function (data) {
                    $scope.addSubmitAble = false;
                    if (data.status) {
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
                        $scope.model.wantToLeaveMessageDialog.remove();
                        creatSuccessDo();
                        $scope.model.currentPage = 1;
                        resetSearchParams();
                        getLeaveMessageList();
                    }
                });
            },

            hideMessage: function () {
                $scope.model.showAllMessage = false;
                hideAfterThree();
            },

            showMessage: function () {
                $scope.model.showAllMessage = true;
                showAllMessage();
            }
        };


        //获取问题类型
        leaveMessageService.findProblemCategoryList({parentId: '-1'}).then(function (data) {
            if (data.status) {
                $scope.model.problemCategoryList = data.info;
                $scope.model.problemCategoryList.unshift({
                    name: '请选择',
                    id: ''
                });
            }
        });

        //获取留言列表
        function getLeaveMessageList () {
            var defer = $q.defer(),
                promise = defer.promise;
            $scope.lwhLoading = true;
            $scope.searchSubmitAble = true;
            leaveMessageService.findLeaveMessagePage({
                messageType: $scope.model.messageType,
                categoryId: $scope.model.categoryId,
                messageTimeStart: validateIsNull($scope.model.messageTimeStart) ? '' : toDateStr($scope.model.messageTimeStart),
                messageTimeEnd: validateIsNull($scope.model.messageTimeEnd) ? '' : toDateStr($scope.model.messageTimeEnd),
                'page.pageNo': $scope.model.currentPage,
                'page.pageSize': $scope.model.itemsPerPage
            }).then(function (data) {
                $scope.lwhLoading = false;
                $scope.searchSubmitAble = false;
                if (data.status) {
                    $scope.model.total = data.totalSize;
                    $scope.model.leaveMessageList = data.info;

                    if ($scope.model.firstEnter === true) {
                        $scope.copyMessageLen = angular.copy($scope.model.leaveMessageList.length);
                    }


                    $scope.model.showAllMessage = false;
                    hideAfterThree();
                    //console.log($scope.model.leaveMessageList);

                    if ($scope.model.leaveMessageList.length <= 0) {
                        $scope.model.hasMessageData = false;
                    } else {
                        $scope.model.hasMessageData = true;
                    }

                    $scope.model.firstEnter = false;

                    defer.resolve();

                }
            });
            return promise;
        }

        getLeaveMessageList();

        //重置搜索条件
        function resetSearchParams () {
            $scope.model.messageType = -1;
            $scope.model.categoryId = '';
            $scope.model.messageTimeStart = '';
            $scope.model.messageTimeEnd = '';
        }


        //隐藏超过3以后的留言
        function hideAfterThree () {
            angular.forEach($scope.model.leaveMessageList, function (item) {

                angular.forEach(item.leaveMessages, function (subItem, index) {
                    subItem.lessThanFour = false;
                    if (index < 3) {
                        subItem.lessThanFour = true;
                    }
                });
            });
        }

        //显示全部留言
        function showAllMessage () {
            angular.forEach($scope.model.leaveMessageList, function (item) {

                angular.forEach(item.leaveMessages, function (subItem, index) {
                    subItem.lessThanFour = true;
                });
            });
        }


        //验证是否为空
        function validateIsNull (obj) {
            return (obj === '' || obj === undefined || obj === null);
        }

        //创建留言成功后做得事
        function creatSuccessDo () {
            $scope.model.problemCategoryModel = '';
            $scope.model.descri = '';
            //$scope.model.hasMessageData=true;
        }

        //时间对象转字符串
        function toDateStr (now) {
            var year = now.getFullYear();
            var month = (now.getMonth() + 1).toString();
            var day = (now.getDate()).toString();
            if (month.length == 1) {
                month = '0' + month;
            }
            if (day.length == 1) {
                day = '0' + day;
            }
            var dateTime = year + '-' + month + '-' + day;
            return dateTime;
        }

    }];
});