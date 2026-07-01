from sqlalchemy import select
from sqlalchemy.orm import Session
import models.user as user_model
import models.department as department_model
import schemas.user as user_schema

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
            user_model.User.user_id,
            user_model.User.user_cd,
            user_model.User.user_name,
            user_model.User.department_id,
            department_model.Department.department_name,
        )
        .join(
            department_model.Department,
            user_model.User.department_id == department_model.Department.department_id,
        )
        .where(user_model.User.user_id == user_id)
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
) -> user_schema.UserSchema | None:
    """
    ユーザーCDでユーザーを取得する関数
    :param db: DBセッション
    :param user_cd: ユーザーCD 
    :return: ユーザー情報（Userスキーマ）
    """
    result = db.execute(
        select(
            user_model.User.user_id,
            user_model.User.user_cd,
            user_model.User.user_name,
            user_model.User.department_id,
            department_model.Department.department_name,
        )
        .join(
            department_model.Department,
            user_model.User.department_id == department_model.Department.department_id,
        )
        .where(user_model.User.user_cd == user_cd)
        )
    # user = result.scalar_one_or_none()
    user = result.mappings().one_or_none()
    if user is None:
        return None
    
    # return user_schema.UserSchema.model_validate(user)
    return user_schema.UserSchema.model_validate(user)