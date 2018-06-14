/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/15
 * 时间: 15:36

 */
define(['angular'], function (angular) {
    'use strict';

    angular.module('kendo.ui.commons', [])

        .factory('kendo.grid', [function () {

            return {
                // 复选框选中所有的复选框
                selectAll: function (scope) {
                    scope.selected = !scope.selected;

                    this.storageSelectItems(scope, scope.selected);
                },
                storageSelectItems: function (scope, bool) {
                    scope.model.selectItems = [];
                    if (bool) {
                        scope.model.selectItems =
                            _.map(scope.model.gridReturnData, 'OrderID');
                    }
                },
                checkBoxCheck: function (scope, e, dataItem) {
                    var id = dataItem['OrderID'],
                        index = _.findIndex(scope.model.selectItems, function (item) {
                            return item === id;
                        });
                    if (e.target.checked) {
                        scope.model.selectItems.push(id);
                    } else {
                        scope.model.selectItems.splice(index, 1);
                    }
                },
                nullDataDealLeaf: function (e) {
                    if (!e) {
                        return false;
                    }
                    if (!e.sender) {
                        return false;
                    }
                    if (!e.sender.element) {
                        return false;
                    }

                    var gridElement = e.sender.element,
                        grid_null_data_container = gridElement.find('#grid_null_data_container');
                    if (grid_null_data_container.length > 0) {
                        grid_null_data_container.remove();
                    }

                    if (!e.items) {
                        return false;
                    }
                    if (e.items.length > 0) {
                        return false;
                    } else {
                        var gridContent = gridElement.find('.k-pager-wrap'),
                            showTemplate = '未搜索到相关数据';
                        gridContent.before('<div id="grid_null_data_container" class="grid-null-data">' + showTemplate + '</div>');
                    }
                }
            };
        }]);

});
