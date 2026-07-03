from sqlalchemy import select
from sqlalchemy.orm import Session
import app.models.customer as customer_model
import app.models.customer as customer_model
import app.schemas.customer as customer_schema

# =================================================================
# CRUD処理　：　顧客
# =================================================================

def get_customer_list(
    db: Session,
) -> customer_schema.CustomerListSchema | None:
    """
    顧客一覧を取得する関数
    :param db: DBセッション
    :return: 顧客一覧（CustomerListスキーマ）
    """
    result = db.execute(
        select(
            customer_model.Customer.customer_id,
            customer_model.Customer.customer_name,
        )
    )
    
    customer_list =[]
    customers = result.mappings().all()  
    
    for customer in customers:
        customer_list.append(
            customer_schema.CustomerSchema.model_validate(customer)
        )
    
    return customer_schema.CustomerListSchema(
        customers=customer_list
    )