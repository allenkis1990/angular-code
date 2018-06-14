/**
 * Created by wangzy on 2016/2/22 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
	return ['Restangular', 'HB_notification', function (Restangular, hb_notify) {
		var baseUrl = Restangular.withConfig(function (config) {
			config.setBaseUrl('/web/admin/infoCategory');
		});
		return {

			/**
			 * 查询分类树列表数据
			 * @param data
			 */
			findTreeListData:function(data){
				return baseUrl.all("findListByQuery").post(data);
			},

			/**
			 * 保存咨询分类
			 * @param data
			 */
			save: function(data) {
				return baseUrl.all('save').post(data);
			},

			/**
			 * 验证分类是否可以被删除
			 * @param id
			 */
			checkDeleteAble: function(id) {
				return baseUrl.one('checkDeleteAble').get({id: id});
			},
			/**
			 * 删除咨询分类
			 * @param id
			 */
			deleteById: function(id) {
				return baseUrl.one('deleteById').get({id: id});
			},

			/**
			 * 验证分类是否可以被停用
			 * @param id
			 */
			checkStopAble: function(id) {
				return baseUrl.one('checkStopAble').get({id: id});
			},

			/**
			 * 停用咨询分类
			 * @param id
			 */
			stop: function(id) {
				return baseUrl.one('stop').get({id: id});
			},

			/**
			 * 启用咨询分类
			 * @param id
			 */
			start: function(id) {
				return baseUrl.one('start').get({id: id});
			},

			/**
			 * 根据咨询分类id查询咨询分类信息-查看
			 * @param id
			 */
			findForDetail: function(id) {
				return baseUrl.one('findForDetail').get({id: id});
			},

			/**
			 * 根据咨询分类id查询咨询分类信息-编辑
			 * @param id
			 */
			findForUpdate: function(id) {
				return baseUrl.one('findForUpdate').get({id: id});
			},
			/**
			 * 是否是超级管理员
			 */
			isSuperAdmin:function(){
				return baseUrl.one("isSuperAdmin").get();
			},
			/**
			 * 获取用户单位所在地区名称
			 */
			getUserUnitRegionName: function() {
				return baseUrl.one('getUserUnitRegionName').get();
			},
			/**
			 * 获取顶级单位列表
			 */
			getTopUnitInfoList: function() {
				return baseUrl.one('getTopUnitInfoList').get();
			},
			/**
			 * 获取用户单位id
			 */
			getUserUnitId: function() {
				return baseUrl.one('getUserUnitId').get();
			}
		}
	}]
});
