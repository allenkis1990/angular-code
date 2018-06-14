/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/adminAccountAction');
        });
        //var employeeOne = base.one('employee'),
        //    employeeAll = base.all('employee');

        return {
            getAdminAccountList: function (params) {
                return base.one('findByQuery').get(params);
            },
            query: function (userId) {
                return base.one('query').get({userId: userId});
            },
            update: function (adminAccount) {
                return base.all('update').post(adminAccount);
            },
            /*save: function(adminAccount, typeid) {
             //return Restangular.all("create").post(adminAccount);
             return Restangular.one("/web/admin/adminAccountAction/create").customPOST({adminAccount: adminAccount, typeid: typeid}, undefined, undefined, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
             }*/
            save: function (adminAccount) {
                return base.all('create').post(adminAccount);
            },
            enable: function (userId) {
                return base.one('enable').get({userId: userId});
            },
            enables: function (userIdList) {
                return base.all('enables').post(userIdList);
            },
            suspend: function (userId) {
                return base.one('suspend').get({userId: userId});
            },
            suspends: function (userIdList) {
                return base.all('suspends').post(userIdList);
            },
            fire: function (userId) {
                return base.one('fire').get({userId: userId});
            },
            fires: function (userIdList) {
                return base.all('fires').post(userIdList);
            },
            reset: function (userId) {
                return base.one('reset').get({userId: userId});
            },
            resets: function (userIdList) {
                return base.all('resets').post(userIdList);
            },
            deleteAdminAccount: function (userId) {
                return base.one('delete').get({userId: userId});
            }
        };
        //var adminAccountList = Restangular.oneUrl('betaSearch', "/web/admin/adminAccountAction/findAdminAccountList.action");
        //console.log(adminAccountList);
        /*return {
         getAdminAccountList : function () {
         return adminAccountList.get();
         },
         saveAdminAccount: function (adminAccount) {
         $.post("/web/admin/adminAccountAction/newAdminAccount.action",adminAccount, function(data){
         console.log("-->"+data.info);
         });
         //return rest.one("organization/createUnit.action?unitObj="+JSON.stringify(unitObj)+"&adminObj="+JSON.stringify(adminObj)).post();
         }
         }*/
    }];
});
