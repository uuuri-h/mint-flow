from pydantic import BaseModel, Field
from datetime import date

# ===RequestSchema定義===

# ヘッダ登録・更新
class InsertAndUpdateRequestSchema(BaseModel):
    request_user_cd: str = Field(..., example="26011")
    customer_id: int = Field(..., example=1)
    # customer_name: str
    deadline: date = Field(..., example="2024-12-31")
    # priority: int = Field(..., example=1) 

#明細登録更新
class InsertAndUpdateRequestDetailSchema(BaseModel):
    item_id: int = Field(..., example= 1)
    quantity: int = Field(..., example=20)
    sales_price: int = Field(..., example=1000)
    cost_price: float = Field(..., example=1000)
    supplier_id: int = Field(..., example=1)
    item_status: int = Field(..., example=1)
    

# ヘッダ返却用
class RequestSchema(InsertAndUpdateRequestSchema):
    request_cd: str = Field(..., example="REQ26-0001")


# 明細返却用
class RequestDetailSchema(InsertAndUpdateRequestDetailSchema):
    request_id: int
    request_cd: str = Field(..., example="REQ26-0001")
    detail_id:int = Field(..., example=1)

#POST登録APIで受ける
class RequestCreateSchema(BaseModel):
    header: InsertAndUpdateRequestSchema
    details: list[InsertAndUpdateRequestDetailSchema]
    
#依頼情報を取得する際のスキーマ　（詳細画面の取得用で使う）
class RequestResponseSchema(BaseModel):   
    header: RequestSchema
    details: list[RequestDetailSchema]  
    
#一覧1行分
class RequestListItemSchema(BaseModel):
    request_id: int
    request_cd: str
    request_detail: str
    header_status: int 
    delivery_date: date
    request_date: date

    requester_id: int
    requester_dept_id: int

    assigner_id:int
    assigner_dept_id:int

    customer_id: int
    customer_name: str

    sales_price_total : int
    cost_price_total : int
    item_count: int

## 一覧画面表示用
class RequestListResponseSchema(BaseModel):
    requests: list[RequestListItemSchema]
    
    
# レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="依頼登録が正常に処理されました。") 
        
