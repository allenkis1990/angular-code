/**
 * Created by 亡灵走秀 on 2017/3/1.
 */

(function ($, undefined) {
    var g = {
        node: {
            $navBarItem: $('#nav_bar_item')
        }
    };

    var events = {
        binding: function () {
            var eventMap = {
                mouseenter: function (event, show) {
                    event.addClass('z-sel');
                    show && event.find('div[data-man="extend-list"]')
                        .show()

                        .stop()
                        .animate({
                            opacity: 1,
                            left: 240
                        }, 'easein');
                },
                mouseleave: function (event, show) {
                    event.removeClass('z-sel');
                    show && event.find('div[data-man="extend-list"]')
                        .stop().animate(
                            {left: 220, opacity: 0},
                            'easein',
                            function () {
                                $(this).hide();
                            });
                }
            };
            g.node.$navBarItem.bind('mouseenter mouseleave', function (event) {
                var show = $(this).find('p[data-man]').children().length === 12;
                eventMap[event.type].call(this, $(this), show);
            });
        }
    };

    var process = {
        init: function () {
            events.binding();
        }
    };

    process.init();

})(jQuery);
