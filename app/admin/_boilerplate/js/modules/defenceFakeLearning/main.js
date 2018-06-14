define([
    '@systemUrl@/js/modules/defenceFakeLearning/controllers/defenceFakeLearning-ctrl',
    '@systemUrl@/js/modules/defenceFakeLearning/services/defenceFakeLearning-service',
    '@systemUrl@/js/modules/defenceFakeLearning/directives/defence-fake-learning'
], function (defenceFakeLearningCtrl, defenceFakeLearningService, defenceFakeLeaningDirective) {
    'use strict';
    return angular.module('app.defenceFakeLearning', [])

        .controller('app.defenceFakeLearning.index', defenceFakeLearningCtrl.index)
        .controller('app.defenceFakeLearning.add', defenceFakeLearningCtrl.add)
        .controller('app.defenceFakeLearning.edit', defenceFakeLearningCtrl.edit)
        .controller('app.defenceFakeLearning.detail', defenceFakeLearningCtrl.detail)

        .directive('defenceFakeSelectClass', defenceFakeLeaningDirective.selectClass)

        .factory('app.defenceFakeLearning.service', defenceFakeLearningService);
});
