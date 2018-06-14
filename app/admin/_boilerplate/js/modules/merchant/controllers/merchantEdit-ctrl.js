/**
 * @author wangzy
 * @description 修改商学院控制器
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

            // define data-binding variable
            angular.extend($scope, {
                regexps: global.regexps,    // validation regexp while validating form or define yourself
                ui: {},                     // Kendo component options config
                model: {},                  // data model
                node: {},                   // node for kendo component
                event: {}
            });

            $scope.showDisabled = false;//提交按钮是否可用

            //修改时远程校验企业名称（顶级业务单位名称）的参数
            $scope.validateParam = {
                projectId: '',
                subProjectId: '',
                unitId: '',
                userId: ''
            };

            $scope.model = {
                image: '',
                //修改商户的model
                updateMerchantDto: {
                    projectId: '',//项目id
                    subProjectId: '',//子项目id
                    serviceUnitId: '',//服务单位id
                    businessUnitId: '',//业务单位Id
                    contactPersonId: '',//联系人id
                    merchantId: '',//商户其他信息Id
                    companyName: '',//企业名称(服务单位名称和顶级业务单位名称)
                    businessSchoolName: '',//商学院名称（子项目名称）
                    industryId: '',//所处行业id（来自数据字典）
                    contactPerson: '',//联系人
                    mobileNumber: '',//联系手机
                    email: '',//联系邮箱
                    domain: '',//商学院域名，不可修改
                    logo: '',//企业logo
                    includingAbility: ''//是否推送能力项 true-是 false-否
                }
            };


            $scope.$watch('model.uploadImage', function () {
                if ($scope.model.uploadImage) {
                    $scope.model.image = '/mfs' + $scope.model.uploadImage.newPath;
                    $scope.model.updateMerchantDto.logo = $scope.model.uploadImage.newPath;
                } else {
                    $scope.model.image = 'images/company-logo.png';
                }
            });

            merchantService.findForEditByProjectId({id: $stateParams.id}).then(function (data) {
                if (data.status) {
                    $scope.model.updateMerchantDto = data.info;
                    $scope.validateParam.unitId = data.info.businessUnitId;
                    $scope.validateParam.projectId = data.info.projectId;
                    $scope.validateParam.subProjectId = data.info.subProjectId;
                    $scope.validateParam.userId = data.info.contactPersonId;

                    if ($scope.model.updateMerchantDto.logo == '') {
                        $scope.model.image = 'images/company-logo.png';
                    } else {
                        $scope.model.image = '/mfs' + $scope.model.updateMerchantDto.logo;
                    }

                } else {
                    $scope.globle.showTip(data.info, 'error');
                }
            });


            $scope.events = {
                /**
                 * 保存修改
                 * @param e
                 */
                saveEdit: function (e) {
                    e.stopPropagation();
                    //防止用户多次提交表单
                    $scope.showDisabled = true;
                    $('#submitBtn').attr('class', 'btn btn-g');
                    merchantService.update($scope.model.updateMerchantDto).then(function (data) {
                        if (data.status) {
                            $scope.globle.showTip('操作成功', 'success');
                            $state.go('states.merchant').then(function () {
                                $state.reload();
                            });
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                            //如果添加失败，则将提交按钮样式还原，用户可以再次提交
                            $scope.showDisabled = false;
                        }
                    });
                },
                /**
                 * 关闭添加界面
                 * @param e
                 */
                closeEdit: function (e) {
                    e.stopPropagation();
                    $state.go('states.merchant').then(function () {
                        $state.reload();
                    });
                }
            };
        }];
});
