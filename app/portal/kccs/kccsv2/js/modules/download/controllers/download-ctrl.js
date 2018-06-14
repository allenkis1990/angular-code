define(function () {
    'use strict';
    return ['$scope', function ($scope) {
        $scope.events = {
            download: function (e, type) {
                e.preventDefault();
                var downloadUrl = '/mfs/resource/file/常见视频无法播放问题解决方式.pdf?download';
                if (type === 1) {
                    window.open(downloadUrl, '_self');
                }
            }
        };
    }];
});