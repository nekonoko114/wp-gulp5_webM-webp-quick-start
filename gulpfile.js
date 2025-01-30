import { src, dest, watch, series, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import browserSync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import path from 'path'; 

import uglify from 'gulp-uglify';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import sourcemaps from 'gulp-sourcemaps';
import newer from 'gulp-newer';

//画像の変換
import webp from 'gulp-webp';
//動画の ffmpeg
import shell from 'gulp-shell';
import { execSync } from 'child_process';

// Sassコンパイラの設定
const compileSass = gulpSass(sass); 
const browserSyncInstance = browserSync.create();

const isProduction = process.env.NODE_ENV === 'production' || false;


// パス設定
const paths = {
  scss: 'src/assets/scss/**/*.scss',
  js: 'src/assets/js/**/*.js',
  images: 'src/assets/images/**/*.{jpg,png,gif}',
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
  return src(paths.images,{encoding: false})
    .pipe(newer(paths.dist.images))
    .pipe(
      imagemin(
        isProduction
          ? [imagemin.mozjpeg({ quality: 80 }), imagemin.optipng({ optimizationLevel: 5 })]
          : []
      )
    )
    .on('error', console.error) // 簡易エラーハンドリング
    .pipe(dest(paths.dist.images));
}


function convertToWebP() {
  return src('src/assets/images/**/*.{jpg,png}', { encoding: false }) // GIF を除外
    .pipe(newer(paths.dist.images))
    .pipe(
      webp({
        quality: 80,
        lossless: false,
        method: 6,
        alphaQuality: 80,
      })
    )
    .pipe(dest(paths.dist.images));
}


// GIF → WebP 変換タスク（フォルダ構造を維持）
function convertGifToWebP(done) {
  const sourceFiles = 'src/assets/images/**/*.gif';
  const baseSrcPath = path.resolve('src/assets/images'); // ✅ 基準ディレクトリ
  const baseDestPath = path.resolve('assets/images'); // ✅ 出力ディレクトリ

  return src(sourceFiles)
    .pipe(newer(baseDestPath)) // ✅ 既存の WebP があればスキップ
    .on('data', (file) => {
      const inputPath = file.path;
      const relativePath = path.relative(baseSrcPath, inputPath); // ✅ 相対パスを取得
      const outputPath = path.join(baseDestPath, relativePath.replace(/\.gif$/, '.webp')); // ✅ 元の構造を維持

      // 出力ディレクトリを作成
      const outputDir = path.dirname(outputPath);
      execSync(`mkdir -p "${outputDir}"`);

      try {
        console.log(`Converting: ${inputPath} → ${outputPath}`);
        execSync(`gif2webp -q 80 "${inputPath}" -o "${outputPath}"`, { stdio: 'inherit' });
        console.log(`Converted successfully: ${outputPath}`);
      } catch (error) {
        console.error(`Error converting ${inputPath}:`, error.message);
      }
    })
    .on('end', done);
}


// 動画をWebM形式に変換するタスク
function convertToWebM() {
  return src(paths.videos)
    .pipe(
      newer({
        dest: paths.dist.videos, // 出力先ディレクトリを指定
        ext: '.webm', // 出力ファイルの拡張子を指定
      })
    )
    .pipe(
      shell([
        `ffmpeg -i "<%= file.path %>" -c:v libvpx -b:v 1M -c:a libvorbis "${paths.dist.videos}/<%= file.stem %>.webm"`,
      ])
    );
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
  parallel(sassTask, compressJs, optimizeImages, convertToWebP, convertGifToWebP, convertToWebM), 
  browserSyncInit,
  watchFiles
);

