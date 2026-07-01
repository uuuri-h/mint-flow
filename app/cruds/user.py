from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import schemas.user as user_schema
import models.user as user_model
from datetime import datetime

# =================================================================
# 非同期CRUD処理　：　ユーザー
# =================================================================


async def get_user_by_id(db: AsyncSession, user_id: int) -> user_schema.User:
    """
    ユーザーIDでユーザーを取得する非同期関数
    :param db: 非同期セッション
    :param user_id: ユーザーID
    :return: ユーザー情報（Userスキーマ）
    """
    result = await db.execute(select(user_model.User).where(user_model.User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        return None
    return user_schema.User.from_orm(user)