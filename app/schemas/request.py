from pydantic import BaseModel, Field
from datetime import date

# ===RequestSchema定義===

# ヘッダ登録・更新
class InsertAndUpdateRequestSchema(BaseModel):
    request_userid: str = Field(..., example="26011")
    customer_id: str = Field(..., example="0001")
    customer_name: str
    deadline: date = Field(..., example="2024-12-31")
    priority: int = Field(..., example=1) 

#明細登録更新
class InsertAndUpdateRequestDetailSchema(BaseModel):
    item_partsnum: str = Field(..., example="sk_12345")
    quantity: int = Field(..., example=20)
    price: int = Field(..., example=1000)
    supplier_id: str = Field(..., example="0001")
    status: int = Field(..., example=1)
    

# ヘッダ返却用
class RequestSchema(InsertAndUpdateRequestSchema):
    request_id: str = Field(..., example="REQ26-0001")


# 明細返却用
class RequestDetailSchema(InsertAndUpdateRequestDetailSchema):
    request_id: str = Field(..., example="REQ26-0001")
    item_id: str = Field(..., example="ITM26-0001")
    item_name: str = Field(..., example="スカート")


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
    request_id: str
    requester_name: str
    requester_dept_name: str
    request_date: date
    item_count: int
    status: int 
    total_amount: int
    customer_id: str
    customer_name: str
    total_quantity: int 
    delivery_date: date
    request_detail: str

## 一覧画面表示用
class RequestListResponseSchema(BaseModel):
    requests: list[RequestListItemSchema]
    
    
# レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="依頼登録が正常に処理されました。") 
        
