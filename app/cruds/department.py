from sqlalchemy import select
from sqlalchemy.orm import Session
import app.models.department as department_model
import app.models.department as department_model
import app.schemas.department as department_schema

# =================================================================
# CRUD処理　：　部署
# =================================================================

def get_dept_list(
    db: Session,
) -> department_schema.DepartmentListSchema | None:
    """
    部署一覧を取得する関数
    :param db: DBセッション
    :return: 部署一覧（DepartmentListスキーマ）
    """
    result = db.execute(
        select(
            department_model.Department.department_id,
            department_model.Department.department_name,
        )
    )
    dept_list = result.mappings().all()
    
    return department_schema.DepartmentListSchema(departments=dept_list)