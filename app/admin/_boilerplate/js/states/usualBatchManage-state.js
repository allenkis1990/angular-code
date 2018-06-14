define (['angularUiRouter', '@systemUrl@/js/modules/usualBatchManage/main'], function () {
	'use strict';
	return angular.module ('app.states.usualBatchManage', ['ui.router']).config (function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$stateProvider.state ('states.usualBatchManage', {
			url: '/usualBatchManage',
			sticky: true,
			views: {
				'states.usualBatchManage@': {
					templateUrl: '@systemUrl@/views/usualBatchManage/usualBatchManage-index.html',
					controller: 'app.usualBatchManage.usualBatchManageIndexCtrl'
				}
			}
		}).state('states.usualBatchManage.view',{
			url: '/view/:batchNo/:type',
			views: {
				'batchManagerItem': {
					templateUrl: '@systemUrl@/views/usualBatchManage/usualBatchManage-view.html',
					controller: 'app.usualBatchManage.usualBatchManageViewCtrl'
				}
			}


		})

	});
});
