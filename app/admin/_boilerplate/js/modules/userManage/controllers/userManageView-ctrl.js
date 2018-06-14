define(function () {
    'use strict';
    return ['$scope', 'userManageService', '$stateParams', '$state', function ($scope, userManageService, $stateParams, $state) {

        $scope.model = {
            configState: 'course',
            userMessage: {},
            trainClassMessage: {},
            trainCourseMessage: {}

        };

        $scope.events = {
            tabConfig: function (state) {
                $scope.model.configState = state;
                if (state == 'course') {
                    findUserTrainCourseMessage();
                }
                if (state == 'class') {
                    findUserTrainClassMessage();
                }
            },

            /**
             * 返回学员管理界面
             * @param e
             */
            goUserManage: function (e) {
                e.preventDefault();
                $state.go('states.userManage');
            }

        };


        /**
         * 获取学员基本信息
         */
        function findUserMessage () {
            userManageService.getUserInfoByUserId($stateParams.userId).then(function (data) {
                if (data.status) {
                    $scope.model.userMessage = data.info;
                } else {
                    $scope.globle.showTip(data.info, 'error');
                }

            });
        }

        /**
         * 获取学员培训课程信息
         */
        function findUserTrainCourseMessage () {
            userManageService.getTrainCourseInfoByUserId({userId: $stateParams.userId}).then(function (data) {
                if (data.status) {
                    $scope.model.trainCourseMessage = data.info;
                } else {
                    $scope.globle.showTip(data.info, 'error');
                }

            });
        }

        /**
         * 获取学员培训班级信息
         */
        function findUserTrainClassMessage () {
            userManageService.getTrainClassInfoByUserId($stateParams.userId).then(function (data) {
                if (data.status) {
                    $scope.model.trainClassMessage = data.info;
                } else {
                    $scope.globle.showTip(data.info, 'error');
                }

            });
        }

        /*        findUserTrainClassMessage();*/
        /**
         * 初始化
         */
        function init () {
            findUserMessage();
            findUserTrainCourseMessage();
            /*       findUserTrainClassMessage()*/
            ;
        }

        init();
    }];

});
