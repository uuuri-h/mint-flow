from sqlalchemy import select
from sqlalchemy.orm import Session
import app.models.item as item_model
import app.models.item as item_model
import app.schemas.item as item_schema

# =================================================================
# CRUD処理　：　アイテム
# =================================================================

def get_item_list(
    db: Session,
) -> item_schema.ItemListSchema | None:
    """
    アイテム一覧を取得する関数
    :param db: DBセッション
    :return: アイテム一覧（ItemListスキーマ）
    """
    result = db.execute(
        select(
            item_model.Item.item_id,
            item_model.Item.item_cd,
            item_model.Item.item_name,
            item_model.Item.supplier_id,
            item_model.Item.maker_name,
            item_model.Item.sales_price,
            item_model.Item.cost_price,
        )
    )
    
    item_list =[]
    items = result.mappings().all()  
    
    for item in items:
        item_list.append(
            item_schema.ItemSchema.model_validate(item)
        )

    return item_schema.ItemListSchema(
        items=item_list
    )