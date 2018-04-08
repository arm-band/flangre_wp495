$(function() {
    //ページトップへ戻る
    pageTop();

    //ページ内スクロール
    pageScroll();

    //ripples of 495 years
    var $el = $("#ripples");
    $el.ripples({
		resolution: 495,
		dropRadius: 20,
		perturbance: 0.04,
		interactive: false
	});
    var timer = setInterval(function() {
		var x = Math.random() * $el.outerWidth();
		var y = Math.random() * $el.outerHeight();
		var resolution = 495;
		var dropRadius = 20;
		var strength = 0.04 + Math.random() * 0.05;
		$el.ripples("drop", x, y,  dropRadius, strength);
	}, 2000);
});

//ページトップへ戻る
function pageTop() {
    var returnPageTop = $(".returnPageTop");
	var startPos = 0;
	$(window).on("scroll", function(){
        var rptClass = "active";
        //スクロール距離が400pxより大きければページトップへ戻るボタンを表示
		var currentPos = $(this).scrollTop();
		if (currentPos > 400) {
            if(!returnPageTop.hasClass(rptClass)) {
                returnPageTop.addClass(rptClass);
            }
		} else {
            if(returnPageTop.hasClass(rptClass)) {
                returnPageTop.removeClass(rptClass);
            }
		}
	});

	//ページトップへスクロールして戻る
	returnPageTop.on("click", function () {
		$("body, html").animate({ scrollTop: 0 }, 1000, "easeInOutCirc");
		return false;
	});
}

//ページ内スクロール
function pageScroll() {
    if($("#indexPage").length) { //トップページの場合のみ動作
        var navbarHeight = parseInt($("#indexPage").attr("data-offset"));
        var $navbar = $("#navbar");
        $navbar.find("a").on("click", function() {
            var speed = 1000;
            var href = $(this).attr("href");
            var target = $(href == "#" || href == "" ? "html" : href);
            var position = target.offset().top - navbarHeight;
            $("body, html").animate({ scrollTop:position }, speed, "easeInOutCirc");
            $navbar.find(".navbar-toggle[data-target=\"#navbarMenu\"]").click(); //移動したらハンバーガーを折りたたむ
            return false;
        });
    }
}