/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base1 = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/learningfilesAction');
        });
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/myCourse');
        });
        var base2 = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/trainingCertify');
        });
        return {
            /*  getCertifiedList: function (params) {
                  return base.one ( 'getCertifiedList' ).get (params);
              },
              getCertifiedDetail: function (params) {
                  return base.one ( 'getCertifiedDetail' ).get (params);
              },*/
            getDownLoadIp: function () {
                return base2.one('getDownLoadIp').get();
            },
            getPrintFile: function (params) {
                return base1.all('getPrintFile').post(params);
            },
            getUserTrainingYearList: function () {
                return base.one('getUserTrainingYearList').get();
            },
            getUserSubjectList: function (trainingYear) {
                return base.one('getUserSubjectList?trainingYear=' + trainingYear).get();
            },
            userCoursePassedMessage: function (params) {
                return base1.one('userCoursePassedMessage').get(params);
            },
            getMyLearningCount: function (params) {
                return base1.one('getMyLearningCount').get(params);
            }

        };
    }];
});
