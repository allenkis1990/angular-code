define(function (mod) {
    return {
        initCas: ['adminLoginService', function (adminLoginService) {
            return {
                scope: {
                    getIsLogin: '&',
                    getErrorOne: '&',
                    getErrorTwo: '&',
                    type: '@',
                    useName: '=',
                    currentDomain: '=?',
                    password: '=',
                    rememberUse: '='
                },
                link: function (scope) {
                    var initCas = function () {
                        $.ajax({
                            url: '/web/login/login/getLoginParameters.action?_q=' + new Date().getTime(),
                            headers: {
                                'Hb-Domain-Path': require.unitPath
                            },
                            success: function (data) {
                                scope.$apply(function () {
                                    scope.currentDomain = data.info.currentDomain
                                })
                                window.processLogin = function (data) {
                                    if (data.code == 603) {
                                        if (scope.rememberUse) {
                                            adminLoginService.rememberPassword(scope.userName, scope.password)
                                        }
                                        window.location = data.location
                                    } else if (data.code == 611) {
                                        scope.getErrorOne()
                                    }
                                    else {
                                        scope.getErrorTwo()
                                    }
                                }
                                var script = document.createElement('script')
                                script.type = 'text/javascript'
                                script.src = data.info.casDomain + '/login?TARGET=' + data.info.currentDomain + '/web/sso/auth&js&callback=processLogin'
                                $('head').append(script)
                            }
                        })
                    }
                    initCas()
                }
            }
        }],
        ajaxValidate: ['$timeout', '$http', '$parse', '$q',
            function ($timeout, $http, $parse, $q) {
                return {
                    require: 'ngModel',
                    link: function (scope, element, attributes, ngModel) {

                        if (!ngModel) {
                            return
                        }
                        var url = attributes['ajaxUrl']
                        if (!url) {
                            throw new Error('url must offer!')
                        }

                        scope.$watch(attributes.ngModel, function (newValule, oldValue) {
                            var defer = $q.defer()
                            ngModel.$promise = defer.promise
                            if (!ngModel.$isEmpty(newValule)) {
                                $timeout.cancel(ngModel.timer)
                                ngModel.$error['ajaxValidate'] = undefined
                                ngModel.$pending = true
                                ngModel.timer = $timeout(function () {
                                    var postData = $parse(attributes['ajaxData'])(scope) || {}

                                    // 判断这个上面的ajax校验是否通过， 如果通过了 就再校验
                                    // 如果
                                    postData.field = newValule

                                    $http({
                                        method: 'GET', url: url, params: postData
                                    }).success(function (data) {
                                        // 如果返回的结果的data里面带的info为true说明存在， 则valid 为false, $error.ajaxValidate = true
                                        ngModel.$setValidity('ajaxValidate', data.info)
                                        defer.resolve(data.info)
                                    })
                                })
                            }
                        })

                    }
                }
            }]
    }
})