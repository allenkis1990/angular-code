define(function () {
    'use strict';
    return ['$scope', 'global', 'KENDO_UI_TREE', 'KENDO_UI_GRID', 'kendo.grid', 'courseManagerService', 'coursePackageManagerService', 'coursePoolRuleManagerService', '$state', '$stateParams', 'TabService',
        function ($scope, global, KENDO_UI_TREE, KENDO_UI_GRID, kendoGrid, courseManagerService, coursePackageManagerService, coursePoolRuleManagerService, $state, $stateParams, TabService) {
            $scope.validateParams = {
                ruleId: $stateParams.ruleId
            };

            function init () {
                $scope.model = {
                    tempOptionalRequiredPeriod: [],
                    tempRequiredPackage: 0,
                    coursePoolRuleDto: {
                        ruleName: null,
                        requiredPackageID: null,
                        optionalPackageID: null,
                        requiredPeriod: 0
                    },
                    requiredPackage: null,
                    requiredPackageList:[],
                    optionalPackage: null,
                    saving: false,
                    showSuccess: false,
                    coursePackageParams: {},
                    page: {
                        pageNo: 1,
                        pageSize: 10
                    },
                    courseList: [],
                    pageNo: 1,
                    pageCount: 0,
                    coursePageList: [],
                    pageList: [],
                    chooseType: 0,//1--必修包 2-选修包,
                    hasReference: true//是否被商品引用
                };
            }

            init();
            coursePoolRuleManagerService.findCoursePoolRule($stateParams.ruleId).then(function (data) {
                if (data.status) {
                    if (data.info.requiredPackageRequire) {
                        data.info.requiredPackageRequire.poolName = data.info.requiredPackageRequire.packageName;
                        data.info.requiredPackageRequire.id = data.info.requiredPackageRequire.packageId;
                    }
                    angular.forEach(data.info.optionalPackageRequires, function (data, index) {
                        data.poolName = data.packageName;
                        data.id = data.packageId;
                    });
                    $scope.model.coursePoolRuleDto = data.info;
                    $scope.model.forbidOptionalPackageRequires = data.info.forbidOptionalPackageRequires;
                    $scope.model.requiredPackageList = data.info.compulsoryPackages;
                    $scope.model.tempRequiredPackage = $scope.model.coursePoolRuleDto.requiredPeriod;
                    $scope.model.optionalPackageList = data.info.optionalPackageRequires;


                    angular.forEach(data.info.optionalPackageRequires, function (tempData, key) {
                        var value = {};
                        angular.forEach(tempData, function (tempData2, key2) {
                            value[key2] = tempData2;

                        });
                        $scope.model.tempOptionalRequiredPeriod.push(value);
                    });
                    $scope.model.trainingClassSchemeList = data.info.trainingClassScheme;
                    if ($scope.model.trainingClassSchemeList !== null && $scope.model.trainingClassSchemeList.length > 0) {
                        $scope.model.trainingClassScheme = $scope.model.trainingClassSchemeList.join(';');
                    }

                }
                else {
                    $scope.globle.showTip(data.info, 'error');
                }
                //console.log("*****");
                //console.log($scope.model.tempOptionalRequiredPeriod);
            });
            coursePoolRuleManagerService.hasReference($stateParams.ruleId).then(function (data) {
                if (data.status == true) {
                    $scope.model.hasReference = data.info;
                }
            });

            $scope.events = {
                checkCourseIsDuplicateInCoursePool:function(){
                    if($scope.model.requiredPackageList==null||$scope.model.requiredPackageList.length==0){
                        HB_dialog.warning('提示', '请先添加必修包');
                        return false;
                    }
                    var packaheIds= new Array();
                    angular.forEach($scope.model.requiredPackageList, function (data) {
                        packaheIds.push({packageId:data.packageId});
                    });
                    window.open( '/admin/'+require.unitPath+'/duplicateCourseInCoursePools?jsonObj='+angular.toJson(packaheIds));
                },
                chose: function () {
                    if ($scope.model.forbidOptionalPackageRequires === true) {
                        $scope.model.forbidOptionalPackageRequires = false;
                    } else {
                        $scope.model.forbidOptionalPackageRequires = true;
                    }
                    if ($scope.model.forbidOptionalPackageRequires === true) {
                        angular.forEach($scope.model.optionalPackageList, function (data, index) {
                            data.requiredPeriod = 0;
                        });
                    }
                },
                save: function (e) {
                    $scope.model.coursePoolRuleDto.forbidOptionalPackageRequires = $scope.model.forbidOptionalPackageRequires;
                    if ($scope.coursePoolRuleValidate.$valid && !$scope.model.saving && !($scope.model.coursePoolRuleDto.ruleType != 2 && $scope.model.requiredPackageList.length==0) && !($scope.model.coursePoolRuleDto.ruleType != 1 && $scope.model.optionalPackageList.length == 0)) {
                        $scope.model.saving = true;
                        if ($scope.model.coursePoolRuleDto.ruleType != 2 && $scope.model.requiredPackageList.length==0) {
                            $scope.globle.showTip('必须选择必修包', 'error');
                            $scope.model.saving = false;
                            return;
                        }
                        if ($scope.model.coursePoolRuleDto.ruleType != 1 && $scope.model.optionalPackageList.length == 0) {
                            $scope.globle.showTip('必须选择选修包', 'error');
                            $scope.model.saving = false;
                            return;
                        }
                        if ($scope.model.coursePoolRuleDto.ruleType == 1 && $scope.utils.getRequiredPeriod() != $scope.model.coursePoolRuleDto.requiredPeriod) {
                            console.log($scope.utils.getRequiredPeriod()+" "+$scope.model.coursePoolRuleDto.requiredPeriod);
                            $scope.globle.showTip('必修包要求学时不等于总体学时', 'error');
                            $scope.model.saving = false;
                            return;

                        }
                        if ($scope.model.coursePoolRuleDto.ruleType == 2) {
                            console.log($scope.model.tempRequiredPackage + ' ' + $scope.model.coursePoolRuleDto.requiredPeriod);
                            if ($scope.model.forbidOptionalPackageRequires === false && $scope.utils.getOptionalPeriod() != $scope.model.coursePoolRuleDto.requiredPeriod) {
                                $scope.globle.showTip('选修包要求总学时不等于总体学时', 'error');
                                $scope.model.saving = false;
                                return;
                            }
                            if ($scope.model.hasReference == true && $scope.model.tempRequiredPackage > $scope.model.coursePoolRuleDto.requiredPeriod) {
                                $scope.globle.showTip('选修包要求总学时不能小于' + $scope.model.tempRequiredPackage, 'error');
                                $scope.model.saving = false;
                                return;
                            }
                        }
                        if ($scope.model.coursePoolRuleDto.ruleType == 3) {
                            if ($scope.model.hasReference == true && $scope.model.tempRequiredPackage > $scope.model.coursePoolRuleDto.requiredPeriod) {
                                $scope.globle.showTip('选修包要求总学时不能小于' + $scope.model.tempRequiredPackage, 'error');
                                $scope.model.saving = false;
                                return;
                            }
                        }
                        if ($scope.model.coursePoolRuleDto.ruleType == 3 && $scope.utils.getOptionalPeriod() + $scope.utils.getRequiredPeriod()  != $scope.model.coursePoolRuleDto.requiredPeriod) {
                            var optionalPeriod = Number($scope.model.coursePoolRuleDto.requiredPeriod - $scope.utils.getRequiredPeriod() );
                            var less = Number($scope.utils.getOptionalPeriod() - optionalPeriod);
                            if (optionalPeriod >= 0) {
                                if (less > 0) {
                                    if ($scope.model.forbidOptionalPackageRequires === false) {
                                    $scope.globle.showTip('选修包整体选课要求超出' + less + ',请先调整后保存', 'error');
                                    $scope.model.saving = false;
                                    return;
                                    }
                                } else if (less < 0) {
                                    if ($scope.model.forbidOptionalPackageRequires === false) {
                                        $scope.globle.showTip('选修包整体选课要求还差' + Number(0 - less) + ',请先调整后保存', 'error');
                                        $scope.model.saving = false;
                                        return;
                                    }
                                }
                            }
                            if ($scope.model.forbidOptionalPackageRequires === false) {
                                $scope.globle.showTip('必修包要求学时+选修包要求总学时不等于总体学时', 'error');
                                $scope.model.saving = false;
                                return;
                            }
                        }
                        $scope.model.coursePoolRuleDto.compulsoryPackages = $scope.model.requiredPackageList;
                        $scope.model.coursePoolRuleDto.optionalPackageRequires = $scope.model.optionalPackageList;
                       if (($scope.model.coursePoolRuleDto.ruleType == 1 || $scope.model.coursePoolRuleDto.ruleType == 3)) {
                           var isBack = false;
                           angular.forEach($scope.model.requiredPackageList,function(data){
                               var period = Number(data.requiredPeriod);
                               if (period == 0) {
                                   $scope.globle.showTip('必修包内选课要求学时不能为0', 'warn');
                                   $scope.model.saving = false;
                                   isBack=true;
                                   return;
                               } else if (Number(period) % 0.5 != 0) {
                                   $scope.globle.showTip('必修包内选课要求学时需被0.5整除', 'warn');
                                   $scope.model.saving = false;
                                   isBack=true;
                                   return;
                               }
                           })
                           if(isBack){
                               return;
                           }
                        }
                        var isReturn = false;
                        angular.forEach($scope.model.coursePoolRuleDto.optionalPackageRequires, function (data, key) {
                            var period = Number(data.requiredPeriod);
                            if (period == 0) {
                                if ($scope.model.forbidOptionalPackageRequires === false) {
                                    $scope.globle.showTip(data.poolName + '包内选课要求学时不能为0', 'warn');
                                    isReturn = true;
                                    return;
                                }
                            } else if (Number(period) % 0.5 != 0) {
                                $scope.globle.showTip(data.poolName + '包内选课要求学时需被0.5整除', 'warn');
                                isReturn = true;
                                return;
                            }
                            angular.forEach($scope.model.tempOptionalRequiredPeriod, function (tempData, tempKey) {
                                //alert(tempData.packageId);
                                if (tempData.packageId == data.packageId) {
                                    //alert(tempData.packageId);
                                    var tempPeriod = Number(tempData.requiredPeriod);
                                    //console.log(tempPeriod + " " + period);
                                    if (tempPeriod > period) {
                                        if ($scope.model.hasReference == true) {
                                            $scope.globle.showTip(data.poolName + '包内选课要求学时不能小于' + tempPeriod, 'warn');
                                            isReturn = true;
                                            return;
                                        }
                                    }
                                }
                            });

                        });
                        if (isReturn) {
                            $scope.model.saving = false;
                            return;
                        }
                        coursePoolRuleManagerService.updateCoursePoolRule($scope.model.coursePoolRuleDto).then(function (data) {
                            if (data.status == true) {
                                $scope.globle.showTip('修改选课规则成功！', 'success');
                                $state.go('states.coursePoolRuleManager').then(function () {
                                    $scope.node.coursePoolRuleGrid.pager.page($scope.model.page.pageNo);
                                });
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.saving = false;
                        }, function (data) {
                            console.log(data);
                            $scope.globle.showTip(data.data.info, 'warn');
                        });
                        /*      coursePoolRuleManagerService.hasReference ( $scope.model.coursePoolRuleDto.id ).then ( function ( data ) {
                                  if ( data.status == true ) {
                                      if ( data.info == true ) {
                                          $scope.globle.confirm ( '提示', '选课规则已被班级引用不可修改', function ( dialog ) {
      
                                          } );
                                      } else {
                                          coursePoolRuleManagerService.updateCoursePoolRule ( $scope.model.coursePoolRuleDto ).then ( function ( data ) {
                                              if ( data.status == true ) {
                                                  $scope.globle.showTip ( '修改选课规则成功！', 'success' );
                                                  $state.go ( 'states.coursePoolRuleManager').then(function () {
                                                      $scope.node.coursePoolRuleGrid.pager.page($scope.model.page.pageNo);
                                                  });
                                              } else {
                                                  $scope.globle.showTip ( data.info, 'error' );
                                              }
                                              $scope.model.saving = false;
                                          } );
                                      }
                                  } else {
                                      $scope.model.saving = false;
                                  }
                              } );
                         */
                    }
                    e.preventDefault();
                },
                goCoursePoolRuleManager: function (e) {
                    e.preventDefault();
                    $state.go('states.coursePoolRuleManager').then(function () {
                        $state.reload($state.current);
                    });
                },
                goCoursePackageAdd: function () {
                    TabService.appendNewTab(
                        '课程包管理',
                        'states.coursePackageManager.add',
                        {hideReturn: true},
                        'states.coursePackageManager',
                        false);
                },
                goCoursePackageEdit: function (packageId) {
                    console.log(packageId);
                    TabService.appendNewTab(
                        '课程包管理',
                        'states.coursePackageManager.edit',
                        {packageId: packageId},
                        'states.coursePackageManager',
                        true);
                },
                goChoosePage: function (e, type) {
                    /*      if($scope.model.hasReference!=false){
                              $scope.globle.showTip ( "选课规则已被班级引用不可修改课程包", 'warn' );
                              return;
                          }*/
                    //if (type == 1 && $scope.model.requiredPackage != null) {
                    //    $scope.globle.showTip('必修包只能选一个课程包', 'warn');
                    //    return;
                    //}
                    $scope.model.chooseType = type;
                    $scope.model.page.pageNo = 1;
                    $scope.node.coursePackageGrid.pager.page(1);
                    $scope.node.windows.coursePackageChoose.open();
                },
                toClosePage: function () {
                    $scope.node.windows.coursePackageChoose.close();
                },
                toListPage: function (dataItem) {
                    $scope.model.courseList.length = 0;
                    $scope.model.pageNo = 1;
                    $scope.model.poolId = dataItem.id;
                    var data = {
                        pageNo: $scope.model.pageNo,
                        pageSize: 10,
                        poolId: $scope.model.poolId
                    };
                    coursePackageManagerService.findCourseInPoolPage(data).then(function (data) {
                        if (data.status) {
                            $scope.model.courseList = data.info;
                            $scope.model.pageCount = data.totalPageSize;
                            $scope.model.totalSize = data.totalSize;
                            $scope.utils.getPageList();
                        }
                    });
                    $scope.node.windows.courseList.open();
                },
                toCloseListPage: function (e) {
                    $scope.node.windows.courseList.close();
                },
                searchCoursePackage: function (e) {
                    $scope.model.page.pageNo = 1;
                    $scope.node.coursePackageGrid.pager.page(1);
                    e.preventDefault();
                },
                select: function (dataItem) {
                    if (dataItem.interest != false) {
                        $scope.globle.showTip('兴趣包不能作为选课包使用！', 'warn');
                        return;
                    }
                    if ($scope.model.chooseType == 1) {
                        var requiredPackage = angular.copy(dataItem);
                        requiredPackage.packageId = dataItem.id;
                        requiredPackage.requiredPeriod =  dataItem.totalPeriod;
                        requiredPackage.packageName=dataItem.poolName;
                        if($scope.model.chooseType == 1&&$scope.model.coursePoolRuleDto.ruleType==1){
                        $scope.model.coursePoolRuleDto.requiredPeriod += dataItem.totalPeriod;
                        }
                        $scope.model.requiredPackageList.push(requiredPackage);
                    } else if ($scope.model.chooseType == 2) {
                        var optionalPackage = angular.copy(dataItem);
                        optionalPackage.packageId = dataItem.id;
                        optionalPackage.requiredPeriod = 0;
                        $scope.model.optionalPackageList.push(optionalPackage);
                    }
                },
                deSelect: function (dataItem) {
                    if ($scope.model.chooseType == 1) {
                        angular.forEach($scope.model.requiredPackageList, function (data, index) {
                            if (data.packageId == dataItem.id) {
                                $scope.model.requiredPackageList.splice(index, 1);
                                return;
                            }
                            });
                    } else if ($scope.model.chooseType == 2) {
                        angular.forEach($scope.model.optionalPackageList, function (data, index) {
                            if (data.id == dataItem.id) {
                                $scope.model.optionalPackageList.splice(index, 1);
                                return;
                            }
                        });
                    }
                },
                remove: function (e, type, id) {
                    if (type == 1) {
                        angular.forEach($scope.model.requiredPackageList, function (data, index) {
                            if (data.packageId == id) {
                                if($scope.model.coursePoolRuleDto.ruleType==1){
                                    $scope.model.coursePoolRuleDto.requiredPeriod =  $scope.model.coursePoolRuleDto.requiredPeriod-data.totalPeriod;
                                }
                                $scope.model.requiredPackageList.splice(index, 1);
                                return;
                            }
                        });
                    } else if (type == 2) {
                        angular.forEach($scope.model.optionalPackageList, function (data, index) {
                            if (data.id == id) {
                                $scope.model.optionalPackageList.splice(index, 1);
                                return;
                            }
                        });
                    }
                    e.preventDefault();
                },
                page: function (no) {
                    if (no > 0 && no <= $scope.model.pageCount) {
                        $scope.model.courseList.length = 0;
                        $scope.model.pageNo = no;
                        var data = {
                            pageNo: $scope.model.pageNo,
                            pageSize: 10,
                            poolId: $scope.model.poolId
                        };
                        coursePackageManagerService.findCourseInPoolPage(data).then(function (data) {
                            if (data.status) {
                                $scope.model.courseList = data.info;
                                $scope.model.pageCount = data.totalPageSize;
                                $scope.model.totalSize = data.totalSize;
                                $scope.utils.getPageList();
                            }
                        });
                    }
                },
                cancel: function (e) {
                    e.preventDefault();
                    $scope.globle.confirm('提示', '是否放弃编辑', function () {
                        $state.go('states.coursePoolRuleManager').then(function () {
                            $state.reload($state.current);
                        });
                    });
                }

            };

            $scope.utils = {
                isSelected: function (id) {
                    var isSelected = 0;// 0 --未选择 1--当前选择 2--必修包选择 3--选秀包选择
                    if ($scope.model.chooseType == 1 && $scope.model.requiredPackageList.length>0) {
                        angular.forEach($scope.model.requiredPackageList, function (data, index) {
                            if (data.packageId == id) {
                                isSelected = 1;
                                return isSelected;
                            }
                        });
                    }
                    if ($scope.model.chooseType == 2 && $scope.model.optionalPackageList.length > 0) {
                        angular.forEach($scope.model.optionalPackageList, function (data, index) {
                            if (data.id == id) {
                                isSelected = 1;
                                return isSelected;
                            }
                        });
                    }
                    if ($scope.model.chooseType == 1 && $scope.model.optionalPackageList.length > 0) {
                        angular.forEach($scope.model.optionalPackageList, function (data, index) {
                            if (data.id == id) {
                                isSelected = 3;
                                return isSelected;
                            }
                        });
                    }
                    if ($scope.model.chooseType == 2 &&$scope.model.requiredPackageList!=null  &&$scope.model.requiredPackageList.length > 0) {
                        angular.forEach($scope.model.requiredPackageList, function (data, index) {
                            if (data.packageId == id) {
                                isSelected = 2;
                                return isSelected;
                            }
                        });
                    }
                    return isSelected;
                },
                wrongChooseType: function (id) {
                    var result = false;
                    if ($scope.model.chooseType == 2 && $scope.model.requiredPackage.id == id) {
                        result = true;
                    } else if ($scope.model.chooseType == 1 && $scope.model.optionalPackage.id == id) {
                        result = true;
                    }
                    return result;
                },
                getPageList: function () {
                    $scope.model.pageList = [];
                    var start = 0;
                    if ($scope.model.pageNo <= 3) {
                        start = 0;
                    } else if ($scope.model.pageNo + 3 > $scope.model.pageCount) {
                        start = $scope.model.pageCount - 6;
                        if (start < 0) {
                            start = 0;
                        }
                    } else {
                        start = $scope.model.pageNo - 3;
                    }
                    for (var i = 1; i <= 6 && start + i <= $scope.model.pageCount; i++) {
                        $scope.model.pageList[i - 1] = start + i;
                    }
                },
                getOptionalPackageRequire: function () {
                    if ($scope.model.requiredPackageList.length==0) {
                        return $scope.model.coursePoolRuleDto.requiredPeriod;
                    } else {
                        var regu = '^[0-9]+(\\.[0-9]{1})?$';
                        var re = new RegExp(regu);
                        var less = 0;
                        if (re.test($scope.model.coursePoolRuleDto.requiredPeriod)) {
                            var less = $scope.model.coursePoolRuleDto.requiredPeriod -  $scope.utils.getRequiredPeriod();
                        }
                        return less < 0 ? 0 : less;
                    }
                },
                changeType: function (type) {
                    if (type != $scope.model.coursePoolRuleDto.ruleType) {
                        $scope.model.requiredPackageList.length = 0;
                        $scope.model.optionalPackageList.length = 0;
                        $scope.model.coursePoolRuleDto.requiredPeriod = 0;
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
                    if ($scope.model.forbidOptionalPackageRequires === false) {
                        angular.forEach($scope.model.optionalPackageList, function (data, index) {
                            if (re.test(data.requiredPeriod)) {
                                period = (Number(period) * 10 + Number(data.requiredPeriod) * 10) / 10;
                            }
                        });
                    } else {
                        period = $scope.utils.getOptionalPackageRequire();
                        //angular.forEach($scope.model.optionalPackageList, function (data, index) {
                        //    if ( re.test ( data.totalPeriod ) ) {
                        //        period = (Number(period)*10+Number(data.totalPeriod)*10)/10;
                        //    }
                        //});
                    }
                    return period;
                }
            };

            //=============分页开始=======================
            var gridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('<div class="t-w2" title="#: poolName #">');
                result.push('<a href="javascript:void(0)" ng-if="#: interest #" class="c-lab ng-scope">兴趣包</a>');
                result.push('<button class="table-btn"  ng-click="events.toListPage(dataItem)">#: poolName #</button>');

                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: createUnit #">');
                result.push('#: createUnit #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: courseCount #">');
                result.push('#: courseCount #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: totalPeriod #">');
                result.push('#: totalPeriod #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: isAuthorized #">');
                result.push('#: isAuthorized == 1 ? "-" : isAuthorized == 2 ? "未授权" : "已授权" #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div  title="#: authorizedStatus #">');
                result.push('#: authorizedStatus == "1" ? "授权使用中" :  "-" #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td class="op">');
                result.push('<button  ng-show="utils.isSelected(\'#: id #\')==0" type="button" class="table-btn"  ng-click="events.select(dataItem)">选择</button>');
                result.push('<button  ng-show="utils.isSelected(\'#: id #\')==1" type="button" class="table-btn"  ng-click="events.deSelect(dataItem)">取消选择</button>');
                result.push('<button  ng-show="utils.isSelected(\'#: id #\')==2" type="button" class="table-btn"  disabled >已被必修包选择</button>');
                result.push('<button  ng-show="utils.isSelected(\'#: id #\')==3" type="button" class="table-btn"  disabled >已被选修包选择</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate = result.join('');
            })();
            $scope.ui = {
                windows: {
                    coursePackageChooseOptions: {
                        modal: true,
                        content: '@systemUrl@/views/coursePoolRuleManager/historyCoursePackage.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        },
                        close: function () {
                            this.close;
                        }
                    },
                    courseListOptions: {
                        modal: true,
                        content: '@systemUrl@/views/coursePoolRuleManager/courseList.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        },
                        close: function () {
                            this.close;
                        }
                    }
                },
                coursePackageGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(gridRowTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/coursePoolAction/findCoursePoolPage',
                                    data: function (e) {
                                        var temp = {queryParam: {sort: e.sort}, page: {}},
                                            params = $scope.model.coursePackageParams;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key]) {
                                                    temp.queryParam[key] = params[key];
                                                }
                                            }
                                        }
                                        $scope.model.page.pageSize = e.pageSize;
                                        $scope.model.page.pageNo = e.page;
                                        temp.page.pageNo = e.page;
                                        temp.page.pageSize = $scope.model.page.pageSize;
                                        delete e.page;
                                        delete e.pageSize;
                                        return temp;
                                    },
                                    dataType: 'json'
                                }

                            },
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    return response;
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    return response.info;
                                } // 指定数据源
                            },
                            serverPaging: true, //远程获取书籍
                            serverSorting: true //远程排序字段
                        },
                        //selectable: true,
                        //sortable: {
                        //    mode: "single",
                        //    allowUnsort: false
                        //},
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50],
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {sortable: false, field: 'name', title: '课程包名称', width: 250},
                            {sortable: false, field: 'createUnit',title:'创建单位',width: 250},
                            {sortable: false, field: 'courseCount', title: '课程数'},
                            {sortable: false, field: 'totalPeriod', title: '课程包总学时'},
                            {sortable: false, field: 'isAuthorized', title: '是否授权'},
                            {sortable: false, field: 'authorizedStatus', title: '授权状态'},
                            {sortable: false, field: 'teacherName', title: '操作'}
                        ]
                    }
                }
            };
        }];
});
