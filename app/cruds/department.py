from sqlalchemy import select
from sqlalchemy.orm import Session
import app.models.user as user_model
import app.models.department as department_model
import app.schemas.department as department_schema

# =================================================================
# CRUD処理　：　部署
# =================================================================

def get_dept_list(
    db: Session,
) -> department_schema.DepartmentListSchema | None:
    
    
    result = db.execute(
        
    )
    