/*** Created by admin on 2015/5/11.*/
define(function () {
    'use strict';
    return ['$scope', '$rootScope', 'Restangular', 'UIWindow', function ($scope, $rootScope, Restangular, UIWindow) {
        $scope.globle = $rootScope.globle;
        $scope.model = {
            page: {
                pageSize: 1
            },
            waiForUpdateModel: null
        };

        /**
         * - [`addClass()`](http://api.jquery.com/addClass/)
         * - [`after()`](http://api.jquery.com/after/)
         * - [`append()`](http://api.jquery.com/append/)
         * - [`attr()`](http://api.jquery.com/attr/)
         * - [`bind()`](http://api.jquery.com/bind/) - Does not support namespaces, selectors or eventData
         * - [`children()`](http://api.jquery.com/children/) - Does not support selectors
         * - [`clone()`](http://api.jquery.com/clone/)
         * - [`contents()`](http://api.jquery.com/contents/)
         * - [`css()`](http://api.jquery.com/css/) - Only retrieves inline-styles, does not call `getComputedStyles()`
         * - [`data()`](http://api.jquery.com/data/)
         * - [`empty()`](http://api.jquery.com/empty/)
         * - [`eq()`](http://api.jquery.com/eq/)
         * - [`find()`](http://api.jquery.com/find/) - Limited to lookups by tag name
         * - [`hasClass()`](http://api.jquery.com/hasClass/)
         * - [`html()`](http://api.jquery.com/html/)
         * - [`next()`](http://api.jquery.com/next/) - Does not support selectors
         * - [`on()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
         * - [`off()`](http://api.jquery.com/off/) - Does not support namespaces or selectors
         * - [`one()`](http://api.jquery.com/one/) - Does not support namespaces or selectors
         * - [`parent()`](http://api.jquery.com/parent/) - Does not support selectors
         * - [`prepend()`](http://api.jquery.com/prepend/)
         * - [`prop()`](http://api.jquery.com/prop/)
         * - [`ready()`](http://api.jquery.com/ready/)
         * - [`remove()`](http://api.jquery.com/remove/)
         * - [`removeAttr()`](http://api.jquery.com/removeAttr/)
         * - [`removeClass()`](http://api.jquery.com/removeClass/)
         * - [`removeData()`](http://api.jquery.com/removeData/)
         * - [`replaceWith()`](http://api.jquery.com/replaceWith/)
         * - [`text()`](http://api.jquery.com/text/)
         * - [`toggleClass()`](http://api.jquery.com/toggleClass/)
         * - [`triggerHandler()`](http://api.jquery.com/triggerHandler/) - Passes a dummy event object to handlers.
         * - [`unbind()`](http://api.jquery.com/unbind/) - Does not support namespaces
         * - [`val()`](http://api.jquery.com/val/)
         * - [`wrap()`](http://api.jquery.com/wrap/)
         * */

        //可以根据需求重新配置一下

        Restangular.withConfig(function (config) {
            config.setBaseUrl('datas/');
        });
        //author.get(); // GET /authors/abc123
        //author.getList('books'); // GET /authors/abc123/books
        //author.put(); // PUT /authors/abc123
        //author.post(); // POST /authors/abc123
        //author.remove(); // DELETE /authors/abc123
        //author.head(); // HEAD /authors/abc123
        //author.trace(); // TRACE /authors/abc123
        //author.options(); // OPTIONS /authors/abc123
        //author.patch(); // PATCH /author/abc123

        /**
         * app.js config当中配置全局的restAngular的一个baseUrl为
         */
            // 在使用Restangular的时候，有两种可以创建一个区获取服务的方式
            //1. 我们可以象下面这样去设置基本的路由去获取对象
        var employees = Restangular.all('employee.json');
        var test = Restangular.all('menus.json');
        var one = Restangular.one('one');
        test.getList();

        $scope.Restangular = Restangular;

        $scope.events = {
            request: function (request) {
                console.log(request.getRestangularUrl());
            },
            getAll: function () {
                var that = this;
                // http://localhost:9000/datas/employee.json
                // request method = get
                employees.getList()
                    .then(function (employees) {
                        $scope.model.employees = employees;
                        that.request(employees);
                    });
            },
            edit: function (emp) {
                // 官方推荐在修改之前要先执行复制

                /**
                 * Note, that before modifying an object,
                 * it’s good practice to copy it and then modify the copied object before we save it.
                 * Restangular has it’s own version of copy such that it won’t rebind this
                 *        in the bundled functions.
                 * It’s good practice to use Restangular.copy() when updating an object.
                 */
                $scope.model.waiForUpdateModel =
                    Restangular.copy(emp);
                $scope.model.showEdit = true;
            },
            update: function (id) {
                $scope.model.showEdit = false;
                // http://localhost:9000/datas/employee.json/user_1
                // request Method = put
                $scope.model.waiForUpdateModel.put();
                this.request(employees);
            },
            create: function () {
                //http://localhost:9000/datas/employee.json
                // request method = post
                // request payload = {name: '傻逼', age: 15}；
                var newOne = {name: '傻逼', age: 15};
                employees.post(newOne);
                this.request(employees);
            },
            remove: function (emp) {
                // http://localhost:9000/datas/employee.json/user_1
                // request Method = delete;
                emp.remove();
                this.request(employees);
            }

        };

        // 上面将设置所有来自Restangular的以/peoples为基准的的http请求
        // 例如:
        // 将请求 www.xxx.com/datas/peoples

        $scope.events.getAll();

        $scope.events.query = function (queryEvent) {
            console.log(queryEvent);
        };

        $scope.model.page = {
            pageNo: 1,
            pageSize: 20,
            total: 155
        };

        // 2.也可以从内置的请求获取一个对象
        // 请求将访问http://localhost:9000/datas/menus.json/abc123
        // Request Method:GET

        var employees = Restangular.all('employee.json');
        employees.customPOST(
            {body: 'wengpengfei'}, undefined, undefined, {'Content-Type': 'application/x-www-form-urlencoded'});

        UIWindow.alert({contentUrl: '@systemUrl@/templates/common/window-alert-tpl.html'});

        //$scope.events.alert = function() {
        //	appendWindowDom();
        //};


    }];
});


