from pydantic import BaseModel, Field
from datetime import date

# ===OrderSchema定義===
# 登録・更新で使用するスキーマ    

class InsertAndUpdateOrderSchema(BaseModel):
    order_user_cd: str = Field(..., example=26011)
    order_date: date = Field(..., example="2024-12-31")

class InsertAndUpdateOrderDetailSchema(BaseModel):
    item_partsnum: str = Field(..., example="sk_12345")
    quantity: int = Field(..., example=20)
    sales_price: int = Field(..., example=1000)
    supplier_id: int = Field(..., example=1)
    customer_id: int = Field(..., example=1) 
    customer_name: str
    status: int = Field(..., example=1)
    

# リクエスト情報を表すスキーマ    
class OrderSchema(BaseModel):
    order_user_cd: str = Field(..., example=26011)
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
        
        
#ヘッダと詳細をひとまとめにしたスキーマ
class OrderCreateSchema(BaseModel):
    header: InsertAndUpdateOrderSchema
    details: list[InsertAndUpdateOrderDetailSchema]
    
#発注情報を取得する際のスキーマ　（詳細画面の取得用で使う）
class OrderResponseSchema(BaseModel):   
    header: OrderSchema
    details: list[OrderDetailSchema]  
    
#発注一覧を取得する際のスキーマ　（一覧画面の取得用で使う）
class OrderListItemSchema(BaseModel):
    order_id: str
    order_date: date
    status: int
    total_amount: int
    customer_id: int
    customer_name: str
    total_quantity: int
    delivery_date: date

#発注一覧のレスポンススキーマ
class OrderListResponseSchema(BaseModel):
    orders: list[OrderListItemSchema]