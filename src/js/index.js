$(function() {
    //iPhone・iPad背景画像バグ対処
    mobileSafariRequiem();

    //ページトップへ戻る
    pageTop();

    //ページ内スクロール
    pageScroll();
});

//mobile Saffari対策
function mobileSafariRequiem() {
    var $eyeCatch = $(".eyecatch");
    var device = navigator.userAgent;
    if (device.indexOf("iPhone") !== -1 || device.indexOf("iPad") !== -1) {
        //iPhoneかiPadならば
        $eyeCatch.addClass("mobile_Safari");
    }
}

//ページトップへ戻る
function pageTop() {
    var returnPageTop = $(".returnPageTop");

	var startPos = 0;
	$(window).on("scroll", function(){
        //スクロール距離が400pxより大きければページトップへ戻るボタンを表示
		var currentPos = $(this).scrollTop();
		if (currentPos > 400) {
			returnPageTop.fadeIn();
		} else {
			returnPageTop.fadeOut();
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


var app = new Vue({
    el: "#spellcard",
    data: function() {
        posts: []
    },
    methods: {
    },
    created() {
        var url = "https://wp495.ewigleere.net/qed495/wp-json/";
        var url2 = "https://wp495.ewigleere.net/qed495/wp-json/wp/v2/posts/";
        (async () => {
          try {
            var res = await axios.get(url);
            this.posts = this.posts.concat(res.data);
            this.loading = false;
          } catch (error) {
            console.log(error);
            this.empty();
          }
        })();
    }
});