/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/18
 * 时间: 11:54
 *
 */

define(['angular', 'jqueryNiceScroll'],
    function (angular) {

        var hbCommon = angular.module('hbCommon', ['hb.util', 'hb.basicData', 'lwh']);

        hbCommon.directive('hbReadonly', hbReadonly);

        hbReadonly.$inject = [];

        function hbReadonly () {
            return {
                link: function ($scope, $element, $attributes) {
                    $element.on('keyup keydown', function () {
                        return false;
                    });
                }
            };
        }


        angular.module('lwh', []);

        angular.module('hb.basicData', [])
            .factory('hbBasicData', ['$http', 'HBInterceptor', '$location', '$rootScope', function ($http, HBInterceptor, $location, $rootScope) {
                var hbBasicData = {
                    menuList: [],
                    imageSourceConfig: {}
                };
                hbBasicData.getMenuList = function () {
                    return $http.get('/web/sso/userMenuAuth', {
                        params: {type: HBInterceptor.getAppString()}
                    });
                };
                hbBasicData.setResource = function () {

                    if ($rootScope.uploadConfigOptions) {
                        $rootScope.$broadcast('events:loadBasicDataSuccess', $rootScope.uploadConfigOptions);
                    } else {
                        $http.get('/web/login/login/getUserInfo.action').then(function (data) {
                            var info = data.data.info;
                            $rootScope.uploadConfigOptions = {
                                context: info['context'],
                                requestContext: info['requestContext'],
                                blockMd5CheckUrl: info['blockMd5CheckPath'],
                                uploadImageUrl: info['resourceServicePath'],
                                md5CheckUrl: info['md5CheckPath']
                            };
                            $rootScope.ueditorConfig = {
                                biz: {
                                    context: info['context'],
                                    requestContext: info['requestContext'],
                                    uploadUrl: info['resourceServicePath'] + '?uploadSync=true'
                                },
                                plugin: {
                                    serverUrl: '/web/portal/editor/config'
                                }
                            };
                            if (info['uploadBigFilePath']) {
                                $rootScope.uploadConfigOptions.uploadBigImageUrl = info['uploadBigFilePath'].replace('UploadBigFile', 'uploadBigFile');
                            }

                            $rootScope.$broadcast('events:loadBloadBasicDataSuccessasicDataSuccess', info);
                        });
                    }
                };
                hbBasicData.openStateInWindow = function (stateName, params, type) {
                    var url = '';
                    type = type || 'open';
                    if (type !== 'open' && type !== 'href') {
                        return false;
                    }
                    if ($location.$$html5) {
                        url += $('head').find('base').attr('href') + stateName;
                    } else {
                        url += '#/' + stateName;
                    }

                    if (angular.isDefined(params)) {

                        if (angular.isArray(params)) {

                            url += params.join('/');
                        } else if (angular.isObject(params)) {

                            for (var pro in params) {
                                url += '/' + params[pro];
                            }

                        } else if (angular.isString(params) || angular.isNumber(params)) {
                            url += '/' + params;
                        }
                    }
                    if (type === 'open') {
                        window[type](url);
                    } else {
                        window.location[type] = url;
                    }
                };

                /*hbBasicData.initLoading=function(){
                    angular.element()
                };*/


                hbBasicData.baseURL = '/web';
                return hbBasicData;
            }]);

        angular.module('hb.util', [])

            .factory('hbUtil', [function () {
                var _hbUtil = {};
                _hbUtil.isIe = function () {
                    return (function (ua) {
                        var ie = ua.match(/MSIE\s([\d\.]+)/) ||
                            ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i);
                        return ie && parseFloat(ie[1]);
                    })(navigator.userAgent);
                };

                _hbUtil.isEmptyString = function (val) {
                    if (!val || val === '' || val === null || ((val + '').replace(/(^s*)|(s*$)/g, '').length) === 0) {
                        return true;
                    }
                    return false;
                };

                _hbUtil.indexOf = function(array,id,keyName){
                    var index = -1;
                    angular.forEach(array, function (data, key) {
                        if (id == data) {
                            index = key;
                            return;
                        }
                    });
                    return index;
                };

                _hbUtil.toggleBuzy = function (element, isBuzy) {
                    kendo && kendo.ui.progress(element, isBuzy);
                };

                _hbUtil.validateIsNull = function (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                };
                //验证是否为非数字
                _hbUtil.validateIsNaN = function (obj) {
                    return isNaN(Number(obj));
                };
                _hbUtil.kendo = {
                    config: {
                        combobox: function Config (options) {
                            angular.extend(this, {
                                autoBind: false,
                                text: '',
                                filter: 'contains',
                                dataTextField: 'name',
                                dataTextValue: options.id || 'optionId',
                                dataValueField: options.id || 'optionId'
                            }, options);
                        },
                        grid: {
                            sortable: true,
                            filterable: false,
                            //scrollable: false,
                            selectable: true,
                            pageable: {
                                input: true,
                                refresh: true,
                                pageSizes: true,
                                buttonCount: 10
                            }
                        },
                        tree: {
                            checkboxes: {
                                checkChildren: true
                            },
                            dataSource: {
                                schema: {
                                    // 数据绑定行为，将返回的数据的results绑定到数据源
                                    // ， 如果返回的对象有层级则以x.x.x来访问
                                    data: 'results'
                                }
                            },
                            //loadOnDemand: true,
                            animation: {
                                collapse: {
                                    duration: 400,
                                    effects: 'fadeOut collapseVertical'
                                },
                                expand: {
                                    duration: 400,
                                    effects: 'fadeIn collapseVertical'
                                }
                            }
                        },
                        window: {
                            title: false,
                            modal: true,
                            resizable: false,
                            draggable: false,
                            visible: false,
                            open: function () {
                                this.center();
                            }

                        },
                        tip: {
                            autoHideAfter: 2000,
                            templates: [
                                {
                                    type: 'error',
                                    template: '<div class="tip"><span class="ico ico-error"></span><p>#: message#</p></div>'
                                },
                                {
                                    type: 'info',
                                    template: '<div class="tip"><span class="ico ico-ico-information"></span><p>#: message#</p></div>'
                                },
                                {
                                    type: 'warning',
                                    template: '<div class="tip"><span class="ico ico-warning"></span><p>#: message#</p></div>'
                                },
                                {
                                    type: 'success',
                                    template: '<div class="tip"><span class="ico ico-success"></span><p>#: message#</p></div>'
                                }
                            ],
                            show: function (e) {
                                var element = e.element.parent(),
                                    eWidth = element.width(),
                                    eHeight = element.height();
                                element.css({
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-' + (eHeight / 2) + 'px',
                                    marginLeft: '-' + (eWidth / 2) + 'px',
                                    position: 'fixed!important'
                                });
                            }
                        }
                    },
                    dataSource: {
                        setIndex: function (dataSource, data, startIndex, isSummary) {
                            var page = dataSource.page(),
                                pageSize = dataSource.options.pageSize,
                                currentBig = (page - 1) * pageSize;

                            angular.forEach(data, function (item, index) {
                                item.$index = (currentBig + index) + (startIndex || 0);
                            });
                            data && angular.isArray(data) && data.length > 0 && (data[0].isSummary = isSummary);
                            return data;
                        },
                        gridDataSource: function (url, params, options) {
                            options = options || {};
                            var count = 0;
                            var rootParams = angular.copy(params);
                            var totalDateStatus = false;
                            var rootTotalDate = {};
                            var requestUrl = url;

                            function kendoResult (kendoOptions) {
                                //if (count === 2) {
                                if (kendoOptions.totalData && kendoOptions.result && angular.isArray(kendoOptions.result.info)) {
                                    if (kendoOptions.totalData.info.extend) {
                                        kendoOptions.result.info.unshift(kendoOptions.totalData.info.extend);
                                    } else {
                                        kendoOptions.result.info.unshift(kendoOptions.totalData.info);
                                    }
                                }
                                kendoOptions.success(kendoOptions.result);
                                //}
                            }

                            function request (kendoOptions) {
                                return $.ajax({
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: requestUrl,
                                    //method:'POST',
                                    dataType: 'json',
                                    data: kendoOptions.params
                                })
                                    .success(function (result) {
                                        count = 1;
                                        kendoOptions.result = result;
                                        //if ( kendoOptions.totalData && result && angular.isArray ( result.info ) ) {
                                        //    result.info.unshift ( kendoOptions.totalData.info.extend )
                                        //}
                                        //kendoOptions.success ( result );
                                        kendoResult(kendoOptions);
                                    })

                                    .error(function (result) {
                                        kendoOptions.success(result);
                                    });
                            }

                            var dataSource = new kendo.data.DataSource({
                                serverPaging: true,
                                serverFiltering: true,
                                serverSorting: true,
                                transport: {
                                    read: function (kendoOptions) {
                                        kendoOptions.params = options.parameterMap && options.parameterMap(kendoOptions.data, 'read');
                                        var er = options.er;
                                        request(kendoOptions)

                                            .then(function (data) {
                                                if (er) {

                                                    er().then(function (totalData) {
                                                        count++;
                                                        totalDateStatus = true;
                                                        rootTotalDate = totalData;
                                                        kendoOptions.totalData = totalData;
                                                        kendoResult(kendoOptions);
                                                    }, function (totalData) {
                                                        kendoOptions.success({
                                                            info: totalData.info
                                                        });
                                                    });
                                                } else {
                                                    //count++;
                                                    kendoResult(kendoOptions);
                                                }
                                            });

                                    }
                                },
                                pageSize: options.pageSize || 10,
                                schema: {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function (response) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        return response;
                                    },
                                    total: function (response) {
                                        return response.totalSize;
                                    },
                                    data: function (response) {
                                        // 重置已选的数据
                                        var result = angular.isArray(response.info) ? response.info : [];

                                        if (angular.isString(response.info)) {
                                            dataSource.error = {code: '12312', message: response.info};
                                        } else {
                                            dataSource.error = undefined;
                                        }

                                        if (options && options.rebuild && angular.isFunction(options.rebuild)) {
                                            result = options.rebuild(result, response.totalSize);
                                        }
                                        return result;
                                    }
                                }
                            });

                            dataSource.refresh = function () {
                                if (!dataSource._requestInProgress) {
                                    dataSource.page(dataSource.page());
                                    return true;
                                } else {
                                    return false;
                                }
                            };

                            dataSource.setUrl = function (url) {
                                requestUrl = url;
                            };
                            return dataSource;
                        },
                        treeDataSource: function (url, params, options) {
                            return new kendo.data.HierarchicalDataSource({
                                transport: {
                                    read: {
                                        url: url,
                                        dataType: 'json',
                                        data: params
                                    },
                                    parameterMap: function (data, type) {
                                        var require = {};
                                        params.extraPropertys && (require = angular.extend(require, params.extraPropertys));
                                        require[params.property] = data.id;
                                        return require;
                                    }
                                },
                                schema: {
                                    model: {
                                        id: 'id',
                                        hasChildren: 'hasChildren'
                                    },
                                    parse: function (response) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        return response;
                                    },
                                    data: function (response) {
                                        // 重置已选的数据
                                        var temp = angular.isArray(response.info) ? response.info : [];
                                        return temp;
                                    }
                                }
                            });
                        }
                    },
                    grid: {
                        genGridCommonConfig: function (dataSource, template, columns, events, config) {
                            config.pageAble = config.pageAble === false ? config.pageAble : true;
                            events = events || {};
                            var mainGridOptions = {
                                dataSource: dataSource,
                                autoBind: angular.isUndefined(config.autoBind) ? true : false,
                                change: events.change || angular.noop,
                                selectable: true,
                                height: config.height || 'auto',
                                sortable: config.sortable === false ? false : true,
                                scrollable: config.height ? true : false,
                                dataBinding: function (e) {
                                    _hbUtil.kendo.grid.nullDataDealLeaf(e);
                                },
                                dataBound: function (e) {
                                    config.dataBound && config.dataBound(e);
                                },
                                rowTemplate: template || undefined,
                                columns: columns,
                                pageable: _hbUtil.kendo.grid.gridPageAble(config && config.pageAble)
                            };
                            return mainGridOptions;
                        },
                        // 复选框选中所有的复选框
                        selectAll: function (scope) {
                            scope.selected = !scope.selected;

                            this.storageSelectItems(scope, scope.selected);
                        },
                        storageSelectItems: function (scope, bool) {
                            scope.model.selectItems = [];
                            if (bool) {
                                scope.model.selectItems =
                                    _.map(scope.model.gridReturnData, 'OrderID');
                            }
                        },
                        checkBoxCheck: function (scope, e, dataItem) {
                            var id = dataItem['OrderID'],
                                index = _.findIndex(scope.model.selectItems, function (item) {
                                    return item === id;
                                });
                            if (e.target.checked) {
                                scope.model.selectItems.push(id);
                            } else {
                                scope.model.selectItems.splice(index, 1);
                            }
                        },
                        nullDataDealLeaf: function (e) {
                            if (!e) {
                                return false;
                            }
                            if (!e.sender) {
                                return false;
                            }
                            if (!e.sender.element) {
                                return false;
                            }

                            var gridElement = e.sender.element,
                                grid_null_data_container = gridElement.find('#grid_null_data_container');
                            if (grid_null_data_container.length > 0) {
                                grid_null_data_container.remove();
                            }

                            if (!e.items) {
                                return false;
                            }

                            if (e.items.length > 0) {
                                return false;
                            } else {
                                var gridContent = gridElement.find('.k-pager-wrap'),
                                    content = gridElement.find('.k-grid-content'),
                                    showTemplate = '未搜索到相关数据';
                                if (e.sender.dataSource.error) {
                                    showTemplate = e.sender.dataSource.error.message || '未搜索到相关数据';
                                }
                                var nullElement = $('<div id="grid_null_data_container" class="grid-null-data">' + showTemplate + '</div>');
                                if (content.length > 0) {
                                    content.css({
                                        borderTop: '1px solid #ddd',
                                        borderBottom: '1px solid #ddd'
                                    });
                                    nullElement.css({
                                        border: 'none'
                                    });
                                    if (e.sender.options.scrollable) {
                                        nullElement.css({
                                            padding: 0,
                                            marginTop: (content.height() / 2) - 10
                                        });
                                    }
                                    content.append(nullElement);
                                } else {
                                    if (gridContent.length > 0) {
                                        gridContent.before(nullElement);
                                    } else {
                                        gridElement.append(nullElement);
                                    }
                                }

                            }
                        },
                        gridPageAble: function (pageAble) {
                            return pageAble ? {
                                buttonCount: 10,
                                input: true,
                                pageSizes: [5, 10, 30, 50] || true,
                                refresh: true,
                                messages: {
                                    empty: '无数据'
                                }
                            } : false;
                        }
                    }
                };

                _hbUtil.kdGridCommonOption = function (options) {
                    var that = this;
                    return {
                        /*toolbar:[],*/
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(options.template),
                        noRecords: {
                            template: '暂无数据！'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: options.url,
                                    data: function (e) {
                                        var temp = {
                                            queryParam: {},
                                            page: {pageNo: e.page, pageSize: e.pageSize}
                                        }, params = options.param,authorizedParam=options.authorizedParam;
                                        for (var key in params) {
                                            if (params.hasOwnProperty(key)) {
                                                if (params[key] || params[key] === 0) {
                                                    temp.queryParam[key] = params[key];
                                                }
                                            }
                                        }
                                        for (var key in authorizedParam) {
                                            if (authorizedParam.hasOwnProperty(key)) {
                                                if (authorizedParam[key] || authorizedParam[key] === 0) {
                                                    temp[key] = authorizedParam[key];
                                                }
                                            }
                                        }
                                        if(options.outSidePage===true){
                                            delete temp.page;
                                            temp.pageNo = e.page;
                                            temp.pageSize = e.pageSize;
                                        }

                                        if (options.scope[options.skuParam]) {
                                            temp.queryParam = angular.extend(temp.queryParam, options.scope[options.skuParam]);
                                        }

                                        console.log(options.scope[options.skuParam]);
                                        if (options.parseFn) {
                                            options.parseFn(temp.queryParam);
                                        }
                                        options.scope.model[options.page].pageNo = e.page;
                                        options.scope.model[options.page].pageSize = e.pageSize;
                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;
                                        return temp;
                                    },
                                    dataType: 'json',
                                    error: function (data) {
                                        options.HB_notification.error('提示', data.info);
                                    }
                                }
                            },
                            page: 1,
                            pageSize: 10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {

                                        options.fn && options.fn(response);
                                        //$scope.gridArr = response.info;
                                        /*angular.forEach(response.info,function(item){
                                         item.haveVip=false;
                                         });
                                         */
                                        var viewData = response.info,
                                            i = 1,
                                            j = 0;
                                        _.forEach(viewData, function (row) {
                                            row.index = i++;
                                            row.itemNo = j++;
                                        });
                                        return response;
                                    } else {
                                        //HB_notification.error('提示', response.info);
                                        //$scope.global.alert('错误', '考试数据加载失败！');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },
                                total: function (response) {
                                    // 绑定数据所有总共多少条;
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    if (response.status) {
                                        var datas = response.info;
                                        return datas;
                                    } else {
                                        //HB_notification.error('提示', response.info);
                                        return [];
                                    }
                                } // 指定数据源
                            },
                            serverPaging: true
                        },
                        selectable: true,
                        scrollable: options.scrollable === true || false ,//第一次加载时的蒙板效果
                        dataBinding: function (e) {//没有数据时的默认提示语
                            that.kendo.grid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: 10,
                            buttonCount: 10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: options.columns
                    };
                };

                _hbUtil.kdGridCommonOptionDIY = function (options) {//支持自定义查询参数名
                    var that = this;
                    return {
                        /*toolbar:[],*/
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(options.template),
                        noRecords: {
                            template: '暂无数据！'
                        },
                        dataSource: options.data?
                            {
                                data:options.data,

                            }:
                            {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: options.url,
                                    data: function (e) {
                                        var temp = {
                                            queryParams: {},
                                            page: {pageNo: e.page, pageSize: e.pageSize}
                                        }, params = options.param;
                                        if(_hbUtil.validateIsNull(options.paramName)){
                                            //未指定参数名的情况下洒出来传给后端
                                            for (var key in params) {
                                                if (params.hasOwnProperty(key)) {
                                                    if (params[key] || params[key] === 0) {
                                                        temp[key] = params[key];
                                                    }
                                                }
                                            }
                                        }else {
                                            temp[options.paramName] = {};
                                            var tempParam = temp[options.paramName];
                                            for (var key in params) {
                                                if (params.hasOwnProperty(key)) {
                                                    if (params[key] || params[key] === 0) {
                                                        tempParam[key] = params[key];
                                                    }
                                                }
                                            }
                                        }
                                        console.log("=============");
                                        console.log(options.outSidePage);
                                        if(options.outSidePage===true){
                                            delete temp.page;
                                            temp.pageNo = e.page;
                                            temp.pageSize = e.pageSize;
                                        }


                                        if (options.scope.model[options.page]){
                                            options.scope.model[options.page].pageNo = e.page;
                                            options.scope.model[options.page].pageSize = e.pageSize;
                                        }
                                        delete e.page;
                                        delete e.pageSize;
                                        delete e.skip;
                                        delete e.take;
                                        return temp;
                                    },
                                    dataType: 'json',
                                    error: function (data) {
                                        options.HB_notification.error('提示', data.info);
                                    }
                                }
                            },
                            page: 1,
                            pageSize: options.pageSize||10, // 每页显示的数据数目
                            schema: {
                                // 数据源默认绑定的字段
                                // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {

                                        options.fn && options.fn(response);
                                        //$scope.gridArr = response.info;
                                        /*angular.forEach(response.info,function(item){
                                         item.haveVip=false;
                                         });
                                         */
                                        var viewData = response.info,
                                            i = 1,
                                            j = 0;
                                        if (viewData === null){
                                            response.info = [];
                                        }
                                        _.forEach(viewData, function (row) {
                                            row.index = i++;
                                            row.itemNo = j++;
                                        });
                                        return response;
                                    } else {
                                        //HB_notification.error('提示', response.info);
                                        //$scope.global.alert('错误', '考试数据加载失败！');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },
                                total: function (response) {
                                    // 绑定数据所有总共多少条;
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    if (response.status) {
                                        var datas = response.info;
                                        return datas;
                                    } else {
                                        //HB_notification.error('提示', response.info);
                                        return [];
                                    }
                                } // 指定数据源
                            },
                            serverPaging: true
                        },
                        selectable: true,
                        scrollable: false,//第一次加载时的蒙板效果
                        dataBinding: function (e) {//没有数据时的默认提示语
                            that.kendo.grid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: [5, 10, 30, 50] || true,
                            pageSize: options.pageSize||10,
                            buttonCount: options.pageSize||10
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: options.columns
                    };
                };

                _hbUtil.kdPagerOptionDIY = function (options){
                    var that = this;
                    return {
                        refresh   : true,
                        dataSource: options.data?
                            {
                                data:options.data,

                            }:new kendo.data.DataSource ({
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: options.url,
                                        data: function (e) {
                                            var temp = {
                                                queryParams: {},
                                                page: {pageNo: e.page, pageSize: e.pageSize}
                                            }, params = options.param;
                                            if(_hbUtil.validateIsNull(options.paramName)){
                                                //未指定参数名的情况下洒出来传给后端
                                                for (var key in params) {
                                                    if (params.hasOwnProperty(key)) {
                                                        if (params[key] || params[key] === 0) {
                                                            temp[key] = params[key];
                                                        }
                                                    }
                                                }
                                            }else {
                                                temp[options.paramName] = {};
                                                var tempParam = temp[options.paramName];
                                                for (var key in params) {
                                                    if (params.hasOwnProperty(key)) {
                                                        if (params[key] || params[key] === 0) {
                                                            tempParam[key] = params[key];
                                                        }
                                                    }
                                                }
                                            }
                                            console.log("=============");
                                            console.log(options.outSidePage);
                                            if(options.outSidePage===true){
                                                delete temp.page;
                                                temp.pageNo = e.page;
                                                temp.pageSize = e.pageSize;
                                            }


                                            if (options.scope.model[options.page]){
                                                options.scope.model[options.page].pageNo = e.page;
                                                options.scope.model[options.page].pageSize = e.pageSize;
                                            }
                                            delete e.page;
                                            delete e.pageSize;
                                            delete e.skip;
                                            delete e.take;
                                            return temp;
                                        },
                                        dataType: 'json',
                                        error: function (data) {
                                            options.HB_notification.error('提示', data.info);
                                        }
                                    }
                                },
                                page: 1,
                                pageSize: options.pageSize||10, // 每页显示的数据数目
                                schema: {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function (response) {
                                        // 将会把这个返回的数组绑定到数据源当中
                                        // 将会把这个返回的数组绑定到数据源当中
                                        if (response.status) {

                                            options.fn && options.fn(response);
                                            //$scope.gridArr = response.info;
                                            /*angular.forEach(response.info,function(item){
                                             item.haveVip=false;
                                             });
                                             */
                                            var viewData = response.info,
                                                i = 1,
                                                j = 0;
                                            _.forEach(viewData, function (row) {
                                                row.index = i++;
                                                row.itemNo = j++;
                                            });
                                            return response;
                                        } else {
                                            //HB_notification.error('提示', response.info);
                                            //$scope.global.alert('错误', '考试数据加载失败！');
                                            return {
                                                status: response.status,
                                                totalSize: 0,
                                                totalPageSize: 0,
                                                info: []
                                            };
                                        }
                                    },
                                    total: function (response) {
                                        // 绑定数据所有总共多少条;
                                        return response.totalSize;
                                    },
                                    data: function (response) {
                                        if (response.status) {
                                            var datas = response.info;
                                            return datas;
                                        } else {
                                            //HB_notification.error('提示', response.info);
                                            return [];
                                        }
                                    } // 指定数据源
                                },
                                serverPaging: true
                            }),
                        pageSizes: [5, 10, 30, 50] || true,
                        refresh: true,
                        pageSize: options.pageSize||10,
                        buttonCount: options.pageSize||10

                    };
                }

                _hbUtil.kdTreeOption = function (url,idName,extendArgString) {
                   return{
                       options:{
                           checkboxes: false,
                           // 当要去远程获取数据的时候数据源这么配置
                           dataSource: new kendo.data.HierarchicalDataSource({
                               transport: {
                                   read: function (options) {
                                       var id = options.data.id ? options.data.id : '';
                                       $.ajax({
                                           url: url + "?"+idName+"="+id,
                                           dataType: 'json',
                                           success: function (result) {
                                               options.success(result);
                                           },
                                           error: function (result) {
                                               options.error(result);
                                           }
                                       });
                                   }
                               },
                               schema: {
                                   model: {
                                       id: 'id',
                                       hasChildren: 'hasChildren'
                                   },
                                   data: function (data) {
                                       return data.info;
                                   }
                               }
                           })
                       }
                   }
                };


                //过滤HTML标签
                _hbUtil.filterHTMLTag = function (msg) {
                    var msg = msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
                    msg = msg.replace(/[|]*\n/, ''); //去除行尾空格
                    msg = msg.replace(/&.+;/ig, ''); //去掉nbsp
                    return msg;
                };

                return _hbUtil;
            }]);


        hbCommon.directive('selectGoods', ['easyKendoDialog', 'hbUtil', function (easyKendoDialog, hbUtil) {
            return {
                scope: {
                    skuId: '=?',
                    schemeId: '=?',
                    skuName: '=?',
                    categoryType: '=',
                    lwhSkuModel: '='
                },
                templateUrl: '@systemUrl@/templates/common/selectGoods.html',

                link: function ($scope, $ele, $attrs) {

                    $scope.model = {
                        queryParam: {
                            categoryType: validateIsNull($scope.categoryType) ? '' : $scope.categoryType, // 类目type
                            trainingSchemeEnabled: '-1', // 培训方案状态, -1表示不查询，0表示不启用，1表示启用
                            commoditySkuName: '', // 商品名称
                            commoditySkuState: '-1', // 上架状态 -1:全部 1已上架，2待上架，3已下架
                            saleState: '-1', // 售出否 -1全部，1已售，2未售
                            firstUpTimeMin: '', // 最小首次上架时间 yyyy-MM-dd
                            firstUpTimeMax: '' // 最大首次上架时间 yyyy-MM-dd
                        },
                        pageNo: 1,
                        pageSize: 10
                    };

                    //如果有这项attr隐藏培训方案为自主选课的选项
                    if ($attrs.hideGoodOption) {
                        $scope.hideGoodOption = true;
                        $scope.model.queryParam.categoryType = 'TRAINING_CLASS_GOODS';

                    } else {
                        $scope.hideGoodOption = false;
                    }

                    $scope.kendoPlus = {};


                    $scope.events = {

                        openSelectGoodsWin: function () {
                            if (validateIsNull($scope.skuName)) {
                                $scope.model.queryParam.commoditySkuName = '';
                            }
                            ;
                            $scope.selectGoodsWindow = easyKendoDialog.content({
                                templateUrl: '@systemUrl@/templates/common/chose-goods-dialog.html',
                                width: 1200,
                                title: false
                            }, $scope);
                            if ($attrs.hideGoodOption) {
                                $scope.selectGoodsWindow.skuParamsWin = validateIsNull($scope.lwhSkuModel) == true ? null : $scope.lwhSkuModel;
                            }
                        },

                        closeKendoWindow: function (windowName) {
                            if ($scope[windowName]) {
                                $scope[windowName].kendoDialog.close();
                            }
                        },

                        pressEnterKey: function (e) {
                            if (e.keyCode == 13) {
                                $scope.events.MainPageQueryList(e);
                            }
                        },

                        MainPageQueryList: function (e) {
                            e.stopPropagation();
                            $scope.model.pageNo = 1;
                            $scope.kendoPlus.goodsManagerGridInstance.pager.page(1);
                        },

                        selectItem: function (e, item) {
                            $scope.skuId = item.commoditySkuId;
                            $scope.schemeId = item.schemeId;
                            $scope.skuName = item.commodityName;
                            $scope.events.closeKendoWindow('selectGoodsWindow');
                            console.log(item);
                        },

                        clearModel: function (e) {
                            $scope.skuId = null;
                            $scope.skuName = null;
                            $scope.schemeId = null;
                        }
                    };


                    //商品列表模板
                    var goodManagerTemplate = '';
                    (function () {
                        var result = [];
                        result.push('<tr>');


                        result.push('<td>');
                        result.push('#: index #');
                        result.push('</td>');

                        result.push('<td>');
                        //result.push ( '#: commodityName #' );
                        result.push('<span style="cursor:pointer;" title="#: commodityName #" ng-click="events.goDetail($event,dataItem)">#: commodityName #</span>');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<span ng-if="dataItem.trainingSchemeType===\'TRAINING_CLASS\'">培训班学习</span>');
                        result.push('<span ng-if="dataItem.trainingSchemeType===\'COURSE\'">自主选课学习</span>');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                        result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                        result.push('</div>');
                        result.push('</td>');


                        //培训方案状态
                        result.push('<td>');
                        result.push('<span ng-if="dataItem.trainingSchemeStatus===1">正常</span>');
                        result.push('<span ng-if="dataItem.trainingSchemeStatus===2">停用</span>');
                        result.push('</td>');

                        //销售状态
                        result.push('<td>');
                        result.push('<span ng-if="dataItem.commoditySkuState===1">已上架</span>');
                        result.push('<span ng-if="dataItem.commoditySkuState===2">待上架</span>');
                        result.push('<span ng-if="dataItem.commoditySkuState===3">已下架</span>');
                        result.push('</td>');

                        //定价
                        result.push('<td>');
                        result.push('<span ng-if="dataItem.commodityType===\'TRAINING_CLASS\'">整班定价：<span ng-bind="dataItem.price"></span>元/班</span>');
                        result.push('<span ng-if="dataItem.commodityType===\'PERIOD\'">每学时：<span ng-bind="dataItem.price"></span>元/学时</span>');
                        result.push('<span ng-if="dataItem.commodityType===\'COURSE\'">课程定价：<span ng-bind="dataItem.price"></span>元/每个课程</span>');
                        result.push('</td>');


                        //是否售出
                        //result.push ( '<td>' );
                        //result.push ( '<span ng-if="dataItem.saleState===1">已售</span>' );
                        //result.push ( '<span ng-if="dataItem.saleState===2">未售</span>' );
                        //result.push ( '</td>' );

                        //首次上架时间
                        //result.push ( '<td>' );
                        //result.push ( '<span ng-if="dataItem.firstUpTime===null">-</span>' );
                        //result.push ( '<span ng-if="dataItem.firstUpTime!==null">#: firstUpTime #</span>' );
                        //result.push ( '</td>' );


                        result.push('<td>');
                        result.push('<button type="button" ng-click="events.selectItem($event,dataItem)"  class="table-btn">选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        goodManagerTemplate = result.join('');
                    })();

                    $scope.goodsManagerGrid = {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(goodManagerTemplate),
                            scrollable: false,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/commodityManager/getConfigDone',
                                        data: function (e) {

                                            var temp = {
                                                pageNo: e.page,
                                                pageSize: e.pageSize,
                                                queryParam: $scope.model.queryParam
                                            };


                                            if (!$scope.selectGoodsWindow.skuParamsWin) {
                                                temp.queryParam.skuPropertyList = undefined;
                                            } else {
                                                if (validateIsNull($scope.model.queryParam.categoryType)) {
                                                    temp.queryParam.skuPropertyList = undefined;
                                                } else {
                                                    temp.queryParam.skuPropertyList = $scope.selectGoodsWindow.skuParamsWin.skuPropertyList;
                                                }
                                            }

                                            //console.log($scope.skuParamsGoodsManager);


                                            $scope.model.pageNo = e.page;
                                            $scope.model.pageSize = e.pageSize;


                                            delete e.page;
                                            delete e.pageSize;
                                            delete e.skip;
                                            delete e.take;

                                            return temp;
                                        },
                                        dataType: 'json'
                                    }

                                },
                                pageSize: 5, // 每页显示的数据数目
                                schema: {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function (response) {
                                        $scope.goodsManagerArr = response.info;
                                        angular.forEach(response.info, function (item, ItemIndex) {
                                            item.index = ItemIndex + 1;
                                        });
                                        return response;
                                    },
                                    total: function (response) {
                                        return response.totalSize;
                                    },
                                    data: function (response) {
                                        return response.info;
                                    } // 指定数据源
                                },
                                serverPaging: true, //远程获取书籍
                                serverSorting: true //远程排序字段
                            },
                            selectable: true,
                            sortable: {
                                mode: 'single',
                                allowUnsort: false
                            },
                            dataBinding: function (e) {
                                $scope.model.gridReturnData = e.items;
                                hbUtil.kendo.grid.nullDataDealLeaf(e);
                            },
                            pageable: {
                                refresh: true,
                                pageSizes: [5, 10, 30, 50] || true,
                                pageSize: 10,
                                buttonCount: 10
                                //change: function (e) {
                                //    $scope.model.page.pageNo = parseInt(e.index, 10);
                                //    //== !!important!! 这里重复了page(1)的作用
                                //    // $scope.node.lessonGrid.dataSource.read();
                                //}
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns: [
                                {field: 'orderNo', title: 'NO.', sortable: false, width: 80},
                                {field: 'orderNo', title: '培训方案名称', sortable: false},
                                {field: 'firstGoods', title: '培训方案形式', sortable: false, width: 130},
                                {field: 'goodsCount', title: '属性', sortable: false, width: 200},
                                {field: 'totalAmount', title: '培训方案状态', sortable: false, width: 130},
                                {field: 'totalAmount', title: '销售状态', sortable: false, width: 100},
                                {field: 'totalAmount', title: '定价', sortable: false, width: 200},
                                //{ field: "totalAmount", title: "是否售出", sortable: false, width: 80 },
                                //{ field: "totalAmount", title: "首次上架时间", sortable: false, width: 200 },
                                {
                                    title: '操作', width: 80
                                }
                            ]
                        }
                    };

                    //验证是否为空
                    function validateIsNull (obj) {
                        return (obj === '' || obj === undefined || obj === null);
                    }

                }
            };
        }]);


        hbCommon.directive('zgjselectGoods', ['easyKendoDialog', 'hbUtil', function (easyKendoDialog, hbUtil) {
            return {
                scope: {
                    skuId: '=?',
                    schemeId: '=?',
                    skuName: '=?',
                    categoryType: '=',
                    lwhSkuModel: '='
                },
                templateUrl: '@systemUrl@/templates/common/selectGoods.html',

                link: function ($scope, $ele, $attrs) {

                    $scope.model = {
                        queryParam: {
                            categoryType: validateIsNull($scope.categoryType) ? '' : $scope.categoryType, // 类目type
                            trainingSchemeEnabled: '-1', // 培训方案状态, -1表示不查询，0表示不启用，1表示启用
                            commoditySkuName: '', // 商品名称
                            commoditySkuState: '-1', // 上架状态 -1:全部 1已上架，2待上架，3已下架
                            saleState: '-1', // 售出否 -1全部，1已售，2未售
                            firstUpTimeMin: '', // 最小首次上架时间 yyyy-MM-dd
                            firstUpTimeMax: '', // 最大首次上架时间 yyyy-MM-dd
                            skuPropertyList:[]
                        },
                        pageNo: 1,
                        pageSize: 10
                    };

                    //如果有这项attr隐藏培训方案为自主选课的选项
                    if ($attrs.hideGoodOption) {
                        $scope.hideGoodOption = true;
                        $scope.model.queryParam.categoryType = 'TRAINING_CLASS_GOODS';
                    } else {
                        $scope.hideGoodOption = false;
                    }

                    $scope.kendoPlus = {};


                    $scope.events = {

                        openSelectGoodsWin: function () {
                            if (validateIsNull($scope.skuName)) {
                                $scope.model.queryParam.commoditySkuName = '';
                            }
                            $scope.selectGoodsWindow = easyKendoDialog.content({
                                templateUrl: '@systemUrl@/templates/common/chose-goods-dialog.html',
                                width: 1200,
                                title: false
                            }, $scope);
                            if ($attrs.hideGoodOption) {
                                $scope.selectGoodsWindow.skuParamsWin = validateIsNull($scope.lwhSkuModel) == true ? null : $scope.lwhSkuModel;
                            }
                        },

                        closeKendoWindow: function (windowName) {
                            if ($scope[windowName]) {
                                $scope[windowName].kendoDialog.close();
                            }
                        },

                        pressEnterKey: function (e) {
                            if (e.keyCode == 13) {
                                $scope.events.MainPageQueryList(e);
                            }
                        },

                        MainPageQueryList: function (e) {
                            e.stopPropagation();
                            $scope.model.pageNo = 1;
                            $scope.kendoPlus.goodsManagerGridInstance.pager.page(1);
                        },

                        selectItem: function (e, item) {
                            $scope.skuId = item.commoditySkuId;
                            $scope.schemeId = item.schemeId;
                            $scope.skuName = item.commodityName;
                            $scope.events.closeKendoWindow('selectGoodsWindow');
                            console.log(item);
                        },

                        clearModel: function (e) {
                            $scope.skuId = null;
                            $scope.skuName = null;
                            $scope.schemeId = null;
                        }
                    };


                    //商品列表模板
                    var goodManagerTemplate = '';
                    (function () {
                        var result = [];
                        result.push('<tr>');


                        result.push('<td>');
                        result.push('#: index #');
                        result.push('</td>');

                        result.push('<td>');
                        //result.push ( '#: commodityName #' );
                        result.push('<span style="cursor:pointer;" title="#: commodityName #" ng-click="events.goDetail($event,dataItem)">#: commodityName #</span>');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<span ng-if="dataItem.trainingSchemeType===\'TRAINING_CLASS\'">培训班学习</span>');
                        result.push('<span ng-if="dataItem.trainingSchemeType===\'COURSE\'">自主选课学习</span>');
                        result.push('</td>');


                        result.push('<td>');
                        result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                        result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                        result.push('</div>');
                        result.push('</td>');


                        //培训方案状态
                        result.push('<td>');
                        result.push('<span ng-if="dataItem.trainingSchemeStatus===1">正常</span>');
                        result.push('<span ng-if="dataItem.trainingSchemeStatus===2">停用</span>');
                        result.push('</td>');

                        //销售状态
                        result.push('<td>');
                        result.push('<span ng-if="dataItem.commoditySkuState===1">已上架</span>');
                        result.push('<span ng-if="dataItem.commoditySkuState===2">待上架</span>');
                        result.push('<span ng-if="dataItem.commoditySkuState===3">已下架</span>');
                        result.push('</td>');

                        //定价
                        result.push('<td>');
                        result.push('<span ng-if="dataItem.commodityType===\'TRAINING_CLASS\'">整班定价：<span ng-bind="dataItem.price"></span>元/班</span>');
                        result.push('<span ng-if="dataItem.commodityType===\'PERIOD\'">每学时：<span ng-bind="dataItem.price"></span>元/学时</span>');
                        result.push('<span ng-if="dataItem.commodityType===\'COURSE\'">课程定价：<span ng-bind="dataItem.price"></span>元/每个课程</span>');
                        result.push('</td>');


                        //是否售出
                        //result.push ( '<td>' );
                        //result.push ( '<span ng-if="dataItem.saleState===1">已售</span>' );
                        //result.push ( '<span ng-if="dataItem.saleState===2">未售</span>' );
                        //result.push ( '</td>' );

                        //首次上架时间
                        //result.push ( '<td>' );
                        //result.push ( '<span ng-if="dataItem.firstUpTime===null">-</span>' );
                        //result.push ( '<span ng-if="dataItem.firstUpTime!==null">#: firstUpTime #</span>' );
                        //result.push ( '</td>' );


                        result.push('<td>');
                        result.push('<button type="button" ng-click="events.selectItem($event,dataItem)"  class="table-btn">选择</button>');
                        result.push('</td>');

                        result.push('</tr>');
                        goodManagerTemplate = result.join('');
                    })();

                    $scope.goodsManagerGrid = {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(goodManagerTemplate),
                            scrollable: false,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/commodityManager/getFaceToFaceClassConfigDone',
                                        data: function (e) {

                                            var temp = {
                                                pageNo: e.page,
                                                pageSize: e.pageSize,
                                                queryParam: $scope.model.queryParam
                                            };


                                            if (!$scope.selectGoodsWindow.skuParamsWin) {
                                                temp.queryParam.skuPropertyList = undefined;
                                            } else {
                                                if (validateIsNull($scope.model.queryParam.categoryType)) {
                                                    temp.queryParam.skuPropertyList = undefined;
                                                } else {
                                                    temp.queryParam.skuPropertyList = $scope.selectGoodsWindow.skuParamsWin.skuPropertyList;
                                                }
                                            }

                                            //console.log($scope.skuParamsGoodsManager);


                                            $scope.model.pageNo = e.page;
                                            $scope.model.pageSize = e.pageSize;


                                            delete e.page;
                                            delete e.pageSize;
                                            delete e.skip;
                                            delete e.take;

                                            return temp;
                                        },
                                        dataType: 'json'
                                    }

                                },
                                pageSize: 5, // 每页显示的数据数目
                                schema: {
                                    // 数据源默认绑定的字段
                                    // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                                    // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                                    // 优先与后面的data执行，返回的数据为下面data上面的参数response
                                    parse: function (response) {
                                        $scope.goodsManagerArr = response.info;
                                        angular.forEach(response.info, function (item, ItemIndex) {
                                            item.index = ItemIndex + 1;
                                        });
                                        return response;
                                    },
                                    total: function (response) {
                                        return response.totalSize;
                                    },
                                    data: function (response) {
                                        return response.info;
                                    } // 指定数据源
                                },
                                serverPaging: true, //远程获取书籍
                                serverSorting: true //远程排序字段
                            },
                            selectable: true,
                            sortable: {
                                mode: 'single',
                                allowUnsort: false
                            },
                            dataBinding: function (e) {
                                $scope.model.gridReturnData = e.items;
                                hbUtil.kendo.grid.nullDataDealLeaf(e);
                            },
                            pageable: {
                                refresh: true,
                                pageSizes: [5, 10, 30, 50] || true,
                                pageSize: 10,
                                buttonCount: 10
                                //change: function (e) {
                                //    $scope.model.page.pageNo = parseInt(e.index, 10);
                                //    //== !!important!! 这里重复了page(1)的作用
                                //    // $scope.node.lessonGrid.dataSource.read();
                                //}
                            },
                            // 选中切换的时候改变选中行的时候触发的事件
                            columns: [
                                {field: 'orderNo', title: 'NO.', sortable: false, width: 80},
                                {field: 'orderNo', title: '培训方案名称', sortable: false},
                                {field: 'firstGoods', title: '培训方案形式', sortable: false, width: 130},
                                {field: 'goodsCount', title: '属性', sortable: false, width: 200},
                                {field: 'totalAmount', title: '培训方案状态', sortable: false, width: 130},
                                {field: 'totalAmount', title: '销售状态', sortable: false, width: 100},
                                {field: 'totalAmount', title: '定价', sortable: false, width: 200},
                                //{ field: "totalAmount", title: "是否售出", sortable: false, width: 80 },
                                //{ field: "totalAmount", title: "首次上架时间", sortable: false, width: 200 },
                                {
                                    title: '操作', width: 80
                                }
                            ]
                        }
                    };

                    //验证是否为空
                    function validateIsNull (obj) {
                        return (obj === '' || obj === undefined || obj === null);
                    }

                }
            };
        }]);



        hbCommon.directive('hbBind', ['$compile', '$parse', function ($compile, $parse) {
            return {
                link: function ($scope, $element, $attr) {
                    $scope.$watch($attr.hbBind, function () {
                        var hbBind = $parse($attr.hbBind)($scope);
                        var comHbBind = $compile($.parseHTML(hbBind))($scope);
                        $element.html(comHbBind);
                    });
                }
            };
        }]);

        hbCommon.factory('$notify', ['HB_dialog', function (HB_dialog) {
            return {

                tipInstance: null,

                normal: function (content, config) {
                    if (!this.tipInstance) {
                        var notify = $('<span class="notify-my"></span>');
                        $('body').append(notify);
                        this.tipInstance = notify.kendoNotification({
                            stacking: 'down',

                            autoHideAfter: (config.hideAfter || 3) * 1000,
                            hide: function (e) {
                                notify.remove();
                            },
                            position: {
                                top: 125
                            },
                            templates: [
                                {
                                    type: 'reportSuccess',
                                    template: '<div class="report-success"><h3>#= message #</h3></div>'
                                }
                            ]
                        })
                            .data('kendoNotification');
                    }

                    this.tipInstance.show(content, config.type);

                },
                success: function (content, config) {
                    config = config || {};
                    config.type = 'success';
                    // this.normal(content, config)
                    HB_dialog.success('提示', content);
                },
                warning: function (content, config) {
                    config = config || {};
                    config.type = 'warning';
                    // this.normal(content, config)
                    HB_dialog.warning('提示', content);
                },
                error: function (content, config) {
                    config = config || {};
                    config.type = 'error';
                    // this.normal(content, config)
                    HB_dialog.error('提示', content);
                }
            };
        }]);

        hbCommon.factory('HB_dialog', ['$rootScope', '$timeout', '$compile', 'HB_notification',
            function ($rootScope, $timeout, $compile, HB_notification) {
                var notification = {

                    alert: function (title, message) {
                        HB_notification.alert(message);
                    },

                    success: function (title, message) {
                        HB_notification.showTip(message, 'success');
                    },

                    warning: function (title, message) {
                        HB_notification.showTip(message, 'warning');
                    },

                    /**
                     * 信息弹窗
                     * @param title
                     * @param message
                     */
                    info: function (title, message) {
                        HB_notification.showTip(message, 'info');
                    },

                    /**
                     * 错误弹窗
                     * @param title
                     * @param message
                     */
                    error: function (title, message) {
                        HB_notification.showTip(message, 'error');
                    },

                    /**
                     * 服务器错误的弹窗
                     * @param error
                     */

                    serviceErrors: function (error) {
                        $rootScope.errors = $rootScope.errors || [];
                        $rootScope.errorDialogInfo = $rootScope.errorDialogInfo || {};
                        if (!$rootScope.errorDialogInfo.dialogOn) {
                            notification.currentErrorAlertDom = angular.element('<div service-error-dialog errors="errors" error-dialog-info="errorDialogInfo"></div>');
                            angular.element('body').append($compile(notification.currentErrorAlertDom)($rootScope));
                            $rootScope.errorDialogInfo.dialogOn = true;
                        }
                        $rootScope.errors.push(error);
                        $rootScope.$watch('errors', function () {
                            $rootScope.errorDialogInfo.highlightError = true;
                            $timeout.cancel($rootScope.errorDialogInfo.timer);
                            $rootScope.errorDialogInfo.timer = $timeout(function () {
                                $rootScope.errorDialogInfo.highlightError = false;
                            }, 2000);
                        });
                    },

                    /**
                     * 关闭服务器错误的弹窗
                     */
                    closeServiceErrors: function () {
                        $rootScope.errorDialogInfo.dialogOn = false;
                        notification.currentErrorAlertDom.remove();
                        $rootScope.errors = [];
                    },

                    clearDialogInfo: function ($scope) {
                        $timeout(function () {
                            if ($scope.$$_$$_$$_hbNotification.contentDialogs.length <= 0) {
                                $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom && $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom.hide();
                                notification.initialIndex = 9999;
                            }
                        }, 500);
                    },

                    closeDialogByIndex: function ($scope, dialogIndex, callback) {
                        if (!$scope.$$_$$_$$_hbNotification.contentDialogs) {
                            return false;
                        }
                        $scope.$$_$$_$$_hbNotification.contentDialogs.splice(dialogIndex, 1);

                        callback && callback();
                        notification.clearDialogInfo($scope);
                    },
                    initialIndex: 9999,
                    dialogOn: false,
                    showLoading: function (index) {
                        notification.loadingElement = angular.element('<div class="myLoading"><img src="images/loading.gif"/></div>');
                        angular.element('body').append(notification.loadingElement);
                        notification.loadingElement.css({zIndex: index || 100});
                    },
                    removeLoading: function () {
                        notification.loadingElement.remove();
                    },
                    /**
                     * 内容弹窗
                     * @param $scope
                     * @param info
                     * @returns {boolean}
                     */
                    contentAs: function ($scope, info) {
                        var timestamp = new Date().getTime();
                        if (!info.templateUrl) {
                            return false;
                        }

                        $scope.$$_$$_$$_hbNotification = $scope.$$_$$_$$_hbNotification || {};

                        $scope.$$_$$_$$_hbNotification.contentDialogs = $scope.$$_$$_$$_hbNotification.contentDialogs || [];
                        if (!$scope.$$_$$_$$_hbNotification.dialogOn) {
                            $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom = angular.element('<div  content-dialog></div>');
                            angular.element('body').append($scope.$$_$$_$$_hbNotification.$$$$currentAlertDom);
                            $compile($scope.$$_$$_$$_hbNotification.$$$$currentAlertDom)($scope);
                            $scope.$$_$$_$$_hbNotification.dialogOn = true;
                            $scope.$on('$destroy', function () {
                                $scope.$$_$$_$$_hbNotification.contentDialogs = [];
                                $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom && $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom.remove();
                                $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom = null;
                                $scope.$$_$$_$$_hbNotification.dialogOn = false;
                            });
                        } else {
                            $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom && $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom.show();
                        }

                        var dialogId = 'dialog_id_of_content' + timestamp,
                            dialogInstance = {
                                dialogId: dialogId,
                                showCertain: info && (typeof info.showCertain === 'undefined' ? true : info.showCertain),
                                showCancel: info && (typeof info.showCancel === 'undefined' ? true : info.showCancel),
                                dialogIndex: timestamp,
                                zIndex: timestamp,
                                showModal: info && (info.showModal === false ? false : true),
                                showTitle: info && (info.showTitle === false ? false : true),
                                title: info && (info.title || '提示'),
                                confirmText: info && info.confirmText || '确定',
                                cancelText: info && info.cancelText || '取消',
                                closed: info && info.closed || angular.noop,
                                style: {
                                    position: 'absolute',
                                    width: info.width || '',
                                    height: info.height || '',
                                    top: '50%',
                                    left: '50%'
                                },
                                closeMe: function () {
                                    notification.closeDialogByIndex($scope, dialogInstance.dialogIndex, info && info.onClose);
                                },
                                close: function (dialogIndex) {
                                    this.closed && angular.isFunction(this.closed) && this.closed();
                                    notification.closeDialogByIndex($scope, dialogIndex, info && info.onClose);
                                },
                                templateUrl: info && info.templateUrl || '',

                                loaded: function (dialogIndex) {
                                    var dialogContainer = $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom.find('.pf-dialog-container').eq(dialogIndex).find('.dialog'),
                                        outerHeight = dialogContainer.outerHeight(),
                                        outerWidth = dialogContainer.outerWidth();
                                    dialogContainer.show();
                                    this.style.marginTop = (outerHeight / 2 * -1) + 'px';
                                    this.style.marginLeft = (outerWidth / 2 * -1) + 'px';
                                    this.dialogLoaded = true;
                                },

                                click: function (dialogIndex) {
                                    var self = this;
                                    if (self.requestIng) {
                                        return false;
                                    }
                                    self.requestIng = true;
                                    info && (function () {
                                        (info.sure && angular.isFunction(info.sure)) && info.sure({
                                            dialogIndex: dialogIndex,
                                            theDialog: $scope.$$_$$_$$_hbNotification.$$$$currentAlertDom,
                                            close: function (dialogIndex) {
                                                self.close(dialogIndex);
                                            },
                                            self: self
                                        }).then(function () {
                                            self.requestIng = false;
                                        }, function () {
                                            self.requestIng = false;
                                        });
                                    })();
                                },

                                cancel: function (dialogIndex) {
                                    var self = this;
                                    if (self.requestIng) {
                                        return false;
                                    }
                                    info && (function () {
                                        (info.cancel && angular.isFunction(info.cancel)) && info.cancel();
                                    })();

                                    self.close(dialogIndex);
                                }
                            };
                        $rootScope.$on('events:loginSuccess', function (events, data) {
                            notification.closeDialogByIndex(events.targetScope, data.dialogIndex);
                        });
                        $scope.$$_$$_$$_hbNotification.contentDialogs.push(dialogInstance);
                        return dialogInstance;
                    }
                };
                return notification;
            }]);

        hbCommon.directive('contentDialog', [function () {
            return {
                scope: true,
                templateUrl: '@systemUrl@/templates/common/tpl-dialog.html'
            };
        }])

            .directive('loadingBiu', [function () {
                return {
                    scope: {
                        isLoading: '=',
                        loading: '&',
                        isDisable: '='
                    },
                    restrict: 'A',
                    replace: true,
                    template: '<button ng-disabled="isLoading || isDisable" ng-disabled="isDisable"' +
                    ' class="btn btn-b ml10 " ng-click="loading()">' +
                    '<span ng-bind="text" ng-if="!isLoading"></span>' +
                    '<span ng-if="isLoading" class="loading-btnimg">' +
                    '<img ng-src="@systemUrl@/images/gray-loading.gif"></span></button>',
                    link: function ($scope, $element, $attr) {
                        $scope.text = $attr.text || '加载';
                    }
                };
            }])

            .directive('selectClass', ['hbUtil', '$timeout', '$state',
                function (hbUtil, $timeout, $state) {

                    return {
                        templateUrl: '@systemUrl@/templates/common/selectClass.html',
                        scope: {
                            map: '=',
                            permission: '=',
                            dialog: '='
                        },
                        link: function ($scope) {

                            $scope.summaryState = $state;
                            $scope.model = {
                                query: {
                                    queryParam: {},
                                    page: {}
                                },
                                configedQueryParam: {
                                    onSaleState: 0,//这里查全部
                                    saleState: 0,
                                    price: '',
                                    commodityName: '',
                                    minFirstUpTime: '',
                                    maxFirstUpTime: '',
                                    orderByCondition: 0,//0默认 1首次上架时间 排序
                                    sortOrder: 0//0降序 1升序
                                },
                                classPage: {
                                    pageNo: 1,
                                    pageSize: 10
                                }
                            };

                            angular.extend($scope.model.query.queryParam, {
                                onSaleState: 0,//这里查全部
                                saleState: 0,
                                orderByCondition: 0,//0默认 1首次上架时间 排序
                                sortOrder: 0//0降序 1升序
                            });

                            $scope.kendoPlus = {
                                classGridInstance: null
                            };

                            //已配置模板
                            var classGridRowTemplate = '';
                            (function () {
                                var result = [];
                                result.push('<tr>');

                                result.push('<td title="#: commodityName #">');
                                result.push('#:commodityName#');
                                result.push('</td>');

                                result.push('<td>');
                                //hbSkuService.kendoSkuDo(result);
                                result.push('<div ng-repeat="item in dataItem.skuPropertyNameList">');
                                result.push('<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>');
                                result.push('<br />');
                                result.push('</div>');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('<span ng-if="#:onSaleState==1#">已上架</span>' + '<span ng-if="#:onSaleState==2#">待上架</span>' + '<span ng-if="#:onSaleState==3#">已下架</span>');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('<span ng-if="#:saleState==1#">已售</span>' + '<span ng-if="#:saleState==2#">未售</span>');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('#: credit #');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('#: price #');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('首次上架时间：');
                                result.push('<span ng-if="#: firstUpTime!==null #">#: firstUpTime #</span>');
                                result.push('<span ng-if="#: firstUpTime==null #">-</span>');
                                result.push('<br />');
                                //result.push('预计上架时间：');
                                result.push('<span ng-if="#: futureUpTime!==null #">预计上架时间：#: futureUpTime #</span>');
                                //result.push('预计上架时间：'+'<span ng-if="#: futureUpTime!==null #">#: futureUpTime #</span>');
                                //result.push('<span ng-if="#: futureUpTime==null #">-</span>');
                                result.push('</td>');

                                result.push('<td>');
                                result.push('<button type="button" ng-init="dataItem.selected=map.commoditySkuId===dataItem.commoditySkuId" class="table-btn" ng-click="events.doChoose(dataItem)">选择</button>');
                                result.push('</td>');

                                result.push('</tr>');
                                classGridRowTemplate = result.join('');
                            })();

                            $scope.classGrid = {
                                options: hbUtil.kdGridCommonOption({
                                    template: classGridRowTemplate,
                                    url: '/web/admin/commodityManager/getConfigDone',
                                    scope: $scope,
                                    page: 'classPage',
                                    param: $scope.model.configedQueryParam,
                                    skuParam: 'skuParamsClassEstablishDialog',
                                    fn: function (response) {
                                        console.log(response);
                                        $scope.configedArr = response.info;
                                    },
                                    columns: [
                                        {field: 'commodityName', title: '班级名称', sortable: false},
                                        {field: 'attr', title: '属性', sortable: false, width: 230},
                                        {field: 'onSaleState', title: '上架状态', sortable: false, width: 80},
                                        {field: 'saleState', title: '是否出售', sortable: false, width: 80},
                                        {field: 'credit', title: '学时', sortable: false, width: 80},
                                        {field: 'price', title: '价格', sortable: false, width: 80},
                                        {
                                            field: 'onSaleTime', title: '上架时间', sortable: false, width: 260,
                                            headerTemplate: '上架时间<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder==0" ng-click="events.setSortOrder(1)" class="ico lwh-ico-up"></a>' +
                                            '<a href="javascript:void(0)" ng-if="model.configedQueryParam.sortOrder!==0" ng-click="events.setSortOrder(0)" class="ico lwh-ico-down"></a>'
                                        },
                                        {
                                            title: '操作', width: 80
                                        }
                                    ]
                                })
                            };


                            $scope.events = {
                                doSearch: function (gridName, pageName) {
                                    $scope.model[pageName].pageNo = 1;
                                    $scope.kendoPlus[gridName].pager.page(1);
                                    //selectClassGridDataSource.refresh();
                                },
                                doChoose: function (item) {
                                    item.selected = !item.selected;
                                    if (item.selected) {
                                        $scope.map = item;
                                        console.log($scope.map);
                                        $timeout(function () {
                                            $scope.dialog.closeMe();
                                        });
                                    } else {
                                        $scope.map = undefined;
                                    }
                                }
                            };
                        }
                    };

                }])

            .directive('selectClassInput', ['HB_dialog', '$parse', function (HB_dialog, $parse) {
                return {
                    scope: {model: '=', permission: '='},
                    template: '<input type="text"' +
                    'ng-click="events.selectClass($event)" ' +
                    'hb-clear-input ' +
                    'ng-model="model.trainClass.commodityName" hb-readonly class="ipt ipt-large" ' +
                    'placeholder="请选择班级"/> ',
                    replace: true,
                    link: function ($scope) {
                        $scope.$watch('model.trainClass.commodityName', function (newValue, oldValue) {
                            if (newValue === '' || typeof newValue === 'undefined') {
                                $parse('model.trainClass').assign($scope, undefined);
                            } else {
                                $parse('model.learnTimeYear').assign($scope, undefined);
                            }
                        });
                        $scope.events = {
                            selectClass: function () {
                                $scope.theContentDialog = HB_dialog.contentAs($scope, {
                                    width: 1200,
                                    showCertain: false,
                                    showCancel: false,
                                    height: 550,
                                    title: '选择班级',
                                    templateUrl: '@systemUrl@/views/summary/selectClass.html'
                                });
                            }
                        };
                    }
                };
            }])
            /****
             * 选择学时年度的指令
             */
            .directive('queryLearnTimeYear', ['hbUtil', function (hbUtil) {
                return {
                    replace: true,
                    scope: {model: '='},
                    template: '<select  kendo-combo-box' +
                    ' hb-clear-input' +
                    ' class="slt slt-small"' +
                    ' k-ng-model="model.learnTimeYear"' +
                    ' k-options="learnTimeYearComboOptions"' +
                    ' style="width: 170px;">' +
                    '</select> ',
                    link: function ($scope) {
                        $scope.learnTimeYearComboOptions = new hbUtil.kendo.config.combobox({

                            placeholder: '请选择继续教育年度',
                            dataSource: hbUtil.kendo.dataSource.gridDataSource('/web/admin/commodityManager/getSkuPropertyValues?skuPropertyId=5a3bc134658b41a2c18020351e69bac1')
                        });

                    }
                };
            }])

            /**
             * 职称等级的指令
             */
            .directive('queryTitleLevel', ['hbUtil', function (hbUtil) {
                return {
                    replace: true,
                    scope: {model: '='},
                    template: '    <select  kendo-combo-box' +
                    ' hb-clear-input' +
                    ' class="slt slt-small"' +
                    ' k-ng-model="model.titleLevel"' +
                    ' k-options="titleLevelComboOptions"' +
                    ' style="width: 150px;">  </select>',
                    link: function ($scope) {
                        $scope.titleLevelComboOptions = new hbUtil.kendo.config.combobox({
                            placeholder: '请选择职称等级',
                            dataSource: hbUtil.kendo.dataSource.gridDataSource('/web/admin/commodityManager/getSkuPropertyValues?skuPropertyId=5a3bc134658b41a2c18020351e69bac3')
                        });
                    }
                };
            }])

            /**
             * 选择地区指令
             */
            .directive('queryRegion', ['hbUtil', function (hbUtil) {
                return {
                    replace: true,
                    scope: {model: '=', viewName: '=', defaultRegion: '='},
                    templateUrl: '@systemUrl@/templates/summary/region-main.html',
                    link: function ($scope, $element) {

                        $scope.$watch('model.regionName', function (newValue) {
                            if (!newValue) {
                                $scope.model.region = undefined;
                                $scope.node && $scope.node.tree && $scope.node.tree.select($());
                            } else {
                                var barElement = $scope.node.tree.findByUid($scope.model.region.uid);
                                $scope.node.tree.select(barElement);
                            }
                        });

                        function getRequestUrl () {
                            var requestUrl = '/web/admin/administratorManage/getAreaByParentId';
                            if ($scope.viewName !== 'states.humanActivation') {
                                requestUrl = '/web/admin/learningStatistics/getAreaByParentId';
                            }
                            return requestUrl;
                        }

                        var requestUrl = getRequestUrl(),
                            dataSource = new kendo.data.HierarchicalDataSource({
                                transport: {
                                    read: {
                                        url: requestUrl
                                    },
                                    parameterMap: function (data) {
                                        data.parentId = data.id;
                                        data.id = undefined;
                                        return data;
                                    }
                                },
                                schema: {
                                    model: {
                                        id: 'id'
                                    },
                                    data: function (response) {
                                        var info = response.info;
                                        angular.forEach(info, function (item) {
                                            item.hasChildren = true;
                                        });
                                        return response.info;
                                    }
                                }
                            });
                        var isInit = true;

                        $scope.model.region = {};

                        $scope.treeConfig = {
                            autoBind: true,
                            select: function () {
                                var item = this.dataItem(this._current);
                                $scope.$evalAsync(function () {
                                    $scope.model.region = item;
                                    $scope.model.regionName = item.name;
                                });
                            },
                            dataBound: function (e) {
                                if (isInit) {
                                    isInit = false;
                                    var firstItem = dataSource.at(0);
                                    if (firstItem) {
                                        !$scope.defaultRegion && ($scope.defaultRegion = firstItem);
                                        var barElement = this.findByUid(firstItem.uid);
                                        this.select(barElement);
                                        this.trigger('select');
                                    }
                                }
                            },
                            dataTextField: 'name',
                            dataSource: dataSource
                        };

                        $scope.popConfig = {
                            anchor: $element.find('input[data-id="pop"]'),
                            height: 400
                        };
                        //
                        // dataSource.read ();
                        // // if ( dataSource.view ().length <= 0 ) {
                        // //     dataSource.read ();
                        // // }

                        $scope.openTree = function () {
                            $scope.node.kendoPopup.open();
                        };
                    }
                };
            }])


            .directive('aaa', [
                function () {

                    return {

                        link: function ($scope) {

                            alert();


                        }
                    };

                }])


            .directive('queryRegion1', ['hbUtil', '$http', function (hbUtil, $http) {
                return {
                    replace: true,
                    scope: {model: '=', viewName: '=', defaultRegion: '='},
                    templateUrl: '@systemUrl@/templates/summary/region-main.html',
                    link: function ($scope, $element) {

                        //alert(1);
                        /*           $scope.fn=function(item){
                         console.log(item);
                         }*/

                        /* $scope.$watch('model.regionName', function (newValue) {
                         if (!newValue) {

                         //  console.log("watch"+$scope.model.region);
                         $scope.model.region = undefined;
                         $scope.node && $scope.node.tree && $scope.node.tree.select($());
                         } else {
                         /!* console.log($scope.node.tree);
                         var barElement = $scope.node.tree.findByUid($scope.model.region.uid);
                         $scope.node.tree.select(barElement);*!/
                         }
                         });*/

                        function getRequestUrl () {
                            var requestUrl = '/web/admin/administratorManage/getAreaByParentId';
                            if ($scope.viewName !== 'states.humanActivation') {
                                requestUrl = '/web/admin/learningStatistics/getAreaByParentId';
                            }
                            return requestUrl;
                        }

                        var requestUrl = getRequestUrl(),
                            dataSource = new kendo.data.HierarchicalDataSource({
                                transport: {
                                    read: {
                                        url: requestUrl
                                    },
                                    parameterMap: function (data) {
                                        data.parentId = data.id;
                                        data.id = undefined;
                                        return data;
                                    }
                                },
                                schema: {
                                    model: {
                                        id: 'id'
                                    },
                                    data: function (response) {
                                        var info = response.info;
                                        angular.forEach(info, function (item) {
                                            item.hasChildren = true;
                                        });
                                        return response.info;
                                    }
                                }
                            });
                        var isInit = true;

                        $scope.model.region = {};

                        $scope.treeConfig = {
                            autoBind: true,
                            select: function () {
                                var item = this.dataItem(this._current);
                                $scope.$evalAsync(function () {
                                    /* console.log($scope.model.defaultRegion);*/
                                    /* var requestRegionUrl ="/web/admin/learningStatistics/getAreaByParentId?parentId="+item.parentId;
                                     $http.get(requestRegionUrl).success(function(response){
                                     console.log(response);
                                     })*/
                                    //console.log(item);
                                    //console.log(item.regionPath.split('/').length);
                                    if (item.regionPath.split('/').length < 4) {
                                        return false;
                                    } else {
                                        $scope.model.region = item;
                                        $scope.model.regionName = item.name;
                                    }

                                });
                            },
                            dataBound: function (e) {
                                if (isInit) {
                                    isInit = false;
                                    var firstItem = dataSource.at(0);
                                    if (firstItem) {
                                        !$scope.defaultRegion && ($scope.defaultRegion = firstItem);
                                        var barElement = this.findByUid(firstItem.uid);
                                        this.select(barElement);
                                        this.trigger('select');
                                    }
                                }
                            },
                            dataTextField: 'name',
                            dataSource: dataSource
                        };

                        $scope.popConfig = {
                            anchor: $element.find('input[data-id="pop"]'),
                            height: 400
                        };
                        //
                        // dataSource.read ();
                        // // if ( dataSource.view ().length <= 0 ) {
                        // //     dataSource.read ();
                        // // }

                        $scope.openTree = function () {
                            $scope.node.kendoPopup.open();
                        };
                    }
                };
            }])






            /**
             * 培训类别指令
             */
            .directive('queryLearnCategory', ['hbUtil', function (hbUtil) {
                return {
                    scope: {model: '='},
                    replace: true,
                    template: '    <select  kendo-combo-box="node.learnCategory"' +
                    ' hb-clear-input ' +
                    ' k-auto-bind="false"' +
                    ' k-ng-model="model.learnCategory"' +
                    ' k-options="learnCategoryComboOptions"' +
                    ' style="width: 150px;">' +
                    ' </select>',
                    link: function ($scope, $element) {
                        $scope.learnCategoryComboOptions = new hbUtil.kendo.config.combobox({
                            placeholder: '请选择培训类别',
                            dataSource: hbUtil.kendo.dataSource.gridDataSource(
                                '/web/admin/commodityManager/getSkuPropertyValues?skuPropertyId=5a3bc134658b41a2c18020351e69bac2'

                                // "/web/admin/commodityManager/getTrainingLevelList"
                            )
                        });

                        $scope.$watch('model.titleLevel', function (nv) {
                            if (nv && '新会计人员' === nv.name) {
                                $scope.node.learnCategory.enable(false);
                                $scope.model.learnCategory = undefined;
                            } else {
                                $scope.node && $scope.node.learnCategory && $scope.node.learnCategory.enable();
                            }
                        });
                    }
                };
            }])

            .directive('classQueryInfo', [function () {
                return {
                    templateUrl: '@systemUrl@/templates/summary/classQueryInfo.html',
                    // scope      : {
                    //     model: '='
                    // },
                    replace: true
                };
            }])

            .directive('regionQueryInfo', [function () {
                return {
                    templateUrl: '@systemUrl@/templates/summary/regionQueryInfo.html',
                    // scope      : {
                    //     model: '='
                    // },
                    replace: true
                };
            }])

            .directive('validateMessage', [function () {
                return {
                    replace: true,
                    scope: {
                        ashe: '='
                    },
                    templateUrl: '@systemUrl@/templates/common/validate-message.html'
                };
            }])


            .directive('hbLoginForm', LoginDirective);
        LoginDirective.$inject = ['hbLoginService', 'cookieOp', '$interval', '$log'];

        function LoginDirective (hbLoginService, cookieOp, $interval, $log) {
            var linkFunc = {};
            linkFunc.scope = {};
            linkFunc.link = function ($scope, $element, $attr, $controller) {

                $log.info('开启每3分钟获取登录票...' + new Date().toLocaleString());
                $scope.handler = $controller.handler;
                // 3分钟去获取一次登录票
                $interval.cancel(hbLoginService.getScriptInterval);
                hbLoginService.getLoginScript($scope);
                hbLoginService.getScriptInterval = $interval(function () {
                    $log.info('获取登录票...' + new Date().toLocaleString());
                    hbLoginService.getLoginScript($scope);
                }, 60000 * 3);

                $scope.$on('$destroy', function () {
                    $interval.cancel(hbLoginService.getScriptInterval);
                });
            };

            linkFunc.controller = ['hbLoginService', 'HBInterceptor', '$scope', '$window', '$element',
                function (hbLoginService, HBInterceptor, $scope, $window, $element) {
                    $scope.model = {};
                    var userInfo = cookieOp.getUserCookie(HBInterceptor.storeVar);
                    userInfo = ( userInfo && angular.fromJson(userInfo) ) || {userName: '', password: ''};
                    $scope.model.userName = userInfo.userName;
                    $scope.model.password = userInfo.password;
                    if (
                        $scope.model.userName !== ''
                        && $scope.model.password !== ''
                        && angular.isDefined($scope.model.userName)
                        && angular.isDefined($scope.model.password)
                    ) {
                        $scope.model.rememberPass = true;
                    } else {
                        $scope.model.rememberPass = false;
                    }
                    this.handler = {
                        closeLoginForm: function ($e) {
                            hbLoginService.closeLoginForm();
                            $e.preventDefault();
                        },

                        login: function ($e) {
                            if ($scope.theLoginForm.$invalid) return false;
                            var loginHandle = ssoLogin || {};
                            if (loginHandle) {
                                var loginParams = {
                                    accountType: HBInterceptor.getApp(),
                                    username: $scope.model.userName,
                                    password: $scope.model.password
                                };
                                loginHandle.login(loginParams, '{\'portalType\':\'mall\'}');
                            }
                        },
                        forgotPass: function ($e) {
                            $window.location.href = '/login/forgetPassword.html';
                            if ($e) {
                                $e.preventDefault();
                            }
                        },
                        enterKeyDo: function ($e) {
                            if ($e.keyCode === 13) {
                                this.login($e);
                            }
                        }
                    };
                }];
            linkFunc.templateUrl = function ($element, $attr) {
                return $attr.templateUrl || '@systemUrl@/templates/common/login.html';
            };
            linkFunc.restrict = 'AE';
            return linkFunc;
        }


        hbCommon.factory('hbCommonService', [function () {
            return {


                //类目ID不同的情况下比如两个都叫科目但是他们的ID是不同的
                subjectProperty: 'trainingSubject',
                yearProperty: 'trainingYear',
                categoryType: 'COURSE_SUPERMARKET_GOODS'

            };
        }]);

        hbCommon.run(['$rootScope', 'hbCommonService', function ($rootScope, hbCommonService) {
            function findCurrentCode (arr, property, id) {
                var currentCode = null;
                angular.forEach(arr, function (item, itemIndex) {
                    if (item[property] === id) {
                        currentCode = item;
                    }
                });
                return currentCode;
            }


            function doProjectSpecial (item, eleModel, $scope, attr) {
                //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑
                //console.log($scope.model[item.listName]);
                //console.log(item[attr.lwhmodel]);

                //console.log((item[attr.lwhmodel]===''&&item.eName===hbCommonService.yearProperty));
                //选中的subItem
                console.log(eleModel.skuPropertyList);


                //var yearSkuIndex=findIndex($scope.skuList,'eName',hbCommonService.yearProperty);
                //console.log(yearSkuIndex);
                var subItem = findCurrentCode($scope.model[item.listName], 'optionId', item[attr.lwhmodel]);
                console.log(subItem);
                console.log($scope.categoryType);
                if ($scope.categoryType === hbCommonService.categoryType && item.eName === hbCommonService.subjectProperty) {
                    //选中自主选课并且选中专业课
                    //SKULIST年度SKU所在的数组位置(最外层数组)
                    var yearSkuIndex = findIndex($scope.skuList, 'eName', hbCommonService.yearProperty);


                    //科目所在的数组位置
                    var subjectIndex = findIndex(eleModel.skuPropertyList, 'propertyIdCode', hbCommonService.subjectProperty);
                    //console.log(subjectIndex);
                    //年度所在的数组位置
                    var yearIndex = findIndex(eleModel.skuPropertyList, 'propertyIdCode', hbCommonService.yearProperty);


                    //console.log(item.eName===hbCommonService.yearProperty);
                    //console.log(item[attr.lwhmodel]);
                    //如果选中的科目是公需课 或者 请选择科目    否则隐藏年度
                    if ((subItem && subItem.code === 'public') || (item[attr.lwhmodel] === '')) {
                        $scope.skuList[yearSkuIndex].lwhIf = true;

                        if (attr.hidePlaceHolder && eleModel.skuPropertyList[yearIndex].value === '' && eleModel.skuPropertyList[subjectIndex].value !== '' &&
                            (eleModel.skuPropertyList[subjectIndex].value !== hbCommonService.gxkId || eleModel.skuPropertyList[subjectIndex].value !== hbCommonService.gxkId2)) {
                            eleModel.skuPropertyList[yearIndex].value = $scope.model[$scope.skuList[yearSkuIndex].listName][0] ?
                                $scope.model[$scope.skuList[yearSkuIndex].listName][0].optionId : '';
                            $scope.skuList[yearSkuIndex][attr.lwhmodel] = $scope.model[$scope.skuList[yearSkuIndex].listName][0] ?
                                $scope.model[$scope.skuList[yearSkuIndex].listName][0].optionId : '';
                        }

                        if (attr.hidePlaceHolder && eleModel.skuPropertyList[yearIndex].value === '' && eleModel.skuPropertyList[subjectIndex].value !== '' &&
                            (eleModel.skuPropertyList[subjectIndex].valueCode !== 'public')) {
                            eleModel.skuPropertyList[yearIndex].value = $scope.model[$scope.skuList[yearSkuIndex].listName][0] ?
                                $scope.model[$scope.skuList[yearSkuIndex].listName][0].optionId : '';
                            $scope.skuList[yearSkuIndex][attr.lwhmodel] = $scope.model[$scope.skuList[yearSkuIndex].listName][0] ?
                                $scope.model[$scope.skuList[yearSkuIndex].listName][0].optionId : '';
                        }
                        //alert(1);
                    } else {
                        //alert(2);
                        $scope.skuList[yearSkuIndex].lwhIf = false;

                        $scope.skuList[yearSkuIndex][attr.lwhmodel] = '';
                        eleModel.skuPropertyList[yearIndex].value = '';
                        eleModel.skuPropertyList[yearIndex].valueCode = '';
                    }


                }
                //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑 //每个项目不同的SKU联动逻辑
            }


            function findIndex (arr, property, id) {
                var index = null;
                angular.forEach(arr, function (item, itemIndex) {
                    if (item[property] === id) {
                        index = itemIndex;
                    }
                });
                return index;
            }


            $rootScope.skuSpecialFn = function (item, eleModel, $scope, attr) {
                doProjectSpecial(item, eleModel, $scope, attr);
            };
        }]);


    });

