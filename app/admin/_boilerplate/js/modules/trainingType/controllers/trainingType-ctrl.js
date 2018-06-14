/**
 * Created by WDL on 2015/9/23.
 */
define(function () {
    'use strict';
    return ['$scope', 'global', 'KENDO_UI_TREE', 'trainingTypeService', function ($scope, global, KENDO_UI_TREE, trainingTypeService) {

        var localCRM, $crm_node, crmutils, uiTemplate;
        $crm_node = {
            indexUnitInput: angular.element('#index_training_input')
        };

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

        $scope.model = {
            parentId: null,
            name: null,
            trainingTypeUpdate: {
                id: null,
                name: null,
                parentId: null,
                remarks: null,
                img: null,
                sort: null
            },
            trainingTypeAdd: {
                id: null,
                name: null,
                sno: null,
                parentId: null,
                desc: null,
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
                queryName: '',
                desc: ''
            },
            saveUpdateValue: '保存',
            isopencategory: true,
            saveVisible: true,
            modifyVisible: false,
            visible: false,
            categorySave: false,
            categoryText: true
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
            getCourseCategoryInfo: function (event, dataItem) {

                event.stopPropagation();

                $scope.saveVisible = false;
                $scope.modifyVisible = false;
                $scope.categorySave = false;
                $scope.categoryText = true;

                $scope.isopencategory = true; //将培训班分类下拉框  disabled掉

                //获取父级节点元素
                var parentElem = $('#trainingTypeTree').data('kendoTreeView').parent($('#trainingTypeTree').data('kendoTreeView').findByUid(dataItem.uid));
                //获取父级节点数据
                var parentDataItem = $('#trainingTypeTree').data('kendoTreeView').dataItem(parentElem);

                if (parentDataItem != '' && parentDataItem != null && parentDataItem != undefined) {
                    $scope.model.orgNames = $scope.model.orgName = parentDataItem.name;
                } else {
                    $scope.model.orgNames = $scope.model.orgName = parentDataItem ? dataItem.name : '培训班类别列表';//显示时的机构名称
                }
                $scope.iscourseCategoryName.queryName = dataItem.name;
                $scope.iscourseCategoryName.desc = dataItem.desc;

                //获取当前被选中的节点
                crmSelectedNode = $('#trainingTypeTree').data('kendoTreeView').findByUid(dataItem.uid);
                //获取当前被选中的节点的数据
                crmSelectedNodeDataItem = $('#trainingTypeTree').data('kendoTreeView').dataItem(crmSelectedNode);

                //console.log("当前节点：");
                //console.log(dataItem);

                $scope.model.trainingTypeAdd.name = null;
                $scope.model.trainingTypeAdd.desc = null;
                $scope.model.trainingTypeAdd.parentId = dataItem.id;
                $scope.iscourseCategoryName.parentId = dataItem.id;

                $scope.model.orgDis = dataItem.discription;//显示时的机构简介
                $scope.model.admin = dataItem.admin;//显示时的机构管理员
                courseCategoryNodeId = dataItem.id;//节点的id
                courseCategoryNodeType = dataItem.type;//节点的类型 1--单位，2--部门
                courseCategoryId = dataItem.unitId;//节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID

            },
            initValue: function () {
                $scope.iscourseCategoryName.name = $scope.model.trainingTypeAdd.name;
            },
            loseValue: function () {
                $scope.iscourseCategoryName.name = $scope.model.trainingTypeAdd.name;
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
                $scope.model.categoryId = null;
                e.preventDefault(e);
                if (crmSelectedNodeDataItem != '') {
                    crmSelectedNode = $('#trainingTypeTree').data('kendoTreeView').findByUid(crmSelectedNodeDataItem.uid);
                    $('#trainingTypeTree').data('kendoTreeView').expand(crmSelectedNode);
                }
                //$("#trainingTypeTree").data("kendoTreeView").expand(crmSelectedNode);
                //console.log("parentId: " + $scope.model.trainingTypeAdd.parentId);
                trainingTypeService.saveTrainingType($scope.model.trainingTypeAdd).then(function (data) {

                    if (data.status) {
                        $scope.globle.showTip('添加培训班类别成功！', 'success');
                        if (crmSelectedNodeDataItem == '') {
                            $scope.node.tree.dataSource.read();
                            $scope.node.trees.dataSource.read();
                            $scope.events.cannel();
                        } else {
                            $scope.events.cannel();
                            //动态添加节点
                            crmSelectedNodeDataItem.append(data.info);
                            //默认展开选中的节点
                            //$("#trainingTypeTree").data("kendoTreeView").expand(crmSelectedNode);

                            if (crmSelectedNodeDataItem.children._data.length > 0) {
                                crmSelectedNodeDataItem.children.sort([{field: 'type', dir: 'asc'}, {
                                    field: 'sort',
                                    dir: 'asc'
                                }]);
                            }
                            //$scope.node.trees.dataSource.read();
                        }
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                    }
                });
            },
            activate: function (dataItem, event) {

            },
            //异步验证课程培训班分类名称是否重名
            ajaxValidate: function (e) {
                e.preventDefault(e);
                $scope.iscourseCategoryName.name = $scope.model.trainingTypeAdd.name;
                trainingTypeService.ajaxValidate($scope.iscourseCategoryName).then(function (data) {
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
                $scope.isopencategory = true; //将培训班分类下拉框  disabled掉

                $scope.model.trainingTypeAdd.id = null;
                $scope.model.trainingTypeAdd.name = null;
                $scope.model.trainingTypeAdd.desc = null;
                $scope.model.trainingTypeAdd.parentId = '0';
                $scope.iscourseCategoryName.parentId = null;
                $scope.model.orgName = null;//显示时的机构名称
                courseCategoryNodeId = null;//节点的id
                crmSelectedNodeDataItem = '';
                $scope.node.tree.dataSource.read();
                $scope.node.trees.dataSource.read();

            },
            cannel: function (event) {
                $scope.model.trainingTypeAdd.id = null;
                $scope.model.trainingTypeAdd.name = null;
                $scope.model.trainingTypeAdd.desc = null;
                $scope.model.trainingTypeAdd.parentId = null;
                $scope.iscourseCategoryName.parentId = null;
                $scope.model.categoryId = null;

                $scope.saveVisible = false;
                $scope.modifyVisible = false;
                $scope.categorySave = false;
                $scope.categoryText = true;

                $scope.isopencategory = true; //将培训班分类下拉框  disabled掉
                $scope.saveUpdateValue = '保存';

                $scope.model.orgName = null;//显示时的机构名称
                $scope.model.orgDis = null;//显示时的机构简介
                $scope.model.admin = null;//显示时的机构管理员
                courseCategoryNodeId = null;//节点的id
                courseCategoryNodeType = null;//节点的类型 1--单位，2--部门
                courseCategoryId = null;//节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID
            },

            deleteResourceCategory: function (event, dataItem) {
                //防止事件冒泡
                event.stopPropagation();
                $scope.model.categoryId = null;

                //console.log("树节点" + dataItem);
                //获取当前被选中的节点
                crmSelectedNode = $('#trainingTypeTree').data('kendoTreeView').findByUid(dataItem.uid);
                //获取当前被选中的节点的数据
                crmSelectedNodeDataItem = $('#trainingTypeTree').data('kendoTreeView').dataItem(crmSelectedNode);
                $scope.globle.confirm('提示：', '确认要删除该培训班类别吗？', function (dialog) {
                    return trainingTypeService.deleteLessonType(dataItem.id).then(function (data) {
                        dialog.doRightClose();
                        if (data.status) {
                            //if ($scope.model.trainingTypeAdd.id == null || $scope.model.trainingTypeAdd.parentId == null){
                            if (crmSelectedNodeDataItem == '' || crmSelectedNodeDataItem == null || crmSelectedNodeDataItem == undefined) {
                                $scope.events.cannel();
                                $scope.node.trees.dataSource.read();
                            } else {
                                $scope.events.cannel();
                                var treeview = $('#trainingTypeTree').data('kendoTreeView');
                                //动态删除节点
                                treeview.remove(crmSelectedNode);

                                $scope.node.trees.dataSource.read();

                            }
                            $scope.node.tree.dataSource.read();
                            $scope.globle.showTip('删除培训班类别成功！', 'success');
                        } else {
                            if (data.info) {
                                $scope.globle.showTip(data.info, 'error');
                            } else {
                                $scope.globle.showTip('删除培训班类别失败！', 'error');
                            }

                        }
                    });
                });
            },
            queryCreate: function (e, dataItem) {

                $scope.model.categoryId = null;
                e.stopPropagation();
                $scope.categorySave = true;
                $scope.categoryText = false;
                $scope.saveVisible = true;
                $scope.modifyVisible = false;
                $scope.isopencategory = true; //将培训班分类下拉框  disabled掉

                //获取当前被选中的节点
                crmSelectedNode = $('#trainingTypeTree').data('kendoTreeView').findByUid(dataItem.uid);
                $('#trainingTypeTree').data('kendoTreeView').expand(crmSelectedNode);
                //currentCourseCategoryUid = currentNode;
                //选中当前点击节点
                $('#trainingTypeTree').data('kendoTreeView').select(crmSelectedNode);
                //获取当前被选中的节点的数据
                crmSelectedNodeDataItem = $('#trainingTypeTree').data('kendoTreeView').dataItem(crmSelectedNode);

                $scope.model.trainingTypeAdd.name = null;
                $scope.model.trainingTypeAdd.desc = null;
                $scope.model.trainingTypeAdd.parentId = dataItem.id;
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
                $scope.modifyVisible = true;
                $scope.isopencategory = false;
                /** ----------控制按钮结束------------*/

                var currentNode = $('#trainingTypeTree').data('kendoTreeView').findByUid(dataItem.uid);
                currentCourseCategoryUid = currentNode;
                //选中当前点击节点
                $('#trainingTypeTree').data('kendoTreeView').select(currentNode);

                //获取父级节点元素
                var parentElem = $('#trainingTypeTree').data('kendoTreeView').parent($('#trainingTypeTree').data('kendoTreeView').findByUid(dataItem.uid));
                //获取父级节点数据
                var parentDataItem = $('#trainingTypeTree').data('kendoTreeView').dataItem(parentElem);

                if (parentDataItem != '' && parentDataItem != null && parentDataItem != undefined) {
                    $scope.model.orgNames = $scope.model.orgName = parentDataItem.name;
                    $scope.model.trainingTypeAdd.parentId = parentDataItem.id;
                    tempCourseCategoryId = tempCourseCategoryPid = parentDataItem.id;
                } else {
                    $scope.model.orgName = null;
                    $scope.model.trainingTypeAdd.parentId = '0';
                    tempCourseCategoryId = tempCourseCategoryPid = '0';
                    $scope.model.orgNames = parentDataItem ? dataItem.name : '培训班类别列表';//显示时的机构名称
                }
                $scope.iscourseCategoryName.queryName = dataItem.name;
                $scope.iscourseCategoryName.desc = dataItem.desc;
                $scope.model.trainingTypeAdd.id = dataItem.id;
                $scope.model.trainingTypeAdd.name = dataItem.name;
                $scope.model.trainingTypeAdd.desc = dataItem.desc;
                $scope.model.trainingTypeAdd.remarks = dataItem.name;
                $scope.node.trees.dataSource.read();
            },
            modifyResourceCategory: function (e) {
                $scope.model.categoryId = null;
                e.preventDefault(e);
                trainingTypeService.updateTrainingType($scope.model.trainingTypeAdd).then(function (data) {
                    if (data.status) {
                        $scope.model.selectedItem.name = $scope.model.trainingTypeAdd.name;
                        //获取当前被选中的节点
                        if (tempCourseCategoryId != tempCourseCategoryPid) {
                            var treeview = $('#trainingTypeTree').data('kendoTreeView');
                            //动态删除节点
                            treeview.remove(currentCourseCategoryUid);
                        }
                        $scope.iscourseCategoryName.queryName = $scope.model.trainingTypeAdd.name;
                        $scope.iscourseCategoryName.desc = $scope.model.trainingTypeAdd.desc;
                        $scope.node.trees.dataSource.read();
                        $scope.node.tree.dataSource.read();
                        $scope.events.cannel();
                        $scope.globle.showTip('更新培训班类别成功！', 'success');
                    } else {
                        $scope.model.orgNames = $scope.model.trainingTypeAdd.name;
                        $scope.iscourseCategoryName.queryName = $scope.model.trainingTypeAdd.name;
                        $scope.iscourseCategoryName.desc = $scope.model.trainingTypeAdd.desc;
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
                    var type = myModel ? myModel.type : '';

                    $.ajax({
                        url: '/web/admin/trainingTypeAction/getTrainingTypeById?categoryId=' + id,
                        dataType: 'json',
                        success: function (result) {
                            angular.forEach(result.info, function (item, index) {
                                if (index == 0) {
                                    $scope.iscourseCategoryName.queryName = item.name;
                                    $scope.iscourseCategoryName.desc = item.desc;
                                    $scope.model.orgNames = '培训班类别列表';
                                }
                            });
                            options.success(result);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: 'id',
                    hasChildren: 'hasChildren'
                },
                data: function (data) {
                    return data.info;
                }
            }
        });

        $scope.ui = {
            popup: {
                indexUnit: {
                    anchor: '#index_training_input'
                }
            },
            treeView: {
                indexUnit: {
                    dataSource: {
                        transport: {
                            read: {
                                url: '/web/admin/trainingTypeAction/getTrainingTypeById',
                                data: function () {
                                    var temp = {}, params = $scope.model.categoryId;
                                    for (var key in params) {
                                        if (params.hasOwnProperty(key)) {
                                            if (params[key]) {
                                                temp[key] = params[key];
                                            }
                                        }
                                    }
                                    return {categoryId: $scope.model.categoryId};
                                },
                                dataType: 'json'
                            },
                            destroy: function () {

                            }

                        },
                        schema: {
                            data: function (response) {
                                if ($scope.model.trainingTypeAdd.id) {
                                    angular.forEach(response.info, function (item, index) {
                                        if (item.id === $scope.model.trainingTypeAdd.id) {
                                            response.info.splice(index, 1);
                                        }
                                    });
                                }
                                return response.info;
                            },
                            model: {
                                hasChildren: 'hasChildren'
                            }
                        }
                    },
                    messages: {
                        loading: '正在加载培训班分类...',
                        requestFailed: '培训班分类加载失败!.'
                    },
                    dataTextField: 'name',
                    select: function (e) {

                        // console.log("selecting tree node...");
                        var node = $scope.node.trees.dataItem(e.node);
                        if ($scope.model.trainingTypeAdd.id == node.id) {
                            return;
                        }
                        if (node.id == 0) {
                            crmSelectedNodeDataItem = '';
                        } else {
                            crmSelectedNodeDataItem = $('#trainingTypeTree').data('kendoTreeView').dataSource.get(node.id);
                            //crmSelectedNodeDataItem = $("#courseCategoryTree").data("kendoTreeView").dataItem(crmSelectedNode);
                        }
                        //crmSelectedNode = $("#trainingTypeTree").data("kendoTreeView").findByUid(node.uid);
                        ////获取当前被选中的节点的数据
                        //crmSelectedNodeDataItem = $("#trainingTypeTree").data("kendoTreeView").dataItem(crmSelectedNode);

                        tempCourseCategoryPid = node.id;
                        $scope.iscourseCategoryName.parentId = node.id;
                        $scope.model.trainingTypeAdd.parentId = node.id;
                        $scope.model.orgName = node.name;
                        $scope.$apply();
                        $scope.node.courseResourcePopup.close();
                    },
                    expand: function (e) {
                        //console.log('expand tree node...');
                        var node = $scope.node.trees.dataItem(e.node);
                        $scope.model.indexCourseParams.id = node.id;
                        $scope.model.categoryId = node.id;
                        $scope.model.indexCourseParams.parentId = $scope.model.indexCRMParams.unitId = node.unitId;
                        $scope.$apply();
                    }
                }
            },
            tree: {
                options: {
                    checkboxes: false,
                    messages: {
                        loading: '正在加载培训班分类...',
                        requestFailed: '培训班分类加载失败!.'
                    },
                    // 当要去远程获取数据的时候数据源这么配置
                    dataSource: dataSource
                }
            }
        };

        $scope.ui.tree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.tree.options);
    }];
});

