/**
 * Created by wangzy on 2016/2/22 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var baseUrl = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/infoContent');
        });
        return {
            /**
             * 获取可用的资讯分类集合
             */
            findListByParent: function (parentId,status,generalPortal) {
                return baseUrl.one('findListByParent').get({parentId: parentId,status:status, generalPortal:generalPortal});
            },
            /**
             * 删除资讯
             */
            deleteById: function (id) {
                return baseUrl.one('delete').get({id: id});
            },
            /**
             * 将资讯在同一分类下置顶
             */
            toTop: function (data) {
                return baseUrl.one("toTop").get({id: data});
            },
            /**
             * 验证草稿能否直接发布
             */
            checkPublishAble:function(data){
                return baseUrl.one("checkPublishAble").get({id:data});
            },
            /**
             * 立即发布草稿状态下的公告
             */
            publish:function(data){
                return baseUrl.one("publishNews").get({id:data});
            },
            /**
             * 将发布状态或者定时发布状态的资讯置为草稿
             */
            toDraft:function(data){
                return baseUrl.one("toDraft").get({id:data});
            },
            /**
             * 预览资讯时查询资讯信息
             */
            findForView: function (data) {
                return baseUrl.one("findForView").get({id:data});
            },
            /**
             * 新增资讯
             */
            create:function(data){
                return baseUrl.all("create").post(data);
            },
            /**
             * 修改时查询资讯信息
             */
            findForUpdate: function (data) {
                return baseUrl.one("findNewsNoticeForUpdate").get({id:data});
            },
            /**
             * 保存更新
             */
            update:function(data){
                return baseUrl.all("update").post(data);
            },
            /**
             * 是否是超级管理员
             */
            isSuperAdmin:function(){
                return baseUrl.one("isSuperAdmin").get();
            },
            /**
             * 通过地区id获取地区信息(管辖地区)
             * @param id
             */
            findRegionById: function(id) {
                return baseUrl.one('findRegionById').get({regionPath: id});
            }
        }
    }]
});
