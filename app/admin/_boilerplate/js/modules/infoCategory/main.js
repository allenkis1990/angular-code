define(
	[
		'angular',
		'@systemUrl@/js/modules/infoCategory/controllers/infoCategory-ctrl',
		'@systemUrl@/js/modules/infoCategory/services/infoCategory-service',
		'restangular'
	],
	function (angular, infoCategoryCtrl,infoCategoryService) {
		'use strict';
		return angular.module('app.infoCategory', [])
			.controller('app.infoCategory.infoCategoryCtrl', infoCategoryCtrl)
			.factory("infoCategoryService",infoCategoryService);
	});