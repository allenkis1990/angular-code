define ( ['angular',
		'@systemUrl@/js/modules/usualBatchManage/controllers/usualBatchManageIndex-ctrl',
		'@systemUrl@/js/modules/usualBatchManage/controllers/usualBatchManageView-ctrl',
		'@systemUrl@/js/modules/usualBatchManage/services/usualBatchManage-service',
			'../../directives/copy-man',
		'@systemUrl@/js/services/kendoui-constants',
		'@systemUrl@/js/services/kendoui-commons'
	],
	function ( angular, usualBatchManageIndex ,usualBatchManageView,usualBatchManageService,copyMan) {
		'use strict';
		return angular.module ( 'app.userManage', [] )
			.controller ( 'app.usualBatchManage.usualBatchManageIndexCtrl', usualBatchManageIndex)
			.controller ( 'app.usualBatchManage.usualBatchManageViewCtrl', usualBatchManageView)
				.directive('copyManFive', copyMan)
			.factory ( 'usualBatchManageService', usualBatchManageService);

	} );
