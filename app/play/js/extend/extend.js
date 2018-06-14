/**
 * lesson-platform -
 * @author wengpengfeijava <wengpengfeijava@163.com>
 * @version v2.0.0
 * @link
    * @license ISC
 */
/**
 * lesson-platform -
 * @author wengpengfeijava <wengpengfeijava@163.com>
 * @version v1.0.2
 * @link
    * @license ISC
 */
/**
 * lesson-platform -
 * @author wengpengfeijava <wengpengfeijava@163.com>
 * @version v1.0.0
 * @link
    * @license ISC
 */
/**
 * Created by wengpengfei on 2016/10/10.
 */

define({
    // 服務獲取地址前缀
    prefixUrl: '/',
    // 获取课程信息地址
    lessonUrl: function (isLearn) {
        var goodsType = window.location.hash.split('/')[5].split('?')[0];
        //console.log(goodsType);
        return isLearn ? 'web/portal/play/getCourseInfo/' + goodsType : 'web/portal/play/getCourseInfo/' + goodsType;
    },
    // 获取登录信息
    loginInfoUrl: 'web/login/login/loginInfo.action',
    // 学习模式下面与服务器不断链接
    communicationUrl: 'web/login/login/loginInfo.action',

    // 获取播放参数
    playParamsUrl: function (isLearn) {
        var goodsType = window.location.hash.split('/')[5], url = '';
        console.log(goodsType);
        //console.log(goodsType.indexOf('TRAINING_CLASS'));
        //console.log(goodsType);
        if(goodsType){
            if (goodsType.indexOf('interestCourse') >-1) {
                url = 'web/portal/play/getPlayParams/interestCourse';
            } else {
                url = 'web/portal/play/getPlayParams/anything';
            }
        }else{
            url = 'web/portal/play/getPlayParams/anything';
        }

        //console.log(url);
        return isLearn ? url : url;
    },

    // 返回课程界面的地址
    /*lessonPageUrl: '/center/#/myRealClass/',*/
    lessonPageUrl: '/center/#/',
    // 獲取當前课程的学习进度
    askLessonScheduleUrl: 'web/portal/play/getLessonSchedule',

    // 保存当前已经学习时长
    mediaLearnTimeUrl: '192.168.1.6:2071'
    // 多长时间去保存播放时间   单位（s）
    // timeToSaveMediaLearTime: 10
});
