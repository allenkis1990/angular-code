define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/paperClassify/');
        });
        return {
            findExamPaperTypeByParentId: function (parentId,unitId,authorizedBelongsType) {
                return a.one('findExamPaperTypeByParentId').get({parentId: parentId,unitId:unitId,authorizedBelongsType:authorizedBelongsType});
            },
            save: function (model) {
                return a.all('create').post(model);
            },
            paperTypeService: function (paperTypeId,authorizedBelongsType) {
                return a.one('findPaperTypeById').get({paperTypeId: paperTypeId,authorizedBelongsType:authorizedBelongsType});
            },
            update: function (model) {
                return a.all('update').post(model);
            },
            remove: function (paperTypeId) {
                return a.one('delete').get({paperTypeId: paperTypeId});
            }
        };
    }];
});
