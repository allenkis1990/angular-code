define(function () {
    'use strict';
    return ['$scope', 'infoContentService', 'infoCategoryService', '$state', '$stateParams','KENDO_UI_EDITOR','$timeout', function ($scope, infoContentService, infoCategoryService, $state, $stateParams, KENDO_UI_EDITOR,$timeout) {
        $scope.libraryTreeShow = false;
        $scope.model = {
            isSuperAdmin:null,
            showRegionTree:false,
            regionName:null,

            showTree:false,
            categoryName:null,
            lastPublishTime:null,
            /**
             * 新增时提交的dto
             */
            newsDto:{
                id:null,
                title:null,
                type:'1', //默认1资讯,2公告
                photoUrl:null,
                content:null,
                firstLevelCategoryId:null,
                secondLevelCategoryId:null,
                categoryType:null,
                status:null,
                author:null,
                origin:null,
                publishTime:null,
                //ifPop:'0', //0不弹窗、1弹窗
                popStart:null,
                popOver:null,
                currentUnitId:null//当前单位id
            },
            //控制是否可以提交
            submitAble: true,
            //封面图片默认地址
            imgSrc:'/mfs/resource/file/defaultImage.jpg',
            //一级分类集合
            firstCategoryIdList: [],
            //二级分类集合
            secondCategoryIdList: [],
            //顶级单位列表
            unitInfoList : ''
        };

        init ();
        function init() {
            infoContentService.isSuperAdmin().then(function(data){
                if(data.status){
                    $scope.model.isSuperAdmin = data.info;

                    if($scope.model.isSuperAdmin){//是超级管理员
                        infoContentService.getTopUnitInfoList().then(function(dataInfo){
                            $scope.model.unitInfoList = dataInfo.info;
                        });
                    }
                }else{
                    $scope.globle.showTip("获取管理员角色级别出现异常", 'error');
                }
            })
        };
        $scope.node={
            selectTree: null,
            publishTime:null,//发布时间控件
            popBeginTime:null,
            popEndTime:null
        };
        //监控封面图片是否上传
        $scope.$watch('model.uploader', function (newVal) {
            if (newVal) {
                var a = angular.fromJson(newVal);
                $scope.model.newsDto.photoUrl= a.convertResult[0].url;
                $scope.model.imgSrc='/mfs' + a.convertResult[0].url;
            }
        });
	    $scope.$watch('model.newsDto.type', function (newVal) {
            if(newVal === '2'){
                $scope.node.popBeginTime = null;
                $scope.node.popEndTime = null;
                $scope.model.newsDto.popStart = null;
                $scope.model.newsDto.popOver = null;
            }
        });
        infoContentService.findForUpdate($stateParams.id).then(function (data) {
            if (data.status) {
                $scope.model.newsDto = angular.copy(data.info);
                $scope.model.newsDto.currentUnitId = data.info.unitId;
                if (data.info.photoUrl !== "" && null != data.info.photoUrl) {
                    $scope.model.imgSrc = "/mfs" + data.info.photoUrl;
                }
                $scope.model.lastPublishTime = $scope.model.newsDto.publishTime;
                if($scope.model.newsDto.secondLevelCategoryId != null && $scope.model.newsDto.secondLevelCategoryId !== ''){
                    infoCategoryService.findForDetail($scope.model.newsDto.secondLevelCategoryId).then(function (cate) {
                        if(data.status){
                            $scope.model.newsDto.firstLevelCategoryId=null;
                            $scope.model.categoryName = cate.info.name;
                        }else{
                            $scope.globle.showTip("查询资讯错误，请重新进入编辑", 'error');
                        }
                    })
                }else {
                    infoCategoryService.findForDetail($scope.model.newsDto.firstLevelCategoryId).then(function (cate) {
                        if(data.status){
                            $scope.model.categoryName = cate.info.name;
                        }else{
                            $scope.globle.showTip("查询资讯错误，请重新进入编辑", 'error');
                        }
                    })
                }

                //if($scope.model.newsDto.regionPath != null && $scope.model.newsDto.regionPath !== ''){
                //    infoContentService.findRegionById($scope.model.newsDto.regionPath).then(function (cate) {
                //        if(data.status){
                //            $scope.model.regionName = cate.info.name;
                //        }else{
                //            $scope.globle.showTip("查询资讯错误，请重新进入编辑", 'error');
                //        }
                //    })
                //}


            } else {
                $scope.globle.showTip("获取资讯信息失败", 'error');
            }
        });
        //=================分类树选择器数据源============================
        var dataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    console.log(options.data.id);
                    var id = options.data.id ? options.data.id : "";
                    $.ajax({
                        url: "/web/admin/infoContent/findListByParent?parentId=" + id + "&status=1&currentUnitId=" + $scope.model.newsDto.currentUnitId,
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        success: function (result) {
                            // notify the data source that the request succeeded
                            options.success(result);
                        },
                        error: function (result) {
                            // notify the data source that the request failed
                            options.error(result);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: "id",
                    hasChildren: true
                },
                data: function (response) {
                    return response.info;
                }
            }
        });

        $scope.ui = {
            selectTree: {
                options: {
                    checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: dataSource
                }
            },
	      popTime: {
              begin: {
                  options: {
                      culture: "zh-CN",
                      format: "yyyy-MM-dd HH:mm:ss",
                      interval: 20,//分钟间隔
                      change: $scope.events.startChange
                  }
              },
              end: {
                  options: {
                      culture: "zh-CN",
                      format: "yyyy-MM-dd HH:mm:ss",
                      interval: 20,//分钟间隔
                      change: $scope.events.endChange
                  }
              }
            },
            publishTime: {
                options: {
                    culture: "zh-CN",
                    format: "yyyy-MM-dd HH:mm:ss",                  
                    interval: 20,
                    close:function () {
                        var publishTime = $scope.model.newsDto.publishTime;
                        publishTime = publishTime.split(" ")[0];
                        var today = new Date();
                        var year = today.getFullYear();
                        var month = today.getMonth()+1;
                        var day = today.getDate();

                        if (month>=0 && month<=9){
                            month="0"+month;
                        }
                        if (day>=0 && day<=9){
                            day="0"+day;
                        }
                        //当前日期
                        var date = year+"-"+month+"-"+day;
                        // //如果日期等于今天的日期且上次的日期不是今天的日期，说明是第一次点击进入当前日期，显示当前时间
                        if (publishTime==date && $scope.model.lastPublishTime!=date){
                            var hour = today.getHours();
                            var min = today.getMinutes();
                            var second = today.getSeconds();
                            if (hour>=0 && hour<=9){
                                hour="0"+hour;
                            }
                            if (min>=0 && min<=9){
                                min="0"+min;
                            }
                            if (second>=0 && second<=9){
                                second="0"+second;
                            }
                            date = date+" "+hour+":"+min+":"+second;
                            $timeout(function () {
                                $scope.model.newsDto.publishTime=date;
                            });
                        }
                        // //将日期存起来和下次比对
                        $scope.model.lastPublishTime = publishTime;

                    }
                }
            },
            editor: KENDO_UI_EDITOR
        };
        $scope.events={
            changeSelect:function(){
                //关闭树显示
                $scope.model.showTree     = false;
                //清空类别选择对象
                $scope.model.newsDto.categoryType = "";
                $scope.model.categoryName  = "";
                //重新读取数据
                $scope.ui.selectTree.options.dataSource.read ();
            },
            /**
             * 选择分类
             * @param e
             */
            selectParentCategory: function (e, dataItem) {
                e.stopPropagation();
                if ($scope.model.newsDto.currentUnitId==null && $scope.model.isSuperAdmin==true){
                    $scope.globle.alert('提示', '请选择资讯所属单位');
                    return ;
                }
                if(dataItem.categoryLevel === 1){
                    $scope.model.newsDto.firstLevelCategoryId = dataItem.id;
                    $scope.model.newsDto.secondLevelCategoryId = null;
                }else if(dataItem.categoryLevel === 2){
                    $scope.model.newsDto.secondLevelCategoryId = dataItem.id;
                    $scope.model.newsDto.firstLevelCategoryId = null;
                }else if(dataItem.categoryLevel === 0){
                    $scope.model.newsDto.secondLevelCategoryId = null;
                    $scope.model.newsDto.firstLevelCategoryId = dataItem.id;
                }
                $scope.model.newsDto.categoryType = dataItem.categoryType;
                $scope.model.categoryName = dataItem.name;
                $scope.model.showTree = false;
            },

            passPop: function () {
                if(parseInt($scope.model.newsDto.type) === 2){
                    if($scope.model.newsDto.popStart === null || $scope.model.newsDto.popOver === null || $scope.model.newsDto.popStart === '' || $scope.model.newsDto.popOver === ''){
                        return false;
                    }
                }
                return true;
            },
            /**
             * 删除选中的封面图片
             * @param e
             */
            deletePhotoUrl: function (e) {
                e.stopPropagation();
                $scope.model.newsDto.photoUrl = "";
                $scope.model.imgSrc = '/mfs/resource/file/defaultImage.jpg';
            },
            /**
             * 根据父id查询子分类
             */
            findCategoryListByParentId: function (parentId) {
                infoContentService.findListByParent(parentId, 1).then(function (data) {
                    if (data.status) {
                        if (parentId === "0") {
                            $scope.model.firstCategoryIdList = [];
                            $scope.model.firstCategoryIdList = data.info;
                        } else {
                            $scope.model.secondCategoryIdList = [];
                            $scope.model.secondCategoryIdList = data.info;
                        }
                    } else {
                        $scope.globle.showTip("获取分类出现异常", 'error');
                    }
                })
            },
            /**
             * 选择一级分类时，查询二级分类数据
             * @param e
             */
            selectFirstCategoryId: function () {
                if (null !== $scope.model.newsDto.firstLevelCategoryId && $scope.model.newsDto.firstLevelCategoryId !== '') {
                    this.findCategoryListByParentId($scope.model.newsDto.firstLevelCategoryId);
                } else {
                    $scope.model.secondCategoryIdList = [];
                }

            },
            /**
             * 发布、定时发布
             * @param e
             */
            publish: function (e, type) {
                e.stopPropagation();
                if($scope.model.newsDto.title==null||$scope.model.newsDto.title==''){
                    $scope.globle.alert('提示', '请输入资讯标题');
                    return ;
                }
                if($scope.model.newsDto.content==null ||$scope.model.newsDto.content==''){
                    $scope.globle.alert('提示', '资讯内容不能为空');
                    return ;
                }
                if ($scope.model.newsDto.firstLevelCategoryId==null&&$scope.model.newsDto.secondLevelCategoryId==null){
                    $scope.globle.alert('提示', '请选择资讯分类');
                    return ;
                }
                if ($scope.model.newsDto.currentUnitId==null && $scope.model.isSuperAdmin==true){
                    $scope.globle.alert('提示', '请选择资讯所属单位');
                    return ;
                }
                if ($scope.model.newsDto.type ==2){
                    if ($scope.model.newsDto.popOver<=$scope.model.newsDto.popStart){
                        $scope.globle.alert('提示', '弹窗公告的结束时间需大于起始时间');
                        return ;
                    }
                }

                $scope.model.submitAble = false;
                //发布
                $scope.model.newsDto.status = 1;
                infoContentService.update($scope.model.newsDto).then(function (data) {
                    if (data.status) {
                        $scope.model.submitAble = false;
                        $scope.globle.showTip(data.info, 'success');
                        $state.go('states.infoContent').then(function () {
                            $state.reload($state.current);
                        });
                    } else {
                        $scope.model.submitAble = true;
                        $scope.globle.alert('提示', data.info);
                    }
                })

            },
            /**
             * 保存草稿
             * @param e
             */
            saveAsDraft: function (e) {
                e.stopPropagation();
                $scope.model.submitAble = false;
                $scope.model.newsDto.status = 0;
                infoContentService.update($scope.model.newsDto).then(function (data) {
                    if (data.status) {
                        $scope.model.submitAble = false;
                        $scope.globle.showTip(data.info, 'success');
                        $state.go('states.infoContent').then(function () {
                            $state.reload($state.current);
                        });
                    } else{
                        if(data.code === 500){
                            $scope.globle.alert("提示", data.info);
                        }else{
                            $scope.globle.showTip("保存草稿失败", 'error');
                        }
                        $scope.model.submitAble=true;
                    }
                })
            }
        };
        //$scope.events.findCategoryListByParentId("0");
    }];
});