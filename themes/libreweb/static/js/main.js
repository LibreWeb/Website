; (function () {
    'use strict';

    // Burger Menu
    var burgerMenu = function () {
        $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
            event.preventDefault();
            if ($('#navbar').is(':visible')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        });

    };

    var goToTop = function () {
        $('.js-gotop').on('click', function (event) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500);
            return false;
        });
    };

    // Page Nav
    var clickMenu = function () {
        $('#navbar a:not([class="nav-link external"])').click(function (event) {
            var section = $(this).data('nav-section'),
                navbar = $('#navbar');
            if ($('[data-section="' + section + '"]').length) {
                $('html, body').animate({
                    scrollTop: $('[data-section="' + section + '"]').offset().top
                }, 500);
            }
            if (navbar.is(':visible')) {
                navbar.removeClass('in');
                navbar.attr('aria-expanded', 'false');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
            event.preventDefault();
            return false;
        });
    };

    // Make button links work in home
    var buttonLinks = function () {
        $('#home a:not([class="nav-link external"])').click(function (event) {
            var section = $(this).data('nav-section');
            if ($('[data-section="' + section + '"]').length) {
                $('html, body').animate({
                    scrollTop: $('[data-section="' + section + '"]').offset().top
                }, 500);
                event.preventDefault();
                return false;
            }
            return true;
        });
    };

    // Reflect scrolling in navigation
    var navActive = function (section) {
        var $el = $('#navbar > ul');
        $el.find('li').removeClass('active');
        $el.each(function () {
            $(this).find('a[data-nav-section="' + section + '"]').closest('li').addClass('active');
        });
    };

    var navigationSection = function () {
        var $section = $('section[data-section]');
        $section.waypoint(function (direction) {
            if (direction === 'down') {
                navActive($(this.element).data('section'));
            }
        }, {
            offset: '150px'
        });

        $section.waypoint(function (direction) {
            if (direction === 'up') {
                navActive($(this.element).data('section'));
            }
        }, {
            offset: function () { return -$(this.element).height() + 155; }
        });
    };


    // Window Scroll
    var windowScroll = function () {
        var lastScrollTop = 0;
        $(window).scroll(function (event) {
            var header = $('#fh5co-header'),
                scrlTop = $(this).scrollTop();
            if (scrlTop > 500 && scrlTop <= 2000) {
                header.addClass('navbar-fixed-top fh5co-animated slideInDown');
            } else if (scrlTop <= 500) {
                if (header.hasClass('navbar-fixed-top')) {
                    header.addClass('navbar-fixed-top fh5co-animated slideOutUp');
                    setTimeout(function () {
                        header.removeClass('navbar-fixed-top fh5co-animated slideInDown slideOutUp');
                    }, 100);
                }
            }

        });
    };

    var insertMailTo = function () {
        const mailto = document.getElementById("mailto");
        const coded = "X4oJ@YXNMDfDN.JMc";
        const key = "qJdLieE0gyY9wrTZH6IGQXDsjcn8mfM5uk7vaA3Whx14bBozSFCVpRtlPO2UKN";
        const shift = coded.length;
        var link = "", ltr;
        for (var i = 0; i < coded.length; i++) {
            if (key.indexOf(coded.charAt(i)) == -1) {
                ltr = coded.charAt(i);
                link += (ltr);
            }
            else {
                ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length;
                link += (key.charAt(ltr));
            }
        }
        mailto.href = "mailto:" + link;
    };

    var contactMessages = function () {
        // Display messages.
        if (location.search.substring(1) !== '') {
            switch (location.search.substring(1)) {
                case 'submitted':
                    $('.contact-submitted').removeClass('d-none');
                    break;

                case 'error':
                    $('.contact-error').removeClass('d-none');
                    break;
            }
        }
    };

    var countersAnimate = function () {
        var counters = $('#fh5co-counters');
        if (counters.length > 0) {
            counters.waypoint(function (direction) {
                if (direction === 'down' && !$(this.element).hasClass('animated')) {
                    var sec = counters.find('.to-animate').length,
                        sec = parseInt((sec * 200) + 400);
                    setTimeout(function () {
                        counters.find('.to-animate').each(function (k) {
                            var el = $(this);
                            setTimeout(function () {
                                el.addClass('fadeInUp animated');
                            }, k * 200, 'easeInOutExpo');

                        });
                    }, 200);

                    setTimeout(function () {
                        counters.find('.js-counter').countTo({
                            formatter: function (value, options) {
                                return value.toFixed(options.decimals);
                            },
                        });
                    }, 400);

                    setTimeout(function () {
                        counters.find('.to-animate-2').each(function (k) {
                            var el = $(this);
                            setTimeout(function () {
                                el.addClass('bounceIn animated');
                            }, k * 200, 'easeInOutExpo');
                        });
                    }, sec);
                    $(this.element).addClass('animated');
                }
            }, { offset: '80%' });

        }
    };

    // Document on load.
    $(function () {
        burgerMenu();
        clickMenu();
        buttonLinks();
        windowScroll();
        navigationSection();
        goToTop();
        insertMailTo();
        contactMessages();

        // Animate counters
        countersAnimate();
    });
}());