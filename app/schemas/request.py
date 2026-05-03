from pydantic import BaseModel, Field
from datetime import date

# ===RequestSchema定義===

# 登録・更新で使用するスキーマ
class InsertAndUpdateRequestSchema(BaseModel):
    request_userid: str = Field(..., example="26011")
    client_name: str = Field(..., example="ABC株式会社")
    deadline: date = Field(..., example="2024-12-31")
    priority: int = Field(..., example=1)
    
class InsertAndUpdateRequestDetailSchema(BaseModel):
    item_partsnum: str = Field(..., example="sk_12345")
    quantity: int = Field(..., example=20)
    price: int = Field(..., example=1000)
    supplier_id: str = Field(..., example="0001")
    status: int = Field(..., example=1)
    

# リクエスト情報を表すスキーマ    
class RequestSchema(InsertAndUpdateRequestSchema):
    request_id: str = Field(..., example="REQ26-0001")
    
class RequestDetailSchema(InsertAndUpdateRequestDetailSchema):
    request_id: str = Field(..., example="REQ26-0001")
    item_id: str = Field(..., example="ITM26-0001")
    item_num: int = Field(..., example=1)


#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="依頼登録が正常に処理されました。") 
        
        

#ヘッダと詳細をひとまとめにしたスキーマ
class RequestCreateSchema(BaseModel):
    header: InsertAndUpdateRequestSchema
    details: list[InsertAndUpdateRequestDetailSchema]