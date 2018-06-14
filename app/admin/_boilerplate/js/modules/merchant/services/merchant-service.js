/**
 * Created by wangzy on 2015/8/1.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/merchant');
        });
        return {
            /**
             * 保存新增商户
             * @param param
             * @returns {*}
             */
            save: function (param) {
                return base.all('create').post(param);
            },
            /**
             * 停用商户
             * @param param
             * @returns {*}
             */
            dealPause: function (projectId, description) {
                return base.one('dealPauseProjectServe').get(projectId, description);
            },
            /**
             * 启用商户
             * @param param
             * @returns {*}
             */
            dealStart: function (projectId, description) {
                return base.one('dealStartProjectServe').get(projectId, description);
            },
            /**
             * 注销商户
             * @param param
             * @returns {*}
             */
            dealDelete: function (projectId, description) {
                return base.one('deleteProject').get(projectId, description);
            },
            /**
             * 修改时根据projectId获取商户信息
             * @param param
             * @returns {*}
             */
            findForEditByProjectId: function (param) {
                return base.one('findForEditByProjectId').get(param);
            },
            /**
             * 查看详情时根据projectId获取商户信息
             * @param param
             * @returns {*}
             */
            findForDetailByProjectId: function (param) {
                return base.one('findForDetailByProjectId').get(param);
            },
            /**
             * 修改商户信息
             * @param param
             * @returns {*}
             */
            update: function (param) {
                return base.all('update').post(param);
            },
            /**
             * 通过projectId查询商户信息
             * @param param
             * @returns {*}
             */
            findForExpandAccount: function (param) {
                return base.one('findForExpandAccount').get(param);
            },
            /**
             * 保存扩展账号并发数
             * @param param
             * @returns {*}
             */
            saveExpandAccount: function (param) {
                return base.all('saveExpandAccount').post(param);
            },
            /**
             * 提交重置超级管理员密码
             * @param param
             * @returns {*}
             */
            saveResetPassword: function (param) {
                return base.one('saveResetPassword').get(param);
            },
            /**
             * 查询商户的商品
             * @param param
             * @returns {*}
             */
            findMerchantGoods: function (param) {
                return base.one('findMerchantGoods').get(param);
            },
            /**
             * 提交调整商品服务期限
             * @param param
             * @returns {*}
             */
            saveModifyServeTime: function (param) {
                return base.all('saveModifyServeTime').post(param);
            },

            /**
             * 提交推送解决方案
             * @param param
             * @returns {*}
             */
            savePushSolution: function (param) {
                return base.all('savePushSolution').post(param);
            },

            /**
             * 查询商户的操作日志
             * @param param
             * @returns {*}
             */
            findMerchantActionRecord: function (param) {
                return base.one('findActionRecordList').get(param);
            },

            /**
             * 回收解决方案
             * @param param
             * @returns {*}
             */
            recycleSolution: function (param) {
                return base.one('recycleSolution').get(param);
            },
            /**
             * 回收账号并发数
             * @param param
             * @returns {*}
             */
            recycleAccount: function (param) {
                return base.one('recycleAccount').get(param);
            },
            /**
             * 验证商户是否有在用的解决方案，有返回true，没有返回false
             * @param param
             * @returns {*}
             */
            validateMerchantHasSolutionInUse: function (param) {
                return base.one('validateMerchantHasSolutionInUse').get(param);
            },
            /**
             * 根据商户id查询商户信息
             * @param param
             * @returns {*}
             */
            findMerchantByMerchantId: function (param) {
                return base.one('findMerchantByMerchantId').get(param);
            }
        };
    }];
});
