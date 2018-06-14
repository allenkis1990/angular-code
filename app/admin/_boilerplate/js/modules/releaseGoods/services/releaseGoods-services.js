define(function () {
    return ['Restangular', '$q', function (Restangular, $q) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commodityManager');
        });


        //验证是否小于0
        function validateLessThanZero (obj) {
            return obj < 0;
        }


        //验证是否为非数字
        function validateIsNaN (obj) {
            return isNaN(Number(obj));
        }

        //验证是否为空
        function validateIsNull (obj) {
            return (obj === '' || obj === undefined || obj === null);
        }


        return {

            saveCommodity: function (params) {
                return a.all('saveCommodity').post(params);
            },
            updateCommodity: function (params) {
                return a.all('updateCommodity').post(params);
            },
            getTitleLevelList: function () {
                return a.one('getTitleLevelList').get();
            },
            getTrainingYearList: function () {
                return a.one('getTrainingYearList').get();
            },

            checkGoods: function ($scope, HB_dialog) {
                $scope.mark = false;
                if (validateIsNull($scope.commoditySkuInfo.commoditySkuName)) {
                    HB_dialog.warning('警告', '请填写商品名称');
                    return false;
                }

                if (validateIsNull($scope.commoditySkuInfo.subjectId)) {
                    HB_dialog.warning('警告', '请选择科目');
                    return false;
                }

                if ($scope.commoditySkuInfo.subjectId === '5628812b569c57e001569c5a77f6a011' && validateIsNull($scope.commoditySkuInfo.trainingYear)) {
                    HB_dialog.warning('警告', '请选择年度');
                    return false;
                }

                //赋值学时价格
                if ($scope.commoditySkuInfo.subjectId === '5628812b569c57e001569c5a77f6a011') {
                    $scope.commoditySkuInfo.periodPrice = $scope.model.gxPrice;
                } else {
                    $scope.commoditySkuInfo.periodPrice = $scope.model.zyPrice;
                }


                if (validateIsNull($scope.commoditySkuInfo.periodPrice)) {
                    HB_dialog.warning('警告', '请填写每学时价格');
                    return false;
                }

                if (Number($scope.commoditySkuInfo.periodPrice) < 0.1) {
                    HB_dialog.warning('警告', '每学时价格不能小于0.1元');
                    return false;
                }


                console.log(validateIsNaN($scope.commoditySkuInfo.periodPrice));
                if (validateIsNaN($scope.commoditySkuInfo.periodPrice)) {
                    HB_dialog.warning('警告', '每学时价格必须为数字');
                    return false;
                }

                if (validateLessThanZero($scope.commoditySkuInfo.periodPrice)) {
                    HB_dialog.warning('警告', '每学时价格不能为负数');
                    return false;
                }
                console.log($scope.commoditySkuInfo.periodPrice + '');
                var priceSplit = ($scope.commoditySkuInfo.periodPrice + '').split('.');
                //console.log($scope.commoditySkuInfo.periodPrice.split('.'));

                if (priceSplit.length > 1) {
                    if (priceSplit[1].length > 2) {
                        HB_dialog.warning('警告', '每学时价格最多精确到小数点两位');
                        return false;
                    }
                }


                if ($scope.commoditySkuInfo.putaway === 'true' &&
                    $scope.commoditySkuInfo.putawayImmediately === 'false' &&
                    validateIsNull($scope.commoditySkuInfo.putawayTime)) {

                    HB_dialog.warning('警告', '请填写上架时间');
                    return false;

                }

                if ($scope.coursePackageInfo.length <= 0) {
                    HB_dialog.warning('警告', '请配置课程包');
                    return false;
                }

                if (validateIsNull($scope.examineConditionInfo.rateOfProgress)) {
                    HB_dialog.warning('警告', '请填写课程进度');
                    return false;
                }

                if (validateIsNaN($scope.examineConditionInfo.rateOfProgress)) {
                    HB_dialog.warning('警告', '课程进度必须为数字');
                    return false;
                }

                if (validateLessThanZero($scope.examineConditionInfo.rateOfProgress)) {
                    HB_dialog.warning('警告', '课程进度不能为负数');
                    return false;
                }


                if ($scope.model.hasPracticePaperInfo === 'true' && validateIsNull($scope.examineConditionInfo.passScore)) {
                    HB_dialog.warning('警告', '请填写课程测验成绩');
                    return false;
                }


                if (validateIsNaN($scope.examineConditionInfo.passScore)) {
                    HB_dialog.warning('警告', '课程测验成绩必须为数字');
                    return false;
                }

                if (validateLessThanZero($scope.examineConditionInfo.passScore)) {
                    HB_dialog.warning('警告', '课程测验成绩不能为负数');
                    return false;
                }


                if ($scope.model.hasPracticePaperInfo === 'true' && $scope.practicePaperInfo === null) {
                    HB_dialog.warning('警告', '请配置课后测验');
                    return false;
                }

                $scope.mark = true;

            }
        };
    }];
});
