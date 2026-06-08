from pydantic import BaseModel, Field
from typing import List

# 顧客情報を表すスキーマ(1件)
class CustomerSchema(BaseModel):
    customer_cd: int = Field(..., example=1)
    customer_name: str = Field(..., example="チョコミント株式会社")
    

# 顧客情報を表すスキーマ(複数)
class CustomerListSchema(BaseModel):
    customers: List[CustomerSchema] #CustomerSchema が複数入ったリスト

#レスポンスで使用するスキーマ
class ResponseSchema(BaseModel):
    message: str = Field(..., 
                    description="API操作の結果を説明するメッセージ",
                    example="発注が正常に処理されました。") 
    