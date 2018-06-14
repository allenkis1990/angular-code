define(function () {
    'use strict';
    return ['$scope', 'forgetService', '$dialog', '$state', '$interval',
        function ($scope, forgetService, $dialog, $state, $interval) {
            $scope.model = {
                successShow: false,
                successTime: 5,
                lwhLoading: false,
                registStep: 'one',
                showSafeProblem: false
            };

            var obj = {
                regSick1: /^[0-9a-zA-Z]{6}$/,
                regSick2: /^[0-9]*$/,
                regSick3: /^[a-z]*$/,
                regSick4: /^[A-Z]*$/,

                regMiddle: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/,

                regStrong: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/
            };
            $scope.passwordLevel = '';
            $scope.$watch('model.password', function (newVal) {
                if (newVal) {
                    if (obj.regSick1.test(newVal) || obj.regSick2.test(newVal) || obj.regSick3.test(newVal) || obj.regSick4.test(newVal)) {
                        $scope.passwordLevel = 'sick';
                    }

                    if (obj.regMiddle.test(newVal)) {
                        $scope.passwordLevel = 'middle';
                    }

                    if (obj.regStrong.test(newVal)) {
                        $scope.passwordLevel = 'strong';
                    }
                }
            });
            $scope.events = {
                /* nextStep:function(){
 
                 },*/
                submit: function () {
                    /* changePassword*/
                    forgetService.changePassword({
                        loginInput: $scope.model.identy,
                        password: $scope.model.password
                    }).then(function (data) {
                        console.log(data);
                        if (data.info === true) {
                            $scope.model.registStep = 'three';
                        } else {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '密码修改失败！'
                                /*  content: data.info*/
                            });
                        }
                    });

                    /* $scope.model.registStep='three';*/
                },
                getCurrentStyle: function () {
                    if ($scope.model.registStep === 'one') {
                        return {width: 25 + '%'};
                    }
                    if ($scope.model.registStep === 'two') {
                        return {width: 75 + '%'};
                    }
                    if ($scope.model.registStep === 'three') {
                        return {width: 100 + '%'};
                    }
                },
                nextStep: function (e) {
                    e.preventDefault();
                    $scope.model.lwhLoading = true;
                    //var callBackUrl=encodeURIComponent($scope.model.user.name);
                    forgetService.toFindPassword({
                        field: $scope.model.identy,
                        name: $scope.model.name
                    }).then(function (data) {
                        $scope.model.lwhLoading = false;
                        if (data.info === true) {
                            $scope.model.registStep = 'two';
                        } else {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: '您所输入的身份证号与姓名不匹配！'
                                /*  content: data.info*/
                            });
                        }


                    });
                },
                goHome: function (e) {
                    e.preventDefault();
                    $state.go('states.accountant');
                }

            };

            $scope.$on('$destroy', function () {
                $interval.cancel($scope.setTime);
            });

        }];
});