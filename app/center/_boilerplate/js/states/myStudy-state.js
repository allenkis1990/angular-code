define(['@systemUrl@/js/modules/myStudy/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.myStudy', ['solutions']).config(['$stateProvider', '$urlRouterProvider','hb.domainConfig', function ($stateProvider, $urlRouterProvider,hb_domainConfig) {
        if(hb_domainConfig.units&&hb_domainConfig.units.length&&hb_domainConfig.units.length>0){
            //默认是跳到培训班
            //console.log(hb_domainConfig.dir);
            //$urlRouterProvider.when('/'+hb_domainConfig.dir+'/myStudy', hb_domainConfig.dir+'/myStudy/trainClass');
            angular.forEach(hb_domainConfig.units, function (domain) {
                $urlRouterProvider.when('/' + domain.path+'/myStudy', '/' + domain.path + '/myStudy/trainClass');
                //limits.push(domain.path);
                //console.log(domain.path);
            });
        }else{
            //默认是跳到培训班
            $urlRouterProvider.when('/myStudy', 'myStudy/trainClass');
        }


        $stateProvider.state('states.myStudy', {
            url: '/myStudy',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myStudy/index.html',
                    controller: 'app.center.states.myStudy.indexCtrl'
                }
            }
        }).state('states.myStudy.goods', {
            url: '/goods',
            views: {
                'myStudyContent': {
                    templateUrl: '@systemUrl@/views/myStudy/goods.html',
                    controller: 'app.center.states.goods.indexCtrl'
                }
            }
        }).state('states.myStudy.trainClass', {
            url: '/trainClass',
            views: {
                'myStudyContent': {
                    templateUrl: '@systemUrl@/views/myStudy/trainClass.html',
                    controller: 'app.center.states.trainClass.indexCtrl'
                }
            }
        });
    }]);
});