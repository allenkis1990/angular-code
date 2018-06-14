define(['kccs/kccsv2/js/modules/home/controllers/home-ctrl', 'jquery', 'cookie',
        'kccs/kccsv2/js/modules/home/services/home-service',
        'kccs/kccsv2/js/modules/home/controllers/top-ctrl',
        'kccs/kccsv2/js/modules/home/controllers/footer-ctrl',
        'prometheus/directives/remote-validate'],
    function (controllers, jq, cookie, homeService, topCtrl, footerCtrl, validateDirective) {
        'use strict';
        return angular.module('app.front.states.accountant.main', [])
            .controller('app.front.states.accountant.indexCtrl', controllers.indexCtrl)
            .controller('app.front.states.accountant.topCtrl', topCtrl)
            .controller('app.front.states.accountant.footerCtrl', footerCtrl)
            .factory('homeService', homeService)
            .filter('trustHtml', function ($sce) {
                return function (input) {
                    return $sce.trustAsHtml(input);
                };
            })
            .directive('ajaxValidate', validateDirective)

            .directive('scrollBanner', [function () {
                return {
                    scope: {},
                    restrict: 'AE',
                    templateUrl: 'kccs/kccsv2/views/home/bannerTemplate.html',
                    link: function ($scope, ele, attr) {

                        $scope.bannerList = [
                            {
                                style: {
                                    background: 'url("kccs/kccsv2/images/banner1.jpg") center top no-repeat',
                                    display: 'block'
                                }, current: true
                            },
                            {
                                style: {
                                    background: 'url("kccs/kccsv2/images/banner2.jpg") center top no-repeat',
                                    display: 'none'
                                }, current: false
                            },
                            {
                                style: {
                                    background: 'url("kccs/kccsv2/images/banner3.jpg") center top no-repeat',
                                    display: 'none'
                                }, current: false
                            },
                            {
                                style: {
                                    background: 'url("kccs/kccsv2/images/banner4.jpg") center top no-repeat',
                                    display: 'none'
                                }, current: false
                            }
                        ];

                        $scope.$watch('bannerList', function (nv) {

                            function autoPlay () {
                                timePlay = setInterval(function () {
                                    index++;
                                    if (index > nv.length - 1) {
                                        index = 0;
                                    }
                                    bannerBtn.eq(index).addClass('current').siblings('li').removeClass('current');
                                    bannerItem.eq(index).stop(true, true).fadeIn().siblings('li').stop(true, true).fadeOut();
                                }, 3000);
                            }


                            if (nv.length > 0) {

                                var bannerBtn = $('#pagination li'),
                                    bannerItem = $('#slides li'),
                                    bannerMain = $('#full-screen-slider'),
                                    timePlay = null,
                                    index = 0;

                                bannerBtn.click(function () {
                                    var $this = $(this);
                                    index = $this.index();
                                    $this.addClass('current').siblings('li').removeClass('current');
                                    bannerItem.eq(index).stop(true, true).fadeIn().siblings('li').stop(true, true).fadeOut();
                                });


                                bannerMain.hover(function () {
                                    clearInterval(timePlay);
                                }, function () {
                                    autoPlay();
                                });

                                autoPlay();

                            }


                        });


                    }
                };
            }]);

    });