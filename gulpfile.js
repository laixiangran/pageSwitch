/**
 * Created by laixiangran on 2016/1/13.
 */

var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"), // css自动添加前缀׺
    minifycss = require("gulp-minify-css"), // 压缩css
    jshint = require("gulp-jshint"), // 校验js
    uglify = require("gulp-uglify"), // 压缩js
    rename = require("gulp-rename"), // 文件重命名
    concat = require("gulp-concat"), // 合并文件
    notify = require("gulp-notify"), // 任务消息提醒
    livereload = require("gulp-livereload"), // 自动刷新页面
    clean = require("gulp-clean"); // 清理文件

gulp.task("styles", function() {
    return gulp.src("src/css/*.css")
        .pipe(autoprefixer({
            browsers: ["last 2 version"],
            cascade: false
        }))
        .pipe(concat("pageSwitch.css"))
        .pipe(gulp.dest("dist/css"))
        .pipe(rename({
            prefix: "", // 前缀׺
            suffix: ".min" // 后缀
        }))
        .pipe(minifycss())
        .pipe(gulp.dest("dist/css"))
        .pipe(notify({
            message: "Styles task complete"
        }));
});

gulp.task("scripts", function() {
    return gulp.src("src/js/*.js")
        .pipe(jshint.reporter("default"))
        .pipe(gulp.dest("dist/js"))
        .pipe(rename({
            prefix: "",
            suffix: ".min"
        }))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"))
        .pipe(notify({
            message: "Scripts task complete"
        }));
});

gulp.task("clean", function() {
    return gulp.src("dist/", {read: false})
        .pipe(clean());
});

gulp.task("default", ["clean"], function() {
    gulp.start("styles", "scripts");
});

gulp.task("watch", function() {
    gulp.watch("src/css/*.css", ["styles"]);
    gulp.watch("src/js/*.js", ["scripts"]);

    livereload.listen();
    gulp.watch(["dist/**", "example/**"]).on("change", livereload.changed);
});