define(['angularUiRouter', '@systemUrl@/js/modules/questionManage/main'], function () {
    'use strict';
    return angular.module('app.states.questionManage', ['ui.router'])
        .config(['$stateProvider', 'HB_WebUploaderProvider',
            function ($stateProvider, HB_WebUploaderProvider) {
                $stateProvider.state('states.questionManage', {
                    url: '/questionManage/:id/:name',
                    resolve: {
                        setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                    },
                    sticky: true,
                    views: {
                        'states.questionManage@': {
                            templateUrl: '@systemUrl@/views/exam/question-index.html',
                            controller: 'app.questionManage.questionCtrl'
                        }
                    }
                }).state('states.questionManage.add', {
                    url: '/add',
                    templateUrl: '@systemUrl@/views/exam/question-add.html',
                    controller: 'app.questionManage.addCtrl'
                })
                    .state('states.questionManage.edit', {
                        url: '/edit/:questionId/:questionType/:courseId/:courseName',
                        templateUrl: '@systemUrl@/views/exam/question-edit.html',
                        controller: 'app.questionManage.editCtrl'
                    });
            }]);
});
