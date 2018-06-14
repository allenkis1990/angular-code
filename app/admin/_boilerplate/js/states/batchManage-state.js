define ([ '@systemUrl@/js/modules/batchManage/main',
	'@systemUrl@/js/modules/batchManage/createBatch/main',
	'@systemUrl@/js/modules/batchManage/batchDetail/main',
	'@systemUrl@/js/modules/batchManage/batchOrder/main',
	'@systemUrl@/js/modules/batchManage/goPay/main'], function () {
	'use strict';
	angular.module ('app.admin.states.batchManage', []).config (['$stateProvider', 'HB_WebUploaderProvider', function ($stateProvider,HB_WebUploaderProvider) {
		$stateProvider.state ('states.batchManage', {
			url: '/batchManage',
			sticky: true,
			resolve: {
				setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
			},
			views: {
				'states.batchManage@': {
					templateUrl: '@systemUrl@/views/batchManage/batchManage.html',
					controller: 'app.admin.states.batchManage.indexCtrl'
				}
			}
		}).state('states.batchManage.createBatch', {url: '/createBatch/:from/:batchNo/:test',//from 1订单管理 2其他地方
			views: {
				'batchManageItem': {
					templateUrl: '@systemUrl@/views/batchManage/createBatch/index.html',
					controller: 'app.admin.states.createBatch.indexCtrl'
				}
			}
		}).state('states.batchManage.batchDetail', {url: '/batchDetail/:from/:batchNo',//from 1订单管理 2其他地方
			views: {
				'batchManageItem': {
					templateUrl: '@systemUrl@/views/batchManage/batchDetail/index.html',
					controller: 'app.admin.states.batchDetail.indexCtrl'
				}
			}
		}).state('states.batchManage.batchOrder', {url: '/batchOrder/:batchNo',//from 1订单管理 2其他地方
			views: {
				'batchManageItem': {
					templateUrl: '@systemUrl@/views/batchManage/batchOrder/index.html',
					controller: 'app.admin.states.batchOrder.indexCtrl'
				}
			}
		}).state('states.batchManage.goPay', {url: '/goPay/:batchNo',//from 1订单管理 2其他地方
			views: {
				'batchManageItem': {
					templateUrl: '@systemUrl@/views/batchManage/goPay/index.html',
					controller: 'app.admin.states.goPay.indexCtrl'
				}
			}
		});
	}]);
});
