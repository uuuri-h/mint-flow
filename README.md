# Mint Flow

購買依頼を管理するWebアプリケーションです。

## URL

Frontend
https://mint-flow-seven.vercel.app

Backend
https://mint-flow.fastapicloud.dev

## 使用技術

### Frontend
- React
- Vite
- Axios
- React Router

### Backend
- FastAPI
- SQLAlchemy
- JWT認証

### Database
- PostgreSQL (Neon)

### Deployment
- Vercel
- FastAPI Cloud

## 主な機能

- ログイン認証（JWT）
- 購買依頼一覧
- 購買依頼登録
- 購買依頼更新
- 購買依頼削除
- マスタ参照
  - 商品
  - 顧客
  - サプライヤー
  - 部署
- 権限による画面制御

## システム構成

```
React (Vercel)
        │
        ▼
FastAPI (FastAPI Cloud)
        │
        ▼
PostgreSQL (Neon)
```

## セットアップ

### Backend

```bash
pip install -r requirements.txt
fastapi dev app/main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 環境変数

Backend

```
SECRET_KEY=
ALGORITHM=
SQLALCHEMY_DATABASE_URL=
```

Frontend

```
VITE_API_URL=
```

## 今後追加予定

- 承認ワークフロー
- 検索機能
- 注文書出力機能
- 見積機能
- 発注後の製品管理機能
- パフォーマンス改善

## 作者

Yuuri