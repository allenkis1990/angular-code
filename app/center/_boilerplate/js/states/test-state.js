define(['angularUiRouter'], function () {
    'use strict';
    return angular.module('app.center.states.test', ['ui.router'])
        .config(function ($stateProvider) {
            $stateProvider.state('states.test', {
                url: '/test',
                views: {
                    'contentView@': {
                        templateUrl: '@systemUrl@/views/test/index.html',
                        controller: ['$scope', '$dialog', function ($scope, $dialog) {
                            $scope.alert = function () {
                                $dialog.alert({
                                    visible: true,
                                    content: '去你的把'
                                });
                            };
                            $scope.confirm = function () {
                                $dialog.confirm({
                                    title: 'sdfsd',
                                    visible: true,
                                    content: '去你的把'
                                });
                            };
                            $scope.content = function () {
                                $dialog.contentDialog({
                                    title: '加载',
                                    visible: true,
                                    modal: true,
                                    contentUrl: '@systemUrl@/views/test/dialog.html'
                                }, $scope);
                            };

                            $scope.contentSuccess = function () {
                                $dialog.contentDialog({
                                    visible: true,
                                    time: 3,
                                    contentUrl: '@systemUrl@/views/test/success.html'
                                }, $scope);
                            };
                        }]
                    }
                }
            });
        });
});
