/**
 * 浣���: 缈�楣�椋�
 *            --- > 浜＄�佃蛋绉�
 * �ユ��: 2015/6/18
 * �堕��: 16:28
 *
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var rest = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/organization/');
        });
        return {
            //保存新增单位
            saveUnitAdd: function (postParam) {
                //return rest.all("createUnit.action").post(unitInfoDto,adminInfoDto);
                return rest.all('createUnit.action').post(postParam);
            },
            //保存修改单位
            saveUnitEdit: function (postParam) {
                //return rest.all("createUnit.action").post(unitInfoDto,adminInfoDto);
                return rest.all('updateUnit.action').post(postParam);
            },
            //删除单位
            doUnitDel: function (unitId) {
                return rest.one('dealDeleteUnit.action').get({unitId: unitId});
            },
            //保存新增部门
            saveOrgAdd: function (postParam) {
                return rest.all('createOrganization.action').post(postParam);
            },
            //保存修改部门
            saveOrgEdit: function (postParam) {
                return rest.all('updateOrganization.action').post(postParam);
            },

            //删除部门
            doOrgDel: function (unitId, orgId) {
                return rest.one('dealDeleteOrganization.action').get({unitId: unitId, orgId: orgId});
            },
            //提交上移下移，完成顺序交换
            exchangeSort: function (id1, id2, type) {
                return rest.one('exchangeSort.action').get({id1: id1, id2: id2, type: type});
            },
            //获取当前登录用户信息
            findCurrentUser: function () {
                return rest.one('findCurrentUser').get();
            }
        };
    }];
});
