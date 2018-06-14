define(function () {
    'use strict';
    return ['$rootScope','$scope', 'global', 'KENDO_UI_TREE', 'courseCategoryManagerService','hbUtil', function ($rootScope,$scope, global, KENDO_UI_TREE, courseResourcesManagerService,hbUtil) {

        var localCRM, $crm_node, crmutils, uiTemplate;
        $crm_node = {
            indexUnitInput: angular.element('#index_course_input')
        };
        $scope.tabMap={
            myself:{
                name:"本单位",
                code:"myself"
            },
            all:{
                name:"项目级",
                code:"all"
            }
        };
        $scope.currentTab = $scope.tabMap.myself.code;
        /**
         *
         * 变量的定义
         * @type {{getCourseCategoryInfo: Function}}
         */
            //获取父级节点元素
        var crmParentElement = '';

        //当前被选中的节点
        var crmSelectedNode = '';
        //当前被选中的节点的数据
        var crmSelectedNodeDataItem = '';
        var tempCourseCategoryPid = '0'; //缓存节点
        var tempCourseCategoryId = '0';

        var courseCategoryNodeId = '';//当前节点的ID
        var currentCourseCategoryUid = '';
        var courseCategoryNodeType = '';//当前节点的类型 1--单位，2--部门
        var courseCategoryChildNodeType = '';//添加的孩子节点的类型，1--单位，2--部门
        var courseCategoryId = '';//当前节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID
        //全部
        var allCourseCategoryNodeId = '';//当前节点的ID
        var allCourseCategoryNodeType = '';//当前节点的类型 1--单位，2--部门
        var allCourseCategoryId = '';//当前节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID

        $scope.model = {
            parentId: null,
            name: null,
            courseCategoryUpdate: {
                id: null,
                name: null,
                parentId: null,
                remarks: null,
                img: null,
                sort: null
            },
            courseCategoryAdd: {
                id: null,
                name: null,
                img: null,
                parentId: null,
                remarks: null
            },
            indexCRMParams: {
                courseId: null,
                parentId: null,
                name: null
            },
            indexCourseParams: {
                id: '0',
                parentId: null,
                name: null
            },
            categoryId: null
        };

        angular.extend($scope, {
            iscourseCategoryName: {
                parentId: null,
                name: null,
                queryName: ''
            },
            allIscourseCategoryName: {
                parentId: null,
                name: null,
                queryName: ''
            },
            saveUpdateValue: '保存',
            isopencategory: true,
            saveVisible: true,
            modifyVisible: false,
            visible: false,
            categorySave: false,
            categoryText: true,
            saving: false
        });

        $scope.node = {

            courseResourcePopup: null,
            trees: null,
            indexCourseTree: null
        };
        /**
         * 页面事件的定义
         * @type {{getCourseCategoryInfo: Function}}
         */
        $scope.events = {
            chooseTab : function (e,code){
                $scope.currentTab = code;
            },
            isSubProjectManager :function () {
                var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
            },
            unitSetCallback:function(unitId) {
                $scope.model.unitId=unitId;
                $scope.node.allTree.dataSource.read();
            },
            getCourseCategoryInfo: function (event, dataItem) {

                //event.stopPropagation();

                $scope.saveVisible = false;
                $scope.modifyVisible = false;
                $scope.categorySave = false;
                $scope.categoryText = true;

                $scope.isopencategory = true; //将资源分类下拉框  disabled掉

                //获取父级节点元素
                var parentElem = $('#courseCategoryTree').data('kendoTreeView').parent($('#courseCategoryTree').data('kendoTreeView').findByUid(dataItem.uid));
                //获取父级节点数据
                var parentDataItem = $('#courseCategoryTree').data('kendoTreeView').dataItem(parentElem);

                if (parentDataItem != '' && parentDataItem != null && parentDataItem != undefined) {
                    $scope.model.orgNames = $scope.model.orgName = parentDataItem.name;
                } else {
                    $scope.model.orgNames = $scope.model.orgName = parentDataItem ? dataItem.name : '课程分类列表';//显示时的机构名称
                }
                $scope.iscourseCategoryName.queryName = dataItem.name;

                //$scope.saveUpdateValue = "保存";
                //$("#saveVisible").css("display", "block");
                //$("#modifyVisible").css("display", "none");
                //console.log($("#courseCategoryTree").data("kendoTreeView").text($("#courseCategoryTree").data("kendoTreeView").select()));

                //crmParentElement = $("#courseCategoryTree").data("kendoTreeView").parent($("#courseCategoryTree").data("kendoTreeView").findByUid(dataItem.uid));

                //获取当前被选中的节点
                crmSelectedNode = $('#courseCategoryTree').data('kendoTreeView').findByUid(dataItem.uid);
                //获取当前被选中的节点的数据
                crmSelectedNodeDataItem = $('#courseCategoryTree').data('kendoTreeView').dataItem(crmSelectedNode);

                /*selectedNodeDataItem.append([
                 { type:"1",name:"新增的jiedian"}
                 ]);*/
                //$("#courseCategoryTree").data("kendoTreeView").expand(selectedNode);

                /*orgManageService.findTopUnitInfoMethod().then(function(data){
                 $scope.model.dataList=data.info;
                 console.log(data.info)*/

                //console.log("当前节点：");
                //console.log(dataItem);

                $scope.model.courseCategoryAdd.name = null;
                $scope.model.courseCategoryAdd.parentId = dataItem.id;
                $scope.iscourseCategoryName.parentId = dataItem.id;

                $scope.model.orgDis = dataItem.discription;//显示时的机构简介
                $scope.model.admin = dataItem.admin;//显示时的机构管理员
                courseCategoryNodeId = dataItem.id;//节点的id
                courseCategoryNodeType = dataItem.type;//节点的类型 1--单位，2--部门
                courseCategoryId = dataItem.unitId;//节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID

                //console.log($scope.ui.tree.options.select());
                //防止事件冒泡
                //event.stopPropagation();

            },

            allGetCourseCategoryInfo: function (event, dataItem) {

                $scope.allIsopencategory = true; //将资源分类下拉框  disabled掉

                //获取父级节点元素
                var parentElem = $('#allCourseCategoryTree').data('kendoTreeView').parent($('#allCourseCategoryTree').data('kendoTreeView').findByUid(dataItem.uid));
                //获取父级节点数据
                var parentDataItem = $('#allCourseCategoryTree').data('kendoTreeView').dataItem(parentElem);

                if (parentDataItem != '' && parentDataItem != null && parentDataItem != undefined) {
                    $scope.model.allOrgNames = $scope.model.allOrgName = parentDataItem.name;
                } else {
                    $scope.model.allOrgNames = $scope.model.allOrgName = parentDataItem ? dataItem.name : '课程分类列表';//显示时的机构名称
                }
                $scope.allIscourseCategoryName.queryName = dataItem.name;



                //获取当前被选中的节点
                crmSelectedNode = $('#allCourseCategoryTree').data('kendoTreeView').findByUid(dataItem.uid);
                //获取当前被选中的节点的数据
                crmSelectedNodeDataItem = $('#allCourseCategoryTree').data('kendoTreeView').dataItem(crmSelectedNode);


                $scope.allIscourseCategoryName.parentId = dataItem.id;

                $scope.model.orgDis = dataItem.discription;//显示时的机构简介
                $scope.model.admin = dataItem.admin;//显示时的机构管理员
                allCourseCategoryNodeId = dataItem.id;//节点的id
                allCourseCategoryNodeType = dataItem.type;//节点的类型 1--单位，2--部门
                allCourseCategoryId = dataItem.unitId;//节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID

            },

            initValue: function () {
                $scope.iscourseCategoryName.name = $scope.model.courseCategoryAdd.name;
            },
            loseValue: function () {
                $scope.iscourseCategoryName.name = $scope.model.courseCategoryAdd.name;
            },
            showCourseCategory: function () {
                $scope.node.courseResourcePopup.open();
            },
            keyUpIndexUnit: function (e) {
                if (e.keyCode == 40) {
                    $scope.node.trees.focus();
                }
            },
            refreshIndexUnit: function () {
                $scope.model.indexCourseParams.parentId = null;
                $scope.node.trees.dataSource.read();
            },

            save: function (e) {
                if ($scope.saving) {
                    return;
                }
                $scope.model.categoryId = null;
                e.preventDefault(e);

                $scope.saving = true;
                if (crmSelectedNodeDataItem != '') {
                    crmSelectedNode = $('#courseCategoryTree').data('kendoTreeView').findByUid(crmSelectedNodeDataItem.uid);
                    $('#courseCategoryTree').data('kendoTreeView').expand(crmSelectedNode);
                }
                //console.log("parentId: " +$scope.model.courseCategoryAdd.parentId);
                //return;
                courseResourcesManagerService.save($scope.model.courseCategoryAdd).then(function (data) {
                    $scope.saving = false;
                    if (data.status) {
                        $scope.globle.showTip('添加课程分类成功！', 'success');
                        //if ($scope.model.courseCategoryAdd.id == null || $scope.model.courseCategoryAdd.parentId == null){
                        if (crmSelectedNodeDataItem == '') {
                            $scope.node.tree.dataSource.read();
                            $scope.node.trees.dataSource.read();
                            $scope.node.allTree.dataSource.read();
                            $scope.events.cannel();
                        } else {
                            $scope.events.cannel();
                            //$scope.model.addNode = data.info;//返回的是新增成功的节点信息
                            //动态添加节点
                            //$scope.node.tree.dataSource.read();
                            //$scope.model.courseCategoryAdd.id = data.info.id;
                            crmSelectedNodeDataItem.append(data.info);
                            //将选中节点下的子节点重新排序
                            //var currentNode = $("#courseCategoryTree").data("kendoTreeView").findByUid(data.info);
                            //选中当前点击节点
                            //$("#courseCategoryTree").data("kendoTreeView").select(currentNode);

                            if (crmSelectedNodeDataItem.children._data.length > 0) {
                                crmSelectedNodeDataItem.children.sort([{field: 'type', dir: 'asc'}, {
                                    field: 'sort',
                                    dir: 'asc'
                                }]);
                            }
                        }
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }
                });
            },
            activate: function (dataItem, event) {

            },
            //异步验证课程资源分类名称是否重名
            ajaxValidate: function (e) {
                e.preventDefault(e);
                //console.log("$scope.disableButton ==>"+$scope.disableButton);
                //console.log($scope.createCourseCategoryForm.courseResourseCategory.$dirty+"====>"+$scope.createCourseCategoryForm.courseResourseCategory.$error.ajaxValidate+"<<");
                $scope.iscourseCategoryName.name = $scope.model.courseCategoryAdd.name;
                courseResourcesManagerService.ajaxValidate($scope.iscourseCategoryName).then(function (data) {
                    if (data.info) {
                        $scope.visible = true;
                    } else {
                        $scope.visible = false;
                        //$scope.disableButton = true;
                    }
                });
            },
            createActivity: function () {
                $scope.model.categoryId = null;
                $scope.categorySave = true;
                $scope.categoryText = false;
                $scope.saveVisible = true;
                $scope.modifyVisible = false;
                $scope.isopencategory = true; //将资源分类下拉框  disabled掉

                $scope.model.courseCategoryAdd.id = null;
                $scope.model.courseCategoryAdd.name = null;
                $scope.model.courseCategoryAdd.parentId = '0';
                $scope.iscourseCategoryName.parentId = null;
                $scope.model.orgName = null;//显示时的机构名称
                courseCategoryNodeId = null;//节点的id
                crmSelectedNodeDataItem = '';
                //$scope.node.tree.dataSource.read();
                $scope.node.trees.dataSource.read();

            },
            cannel: function (event) {
                $scope.model.courseCategoryAdd.id = null;
                $scope.model.courseCategoryAdd.name = null;
                $scope.model.courseCategoryAdd.parentId = null;
                $scope.iscourseCategoryName.parentId = null;
                $scope.model.categoryId = null;

                $scope.saveVisible = false;
                $scope.modifyVisible = false;
                $scope.categorySave = false;
                $scope.categoryText = true;

                $scope.isopencategory = true; //将资源分类下拉框  disabled掉
                //$("#saveVisible").css("display", "block");
                //$("#modifyVisible").css("display", "none");
                $scope.saveUpdateValue = '保存';

                $scope.model.orgName = null;//显示时的机构名称
                $scope.model.orgDis = null;//显示时的机构简介
                $scope.model.admin = null;//显示时的机构管理员
                courseCategoryNodeId = null;//节点的id
                courseCategoryNodeType = null;//节点的类型 1--单位，2--部门
                courseCategoryId = null;//节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID
            },

            deleteResourceCategory: function (event, dataItem) {
                $scope.model.categoryId = null;
                //防止事件冒泡
                event.stopPropagation();
                //console.log("树节点" + dataItem);
                //执行删除分类
                //$scope.events.getCourseCategoryInfo(dataItem,event);
                /*crmParentElement = 0;
                 crmSelectedNode = 0;
                 crmSelectedNodeDataItem = 0 ;*/
                //获取当前被选中的节点
                crmSelectedNode = $('#courseCategoryTree').data('kendoTreeView').findByUid(dataItem.uid);
                //获取当前被选中的节点的数据
                crmSelectedNodeDataItem = $('#courseCategoryTree').data('kendoTreeView').dataItem(crmSelectedNode);

                //如果节点下有子节点，则不能删除（节点必须要展开才有效，所以在后台还是需要判断）

                $scope.globle.confirm('提示：', '确认要删除该课程分类吗？', function (dialog) {
                    return courseResourcesManagerService.deleteLessonType(dataItem.id).then(function (data) {
                        dialog.doRightClose();
                        if (data.status) {
                            //if ($scope.model.courseCategoryAdd.id == null || $scope.model.courseCategoryAdd.parentId == null){
                            if (crmSelectedNodeDataItem == '' || crmSelectedNodeDataItem == null || crmSelectedNodeDataItem == undefined) {
                                $scope.events.cannel();
                                //$scope.node.tree.dataSource.read();
                                $scope.node.trees.dataSource.read();
                            } else {
                                $scope.events.cannel();
                                var treeview = $('#courseCategoryTree').data('kendoTreeView');
                                //动态删除节点
                                treeview.remove(crmSelectedNode);

                                $scope.node.trees.dataSource.read();

                            }
                            //$scope.iscourseCategoryName.queryName = $scope.model.courseCategoryAdd.name;
                            //$scope.iscourseCategoryName.queryName = null;
                            //$scope.model.orgNames = '资源分类列表';
                            $scope.node.tree.dataSource.read();
                            $scope.node.allTree.dataSource.read();
                            $scope.globle.showTip('删除分类成功！', 'success');
                        } else {
                            //$scope.globle.showTip('删除资源分类失败！', 'error');
                            $scope.globle.showTip(data.info, 'error');
                            //$scope.globle.alert("提示",data.info);
                        }
                    });
                });
            },
            queryCreate: function (e, dataItem) {

                //console.log(dataItem);
                $scope.model.categoryId = null;
                e.stopPropagation();
                $scope.categorySave = true;
                $scope.categoryText = false;
                $scope.saveVisible = true;
                $scope.modifyVisible = false;
                $scope.isopencategory = true; //将资源分类下拉框  disabled掉

                //获取当前被选中的节点
                crmSelectedNode = $('#courseCategoryTree').data('kendoTreeView').findByUid(dataItem.uid);
                $('#courseCategoryTree').data('kendoTreeView').expand(crmSelectedNode);
                //currentCourseCategoryUid = currentNode;
                //选中当前点击节点
                $('#courseCategoryTree').data('kendoTreeView').select(crmSelectedNode);
                //获取当前被选中的节点的数据
                crmSelectedNodeDataItem = $('#courseCategoryTree').data('kendoTreeView').dataItem(crmSelectedNode);

                $scope.model.courseCategoryAdd.name = null;
                $scope.model.courseCategoryAdd.parentId = dataItem.id;
                $scope.iscourseCategoryName.parentId = dataItem.id ? dataItem.id : '0';
                $scope.model.orgName = dataItem.name;//显示时的机构名称
                courseCategoryNodeId = dataItem.id;//节点的id
                $scope.node.trees.dataSource.read();
            },

            queryModify: function (e, dataItem) {
                $scope.model.categoryId = null;
                e.stopPropagation();
                //console.log("更新数据" + dataItem);

                /** ----------控制按钮开始------------*/

                $scope.categorySave = true;
                $scope.categoryText = false;

                $scope.saveVisible = false;
                //$scope.saveUpdateValue = "修改";
                $scope.modifyVisible = true;
                //$("#saveVisible").css("display", "none");
                //$("#modifyVisible").css("display", "block");
                $scope.isopencategory = false;
                /** ----------控制按钮结束------------*/

                    //$scope.event.getCourseCategoryInfo(dataItem, e);
                var currentNode = $('#courseCategoryTree').data('kendoTreeView').findByUid(dataItem.uid);
                currentCourseCategoryUid = currentNode;
                //选中当前点击节点
                $('#courseCategoryTree').data('kendoTreeView').select(currentNode);

                //获取父级节点元素
                var parentElem = $('#courseCategoryTree').data('kendoTreeView').parent($('#courseCategoryTree').data('kendoTreeView').findByUid(dataItem.uid));
                //获取父级节点数据
                //var parentDataItem = $('#courseCategoryTree').data('kendoTreeView').dataItem(parentElem);
                var parentDataItem = $('#courseCategoryTree').data('kendoTreeView').dataItem(parentElem);


                if (parentDataItem != '' && parentDataItem != null && parentDataItem != undefined) {
                    $scope.model.orgNames = $scope.model.orgName = parentDataItem.name;
                    $scope.model.courseCategoryAdd.parentId = parentDataItem.id;
                    tempCourseCategoryId = tempCourseCategoryPid = parentDataItem.id;
                } else {
                    $scope.model.orgName = null;
                    $scope.model.courseCategoryAdd.parentId = '0';
                    tempCourseCategoryId = tempCourseCategoryPid = '0';
                    $scope.model.orgNames = parentDataItem ? dataItem.name : '资源分类列表';//显示时的机构名称
                }
                $scope.iscourseCategoryName.queryName = dataItem.name;
                $scope.model.courseCategoryAdd.id = dataItem.id;
                $scope.model.courseCategoryAdd.name = dataItem.name;
                $scope.model.courseCategoryAdd.remarks = dataItem.name;
                $scope.node.trees.dataSource.read();
            },
            modifyResourceCategory: function (e) {
                $scope.model.categoryId = null;
                e.preventDefault(e);
                courseResourcesManagerService.update($scope.model.courseCategoryAdd).then(function (data) {
                    if (data.status) {
                        $scope.model.selectedItem.name = $scope.model.courseCategoryAdd.name;
                        //获取当前被选中的节点
                        //var currentCourseCategoryData = $("#courseCategoryTree").data("kendoTreeView").dataItem(currentCourseCategoryUid);
                        if (tempCourseCategoryId != tempCourseCategoryPid) {
                            var treeview = $('#courseCategoryTree').data('kendoTreeView');
                            //动态删除节点
                            treeview.remove(currentCourseCategoryUid);
                        }
                        $scope.iscourseCategoryName.queryName = $scope.model.courseCategoryAdd.name;
                        $scope.node.trees.dataSource.read();
                        $scope.node.tree.dataSource.read();
                        $scope.node.allTree.dataSource.read();
                        $scope.events.cannel();
                        //$scope.model.selectedItem.name=$scope.model.updateNodeInfo[0].name;
                        $scope.globle.showTip('更新资源分类成功！', 'success');
                    } else {
                        $scope.model.orgNames = $scope.model.courseCategoryAdd.name;
                        $scope.iscourseCategoryName.queryName = $scope.model.courseCategoryAdd.name;
                        $scope.globle.showTip(data.info, 'error');
                    }
                });
            }

        };

        var dataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    var id = options.data.id ? options.data.id : '0',
                        myModel = dataSource.get(options.data.id);
                    //console.log("id=" + id);
                    //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                    var type = myModel ? myModel.type : '';
                    //console.log("type=" + type);

                    $.ajax({
                        //url: "/web/admin/organization/findUnitByParentId.action?parentId=" + id + "&nodeType=" + type,
                        url: '/web/admin/courseCategoryAction/findByQuery?categoryId=' + id+"&authorizedBelongsType=MYSELF",
                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        success: function (result) {
                            //var keepGoing = true;
                            angular.forEach(result.info, function (item, index) {
                                if (index == 0) {
                                    $scope.iscourseCategoryName.queryName = item.name;
                                    $scope.model.orgNames = '资源分类列表';
                                    //keepGoing = false;
                                }
                            });
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
                    id: 'id',
                    length: '',
                    hasChildren: 'hasChildren',
                    uid: 'id'
                },
                data: function (data) {
                    return data.info;
                }
            }
        });

        var allDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    var id = options.data.id ? options.data.id : '0',
                        myModel = dataSource.get(options.data.id);
                    //console.log("id=" + id);
                    //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                    var type = myModel ? myModel.type : '';
                    //console.log("type=" + type);

                    $.ajax({
                        //url: "/web/admin/organization/findUnitByParentId.action?parentId=" + id + "&nodeType=" + type,
                        url: '/web/admin/courseCategoryAction/findByQuery?authorizedBelongsType=MYSELF&categoryId=' + id+"&unitId="+$scope.model.unitId,
                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        success: function (result) {
                            //var keepGoing = true;
                            angular.forEach(result.info, function (item, index) {
                                if (index == 0) {
                                    $scope.allIscourseCategoryName.queryName = item.name;
                                    $scope.model.allOrgNames = '资源分类列表';
                                    //keepGoing = false;
                                }
                            });
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
                    id: 'id',
                    length: '',
                    hasChildren: 'hasChildren',
                    uid: 'id'
                },
                data: function (data) {
                    return data.info;
                }
            }
        });

        var dataSource2 = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: '/web/admin/courseCategoryAction/findByQuery?authorizedBelongsType=MYSELF',
                    data: function () {
                        var b = {}, c = $scope.model.categoryId;
                        for (var d in c) c.hasOwnProperty(d) && c[d] && (b[d] = c[d]);
                        return {categoryId: $scope.model.categoryId};
                    },
                    dataType: 'json'
                },
                destroy: function () {
                }
            },
            schema: {
                model: {
                    id: 'id',
                    hasChildren: 'hasChildren',
                    uid: 'id'
                },
                data: function (data) {
                    return data.info;
                }
            }
        });
        var allDataSource2 = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: '/web/admin/courseCategoryAction/findByQuery',
                    data: function () {
                        var b = {}, c = $scope.model.categoryId;
                        for (var d in c) c.hasOwnProperty(d) && c[d] && (b[d] = c[d]);
                        return {categoryId: $scope.model.categoryId};
                    },
                    dataType: 'json'
                },
                destroy: function () {
                }
            },
            schema: {
                model: {
                    id: 'id',
                    hasChildren: 'hasChildren',
                    uid: 'id'
                },
                data: function (data) {
                    return data.info;
                }
            }
        });

        $scope.ui = {
            popup: {
                indexUnit: {
                    anchor: '#index_course_input'
                }
            },
            treeView: {
                indexUnit: {
                    dataSource: dataSource2,
                    messages: {
                        loading: '正在加载课程分类...',
                        requestFailed: '课程分类加载失败!.'
                    },
                    dataTextField: 'name',
                    select: function (e) {
                        var node = $scope.node.trees.dataItem(e.node);
                        if ($scope.model.courseCategoryAdd.id == node.id) {
                            return;
                        }
                        console.log($('#courseCategoryTree').data('kendoTreeView').dataSource);
                        // if (node.id == 0) {
                        //     crmSelectedNodeDataItem = '';
                        // } else {
                        //     //crmSelectedNodeDataItem = '';
                        //     crmSelectedNodeDataItem = $('#courseCategoryTree').data('kendoTreeView').dataSource.get(node.id);
                        // }
                        if (node.parentId == 0) {
                            //crmSelectedNodeDataItem = '';
                            crmSelectedNodeDataItem = $('#selectTree').data('kendoTreeView').dataSource.get(node.id);
                        } else {
                            crmSelectedNodeDataItem = $('#courseCategoryTree').data('kendoTreeView').dataSource.get(node.id);
                        }
                        tempCourseCategoryPid = node.id;
                        $scope.iscourseCategoryName.parentId = node.id;
                        $scope.model.courseCategoryAdd.parentId = node.id;
                        $scope.model.orgName = node.name;
                        $scope.$apply();
                        $scope.node.courseResourcePopup.close();
                        // 刷新组织机构树
                        // $scope.node.indexCourseTree.dataSource.read();
                    },
                    expand: function (e) {
                        //console.log('expand tree node...');
                        var node = $scope.node.trees.dataItem(e.node);
                        $scope.model.indexCourseParams.id = node.id;
                        $scope.model.categoryId = node.id;
                        $scope.model.indexCourseParams.parentId = $scope.model.indexCRMParams.unitId = node.unitId;
                        $scope.$apply();
                        // 刷新组织机构树
                        //$scope.node.indexCourseTree.dataSource.read();
                    }
                }
            },
            tree: {
                options: {
                    checkboxes: false,
                    messages: {
                        loading: '正在加载课程分类...',
                        requestFailed: '课程分类加载失败!.'
                    },
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: dataSource
                }
            },
            allTree: {
                options: {
                    checkboxes: false,
                    messages: {
                        loading: '正在加载课程分类...',
                        requestFailed: '课程分类加载失败!.'
                    },
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: allDataSource
                }
            }
        };

        $scope.ui.tree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.tree.options);
        $scope.ui.allTree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.allTree.options);
    }];
});
