from pydantic import BaseModel, Field
from datetime import date
from app.constants import Action
# ===RequestSchema定義===

# ヘッダ登録
class CreateRequestHeaderSchema(BaseModel):
    assigner_id: int = Field(..., ge=1, example=2)
    customer_id: int = Field(..., ge=1, example=1)
    request_comment: str | None = Field(default=None, example="至急対応をお願いします。")
    delivery_date: date = Field(..., example="2024-12-31")
    
class RequestResultSchema(BaseModel):
    request_id: int
    message: str
    

class UpdateRequestHeaderSchema(BaseModel):
    request_id: int
    assigner_id: int
    customer_id: int
    request_comment: str | None
    delivery_date: date

class DeleteResultSchema(BaseModel):
    message: str

#明細登録更新
class InsertAndUpdateRequestDetailSchema(BaseModel):
    detail_id: int
    item_id: int = Field(..., ge=1, example= 1)
    quantity: int = Field(..., ge=1, example=20)
    sales_price: float = Field(..., example=1000.00)
    cost_price: float = Field(..., example=800.00)
    supplier_id: int | None = Field(default=None, example=1)
    item_status: int = Field(..., example=1)
    isChecked: bool = False

# ヘッダ返却用
class RequestSchema(CreateRequestHeaderSchema):
    request_id: int
    request_cd: str = Field(..., example="REQ26-0001")
    
class UpdateRequestSchema(BaseModel):
    header: UpdateRequestHeaderSchema
    details: list[InsertAndUpdateRequestDetailSchema]
    action: Action

# 明細返却用
class RequestDetailSchema(InsertAndUpdateRequestDetailSchema):
    request_id: int
    detail_id:int = Field(..., example=1)

#POST登録APIで受ける
class RequestCreateSchema(BaseModel):
    header: CreateRequestHeaderSchema
    details: list[InsertAndUpdateRequestDetailSchema]
    
#依頼情報を取得する際のスキーマ　（詳細画面の取得用で使う）
class RequestResponseSchema(BaseModel):   
    header: RequestSchema
    details: list[RequestDetailSchema]  
    
#一覧1行分
class RequestHeaderSchema(BaseModel):
    # 基本情報
    request_id: int
    request_cd: str
    header_status: int

    # 顧客
    customer_id: int
    customer_name: str

    # 日付
    request_date: date
    delivery_date: date

    # 依頼者
    requester_id: int
    requester_dept_id: int

    # 依頼先
    assigner_id: int
    assigner_dept_id: int

    # 金額・件数
    item_count: int
    sales_price_total: float
    cost_price_total: float

    # コメント
    request_comment: str

## 一覧画面表示用
class RequestListResponseSchema(BaseModel):
    requests: list[RequestHeaderSchema]

# レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="依頼登録が正常に処理されました。") 
        
