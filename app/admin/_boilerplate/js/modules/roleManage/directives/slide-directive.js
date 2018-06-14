define(function () {
    return [function () {
        return {
            link: function (scope, element, attributes) {
                $(element).click(function () {

                    var $this = $(this);

                    if (attributes.slidestatus === 'down') {
                        $this.next('.expand-list').stop(true).slideUp();
                        $this.find('.ico').removeClass('open').addClass('close');
                        attributes.slidestatus = 'up';
                    } else {
                        $this.next('.expand-list').stop(true).slideDown();
                        $this.find('.ico').removeClass('close').addClass('open');
                        attributes.slidestatus = 'down';
                    }

                });
            }
        };
    }];
});
