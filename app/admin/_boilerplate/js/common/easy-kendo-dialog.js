define(['angular'], function (angular) {
    return angular.module('easy.kendo.dialog', [])

        .factory('easyKendoDialog', ['$compile', '$rootScope', '$http', '$timeout', function ($compile, $rootScope, $http, $timeout) {

            function compileEle (options, $scope) {
                var defaultOptions = {
                    modal: true,
                    autoFocus: true,
                    close: function () {
                        this.wrapper.removeClass('fadeInUp').addClass('zoomOut');
                        angular.isFunction(options.onClose) && options.onClose();
                        $scope[name] && $scope[name].close();
                        var me = this;
                        $timeout(function () {
                            me.destroy();
                            $scope.$destroy();
                        }, 300);
                    },
                    open: function (aaa) {
                        this.wrapper.addClass('animated').addClass('zoomIn');
                        this.center();
                        !options.afterOpen||options.afterOpen();
                    },
                    resizable: false
                };

                if (options.type) {
                    defaultOptions.width = 620;
                    defaultOptions.title = '友情提示';
                    defaultOptions.resizable = true;
                }

                $scope.kendoWindowOptions = $.extend(defaultOptions, options);

                if (options.templateUrl) {
                    $http.get(options.templateUrl, {
                        cache: true
                    })
                        .then(function (data) {
                            var $element = $('<div class="dialog w-2" style="width:auto" kendo-window="kendoDialog" k-options="kendoWindowOptions">' + data.data + '</div>');
                            angular.element('body').append($element);
                            $compile($element)($scope);
                        });
                } else {
                    var $element = $('<div  kendo-window="kendoDialog" k-options="kendoWindowOptions">' + options.message + '</div>');
                    angular.element('body').append($element);
                    $compile($element)($scope);

                }
            }

            function defaultSetting (options) {
                options.width = 500;
                options.height = 180;
                options.title = options.title || '友情提示';
            }

            return {
                content: function (options, $scope) {
                    var $newScope;
                    if ($scope) {
                        $newScope = $scope.$new();
                    } else {
                        $newScope = $rootScope.$new();
                    }
                    compileEle(options, $newScope);
                    return $newScope;
                },
                closeWindow: function ($scope, name) {
                    name = name || 'kendoDialog';
                    $scope[name] && $scope[name].close();
                }
            };
        }]);
});
