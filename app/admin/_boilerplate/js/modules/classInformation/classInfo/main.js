define(['@systemUrl@/js/modules/classInformation/classInfo/controllers/classInfo-ctrl',
    '@systemUrl@/js/modules/classInformation/classInfo/services/classInfo-service'], function (controllers, classInfoService) {
    'use strict';
    console.log(classInfoService);

    angular.module('app.admin.states.classInfo.main', [])
        .controller('app.admin.states.classInfo.indexCtrl', controllers.indexCtrl)
        .factory('classInfoServiceSon', classInfoService);
});