# ![フランちゃんウフフ](https://github.com/arm-band/flangre_wp495/blob/master/misc/img/image.jpg)

## What's this?

これは[WordPress4.9.5のリリース](https://ja.wordpress.org/2018/04/04/wordpress-4-9-5-security-and-maintenance-release/)を記念して作られたページです。

4.9.5ということなので、[495歳の吸血鬼の妹](http://sukimanet.net/profile/koumakyou/flandre.html)をモチーフにしました。

また、折角なので[同名のBootstrapテーマ](https://sairoutine.github.io/Frandre/)を使用させて頂きました。

## Technical Notes

WordPress4.9.5をサーバに用意して、設定を行い、記事やら固定ページやらを追加します。

それを、WP REST APIで取得します。

REST APIの取得にはVue.jsやaxiosを使いました。

そのため、WordPressはあくまでコンテンツデータを管理する器に専念してもらい、表示ページはhtml+css+js(Vue.js)という構成をしています。いわゆるHeadless CMS的な使い方ですね。

## Release Notes

- 2018/4/8 ver.0.8.0
    - やりたい機能はほぼ実装完了
- 2018/4/6 ver.0.1.0
    - まだまだ途中

## References

### WP REST API

- [WP REST API v2 Documentation](https://ja.wp-api.org/)

### Vue.js

- [《WordPress》2017年末にWP REST API で取得してVue\.jsで描画するまでのまとめ。 \- Qiita](https://qiita.com/uto-usui/items/4eb21aec704b888936d0)
- [Vue\.js \+ Wordpress REST API \- Qiita](https://qiita.com/nanonum/items/a335ba09fc2c2c4e3d5e)
- [Vue\.js と WordPress REST API を使って投稿データを取得 \- Qiita](https://qiita.com/kouichi_hoshi/items/39d346a400708422c031)
- [体で覚えるVue\.js \- ディレクティブ編 〜 JSおくのほそ道 \#023 \- Qiita](https://qiita.com/hosomichi/items/25041c1d46452de84aa6#v-html)