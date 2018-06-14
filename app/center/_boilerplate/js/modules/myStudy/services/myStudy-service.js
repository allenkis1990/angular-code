/**
 * Created by Allen on 2018/1/23.
 */
define(function () {

    return [function () {


        function ParsePageParams () {
            this.paramsBaseName = 'queryParam';
        }

        //特殊处理--非数组
        ParsePageParams.prototype.parseObj = function (parentKey) {
            return this.paramsBaseName + '[' + parentKey + ']';
        };

        //特殊处理--数组
        ParsePageParams.prototype.parseArr = function (parentKey, index, arrItemKey) {
            return this.paramsBaseName + '[' + parentKey + ']' + '[' + index + ']' + '[' + arrItemKey + ']';
        };

        //特殊处理-对象
        ParsePageParams.prototype.parseObject = function (parentKey, subKey) {
            return this.paramsBaseName + '[' + parentKey + ']' + '[' + subKey + ']';
        };


        //查询学员端课程列表传参做特殊处理
        //1.如果值是undefined的时候整个属性不传
        //2.如果值是数组处理成{'queryParam[key][index][arrItemKey]':xxx}
        //3.如果值不是数组处理成{'queryParam[key]':xxx}
        //TODO 如果是对象并没有做处理
        ParsePageParams.prototype.parseDo = function (angular, params, temp) {
            for (var key in params) {

                if (params[key] !== undefined) {

                    if (angular.isArray(params[key])) {


                        for (var j = 0; j < params[key].length; j++) {

                            for (var k in params[key][j]) {
                                var str = this.parseArr(key, j, k);
                                temp[str] = params[key][j][k];
                            }

                        }
                    }
                    else if (angular.isObject(params[key])) {
                        for (var subKey in params[key]) {
                            var str = this.parseObject(key, subKey);
                            temp[str] = params[key][subKey];
                        }
                    }
                    else {
                        var str = this.parseObj(key);
                        temp[str] = params[key];
                    }


                }

            }
        };


        return new ParsePageParams();
    }];
});
