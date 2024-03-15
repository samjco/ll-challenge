function oxygen_init_pro_menu() {
    jQuery('.oxy-pro-menu-container').each(function() {

        // dropdowns
        var menu = jQuery(this),
            animation = menu.data('oxy-pro-menu-dropdown-animation'),
            animationDuration = menu.data('oxy-pro-menu-dropdown-animation-duration');

        jQuery('.sub-menu', menu).attr('data-aos', animation);
        jQuery('.sub-menu', menu).attr('data-aos-duration', animationDuration * 1000);

        oxygen_offcanvas_menu_init(menu);
        jQuery(window).resize(function() {
            oxygen_offcanvas_menu_init(menu);
        });

        // let certain CSS rules know menu being initialized
        // "10" timeout is extra just in case, "0" would be enough
        setTimeout(function() {
            menu.addClass('oxy-pro-menu-init');
        }, 10);
    });
}

jQuery(document).ready(oxygen_init_pro_menu);
document.addEventListener('oxygen-ajax-element-loaded', oxygen_init_pro_menu, false);

let proMenuMouseDown = false;

jQuery(".oxygen-body")
    .on("mousedown", '.oxy-pro-menu-show-dropdown:not(.oxy-pro-menu-open-container) .menu-item-has-children', function(e) {
        proMenuMouseDown = true;
    })

    .on("mouseup", '.oxy-pro-menu-show-dropdown:not(.oxy-pro-menu-open-container) .menu-item-has-children', function(e) {
        proMenuMouseDown = false;
    })

    .on('mouseenter focusin', '.oxy-pro-menu-show-dropdown:not(.oxy-pro-menu-open-container) .menu-item-has-children', function(e) {
        if (proMenuMouseDown) return;

        var subMenu = jQuery(this).children('.sub-menu');
        subMenu.addClass('aos-animate oxy-pro-menu-dropdown-animating').removeClass('sub-menu-left');

        var duration = jQuery(this).parents('.oxy-pro-menu-container').data('oxy-pro-menu-dropdown-animation-duration');

        setTimeout(function() {
            subMenu.removeClass('oxy-pro-menu-dropdown-animating')
        }, duration * 1000);

        var offset = subMenu.offset(),
            width = subMenu.width(),
            docWidth = jQuery(window).width();

        if (offset.left + width > docWidth) {
            subMenu.addClass('sub-menu-left');
        }
    })

    .on('mouseleave focusout', '.oxy-pro-menu-show-dropdown .menu-item-has-children', function(e) {
        if (jQuery(this).is(':hover')) return;

        jQuery(this).children('.sub-menu').removeClass('aos-animate');

        var subMenu = jQuery(this).children('.sub-menu');
        //subMenu.addClass('oxy-pro-menu-dropdown-animating-out');

        var duration = jQuery(this).parents('.oxy-pro-menu-container').data('oxy-pro-menu-dropdown-animation-duration');
        setTimeout(function() {
            subMenu.removeClass('oxy-pro-menu-dropdown-animating-out')
        }, duration * 1000);
    })

    // open icon click
    .on('click', '.oxy-pro-menu-mobile-open-icon', function() {
        var menu = jQuery(this).parents('.oxy-pro-menu');
        // off canvas
        if (jQuery(this).hasClass('oxy-pro-menu-off-canvas-trigger')) {
            oxygen_offcanvas_menu_run(menu);
        }
        // regular
        else {
            menu.addClass('oxy-pro-menu-open');
            jQuery(this).siblings('.oxy-pro-menu-container').addClass('oxy-pro-menu-open-container');
            jQuery('body').addClass('oxy-nav-menu-prevent-overflow');
            jQuery('html').addClass('oxy-nav-menu-prevent-overflow');

            oxygen_pro_menu_set_static_width(menu);
        }
        // remove animation and collapse
        jQuery('.sub-menu', menu).attr('data-aos', '');
        jQuery('.oxy-pro-menu-dropdown-toggle .sub-menu', menu).slideUp(0);
    });

function oxygen_pro_menu_set_static_width(menu) {
    var menuItemWidth = jQuery(".oxy-pro-menu-list > .menu-item", menu).width();
    jQuery(".oxy-pro-menu-open-container > div:first-child, .oxy-pro-menu-off-canvas-container > div:first-child", menu).width(menuItemWidth);
}

function oxygen_pro_menu_unset_static_width(menu) {
    jQuery(".oxy-pro-menu-container > div:first-child", menu).width("");
}

// close icon click
jQuery('body').on('click', '.oxy-pro-menu-mobile-close-icon', function(e) {

    var menu = jQuery(this).parents('.oxy-pro-menu');

    menu.removeClass('oxy-pro-menu-open');
    jQuery(this).parents('.oxy-pro-menu-container').removeClass('oxy-pro-menu-open-container');
    jQuery('.oxy-nav-menu-prevent-overflow').removeClass('oxy-nav-menu-prevent-overflow');

    if (jQuery(this).parent('.oxy-pro-menu-container').hasClass('oxy-pro-menu-off-canvas-container')) {
        oxygen_offcanvas_menu_run(menu);
    }

    oxygen_pro_menu_unset_static_width(menu);
});

// dropdown toggle icon click
jQuery('body').on(
    'touchstart click',
    '.oxy-pro-menu-dropdown-links-toggle.oxy-pro-menu-off-canvas-container .menu-item-has-children > a > .oxy-pro-menu-dropdown-icon-click-area,' +
    '.oxy-pro-menu-dropdown-links-toggle.oxy-pro-menu-open-container .menu-item-has-children > a > .oxy-pro-menu-dropdown-icon-click-area',
    function(e) {
        e.preventDefault();

        // fix for iOS false triggering submenu clicks
        jQuery('.sub-menu').css('pointer-events', 'none');
        setTimeout(function() {
            jQuery('.sub-menu').css('pointer-events', 'initial');
        }, 500);

        // workaround to stop click event from triggering after touchstart
        if (window.oxygenProMenuIconTouched === true) {
            window.oxygenProMenuIconTouched = false;
            return;
        }
        if (e.type === 'touchstart') {
            window.oxygenProMenuIconTouched = true;
        }
        oxygen_pro_menu_toggle_dropdown(this);
    }
);

function oxygen_pro_menu_toggle_dropdown(trigger) {

    var duration = jQuery(trigger).parents('.oxy-pro-menu-container').data('oxy-pro-menu-dropdown-animation-duration');

    jQuery(trigger).closest('.menu-item-has-children').children('.sub-menu').slideToggle({
        start: function() {
            jQuery(this).css({
                display: "flex"
            })
        },
        duration: duration * 1000
    });
}

// fullscreen menu link click
var selector = '.oxy-pro-menu-open .menu-item a';
jQuery('body').on('click', selector, function(event) {

    if (jQuery(event.target).closest('.oxy-pro-menu-dropdown-icon-click-area').length > 0) {
        // toggle icon clicked, no need to hide the menu
        return;
    } else if ((jQuery(this).attr("href") === "#" || jQuery(this).closest(".oxy-pro-menu-container").data("entire-parent-toggles-dropdown")) &&
        jQuery(this).parent().hasClass('menu-item-has-children')) {
        // empty href don't lead anywhere, treat it as toggle trigger
        oxygen_pro_menu_toggle_dropdown(event.target);
        // keep anchor links behavior as is, and prevent regular links from page reload
        if (jQuery(this).attr("href").indexOf("#") !== 0) {
            return false;
        }
    }

    // hide the menu and follow the anchor
    if (jQuery(this).attr("href").indexOf("#") === 0) {
        jQuery('.oxy-pro-menu-open').removeClass('oxy-pro-menu-open');
        jQuery('.oxy-pro-menu-open-container').removeClass('oxy-pro-menu-open-container');
        jQuery('.oxy-nav-menu-prevent-overflow').removeClass('oxy-nav-menu-prevent-overflow');
    }

});

// off-canvas menu link click
var selector = '.oxy-pro-menu-off-canvas .menu-item a';
jQuery('body').on('click', selector, function(event) {
    if (jQuery(event.target).closest('.oxy-pro-menu-dropdown-icon-click-area').length > 0) {
        // toggle icon clicked, no need to trigger it 
        return;
    } else if ((jQuery(this).attr("href") === "#" || jQuery(this).closest(".oxy-pro-menu-container").data("entire-parent-toggles-dropdown")) &&
        jQuery(this).parent().hasClass('menu-item-has-children')) {
        // empty href don't lead anywhere, treat it as toggle trigger
        oxygen_pro_menu_toggle_dropdown(event.target);
        // keep anchor links behavior as is, and prevent regular links from page reload
        if (jQuery(this).attr("href").indexOf("#") !== 0) {
            return false;
        }
    }
});

// off canvas
function oxygen_offcanvas_menu_init(menu) {

    // only init off-canvas animation if trigger icon is visible i.e. mobile menu in action
    var offCanvasActive = jQuery(menu).siblings('.oxy-pro-menu-off-canvas-trigger').css('display');
    if (offCanvasActive !== 'none') {
        var animation = menu.data('oxy-pro-menu-off-canvas-animation');
        setTimeout(function() {
            menu.attr('data-aos', animation);
        }, 10);
    } else {
        // remove AOS
        menu.attr('data-aos', '');
    };
}

function oxygen_offcanvas_menu_run(menu) {

    var container = menu.find(".oxy-pro-menu-container");

    if (!container.attr('data-aos')) {
        // initialize animation
        setTimeout(function() {
            oxygen_offcanvas_menu_toggle(menu, container)
        }, 0);
    } else {
        oxygen_offcanvas_menu_toggle(menu, container);
    }
}

var oxygen_offcanvas_menu_toggle_in_progress = false;

function oxygen_offcanvas_menu_toggle(menu, container) {

    if (oxygen_offcanvas_menu_toggle_in_progress) {
        return;
    }

    container.toggleClass('aos-animate');

    if (container.hasClass('oxy-pro-menu-off-canvas-container')) {

        oxygen_offcanvas_menu_toggle_in_progress = true;

        var animation = container.data('oxy-pro-menu-off-canvas-animation'),
            timeout = container.data('aos-duration');

        if (!animation) {
            timeout = 0;
        }

        setTimeout(function() {
            container.removeClass('oxy-pro-menu-off-canvas-container')
            menu.removeClass('oxy-pro-menu-off-canvas');
            oxygen_offcanvas_menu_toggle_in_progress = false;
        }, timeout);
    } else {
        container.addClass('oxy-pro-menu-off-canvas-container');
        menu.addClass('oxy-pro-menu-off-canvas');
        oxygen_pro_menu_set_static_width(menu);
    }
}

function oxygenVSBInitTabs(element) {
    if (element !== undefined) {
        jQuery(element).find('.oxy-tabs-wrapper').addBack('.oxy-tabs-wrapper').each(function(index) {
            jQuery(this).children('.oxy-tabs-wrapper > div').eq(0).trigger('click');
        });
    } else {
        jQuery('.oxy-tabs-wrapper').each(function(index) {
            jQuery(this).children('.oxy-tabs-wrapper > div').eq(0).trigger('click');
        });
    }
}

jQuery(document).ready(function() {
    let event = new Event('oxygenVSBInitTabsJs');
    document.dispatchEvent(event);
});

document.addEventListener("oxygenVSBInitTabsJs", function() {
    oxygenVSBInitTabs();
}, false);

// handle clicks on tabs  
jQuery("body").on('click', '.oxy-tabs-wrapper > div', function(e) {

    /* a tab or an element that is a child of a tab has been clicked. prevent any default behavior */
    //e.preventDefault();

    /* which tab has been clicked? (e.target might be a child of the tab.) */
    clicked_tab = jQuery(e.target).closest('.oxy-tabs-wrapper > div');
    index = clicked_tab.index();

    /* which tabs-wrapper is this tab inside? */
    tabs_wrapper = jQuery(e.target).closest('.oxy-tabs-wrapper');

    /* what class dp we use to signify an active tob? */
    class_for_active_tab = tabs_wrapper.attr('data-oxy-tabs-active-tab-class');

    /* make all the other tabs in this tabs-wrapper inactive */
    jQuery(tabs_wrapper).children('.oxy-tabs-wrapper > div').removeClass(class_for_active_tab);

    /* make the clicked tab the active tab */
    jQuery(tabs_wrapper).children('.oxy-tabs-wrapper > div').eq(index).addClass(class_for_active_tab);

    /* which tabs-contents-wrapper is used by these tabs? */
    tabs_contents_wrapper_id = tabs_wrapper.attr('data-oxy-tabs-contents-wrapper');

    /* try to grab the correct content wrapper, in case of duplicated ID's */
    $content_wrapper = jQuery(tabs_wrapper).next();
    if ($content_wrapper.attr("id") != tabs_contents_wrapper_id) $content_wrapper = jQuery('#' + tabs_contents_wrapper_id);

    $content_tabs = $content_wrapper.children("div");

    /* hide all of the content */
    $content_tabs.addClass('oxy-tabs-contents-content-hidden');

    /* unhide the content corresponding to the active tab*/
    $content_tabs.eq(index).removeClass('oxy-tabs-contents-content-hidden');

});




jQuery(document).on('click', 'a[href*="#"]', function(t) {
    if (jQuery(t.target).closest('.wc-tabs').length > 0) {
        return
    }
    if (jQuery(this).is('[href="#"]') || jQuery(this).is('[href="#0"]') || jQuery(this).is('[href*="replytocom"]')) {
        return
    };
    if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
        var e = jQuery(this.hash);
        (e = e.length ? e : jQuery("[name=" + this.hash.slice(1) + "]")).length && (t.preventDefault(), jQuery("html, body").animate({
            scrollTop: e.offset().top - 0
        }, 1000))
    }
});



AOS.init({
    duration: 1700,
    easing: 'ease-out',
    offset: 40,
    type: 'fade',
    disable: window.innerWidth < 991,
})

jQuery('body').addClass('oxygen-aos-enabled');

function toggle(button) {
    var player = document.getElementById("music");
    player.classList.toggle("paused");
    if (button.innerHTML == "(Kill the Joy.)") {
        button.innerHTML = "(Crank it up!)";
    } else {
        button.innerHTML = "(Kill the Joy.)";
    }
}

