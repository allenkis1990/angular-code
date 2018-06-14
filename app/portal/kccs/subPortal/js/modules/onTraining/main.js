/**
 * Created by 亡灵走秀 on 2017/3/2.
 */
define(['kccs/subPortal/js/modules/onTraining/controllers/on-training-ctrl',
    'kccs/subPortal/js/modules/onTraining/services/on-training-service',
    'kccs/subPortal/js/modules/onTraining/controllers/on-trainingViews-ctrl'], function (onTrainingCtrl, onTrainingService, onTrainingViewsCtrl) {
    'use strict';

    angular.module('app.state.notice.main', [])
        .controller('onTrainingCtrl', onTrainingCtrl)

        .controller('onTrainingViewsCtrl', onTrainingViewsCtrl)

        .factory('onTrainingService', onTrainingService);

});
