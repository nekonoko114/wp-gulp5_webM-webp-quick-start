# Gulp Workflow Project

このプロジェクトは、Web開発を効率化するためのGulpタスクランナーを使用したワークフローを提供します。開発環境と本番環境を切り替える柔軟な設定を含み、Sassコンパイル、画像最適化、動画変換などの機能を備えています。

---

## 🎯 特徴

- **Sassコンパイル**: `gulp-sass` を使用してSassをCSSに変換。自動でベンダープレフィックスを追加し、本番環境では圧縮。
- **JavaScript圧縮**: `gulp-uglify` を使用して本番環境でJSを圧縮。
- **画像最適化**: `gulp-imagemin` と `gulp-webp` を利用して、画像を最適化およびWebP形式に変換。
- **動画変換**: `ffmpeg` を使用して動画をWebM形式に変換。
- **ブラウザ同期**: `browser-sync` によるリアルタイムの自動リロード機能。
- **環境切り替え**: 環境変数 `NODE_ENV` に応じて開発モードと本番モードを切り替え可能。

---

## 📂 ディレクトリ構造

project/
 ├── src/ 
 │ ├── assets/ 
 │ │ ├── scss/ # Sassファイル 
 │ │ ├── js/ # JavaScriptファイル  
 │ │ ├── images/ # 画像ファイル (jpg, png) 
 │ │ ├── videos/ # 動画ファイル (mp4, mov) 
 ├── assets/ # Gulpの出力先 
 │├── css/ 
 │├── js/ 
 │├── images/ 
 │├── videos/ 
 ├── gulpfile.js # Gulp設定ファイル 
 ├── package.json # npm依存パッケージ 
 └── .gitignore # Git管理から除外するファイル

 ---

## 🚀 使用方法

### **1. 依存パッケージのインストール**

このプロジェクトをクローンした後、以下のコマンドを実行して依存パッケージをインストールします。

```bash
npm install

```

### **2. 開発モードでの実行 **
```
NODE_ENV=development npx gulp

```
### **2. 本番モードでのビルド **
```
NODE_ENV=production npx gulp
```

主な機能とタスク
Sassコンパイル
開発時はソースマップを生成。
本番時は圧縮（cssnano）してファイルサイズを最小化
JavaScript圧縮
開発時はそのまま出力。
本番時は圧縮（uglify）してファイルサイズを最小化。
画像最適化
gulp-imagemin を使用して画像を最適化。
WebP形式への変換をサポート。
動画変換
ffmpeg を利用して動画をWebM形式に変換。
ブラウザ同期
browser-sync によるリアルタイムのブラウザリロード。

## 🚀 必要なツール
- **Node.js**（最新のLTSバージョンを推奨）
- **Gulp CLI**
- **ffmpeg**（動画変換に必要）
- **ffmpeg** のインストール（macOSの場合）： ```brew install ffmpeg```
