define(function () {
    'use strict';
    return ['$scope', 'classScheduleService', '$state', '$stateParams', '$timeout', '$q', 'HB_dialog', 'HB_notification', 'hbUtil',
        function ($scope, classScheduleService, $state, $stateParams, $timeout, $q, HB_dialog, HB_notification, hbUtil) {
            $scope.model = {
                resourceUploader: null,
                itemTemplateList: [],
                currentIndex: 0,
                planTemplate: {},
                itemTemplateDto: {
                    name: '',
                    abouts: '',
                    teacherName: '',
                    teacherAbouts: '',
                    timeLength: '',
                    itemResourceList: []
                },
                //以下为附件相关
                resType: 0,
                //以下为课程附件相关Model
                courseSelectedList: [],
                //以下为上传附件相关Model
                attachmentList: [],
            };
            $scope.node = {
                itemTemplateGrid: null
            };
            $scope.events = {
                resetItemTemplateDto: function () {
                    $scope.model.itemTemplateDto = {
                        name: '',
                        abouts: '',
                        teacherName: '',
                        teacherAbouts: '',
                        timeLength: '',
                        itemResourceList: []
                    }
                },
                getPlanTemplate: function (id) {
                    classScheduleService.getPlanTemplate({id: id}).then(function (response) {
                        if (response.status) {
                            $scope.model.planTemplate = response.info;
                        } else {
                            HB_notification.error('提示', response.info);
                        }
                    })
                },
                refreshGrid: function (e) {
                    $timeout(function () {
                        $scope.node.itemTemplateGrid.dataSource.read();
                        console.log('itemTemplateList: ', $scope.model.itemTemplateList);
                    }, 500)
                },
                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.loadGrid(e);
                    }
                },
                detailItemTemplateWindow: function (e, index) {
                    $scope.model.currentIndex = index;
                    console.log('currentIndex: ', index);
                    //设置附件
                    setResource(index);
                    $scope.detailItemTemplateWindow = HB_dialog.contentAs($scope, {
                        title: '课程详情',
                        width: 1000,
                        height: 550,
                        showCancel: false,
                        showCertain: false,
                        cancelText: '取消',
                        confirmText: '确定',
                        closed: function () {
                            $scope.events.refreshGrid();
                        },
                        cancel: function () {
                        },
                        sure: function (wow) {
                            var defer = $q.defer(),
                                promise = defer.promise;
                            defer.resolve();
                            wow.close();
                            return promise;
                        },
                        templateUrl: '@systemUrl@/views/classSchedule/itemTemplate-detail.html'
                    });

                },
                closeWindow: function (windowName) {
                    $scope[windowName].close($scope[windowName].dialogIndex);
                },
                //以下为附件相关
                selectResType: function (e, resType) {
                    $scope.model.resType = resType;
                },
                //以下课程附件相关
                previewCourse: function (e, id) {
                    window.open('/play/#/previewLesson/trainClassId/' + id + '/courseware/xxx', '_blank');
                },
                //以下上传附件相关
            };

            $scope.events.getPlanTemplate($stateParams.id);

            function isBlank(obj) {
                if (obj == undefined || obj == null || obj.length == 0) {
                    return true;
                } else {
                    return false;
                }
            }

            function setResource(currentIndex) {
                //设置附件
                $scope.model.courseSelectedList = [];
                $scope.model.attachmentList = [];
                angular.forEach($scope.model.itemTemplateList[currentIndex].itemResourceList, function (resource) {
                    if (resource.resourceType == 1) {
                        $scope.model.attachmentList.push(resource);
                    } else if (resource.resourceType == 2) {
                        $scope.model.courseSelectedList.push(resource);
                    }
                });
                console.log("courseSelectedList: ", $scope.model.courseSelectedList);
                console.log("attachmentList: ", $scope.model.attachmentList);
            };

            //列表模板
            var template = '';
            (function () {
                var result = [];
                result.push('<tr>');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td title="#: name #">');
                result.push('#: name #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-bind="dataItem.timeLength"></span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<div ng-bind-html="dataItem.abouts|trustHtml"></div>');
                result.push('</td>');

                result.push('<td title="#: teacherName #">');
                result.push('#: teacherName #');
                result.push('</td>');

                result.push('<td title="#: teacherAbouts #">');
                result.push('#: teacherAbouts #');
                result.push('</td>');

                result.push('<td>');
                result.push('<span ng-bind="dataItem.itemResourceList.length>0?dataItem.itemResourceList.length:\'无\'"></span>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button" class="table-btn" ng-click="events.detailItemTemplateWindow($event,dataItem.index-1)">详情</button>');
                result.push('</td>');

                result.push('</tr>');
                template = result.join('');
            })();

            $scope.itemTemplateGrid = {
                options: {
                    dataBinding: function (e) {
                        hbUtil.kendo.grid.nullDataDealLeaf(e);
                    },
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(template),
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: "/web/admin/classSchedule/getPlanItemTemplateList",
                                data: function (e) {
                                    var params = {};
                                    params.id = $stateParams.id;
                                    return params;
                                },
                                dataType: 'json'
                            }
                        },
                        pageSize: 10, // 每页显示的数据数目
                        schema: {
                            // 数据源默认绑定的字段
                            // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                            // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                            // 优先与后面的data执行，返回的数据为下面data上面的参数response
                            parse: function (response) {
                                // 将会把这个返回的数组绑定到数据源当中
                                if (response.status) {
                                    var dataview = response.info, index = 1;
                                    angular.forEach(dataview, function (item) {
                                        item.index = index++;
                                        if (item.itemResourceList != null && item.itemResourceList.length > 0) {
                                            angular.forEach(item.itemResourceList, function (resource) {
                                                resource.resourceData = JSON.parse(resource.resourceData);
                                            })
                                        }
                                    });
                                }
                                return response;
                            },
                            total: function (response) {
                                return response.info.length;
                            },
                            data: function (response) {
                                $scope.model.itemTemplateList = response.info;
                                return response.info;
                            } // 指定数据源
                        },
                    },
                    selectable: true,
                    scrollable: false,
                    sortable: false,
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
                        pageSize: 10,
                        buttonCount: 10
                    },
                    columns: [
                        {field: "index", title: "No.", sortable: false, width: 50},
                        {title: "课程名称", sortable: false},
                        {title: "课程时长（分钟）", sortable: false, width: 150},
                        {title: "课程简介", sortable: false, width: 300},
                        {title: "讲师姓名", sortable: false, width: 120},
                        {title: "讲师简介", sortable: false, width: 300},
                        {title: "参考资料数量", sortable: false, width: 120},
                        {
                            title: "操作", width: 200
                        }
                    ]
                }
            }
        }];
});