define(
    function () {
        'use strict';
        return ['$scope', 'personCenterService', '$timeout', '$rootScope',
            function ($scope, personCenterService, $timeout, $rootScope) {

                $scope.model = {
                    uploadHead: false,
                    person: {
                        id: null,
                        name: null,
                        email: null,
                        unit: null,
                        organization: null,
                        image: null,
                        sendEmail: false,
                        sendMessage: false
                    }
                };

                $scope.events = {
                    personInfo: function () {
                        personCenterService.personInfo().then(function (data) {
                            $scope.model.person = data.info;
                        });
                    },
                    updatePwd: function () {
                        personCenterService.update($scope.model.person).then(function (data) {
                            if (data.status) {
                                $scope.globle.alert('提示', '修改密码成功');
                                $scope.model.person.oldPassword = '';
                                $scope.model.person.password = '';
                                $scope.model.person.confirmPassword = '';
                            } else {
                                if (data.info == 'error old password') {
                                    $scope.globle.alert('提示', '旧密码输入错误！');
                                } else {
                                    $scope.globle.showTip('内置对象，不能修改', 'error');
                                }
                            }
                        });
                    },
                    cannel: function () {
                        $scope.model.person.oldPassword = null;
                        $scope.model.person.password = null;
                        $scope.model.person.confirmPassword = null;
                    },
                    viewUploadImg: function () {
                        $scope.node.windows.uploadImageWindow.center().open();
                    },
                    close: function () {
                        $scope.node.windows.uploadImageWindow.close();
                    }
                };

                $scope.events.personInfo();

                $scope.$watch('model.uploadHeadValue', function (newValue, oldValue) {
                    if ($scope.model.uploadHeadValue) {
                        if (newValue) {
                            if (newValue.convertResult && angular.isArray(newValue.convertResult)) {

                                $scope.model.person.image = newValue.convertResult[0].url;
                            } else {
                                $scope.model.person.image = newValue.newPath;
                            }
                        } else {
                            if (oldValue.convertResult && angular.isArray(oldValue.convertResult)) {

                                $scope.model.person.image = oldValue.convertResult[0].url;
                            } else {
                                $scope.model.person.image = oldValue.newPath;
                            }
                        }
                        personCenterService.update($scope.model.person).then(function (data) {
                            if (data.status) {
                                $rootScope.$$userInfo.photo = $scope.model.person.image;
                                $scope.globle.showTip('修改头像成功', 'success');
                            } else {
                                $scope.model.uploadHeadValue = null;
                                $scope.globle.showTip('修改头像失败', 'error');
                            }
                        });
                    }
                });

                $scope.ui = {
                    windows: {
                        uploadImageWindow: {
                            modal: true,
                            content: '@systemUrl@/views/personCenter/personCenterImage.html',
                            visible: false,
                            width: 700,
                            height: 586,
                            title: false,
                            open: function () {
                                //console.log(this);
                                this.center();
                            }
                        }
                    }
                };

            }];
    });
