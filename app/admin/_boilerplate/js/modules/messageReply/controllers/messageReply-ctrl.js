define(function (messageReply) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'messageReplyService', 'HB_dialog', 'HB_notification', function ($scope, messageReplyService, HB_dialog, HB_notification) {


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

            $scope.model = {
                firstEnter: true,

                totalPagesize: 0,
                currentPage: 1,//当前第几页
                total: 0,//数据总条数 这个去后端拿
                maxSize: 5,//最多可见页数按钮5个
                itemsPerPage: 10,//每页显示1条 默认10条

                messageType: -1,//1 回复 2 未回复
                account: '',
                //userId:'',
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
                    console.log(params);

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
                            $scope.model.detailMessage = data.info;
                            angular.forEach($scope.model.detailMessage.leaveMessages, function (dataItem) {
                                dataItem.editing = false;
                            });
                        }
                    });
                },

                closeKendoWindow: function () {
                    $scope.detailMessageWindow.close();
                },

                searchLeaveMessagePage: function () {
                    if (validataIdcard($scope.model.account)) {
                        //alert('身份证必须是大于4位的数字');
                        HB_dialog.warning('提示', '如果账号为数字，至少输入4位才能进行查询！');
                        return false;
                    }
                    $scope.model.currentPage = 1;
                    findLeaveMessagePage();
                },

                findLeaveMessagePage: function () {
                    findLeaveMessagePage();
                },

                setFinish: function (item) {
                    HB_notification.confirm('是否将该留言状态标记为完结状态！', function (dialog) {
                        return messageReplyService.setFinish({topicId: item.id}).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                HB_notification.showTip(data.info, 'success');
                                //resetSearchParams ();
                                findLeaveMessagePage();
                            }
                        });
                    });
                },

                showThreeMessage: function (arr) {
                    $scope.model.showMessage = 'all';
                    angular.forEach(arr, function (item, index) {
                        if (index > 2) {
                            item.lessThanFour = false;
                        }
                    });
                },

                showAllMessage: function (arr) {
                    $scope.model.showMessage = 'three';
                    angular.forEach(arr, function (item) {
                        item.lessThanFour = true;
                    });
                }
            };

            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            //身份证必须大于4位的数字
            function validataIdcard (str) {

                if (!validateIsNull(str)) {
                    if (!isNaN(Number(str)) && str.length < 5) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

            function resetSearchParams (type) {
                $scope.model.messageType = -1;
                $scope.model.account = '';
                $scope.model.categoryId = '';
                $scope.model.messageTimeStart = '';
                $scope.model.messageTimeEnd = '';
                //$scope.model.currentPage=1;
            }

            //获取留言列表
            function findLeaveMessagePage () {
                $scope.searchSubmitAble = true;
                messageReplyService.findLeaveMessagePage({
                    messageType: $scope.model.messageType,
                    account: $scope.model.account,
                    categoryId: $scope.model.categoryId,
                    messageTimeStart: $scope.model.messageTimeStart,
                    messageTimeEnd: $scope.model.messageTimeEnd,
                    'page.pageNo': $scope.model.currentPage,
                    'page.pageSize': $scope.model.itemsPerPage
                }).then(function (data) {
                    $scope.searchSubmitAble = false;
                    if (data.status) {
                        $scope.model.messageList = data.info;
                        $scope.model.total = data.totalSize;
                        $scope.model.totalPagesize = data.totalPageSize;
                        //判断刚进页面的时候是否有数据
                        if ($scope.model.firstEnter === true) {
                            if (data.info.length <= 0) {
                                $scope.initNodata = '0';
                            } else {
                                $scope.initNodata = '1';
                            }
                        }

                        if (data.info.length <= 0) {//model.noData
                            $scope.noData = true;
                        } else {
                            $scope.noData = false;
                        }

                        angular.forEach($scope.model.messageList, function (item) {
                            angular.forEach(item.leaveMessages, function (subItem, index) {
                                subItem.editing = false;
                                if (index > 2) {
                                    subItem.lessThanFour = false;
                                } else {
                                    subItem.lessThanFour = true;
                                }
                            });
                        });
                        console.log($scope.model.messageList);
                        $scope.model.firstEnter = false;
                    }
                });
            }

            findLeaveMessagePage();

            //获取问题类别
            messageReplyService.findProblemCategoryList({
                parentId: -1
            }).then(function (data) {
                if (data.status) {
                    $scope.model.categoryList = data.info;
                    $scope.model.categoryList.unshift({
                        name: '留言类型',
                        id: ''
                    });
                    console.log($scope.model.categoryList);
                }
            });

        }]
    };
});