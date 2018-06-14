define ( function () {
    'use strict';
    return ['$scope', '$log', 'superCategoryInfoService', '$state', '$stateParams', 'TabService', function ( $scope, $log, superCategoryInfoService, $state, $stateParams, TabService ) {
        $scope.node   = {
            newsCategoryTreeList    : null,
            newsCategoryInfoWindow  : null,
            detailNewsCategoryWindow: null,
            selectTree              : null
        };
        $scope.ui     = {};
        $scope.events = {};

        $scope.model = {
            /**
             * 查询参数条件
             */
            condition  : {
                parentId: '0',
                name    : null,
                status  : "-1",
                generalPortal : true
            },
            /**
             * 新增、修改提交的dto
             */
            dto        : {
                id         : null,
                parentId   : null,
                parentName : null,
                name       : null,
                description: null,
                level      : null,
                generalPortal      : true
            },
            /**
             * 详情
             */
            detailInfo : {
                id         : null,
                parentName : null,
                name       : null,
                description: null,
                status     : null,
                newsCount  : null,
                categoryType  : null
            },
            //操作类型：新增、修改
            operateType: "",
            //控制分类选择树是否显示
            showTree   : false,
            //控制是否可以提交
            submitAble : false
        };

        /**
         * 分类树选择器
         */
        $scope.windowOptions = {
            modal    : true,
            visible  : false,
            title    : false,
            resizable: false,
            draggable: false,
            open     : function () {
                this.center ();
            }
        };

        //=================分类树选择器数据源============================
        var dataSource = new kendo.data.HierarchicalDataSource ( {
            transport: {
                read: function ( options ) {
                    var id = options.data.id ? options.data.id : "";
                    $.ajax ( {
                        url     : "/web/admin/infoCategory/findAllSubListByParent?parentId=" + id + "&status=1&generalPortal=true",
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
                    $.each ( response.info, function ( i, data ) {
                        if ( data.parentId == '0' ) {
                            data.hasChildren = false;
                        }
                        if ( $scope.model.dto.id != null && $scope.model.dto.id != "" ) {
                            //修改时如果顶级，则自能显示虚拟节点
                            if ( $scope.model.dto.parentId == "0" ) {
                                data.hasChildren = false;
                            }
                        }
                    } );
                    return response.info;
                }
            }
        } );

        var uiTemplate         = {
            newsCategoryTreeListRow: function () {
                var result = [];

                result.push ( '<td width="200" class="op">' );
                result.push ( '<button has-permission="infoCategory/findInfoCategory" ng-click="events.detail($event, dataItem)" class="table-btn">查看</button>' );
                result.push ( '<button has-permission="infoCategory/updateInfoCategory" ng-click="events.edit($event, dataItem)" has-permission="infoCategory/updateInfoCategory" class="table-btn">编辑</button>' );
                result.push ( '<button has-permission="infoCategory/deleteInfoCategory" ng-click="events.dealDelete($event, dataItem)" class="table-btn">删除</button>' );
                result.push ( '<button has-permission="infoCategory/startInfoCategory" ng-show="dataItem.status == 0" title="#: status#" ng-click="events.dealStart($event, dataItem)" class="table-btn">启用</button>' );
                result.push ( '<button has-permission="infoCategory/stopInfoCategory" ng-show="dataItem.status == 1" title="#: status#" ng-click="events.dealStop($event, dataItem)" class="table-btn">停用</button>' );
                result.push ( '</td>' );

                return result.join ( '' );
            }
        };
        //题库树列表
        $scope.treelistOptions = {
            dataSource: {
                transport: {
                    read: function ( e ) {
                        var parentId = e.data.id == undefined ? '0' : e.data.id;
                        superCategoryInfoService.findTreeListData ( $scope.model.condition ).then ( function ( result ) {
                            if ( result.info.length < 1 && parentId == '0' ) {
                                $scope.noData = true;
                            }
                            $.each ( result.info, function ( i, data ) {
                                if ( data.parentId == '0' )
                                    data.parentId = null;
                            } );
                            e.success ( result.info );
                        } );
                    }
                },
                schema   : {
                    //顶级节点的parentId必须为空！
                    model: {
                        id: "id"
                    }
                }
            },
            messages  : {
                loading: "正在加载资讯分类数据...",
                noRows : "暂无资讯分类数据",
                retry  : "reload"
            },
            sortable  : true,
            editable  : true,
            expand    : function ( e ) {
                $scope.model.condition.parentId = e.model.id;
            },
            columns   : [
                { field: "name", title: "分类名称", attributes: { style: "text-align: left" }, width: "300px" },
                { field: "description", attributes: { style: "text-align: left" }, title: "分类说明" },
                { field: "newsCount", title: "资讯数量", width: "80px" },
                { field: "status", title: "状态", width: "80px", template: '#: status == 1 ? "启用" : "停用" #' },
                {
                    title   : '操作', width: '200px',
                    template: uiTemplate.newsCategoryTreeListRow

                }
            ]
        };
        $scope.ui              = {
            newsCategoryInfoWindow  : {
                title  : false,
                modal  : true,
                visible: false
            },
            detailNewsCategoryWindow: {
                title  : false,
                modal  : true,
                visible: false
            },
            selectTree              : {
                options: {
                    checkboxes: false,
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: dataSource
                }
            }
        };

        $scope.events = {
            /**
             * 打开分类树选择器
             * @param e
             */
            openTree                  : function ( e ) {
                e.stopPropagation ();
                $scope.model.showTree = true;
            },
            /**
             * 选择分类
             * @param e
             */
            selectParentCategory      : function ( e, dataItem ) {
                e.stopPropagation ();
                $scope.model.dto.parentId   = dataItem.id;
                $scope.model.dto.parentName = dataItem.name;
                $scope.model.dto.level      = dataItem.categoryLevel;
                $scope.model.showTree       = false;
            },
            /**
             * 获取要修改的分类信息
             * @param e
             * @param dateItem
             */
            edit                      : function ( e, dateItem ) {
                e.stopPropagation ();
                superCategoryInfoService.findForUpdate ( dateItem.id ).then ( function ( data ) {
                    if ( data.status ) {
                        $scope.model.dto.id          = data.info.id;
                        $scope.model.dto.parentId    = data.info.parentId;
                        $scope.model.dto.parentName  = data.info.parentName;
                        $scope.model.dto.name        = data.info.name;
                        $scope.model.dto.description = data.info.description;
                        $scope.model.dto.level       = data.info.level;
                        $scope.node.selectTree.dataSource.read ();
                    } else {
                        $scope.globle.alert ( "提示", data.info );
                        return;
                    }
                } );
                this.openNewsCategoryInfoWindow ( e, "编辑分类" );
            },
            /**
             * 打开新增/编辑窗口
             * @param e 事件源
             */
            openNewsCategoryInfoWindow: function ( e, type ) {
                e.stopPropagation ();
                $scope.model.submitAble  = true;
                $scope.model.showTree    = false;
                $scope.model.operateType = type;
                $scope.node.selectTree.dataSource.read ();
                $scope.node.newsCategoryInfoWindow.center ().open ();
            },

            /**
             * 关闭新增、编辑窗口
             * @param e 事件源
             */
            closeNewsCategoryInfoWindow: function ( e ) {
                e.stopPropagation ();
                $scope.model.dto.id          = "";
                $scope.model.dto.parentId    = "";
                $scope.model.dto.parentName  = "";
                $scope.model.dto.name        = "";
                $scope.model.dto.description = "";
                $scope.model.dto.level       = "";
                $scope.node.newsCategoryInfoWindow.close ();
            },

            /**
             * 保存咨询分类信息
             * @param e 事件源
             */
            save: function ( e ) {
                e.stopPropagation ();
                $scope.model.submitAble = false;
                if ( $scope.model.dto.id != null && $scope.model.dto.id != "" && $scope.model.dto.level == 2 && $scope.model.dto.parentId == "0" ) {
                    $scope.globle.alert ( "提示", "二级分类不允许被移动到一级分类" );
                    $scope.model.submitAble = true;
                    return;
                }
                superCategoryInfoService.save ( $scope.model.dto ).then ( function ( data ) {
                    if ( data.status ) {
                        $scope.globle.showTip ( data.info, 'success' );
                        $scope.events.closeNewsCategoryInfoWindow ( e );
                        $scope.model.condition.parentId = "0";
                        $scope.node.newsCategoryTreeList.dataSource.read ();
                    } else {
                        $scope.model.submitAble = true;
                        $scope.globle.alert ( "提示", data.info );
                    }
                } );
                e.stopPropagation ();
            },

            /**
             * 查看详情
             * @param e
             * @param item
             */
            detail: function ( e, dateItem ) {
                e.stopPropagation ();
                superCategoryInfoService.findForDetail ( dateItem.id ).then ( function ( data ) {
                    if ( data.status ) {//parentName: null,name: null,description: null,status: null,newsCount: null
                        $scope.model.detailInfo.id          = dateItem.id;
                        $scope.model.detailInfo.parentName  = data.info.parentName;
                        $scope.model.detailInfo.name        = data.info.name;
                        $scope.model.detailInfo.description = data.info.description;
                        $scope.model.detailInfo.status      = data.info.status;
                        $scope.model.detailInfo.newsCount   = data.info.newsCount;
                        $scope.model.detailInfo.categoryType = data.info.categoryType;

                        $scope.model.detailInfo.internal = data.info.internal;
                    } else {
                        $scope.globle.showTip ( "获取分类信息失败", 'error' );
                        return;
                    }
                } );
                $scope.node.detailNewsCategoryWindow.center ().open ();
            },

            /**
             * 跳转到资讯管理列表
             * @param e
             */
            goNewsNotice: function ( e, dataItem ) {
                $scope.globle.stateGo ( 'states.superContentInfo', '总门户资讯内容', {
                    categoryType  : dataItem.categoryType,
                    categoryName: dataItem.name
                } );
                //$scope.$emit('events:listPage', {e: e, categoryId: dataItem.id, categoryName: dataItem.name});
                //TabService.appendNewTab('资讯管理', '', {
                //    categoryId: dataItem.id,
                //    categoryName: dataItem.name
                //}, null, true);
                this.closeDetailNewsCategoryWindow ( e );
            },

            /**
             * 关闭查看详情窗口
             * @param e
             */
            closeDetailNewsCategoryWindow: function ( e ) {
                e.stopPropagation ();
                $scope.node.detailNewsCategoryWindow.close ();
            },

            /**
             * 启用资讯分类
             * @param e 事件源
             * @param item 元数据
             */
            dealStart: function ( e, item ) {
                e.stopPropagation ();
                $scope.globle.confirm (
                    '启用分类', "确定启用该分类吗？启用之后，分类开放使用！",
                    function ( dialog ) {
                        return superCategoryInfoService.start ( item.id ).then ( function ( response ) {
                            dialog.doRightClose ();
                            if ( response.status ) {
                                item.status = 1;
                                $scope.globle.showTip ( response.info, 'success' );
                                $scope.model.condition.parentId = "0";
                                $scope.node.newsCategoryTreeList.dataSource.read ();
                            } else {
                                $scope.globle.showTip ( "操作失败", 'error' );
                            }
                        } )
                    }
                );
            },

            /**
             * 停用资讯分类
             * @param e 事件源
             * @param item 元数据
             */
            dealStop: function ( e, item ) {
                e.stopPropagation ();
                superCategoryInfoService.checkStopAble ( item.id ).then ( function ( response ) {
                    if ( !response.status ) {
                        $scope.globle.alert ( '提示', response.info );
                        return;
                    } else {
                        $scope.globle.confirm (
                            '停用分类', "确定停用该分类吗？停用之后，分类将不可使用！",
                            function ( dialog ) {
                                return superCategoryInfoService.stop ( item.id ).then ( function ( response ) {
                                    dialog.doRightClose ();
                                    if ( response.status ) {
                                        item.status = 0;
                                        $scope.globle.showTip ( response.info, 'success' );
                                        $scope.model.condition.parentId = "0";
                                        $scope.node.newsCategoryTreeList.dataSource.read ();
                                    } else {
                                        $scope.globle.showTip ( "操作失败", 'error' );
                                    }
                                } )
                            }
                        );
                    }
                } )
            },

            /**
             * 删除资讯分类
             * @param e 事件源
             * @param item 元数据
             */
            dealDelete: function ( e, item ) {
                e.stopPropagation ();
                superCategoryInfoService.checkDeleteAble ( item.id ).then ( function ( response ) {
                    if ( !response.status ) {
                        $scope.globle.alert ( '提示', response.info );
                        return;
                    } else {
                        $scope.globle.confirm (
                            '删除分类', "确定删除该分类吗？",
                            function ( dialog ) {
                                return superCategoryInfoService.deleteById ( item.id ).then ( function ( response ) {
                                    dialog.doRightClose ();
                                    if ( response.status ) {
                                        $scope.model.condition.parentId = "0";
                                        $scope.node.newsCategoryTreeList.dataSource.read ();
                                        $scope.globle.showTip ( response.info, 'success' );
                                    } else {
                                        $scope.globle.showTip ( "操作失败", 'error' );
                                    }
                                } )
                            }
                        );
                    }
                } );
            },
            reload    : function ( e ) {
                e.stopPropagation ();
                $scope.model.condition.parentId = "0";
                $scope.model.condition.name     = null;
                $scope.model.condition.status   = "-1";
                $scope.node.newsCategoryTreeList.dataSource.read ();
            }
        };
    }];
} );