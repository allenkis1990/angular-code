/**
 * Created by Administrator on 2015/8/5.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/resAuthorizeUnit');
        });

        return {
            accountList: function (query) {
                return base.one('getPaymentAccountInfoList?').get({
                    "unitId"              : query.unitId,
                    "objectId"            : query.objectId,
                    "rangeType"           : query.rangeType,
                    "searchRange"         : query.searchRange,
                    "belongsType"         : query.authorizeQuery.belongsType,
                    "authorizeToUnitId"   : query.authorizeQuery.authorizeToUnitId,
                    "authorizedFromUnitId": query.authorizeQuery.authorizedFromUnitId
                });
            },
            //获取资源统计
            countResource: function (unitId,authorizationState) {
                return base.one('listCountResource?').get({
                    unitId:unitId,
                    authorizationState:authorizationState
                });
            },
            //获取指定单位已获取授权的资源方案
            listResourceBag: function (useUnitId) {
                return base.one('listResourceBag?').get({
                    useUnitId:useUnitId
                });
            },

            authorizeResForSingleType:function (resourceDto) {
                return base.all('authorizeResForSingleType').post(resourceDto);
            },

            recycleAuthorizeResForSingleType:function (resourceDto) {
                return base.all('recycleAuthorizeResForSingleType').post(resourceDto);
            },
            recycleAuthorizeResForSingleOne:function (resourceDto) {
                return base.all('recycleAuthorizeResForSingleOne').post(resourceDto);
            },
            recoverAuthorizeResForSingleOne:function (resourceDto) {
                return base.all('recoverAuthorizeResForSingleOne').post(resourceDto);
            },


            //获取单位资源日志信息
            pageResAuthorizeLogs : function (param) {
                    return base.one('pageResAuthorizeLogs').get(param);
            }


        };

    }];
});
