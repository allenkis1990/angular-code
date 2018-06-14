define(function () {
    'use strict';
    return ['$scope',
        'noticeManageService',
        '$stateParams',
        function ($scope, noticeManageService, $stateParams) {

            $scope.model = {
                //保存查看公告的信息
                noticeViewInfo: {
                    title: '',//公告标题
                    publishPersonName: '',//发布人
                    publishTime: '',//公告发布时间
                    totalPersonCount: '',//发布总人数
                    readCount: '',//被阅次数
                    content: '',//公告内容
                    publishObjectName: ''//公告发布对象名称
                }
            };

            //查看详情
            noticeManageService.findById({id: $stateParams.noticeId}).then(function (data) {
                if (data.status) {
                    var info = data.info[0];
                    $scope.model.noticeViewInfo = {
                        title: info.title,//公告标题
                        publishPersonName: info.publishPersonName,//发布人
                        publishTime: info.publishTime,//公告发布时间
                        totalPersonCount: info.totalPersonCount,//发布总人数
                        readCount: info.readCount,//被阅次数
                        content: info.content,//公告内容
                        publishObjectName: info.publishObjectName//公告发布对象名称
                    };

                } else {
                    $scope.globle.showTip('获取公告信息出错！', 'error');
                }
            });
        }];
});
