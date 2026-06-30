from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)

from db import Base


# ===============================================================
# users テーブル用モデル
# ===============================================================

class User(Base):

    # テーブル名
    __tablename__ = "users"

    # ユーザーid : PK : 自動インクリメント
    user_id = Column(Integer, primary_key=True, autoincrement=True)

    # ユーザーコード : 未入力不可 : ユニーク
    user_cd = Column(String(10), nullable=False, unique=True)

    # ユーザー名 : 未入力不可
    user_name = Column(String(50), nullable=False)

    # 部署id : 未入力不可 : 外部キー
    department_id = Column(
        Integer,
        ForeignKey("department.department_id"),
        nullable=False
    )

    # 作成日時
    created_at = Column(
        DateTime,
        default=datetime.now,
        nullable=False
    )

    # 更新日時
    updated_at = Column(
        DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )