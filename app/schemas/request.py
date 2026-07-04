from pydantic import BaseModel, Field
from datetime import date

# ===RequestSchema定義===

# ヘッダ登録・更新
class InsertAndUpdateRequestSchema(BaseModel):
    requester_id: int = Field(..., example=1)
    assigner_id: int = Field(..., example=2)
    customer_id: int = Field(..., example=1)
    request_comment: str | None = Field(default=None, example="至急対応をお願いします。")
    delivery_date: date = Field(..., example="2024-12-31")

#明細登録更新
class InsertAndUpdateRequestDetailSchema(BaseModel):
    item_id: int = Field(..., example= 1)
    quantity: int = Field(..., example=20)
    sales_price: float = Field(..., example=1000.00)
    cost_price: float = Field(..., example=800.00)
    supplier_id: int = Field(..., example=1)
    item_status: int = Field(..., example=1)

# ヘッダ返却用
class RequestSchema(InsertAndUpdateRequestSchema):
    request_id: int
    request_cd: str = Field(..., example="REQ26-0001")

# 明細返却用
class RequestDetailSchema(InsertAndUpdateRequestDetailSchema):
    request_id: int
    # request_cd: str = Field(..., example="REQ26-0001")
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
class RequestHeaderSchema(BaseModel):
    request_id: int
    request_cd: str
    request_comment: str
    header_status: int 
    delivery_date: date
    request_date: date

    requester_id: int
    requester_dept_id: int

    assigner_id:int
    assigner_dept_id:int

    customer_id: int
    customer_name: str

    sales_price_total: float
    cost_price_total: float
    item_count: int

## 一覧画面表示用
class RequestListResponseSchema(BaseModel):
    requests: list[RequestHeaderSchema]

# レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="依頼登録が正常に処理されました。") 
        
