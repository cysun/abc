$(function () {
    $("#slider3").responsiveSlides({
        auto: true,
        pager: true,
        nav: false,
        speed: 500,
        namespace: "callbacks",
        before: function () {
            $(".events").append("<li>before event fired.</li>");
        },
        after: function () {
            $(".events").append("<li>after event fired.</li>");
        }
    });
});
jQuery(document).ready(function ($) {
    $(".scroll").click(function (event) {
        event.preventDefault();
        $("html,body").animate({ scrollTop: $(this.hash).offset().top }, 1000);
    });
});
$(document).ready(function () {
    $().UItoTop({ easingType: "easeOutQuart" });
});
// $(function () {
//     SyntaxHighlighter.all();
// });
$(window).load(function () {
    $(".flexslider").flexslider({
        animation: "slide",
        start: function (slider) {
            $("body").removeClass("loading");
        }
    });
});