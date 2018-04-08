/**
 * gulp task
 *
 * @author    アルム＝バンド
 * @copyright Copyright (c) アルム＝バンド
 */

var gulp = require("gulp");
//全般
var plumber = require("gulp-plumber"); //待機
var notify = require("gulp-notify"); //標準出力
//sass
var sass = require("gulp-sass"); //sass
var autoprefixer = require("gulp-autoprefixer");
var json2sass = require("gulp-json-to-sass"); //jsonからsassファイルを生成
//img
var imagemin = require("gulp-imagemin"); //画像ロスレス圧縮
//js
var uglify = require("gulp-uglify"); //js圧縮
var concat = require("gulp-concat"); //ファイル結合
var rename = require("gulp-rename"); //ファイル名変更
//ejs
var ejs = require("gulp-ejs");
var data = require("gulp-data"); //gulp-ejs内でファイル名を参照できるようにする
//file operation
var fs = require("fs");
//reload
var connect = require("gulp-connect-php"); //proxy(phpファイル更新時リロード用)
var browserSync = require("browser-sync"); //ブラウザリロード
//styleguide
var frontnote = require("gulp-frontnote");

//path difinition
var dir = {
  assets: {
    jquery    : './node_modules/jquery/dist',
    easing    : './node_modules/jquery.easing',
    bootstrap : './node_modules/bootstrap-honoka/dist/js',
    ripples : './node_modules/jquery.ripples/dist'
  },
  src: {
    ejs       : './src/ejs',
    scss      : './src/scss',
    js        : './src/js',
    img       : './src/img',
    favicon   : './src/favicon'
  },
  data: {
    dir       : './src/data',
    variables : '/variables.json',
    news      : '/news.json',
    commonvar : '/commonvar.json'
  },
  dist: {
    html      : './dist',
    news      : './dist/news',
    css       : './dist/css',
    js        : './dist/js',
    img       : './dist/img',
    favicon   : './dist/favicon'
  },
  sg: {
    html      : './sg/dist',
    md        : './readme.md',
    css       : '../../dist/css',
    js        : '../../dist/js',
    img       : '../../dist/img',
    favicon   : '../../dist/favicon',
    canceller : '../src/css',
    template  : './sg/src/ejs'
  }
};
//jsonファイル取得
//ejs内で使用するパラメータ
var getVariables = function() {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.variables, { encoding: "UTF-8" }).replace(/\r|\n|\t/g, ""));
}
//ejs, js, scssにまたがって使用するパラメータ
var getCommonVar = function() {
    return JSON.parse(fs.readFileSync(dir.data.dir + dir.data.commonvar, { encoding: "UTF-8" }).replace(/\r|\n|\t/g, ""));
}

//scssコンパイルタスク
gulp.task("sass", () => {
	return gulp.src(dir.src.scss + "/**/*.scss")
		.pipe(plumber())
        .pipe(json2sass({
            jsonPath: dir.data.dir + dir.data.commonvar,
            scssPath: dir.src.scss + "/util/_var.scss"
        }))
		.pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
            cascade: false
        }))
		.pipe(gulp.dest(dir.dist.css));
});
//watchタスク(Sassファイル変更時に実行するタスク)
gulp.task("sass-watch", () => {
	gulp.watch(dir.src.scss + "/**/*.scss", ["sass"]);
});

//画像圧縮
gulp.task("imagemin", () => {
	gulp.src(dir.src.img + "/**/*.+(jpg|jpeg|png|gif|svg)")
		.pipe(imagemin())
		.pipe(gulp.dest(dir.dist.img));
});

//js圧縮&結合&リネーム
gulp.task("js.concat", () => {
	return gulp.src([dir.assets.jquery + "/jquery.min.js", dir.assets.bootstrap + "/bootstrap.min.js", dir.assets.easing + "/jquery.easing.js", dir.assets.ripples + "/jquery.ripples-min.js"])
		.pipe(plumber())
		.pipe(concat("lib.js"))
		.pipe(gulp.dest(dir.src.js + "/concat/")); //srcとdistを別ディレクトリにしないと、自動でタスクが走る度にconcatしたものも雪だるま式に追加されていく
});
gulp.task("js.uglify", ["js.concat"], () => { //第2引数に先に実行して欲しい js.concat を指定する
	return gulp.src(dir.src.js + "/concat/lib.js")
		.pipe(plumber())
		.pipe(uglify({output: {comments: "some"}}))
		.pipe(rename(dir.dist.js + "/lib.min.js"))  // 出力するファイル名を変更
		.pipe(gulp.dest("./"));
});
gulp.task("js.uglify.progress", () => {
	return gulp.src(dir.src.js + "/progress.js")
		.pipe(plumber())
		.pipe(uglify({output: {comments: "some"}}))
		.pipe(rename(dir.dist.js + "/progress.min.js"))
		.pipe(gulp.dest("./"));
});
gulp.task("js.uglify.app", () => {
	return gulp.src(dir.src.js + "/index.js")
		.pipe(plumber())
		.pipe(uglify({output: {comments: "some"}}))
		.pipe(rename(dir.dist.js + "/app.min.js"))
		.pipe(gulp.dest("./"));
});
gulp.task("js.vueapp", () => {
	return gulp.src(dir.src.js + "/vueapp.js")
		.pipe(plumber())
		.pipe(rename(dir.dist.js + "/vueapp.js"))
		.pipe(gulp.dest("./"));
});
//上記をまとめておく
gulp.task("js", ["js.concat", "js.uglify", "js.uglify.progress", "js.uglify.app", "js.vueapp"]);

//ejs
gulp.task("ejs", () => {
    var variables = getVariables();
    var commonVar = getCommonVar();
    gulp.src(
        [dir.src.ejs + "/**/*.ejs", "!" + dir.src.ejs + "/**/_*.ejs"] //_*.ejs(パーツ)はhtmlにしない
    )
    .pipe(plumber())
    .pipe(data(function(file) {
        return { "filename": file.path }
    }))
    .pipe(ejs({ variables, commonVar }))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(dir.dist.html));
});

//favicon
gulp.task("favicon", () => {
    gulp.src(
        [dir.src.favicon + "/**/*"]
    )
    .pipe(plumber())
    .pipe(gulp.dest(dir.dist.favicon));
});

//proxy経由
gulp.task("connect-sync", () => {
/*	connect.server({ //php使うときはこっち
		port: 8001,
		base: dir.dist.html,
		bin: "D:/xampp/php/php.exe",
		ini: "D:/xampp/php/php.ini"
	}, function (){
		browserSync({
			proxy: "localhost:8001",
            open: 'external'
		});
	});*/
    browserSync({
        server: {
            baseDir: dir.dist.html
        },
        open: 'external'
    });
});

//styleguide(FrontNote)
gulp.task("styleguide", () => {
    gulp.src(dir.src.scss + "/**/*.scss") // 監視対象のファイルを指定
        .pipe(frontnote({
            out: dir.sg.html,
            title: getVariables().commons.sitename,
            css: [dir.sg.css + "/contents.css", dir.sg.css + "/index.css", dir.sg.canceller + "/fncanceller.css", "https://fonts.googleapis.com/css?family=Dancing+Script", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"],
            script: [dir.sg.js + "/lib.min.js", dir.sg.js + "/app.min.js"],
            template: dir.sg.template + "/index.ejs",
            overview: dir.sg.md,
            params: { "commonVar": getCommonVar() }
        }));
});

//gulpのデフォルトタスクで諸々を動かす
gulp.task("default", ["sass", "sass-watch", "ejs", "js", "imagemin", "favicon", "connect-sync", "styleguide"], () => {
	gulp.watch(dir.src.ejs + "/**/*.ejs", ["ejs"]);
//    gulp.watch(dir.dist.html + "/**/*.php",function () { browserSync.reload(); }); //php使うときはこっち
    gulp.watch(dir.src.scss + "/**/*.scss", ["sass", "styleguide"]);
	gulp.watch(dir.src.img + "/**/*.+(jpg|jpeg|png|gif|svg)", ["imagemin"]);
	gulp.watch(dir.src.js + "/**/*.js", ["js"]);
    gulp.watch(dir.data.dir + "/**/*.json", ["ejs", "sass", "js", "styleguide"]);

    gulp.watch([dir.dist.html + "/**/*.+(html|php)", dir.dist.css + "/**/*.css", dir.dist.img + "/**/*.+(jpg|jpeg|png|gif|svg)", dir.dist.js + "/**/*.js"]).on("change", () => { browserSync.reload(); });
});