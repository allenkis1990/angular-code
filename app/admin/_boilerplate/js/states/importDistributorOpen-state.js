define(['@systemUrl@/js/modules/importDistributorOpen/main'], function (controllers) {
	'use strict';
	angular.module('app.states.importDistributorOpen', [])
			.config(['$stateProvider', 'HB_WebUploaderProvider', function ($stateProvider, HB_WebUploaderProvider) {
				$stateProvider
						.state('states.importDistributorOpen', {
							url: '/importDistributorOpen',
							sticky: true,
							resolve: {
								setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUserInfo')
							},
							views: {
								'states.importDistributorOpen@': {
									templateUrl: '@systemUrl@/views/importDistributorOpen/index.html',
									controller: 'app.importDistributorOpen.index'
								}
							}
						});
			}]);
});
