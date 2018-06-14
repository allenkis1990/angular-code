define(function () {
    return ['Restangular', function (Restangular) {
        var baseUrl = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/classSchedule');
        });
        return {
            getUrlPrefix: function () {
                return baseUrl.one("getUrlPrefix").get();
            },
            addPlanTemplate: function (params) {
                return baseUrl.all("addPlanTemplate").post(params);
            },
            deletePlanTemplate: function (params) {
                return baseUrl.one("deletePlanTemplate").get(params);
            },
            updatePlanTemplate: function (params) {
                return baseUrl.all("updatePlanTemplate").post(params);
            },
            getPlanTemplate: function (params) {
                return baseUrl.one("getPlanTemplate").get(params);
            },
            getPlanTemplatePage: function (params) {
                return baseUrl.one("getPlanTemplatePage").get(params);
            },
            getReferenceCount: function (params) {
                return baseUrl.one("getReferenceCount").get(params);
            },
            addPlanItemTemplate: function (params) {
                return baseUrl.all("addPlanItemTemplate").post(params);
            },
            deletePlanItemTemplate: function (params) {
                return baseUrl.one("deletePlanItemTemplate").get(params);
            },
            updatePlanItemTemplate: function (params) {
                return baseUrl.all("updatePlanItemTemplate").post(params);
            },
            getPlanItemTemplate: function (params) {
                return baseUrl.one("getPlanItemTemplate").get(params);
            },
            getPlanItemTemplateList: function (params) {
                return baseUrl.one("getPlanItemTemplateList").get(params);
            },
            addPlanResourceToPlanItemTemplate: function (itemTemplateId, params) {
                return baseUrl.all("addPlanResourceToPlanItemTemplate/" + itemTemplateId).post(params);
            },
            deletePlanResourceToPlanItemTemplate: function (params) {
                return baseUrl.one("deletePlanResourceToPlanItemTemplate").get(params);
            },
            getPlanItemResourceList: function (params) {
                return baseUrl.one("getPlanItemResourceList").get(params);
            },
            getItemTemplateCountByTemplateIds: function (params) {
                return baseUrl.one("getItemTemplateCountByTemplateIds").get(params);
            },
            canSavePlanTemplateName: function (params) {
                return baseUrl.one("canSavePlanTemplateName").get(params);
            },
            updateResourceTemplate: function (params) {
                return baseUrl.one("updateResourceTemplate").get(params);
            },
        }
    }]
});
