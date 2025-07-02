# 日記アプリ

React, TypeScript, Vite, Firebaseを使用して作成した、日記アプリケーションです。

## デモ

以下のリンクから、実際に動作するアプリケーションを確認できます。

[**https://riteli.github.io/diary-app**](https://riteli.github.io/diary-app)

## 主な機能

### ユーザー認証

* **Googleアカウントでのログイン**:
* **メールアドレスとパスワードでの認証**:
    * 新規ユーザー登録機能
    * 既存ユーザーのログイン機能

### プロフィール機能

* **ユーザー名の登録・編集**: ヘッダーから直接、表示される名前を登録・変更できます。
* **ゲスト表示**: メールアドレスで新規登録後、名前が未設定の場合は「ゲスト」として表示されます。

### 日記機能

* **CRUD操作**: 日記の作成（Create）、閲覧（Read）、更新（Update）、削除（Delete）が可能です。
* **リアルタイム同期**: Cloud Firestoreとの連携により、データの変更がリアルタイムで画面に反映されます。
* **日付ごとのグループ表示**: 日記は日付ごとに自動でグループ化され、見やすく表示されます。

## 使用技術

* **フロントエンド**: React, TypeScript, Vite
* **データベース**: Cloud Firestore
* **認証**: Firebase Authentication
* **ルーティング**: React Router
* **スタイリング**: SCSS (CSS Modules), clsx
* **デプロイ**: GitHub Pages, gh-pages
