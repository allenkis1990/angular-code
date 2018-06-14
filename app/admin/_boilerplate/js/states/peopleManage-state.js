define (['angularUiRouter', '@systemUrl@/js/modules/peopleManage/main'], function () {
	'use strict';
	return angular.module ('app.states.peopleManage',
		['ui.router']).config (function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider,HB_WebUploaderProvider) {;
		$stateProvider.state ('states.peopleManage', {
			url: '/peopleManage',
			sticky: true,
			resolve: {
				setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
			},
			views: {
				'states.peopleManage@': {
					templateUrl: '@systemUrl@/views/peopleManage/peopleManage.html',
					controller: 'peopleManageCtrl'
				}
			}
		});
	});
});
