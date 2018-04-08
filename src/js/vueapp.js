const app = new Vue({
    el: "#wrapper",
    data: () => {
        return {
            siteInfo: [],
            posts: [],
            about: [],
            noContinue: [],
            position: 0
        }
    },
    ready: () => {
        var self = this;
        document.onscroll = (e) => {
            self.position = document.documentElement.scrollTop || document.body.scrollTop;
        }
    },
    methods: {
        returnPageTop: () => {
            $("body, html").animate({ scrollTop: 0 }, 1000, "easeInOutCirc");
        }
    },
    created() {
        const baseurl = "https://wp495.ewigleere.net/qed495/wp-json/";
        const urlPosts = "wp/v2/posts/";
        const urlAbout = "wp/v2/pages/6";
        const urlNoCon = "wp/v2/pages/43";
        (async () => {
          try {
            const res = await axios.get(baseurl);
            const resPosts = await axios.get(`${baseurl}${urlPosts}`);
            const resAbout = await axios.get(`${baseurl}${urlAbout}`);
            const resNoCon = await axios.get(`${baseurl}${urlNoCon}`);
            this.siteInfo = this.siteInfo.concat(res.data);
            this.posts = this.posts.concat(resPosts.data);
            this.about = this.about.concat(resAbout.data);
            this.noContinue = this.noContinue.concat(resNoCon.data);
          } catch (error) {
            console.log(error);
          }
        })();
    }
})