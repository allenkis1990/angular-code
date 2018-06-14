/**
 * Created by linj on 2018/6/9 8:58.
 */
define(function(){
    return ['Restangular','hbUtil',function (Restangular,hbUtil) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/resourceBag/');
        });
        return {
            findResourceBagPage : function(param){
                return base.one('findResourceBagPage').get(param);
            },
            findResourceBagDetailById:function(id){
                return base.one('findResourceBagDetailById').get({id:id});
            },
            getCountFromResourceGroupCount:function (resourceGroupCount,key){
                if(hbUtil.validateIsNull(resourceGroupCount)){
                    return 0;
                }
                if(hbUtil.validateIsNull(resourceGroupCount[key])){
                    return 0;
                }
                return resourceGroupCount[key];
            },
            updateResourceBag: function (id,data) {
                return base.all('updateResourceBag/'+id).post(data);
            },
            removeResourcesFromResourceBag:function (id,resourceKey,data){
                return base.all('removeResourcesFromResourceBag/'+id+'/'+resourceKey).post(data);
            },
            addResourcesToResourceBag:function (id,resourceKey,data){
                return base.all('addResourcesToResourceBag/'+id+'/'+resourceKey).post(data);
            },
            schemeAuthorize: function (schemeAuthorizeParam) {
                return base.all('schemeAuthorize').post(schemeAuthorizeParam);
            },
            deleteResourceBag: function (id) {
                return base.all('deleteResourceBag/'+id).post();
            },
            validateResBagUpdatable: function (id) {
                return base.one('validateResBagUpdatable/'+id).get();
            },
            checkUnitAuthorizeScheme : function (param) {
                return base.all('checkUnitAuthorizeScheme').post(param)
            }
        };

    }];
});