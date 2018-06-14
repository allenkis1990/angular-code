define(function () {
    'use strict';
    return ['$scope', 'global', 'KENDO_UI_TREE', 'courseResourcesManagerService',
        function (a, b, c, d) {
            var e;
            e = {indexUnitInput: angular.element('#index_course_input')};
            var f = '', g = '', h = '0', i = '0', j = '', k = '', l = '', m = '';
            a.model = {
                parentId: null,
                name: null,
                courseCategoryUpdate: {id: null, name: null, parentId: null, remarks: null, img: null, sort: null},
                courseCategoryAdd: {id: null, name: null, img: null, parentId: null, remarks: null},
                indexCRMParams: {courseId: null, parentId: null, name: null},
                indexCourseParams: {id: '0', parentId: null, name: null},
                categoryId: null
            }, angular.extend(a, {
                iscourseCategoryName: {parentId: null, name: null, queryName: ''},
                saveUpdateValue: '保存',
                isopencategory: !0,
                saveVisible: !0,
                modifyVisible: !1,
                visible: !1,
                categorySave: !1,
                categoryText: !0
            }), a.node = {
                courseResourcePopup: null,
                trees: null,
                indexCourseTree: null
            }, a.events = {
                getCourseCategoryInfo: function (b, c) {
                    b.stopPropagation(), a.saveVisible = !1, a.modifyVisible = !1, a.categorySave = !1, a.categoryText = !0, a.isopencategory = !0;
                    var d = $('#courseCategoryTree').data('kendoTreeView').parent($('#courseCategoryTree').data('kendoTreeView').findByUid(c.uid)),
                        e = $('#courseCategoryTree').data('kendoTreeView').dataItem(d);
                    '' != e && null != e && void 0 != e ? a.model.orgNames = a.model.orgName = e.name : a.model.orgNames = a.model.orgName = e ? c.name : '资源分类列表', a.iscourseCategoryName.queryName = c.name, f = $('#courseCategoryTree').data('kendoTreeView').findByUid(c.uid), g = $('#courseCategoryTree').data('kendoTreeView').dataItem(f), a.model.courseCategoryAdd.name = null, a.model.courseCategoryAdd.parentId = c.id, a.iscourseCategoryName.parentId = c.id, a.model.orgDis = c.discription, a.model.admin = c.admin, j = c.id, l = c.type, m = c.unitId;
                }, initValue: function () {
                    a.iscourseCategoryName.name = a.model.courseCategoryAdd.name;
                }, loseValue: function () {
                    a.iscourseCategoryName.name = a.model.courseCategoryAdd.name;
                }, showCourseCategory: function () {
                    a.node.courseResourcePopup.open();
                }, keyUpIndexUnit: function (b) {
                    40 == b.keyCode && a.node.trees.focus();
                }, refreshIndexUnit: function () {
                    a.model.indexCourseParams.parentId = null, a.node.trees.dataSource.read();
                }, save: function (b) {
                    a.model.categoryId = null, b.preventDefault(b), '' != g && (f = $('#courseCategoryTree').data('kendoTreeView').findByUid(g.uid), $('#courseCategoryTree').data('kendoTreeView').expand(f)), d.save(a.model.courseCategoryAdd).then(function (b) {
                        b.status ? (a.globle.showTip('添加课程资源分类成功！', 'success'), '' == g ? (a.node.tree.dataSource.read(), a.node.trees.dataSource.read(), a.events.cannel()) : (a.events.cannel(), g.append(b.info), g.children._data.length > 0 && g.children.sort([{
                            field: 'type',
                            dir: 'asc'
                        }, {field: 'sort', dir: 'asc'}]))) : a.globle.showTip(b.info, 'error');
                    });
                }, activate: function (a, b) {
                }, ajaxValidate: function (b) {
                    b.preventDefault(b), a.iscourseCategoryName.name = a.model.courseCategoryAdd.name, d.ajaxValidate(a.iscourseCategoryName).then(function (b) {
                        b.info ? a.visible = !0 : a.visible = !1;
                    });
                }, createActivity: function () {
                    a.model.categoryId = null, a.categorySave = !0, a.categoryText = !1, a.saveVisible = !0, a.modifyVisible = !1, a.isopencategory = !0, a.model.courseCategoryAdd.id = null, a.model.courseCategoryAdd.name = null, a.model.courseCategoryAdd.parentId = '0', a.iscourseCategoryName.parentId = null, a.model.orgName = null, j = null, g = '', a.node.trees.dataSource.read();
                }, cannel: function (b) {
                    a.model.courseCategoryAdd.id = null, a.model.courseCategoryAdd.name = null, a.model.courseCategoryAdd.parentId = null, a.iscourseCategoryName.parentId = null, a.model.categoryId = null, a.saveVisible = !1, a.modifyVisible = !1, a.categorySave = !1, a.categoryText = !0, a.isopencategory = !0, a.saveUpdateValue = '保存', a.model.orgName = null, a.model.orgDis = null, a.model.admin = null, j = null, l = null, m = null;
                }, deleteResourceCategory: function (b, c) {
                    a.model.categoryId = null, b.stopPropagation(), f = $('#courseCategoryTree').data('kendoTreeView').findByUid(c.uid), g = $('#courseCategoryTree').data('kendoTreeView').dataItem(f), a.globle.confirm('提示：', '确认要删除该资源分类吗？', function (dialog) {
                        return d.deleteLessonType(c.id).then(function (b) {
                            dialog.doRightClose();
                            if (b.status) {
                                if ('' == g || null == g || void 0 == g) a.events.cannel(), a.node.trees.dataSource.read(); else {
                                    a.events.cannel();
                                    var c = $('#courseCategoryTree').data('kendoTreeView');
                                    c.remove(f), a.node.trees.dataSource.read();
                                }
                                a.node.tree.dataSource.read(), a.globle.showTip('删除资源分类成功！', 'success');
                            } else a.globle.showTip(b.info, 'error');
                        });
                    });
                }, queryCreate: function (b, c) {
                    a.model.categoryId = null, b.stopPropagation(), a.categorySave = !0, a.categoryText = !1, a.saveVisible = !0, a.modifyVisible = !1, a.isopencategory = !0, f = $('#courseCategoryTree').data('kendoTreeView').findByUid(c.uid), $('#courseCategoryTree').data('kendoTreeView').expand(f), $('#courseCategoryTree').data('kendoTreeView').select(f), g = $('#courseCategoryTree').data('kendoTreeView').dataItem(f), a.model.courseCategoryAdd.name = null, a.model.courseCategoryAdd.parentId = c.id, a.iscourseCategoryName.parentId = c.id ? c.id : '0', a.model.orgName = c.name, j = c.id, a.node.trees.dataSource.read();
                }, queryModify: function (b, c) {
                    a.model.categoryId = null, b.stopPropagation(), a.categorySave = !0, a.categoryText = !1, a.saveVisible = !1, a.modifyVisible = !0, a.isopencategory = !1;
                    var d = $('#courseCategoryTree').data('kendoTreeView').findByUid(c.uid);
                    k = d, $('#courseCategoryTree').data('kendoTreeView').select(d);
                    var e = $('#courseCategoryTree').data('kendoTreeView').parent($('#courseCategoryTree').data('kendoTreeView').findByUid(c.uid)),
                        f = $('#courseCategoryTree').data('kendoTreeView').dataItem(e);
                    '' != f && null != f && void 0 != f ? (a.model.orgNames = a.model.orgName = f.name, a.model.courseCategoryAdd.parentId = f.id, i = h = f.id) : (a.model.orgName = null, a.model.courseCategoryAdd.parentId = '0', i = h = '0', a.model.orgNames = f ? c.name : '资源分类列表'), a.iscourseCategoryName.queryName = c.name, a.model.courseCategoryAdd.id = c.id, a.model.courseCategoryAdd.name = c.name, a.model.courseCategoryAdd.remarks = c.name, a.node.trees.dataSource.read();
                }, modifyResourceCategory: function (b) {
                    a.model.categoryId = null, b.preventDefault(b), d.update(a.model.courseCategoryAdd).then(function (b) {
                        if (b.status) {
                            if (a.model.selectedItem.name = a.model.courseCategoryAdd.name, i != h) {
                                var c = $('#courseCategoryTree').data('kendoTreeView');
                                c.remove(k);
                            }
                            a.iscourseCategoryName.queryName = a.model.courseCategoryAdd.name, a.node.trees.dataSource.read(), a.node.tree.dataSource.read(), a.events.cannel(), a.globle.showTip('更新资源分类成功！', 'success');
                        } else a.model.orgNames = a.model.courseCategoryAdd.name, a.iscourseCategoryName.queryName = a.model.courseCategoryAdd.name, a.globle.showTip(b.info, 'error');
                    });
                }
            };
            var n = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (b) {
                        {
                            var c = b.data.id ? b.data.id : '0', d = n.get(b.data.id);
                            d ? d.type : '';
                        }
                        $.ajax({
                            url: '/web/admin/courseResourcesManagerAction/findByQuery?categoryId=' + c,
                            dataType: 'json',
                            success: function (c) {
                                angular.forEach(c.info, function (b, c) {
                                    0 == c && (a.iscourseCategoryName.queryName = b.name, a.model.orgNames = '资源分类列表');
                                }), b.success(c);
                            },
                            error: function (a) {
                                b.error(a);
                            }
                        });
                    }
                }, schema: {
                    model: {id: 'id', hasChildren: 'hasChildren', uid: 'id'}, data: function (a) {
                        return a.info;
                    }
                }
            });
            a.ui = {
                popup: {indexUnit: {anchor: '#index_course_input'}},
                treeView: {
                    indexUnit: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/web/admin/courseResourcesManagerAction/findByQuery',
                                    data: function () {
                                        var b = {}, c = a.model.categoryId;
                                        for (var d in c) c.hasOwnProperty(d) && c[d] && (b[d] = c[d]);
                                        return {categoryId: a.model.categoryId};
                                    },
                                    dataType: 'json'
                                }, destroy: function () {
                                }
                            }, schema: {
                                data: function (b) {
                                    return a.model.courseCategoryAdd.id && angular.forEach(b.info, function (c, d) {
                                        c.id === a.model.courseCategoryAdd.id && b.info.splice(d, 1);
                                    }), b.info;
                                }, model: {hasChildren: 'hasChildren', uid: 'id'}
                            }
                        },
                        messages: {loading: '正在加载课程分类...', requestFailed: '课程分类加载失败!.'},
                        dataTextField: 'name',
                        select: function (b) {
                            var c = a.node.trees.dataItem(b.node);
                            a.model.courseCategoryAdd.id != c.id && (g = 0 == c.id ? '' : $('#courseCategoryTree').data('kendoTreeView').dataSource.get(c.id), h = c.id, a.iscourseCategoryName.parentId = c.id, a.model.courseCategoryAdd.parentId = c.id, a.model.orgName = c.name, a.$apply(), a.node.courseResourcePopup.close());
                        },
                        expand: function (b) {
                            var c = a.node.trees.dataItem(b.node);
                            a.model.indexCourseParams.id = c.id, a.model.categoryId = c.id, a.model.indexCourseParams.parentId = a.model.indexCRMParams.unitId = c.unitId, a.$apply();
                        }
                    }
                },
                tree: {
                    options: {
                        checkboxes: !1,
                        messages: {loading: '正在加载课程分类...', requestFailed: '课程分类加载失败!.'},
                        dataSource: n
                    }
                }
            },
                a.ui.tree.options = _.merge({}, c, a.ui.tree.options);
        }];
});