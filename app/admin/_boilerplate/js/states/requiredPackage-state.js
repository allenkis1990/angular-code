define(['angularUiRouter', '@systemUrl@/js/modules/requiredPackage/main'], function () {
        'use strict';
        return angular
            .module('app.states.requiredPackage', ['ui.router']).config(
                function ($stateProvider) {
                    $stateProvider
                        .state('states.requiredPackage', {
                            url: '/requiredPackage',
                            sticky: true,
                            views: {
                                'states.requiredPackage@': {
                                    templateUrl: '@systemUrl@/views/requiredPackage/required-package-index.html',
                                    controller: 'app.requiredPackage.index'
                                }
                            }
                        })
                        .state('states.requiredPackage.editNew', {
                            url: '/editNew',
                            templateUrl: '@systemUrl@/views/requiredPackage/required-package-edit-new.html',
                            controller: 'app.requiredPackage.editNew'
                        })
                        .state('states.requiredPackage.view', {
                            url: '/view/:packageId',
                            templateUrl: '@systemUrl@/views/requiredPackage/required-package-view.html',
                            controller: 'app.requiredPackage.view'
                        })
                        .state('states.requiredPackage.edit', {
                            url: '/edit/:packageId',
                            templateUrl: '@systemUrl@/views/requiredPackage/required-package-edit.html',
                            controller: 'app.requiredPackage.edit'
                        })
                        .state('states.requiredPackage.count', {
                            url: '/count/:packageId',
                            templateUrl: '@systemUrl@/views/requiredPackage/required-package-count.html',
                            controller: 'app.requiredPackage.count'
                        });
                });
    }
);
