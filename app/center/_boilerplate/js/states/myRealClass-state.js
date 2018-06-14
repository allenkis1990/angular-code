define(['@systemUrl@/js/modules/myRealClass/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.myRealClass', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.myRealClass', {
            url: '/myRealClass/:id',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myRealClass/index.html',
                    controller: 'app.center.states.myRealClass.indexCtrl'
                }
            }
        }).state('states.myRealClass.chooseLesson', {
            url: '/chooseLesson/:id',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myRealClass/chooseLesson.html',
                    controller: 'app.center.states.chooseLesson.indexCtrl'
                }
            }
        }).state('states.myRealClass.lessonPlay', {
            url: '/lessonPlay/:id',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myRealClass/lessonPlay.html',
                    controller: 'app.center.states.lessonPlay.indexCtrl'
                }
            }
        }).state('states.myRealClass.textPaperViews', {
            url: '/textPaperViews/:id',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myRealClass/textPaperViews.html',
                    controller: 'app.center.states.textPaperViews.indexCtrl'
                }
            }
        }).state('states.myRealClass.intrestCourse', {
            url: '/intrestCourse/:classId/:coursePoolId/:haveInterest',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myRealClass/intrestCourse.html',
                    controller: 'app.center.states.intrestCourse.indexCtrl'
                }
            }
        }).state('states.myRealClass.examResult', {
            url: '/examResult/:classId',
            views: {
                'topView@': {
                    templateUrl: '@systemUrl@/views/myRealClass/examResultTop.html'
                },
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myRealClass/examResultIndex.html',
                    controller: ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

                        $scope.examCode = '';
                        $scope.pending = true;
                        $http.get('/web/front/myClass/getExamResultInfo?classId=' + $stateParams.classId).success(function (data) {
                            $scope.pending = false;
                            $scope.examCode = data.code;
                            $scope.examResult = data.info;
                            if (data.status) {
                                $scope.examResult = data.info;
                            }
                        });
                    }]
                }
            }
        });
        /*.state('states.myRealClass.certificateApplication', {
                    url: '/certificateApplication',
                    resolve: {
                        setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUserInfo')
                    },
                    views: {
                        'contentView@': {
                            templateUrl: '@systemUrl@/views/myRealClass/certificateApplicationIndex.html',
                            controller: 'app.center.certificateApplicationCtrl'
                        }
                    }
                })*/
    }]);
});