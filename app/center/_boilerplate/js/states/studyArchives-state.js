define(['@systemUrl@/js/modules/studyArchives/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.studyArchives', ['solutions']).config(['$stateProvider', '$urlRouterProvider','hb.domainConfig', function ($stateProvider, $urlRouterProvider,hb_domainConfig) {

        if(hb_domainConfig.units&&hb_domainConfig.units.length&&hb_domainConfig.units.length>0){
            //默认是跳到培训班
            //$urlRouterProvider.when('/'+hb_domainConfig.dir+'/studyArchives', hb_domainConfig.dir+'/studyArchives/trainClass');
            angular.forEach(hb_domainConfig.units, function (domain) {
                $urlRouterProvider.when('/' + domain.path+'/studyArchives', '/' + domain.path + '/studyArchives/trainClass');
                //limits.push(domain.path);
                //console.log(domain.path);
            });
        }else{
            //默认是跳到培训班
            $urlRouterProvider.when('/studyArchives', 'studyArchives/trainClass');
        }

        $stateProvider.state('states.studyArchives', {
            url: '/studyArchives',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/studyArchives/index.html',
                    controller: 'app.center.states.studyArchives.indexCtrl'
                }
            }
        }).state('states.studyArchives.goods', {
            url: '/goods',
            views: {
                'archivesContent': {
                    templateUrl: '@systemUrl@/views/studyArchives/goods.html',
                    controller: 'app.center.states.goodsArchives.indexCtrl'
                }
            }
        }).state('states.studyArchives.trainClass', {
            url: '/trainClass',
            views: {
                'archivesContent': {
                    templateUrl: '@systemUrl@/views/studyArchives/trainClass.html',
                    controller: 'app.center.states.trainClassArchives.indexCtrl'
                }
            }
        });
    }]);
});