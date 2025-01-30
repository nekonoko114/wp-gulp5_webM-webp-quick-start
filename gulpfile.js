import { src, dest, watch, series, parallel } from "gulp";
import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import browserSync from "browser-sync";
import imagemin from "gulp-imagemin";
import path from "path";

import uglify from "gulp-uglify";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import sourcemaps from "gulp-sourcemaps";
import newer from "gulp-newer";
import webp from "gulp-webp";
import shell from "gulp-shell";
import { spawnSync, execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";

// Sassコンパイラの設定
const compileSass = gulpSass(sass);
const browserSyncInstance = browserSync.create();

const isProduction = process.env.NODE_ENV === "production" || false;

// パス設定
const paths = {
  scss: "src/assets/scss/**/*.scss",
  js: "src/assets/js/**/*.js",
  images: "src/assets/images/**/*.{jpg,png,gif}",
  videos: "src/assets/videos/**/*.{mp4,mov}",
  dist: {
    css: "assets/css",
    js: "assets/js",
    images: "assets/images",
    videos: "assets/videos",
    avif: "assets/images/avif",
  },
};

// **🔹 Sassのコンパイル**
export function sassTask() {
  return src(paths.scss)
    .pipe(!isProduction ? sourcemaps.init() : dest(paths.dist.css))
    .pipe(compileSass().on("error", compileSass.logError))
    .pipe(postcss([autoprefixer(), ...(isProduction ? [cssnano()] : [])]))
    .pipe(groupCssMediaQueries())
    .pipe(!isProduction ? sourcemaps.write(".") : dest(paths.dist.css))
    .pipe(dest(paths.dist.css))
    .pipe(browserSyncInstance.stream());
}

// **🔹 JavaScript の圧縮**
export function compressJs() {
  return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(isProduction ? uglify() : dest(paths.dist.js))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.dist.js))
    .pipe(browserSyncInstance.stream());
}

// **🔹 画像の最適化**
export function optimizeImages() {
  return src(paths.images, { encoding: false })
    .pipe(newer(paths.dist.images))
    .pipe(
      imagemin(
        isProduction
          ? [
              imagemin.mozjpeg({ quality: 80 }),
              imagemin.optipng({ optimizationLevel: 5 }),
            ]
          : []
      )
    )
    .on("error", console.error)
    .pipe(dest(paths.dist.images));
}

// **🔹 WebP 変換**
export function convertToWebP() {
  return src(paths.images, { encoding: false })
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

export function convertGifToWebP(done) {
  const sourceFiles = "src/assets/images/**/*.gif";
  const baseSrcPath = path.resolve("src/assets/images");
  const baseDestPath = path.resolve("assets/images");

  src(sourceFiles)
    .pipe(newer(baseDestPath))
    .on("data", (file) => {
      const inputPath = file.path;
      const relativePath = path.relative(baseSrcPath, inputPath);
      const outputPath = path.join(
        baseDestPath,
        relativePath.replace(/\.gif$/, ".webp")
      );

      const outputDir = path.dirname(outputPath);
      execSync(`mkdir -p "${outputDir}"`);

      try {
        console.log(`Converting: ${inputPath} → ${outputPath}`);
        execSync(`gif2webp -q 80 "${inputPath}" -o "${outputPath}"`, {
          stdio: "inherit",
        });
        console.log(`Converted successfully: ${outputPath}`);
      } catch (error) {
        console.error(`Error converting ${inputPath}:`, error.message);
      }
    });

  done(); //
}

export function convertToAvif() {
  return src(paths.images, { encoding: false })
    .pipe(newer({ dest: paths.dist.images, ext: ".avif" }))
    .on("data", (file) => {
      const inputFilePath = file.path;
      const outputFilePath = path.join(
        paths.dist.images,
        path.basename(file.path, path.extname(file.path)) + ".avif"
      );

      try {
        console.log(`Converting: ${inputFilePath} → ${outputFilePath}`);
        const result = spawnSync(
          "magick",
          [inputFilePath, "-quality", "50", outputFilePath],
          { stdio: "inherit" }
        );

        if (result.error) {
          throw result.error;
        }
        console.log(`Converted successfully: ${outputFilePath}`);
      } catch (error) {
        console.error(`Error converting ${inputFilePath}:`, error.message);
      }
    });
}

// **🔹 動画を WebM へ変換**
export function convertToWebM(done) {
  // ✅ 出力フォルダが存在しなければ作成
  if (!existsSync(paths.dist.videos)) {
    mkdirSync(paths.dist.videos, { recursive: true });
    console.log(`Created directory: ${paths.dist.videos}`);
  }

  return src(paths.videos)
    .pipe(newer({ dest: paths.dist.videos, ext: ".webm" }))
    .on("data", (file) => {
      const inputFilePath = file.path;
      const outputFilePath = path.join(
        paths.dist.videos,
        path.basename(file.path, path.extname(file.path)) + ".webm"
      );

      try {
        console.log(`Converting: ${inputFilePath} → ${outputFilePath}`);
        const result = spawnSync(
          "ffmpeg",
          [
            "-i",
            inputFilePath,
            "-c:v",
            "libvpx",
            "-b:v",
            "1M",
            "-c:a",
            "libvorbis",
            outputFilePath,
          ],
          { stdio: "inherit" }
        );

        if (result.status !== 0) {
          throw new Error(`FFmpeg conversion failed for ${inputFilePath}`);
        }

        console.log(`Converted successfully: ${outputFilePath}`);
      } catch (error) {
        console.error(`Error converting ${inputFilePath}:`, error.message);
        done(error);
      }
    })
    .on("end", done);
}

// **🔹 ブラウザ同期の初期化**
export function browserSyncInit(done) {
  browserSyncInstance.init({
    proxy: "localhost:8888",
    port: 3000,
    notify: true,
  });
  done();
}

// **🔹 ファイル変更の監視**
export function watchFiles() {
  watch(paths.scss, sassTask);
  watch(paths.js, compressJs);
  watch(paths.images, optimizeImages);
  watch(paths.images, convertToAvif);
  watch(paths.videos, convertToWebM);
  watch("**/*.php").on("change", browserSyncInstance.reload);
  watch("**/*.html").on("change", browserSyncInstance.reload);
}

// **📌 デフォルトタスク**
export default series(
  parallel(
    sassTask,
    compressJs,
    optimizeImages,
    convertToWebP,
    convertToAvif,
    convertGifToWebP,
    convertToWebM
  ),
  browserSyncInit,
  watchFiles
);
