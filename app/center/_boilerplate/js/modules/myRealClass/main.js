define(['@systemUrl@/js/modules/myRealClass/controllers/myRealClass-ctrl',
        '@systemUrl@/js/modules/myRealClass/controllers/chooseLesson-ctrl',
        '@systemUrl@/js/modules/myRealClass/controllers/lessonPlay-ctrl',
        '@systemUrl@/js/modules/myRealClass/controllers/textPaperViews-ctrl',
        '@systemUrl@/js/modules/myRealClass/controllers/intrestCourse-ctrl',
        '@systemUrl@/js/modules/myRealClass/controllers/certificateApplication-ctrl',
        '@systemUrl@/js/modules/myRealClass/services/myRealClass-service',
        'jqueryKnob', 'jqueryExcanvas'],
    function (controllers, chooseLessonCtrl, lessonPlayCtrl, textPaperViewsCtrl, intrestCourseCtrl, certificateApplicationCtrl, myRealClassService) {
        'use strict';
        angular.module('app.center.states.myRealClass.main', [])
            .controller('app.center.states.myRealClass.indexCtrl', controllers.indexCtrl)
            .controller('app.center.states.chooseLesson.indexCtrl', chooseLessonCtrl)
            .controller('app.center.states.lessonPlay.indexCtrl', lessonPlayCtrl)
            .controller('app.center.states.textPaperViews.indexCtrl', textPaperViewsCtrl)
            .controller('app.center.certificateApplicationCtrl', certificateApplicationCtrl)
            .controller('app.center.states.intrestCourse.indexCtrl', intrestCourseCtrl)
            .factory('myRealClassService', myRealClassService)
            .filter('certificateApplicationStatus', function () {
                return function (value) {
                    var result = '';
                    switch (value) {
                        case 0:
                            result = '待审核';
                            break;
                        case 1:
                            result = '通过';
                            break;
                        case 2:
                            result = '未通过';
                            break;
                        default:
                            result = '未知';
                            break;
                    }
                    return result;
                };
            })
            .filter('certificateApplicationUnitType', function () {
                return function (value) {
                    var result = '';
                    switch (value) {
                        case 1:
                            result = '党政机关';
                            break;
                        case 2:
                            result = '社会团体';
                            break;
                        case 3:
                            result = '事业单位';
                            break;
                        case 4:
                            result = '企业单位';
                            break;
                        default:
                            result = '未知';
                            break;
                    }
                    return result;
                };
            })
            //.directive('uploadImage', uploadImage)
            .directive('jqueryKnob', [function () {
                return {
                    scope: {
                        value: '=',
                        needhoure: '=',
                        num: '='
                    },
                    link: function (scope) {


                        function getObj (which) {
                            return {
                                readOnly: true,
                                lineCap: 'round',
                                thickness: '.1',
                                width: 150,
                                'skin': 'tron',
                                bgColor: '#ccc',
                                fgColor: '#d0041f',
                                innerColor: which,
                                displayInput: false,
                                height: 150,
                                glow: true,
                                font: 'arial'
                            };
                        }


                        scope.$watch('num', function (newVal) {

                            if (newVal >= 3) {
                                //console.log(scope.value);
                                $(function () {
                                    $('.knob').val(0).trigger('change');
                                    $('.knob').each(function (index) {
                                        if (index === 0 || index === 3) {
                                            $(this).knob(getObj(scope.value[index] === 100 ? '#fff' : '#fff'));
                                        } else {
                                            $(this).knob(getObj(scope.value[4] === true ? '#fff' : '#fff'));
                                        }
                                        console.log(scope.value[index]);
                                        $(this).animate({
                                            value: scope.value[index] > 99.3 ? 99.3 : scope.value[index]
                                        }, {
                                            duration: 1500,
                                            easing: 'swing',
                                            progress: function () {
                                                $(this).val(Math.round(this.value))
                                                    .trigger('change');
                                            }
                                        });
                                    });
                                });
                            }

                        });
                    }
                };
            }])

            .directive('clickElement', [function () {
                return {
                    scope: {
                        showModel: '='
                    },
                    link: function (scope) {
                        $('#contentView').click(function (e) {
                            e.stopPropagation();
                            if (scope.showModel === true) {
                                scope.$apply(function () {
                                    scope.showModel = false;
                                });
                            }


                        });

                    }
                };
            }]);
    });