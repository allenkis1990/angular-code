define(['angularUiRouter'], function () {
    'use strict'
    return angular.module('app.states.home', [
        'ui.router'
    ]).config(['$stateProvider',
        function ($stateProvider) {
            var loadingDomStr = '<div class="menu-loading-mark" style="z-index: 55555;"> <div class="menu-loading-mark-bg"></div>' +
                '<img class="menu-loading-mark-img" ng-src="@systemUrl@/images/loading.gif" alt=""> </div>'
            angular.element('body').append(loadingDomStr)

            $stateProvider
                .state('states.home', {
                    url: '/home',
                    sticky: true,
                    views: {
                        'states.home@': {
                            templateUrl: '@systemUrl@/views/home/managerIndex.html',
                            controller: 'app.home.managerIndexCtrl'
                        }
                    }
                })

                .state('states.superAdminHome', {
                    url: '/beautifulHome',
                    sticky: true,
                    views: {
                        'states.superAdminHome@': {
                            templateUrl: '@systemUrl@/views/home/beautifulHome.html'
                        }
                    }
                })
                .state('states.home.view', {
                    url: '/view/:noticeId',
                    templateUrl: '@systemUrl@/views/home/viewInfo.html',
                    controller: 'app.home.managerIndexViewCtrl'
                })
                .state('states.home.courseInfoView', {
                    url: '/courseInfoView/:courseId',
                    templateUrl: '@systemUrl@/views/home/courseInfo-view.html',
                    controller: 'app.home.courseInfoViewCtrl'
                })
        }])
})
