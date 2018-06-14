/**
 * Created by linj on 2016/9/13.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/courseWareCategoryAction');
        });

        return {

            ajaxValidate: function (courseCategoryAdd) {
                return base.one('isExist').get(courseCategoryAdd);
            },
            findByQuery: function (nodeId) {
                return base.one('findByQuery').get({categoryId: nodeId});
            },
            update: function (courseCategoryAdd) {
                return base.all('update/' + courseCategoryAdd.id).post(courseCategoryAdd);
            },
            save: function (courseCategoryAdd) {
                return base.all('create').post(courseCategoryAdd);
            },
            deleteLessonType: function (nodeId) {
                return base.one('delete').get({categoryId: nodeId});
            }
        };
    }];
});
