from pydantic import BaseModel, Field
from datetime import date

# ===OrderSchema定義===
# 登録・更新で使用するスキーマ    
class InsertAndUpdateOrderDetailSchema(BaseModel):
    item_partsnum: str = Field(..., example="sk_12345")
    quantity: int = Field(..., example=20)
    price: int = Field(..., example=1000)
    supplier_id: int = Field(..., example=0001)
    status: int = Field(..., example=1)
    

# リクエスト情報を表すスキーマ    
class OrderSchema(BaseModel):
    order_userid: int = Field(..., example=26011)
    order_id: str = Field(..., example="ORD26-0001")
    order_date: date = Field(..., example="2024-12-31")
    
class OrderDetailSchema(InsertAndUpdateOrderDetailSchema):
    order_id: str = Field(..., example="ORD26-0001")
    item_id: str = Field(..., example="ITM26-0001")
    item_num: int = Field(..., example=1)


#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="発注が正常に処理されました。") 
        
        
