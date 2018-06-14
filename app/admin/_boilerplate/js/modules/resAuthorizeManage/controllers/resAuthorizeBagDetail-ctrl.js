/**
 * Created by linj on 2018/6/9 12:13.
 */
define(function (resAuthotizeBagDetail) {
    'use strict';
    return ['$scope', '$state', '$stateParams', 'resAuthorizeManageService', 'HB_notification','hbUtil',
        function ($scope, $state, $stateParams, resAuthorizeManageService, HB_notification,hbUtil) {
            $scope.model = {
                formData: {},
                tabs: {
                    course: {name: "课程", code: "course", resCode: "course", countTxt: "门"},
                    coursePool: {name: "课程包", code: "coursePool", resCode: "course_pool", countTxt: "个"},
                    examLibrary: {name: "题库", code: "examLibrary", resCode: "question_library", countTxt: "个"},
                    examPaper: {name: "试卷", code: "examPaper", resCode: "exam_paper", countTxt: "份"}
                },
                courseQueryParam:{
                    includeResourceBagId:$stateParams.id
                },
                coursePoolQueryParam:{
                    includeResourceBagId:$stateParams.id
                },
                examLibraryQueryParam:{
                    includeResourceBagId:$stateParams.id
                },
                examPaperQueryParam:{
                    includeResourceBagId:$stateParams.id
                }
            };
            $scope.model.currentType = $scope.model.tabs.course.code;
            $scope.util = {
                getCountFromResourceGroupCount: function (resCode) {
                    return resAuthorizeManageService.getCountFromResourceGroupCount($scope.model.formData.resourceGroupCount, resCode);
                }
            };

            init();

            function init() {
                resAuthorizeManageService.findResourceBagDetailById($stateParams.id).then(function (data) {
                    if (data.status) {
                        $scope.model.formData = data.info;
                    } else {
                        HB_notification.showTip(data.info, 'error');
                    }
                });
            }

            //课程列表模板
            var courseTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: supplier #">#: supplier #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="b{{utils.getCategoryName(dataItem.categoryList)}}">b{{utils.getCategoryName(dataItem.categoryList)}}</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: timeLengthStr #">#: timeLengthStr #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: period #">#: period #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');

                result.push('</tr>');
                courseTemplate = result.join('');
            })();
            $scope.courseGird = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: courseTemplate,
                    url:'/web/admin/resourceBag/findAvailableCourseForResourceBag',
                    scope: $scope,
                    outSidePage:true,
                    param: $scope.model.courseQueryParam,
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: 'No.', sortable: false
                        },
                        {title: '课程名称', sortable: false},
                        {title: '课程供应商', sortable: false},
                        {title: '课程分类', sortable: false},
                        {title: '课程时长', sortable: false},
                        {title: '学时', sortable: false},
                        {title: '创建时间', sortable: false},
                    ]
                })
            };
            //课程包列表模板
            var coursePoolTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: poolName?poolName:\'-\' #">#: poolName?poolName:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: courseCount?courseCount:\'-\' #">#: courseCount?courseCount:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: totalPeriod #">#: totalPeriod #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');


                result.push('</tr>');
                coursePoolTemplate = result.join('');
            })();
            $scope.coursePoolGird = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: coursePoolTemplate,
                    scope: $scope,
                    outSidePage:true,
                    param: $scope.model.coursePoolQueryParam,
                    url:'/web/admin/resourceBag/findAvailableCoursePoolForResourceBag',
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: 'No.', sortable: false
                        },
                        {title: '课程包名称', sortable: false},
                        {title: '课程数', sortable: false},
                        {title: '课程总学时', sortable: false},
                        {title: '创建时间', sortable: false}
                    ]
                })
            };
            //题库列表模板
            var examLibraryTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');

                result.push('</tr>');
                examLibraryTemplate = result.join('');
            })();
            $scope.examLibraryGird = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: examLibraryTemplate,
                    scope: $scope,
                    outSidePage:true,
                    param: $scope.model.examLibraryQueryParam,
                    url:'/web/admin/resourceBag/findAvailableExamLibraryForResourceBag',
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: 'No.', sortable: false
                        },
                        {title: '题库名称', sortable: false},
                        {title: '试题数量', sortable: false},
                        {title: '上级题库', sortable: false},
                        {title: '创建时间', sortable: false}
                    ]
                })
            };
            //试卷列表模板
            var examPaperTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: name?name:\'-\' #">#: name?name:\'-\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #">#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: totalScore #">#: totalScore #</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<span title="#: createTime?createTime:\'-\' #">#: createTime?createTime:\'-\' #</span>');
                result.push('</td>');

                result.push('</tr>');
                examPaperTemplate = result.join('');
            })();
            $scope.examPaperGird = {
                options: hbUtil.kdGridCommonOptionDIY({
                    template: examPaperTemplate,
                    scope: $scope,
                    outSidePage:true,
                    param: $scope.model.examPaperQueryParam,
                    url:'/web/admin/resourceBag/findAvailableExamPaperForResourceBag',
                    fn: function (response) {
                        console.log(response);
                        $scope.configedArr = response.info;
                    },
                    columns: [
                        {
                            title: 'No.', sortable: false
                        },
                        {title: '试卷名称', sortable: false},
                        {title: '组卷方式', sortable: false},
                        {title: '试卷总分', sortable: false},
                        {title: '创建时间', sortable: false}
                    ]
                })
            };
        }
    ];
});