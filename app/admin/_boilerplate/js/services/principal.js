/**
 * Created with IntelliJ IDEA.
 * User: wengpengfei
 * Date: 2015/5/29
 * Time: 14:13
 */

define(['angular'], function (angular) {
    'use strict';

    var authorizationSystem = angular.module('AuthorizationSystem', []);

    authorizationSystem.provider('authorize', function () {
        this.DEV_MODE_FOR_PERMIT = false;
        var _this = this;
        this.$get = ['$window', '$http', '$rootScope', function ($window, $http, $rootScope) {
            var isDefined = angular.isDefined;
            return {
                DEV_MODE_FOR_PERMIT: _this.DEV_MODE_FOR_PERMIT,
                /**
                 * 设置登录状态
                 * @param login 是否登录
                 */
                'setLogin': function (login) {
                    this.getSessionStorage()
                        .setItem('isLogged', login);
                },
                /**
                 * 判断permission是否在权限列表permissionList当中
                 * @param permissionList
                 * @param permission
                 * @returns {boolean}
                 */
                'existPermission': function (permissionList, permission) {
                    return !(typeof permissionList[permission] === 'undefined');
                },

                /**
                 * 从后端获取当前角色下面的所有权限
                 *      1.将返回的js对象转换成json字符串
                 * @returns {HttpPromise} 返回promise
                 */
                'setPermissions': function (url) {
                    var remoteUrl = url || 'datas/authorities.json',
                        promise = $http.get(remoteUrl),
                        that = this;
                    promise.success(function (data) {
                        that.getSessionStorage()
                            .setItem('authorizeList',
                                angular.toJson(data));
                        $rootScope.$broadcast('permissionsChanged');
                    });
                    return promise;
                },

                /**
                 * sessionStorage当中保存的数据以键值保存， 值是字符串，所以获取到的要转成json，
                 * 返回js对象
                 * @returns {*|Object|Array|string|number}
                 */
                'getPermissions': function () {
                    var authorizeListObj,
                        als = this.getAuthorizeListStr();
                    if (als) {
                        authorizeListObj = angular.fromJson(als);
                    }
                    return authorizeListObj;
                },

                'getAuthorizeListStr': function () {
                    var storage = this.getSessionStorage(),
                        authorizeListStr = storage.getItem('authorizeList');
                    return authorizeListStr;
                },

                'initOrNot': function () {
                    var als = this.getAuthorizeListStr();
                    return isDefined(als);
                },

                /**
                 * 获取sessionStorage
                 * @returns {Storage}
                 */
                'getSessionStorage': function () {
                    return $window.sessionStorage;
                },

                /**
                 * 判断是否登录
                 * @returns {*|boolean}
                 */
                'isLogon': function () {
                    var isLogged = this.getSessionStorage().getItem('isLogged');
                    return angular.isDefined(isLogged)
                        && isLogged !== '' && isLogged !== 'false';
                },

                /**
                 * 判断是否有这个权限显示某个动作
                 * @param permission
                 * @returns {*|boolean}
                 */
                'hasPermissionDo': function (permission) {
                    return this.existPermission(this.getPermissions(), permission);
                },

                /**
                 * 判断当前的路由状态是否需要进行用户验证登录
                 * @param state
                 * @returns {{status: boolean}}
                 */
                'needCheckState': function (state) {
                    if (!isDefined(state.access)) {
                        return false;
                    }
                    return state.access['requireLogin'];
                }
            };
        }];
    });

    /**
     * 定义指令hasPermission
     * @example <div has-permission="code"></div>
     *      code为后台返回的数据当中权限的唯一的权限编码
     */

    authorizationSystem.directive('hasPermission', ['authorize', '$log', function (authorize, $log) {
        return {
            restrict: 'A',
            compile: function ($tElement, $attr) {
                var permission = $attr['hasPermission'];

                /**
                 * 必须有设置内容
                 */
                if (!angular.isDefined(permission) || permission === '') {
                    $log.log('%c hasPermission必须提供mark', 'color:red; font-size: 18px;font-weight: bold;');
                    return false;
                }
                /**
                 * 必须为字符串
                 */
                if (!angular.isString(permission)) {
                    $log.log('%c hasPermission 的值必须为字符串', 'color:red; font-size: 18px;font-weight: bold;');
                    return false;
                }

                function togglePermission () {
                    var hasPermit = authorize.hasPermissionDo(permission);
                    if (!hasPermit) {
                        $tElement.css({
                            display: 'none'
                        });
                    }
                }

                if (!authorize.DEV_MODE_FOR_PERMIT) {
                    togglePermission();
                }
            }
        };
    }]);
});
