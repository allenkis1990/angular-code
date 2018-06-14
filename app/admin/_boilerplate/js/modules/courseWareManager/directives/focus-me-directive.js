define(function () {
    return [function () {
        return {
            link: function (scope, element, attributes) {
                element[0].focus();
            }
        };
    }];
});
