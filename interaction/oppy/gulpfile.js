var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var spritesmith = require('gulp.spritesmith-multi');
var merge = require('merge-stream');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var del = require('del');
var watch = require('gulp-watch');
var wait = require('gulp-wait');
var concatCss = require('gulp-concat-css');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var inquirer = require('inquirer');
var util = require('util');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var ejs = require("gulp-ejs");
var htmlhint = require('gulp-htmlhint');
var fileinclude = require('gulp-file-include');
var sassInlineSvg = require("gulp-sass-inline-svg");
var base64Inline = require('gulp-base64-inline');
var svgMin = require('gulp-svgmin');

var bases = {
    src: 'src/',
    dest: 'dist/'
};
var paths = {
    root: bases.src + '*.*',
    js: bases.src + 'js/**/*.js',
    css: bases.src + 'css/**/*.*',
    cssLibs: bases.src + 'css/libs/**/*.css',
    scss: bases.src + 'css/scss/**/*.scss',
    html: bases.src + '**/*.html',
    images: bases.src + 'img/**/*.*',
    svgimages: bases.src + 'img/svg/*.svg',
    sprites: bases.src + 'img/sprites/**/*.*',
    fonts: bases.src + 'font/**/*.*'
};

var errorHandler = function (error) {
    console.error(error.message);
    this.emit('end');
};
var plumberOption = {
    errorHandler: errorHandler
};

gulp.task('setting', function () {
    var questions = [{
            type: 'input',
            name: 'project_name',
            message: '프로젝트 명:'
        },
        {
            type: 'input',
            name: 'author',
            message: '담당자 (여러명일 경우 콤마(,)로 구분):'
        },
        {
            type: 'input',
            name: 'organization',
            message: '담당 조직명:'
        }
    ];
    inquirer.prompt(questions).then(function (answers) {
        var answerData = JSON.stringify(answers);
        fs.writeFile('templates/projectInfo.json', answerData, function (err) {
            if (err) throw err;
            console.log('프로젝트 정보 입력이 완료 되었습니다.');
        });
    });
});

gulp.task('root-files-deploy', ['clean-root-resources'], function () {
    return gulp.src([paths.root, '!src/*.html'])
        .pipe(gulp.dest(bases.dest))
});

gulp.task('font-files-deploy', ['clean-font-resources'], function () {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(bases.dest + 'font'))
});

gulp.task('html-deploy', ['clean-html-folders'], function () {
    return gulp.src([paths.html, '!src/views/include/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(plumber(plumberOption))
        .pipe(htmlhint('templates/htmlhint.json'))
        .pipe(htmlhint.reporter())
        .pipe(plumber.stop())
        .pipe(gulp.dest(bases.dest));
});

gulp.task('html', ['html-deploy'], function () {
    var dPath = "dist/views",
        projectObj = {},
        docFiles = [],
        normalFiles = [];

    var projectJson = fs.readFileSync('templates/projectInfo.json', 'utf-8'),
        projectInfo = {};
    projectInfo.projectName = JSON.parse(projectJson).project_name;
    projectInfo.projectAuthor = JSON.parse(projectJson).author;
    projectInfo.projectOrg = JSON.parse(projectJson).organization;

    fs.readdir(dPath, function (err, files) {
        if (err) {
            throw err;
        }
        files.map(function (file) {
            return path.join(dPath, file);
        }).filter(function (file) {
            return fs.statSync(file).isFile();
        }).forEach(function (file) {
            var stats = fs.statSync(file);

            var extname = path.extname(file),
                basename = path.basename(file);
            if (extname == '.html') {

                if (basename.match(/@/)) {
                    var dfileData = {};

                    var fileInnerText = fs.readFileSync(file, 'utf8');
                    $ = cheerio.load(fileInnerText);
                    var wholeTitle = $('title').text(),
                        splitTitle = wholeTitle.split(' : ');

                    dfileData.title = splitTitle[0];
                    dfileData.name = path.basename(file);
                    dfileData.category = String(dfileData.name).substring(0, 2);
                    dfileData.categoryText = splitTitle[1];
                    dfileData.mdate = new Date(util.inspect(stats.mtime));
                    docFiles.push(dfileData);
                } else {
                    var nfileData = {};

                    var fileInnerText = fs.readFileSync(file, 'utf8');
                    $ = cheerio.load(fileInnerText);
                    var wholeTitle = $('title').text(),
                        splitTitle = wholeTitle.split(' : ');

                    nfileData.title = splitTitle[0];
                    nfileData.name = path.basename(file);
                    nfileData.category = String(nfileData.name).substring(0, 2);
                    nfileData.categoryText = splitTitle[1];
                    nfileData.mdate = new Date(util.inspect(stats.mtime));
                    normalFiles.push(nfileData);
                }
            }
        });
        projectObj = {
            project: projectInfo,
            dfiles: docFiles,
            nfiles: normalFiles
        };

        projectObjStr = JSON.stringify(projectObj);
        projectObjJson = JSON.parse(projectObjStr);

        gulp.src("templates/@index.html")
            .pipe(ejs(projectObjJson))
            .pipe(gulp.dest("dist/"))
            .pipe(browserSync.reload({
                stream: true
            }));
    });
});

gulp.task('js-deploy', ['clean-js-folders'], function () {
    return gulp.src(bases.src + 'js/**/*.*')
        .pipe(wait(500))
        .pipe(gulp.dest(bases.dest + 'js'))
});

gulp.task('css-libs-deploy', function () {
    return gulp.src(bases.src + 'css/libs/**/*.*')
        .pipe(wait(500))
        .pipe(gulp.dest(bases.dest + 'css/libs'))
});

gulp.task('images-deploy', ['clean-img-folders'], function () {
    return gulp.src(paths.images)
        .pipe(buffer())
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(bases.dest + 'img'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('inline-svg', function () {
    return gulp.src(paths.svgimages)
        .pipe(buffer())
        .pipe(svgMin())
        .pipe(sassInlineSvg({
            destDir: 'src/css/scss/svg'
        }))
});

gulp.task('sprites', function () {
    var opts = {
        spritesmith: function (options, sprite, icons) {
            options.imgPath = `../img/sprites/${options.imgName}`;
            options.cssName = `_${sprite}.scss`;
            options.cssTemplate = `./src/css/sprites-data/spritesmith-mixins.handlebars`
            options.cssSpritesheetName = sprite;
            options.padding = 4;
            options.algorithm = 'binary-tree';
            return options;
        }
    };
    var spriteData = gulp.src('./src/img/sprites/**/*.png').pipe(spritesmith(opts)).on('error', function (err) {
        console.log(err);
    });

    var imgStream = spriteData.img.pipe(gulp.dest('./dist/img/sprites'));
    var cssStream = spriteData.css.pipe(gulp.dest('./src/css/sprites-data'));

    return merge(imgStream, cssStream);
});

gulp.task('sass', function () {
    return gulp.src([paths.scss, '!src/css/scss/sprites/*.*'])
        .pipe(plumber(plumberOption))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false
        }))
        .pipe(base64Inline())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(bases.dest + 'css'));
});

gulp.task('css-libs-concat', function () {
    return gulp.src([bases.dest + 'css/libs/**/*.css'])
        .pipe(plumber(plumberOption))
        .pipe(concatCss("libs.css"))
        .pipe(gulp.dest(bases.dest + 'css/libs'));
});

gulp.task('minify-css', ['css-libs-concat'], function () {
    gulp.src([bases.dest + 'css/libs/*.css', '!dist/css/libs/*.min.css', bases.dest + 'css/sprites/sprites.css', bases.dest + 'css/*.css', '!dist/css/*.min.css'])
        .pipe(plumber(plumberOption))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(bases.dest + 'css'));
    browserSync.reload();
});

gulp.task('minify-js', ['js-deploy'], function () {
    return gulp.src([paths.js, '!src/js/libs/**/*.*'])
        .pipe(plumber(plumberOption))
        .pipe(concat('oppy.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(bases.dest + 'js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('generate-sass-sprites', function () {
    runSequence('sprites', 'sass', 'minify-css', () => {
        console.log('\x1b[32m%s\x1b[0m', '[--:--:--] Generate SCSS & image sprite complete.')
    });
});

gulp.task('watch-images', function () {
    runSequence('images-deploy', 'inline-svg', 'css-libs-deploy', 'clean-libs-folder', () => {
        console.log('\x1b[32m%s\x1b[0m', '[--:--:--] images deploy complete.')
    });
});

gulp.task('initialize', function () {
    runSequence('clean-dist-folders', 'images-deploy', 'inline-svg', 'css-libs-deploy', 'generate-sass-sprites', 'minify-js', 'root-files-deploy', 'font-files-deploy', 'clean-libs-folder', 'html', 'server', 'watch', () => {
        console.log('\x1b[32m%s\x1b[0m', '[--:--:--] initializing complete.')
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.js, ['minify-js']);
    gulp.watch(paths.scss, ['generate-sass-sprites']);
    gulp.watch(paths.images, ['watch-images']);
});

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: bases.dest
        },
        reloadDelay: 250,
        port: 3030,
        notify: false
    });
});

gulp.task('default', ['initialize']);

gulp.task('clean-root-resources', function () {
    return del([bases.dest + '*.*', '!dist/*.html']);
});

gulp.task('clean-dist-folders', function () {
    return del(bases.dest + '*.*');
});

gulp.task('clean-html-folders', function () {
    return del(bases.dest + 'views');
});

gulp.task('clean-css-folders', function () {
    return del(bases.dest + 'css');
});

gulp.task('clean-img-folders', function () {
    return del(bases.dest + 'img');
});

gulp.task('clean-js-folders', function () {
    return del(bases.dest + 'js');
});

gulp.task('clean-font-resources', function () {
    return del(bases.dest + 'font');
});

gulp.task('clean-libs-folder', function () {
    return del(bases.dest + 'css/libs');
});