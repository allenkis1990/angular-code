define(['@systemUrl@/js/modules/exam/controllers/exam-ctrl',
    '@systemUrl@/js/modules/exam/common/questionModule',
    '@systemUrl@/js/modules/exam/services/exam-service'
], function (controllers, a, examService) {
    'use strict';
    angular.module('app.center.states.exam.main', ['app.singleQuestion'])
        .controller('app.center.states.exam.indexCtrl', controllers.indexCtrl)

        .factory('app.center.exam.service', examService)

        .constant('examConstant', {
            numberMapLetter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        })
        /**
         * 过滤器
         * 将1，2，3，4，5，6，7...转换成A,B,C,D,E,F,G...
         */
        .filter('filterNumberToLetter', ['examConstant', function (examConstant) {
            return function (number) {
                return number === -1 ? '未答' : examConstant.numberMapLetter[number];
            };
        }]);
});