define(['@systemUrl@/js/modules/classInformation/main',
    '@systemUrl@/js/modules/classInformation/classInfo/main',
    '@systemUrl@/js/modules/classInformation/userInfo/main',
    '@systemUrl@/js/modules/classInformation/orderInfo/main',
    '@systemUrl@/js/modules/classInformation/invoiceInfo/main',
    '@systemUrl@/js/modules/classInformation/learningProcess/main',
    '@systemUrl@/js/modules/classInformation/questionAsk/main',
    '@systemUrl@/js/modules/classInformation/ueserSay/main',
    '@systemUrl@/js/modules/classInformation/distributionQuery/main',
    '@systemUrl@/js/modules/classInformation/changeRecord/main',
    '@systemUrl@/js/modules/classInformation/refundOrder/main',
    '@systemUrl@/js/modules/classInformation/changeCourseRecord/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classInformation', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.classInformation', {
            url: '/classInformation',
            sticky: true,
            views: {
                'states.classInformation@': {
                    templateUrl: '@systemUrl@/views/classInformation/index.html',
                    controller: 'app.admin.states.classInformation.indexCtrl'
                }
            }
        }).state('states.classInformation.classInfo', {
            url: '/classInfo',
            sticky: true,
            views: {
                'states.classInformation.classInfo': {
                    templateUrl: '@systemUrl@/views/classInformation/classInfo/index.html',
                    controller: 'app.admin.states.classInfo.indexCtrl'
                }
            }
        }).state('states.classInformation.userInfo', {
            url: '/userInfo',
            sticky: true,
            views: {
                'states.classInformation.userInfo': {
                    templateUrl: '@systemUrl@/views/classInformation/userInfo/index.html',
                    controller: 'app.admin.states.userInfo.indexCtrl'
                }
            }
        }).state('states.classInformation.orderInfo', {
            url: '/orderInfo',
            sticky: true,
            views: {
                'states.classInformation.orderInfo': {
                    templateUrl: '@systemUrl@/views/classInformation/orderInfo/index.html',
                    controller: 'app.admin.states.orderInfo.indexCtrl'
                }
            }
        }).state('states.classInformation.invoiceInfo', {
            url: '/invoiceInfo',
            sticky: true,
            views: {
                'states.classInformation.invoiceInfo': {
                    templateUrl: '@systemUrl@/views/classInformation/invoiceInfo/index.html',
                    controller: 'app.admin.states.invoiceInfo.indexCtrl'
                }
            }
        }).state('states.classInformation.learningProcess', {
            url: '/learningProcess',
            sticky: true,
            views: {
                'states.classInformation.learningProcess': {
                    templateUrl: '@systemUrl@/views/classInformation/learningProcess/index.html',
                    controller: 'app.admin.states.learningProcess.indexCtrl'
                }
            }
        }).state('states.classInformation.questionAsk', {
            url: '/questionAsk',
            sticky: true,
            views: {
                'states.classInformation.questionAsk': {
                    templateUrl: '@systemUrl@/views/classInformation/questionAsk/index.html',
                    controller: 'app.admin.states.questionAsk.indexCtrl'
                }
            }
        }).state('states.classInformation.ueserSay', {
            url: '/ueserSay',
            sticky: true,
            views: {
                'states.classInformation.ueserSay': {
                    templateUrl: '@systemUrl@/views/classInformation/ueserSay/index.html',
                    controller: 'app.admin.states.ueserSay.indexCtrl'
                }
            }
        }).state('states.classInformation.distributionQuery', {
            url: '/distributionQuery',
            sticky: true,
            views: {
                'states.classInformation.distributionQuery': {
                    templateUrl: '@systemUrl@/views/classInformation/distributionQuery/index.html',
                    controller: 'app.admin.states.distributionQuery.indexCtrl'
                }
            }
        }).state('states.classInformation.changeRecord', {
            url: '/changeRecord',
            sticky: true,
            views: {
                'states.classInformation.changeRecord': {
                    templateUrl: '@systemUrl@/views/classInformation/changeRecord/index.html',
                    controller: 'app.admin.states.changeRecord.indexCtrl'
                }
            }
        }).state('states.classInformation.refundOrder', {
            url: '/refundOrder',
            sticky: true,
            views: {
                'states.classInformation.refundOrder': {
                    templateUrl: '@systemUrl@/views/classInformation/refundOrder/index.html',
                    controller: 'app.admin.states.refundOrder.indexCtrl'
                }
            }
        }).state('states.classInformation.changeCourseRecord', {
            url: '/changeCourseRecord',
            sticky: true,
            views: {
                'states.classInformation.changeCourseRecord': {
                    templateUrl: '@systemUrl@/views/classInformation/changeCourseRecord/index.html',
                    controller: 'app.admin.states.changeCourseRecord.indexCtrl'
                }
            }
        });
    }]);
});