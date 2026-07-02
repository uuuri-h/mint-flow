from sqlalchemy import select
from sqlalchemy.orm import Session
import app.models.user as user_model
import app.models.department as department_model
import app.schemas.user as user_schema

# =================================================================
# CRUD処理　：　ユーザー
# =================================================================


def get_user_by_id(
    db: Session, 
    user_id: int
) -> user_schema.UserSchema | None:
    """
    ユーザーIDでユーザーを取得する関数
    :param db: DBセッション
    :param user_id: ユーザーID
    :return: ユーザー情報（Userスキーマ）
    """
    result = db.execute(
        select(
            user_model.Users.user_id,
            user_model.Users.user_cd,
            user_model.Users.user_name,
            user_model.Users.department_id,
            department_model.Department.department_name,
        )
        .join(
            department_model.Department,
            user_model.Users.department_id == department_model.Department.department_id,
        )
        .where(user_model.Users.user_id == user_id)
        )
    # user = result.scalar_one_or_none()
    user = result.mappings().one_or_none()
    if user is None:
        return None
    
    # return user_schema.UserSchema.model_validate(user)
    return user_schema.UserSchema.model_validate(user)

def get_user_by_cd(
    db: Session, 
    user_cd: str
) -> user_schema.LoginSchema | None:
    """
    ユーザーCDでユーザーを取得する関数
    :param db: DBセッション
    :param user_cd: ユーザーCD 
    :return: ユーザー情報（Userスキーマ）
    """
    result = db.execute(
        select(
            user_model.Users.user_id,
            user_model.Users.user_cd,
            user_model.Users.user_name,
            user_model.Users.department_id,
            user_model.Users.password,
            department_model.Department.department_name,
        )
        .join(
            department_model.Department,
            user_model.Users.department_id == department_model.Department.department_id,
        )
        .where(user_model.Users.user_cd == user_cd)
        )
    # user = result.scalar_one_or_none()
    user = result.mappings().one_or_none()
    print(f"⭐️ユーザー情報: {user}") # デバッグ用にユーザー情報を出力
    if user is None:
        return None

    return user