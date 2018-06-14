/*** Created by admin on 2015/5/11.*/
define(function () {
    'use strict';
    return ['$scope', 'KENDO_UI_TREE', '$window', 'orgManageService',
        function ($scope, KENDO_UI_TREE, $window, orgManageService) {
            $scope.model = {};
            $scope.model.unitInfoDto = {};
            $scope.model.orgInfoDto = {};
            $scope.model.adminInfoDto = {};
            $scope.model.editInfo = {};//编辑信息对象
            $scope.ui = {};
            $scope.events = {};
            $scope.node = {};
            $scope.model.selectItems = [];
            $scope.accountReg = /^\s*\w*\s*$/;
            $scope.model.sortTemp = {};

            $scope.showDisabled = false;
            $scope.operateAble = true;
            $scope.level = 0;
            $scope.rootNode = {};

            var nodeId = '';//当前节点的ID
            var nodeType = '';//当前节点的类型 1--单位，2--部门
            var childNodeType = '';//添加的孩子节点的类型，1--单位，2--部门
            var unitId = '';//当前节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID

            //获取父级节点元素
            var parentElement = '';

            //当前被选中的节点
            var selectedNode = '';
            //当前被选中的节点的数据
            var selectedNodeDataItem = '';

            var _Array = {
                tree: function (dataSource, rootMatch, childMatch) {
                    /**
                     * @description 构造为tree数据源
                     * @param {Array} dataSource 要被构造的数据源
                     * @param {Function} rootMatch 根节点匹配表达式 function(item){return item.ParentId == '0'}
                     * @param {Function} childMatch 子节点匹配表达式 function(item1,item2){return item1.Id == item2.ParentId}
                     * @return {Array} 返回根节点数组，如果节点存在子节点，可通过Children属性获取
                     */
                    $.each(dataSource, function (index, data) {
                        data.Children = (function () {
                            var child = $.grep(dataSource, function (c) {

                                if (childMatch) {
                                    return childMatch(data, c);
                                }

                                return c.ParentId == data.Id;
                            });
                            return child.length == 0 ? undefined : child;
                        })();
                    });
                    return $.grep(dataSource, rootMatch ? rootMatch : function (data) {
                        return data.ParentId == '0';
                    });
                },
                prev: function (dataSource, current, config) {
                    /**
                     * @description 在指定数组中查找指定数据项的上一个
                     * @param {Array} dataSource 要查找的数组
                     * @param {Object} current 当前的数据项
                     * @param {Object} config 查找配置
                     *                        { sort:{  排序配置
                 *                                  field: 'Sort', 排序字段
                 *                                  dir: true  排序方向 true为升序，false未降序
                 *                                },
                 *                          filter: function(current, data){return bool} 过滤配置
                 *                        }
                     * @return {Object} 如果没有再找到上一个返回null
                     */
                    var currentData = null, isFind = false;

                    if (config && config.sort) {
                        _Array.sort(dataSource, config.sort);
                    }

                    $.each(dataSource, function (index, data) {
                        var flag = config.filter ? config.filter(current, data) : true;
                        if (flag) {
                            if (data == current) {
                                isFind = true;
                                return false;
                            }

                            currentData = data;
                        }
                    });

                    return isFind ? currentData : null;
                },
                next: function (dataSource, current, config) {
                    /**
                     * @description 在指定数组中查找指定数据项的下一个
                     * @param {Array} dataSource 要查找的数组
                     * @param {Object} current 当前的数据项
                     * @param {Object} config 查找配置
                     *                        { sort:{  排序配置
                 *                                  field: 'Sort', 排序字段
                 *                                  dir: true  排序方向 true为升序，false未降序
                 *                                },
                 *                          filter: function(current, data){return bool} 过滤配置
                 *                        }
                     * @return {Object} 如果没有再找到下一个返回null
                     */
                    var currentData = null,
                        isFind = false;

                    if (config && config.sort) {
                        _Array.sort(dataSource, config.sort);
                    }

                    $.each(dataSource, function (index, data) {
                        var flag = config.filter ? config.filter(current, data) : true;
                        if (flag) {
                            if (data == current) {
                                isFind = true;
                            } else if (isFind) {
                                currentData = data;
                                return false;
                            }
                        }
                    });

                    return currentData;
                },
                sort: function (dataSource, config) {
                    /**
                     * @description 对指定数组进行排序，注意会改变原始数组的数据排列
                     * @param {Array} dataSource 要进行排序的数组
                     * @param {Object} config 排序配置
                     *                        {
                 *                          field: 'Sort', 排序字段
                 *                          dir: true  排序方向 true为升序，false未降序
                 *                        }
                     * @return {Object} 返回排序后的数组
                     */
                    var defaultConfig = {
                        field: 'Sort',
                        dir: true
                    };

                    config = config ? $.extend({}, defaultConfig, config) : defaultConfig;

                    if (config.dir) {
                        dataSource.sort(function (x, y) {
                            return x[config.field] > y[config.field] ? 1 : -1;
                        });
                    } else {
                        dataSource.sort(function (x, y) {
                            return x[config.field] < y[config.field] ? 1 : -1;
                        });
                    }
                    return dataSource;
                },
                indexOf: function (source, current) {
                    var length = source.length;
                    for (var i = 0; i < length; i++) {
                        if (source[i] == current) {
                            return i;
                        }
                    }
                    return -1;
                },
                find: function (dataSource, expression) {
                    var result = null;
                    $.each(dataSource, function (i, e) {
                        if (expression(e)) {
                            result = e;
                            return false;
                        }
                    });
                    return result;
                },
                removeAt: function (dataSource, index) {
                    dataSource.splice(index, 1);
                },
                remove: function (dataSource, data) {
                    var index = _Array.indexOf(dataSource, data);
                    _Array.removeAt(dataSource, index);
                }
            };
            var elem = document.getElementById('treeDiv');
            $scope.model.rect = elem.getBoundingClientRect();

            //监控课程类别列表是否有数组（如果课程分类有数据，表示有课程（如果添加完之后没数据，类别列表也要显示））
            $scope.$on('events:changeSideWidth', function (event, value) {
                if (value == -250) {
                    $('#infoDiv').attr('class', 'right-pre right-pre-2');//菜单栏收缩时添加样式
                } else {
                    $('#infoDiv').attr('class', 'right-pre right-pre-1');//菜单栏展开时添加样式
                }
            });

            //查询当前登录用户信息，设置是否有权限操作机构树（原则：单位管理员能操作自己及以下，部门管理员职能查看，无权删除）
            orgManageService.findCurrentUser().then(function (data) {
                if (data.status) {
                    //如果没有组织机构Id，则是单位管理员，有权操作
                    if (data.info.organizationId == '-1') {
                        $scope.operateAble = true;
                    } else {//否则无权操作
                        $scope.operateAble = false;
                    }
                } else {
                    $scope.globle.showTip('获取当前用户信息失败！', 'error');
                }
            });

            $scope.events = {
                kendoTreeExpand: function (dataItem) {
                },
                kendoTreeClick: function () {
                    var tree = $('#orgTree').data('kendoTreeView');
                },
                getChildren: function (dataItem) {
                    alert(dataItem.name);
                },

                getOrgInfo: function (dataItem, event) {

                    parentElement = $('#orgTree').data('kendoTreeView').parent($('#orgTree').data('kendoTreeView').findByUid(dataItem.uid));
                    //获取当前被选中的节点
                    selectedNode = $('#orgTree').data('kendoTreeView').findByUid(dataItem.uid);
                    //获取当前被选中的节点的数据
                    selectedNodeDataItem = $('#orgTree').data('kendoTreeView').dataItem(selectedNode);
                    $scope.model.orgName = dataItem.name;//显示时的机构名称
                    $scope.model.orgDis = dataItem.discription;//显示时的机构简介
                    $scope.model.admin = dataItem.admin;//显示时的机构管理员
                    $scope.model.type = dataItem.type;//机构类型，控制是否显示管理员信息
                    nodeId = dataItem.id;//节点的id
                    nodeType = dataItem.type;//节点的类型 1--单位，2--部门
                    unitId = dataItem.unitId;//节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID

                    //防止事件冒泡
                    //event.stopPropagation();
                },

                //上移
                doUp: function (event, dataItem) {
                    //防止事件冒泡
                    event.stopPropagation();
                    //alert("交换");
                    //获取父级节点元素
                    var parentElem = $('#orgTree').data('kendoTreeView').parent($('#orgTree').data('kendoTreeView').findByUid(dataItem.uid));
                    //获取父级节点数据
                    var parentDataItem = $('#orgTree').data('kendoTreeView').dataItem(parentElem);

                    //dataSource-移动的数据源，就是移动哪个节点下的数据，
                    //treeDataSource-移动之后重新排序的数据源
                    var dataSource, treeDataSource;
                    if (parentElem.length == 0) {
                        dataSource = $('#orgTree').data('kendoTreeView').dataSource.data();
                        treeDataSource = $('#orgTree').data('kendoTreeView').dataSource;
                    } else {
                        dataSource = dataItem.parent();
                        treeDataSource = parentDataItem.children;
                    }
                    //获取上一个节点
                    var prevRowDataItem = _Array.prev(dataSource, dataItem, {
                        filter: function (x, y) {
                            return x.type == y.type;
                        },
                        sort: {field: 'sort'}
                    });
                    if (null == prevRowDataItem) {
                        $scope.globle.showTip('不能交换！', 'error');
                        return;
                    }

                    //执行远程位置交换
                    orgManageService.exchangeSort(dataItem.id, prevRowDataItem.id, dataItem.type).then(function (data) {
                        if (data.status) {
                            //交换位置
                            $scope.model.sortTemp.sort = dataItem.sort;
                            dataItem.sort = prevRowDataItem.sort;
                            prevRowDataItem.sort = $scope.model.sortTemp.sort;

                            //父级数据源重新排序
                            treeDataSource.sort([{field: 'type', dir: 'asc'}, {field: 'sort', dir: 'asc'}]);
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                            //$scope.globle.alert("提示",data.info);
                        }
                    });

                },

                //下移
                doDown: function (event, dataItem) {
                    //防止事件冒泡
                    event.stopPropagation();
                    //获取父级节点元素
                    var parentElem = $('#orgTree').data('kendoTreeView').parent($('#orgTree').data('kendoTreeView').findByUid(dataItem.uid));
                    //获取父级节点数据
                    var parentDataItem = $('#orgTree').data('kendoTreeView').dataItem(parentElem);

                    //dataSource-移动的数据源，就是移动哪个节点下的数据，
                    //treeDataSource-移动之后重新排序的数据源
                    var dataSource, treeDataSource;
                    if (parentElem.length == 0) {
                        dataSource = $('#orgTree').data('kendoTreeView').dataSource.data();
                        treeDataSource = $('#orgTree').data('kendoTreeView').dataSource;
                    } else {
                        dataSource = dataItem.parent();
                        treeDataSource = parentDataItem.children;
                    }
                    //获取下一个节点
                    var nextNode = _Array.next(dataSource, dataItem, {
                        filter: function (x, y) {
                            return x.type == y.type;
                        },
                        sort: {field: 'sort'}
                    });
                    if (null == nextNode) {
                        $scope.globle.showTip('不能交换！', 'error');
                        //$scope.globle.alert("提示","");
                        return;
                    }

                    //执行远程位置交换
                    orgManageService.exchangeSort(dataItem.id, nextNode.id, dataItem.type).then(function (data) {
                        if (data.status) {
                            //交换位置
                            $scope.model.sortTemp.sort = dataItem.sort;
                            dataItem.sort = nextNode.sort;
                            nextNode.sort = $scope.model.sortTemp.sort;

                            //父级数据源重新排序
                            treeDataSource.sort([{field: 'type', dir: 'asc'}, {field: 'sort', dir: 'asc'}]);
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                            //$scope.globle.alert("提示",data.info);
                        }
                    });

                },

                addNode: function (childType) {//传入的参数为添加节点的类型，1-单位，2-部门
                    if (nodeId == '') {
                        $scope.globle.showTip('请选择要操作的机构！', 'error');
                        //$scope.globle.alert("提示","请选择要操作的机构");
                        return;
                    } else {
                        $scope.showDisabled = false;
                        //默认展开选中的节点
                        $('#orgTree').data('kendoTreeView').expand(selectedNode);

                        //远程校验机构内置管理员的账号需要的参数
                        $scope.validateAccountParam = {
                            type: 1
                        };
                        //远程校验机构内置管理员的邮箱需要的参数
                        $scope.validateEmailParam = {
                            type: 2
                        };
                        $scope.node.windows.addInfo.open();
                        //选中的是单位节点
                        if (nodeType == '1') {
                            //点击的是添加单位
                            if (childType == '1') {
                                $scope.title = '添加单位';
                                $scope.model.parentId = nodeId;
                                childNodeType = childType;
                                //远程校验单位名称需要的参数
                                $scope.validateOrgNameParam = {
                                    type: 1
                                };
                            } else if (childType == '2') {//点击的是添加部门,父ID=0，六个字段中的单位Id=选中节点的ID（nodeId）
                                $scope.title = '添加部门';
                                $scope.model.parentId = '0';
                                $scope.model.unitId = nodeId;
                                childNodeType = childType;
                                //远程部门名称需要的参数
                                $scope.validateOrgNameParam = {
                                    type: 2,
                                    unitId: nodeId,
                                    parentOrgId: '0'
                                };
                            }
                        } else if (nodeType == '2') {//选中的是部门节点，父ID=选中节点的ID，六个字段中的单位ID=父节点的单位ID
                            $scope.title = '添加部门';
                            $scope.model.parentId = nodeId;
                            $scope.model.unitId = unitId;//父节点的单位ID
                            childNodeType = childType;
                            $scope.validateOrgNameParam = {
                                type: 2,
                                unitId: unitId,
                                parentOrgId: nodeId
                            };
                        }
                    }
                },
                //提交新增
                saveAdd: function () {
                    //防止用户多次提交表单
                    $scope.showDisabled = true;
                    $('#submitBtn').attr('class', 'btn btn-g');

                    $scope.model.adminInfoDto = {
                        loginInput: $scope.model.account,
                        name: $scope.model.adminName,
                        email: $scope.model.email,
                        password: $scope.model.password
                    };

                    //添加的是单位，封装成单位的对象
                    if (childNodeType == '1') {
                        $scope.model.unitInfoDto = {
                            name: $scope.model.unitName,
                            intro: $scope.model.unitDis,
                            parentUnitId: $scope.model.parentId
                        };

                        $scope.model.postParam = {
                            unitInfoDto: JSON.stringify($scope.model.unitInfoDto),
                            adminInfoDto: JSON.stringify($scope.model.adminInfoDto)
                        };

                        orgManageService.saveUnitAdd($scope.model.postParam).then(function (data) {
                            if (data.status) {
                                $scope.model.addNode = data.info;//返回的是新增成功的节点信息
                                //动态添加节点
                                selectedNodeDataItem.append($scope.model.addNode[0]);
                                //默认展开选中的节点
                                $('#orgTree').data('kendoTreeView').expand(selectedNode);
                                //将选中节点下的子节点重新排序
                                if (selectedNodeDataItem.children._data.length > 0) {
                                    selectedNodeDataItem.children.sort([{field: 'type', dir: 'asc'}, {
                                        field: 'sort',
                                        dir: 'asc'
                                    }]);
                                }
                                $scope.events.closeAddWin();//添加成功之后关闭添加窗口
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                                //如果添加失败，则将提交按钮样式还原，用户可以再次提交
                                $scope.showDisabled = false;
                                //$scope.globle.alert("提示",data.info);
                            }
                        });
                    } else if (childNodeType == '2') {//添加的是部门，封装成部门的对象
                        $scope.model.orgInfoDto = {
                            name: $scope.model.unitName,
                            intro: $scope.model.unitDis,
                            affiliateOrganizationId: $scope.model.parentId,
                            unitId: $scope.model.unitId
                        };
                        $scope.model.postParam = {
                            orgInfoDto: JSON.stringify($scope.model.orgInfoDto),
                            adminInfoDto: JSON.stringify($scope.model.adminInfoDto)
                        };
                        orgManageService.saveOrgAdd($scope.model.postParam).then(function (data) {
                            if (data.status) {
                                //返回的是新增成功的节点信息
                                $scope.model.addNode = data.info;
                                //动态添加节点
                                selectedNodeDataItem.append($scope.model.addNode[0]);
                                //默认展开选中的节点
                                $('#orgTree').data('kendoTreeView').expand(selectedNode);
                                //将选中节点下的子节点重新排序
                                if (selectedNodeDataItem.children._data.length > 0) {
                                    selectedNodeDataItem.children.sort([{field: 'type', dir: 'asc'}, {
                                        field: 'sort',
                                        dir: 'asc'
                                    }]);
                                }
                                $scope.events.closeAddWin();//添加成功之后关闭添加按钮
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                                //如果添加失败，则将提交按钮样式还原，用户可以再次提交
                                $scope.showDisabled = false;
                            }
                        });
                    }
                },
                //打开编辑窗口
                editNode: function () {
                    if (nodeId == '') {
                        $scope.globle.showTip('请选择要操作的机构！', 'error');
                        return;
                    } else {
                        $scope.showDisabled = false;
                        $scope.node.windows.editInfo.open();
                        //str.replace(/(^\s*)|(\s*$)/g, "");
                        $scope.model.editInfo.orgName = $.trim($scope.model.orgName.replace(/(^\s*)|(\s*$)/g, ''));//每次打开修改窗口时都初始化控件
                        //$scope.model.editInfo.orgName = $scope.model.editInfo.orgName.substring(0,$scope.model.editInfo.orgName.length);
                        if (null != $scope.model.orgDis && undefined != $scope.model.orgDis && '' != $scope.model.orgDis) {
                            $scope.model.editInfo.orgDis = $scope.model.orgDis.replace(/(^\s*)|(\s*$)/g, '');//每次打开修改窗口时都初始化控件
                        } else {
                            $scope.model.editInfo.orgDis = '';//每次打开修改窗口时都初始化控件
                        }

                        if (nodeType == '1') {//
                            $scope.title = '修改单位';
                            $scope.model.editInfo.unitId = nodeId;
                            $scope.model.editInfo.orgId = '';
                            //修改单位时远程校验部门名称需要的参数
                            $scope.validateOrgNameParam = {
                                id: nodeId,
                                type: 1,
                                unitId: unitId,
                                parentOrgId: nodeId
                            };
                        } else if (nodeType == '2') {
                            $scope.title = '修改部门';
                            $scope.model.editInfo.orgId = nodeId;
                            $scope.model.editInfo.unitId = '';
                            //修改部门时远程校验部门名称需要的参数
                            $scope.validateOrgNameParam = {
                                id: nodeId,
                                type: 2,
                                unitId: unitId,
                                parentOrgId: nodeId
                            };
                        }
                    }
                },
                saveEdit: function () {
                    //防止用户多次提交表单
                    $scope.showDisabled = true;
                    //修改的是单位
                    if ($scope.model.editInfo.orgId == '') {
                        $scope.model.unitUpdateInfo = {
                            unitId: $scope.model.editInfo.unitId,
                            name: $.trim($scope.model.editInfo.orgName),
                            intro: $.trim($scope.model.editInfo.orgDis)
                        };
                        orgManageService.saveUnitEdit($scope.model.unitUpdateInfo).then(function (data) {
                            if (data.status) {
                                //修改成功后，更改修改节点在页面的展示信息  名称，简介
                                $scope.model.updateNodeInfo = data.info;
                                //更改树节点显示的文字
                                $scope.model.selectedItem.name = $.trim($scope.model.updateNodeInfo[0].name);
                                $scope.model.selectedItem.discription = $.trim($scope.model.updateNodeInfo[0].discription);
                                //更改显示节点详情的相应值
                                $scope.model.orgName = $.trim($scope.model.updateNodeInfo[0].name);
                                $scope.model.orgDis = $.trim($scope.model.updateNodeInfo[0].discription);
                                $scope.node.windows.editInfo.close();
                            } else {
                                $scope.showDisabled = false;
                                $scope.globle.showTip(data.info, 'error');
                                //$scope.globle.alert("提示",data.info);
                            }
                        });
                    } else if ($scope.model.editInfo.unitId == '') {//修改的是部门
                        $scope.model.orgUpdateInfo = {
                            organizationId: $scope.model.editInfo.orgId,
                            name: $.trim($scope.model.editInfo.orgName),
                            intro: $.trim($scope.model.editInfo.orgDis)
                        };
                        orgManageService.saveOrgEdit($scope.model.orgUpdateInfo).then(function (data) {
                            if (data.status) {
                                //修改成功后，更改修改节点在页面的展示信息  名称，简介
                                $scope.model.updateNodeInfo = data.info;
                                //更改树节点显示的文字
                                $scope.model.selectedItem.name = $.trim($scope.model.updateNodeInfo[0].name);
                                $scope.model.selectedItem.discription = $.trim($scope.model.updateNodeInfo[0].discription);
                                //更改显示节点详情的相应值
                                $scope.model.orgName = $.trim($scope.model.updateNodeInfo[0].name);
                                $scope.model.orgDis = $.trim($scope.model.updateNodeInfo[0].discription);
                                $scope.node.windows.editInfo.close();
                            } else {
                                $scope.showDisabled = false;
                                $scope.globle.showTip(data.info, 'error');
                                //$scope.globle.alert("提示",data.info);
                            }
                        });
                    }

                    /*$(".dialog-cont input").bind("blur",function(){
                     console.log("sb");
                     var result=$(this).val().replace(/(^\s*)|(\s*$)/g, "");
                     $(this).attr("value","1");
                     });*/
                },
                //关闭添加窗口
                closeAddWin: function () {
                    $scope.node.windows.addInfo.close();
                    //清空控件的值
                    $scope.model.parentId = '';
                    $scope.model.unitName = '';
                    $scope.model.unitDis = '';
                    $scope.model.account = '';
                    $scope.model.password = '';
                    $scope.model.rePassword = '';
                    $scope.model.adminName = '';
                    $scope.model.email = '';
                },
                //关闭修改窗口
                closeEditWin: function () {
                    $scope.node.windows.editInfo.close();
                },
                //删除节点
                deleteNode: function () {
                    if (nodeId == '') {
                        $scope.globle.showTip('请选择要删除的机构！', 'error');
                        //$scope.globle.alert("提示","请选择要删除的机构");
                        return;
                    }
                    //如果删除顶级节点，提示无权删除
                    if (parentElement.length == 0) {
                        $scope.globle.showTip('无权删除！', 'error');
                        //$scope.globle.alert("提示","无权删除！");
                        return;
                    } else {//先验证单位或者部门下是否有人员，有就提示不能删除
                        //如果节点下有子节点，则不能删除（节点必须要展开才有效，所以在后台还是需要判断）
                        if (selectedNodeDataItem.hasChildren) {
                            $scope.globle.showTip('该组织机构存在子机构,不能删除！', 'error');
                            //$scope.globle.alert("提示","");
                            return;
                        } else {
                            $scope.globle.confirm('提示', '确定删除该机构？', function (dialog) {
                                //删除单位
                                if (nodeType == '1') {
                                    return orgManageService.doUnitDel(nodeId).then(function (data) {
                                        dialog.doRightClose();
                                        if (data.status) {
                                            var treeview = $('#orgTree').data('kendoTreeView');
                                            //动态删除节点
                                            treeview.remove(selectedNode);
                                            //删除成功后清楚相关绑定数据
                                            parentElement = '';
                                            //获取当前被选中的节点
                                            selectedNode = '';
                                            //获取当前被选中的节点的数据
                                            selectedNodeDataItem = '';

                                            $scope.model.orgName = '';//显示时的机构名称
                                            $scope.model.orgDis = '';//显示时的机构简介
                                            $scope.model.admin = '';//显示时的机构管理员
                                            $scope.model.type = 1;//删除的节点类型
                                            nodeId = '';//节点的id
                                            nodeType = '';//节点的类型 1--单位，2--部门
                                            unitId = '';//节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID

                                        } else {
                                            //alert(data.info);
                                            $scope.globle.showTip(data.info, 'error');
                                        }
                                    });
                                } else if (nodeType == '2') {//删除部门
                                    return orgManageService.doOrgDel(unitId, nodeId).then(function (data) {
                                        dialog.doRightClose();
                                        if (data.status) {
                                            var treeview = $('#orgTree').data('kendoTreeView');
                                            //动态删除节点
                                            treeview.remove(selectedNode);

                                            //删除成功后清楚相关绑定数据
                                            parentElement = '';
                                            //获取当前被选中的节点
                                            selectedNode = '';
                                            //获取当前被选中的节点的数据
                                            selectedNodeDataItem = '';

                                            $scope.model.orgName = '';//显示时的机构名称
                                            $scope.model.orgDis = '';//显示时的机构简介
                                            $scope.model.admin = '';//显示时的机构管理员
                                            $scope.model.type = 2;//删除的节点类型
                                            nodeId = '';//节点的id
                                            nodeType = '';//节点的类型 1--单位，2--部门
                                            unitId = '';//节点的单位ID，如果是单位，就是自己的ID，如果是部门，就是部门所在的单位ID
                                        } else {
                                            //alert(data.info);
                                            $scope.globle.showTip(data.info, 'error');
                                        }
                                    });
                                }
                            });
                        }

                    }
                }
            };

            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $scope.level = $scope.level + 1;
                        $.ajax({
                            url: '/web/admin/organization/findUnitByParentId.action?parentId=' + id + '&nodeType=' + type,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
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
                        id: 'id',
                        expanded: 'expanded',
                        hasChildren: 'hasChildren'/*,
                         sprite: "ico"*/
                    },
                    data: function (data) {
                        //记录根节点的信息
                        if (data.info[0].expanded) {
                            $scope.rootNode = data.info[0];
                        }
                        //默认选中根节点
                        if ($scope.level <= 2) {
                            // $("#unit_"+$scope.rootNode.id).attr("class","k-in k-state-selected");
                            /*var barElement = treeview.findByUid(barDataItem.uid);
                             var bar = treeview.findByText($scope.rootNode.name);
                             treeview.select(bar);
                             console.log(bar);*/
                            //console.log(treeview.text(treeview.select())); // logs "bar"
                            //treeview.select($()); // clears selection
                            //console.log(barDataItem);
                            $scope.model.orgName = $scope.rootNode.name;//显示时的机构名称
                            $scope.model.orgDis = $scope.rootNode.discription;//显示时的机构简介
                            $scope.model.admin = $scope.rootNode.admin;//显示时的机构管理员
                            $scope.model.type = $scope.rootNode.type;//显示时的机构管理员
                            //$scope.events.getOrgInfo(barDataItem);

                        }
                        return data.info;
                    }
                }
            });

            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        messages: {
                            loading: '正在加载组织机构...',
                            requestFailed: '组织机构加载失败!.'
                        },
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource/*,
                         dataSpriteCssClassField: "sprite"*/
                    }
                },
                windows: {
                    addInfo: {//添加窗口
                        modal: true,
                        content: '@systemUrl@/views/orgManage/addInfo.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    editInfo: {//修改窗口
                        modal: true,
                        content: '@systemUrl@/views/orgManage/editInfo.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                }
            };
            $scope.ui.tree.options = _.merge({}, KENDO_UI_TREE, $scope.ui.tree.options);
        }];
});
