import os # : ファイルバス操作のための標準モジュール
from sqlalchemy.ext.asyncio import (
    create_engine,  # : SQLAlchemyでエンジンを作成するための関数
)
from sqlalchemy.orm import (
    sessionmaker, # : セッションを作成するためのファクトリ関数
    DeclarativeBase # : ベースクラスを作成するための関数
)


# =================================================================
# DBアクセス
# =================================================================

# データベースURL　SQLALCHEMY_DATABASE_URLという名前の設定を探す
# : SQLALCHEMY_DATABASE_URL=postgresql://{ユーザ名}:{パスワード}@{ホスト名}:5432/{DB名}
SQLALCHEMY_DATABASE_URL = os.environ.get("SQLALCHEMY_DATABASE_URL")

#エンジンの作成
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# DBセッションのオブジェクトを生成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Baseクラスを元にモデルを定義
class Base(DeclarativeBase):
    pass