define([
        'angular',
        '@systemUrl@/js/modules/channelDistribution/controllers/channelDistribution-ctrl',
        '@systemUrl@/js/modules/channelDistribution/services/channelDistribution-service'],
    function (angular, channelDistributionCtrl, channelDistributionService) {
        'use strict';
        return angular
            .module('app.channelDistribution', [])
            .controller('app.channelDistribution.channelDistributionCtrl', channelDistributionCtrl)
            .factory('channelDistributionService', channelDistributionService);


    }
);
