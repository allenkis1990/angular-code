define(function () {
    'use strict';
    return ['$scope', '$q', 'service', 'hbUtil', 'HB_dialog', '$state', 'hbSkuService', function ($scope, $q, importStudentService, hbUtil, HB_dialog, $state, hbSkuService) {
        $scope.model = {
            upload: {},
            importUser: {
                passWordType: 1
            },

            classPage: {
                pageNo: 1,
                pageSize: 10
            },
            configedQueryParam: {
                categoryType: 'TRAINING_CLASS_GOODS',
                trainingSchemeEnabled:'1',
                commoditySkuState:'1',
                saleState       : '-1'
            }
        };

        //已配置模板
        var classGridRowTemplate = '';
        (function () {
            var result = [];
            result.push ( '<tr>' );

            result.push('<td>');
            result.push('#: index #');
            result.push('</td>');

            result.push ( '<td>' );
            result.push ( '#:commodityName#' );
            result.push ( '</td>' );

            result.push('<td>');
            /*result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
            result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
            result.push('</div>');*/
            result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
            result.push('<span ng-if="item.skuPropertyName===\'科目\'">科目：<span ng-bind="item.skuPropertyValueName"></span></span>');
            result.push('<span ng-if="item.skuPropertyName===\'班级类型\'">班级类型：<span ng-bind="item.skuPropertyValueName"></span></span>');
            result.push('<span ng-if="item.skuPropertyName===\'年度\'">继续教育年度：<span ng-bind="item.skuPropertyValueName"></span></span>');
            result.push('</div>');
            result.push('</td>');

            result.push ( '<td>' );
            result.push ( '#: trainingBeginTime #' + ' 至 <br>' + '#: trainingEndTime #');
            result.push ( '</td>' );

            result.push ( '<td>' );
            result.push('<span ng-if="dataItem.trainingSchemeStatus===1">正常</span>');
            result.push('<span ng-if="dataItem.trainingSchemeStatus===2">停用</span>');
            result.push ( '</td>' );

            result.push ( '<td>' );
            result.push('<span ng-if="dataItem.commoditySkuState===1">已上架</span>');
            result.push('<span ng-if="dataItem.commoditySkuState===2">待上架</span>');
            result.push('<span ng-if="dataItem.commoditySkuState===3">已下架</span>');
            result.push ( '</td>' );

            result.push ( '<td>' );
            result.push('<span ng-if="dataItem.onSaleTime!==null && dataItem.futureOffShelvesTime===null"><span ng-bind="dataItem.onSaleTime"></span></span>');
            result.push('<span ng-if="dataItem.onSaleTime!==null && dataItem.futureOffShelvesTime!==null">' +
                '<span ng-bind="dataItem.onSaleTime"></span> 至 <br><span ng-bind="dataItem.futureOffShelvesTime"></span></span>');
            result.push('<span ng-if="dataItem.onSaleTime===null && dataItem.futureOffShelvesTime===null">-</span>');
            result.push ( '</td>' );

            result.push ( '<td>' );
            result.push ( '#: price #' );
            result.push ( '</td>' );

            result.push ( '<td>' );
            result.push ( '<span ng-if="#:saleState==1#">已售</span>' + '<span ng-if="#:saleState==2#">未售</span>' );
            result.push ( '</td>' );

            result.push ( '<td>' );
            result.push ( '#: firstUpTime #' );
            result.push ( '</td>' );

            result.push ( '</tr>' );
            classGridRowTemplate = result.join('');
        })();

        $scope.kendoPlus = {
            classGridInstance: null,
            windowOptions    : {
                modal    : true,
                visible  : false,
                resizable: false,
                draggable: false,
                title    : false,
                open     : function () {
                    this.center ();
                }
            },
            classGrid: {
                options: hbUtil.kdGridCommonOption ( {
                    template: classGridRowTemplate,
                    url     : "/web/admin/commodityManager/getFaceToFaceClassConfigDone",
                    scope   : $scope,
                    page    : 'classPage',
                    param   : $scope.model.configedQueryParam,
                    skuParam:'skuParamsConfiged',
                    fn      : function ( response ) {
                        $scope.configedArr = response.info;
                    },
                    columns : [
                        { field: "index", title: "No", sortable: false, width: 50},
                        { field: "trainingProgramName", title: "培训方案名称", sortable: false },
                        { field: "attribute", title: "属性", sortable: false, width: 150 },
                        { field: "trainingTime", title: "培训时间", sortable: false, width: 150 },
                        { field: "trainingProgramStatus", title: "培训方案状态", sortable: false, width: 120 },
                        { field: "salesStatus", title: "销售状态", sortable: false, width: 80 },
                        { field: "salesTime", title: "销售时间", sortable: false, width: 150 },
                        { field: "price", title: "定价", sortable: false, width: 80 },
                        { field: "saleState", title: "是否售出", sortable: false, width: 80 },
                        { field: "firstUpTime", title: "首次上架时间", sortable: false, width: 150}
                    ]
                } )
            }
        };


        $scope.events = {


            openKendoWindow: function (windowName) {
                $scope[windowName].center().open();
            },

            closeKendoWindow: function (windowName) {
                $scope[windowName].close();
            },

            mainPageQueryList: function (e, gridName, pageName) {
                e.stopPropagation();
                $scope.model[pageName].pageNo = 1;
                $scope.kendoPlus[gridName].pager.page(1);
            },


            //导入
            importOpenUser: function (e) {
                e.preventDefault();

                var uploadResult = $scope.model.upload.result;
                if (!uploadResult) {
                    $scope.globle.showTip('请选择文件', 'warning');
                    return false;
                }
                if($scope.model.importUser.passWordType==3){
                    if(!$scope.model.importUser.password){
                        $scope.globle.showTip ( '密码不能为空', "warning" );
                        return false;

                    } else {
                        if($scope.model.importUser.password.length<6||$scope.model.importUser.password.length>12){
                            $scope.globle.showTip ( '密码必须在6-12位之间', "warning" );
                            return false;
                        }
                    }
                }

                importStudentService.importOpenUser({
                    implementProject: 'COURSE_SUPERMARKET_V2',
                    filePath: uploadResult.newPath,
                    fileName: uploadResult.fileName,
                    passWordType         : $scope.model.importUser.passWordType,
                    password             : $scope.model.importUser.password,
                }).then(function (data) {
                    if (!data.status || !data.info) {
                        $scope.globle.showTip(data.info, 'error');
                    } else {
                        $scope.model.upload = {};
                        $scope.model.importUser.password = '';

                        // 弹窗提示页面跳转
                        HB_dialog.contentAs($scope, {
                            title: '提示',
                            width: 350,
                            height: 170,
                            confirmText: '查看任务进度',
                            cancelText: '确定',
                            sure: function (wow) {
                                var defer = $q.defer(),
                                    promise = defer.promise;
                                $state.go('states.importOpenClassTask', {
                                    groupType: 'DISTRIBUTOR_OPEN'
                                });
                                defer.resolve();
                                wow.close();
                                return promise;
                            },
                            templateUrl: '@systemUrl@/views/importClassOpen/dialogFile.html'
                        });
                    }
                });
            }
        };

        //验证是否为空
        function validateIsNull (obj) {
            return (obj === '' || obj === undefined || obj === null);
        }

        importStudentService.downloadTemplate().then(function (data) {
            if (data.status) {
                $scope.urlPrefix = data.info.downModelIP;
            }
        });

    }];
});
