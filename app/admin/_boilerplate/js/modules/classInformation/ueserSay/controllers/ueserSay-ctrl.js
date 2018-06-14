define(function (ueserSay) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'messageReplyService', 'HB_dialog', '$state', 'classInformationServices', 'HB_notification',
            function ($scope, messageReplyService, HB_dialog, $state, classInformationServices, HB_notification) {

                //var str='11111';
                //var str2='1jjj';
                //console.log(typeof Number(str));
                //console.log(isNaN(Number(str2)));

                $scope.$watch('model.userId', function (newVal) {
                    if (newVal) {
                        $scope.model.mark = true;
                        classInformationServices.doview($state.current.name);
                        $scope.userSay.firstEnter = true;

                        $scope.userSay.userIds = [newVal];

                        if ($scope.model.classTab === 6) {
                            findProblemCategoryList();
                            findLeaveMessagePage();
                        }

                    }
                });

                $scope.kendoPlus = {
                    timeModel: null,
                    timeOptions: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd'// HH:mm:00
                        //min: new Date()
                    },

                    windowOptions: {
                        modal: true,
                        visible: false,
                        resizable: false,
                        draggable: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                };

                $scope.userSay = {

                    firstEnter: true,
                    totalPagesize: 0,
                    currentPage: 1,//当前第几页
                    total: 0,//数据总条数 这个去后端拿
                    maxSize: 5,//最多可见页数按钮5个
                    itemsPerPage: 10,//每页显示1条 默认10条

                    messageType: -1,//1 回复 2 未回复
                    //account:'',
                    userIds: [],
                    categoryId: '',
                    messageTimeStart: '',
                    messageTimeEnd: '',

                    categoryList: [],
                    messageList: [],

                    detailMessage: {},

                    hasNodata: true,

                    showMessage: 'all'
                };

                $scope.events = {

                    clickReplyBtn: function (item, replyContent, type) {
                        $scope.saveOrUpdate = type;
                        item.editing = true;
                        $scope.copyMessage = angular.copy(replyContent);
                    },

                    saveMessage: function (messageId, topicCategoryId, replyContent, replyId) {

                        if (validateIsNull(replyContent)) {
                            HB_dialog.warning('提示', '请输入留言后再保存');
                            return false;
                        }

                        var params = {};
                        if ($scope.saveOrUpdate === 'saveReply') {
                            params = {
                                leaveMessageId: messageId,
                                categoryId: topicCategoryId,
                                content: replyContent
                            };
                        } else {
                            params = {
                                replyId: replyId,
                                categoryId: topicCategoryId,
                                content: replyContent
                            };
                        }

                        $scope.saveSubmitAble = true;
                        messageReplyService[$scope.saveOrUpdate](params).then(function (data) {
                            $scope.saveSubmitAble = false;
                            if (data.status) {
                                HB_dialog.success('提示', '回复成功');
                                //$scope.detailMessageWindow.close();
                                resetSearchParams();
                                //item.editing=false;
                                findLeaveMessagePage();
                            } else {
                                HB_dialog.warning('提示', data.info);
                            }
                        });

                        //messageReplyService.saveReply
                    },

                    cacelSaveMessage: function (item, type) {
                        item.editing = false;
                        //if(type==='main'){
                        //item.replyContent=$scope.copyMessage;
                        //}
                        //if(type==='dialog'){
                        item.replies[0].content = $scope.copyMessage;
                        //}
                    },

                    findLeaveMessageList: function (item) {
                        $scope.topicCreatorName = item.topicCreatorName;
                        $scope.itemMessageCount = item.count;
                        $scope.detailMessageWindow.center().open();
                        messageReplyService.findLeaveMessageList({
                            topicId: item.id
                        }).then(function (data) {
                            if (data.status) {
                                $scope.userSay.detailMessage = data.info;
                                angular.forEach($scope.userSay.detailMessage.leaveMessages, function (dataItem) {
                                    dataItem.editing = false;
                                });
                            }
                        });
                    },

                    closeKendoWindow: function () {
                        $scope.detailMessageWindow.close();
                    },

                    searchLeaveMessagePage: function () {
                        $scope.userSay.currentPage = 1;
                        findLeaveMessagePage();
                    },

                    findLeaveMessagePage: function () {
                        findLeaveMessagePage();
                    },

                    setFinish: function (item) {
                        //HB_dialog.warning('提示','请输入留言后再保存');
                        HB_notification.confirm('提示', '是否将该留言状态标记为完结状态！', function (dialog) {
                            return messageReplyService.setFinish({topicId: item.id}).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    HB_dialog.success('提示', data.info);
                                    //resetSearchParams ();
                                    findLeaveMessagePage();
                                }
                            });
                        });
                    },

                    showThreeMessage: function (arr) {
                        $scope.userSay.showMessage = 'all';
                        angular.forEach(arr, function (item, index) {
                            if (index > 2) {
                                item.lessThanFour = false;
                            }
                        });
                    },

                    showAllMessage: function (arr) {
                        $scope.userSay.showMessage = 'three';
                        angular.forEach(arr, function (item) {
                            item.lessThanFour = true;
                        });
                    }
                };

                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }

                //获取留言列表
                function findLeaveMessagePage () {
                    $scope.searchSubmitAble = true;
                    messageReplyService.findLeaveMessagePage({
                        messageType: $scope.userSay.messageType,
                        userIds: $scope.userSay.userIds,
                        //account: $scope.model.account,
                        categoryId: $scope.userSay.categoryId,
                        messageTimeStart: $scope.userSay.messageTimeStart,
                        messageTimeEnd: $scope.userSay.messageTimeEnd,
                        'page.pageNo': $scope.userSay.currentPage,
                        'page.pageSize': $scope.userSay.itemsPerPage
                    }).then(function (data) {
                        $scope.searchSubmitAble = false;
                        if (data.status) {
                            $scope.userSay.messageList = data.info;
                            $scope.userSay.total = data.totalSize;
                            $scope.userSay.totalPagesize = data.totalPageSize;

                            if ($scope.userSay.firstEnter === true) {
                                if (data.info.length <= 0) {
                                    $scope.initNodata = '0';
                                } else {
                                    $scope.initNodata = '1';
                                }
                            }

                            if (data.info.length <= 0) {//model.noData
                                $scope.noData = '0';
                            } else {
                                $scope.noData = '1';
                            }

                            angular.forEach($scope.userSay.messageList, function (item) {
                                angular.forEach(item.leaveMessages, function (subItem, index) {
                                    subItem.editing = false;
                                    if (index > 2) {
                                        subItem.lessThanFour = false;
                                    } else {
                                        subItem.lessThanFour = true;
                                    }
                                });
                                //计算离今天过了几天
                                item.cha = TimeCha(item.messageCreateTime);
                            });

                            $scope.userSay.firstEnter = false;
                            console.log($scope.userSay.messageList);
                        }
                    });
                }

                function resetSearchParams () {
                    $scope.userSay.messageType = -1;
                    //$scope.model.account='';
                    $scope.userSay.categoryId = '';
                    $scope.userSay.messageTimeStart = '';
                    $scope.userSay.messageTimeEnd = '';
                    //$scope.userSay.currentPage=1;
                }

                //时间字符串转毫秒
                function parseTimeStrToLong (str) {
                    return kendo.parseDate(str).getTime();
                }

                function TimeCha (odStr) {
                    var nd = new Date().getTime(),
                        od = parseTimeStrToLong(odStr),
                        cha = null,
                        chaDay = null;
                    cha = nd - od;
                    chaDay = cha / 86400000;

                    return parseInt(chaDay);
                }

                //console.log(TimeCha('2016-11-18 15:39:27'));

                //获取问题类别
                function findProblemCategoryList () {
                    messageReplyService.findProblemCategoryList({
                        parentId: -1
                    }).then(function (data) {
                        if (data.status) {
                            $scope.userSay.categoryList = data.info;
                            $scope.userSay.categoryList.unshift({
                                name: '留言类型',
                                id: ''
                            });
                            console.log($scope.userSay.categoryList);
                        }
                    });
                }

            }]
    };
});