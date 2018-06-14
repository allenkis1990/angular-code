/**
 * Created by linj on 2018/4/24.
 */
define(function () {
    "use strict";
    return {
        indexCtrl: ['$scope', 'HB_notification', 'easyKendoDialog', '$stateParams', '$http', 'hbUtil', 'goodsManagerService',
            function ($scope, HB_notification, easyKendoDialog, $stateParams, $http, hbUtil, goodsManagerService) {
                $scope.model = {
                    skuId: $stateParams.id,
                    schemeId: $stateParams.schemeId,
                    paymentRule: {
                        type: 1,//自主收款
                        priceType: 1
                    },
                    editRule: true,
                    tempPaymentRule: {},
                    saving: false,
                    selectedAuthorizeUnitId: [],
                    selectedAuthorizeUnitIdTemp: [],
                    authorizedUnitQueryParam: {
                        skuId: $stateParams.id
                    },
                    unAuthorizedUnitQueryParam: {
                        skuId: $stateParams.id
                    },
                    authorizedUnitPage: {
                        pageNo: 1,
                        pageSize: 10
                    },
                    unAuthorizedUnitPage: {
                        pageNo: 1,
                        pageSize: 10
                    }
                };

                function init() {
                    if ($stateParams.id) {
                        $http.get('/web/admin/commodityManager/getCommodityDetail', {
                            params: {
                                commoditySkuId: $stateParams.id,
                                schemeId: $stateParams.schemeId
                            }
                        }).success(function (data) {

                            if (data.status) {
                                $scope.schemeDetail = data.info;
                                if (hbUtil.validateIsNull($scope.schemeDetail.authorizedRule) === false) {
                                    $scope.model.editRule = false;
                                    $scope.model.paymentRule = angular.copy($scope.schemeDetail.authorizedRule);
                                }
                            } else {
                                HB_notification.confirm(data.info, function (dialog) {
                                    dialog.doRightClose();
                                });
                                $scope.model.editRule = false;
                            }
                        });
                    }

                };
                init();

            }
        ]
    };
});