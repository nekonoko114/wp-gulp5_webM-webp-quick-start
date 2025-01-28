import { src, dest, watch, series, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import browserSync from 'browser-sync';
import imagemin from 'gulp-imagemin';

import uglify from 'gulp-uglify';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import sourcemaps from 'gulp-sourcemaps';
import newer from 'gulp-newer';

//画像の圧縮
import webp from 'gulp-webp';
//動画の圧縮 ffmpeg
import shell from 'gulp-shell';

// Sassコンパイラの設定
const compileSass = gulpSass(sass); 
const browserSyncInstance = browserSync.create();

const isProduction = process.env.NODE_ENV === 'production' || false;


// パス設定
const paths = {
  scss: 'src/assets/scss/**/*.scss',
  js: 'src/assets/js/**/*.js',
  images: 'src/assets/images/**/*.{jpg,png}',
  videos: 'src/assets/videos/**/*.{mp4,mov}',
  dist: {
    css: 'assets/css',
    js: 'assets/js',
    images: 'assets/images',
    videos: 'assets/videos',
  },
};

// Sassのコンパイルタスク
function sassTask() {
  return src(paths.scss)
    .pipe(!isProduction ? sourcemaps.init() : noop())
    .pipe(compileSass().on('error', compileSass.logError))
    .pipe(
      postcss([
        autoprefixer(),
        ...(isProduction ? [cssnano()] : []),
      ])
    )
    .pipe(groupCssMediaQueries())
    .pipe(!isProduction ? sourcemaps.write('.') : noop())
    .pipe(dest(paths.dist.css))
    .pipe(browserSyncInstance.stream());
}


// JavaScriptの圧縮タスク
function compressJs() {
  return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(isProduction ? uglify() : dest(paths.dist.js)) // 本番時のみ圧縮
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist.js))
    .pipe(browserSyncInstance.stream());
}

// 画像の最適化タスク
function optimizeImages() {
  return src(paths.images)
    .pipe(newer(paths.dist.images))
    .pipe(
      imagemin(
        isProduction
          ? [imagemin.mozjpeg({ quality: 75 }), imagemin.optipng({ optimizationLevel: 5 })]
          : []
      )
    )
    .on('error', console.error) // 簡易エラーハンドリング
    .pipe(dest(paths.dist.images));
}


function convertToWebP() {
  return src(paths.images)
    .pipe(
      webp({
        quality: 80,
        method: 6,
      })
    )
    .pipe(dest(paths.dist.images)); // WebP画像を出力
}

// 動画をWebM形式に変換するタスク
function convertToWebM() {
  const inputDir = 'src/assets/videos';
  const outputDir = paths.dist.videos;

  return shell.task([
    `mkdir -p ${outputDir}`, // 出力ディレクトリを作成
    `find ${inputDir} -type f \\( -name "*.mp4" -o -name "*.mov" \\) | while read file; do ` +
    `filename=$(basename "$file" | cut -d. -f1); ` +
    `ffmpeg -i "$file" -c:v libvpx -b:v 1M -c:a libvorbis "${outputDir}/$filename.webm" || echo "Error processing $file"; ` +
    `done`,
  ])();
}



// ブラウザ同期の初期化
function browserSyncInit(done) {
  browserSyncInstance.init({
    proxy: 'localhost:8888', // MAMPのURL
    port: 3000, // BrowserSync用のポート
    notify: true,
  });
  done();
}

// ファイル変更の監視タスク
function watchFiles() {
  watch(paths.scss, sassTask);
  watch(paths.js, compressJs);
  watch(paths.images, optimizeImages);
  watch(paths.videos, convertToWebM);
  watch('**/*.php').on('change', browserSyncInstance.reload);
  watch('**/*.html').on('change', browserSyncInstance.reload);
}

// デフォルトタスクのエクスポート
export default series(
  parallel(sassTask, compressJs, optimizeImages, convertToWebP, convertToWebM), 
  browserSyncInit,
  watchFiles
);