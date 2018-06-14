define(
		[
			'angular',
			'@systemUrl@/js/modules/superCategoryInfo/controllers/superCategoryInfo-ctrl',
			'@systemUrl@/js/modules/superCategoryInfo/services/superCategoryInfo-service',
			'restangular'
		],
		function (angular, superCategoryInfoCtrl,superCategoryInfoService) {
			'use strict';
			return angular.module('app.superCategoryInfo', [])
					.controller('app.superCategoryInfo.superCategoryInfoCtrl', superCategoryInfoCtrl)
					.factory("superCategoryInfoService",superCategoryInfoService);
		});