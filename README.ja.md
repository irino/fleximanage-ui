# Fleximanage UI

FlexiWANデバイスおよびトンネルを管理するための、プレミアムで多言語対応のダッシュボードです。React + TypeScript + Vite で構築されています。

## 特徴

- **リアルタイムモニタリング**: デバイスとトンネルのステータスカウンターを備えたダッシュボード。
- **インベントリ管理**: 豊富なデバイス一覧および詳細ビュー。
- **多言語対応**: 英語と日本語に最適化。
- **モダンなUI**: スレートカラーを基調としたレスポンシブなプレミアムデザイン。
- **開発者向け機能**: 開発者コンソールでのAPIリクエスト用 `curl` コマンド自動生成ログ。

## 前提条件

- Node.js (v18 以降)
- npm (v9 以降)
- 動作中の flexiManage バックエンド API へのアクセス

## インストール方法

1. リポジトリをクローンし、ディレクトリに移動します。
2. 依存関係のインストール:
   ```bash
   npm install
   ```
3. 環境変数の設定（`.env` ファイルを作成）:
   ```env
   VITE_API_BASE=https://your-fleximanage-api.com:3443/api
   VITE_APP_VERSION=1.0.0
   ```

## 開発とビルド

開発サーバーの起動:

```bash
npm run dev
```

本番用のビルド:

```bash
npm run build
```

## 技術スタック

- **フレームワーク**: React 19 + Vite
- **言語**: TypeScript
- **スタイリング**: Vanilla CSS (独自プレミアムコンポーネント)
- **状態・ルーティング**: React Router 7
- **国際化**: i18next
- **API クライアント**: openapi-fetch (型安全な OpenAPI クライアント)
- **アイコン**: Lucide React

## ライセンス

本プロジェクトは MIT ライセンス (予定) の下で公開されます。
