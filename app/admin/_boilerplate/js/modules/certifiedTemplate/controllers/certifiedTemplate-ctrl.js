define(['cooper'], function (cooper) {
    'use strict';
    return ['$scope', 'certifiedTemplateService', '$state','$rootScope',
        function ($scope, certifiedTemplateService, $state,$rootScope) {

            var cp = new cooper();
            var downloadUrlPrefix = null;

            $scope.model = {
                createUnitId:'',
                unitId:'',
                dimension:1,
                certifiedTemplate: [],
                allCertifiedTemplate: []
            };
            certifiedTemplateService.getDownloadUrl().then(function (data) {
                if (data.status) {
                    downloadUrlPrefix = data.info.downModelIP;
                } else {
                    $scope.globle.alert('提示', '获取下载地址失败，请重新进入界面');
                }
            });

            $scope.events = {
                isSubProjectManager :function () {
                    var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                    return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                },
                toggleDimension: function (e, dimension) {
                    e.preventDefault();
                    $scope.model.dimension = dimension;
                    $scope.events.searchTemplate();
                },
                searchTemplate:function(e){
                    certifiedTemplateService.getCertifiedList($scope.model.createUnitId,$scope.model.dimension).then(function (data) {
                        if (data.status) {
                            $scope.model.allCertifiedTemplate = data.info;
                        } else {
                            $scope.globle.alert('提示', data.messages);
                        }
                    });
                },
                preview: function (id) {
                    certifiedTemplateService.getCertifiedPreview(id).then(function (data) {
                        if (data.status) {
                            var dataInfo = data.info;
                            var previewData = dataInfo.certifiedTemplatePreview,
                                url = dataInfo.defaultPdfPrintAddress;
                            cp.request({
                                sendData: previewData,
                                url: url,
                                containerId: 'preview'
                            }).then(function (back) {
                                if (back.status) {
                                    var downloadUrl = downloadUrlPrefix + back.info.resourceUrl + back.info.path;
                                    window.open(downloadUrl);
                                } else {
                                    $scope.globle.alert('提示', data.messages);
                                }
                            }, function () {
                            });
                        } else {
                            $scope.globle.alert('提示', data.messages);
                        }
                    });
                },
                download: function (id) {
                    certifiedTemplateService.getCertifiedPreview(id).then(function (data) {
                        if (data.status) {
                            var dataInfo = data.info;
                            var previewData = dataInfo.certifiedTemplatePreview,
                                url = dataInfo.defaultPdfPrintAddress;
                            previewData.isDownload = true;
                            cp.request({
                                sendData: previewData,
                                url: url,
                                containerId: 'preview'
                            }).then(function () {
                            }, function () {
                            });
                        } else {
                            $scope.globle.alert('提示', data.messages);
                        }
                    });
                }
            };

            certifiedTemplateService.getCertifiedList('',$scope.model.dimension).then(function (data) {
                if (data.status) {
                    $scope.model.certifiedTemplate = data.info;
                } else {
                    $scope.globle.alert('提示', data.messages);
                }
            });

        }];
});
