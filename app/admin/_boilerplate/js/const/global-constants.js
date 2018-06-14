define(function () {
    'use strict';
    return {
        logUrlHost: 'http://192.168.1.99:8080/',
        showImageUrl: '/mfs',
        uploadUrl: 'http://resource.59iedu.com/Upload?requestContext={customId:1,platformId:1,unitId:1,projectId:1,platformVersionId:1,sourceId:1}&context={customId:1,platformId:1,unitId:1,projectId:1,platformVersionId:1,sourceId:1}',
        webUploaderSwfDir: '../bower_components/webuploader_fex/dist/Uploader.swf',
        regexps: {
            // 正则匹配html标签
            replaceHtmlTag: /<\/?[^>]*>/g,
            // 正整数
            positiveInteger: /^[1-9]\d*$/,
            // 手机号
            phoneNumber: /^1[3578][0-9]{9}$/,
            // 邮箱号
            email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            // 身份证号
            identifyCode: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
            // 日期格式，格式为 YYYY/MM/DD、YYYY/M/D、YYYY-MM-DD、YYYY-M-D
            dateFormat: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
            // 日期及时间格式，格式为：YYYY/MM/DD hh:mm:ss AM|PM
            datetimeFormat: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/
        }
    };
});
