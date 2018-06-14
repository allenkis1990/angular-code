define(['ahzj/kccs/js/modules/manageTransit/controllers/manageTransit-ctrl',
        'ahzj/kccs/js/modules/manageTransit/services/manageTransit-service'],
    function (manageTransitCtrl, manageTransitService) {
        'use strict';
        angular.module('app.portal.states.manageTransit.main', [])
            .controller('manageTransitCtrl', manageTransitCtrl)
            .factory('manageTransitService', manageTransitService)
            .directive('initCasManage', [function () {
                return {
                    scope: {
                        getIsLogin: '&',
                        getErrorOne: '&',
                        getErrorTwo: '&',
                        type: '@'
                    },
                    link: function (scope) {
                        var initCas = function () {
                            $.get('/web/login/login/getLoginParameters.action?_q=' + new Date().getTime(), function (data) {
                                window.processLogin = function (data) {
                                    if (data.code == 603) {
                                        if (scope.type === '1') {
                                            $.get(data.location).success(function (data) {
                                                if (data.state) {
                                                    scope.getIsLogin();
                                                }
                                            });
                                        } else {
                                            window.location = data.location;
                                        }
                                    } else if (data.code == 611) {
                                        scope.getErrorOne();
                                    }
                                    else {
                                        scope.getErrorTwo();
                                    }
                                };
                                var script = document.createElement('script');
                                script.type = 'text/javascript';
                                script.src = data.info.casDomain + '/login?TARGET=' + data.info.currentDomain + '/web/sso/auth&js&callback=processLogin';
                                $('head').append(script);
                                //document.documentElement.appendChild(script);
                            });
                        };
                        initCas();
                    }
                };
            }]);
    });