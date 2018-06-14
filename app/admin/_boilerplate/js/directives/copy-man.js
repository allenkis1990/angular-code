/**
 * Created by hb on 2017/3/15.
 */
define(['zeroCopy'], function (zeroCopy) {
    'use strict';
    return ['$notify', '$timeout', function ($notify, $timeout) {

        return {
            scope: {
                afterCopy: '&'
            },
            link: function ($scope, $element) {
                var client = new zeroCopy($element);
                client.on('ready', function (readyEvent) {
                    client.on('aftercopy', function (event) {
                        $notify.success('复制成功');
                        $scope.afterCopy && $scope.afterCopy(event);
                    });
                });
            }
        };
    }];
});