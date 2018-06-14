define(function () {
    'use strict';
    return ['$scope', 'jobSystemManagementService', function ($scope, jobSystemManagementService) {

        var dataSources = [
            {
                text: 'Baseball',
                items: [
                    {text: 'Top News'},
                    {text: 'Photo Galleries'},
                    {text: 'Videos Records'},
                    {text: 'Radio Records'}
                ]
            },
            {
                text: 'Golf',
                items: [
                    {text: 'Top News'},
                    {text: 'Photo Galleries'},
                    {text: 'Videos Records'},
                    {text: 'Radio Records'}
                ]
            },
            {
                text: 'Swimming',
                items: [
                    {text: 'Top News'},
                    {text: 'Photo Galleries'}
                ]
            },
            {
                text: 'Snowboarding',
                items: [
                    {text: 'Photo Galleries'},
                    {text: 'Videos Records'}
                ]
            }
        ];

        $scope.model = {
            totalCredits: 0,
            jobname: null,
            param: {
                jobGradeId: null,
                courseName: null
            },
            courseInfos: null
        };

        $scope.events = {
            queryeditJob: function (e, dataItem) {
                e.stopPropagation();
                console.log(dataItem.name + 'dataItem' + dataItem.id);

            },
            deleteJob: function (e, dataItem) {
                e.stopPropagation();
                console.log(dataItem.name + 'deleteJob' + dataItem.id);

            },
            search: function () {
                console.log('aaa');
            },
            queryJob: function () {
                jobSystemManagementService.queryJob($scope.model.jobname).then(function (data) {

                    $scope.jobInfos = data.info;

                });
            },
            queryCourse: function (e, dataItem) {

                e.stopPropagation();
                if (dataItem) {
                    $scope.model.param.jobGradeId = dataItem.id;
                    $scope.model.param.courseName = null;
                }
                jobSystemManagementService.listJobGradeLesson($scope.model.param.jobGradeId, $scope.model.param.courseName).then(function (data) {
                    $scope.courseInfos = data.info;
                    $scope.model.totalCredits = 0;
                    angular.forEach($scope.courseInfos, function (item, index) {

                        $scope.model.totalCredits += item.credit;

                    });
                });
                //console.log(dataItem.name + "queryCourse" + dataItem.id);
            },
            queryCourses: function (e) {
                jobSystemManagementService.queryCourses($scope.model.param).then(function (data) {

                    $scope.jobInfos = data.info;

                });
            }

        };
        $scope.erji0 = true;

        $scope.events.queryJob();


        /*var f = false;
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    var id = options.data.id ? options.data.id : "";
                        //myModel = dataSource.get(options.data.id);
                    console.log("id=" + id);
                    //var type = myModel ? myModel.type : '';
                    $.ajax({
                        url: "/web/admin/job/queryJob?keyword=" + id,
                        dataType: "json",
                        success: function (result) {
                            //var keepGoing = true;
                            console.log("result" + result);
                            console.log("resultInfo" + result.info);
                            for (var ff in result.info){
                                console.log("ff"+ff);
                            }
                            angular.forEach(result.info, function (item, index) {


                            });
                            options.success(result);
                            f = true;
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: "id"
                },
                data: function (data) {
                    return data.info;
                }
            }
        });

        dataSource.read();
        (function(){
            if (f){

                f =false;
            } else {
                console.log("dataSource"+dataSource);
            }

        });*/

        /*dataSource.fetch(function() {
            console.log(dataSource.view().length); // displays "77"
        });*/

    }];

});
