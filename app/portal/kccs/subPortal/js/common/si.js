define(function () {
    'use strict';
    return {
        'modules': [{
            'reconfig': true,
            'name': 'app.portal.states.accountant',
            'files': ['kccs/subPortal/js/states/accountant-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.concatUs',
            'files': ['kccs/subPortal/js/states/accountant.concatUs-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.creditVerification',
            'files': ['kccs/subPortal/js/states/accountant.creditVerification-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.download',
            'files': ['kccs/subPortal/js/states/accountant.download-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.forget',
            'files': ['kccs/subPortal/js/states/accountant.forget-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.helpCenter',
            'files': ['kccs/subPortal/js/states/accountant.helpCenter-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.helpCenterMobile',
            'files': ['kccs/subPortal/js/states/accountant.helpCenterMobile-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.information',
            'files': ['kccs/subPortal/js/states/accountant.information-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.laws',
            'files': ['kccs/subPortal/js/states/accountant.laws-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.leaveMessage',
            'files': ['kccs/subPortal/js/states/accountant.leaveMessage-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.lessonList',
            'files': ['kccs/subPortal/js/states/accountant.lessonList-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.manageTransit',
            'files': ['kccs/subPortal/js/states/accountant.manageTransit-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.notice',
            'files': ['kccs/subPortal/js/states/accountant.notice-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.noticeViews',
            'files': ['kccs/subPortal/js/states/accountant.noticeViews-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.onTraining',
            'files': ['kccs/subPortal/js/states/accountant.onTraining-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.process',
            'files': ['kccs/subPortal/js/states/accountant.process-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.registration',
            'files': ['kccs/subPortal/js/states/accountant.registration-state.js']
        }, {
            'reconfig': true,
            'name': 'app.portal.states.accountant.teleUs',
            'files': ['kccs/subPortal/js/states/accountant.teleUs-state.js']
        }],
        'futureStates': [{
            'module': 'app.portal.states.accountant',
            'stateName': 'states.accountant',
            'url': '/accountant',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.concatUs',
            'stateName': 'states.accountant.concatUs',
            'url': '/accountant.concatUs',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.creditVerification',
            'stateName': 'states.accountant.creditVerification',
            'url': '/accountant.creditVerification',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.download',
            'stateName': 'states.accountant.download',
            'url': '/accountant.download',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.forget',
            'stateName': 'states.accountant.forget',
            'url': '/accountant.forget',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.helpCenter',
            'stateName': 'states.accountant.helpCenter',
            'url': '/accountant.helpCenter',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.helpCenterMobile',
            'stateName': 'states.accountant.helpCenterMobile',
            'url': '/accountant.helpCenterMobile',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.information',
            'stateName': 'states.accountant.information',
            'url': '/accountant.information',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.laws',
            'stateName': 'states.accountant.laws',
            'url': '/accountant.laws',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.leaveMessage',
            'stateName': 'states.accountant.leaveMessage',
            'url': '/accountant.leaveMessage',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.lessonList',
            'stateName': 'states.accountant.lessonList',
            'url': '/accountant.lessonList',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.manageTransit',
            'stateName': 'states.accountant.manageTransit',
            'url': '/accountant.manageTransit',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.notice',
            'stateName': 'states.accountant.notice',
            'url': '/accountant.notice',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.noticeViews',
            'stateName': 'states.accountant.noticeViews',
            'url': '/accountant.noticeViews',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.onTraining',
            'stateName': 'states.accountant.onTraining',
            'url': '/accountant.onTraining',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.process',
            'stateName': 'states.accountant.process',
            'url': '/accountant.process',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.registration',
            'stateName': 'states.accountant.registration',
            'url': '/accountant.registration',
            'type': 'ocLazyLoad'
        }, {
            'module': 'app.portal.states.accountant.teleUs',
            'stateName': 'states.accountant.teleUs',
            'url': '/accountant.teleUs',
            'type': 'ocLazyLoad'
        }]
    };
});