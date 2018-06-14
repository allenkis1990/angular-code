define(function (mod) {
    return [function () {
        return {
            rememberPassword: function (userName, password, date) {
                var Days = 30,
                    exp = new Date()
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
                var expires = exp.toGMTString()
                if (typeof date !== 'undefined') {
                    var oldDate = new Date()
                    oldDate.setDate(oldDate.getDate() + date)
                    expires = oldDate.toGMTString()
                }

                document.cookie = 'adminUserInfo=' + angular.toJson({
                    userName: userName,
                    password: password
                }) + ';expires=' + expires + ';path=/'
            },
            removeFromCookie: function () {
                this.rememberPassword(1, 1, -1)
            },
            getUserCookie: function (key) {
                var arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2])
            },
            setRemember: function (userName, password) {
                if (userName && password) {
                    return true
                }
            }
        }
    }]
})