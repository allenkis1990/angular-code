define (function () {
    return ['Restangular', function (Restangular) {

        var url = Restangular.withConfig (function (config) {
            config.setBaseUrl ('/web/admin/faceToFaceClassEducation');
        });
        return {
            getStreamQrcode: function (id) {
                return url.one('getStreamQrcode').get(id);
            },
            exportStudentInfo:function(params){
                return url.all('exportStudentInfo').post(params);
            },
            exportAccommodationsInfo:function(params){
                return url.all('exportStudentInfo').post(params);
            },
            userAccommodationsInfoImport:function(params){
                return url.all('importStudentAccommodationsInfo').post(params);
            },
            getUserDetailInfoByUserId:function(schemeI, userId){
                return url.one('getUserDetailInfoByUserId').get(schemeI, userId);
            },
            doView: function () {
            },
            test:function(schemeId) {
                return url.one('test').get(schemeId);
            },
            getOverallReport:function(schemeId) {
                return url.one('getOverallReport').get(schemeId);
            },

            getTeacherCurriculumEvaluationInFaceToFaceClass:function(schemeId){
                return url.one("getTeacherCurriculumEvaluationInFaceToFaceClass").get(schemeId);
            },

            createClassNoticeInFaceToFaceClass:function(params){
                return url.all("createClassNoticeInFaceToFaceClass").post(params);
            },
            updateClassNoticeInFaceToFaceClass:function(params){
                return url.all("updateClassNoticeInFaceToFaceClass").post(params);
            },
            deleteClassNoticeInFaceToFaceClass:function(id){
                return url.one("deleteClassNoticeInFaceToFaceClass").get(id);
            },

            createTrainingAndDemeanorInFaceToFaceClass:function(params){
                return url.all("createTrainingAndDemeanorInFaceToFaceClass").post(params);
            },

        }
    }]
});
