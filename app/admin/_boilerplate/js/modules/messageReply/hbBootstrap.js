/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/28
 * 时间: 13:03
 *
 */
define(['angular'], function (angular) {
    'use strict';
    /*
     * angular-ui-bootstrap
     * http://angular-ui.github.io/bootstrap/

     * Version: 0.12.0 - 2014-11-16
     * License: MIT
     */
    angular.module('ui.bootstrap', [
        'ui.bootstrap.tpls',
        'ui.bootstrap.transition',
        'ui.bootstrap.pagination'
    ]);

    angular.module('ui.bootstrap.tpls', ['template/pagination/pager.html', 'template/pagination/pagination.html']);

    angular.module('ui.bootstrap.transition', [])

    /**
     * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they
     * complete.
     * @param  {DOMElement} element  The DOMElement that will be animated.
     * @param  {string|object|function} trigger  The thing that will cause the transition to start:
     *   - As a string, it represents the css class to be added to the element.
     *   - As an object, it represents a hash of style attributes to be applied to the element.
     *   - As a function, it represents a function to be called that will cause the transition to occur.
     * @return {Promise}  A promise that is resolved when the transition finishes.
     */
        .factory('$transition', ['$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

            var $transition = function (element, trigger, options) {
                options = options || {};
                var deferred = $q.defer();
                var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

                var transitionEndHandler = function (event) {
                    $rootScope.$apply(function () {
                        element.unbind(endEventName, transitionEndHandler);
                        deferred.resolve(element);
                    });
                };

                if (endEventName) {
                    element.bind(endEventName, transitionEndHandler);
                }

                // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
                $timeout(function () {
                    if (angular.isString(trigger)) {
                        element.addClass(trigger);
                    } else if (angular.isFunction(trigger)) {
                        trigger(element);
                    } else if (angular.isObject(trigger)) {
                        element.css(trigger);
                    }
                    //If browser does not support transitions, instantly resolve
                    if (!endEventName) {
                        deferred.resolve(element);
                    }
                });

                // Add our custom cancel function to the promise that is returned
                // We can call this if we are about to run a new transition, which we know will prevent this transition
                // from ending, i.e. it will therefore never raise a transitionEnd event for that transition
                deferred.promise.cancel = function () {
                    if (endEventName) {
                        element.unbind(endEventName, transitionEndHandler);
                    }
                    deferred.reject('Transition cancelled');
                };

                return deferred.promise;
            };

            // Work out the name of the transitionEnd event
            var transElement = document.createElement('trans');
            var transitionEndEventNames = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'transition': 'transitionend'
            };
            var animationEndEventNames = {
                'WebkitTransition': 'webkitAnimationEnd',
                'MozTransition': 'animationend',
                'OTransition': 'oAnimationEnd',
                'transition': 'animationend'
            };

            function findEndEventName (endEventNames) {
                for (var name in endEventNames) {
                    if (transElement.style[name] !== undefined) {
                        return endEventNames[name];
                    }
                }
            }

            $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
            $transition.animationEndEventName = findEndEventName(animationEndEventNames);
            return $transition;
        }]);


    angular.module('ui.bootstrap.pagination', [])

        .controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
            var self = this,
                ngModelCtrl = {$setViewValue: angular.noop}, // nullModelCtrl
                setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

            this.init = function (ngModelCtrl_, config) {
                ngModelCtrl = ngModelCtrl_;
                this.config = config;

                ngModelCtrl.$render = function () {
                    self.render();
                };

                if ($attrs.itemsPerPage) {
                    $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
                        self.itemsPerPage = parseInt(value, 10);
                        $scope.totalPages = self.calculateTotalPages();
                    });
                } else {
                    this.itemsPerPage = config.itemsPerPage;
                }
            };

            this.calculateTotalPages = function () {
                var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
                return Math.max(totalPages || 0, 1);
            };

            this.render = function () {
                $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
            };

            $scope.selectPage = function (page) {
                if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
                    ngModelCtrl.$setViewValue(page);
                    ngModelCtrl.$render();
                }
            };

            $scope.getText = function (key) {
                return $scope[key + 'Text'] || self.config[key + 'Text'];
            };
            $scope.noPrevious = function () {
                return $scope.page === 1;
            };
            $scope.noNext = function () {
                return $scope.page === $scope.totalPages;
            };

            $scope.$watch('totalItems', function () {
                $scope.totalPages = self.calculateTotalPages();
            });

            $scope.$watch('totalPages', function (value) {
                setNumPages($scope.$parent, value); // Readonly variable

                if ($scope.page > value) {
                    $scope.selectPage(value);
                } else {
                    ngModelCtrl.$render();
                }
            });
        }])

        .constant('paginationConfig', {
            itemsPerPage: 10,
            boundaryLinks: false,
            directionLinks: true,
            firstText: 'First',
            previousText: 'Previous',
            nextText: 'Next',
            lastText: 'Last',
            rotate: true
        })

        .directive('pagination', ['$parse', 'paginationConfig', function ($parse, paginationConfig) {
            return {
                restrict: 'EA',
                scope: {
                    currentPage: '=',
                    totalPagesize: '=',
                    totalItems: '=',
                    firstText: '@',
                    previousText: '@',
                    nextText: '@',
                    lastText: '@'
                },
                require: ['pagination', '?ngModel'],
                controller: 'PaginationController',
                templateUrl: 'template/pagination/pagination.html',
                replace: true,
                link: function (scope, element, attrs, ctrls) {
                    var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                    if (!ngModelCtrl) {
                        return; // do nothing if no ng-model
                    }

                    // Setup configuration parameters
                    var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
                        rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
                    scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
                    scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

                    paginationCtrl.init(ngModelCtrl, paginationConfig);

                    if (attrs.maxSize) {
                        scope.$parent.$watch($parse(attrs.maxSize), function (value) {
                            maxSize = parseInt(value, 10);
                            paginationCtrl.render();
                        });
                    }

                    // Create page object used in template
                    function makePage (number, text, isActive) {
                        return {
                            number: number,
                            text: text,
                            active: isActive
                        };
                    }

                    function getPages (currentPage, totalPages) {
                        var pages = [];

                        // Default page limits
                        var startPage = 1, endPage = totalPages;
                        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

                        // recompute if maxSize
                        if (isMaxSized) {
                            if (rotate) {
                                // Current page is displayed in the middle of the visible ones
                                startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                                endPage = startPage + maxSize - 1;

                                // Adjust if limit is exceeded
                                if (endPage > totalPages) {
                                    endPage = totalPages;
                                    startPage = endPage - maxSize + 1;
                                }
                            } else {
                                // Visible pages are paginated with maxSize
                                startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

                                // Adjust last page if limit is exceeded
                                endPage = Math.min(startPage + maxSize - 1, totalPages);
                            }
                        }

                        // Add page number links
                        for (var number = startPage; number <= endPage; number++) {
                            var page = makePage(number, number, number === currentPage);
                            pages.push(page);
                        }

                        // Add links to move between page sets
                        if (isMaxSized && !rotate) {
                            if (startPage > 1) {
                                var previousPageSet = makePage(startPage - 1, '...', false);
                                pages.unshift(previousPageSet);
                            }

                            if (endPage < totalPages) {
                                var nextPageSet = makePage(endPage + 1, '...', false);
                                pages.push(nextPageSet);
                            }
                        }

                        return pages;
                    }

                    var originalRender = paginationCtrl.render;
                    paginationCtrl.render = function () {
                        originalRender();
                        if (scope.page > 0 && scope.page <= scope.totalPages) {
                            scope.pages = getPages(scope.page, scope.totalPages);
                        }
                    };
                }
            };
        }])

        .constant('pagerConfig', {
            itemsPerPage: 10,
            previousText: '芦 Previous',
            nextText: 'Next 禄',
            align: true
        })

        .directive('pager', ['pagerConfig', function (pagerConfig) {
            return {
                restrict: 'EA',
                scope: {
                    totalItems: '=',
                    previousText: '@',
                    nextText: '@'
                },
                require: ['pager', '?ngModel'],
                controller: 'PaginationController',
                templateUrl: 'template/pagination/pager.html',
                replace: true,
                link: function (scope, element, attrs, ctrls) {
                    var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                    if (!ngModelCtrl) {
                        return; // do nothing if no ng-model
                    }

                    scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
                    paginationCtrl.init(ngModelCtrl, pagerConfig);
                }
            };
        }]);

    angular.module('ui.bootstrap.tpls', [
        'template/pagination/pager.html',
        'template/pagination/pagination.html']);


    angular.module('template/pagination/pager.html', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/pagination/pager.html',
            '<ul class="pager">\n' +
            '  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">b{{getText(\'previous\')}}</a></li>\n' +
            '  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">b{{getText(\'next\')}}</a></li>\n' +
            '</ul>');
    }]);

    angular.module('template/pagination/pagination.html', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/pagination/pagination.html',

            '<div class="pages fr">' +

            '<span class="page-info" style="margin-right:5px">第b{{currentPage}}/b{{totalPagesize}}页 总共b{{totalItems}}条</span>' +

            '<a href="javascript:void(0)" style="margin-right:5px" ng-click="selectPage(1)" class="a-1">首页</a>' +

            '<a href="javascript:void(0)" ng-click="selectPage(page - 1)" class="a-1">b{{getText(\'previous\')}}</a>' +

            '<a href="javascript:void(0)" ng-click="selectPage(page.number)"  ng-class="{current: page.active}"  ng-repeat="page in pages track by $index">b{{page.text}}</a>' +

            '<a href="javascript:void(0)" class="a-1" ng-click="selectPage(page + 1)" >b{{getText(\'next\')}}</a>' +

            '<a href="javascript:void(0)" style="margin-left:5px" ng-click="selectPage(totalPages)" class="a-1">末页</a>' +

            '</div>');


        /*<div class="pages fr">

         <a href="#" class="a-1">首页</a>
         <a href="#" class="a-1">上一页</a>
         <a class="current" href="#">1</a>

         <a href="#" class="a-1">下一页</a>
         <a href="#" class="a-1">尾页</a>
         </div>*/

    }]);


});