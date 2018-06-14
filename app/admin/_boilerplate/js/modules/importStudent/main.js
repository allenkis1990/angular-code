define(['angular',
        '@systemUrl@/js/modules/importStudent/controllers/importStudent-ctrl',
        '@systemUrl@/js/modules/importStudent/services/importStudent-service',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons',
        'common/hbWebUploader'


    ],
    function (angular, importStudentCtrl, importStudentService) {
        return angular.module('app.importStudent', ['hb.webUploader'])
            .controller('app.importStudent.importStudentCtrl', importStudentCtrl)
            .factory('importStudentService', importStudentService)
            ;


    });
