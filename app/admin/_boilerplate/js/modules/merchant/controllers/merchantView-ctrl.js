/**
 * @author wangzy
 * @description 查看商户详细信息控制器
 *
 * 添加商户controller
 */

define(function () {
    'use strict';
    return ['$scope',
        'KENDO_UI_GRID',
        'KENDO_UI_EDITOR',
        'kendo.grid',
        'global',
        'merchantService',
        '$state',
        '$stateParams',
        function ($scope, KENDO_UI_GRID, KENDO_UI_EDITOR, kendoGrid, global, merchantService, $state, $stateParams) {

            $scope.showDisabled = false;//提交按钮是否可用

            $scope.model = {
                /**
                 * 商户详细信息的model
                 */
                merchantDetailInfo: {
                    projectId: '',//子项目id
                    merchantId: '',//商户id
                    serveUnitId: '',//服务单位id
                    businessUnitId: '',//业务单位id
                    contactPersonId: '',//联系人id
                    companyName: '',//企业名称(服务单位名称和顶级业务单位名称)
                    businessSchoolName: '',//商学院名称（子项目名称）
                    contactPerson: '',//联系人姓名
                    mobileNumber: '',//手机号
                    email: '',//邮箱
                    applyTime: '',//申请时间
                    applyEnterface: '',//申请入口
                    dredge: '',//开通者
                    status: '',//商户状态
                    platServeTimeBegin: '',//平台服务开始时间
                    platServeTimeEnd: '',//平台服务结束时间
                    industryId: '',//所处行业
                    industryName: '',//所处行业名称
                    logo: '',//企业logo
                    domain: '',//商户域名
                    remark: ''//备注
                },
                /**
                 * 商户的商品
                 */
                merchantGoods: [],//接收商户的商品

                merchantActionRecord: []//接收商户的操作日志
            };

            merchantService.findForDetailByProjectId({projectId: $stateParams.projectId}).then(function (data) {
                if (data.status) {
                    $scope.model.merchantDetailInfo = data.info;
                    //设置企业logo，如果没有logo，设置成默认图片
                    if ($scope.model.merchantDetailInfo.logo == '') {
                        $scope.model.merchantDetailInfo.logo = 'images/company-logo.png';
                    } else {
                        $scope.model.merchantDetailInfo.logo = '/mfs' + $scope.model.merchantDetailInfo.logo;
                    }

                    //截取服务时间的长度
                    if ($scope.model.merchantDetailInfo.platServeTimeBegin != '') {
                        $scope.model.merchantDetailInfo.platServeTimeBegin = $scope.model.merchantDetailInfo.platServeTimeBegin.substring(0, $scope.model.merchantDetailInfo.platServeTimeBegin.length - 9);
                    }
                    if ($scope.model.merchantDetailInfo.platServeTimeEnd != '') {
                        $scope.model.merchantDetailInfo.platServeTimeEnd = $scope.model.merchantDetailInfo.platServeTimeEnd.substring(0, $scope.model.merchantDetailInfo.platServeTimeEnd.length - 9);
                    }
                    switch ($scope.model.merchantDetailInfo.industryId) {
                        case '0' :
                            $scope.model.merchantDetailInfo.industryName = '暂无行业';
                            return;
                        case '1' :
                            $scope.model.merchantDetailInfo.industryName = '银行行业';
                            return;
                        case '2' :
                            $scope.model.merchantDetailInfo.industryName = '酒店行业';
                            return;
                        case '3' :
                            $scope.model.merchantDetailInfo.industryName = '汽车行业';
                            return;
                        case '4' :
                            $scope.model.merchantDetailInfo.industryName = '餐饮行业';
                            return;
                        case '5' :
                            $scope.model.merchantDetailInfo.industryName = '房地产行业';
                            return;
                        case '6' :
                            $scope.model.merchantDetailInfo.industryName = '保险行业';
                            return;
                        case '7' :
                            $scope.model.merchantDetailInfo.industryName = '零售行业';
                            return;
                        case '8' :
                            $scope.model.merchantDetailInfo.industryName = '其它行业';
                            return;
                    }

                } else {
                    $scope.globle.showTip(data.info, 'error');
                }
            });

            //通过商户projectId,merchantId获取商户的商品信息
            merchantService.findMerchantGoods({
                projectId: $stateParams.projectId,
                merchantId: $stateParams.merchantId,
                operateType: '2'//1-为调整服务期查询商品 2-为查看商品详情查询商品
            }).then(function (data) {
                if (data.status) {
                    $scope.model.merchantGoods = data.info;
                    angular.forEach($scope.model.merchantGoods, function (item) {
                        if (item.serveTimeBegin.length > 0) {
                            item.serveTimeBegin = item.serveTimeBegin.substring(0, item.serveTimeBegin.length - 9);
                        }
                        if (item.serveTimeEnd.length > 0) {
                            item.serveTimeEnd = item.serveTimeEnd.substring(0, item.serveTimeEnd.length - 9);
                        }
                    });
                } else {
                    $scope.globle.alert('获取商户商品信息出错！');
                }
            });

            //通过商户projectId,merchantId获取商户的商品信息
            merchantService.findMerchantActionRecord({
                projectId: $stateParams.projectId
            }).then(function (data) {
                if (data.status) {
                    $scope.model.merchantActionRecord = data.info;
                    angular.forEach($scope.model.merchantActionRecord, function (item) {
                        if (item.operateTime.length > 0) {
                            item.operateTime = item.operateTime.substring(0, item.operateTime.length - 3);
                        }
                    });
                } else {
                    $scope.globle.alert('获取商户操作日志出错！');
                }
            });

            $scope.events = {
                /**
                 * 关闭添加界面
                 * @param e
                 */
                closeView: function (e) {
                    e.stopPropagation();
                    $state.go('states.merchant').then(function () {
                        $state.reload();
                    });
                },
                /**
                 * 查看解决方案详情
                 * @param e
                 * @param solutionId
                 */
                viewSolution: function (e, solutionId) {
                    e.stopPropagation();
                    $state.go('states.merchant.solutionView', {
                        solutionId: solutionId,
                        projectId: $stateParams.projectId,
                        merchantId: $stateParams.merchantId
                    });
                },
                /**
                 * 查询商户的操作日志
                 */
                findMerchantActionRecord: function () {
                    //通过商户projectId,merchantId获取商户的商品信息
                    merchantService.findMerchantActionRecord({
                        projectId: $stateParams.projectId
                    }).then(function (data) {
                        if (data.status) {
                            $scope.model.merchantActionRecord = data.info;
                            angular.forEach($scope.model.merchantActionRecord, function (item) {
                                if (item.operateTime.length > 0) {
                                    item.operateTime = item.operateTime.substring(0, item.operateTime.length - 3);
                                }
                            });
                        } else {
                            $scope.globle.alert('获取商户操作日志出错！');
                        }
                    });
                },
                /**
                 * 回收解决方案
                 * @param e
                 * @param goods
                 */
                recycleSolution: function (e, goods) {
                    e.stopPropagation();
                    $scope.globle.confirm('回收该企业在用的解决方案之后，则不可在用！确定要回收该企业的使用权？', function (dialog) {
                            return merchantService.recycleSolution({
                                subProjectId: goods.projectId,
                                solutionId: goods.goodsId,
                                merchantId: goods.merchantId
                            }).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    goods.goodsStatus = '回收';
                                    //$scope.globle.showTip("操作成功！", "success");
                                    $scope.events.findMerchantActionRecord();
                                } else {
                                    $scope.globle.showTip('操作失败！', 'error');
                                }
                            });
                        }
                    );

                },
                /**
                 * 回收账号并发数
                 * @param e
                 * @param goods
                 */
                recycleAccount: function (e, goods) {
                    e.stopPropagation();
                    $scope.globle.confirm('回收解决方案', '回收该企业的并发数之后，则不可在用！确定要回收该企业的并发数？', function (dialog) {
                            return merchantService.recycleAccount({
                                subProjectId: goods.projectId,
                                merchantId: goods.merchantId,
                                recordId: goods.goodsId
                            }).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    goods.goodsStatus = '回收';
                                    //$scope.globle.showTip("操作成功！", "success");
                                    $scope.events.findMerchantActionRecord();
                                } else {
                                    $scope.globle.showTip('操作失败！', 'error');
                                }
                            });
                        }
                    );

                }
            };
        }];
});
