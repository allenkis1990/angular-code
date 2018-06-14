/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/10/13
 * 时间: 9:17
 *
 */
define(['angular', 'echarts'], function (angular, echarts) {
    'use strict';
    var chartModule = angular.module('chartModule', []);

    chartModule.factory('chartModuleService', [function () {
        var chartModuleService = {};
        chartModuleService.getChartOption = function () {

        };
        return chartModuleService;
    }]);

    chartModule.provider('eChart', [function () {
        this.$get = [function () {
            var chartDefaultOptions = {
                title: {
                    text: '默认标题',
                    subtext: '默认子标题',
                    x: 0, // 标题横坐标
                    y: 0, // 标题纵坐标
                    link: null, // 主标题的点击链接
                    target: null, // 指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
                    sublink: null,
                    subtarget: null
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true
            };
            return {
                chartOptions: function (options) {
                    var result = $.extend(true, {}, chartDefaultOptions, options);
                    return result;
                }
            };
        }];
    }]);

    chartModule.directive('eChart', ['$log', 'eChart', function ($log, eChart) {
        var directiveDefinitionObject = {
            scope: {
                options: '='
            },
            compile: function compile (tElement, tAttrs, transclude) {
                tElement.height() === 0 && tElement.height(600);
                tElement.width() === 0 && tElement.width(600);
                return function ($scope, $element, $attrs) {
                    var chart = echarts.init(tElement[0]);
                    chart['showLoading']({text: '正在努力的读取数据中...'});

                    chart['setOption'](eChart.chartOptions($scope.options));

                    $(window).resize(function () {
                        $log.info('窗口大小变化..图形重新计算大小');
                        chart.resize();
                    });

                    $scope.$on('events:changeSideWidth', function () {
                        // 当桌面的菜单隐藏或者显示的时候 重画charts
                        chart.resize();
                    });

                    chart['hideLoading']();

                    $scope.$on('$destroy', function () {
                        chart.clear();
                        chart['dispose']();
                    });

                };
            }
        };
        return directiveDefinitionObject;
    }]);
});
