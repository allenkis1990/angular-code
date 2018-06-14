define(function () {
    'use strict';
    return ['$scope', 'global', 'KENDO_UI_TREE', 'KENDO_UI_GRID', 'kendo.grid', 'courseManagerService', 'coursePackageManagerService', 'coursePoolRuleManagerService', '$state', '$stateParams', 'TabService',
        function ($scope, global, KENDO_UI_TREE, KENDO_UI_GRID, kendoGrid, courseManagerService, coursePackageManagerService, coursePoolRuleManagerService, $state, $stateParams, TabService) {
            function init () {
                $scope.model = {
                    coursePoolRuleDto: {},
                    requiredPackage: null,
                    requiredPackageList:[],
                    optionalPackageList: [],
                    forbidOptionalPackageRequires:true
            };
            }

            init();
            coursePoolRuleManagerService.findCoursePoolRule($stateParams.ruleId).then(function (data) {
                if (data.status) {
                    $scope.model.coursePoolRuleDto = data.info;
                    $scope.model.requiredPackageList = data.info.compulsoryPackages;
                    console.log($scope.model.requiredPackageList );
                    $scope.model.optionalPackageList = data.info.optionalPackageRequires;
                    $scope.model.forbidOptionalPackageRequires=data.info.forbidOptionalPackageRequires;
                    $scope.model.trainingClassSchemeList = data.info.trainingClassScheme;
                    if ($scope.model.trainingClassSchemeList !== null && $scope.model.trainingClassSchemeList.length > 0) {
                        $scope.model.trainingClassScheme = $scope.model.trainingClassSchemeList.join(';');
                    }


                } else {
                    $scope.globle.showTip(data.info, 'error');
                }
            });
            $scope.events = {
                goCoursePoolRuleManager: function (e) {
                    e.preventDefault();
                    $state.go('states.coursePoolRuleManager');
                }
            };

            $scope.utils = {
                getOptionalPackageRequire: function () {
                    if ($scope.model.requiredPackageList.length==0) {
                        return $scope.model.coursePoolRuleDto.requiredPeriod;
                    } else {
                        var regu = '^[0-9]+(\\.[0-9]{1})?$';
                        var re = new RegExp(regu);
                        var less = 0;
                        if (re.test($scope.model.coursePoolRuleDto.requiredPeriod)) {
                            var less = $scope.model.coursePoolRuleDto.requiredPeriod - $scope.utils.getRequiredPeriod();
                        }
                        return less < 0 ? 0 : less;
                    }
                },
                getRequiredPeriod: function () {
                    var period = 0;
                    if ($scope.model.requiredPackageList.length>0) {
                        angular.forEach($scope.model.requiredPackageList, function (data, index) {
                            period = (Number(period) * 10 + Number(data.totalPeriod) * 10) / 10;
                        });
                    }
                    return period;
                },
                getOptionalPeriod: function () {
                    var period = 0;
                    var regu = '^[0-9]+(\\.[0-9]{1})?$';
                    var re = new RegExp(regu);
                    if ($scope.model.forbidOptionalPackageRequires ==false) {
                        angular.forEach($scope.model.optionalPackageList, function (data, index) {
                            if (re.test(data.requiredPeriod)) {
                                period = (Number(period) * 10 + Number(data.requiredPeriod) * 10) / 10;
                            }
                        });
                    } else {
                        //period = $scope.utils.getOptionalPackageRequire();
                        angular.forEach($scope.model.optionalPackageList, function (data, index) {
                            if ( re.test ( data.totalPeriod ) ) {
                                period = (Number(period)*10+Number(data.totalPeriod)*10)/10;
                            }
                        });
                    }
                    return period;
                }
            };

        }]
        ;
})
;
