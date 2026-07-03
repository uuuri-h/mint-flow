from sqlalchemy import select
from sqlalchemy.orm import Session
import app.models.supplier as supplier_model
import app.models.supplier as supplier_model
import app.schemas.supplier as supplier_schema

# =================================================================
# CRUD処理　：　サプライヤー
# =================================================================

def get_supplier_list(
    db: Session,
) -> supplier_schema.SupplierListSchema | None:
    """
    サプライヤー一覧を取得する関数
    :param db: DBセッション
    :return: サプライヤー一覧（SupplierListスキーマ）
    """
    result = db.execute(
        select(
            supplier_model.Supplier.supplier_id,
            supplier_model.Supplier.supplier_name,
        )
    )
    
    supplier_list =[]
    suppliers = result.mappings().all()  
    
    for supplier in suppliers:
        supplier_list.append(
            supplier_schema.SupplierSchema.model_validate(supplier)
        )
    return supplier_schema.SupplierListSchema(
        suppliers=supplier_list
    )