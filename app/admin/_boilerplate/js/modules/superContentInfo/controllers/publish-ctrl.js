define(function () {
    'use strict';
    return ['$scope', 'superContentInfoService', 'superCategoryInfoService', '$state','$stateParams','KENDO_UI_EDITOR','$timeout',
        function ($scope, superContentInfoService, superCategoryInfoService, $state, $stateParams, KENDO_UI_EDITOR,$timeout) {
        $scope.libraryTreeShow = false;
        $scope.model={
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
                status:null,
                author:null,
                origin:null,
                publishTime:null,
                popStart:null,
                popOver:null,
                generalPortal:true//是否总门户数据(true是 false否)
            },
            //控制是否可以提交
            submitAble: true,
            //封面图片默认地址
            imgSrc:'/mfs/resource/file/defaultImage.jpg',
            //一级分类集合
            firstCategoryIdList:[],
            //二级分类集合
            secondCategoryIdList:[]
        };

            init ();
            function init() {
                superContentInfoService.isSuperAdmin().then(function(data){
                    if(data.status){
                        $scope.model.isSuperAdmin = data.info;
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
        $scope.$watch('model.uploader',function(newVal){
            if(newVal){
                var a=angular.fromJson(newVal);
                $scope.model.newsDto.photoUrl= a.newPath;
                $scope.model.imgSrc='/mfs' + a.newPath;
            }
        });
	    $scope.$watch('model.newsDto.type', function (newVal) {
            if(newVal === '0'){
                $scope.node.popBeginTime = null;
                $scope.node.popEndTime = null;
                $scope.model.newsDto.popStart = null;
                $scope.model.newsDto.popOver = null;
            }
        });

        superContentInfoService.findForUpdate($stateParams.id).then(function(data){
            if(data.status){
                $scope.model.newsDto.id=data.info.id;
                $scope.model.newsDto.title=data.info.title;
                $scope.model.newsDto.content=data.info.content;
                $scope.model.newsDto.photoUrl=data.info.photoUrl;
                if(data.info.photoUrl!==""&&null!=data.info.photoUrl){
                    $scope.model.imgSrc="/mfs"+data.info.photoUrl;
                }
                $scope.model.lastPublishTime = $scope.model.newsDto.publishTime;

                if (data.info.secondLevelCategoryId!=null){
                    $scope.model.newsDto.secondLevelCategoryId=data.info.secondLevelCategoryId;
                }else {
                    $scope.model.newsDto.firstLevelCategoryId=data.info.firstLevelCategoryId;
                }


                $scope.model.newsDto.status = data.info.status;
                $scope.model.newsDto.publishTime=data.info.publishTime;
                $scope.model.newsDto.type=data.info.type;
                $scope.model.newsDto.popStart=data.info.popStart;
                $scope.model.newsDto.popOver =data.info.popOver;
                if($scope.model.newsDto.secondLevelCategoryId != null && $scope.model.newsDto.secondLevelCategoryId !== ''){
                    superCategoryInfoService.findForDetail($scope.model.newsDto.secondLevelCategoryId).then(function (cate) {
                        if(data.status){
                            $scope.model.categoryName = cate.info.name;
                        }else{
                            $scope.globle.showTip("查询资讯错误，请重新进入编辑", 'error');
                        }
                    })
                }else {
                    superCategoryInfoService.findForDetail($scope.model.newsDto.firstLevelCategoryId).then(function (cate) {
                        if(data.status){
                            $scope.model.categoryName = cate.info.name;
                        }else{
                            $scope.globle.showTip("查询资讯错误，请重新进入编辑", 'error');
                        }
                    })
                }
            }else{
                $scope.globle.showTip("获取资讯信息失败", 'error');
            }
        });
        //=================分类树选择器数据源============================
        var dataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    var id = options.data.id ? options.data.id : "";
                    $.ajax({
                        url: "/web/admin/infoContent/findListByParent?parentId=" + id + "&status=1&generalPortal=true",
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
        $scope.ui={
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
            publishTime:{
                options: {
                    culture: "zh-CN",
                    format: "yyyy-MM-dd HH:mm:ss",
                    //value: new Date(),
                    interval:20 ,//分钟间隔
                    // min: new Date()
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
            /**
             * 选择分类
             * @param e
             */
            selectParentCategory: function (e, dataItem) {
                e.stopPropagation();
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
            deletePhotoUrl:function(e){
                e.stopPropagation();
                $scope.model.newsDto.photoUrl= "";
                $scope.model.imgSrc='/mfs/resource/file/defaultImage.jpg';
            },
            /**
             * 根据父id查询子分类
             */
            findCategoryListByParentId:function(parentId){
                superContentInfoService.findListByParent(parentId,1).then(function(data){
                    if(data.status){
                        if(parentId==="0"){
                            $scope.model.firstCategoryIdList=[];
                            $scope.model.firstCategoryIdList = data.info;
                        }else{
                            $scope.model.secondCategoryIdList = [];
                            $scope.model.secondCategoryIdList = data.info;
                        }
                    }else{
                        $scope.globle.showTip("获取分类出现异常", 'error');
                    }
                })
            },
            /**
             * 选择一级分类时，查询二级分类数据
             * @param e
             */
            selectFirstCategoryId: function () {
                if(null!==$scope.model.newsDto.firstLevelCategoryId&&$scope.model.newsDto.firstLevelCategoryId!==''){
                    this.findCategoryListByParentId($scope.model.newsDto.firstLevelCategoryId);
                } else {
                    $scope.model.secondCategoryIdList = [];
                }

            },
            /**
             * 发布、定时发布
             * @param e
             */
            publish:function(e,type){
                e.stopPropagation();
                if ($scope.model.newsDto.type ==2){
                    if ($scope.model.newsDto.popOver<=$scope.model.newsDto.popStart){
                        $scope.globle.alert('提示', '弹窗公告的结束时间需大于起始时间');
                        return ;
                    }
                }
                //发布
                $scope.model.submitAble=false;

                $scope.model.newsDto.status=1;
                superContentInfoService.update($scope.model.newsDto).then(function(data){
                    if(data.status){
                        $scope.model.submitAble=false;
                        $scope.globle.showTip("发布成功", 'success');
                        $state.go('states.superContentInfo').then(function () {
                            $state.reload($state.current);
                        });
                    }else{
                        $scope.model.submitAble=true;
                        $scope.globle.alert('提示', data.info);
                    }
                })

            }
        };
        //$scope.events.findCategoryListByParentId("0");
    }];
});