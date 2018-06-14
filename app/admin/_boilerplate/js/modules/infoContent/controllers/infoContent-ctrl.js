define ( function () {
    'use strict';
    return ['$scope', 'infoContentService', '$state', '$stateParams', '$rootScope', function ( $scope, infoContentService, $state, $stateParams, $rootScope ) {

        //$scope.$watch('model.queryParam.regionPath', function (nV, oV) {
        //    if (oV !== nV ) {
        //        $scope.ui.selectTree.dataSource.read ();
        //    }
        //});
        $scope.model = {
            isSuperAdmin:null,
            /**
             * 分页查询参数
             */
            queryParam  : {
                title           : null,//资讯标题
                regionPath          : null == $stateParams.regionPath ? null : $stateParams.regionPath,//地区路径
                categoryType      : null == $stateParams.categoryType ? null : $stateParams.categoryType,//资讯分类id（一级分类或者二级分类）
                currentUnitId              : null == $stateParams.unitId ? null : $stateParams.unitId,//资讯所属单位
                status          : "-1",//资讯状态 -1 不查 0-草稿 1-已发布 2-定时发布
                publishTimeBegin: null,//发布开始时间
                publishTimeEnd  : null,//发布结束时间
                type            : 1//类型 1-资讯 2-弹窗公告 默认选择资讯
                //currentUnitId:null//当前单位id
            },
            /**
             * 分页参数
             */
            page        : {
                pageNo  : 1,
                pageSize: 10
            },
            categoryName: null == $stateParams.categoryName ? null : $stateParams.categoryName,//资讯分类名称，用于显示
            regionName: null == $stateParams.regionName ? null : $stateParams.regionName,//地区名称
            //控制分类选择树是否显示
            showTree    : false,

            //主页面列表数据
            newsList: [],
            //顶级单位列表
            unitInfoList : null
        };

        init ();
        function init() {
            infoContentService.isSuperAdmin().then(function(data){
                if(data.status){
                    $scope.model.isSuperAdmin = data.info;
                    if($scope.model.isSuperAdmin) {//是超级管理员
                        infoContentService.getTopUnitInfoList().then(function(dataInfo){//获取可选单位信息
                            if(dataInfo.status){
                                $scope.model.unitInfoList = dataInfo.info;

                                if($scope.model.queryParam.currentUnitId == null
                                    || $scope.model.queryParam.currentUnitId == ""){//没有当前单位
                                    infoContentService.getUserUnitId().then(function(dataTemp){
                                        $scope.model.queryParam.currentUnitId = dataTemp.info;
                                    });
                                }
                            }else{
                                $scope.globle.showTip("获取顶级单位列表出现异常", 'error');
                            }
                        });

                    }

                }else{
                    $scope.globle.showTip("获取管理员角色级别出现异常", 'error');
                }
            })
        };

        //$rootScope.$on('events:listPage', function (event, data) {
        //     = data.categoryName;
        //    $scope.events.query(data.e);
        //})
        $scope.node   = {
            newsPaper : null,
            selectTree: null
            //regionSelectTree: null
        };
        $scope.events = {
            changeSelect:function(){
                //关闭树显示
                $scope.model.showTree     = false;
                //清空类别选择对象
                $scope.model.queryParam.categoryType = "";
                $scope.model.categoryName  = "";
                //重新读取数据
                $scope.ui.selectTree.options.dataSource.read ();
            },
            /**
             * 打开分类树选择器
             * @param e
             */
            openTree      : function ( e ) {
                e.stopPropagation ();
                $scope.model.showTree = true;
            },
            /**
             * 选择分类
             * @param e
             */
            selectCategory: function ( e, dataItem ) {
                e.stopPropagation ();
                // 选择所有分类，则不查此条件
                if ( dataItem.id == "0" ) {
                    $scope.model.queryParam.categoryType = "";
                } else {
                    $scope.model.queryParam.categoryType = dataItem.categoryType;
                }
                $scope.model.categoryName = dataItem.name;
                $scope.model.showTree     = false;
            },
            /**
             * 选择地区分类
             * @param e
             */
            selectParentRegionCategory: function (e, dataItem) {
                e.stopPropagation();
                if(dataItem.hasChildren == true){
                    return;
                }else{
                    $scope.model.queryParam.regionPath = dataItem.regionPath;
                    $scope.model.regionName = dataItem.name;
                    $scope.model.showRegionTree = false;
                }
            },
            /**
             * 条件查询
             * @param e
             */
            query         : function ( e ) {
                if ( null == $scope.model.categoryName || $scope.model.categoryName == "" ) {
                    $scope.model.queryParam.categoryType = "";
                }
                //if ( null == $scope.model.regionName || $scope.model.regionName == "" ) {
                //    $scope.model.queryParam.regionPath = "";
                //}
                $scope.model.page.pageNo = 1;
                $scope.ui.newsPager.dataSource.page ( 1 );
                //init ();
            },
            /**
             * 输入框点击回车按钮
             * @param e
             */
            pressEnterKey : function ( e ) {
                if ( e.keyCode == 13 ) {
                    $scope.events.query ( e );
                }
            },
            /**
             * 发布
             * @param e
             * @param dataItem
             */
            publish       : function ( e, dataItem ) {
                e.stopPropagation ();
                infoContentService.checkPublishAble ( dataItem.id ).then ( function ( data ) {
                    if ( data.code === 200 ) {
                        $scope.globle.confirm ( "提示", "确认立即发布此资讯？", function ( dialog ) {
                            return infoContentService.publish ( dataItem.id ).then ( function ( data ) {
                                dialog.doRightClose ();
                                if ( data.status ) {
                                    $scope.ui.newsPager.dataSource.page ( $scope.model.page.pageNo );
                                    $scope.globle.showTip ( data.info, 'success' );
                                } else {
                                    $scope.globle.showTip ( "发布失败", 'error' );
                                }
                            } )
                        } )
                    } else {
                        $scope.globle.alert ( "提示", data.info );
                        $state.go ( "states.infoContent.publish", { id: dataItem.id } );
                    }
                } )
            },
            /**
             * 将发布状态或者定时发布状态的资讯变为草稿
             * @param e
             */
            toDraft       : function ( e, dataItem ) {
                $scope.globle.confirm ( "提示", "确认将该资讯置为草稿状态？", function ( dialog ) {
                    return infoContentService.toDraft ( dataItem.id ).then ( function ( data ) {
                        dialog.doRightClose ();
                        if ( data.status ) {
                            $scope.ui.newsPager.dataSource.page ( $scope.model.page.pageNo );
                            $scope.globle.showTip ( data.info, 'success' );
                        } else {
                            $scope.globle.showTip ( "操作失败", 'error' );
                        }
                    } )
                } )
            },
            /**
             * 删除资讯
             * @param e
             * @param dataItem
             */
            deleteById    : function ( e, dataItem ) {
                e.stopPropagation ();
                $scope.globle.confirm ( "提示", "确认删除该资讯？", function ( dialog ) {
                    return infoContentService.deleteById ( dataItem.id ).then ( function ( data ) {
                        dialog.doRightClose ();
                        if ( data.status ) {
                            $scope.ui.newsPager.dataSource.page ( $scope.model.page.pageNo );
                            var size = $scope.model.newsList.length;
                            if ( size == 1 && $scope.model.page.pageNo != 1 ) {
                                $scope.model.page.pageNo = $scope.model.page.pageNo - 1;
                                $scope.ui.newsPager.dataSource.page ( $scope.model.page.pageNo );
                            }
                            $scope.globle.showTip ( data.info, 'success' );
                        } else {
                            $scope.globle.showTip ( "删除失败", 'success' );
                        }
                    } )
                } )
            },
            /**
             * 在同一分类下置顶
             * @param e
             * @param dataItem
             */
            toTop         : function ( e, dataItem ) {
                e.stopPropagation ();
                $scope.globle.confirm ( "提示", "确定在该资讯所属的分类下置顶？", function ( dialog ) {
                    return infoContentService.toTop ( dataItem.id ).then ( function ( data ) {
                        dialog.doRightClose ();
                        if ( data.status ) {
                            $scope.ui.newsPager.dataSource.page ( $scope.model.page.pageNo );
                            $scope.globle.showTip ( data.info, 'success' );
                        } else {
                            $scope.globle.showTip ( "置顶失败", 'error' );
                        }
                    } );
                } );

            },
            /**
             * 跳转到新建资讯页面
             * @param e
             */
            toAddPage     : function ( e ) {
                $state.go ( "states.infoContent.add" );
                e.stopPropagation ();
            },
            /**
             * 跳转到修改页面
             * @param e
             * @param dataItem
             */
            toEditPage    : function ( e, dataItem ) {
                e.stopPropagation ();
                $state.go ( "states.infoContent.edit", { id: dataItem.id } );
            },
            /**
             * 跳转到详情页面
             * @param e
             * @param dataItem
             */
            toDetailPage  : function ( e, dataItem ) {
                e.stopPropagation ();
                $state.go ( "states.infoContent.view", { id: dataItem.id } );
            }

        };

        //=================分类树选择器数据源============================
        var dataSource = new kendo.data.HierarchicalDataSource ( {
            transport: {
                read: function ( options ) {
                    var id = options.data.id ? options.data.id : "";
                    $.ajax ( {
                        url     : "/web/admin/infoContent/findListByParent?parentId=" + id + "&status=-1&currentUnitId=" + $scope.model.queryParam.currentUnitId,
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        success : function ( result ) {
                            // notify the data source that the request succeeded
                            options.success ( result );
                        },
                        error   : function ( result ) {
                            // notify the data source that the request failed
                            options.error ( result );
                        }
                    } );
                }
            },
            schema   : {
                model: {
                    id         : "id",
                    hasChildren: true
                },
                data : function ( response ) {
                    return response.info;
                }
            }
        } );

        $scope.ui      = {
            datePicker: {
                begin: {
                    options: {
                        culture: "zh-CN",
                        format : "yyyy-MM-dd",
                        change : $scope.events.startChange
                    }
                },
                end  : {
                    options: {
                        culture: "zh-CN",
                        format : "yyyy-MM-dd",
                        change : $scope.events.endChange
                    }
                }
            },
            selectTree: {
                options: {
                    checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: dataSource
                }
            },
            newsPager : {
                refresh   : true,
                dataSource: new kendo.data.DataSource ( {
                    serverPaging: true,
                    page        : 1,
                    pageSize    : 5, // 每页显示的数据数目
                    transport   : {
                        parameterMap: function ( data, type ) {
                            var temp  = {
                                queryParam: {},
                                page      : { pageNo: data.page, pageSize: data.pageSize }
                            }, params = $scope.model.queryParam;
                            for ( var key in params ) {
                                if ( params.hasOwnProperty ( key ) ) {
                                    if ( params[key] ) {
                                        temp.queryParam[key] = params[key];
                                    }
                                }
                            }
                            $scope.model.page.pageNo   = data.page;
                            $scope.model.page.pageSize = data.pageSize;
                            delete data.page;
                            delete data.pageSize;
                            delete data.skip;
                            delete data.take;
                            return temp;
                        },
                        read        : {
                            url     : "/web/admin/infoContent/findPageByQuery",
                            dataType: 'json'
                        }
                    },
                    schema      : {
                        parse: function ( response ) {
                            // 将会把这个返回的数组绑定到数据源当中
                            if ( response.status ) {
                                return response;
                            } else {
                                $scope.globle.showTip ( '加载资讯的分页数据失败', 'error' );
                                return {
                                    status       : response.status,
                                    totalSize    : 0,
                                    totalPageSize: 0,
                                    info         : []
                                };
                            }
                        },
                        total: function ( response ) {
                            return response.totalSize;
                        },
                        data : function ( response ) {
                            $scope.model.newsList = response.info;
                            $scope.$apply ();
                            return response.info;
                        }
                    }
                } )
            }
        }
        $scope.ui.newsPager.dataSource.read ();


    }];
} );