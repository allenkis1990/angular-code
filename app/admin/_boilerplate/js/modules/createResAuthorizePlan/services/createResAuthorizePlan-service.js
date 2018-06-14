/**
 * Created by linj on 2018/6/8 16:19.
 */
define(function(){
    return ['Restangular', function (Restangular){
        var base = Restangular.withConfig(function (config){
            config.setBaseUrl('/web/admin/resourceBag');
        });

        return {
            validateNameUnique: function(name){
              return base.one('validateNameUnique').get({name:name});
            },
            createResourceBag: function(data){
                return base.all('createResourceBag').post(data);
            },
            findResourceBagDetailById:function(id){
                return base.one('findResourceBagDetailById').get({id:id});
            },
        }
    }]
});